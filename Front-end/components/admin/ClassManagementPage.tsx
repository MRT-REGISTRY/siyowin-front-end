'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Plus, Search, Trash2, Users } from 'lucide-react';

import { apiDelete, apiGet, apiPost } from '@/utils/api';
import { AdminClassOption, AdminStudent, AdminTeacher } from '@/types';

type NoticeState = {
  message: string;
  variant: 'success' | 'danger' | 'info';
};

export default function ClassManagementPage() {
  const [classes, setClasses] = useState<AdminClassOption[]>([]);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [teachers, setTeachers] = useState<AdminTeacher[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [classQuery, setClassQuery] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [enrollStudentId, setEnrollStudentId] = useState('');
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showNotice = (message: string, variant: NoticeState['variant'] = 'info') => {
    setNotice({ message, variant });
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiGet<{ classes: AdminClassOption[] }>('/admin/meta'),
      apiGet<{ students: AdminStudent[] }>('/admin/students'),
      apiGet<{ teachers: AdminTeacher[] }>('/admin/teachers'),
    ])
      .then(([meta, studentData, teacherData]) => {
        setClasses(meta.classes);
        setStudents(studentData.students);
        setTeachers(teacherData.teachers);
        setSelectedClassId((current) => current || meta.classes[0]?.id || '');
        setEnrollStudentId((current) => current || studentData.students[0]?.id || '');
      })
      .catch((error) => showNotice(error instanceof Error ? error.message : 'Class data could not be loaded.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredClasses = useMemo(() => {
    const normalized = classQuery.trim().toLowerCase();
    if (!normalized) return classes;

    return classes.filter((classItem) => [
      classItem.label,
      classItem.subjectName,
      classItem.grade,
      classItem.medium,
      classItem.schedule,
    ].some((value) => (value ?? '').toLowerCase().includes(normalized)));
  }, [classQuery, classes]);

  const selectedClass = classes.find((classItem) => classItem.id === selectedClassId) ?? filteredClasses[0] ?? null;
  const selectedTeacher = teachers.find((teacher) => teacher.id === selectedClass?.teacherId);
  const allEnrolledStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students.filter((student) =>
      student.classId === selectedClass.id || student.enrollments?.some((enrollment) => enrollment.classId === selectedClass.id),
    );
  }, [selectedClass, students]);
  const enrolledStudents = useMemo(() => {
    const normalized = studentQuery.trim().toLowerCase();

    return allEnrolledStudents.filter((student) =>
      !normalized || student.name.toLowerCase().includes(normalized) || student.index.toLowerCase().includes(normalized),
    );
  }, [allEnrolledStudents, studentQuery]);
  const availableStudents = useMemo(() => {
    const enrolledStudentIds = new Set(allEnrolledStudents.map((student) => student.id));
    return students.filter((student) => !enrolledStudentIds.has(student.id));
  }, [allEnrolledStudents, students]);

  useEffect(() => {
    if (!selectedClass && filteredClasses[0]) {
      setSelectedClassId(filteredClasses[0].id);
    }
  }, [filteredClasses, selectedClass]);

  useEffect(() => {
    if (!availableStudents.some((student) => student.id === enrollStudentId)) {
      setEnrollStudentId(availableStudents[0]?.id ?? '');
    }
  }, [availableStudents, enrollStudentId]);

  const enrollStudent = () => {
    if (!selectedClass || !enrollStudentId || saving) return;

    setSaving(true);
    apiPost('/admin/enrollments', {
      studentId: enrollStudentId,
      classId: selectedClass.id,
    })
      .then(() => {
        showNotice('Student enrolled in selected class.', 'success');
        loadData();
      })
      .catch((error) => showNotice(error instanceof Error ? error.message : 'Enrollment was not added.', 'danger'))
      .finally(() => setSaving(false));
  };

  const removeEnrollment = (student: AdminStudent) => {
    if (!selectedClass || !window.confirm(`Remove ${student.name} from ${selectedClass.label}?`)) return;

    apiDelete(`/admin/enrollments?studentId=${encodeURIComponent(student.id)}&classId=${encodeURIComponent(selectedClass.id)}`)
      .then(() => {
        showNotice('Enrollment removed.', 'success');
        loadData();
      })
      .catch((error) => showNotice(error instanceof Error ? error.message : 'Enrollment was not removed.', 'danger'));
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-6 py-6 sm:px-8">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" /> Admin hub
            </Link>
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Classes and enrollments</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Manage class subjects</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Classes are the source of subjects. Enrolling a student here makes the class appear in the student subject dashboard.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Summary label="Classes" value={classes.length} />
                <Summary label="Students" value={students.length} />
                <Summary label="Enrolled here" value={enrolledStudents.length} />
              </div>
            </div>
          </div>

          {notice && (
            <div className={`mx-6 mt-6 rounded-2xl border px-4 py-3 text-sm font-medium sm:mx-8 ${notice.variant === 'danger' ? 'border-rose-200 bg-rose-50 text-rose-700' : notice.variant === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
              {notice.message}
            </div>
          )}

          {loading ? (
            <p className="px-6 py-10 text-sm text-slate-500 sm:px-8">Loading classes...</p>
          ) : (
            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.36fr_0.64fr] sm:px-8">
              <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={classQuery}
                    onChange={(event) => setClassQuery(event.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Search class, grade, subject"
                  />
                </div>

                <div className="mt-4 max-h-[34rem] space-y-2 overflow-auto">
                  {filteredClasses.map((classItem) => (
                    <button
                      key={classItem.id}
                      type="button"
                      onClick={() => setSelectedClassId(classItem.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${selectedClass?.id === classItem.id ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                      <strong className="block text-sm text-slate-900">{classItem.subjectName ?? classItem.name}</strong>
                      <span className="mt-1 block text-xs text-slate-500">{classItem.grade} - {classItem.name} - {classItem.medium}</span>
                    </button>
                  ))}
                  {filteredClasses.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">No classes matched.</p>
                  )}
                </div>
              </aside>

              <section className="space-y-6">
                {selectedClass ? (
                  <>
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                            <BookOpen className="h-4 w-4" /> Class subject
                          </div>
                          <h2 className="mt-3 text-2xl font-black text-slate-900">{selectedClass.label}</h2>
                          <p className="mt-2 text-sm text-slate-600">
                            Teacher: {selectedTeacher?.name ?? 'Unassigned'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Detail label="Subject" value={selectedClass.subjectName ?? selectedClass.name} />
                        <Detail label="Grade" value={selectedClass.grade} />
                        <Detail label="Medium" value={selectedClass.medium} />
                        <Detail label="Schedule" value={selectedClass.schedule || 'Not set'} />
                        <Detail label="Academic year" value={String(selectedClass.academicYear ?? '') || 'Not set'} />
                        <Detail label="Fee" value={selectedClass.fee !== undefined ? `Rs. ${selectedClass.fee}` : 'Not set'} />
                        <Detail label="Students" value={String(enrolledStudents.length)} />
                        <Detail label="Teacher phone" value={selectedTeacher?.phone ?? 'Not set'} />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h2 className="text-xl font-bold">Enrolled students</h2>
                          <p className="mt-1 text-sm text-slate-500">Search, review, add, or remove students from this class.</p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                          <select
                            value={enrollStudentId}
                            onChange={(event) => setEnrollStudentId(event.target.value)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                          >
                            {availableStudents.map((student) => (
                              <option key={student.id} value={student.id}>{student.name} - {student.index}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={enrollStudent}
                            disabled={!enrollStudentId || saving}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-600 disabled:opacity-60"
                          >
                            <Plus className="h-4 w-4" /> Enroll
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                          value={studentQuery}
                          onChange={(event) => setStudentQuery(event.target.value)}
                          className="w-full bg-transparent text-sm outline-none"
                          placeholder="Search enrolled students by name or index"
                        />
                      </div>

                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-100 text-xs uppercase tracking-[0.15em] text-slate-500">
                            <tr>
                              <th className="px-4 py-3">Student</th>
                              <th className="px-4 py-3">Index</th>
                              <th className="px-4 py-3">Enrollment status</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {enrolledStudents.map((student) => {
                              const enrollment = student.enrollments?.find((item) => item.classId === selectedClass.id);
                              return (
                                <tr key={student.id} className="border-t border-slate-100">
                                  <td className="px-4 py-3 font-semibold text-slate-900">{student.name}</td>
                                  <td className="px-4 py-3 text-slate-600">{student.index}</td>
                                  <td className="px-4 py-3 text-slate-600">{enrollment?.status ?? 'primary class'}</td>
                                  <td className="px-4 py-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => removeEnrollment(student)}
                                      className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700 transition hover:bg-rose-100"
                                      aria-label={`Remove ${student.name}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                            {enrolledStudents.length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No enrolled students matched this class.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
                    Select a class to view details.
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
