'use client'

import Image from 'next/image'

export default function AcademyInfo() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4">
          Kegalle&apos;s Most<br />
          <span className="text-dark-gray">Trusted Academy</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
          {/* Left side - Image */}
          <div className="relative">
            <div className="relative h-80 md:h-96">
              <Image
                src="/photos/bggrund (3).jpg"
                alt="Siyowin Higher Education Institute team"
                fill
                className="object-cover rounded-lg"
              />
              {/* Badge */}
                <div className="absolute -top-4 -left-4 bg-red-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-center text-sm font-bold shadow-lg">
                <div>
                  <div className="text-xl">2024</div>
                  <div className="text-xs">EST.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Established in 2024, Siyowin Higher Education Institute has become a growing educational force in the Kegalle District, guiding thousands of students from Grade 1 to 13 and beyond through open courses.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We are proud to support the next generation in chasing their dreams.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-orange text-2xl">&#10003;</span>
                <span className="text-gray-700">Classes from Grade 1 to 13</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange text-2xl">&#10003;</span>
                <span className="text-gray-700">Open courses for continued learning</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange text-2xl">&#10003;</span>
                <span className="text-gray-700">Student-focused academic guidance</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange text-2xl">&#10003;</span>
                <span className="text-gray-700">Dedicated support for future goals</span>
              </div>
            </div>

            {/* Signature and button */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <p className="font-bold text-gray-800">Rukshan Kulakumara</p>
                <p className="text-sm text-gray-600">CEO, Siyowin Higher Education Institute</p>
              </div>
            </div>

            <button className="bg-orange hover:bg-orange-light text-white font-bold py-3 px-8 rounded transition">
              Learn More About Us &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
