'use client'

import Image from 'next/image'

const articles = [
  {
    id: 1,
    title: 'Why My Child',
    description: 'If it is sou rced from the internet, no one can be held responsible for it\'s content.',
    image: '/article-1.jpg',
    date: '5 months',
  },
  {
    id: 2,
    title: 'Easily Meas',
    description: 'If it is sourced from the internet, no one can be held responsible for it\'s content.',
    image: '/article-2.jpg',
    date: '4 months',
  },
  {
    id: 3,
    title: 'Look On Amaz',
    description: 'If it is sourced from the internet, no one can be held responsible for it\'s content.',
    image: '/article-3.jpg',
    date: '3 months',
  },
]

export default function Articles() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-2">
          Latest Articles
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Articles from our latest blog posts
        </p>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-light-gray">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {article.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-orange text-sm font-semibold">
                    Read More →
                  </span>
                  <span className="text-gray-500 text-xs">
                    {article.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
