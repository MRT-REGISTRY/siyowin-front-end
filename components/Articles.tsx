'use client'

import Image from 'next/image'

const articles = [
  {
    id: 1,
    title: 'Why Specialized Guidance Matters for O/L Examinations',
    description: 'Discover why structured tuition beyond school helps students build confidence, fill knowledge gaps, and perform at their best when it counts most.',
    image: '/article-1.jpg',
    date: '12 Oct 2024',
    category: 'Education',
    readTime: '4 min read',
  },
  {
    id: 2,
    title: 'Simple Ways to Measure and Track Your Exam Progress',
    description: 'Learn the techniques our teachers use to monitor student growth — and how you can apply the same methods at home for consistent improvement.',
    image: '/article-2.jpg',
    date: '28 Sep 2024',
    category: 'Study Tips',
    readTime: '5 min read',
  },
  {
    id: 3,
    title: 'Exploring Career Paths After A/L Examinations',
    description: 'Not sure what comes next? We break down some of the most promising higher education routes and career options available to A/L students in Sri Lanka.',
    image: '/article-3.jpg',
    date: '5 Sep 2024',
    category: 'Career',
    readTime: '6 min read',
  },
]

export default function Articles() {
  return (
    <section className="bg-[#f8f9fb] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
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

        {/* ── Grid ── */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                {/* Meta row */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#D9232D]">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.date}</span>
                  <span className="ml-auto text-xs text-gray-400">{article.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-base font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-[#D9232D] line-clamp-2">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
                  {article.description}
                </p>

                {/* Footer link */}
                <div className="mt-5 border-t border-gray-100 pt-5">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:text-[#D9232D]"
                  >
                    Read Article
                    <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── View All CTA ── */}
        <div className="mt-12 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-gray-900 hover:text-gray-900 active:scale-95"
          >
            View All Articles
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
