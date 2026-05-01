import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import AcademyInfo from '@/components/AcademyInfo'
import LecturerCarousel from '@/components/LecturerCarousel'
import Gallery from '@/components/Gallery'
import Articles from '@/components/Articles'
import Footer from '@/components/Footer'
import { getSiteContent } from '@/utils/siteContent'

export default async function Home() {
  const content = await getSiteContent()

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection images={content.heroImages} />
      <AcademyInfo features={content.aboutFeatures} stats={content.aboutStats} />
      {content.lecturerSections.map((section) => (
        <LecturerCarousel key={section.id} section={section} />
      ))}
      <Gallery images={content.galleryImages} />
      <Articles articles={content.articles} />
      <Footer />
    </main>
  )
}
