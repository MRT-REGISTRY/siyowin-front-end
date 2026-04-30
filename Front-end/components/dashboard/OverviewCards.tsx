'use client';

import { BarChart3, Medal, ClipboardCheck, Star } from 'lucide-react';
import { DashboardOverview, SubjectRecord } from '@/types';

interface Props {
  overview: DashboardOverview | null;
  subjects: SubjectRecord[];
}

export default function OverviewCards({ overview, subjects }: Props) {
  const average = overview?.averageMark ?? 0;
  const homeworkDone = subjects.reduce((total, subject) => total + subject.homeworkDoneThisMonth, 0);
  const homeworkTarget = subjects.reduce((total, subject) => total + subject.homeworkTargetThisMonth, 0);
  const cards = [
    {
      id: 'avg',
      label: 'Overall Average',
      value: `${average}%`,
      sub: '+2.1% from last term',
      icon: BarChart3,
      color: 'red',
      trend: 'up',
    },
    {
      id: 'rank',
      label: 'Class Rank',
      value: `#${overview?.classRank ?? '-'}`,
      sub: 'Current best subject rank',
      icon: Medal,
      color: 'orange',
      trend: 'neutral',
    },
    {
      id: 'hw',
      label: 'Homework Completion',
      value: `${overview?.homeworkCompletion ?? 0}%`,
      sub: `${homeworkDone} of ${homeworkTarget} tasks done`,
      icon: ClipboardCheck,
      color: 'navy',
      trend: 'up',
    },
    {
      id: 'status',
      label: 'Performance Status',
      value: average >= 85 ? 'Excellent' : average >= 70 ? 'Good' : 'Needs Work',
      sub: `Best subject: ${overview?.bestSubject ?? '-'}`,
      icon: Star,
      color: 'dark',
      trend: 'up',
    },
  ];

  return (
    <section className="sd-overview-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.id} className={`sd-overview-card sd-card-${card.color}`}>
            <div className="sd-overview-card-header">
              <div className={`sd-overview-icon sd-icon-${card.color}`}>
                <Icon size={20} />
              </div>
              {card.trend === 'up' && (
                <span className="sd-trend-badge sd-trend-up">↑ Improving</span>
              )}
            </div>
            <div className="sd-overview-card-body">
              <p className="sd-overview-label">{card.label}</p>
              <p className="sd-overview-value">{card.value}</p>
              <p className="sd-overview-sub">{card.sub}</p>
            </div>
            <div className={`sd-card-glow sd-glow-${card.color}`} />
          </article>
        );
      })}
    </section>
  );
}
