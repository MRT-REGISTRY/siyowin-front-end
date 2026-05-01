import { supabase } from '../config/supabase.js';
import { AdminStudent, AdminStudentMark, AdminTeacher, AuthUser, LeaderboardEntry, SubjectRecord } from '../types.js';
import {
  createStudent as createMemoryStudent,
  createTeacher as createMemoryTeacher,
  deleteMark as deleteMemoryMark,
  filterStudents as filterMemoryStudents,
  findUserByEmail as findMemoryUserByEmail,
  findUserById as findMemoryUserById,
  getDashboardOverview as getMemoryDashboardOverview,
  getLeaderboardForSubject as getMemoryLeaderboardForSubject,
  getProgressSeries,
  getStudentProfile as getMemoryStudentProfile,
  getSubjectById as getMemorySubjectById,
  getSubjectsForClass as getMemorySubjectsForClass,
  store,
  upsertMark as upsertMemoryMark,
} from './store.js';
import { demoPasswordHash } from './seed.js';

type DbUser = AuthUser & { passwordHash: string; password_hash?: string };

const isMissingTable = (error: unknown) =>
  Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      ['42P01', 'PGRST205', 'PGRST116'].includes(String((error as { code?: string }).code)),
  );

const withFallback = async <T>(query: () => Promise<T>, fallback: () => T | Promise<T>) => {
  if (!supabase) return fallback();

  try {
    return await query();
  } catch (error) {
    if (isMissingTable(error)) return fallback();
    throw error;
  }
};

export const repo = {
  async findUserByEmail(email: string) {
    return withFallback(async () => {
      const { data, error } = await supabase!
        .from('users')
        .select('id,name,email,role,student_id,teacher_id,password_hash')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();
      if (error) throw error;
      if (!data) return undefined;
      return mapUser(data);
    }, () => findMemoryUserByEmail(email));
  },

  async findUserById(id: string) {
    return withFallback(async () => {
      const { data, error } = await supabase!
        .from('users')
        .select('id,name,email,role,student_id,teacher_id,password_hash')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return undefined;
      return mapUser(data);
    }, () => findMemoryUserById(id));
  },

  async getSubjects() {
    return withFallback(async () => {
      const { data, error } = await supabase!
        .from('subjects')
        .select('id,teacher_id,grade_id,subject_name,year,is_active,created_at')
        .order('subject_name', { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapSubject);
    }, () => store.subjects);
  },

  async getEnrolledSubjects(studentId?: string) {
    if (!studentId) return this.getSubjects();
    
    return withFallback(async () => {
      // Get subject_ids from student_enrollments where is_active = true
      const { data: enrollments, error: enrollError } = await supabase!
        .from('student_enrollments')
        .select('subject_id')
        .eq('student_id', studentId)
        .eq('is_active', true);
      
      if (enrollError) throw enrollError;
      if (!enrollments || enrollments.length === 0) return [];
      
      const subjectIds = enrollments.map((e: any) => e.subject_id);
      
      // Fetch only those subjects
      const { data, error } = await supabase!
        .from('subjects')
        .select('id,teacher_id,grade_id,subject_name,year,is_active,created_at')
        .in('id', subjectIds)
        .order('subject_name', { ascending: true });
      
      if (error) throw error;
      return (data ?? []).map(mapSubject);
    }, () => {
      // Fallback: infer enrolled subjects from the student's recorded marks.
      const student = store.students.find((item) => item.id === studentId);
      if (!student) return [];

      const enrolledSubjectIds = Array.from(new Set(student.marks.map((mark) => mark.subjectId)));
      if (enrolledSubjectIds.length === 0) return store.subjects;

      return store.subjects.filter((subject) => enrolledSubjectIds.includes(subject.id));
    });
  },

  async getSubjectById(subjectId: string) {
    const subjects = await this.getSubjects();
    console.log('=======================================');
    console.log('All Subjects:', subjects);
    console.log('=======================================');
    return subjects.find((subject) => subject.id === subjectId);
  },

  async getStudentSubjectResults(studentId: string | undefined, subjectId: string) {
    if (!studentId) return [];

    return withFallback(async () => {
      const { data: enrollment, error: enrollmentError } = await supabase!
        .from('student_enrollments')
        .select('id')
        .eq('student_id', studentId)
        .eq('subject_id', subjectId)
        .eq('is_active', true)
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;
      if (!enrollment) {
        console.log(`No active enrollment found for student ${studentId} in subject ${subjectId}`);
        return [];
      }

      const { data: exams, error: examsError } = await supabase!
        .from('exams')
        .select('id,subject_id,exam_type,title,exam_date,total_marks,created_at')
        .eq('subject_id', subjectId)
        .order('exam_date', { ascending: false });

      if (examsError) throw examsError;
      const examRows = exams ?? [];
      if (examRows.length === 0) {
        console.log(`No exams found for subject ${subjectId}`);
        return [];
      }

      const examIds = examRows.map((exam) => exam.id);
      const { data: results, error: resultsError } = await supabase!
        .from('results')
        .select('id,exam_id,student_id,marks_obtained,is_absent,created_at,updated_at')
        .eq('student_id', studentId)
        .in('exam_id', examIds);

      if (resultsError) throw resultsError;

      const resultByExamId = new Map((results ?? []).map((result) => [result.exam_id, result]));
      

      return examRows
        .map((exam) => {
          const result = resultByExamId.get(exam.id);
          if (!result) return null;

          return {
            examId: exam.id,
            examTitle: exam.title,
            examType: exam.exam_type,
            examDate: exam.exam_date,
            totalMarks: exam.total_marks ?? null,
            marksObtained: result.is_absent ? null : result.marks_obtained ?? null,
            isAbsent: Boolean(result.is_absent),
            status: result.is_absent ? 'absent' : 'present',
            createdAt: result.created_at ?? exam.created_at ?? null,
            updatedAt: result.updated_at ?? null,
          };
        })
        .filter((item): item is {
          examId: string;
          examTitle: string;
          examType: string;
          examDate: string;
          totalMarks: number | null;
          marksObtained: number | null;
          isAbsent: boolean;
          status: 'present' | 'absent';
          createdAt: string | null;
          updatedAt: string | null;
        } => item !== null)
        .sort((a, b) => String(b.examDate).localeCompare(String(a.examDate)));
    }, () => {
      const student = store.students.find((item) => item.id === studentId);
      if (!student) return [];

      const enrolledSubjectIds = new Set(student.marks.map((mark) => mark.subjectId));
      if (!enrolledSubjectIds.has(subjectId)) return [];

      return student.marks
        .filter((mark) => mark.subjectId === subjectId)
        .map((mark) => ({
          examId: `${subjectId}-${mark.examType}-${mark.examName}`,
          examTitle: mark.examName,
          examType: mark.examType,
          examDate: mark.examDate,
          totalMarks: 100,
          marksObtained: mark.mark,
          isAbsent: false,
          status: 'present' as const,
          createdAt: null,
          updatedAt: null,
        }))
        .sort((a, b) => String(b.examDate).localeCompare(String(a.examDate)));
    });
  },

  async getStudentProfile(studentId?: string) {
    return withFallback(async () => {
      if (!studentId) return getMemoryStudentProfile(studentId);
      const { data, error } = await supabase!
        .from('students')
        .select('id,name,index_number,grade_id,class_id,parent_name,parent_phone')
        .eq('id', studentId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return getMemoryStudentProfile(studentId);
      const seedStudent = store.students.find((item) => item.id === data.id);
      return {
        id: data.id,
        name: data.name,
        index: data.index_number,
        grade: seedStudent?.grade ?? getGradeName(data.grade_id),
        classId: data.class_id ?? seedStudent?.classId ?? '',
        avatar: seedStudent?.name.charAt(0).toUpperCase() ?? data.name.charAt(0).toUpperCase(),
      };
    }, () => getMemoryStudentProfile(studentId));
  },

  async getOverview() {
    const subjects = await this.getSubjects();
    if (subjects.length === 0) return getMemoryDashboardOverview(); // fallback handling for empty subjects case to avoid division by zero
    const averageMark = Math.round(subjects.reduce((total, subject) => total + subject.currentMark, 0) / subjects.length);
    const bestSubject = [...subjects].sort((a, b) => b.currentMark - a.currentMark)[0]?.name ?? 'N/A';
    const homeworkDone = subjects.reduce((total, subject) => total + subject.homeworkDoneThisMonth, 0);
    const homeworkTarget = subjects.reduce((total, subject) => total + subject.homeworkTargetThisMonth, 0);
    return {
      averageMark,
      bestSubject,
      subjectsEnrolled: subjects.length,
      homeworkCompletion: homeworkTarget > 0 ? Math.round((homeworkDone / homeworkTarget) * 100) : 0,
      classRank: Math.min(...subjects.map((subject) => subject.rank)),
    };
  },

  getProgressSeries,

  async getLeaderboardForSubject(subjectId: string): Promise<LeaderboardEntry[]> {
    return withFallback<LeaderboardEntry[]>(async () => {
      const { data, error } = await supabase!
        .from('leaderboards')
        .select('rank,name,marks,avatar,badge,is_you')
        .eq('subject_id', subjectId)
        .order('rank', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((item) => ({
        rank: item.rank,
        name: item.name,
        marks: item.marks,
        avatar: item.avatar ?? undefined,
        badge: item.badge ?? null,
        isYou: item.is_you,
      }));
    }, () => getMemoryLeaderboardForSubject(subjectId) as LeaderboardEntry[]);
  },

  async getClasses() {
    return withFallback(async () => {
      const { data, error } = await supabase!.from('classes').select('id,grade,name,label').order('id');
      if (error) throw error;
      return data ?? [];
    }, () => store.classes);
  },

  async getStudents(params: { grade?: string; classId?: string; query?: string }) {
    return withFallback(async () => {
      const { data, error } = await supabase!
        .from('students')
        .select('id,name,index_number,grade_id,class_id,parent_name,parent_phone,created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const students = (data ?? []).map(mapStudent);
      const normalized = params.query?.trim().toLowerCase();
      return normalized
        ? students.filter((student) => student.name.toLowerCase().includes(normalized) || student.index.toLowerCase().includes(normalized))
        : students.filter((student) => {
            const matchesGrade = !params.grade || student.grade === params.grade;
            const matchesClass = !params.classId || student.classId === params.classId;
            return matchesGrade && matchesClass;
          });
    }, () => filterMemoryStudents(params));
  },

  async getTeachers() {
    return withFallback(async () => {
      const { data, error } = await supabase!.from('teachers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapTeacher);
    }, () => store.teachers);
  },

  async getTeacherById(teacherId?: string) {
    if (!teacherId) return undefined;
    const teachers = await this.getTeachers();
    return teachers.find((teacher) => teacher.id === teacherId);
  },

  async createStudent(input: Omit<AdminStudent, 'id' | 'marks'>) {
    return withFallback(async () => {
      const student = createMemoryStudent(input);
      const { error } = await supabase!.from('students').upsert({
        id: student.id,
        name: student.name,
        index_number: student.index,
        grade_id: resolveGradeId(student.grade),
        class_id: student.classId,
        parent_name: student.parentName,
        parent_phone: student.parentPhone,
        password_hash: demoPasswordHash,
      });
      if (error) throw error;
      return student;
    }, () => createMemoryStudent(input));
  },

  async createTeacher(input: Omit<AdminTeacher, 'id'>) {
    return withFallback(async () => {
      const teacher = createMemoryTeacher(input);
      const { error } = await supabase!.from('teachers').upsert({
        ...teacher,
        password_hash: demoPasswordHash,
      });
      if (error) throw error;
      return teacher;
    }, () => createMemoryTeacher(input));
  },

  async upsertMark(studentId: string, mark: AdminStudentMark) {
    return withFallback(async () => {
      const result = upsertMemoryMark(studentId, mark);
      if (!result) return null;
      const { error } = await supabase!.from('marks').upsert({
        student_id: result.student.id,
        subject_id: mark.subjectId,
        subject_name: mark.subjectName,
        exam_type: mark.examType,
        exam_name: mark.examName,
        exam_date: mark.examDate,
        mark: mark.mark,
        note: mark.note,
      }, { onConflict: 'student_id,subject_id,exam_type,exam_name' });
      if (error) throw error;
      return result;
    }, () => upsertMemoryMark(studentId, mark));
  },

  async deleteMark(params: { studentId: string; subjectId: string; examType: string; examName: string }) {
    return withFallback(async () => {
      const result = deleteMemoryMark(params);
      if (!result) return null;
      const { error } = await supabase!
        .from('marks')
        .delete()
        .eq('student_id', result.student.id)
        .eq('subject_id', params.subjectId)
        .eq('exam_type', params.examType)
        .eq('exam_name', params.examName);
      if (error) throw error;
      return result;
    }, () => deleteMemoryMark(params));
  },

  getSubjectsForClass(classId: string) {
    return getMemorySubjectsForClass(classId);
  },
};

const mapUser = (data: any): DbUser => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role,
  studentId: data.student_id ?? undefined,
  teacherId: data.teacher_id ?? undefined,
  passwordHash: data.password_hash,
  password_hash: data.password_hash,
});

const mapSubject = (data: any): SubjectRecord => ({
  ...getMemorySubjectById(data.id)!,
  id: data.id,
  name: getMemorySubjectById(data.id)?.name ?? data.subject_name ?? data.id,
  teacherId: data.teacher_id ?? null,
  gradeId: data.grade_id ?? null,
  subjectName: data.subject_name ?? null,
  year: data.year ?? null,
  isActive: data.is_active ?? null,
  createdAt: data.created_at ?? null,
} as SubjectRecord & {
  teacherId?: string | null;
  gradeId?: string | null;
  subjectName?: string | null;
  year?: number | null;
  isActive?: boolean | null;
  createdAt?: string | null;
});

const mapStudent = (data: any): AdminStudent => {
  const memoryStudent = store.students.find((item) => item.id === data.id);

  return {
    id: data.id,
    name: memoryStudent?.name ?? data.name,
    index: memoryStudent?.index ?? data.index_number,
    grade: memoryStudent?.grade ?? getGradeName(data.grade_id),
    classId: memoryStudent?.classId ?? data.class_id ?? '',
    parentName: memoryStudent?.parentName ?? data.parent_name ?? undefined,
    parentPhone: memoryStudent?.parentPhone ?? data.parent_phone ?? undefined,
    marks: memoryStudent?.marks ?? [],
  };
};

const mapTeacher = (data: any): AdminTeacher => ({
  id: data.id,
  name: data.name,
  subject: data.subject,
  grade: data.grade,
  email: data.email,
  phone: data.phone,
});

const getGradeName = (gradeId?: string | null) => {
  if (!gradeId) return 'Grade 11';
  const index = Number(gradeId.replace('grade-', '')) - 9;
  return Number.isNaN(index) || index < 0 || index >= store.grades.length ? 'Grade 11' : store.grades[index] ?? 'Grade 11';
};

const resolveGradeId = (gradeName: string) => {
  const normalized = gradeName.trim().toLowerCase();
  switch (normalized) {
    case 'grade 9':
      return 'grade-9';
    case 'grade 10':
      return 'grade-10';
    case 'grade 11':
      return 'grade-11';
    case 'grade 12':
      return 'grade-12';
    default:
      return 'grade-11';
  }
};
