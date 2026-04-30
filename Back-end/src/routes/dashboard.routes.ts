import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { repo } from '../data/repository.js';

const router = Router();

router.use(requireAuth);

router.get('/student', requireRoles('student', 'admin', 'super-admin'), async (req, res) => {
  const studentId = req.user?.studentId;
  const subjects = await repo.getSubjects();

  res.json({
    profile: {
      ...(await repo.getStudentProfile(studentId)),
      email: req.user?.email ?? '',
    },
    overview: await repo.getOverview(),
    subjects,
    progress: repo.getProgressSeries(),
    homework: subjects.flatMap((subject) =>
      subject.recentHomeworks.map((homework) => ({
        ...homework,
        subjectId: subject.id,
        subjectName: subject.name,
        color: subject.color,
      })),
    ),
    announcements: [
      { id: 'ann-1', title: 'Term test schedule published', date: '2026-05-01' },
      { id: 'ann-2', title: 'Bring corrected papers to the next class', date: '2026-05-03' },
    ],
  });
});

router.get('/subjects', requireRoles('student', 'teacher', 'admin', 'super-admin'), async (_req, res) => {
  res.json({ subjects: await repo.getSubjects() });
});

router.get('/subjects/:subjectId', requireRoles('student', 'teacher', 'admin', 'super-admin'), async (req, res) => {
  const subjectId = req.params.subjectId;
  if (typeof subjectId !== 'string') {
    res.status(400).json({ message: 'subjectId is required.' });
    return;
  }

  const subject = await repo.getSubjectById(subjectId);

  if (!subject) {
    res.status(404).json({ message: 'Subject not found.' });
    return;
  }

  res.json({ subject });
});

router.get('/subjects/:subjectId/homework', requireRoles('student', 'teacher', 'admin', 'super-admin'), async (req, res) => {
  const subjectId = req.params.subjectId;
  if (typeof subjectId !== 'string') {
    res.status(400).json({ message: 'subjectId is required.' });
    return;
  }

  const subject = await repo.getSubjectById(subjectId);

  if (!subject) {
    res.status(404).json({ message: 'Subject not found.' });
    return;
  }

  const limit = Number(req.query.limit ?? 5);
  res.json({
    subjectId: subject.id,
    homework: subject.recentHomeworks.slice(0, Number.isFinite(limit) ? limit : 5),
    summary: {
      completed: subject.homeworkDoneThisMonth,
      target: subject.homeworkTargetThisMonth,
      percent: Math.round((subject.homeworkDoneThisMonth / subject.homeworkTargetThisMonth) * 100),
    },
  });
});

router.get('/subjects/:subjectId/leaderboard', requireRoles('student', 'teacher', 'admin', 'super-admin'), async (req, res) => {
  const subjectId = req.params.subjectId;
  if (typeof subjectId !== 'string') {
    res.status(400).json({ message: 'subjectId is required.' });
    return;
  }

  const subject = await repo.getSubjectById(subjectId);

  if (!subject) {
    res.status(404).json({ message: 'Subject not found.' });
    return;
  }

  res.json({
    subjectId: subject.id,
    leaderboard: await repo.getLeaderboardForSubject(subject.id),
  });
});

export default router;
