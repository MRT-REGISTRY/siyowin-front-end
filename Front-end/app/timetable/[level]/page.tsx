import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { getTimetableGroup, timetableGroups, timetableUpdateMessage } from '@/data/timetables'

export function generateStaticParams() {
  return timetableGroups.map((group) => ({ level: group.id }))
}

export default async function TimetablePage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  const group = getTimetableGroup(level)

  if (!group) {
    notFound()
  }

  const Icon = group.icon

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-[#eef2f7]">
      <Navbar />

      <section className="pt-24">
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                <Icon className="h-3.5 w-3.5" />
                {group.shortTitle} Timetable
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {group.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                {group.description} Teacher names and class details are listed below so students can find the right class quickly.
              </p>

              <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />
                  <p className="text-sm leading-6 text-orange-900">{timetableUpdateMessage}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Final Timetable</h2>
                  <p className="text-sm text-slate-500">Dates, times, and hall numbers will be added after revision.</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Updating Soon</p>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                  The official timetable is being reviewed. Please check this page again for the confirmed class schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {group.classes.map((classItem) => (
            <article
              key={classItem.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">{classItem.subject}</p>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900">{classItem.teacher}</h3>

              <div className="mt-5 space-y-3">
                {classItem.classDetails.map((detail) => (
                  <div key={detail} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <p className="text-sm leading-6 text-slate-700">{detail}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
