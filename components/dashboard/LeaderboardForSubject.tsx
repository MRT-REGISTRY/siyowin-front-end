'use client';

import { Crown } from 'lucide-react';
import { getLeaderboardForSubject } from '@/data/dashboardData';
import { LeaderboardEntry } from '@/types';

interface Props {
  subjectId: string;
}

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

export default function LeaderboardForSubject({ subjectId }: Props) {
  const entries: LeaderboardEntry[] = getLeaderboardForSubject(subjectId);
  const maxMarks = entries[0]?.marks ?? 100;

  return (
    <section className="sd-lb-section">
      <div className="sd-section-header">
        <div>
          <h2 className="sd-section-title">🏆 Leaderboard</h2>
          <p className="sd-section-sub">Top performers · This class</p>
        </div>
      </div>

      <ul className="sd-lb-list">
        {entries.map((student) => {
          const barPct = Math.round((student.marks / maxMarks) * 100);
          const avatarClass = student.badge ? AVATAR_STYLES[student.badge] : 'sd-lb-avatar-default';
          const badgeClass = student.badge ? BADGE_STYLES[student.badge] : '';

          return (
            <li key={student.rank} className={`sd-lb-item ${student.isYou ? 'sd-lb-item-you' : ''}`}>
              <div className={`sd-lb-rank ${badgeClass}`}>
                {student.rank === 1 ? <Crown size={14} /> : `#${student.rank}`}
              </div>

              <div className={`sd-lb-avatar ${avatarClass}`}>
                {student.avatar ?? student.name[0]}
              </div>

              <div className="sd-lb-body">
                <div className="sd-lb-name-row">
                  <span className="sd-lb-name">
                    {student.name}
                    {student.isYou && <span className="sd-lb-you-chip">You</span>}
                  </span>
                  <span className="sd-lb-marks">{student.marks}%</span>
                </div>
                <div className="sd-lb-bar-track">
                  <div className={`sd-lb-bar-fill ${student.isYou ? 'sd-lb-bar-you' : ''}`} style={{ width: `${barPct}%` }} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
