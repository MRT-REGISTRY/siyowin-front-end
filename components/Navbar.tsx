'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-sm border-b border-white/30">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
        <div className="flex-shrink-0">
        <img
          src="/photos/logo.png"
          alt="Siyowin Logo"
          className="h-16 w-auto"
        />
        </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="#" className="hover:text-orange transition text-blue-600 font-bold">
              Home
            </Link>
            <Link href="#" className="hover:text-orange transition text-blue-600 font-bold">
              About
            </Link>
            <Link href="#" className="hover:text-orange transition text-blue-600 font-bold">
              Services
            </Link>
            <Link href="#" className="hover:text-orange transition text-blue-600 font-bold">
              Teachers
            </Link>
            <Link href="#" className="hover:text-orange transition text-blue-600 font-bold">
              Gallery
            </Link>
            <Link href="#" className="hover:text-orange transition text-blue-600 font-bold">
              FAQ
            </Link>
            <Link href="#" className="hover:text-orange transition text-blue-600 font-bold">
              More Info
            </Link>
            <button className="px-4 py-2 font-bold text-red-800 rounded transition hover:bg-red-800 hover:text-white">
              LMS LOGIN
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link href="#" className="block py-2 hover:text-orange transition">
              Home
            </Link>
            <Link href="#" className="block py-2 hover:text-orange transition">
              About
            </Link>
            <Link href="#" className="block py-2 hover:text-orange transition">
              Services
            </Link>
            <Link href="#" className="block py-2 hover:text-orange transition">
              Teachers
            </Link>
            <Link href="#" className="block py-2 hover:text-orange transition">
              Gallery
            </Link>
            <Link href="#" className="block py-2 hover:text-orange transition">
              FAQ
            </Link>
            <Link href="#" className="block py-2 hover:text-orange transition">
              More Info
            </Link>
            <button className="bg-red px-4 py-2 rounded font-semibold text-white hover:bg-white hover:text-red-800 transition w-full mt-2">
              LMS LOGIN
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
