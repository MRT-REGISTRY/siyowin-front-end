'use client'

import { useState } from 'react'
import { ArrowRight, GraduationCap, BookOpen, Award, Search } from 'lucide-react'

type Teacher = {
  id: number
  name: string
  subject: string
  credentials: string
  experience: string
  category: 'ol' | 'al' | 'scholarship'
  photoBg: string
  accent: string
  initials: string
}

const teachers: Teacher[] = [
  { id: 1, name: 'Tissa Jananayake', subject: 'Science', credentials: 'B.Sc. Honours Microbiology', experience: '12+ years', category: 'ol', photoBg: '#dfb08f', accent: '#1fac74', initials: 'TJ' },
  { id: 2, name: 'Charitha Dissanayake', subject: 'Mathematics', credentials: 'B.Sc Eng. (Hons), University of Moratuwa', experience: '10+ years', category: 'ol', photoBg: '#ecd681', accent: '#f28a1f', initials: 'CD' },
  { id: 3, name: 'Dushyantha Mahabadugge', subject: 'English', credentials: 'B.A. English, P.G. Dip. ELT', experience: '15+ years', category: 'ol', photoBg: '#fb8fa0', accent: '#08a7cc', initials: 'DM' },
  { id: 4, name: 'Samitha Rathnayake', subject: 'History', credentials: 'B.A. (Hons) History, Colombo', experience: '8+ years', category: 'ol', photoBg: '#8d93ef', accent: '#a761dd', initials: 'SR' },
  { id: 5, name: 'Hiru Siriwardana', subject: 'Commerce', credentials: 'B.B.Mgt., University of Sri Jayewardenepura', experience: '9+ years', category: 'ol', photoBg: '#b6e58d', accent: '#3c86e8', initials: 'HS' },
  { id: 6, name: 'Dushyantha Mahabadugge', subject: 'Engineering Technology', credentials: 'B.Sc. Eng. (Hons.) UOM, C.I.M.A., L.I.C.A.', experience: '15+ years', category: 'al', photoBg: '#fb8fa0', accent: '#08a7cc', initials: 'DM' },
  { id: 7, name: 'Samitha Rathnayake', subject: 'Chemistry', credentials: 'B.Sc. (Phy. Sp.) Colombo', experience: '11+ years', category: 'al', photoBg: '#8d93ef', accent: '#a761dd', initials: 'SR' },
  { id: 8, name: 'Charitha Dissanayake', subject: 'Physics', credentials: 'B.Sc Engineering Honours, UOM', experience: '10+ years', category: 'al', photoBg: '#ecd681', accent: '#f28a1f', initials: 'CD' },
  { id: 9, name: 'Tissa Jananayake', subject: 'Biology', credentials: 'B.Sc. Honours Microbiology, Psychology', experience: '12+ years', category: 'al', photoBg: '#dfb08f', accent: '#1fac74', initials: 'TJ' },
  { id: 10, name: 'Hiru Siriwardana', subject: 'Accounting', credentials: 'B.B.Mgt. (Hons), CA Sri Lanka', experience: '9+ years', category: 'al', photoBg: '#b6e58d', accent: '#3c86e8', initials: 'HS' },
  { id: 11, name: 'Nethmi Perera', subject: 'Grade 5 Scholarship', credentials: 'B.Ed. Primary Education', experience: '7+ years', category: 'scholarship', photoBg: '#b6e58d', accent: '#3c86e8', initials: 'NP' },
  { id: 12, name: 'Kasun Jayasinghe', subject: 'ICT Course', credentials: 'B.Sc. IT, University of Moratuwa', experience: '6+ years', category: 'scholarship', photoBg: '#fb8fa0', accent: '#08a7cc', initials: 'KJ' },
  { id: 13, name: 'Ayesha Fernando', subject: 'Spoken English', credentials: 'B.A. English, TESL Certified', experience: '8+ years', category: 'scholarship', photoBg: '#dfb08f', accent: '#1fac74', initials: 'AF' },
  { id: 14, name: 'Ravindu Bandara', subject: 'Primary Classes', credentials: 'B.Ed. Primary Teaching', experience: '5+ years', category: 'scholarship', photoBg: '#ecd681', accent: '#f28a1f', initials: 'RB' },
]

const tabs = [
  { id: 'all', label: 'All Teachers', icon: GraduationCap },
  { id: 'ol', label: 'O/L', icon: BookOpen },
  { id: 'al', label: 'A/L', icon: Award },
  { id: 'scholarship', label: 'Scholarship & Other', icon: GraduationCap },
] as const

export default function TeachersPage() {
  const [active, setActive] = useState<(typeof tabs)[number]['id']>('all')
  const [query, setQuery] = useState('')

  const filtered = teachers.filter((t) => {
    const matchTab = active === 'all' || t.category === active
    const q = query.trim().toLowerCase()
    const matchQuery = !q || t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
    return matchTab && matchQuery
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-[#eef2f7]">
      <section className="relative overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-orange-50" />
        <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#D9232D]/10 to-[#F47920]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Meet Our Educators
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Our{' '}
            <span className="bg-gradient-to-r from-[#D9232D] to-[#F47920] bg-clip-text text-transparent">Teachers</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
            Experienced subject specialists guiding O/L, A/L and Scholarship students towards excellence.
          </p>

          <div className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
            <Search className="h-4 w-4 text-blue-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or subject..."
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tabs.map((t) => {
            const Icon = t.icon
            const isActive = active === t.id

            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`group inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D9232D] to-[#F47920] text-white shadow-lg shadow-orange-400/30'
                    : 'border border-blue-100 bg-white text-blue-700 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-500">No teachers found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t) => (
              <article
                key={t.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-56 items-end justify-center overflow-hidden" style={{ backgroundColor: t.photoBg }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                  <div
                    className="relative mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white/90 text-3xl font-black shadow-lg ring-4 ring-white"
                    style={{ color: t.accent }}
                  >
                    {t.initials}
                  </div>
                  <span
                    className="absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow"
                    style={{ backgroundColor: t.accent }}
                  >
                    {t.category === 'ol' ? 'O/L' : t.category === 'al' ? 'A/L' : 'Scholarship'}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900">{t.name}</h3>
                  <p className="mt-0.5 text-sm font-semibold" style={{ color: t.accent }}>
                    {t.subject}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-gray-600">{t.credentials}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs font-medium text-gray-500">{t.experience}</span>
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 transition-colors hover:text-blue-900">
                      View Profile
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-center shadow-xl sm:p-12">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-orange-300/20 blur-2xl" />
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Ready to learn from the best?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-blue-100">
            Join hundreds of students achieving outstanding results with our expert educators.
          </p>
          <button className="mt-6 rounded-full bg-gradient-to-r from-[#D9232D] to-[#F47920] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-400/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95">
            Enroll Now
          </button>
        </div>
      </section>
    </div>
  )
}