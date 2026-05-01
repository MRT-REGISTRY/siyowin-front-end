import AuthGate from '@/components/auth/AuthGate';
import ClassManagementPage from '@/components/admin/ClassManagementPage';

export default function AdminClassesPage() {
  return (
    <AuthGate allowedRoles={['admin', 'super-admin']}>
      <ClassManagementPage />
    </AuthGate>
  );
}
