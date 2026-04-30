import Link from 'next/link';
import { ArrowRight, FileSpreadsheet, UserPlus, Users } from 'lucide-react';

export default function AdminHub() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-6 py-8 sm:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                Admin hub
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Choose an admin workspace</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Keep people setup and result management separate so the admin flow stays clear and easy to use.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 md:grid-cols-2 sm:px-8">
            <Link
              href="/admin/students"
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <Users className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">Students / Teachers</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add students and, for super admins, add teachers too.
              </p>
            </Link>

            <Link
              href="/admin/results"
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">Results Management</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add, update, or delete marks with single-student search or bulk CSV upload.
              </p>
            </Link>
          </div>

          <div className="px-6 pb-6 sm:px-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <strong className="text-slate-900">Tip:</strong> Use the people page for onboarding, then open results management to add grades, classes, subjects, and exam metadata.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
