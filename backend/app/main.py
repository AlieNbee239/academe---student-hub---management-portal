import hashlib
import hmac
import os
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from .database import Base, engine, get_db
from .models import RegistrationCode, User

load_dotenv(Path(__file__).resolve().parents[1] / '.env')
Base.metadata.create_all(bind=engine)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
ALLOWED_DOMAIN = os.getenv("ALLOWED_EMAIL_DOMAIN", "iitp.ac.in").lower()
OTP_TTL_MINUTES = int(os.getenv("OTP_TTL_MINUTES", "10"))
PASSWORD_ITERATIONS = 600_000

app = FastAPI(title="Academe API", version="2.0.0")
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET", "development-secret-change-before-deploy"),
    https_only=os.getenv("APP_ENV", "development") == "production",
    same_site="lax",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class RegistrationRequest(BaseModel):
    email: EmailStr
    display_name: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=10, max_length=128)


class VerifyRegistrationRequest(BaseModel):
    email: EmailStr
    code: str = Field(pattern=r"^\d{6}$")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class CreateAdminRequest(BaseModel):
    email: EmailStr
    display_name: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=10, max_length=128)


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def normalize_email(email: str) -> str:
    return email.strip().lower()


def check_iitp_email(email: str) -> str:
    normalized = normalize_email(email)
    if not normalized.endswith(f"@{ALLOWED_DOMAIN}"):
        raise HTTPException(status_code=403, detail=f"Only @{ALLOWED_DOMAIN} email addresses can create an account")
    return normalized


def password_hash(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), PASSWORD_ITERATIONS).hex()
    return f"pbkdf2_sha256${PASSWORD_ITERATIONS}${salt}${digest}"


def password_matches(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations, salt, saved_digest = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), int(iterations)).hex()
        return hmac.compare_digest(digest, saved_digest)
    except ValueError:
        return False


def send_otp(email: str, code: str) -> None:
    host = os.getenv("SMTP_HOST", "")
    username = os.getenv("SMTP_USERNAME", "")
    password = os.getenv("SMTP_PASSWORD", "")
    sender = os.getenv("SMTP_FROM", username)
    port = int(os.getenv("SMTP_PORT", "587"))
    if not all([host, username, password, sender]):
        raise HTTPException(status_code=503, detail="Email delivery is not configured yet. Add SMTP settings to backend/.env.")

    message = EmailMessage()
    message["Subject"] = "Your Academe verification code"
    message["From"] = sender
    message["To"] = email
    message.set_content(f"Your Academe verification code is {code}. It expires in {OTP_TTL_MINUTES} minutes. Do not share this code.")
    with smtplib.SMTP(host, port, timeout=20) as server:
        server.starttls()
        server.login(username, password)
        server.send_message(message)


def user_payload(user: User) -> dict[str, str | int]:
    return {"id": user.id, "email": user.email, "name": user.display_name, "role": user.role, "avatar_id": user.avatar_id, "login_count": user.login_count}


def current_user(request: Request, db: Session = Depends(get_db)) -> User:
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Sign in required")
    user = db.get(User, user_id)
    if not user or not user.is_verified:
        request.session.clear()
        raise HTTPException(status_code=401, detail="Your session is no longer valid")
    return user


def require_admin(user: User = Depends(current_user)) -> User:
    if user.role not in {"admin", "sub_admin"}:
        raise HTTPException(status_code=403, detail="Administrator access required")
    return user


def seed_initial_admin(db: Session) -> None:
    email = normalize_email(os.getenv("INITIAL_ADMIN_EMAIL", ""))
    password = os.getenv("INITIAL_ADMIN_PASSWORD", "")
    name = os.getenv("INITIAL_ADMIN_NAME", "Academe Administrator")
    if email and password and not db.query(User).filter(User.email == email).first():
        db.add(User(email=email, display_name=name, password_hash=password_hash(password), role="admin", is_verified=True))
        db.commit()


def seed_demo_student(db: Session) -> None:
    if os.getenv("APP_ENV", "development") != "development" or os.getenv("DEMO_MODE", "false").lower() != "true":
        return
    email = normalize_email(os.getenv("DEMO_USER_EMAIL", "demo.student@iitp.ac.in"))
    password = os.getenv("DEMO_USER_PASSWORD", "")
    if password and not db.query(User).filter(User.email == email).first():
        db.add(User(email=email, display_name="Demo Student", password_hash=password_hash(password), role="student", is_verified=True))
        db.commit()


@app.on_event("startup")
def create_initial_admin() -> None:
    db = next(get_db())
    try:
        seed_initial_admin(db)
        seed_demo_student(db)
    finally:
        db.close()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "academe-api"}


@app.post("/auth/register/request-otp", status_code=status.HTTP_202_ACCEPTED)
def request_registration_otp(payload: RegistrationRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    email = check_iitp_email(str(payload.email))
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account already exists for this email. Please sign in instead.")

    code = f"{secrets.randbelow(1_000_000):06d}"
    db.query(RegistrationCode).filter(RegistrationCode.email == email).delete()
    db.add(RegistrationCode(email=email, display_name=payload.display_name.strip(), password_hash=password_hash(payload.password), code_hash=hashlib.sha256(code.encode()).hexdigest(), expires_at=utcnow() + timedelta(minutes=OTP_TTL_MINUTES)))
    db.commit()
    send_otp(email, code)
    return {"message": "Verification code sent to your IITP email."}


@app.post("/auth/register/verify")
def verify_registration(payload: VerifyRegistrationRequest, request: Request, db: Session = Depends(get_db)) -> dict[str, str | int]:
    email = check_iitp_email(str(payload.email))
    pending = db.query(RegistrationCode).filter(RegistrationCode.email == email).first()
    if not pending or pending.expires_at < utcnow() or pending.attempts >= 5:
        raise HTTPException(status_code=400, detail="This code has expired. Request a new verification code.")
    if not hmac.compare_digest(pending.code_hash, hashlib.sha256(payload.code.encode()).hexdigest()):
        pending.attempts += 1
        db.commit()
        raise HTTPException(status_code=400, detail="Incorrect verification code")

    user = User(email=email, display_name=pending.display_name, password_hash=pending.password_hash, is_verified=True)
    db.add(user)
    db.delete(pending)
    db.commit()
    db.refresh(user)
    request.session["user_id"] = user.id
    return user_payload(user)


@app.post("/auth/login")
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)) -> dict[str, str | int]:
    email = normalize_email(str(payload.email))
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_verified or not password_matches(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    user.last_login_at = utcnow()
    user.login_count += 1
    db.commit()
    request.session.clear()
    request.session["user_id"] = user.id
    return user_payload(user)


@app.get("/auth/me")
def me(user: User = Depends(current_user)) -> dict[str, str | int]:
    return user_payload(user)


@app.post("/auth/logout")
def logout(request: Request) -> dict[str, bool]:
    request.session.clear()
    return {"logged_out": True}


@app.get("/admin/users")
def list_users(_: User = Depends(require_admin), db: Session = Depends(get_db)) -> list[dict[str, str | int | None]]:
    users = db.query(User).order_by(User.last_login_at.desc().nullslast(), User.created_at.desc()).all()
    return [{**user_payload(user), "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None} for user in users]


@app.post("/admin/sub-admins", status_code=status.HTTP_201_CREATED)
def create_sub_admin(payload: CreateAdminRequest, _: User = Depends(require_admin), db: Session = Depends(get_db)) -> dict[str, str | int]:
    email = check_iitp_email(str(payload.email))
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account already exists for this email")
    user = User(email=email, display_name=payload.display_name.strip(), password_hash=password_hash(payload.password), role="sub_admin", is_verified=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user_payload(user)
