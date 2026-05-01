import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import { timetableGroups, timetableUpdateMessage } from '@/data/timetables'

export default function TimetablePreview() {
  return (
    <section id="timetable" className="relative scroll-mt-20 bg-gradient-to-b from-slate-50 to-[#eef2f7] pb-20 pt-8 md:pt-10">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
              <Clock3 className="h-3.5 w-3.5" />
              Class Schedules
            </span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Time{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                Tables
              </span>
            </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Select a category to view teacher-wise class details and the timetable update area.
            </p>
          <p className="mx-auto mt-5 max-w-2xl rounded-2xl border border-blue-100 bg-white/80 px-5 py-3 text-sm leading-6 text-slate-600 shadow-sm">
            {timetableUpdateMessage}
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {timetableGroups.map((group) => {
            const Icon = group.icon

            return (
              <Link
                key={group.id}
                href={group.href}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                </div>

                <div className="p-6 pt-5">
                  <h3 className="text-xl font-extrabold text-slate-900">{group.title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{group.description}</p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Available Teachers</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {group.classes.map((item) => item.teacher).join(', ')}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <svg
        className="pointer-events-none absolute -bottom-1 left-0 h-16 w-full text-white md:h-20"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="currentColor" d="M0,120 C360,42 1020,42 1440,120 L1440,120 L0,120 Z" />
      </svg>
    </section>
  )
}
