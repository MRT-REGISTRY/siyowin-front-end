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
create index if not exists idx_homeworks_student on homeworks(student_id);
create index if not exists idx_history_subject on subject_history(subject_id, display_order);
create index if not exists idx_leaderboards_subject on leaderboards(subject_id, rank);
create index if not exists idx_marks_student on marks(student_id);
create index if not exists idx_marks_subject on marks(subject_id);

alter table app_users enable row level security;
alter table students enable row level security;
alter table teachers enable row level security;
alter table classes enable row level security;
alter table subjects enable row level security;
alter table subject_history enable row level security;
alter table homeworks enable row level security;
alter table leaderboards enable row level security;
alter table marks enable row level security;

create table if not exists site_hero_images (
  id text primary key,
  src text not null,
  alt text not null,
  width integer not null,
  height integer not null,
  display_order integer not null default 0
);

create table if not exists site_about_features (
  id text primary key,
  text text not null,
  display_order integer not null default 0
);

create table if not exists site_about_stats (
  id text primary key,
  value text not null,
  label text not null,
  display_order integer not null default 0
);

create table if not exists site_lecturer_sections (
  id integer primary key,
  title text not null,
  highlight text not null,
  description text not null,
  view_all_href text not null,
  display_order integer not null default 0
);

create table if not exists site_lecturers (
  id integer primary key,
  section_id integer not null references site_lecturer_sections(id) on delete cascade,
  name text not null,
  subject text not null,
  credentials text not null,
  image text not null,
  photo_bg text not null,
  info_bg text not null,
  accent text not null,
  display_order integer not null default 0
);

create table if not exists site_gallery_images (
  id integer primary key,
  src text not null,
  alt text not null,
  category text not null check (category in ('indoor', 'outdoor')),
  display_order integer not null default 0
);

create table if not exists site_articles (
  id integer primary key,
  title text not null,
  description text not null,
  image text not null,
  published_label text not null,
  category text not null,
  read_time text not null,
  href text not null default '#',
  display_order integer not null default 0
);

create index if not exists idx_site_lecturers_section on site_lecturers(section_id, display_order);
create index if not exists idx_site_gallery_order on site_gallery_images(display_order);
create index if not exists idx_site_articles_order on site_articles(display_order);

alter table site_hero_images enable row level security;
alter table site_about_features enable row level security;
alter table site_about_stats enable row level security;
alter table site_lecturer_sections enable row level security;
alter table site_lecturers enable row level security;
alter table site_gallery_images enable row level security;
alter table site_articles enable row level security;

drop policy if exists "Public read site hero images" on site_hero_images;
create policy "Public read site hero images" on site_hero_images for select to anon, authenticated using (true);

drop policy if exists "Public read site about features" on site_about_features;
create policy "Public read site about features" on site_about_features for select to anon, authenticated using (true);

drop policy if exists "Public read site about stats" on site_about_stats;
create policy "Public read site about stats" on site_about_stats for select to anon, authenticated using (true);

drop policy if exists "Public read site lecturer sections" on site_lecturer_sections;
create policy "Public read site lecturer sections" on site_lecturer_sections for select to anon, authenticated using (true);

drop policy if exists "Public read site lecturers" on site_lecturers;
create policy "Public read site lecturers" on site_lecturers for select to anon, authenticated using (true);

drop policy if exists "Public read site gallery images" on site_gallery_images;
create policy "Public read site gallery images" on site_gallery_images for select to anon, authenticated using (true);

drop policy if exists "Public read site articles" on site_articles;
create policy "Public read site articles" on site_articles for select to anon, authenticated using (true);
