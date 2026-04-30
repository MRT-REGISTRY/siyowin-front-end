create table if not exists app_users (
  id text primary key,
  name text not null,
  email text unique not null,
  role text not null check (role in ('student', 'teacher', 'admin', 'super-admin')),
  student_id text,
  teacher_id text,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists students (
  id text primary key,
  name text not null,
  index text unique not null,
  grade text not null,
  class_id text not null,
  parent_name text,
  parent_phone text,
  created_at timestamptz not null default now()
);

create table if not exists teachers (
  id text primary key,
  name text not null,
  subject text not null,
  grade text not null,
  email text unique not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists classes (
  id text primary key,
  grade text not null,
  name text not null,
  label text not null
);

create table if not exists subjects (
  id text primary key,
  name text not null,
  emoji text not null default '',
  color text not null,
  teacher text not null,
  class_label text not null,
  rank integer not null default 0,
  trend text not null check (trend in ('up', 'down', 'neutral')),
  current_mark integer not null default 0,
  class_avg integer not null default 0,
  next_exam text not null default '',
  term_test integer not null default 0,
  day_paper integer not null default 0,
  month_test integer not null default 0,
  homework_done_this_month integer not null default 0,
  homework_target_this_month integer not null default 0,
  display_order integer not null default 0
);

create table if not exists subject_history (
  id bigserial primary key,
  subject_id text not null references subjects(id) on delete cascade,
  label text not null,
  date text not null,
  mark integer not null,
  note text not null,
  display_order integer not null default 0
);

create table if not exists homeworks (
  id text primary key,
  student_id text references students(id) on delete cascade,
  subject_id text not null references subjects(id) on delete cascade,
  title text not null,
  due_date text not null,
  completed_date text,
  status text not null check (status in ('completed', 'pending')),
  display_order integer not null default 0
);

create table if not exists leaderboards (
  id bigserial primary key,
  subject_id text not null references subjects(id) on delete cascade,
  rank integer not null,
  name text not null,
  marks integer not null,
  avatar text,
  badge text check (badge in ('gold', 'silver', 'bronze')),
  is_you boolean not null default false
);

create table if not exists marks (
  id bigserial primary key,
  student_id text not null references students(id) on delete cascade,
  subject_id text not null references subjects(id) on delete cascade,
  subject_name text not null,
  exam_type text not null,
  exam_name text not null,
  exam_date text not null,
  mark integer not null check (mark >= 0 and mark <= 100),
  note text,
  unique (student_id, subject_id, exam_type, exam_name)
);

create index if not exists idx_homeworks_subject on homeworks(subject_id, display_order);
create index if not exists idx_history_subject on subject_history(subject_id, display_order);
create index if not exists idx_leaderboards_subject on leaderboards(subject_id, rank);
create index if not exists idx_marks_student on marks(student_id);
