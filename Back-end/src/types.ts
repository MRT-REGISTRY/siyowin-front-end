export type UserRole = 'student' | 'teacher' | 'admin' | 'super-admin';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  teacherId?: string;
};

export type SubjectHistoryItem = {
  label: string;
  date: string;
  mark: number;
  note: string;
};

export type SubjectHomeworkItem = {
  id: string;
  title: string;
  dueDate: string;
  completedDate?: string;
  status: 'completed' | 'pending';
};

export type SubjectRecord = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  teacher: string;
  classLabel: string;
  rank: number;
  trend: 'up' | 'down' | 'neutral';
  currentMark: number;
  classAvg: number;
  nextExam: string;
  termTest: number;
  dayPaper: number;
  monthTest: number;
  history: SubjectHistoryItem[];
  homeworkDoneThisMonth: number;
  homeworkTargetThisMonth: number;
  recentHomeworks: SubjectHomeworkItem[];
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  marks: number;
  avatar?: string;
  badge?: 'gold' | 'silver' | 'bronze' | null;
  isYou?: boolean;
};

export type AdminClassOption = {
  id: string;
  grade: string;
  name: string;
  label: string;
};

export type AdminSubjectOption = {
  id: string;
  name: string;
  teacher: string;
};

export type AdminExamType = {
  id: string;
  label: string;
};

export type AdminStudentMark = {
  subjectId: string;
  subjectName: string;
  examType: string;
  examName: string;
  examDate: string;
  mark: number;
  note?: string;
};

export type AdminStudent = {
  id: string;
  name: string;
  index: string;
  grade: string;
  classId: string;
  parentName?: string;
  parentPhone?: string;
  marks: AdminStudentMark[];
};

export type AdminTeacher = {
  id: string;
  name: string;
  subject: string;
  grade: string;
  email: string;
  phone: string;
};

export type DashboardOverview = {
  averageMark: number;
  bestSubject: string;
  subjectsEnrolled: number;
  homeworkCompletion: number;
  classRank: number;
};
