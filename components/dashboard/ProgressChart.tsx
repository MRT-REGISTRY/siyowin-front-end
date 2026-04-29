'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const DATA = [
  { month: 'Jan', score: 78, classAvg: 72 },
  { month: 'Feb', score: 82, classAvg: 73 },
  { month: 'Mar', score: 80, classAvg: 71 },
  { month: 'Apr', score: 87, classAvg: 74 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
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
  }
  return null;
};

export default function ProgressChart() {
  const latest = DATA[DATA.length - 1].score;
  const first = DATA[0].score;
  const diff = latest - first;
  const trend = diff > 0 ? 'Improving' : diff < 0 ? 'Declining' : 'Stable';
  const trendColor = diff > 0 ? '#22C55E' : diff < 0 ? '#EF4444' : '#F59E0B';

  return (
    <section className="sd-chart-section">
      <div className="sd-section-header">
        <div>
          <h2 className="sd-section-title">📈 Progress Trend</h2>
          <p className="sd-section-sub">Jan – Apr 2026</p>
        </div>
        <div className="sd-trend-pill" style={{ backgroundColor: `${trendColor}18`, color: trendColor }}>
          {diff >= 0 ? '↑' : '↓'} {trend} · {diff > 0 ? '+' : ''}{diff}%
        </div>
      </div>

      <div className="sd-chart-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="Your Score"
              stroke="#D9232D"
              strokeWidth={3}
              dot={{ r: 5, fill: '#D9232D', strokeWidth: 0 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="classAvg"
              name="Class Average"
              stroke="#E2E8F0"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 5, fill: '#94A3B8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly summary pills */}
      <div className="sd-chart-pills">
        {DATA.map((d, i) => (
          <div key={d.month} className={`sd-chart-pill ${i === DATA.length - 1 ? 'sd-chart-pill-active' : ''}`}>
            <span className="sd-pill-month">{d.month}</span>
            <span className="sd-pill-score">{d.score}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
