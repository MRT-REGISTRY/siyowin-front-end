'use client';

import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { SUBJECTS } from '@/data/dashboardData';

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp size={14} className="sd-trend-icon-up" />;
  if (trend === 'down') return <TrendingDown size={14} className="sd-trend-icon-down" />;
  return <Minus size={14} className="sd-trend-icon-neutral" />;
};

interface Props {
  onSelectSubject?: (subjectId: string) => void;
  onViewAll?: () => void;
}

export default function SubjectCards({ onSelectSubject, onViewAll }: Props) {
  return (
    <section className="sd-subjects-section">
      <div className="sd-section-header">
        <h2 className="sd-section-title">📚 Subject Performance</h2>
        <button className="sd-view-all-btn" type="button" onClick={onViewAll}>
          View All <ArrowRight size={13} />
        </button>
      </div>
      <div className="sd-subjects-grid">
        {SUBJECTS.map((subject) => {
          const pct = subject.currentMark;
          const aboveAvg = subject.currentMark >= subject.classAvg;
          return (
            <button
              key={subject.id}
              type="button"
              className="sd-subject-card sd-subject-card-btn"
              onClick={() => onSelectSubject?.(subject.id)}
            >
              <div className="sd-subject-card-top">
                <div className="sd-subject-emoji">{subject.emoji}</div>
                <div className="sd-subject-info">
                  <p className="sd-subject-name">{subject.name}</p>
                  <p className="sd-subject-teacher">{subject.teacher}</p>
                </div>
                <span className="sd-subject-open">Open</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
