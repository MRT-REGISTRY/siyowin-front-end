'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SUBJECTS = [
  { id: 'math', name: 'Mathematics',      emoji: '📐', mark: 91, avg: 74, rank: 2,  trend: 'up',      color: '#D9232D' },
  { id: 'sci',  name: 'Science',          emoji: '🔬', mark: 84, avg: 71, rank: 5,  trend: 'up',      color: '#F47920' },
  { id: 'eng',  name: 'English',          emoji: '📖', mark: 78, avg: 76, rank: 12, trend: 'neutral', color: '#1B3A8C' },
  { id: 'hist', name: 'History',          emoji: '🏛️', mark: 95, avg: 68, rank: 1,  trend: 'up',      color: '#c0392b' },
  { id: 'geo',  name: 'Geography',        emoji: '🌍', mark: 72, avg: 73, rank: 18, trend: 'down',    color: '#e67e22' },
  { id: 'cs',   name: 'Computer Science', emoji: '💻', mark: 98, avg: 69, rank: 1,  trend: 'up',      color: '#2c55c7' },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp size={14} className="sd-trend-icon-up" />;
  if (trend === 'down') return <TrendingDown size={14} className="sd-trend-icon-down" />;
  return <Minus size={14} className="sd-trend-icon-neutral" />;
};

export default function SubjectCards() {
  return (
    <section className="sd-subjects-section">
      <div className="sd-section-header">
        <h2 className="sd-section-title">📚 Subject Performance</h2>
        <button className="sd-view-all-btn">View All</button>
      </div>
      <div className="sd-subjects-grid">
        {SUBJECTS.map((subject) => {
          const pct = subject.mark;
          const aboveAvg = subject.mark >= subject.avg;
          return (
            <article key={subject.id} className="sd-subject-card">
              <div className="sd-subject-card-top">
                <div className="sd-subject-emoji">{subject.emoji}</div>
                <div className="sd-subject-info">
                  <p className="sd-subject-name">{subject.name}</p>
                  <div className="sd-subject-rank-row">
                    <span className="sd-subject-rank">Rank #{subject.rank}</span>
                    <span className={`sd-subject-trend ${subject.trend === 'up' ? 'sd-trend-up-text' : subject.trend === 'down' ? 'sd-trend-down-text' : 'sd-trend-neutral-text'}`}>
                      <TrendIcon trend={subject.trend} />
                      {subject.trend === 'up' ? 'Improving' : subject.trend === 'down' ? 'Declining' : 'Stable'}
                    </span>
                  </div>
                </div>
                <div className="sd-subject-mark" style={{ color: subject.color }}>
                  {subject.mark}%
                </div>
              </div>

              {/* Progress bar */}
              <div className="sd-subject-bar-wrap">
                <div className="sd-subject-bar-track">
                  <div
                    className="sd-subject-bar-fill"
                    style={{ width: `${pct}%`, backgroundColor: subject.color }}
                  />
                </div>
              </div>

              {/* Class avg */}
              <div className="sd-subject-avg-row">
                <span className="sd-subject-avg-label">Class avg: {subject.avg}%</span>
                <span className={aboveAvg ? 'sd-above-avg' : 'sd-below-avg'}>
                  {aboveAvg ? `+${subject.mark - subject.avg}%` : `${subject.mark - subject.avg}%`} vs avg
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
