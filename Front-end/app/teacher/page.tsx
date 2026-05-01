import AuthGate from '@/components/auth/AuthGate';
import TeacherDashboard from '@/components/teacher/TeacherDashboard';

export default function TeacherPage() {
  return (
    <AuthGate allowedRoles={['teacher']}>
      <TeacherDashboard />
    </AuthGate>
  );
}
