'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { LogIn } from 'lucide-react'
import LmsLoginModal from './LmsLoginModal'
import { useLanguage } from './LanguageProvider'

const navLinks = [
  { label: 'Home', sinhalaLabel: 'මුල් පිටුව', href: '/' },
  { label: 'About', sinhalaLabel: 'අප ගැන', href: '/#about' },
  { label: 'Teachers', sinhalaLabel: 'ගුරුවරු', href: '/teachers' },
  { label: 'Timetable', sinhalaLabel: 'කාලසටහන්', href: '/#timetable' },
  { label: 'Contact', sinhalaLabel: 'සම්බන්ධ වන්න', href: '/#contact' },
  { label: 'FAQ', sinhalaLabel: 'ප්‍රශ්න', href: '/#faq' },
]

export default function Navbar() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const pathname = usePathname()
  const { isSinhala, toggleLanguage } = useLanguage()

  const isHome = pathname === '/'
  // Only transparent if it's the home page, hasn't been scrolled, and mobile menu is closed
  const isTransparent = isHome && !scrolled && !isOpen

  // Listen for the Hero LMS button custom event
  useEffect(() => {
    const handler = () => setShowLogin(true)
    window.addEventListener('open-lms-login', handler)
    return () => window.removeEventListener('open-lms-login', handler)
  }, [])

  // Add shadow when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500 ${
          isTransparent
            ? 'bg-white/15 border-white/10 backdrop-blur-md py-2 shadow-sm'
            : 'bg-white/95 border-white/20 backdrop-blur-lg shadow-lg shadow-black/5 py-0'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[64px] items-center justify-between">

            {/* Logo */}
            <div className="flex-shrink-0">
              <img src="/photos/logo.png" alt="Siyowin Logo" className="h-14 w-auto brightness-100" />
            </div>

            {/* ── Desktop Menu ── */}
            <div className="hidden items-center gap-0.5 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`group relative px-3 py-1.5 text-base font-bold transition-colors duration-300 ${
                    isTransparent
                      ? 'text-white hover:text-white/90'
                      : 'text-slate-700 hover:text-[#D9232D]'
                  }`}
                >
                  {isSinhala ? link.sinhalaLabel : link.label}
                  {/* Animated underline */}
                  <span className={`absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full transition-all duration-300 ease-out group-hover:w-4/5 ${
                    isTransparent ? 'bg-white' : 'bg-[#D9232D]'
                  }`} />
                </Link>
              ))}

              <button
                type="button"
                onClick={toggleLanguage}
                className={`ml-3 rounded-full border px-3 py-1.5 text-sm font-bold transition duration-300 ${
                  isTransparent
                    ? 'border-white/30 text-white hover:bg-white/10'
                    : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {isSinhala ? 'English' : 'සිංහල'}
              </button>

              {/* LMS Button */}
              <button
                onClick={() => setShowLogin(true)}
                className="group relative ml-4 overflow-hidden rounded-full bg-gradient-to-r from-[#D9232D] via-[#F47920] to-[#D9232D] bg-[length:200%_auto] px-6 py-2 text-sm font-black tracking-wide text-white shadow-lg shadow-orange-500/20 transition-all duration-500 hover:bg-[right_center] hover:scale-[1.02] hover:shadow-orange-500/40 active:scale-95 flex items-center justify-center lg:px-7 lg:py-2"
              >
                <span className="relative z-10">{isSinhala ? 'LMS පිවිසුම' : 'LMS LOGIN'}</span>
                <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-pulse" />
              </button>
            </div>

            {/* ── Hamburger (mobile) ── */}
            <button
              onClick={() => setIsOpen((p) => !p)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className={`relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg p-1.5 transition-colors duration-200 md:hidden ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span
                className="block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.25,1,0.35,1)]"
                style={{ transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'none' }}
              />
              <span
                className="block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.25,1,0.35,1)]"
                style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? 'scaleX(0)' : 'none' }}
              />
              <span
                className="block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.25,1,0.35,1)]"
                style={{ transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }}
              />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className="overflow-hidden md:hidden bg-white/98"
          style={{
            maxHeight: isOpen ? '600px' : '0px',
            transition: 'max-height 420ms cubic-bezier(0.25, 1, 0.35, 1)',
          }}
        >
          <div className="border-t border-slate-100 bg-white px-4 pb-6 pt-4 shadow-inner">
            <div className="flex flex-col items-center gap-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="group relative w-full px-4 py-2.5 text-center text-lg font-bold text-slate-700 transition-colors duration-200 hover:text-[#D9232D]"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                    transition: `opacity 350ms ease ${i * 40}ms, transform 350ms ease ${i * 40}ms, color 200ms`,
                  }}
                >
                  {isSinhala ? link.sinhalaLabel : link.label}
                  <span className="absolute bottom-1.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#D9232D] transition-all duration-300 group-hover:w-1/3" />
                </Link>
              ))}

              <button
                type="button"
                onClick={() => { setIsOpen(false); toggleLanguage() }}
                className="mt-3 w-44 rounded-full border border-slate-200 py-2 text-base font-bold text-slate-600 transition-all duration-300 hover:bg-slate-50 active:scale-95"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                  transition: `opacity 350ms ease ${navLinks.length * 40}ms, transform 350ms ease ${navLinks.length * 40}ms`,
                }}
              >
                {isSinhala ? 'English' : 'සිංහල'}
              </button>

              <button
                onClick={() => { setIsOpen(false); setShowLogin(true) }}
                className="mt-3 w-44 rounded-full bg-gradient-to-r from-[#D9232D] via-[#F47920] to-[#D9232D] bg-[length:200%_auto] py-2 text-base font-black text-white shadow-md shadow-orange-500/20 transition-all duration-500 hover:bg-[right_center] active:scale-95 flex items-center justify-center"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                  transition: `opacity 350ms ease ${navLinks.length * 40}ms, transform 350ms ease ${navLinks.length * 40}ms, background-position 500ms ease`,
                }}
              >
                {isSinhala ? 'LMS පිවිසුම' : 'LMS LOGIN'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LmsLoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
