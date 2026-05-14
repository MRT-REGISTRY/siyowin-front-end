'use client'

import Image from 'next/image'
import { SiteAboutFeature, SiteAboutStat } from '@/types/siteContent'
import { useLanguage } from './LanguageProvider'

export default function AcademyInfo({
  features,
  stats,
}: {
  features: SiteAboutFeature[]
  stats: SiteAboutStat[]
}) {
  const { isSinhala } = useLanguage()
  const translatedFeatures = isSinhala
    ? [
      { id: 'si-feature-1', text: 'ශ්‍රේණිය 1 සිට ශ්‍රේණිය 13 දක්වා O/L සහ A/L ඇතුළත් පන්ති' },
      { id: 'si-feature-2', text: 'ප්‍රායෝගික හා අඛණ්ඩ ඉගෙනීමට විවෘත පාඨමාලා' },
      { id: 'si-feature-3', text: 'සිසුන්ගේ අධ්‍යාපනික සහ වෘත්තීය මඟපෙන්වීම' },
      { id: 'si-feature-4', text: 'ශිෂ්‍යත්ව හා විභාග සූදානම් කිරීමේ විශේෂ සහාය' },
    ]
    : features

  return (
    <section id="about" className="scroll-mt-20 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full bg-red-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#D9232D]">
            {isSinhala ? 'සියෝවින් ගැන' : 'About Siyowin'}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            {isSinhala ? 'කෑගල්ලේ විශ්වාසනීය උසස් අධ්‍යාපන ආයතනය' : "Kegalle's Most Trusted Academy"}
          </h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#D9232D] to-[#F47920]" />
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[420px]">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-gradient-to-br from-red-100 to-orange-50" />
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/10">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/photos/bggrund (3).jpg"
                  alt={isSinhala ? 'සියෝවින් උසස් අධ්‍යාපන ආයතනය' : 'Siyowin Higher Education Institute'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 45vw"
                  priority
                />
              </div>
            </div>
            {/* EST badge */}
            <div className="absolute -right-4 -top-4 z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#D9232D] to-[#F47920] shadow-lg shadow-red-300/40">
              <span className="text-xl font-black leading-none text-white">2024</span>
              <span className="text-[9px] font-bold tracking-widest text-white/80">EST.</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col text-center lg:text-left">
            <p className="mb-6 text-lg leading-relaxed text-gray-600">
              {isSinhala
                ? '2024 දී ආරම්භ වූ සියෝවින් උසස් අධ්‍යාපන ආයතනය, ශ්‍රේණිය 1 සිට ශ්‍රේණිය 13 දක්වා සිසුන්ට විශේෂඥ ගුරු මණ්ඩලයක්, සැලසුම්ගත පාඩම් සහ විභාග කේන්ද්‍රගත මඟපෙන්වීම ලබා දෙයි.'
                : 'Established in 2024, Siyowin Higher Education Institute has become a growing educational force in the Kegalle District, guiding students from Grade 1 to 13 and beyond through expert teaching, structured lessons, and open courses designed for every learner.'}
            </p>

            <p className="mb-8 text-base text-gray-600">
              {isSinhala ? (
                <>
                  ශාඛා:{' '}
                  <span className="font-semibold text-[#D9232D]">
                    පල්ලාදෙණිය පාර හා කොමර්ශල් බැංකුව පිටුපස
                  </span>
                </>
              ) : (
                <>
                  Branches:{' '}
                  <a
                    href="https://maps.app.goo.gl/XnQmxctCutWefQpe9"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#D9232D] transition-colors duration-200 hover:text-[#F47920]"
                  >
                    Palladeniya Road, Kegalle
                  </a>
                  {' '}&amp;{' '}
                  <a
                    href="https://maps.app.goo.gl/tCkCJqx9c1koDD9c7"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#D9232D] transition-colors duration-200 hover:text-[#F47920]"
                  >
                    Behind Commercial Bank, Kegalle
                  </a>
                  .
                </>
              )}
            </p>

            {/* Feature list */}
            <ul className="mb-10 space-y-3 text-left">
              {translatedFeatures.map((feature) => (
                <li key={feature.id} className="flex items-start gap-3">
                  <span className="mt-1.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-50">
                    <span className="h-2 w-2 rounded-full bg-[#D9232D]" />
                  </span>
                  <span className="text-base text-gray-700">{feature.text}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="mb-10 grid grid-cols-3 divide-x divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white shadow-sm">
              {stats.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center py-5 px-2">
                  <span
                    className="text-2xl font-extrabold"
                    style={{
                      background: i === 0
                        ? 'linear-gradient(135deg, #D9232D, #F47920)'
                        : i === 1
                          ? 'linear-gradient(135deg, #1B3A8C, #2563eb)'
                          : 'linear-gradient(135deg, #059669, #10b981)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {s.value}
                  </span>
                  <span className="mt-1 text-xs font-medium text-gray-500">{s.label}</span>
                </div>
              ))}
            </div>

            {/* CEO */}
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-center">
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-gray-900">
                  {isSinhala ? 'රුක්ෂාන් කුලකුමාර' : 'Rukshan Kulakumara'}
                </p>
                <p className="text-xs text-gray-500">
                  {isSinhala ? 'CEO, සියෝවින් උසස් අධ්‍යාපන ආයතනය' : 'CEO, Siyowin Higher Education Institute'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
