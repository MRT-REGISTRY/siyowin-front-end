import type { Metadata } from 'next';
import '@/styles/dashboard.css';

export const metadata: Metadata = {
  title: 'Student Dashboard | Siyowin Academic Progress',
  description: 'Track your academic performance, homework completion, subject scores, and class ranking.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
