'use client';

import { BookOpen, FileText, Star } from 'lucide-react';
import { DashboardOverview } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';

interface Props {
  overview: DashboardOverview | null;
}

export default function OverviewCards({ overview }: Props) {
  const { isSinhala } = useLanguage();
  const average = overview?.averageMark ?? 0;
  const cards = [
    {
      id: 'marks',
      label: isSinhala ? 'මෑතකදී එක් කළ ලකුණු' : 'Recently Added Marks',
      value: '12',
      sub: isSinhala ? 'Dummy link for now' : 'Dummy link for now',
      icon: FileText,
      color: 'red',
      href: '#recent-marks',
    },
    {
      id: 'materials',
      label: isSinhala ? 'මෑතකදී එක් කළ අධ්‍යයන ද්‍රව්‍ය' : 'Recently Added Materials',
      value: '08',
      sub: isSinhala ? 'Dummy link for now' : 'Dummy link for now',
      icon: BookOpen,
      color: 'orange',
      href: '#recent-materials',
    },
    {
      id: 'status',
      label: isSinhala ? 'කාර්යසාධන තත්ත්වය' : 'Performance Status',
      value: average >= 85 ? (isSinhala ? 'විශිෂ්ටයි' : 'Excellent') : average >= 70 ? (isSinhala ? 'හොඳයි' : 'Good') : (isSinhala ? 'වැඩි අවධානය අවශ්‍යයි' : 'Needs Work'),
      sub: isSinhala ? `හොඳම විෂය: ${overview?.bestSubject ?? '-'}` : `Best subject: ${overview?.bestSubject ?? '-'}`,
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
          <button
            key={card.id}
            type="button"
            className={`sd-overview-card sd-card-${card.color} text-left`}
            onClick={() => {
              if (card.id !== 'status') return;
            }}
          >
            <div className="sd-overview-card-header">
              <div className={`sd-overview-icon sd-icon-${card.color}`}>
                <Icon size={20} />
              </div>
              {card.id === 'status' && (
                <span className="sd-trend-badge sd-trend-up">↑ {isSinhala ? 'දියුණු වෙමින්' : 'Improving'}</span>
              )}
            </div>
            <div className="sd-overview-card-body">
              <p className="sd-overview-label">{card.label}</p>
              <p className="sd-overview-value">{card.value}</p>
              <p className="sd-overview-sub">{card.sub}</p>
            </div>
            <div className={`sd-card-glow sd-glow-${card.color}`} />
          </button>
        );
      })}
    </section>
  );
}
