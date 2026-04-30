import AuthGate from '@/components/auth/AuthGate';
import AdminHub from '@/components/admin/AdminHub';

export default function AdminPage() {
  return (
    <AuthGate allowedRoles={['admin', 'super-admin']}>
      <AdminHub />
    </AuthGate>
  );
}
