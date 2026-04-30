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
  const done = visibleHomework.filter((h) => h.status === 'completed').length;
  const total = visibleHomework.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section className="sd-hw-section">
      <div className="sd-section-header">
        <div>
          <h2 className="sd-section-title">Homework</h2>
          <p className="sd-section-sub">{done} of {total} tasks completed</p>
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

      <ul className="sd-hw-list">
        {visibleHomework.map((hw) => {
          const isDone = hw.status === 'completed';

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
                  <span className="sd-hw-dot" style={{ backgroundColor: hw.color ?? '#9CA3AF' }} />
                  <span className="sd-hw-subject">{hw.subjectName}</span>
                  <span className={`sd-hw-badge ${isDone ? 'sd-badge-done' : 'sd-badge-pending'}`}>
                    {isDone ? 'Completed' : 'Not Completed'}
                  </span>
                </div>
                <p className={`sd-hw-task ${isDone ? 'sd-hw-task-done' : ''}`}>{hw.title}</p>
              </div>
              <span className="sd-hw-due">Due {hw.dueDate}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
