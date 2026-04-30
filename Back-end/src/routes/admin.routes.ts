import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { getClassesForGrade, store } from '../data/store.js';
import { repo } from '../data/repository.js';
import { parseCsv } from '../utils/csv.js';

const router = Router();

router.use(requireAuth, requireRoles('admin', 'super-admin'));

const studentSchema = z.object({
  name: z.string().min(1),
  index: z.string().min(1),
  grade: z.string().min(1),
  classId: z.string().min(1),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
});

const teacherSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  grade: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});

const markSchema = z.object({
  studentId: z.string().min(1),
  subjectId: z.string().min(1),
  subjectName: z.string().min(1),
  examType: z.string().min(1),
  examName: z.string().min(1),
  examDate: z.string().min(1),
  mark: z.number().min(0).max(100),
  note: z.string().optional(),
});

const bulkMarksSchema = z.object({
  csvText: z.string().min(1),
});

router.get('/meta', async (req, res) => {
  const grade = typeof req.query.grade === 'string' ? req.query.grade : '';
  const classId = typeof req.query.classId === 'string' ? req.query.classId : '';
  const classes = await repo.getClasses();
  const subjects = await repo.getSubjects();

  res.json({
    grades: store.grades,
    classes: grade ? classes.filter((classItem) => classItem.grade === grade) : classes,
    subjects: classId ? repo.getSubjectsForClass(classId) : subjects.map((subject) => ({ id: subject.id, name: subject.name, teacher: subject.teacher })),
    examTypes: store.examTypes,
    csvColumns: store.csvColumns,
  });
});

router.get('/students', async (req, res) => {
  res.json({
    students: await repo.getStudents({
      grade: typeof req.query.grade === 'string' ? req.query.grade : undefined,
      classId: typeof req.query.classId === 'string' ? req.query.classId : undefined,
      query: typeof req.query.query === 'string' ? req.query.query : undefined,
    }),
  });
});

router.post('/students', validateBody(studentSchema), async (req, res) => {
  const existing = (await repo.getStudents({})).find((student) => student.index === req.body.index);

  if (existing) {
    res.status(409).json({ message: 'A student with this index already exists.' });
    return;
  }

  const student = await repo.createStudent(req.body);
  res.status(201).json({ student });
});

router.get('/teachers', async (_req, res) => {
  res.json({ teachers: await repo.getTeachers() });
});

router.post('/teachers', requireRoles('super-admin'), validateBody(teacherSchema), async (req, res) => {
  const existing = (await repo.getTeachers()).find((teacher) => teacher.email.toLowerCase() === req.body.email.toLowerCase());

  if (existing) {
    res.status(409).json({ message: 'A teacher with this email already exists.' });
    return;
  }

  const teacher = await repo.createTeacher(req.body);
  res.status(201).json({ teacher });
});

router.get('/marks', async (req, res) => {
  const studentId = typeof req.query.studentId === 'string' ? req.query.studentId : '';
  const students = await repo.getStudents({});
  const student = students.find((item) => item.id === studentId || item.index === studentId);

  if (studentId && !student) {
    res.status(404).json({ message: 'Student not found.' });
    return;
  }

  res.json({
    marks: student ? student.marks : students.flatMap((item) => item.marks.map((mark) => ({ ...mark, studentId: item.id }))),
  });
});

router.post('/marks', validateBody(markSchema), async (req, res) => {
  const { studentId, ...mark } = req.body as z.infer<typeof markSchema>;
  const result = await repo.upsertMark(studentId, mark);

  if (!result) {
    res.status(404).json({ message: 'Student not found.' });
    return;
  }

  res.status(result.action === 'created' ? 201 : 200).json(result);
});

router.delete('/marks', async (req, res) => {
  const params = {
    studentId: String(req.query.studentId ?? ''),
    subjectId: String(req.query.subjectId ?? ''),
    examType: String(req.query.examType ?? ''),
    examName: String(req.query.examName ?? ''),
  };

  if (!params.studentId || !params.subjectId || !params.examType || !params.examName) {
    res.status(400).json({ message: 'studentId, subjectId, examType, and examName are required.' });
    return;
  }

  const result = await repo.deleteMark(params);

  if (!result) {
    res.status(404).json({ message: 'Student not found.' });
    return;
  }

  res.json(result);
});

router.post('/marks/bulk', validateBody(bulkMarksSchema), async (req, res) => {
  const rows = parseCsv(req.body.csvText);
  const results = await Promise.all(rows.map(async (row) => {
    const markValue = Number(row.mark);

    if (!row.student_index || Number.isNaN(markValue)) {
      return { row, status: 'skipped', reason: 'Missing student_index or invalid mark.' };
    }

    const result = await repo.upsertMark(row.student_index, {
      subjectId: row.subject_id ?? '',
      subjectName: row.subject_name ?? '',
      examType: row.exam_type ?? '',
      examName: row.exam_name ?? '',
      examDate: row.exam_date ?? '',
      mark: markValue,
      note: row.note,
    });

    if (!result) {
      return { row, status: 'skipped', reason: 'Student not found.' };
    }

    return { row, status: result.action };
  }));

  res.json({
    processed: results.length,
    createdOrUpdated: results.filter((item) => item.status === 'created' || item.status === 'updated').length,
    skipped: results.filter((item) => item.status === 'skipped').length,
    results,
  });
});

export default router;
