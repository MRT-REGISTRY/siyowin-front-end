'use client';

import { Crown, TrendingUp } from 'lucide-react';

const ALL_STUDENTS = [
  { rank: 1,  name: 'Priya Sharma',    marks: 97, section: 'A', avatar: 'P', badge: 'gold',   change: 0  },
  { rank: 2,  name: 'Daniel Kim',      marks: 94, section: 'B', avatar: 'D', badge: 'silver', change: 1  },
  { rank: 3,  name: 'Alex Johnson',    marks: 91, section: 'B', avatar: 'A', badge: 'bronze', change: 2, isYou: true },
  { rank: 4,  name: 'Sarah Chen',      marks: 88, section: 'A', avatar: 'S', badge: null,     change: -1 },
  { rank: 5,  name: 'Marco Rivera',    marks: 85, section: 'C', avatar: 'M', badge: null,     change: 0  },
  { rank: 6,  name: 'Aisha Patel',     marks: 83, section: 'A', avatar: 'A', badge: null,     change: 1  },
  { rank: 7,  name: 'Liam Nguyen',     marks: 81, section: 'C', avatar: 'L', badge: null,     change: -2 },
  { rank: 8,  name: 'Sofia Moreau',    marks: 79, section: 'B', avatar: 'S', badge: null,     change: 0  },
  { rank: 9,  name: 'Omar Hassan',     marks: 77, section: 'A', avatar: 'O', badge: null,     change: 3  },
  { rank: 10, name: 'Yuki Tanaka',     marks: 75, section: 'C', avatar: 'Y', badge: null,     change: -1 },
];

const BADGE_COLOR: Record<string, string> = { gold: '#d97706', silver: '#6b7280', bronze: '#92400e' };
const AVATAR_BG: Record<string, string>   = { gold: '#fef3c7', silver: '#f3f4f6', bronze: '#fef3c7' };

export default function LeaderboardPage() {
  const you = ALL_STUDENTS.find(s => s.isYou)!;
  const maxMarks = ALL_STUDENTS[0].marks;

  return (
    <div className="sdp-wrap">
      <div className="sdp-header">
        <div>
          <h1 className="sdp-title">🏆 Leaderboard</h1>
          <p className="sdp-sub">Term 2 · 2026 — Grade 11, Section B</p>
        </div>
      </div>

      {/* Podium top-3 */}
      <div className="lb-podium">
        {/* 2nd */}
        <div className="lb-podium-item lb-second">
          <div className="lb-podium-avatar" style={{ background: '#f3f4f6', color: '#6b7280' }}>
            {ALL_STUDENTS[1].avatar}
          </div>
          <div className="lb-podium-name">{ALL_STUDENTS[1].name}</div>
          <div className="lb-podium-mark">{ALL_STUDENTS[1].marks}%</div>
          <div className="lb-podium-block lb-block-silver"><span>#2</span></div>
        </div>
        {/* 1st */}
        <div className="lb-podium-item lb-first">
          <Crown size={22} className="lb-crown" />
          <div className="lb-podium-avatar lb-avatar-gold" style={{ background: '#fef3c7', color: '#d97706' }}>
            {ALL_STUDENTS[0].avatar}
          </div>
          <div className="lb-podium-name">{ALL_STUDENTS[0].name}</div>
          <div className="lb-podium-mark">{ALL_STUDENTS[0].marks}%</div>
          <div className="lb-podium-block lb-block-gold"><span>#1</span></div>
        </div>
        {/* 3rd */}
        <div className="lb-podium-item lb-third">
          <div className="lb-podium-avatar" style={{ background: '#fef3c7', color: '#92400e' }}>
            {ALL_STUDENTS[2].avatar}
          </div>
          <div className="lb-podium-name">{ALL_STUDENTS[2].name} {ALL_STUDENTS[2].isYou && <span className="lb-you-tag">You</span>}</div>
          <div className="lb-podium-mark">{ALL_STUDENTS[2].marks}%</div>
          <div className="lb-podium-block lb-block-bronze"><span>#3</span></div>
        </div>
      </div>

      {/* Full list */}
      <div className="sdp-card lb-list-card">
        <ul className="lb-full-list">
          {ALL_STUDENTS.map((s) => {
            const pct = Math.round((s.marks / maxMarks) * 100);
            const badgeBg = s.badge ? AVATAR_BG[s.badge] : '#f3f4f6';
            const badgeColor = s.badge ? BADGE_COLOR[s.badge] : '#6b7280';
            return (
              <li key={s.rank} className={`lb-row ${s.isYou ? 'lb-row-you' : ''}`}>
                <div className="lb-row-rank" style={{ color: s.badge ? BADGE_COLOR[s.badge] : '#9ca3af' }}>
                  {s.rank === 1 ? <Crown size={14} /> : `#${s.rank}`}
                </div>
                <div className="lb-row-avatar" style={{ background: badgeBg, color: badgeColor }}>
                  {s.avatar}
                </div>
                <div className="lb-row-body">
                  <div className="lb-row-name-row">
                    <span className="lb-row-name">
                      {s.name} {s.isYou && <span className="lb-you-tag">You</span>}
                    </span>
                    <span className="lb-row-section">Sec {s.section}</span>
                    <span className="lb-row-marks">{s.marks}%</span>
                    <span className={`lb-change ${s.change > 0 ? 'lb-change-up' : s.change < 0 ? 'lb-change-down' : 'lb-change-neutral'}`}>
                      {s.change > 0 ? `↑${s.change}` : s.change < 0 ? `↓${Math.abs(s.change)}` : '—'}
                    </span>
                  </div>
                  <div className="lb-row-bar-track">
                    <div className="lb-row-bar-fill" style={{ width: `${pct}%`, background: s.isYou ? 'linear-gradient(to right,#D9232D,#F47920)' : '#e5e7eb' }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Your stats */}
      <div className="lb-your-stats">
        <TrendingUp size={16} style={{ color: '#D9232D' }} />
        <span className="lb-your-stats-text">Your rank improved by <strong>2 positions</strong> since last term — keep it up!</span>
      </div>
    </div>
  );
}
