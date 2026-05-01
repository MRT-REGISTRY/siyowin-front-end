'use client';

import StudentDashboard from '@/components/dashboard/StudentDashboard';
import AuthGate from '@/components/auth/AuthGate';

export default function DashboardPage() {
  return (
    <AuthGate allowedRoles={['student']}>
      <StudentDashboard />
    </AuthGate>
  );
}
