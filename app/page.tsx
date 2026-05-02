import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import AcademyInfo from '@/components/AcademyInfo'
import LecturerCarousel from '@/components/LecturerCarousel'
import Gallery from '@/components/Gallery'
import Articles from '@/components/Articles'
import Footer from '@/components/Footer'
import Chatbot from '@/components/Chatbot'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AcademyInfo />
      <LecturerCarousel variant={1} />
      <LecturerCarousel variant={2} />
      <LecturerCarousel variant={3} />
      <Gallery />
      <Articles />
      <Footer />

      <Chatbot />
    </main>
  )
}
