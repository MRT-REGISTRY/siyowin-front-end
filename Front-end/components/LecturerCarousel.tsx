'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { SiteLecturerSection } from '@/types/siteContent'
import { useLanguage } from './LanguageProvider'
import { toSinhalaSubject, toSinhalaTeacherName } from '@/utils/localization'

interface LecturerCarouselProps {
  section: SiteLecturerSection
  showTopWave?: boolean
  showBottomWave?: boolean
}

const SIDE_COUNT = 2
const TRANSITION_MS = 580

const positions: Record<
  number,
  { scale: number; opacity: number; zIndex: number; xOffset: string; yOffset: number; blur: string }
> = {
  '-2': { scale: 0.60, opacity: 0.25, zIndex: 1, xOffset: '-235%', yOffset: 58, blur: '3px' },
  '-1': { scale: 0.80, opacity: 0.80, zIndex: 2, xOffset: '-130%', yOffset: 20, blur: '0.8px' },
   0:   { scale: 1,    opacity: 1,    zIndex: 4, xOffset: '0%',    yOffset: 0,  blur: '0px'  },
   1:   { scale: 0.80, opacity: 0.80, zIndex: 2, xOffset: '130%',  yOffset: 20, blur: '0.8px' },
   2:   { scale: 0.60, opacity: 0.25, zIndex: 1, xOffset: '235%',  yOffset: 58, blur: '3px' },
}

export default function LecturerCarousel({
  section,
  showTopWave = true,
  showBottomWave = true,
}: LecturerCarouselProps) {
  const router = useRouter()
  const { isSinhala } = useLanguage()
  const activeSection = section
  const lecturers = activeSection.lecturers
  const total = lecturers.length
  const viewAllHref = activeSection.viewAllHref?.startsWith('/') ? activeSection.viewAllHref : '/teachers'
  const shouldLoop = total > 1

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const cloned = total > 0 ? (shouldLoop ? [...lecturers, ...lecturers, ...lecturers] : lecturers) : []

  const [index, setIndex]                 = useState(shouldLoop ? total : 0)
  const [transitioning, setTransitioning] = useState(false)
  const [isPaused, setIsPaused]           = useState(false)

  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX  = useRef<number | null>(null)

  const activeIndex = total === 0 ? 0 : ((index % total) + total) % total

  useEffect(() => {
    if (!shouldLoop) return
    const raf = requestAnimationFrame(() => setTransitioning(true))
    return () => cancelAnimationFrame(raf)
  }, [shouldLoop])

  const handleTransitionEnd = useCallback(() => {
    if (!shouldLoop) return
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
    if (index < total) {
      setTransitioning(false)
      setIndex(index + total)
    } else if (index >= total * 2) {
      setTransitioning(false)
      setIndex(index - total)
    }
  }, [index, total, shouldLoop])

  useEffect(() => {
    if (!transitioning || !shouldLoop) return
    loopTimerRef.current = setTimeout(handleTransitionEnd, TRANSITION_MS + 80)
    return () => { if (loopTimerRef.current) clearTimeout(loopTimerRef.current) }
  }, [index, transitioning, handleTransitionEnd, shouldLoop])

  useEffect(() => {
    if (transitioning || !shouldLoop) return
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setTransitioning(true))
    )
    return () => cancelAnimationFrame(raf)
  }, [transitioning, shouldLoop])

  const goTo         = useCallback((n: number) => {
    if (!shouldLoop) return
    setTransitioning(true)
    setIndex(n)
  }, [shouldLoop])
  const goToPrevious = useCallback(() => goTo(index - 1), [goTo, index])
  const goToNext     = useCallback(() => goTo(index + 1), [goTo, index])
  const handleCardClick = useCallback(
    (offset: number, isCenter: boolean) => {
      if (isCenter) {
        router.push(viewAllHref)
        return
      }

      goTo(index + offset)
    },
    [goTo, index, router, viewAllHref]
  )

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
      <section className="relative bg-gradient-to-b from-slate-50 to-[#eef2f7] py-10">
        <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto h-6 w-36 animate-pulse rounded-full bg-slate-200" />
          <div className="mx-auto mt-4 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mx-auto mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mx-auto flex h-[390px] max-w-7xl items-center justify-center gap-4 px-8">
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
  const sectionSpacing = showTopWave
    ? 'pt-14 pb-6 md:pt-16 md:pb-8'
    : showBottomWave
      ? 'pt-4 pb-12 md:pt-6 md:pb-14'
      : 'pt-4 pb-6 md:pt-6 md:pb-8'

  return (
    // NOTE: no overflow-hidden here — that was clipping the "View all" button on scroll
    <section className={`relative bg-gradient-to-b from-slate-50 to-[#eef2f7] ${sectionSpacing}`}>

      {showTopWave ? (
        <svg
          className="pointer-events-none absolute -top-1 left-0 h-16 w-full -scale-y-100 text-white md:h-20"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M0,120 C360,42 1020,42 1440,120 L1440,120 L0,120 Z" />
        </svg>
      ) : null}

      {/* Heading */}
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:mb-9 sm:px-6 lg:px-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
          {isSinhala ? 'අපගේ ගුරු මණ්ඩලය' : 'Meet Our Educators'}
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          {activeSection.title}{' '}
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            {isSinhala ? 'ගුරුවරු' : activeSection.highlight}
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-gray-500">
          {isSinhala
            ? activeSection.title === 'O/L'
              ? 'O/L විෂය මඟපෙන්වීම සහ විභාග සූදානම් කිරීම.'
              : 'Technology, Arts සහ Commerce අංශ සඳහා විශේෂඥ ගුරුවරු.'
            : activeSection.description}
        </p>
      </div>

      {/* ── Desktop Carousel ── */}
      <div
        className="relative mx-auto hidden h-[390px] max-w-7xl select-none overflow-hidden px-8 md:block lg:h-[420px]"
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
                onClick={() => handleCardClick(offset, isCenter)}
                onTransitionEnd={isCenter ? handleTransitionEnd : undefined}
                style={{
                  position: 'absolute', left: '50%',
                  top: `${pos.yOffset}px`,
                  transform: `translateX(calc(-50% + ${pos.xOffset})) scale(${pos.scale})`,
                  opacity: pos.opacity, zIndex: pos.zIndex,
                  filter: `blur(${pos.blur})`,
                  transition: cardTransition,
                  willChange: 'transform, opacity',
                  cursor: 'pointer',
                  width: isCenter ? '300px' : '200px',
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
                  <Image src={lecturer.image} alt={toSinhalaTeacherName(lecturer.name, isSinhala)} fill
                    className="object-contain object-bottom transition-transform duration-700 ease-out"
                    style={{ transform: isCenter ? 'scale(1)' : 'scale(0.95)' }}
                    sizes={isCenter ? '300px' : '240px'}
                  />
                  {isCenter && (
                    <div className="absolute inset-x-0 bottom-0 h-12"
                      style={{ background: `linear-gradient(to top, ${lecturer.infoBg}, transparent)` }} />
                  )}
                </div>
                <div className="px-5 py-4 text-center" style={{ backgroundColor: lecturer.infoBg }}>
                  <h3 className="font-semibold text-gray-600" style={{ fontSize: isCenter ? '0.8rem' : '0.7rem' }}>
                    {toSinhalaTeacherName(lecturer.name, isSinhala)}
                  </h3>
                  <p className="mt-1 font-extrabold leading-tight"
                    style={{ color: lecturer.accent, fontSize: isCenter ? '1.2rem' : '1rem' }}>
                    {toSinhalaSubject(lecturer.subject, isSinhala)}
                  </p>
                  {isCenter && (
                    <>
                      <div className="mx-auto my-2 h-[2px] w-10 rounded-full"
                        style={{ backgroundColor: lecturer.accent + '50' }} />
                      <p className="text-xs leading-5 text-gray-500">{toSinhalaSubject(lecturer.credentials, isSinhala)}</p>
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
                <article
                  className="overflow-hidden rounded-3xl shadow-xl"
                  onClick={() => {
                    if (isCurrent) router.push(viewAllHref)
                  }}
                  style={{
                    transform: isCurrent ? 'scale(1)' : 'scale(0.94)',
                    opacity: isCurrent ? 1 : 0.5,
                    transition: transitioning ? `transform ${TRANSITION_MS}ms ${ease}, opacity ${TRANSITION_MS}ms ease` : 'none',
                  }}
                >
                  <div className="relative" style={{ height: '220px', backgroundColor: lecturer.photoBg }}>
                    <Image src={lecturer.image} alt={toSinhalaTeacherName(lecturer.name, isSinhala)} fill className="object-contain object-bottom" sizes="336px" />
                    <div className="absolute inset-x-0 bottom-0 h-10"
                      style={{ background: `linear-gradient(to top, ${lecturer.infoBg}, transparent)` }} />
                  </div>
                  <div className="px-5 py-5 text-center" style={{ backgroundColor: lecturer.infoBg }}>
                    <h3 className="text-sm font-semibold text-gray-600">{toSinhalaTeacherName(lecturer.name, isSinhala)}</h3>
                    <p className="mt-1 text-xl font-extrabold leading-tight" style={{ color: lecturer.accent }}>{toSinhalaSubject(lecturer.subject, isSinhala)}</p>
                    <div className="mx-auto my-2 h-[2px] w-8 rounded-full" style={{ backgroundColor: lecturer.accent + '55' }} />
                    <p className="text-xs leading-5 text-gray-500">{toSinhalaSubject(lecturer.credentials, isSinhala)}</p>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center justify-between px-3">
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
      <div className="mt-4 hidden justify-center md:flex">
        <Dots total={total} active={activeIndex} onDot={(i) => goTo(total + i)} />
      </div>

      {/* View All — outside overflow-hidden, no z-index stacking issue */}
      <div className="mt-6 flex justify-center">
        <a
          href={viewAllHref}
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-300 active:scale-95"
        >
          {isSinhala ? 'සියලු ගුරුවරු බලන්න' : 'View all teachers'}
          <ArrowRight size={16} strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      {showBottomWave ? (
        <svg
          className="pointer-events-none absolute -bottom-1 left-0 h-16 w-full text-white md:h-20"
          viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"
        >
          <path fill="currentColor" d="M0,120 C360,42 1020,42 1440,120 L1440,120 L0,120 Z" />
        </svg>
      ) : null}
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
