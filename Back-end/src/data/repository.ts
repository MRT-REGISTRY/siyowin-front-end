import { supabase } from '../config/supabase.js';
import { AdminStudent, AdminStudentMark, AdminTeacher, AuthUser, LeaderboardEntry, RegisteredUser, SubjectRecord, TeacherAssignment } from '../types.js';
import { createId } from '../utils/ids.js';
import {
  createUser as createMemoryUser,
  createClass as createMemoryClass,
  createStudentEnrollment as createMemoryStudentEnrollment,
  createStudent as createMemoryStudent,
  createTeacher as createMemoryTeacher,
  deleteClass as deleteMemoryClass,
  deleteMark as deleteMemoryMark,
  deleteStudent as deleteMemoryStudent,
  deleteStudentEnrollment as deleteMemoryStudentEnrollment,
  deleteTeacher as deleteMemoryTeacher,
  deleteUser as deleteMemoryUser,
  filterStudents as filterMemoryStudents,
  findUserByEmail as findMemoryUserByEmail,
  findUserById as findMemoryUserById,
  getDashboardOverview as getMemoryDashboardOverview,
  getStudentProfile as getMemoryStudentProfile,
  getSubjectById as getMemorySubjectById,
  getSubjectsForClass as getMemorySubjectsForClass,
  getStudentEnrollments as getMemoryStudentEnrollments,
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
      ['42P01', '42703', 'PGRST204', 'PGRST205', 'PGRST116'].includes(String((error as { code?: string }).code)),
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
      const identifier = email.trim().toLowerCase();
      const { data, error } = await supabase!
        .from('users')
        .select('id,name,username,email,role,student_id,teacher_id,password_hash,is_active')
        .or(`email.eq.${identifier},username.eq.${identifier}`)
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
        .select('id,name,username,email,role,student_id,teacher_id,password_hash,is_active')
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
      const { data: enrollments, error: enrollError } = await supabase!
        .from('student_enrollments')
        .select('subject_id,class_id,status')
        .eq('student_id', studentId)
        .eq('status', 'active');
      
      if (enrollError) throw enrollError;
      if (!enrollments || enrollments.length === 0) return [];
      
      const subjectIds = enrollments
        .map((e: any) => e.subject_id)
        .filter((value: string | null | undefined): value is string => Boolean(value));
      if (subjectIds.length === 0) return [];
      
      // Fetch only those subjects
      const { data, error } = await supabase!
        .from('subjects')
        .select('id,teacher_id,grade_id,subject_name,year,is_active,created_at')
        .in('id', subjectIds)
        .order('subject_name', { ascending: true });
      
      if (error) throw error;
      return (data ?? []).map(mapSubject);
    }, () => {
      const enrolledSubjectIds = Array.from(new Set(getMemoryStudentEnrollments(studentId).map((item) => item.subjectId)));
      if (enrolledSubjectIds.length === 0) {
        const student = store.students.find((item) => item.id === studentId);
        if (!student) return [];
        const classSubjectIds = store.classes
          .filter((classItem) => classItem.id === student.classId)
          .map((classItem) => classItem.subjectId)
          .filter((subjectId): subjectId is string => Boolean(subjectId));
        if (classSubjectIds.length > 0) return store.subjects.filter((subject) => classSubjectIds.includes(subject.id));
        const markSubjectIds = Array.from(new Set(student.marks.map((mark) => mark.subjectId)));
        if (markSubjectIds.length === 0) return store.subjects;
        return store.subjects.filter((subject) => markSubjectIds.includes(subject.id));
      }

      return store.subjects.filter((subject) => enrolledSubjectIds.includes(subject.id));
    });
  },

  async getSubjectById(subjectId: string) {
    const subjects = await this.getSubjects();
    return subjects.find((subject) => subject.id === subjectId);
  },

  async getStudentSubjectResults(studentId: string | undefined, subjectId: string) {
    if (!studentId) return [];

    return withFallback(async () => {
      const { data: enrollment, error: enrollmentError } = await supabase!
        .from('student_enrollments')
        .select('id,class_id')
        .eq('student_id', studentId)
        .eq('subject_id', subjectId)
        .eq('status', 'active')
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;
      if (!enrollment) {
        return [];
      }

      const { data: exams, error: examsError } = await supabase!
        .from('exams')
        .select('id,subject_id,class_id,exam_type,title,exam_date,total_marks,created_at')
        .eq('subject_id', subjectId)
        .eq('class_id', enrollment.class_id)
        .order('exam_date', { ascending: false });

      if (examsError) throw examsError;
      const examRows = exams ?? [];
      if (examRows.length === 0) {
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
        .filter((mark) => mark.subjectId === subjectId && (!mark.classId || mark.classId === student.classId))
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
      if (!studentId) return undefined;
      const { data, error } = await supabase!
        .from('students')
        .select('id,name,index_number,date_of_birth,class_id,parent_name,parent_phone')
        .eq('id', studentId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return undefined;
      const seedStudent = store.students.find((item) => item.id === data.id);
      const classItem = (await this.getClasses()).find((item) => item.id === data.class_id);
      const termInfo = resolveTermInfo(classItem?.academicYear);
      return {
        id: data.id,
        name: data.name,
        index: data.index_number,
        dateOfBirth: seedStudent?.dateOfBirth ?? data.date_of_birth ?? undefined,
        grade: seedStudent?.grade ?? classItem?.grade ?? 'Unassigned',
        classId: data.class_id ?? seedStudent?.classId ?? '',
        avatar: seedStudent?.name.charAt(0).toUpperCase() ?? data.name.charAt(0).toUpperCase(),
        term: termInfo.term,
        year: termInfo.year,
      };
    }, () => {
      const memoryProfile = getMemoryStudentProfile(studentId);
      if (!memoryProfile) return undefined;
      const classItem = store.classes.find((item) => item.id === memoryProfile.classId);
      const termInfo = resolveTermInfo(classItem?.academicYear);
      return {
        ...memoryProfile,
        term: termInfo.term,
        year: termInfo.year,
      };
    });
  },

  async getOverview(subjects?: SubjectRecord[]) {
    const targetSubjects = subjects ?? await this.getSubjects();
    if (targetSubjects.length === 0) return getMemoryDashboardOverview();
    const averageMark = Math.round(targetSubjects.reduce((total, subject) => total + subject.currentMark, 0) / targetSubjects.length);
    const bestSubject = [...targetSubjects].sort((a, b) => b.currentMark - a.currentMark)[0]?.name ?? 'N/A';
    const homeworkDone = targetSubjects.reduce((total, subject) => total + subject.homeworkDoneThisMonth, 0);
    const homeworkTarget = targetSubjects.reduce((total, subject) => total + subject.homeworkTargetThisMonth, 0);
    return {
      averageMark,
      bestSubject,
      subjectsEnrolled: targetSubjects.length,
      homeworkCompletion: homeworkTarget > 0 ? Math.round((homeworkDone / homeworkTarget) * 100) : 0,
      classRank: Math.min(...targetSubjects.map((subject) => subject.rank)),
    };
  },

  async getStudentProgressSeries(studentId?: string) {
    if (!studentId) return buildEmptyProgressSeries();

    return withFallback(async () => {
      const classId = await this.getStudentClassId(studentId);
      if (!classId) return buildEmptyProgressSeries();

      const { data: exams, error: examError } = await supabase!
        .from('exams')
        .select('id,exam_date')
        .eq('class_id', classId);
      if (examError) throw examError;
      const examRows = exams ?? [];
      if (examRows.length === 0) return buildEmptyProgressSeries();

      const examIds = examRows.map((exam) => exam.id);
      const { data: results, error: resultError } = await supabase!
        .from('results')
        .select('exam_id,student_id,marks_obtained,is_absent')
        .in('exam_id', examIds);
      if (resultError) throw resultError;

      return buildProgressSeries(examRows, results ?? [], studentId);
    }, () => buildProgressSeriesFromMemory(studentId));
  },

  async getStudentPerformanceSummary(studentId?: string) {
    if (!studentId) return buildEmptyPerformanceSummary();

    return withFallback(async () => {
      const classId = await this.getStudentClassId(studentId);
      if (!classId) return buildEmptyPerformanceSummary();

      const { data: exams, error: examError } = await supabase!
        .from('exams')
        .select('id,subject_id')
        .eq('class_id', classId);
      if (examError) throw examError;
      const examRows = exams ?? [];
      if (examRows.length === 0) return buildEmptyPerformanceSummary();

      const examIds = examRows.map((exam) => exam.id);
      const { data: results, error: resultError } = await supabase!
        .from('results')
        .select('exam_id,student_id,marks_obtained,is_absent')
        .eq('student_id', studentId)
        .in('exam_id', examIds);
      if (resultError) throw resultError;

      return buildPerformanceSummary(examRows, results ?? []);
    }, () => buildPerformanceSummaryFromMemory(studentId));
  },

  async getLeaderboardForSubject(subjectId: string, classId?: string, viewerStudentId?: string): Promise<LeaderboardEntry[]> {
    if (!classId) return [];

    return withFallback<LeaderboardEntry[]>(async () => {
      const { data: exams, error: examError } = await supabase!
        .from('exams')
        .select('id')
        .eq('subject_id', subjectId)
        .eq('class_id', classId);
      if (examError) throw examError;
      const examRows = exams ?? [];
      if (examRows.length === 0) return [];

      const examIds = examRows.map((exam) => exam.id);
      const { data: results, error: resultError } = await supabase!
        .from('results')
        .select('exam_id,student_id,marks_obtained,is_absent')
        .in('exam_id', examIds);
      if (resultError) throw resultError;

      const studentIds = Array.from(new Set((results ?? []).map((item) => item.student_id)));
      if (studentIds.length === 0) return [];

      const { data: students, error: studentError } = await supabase!
        .from('students')
        .select('id,name')
        .in('id', studentIds);
      if (studentError) throw studentError;

      return buildLeaderboardEntries(results ?? [], students ?? [], viewerStudentId);
    }, () => buildLeaderboardFromMemory(subjectId, classId, viewerStudentId));
  },

  async getClasses() {
    return withFallback(async () => {
      const { data, error } = await supabase!
        .from('classes')
        .select('id,grade,name,label,medium,subject_id,subject_name,academic_year,schedule,fee,is_active')
        .order('id');
      if (error) throw error;
      return (data ?? []).map(mapClass);
    }, () => store.classes);
  },

  async getStudentEnrollmentOptions() {
    return withFallback(async () => {
      const [classes, subjects, teachers] = await Promise.all([
        this.getClasses(),
        this.getSubjects(),
        this.getTeachers(),
      ]);

      const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
      const teacherById = new Map(teachers.map((teacher) => [teacher.id, teacher]));

      return classes
        .map((classItem) => {
          const linkedSubject = classItem.subjectId ? subjectById.get(classItem.subjectId) : undefined;
          const teacherName = linkedSubject?.teacherId ? teacherById.get(linkedSubject.teacherId)?.name : undefined;
          const subjectName = linkedSubject?.name ?? classItem.subjectName ?? classItem.label;

          return {
            id: classItem.id,
            grade: classItem.grade,
            medium: classItem.medium,
            subjectId: classItem.subjectId ?? linkedSubject?.id ?? undefined,
            subjectName,
            teacherName: teacherName ?? 'Unassigned teacher',
          };
        })
        .filter((option) => Boolean(option.subjectId));
    }, () => {
      const teacherByName = new Map(store.teachers.map((teacher) => [teacher.id, teacher.name]));
      return store.classes
        .map((classItem) => {
          const subject = store.subjects.find((item) => item.id === classItem.subjectId);
          const teacherName = subject?.teacherId ? teacherByName.get(subject.teacherId) : undefined;
          return {
            id: classItem.id,
            grade: classItem.grade,
            medium: classItem.medium,
            subjectId: classItem.subjectId ?? subject?.id ?? undefined,
            subjectName: subject?.name ?? classItem.subjectName ?? classItem.label,
            teacherName: teacherName ?? 'Unassigned teacher',
          };
        })
        .filter((option) => Boolean(option.subjectId));
    });
  },

  async getRegisteredUsers(): Promise<RegisteredUser[]> {
    return withFallback(async () => {
      const { data, error } = await supabase!
        .from('users')
        .select('id,name,username,email,role,student_id,teacher_id,is_active,created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return uniqueBy((data ?? []).map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username ?? user.email,
        email: user.email,
        role: user.role,
        studentId: user.student_id ?? undefined,
        teacherId: user.teacher_id ?? undefined,
        isActive: user.is_active ?? true,
        linkedName: user.name,
      })), (user) => user.username.toLowerCase());
    }, () => uniqueBy(store.users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      teacherId: user.teacherId,
      isActive: user.isActive ?? true,
      linkedName: user.name,
    })), (user) => user.username.toLowerCase()));
  },

  async getStudents(params: { grade?: string; classId?: string; query?: string }) {
    return withFallback(async () => {
      const { data, error } = await supabase!
        .from('students')
        .select('id,name,index_number,date_of_birth,class_id,parent_name,parent_phone,created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const students = uniqueBy((data ?? []).map(mapStudent), (student) => student.index.toLowerCase());
      const normalized = params.query?.trim().toLowerCase();
      return normalized
        ? students.filter((student) => student.name.toLowerCase().includes(normalized) || student.index.toLowerCase().includes(normalized))
        : students.filter((student) => {
            const matchesGrade = !params.grade || student.grade === params.grade;
            const matchesClass = !params.classId || student.classId === params.classId;
            return matchesGrade && matchesClass;
          });
    }, () => uniqueBy(filterMemoryStudents(params), (student) => student.index.toLowerCase()));
  },

  async getTeachers() {
    return withFallback(async () => {
      const { data, error } = await supabase!.from('teachers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return uniqueBy((data ?? []).map(mapTeacher), (teacher) => teacher.email.toLowerCase());
    }, () => uniqueBy(store.teachers, (teacher) => teacher.email.toLowerCase()));
  },

  async getTeacherById(teacherId?: string) {
    if (!teacherId) return undefined;
    const teachers = await this.getTeachers();
    return teachers.find((teacher) => teacher.id === teacherId);
  },

  async createClass(input: { grade: string; name: string; label: string; medium: string; subjectId?: string; subjectName?: string; academicYear?: number; schedule?: string; fee?: number }) {
    return withFallback(async () => {
      const classItem = buildClass(input);
      const { error } = await supabase!.from('classes').upsert({
        id: classItem.id,
        grade: classItem.grade,
        name: classItem.name,
        label: classItem.label,
        medium: classItem.medium,
        subject_id: classItem.subjectId ?? null,
        subject_name: classItem.subjectName ?? null,
        academic_year: classItem.academicYear ?? new Date().getFullYear(),
        schedule: classItem.schedule ?? null,
        fee: classItem.fee ?? null,
        is_active: classItem.isActive ?? true,
      });
      if (error) {
        if (isMissingTable(error)) {
          const { error: retryError } = await supabase!.from('classes').upsert({
            id: classItem.id,
            grade: classItem.grade,
            name: classItem.name,
            label: classItem.label,
            medium: classItem.medium,
          });
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }
      if (classItem.subjectId && classItem.subjectName) {
        try {
          const { error: subjectError } = await supabase!.from('subjects').upsert({
            id: classItem.subjectId,
            subject_name: classItem.subjectName,
            year: classItem.academicYear ?? new Date().getFullYear(),
            is_active: true,
          });
          if (subjectError) throw subjectError;
        } catch (subjectError) {
          if (!isMissingTable(subjectError)) throw subjectError;
        }
      }
      return classItem;
    }, () => createMemoryClass(input));
  },

  async createStudent(input: Omit<AdminStudent, 'id' | 'marks' | 'grade'> & { grade?: string }) {
    return withFallback(async () => {
      const student = buildStudent(input);
      const { error } = await supabase!.from('students').upsert({
        id: student.id,
        name: student.name,
        index_number: student.index,
        date_of_birth: student.dateOfBirth ?? null,
        class_id: student.classId,
        parent_name: student.parentName,
        parent_phone: student.parentPhone,
        password_hash: demoPasswordHash,
      });
      if (error) {
        if (isMissingTable(error)) {
          const { error: retryError } = await supabase!.from('students').upsert({
            id: student.id,
            name: student.name,
            index_number: student.index,
            class_id: student.classId,
            parent_name: student.parentName,
            parent_phone: student.parentPhone,
            password_hash: demoPasswordHash,
          });
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }
      const classItem = (await this.getClasses()).find((item) => item.id === student.classId);
      if (classItem?.subjectId) {
        const enrollment = buildEnrollment({
          studentId: student.id,
          classId: classItem.id,
          subjectId: classItem.subjectId,
          academicYear: classItem.academicYear ?? new Date().getFullYear(),
        });
        try {
          const { error: enrollmentError } = await supabase!.from('student_enrollments').upsert({
            id: enrollment.id,
            student_id: enrollment.studentId,
            class_id: enrollment.classId,
            subject_id: enrollment.subjectId,
            academic_year: enrollment.academicYear,
            status: enrollment.status,
            enrolled_at: enrollment.enrolledAt,
          }, { onConflict: 'student_id,class_id' });
          if (enrollmentError) throw enrollmentError;
        } catch (enrollmentError) {
          if (!isMissingTable(enrollmentError)) throw enrollmentError;
        }
      }
      return student;
    }, () => createMemoryStudent(input));
  },

  async createStudentWithUser(input: {
    student: Omit<AdminStudent, 'id' | 'marks' | 'grade'> & { grade?: string };
    user: {
      username: string;
      email: string;
      passwordHash: string;
      isActive?: boolean;
    };
  }) {
    return withFallback(async () => {
      const student = buildStudent(input.student);
      const normalizedDateOfBirth = typeof student.dateOfBirth === 'string' && student.dateOfBirth.trim()
        ? student.dateOfBirth.trim()
        : null;
      const user = buildUser({
        name: student.name,
        username: input.user.username.trim().toLowerCase(),
        email: input.user.email.trim().toLowerCase(),
        role: 'student',
        studentId: student.id,
        passwordHash: input.user.passwordHash,
        isActive: input.user.isActive ?? true,
      });

      const { error } = await supabase!.rpc('create_student_with_user', {
        p_student_id: student.id,
        p_student_name: student.name,
        p_index_number: student.index,
        p_date_of_birth: normalizedDateOfBirth,
        p_class_id: student.classId,
        p_parent_name: student.parentName ?? null,
        p_parent_phone: student.parentPhone ?? null,
        p_student_password_hash: demoPasswordHash,
        p_user_id: user.id,
        p_username: user.username,
        p_email: user.email,
        p_user_password_hash: user.passwordHash,
        p_is_active: user.isActive ?? true,
      });

      if (error) {
        const code = String((error as { code?: string }).code ?? '');
        const message = String((error as { message?: string }).message ?? '').toLowerCase();

        // Fall back to non-RPC flow if the function is not deployed yet.
        if (code === 'PGRST202' || message.includes('create_student_with_user')) {
          const fallbackStudent = await this.createStudent(input.student);
          const fallbackUser = await this.createUser({
            name: fallbackStudent.name,
            username: input.user.username.trim().toLowerCase(),
            email: input.user.email.trim().toLowerCase(),
            role: 'student',
            studentId: fallbackStudent.id,
            passwordHash: input.user.passwordHash,
            isActive: input.user.isActive ?? true,
          });

          return { student: fallbackStudent, user: fallbackUser };
        }

        throw error;
      }

      return {
        student,
        user: mapUser({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          student_id: user.studentId,
          teacher_id: null,
          password_hash: user.passwordHash,
          is_active: user.isActive,
        }),
      };
    }, () => {
      const student = createMemoryStudent(input.student);
      const user = createMemoryUser({
        name: student.name,
        username: input.user.username.trim().toLowerCase(),
        email: input.user.email.trim().toLowerCase(),
        role: 'student',
        studentId: student.id,
        passwordHash: input.user.passwordHash,
        isActive: input.user.isActive ?? true,
      });

      return { student, user };
    });
  },

  async enrollStudent(input: { studentId: string; classId: string }) {
    return withFallback(async () => {
      const classItem = (await this.getClasses()).find((item) => item.id === input.classId);
      if (!classItem?.subjectId) return null;
      const enrollment = buildEnrollment({
        studentId: input.studentId,
        classId: input.classId,
        subjectId: classItem.subjectId,
        academicYear: classItem.academicYear ?? new Date().getFullYear(),
      });
      const { error } = await supabase!.from('student_enrollments').upsert({
        id: enrollment.id,
        student_id: enrollment.studentId,
        class_id: enrollment.classId,
        subject_id: enrollment.subjectId,
        academic_year: enrollment.academicYear,
        status: enrollment.status,
        enrolled_at: enrollment.enrolledAt,
      }, { onConflict: 'student_id,subject_id' });
      if (error) throw error;

      const { error: studentUpdateError } = await supabase!
        .from('students')
        .update({ class_id: enrollment.classId })
        .eq('id', enrollment.studentId);
      if (studentUpdateError && !isMissingTable(studentUpdateError)) throw studentUpdateError;

      return enrollment;
    }, () => {
      const classItem = store.classes.find((item) => item.id === input.classId);
      if (!classItem?.subjectId) return null;
      return createMemoryStudentEnrollment({
        studentId: input.studentId,
        classId: input.classId,
        subjectId: classItem.subjectId,
        academicYear: classItem.academicYear ?? new Date().getFullYear(),
      });
    });
  },

  async createTeacher(input: Omit<AdminTeacher, 'id'>) {
    return withFallback(async () => {
      const teacher = buildTeacher(input);
      const { error } = await supabase!.from('teachers').upsert({
        id: teacher.id,
        name: teacher.name,
        subject: teacher.subject,
        grade: teacher.grade,
        email: teacher.email,
        phone: teacher.phone,
        assigned_subjects: teacher.assignments,
        password_hash: demoPasswordHash,
      });
      if (error) {
        if (isMissingTable(error)) {
          const { error: retryError } = await supabase!.from('teachers').upsert({
            id: teacher.id,
            name: teacher.name,
            subject: teacher.subject,
            email: teacher.email,
            phone: teacher.phone,
            password_hash: demoPasswordHash,
          });
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }
      const classAssignments = teacher.assignments
        .filter((assignment) => assignment.classId)
        .map((assignment) => ({
          id: `${teacher.id}-${assignment.classId}`,
          teacher_id: teacher.id,
          class_id: assignment.classId,
          subject_id: slugify(assignment.subject),
          role: 'primary',
          is_active: true,
        }));
      if (classAssignments.length > 0) {
        try {
          const { error: assignmentError } = await supabase!
            .from('teacher_class_assignments')
            .upsert(classAssignments, { onConflict: 'teacher_id,class_id' });
          if (assignmentError) throw assignmentError;
        } catch (assignmentError) {
          if (!isMissingTable(assignmentError)) throw assignmentError;
        }
      }
      return teacher;
    }, () => createMemoryTeacher(input));
  },

  async createUser(input: Omit<AuthUser, 'id' | 'isActive'> & { passwordHash: string; isActive?: boolean }) {
    return withFallback(async () => {
      const user = buildUser(input);
      const { error } = await supabase!.from('users').upsert({
        id: user.id,
        name: user.name,
        username: user.username.trim().toLowerCase(),
        email: user.email.trim().toLowerCase(),
        password_hash: user.passwordHash,
        role: user.role,
        student_id: user.studentId ?? null,
        teacher_id: user.teacherId ?? null,
        is_active: user.isActive ?? true,
      });
      if (error) throw error;
      return mapUser({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        student_id: user.studentId,
        teacher_id: user.teacherId,
        password_hash: user.passwordHash,
        is_active: user.isActive,
      });
    }, () => createMemoryUser(input));
  },

  async deleteUser(userId: string) {
    return withFallback(async () => {
      const { data: existing, error: lookupError } = await supabase!
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (!existing) return false;

      const { error } = await supabase!.from('users').delete().eq('id', userId);
      if (error) throw error;
      return true;
    }, () => deleteMemoryUser(userId));
  },

  async deleteStudent(studentId: string) {
    return withFallback(async () => {
      const { data: existing, error: lookupError } = await supabase!
        .from('students')
        .select('id')
        .eq('id', studentId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (!existing) return false;

      const { error: userError } = await supabase!.from('users').delete().eq('student_id', studentId);
      if (userError) throw userError;
      const { error: enrollmentError } = await supabase!.from('student_enrollments').delete().eq('student_id', studentId);
      if (enrollmentError && !isMissingTable(enrollmentError)) throw enrollmentError;
      const { error } = await supabase!.from('students').delete().eq('id', studentId);
      if (error) throw error;
      return true;
    }, () => deleteMemoryStudent(studentId));
  },

  async deleteTeacher(teacherId: string) {
    return withFallback(async () => {
      const { data: existing, error: lookupError } = await supabase!
        .from('teachers')
        .select('id')
        .eq('id', teacherId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (!existing) return false;

      const { error: userError } = await supabase!.from('users').delete().eq('teacher_id', teacherId);
      if (userError) throw userError;
      const { error: assignmentError } = await supabase!.from('teacher_class_assignments').delete().eq('teacher_id', teacherId);
      if (assignmentError && !isMissingTable(assignmentError)) throw assignmentError;
      const { error } = await supabase!.from('teachers').delete().eq('id', teacherId);
      if (error) throw error;
      return true;
    }, () => deleteMemoryTeacher(teacherId));
  },

  async deleteClass(classId: string) {
    return withFallback(async () => {
      const { data: existing, error: lookupError } = await supabase!
        .from('classes')
        .select('id')
        .eq('id', classId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (!existing) return false;

      const { error: assignmentError } = await supabase!.from('teacher_class_assignments').delete().eq('class_id', classId);
      if (assignmentError && !isMissingTable(assignmentError)) throw assignmentError;
      const { error: enrollmentError } = await supabase!.from('student_enrollments').delete().eq('class_id', classId);
      if (enrollmentError && !isMissingTable(enrollmentError)) throw enrollmentError;

      const { data: exams, error: examLookupError } = await supabase!.from('exams').select('id').eq('class_id', classId);
      if (examLookupError && !isMissingTable(examLookupError)) throw examLookupError;
      const examIds = (exams ?? []).map((exam) => exam.id);
      if (examIds.length > 0) {
        const { error: resultError } = await supabase!.from('results').delete().in('exam_id', examIds);
        if (resultError && !isMissingTable(resultError)) throw resultError;
        const { error: examDeleteError } = await supabase!.from('exams').delete().in('id', examIds);
        if (examDeleteError && !isMissingTable(examDeleteError)) throw examDeleteError;
      }

      const { error } = await supabase!.from('classes').delete().eq('id', classId);
      if (error) throw error;
      return true;
    }, () => deleteMemoryClass(classId));
  },

  async deleteEnrollment(params: { studentId: string; classId: string }) {
    return withFallback(async () => {
      const { data: existing, error: lookupError } = await supabase!
        .from('student_enrollments')
        .select('id')
        .eq('student_id', params.studentId)
        .eq('class_id', params.classId);
      if (lookupError) throw lookupError;
      if (!existing || existing.length === 0) return false;

      const { error } = await supabase!
        .from('student_enrollments')
        .delete()
        .eq('student_id', params.studentId)
        .eq('class_id', params.classId);
      if (error) throw error;
      return true;
    }, () => deleteMemoryStudentEnrollment(params));
  },

  async upsertMark(studentId: string, mark: AdminStudentMark) {
    return withFallback(async () => {
      const result = upsertMemoryMark(studentId, mark);
      if (!result) return null;
      const examId = `${mark.classId ?? 'class'}-${mark.subjectId}-${slugify(mark.examType)}-${slugify(mark.examName)}`;
      const { error: examError } = await supabase!.from('exams').upsert({
        id: examId,
        class_id: mark.classId ?? result.student.classId,
        subject_id: mark.subjectId,
        exam_type: mark.examType,
        title: mark.examName,
        exam_date: mark.examDate,
        total_marks: 100,
      });
      if (examError) throw examError;
      const { error: resultError } = await supabase!.from('results').upsert({
        id: `${examId}-${result.student.id}`,
        exam_id: examId,
        student_id: result.student.id,
        marks_obtained: mark.mark,
        is_absent: false,
      }, { onConflict: 'exam_id,student_id' });
      if (resultError) throw resultError;
      return result;
    }, () => upsertMemoryMark(studentId, mark));
  },

  async deleteMark(params: { studentId: string; subjectId: string; examType: string; examName: string }) {
    return withFallback(async () => {
      const result = deleteMemoryMark(params);
      if (!result) return null;
      const examIdPattern = `%-${params.subjectId}-${slugify(params.examType)}-${slugify(params.examName)}`;
      const { data: exams, error: examLookupError } = await supabase!
        .from('exams')
        .select('id')
        .eq('subject_id', params.subjectId)
        .eq('exam_type', params.examType)
        .eq('title', params.examName)
        .like('id', examIdPattern);
      if (examLookupError) throw examLookupError;
      const examIds = (exams ?? []).map((exam) => exam.id);
      if (examIds.length === 0) return result;
      const { error } = await supabase!
        .from('results')
        .delete()
        .eq('student_id', result.student.id)
        .in('exam_id', examIds);
      if (error) throw error;
      return result;
    }, () => deleteMemoryMark(params));
  },

  getSubjectsForClass(classId: string) {
    return withFallback(async () => {
      const { data: classRow, error } = await supabase!
        .from('classes')
        .select('subject_id,subject_name')
        .eq('id', classId)
        .maybeSingle();
      if (error) throw error;
      if (!classRow?.subject_id) return [];

      const { data: subjectRow, error: subjectError } = await supabase!
        .from('subjects')
        .select('id,subject_name,teacher_id')
        .eq('id', classRow.subject_id)
        .maybeSingle();
      if (subjectError && !isMissingTable(subjectError)) throw subjectError;

      return [
        {
          id: classRow.subject_id,
          name: subjectRow?.subject_name ?? classRow.subject_name ?? classRow.subject_id,
          teacher: subjectRow?.teacher_id ? `Teacher ${subjectRow.teacher_id}` : 'Unassigned',
        },
      ];
    }, () => getMemorySubjectsForClass(classId));
  },
  async getStudentClassId(studentId: string) {
    return withFallback(async () => {
      const { data, error } = await supabase!
        .from('students')
        .select('class_id')
        .eq('id', studentId)
        .maybeSingle();
      if (error) throw error;
      return data?.class_id ?? undefined;
    }, () => store.students.find((item) => item.id === studentId)?.classId);
  },
};

const mapUser = (data: any): DbUser => ({
  id: data.id,
  name: data.name,
  username: data.username ?? data.email,
  email: data.email,
  role: data.role,
  studentId: data.student_id ?? undefined,
  teacherId: data.teacher_id ?? undefined,
  isActive: data.is_active ?? true,
  passwordHash: data.password_hash,
  password_hash: data.password_hash,
});

const mapSubject = (data: any): SubjectRecord => {
  const memorySubject = getMemorySubjectById(data.id);
  const fallbackSubject = memorySubject ?? buildSubjectDefaults(data);

  return {
    ...fallbackSubject,
    id: data.id,
    name: memorySubject?.name ?? data.subject_name ?? data.id,
    teacherId: data.teacher_id ?? null,
    gradeId: data.grade_id ?? null,
    subjectName: data.subject_name ?? null,
    year: data.year ?? null,
    isActive: data.is_active ?? null,
    createdAt: data.created_at ?? null,
  };
};

const mapStudent = (data: any): AdminStudent => {
  const memoryStudent = store.students.find((item) => item.id === data.id);

  return {
    id: data.id,
    name: memoryStudent?.name ?? data.name,
    index: memoryStudent?.index ?? data.index_number,
    dateOfBirth: memoryStudent?.dateOfBirth ?? data.date_of_birth ?? undefined,
    grade: memoryStudent?.grade ?? store.classes.find((item) => item.id === data.class_id)?.grade ?? 'Unassigned',
    classId: memoryStudent?.classId ?? data.class_id ?? '',
    parentName: memoryStudent?.parentName ?? data.parent_name ?? undefined,
    parentPhone: memoryStudent?.parentPhone ?? data.parent_phone ?? undefined,
    marks: memoryStudent?.marks ?? [],
  };
};

const mapTeacher = (data: any): AdminTeacher => ({
  id: data.id,
  name: data.name,
  subject: data.subject ?? '',
  grade: data.grade ?? '',
  email: data.email,
  phone: data.phone,
  assignments: normalizeAssignments(data.assigned_subjects, data.subject ?? '', data.grade ?? ''),
});

const mapClass = (data: any): import('../types.js').AdminClassOption => ({
  id: data.id,
  grade: data.grade,
  name: data.name,
  label: data.label,
  medium: data.medium,
  subjectId: data.subject_id ?? undefined,
  subjectName: data.subject_name ?? undefined,
  academicYear: data.academic_year ?? undefined,
  schedule: data.schedule ?? undefined,
  fee: data.fee ?? undefined,
  isActive: data.is_active ?? true,
});

const normalizeAssignments = (value: unknown, subject: string, grade: string): TeacherAssignment[] => {
  if (Array.isArray(value) && value.length > 0) {
    return value
      .map((item) => ({
        subject: String(item?.subject ?? subject),
        grade: String(item?.grade ?? grade),
        classId: String(item?.classId ?? ''),
        medium: String(item?.medium ?? ''),
      }))
      .filter((item) => item.subject && item.grade);
  }

  return [{ subject, grade, classId: '', medium: '' }];
};

const buildClass = (input: { grade: string; name: string; label: string; medium: string; subjectId?: string; subjectName?: string; academicYear?: number; schedule?: string; fee?: number }) => {
  const normalizedGrade = input.grade.trim();
  const normalizedName = input.name.trim();
  const normalizedMedium = input.medium.trim();

  return {
    id: `${normalizedGrade.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${normalizedMedium.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-|-$/g, ''),
    grade: normalizedGrade,
    name: normalizedName,
    medium: normalizedMedium,
    label: input.label || `${normalizedGrade} - ${normalizedName} - ${normalizedMedium} Medium`,
    subjectId: input.subjectId,
    subjectName: input.subjectName,
    academicYear: input.academicYear,
    schedule: input.schedule,
    fee: input.fee,
    isActive: true,
  };
};

const buildStudent = (input: Omit<AdminStudent, 'id' | 'marks' | 'grade'> & { grade?: string }): AdminStudent => {
  const classItem = store.classes.find((item) => item.id === input.classId);
  return {
    id: createId('st'),
    name: input.name,
    index: input.index,
    dateOfBirth: input.dateOfBirth,
    grade: classItem?.grade ?? input.grade ?? 'Unassigned',
    classId: input.classId,
    enrollments: [],
    parentName: input.parentName,
    parentPhone: input.parentPhone,
    marks: [],
  };
};

const buildTeacher = (input: Omit<AdminTeacher, 'id'>): AdminTeacher => ({
  id: createId('t'),
  ...input,
  assignments: input.assignments.length > 0 ? input.assignments : [
    { subject: input.subject, grade: input.grade, classId: '', medium: '' },
  ],
});

const buildUser = (input: Omit<AuthUser, 'id' | 'isActive'> & { passwordHash: string; isActive?: boolean }) => ({
  id: createId('user'),
  ...input,
  isActive: input.isActive ?? true,
});

const buildEnrollment = (input: { studentId: string; classId: string; subjectId: string; academicYear: number }) => ({
  id: `enr-${input.studentId}-${input.classId}`,
  studentId: input.studentId,
  classId: input.classId,
  subjectId: input.subjectId,
  academicYear: input.academicYear,
  status: 'active' as const,
  enrolledAt: new Date().toISOString(),
});

const uniqueBy = <T>(items: T[], keyOf: (item: T) => string) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = keyOf(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const resolveTermInfo = (academicYear?: number) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const term = month <= 4 ? 'Term 1' : month <= 8 ? 'Term 2' : 'Term 3';
  return {
    term,
    year: academicYear ?? today.getFullYear(),
  };
};

const buildMonthKey = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const formatMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return monthKey;
  return date.toLocaleString('en-GB', { month: 'short' });
};

const buildEmptyProgressSeries = () => {
  const month = new Date().toLocaleString('en-GB', { month: 'short' });
  return [{ month, score: 0, classAvg: 0 }];
};

const buildProgressSeries = (
  exams: Array<{ id: string; exam_date: string }>,
  results: Array<{ exam_id: string; student_id: string; marks_obtained: number | null; is_absent: boolean | null }>,
  studentId: string,
) => {
  const examDateById = new Map(exams.map((exam) => [exam.id, exam.exam_date]));
  const statsByMonth = new Map<string, { studentTotal: number; studentCount: number; classTotal: number; classCount: number }>();

  results.forEach((result) => {
    if (result.is_absent || result.marks_obtained === null) return;
    const examDate = examDateById.get(result.exam_id);
    if (!examDate) return;
    const monthKey = buildMonthKey(examDate);
    if (!monthKey) return;

    const stats = statsByMonth.get(monthKey) ?? { studentTotal: 0, studentCount: 0, classTotal: 0, classCount: 0 };
    const markValue = Number(result.marks_obtained);
    stats.classTotal += markValue;
    stats.classCount += 1;

    if (result.student_id === studentId) {
      stats.studentTotal += markValue;
      stats.studentCount += 1;
    }

    statsByMonth.set(monthKey, stats);
  });

  const entries = Array.from(statsByMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) return buildEmptyProgressSeries();

  return entries.map(([monthKey, stats]) => ({
    month: formatMonthLabel(monthKey),
    score: stats.studentCount ? Math.round(stats.studentTotal / stats.studentCount) : 0,
    classAvg: stats.classCount ? Math.round(stats.classTotal / stats.classCount) : 0,
  }));
};

const buildProgressSeriesFromMemory = (studentId: string) => {
  const student = store.students.find((item) => item.id === studentId);
  if (!student) return buildEmptyProgressSeries();
  const classId = student.classId;
  const classStudents = store.students.filter((item) => item.classId === classId);
  const statsByMonth = new Map<string, { studentTotal: number; studentCount: number; classTotal: number; classCount: number }>();

  classStudents.forEach((classmate) => {
    classmate.marks.forEach((mark) => {
      if (mark.classId && mark.classId !== classId) return;
      const monthKey = buildMonthKey(mark.examDate);
      if (!monthKey) return;

      const stats = statsByMonth.get(monthKey) ?? { studentTotal: 0, studentCount: 0, classTotal: 0, classCount: 0 };
      stats.classTotal += mark.mark;
      stats.classCount += 1;
      if (classmate.id === studentId) {
        stats.studentTotal += mark.mark;
        stats.studentCount += 1;
      }
      statsByMonth.set(monthKey, stats);
    });
  });

  const entries = Array.from(statsByMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) return buildEmptyProgressSeries();

  return entries.map(([monthKey, stats]) => ({
    month: formatMonthLabel(monthKey),
    score: stats.studentCount ? Math.round(stats.studentTotal / stats.studentCount) : 0,
    classAvg: stats.classCount ? Math.round(stats.classTotal / stats.classCount) : 0,
  }));
};

const buildEmptyPerformanceSummary = () => ({
  averageMark: 0,
  bestSubject: 'N/A',
  subjectsCount: 0,
  examsCount: 0,
});

const buildPerformanceSummary = (
  exams: Array<{ id: string; subject_id: string }>,
  results: Array<{ exam_id: string; student_id: string; marks_obtained: number | null; is_absent: boolean | null }>,
) => {
  const examSubjectById = new Map(exams.map((exam) => [exam.id, exam.subject_id]));
  const subjectTotals = new Map<string, { total: number; count: number }>();
  let overallTotal = 0;
  let overallCount = 0;

  results.forEach((result) => {
    if (result.is_absent || result.marks_obtained === null) return;
    const subjectId = examSubjectById.get(result.exam_id);
    if (!subjectId) return;
    const stats = subjectTotals.get(subjectId) ?? { total: 0, count: 0 };
    const markValue = Number(result.marks_obtained);
    stats.total += markValue;
    stats.count += 1;
    subjectTotals.set(subjectId, stats);
    overallTotal += markValue;
    overallCount += 1;
  });

  const subjectAverages = Array.from(subjectTotals.entries()).map(([subjectId, stats]) => ({
    subjectId,
    average: stats.count ? Math.round(stats.total / stats.count) : 0,
  }));
  const bestSubject = subjectAverages.sort((a, b) => b.average - a.average)[0];

  return {
    averageMark: overallCount ? Math.round(overallTotal / overallCount) : 0,
    bestSubject: bestSubject ? (getMemorySubjectById(bestSubject.subjectId)?.name ?? bestSubject.subjectId) : 'N/A',
    subjectsCount: subjectAverages.length,
    examsCount: overallCount,
  };
};

const buildPerformanceSummaryFromMemory = (studentId: string) => {
  const student = store.students.find((item) => item.id === studentId);
  if (!student) return buildEmptyPerformanceSummary();
  const subjectTotals = new Map<string, { total: number; count: number }>();
  let overallTotal = 0;
  let overallCount = 0;

  student.marks.forEach((mark) => {
    const stats = subjectTotals.get(mark.subjectId) ?? { total: 0, count: 0 };
    stats.total += mark.mark;
    stats.count += 1;
    subjectTotals.set(mark.subjectId, stats);
    overallTotal += mark.mark;
    overallCount += 1;
  });

  const subjectAverages = Array.from(subjectTotals.entries()).map(([subjectId, stats]) => ({
    subjectId,
    average: stats.count ? Math.round(stats.total / stats.count) : 0,
  }));
  const bestSubject = subjectAverages.sort((a, b) => b.average - a.average)[0];

  return {
    averageMark: overallCount ? Math.round(overallTotal / overallCount) : 0,
    bestSubject: bestSubject ? (getMemorySubjectById(bestSubject.subjectId)?.name ?? bestSubject.subjectId) : 'N/A',
    subjectsCount: subjectAverages.length,
    examsCount: overallCount,
  };
};

const buildLeaderboardEntries = (
  results: Array<{ exam_id: string; student_id: string; marks_obtained: number | null; is_absent: boolean | null }>,
  students: Array<{ id: string; name: string }>,
  viewerStudentId?: string,
) => {
  const totals = new Map<string, { total: number; count: number }>();
  results.forEach((result) => {
    if (result.is_absent || result.marks_obtained === null) return;
    const stats = totals.get(result.student_id) ?? { total: 0, count: 0 };
    stats.total += Number(result.marks_obtained);
    stats.count += 1;
    totals.set(result.student_id, stats);
  });

  const studentById = new Map(students.map((student) => [student.id, student]));
  const ranked = Array.from(totals.entries())
    .map(([studentId, stats]) => {
      const student = studentById.get(studentId);
      const name = student?.name ?? 'Student';
      return {
        studentId,
        name,
        marks: stats.count ? Math.round(stats.total / stats.count) : 0,
        avatar: name.charAt(0).toUpperCase(),
      };
    })
    .sort((a, b) => b.marks - a.marks)
    .map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      marks: entry.marks,
      avatar: entry.avatar,
      badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null,
      isYou: viewerStudentId ? entry.studentId === viewerStudentId : false,
    }));

  return ranked;
};

const buildLeaderboardFromMemory = (subjectId: string, classId: string, viewerStudentId?: string) => {
  const classStudents = store.students.filter((student) => student.classId === classId);
  const summaries = classStudents
    .map((student) => {
      const marks = student.marks.filter((mark) => mark.subjectId === subjectId && (!mark.classId || mark.classId === classId));
      if (marks.length === 0) return null;
      const total = marks.reduce((sum, mark) => sum + mark.mark, 0);
      return {
        studentId: student.id,
        name: student.name,
        marks: Math.round(total / marks.length),
      };
    })
    .filter((item): item is { studentId: string; name: string; marks: number } => item !== null)
    .sort((a, b) => b.marks - a.marks)
    .map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      marks: entry.marks,
      avatar: entry.name.charAt(0).toUpperCase(),
      badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null,
      isYou: viewerStudentId ? entry.studentId === viewerStudentId : false,
    }));

  return summaries;
};

const buildSubjectDefaults = (data: { id?: string; subject_name?: string | null }) => {
  const id = data.id ?? 'subject';
  const name = data.subject_name ?? id;
  return {
    id,
    name,
    emoji: name.charAt(0).toUpperCase(),
    color: subjectColorFromId(id),
    teacher: 'TBA',
    classLabel: name,
    rank: 0,
    trend: 'neutral' as const,
    currentMark: 0,
    classAvg: 0,
    nextExam: '',
    termTest: 0,
    dayPaper: 0,
    monthTest: 0,
    history: [],
    homeworkDoneThisMonth: 0,
    homeworkTargetThisMonth: 0,
    recentHomeworks: [],
  } satisfies SubjectRecord;
};

const subjectColorFromId = (id: string) => {
  const palette = ['#D9232D', '#F47920', '#1B3A8C', '#2C55C7', '#A761DD', '#16A34A'];
  const hash = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
};
