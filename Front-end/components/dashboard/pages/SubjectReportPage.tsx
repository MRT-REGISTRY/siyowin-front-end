'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, Circle, NotebookPen } from 'lucide-react';
import { SubjectExamResult, SubjectRecord, SubjectResultsResponse } from '@/types';
import { apiGet } from '@/utils/api';
import LeaderboardForSubject from '../LeaderboardForSubject';

interface Props {
  subject: SubjectRecord;
  onBack: () => void;
}

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatExamType = (value: string) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const renderScore = (result: SubjectExamResult) => {
  if (result.isAbsent) return 'Absent';

  const obtained = result.marksObtained ?? 0;
  const total = result.totalMarks ?? 100;
  return `${obtained}/${total}`;
};

export default function SubjectReportPage({ subject, onBack }: Props) {
  const [report, setReport] = useState<SubjectResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    apiGet<SubjectResultsResponse>(`/dashboard/subjects/${subject.id}/results`)
      .then((data) => {
        if (!mounted) return;
        setReport(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Unable to load subject results.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [subject.id]);

  const results = report?.results ?? [];
  const recentResults = report?.recentResults ?? [];
  const previousResults = report?.previousResults ?? [];
  const scoredResults = results.filter((item) => !item.isAbsent && item.marksObtained !== null);
  const averageMark = scoredResults.length
    ? Math.round(scoredResults.reduce((total, item) => total + (item.marksObtained ?? 0), 0) / scoredResults.length)
    : null;
  const absentCount = results.filter((item) => item.isAbsent).length;

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
            <p className="sdr-subtitle">Student exam results</p>
            <h1 className="sdr-title">{subject.name}</h1>
            <p className="sdr-teacher">Teacher: {subject.teacher}</p>
          </div>
        </div>

        <div className="sdr-overall-box" style={{ borderColor: subject.color }}>
          <span className="sdr-overall-label">Recent average</span>
          <strong className="sdr-overall-mark" style={{ color: subject.color }}>
            {averageMark !== null ? `${averageMark}%` : 'No marks yet'}
          </strong>
          <span className="sdr-overall-sub">
            {results.length} exam{results.length === 1 ? '' : 's'} · {absentCount} absent
          </span>
        </div>
      </section>

      {loading && <p className="sdp-card">Loading exam results...</p>}
      {!loading && error && <p className="sdp-card text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <section className="sdr-metric-grid">
            {recentResults.map((result) => (
              <article key={result.examId} className="sdr-metric-card sdp-card">
                <div className="sdr-metric-head">
                  <span className="sdr-metric-icon sdr-icon-red"><NotebookPen size={18} /></span>
                  <span className="sdr-metric-label">{formatExamType(result.examType)}</span>
                </div>
                <strong className="sdr-metric-value" style={{ color: subject.color }}>
                  {renderScore(result)}
                </strong>
                <p className="sdr-metric-note">{result.examTitle}</p>
                <p className="sdr-metric-note">
                  <CalendarDays size={14} style={{ display: 'inline', marginRight: 6 }} />
                  {formatDate(result.examDate)}
                </p>
                <p className="sdr-metric-note">{result.isAbsent ? 'Absent' : 'Present'}</p>
              </article>
            ))}

            {recentResults.length === 0 && (
              <article className="sdr-metric-card sdp-card">
                <div className="sdr-metric-head">
                  <span className="sdr-metric-icon sdr-icon-red"><NotebookPen size={18} /></span>
                  <span className="sdr-metric-label">Recent exams</span>
                </div>
                <strong className="sdr-metric-value">No results</strong>
                <p className="sdr-metric-note">No exam result rows are available for this subject yet.</p>
              </article>
            )}
          </section>

          <section className="sdr-main-grid">
            <article className="sdr-history-card sdp-card">
              <div className="sd-section-header">
                <div>
                  <h2 className="sd-section-title">Previous exams</h2>
                  <p className="sd-section-sub">Older results for this subject</p>
                </div>
              </div>

              {previousResults.length > 0 ? (
                <div className="sdr-history-list">
                  {previousResults.map((result) => (
                    <div key={result.examId} className="sdr-history-item">
                      <div className="sdr-history-icon">
                        <NotebookPen size={16} />
                      </div>
                      <div className="sdr-history-body">
                        <div className="sdr-history-top">
                          <strong>{result.examTitle}</strong>
                          <span>{formatDate(result.examDate)}</span>
                        </div>
                        <p className="sdr-history-note">
                          {formatExamType(result.examType)} · {result.isAbsent ? 'Absent for this exam' : `Scored ${renderScore(result)}`}
                        </p>
                      </div>
                      <div className="sdr-history-mark" style={{ color: subject.color }}>
                        {result.isAbsent ? 'Absent' : renderScore(result)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="sdr-history-note" style={{ margin: 0 }}>
                  There are no older exams to show for this subject.
                </p>
              )}
            </article>

            <article className="sdr-homework-card sdp-card">
              <div className="sd-section-header">
                <div>
                  <h2 className="sd-section-title">Result summary</h2>
                  <p className="sd-section-sub">Present versus absent status</p>
                </div>
              </div>

              <div className="sdr-homework-stats" style={{ marginTop: 0 }}>
                <div>
                  <span className="sdr-homework-label">Present</span>
                  <strong>{results.length - absentCount}</strong>
                </div>
                <div>
                  <span className="sdr-homework-label">Absent</span>
                  <strong>{absentCount}</strong>
                </div>
              </div>

              <div className="sdr-homework-bar">
                <div
                  className="sdr-homework-bar-fill"
                  style={{
                    width: `${results.length ? Math.round(((results.length - absentCount) / results.length) * 100) : 0}%`,
                    background: subject.color,
                  }}
                />
              </div>

              <p className="sdr-homework-note">
                {results.length === 0
                  ? 'No subject results have been recorded yet.'
                  : `${results.length - absentCount} exam${results.length - absentCount === 1 ? '' : 's'} were attended by the student.`}
              </p>

              <div className="sdr-recent-homework">
                <div className="sdr-recent-homework-head">
                  <h3>Result status</h3>
                  <span>{results.length} total records</span>
                </div>

                <ul className="sdr-recent-homework-list">
                  {results.slice(0, 5).map((result) => {
                    const isAbsent = result.isAbsent;

                    return (
                      <li key={result.examId} className={`sdr-recent-homework-item ${isAbsent ? '' : 'sdr-recent-homework-done'}`}>
                        <span className="sdr-recent-homework-status">
                          {isAbsent ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                        </span>
                        <span className="sdr-recent-homework-body">
                          <strong>{result.examTitle}</strong>
                          <small>
                            {formatDate(result.examDate)} · {isAbsent ? 'Absent' : `Scored ${renderScore(result)}`}
                          </small>
                        </span>
                        <span className={`sdr-recent-homework-badge ${isAbsent ? 'sdr-rh-badge-pending' : 'sdr-rh-badge-done'}`}>
                          {isAbsent ? 'Absent' : 'Present'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
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
        </>
      )}
    </div>
  );
}
