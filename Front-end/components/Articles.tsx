'use client'

import Image from 'next/image'
import { useState } from 'react'
import { SiteArticle } from '@/types/siteContent'

export default function Articles({ articles }: { articles: SiteArticle[] }) {
  const [activeArticle, setActiveArticle] = useState<SiteArticle | null>(null)

  return (
    <section id="news" className="scroll-mt-20 bg-[#f8f9fb] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D9232D]">
            News &amp; Insights
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Latest Articles
          </h2>
          <div className="mt-4 h-px w-14 bg-[#D9232D]/30" />
          <p className="mt-5 max-w-xl text-base text-gray-500">
            Tips, news, and guidance from our educators and academic team.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#D9232D]">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.date}</span>
                  <span className="ml-auto text-xs text-gray-400">{article.readTime}</span>
                </div>

                <h3 className="mb-3 text-base font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-[#D9232D] line-clamp-2">
                  {article.title}
                </h3>

                <p className="flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
                  {article.description}
                </p>

                <div className="mt-5 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:text-[#D9232D]"
                  >
                    Read Article
                    <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeArticle ? (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setActiveArticle(null)}
        >
          <button
            type="button"
            onClick={() => setActiveArticle(null)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close article"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-black/5">
              <Image
                src={activeArticle.image}
                alt={activeArticle.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>

            <div className="space-y-3 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 font-semibold text-[#D9232D]">
                  {activeArticle.category}
                </span>
                <span>{activeArticle.date}</span>
                <span>{activeArticle.readTime}</span>
              </div>
              <h3 className="text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
                {activeArticle.title}
              </h3>
              <p className="text-sm leading-6 text-gray-600 sm:text-base">
                {activeArticle.description}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
