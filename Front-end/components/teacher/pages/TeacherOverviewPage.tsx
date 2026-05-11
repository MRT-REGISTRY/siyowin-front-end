'use client';

import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface Props {
  overview: any;
  recentMarks: any[];
}

export default function TeacherOverviewPage({ overview, recentMarks }: Props) {
  const { isSinhala } = useLanguage();

  const cards = [
    {
      id: 'students',
      label: isSinhala ? 'සිසුන් ගණන' : 'Total Students',
      value: overview?.studentsCount ?? 0,
      sub: isSinhala ? 'ඔබගේ සියලුම පන්ති වල' : 'Across all your classes',
      icon: Users,
      color: 'navy',
    },
    {
      id: 'classes',
      label: isSinhala ? 'පන්ති ගණන' : 'Assigned Courses',
      value: overview?.subjectsCount ?? 0,
      sub: isSinhala ? 'ක්‍රියාකාරී' : 'Active classes',
      icon: BookOpen,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="sd-overview-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.id} className={`sd-overview-card sd-card-${card.color}`}>
              <div className="sd-overview-card-header">
                <div className={`sd-overview-icon sd-icon-${card.color}`}>
                  <Icon size={20} />
                </div>
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

      <section>
        <h3 className="mb-4 text-sm font-bold text-slate-800">
          {isSinhala ? 'මෑතකදී එකතු කළ ලකුණු' : 'Recently Logged Marks'}
        </h3>
        <div className="sd-mid-grid">
          {recentMarks.slice(0, 4).map((mark, idx) => (
            <div key={idx} className="sdp-card p-4 flex items-center justify-between">
              <div>
                <strong className="block text-sm font-bold text-slate-800">{mark.studentName}</strong>
                <span className="text-xs text-slate-500">{mark.examName} • {mark.subjectName}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-800">{mark.mark}%</span>
                <span className="block text-xs text-slate-400">{mark.examDate}</span>
              </div>
            </div>
          ))}
          {recentMarks.length === 0 && (
            <div className="sdp-card p-6 text-center text-sm text-slate-500">
              {isSinhala ? 'ලකුණු කිසිවක් එකතු කර නොමැත.' : 'No marks logged recently.'}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
