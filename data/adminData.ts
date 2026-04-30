import { SUBJECTS } from '@/data/dashboardData';
import {
  AdminClassOption,
  AdminExamType,
  AdminStudent,
  AdminTeacher,
  AdminSubjectOption,
} from '@/types';
import { normalizeSearchText } from '@/utils/admin';

export const ADMIN_GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] as const;

export const ADMIN_CLASSES: AdminClassOption[] = [
  { id: '9-a', grade: 'Grade 9', name: 'A', label: 'Grade 9 · A' },
  { id: '9-b', grade: 'Grade 9', name: 'B', label: 'Grade 9 · B' },
  { id: '10-a', grade: 'Grade 10', name: 'A', label: 'Grade 10 · A' },
  { id: '10-b', grade: 'Grade 10', name: 'B', label: 'Grade 10 · B' },
  { id: '11-a', grade: 'Grade 11', name: 'A', label: 'Grade 11 · A' },
  { id: '11-b', grade: 'Grade 11', name: 'B', label: 'Grade 11 · B' },
  { id: '12-a', grade: 'Grade 12', name: 'A', label: 'Grade 12 · A' },
  { id: '12-b', grade: 'Grade 12', name: 'B', label: 'Grade 12 · B' },
];

export const ADMIN_SUBJECTS: AdminSubjectOption[] = SUBJECTS.map((subject) => ({
  id: subject.id,
  name: subject.name,
  teacher: subject.teacher,
}));

export const ADMIN_EXAM_TYPES: AdminExamType[] = [
  { id: 'term-test', label: 'Term Test' },
  { id: 'day-paper', label: 'Day Paper' },
  { id: 'month-test', label: 'Month Test' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'practical', label: 'Practical' },
];

export const ADMIN_CSV_COLUMNS = [
  'student_index',
  'student_name',
  'grade',
  'class',
  'subject_id',
  'subject_name',
  'exam_type',
  'exam_name',
  'exam_date',
  'mark',
  'note',
];

export const ADMIN_CSV_SAMPLE = [
  '2026-11-012,Alex Johnson,Grade 11,A,math,Mathematics,term-test,Term Test 2,2026-05-14,91,Strong algebra',
  '2026-11-045,Sara Perera,Grade 11,A,eng,English,term-test,Term Test 2,2026-05-14,78,Good structure',
  '2026-10-018,Nimal Fernando,Grade 10,B,sci,Science,month-test,May Benchmark,2026-05-16,84,Improved lab work',
];

export const INITIAL_STUDENTS: AdminStudent[] = [
  {
    id: 'st-1',
    name: 'Alex Johnson',
    index: '2026-11-012',
    grade: 'Grade 11',
    classId: '11-a',
    marks: [
      {
        subjectId: 'math',
        subjectName: 'Mathematics',
        examType: 'term-test',
        examName: 'Term Test 2',
        examDate: '2026-05-14',
        mark: 91,
        note: 'Strong algebra',
      },
      {
        subjectId: 'eng',
        subjectName: 'English',
        examType: 'month-test',
        examName: 'May Benchmark',
        examDate: '2026-05-15',
        mark: 78,
        note: 'Good structure',
      },
    ],
  },
  {
    id: 'st-2',
    name: 'Sara Perera',
    index: '2026-11-045',
    grade: 'Grade 11',
    classId: '11-a',
    marks: [
      {
        subjectId: 'eng',
        subjectName: 'English',
        examType: 'term-test',
        examName: 'Term Test 2',
        examDate: '2026-05-14',
        mark: 78,
        note: 'Clear writing',
      },
    ],
  },
  {
    id: 'st-3',
    name: 'Nimal Fernando',
    index: '2026-10-018',
    grade: 'Grade 10',
    classId: '10-b',
    marks: [
      {
        subjectId: 'sci',
        subjectName: 'Science',
        examType: 'month-test',
        examName: 'May Benchmark',
        examDate: '2026-05-16',
        mark: 84,
        note: 'Improved lab work',
      },
    ],
  },
  {
    id: 'st-4',
    name: 'Sara Perera',
    index: '2026-12-003',
    grade: 'Grade 12',
    classId: '12-a',
    marks: [
      {
        subjectId: 'hist',
        subjectName: 'History',
        examType: 'term-test',
        examName: 'Term Test 2',
        examDate: '2026-05-18',
        mark: 87,
        note: 'Excellent recall',
      },
    ],
  },
];

export const INITIAL_TEACHERS: AdminTeacher[] = [
  {
    id: 't-1',
    name: 'Mr. Silva',
    subject: 'Mathematics',
    grade: 'Grade 11',
    email: 'silva@siyowin.edu',
    phone: '+94 77 123 4567',
  },
  {
    id: 't-2',
    name: 'Ms. Fernando',
    subject: 'Science',
    grade: 'Grade 11',
    email: 'fernando@siyowin.edu',
    phone: '+94 77 234 5678',
  },
];

export const getClassesForGrade = (grade: string) =>
  ADMIN_CLASSES.filter((classItem) => classItem.grade === grade);

export const getSubjectsForClass = (classId: string) => {
  if (!classId) return ADMIN_SUBJECTS;

  const gradeNumber = Number(classId.split('-')[0]);
  if (Number.isNaN(gradeNumber)) return ADMIN_SUBJECTS;

  if (gradeNumber >= 11) return ADMIN_SUBJECTS;
  return ADMIN_SUBJECTS.filter((subject) => subject.id !== 'hist');
};

export const filterStudents = (
  students: AdminStudent[],
  params: { grade: string; classId: string; query: string },
) => {
  const query = normalizeSearchText(params.query);

  return students.filter((student) => {
    const matchesGrade = !params.grade || student.grade === params.grade;
    const matchesClass = !params.classId || student.classId === params.classId;
    const matchesQuery =
      !query ||
      student.name.toLowerCase().includes(query) ||
      student.index.toLowerCase().includes(query);

    return matchesGrade && matchesClass && matchesQuery;
  });
};
