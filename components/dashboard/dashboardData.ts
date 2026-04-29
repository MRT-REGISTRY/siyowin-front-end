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

export const SUBJECTS: SubjectRecord[] = [
  {
    id: 'math',
    name: 'Mathematics',
    emoji: '📐',
    color: '#D9232D',
    teacher: 'Mr. Silva',
    classLabel: 'Grade 11 · Mathematics',
    rank: 2,
    trend: 'up',
    currentMark: 91,
    classAvg: 74,
    nextExam: 'May 12',
    termTest: 92,
    dayPaper: 89,
    monthTest: 90,
    history: [
      { label: 'Unit Test 4', date: 'Apr 24', mark: 91, note: 'Strong algebra section' },
      { label: 'Monthly Test', date: 'Apr 14', mark: 89, note: 'Top 3 in class' },
      { label: 'Day Paper', date: 'Mar 29', mark: 93, note: 'Fast and accurate' },
      { label: 'Term Test 2', date: 'Mar 18', mark: 88, note: 'Excellent geometry' },
      { label: 'Quiz', date: 'Mar 04', mark: 90, note: 'Completed early' },
    ],
    homeworkDoneThisMonth: 11,
    homeworkTargetThisMonth: 12,
  },
  {
    id: 'sci',
    name: 'Science',
    emoji: '🔬',
    color: '#F47920',
    teacher: 'Ms. Fernando',
    classLabel: 'Grade 11 · Science',
    rank: 5,
    trend: 'up',
    currentMark: 84,
    classAvg: 71,
    nextExam: 'May 14',
    termTest: 83,
    dayPaper: 80,
    monthTest: 85,
    history: [
      { label: 'Practical Test', date: 'Apr 23', mark: 84, note: 'Lab work was accurate' },
      { label: 'Monthly Test', date: 'Apr 11', mark: 81, note: 'Good improvement' },
      { label: 'Day Paper', date: 'Mar 28', mark: 82, note: 'Good pacing' },
      { label: 'Term Test 2', date: 'Mar 16', mark: 79, note: 'Needs a little more revision' },
      { label: 'Quiz', date: 'Mar 05', mark: 86, note: 'Strong recall' },
    ],
    homeworkDoneThisMonth: 9,
    homeworkTargetThisMonth: 11,
  },
  {
    id: 'eng',
    name: 'English',
    emoji: '📖',
    color: '#1B3A8C',
    teacher: 'Mrs. Perera',
    classLabel: 'Grade 11 · English',
    rank: 12,
    trend: 'neutral',
    currentMark: 78,
    classAvg: 76,
    nextExam: 'May 10',
    termTest: 77,
    dayPaper: 79,
    monthTest: 78,
    history: [
      { label: 'Essay Check', date: 'Apr 22', mark: 78, note: 'Clear structure' },
      { label: 'Monthly Test', date: 'Apr 12', mark: 76, note: 'Close to class average' },
      { label: 'Day Paper', date: 'Mar 30', mark: 79, note: 'Good vocabulary use' },
      { label: 'Term Test 2', date: 'Mar 17', mark: 77, note: 'Solid reading score' },
      { label: 'Spelling Quiz', date: 'Mar 03', mark: 80, note: 'Very accurate' },
    ],
    homeworkDoneThisMonth: 8,
    homeworkTargetThisMonth: 10,
  },
  {
    id: 'hist',
    name: 'History',
    emoji: '🏛️',
    color: '#c0392b',
    teacher: 'Mr. Gunasena',
    classLabel: 'Grade 11 · History',
    rank: 1,
    trend: 'up',
    currentMark: 95,
    classAvg: 68,
    nextExam: 'May 18',
    termTest: 94,
    dayPaper: 96,
    monthTest: 95,
    history: [
      { label: 'Term Test 2', date: 'Apr 25', mark: 95, note: 'Best in class' },
      { label: 'Monthly Test', date: 'Apr 13', mark: 94, note: 'Excellent analysis' },
      { label: 'Day Paper', date: 'Mar 31', mark: 96, note: 'Very detailed answers' },
      { label: 'Quiz', date: 'Mar 19', mark: 92, note: 'Strong recall of events' },
      { label: 'Source Question', date: 'Mar 06', mark: 95, note: 'Well reasoned' },
    ],
    homeworkDoneThisMonth: 10,
    homeworkTargetThisMonth: 10,
  },
  {
    id: 'geo',
    name: 'Geography',
    emoji: '🌍',
    color: '#e67e22',
    teacher: 'Ms. Jayawardena',
    classLabel: 'Grade 11 · Geography',
    rank: 18,
    trend: 'down',
    currentMark: 72,
    classAvg: 73,
    nextExam: 'May 16',
    termTest: 73,
    dayPaper: 71,
    monthTest: 72,
    history: [
      { label: 'Map Test', date: 'Apr 21', mark: 72, note: 'Good map reading' },
      { label: 'Monthly Test', date: 'Apr 10', mark: 71, note: 'Needs more revision' },
      { label: 'Day Paper', date: 'Mar 27', mark: 73, note: 'Answer length improved' },
      { label: 'Term Test 2', date: 'Mar 15', mark: 74, note: 'Better structure' },
      { label: 'Quiz', date: 'Mar 02', mark: 70, note: 'Revision required' },
    ],
    homeworkDoneThisMonth: 7,
    homeworkTargetThisMonth: 10,
  },
  {
    id: 'cs',
    name: 'Computer Science',
    emoji: '💻',
    color: '#2c55c7',
    teacher: 'Mr. Bandara',
    classLabel: 'Grade 11 · Computer Science',
    rank: 1,
    trend: 'up',
    currentMark: 98,
    classAvg: 69,
    nextExam: 'May 20',
    termTest: 99,
    dayPaper: 97,
    monthTest: 98,
    history: [
      { label: 'Coding Challenge', date: 'Apr 26', mark: 98, note: 'Clean solution' },
      { label: 'Monthly Test', date: 'Apr 15', mark: 99, note: 'Perfect logic flow' },
      { label: 'Day Paper', date: 'Mar 28', mark: 97, note: 'Fast and accurate' },
      { label: 'Term Test 2', date: 'Mar 17', mark: 98, note: 'Strong debugging' },
      { label: 'Quiz', date: 'Mar 05', mark: 100, note: 'No mistakes' },
    ],
    homeworkDoneThisMonth: 12,
    homeworkTargetThisMonth: 12,
  },
];

export const getSubjectById = (id: string) => SUBJECTS.find((subject) => subject.id === id);