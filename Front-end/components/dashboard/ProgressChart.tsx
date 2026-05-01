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

type ProgressPoint = { month: string; score: number; classAvg: number };

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

export default function ProgressChart({ data }: { data: ProgressPoint[] }) {
  const chartData = data;
  const rangeLabel = chartData.length
    ? `${chartData[0]?.month} – ${chartData[chartData.length - 1]?.month}`
    : 'Recent months';
  const latest = chartData[chartData.length - 1]?.score ?? 0;
  const first = chartData[0]?.score ?? latest;
  const diff = latest - first;
  const trend = diff > 0 ? 'Improving' : diff < 0 ? 'Declining' : 'Stable';
  const trendColor = diff > 0 ? '#22C55E' : diff < 0 ? '#EF4444' : '#F59E0B';

  return (
    <section className="sd-chart-section">
      <div className="sd-section-header">
        <div>
          <h2 className="sd-section-title">📈 Progress Trend</h2>
          <p className="sd-section-sub">{rangeLabel}</p>
        </div>
        <div className="sd-trend-pill" style={{ backgroundColor: `${trendColor}18`, color: trendColor }}>
          {diff >= 0 ? '↑' : '↓'} {trend} · {diff > 0 ? '+' : ''}{diff}%
        </div>
      </div>

      <div className="sd-chart-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
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
        {chartData.map((d, i) => (
          <div key={d.month} className={`sd-chart-pill ${i === chartData.length - 1 ? 'sd-chart-pill-active' : ''}`}>
            <span className="sd-pill-month">{d.month}</span>
            <span className="sd-pill-score">{d.score}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
