const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

type ApiOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? 'API request failed.');
  }

  return data as T;
}

export type LoginRole = 'student' | 'teacher' | 'admin' | 'super-admin';

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: LoginRole;
    studentId?: string;
    teacherId?: string;
  };
};

export const login = (input: { email: string; password: string; role?: LoginRole }) =>
  apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('siyowin_token');
};

export const apiGet = <T>(path: string) =>
  apiRequest<T>(path, {
    token: getStoredToken(),
  });

export const apiPost = <T>(path: string, body: unknown) =>
  apiRequest<T>(path, {
    method: 'POST',
    token: getStoredToken(),
    body: JSON.stringify(body),
  });

export const apiDelete = <T>(path: string) =>
  apiRequest<T>(path, {
    method: 'DELETE',
    token: getStoredToken(),
  });
