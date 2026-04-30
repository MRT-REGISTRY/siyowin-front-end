'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, UserPlus, Users } from 'lucide-react';

import { apiGet, apiPost } from '@/utils/api';
import { AdminRole, AdminSubjectOption, AdminTeacher } from '@/types';

type NoticeState = {
  message: string;
  variant: 'success' | 'danger' | 'info';
};

interface Props {
  onNotice?: (notice: NoticeState) => void;
}

export default function StudentTeacherPage({ onNotice }: Props) {
  const [role, setRole] = useState<AdminRole>('admin');
  const [teachers, setTeachers] = useState<AdminTeacher[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<AdminSubjectOption[]>([]);

  const [teacherName, setTeacherName] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('Mathematics');
  const [teacherGrade, setTeacherGrade] = useState('Grade 11');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');

  const [studentName, setStudentName] = useState('');
  const [studentIndex, setStudentIndex] = useState('');
  const [studentGrade, setStudentGrade] = useState('Grade 11');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  const teacherCount = useMemo(() => teachers.length, [teachers.length]);

  useEffect(() => {
    apiGet<{ grades: string[]; subjects: AdminSubjectOption[] }>('/admin/meta')
      .then((data) => {
        setGrades(data.grades);
        setSubjects(data.subjects);
        setTeacherSubject(data.subjects[0]?.name ?? 'Mathematics');
        setTeacherGrade(data.grades[0] ?? 'Grade 11');
        setStudentGrade(data.grades[0] ?? 'Grade 11');
      })
      .catch(() => undefined);
    apiGet<{ teachers: AdminTeacher[] }>('/admin/teachers')
      .then((data) => setTeachers(data.teachers))
      .catch(() => undefined);
  }, []);

  const addTeacher = () => {
    if (role !== 'super-admin') {
      onNotice?.({ message: 'Only super admins can add teachers.', variant: 'info' });
      return;
    }

    if (!teacherName.trim() || !teacherEmail.trim()) {
      onNotice?.({ message: 'Enter a teacher name and email.', variant: 'danger' });
      return;
    }

    apiPost<{ teacher: AdminTeacher }>('/admin/teachers', {
      name: teacherName.trim(),
      subject: teacherSubject,
      grade: teacherGrade,
      email: teacherEmail.trim(),
      phone: teacherPhone.trim(),
    })
      .then((data) => {
        setTeachers((previous) => [data.teacher, ...previous]);
        onNotice?.({ message: `Teacher ${teacherName.trim()} added.`, variant: 'success' });
        setTeacherName('');
        setTeacherEmail('');
        setTeacherPhone('');
      })
      .catch((error) => onNotice?.({ message: error instanceof Error ? error.message : 'Teacher was not added.', variant: 'danger' }));
  };

  const addStudent = () => {
    if (!studentName.trim() || !studentIndex.trim()) {
      onNotice?.({ message: 'Enter a student name and index.', variant: 'danger' });
      return;
    }

    apiPost('/admin/students', {
      name: studentName.trim(),
      index: studentIndex.trim(),
      grade: studentGrade,
      classId: `${studentGrade.split(' ')[1] ?? '11'}-a`,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
    })
      .then(() => {
        onNotice?.({ message: `Student ${studentName.trim()} added with parent contact details.`, variant: 'success' });
        setStudentName('');
        setStudentIndex('');
        setParentName('');
        setParentPhone('');
      })
      .catch((error) => onNotice?.({ message: error instanceof Error ? error.message : 'Student was not added.', variant: 'danger' }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                  <ShieldCheck className="h-4 w-4" />
                  Student and teacher setup
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">People management</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Use this page for onboarding students and teachers only. Mark updates are handled separately on the results page.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <button
                  type="button"
                  onClick={() => setRole('super-admin')}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${role === 'super-admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Super admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${role === 'admin' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-slate-200 px-6 py-6 sm:grid-cols-2 sm:px-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active role</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{role === 'super-admin' ? 'Super admin' : 'Admin'}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Teachers onboarded</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{teacherCount}</p>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 xl:grid-cols-[0.95fr_1.05fr] sm:px-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Student onboarding</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">Add students</h2>
                </div>
                <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-700">Simple form</div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input value={studentName} onChange={(event) => setStudentName(event.target.value)} placeholder="Student name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400" />
                <input value={studentIndex} onChange={(event) => setStudentIndex(event.target.value)} placeholder="Student index" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400" />
                <select value={studentGrade} onChange={(event) => setStudentGrade(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                  {grades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
                </select>
                <input value={parentName} onChange={(event) => setParentName(event.target.value)} placeholder="Parent's name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400" />
                <input value={parentPhone} onChange={(event) => setParentPhone(event.target.value)} placeholder="Parent's phone number" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 sm:col-span-2" />
              </div>

              <button type="button" onClick={addStudent} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
                <Users className="h-4 w-4" />
                Add student
              </button>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Teacher onboarding</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">Add teachers</h2>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">Super admin only</div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="Teacher name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400" />
                <input value={teacherEmail} onChange={(event) => setTeacherEmail(event.target.value)} placeholder="Teacher email" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400" />
                <select value={teacherSubject} onChange={(event) => setTeacherSubject(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                  {subjects.map((subject) => <option key={subject.id} value={subject.name}>{subject.name}</option>)}
                </select>
                <select value={teacherGrade} onChange={(event) => setTeacherGrade(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                  {grades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
                </select>
                <input value={teacherPhone} onChange={(event) => setTeacherPhone(event.target.value)} placeholder="Phone number" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 sm:col-span-2" />
              </div>

              <button type="button" onClick={addTeacher} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                <UserPlus className="h-4 w-4" />
                Add teacher
              </button>

              <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Teachers are restricted to the super admin role.
              </p>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
