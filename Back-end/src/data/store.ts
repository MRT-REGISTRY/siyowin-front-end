import {
  adminSubjects,
  classes,
  csvColumns,
  examTypes,
  grades,
  leaderboards,
  students,
  subjects,
  teachers,
  users,
} from './seed.js';
import { AdminStudent, AdminStudentMark, AdminTeacher, AuthUser, DashboardOverview, LeaderboardEntry } from '../types.js';
import { buildMarkKey, normalizeSearchText } from '../utils/marks.js';
import { createId } from '../utils/ids.js';

export const store = {
  users,
  subjects,
  students,
  teachers,
  leaderboards,
  grades,
  classes,
  adminSubjects,
  examTypes,
  csvColumns,
};

export const publicUser = (user: AuthUser): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  studentId: user.studentId,
  teacherId: user.teacherId,
});

export const findUserByEmail = (email: string) =>
  store.users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());

export const findUserById = (id: string) => store.users.find((user) => user.id === id);

export const getStudentProfile = (studentId = 'st-1') => {
  const student = store.students.find((item) => item.id === studentId) ?? store.students[0];
  return {
    id: student?.id ?? 'st-1',
    name: student?.name ?? 'Alex Johnson',
    index: student?.index ?? '2026-11-012',
    grade: student?.grade ?? 'Grade 11',
    classId: student?.classId ?? '11-a',
    // term: 'Term 2',
    // year: 2026,
    avatar: student?.name.charAt(0).toUpperCase() ?? 'A',
  };
};

export const getDashboardOverview = (): DashboardOverview => {
  const averageMark = Math.round(
    store.subjects.reduce((total, subject) => total + subject.currentMark, 0) / store.subjects.length,
  );
  const bestSubject = [...store.subjects].sort((a, b) => b.currentMark - a.currentMark)[0]?.name ?? 'N/A';
  const homeworkDone = store.subjects.reduce((total, subject) => total + subject.homeworkDoneThisMonth, 0);
  const homeworkTarget = store.subjects.reduce((total, subject) => total + subject.homeworkTargetThisMonth, 0);
  const bestRank = Math.min(...store.subjects.map((subject) => subject.rank));

  return {
    averageMark,
    bestSubject,
    subjectsEnrolled: store.subjects.length,
    homeworkCompletion: homeworkTarget > 0 ? Math.round((homeworkDone / homeworkTarget) * 100) : 0,
    classRank: bestRank,
  };
};

export const getProgressSeries = () => [
  { month: 'Jan', average: 72 },
  { month: 'Feb', average: 76 },
  { month: 'Mar', average: 81 },
  { month: 'Apr', average: 86 },
  { month: 'May', average: 89 },
];

export const getSubjectById = (subjectId: string) => store.subjects.find((subject) => subject.id === subjectId);

export const getLeaderboardForSubject = (subjectId: string): LeaderboardEntry[] =>
  store.leaderboards[subjectId] ??
  store.subjects.slice(0, 5).map((subject, index) => ({
    rank: index + 1,
    name: `${subject.name} Student ${index + 1}`,
    marks: Math.max(60, 100 - index * 3),
    avatar: subject.name.charAt(0),
  }));

export const getClassesForGrade = (grade: string) => store.classes.filter((classItem) => classItem.grade === grade);

export const getSubjectsForClass = (classId: string) => {
  if (!classId) return store.adminSubjects;

  const gradeNumber = Number(classId.split('-')[0]);
  if (Number.isNaN(gradeNumber)) return store.adminSubjects;

  if (gradeNumber >= 11) return store.adminSubjects;
  return store.adminSubjects.filter((subject) => subject.id !== 'hist');
};

export const filterStudents = (params: { grade?: string; classId?: string; query?: string }) => {
  const query = normalizeSearchText(params.query ?? '');

  return store.students.filter((student) => {
    const matchesGrade = !params.grade || student.grade === params.grade;
    const matchesClass = !params.classId || student.classId === params.classId;
    const matchesQuery =
      !query ||
      student.name.toLowerCase().includes(query) ||
      student.index.toLowerCase().includes(query);

    return matchesGrade && matchesClass && matchesQuery;
  });
};

export const createStudent = (input: Omit<AdminStudent, 'id' | 'marks'> & { marks?: AdminStudentMark[] }) => {
  const student: AdminStudent = {
    id: createId('st'),
    name: input.name,
    index: input.index,
    grade: input.grade,
    classId: input.classId,
    parentName: input.parentName,
    parentPhone: input.parentPhone,
    marks: input.marks ?? [],
  };

  store.students.unshift(student);
  return student;
};

export const createTeacher = (input: Omit<AdminTeacher, 'id'>) => {
  const teacher: AdminTeacher = {
    id: createId('t'),
    ...input,
  };

  store.teachers.unshift(teacher);
  return teacher;
};

export const upsertMark = (studentId: string, mark: AdminStudentMark) => {
  const student = store.students.find((item) => item.id === studentId || item.index === studentId);
  if (!student) return null;

  const markKey = buildMarkKey(mark.subjectId, mark.examType, mark.examName);
  const existingIndex = student.marks.findIndex(
    (item) => buildMarkKey(item.subjectId, item.examType, item.examName) === markKey,
  );

  if (existingIndex >= 0) {
    student.marks[existingIndex] = mark;
    return { student, mark, action: 'updated' as const };
  }

  student.marks.unshift(mark);
  return { student, mark, action: 'created' as const };
};

export const deleteMark = (params: {
  studentId: string;
  subjectId: string;
  examType: string;
  examName: string;
}) => {
  const student = store.students.find((item) => item.id === params.studentId || item.index === params.studentId);
  if (!student) return null;

  const markKey = buildMarkKey(params.subjectId, params.examType, params.examName);
  const beforeCount = student.marks.length;
  student.marks = student.marks.filter(
    (item) => buildMarkKey(item.subjectId, item.examType, item.examName) !== markKey,
  );

  return { student, deleted: student.marks.length < beforeCount };
};
