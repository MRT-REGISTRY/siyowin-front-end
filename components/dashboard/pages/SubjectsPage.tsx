'use client';

import { TrendingUp, TrendingDown, Minus, Filter, Search, ArrowRight } from 'lucide-react';
import { SUBJECTS } from '@/data/dashboardData';

interface Props {
  onSelectSubject?: (subjectId: string) => void;
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp size={14} />;
  if (trend === 'down') return <TrendingDown size={14} />;
  return <Minus size={14} />;
};

interface Props {
  onSelectSubject?: (subjectId: string) => void;
}

export default function SubjectsPage({ onSelectSubject }: Props) {
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
          <span className="sdp-strip-val">{SUBJECTS.filter(s => s.trend === 'up').length}</span>
          <span className="sdp-strip-label">Improving</span>
        </div>
      </div>

      {/* Subject cards grid */}
      <div className="sdp-grid">
        {SUBJECTS.map((subject) => {
          const aboveAvg = subject.currentMark >= subject.classAvg;
          return (
            <button
              key={subject.id}
              type="button"
              className="sdp-card sdp-subject-card-btn"
              onClick={() => onSelectSubject?.(subject.id)}
            >
              {/* Top color bar */}
              <div className="sdp-card-bar" style={{ background: subject.color }} />
              <div className="sdp-card-body">
                <div className="sdp-card-top">
                  <span className="sdp-card-emoji">{subject.emoji}</span>
                  <div className="sdp-card-info">
                    <h3 className="sdp-card-name">{subject.name}</h3>
                    <p className="sdp-card-teacher">{subject.teacher}</p>
                  </div>
                  <span className="sdp-card-open">Open report <ArrowRight size={13} /></span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
