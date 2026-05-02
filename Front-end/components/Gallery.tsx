'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'
import { SiteGalleryImage } from '@/types/siteContent'
import { useLanguage } from './LanguageProvider'

type Filter = 'all' | 'indoor' | 'outdoor'

const filters: { label: string; value: Filter }[] = [
  { label: 'All Photos',     value: 'all'     },
  { label: 'Indoor Events',  value: 'indoor'  },
  { label: 'Outdoor Events', value: 'outdoor' },
]

export default function Gallery({ images }: { images: SiteGalleryImage[] }) {
  const [active,     setActive]     = useState<Filter>('all')
  const [lightbox,   setLightbox]   = useState<number | null>(null)
  const { isSinhala } = useLanguage()

  const filtered = active === 'all'
    ? images
    : images.filter((img) => img.category === active)

  const lightboxImg = lightbox !== null ? images.find((g) => g.id === lightbox) : null

  const openLightbox  = (id: number) => setLightbox(id)
  const closeLightbox = ()           => setLightbox(null)

  return (
    <section id="gallery" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-white to-slate-50 py-20">

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-red-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-3 inline-block rounded-full bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-600">
            {isSinhala ? 'අපගේ මතකයන්' : 'Our Moments'}
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {isSinhala ? 'ඡායාරූප' : 'Photo'}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, #D9232D, #F47920)' }}
            >
              {isSinhala ? 'ගැලරිය' : 'Gallery'}
            </span>
          </h2>
          <p className="mt-3 max-w-xl text-base text-gray-500">
            {isSinhala
              ? 'Siyowin Higher Education Institute හි වැඩසටහන්, පන්ති කාමර සහ සිසුන්ගේ මතකයන්.'
              : 'Glimpses from our events, classrooms, and campus life at Siyowin Higher Education Institute.'}
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
                {isSinhala
                  ? f.value === 'all'
                    ? 'සියලු ඡායාරූප'
                    : f.value === 'indoor'
                      ? 'ඇතුළත වැඩසටහන්'
                      : 'බාහිර වැඩසටහන්'
                  : f.label}
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
          <div className="py-20 text-center text-gray-400">
            {isSinhala ? 'මෙම කාණ්ඩයේ ඡායාරූප නොමැත.' : 'No photos in this category yet.'}
          </div>
        )}

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
