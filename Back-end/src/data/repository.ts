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
        .from('app_users')
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
        .from('app_users')
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
        .select('*, subject_history(*), homeworks(*)')
        .order('display_order', { ascending: true })
        .order('display_order', { referencedTable: 'subject_history', ascending: true })
        .order('display_order', { referencedTable: 'homeworks', ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapSubject);
    }, () => store.subjects);
  },

  async getSubjectById(subjectId: string) {
    const subjects = await this.getSubjects();
    return subjects.find((subject) => subject.id === subjectId);
  },

  async getStudentProfile(studentId?: string) {
    return withFallback(async () => {
      if (!studentId) return getMemoryStudentProfile(studentId);
      const { data, error } = await supabase!
        .from('students')
        .select('id,name,index,grade,class_id')
        .eq('id', studentId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return getMemoryStudentProfile(studentId);
      return {
        id: data.id,
        name: data.name,
        index: data.index,
        grade: data.grade,
        classId: data.class_id,
        term: 'Term 2',
        year: 2026,
        avatar: data.name.charAt(0).toUpperCase(),
      };
    }, () => getMemoryStudentProfile(studentId));
  },

  async getOverview() {
    const subjects = await this.getSubjects();
    if (subjects.length === 0) return getMemoryDashboardOverview();
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
      let query = supabase!.from('students').select('*, marks(*)').order('created_at', { ascending: false });
      if (params.grade) query = query.eq('grade', params.grade);
      if (params.classId) query = query.eq('class_id', params.classId);
      const { data, error } = await query;
      if (error) throw error;
      const students = (data ?? []).map(mapStudent);
      const normalized = params.query?.trim().toLowerCase();
      return normalized
        ? students.filter((student) => student.name.toLowerCase().includes(normalized) || student.index.toLowerCase().includes(normalized))
        : students;
    }, () => filterMemoryStudents(params));
  },

  async getTeachers() {
    return withFallback(async () => {
      const { data, error } = await supabase!.from('teachers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapTeacher);
    }, () => store.teachers);
  },

  async createStudent(input: Omit<AdminStudent, 'id' | 'marks'>) {
    return withFallback(async () => {
      const student = createMemoryStudent(input);
      const { error } = await supabase!.from('students').upsert({
        id: student.id,
        name: student.name,
        index: student.index,
        grade: student.grade,
        class_id: student.classId,
        parent_name: student.parentName,
        parent_phone: student.parentPhone,
      });
      if (error) throw error;
      return student;
    }, () => createMemoryStudent(input));
  },

  async createTeacher(input: Omit<AdminTeacher, 'id'>) {
    return withFallback(async () => {
      const teacher = createMemoryTeacher(input);
      const { error } = await supabase!.from('teachers').upsert(teacher);
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
  id: data.id,
  name: data.name,
  emoji: data.emoji,
  color: data.color,
  teacher: data.teacher,
  classLabel: data.class_label,
  rank: data.rank,
  trend: data.trend,
  currentMark: data.current_mark,
  classAvg: data.class_avg,
  nextExam: data.next_exam,
  termTest: data.term_test,
  dayPaper: data.day_paper,
  monthTest: data.month_test,
  history: (data.subject_history ?? []).map((item: any) => ({
    label: item.label,
    date: item.date,
    mark: item.mark,
    note: item.note,
  })),
  homeworkDoneThisMonth: data.homework_done_this_month,
  homeworkTargetThisMonth: data.homework_target_this_month,
  recentHomeworks: (data.homeworks ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    dueDate: item.due_date,
    completedDate: item.completed_date ?? undefined,
    status: item.status,
  })),
});

const mapStudent = (data: any): AdminStudent => ({
  id: data.id,
  name: data.name,
  index: data.index,
  grade: data.grade,
  classId: data.class_id,
  parentName: data.parent_name ?? undefined,
  parentPhone: data.parent_phone ?? undefined,
  marks: (data.marks ?? []).map((mark: any) => ({
    subjectId: mark.subject_id,
    subjectName: mark.subject_name,
    examType: mark.exam_type,
    examName: mark.exam_name,
    examDate: mark.exam_date,
    mark: mark.mark,
    note: mark.note ?? undefined,
  })),
});

const mapTeacher = (data: any): AdminTeacher => ({
  id: data.id,
  name: data.name,
  subject: data.subject,
  grade: data.grade,
  email: data.email,
  phone: data.phone,
});
