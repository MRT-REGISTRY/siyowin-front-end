'use client'

import Image from 'next/image'
import { SiteAboutFeature, SiteAboutStat } from '@/types/siteContent'

export default function AcademyInfo({
  features,
  stats,
}: {
  features: SiteAboutFeature[]
  stats: SiteAboutStat[]
}) {
  return (
    <section id="about" className="scroll-mt-20 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section label ── */}
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D9232D]">
            About Siyowin
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Kegalle&apos;s Most Trusted Academy
          </h2>
          <div className="mt-4 h-px w-14 bg-[#D9232D]/30" />
        </div>

        {/* ── Content grid ── */}
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* Image side */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            {/* Offset frame */}
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-gray-100" />
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/photos/bggrund (3).jpg"
                  alt="Siyowin Higher Education Institute"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 45vw"
                  priority
                />
              </div>
            </div>
            {/* EST badge */}
            <div className="absolute -right-4 -top-4 z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-white bg-[#D9232D] shadow-lg">
              <span className="text-xl font-black leading-none text-white">2024</span>
              <span className="text-[9px] font-bold tracking-widest text-white/80">EST.</span>
            </div>
          </div>

          {/* Text side */}
          <div className="flex flex-col text-center lg:text-left">
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              Established in 2024, Siyowin Higher Education Institute has become a growing educational force in the Kegalle District — guiding students from Grade 1 to 13 and beyond through expert teaching, structured lessons, and open courses designed for every learner.
            </p>
            <p className="mb-8 text-base text-gray-600">
              Branches:{' '}
              <a
                href="https://maps.app.goo.gl/XnQmxctCutWefQpe9"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#D9232D] transition-colors duration-200 hover:text-[#F47920]"
              >
                Palladeniya Road, Kegalle
              </a>
              {' '} &amp;{' '}
              <a
                href="https://maps.app.goo.gl/tCkCJqx9c1koDD9c7"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#D9232D] transition-colors duration-200 hover:text-[#F47920]"
              >
                Behind Commercial Bank, Kegalle
              </a>
              .
            </p>

            {/* Feature list */}
            <ul className="mb-10 space-y-3 text-left">
              {features.map((feature) => (
                <li key={feature.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#D9232D]" />
                  <span className="text-base text-gray-700">{feature.text}</span>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="mb-10 grid grid-cols-3 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-gray-50">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center py-5">
                  <span className="text-2xl font-extrabold text-gray-900">{s.value}</span>
                  <span className="mt-1 text-xs font-medium text-gray-500">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row lg:items-center">
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-gray-900">Rukshan Kulakumara</p>
                <p className="text-xs text-gray-500">CEO, Siyowin Higher Education Institute</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
