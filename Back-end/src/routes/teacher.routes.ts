import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { repo } from '../data/repository.js';
import { store } from '../data/store.js';

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

router.get('/dashboard', async (req, res) => {
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
    overview: {
      studentsCount: students.length,
      subjectsCount: subjects.length,
      marksCount: marks.length,
      averageMark,
    },
    recentMarks: marks.slice(0, 10),
  });
});

router.post('/marks', validateBody(teacherMarkSchema), async (req, res) => {
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

  const studentsByAssignment = await Promise.all(assignments.map((assignment) =>
    repo.getStudents({ grade: assignment.grade, classId: assignment.classId || undefined }),
  ));
  const allowedStudents = studentsByAssignment.flat();
  const targetStudent = allowedStudents.find((student) => student.id === req.body.studentId);
  const targetStudentInSubjectClass = targetStudent
    ? targetStudent.classId === subject.id || targetStudent.enrollments?.some((enrollment) => enrollment.classId === subject.id)
    : false;

  if (assignments.length > 0 && (!targetStudent || !targetStudentInSubjectClass)) {
    res.status(403).json({ message: 'You can only manage marks for students enrolled in the selected class.' });
    return;
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
});

router.get('/students/:studentId/progress', async (req, res) => {
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
});

export default router;
