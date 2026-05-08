'use client';

import { CheckCircle2, Circle } from 'lucide-react';

type HomeworkItem = {
  id: string;
  subjectName: string;
  title: string;
  dueDate: string;
  status: 'completed' | 'pending';
  color?: string;
};

export default function HomeworkSection({ homework }: { homework: HomeworkItem[] }) {
  const visibleHomework = homework.slice(0, 6);
  const done = 0;
  const total = 0;
  const pct = 0;

  return (
    <section className="sd-hw-section">
      <div className="sd-section-header">
        <div>
          <h2 className="sd-section-title">Homework</h2>
          <p className="sd-section-sub">No home works at the moment</p>
        </div>
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

      <div className="sd-hw-empty">No home works at the moment</div>
    </section>
  );
}
