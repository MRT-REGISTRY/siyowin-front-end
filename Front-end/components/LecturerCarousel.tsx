'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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
      { id: 101, name: 'Tissa Jananayake',      subject: 'Science',      credentials: 'O/L science theory, revision and paper discussion',          image: '/lecturer-1.jpg', photoBg: '#dfb08f', infoBg: '#dceee5', accent: '#1fac74' },
      { id: 102, name: 'Charitha Dissanayake',   subject: 'Mathematics',  credentials: 'O/L mathematics theory and model paper training',            image: '/lecturer-2.jpg', photoBg: '#ecd681', infoBg: '#eee8dc', accent: '#f28a1f' },
      { id: 103, name: 'Dushyantha Mahabadugge', subject: 'English',      credentials: 'Grammar, writing and exam-focused language practice',         image: '/lecturer-3.jpg', photoBg: '#fb8fa0', infoBg: '#e8fbff', accent: '#08a7cc' },
      { id: 104, name: 'Samitha Rathnayake',     subject: 'History',      credentials: 'Structured lessons, short notes and past papers',             image: '/lecturer-4.jpg', photoBg: '#8d93ef', infoBg: '#e3dde5', accent: '#a761dd' },
      { id: 105, name: 'Hiru Siriwardana',       subject: 'Commerce',     credentials: 'Business studies and accounting fundamentals',                image: '/lecturer-5.jpg', photoBg: '#b6e58d', infoBg: '#dfe8ee', accent: '#3c86e8' },
    ],
  },
  2: {
    title: 'A/L',
    highlight: 'Teachers',
    description: 'Advanced Level classes led by experienced subject specialists.',
    viewAllHref: '#al-teachers',
    lecturers: [
      { id: 201, name: 'Dushyantha Mahabadugge', subject: 'Engineering Technology', credentials: 'B.Sc. Eng. (Hons.) UOM, C.I.M.A., L.I.C.A., P.G. Dip.',    image: '/lecturer-3.jpg', photoBg: '#fb8fa0', infoBg: '#e8fbff', accent: '#08a7cc' },
      { id: 202, name: 'Samitha Rathnayake',     subject: 'Chemistry',              credentials: 'B.Sc. (Phy. Sp.) Colombo',                               image: '/lecturer-4.jpg', photoBg: '#8d93ef', infoBg: '#e3dde5', accent: '#a761dd' },
      { id: 203, name: 'Charitha Dissanayake',   subject: 'Physics',                credentials: 'B.Sc Engineering Honours, University of Moratuwa',        image: '/lecturer-2.jpg', photoBg: '#ecd681', infoBg: '#eee8dc', accent: '#f28a1f' },
      { id: 204, name: 'Tissa Jananayake',       subject: 'Biology',                credentials: 'B.Sc. Honours Microbiology, Psychology Counselling',      image: '/lecturer-1.jpg', photoBg: '#dfb08f', infoBg: '#dceee5', accent: '#1fac74' },
      { id: 205, name: 'Hiru Siriwardana',       subject: 'Accounting',             credentials: 'University of Sri Jayewardenepura',                      image: '/lecturer-5.jpg', photoBg: '#b6e58d', infoBg: '#dfe8ee', accent: '#3c86e8' },
    ],
  },
  3: {
    title: 'Scholarship',
    highlight: '& Other Courses',
    description: 'Foundation support, scholarship preparation and practical open courses.',
    viewAllHref: '#scholarship-courses',
    lecturers: [
      { id: 301, name: 'Nethmi Perera',    subject: 'Grade 5 Scholarship', credentials: 'Scholarship paper classes, IQ and Sinhala practice',           image: '/lecturer-5.jpg', photoBg: '#b6e58d', infoBg: '#dfe8ee', accent: '#3c86e8' },
      { id: 302, name: 'Kasun Jayasinghe', subject: 'ICT Course',          credentials: 'Computer basics, office tools and practical ICT skills',       image: '/lecturer-3.jpg', photoBg: '#fb8fa0', infoBg: '#e8fbff', accent: '#08a7cc' },
      { id: 303, name: 'Ayesha Fernando',  subject: 'English Course',      credentials: 'Spoken English, grammar and communication skills',             image: '/lecturer-1.jpg', photoBg: '#dfb08f', infoBg: '#dceee5', accent: '#1fac74' },
      { id: 304, name: 'Ravindu Bandara',  subject: 'Primary Classes',     credentials: 'Grade 1 to 5 foundation learning and activity classes',        image: '/lecturer-2.jpg', photoBg: '#ecd681', infoBg: '#eee8dc', accent: '#f28a1f' },
      { id: 305, name: 'Dinuka Herath',    subject: 'Exam Skills',         credentials: 'Study planning, model papers and confidence building',         image: '/lecturer-4.jpg', photoBg: '#8d93ef', infoBg: '#e3dde5', accent: '#a761dd' },
    ],
  },
}

const SIDE_COUNT = 2
const TRANSITION_MS = 580

const positions: Record<
  number,
  { scale: number; opacity: number; zIndex: number; xOffset: string; yOffset: number; blur: string }
> = {
  '-2': { scale: 0.70, opacity: 0.30, zIndex: 1, xOffset: '-97%', yOffset: 44, blur: '2.5px' },
  '-1': { scale: 0.84, opacity: 0.75, zIndex: 2, xOffset: '-53%', yOffset: 20, blur: '0.8px' },
   0:   { scale: 1,    opacity: 1,    zIndex: 4, xOffset: '0%',   yOffset: 0,  blur: '0px'  },
   1:   { scale: 0.84, opacity: 0.75, zIndex: 2, xOffset: '53%',  yOffset: 20, blur: '0.8px' },
   2:   { scale: 0.70, opacity: 0.30, zIndex: 1, xOffset: '97%',  yOffset: 44, blur: '2.5px' },
}

export default function LecturerCarousel({ variant = 1 }: LecturerCarouselProps) {
  const activeSection = carouselSections[variant] ?? carouselSections[1]
  const lecturers = activeSection.lecturers
  const total = lecturers.length

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const cloned = total > 0 ? [...lecturers, ...lecturers, ...lecturers] : []

  const [index, setIndex]                 = useState(total)
  const [transitioning, setTransitioning] = useState(false)
  const [isPaused, setIsPaused]           = useState(false)

  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX  = useRef<number | null>(null)

  const activeIndex = total === 0 ? 0 : ((index % total) + total) % total

  useEffect(() => {
    const raf = requestAnimationFrame(() => setTransitioning(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleTransitionEnd = useCallback(() => {
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
    if (index < total) {
      setTransitioning(false)
      setIndex(index + total)
    } else if (index >= total * 2) {
      setTransitioning(false)
      setIndex(index - total)
    }
  }, [index, total])

  useEffect(() => {
    if (!transitioning) return
    loopTimerRef.current = setTimeout(handleTransitionEnd, TRANSITION_MS + 80)
    return () => { if (loopTimerRef.current) clearTimeout(loopTimerRef.current) }
  }, [index, transitioning, handleTransitionEnd])

  useEffect(() => {
    if (transitioning) return
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setTransitioning(true))
    )
    return () => cancelAnimationFrame(raf)
  }, [transitioning])

  const goTo         = useCallback((n: number) => { setTransitioning(true); setIndex(n) }, [])
  const goToPrevious = useCallback(() => goTo(index - 1), [goTo, index])
  const goToNext     = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    if (isPaused || total < 2) return
    const id = window.setInterval(goToNext, 3600)
    return () => window.clearInterval(id)
  }, [isPaused, total, goToNext])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; setIsPaused(true) }
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) delta > 0 ? goToNext() : goToPrevious()
    touchStartX.current = null
    setIsPaused(false)
  }

  if (!mounted || total === 0) {
    return (
      <section className="relative bg-gradient-to-b from-slate-50 to-[#eef2f7] py-16">
        <div className="mx-auto mb-14 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto h-6 w-36 animate-pulse rounded-full bg-slate-200" />
          <div className="mx-auto mt-4 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mx-auto mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mx-auto flex h-[480px] max-w-7xl items-center justify-center gap-4 px-8">
          {[0.70, 0.84, 1, 0.84, 0.70].map((s, i) => (
            <div key={i} className="flex-shrink-0 animate-pulse rounded-3xl bg-slate-200"
              style={{ width: s === 1 ? 300 : s === 0.84 ? 240 : 190, height: s === 1 ? 380 : s === 0.84 ? 330 : 280, opacity: s }} />
          ))}
        </div>
      </section>
    )
  }

  const ease = `cubic-bezier(0.22, 1, 0.36, 1)`
  const cardTransition = transitioning
    ? `transform ${TRANSITION_MS}ms ${ease}, opacity ${TRANSITION_MS}ms ${ease}, filter ${TRANSITION_MS}ms ${ease}, top ${TRANSITION_MS}ms ${ease}`
    : 'none'

  return (
    // NOTE: no overflow-hidden here — that was clipping the "View all" button on scroll
    <section className="relative bg-gradient-to-b from-slate-50 to-[#eef2f7] py-16">

      {/* Heading */}
      <div className="mx-auto mb-14 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
          Meet Our Educators
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          {activeSection.title}{' '}
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            {activeSection.highlight}
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">{activeSection.description}</p>
      </div>

      {/* ── Desktop Carousel ── */}
      <div
        className="relative mx-auto hidden h-[480px] max-w-7xl select-none overflow-hidden px-8 md:block lg:h-[520px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 flex items-start justify-center">
          {cloned.map((lecturer, i) => {
            const offset = i - index
            if (Math.abs(offset) > SIDE_COUNT) return null
            const pos = positions[offset as keyof typeof positions]
            const isCenter = offset === 0
            return (
              <article
                key={`d-${lecturer.id}-${i}`}
                onClick={() => !isCenter && goTo(index + offset)}
                onTransitionEnd={isCenter ? handleTransitionEnd : undefined}
                style={{
                  position: 'absolute', left: '50%',
                  top: `${pos.yOffset}px`,
                  transform: `translateX(calc(-50% + ${pos.xOffset})) scale(${pos.scale})`,
                  opacity: pos.opacity, zIndex: pos.zIndex,
                  filter: `blur(${pos.blur})`,
                  transition: cardTransition,
                  willChange: 'transform, opacity',
                  cursor: isCenter ? 'default' : 'pointer',
                  width: isCenter ? '300px' : '240px',
                }}
                className="overflow-hidden rounded-3xl shadow-2xl"
              >
                <div className="relative overflow-hidden"
                  style={{
                    height: isCenter ? '245px' : '190px',
                    backgroundColor: lecturer.photoBg,
                    transition: transitioning ? `height ${TRANSITION_MS}ms ${ease}` : 'none',
                  }}
                >
                  <Image src={lecturer.image} alt={lecturer.name} fill
                    className="object-contain object-bottom transition-transform duration-700 ease-out"
                    style={{ transform: isCenter ? 'scale(1)' : 'scale(0.95)' }}
                    sizes={isCenter ? '300px' : '240px'} priority={isCenter}
                  />
                  {isCenter && (
                    <div className="absolute inset-x-0 bottom-0 h-12"
                      style={{ background: `linear-gradient(to top, ${lecturer.infoBg}, transparent)` }} />
                  )}
                </div>
                <div className="px-5 py-4 text-center" style={{ backgroundColor: lecturer.infoBg }}>
                  <h3 className="font-semibold text-gray-600" style={{ fontSize: isCenter ? '0.8rem' : '0.7rem' }}>
                    {lecturer.name}
                  </h3>
                  <p className="mt-1 font-extrabold leading-tight"
                    style={{ color: lecturer.accent, fontSize: isCenter ? '1.2rem' : '1rem' }}>
                    {lecturer.subject}
                  </p>
                  {isCenter && (
                    <>
                      <div className="mx-auto my-2 h-[2px] w-10 rounded-full"
                        style={{ backgroundColor: lecturer.accent + '50' }} />
                      <p className="text-xs leading-5 text-gray-500">{lecturer.credentials}</p>
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </div>
        <NavBtn direction="left"  onClick={goToPrevious} />
        <NavBtn direction="right" onClick={goToNext} />
      </div>

      {/* ── Mobile Carousel ── */}
      <div className="relative mx-auto block overflow-hidden md:hidden" style={{ maxWidth: '360px' }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            display: 'flex',
            transform: `translateX(calc(-${index * 100}%))`,
            transition: transitioning ? `transform ${TRANSITION_MS}ms ${ease}` : 'none',
            willChange: 'transform',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {cloned.map((lecturer, i) => {
            const isCurrent = i === index
            return (
              <div key={`m-${lecturer.id}-${i}`} style={{ minWidth: '100%', padding: '0 12px' }}>
                <article className="overflow-hidden rounded-3xl shadow-xl"
                  style={{
                    transform: isCurrent ? 'scale(1)' : 'scale(0.94)',
                    opacity: isCurrent ? 1 : 0.5,
                    transition: transitioning ? `transform ${TRANSITION_MS}ms ${ease}, opacity ${TRANSITION_MS}ms ease` : 'none',
                  }}
                >
                  <div className="relative" style={{ height: '220px', backgroundColor: lecturer.photoBg }}>
                    <Image src={lecturer.image} alt={lecturer.name} fill className="object-contain object-bottom" sizes="336px" />
                    <div className="absolute inset-x-0 bottom-0 h-10"
                      style={{ background: `linear-gradient(to top, ${lecturer.infoBg}, transparent)` }} />
                  </div>
                  <div className="px-5 py-5 text-center" style={{ backgroundColor: lecturer.infoBg }}>
                    <h3 className="text-sm font-semibold text-gray-600">{lecturer.name}</h3>
                    <p className="mt-1 text-xl font-extrabold leading-tight" style={{ color: lecturer.accent }}>{lecturer.subject}</p>
                    <div className="mx-auto my-2 h-[2px] w-8 rounded-full" style={{ backgroundColor: lecturer.accent + '55' }} />
                    <p className="text-xs leading-5 text-gray-500">{lecturer.credentials}</p>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
        <div className="mt-5 flex items-center justify-between px-3">
          <button onClick={goToPrevious} aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:shadow-lg active:scale-95">
            <ChevronLeft className="h-5 w-5 text-gray-500" strokeWidth={2} />
          </button>
          <Dots total={total} active={activeIndex} onDot={(i) => goTo(total + i)} />
          <button onClick={goToNext} aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:shadow-lg active:scale-95">
            <ChevronRight className="h-5 w-5 text-gray-500" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Desktop dots */}
      <div className="mt-8 hidden justify-center md:flex">
        <Dots total={total} active={activeIndex} onDot={(i) => goTo(total + i)} />
      </div>

      {/* View All — outside overflow-hidden, no z-index stacking issue */}
      <div className="mt-10 flex justify-center">
        <a
          href={activeSection.viewAllHref}
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-300 active:scale-95"
        >
          View all teachers
          <ArrowRight size={16} strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Bottom wave */}
      <svg
        className="pointer-events-none absolute -bottom-1 left-0 h-16 w-full text-white md:h-20"
        viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"
      >
        <path fill="currentColor" d="M0,120 C360,42 1020,42 1440,120 L1440,120 L0,120 Z" />
      </svg>
    </section>
  )
}

function NavBtn({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const isLeft = direction === 'left'
  return (
    <button onClick={onClick} aria-label={isLeft ? 'Previous' : 'Next'}
      style={{ position: 'absolute', top: '42%', [isLeft ? 'left' : 'right']: '0px', transform: 'translateY(-50%)', zIndex: 50 }}
      className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-xl active:scale-95"
    >
      {isLeft
        ? <ChevronLeft  className="h-6 w-6 text-gray-500 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2} />
        : <ChevronRight className="h-6 w-6 text-gray-500 transition-transform duration-200 group-hover:translate-x-0.5"  strokeWidth={2} />}
    </button>
  )
}

function Dots({ total, active, onDot }: { total: number; active: number; onDot: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onDot(i)} aria-label={`Slide ${i + 1}`}
          style={{
            width: i === active ? '28px' : '8px', height: '8px',
            borderRadius: '9999px',
            background: i === active ? 'linear-gradient(to right, #3b82f6, #60a5fa)' : 'rgba(148,163,184,0.5)',
            transition: 'width 400ms cubic-bezier(0.22,1,0.36,1), background 300ms ease',
            border: 'none', cursor: 'pointer', padding: 0,
          }}
        />
      ))}
    </div>
  )
}
