'use client'

import Link from 'next/link'
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { branchLabels, getTimetableGroup } from '@/data/timetables'
import { useLanguage } from './LanguageProvider'
import { toSinhalaSubject, toSinhalaTeacherName } from '@/utils/localization'

export default function TimetablePageContent({ level }: { level: string }) {
  const group = getTimetableGroup(level)
  const { isSinhala } = useLanguage()

  if (!group) return null

  const Icon = group.icon

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-[#eef2f7]">
      <Navbar />

      <section className="pt-24">
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            {isSinhala ? 'මුල් පිටුවට' : 'Back to Home'}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                <Icon className="h-3.5 w-3.5" />
                {isSinhala ? `${group.shortTitle} කාලසටහන` : `${group.shortTitle} Timetable`}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {isSinhala ? `${group.shortTitle} පන්ති කාලසටහන` : group.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                {isSinhala
                  ? 'ගුරුවරුන්ගේ නම් සහ පන්ති විස්තර පහතින් දැක්වේ. නිවැරදි පන්තිය ඉක්මනින් තෝරා ගැනීමට මෙය උපකාරී වේ.'
                  : `${group.description} Teacher names and class details are listed below so students can find the right class quickly.`}
              </p>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">{isSinhala ? 'ශාඛා සංකේත' : 'Branch Key'}</h2>
                  <p className="text-sm text-slate-500">{isSinhala ? 'පන්ති විස්තරවල ඇති ශාඛා සංකේත මෙහි පැහැදිලි කර ඇත.' : 'Submitted branch codes are expanded in each class row.'}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {Object.entries(branchLabels).map(([code, label]) => (
                  <div key={code} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
                      {code}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">{toSinhalaSubject(label, isSinhala)}</p>
                      <p className="text-xs text-slate-500">
                        {isSinhala ? 'ගුරුවරයා ශාඛා සංකේතයක් යොදා තිබෙන විට පන්ති වේලාවෙන් පසුව මෙය පෙන්වයි.' : 'Shown after the class time when the teacher submitted a branch code.'}
                      </p>
                    </div>
                    <MapPin className="ml-auto h-4 w-4 flex-shrink-0 text-orange-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {group.classes.map((classItem) => (
            <article key={classItem.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">{toSinhalaSubject(classItem.subject, isSinhala)}</p>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900">{toSinhalaTeacherName(classItem.teacher, isSinhala)}</h3>

              <div className="mt-5 space-y-3">
                {classItem.classDetails.map((detail) => (
                  <div key={detail} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <p className="text-sm leading-6 text-slate-700">{toSinhalaSubject(detail, isSinhala)}</p>
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
