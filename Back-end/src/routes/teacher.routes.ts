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
  const subjects = allSubjects.filter((subject) =>
    subject.teacher === teacher.name || subject.name.toLowerCase() === teacher.subject.toLowerCase(),
  );
  const students = await repo.getStudents({ grade: teacher.grade });
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
    subjects: subjects.map((subject) => ({ id: subject.id, name: subject.name, teacher: subject.teacher })),
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

  if (!subject || (subject.teacher !== teacher.name && subject.name.toLowerCase() !== teacher.subject.toLowerCase())) {
    res.status(403).json({ message: 'You can only manage marks for your assigned subject.' });
    return;
  }

  const result = await repo.upsertMark(req.body.studentId, {
    subjectId: subject.id,
    subjectName: subject.name,
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

export default router;
