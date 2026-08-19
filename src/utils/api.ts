const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
export const API_URL = viteEnv?.VITE_API_URL || 'http://localhost:8000';

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'sub_admin';
  avatar_id: string;
  login_count: number;
};

export async function apiRequest<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'include',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || 'Something went wrong. Please try again.');
  }
  return data as T;
}
