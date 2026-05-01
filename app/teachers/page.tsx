import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TeachersPage from '@/components/TeachersPage'

export const metadata: Metadata = {
  title: 'Our Teachers | Siyowin Academy',
  description:
    'Meet the experienced O/L, A/L and Scholarship teachers leading classes at Siyowin Academy.',
  openGraph: {
    title: 'Our Teachers | Siyowin Academy',
    description:
      'Meet the experienced O/L, A/L and Scholarship teachers at Siyowin Academy.',
  },
}

export default function TeachersRoutePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <TeachersPage />
      <Footer />
    </main>
  )
}