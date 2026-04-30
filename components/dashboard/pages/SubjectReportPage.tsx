'use client';

import { ArrowLeft, CalendarDays, FileText, GraduationCap, NotebookPen } from 'lucide-react';
import { SubjectRecord } from '@/types';
import LeaderboardForSubject from '../LeaderboardForSubject';

interface Props {
  subject: SubjectRecord;
  onBack: () => void;
}

const getOverallPerformance = (subject: SubjectRecord) => {
  return Math.round((subject.termTest + subject.dayPaper + subject.monthTest) / 3);
};

export default function SubjectReportPage({ subject, onBack }: Props) {
  const overall = getOverallPerformance(subject);
  const homeworkPercent = Math.round((subject.homeworkDoneThisMonth / subject.homeworkTargetThisMonth) * 100);
  const remainingHomework = Math.max(subject.homeworkTargetThisMonth - subject.homeworkDoneThisMonth, 0);

  return (
    <div className="sdr-wrap">
      <div className="sdr-topbar">
        <button type="button" className="sdr-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to subjects
        </button>
        <span className="sdr-class-pill">{subject.classLabel}</span>
      </div>

      <section className="sdr-hero sdp-card">
        <div className="sdr-hero-main">
          <div className="sdr-emoji" aria-hidden="true">{subject.emoji}</div>
          <div>
            <p className="sdr-subtitle">Overall report card</p>
            <h1 className="sdr-title">{subject.name}</h1>
            <p className="sdr-teacher">Teacher: {subject.teacher}</p>
          </div>
        </div>

        <div className="sdr-overall-box" style={{ borderColor: subject.color }}>
          <span className="sdr-overall-label">Overall performance</span>
          <strong className="sdr-overall-mark" style={{ color: subject.color }}>{overall}%</strong>
          <span className="sdr-overall-sub">Rank #{subject.rank} · {subject.currentMark}% current subject mark</span>
        </div>
      </section>

      <section className="sdr-metric-grid">
        <article className="sdr-metric-card sdp-card">
          <div className="sdr-metric-head">
            <span className="sdr-metric-icon sdr-icon-red"><GraduationCap size={18} /></span>
            <span className="sdr-metric-label">Recent term test</span>
          </div>
          <strong className="sdr-metric-value">{subject.termTest}%</strong>
          <p className="sdr-metric-note">Latest term test result</p>
        </article>

        <article className="sdr-metric-card sdp-card">
          <div className="sdr-metric-head">
            <span className="sdr-metric-icon sdr-icon-orange"><FileText size={18} /></span>
            <span className="sdr-metric-label">Day paper marks</span>
          </div>
          <strong className="sdr-metric-value">{subject.dayPaper}%</strong>
          <p className="sdr-metric-note">Fast-response exam performance</p>
        </article>

        <article className="sdr-metric-card sdp-card">
          <div className="sdr-metric-head">
            <span className="sdr-metric-icon sdr-icon-navy"><CalendarDays size={18} /></span>
            <span className="sdr-metric-label">Month test marks</span>
          </div>
          <strong className="sdr-metric-value">{subject.monthTest}%</strong>
          <p className="sdr-metric-note">Current month benchmark</p>
        </article>
      </section>

      <section className="sdr-main-grid">
        <article className="sdr-history-card sdp-card">
          <div className="sd-section-header">
            <div>
              <h2 className="sd-section-title">Previous results</h2>
              <p className="sd-section-sub">Recent exam history, limited to the latest entries</p>
            </div>
          </div>

          <div className="sdr-history-list">
            {subject.history.map((item) => (
              <div key={`${item.label}-${item.date}`} className="sdr-history-item">
                <div className="sdr-history-icon">
                  <NotebookPen size={16} />
                </div>
                <div className="sdr-history-body">
                  <div className="sdr-history-top">
                    <strong>{item.label}</strong>
                    <span>{item.date}</span>
                  </div>
                  <p className="sdr-history-note">{item.note}</p>
                </div>
                <div className="sdr-history-mark" style={{ color: subject.color }}>{item.mark}%</div>
              </div>
            ))}
          </div>
        </article>

        <article className="sdr-homework-card sdp-card">
          <div className="sd-section-header">
            <div>
              <h2 className="sd-section-title">Homework completed</h2>
              <p className="sd-section-sub">Current month progress</p>
            </div>
          </div>

          <div className="sdr-homework-ring">
            <div className="sdr-ring-inner" style={{ background: `conic-gradient(${subject.color} ${homeworkPercent}%, #EEF2F7 ${homeworkPercent}% 100%)` }}>
              <div className="sdr-ring-center">
                <strong>{subject.homeworkDoneThisMonth}</strong>
                <span>done</span>
              </div>
            </div>
          </div>

          <div className="sdr-homework-stats">
            <div>
              <span className="sdr-homework-label">Completed</span>
              <strong>{subject.homeworkDoneThisMonth}/{subject.homeworkTargetThisMonth}</strong>
            </div>
            <div>
              <span className="sdr-homework-label">Remaining</span>
              <strong>{remainingHomework}</strong>
            </div>
          </div>

          <div className="sdr-homework-bar">
            <div className="sdr-homework-bar-fill" style={{ width: `${homeworkPercent}%`, background: subject.color }} />
          </div>

          <p className="sdr-homework-note">
            {homeworkPercent >= 100 ? 'Homework target completed for the month.' : `${remainingHomework} assignment${remainingHomework === 1 ? '' : 's'} still pending this month.`}
          </p>
        </article>
      </section>
      
      <section className="sdr-main-grid">
        <article className="sdr-leaderboard-card sdp-card">
          <div className="sd-section-header">
            <div>
              <h2 className="sd-section-title">Class Leaderboard</h2>
              <p className="sd-section-sub">Performance within this class / subject</p>
            </div>
          </div>
          <LeaderboardForSubject subjectId={subject.id} />
        </article>
      </section>
    </div>
  );
}