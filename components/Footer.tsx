'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Siyowin</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students to achieve their academic goals through excellence in education, highly experienced faculty and modern facilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="#" className="text-gray-400 hover:text-orange transition text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange transition text-sm block">
                Sitemap
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange transition text-sm block">
                Contact
              </Link>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-bold mb-4">Locations</h4>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Kanaan Main Hall</p>
              <p className="text-gray-400 text-sm">Palasburgama Road, Negapo</p>
              <p className="text-gray-400 text-sm"></p>
              <p className="text-gray-400 text-sm">Vijayas - Bogotå Town</p>
              <p className="text-gray-400 text-sm">Panadura Road, Negapo</p>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-orange transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.2h-2.66v8.37h2.66v-4.13c0-.91.73-1.64 1.64-1.64h.5c.9 0 1.64.73 1.64 1.64v4.13h2.66M6.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M7 17H4.5v-8.37H7V17z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.037C18.343 21.129 22 16.99 22 12z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2024, Siyowin Academy of Education - All rights reserved</p>
          <p>Terms and Conditions</p>
        </div>
      </div>
    </footer>
  )
}
