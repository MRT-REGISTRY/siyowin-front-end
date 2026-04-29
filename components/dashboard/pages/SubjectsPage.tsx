'use client';

import { TrendingUp, TrendingDown, Minus, Filter, Search } from 'lucide-react';

const SUBJECTS = [
  { id: 'math', name: 'Mathematics',      emoji: '📐', mark: 91, avg: 74, rank: 2,  trend: 'up',      color: '#D9232D', teacher: 'Mr. Silva',    nextExam: 'May 12' },
  { id: 'sci',  name: 'Science',          emoji: '🔬', mark: 84, avg: 71, rank: 5,  trend: 'up',      color: '#F47920', teacher: 'Ms. Fernando', nextExam: 'May 14' },
  { id: 'eng',  name: 'English',          emoji: '📖', mark: 78, avg: 76, rank: 12, trend: 'neutral', color: '#1B3A8C', teacher: 'Mrs. Perera',  nextExam: 'May 10' },
  { id: 'hist', name: 'History',          emoji: '🏛️', mark: 95, avg: 68, rank: 1,  trend: 'up',      color: '#c0392b', teacher: 'Mr. Gunasena', nextExam: 'May 18' },
  { id: 'geo',  name: 'Geography',        emoji: '🌍', mark: 72, avg: 73, rank: 18, trend: 'down',    color: '#e67e22', teacher: 'Ms. Jayawardena', nextExam: 'May 16' },
  { id: 'cs',   name: 'Computer Science', emoji: '💻', mark: 98, avg: 69, rank: 1,  trend: 'up',      color: '#2c55c7', teacher: 'Mr. Bandara',  nextExam: 'May 20' },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp size={14} />;
  if (trend === 'down') return <TrendingDown size={14} />;
  return <Minus size={14} />;
};

export default function SubjectsPage() {
  const avg = Math.round(SUBJECTS.reduce((s, x) => s + x.mark, 0) / SUBJECTS.length);

  return (
    <div className="sdp-wrap">
      {/* Header */}
      <div className="sdp-header">
        <div>
          <h1 className="sdp-title">📚 My Subjects</h1>
          <p className="sdp-sub">Term 2 · 2026 — {SUBJECTS.length} subjects enrolled</p>
        </div>
        <div className="sdp-header-right">
          <div className="sdp-search">
            <Search size={14} className="sdp-search-icon" />
            <input placeholder="Search subject…" className="sdp-search-input" />
          </div>
          <button className="sdp-filter-btn"><Filter size={14} /> Filter</button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="sdp-strip">
        <div className="sdp-strip-item">
          <span className="sdp-strip-val">{SUBJECTS.length}</span>
          <span className="sdp-strip-label">Subjects</span>
        </div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item">
          <span className="sdp-strip-val">{avg}%</span>
          <span className="sdp-strip-label">Avg Mark</span>
        </div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item">
          <span className="sdp-strip-val">{SUBJECTS.filter(s => s.trend === 'up').length}</span>
          <span className="sdp-strip-label">Improving</span>
        </div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item">
          <span className="sdp-strip-val">#3</span>
          <span className="sdp-strip-label">Overall Rank</span>
        </div>
      </div>

      {/* Subject cards grid */}
      <div className="sdp-grid">
        {SUBJECTS.map((subject) => {
          const aboveAvg = subject.mark >= subject.avg;
          return (
            <article key={subject.id} className="sdp-card">
              {/* Top color bar */}
              <div className="sdp-card-bar" style={{ background: subject.color }} />
              <div className="sdp-card-body">
                <div className="sdp-card-top">
                  <span className="sdp-card-emoji">{subject.emoji}</span>
                  <div className="sdp-card-info">
                    <h3 className="sdp-card-name">{subject.name}</h3>
                    <p className="sdp-card-teacher">{subject.teacher}</p>
                  </div>
                  <div className="sdp-card-mark" style={{ color: subject.color }}>{subject.mark}%</div>
                </div>

                {/* Progress bar */}
                <div className="sdp-bar-track">
                  <div className="sdp-bar-fill" style={{ width: `${subject.mark}%`, backgroundColor: subject.color }} />
                </div>

                <div className="sdp-card-meta">
                  <span className="sdp-meta-item">Rank <strong>#{subject.rank}</strong></span>
                  <span className="sdp-meta-item">Class avg <strong>{subject.avg}%</strong></span>
                  <span className={`sdp-meta-item ${aboveAvg ? 'sdp-above' : 'sdp-below'}`}>
                    {aboveAvg ? `+${subject.mark - subject.avg}%` : `${subject.mark - subject.avg}%`}
                  </span>
                </div>

                <div className="sdp-card-footer">
                  <span className={`sdp-trend-chip ${subject.trend === 'up' ? 'sdp-chip-up' : subject.trend === 'down' ? 'sdp-chip-down' : 'sdp-chip-neutral'}`}>
                    <TrendIcon trend={subject.trend} />
                    {subject.trend === 'up' ? 'Improving' : subject.trend === 'down' ? 'Declining' : 'Stable'}
                  </span>
                  <span className="sdp-next-exam">📅 Exam: {subject.nextExam}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
