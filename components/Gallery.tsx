'use client'

import Image from 'next/image'

const galleryImages = [
  { id: 1, image: '/gallery-1.jpg', alt: 'Gallery image 1' },
  { id: 2, image: '/gallery-2.jpg', alt: 'Gallery image 2' },
  { id: 3, image: '/gallery-3.jpg', alt: 'Gallery image 3' },
  { id: 4, image: '/gallery-4.jpg', alt: 'Gallery image 4' },
  { id: 5, image: '/gallery-5.jpg', alt: 'Gallery image 5' },
  { id: 6, image: '/gallery-6.jpg', alt: 'Gallery image 6' },
]

export default function Gallery() {
  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">GALLERY</h2>
          <div className="flex gap-2">
            <button className="bg-red text-white px-6 py-2 rounded font-semibold hover:bg-red-600 transition">
              ALL
            </button>
            <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold hover:bg-gray-400 transition">
              INDOOR EVENT
            </button>
            <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold hover:bg-gray-400 transition">
              OUTDOOR EVENT
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {galleryImages.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
