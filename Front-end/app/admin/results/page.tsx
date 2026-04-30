import AuthGate from '@/components/auth/AuthGate';
import MarksPage from '@/components/admin/MarksPage';

export default function AdminResultsPage() {
  return (
    <AuthGate allowedRoles={['admin', 'super-admin']}>
      <MarksPage />
    </AuthGate>
  );
}
