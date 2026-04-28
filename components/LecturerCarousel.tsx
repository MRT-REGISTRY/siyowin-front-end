'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface LecturerCarouselProps {
  variant?: number
}

type Lecturer = {
  id: number
  name: string
  subject: string
  credentials: string
  image: string
  photoBg: string
  infoBg: string
  accent: string
}

const carouselSections: Record<
  number,
  { title: string; highlight: string; description: string; viewAllHref: string; lecturers: Lecturer[] }
> = {
  1: {
    title: 'O/L',
    highlight: 'Teachers',
    description: 'Strong subject guidance for Ordinary Level students.',
    viewAllHref: '#ol-teachers',
    lecturers: [
      {
        id: 101,
        name: 'Tissa Jananayake',
        subject: 'Science',
        credentials: 'O/L science theory, revision and paper discussion',
        image: '/lecturer-1.jpg',
        photoBg: '#dfb08f',
        infoBg: '#dceee5',
        accent: '#1fac74',
      },
      {
        id: 102,
        name: 'Charitha Dissanayake',
        subject: 'Mathematics',
        credentials: 'O/L mathematics theory and model paper training',
        image: '/lecturer-2.jpg',
        photoBg: '#ecd681',
        infoBg: '#eee8dc',
        accent: '#f28a1f',
      },
      {
        id: 103,
        name: 'Dushyantha Mahabadugge',
        subject: 'English',
        credentials: 'Grammar, writing and exam-focused language practice',
        image: '/lecturer-3.jpg',
        photoBg: '#fb8fa0',
        infoBg: '#e8fbff',
        accent: '#08a7cc',
      },
      {
        id: 104,
        name: 'Samitha Rathnayake',
        subject: 'History',
        credentials: 'Structured lessons, short notes and past papers',
        image: '/lecturer-4.jpg',
        photoBg: '#8d93ef',
        infoBg: '#e3dde5',
        accent: '#a761dd',
      },
      {
        id: 105,
        name: 'Hiru Siriwardana',
        subject: 'Commerce',
        credentials: 'Business studies and accounting fundamentals',
        image: '/lecturer-5.jpg',
        photoBg: '#b6e58d',
        infoBg: '#dfe8ee',
        accent: '#3c86e8',
      },
    ],
  },
  2: {
    title: 'A/L',
    highlight: 'Teachers',
    description: 'Advanced Level classes led by experienced subject specialists.',
    viewAllHref: '#al-teachers',
    lecturers: [
      {
        id: 201,
        name: 'Dushyantha Mahabadugge',
        subject: 'Engineering Technology',
        credentials: 'B.Sc. Eng. (Hons.) UOM, C.I.M.A., L.I.C.A., P.G. Dip.',
        image: '/lecturer-3.jpg',
        photoBg: '#fb8fa0',
        infoBg: '#e8fbff',
        accent: '#08a7cc',
      },
      {
        id: 202,
        name: 'Samitha Rathnayake',
        subject: 'Chemistry',
        credentials: 'B.Sc. (Phy. Sp.) Colombo',
        image: '/lecturer-4.jpg',
        photoBg: '#8d93ef',
        infoBg: '#e3dde5',
        accent: '#a761dd',
      },
      {
        id: 203,
        name: 'Charitha Dissanayake',
        subject: 'Physics',
        credentials: 'B.Sc Engineering Honours, University of Moratuwa',
        image: '/lecturer-2.jpg',
        photoBg: '#ecd681',
        infoBg: '#eee8dc',
        accent: '#f28a1f',
      },
      {
        id: 204,
        name: 'Tissa Jananayake',
        subject: 'Biology',
        credentials: 'B.Sc. Honours Microbiology, Psychology Counselling',
        image: '/lecturer-1.jpg',
        photoBg: '#dfb08f',
        infoBg: '#dceee5',
        accent: '#1fac74',
      },
      {
        id: 205,
        name: 'Hiru Siriwardana',
        subject: 'Accounting',
        credentials: 'University of Sri Jayewardenepura',
        image: '/lecturer-5.jpg',
        photoBg: '#b6e58d',
        infoBg: '#dfe8ee',
        accent: '#3c86e8',
      },
    ],
  },
  3: {
    title: 'Scholarship',
    highlight: '& Other Courses',
    description: 'Foundation support, scholarship preparation and practical open courses.',
    viewAllHref: '#scholarship-courses',
    lecturers: [
      {
        id: 301,
        name: 'Nethmi Perera',
        subject: 'Grade 5 Scholarship',
        credentials: 'Scholarship paper classes, IQ and Sinhala practice',
        image: '/lecturer-5.jpg',
        photoBg: '#b6e58d',
        infoBg: '#dfe8ee',
        accent: '#3c86e8',
      },
      {
        id: 302,
        name: 'Kasun Jayasinghe',
        subject: 'ICT Course',
        credentials: 'Computer basics, office tools and practical ICT skills',
        image: '/lecturer-3.jpg',
        photoBg: '#fb8fa0',
        infoBg: '#e8fbff',
        accent: '#08a7cc',
      },
      {
        id: 303,
        name: 'Ayesha Fernando',
        subject: 'English Course',
        credentials: 'Spoken English, grammar and communication skills',
        image: '/lecturer-1.jpg',
        photoBg: '#dfb08f',
        infoBg: '#dceee5',
        accent: '#1fac74',
      },
      {
        id: 304,
        name: 'Ravindu Bandara',
        subject: 'Primary Classes',
        credentials: 'Grade 1 to 5 foundation learning and activity classes',
        image: '/lecturer-2.jpg',
        photoBg: '#ecd681',
        infoBg: '#eee8dc',
        accent: '#f28a1f',
      },
      {
        id: 305,
        name: 'Dinuka Herath',
        subject: 'Exam Skills',
        credentials: 'Study planning, model papers and confidence building',
        image: '/lecturer-4.jpg',
        photoBg: '#8d93ef',
        infoBg: '#e3dde5',
        accent: '#a761dd',
      },
    ],
  },
}

const cardPositions = [
  {
    offset: -2,
    className: 'left-[5%] top-10 w-36 opacity-65 blur-[0.5px] md:left-[7%] md:w-44',
    zIndex: 10,
  },
  {
    offset: -1,
    className: 'left-[16%] top-5 w-48 opacity-90 md:left-[19%] md:w-56',
    zIndex: 30,
  },
  {
    offset: 0,
    className: 'left-1/2 top-0 w-72 -translate-x-1/2 md:w-80',
    zIndex: 40,
  },
  {
    offset: 1,
    className: 'right-[16%] top-5 w-48 opacity-90 md:right-[19%] md:w-56',
    zIndex: 30,
  },
  {
    offset: 2,
    className: 'right-[5%] top-10 w-36 opacity-65 blur-[0.5px] md:right-[7%] md:w-44',
    zIndex: 10,
  },
]

export default function LecturerCarousel({ variant = 1 }: LecturerCarouselProps) {
  const activeSection = carouselSections[variant] ?? carouselSections[1]
  const lecturers = activeSection.lecturers
  const initialIndex = 0
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + lecturers.length) % lecturers.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % lecturers.length)
  }

  const getLecturerAtOffset = (offset: number) => {
    const index = (currentIndex + offset + lecturers.length) % lecturers.length
    return lecturers[index]
  }

  return (
    <section className="relative overflow-hidden bg-[#f3f4f6] py-14">
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900">
          {activeSection.title} <span className="text-red">{activeSection.highlight}</span>
        </h2>
        <p className="mt-3 text-gray-600">{activeSection.description}</p>
      </div>

      <div className="relative mx-auto h-[330px] max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={goToPrevious}
          className="absolute left-5 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-blue-500 transition hover:text-blue-600"
          aria-label="Previous lecturer"
        >
          <ChevronLeft size={52} strokeWidth={1.8} />
        </button>

        <div className="absolute inset-x-14 top-0 hidden h-[285px] items-center justify-center overflow-hidden md:block">
          {cardPositions.map((position) => {
            const lecturer = getLecturerAtOffset(position.offset)
            const isActive = position.offset === 0

            return (
              <article
                key={`${lecturer.id}-${position.offset}`}
                className={`absolute overflow-hidden rounded-sm shadow-lg transition-all duration-500 ${position.className}`}
                style={{ zIndex: position.zIndex }}
              >
                <div
                  className={isActive ? 'relative h-44' : 'relative h-32'}
                  style={{ backgroundColor: lecturer.photoBg }}
                >
                  <Image
                    src={lecturer.image}
                    alt={lecturer.name}
                    fill
                    className="object-contain object-bottom"
                    sizes={isActive ? '320px' : '260px'}
                  />
                </div>
                <div
                  className={isActive ? 'min-h-36 px-4 py-5 text-center' : 'min-h-28 px-3 py-4 text-center'}
                  style={{ backgroundColor: lecturer.infoBg }}
                >
                  <h3 className={isActive ? 'text-sm font-bold text-gray-800' : 'text-xs font-bold text-gray-800'}>
                    {lecturer.name}
                  </h3>
                  <p
                    className={isActive ? 'mt-2 text-2xl font-bold leading-tight' : 'mt-1 text-lg font-bold leading-tight'}
                    style={{ color: lecturer.accent }}
                  >
                    {lecturer.subject}
                  </p>
                  <p
                    className={isActive ? 'mt-4 text-sm leading-5' : 'mt-2 text-[10px] leading-4'}
                    style={{ color: lecturer.accent }}
                  >
                    {lecturer.credentials}
                  </p>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mx-auto block max-w-xs md:hidden">
          {(() => {
            const lecturer = lecturers[currentIndex]

            return (
              <article className="overflow-hidden rounded-sm shadow-lg">
                <div className="relative h-44" style={{ backgroundColor: lecturer.photoBg }}>
                  <Image
                    src={lecturer.image}
                    alt={lecturer.name}
                    fill
                    className="object-contain object-bottom"
                    sizes="320px"
                  />
                </div>
                <div className="min-h-36 px-4 py-5 text-center" style={{ backgroundColor: lecturer.infoBg }}>
                  <h3 className="text-sm font-bold text-gray-800">{lecturer.name}</h3>
                  <p className="mt-2 text-2xl font-bold leading-tight" style={{ color: lecturer.accent }}>
                    {lecturer.subject}
                  </p>
                  <p className="mt-4 text-sm leading-5" style={{ color: lecturer.accent }}>
                    {lecturer.credentials}
                  </p>
                </div>
              </article>
            )
          })()}
        </div>

        <button
          onClick={goToNext}
          className="absolute right-5 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-blue-500 transition hover:text-blue-600"
          aria-label="Next lecturer"
        >
          <ChevronRight size={52} strokeWidth={1.8} />
        </button>

        <div className="absolute bottom-3 left-1/2 z-50 flex -translate-x-1/2 gap-2">
          {lecturers.map((lecturer, index) => (
            <button
              key={lecturer.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-400/50 hover:bg-gray-400'
              }`}
              aria-label={`Show lecturer ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-50 mt-2 flex justify-center">
        <a
          href={activeSection.viewAllHref}
          className="inline-flex items-center gap-2 rounded border border-blue-500 bg-white px-5 py-3 text-sm font-bold text-blue-500 transition hover:bg-red-600 hover:text-white"
        >
          View all teachers
          <ArrowRight size={18} strokeWidth={2.2} />
        </a>
      </div>

      <svg
        className="pointer-events-none absolute -bottom-1 left-0 h-16 w-full text-white md:h-20"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="currentColor" d="M0,120 C360,42 1020,42 1440,120 L1440,120 L0,120 Z" />
      </svg>
    </section>
  )
}
