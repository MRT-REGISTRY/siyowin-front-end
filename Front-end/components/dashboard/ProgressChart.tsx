'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { apiGet } from '@/utils/api';
import { SubjectRecord, SubjectResultsResponse } from '@/types';

type ProgressPoint = { month: string; score: number; classAvg: number };
type SubjectProgressPoint = { month: string; score: number; classAvg: number };

interface Props {
  data: ProgressPoint[];
  subjects?: SubjectRecord[];
}

const formatMonthRange = (chartData: ProgressPoint[]) =>
  chartData.length
    ? `${chartData[0]?.month} – ${chartData[chartData.length - 1]?.month}`
    : 'Recent months';

const buildSubjectProgress = (results: SubjectResultsResponse['results']): SubjectProgressPoint[] => {
  const statsByMonth = new Map<string, { total: number; count: number }>();

  results.forEach((result) => {
    if (result.isAbsent || result.marksObtained === null) return;
    const date = new Date(result.examDate);
    if (Number.isNaN(date.getTime())) return;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const stats = statsByMonth.get(monthKey) ?? { total: 0, count: 0 };
    stats.total += Number(result.marksObtained);
    stats.count += 1;
    statsByMonth.set(monthKey, stats);
  });

  const entries = Array.from(statsByMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  if (!entries.length) return [];

  return entries.map(([monthKey, stats]) => {
    const [year, month] = monthKey.split('-');
    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleString('en-GB', { month: 'short' });
    return {
      month: label,
      score: stats.count ? Math.round(stats.total / stats.count) : 0,
      classAvg: 0,
    };
  });
};

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

export default function ProgressChart({ data, subjects = [] }: Props) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [subjectData, setSubjectData] = useState<ProgressPoint[] | null>(null);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [subjectError, setSubjectError] = useState('');

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === selectedSubjectId) ?? null,
    [selectedSubjectId, subjects],
  );

  useEffect(() => {
    if (!subjects.length) return;
    if (!selectedSubjectId || !subjects.some((subject) => subject.id === selectedSubjectId)) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [selectedSubjectId, subjects]);

  useEffect(() => {
    let mounted = true;

    if (!selectedSubjectId) {
      setSubjectData(null);
      setSubjectError('');
      setLoadingSubject(false);
      return () => {
        mounted = false;
      };
    }

    setLoadingSubject(true);
    setSubjectError('');

    apiGet<SubjectResultsResponse>(`/dashboard/subjects/${selectedSubjectId}/results`)
      .then((response) => {
        if (!mounted) return;
        setSubjectData(buildSubjectProgress(response.results));
      })
      .catch((err) => {
        if (!mounted) return;
        setSubjectData([]);
        setSubjectError(err instanceof Error ? err.message : 'Unable to load subject progress.');
      })
      .finally(() => {
        if (mounted) setLoadingSubject(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedSubjectId]);

  const chartData = selectedSubjectId ? subjectData ?? [] : data;
  const rangeLabel = selectedSubject ? `${selectedSubject.name} · ${formatMonthRange(chartData)}` : formatMonthRange(chartData);
  const latest = chartData[chartData.length - 1]?.score ?? 0;
  const first = chartData[0]?.score ?? latest;
  const diff = latest - first;
  const trend = diff > 0 ? 'Improving' : diff < 0 ? 'Declining' : 'Stable';
  const trendColor = diff > 0 ? '#22C55E' : diff < 0 ? '#EF4444' : '#F59E0B';
  const showClassAverage = false;

  return (
    <section className="sd-chart-section">
      <div className="sd-section-header">
        <div>
          <h2 className="sd-section-title">📈 Progress Trend</h2>
          <p className="sd-section-sub">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {subjects.length > 0 && (
            <select
              value={selectedSubjectId}
              onChange={(event) => setSelectedSubjectId(event.target.value)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
            >
              {/* <option value="overall">Overall</option> */}
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          )}
          <div className="sd-trend-pill" style={{ backgroundColor: `${trendColor}18`, color: trendColor }}>
            {diff >= 0 ? '↑' : '↓'} {trend} · {diff > 0 ? '+' : ''}{diff}%
          </div>
        </div>
      </div>

      {loadingSubject && selectedSubjectId && (
        <p className="text-sm text-slate-500 mb-3">Loading subject progress...</p>
      )}
      {!loadingSubject && subjectError && (
        <p className="text-sm text-red-600 mb-3">{subjectError}</p>
      )}

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
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line
              type="monotone"
              dataKey="score"
              name={selectedSubject?.name ?? 'Subject Score'}
              stroke="#D9232D"
              strokeWidth={3}
              dot={{ r: 5, fill: '#D9232D', strokeWidth: 0 }}
              activeDot={{ r: 7 }}
            />
            {showClassAverage && (
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
            )}
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
