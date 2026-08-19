import React, { useState } from 'react';
import { GraduationCap, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { apiRequest, AuthUser } from '../utils/api';

type Mode = 'login' | 'register' | 'verify';

export const AuthScreen: React.FC = () => {
  const { finishAuthentication } = useAcademic();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        const user = await apiRequest<AuthUser>('/auth/login', { email, password });
        finishAuthentication(user);
        return;
      }
      if (mode === 'register') {
        const response = await apiRequest<{ message: string }>('/auth/register/request-otp', { email, display_name: name, password });
        setMessage(response.message);
        setMode('verify');
        return;
      }
      const user = await apiRequest<AuthUser>('/auth/register/verify', { email, code });
      finishAuthentication(user);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,#dbeafe_0,transparent_28%),radial-gradient(circle_at_85%_85%,#dcfce7_0,transparent_25%),#f8fafc] flex items-center justify-center p-5">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-slate-900/10 border border-white">
        <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25 mb-5">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Welcome to Academe</h1>
        <p className="text-sm text-slate-500 mt-2">Use your official <strong>@iitp.ac.in</strong> email to access classes, assignments, quizzes, and announcements.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <label className="block text-sm font-bold text-slate-700">Name
              <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your full name" />
            </label>
          )}
          {mode !== 'verify' && (
            <>
              <label className="block text-sm font-bold text-slate-700">IITP email
                <span className="relative block mt-1.5"><Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="name@iitp.ac.in" /></span>
              </label>
              <label className="block text-sm font-bold text-slate-700">Password
                <span className="relative block mt-1.5"><KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input required type="password" minLength={mode === 'register' ? 10 : 1} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="At least 10 characters" /></span>
              </label>
            </>
          )}
          {mode === 'verify' && (
            <label className="block text-sm font-bold text-slate-700">Verification code
              <input required inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 tracking-[0.5em] text-center text-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="000000" />
            </label>
          )}
          {message && <p className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p>}
          <button disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Send verification code' : 'Verify and create account'}
          </button>
        </form>

        {mode !== 'verify' ? (
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-4 w-full text-sm font-semibold text-blue-700 hover:underline">
            {mode === 'login' ? 'New student? Create your account' : 'Already have an account? Sign in'}
          </button>
        ) : <button onClick={() => setMode('register')} className="mt-4 w-full text-sm font-semibold text-blue-700 hover:underline">Use a different email</button>}
        <p className="mt-6 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Your password is stored securely and is never visible to administrators.</p>
      </section>
    </main>
  );
};
