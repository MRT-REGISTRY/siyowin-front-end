insert into grades (id, grade_name, display_order) values
('grade-9', 'Grade 9', 1),
('grade-10', 'Grade 10', 2),
('grade-11', 'Grade 11', 3),
('grade-12', 'Grade 12', 4)
on conflict (id) do update set grade_name = excluded.grade_name, display_order = excluded.display_order;

insert into teachers (id, name, password_hash, subject, phone, email, is_active) values
('t-1', 'Mr. Silva', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'Mathematics', '+94 77 123 4567', 'silva@siyowin.edu', true),
('t-2', 'Ms. Fernando', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'Science', '+94 77 234 5678', 'fernando@siyowin.edu', true)
on conflict (id) do update set name = excluded.name, password_hash = excluded.password_hash, subject = excluded.subject, phone = excluded.phone, email = excluded.email, is_active = excluded.is_active;

insert into users (id, name, email, password_hash, role, student_id, teacher_id, is_active) values
('user-student-1', 'Alex Johnson', 'student@siyowin.lk', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'student', 'st-1', null, true),
('user-teacher-1', 'Mr. Silva', 'teacher@siyowin.lk', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'teacher', null, 't-1', true),
('user-admin-1', 'Admin User', 'admin@siyowin.lk', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'admin', null, null, true),
('user-super-admin-1', 'Super Admin', 'superadmin@siyowin.lk', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'super-admin', null, null, true)
on conflict (id) do update set name = excluded.name, email = excluded.email, password_hash = excluded.password_hash, role = excluded.role, student_id = excluded.student_id, teacher_id = excluded.teacher_id, is_active = excluded.is_active;

insert into students (id, index_number, name, password_hash, grade_id, class_id, parent_name, parent_phone, is_active) values
('st-1', '2026-11-012', 'Alex Johnson', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'grade-11', '11-a', 'Mary Johnson', '+94 77 111 2222', true),
('st-2', '2026-11-045', 'Sara Perera', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'grade-11', '11-a', null, null, true),
('st-3', '2026-10-018', 'Nimal Fernando', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'grade-10', '10-b', null, null, true),
('st-4', '2026-12-003', 'Sara Perera', '$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C', 'grade-12', '12-a', null, null, true)
on conflict (id) do update set index_number = excluded.index_number, name = excluded.name, password_hash = excluded.password_hash, grade_id = excluded.grade_id, class_id = excluded.class_id, parent_name = excluded.parent_name, parent_phone = excluded.parent_phone, is_active = excluded.is_active;

insert into subjects (id, teacher_id, grade_id, subject_name, year, is_active) values
('math', 't-1', 'grade-11', 'Mathematics', 2026, true),
('sci', 't-2', 'grade-11', 'Science', 2026, true),
('eng', 't-2', 'grade-11', 'English', 2026, true),
('hist', 't-1', 'grade-11', 'History', 2026, true),
('geo', 't-1', 'grade-11', 'Geography', 2026, true),
('cs', 't-1', 'grade-11', 'Computer Science', 2026, true)
on conflict (id) do update set teacher_id = excluded.teacher_id, grade_id = excluded.grade_id, subject_name = excluded.subject_name, year = excluded.year, is_active = excluded.is_active;

insert into student_enrollments (id, student_id, subject_id, is_active) values
('enr-1', 'st-1', 'math', true),
('enr-2', 'st-1', 'sci', true),
('enr-3', 'st-1', 'eng', true),
('enr-4', 'st-1', 'hist', true),
('enr-5', 'st-2', 'eng', true),
('enr-6', 'st-3', 'sci', true),
('enr-7', 'st-4', 'hist', true),
('enr-8', 'st-1', 'cs', true)
on conflict (id) do update set student_id = excluded.student_id, subject_id = excluded.subject_id, is_active = excluded.is_active;

insert into parents (id, student_id, name, whatsapp_number, email) values
('parent-1', 'st-1', 'Mary Johnson', '+94 77 111 2222', 'mary.johnson@example.com'),
('parent-2', 'st-2', 'Kamala Perera', '+94 77 222 3333', 'kamala.perera@example.com'),
('parent-3', 'st-3', 'Nimal Fernando Sr.', '+94 77 333 4444', 'nimal.sr@example.com'),
('parent-4', 'st-4', 'Anura Perera', '+94 77 444 5555', 'anura.perera@example.com')
on conflict (id) do update set student_id = excluded.student_id, name = excluded.name, whatsapp_number = excluded.whatsapp_number, email = excluded.email;

insert into exams (id, subject_id, exam_type, title, exam_date, total_marks, created_by) values
('exam-1', 'math', 'term-test', 'Term Test 2', '2026-05-14', 100, 'user-teacher-1'),
('exam-2', 'eng', 'month-test', 'May Benchmark', '2026-05-15', 100, 'user-teacher-1'),
('exam-3', 'sci', 'month-test', 'May Benchmark', '2026-05-16', 100, 'user-teacher-1'),
('exam-4', 'hist', 'term-test', 'Term Test 2', '2026-05-18', 100, 'user-teacher-1'),
('exam-5', 'cs', 'quiz', 'Coding Challenge', '2026-05-20', 100, 'user-teacher-1')
on conflict (id) do update set subject_id = excluded.subject_id, exam_type = excluded.exam_type, title = excluded.title, exam_date = excluded.exam_date, total_marks = excluded.total_marks, created_by = excluded.created_by;

insert into results (id, exam_id, student_id, marks_obtained, is_absent) values
('result-1', 'exam-1', 'st-1', 91, false),
('result-2', 'exam-2', 'st-1', 78, false),
('result-3', 'exam-3', 'st-3', 84, false),
('result-4', 'exam-4', 'st-4', 87, false),
('result-5', 'exam-5', 'st-1', 98, false)
on conflict (id) do update set exam_id = excluded.exam_id, student_id = excluded.student_id, marks_obtained = excluded.marks_obtained, is_absent = excluded.is_absent;

insert into homework_records (id, exam_id, student_id, is_done, updated_by) values
('hwrec-1', 'exam-1', 'st-1', true, 'user-teacher-1'),
('hwrec-2', 'exam-2', 'st-1', true, 'user-teacher-1'),
('hwrec-3', 'exam-3', 'st-1', false, 'user-teacher-1'),
('hwrec-4', 'exam-4', 'st-1', true, 'user-teacher-1'),
('hwrec-5', 'exam-5', 'st-1', false, 'user-teacher-1')
on conflict (id) do update set exam_id = excluded.exam_id, student_id = excluded.student_id, is_done = excluded.is_done, updated_by = excluded.updated_by;

insert into monthly_reports (id, student_id, report_month, report_year, report_data, sent_via, sent_at, status) values
('report-1', 'st-1', 4, 2026, '{"summary":"Strong progress"}', 'whatsapp', '2026-04-30 10:00:00', 'sent'),
('report-2', 'st-2', 4, 2026, '{"summary":"Needs revision"}', 'email', null, 'pending')
on conflict (id) do update set student_id = excluded.student_id, report_month = excluded.report_month, report_year = excluded.report_year, report_data = excluded.report_data, sent_via = excluded.sent_via, sent_at = excluded.sent_at, status = excluded.status;