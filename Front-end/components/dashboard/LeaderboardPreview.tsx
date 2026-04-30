'use client';

import { Crown } from 'lucide-react';

const STUDENTS = [
  { rank: 1, name: 'Priya Sharma', marks: 97, avatar: 'P', badge: 'gold' },
  { rank: 2, name: 'Daniel Kim', marks: 94, avatar: 'D', badge: 'silver' },
  { rank: 3, name: 'Alex Johnson', marks: 91, avatar: 'A', badge: 'bronze', isYou: true },
  { rank: 4, name: 'Sarah Chen', marks: 88, avatar: 'S', badge: null },
  { rank: 5, name: 'Marco Rivera', marks: 85, avatar: 'M', badge: null },
];

const BADGE_STYLES: Record<string, string> = {
  gold: 'sd-lb-badge-gold',
  silver: 'sd-lb-badge-silver',
  bronze: 'sd-lb-badge-bronze',
};

const AVATAR_STYLES: Record<string, string> = {
  gold: 'sd-lb-avatar-gold',
  silver: 'sd-lb-avatar-silver',
  bronze: 'sd-lb-avatar-bronze',
};

export default function LeaderboardPreview() {
  const maxMarks = STUDENTS[0].marks;

  return (
    <section className="sd-lb-section">
      <div className="sd-section-header">
        <div>
          <h2 className="sd-section-title">🏆 Leaderboard</h2>
          <p className="sd-section-sub">Top performers · This term</p>
        </div>
        <button className="sd-view-all-btn">Full Board</button>
      </div>

      <ul className="sd-lb-list">
        {STUDENTS.map((student) => {
          const barPct = Math.round((student.marks / maxMarks) * 100);
          const avatarClass = student.badge
            ? AVATAR_STYLES[student.badge]
            : 'sd-lb-avatar-default';
          const badgeClass = student.badge ? BADGE_STYLES[student.badge] : '';

          return (
            <li
              key={student.rank}
              className={`sd-lb-item ${student.isYou ? 'sd-lb-item-you' : ''}`}
            >
              {/* Rank */}
              <div className={`sd-lb-rank ${badgeClass}`}>
                {student.rank === 1 ? <Crown size={14} /> : `#${student.rank}`}
              </div>

              {/* Avatar */}
              <div className={`sd-lb-avatar ${avatarClass}`}>
                {student.avatar}
              </div>

              {/* Name + bar */}
              <div className="sd-lb-body">
                <div className="sd-lb-name-row">
                  <span className="sd-lb-name">
                    {student.name}
                    {student.isYou && <span className="sd-lb-you-chip">You</span>}
                  </span>
                  <span className="sd-lb-marks">{student.marks}%</span>
                </div>
                <div className="sd-lb-bar-track">
                  <div
                    className={`sd-lb-bar-fill ${student.isYou ? 'sd-lb-bar-you' : ''}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="sd-lb-footer">
        <div className="sd-lb-your-rank">
          <span className="sd-lb-your-rank-label">Your Rank</span>
          <span className="sd-lb-your-rank-value">#3 of 42</span>
        </div>
        <div className="sd-lb-gap-info">
          <span className="sd-lb-gap-label">Gap to #1</span>
          <span className="sd-lb-gap-value">6%</span>
        </div>
      </div>
    </section>
  );
}
