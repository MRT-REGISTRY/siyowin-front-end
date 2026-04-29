'use client';

import { CheckCircle2, Circle } from 'lucide-react';

const HOMEWORK = [
  { id: 1, subject: 'Mathematics', task: 'Chapter 7 – Trigonometry exercises', due: 'Apr 28', status: 'done' },
  { id: 2, subject: 'Science', task: 'Lab report: Osmosis experiment', due: 'Apr 29', status: 'done' },
  { id: 3, subject: 'English', task: 'Essay: Climate Change solutions', due: 'Apr 30', status: 'done' },
  { id: 4, subject: 'History', task: 'World War II timeline project', due: 'May 2', status: 'done' },
  { id: 5, subject: 'Geography', task: 'Map activity: South-East Asia', due: 'May 3', status: 'pending' },
  { id: 6, subject: 'Computer Science', task: 'Build a simple sorting algorithm', due: 'May 5', status: 'pending' },
];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#4F46E5',
  Science: '#22C55E',
  English: '#F59E0B',
  History: '#8B5CF6',
  Geography: '#EC4899',
  'Computer Science': '#06B6D4',
};

export default function HomeworkSection() {
  const done = HOMEWORK.filter((h) => h.status === 'done').length;
  const total = HOMEWORK.length;
  const pct = Math.round((done / total) * 100);

  return (
    <section className="sd-hw-section">
      <div className="sd-section-header">
        <div>
          <h2 className="sd-section-title">📝 Homework</h2>
          <p className="sd-section-sub">{done} of {total} tasks completed</p>
        </div>
        {/* Completion ring */}
        <div className="sd-hw-ring-wrap">
          <svg viewBox="0 0 36 36" className="sd-hw-ring">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#F3F4F6" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="#D9232D"
              strokeWidth="3"
              strokeDasharray={`${pct * 0.942} 94.2`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            />
          </svg>
          <span className="sd-hw-ring-pct">{pct}%</span>
        </div>
      </div>

      <ul className="sd-hw-list">
        {HOMEWORK.map((hw) => {
          const isDone = hw.status === 'done';
          const dotColor = SUBJECT_COLORS[hw.subject] ?? '#9CA3AF';
          return (
            <li key={hw.id} className={`sd-hw-item ${isDone ? 'sd-hw-done' : ''}`}>
              <div className="sd-hw-status-icon">
                {isDone ? (
                  <CheckCircle2 size={18} className="sd-hw-check" />
                ) : (
                  <Circle size={18} className="sd-hw-pending-icon" />
                )}
              </div>
              <div className="sd-hw-body">
                <div className="sd-hw-top-row">
                  <span className="sd-hw-dot" style={{ backgroundColor: dotColor }} />
                  <span className="sd-hw-subject">{hw.subject}</span>
                  <span className={`sd-hw-badge ${isDone ? 'sd-badge-done' : 'sd-badge-pending'}`}>
                    {isDone ? 'Completed' : 'Not Completed'}
                  </span>
                </div>
                <p className={`sd-hw-task ${isDone ? 'sd-hw-task-done' : ''}`}>{hw.task}</p>
              </div>
              <span className="sd-hw-due">Due {hw.due}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
