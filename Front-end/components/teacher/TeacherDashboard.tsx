'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, LogOut, Search, Users } from 'lucide-react';
import { AdminExamType, AdminStudent, AdminSubjectOption, AdminTeacher, TeacherAssignment } from '@/types';
import { apiGet, apiPost, clearSession } from '@/utils/api';
import ProgressChart from '@/components/dashboard/ProgressChart';

type TeacherOverview = {
  studentsCount: number;
  subjectsCount: number;
  marksCount: number;
  averageMark: number;
};

type RecentMark = {
  studentId: string;
  studentName: string;
  studentIndex: string;
  subjectId: string;
  subjectName: string;
  examType: string;
  examName: string;
  examDate: string;
  mark: number;
  note?: string;
};

type StudentProgressOverview = {
  averageMark: number;
  bestSubject: string;
  subjectsCount: number;
  examsCount: number;
};

type StudentProgressPoint = {
  month: string;
  score: number;
  classAvg: number;
};

type StudentProgressResponse = {
  student: {
    id: string;
    name: string;
    index: string;
    grade: string;
    classId: string;
    term: string;
    year: number;
  };
  overview: StudentProgressOverview;
  progress: StudentProgressPoint[];
};

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<AdminTeacher | null>(null);
  const [overview, setOverview] = useState<TeacherOverview | null>(null);
  const [subjects, setSubjects] = useState<AdminSubjectOption[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [examTypes, setExamTypes] = useState<AdminExamType[]>([]);
  const [recentMarks, setRecentMarks] = useState<RecentMark[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [examName, setExamName] = useState('Class Test');
  const [examDate, setExamDate] = useState('2026-05-14');
  const [markValue, setMarkValue] = useState('');
  const [note, setNote] = useState('');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [studentProgress, setStudentProgress] = useState<StudentProgressResponse | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  const filteredStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return students;

    return students.filter((student) =>
      student.name.toLowerCase().includes(normalized) || student.index.toLowerCase().includes(normalized),
    );
  }, [query, students]);

  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId);
  const selectedStudent = students.find((student) => student.id === selectedStudentId);

  const loadDashboard = () => {
    setLoading(true);
    apiGet<{
      teacher: AdminTeacher;
      assignments: TeacherAssignment[];
      subjects: AdminSubjectOption[];
      students: AdminStudent[];
      examTypes: AdminExamType[];
      overview: TeacherOverview;
      recentMarks: RecentMark[];
    }>('/teacher/dashboard')
      .then((data) => {
        setTeacher(data.teacher);
        setAssignments(data.assignments ?? data.teacher.assignments ?? []);
        setSubjects(data.subjects);
        setStudents(data.students);
        setExamTypes(data.examTypes);
        setOverview(data.overview);
        setRecentMarks(data.recentMarks);
        setSelectedSubjectId(data.subjects[0]?.id ?? '');
        setSelectedStudentId(data.students[0]?.id ?? '');
        setSelectedExamType(data.examTypes[0]?.id ?? '');
      })
      .catch((error) => setNotice(error instanceof Error ? error.message : 'Teacher dashboard could not be loaded.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    setProgressLoading(true);
    apiGet<StudentProgressResponse>(`/teacher/students/${selectedStudentId}/progress`)
      .then((data) => setStudentProgress(data))
      .catch((error) => setNotice(error instanceof Error ? error.message : 'Student progress could not be loaded.'))
      .finally(() => setProgressLoading(false));
  }, [selectedStudentId]);

  const saveMark = () => {
    const mark = Number(markValue);

    if (!selectedStudent || !selectedSubject || !selectedExamType || Number.isNaN(mark)) {
      setNotice('Select a student, subject, exam type, and valid mark.');
      return;
    }

    apiPost('/teacher/marks', {
      studentId: selectedStudent.id,
      subjectId: selectedSubject.id,
      examType: selectedExamType,
      examName: examName.trim() || 'Class Test',
      examDate,
      mark,
      note: note.trim(),
    })
      .then(() => {
        setNotice(`Saved ${selectedSubject.name} mark for ${selectedStudent.name}.`);
        setMarkValue('');
        setNote('');
        loadDashboard();
      })
      .catch((error) => setNotice(error instanceof Error ? error.message : 'Mark could not be saved.'));
  };

  const logout = () => {
    clearSession();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        Loading teacher dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Teacher dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Welcome, {teacher?.name}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {assignments.length > 0
                ? assignments.map((assignment) => `${assignment.subject} - ${assignment.grade} - ${assignment.classId.toUpperCase()} - ${assignment.medium}`).join(', ')
                : `${teacher?.subject} - ${teacher?.grade}`}
            </p>
          </div>
          <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>

        {notice && (
          <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800">
            {notice}
          </div>
        )}

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ['Students', overview?.studentsCount ?? 0],
            ['Subjects', overview?.subjectsCount ?? 0],
            ['Marks Added', overview?.marksCount ?? 0],
            ['Average Mark', `${overview?.averageMark ?? 0}%`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-sky-700" />
              <h2 className="text-xl font-bold">Add or update marks</h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <select value={selectedSubjectId} onChange={(event) => setSelectedSubjectId(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
              <select value={selectedExamType} onChange={(event) => setSelectedExamType(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                {examTypes.map((exam) => <option key={exam.id} value={exam.id}>{exam.label}</option>)}
              </select>
              <input value={examName} onChange={(event) => setExamName(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Exam name" />
              <input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <input value={markValue} onChange={(event) => setMarkValue(event.target.value)} inputMode="numeric" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Mark" />
              <input value={note} onChange={(event) => setNote(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Optional note" />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search students" />
              </div>

              <div className="mt-3 max-h-72 space-y-2 overflow-auto">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${selectedStudentId === student.id ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <span>
                      <strong className="block text-sm text-slate-900">{student.name}</strong>
                      <span className="text-xs text-slate-500">{student.index}</span>
                    </span>
                    <Users className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <button onClick={saveMark} className="mt-5 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600">
              Save mark for {selectedStudent?.name ?? 'student'}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Recent subject marks</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-[0.15em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Exam</th>
                    <th className="px-4 py-3">Mark</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMarks.map((mark) => (
                    <tr key={`${mark.studentId}-${mark.subjectId}-${mark.examType}-${mark.examName}`} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <strong className="block text-slate-900">{mark.studentName}</strong>
                        <span className="text-xs text-slate-500">{mark.studentIndex}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{mark.examName}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{mark.mark}%</td>
                    </tr>
                  ))}
                  {recentMarks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-slate-500">No marks added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.4fr_0.6fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Student progress</h2>
            <p className="mt-1 text-sm text-slate-500">
              {selectedStudent?.name ? `Showing insights for ${selectedStudent.name}.` : 'Select a student to view progress.'}
            </p>
            {progressLoading && (
              <p className="mt-4 text-sm text-slate-500">Loading progress...</p>
            )}
            {!progressLoading && studentProgress && (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Average mark</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">{studentProgress.overview.averageMark}%</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Best subject</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{studentProgress.overview.bestSubject}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Exams tracked</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{studentProgress.overview.examsCount}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Subjects tracked</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{studentProgress.overview.subjectsCount}</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Progress tracker</h2>
            <div className="mt-4">
              {studentProgress?.progress?.length ? (
                <ProgressChart data={studentProgress.progress} />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                  No progress data yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
