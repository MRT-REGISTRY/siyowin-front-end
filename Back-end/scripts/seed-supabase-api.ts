import process from 'node:process';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { classes, leaderboards, students, subjects, teachers, users } from '../src/data/seed.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_SECRET_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const subjectIds = subjects.map((subject) => subject.id);
const studentIds = students.map((student) => student.id);

const assertOk = (label: string, error: unknown) => {
  if (error) {
    console.error(`${label} failed:`, error);
    process.exit(1);
  }
};

const upsert = async (table: string, rows: Record<string, unknown>[], onConflict = 'id') => {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  assertOk(table, error);
  console.log(`${table}: upserted ${rows.length}`);
};

const deleteSeedRows = async () => {
  const deletions = [
    supabase.from('subject_history').delete().in('subject_id', subjectIds),
    supabase.from('homeworks').delete().in('subject_id', subjectIds),
    supabase.from('leaderboards').delete().in('subject_id', subjectIds),
    supabase.from('marks').delete().in('student_id', studentIds),
  ];

  const results = await Promise.all(deletions);
  results.forEach((result, index) => assertOk(`seed delete ${index + 1}`, result.error));
  console.log('seed child rows: refreshed');
};

await deleteSeedRows();

await upsert(
  'classes',
  classes.map((item) => ({
    id: item.id,
    grade: item.grade,
    name: item.name,
    label: item.label,
  })),
);

await upsert(
  'teachers',
  teachers.map((teacher) => ({
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    grade: teacher.grade,
    email: teacher.email,
    phone: teacher.phone,
  })),
);

await upsert(
  'students',
  students.map((student) => ({
    id: student.id,
    name: student.name,
    index: student.index,
    grade: student.grade,
    class_id: student.classId,
    parent_name: student.parentName ?? null,
    parent_phone: student.parentPhone ?? null,
  })),
);

await upsert(
  'app_users',
  users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    student_id: user.studentId ?? null,
    teacher_id: user.teacherId ?? null,
    password_hash: user.passwordHash,
  })),
);

await upsert(
  'subjects',
  subjects.map((subject, index) => ({
    id: subject.id,
    name: subject.name,
    emoji: subject.emoji,
    color: subject.color,
    teacher: subject.teacher,
    class_label: subject.classLabel,
    rank: subject.rank,
    trend: subject.trend,
    current_mark: subject.currentMark,
    class_avg: subject.classAvg,
    next_exam: subject.nextExam,
    term_test: subject.termTest,
    day_paper: subject.dayPaper,
    month_test: subject.monthTest,
    homework_done_this_month: subject.homeworkDoneThisMonth,
    homework_target_this_month: subject.homeworkTargetThisMonth,
    display_order: index + 1,
  })),
);

await upsert(
  'subject_history',
  subjects.flatMap((subject) =>
    subject.history.map((history, index) => ({
      subject_id: subject.id,
      label: history.label,
      date: history.date,
      mark: history.mark,
      note: history.note,
      display_order: index + 1,
    })),
  ),
  'id',
);

await upsert(
  'homeworks',
  subjects.flatMap((subject) =>
    subject.recentHomeworks.map((homework, index) => ({
      id: homework.id,
      student_id: 'st-1',
      subject_id: subject.id,
      title: homework.title,
      due_date: homework.dueDate,
      completed_date: homework.completedDate ?? null,
      status: homework.status,
      display_order: index + 1,
    })),
  ),
);

await upsert(
  'leaderboards',
  Object.entries(leaderboards).flatMap(([subjectId, entries]) =>
    entries.map((entry) => ({
      subject_id: subjectId,
      rank: entry.rank,
      name: entry.name,
      marks: entry.marks,
      avatar: entry.avatar ?? null,
      badge: entry.badge ?? null,
      is_you: entry.isYou ?? false,
    })),
  ),
  'id',
);

await upsert(
  'marks',
  students.flatMap((student) =>
    student.marks.map((mark) => ({
      student_id: student.id,
      subject_id: mark.subjectId,
      subject_name: mark.subjectName,
      exam_type: mark.examType,
      exam_name: mark.examName,
      exam_date: mark.examDate,
      mark: mark.mark,
      note: mark.note ?? null,
    })),
  ),
  'student_id,subject_id,exam_type,exam_name',
);

console.log('Supabase seed completed.');
