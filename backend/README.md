# Academe API

FastAPI backend for IITP email/password authentication with email OTP verification.

## Setup

1. Create `backend/.env` from `.env.example`.
2. Add a long `SESSION_SECRET`.
3. Configure an SMTP account in `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_FROM` so the app can send OTP emails.
4. Set `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` once. They create the first administrator when the server starts.
5. Install and run:

```powershell
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
backend\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --port 8000
```

Only verified `@iitp.ac.in` email addresses can register. Passwords are stored as one-way PBKDF2 hashes and cannot be viewed by administrators.

## Current API

- `POST /auth/register/request-otp`
- `POST /auth/register/verify`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /admin/users` (admin or sub-admin only)
- `POST /admin/sub-admins` (admin or sub-admin only)
