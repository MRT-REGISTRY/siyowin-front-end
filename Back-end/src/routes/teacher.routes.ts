import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { repo } from '../data/repository.js';
import { store } from '../data/store.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { supabase } from '../config/supabase.js';

const slugifyLocal = (v: string) => v.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const router = Router();

router.use(requireAuth, requireRoles('teacher'));

const teacherMarkSchema = z.object({
  studentId: z.string().min(1),
  subjectId: z.string().min(1),
  examType: z.string().min(1),
  examName: z.string().min(1),
  examDate: z.string().min(1),
  mark: z.number().min(0).max(100),
  note: z.string().optional(),
});

const resourceSchema = z.object({
  classId: z.string().min(1),
  moduleId: z.string().min(1),
  title: z.string().min(1).max(200),
  href: z.string().url(),
  type: z.enum(['document', 'video', 'link']),
});

const topicSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(1).max(150),
});

const homeworkSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(1).max(150),
  dueDate: z.string().min(1),
});

const homeworkCompletionSchema = z.object({
  classId: z.string().min(1),
  homeworkId: z.string().min(1),
  studentId: z.string().min(1),
  isDone: z.boolean(),
});

const getTeacherAssignmentAccess = (teacher: any) => {
  const assignments = teacher.assignments.length > 0
    ? teacher.assignments
    : [{ subject: teacher.subject, grade: teacher.grade, classId: '', medium: '' }];

  return {
    assignments,
    assignedSubjectNames: new Set(assignments.map((assignment: any) => String(assignment.subject ?? '').toLowerCase())),
    assignedClassIds: new Set(assignments.map((assignment: any) => assignment.classId).filter(Boolean)),
  };
};

const canManageSubject = (teacher: any, subject: any) => {
  const { assignedSubjectNames, assignedClassIds } = getTeacherAssignmentAccess(teacher);
  return (
    assignedClassIds.has(subject.id) ||
    subject.teacher === teacher.name ||
    assignedSubjectNames.has(String(subject.name ?? '').toLowerCase()) ||
    String(subject.name ?? '').toLowerCase() === String(teacher.subject ?? '').toLowerCase()
  );
};

router.get('/dashboard', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const allSubjects = await repo.getSubjects();
  const classes = await repo.getClasses();
  const classById = new Map(classes.map((classItem) => [classItem.id, classItem]));
  const assignments = teacher.assignments.length > 0
    ? teacher.assignments
    : [{ subject: teacher.subject, grade: teacher.grade, classId: '', medium: '' }];
  const assignedSubjectNames = new Set(assignments.map((assignment) => assignment.subject.toLowerCase()));
  const assignedClassIds = new Set(assignments.map((assignment) => assignment.classId).filter(Boolean));
  const subjects = allSubjects.filter((subject) =>
    assignedClassIds.has(subject.id) || subject.teacher === teacher.name || assignedSubjectNames.has(subject.name.toLowerCase()),
  );
  const studentsByAssignment = await Promise.all(assignments.map((assignment) =>
    repo.getStudents({ grade: assignment.grade, classId: assignment.classId || undefined }),
  ));
  const students = Array.from(new Map(studentsByAssignment.flat().map((student) => [student.id, student])).values());
  const subjectIds = new Set(subjects.map((subject) => subject.id));
  const marks = students.flatMap((student) =>
    student.marks
      .filter((mark) => subjectIds.has(mark.subjectId))
      .map((mark) => ({
        ...mark,
        studentId: student.id,
        studentName: student.name,
        studentIndex: student.index,
      })),
  );

  const averageMark = marks.length > 0
    ? Math.round(marks.reduce((total, mark) => total + mark.mark, 0) / marks.length)
    : 0;

  // Fetch all exams for teacher's subjects from DB (so assignments show even with 0 marks)
  let dbExams: Array<{ id: string; classId: string; examType: string; examName: string; examDate: string; markedStudentCount: number }> = [];
  if (supabase && subjectIds.size > 0) {
    const { data: examRows } = await supabase
      .from('exams')
      .select('id,class_id,exam_type,title,exam_date')
      .in('class_id', Array.from(subjectIds))
      .order('exam_date', { ascending: false });

    if (examRows && examRows.length > 0) {
      const examIds = examRows.map((e) => e.id);
      const { data: resultCounts } = await supabase
        .from('results')
        .select('exam_id')
        .in('exam_id', examIds);

      const countByExamId = new Map<string, number>();
      for (const row of resultCounts ?? []) {
        countByExamId.set(row.exam_id, (countByExamId.get(row.exam_id) ?? 0) + 1);
      }

      dbExams = examRows.map((e) => ({
        id: e.id,
        classId: e.class_id,
        examType: e.exam_type,
        examName: e.title,
        examDate: e.exam_date,
        markedStudentCount: countByExamId.get(e.id) ?? 0,
      }));
    }
  }

  const recentAssignments = dbExams.slice(0, 5).map((exam) => {
    const examMarks = marks.filter((m) =>
      m.subjectId === exam.classId &&
      m.examType === exam.examType &&
      m.examName === exam.examName &&
      m.examDate === exam.examDate
    );
    
    const topStudents = examMarks
      .sort((a, b) => b.mark - a.mark)
      .slice(0, 10)
      .map((m) => ({
        id: m.studentId,
        name: m.studentName,
        index: m.studentIndex,
        mark: m.mark
      }));
      
    return {
      ...exam,
      topStudents
    };
  });

  res.json({
    teacher,
    assignments,
    subjects: subjects.map((subject) => {
      const classItem = classById.get(subject.id);
      const studentCount = students.filter((student) =>
        student.classId === subject.id || student.enrollments?.some((enrollment) => enrollment.classId === subject.id),
      ).length;

      return {
        id: subject.id,
        name: subject.name,
        teacher: subject.teacher,
        classLabel: subject.classLabel,
        grade: subject.gradeId ?? classItem?.grade,
        medium: subject.medium ?? classItem?.medium,
        schedule: subject.schedule ?? classItem?.schedule,
        fee: subject.fee ?? classItem?.fee,
        studentCount,
      };
    }),
    students,
    examTypes: store.examTypes,
    dbExams,
    overview: {
      studentsCount: students.length,
      subjectsCount: subjects.length,
      marksCount: marks.length,
      averageMark,
    },
    recentAssignments,
  });
}));

router.post('/marks', validateBody(teacherMarkSchema), asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const subjects = await repo.getSubjects();
  const subject = subjects.find((item) => item.id === req.body.subjectId);

  const assignments = teacher.assignments.length > 0
    ? teacher.assignments
    : [{ subject: teacher.subject, grade: teacher.grade, classId: '', medium: '' }];
  const assignedSubjectNames = new Set(assignments.map((assignment) => assignment.subject.toLowerCase()));
  const assignedClassIds = new Set(assignments.map((assignment) => assignment.classId).filter(Boolean));

  if (!subject || (!assignedClassIds.has(subject.id) && subject.teacher !== teacher.name && !assignedSubjectNames.has(subject.name.toLowerCase()) && subject.name.toLowerCase() !== teacher.subject.toLowerCase())) {
    res.status(403).json({ message: 'You can only manage marks for your assigned subject.' });
    return;
  }

  // Lightweight enrollment check — avoid fetching ALL students with ALL marks
  if (supabase) {
    const { data: studentRow } = await supabase
      .from('students')
      .select('id,class_id')
      .eq('id', req.body.studentId)
      .maybeSingle();

    if (!studentRow) {
      res.status(404).json({ message: 'Student not found.' });
      return;
    }

    // Check if student is in this class directly or via enrollment
    if (studentRow.class_id !== subject.id) {
      const { data: enrollment } = await supabase
        .from('student_enrollments')
        .select('id')
        .eq('student_id', req.body.studentId)
        .eq('class_id', subject.id)
        .maybeSingle();
      if (!enrollment) {
        res.status(403).json({ message: 'You can only manage marks for students enrolled in the selected class.' });
        return;
      }
    }
  }

  const classId = subject.id;

  const result = await repo.upsertMark(req.body.studentId, {
    subjectId: subject.id,
    subjectName: subject.name,
    classId,
    examType: req.body.examType,
    examName: req.body.examName,
    examDate: req.body.examDate,
    mark: req.body.mark,
    note: req.body.note,
  });

  if (!result) {
    res.status(404).json({ message: 'Student not found.' });
    return;
  }

  res.status(result.action === 'created' ? 201 : 200).json(result);
}));

router.post('/resources', validateBody(resourceSchema), asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const subject = await repo.getSubjectById(req.body.classId);
  if (!subject) {
    res.status(404).json({ message: 'Class subject not found.' });
    return;
  }

  if (!canManageSubject(teacher, subject)) {
    res.status(403).json({ message: 'You can only add resources to your assigned classes.' });
    return;
  }

  const resource = await repo.createSubjectResource({
    classId: subject.id,
    moduleId: req.body.moduleId,
    title: req.body.title,
    href: req.body.href,
    type: req.body.type,
  });

  res.status(201).json({ resource });
}));

router.post('/topics', validateBody(topicSchema), asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const subject = await repo.getSubjectById(req.body.classId);
  if (!subject) {
    res.status(404).json({ message: 'Class subject not found.' });
    return;
  }

  if (!canManageSubject(teacher, subject)) {
    res.status(403).json({ message: 'You can only add topics to your assigned classes.' });
    return;
  }

  const topic = await repo.createSubjectTopic({
    classId: subject.id,
    title: req.body.title,
  });

  res.status(201).json({ topic });
}));

router.delete('/resources/:classId/:resourceId', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const classId = req.params.classId;
  const resourceId = req.params.resourceId;
  if (typeof classId !== 'string' || typeof resourceId !== 'string' || !classId || !resourceId) {
    res.status(400).json({ message: 'classId and resourceId are required.' });
    return;
  }

  const subject = await repo.getSubjectById(classId);
  if (!subject) {
    res.status(404).json({ message: 'Class subject not found.' });
    return;
  }

  if (!canManageSubject(teacher, subject)) {
    res.status(403).json({ message: 'You can only delete resources from your assigned classes.' });
    return;
  }

  const deleted = await repo.deleteSubjectResource(subject.id, resourceId);
  if (!deleted) {
    res.status(404).json({ message: 'Resource not found.' });
    return;
  }

  res.json({ message: 'Resource deleted successfully.' });
}));

router.delete('/topics/:classId/:moduleId', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const classId = req.params.classId;
  const moduleId = req.params.moduleId;
  if (typeof classId !== 'string' || typeof moduleId !== 'string' || !classId || !moduleId) {
    res.status(400).json({ message: 'classId and moduleId are required.' });
    return;
  }

  const subject = await repo.getSubjectById(classId);
  if (!subject) {
    res.status(404).json({ message: 'Class subject not found.' });
    return;
  }

  if (!canManageSubject(teacher, subject)) {
    res.status(403).json({ message: 'You can only delete topics from your assigned classes.' });
    return;
  }

  const deleted = await repo.deleteSubjectTopic(subject.id, moduleId);
  if (!deleted) {
    res.status(404).json({ message: 'Topic not found.' });
    return;
  }

  res.json({ message: 'Topic deleted successfully.' });
}));

router.get('/homework/:classId', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const classId = req.params.classId;
  if (typeof classId !== 'string' || !classId) {
    res.status(400).json({ message: 'classId is required.' });
    return;
  }

  const subject = await repo.getSubjectById(classId);
  if (!subject) {
    res.status(404).json({ message: 'Class subject not found.' });
    return;
  }

  if (!canManageSubject(teacher, subject)) {
    res.status(403).json({ message: 'You can only view homework for your assigned classes.' });
    return;
  }

  const homeworks = await repo.getClassHomeworks(subject.id);
  res.json({ homeworks });
}));

router.post('/homework', validateBody(homeworkSchema), asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const subject = await repo.getSubjectById(req.body.classId);
  if (!subject) {
    res.status(404).json({ message: 'Class subject not found.' });
    return;
  }

  if (!canManageSubject(teacher, subject)) {
    res.status(403).json({ message: 'You can only add homework to your assigned classes.' });
    return;
  }

  const homework = await repo.createHomework({
    classId: subject.id,
    title: req.body.title,
    dueDate: req.body.dueDate,
    createdBy: req.user?.id,
  });

  res.status(201).json({ homework });
}));

router.patch('/homework/completion', validateBody(homeworkCompletionSchema), asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const subject = await repo.getSubjectById(req.body.classId);
  if (!subject) {
    res.status(404).json({ message: 'Class subject not found.' });
    return;
  }

  if (!canManageSubject(teacher, subject)) {
    res.status(403).json({ message: 'You can only update homework for your assigned classes.' });
    return;
  }

  const updated = await repo.setHomeworkCompletion({
    classId: subject.id,
    homeworkId: req.body.homeworkId,
    studentId: req.body.studentId,
    isDone: req.body.isDone,
    updatedBy: req.user?.id,
  });

  if (!updated) {
    res.status(404).json({ message: 'Homework not found.' });
    return;
  }

  res.json({ message: 'Homework completion updated.' });
}));

router.delete('/homework/:classId/:homeworkId', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);

  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const classId = req.params.classId;
  const homeworkId = req.params.homeworkId;
  if (typeof classId !== 'string' || typeof homeworkId !== 'string' || !classId || !homeworkId) {
    res.status(400).json({ message: 'classId and homeworkId are required.' });
    return;
  }

  const subject = await repo.getSubjectById(classId);
  if (!subject) {
    res.status(404).json({ message: 'Class subject not found.' });
    return;
  }

  if (!canManageSubject(teacher, subject)) {
    res.status(403).json({ message: 'You can only delete homework from your assigned classes.' });
    return;
  }

  const deleted = await repo.deleteHomework(subject.id, homeworkId);
  if (!deleted) {
    res.status(404).json({ message: 'Homework not found.' });
    return;
  }

  res.json({ message: 'Homework deleted successfully.' });
}));


router.get('/students/:studentId/progress', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);
  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const studentId = req.params.studentId;
  if (typeof studentId !== 'string' || !studentId) {
    res.status(400).json({ message: 'studentId is required.' });
    return;
  }

  const assignments = teacher.assignments.length > 0
    ? teacher.assignments
    : [{ subject: teacher.subject, grade: teacher.grade, classId: '', medium: '' }];
  const studentsByAssignment = await Promise.all(assignments.map((assignment) =>
    repo.getStudents({ grade: assignment.grade, classId: assignment.classId || undefined }),
  ));
  const allowedStudentIds = new Set(studentsByAssignment.flat().map((student) => student.id));

  if (teacher.assignments.length > 0 && !allowedStudentIds.has(studentId)) {
    res.status(403).json({ message: 'You can only view progress for students in your assigned grades and classes.' });
    return;
  }

  const profile = await repo.getStudentProfile(studentId);
  if (!profile) {
    res.status(404).json({ message: 'Student profile not found.' });
    return;
  }

  const progress = await repo.getStudentProgressSeries(studentId);
  const overview = await repo.getStudentPerformanceSummary(studentId);

  res.json({
    student: profile,
    overview,
    progress,
  });
}));

router.delete('/marks', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);
  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const { studentId, subjectId, examType, examName, examDate } = req.body;
  if (!studentId || !subjectId || !examType || !examName) {
    res.status(400).json({ message: 'studentId, subjectId, examType, and examName are required.' });
    return;
  }

  const result = await repo.deleteMark({ studentId, subjectId, examType, examName, examDate });
  if (!result || !result.deleted) {
    res.status(404).json({ message: 'Mark not found or could not be deleted.' });
    return;
  }

  res.json({ message: 'Mark deleted successfully.', student: result.student });
}));

// Create a bare assignment (exam with no marks yet) — persists to DB
router.post('/assignment', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);
  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const { subjectId, examType, examName, examDate } = req.body;
  if (!subjectId || !examType || !examName || !examDate) {
    res.status(400).json({ message: 'subjectId, examType, examName, and examDate are required.' });
    return;
  }

  const examId = `${subjectId}-${slugifyLocal(examType)}-${slugifyLocal(examName)}-${slugifyLocal(examDate)}`;

  if (supabase) {
    const { error } = await supabase.from('exams').upsert({
      id: examId,
      class_id: subjectId,
      exam_type: examType,
      title: examName,
      exam_date: examDate,
      total_marks: 100,
    }, { onConflict: 'id' });
    if (error) throw error;
  }
  // In-memory mode: UI already stores it locally in emptyAssignments state

  res.status(201).json({ id: examId, subjectId, examType, examName, examDate, markedStudentCount: 0 });
}));

router.put('/marks/assignment', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);
  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const { subjectId, oldExamType, oldExamName, oldExamDate, newExamType, newExamName, newExamDate } = req.body;
  if (!subjectId || !oldExamName || !newExamName) {
    res.status(400).json({ message: 'subjectId, oldExamName, and newExamName are required.' });
    return;
  }

  // ── Supabase path: update exams table directly ──────────────────────────
  if (supabase) {
    let examQuery = supabase
      .from('exams')
      .select('id,exam_type,title,exam_date')
      .eq('class_id', subjectId)
      .eq('title', oldExamName);
    if (oldExamType) examQuery = examQuery.eq('exam_type', oldExamType);
    if (oldExamDate) examQuery = examQuery.eq('exam_date', oldExamDate);

    const { data: exams, error: examFetchError } = await examQuery;
    if (examFetchError) throw examFetchError;
    if (!exams || exams.length === 0) {
      res.json({ message: 'No matching exams found.', updatedCount: 0 });
      return;
    }

    let updatedCount = 0;
    for (const exam of exams) {
      const { error: updateError } = await supabase
        .from('exams')
        .update({
          title: newExamName,
          exam_type: newExamType || exam.exam_type,
          exam_date: newExamDate || exam.exam_date,
        })
        .eq('id', exam.id);
      if (updateError) throw updateError;

      // Count how many results are affected
      const { count } = await supabase
        .from('results')
        .select('id', { count: 'exact', head: true })
        .eq('exam_id', exam.id);
      updatedCount += count ?? 0;
    }

    res.json({ message: `Assignment updated. ${updatedCount} mark(s) affected.`, updatedCount });
    return;
  }

  // ── In-memory fallback: iterate student.marks ────────────────────────────
  const allStudents = await repo.getStudents({});
  let updatedCount = 0;
  for (const student of allStudents) {
    for (const mark of (student.marks ?? []) as any[]) {
      if (
        mark.subjectId === subjectId &&
        mark.examName === oldExamName &&
        (oldExamType ? mark.examType === oldExamType : true) &&
        (oldExamDate ? mark.examDate === oldExamDate : true)
      ) {
        const updatedMark = {
          ...mark,
          examType: newExamType || mark.examType,
          examName: newExamName,
          examDate: newExamDate || mark.examDate,
        };
        await repo.upsertMark(student.id, updatedMark);
        if (mark.examName !== updatedMark.examName || mark.examType !== updatedMark.examType || mark.examDate !== updatedMark.examDate) {
          await repo.deleteMark({ studentId: student.id, subjectId, examType: mark.examType, examName: mark.examName, examDate: mark.examDate });
        }
        updatedCount++;
      }
    }
  }
  res.json({ message: `Assignment updated. ${updatedCount} mark(s) affected.`, updatedCount });
}));

router.delete('/marks/assignment', asyncHandler(async (req, res) => {
  const teacher = await repo.getTeacherById(req.user?.teacherId);
  if (!teacher) {
    res.status(404).json({ message: 'Teacher profile not found.' });
    return;
  }

  const { subjectId, examType, examName, examDate } = req.body;
  if (!subjectId || !examName) {
    res.status(400).json({ message: 'subjectId and examName are required.' });
    return;
  }

  // ── Supabase path: delete from exams (cascades to results) ───────────────
  if (supabase) {
    let examQuery = supabase
      .from('exams')
      .select('id')
      .eq('class_id', subjectId)
      .eq('title', examName);
    if (examType) examQuery = examQuery.eq('exam_type', examType);
    if (examDate) examQuery = examQuery.eq('exam_date', examDate);

    const { data: exams, error: examFetchError } = await examQuery;
    if (examFetchError) throw examFetchError;
    if (!exams || exams.length === 0) {
      res.json({ message: 'No matching exams found.', deletedCount: 0 });
      return;
    }

    const examIds = exams.map((e) => e.id);

    // Count results before deleting for the response message
    const { count: deletedCount } = await supabase
      .from('results')
      .select('id', { count: 'exact', head: true })
      .in('exam_id', examIds);

    // Delete results first (in case cascade is not set up), then exams
    const { error: resultDeleteError } = await supabase.from('results').delete().in('exam_id', examIds);
    if (resultDeleteError) throw resultDeleteError;
    const { error: examDeleteError } = await supabase.from('exams').delete().in('id', examIds);
    if (examDeleteError) throw examDeleteError;

    res.json({ message: `Assignment deleted. ${deletedCount ?? 0} mark(s) removed.`, deletedCount: deletedCount ?? 0 });
    return;
  }

  // ── In-memory fallback ────────────────────────────────────────────────────
  const allStudents = await repo.getStudents({});
  let deletedCount = 0;
  for (const student of allStudents) {
    for (const mark of (student.marks ?? []) as any[]) {
      if (
        mark.subjectId === subjectId &&
        mark.examName === examName &&
        (examType ? mark.examType === examType : true) &&
        (examDate ? mark.examDate === examDate : true)
      ) {
        await repo.deleteMark({ studentId: student.id, subjectId, examType: mark.examType, examName: mark.examName, examDate: mark.examDate });
        deletedCount++;
      }
    }
  }
  res.json({ message: `Assignment deleted. ${deletedCount} mark(s) removed.`, deletedCount });
}));

export default router;
