'use client';

import { BookOpen, FileText, Star } from 'lucide-react';
import { DashboardOverview, SubjectModuleItem, SubjectExamResult } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';

interface Props {
  overview: DashboardOverview | null;
  latestItems?: SubjectModuleItem[];
  latestResults?: SubjectExamResult[];
  onOpenSubject?: (subjectId: string) => void;
}

export default function OverviewCards({ overview, latestItems, latestResults, onOpenSubject }: Props) {
  const { isSinhala } = useLanguage();
  const average = overview?.averageMark ?? 0;
  // If latestResults provided, render up to 3 most recent result cards
  const resultCards = (latestResults ?? []).slice(0, 3).map((res, i) => ({
    id: `result-${i}`,
    label: res.examTitle,
    value: res.marksObtained !== null && res.marksObtained !== undefined ? `${res.marksObtained}/${res.totalMarks ?? '—'}` : (isSinhala ? 'වාර්ථකයි' : 'Absent'),
    sub: res.examDate ?? res.createdAt ?? '',
    icon: FileText,
    color: i === 0 ? 'red' : i === 1 ? 'orange' : 'dark',
    classId: (res as any).classId,
  }));

  const cards = resultCards.length > 0 ? resultCards : [
    {
      id: 'marks',
      label: isSinhala ? 'මෑතකදී එක් කළ ලකුණු' : 'Recently Added Marks',
      value: (latestItems ?? [])[0]?.title ?? (isSinhala ? 'නෑ' : '-'),
      sub: (latestItems ?? [])[0]?.createdAt ?? '',
      icon: FileText,
      color: 'red',
    },
    {
      id: 'materials',
      label: isSinhala ? 'මෑතකදී එක් කළ අධ්‍යයන ද්‍රව්‍ය' : 'Recently Added Materials',
      value: (latestItems ?? [])[1]?.title ?? (isSinhala ? 'නෑ' : '-'),
      sub: (latestItems ?? [])[1]?.createdAt ?? '',
      icon: BookOpen,
      color: 'orange',
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
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            type="button"
            className={`sd-overview-card sd-card-${card.color} text-left`}
            onClick={() => {
              if (card.id === 'status') return;
              // Prefer explicit card navigation metadata (used for result cards)
              if ((card as any).classId && onOpenSubject) {
                onOpenSubject((card as any).classId);
                return;
              }
              // If card has a href, open it
              if ((card as any).href) {
                window.open((card as any).href, '_blank');
                return;
              }
              const latest = (latestItems ?? [])[idx];
              if (!latest) return;
              if (latest.type === 'link' && latest.href) {
                window.open(latest.href, '_blank');
                return;
              }
              if (latest.classId && onOpenSubject) {
                onOpenSubject(latest.classId);
              }
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
