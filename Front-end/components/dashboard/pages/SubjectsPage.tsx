'use client';

import { Filter, Search, ArrowRight } from 'lucide-react';
import { SubjectRecord } from '@/types';

interface Props {
  subjects: SubjectRecord[];
  onSelectSubject?: (subjectId: string) => void;
}

export default function SubjectsPage({ subjects, onSelectSubject }: Props) {
  return (
    <div className="sdp-wrap">
      <div className="sdp-header">
        <div>
          <h1 className="sdp-title">My Subjects</h1>
          <p className="sdp-sub">Term 2 - 2026 - {subjects.length} subjects enrolled</p>
        </div>
        <div className="sdp-header-right">
          <div className="sdp-search">
            <Search size={14} className="sdp-search-icon" />
            <input placeholder="Search subject..." className="sdp-search-input" />
          </div>
          <button className="sdp-filter-btn"><Filter size={14} /> Filter</button>
        </div>
      </div>

      <div className="sdp-strip">
        <div className="sdp-strip-item">
          <span className="sdp-strip-val">{subjects.length}</span>
          <span className="sdp-strip-label">Subjects</span>
        </div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item">
          <span className="sdp-strip-val">{subjects.filter((subject) => subject.trend === 'up').length}</span>
          <span className="sdp-strip-label">Improving</span>
        </div>
      </div>

      <div className="sdp-grid">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            type="button"
            className="sdp-card sdp-subject-card-btn"
            onClick={() => onSelectSubject?.(subject.id)}
          >
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
        ))}
      </div>
    </div>
  );
}
