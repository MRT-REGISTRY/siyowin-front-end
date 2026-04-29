'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

type Filter = 'all' | 'indoor' | 'outdoor'

const galleryImages = [
  { id: 1, src: '/gallery-1.jpg', alt: 'Siyowin Academy event 1',   category: 'indoor'  as Filter },
  { id: 2, src: '/gallery-2.jpg', alt: 'Siyowin Academy event 2',   category: 'outdoor' as Filter },
  { id: 3, src: '/gallery-3.jpg', alt: 'Siyowin Academy event 3',   category: 'indoor'  as Filter },
  { id: 4, src: '/gallery-4.jpg', alt: 'Siyowin Academy event 4',   category: 'outdoor' as Filter },
  { id: 5, src: '/gallery-5.jpg', alt: 'Siyowin Academy event 5',   category: 'indoor'  as Filter },
  { id: 6, src: '/gallery-6.jpg', alt: 'Siyowin Academy event 6',   category: 'outdoor' as Filter },
]

const filters: { label: string; value: Filter }[] = [
  { label: 'All Photos',     value: 'all'     },
  { label: 'Indoor Events',  value: 'indoor'  },
  { label: 'Outdoor Events', value: 'outdoor' },
]

export default function Gallery() {
  const [active,     setActive]     = useState<Filter>('all')
  const [lightbox,   setLightbox]   = useState<number | null>(null)

  const filtered = active === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.category === active)

  const lightboxImg = lightbox !== null ? galleryImages.find((g) => g.id === lightbox) : null

  const openLightbox  = (id: number) => setLightbox(id)
  const closeLightbox = ()           => setLightbox(null)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-20">

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-red-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-3 inline-block rounded-full bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-600">
            Our Moments
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Photo{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, #D9232D, #F47920)' }}
            >
              Gallery
            </span>
          </h2>
          <p className="mt-3 max-w-xl text-base text-gray-500">
            Glimpses from our events, classrooms, and campus life at Siyowin Higher Education Institute.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {filters.map((f) => {
            const isActive = active === f.value
            return (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                className="rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #D9232D, #F47920)'
                    : 'transparent',
                  color: isActive ? '#fff' : '#6b7280',
                  border: isActive ? 'none' : '1.5px solid #e5e7eb',
                  boxShadow: isActive ? '0 4px 14px rgba(217,35,45,0.30)' : 'none',
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* ── Masonry-style grid ── */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((img, i) => (
            <div
              key={img.id}
              className="group relative mb-4 overflow-hidden rounded-2xl shadow-md transition-all duration-500 hover:shadow-xl"
              style={{
                breakInside: 'avoid',
                animationDelay: `${i * 60}ms`,
              }}
            >
              {/* Aspect varies to create masonry feel */}
              <div
                className="relative w-full"
                style={{ paddingBottom: i % 3 === 1 ? '75%' : i % 3 === 2 ? '120%' : '100%' }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    onClick={() => openLightbox(img.id)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/30"
                    aria-label={`View ${img.alt}`}
                  >
                    <ZoomIn size={20} strokeWidth={2} />
                  </button>
                  {/* Category chip */}
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs font-medium capitalize text-white backdrop-blur-sm">
                    {img.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">No photos in this category yet.</div>
        )}

        {/* ── View More CTA ── */}
        <div className="mt-12 flex justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full border-2 px-7 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: '#D9232D', color: '#D9232D' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'linear-gradient(135deg, #D9232D, #F47920)'
              el.style.color = '#fff'
              el.style.borderColor = 'transparent'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'transparent'
              el.style.color = '#D9232D'
              el.style.borderColor = '#D9232D'
            }}
          >
            View Full Gallery
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxImg && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          style={{ animation: 'fadeIn 200ms ease' }}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={20} strokeWidth={2} />
          </button>
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              width={1200}
              height={800}
              className="h-auto max-h-[90vh] w-full object-contain"
              priority
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </section>
  )
}
