'use client';

import { BarChart3, Medal, ClipboardCheck, Star, FileText } from 'lucide-react';
import { DashboardOverview, SubjectRecord } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';

interface Props {
  overview: DashboardOverview | null;
  subjects: SubjectRecord[];
}

export default function OverviewCards({ overview, subjects }: Props) {
  const { isSinhala } = useLanguage();
  const average = overview?.averageMark ?? 0;
  const homeworkDone = subjects.reduce((total, subject) => total + subject.homeworkDoneThisMonth, 0);
  const homeworkTarget = subjects.reduce((total, subject) => total + subject.homeworkTargetThisMonth, 0);
  const cards = [
    {
      id: 'hw',
      label: isSinhala ? 'ගෙදර වැඩ සම්පූර්ණ කිරීම' : 'Homework Completion',
      value: `${overview?.homeworkCompletion ?? 0}%`,
      sub: isSinhala ? `${homeworkTarget}න් ${homeworkDone}ක් සම්පූර්ණයි` : `${homeworkDone} of ${homeworkTarget} tasks done`,
      icon: ClipboardCheck,
      color: 'navy',
    },
    {
      id: 'paper',
      label: isSinhala ? 'ප්‍රශ්න පත්‍ර සම්පූර්ණ කිරීම' : 'Paper Completion',
      value: '88%',
      sub: isSinhala ? '10න් 9ක් සම්පූර්ණයි' : '9 of 10 papers done',
      icon: FileText,
      color: 'orange',
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
                <span className="sd-trend-badge sd-trend-up">↑ {isSinhala ? 'දියුණු වෙමින්' : 'Improving'}</span>
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
