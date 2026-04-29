'use client';

import { BarChart3, Medal, ClipboardCheck, Star } from 'lucide-react';

const CARDS = [
  {
    id: 'avg',
    label: 'Overall Average',
    value: '87.4%',
    sub: '+2.1% from last term',
    icon: BarChart3,
    color: 'red',
    trend: 'up',
  },
  {
    id: 'rank',
    label: 'Class Rank',
    value: '#3',
    sub: 'Out of 42 students',
    icon: Medal,
    color: 'orange',
    trend: 'neutral',
  },
  {
    id: 'hw',
    label: 'Homework Completion',
    value: '92%',
    sub: '23 of 25 tasks done',
    icon: ClipboardCheck,
    color: 'navy',
    trend: 'up',
  },
  {
    id: 'status',
    label: 'Performance Status',
    value: 'Excellent',
    sub: 'Keep up the great work!',
    icon: Star,
    color: 'dark',
    trend: 'up',
  },
];

export default function OverviewCards() {
  return (
    <section className="sd-overview-grid">
      {CARDS.map((card) => {
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
