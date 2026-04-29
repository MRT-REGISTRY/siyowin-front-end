'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const MONTHLY = [
  { month: 'Jan', score: 78, classAvg: 72 },
  { month: 'Feb', score: 82, classAvg: 73 },
  { month: 'Mar', score: 80, classAvg: 71 },
  { month: 'Apr', score: 87, classAvg: 74 },
];

const RADAR_DATA = [
  { subject: 'Math',    value: 91 },
  { subject: 'Science', value: 84 },
  { subject: 'English', value: 78 },
  { subject: 'History', value: 95 },
  { subject: 'Geo',     value: 72 },
  { subject: 'CS',      value: 98 },
];

const ACHIEVEMENTS = [
  { icon: '🥇', title: 'Top Performer',  desc: 'Ranked #1 in CS this term',      date: 'Apr 2026' },
  { icon: '🔥', title: 'Perfect Streak', desc: '10 homeworks submitted on time',  date: 'Mar 2026' },
  { icon: '📈', title: 'Most Improved',  desc: '+9% overall since last term',     date: 'Feb 2026' },
  { icon: '🎖️', title: 'Honor Roll',     desc: 'Maintained avg above 85%',       date: 'Jan 2026' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="sd-chart-tooltip">
      <p className="sd-tooltip-label">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="sd-tooltip-value">
          {p.name}: <strong>{p.value}%</strong>
        </p>
      ))}
    </div>
  );
};

export default function ProgressPage() {
  const diff = MONTHLY[MONTHLY.length - 1].score - MONTHLY[0].score;
  return (
    <div className="sdp-wrap">
      <div className="sdp-header">
        <div>
          <h1 className="sdp-title">📈 Progress Tracker</h1>
          <p className="sdp-sub">Your academic journey · Jan – Apr 2026</p>
        </div>
        <div className="sdp-trend-pill" style={{ background: diff >= 0 ? '#f0fdf4' : '#fef2f2', color: diff >= 0 ? '#16a34a' : '#dc2626' }}>
          {diff >= 0 ? '↑' : '↓'} {Math.abs(diff)}% overall trend
        </div>
      </div>

      <div className="sdp-strip">
        <div className="sdp-strip-item"><span className="sdp-strip-val">87.4%</span><span className="sdp-strip-label">Current Avg</span></div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item"><span className="sdp-strip-val">+9%</span><span className="sdp-strip-label">Since Last Term</span></div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item"><span className="sdp-strip-val">#3</span><span className="sdp-strip-label">Class Rank</span></div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item"><span className="sdp-strip-val">92%</span><span className="sdp-strip-label">HW Completion</span></div>
      </div>

      <div className="prg-grid">
        <div className="sdp-card prg-line-card">
          <h2 className="prg-card-title">Monthly Score Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="score" name="Your Score" stroke="#D9232D" strokeWidth={3} dot={{ r: 5, fill: '#D9232D', strokeWidth: 0 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="classAvg" name="Class Avg" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 5, fill: '#94A3B8' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="sdp-card prg-radar-card">
          <h2 className="prg-card-title">Subject Radar</h2>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#F0F0F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Radar name="Score" dataKey="value" stroke="#D9232D" fill="#D9232D" fillOpacity={0.18} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="sdp-card">
        <h2 className="prg-card-title" style={{ marginBottom: 16 }}>🎖️ Achievements</h2>
        <div className="prg-ach-grid">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.title} className="prg-ach-card">
              <span className="prg-ach-icon">{a.icon}</span>
              <div>
                <p className="prg-ach-title">{a.title}</p>
                <p className="prg-ach-desc">{a.desc}</p>
                <p className="prg-ach-date">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
