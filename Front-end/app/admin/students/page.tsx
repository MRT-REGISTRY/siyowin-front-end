import AuthGate from '@/components/auth/AuthGate';
import StudentTeacherPage from '@/components/admin/StudentTeacherPage';

export default function AdminStudentsPage() {
  return (
    <AuthGate allowedRoles={['admin', 'super-admin']}>
      <StudentTeacherPage />
    </AuthGate>
  );
}
