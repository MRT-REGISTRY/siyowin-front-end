'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { DashboardOverview, SubjectRecord } from '@/types';

type ProgressPoint = { month: string; score: number; classAvg: number };

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

export default function ProgressPage({
  overview,
  subjects,
  progress,
}: {
  overview: DashboardOverview | null;
  subjects: SubjectRecord[];
  progress: ProgressPoint[];
}) {
  const first = progress[0]?.score ?? 0;
  const latest = progress[progress.length - 1]?.score ?? first;
  const diff = latest - first;
  const radarData = subjects.map((subject) => ({ subject: subject.name, value: subject.currentMark }));

  return (
    <div className="sdp-wrap">
      <div className="sdp-header">
        <div>
          <h1 className="sdp-title">Progress Tracker</h1>
          <p className="sdp-sub">Your academic journey</p>
        </div>
        <div className="sdp-trend-pill" style={{ background: diff >= 0 ? '#f0fdf4' : '#fef2f2', color: diff >= 0 ? '#16a34a' : '#dc2626' }}>
          {diff >= 0 ? 'Up' : 'Down'} {Math.abs(diff)}% overall trend
        </div>
      </div>

      <div className="sdp-strip">
        <div className="sdp-strip-item"><span className="sdp-strip-val">{overview?.averageMark ?? 0}%</span><span className="sdp-strip-label">Current Avg</span></div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item"><span className="sdp-strip-val">{diff > 0 ? '+' : ''}{diff}%</span><span className="sdp-strip-label">Trend</span></div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item"><span className="sdp-strip-val">#{overview?.classRank ?? '-'}</span><span className="sdp-strip-label">Class Rank</span></div>
        <div className="sdp-strip-div" />
        <div className="sdp-strip-item"><span className="sdp-strip-val">{overview?.homeworkCompletion ?? 0}%</span><span className="sdp-strip-label">HW Completion</span></div>
      </div>

      <div className="prg-grid">
        <div className="sdp-card prg-line-card">
          <h2 className="prg-card-title">Monthly Score Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={progress} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
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
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#F0F0F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Radar name="Score" dataKey="value" stroke="#D9232D" fill="#D9232D" fillOpacity={0.18} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
