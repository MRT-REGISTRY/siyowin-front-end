'use client'

import Link from 'next/link'
import Image from 'next/image'

const quickLinks = [
  { label: 'Home',         href: '#' },
  { label: 'About Us',     href: '#' },
  { label: 'Services',     href: '#' },
  { label: 'Teachers',     href: '#' },
  { label: 'Gallery',      href: '#' },
  { label: 'FAQ',          href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Contact',      href: '#' },
]

const courses = [
  { label: 'O/L Classes',          href: '#' },
  { label: 'A/L Classes',          href: '#' },
  { label: 'Grade 5 Scholarship',  href: '#' },
  { label: 'ICT Course',           href: '#' },
  { label: 'English Course',       href: '#' },
  { label: 'Primary Classes',      href: '#' },
]

const locations = [
  { name: 'Kanaan Main Hall',   address: 'Palasburgama Road, Negombo' },
  { name: 'Vijaya Branch',      address: 'Panadura Road, Negombo' },
]

const socials = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.037C18.343 21.129 22 16.99 22 12z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.44a2.56 2.56 0 0 0-1.766 1.778c-.44 1.61-.44 4.821-.44 4.821s0 3.217.44 4.763a2.46 2.46 0 0 0 1.766 1.736c1.58.45 7.83.45 7.83.45s6.265 0 7.831-.45a2.507 2.507 0 0 0 1.763-1.736c.44-1.555.44-4.763.44-4.763s0-3.211-.44-4.797zm-11.56 7.718V9.084l5.227 2.919-5.227 2.918z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: '#',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.941-1.424A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 0 1-4.076-1.117l-.292-.174-3.032.873.851-3.107-.19-.309A7.965 7.965 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.2h-2.66v8.37h2.66v-4.13c0-.91.73-1.64 1.64-1.64h.5c.9 0 1.64.73 1.64 1.64v4.13h2.66M6.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M7 17H4.5v-8.37H7V17z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#0d1117] text-white">
      {/* Top accent bar — brand gradient */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(to right, #D9232D, #F47920, #1B3A8C)' }}
      />

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="flex flex-col items-center text-center sm:col-span-2 sm:items-start sm:text-left lg:col-span-1">
            {/* Logo */}
            <div className="mb-5 inline-block rounded-xl bg-white p-3 shadow-lg">
              <Image
                src="/photos/logo.png"
                alt="Siyowin Logo"
                width={160}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Empowering students to achieve their academic goals through excellence in education,
              experienced faculty, and modern learning facilities.
            </p>

            <div className="flex justify-center gap-3 sm:justify-start">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-[#D9232D] hover:text-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              Quick Links
            </h4>
            <ul className="flex flex-col items-center space-y-2.5 sm:items-start">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white sm:justify-start"
                  >
                    <span
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 group-hover:bg-[#F47920]"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              Our Courses
            </h4>
            <ul className="flex flex-col items-center space-y-2.5 sm:items-start">
              {courses.map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="group flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white sm:justify-start"
                  >
                    <span
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 group-hover:bg-[#F47920]"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations + Contact */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              Find Us
            </h4>
            <ul className="flex flex-col items-center space-y-4 sm:items-start">
              {locations.map((loc) => (
                <li key={loc.name} className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-3">
                  <span className="mt-0.5 flex-shrink-0">
                    <svg className="h-4 w-4 text-[#F47920]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{loc.name}</p>
                    <p className="text-xs text-gray-500">{loc.address}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Contact info */}
            <div className="mt-5 flex flex-col items-center space-y-2 sm:items-start">
              <a href="tel:+94xxxxxxxxx" className="flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white sm:justify-start">
                <svg className="h-4 w-4 flex-shrink-0 text-[#F47920]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +94 xx xxx xxxx
              </a>
              <a href="mailto:info@siyowin.lk" className="flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white sm:justify-start">
                <svg className="h-4 w-4 flex-shrink-0 text-[#F47920]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@siyowin.lk
              </a>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="my-10 h-px w-full"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }}
        />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-gray-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Siyowin Higher Education Institute.<br className="sm:hidden" /> All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
            <Link href="#" className="transition-colors duration-200 hover:text-gray-300">Terms &amp; Conditions</Link>
            <Link href="#" className="transition-colors duration-200 hover:text-gray-300">Privacy Policy</Link>
            <Link href="#" className="transition-colors duration-200 hover:text-gray-300">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
