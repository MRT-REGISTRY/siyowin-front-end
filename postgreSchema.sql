DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'super-admin');
CREATE TYPE exam_type_enum AS ENUM ('term-test', 'day-paper', 'month-test', 'quiz', 'practical');
CREATE TYPE report_status AS ENUM ('pending', 'sent', 'failed');
CREATE TYPE report_channel AS ENUM ('whatsapp', 'email', 'both');

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    student_id TEXT,
    teacher_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teachers (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grades (
    id TEXT PRIMARY KEY,
    grade_name VARCHAR(50) UNIQUE NOT NULL,
    display_order INTEGER
);

CREATE TABLE subjects (
    id TEXT PRIMARY KEY,
    teacher_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
    grade_id TEXT REFERENCES grades(id) ON DELETE SET NULL,
    subject_name VARCHAR(100),
    year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id TEXT PRIMARY KEY,
    index_number VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    grade_id TEXT REFERENCES grades(id) ON DELETE SET NULL,
    class_id TEXT,
    parent_name VARCHAR(100),
    parent_phone VARCHAR(20),
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_enrollments (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (student_id, subject_id)
);

CREATE TABLE parents (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    name VARCHAR(100),
    whatsapp_number VARCHAR(20),
    email VARCHAR(150)
);

CREATE TABLE exams (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
    exam_type exam_type_enum NOT NULL,
    title VARCHAR(150) NOT NULL,
    exam_date DATE NOT NULL,
    total_marks DECIMAL(6,2),
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE results (
    id TEXT PRIMARY KEY,
    exam_id TEXT REFERENCES exams(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(6,2),
    is_absent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (exam_id, student_id)
);

CREATE TABLE homework_records (
    id TEXT PRIMARY KEY,
    exam_id TEXT REFERENCES exams(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    is_done BOOLEAN DEFAULT FALSE,
    updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (exam_id, student_id)
);

CREATE TABLE monthly_reports (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    report_month INTEGER CHECK (report_month BETWEEN 1 AND 12),
    report_year INTEGER NOT NULL,
    report_data JSONB,
    sent_via report_channel,
    sent_at TIMESTAMP,
    status report_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_grade ON students(grade_id);
CREATE INDEX idx_subjects_teacher ON subjects(teacher_id);
CREATE INDEX idx_subjects_grade ON subjects(grade_id);
CREATE INDEX idx_results_exam ON results(exam_id);
CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX idx_exams_subject ON exams(subject_id);

ALTER TABLE users
    ADD CONSTRAINT users_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL;

ALTER TABLE users
    ADD CONSTRAINT users_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_results_updated
BEFORE UPDATE ON results
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_homework_updated
BEFORE UPDATE ON homework_records
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;