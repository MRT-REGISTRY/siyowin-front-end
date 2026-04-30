// Centralized TypeScript types for the dashboard

export type SubjectHistoryItem = {
  label: string;
  date: string;
  mark: number;
  note: string;
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
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  marks: number;
  avatar?: string;
  badge?: 'gold' | 'silver' | 'bronze' | null;
  isYou?: boolean;
};
