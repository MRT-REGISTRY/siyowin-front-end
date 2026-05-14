'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Copy, Loader2, Search, ShieldCheck, User } from 'lucide-react';
import { apiRequest } from '@/utils/api';

type PublicMarksheetResponse = {
  subject: {
    id: string;
    name: string;
    classLabel?: string | null;
    teacher?: string | null;
  };
  assignment: {
    subjectId: string;
    examType: string;
    examName: string;
    examDate: string;
    totalMarks: number | null;
  };
  student?: {
    id: string;
    name: string;
    username: string;
    index: string;
  };
  mark: number | null;
  status: 'awaiting-username' | 'pending' | 'present' | 'absent';
};

const toQuery = (params: Record<string, string>) => new URLSearchParams(params).toString();

export default function MarksSheetPortal() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId')?.trim() ?? '';
  const examType = searchParams.get('examType')?.trim() ?? '';
  const examName = searchParams.get('examName')?.trim() ?? '';
  const examDate = searchParams.get('examDate')?.trim() ?? '';

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [result, setResult] = useState<PublicMarksheetResponse | null>(null);

  const assignmentQuery = useMemo(() => ({ subjectId, examType, examName, examDate }), [subjectId, examType, examName, examDate]);

  useEffect(() => {
    if (!subjectId || !examType || !examName || !examDate) {
      setPageError('This link is missing assignment details.');
      return;
    }

    setPageError('');
    setLoading(true);
    apiRequest<PublicMarksheetResponse>(`/public/marksheet?${toQuery(assignmentQuery)}`)
      .then((data) => {
        setResult(data);
        setLookupError('');
      })
      .catch((error) => {
        setLookupError(error instanceof Error ? error.message : 'Unable to load the marksheet portal.');
      })
      .finally(() => setLoading(false));
  }, [assignmentQuery, examDate, examName, examType, subjectId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim()) {
      setLookupError('Enter the student ID or index number.');
      return;
    }

    setLoading(true);
    setLookupError('');
    try {
      const data = await apiRequest<PublicMarksheetResponse>(`/public/marksheet?${toQuery({ ...assignmentQuery, username: username.trim() })}`);
      setResult(data);
    } catch (error) {
      setResult(null);
      setLookupError(error instanceof Error ? error.message : 'Unable to find that mark.');
    } finally {
      setLoading(false);
    }
  };

  const copyCurrentLink = async () => {
    if (typeof window === 'undefined') return;
    await navigator.clipboard.writeText(window.location.href);
  };

  const totalMarks = result?.assignment.totalMarks ?? 100;
  const markValue = result?.mark;
  const scoreLabel = result?.status === 'absent' ? 'Absent' : markValue === null ? 'Pending' : `${markValue}/${totalMarks}`;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(27,58,140,0.16),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1B3A8C]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#1B3A8C]">
              <ShieldCheck size={14} />
              Student Mark Portal
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              View one assignment mark with a shared link.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Enter the student ID or index number to reveal the mark for the linked assignment. The link is tied to one subject, exam type, exam name, and date.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{result?.subject.name || subjectId || 'Unknown subject'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Assignment</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{examName || 'Unknown assignment'}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Type</p>
                <p className="mt-2 text-sm font-bold text-slate-900">{examType || 'N/A'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Date</p>
                <p className="mt-2 text-sm font-bold text-slate-900">{examDate || 'N/A'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Teacher</p>
                <p className="mt-2 text-sm font-bold text-slate-900">{result?.subject.teacher || 'Published by teacher'}</p>
              </div>
            </div>

            {lookupError && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {lookupError}
              </div>
            )}

            {pageError && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                {pageError}
              </div>
            )}

            <button
              type="button"
              onClick={copyCurrentLink}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#1B3A8C] hover:text-[#1B3A8C]"
            >
              <Copy size={16} />
              Copy this link
            </button>
          </section>

          <section className="rounded-3xl border border-[#1B3A8C]/10 bg-[#0F1F49] p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] sm:p-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-sm font-semibold text-blue-100">
                <Search size={16} />
                Enter student ID or index number
              </div>
              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-blue-100/90">
                  Student ID / Index
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 focus-within:border-white/30">
                    <User size={18} className="text-blue-200" />
                    <input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="e.g., A001 or student ID"
                      className="w-full bg-transparent text-base font-medium text-white outline-none placeholder:text-blue-100/50"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black uppercase tracking-wider text-[#0F1F49] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  View mark
                </button>
              </form>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Result</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-100/70">Current status</p>
                  <p className="mt-1 text-2xl font-black text-white">{scoreLabel}</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-100/70">Looked up</p>
                  <p className="mt-1 text-sm font-semibold text-white">{result?.student?.index || result?.student?.id || 'Waiting for ID'}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-100/70">Student</p>
                  <p className="mt-2 text-sm font-bold text-white">{result?.student?.name || 'No student selected yet'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-100/70">Index</p>
                  <p className="mt-2 text-sm font-bold text-white">{result?.student?.index || '—'}</p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-blue-100/80">
                {result?.status === 'present'
                  ? 'The mark for this assignment is now visible.'
                  : result?.status === 'absent'
                    ? 'The student was marked absent for this assignment.'
                    : result?.status === 'pending'
                      ? 'The assignment exists, but the mark has not been published for this student yet.'
                      : 'Enter the student ID or index number to reveal the mark.'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}