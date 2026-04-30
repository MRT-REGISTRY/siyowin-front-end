'use client';

import { useEffect, useState } from 'react';
import { apiGet, clearSession, getDashboardPathForRole, getStoredToken, getStoredUser, LoginRole } from '@/utils/api';

type AuthGateProps = {
  allowedRoles: LoginRole[];
  children: React.ReactNode;
};

export default function AuthGate({ allowedRoles, children }: AuthGateProps) {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const allowedRoleKey = allowedRoles.join(',');

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();

    if (!token || !storedUser) {
      clearSession();
      window.location.replace('/');
      return;
    }

    apiGet<{ user: { role: LoginRole } }>('/auth/me')
      .then(({ user }) => {
        if (!allowedRoles.includes(user.role)) {
          window.location.replace(getDashboardPathForRole(user.role));
          setStatus('denied');
          return;
        }

        setStatus('allowed');
      })
      .catch(() => {
        clearSession();
        window.location.replace('/');
      });
  }, [allowedRoleKey]);

  if (status !== 'allowed') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-700">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm">
          Checking your session...
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
