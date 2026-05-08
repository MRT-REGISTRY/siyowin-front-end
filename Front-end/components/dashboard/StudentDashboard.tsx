'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';
import OverviewCards from './OverviewCards';
import SubjectCards from './SubjectCards';
import ProgressChart from './ProgressChart';
import HomeworkSection from './HomeworkSection';
import RecentlyCompletedTasks from './RecentlyCompletedTasks';
import SubjectsPage from './pages/SubjectsPage';
import SubjectReportPage from './pages/SubjectReportPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import { apiGet } from '@/utils/api';
import { ApiSubjectRecord, DashboardOverview, StudentProfile, SubjectRecord } from '@/types';
import { normalizeSubjects } from '@/utils/subjects';
import { useLanguage } from '@/components/LanguageProvider';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: 'layout-dashboard' },
  { id: 'subjects',    label: 'My Subjects',  icon: 'book-open' },
  { id: 'progress',    label: 'Progress',     icon: 'trending-up' },
  { id: 'settings',    label: 'Settings',     icon: 'settings' },
];

export default function StudentDashboard() {
  const { isSinhala } = useLanguage();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [progress, setProgress] = useState<Array<{ month: string; score: number; classAvg: number }>>([]);
  const [homework, setHomework] = useState<Array<any>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const visibleSubjects = useMemo(() => {
    if (!normalizedSearchQuery) return subjects;
    return subjects.filter((subject) => [
      subject.name,
      subject.subjectName,
      subject.teacher,
      subject.classLabel,
      subject.gradeId,
    ].some((value) => (value ?? '').toLowerCase().includes(normalizedSearchQuery)));
  }, [normalizedSearchQuery, subjects]);
  const visibleHomework = useMemo(() => {
    if (!normalizedSearchQuery) return homework;
    return homework.filter((item) => [
      item.title,
      item.subjectName,
      item.status,
      item.dueDate,
    ].some((value) => String(value ?? '').toLowerCase().includes(normalizedSearchQuery)));
  }, [homework, normalizedSearchQuery]);
  const selectedSubject = selectedSubjectId ? subjects.find((subject) => subject.id === selectedSubjectId) ?? null : null;
  const completedTasks = useMemo(() => {
    return visibleHomework.filter((task) => task.status === 'completed');
  }, [visibleHomework]);

  const localizedNavItems = useMemo(() => NAV_ITEMS.map((item) => ({
    ...item,
    label: isSinhala
      ? item.id === 'dashboard'
        ? 'පුවරුව'
        : item.id === 'subjects'
          ? 'මගේ විෂයන්'
          : item.id === 'progress'
            ? 'ප්‍රගතිය'
            : 'සැකසුම්'
      : item.label,
  })), [isSinhala]);

  useEffect(() => {
    let mounted = true;

    apiGet<{
      overview: DashboardOverview;
      profile: StudentProfile;
      subjects: ApiSubjectRecord[];
      progress: Array<{ month: string; score?: number; average?: number; classAvg?: number }>;
      homework: Array<any>;
    }>('/dashboard/student')
      .then((data) => {
        if (!mounted) return;
        setOverview(data.overview);
        setProfile(data.profile);
        setSubjects(normalizeSubjects(data.subjects, data.homework));
        setProgress(data.progress.map((item) => ({
          month: item.month,
          score: item.score ?? item.average ?? 0,
          classAvg: item.classAvg ?? 0,
        })));
        setHomework(data.homework);
        setError('');
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Unable to load dashboard.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleNavChange = (navId: string) => {
    setSelectedSubjectId(null);
    setActiveNav(navId);
  };

  const openSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveNav('subjects');
  };

  const closeSubjectReport = () => {
    setSelectedSubjectId(null);
  };

  return (
    <div className="sd-root">
      <DashboardSidebar
        navItems={localizedNavItems}
        activeNav={activeNav}
        onNavChange={handleNavChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />
      {sidebarOpen && (
        <div className="sd-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <div className="sd-main-wrapper">
        <DashboardNavbar
          onMenuToggle={() => setSidebarOpen(true)}
          profile={profile}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="sd-content">
          {loading && <p className="sdp-card">{isSinhala ? 'පුවරුව පූරණය වෙමින්...' : 'Loading dashboard...'}</p>}
          {!loading && error && <p className="sdp-card text-red-600">{error}</p>}
          {activeNav === 'dashboard' && (
            <>
              <div className="sd-greeting">
                <div>
                  <h1 className="sd-greeting-title">
                    {isSinhala ? 'ආයුබෝවන්' : 'Good afternoon'}, <span className="sd-highlight">{profile?.name.split(' ')[0] ?? (isSinhala ? 'සිසුවා' : 'Student')}!</span>
                  </h1>
                  <p className="sd-greeting-sub">{isSinhala ? 'මෙම වාරයේ ඔබගේ අධ්‍යාපනික ප්‍රගතියේ සාරාංශය මෙන්න.' : "Here's a summary of your academic performance this term."}</p>
                </div>
                <div className="sd-term-badge">{profile ? `${profile.term} - ${profile.year}` : isSinhala ? 'වත්මන් වාරය' : 'Current term'}</div>
              </div>
              <OverviewCards overview={overview} subjects={subjects} />
              <div className="sd-recently-completed-grid">
                <RecentlyCompletedTasks tasks={completedTasks} />
              </div>
              <div className="sd-mid-grid">
                <SubjectCards
                  subjects={visibleSubjects}
                  onSelectSubject={openSubject}
                  onViewAll={() => {
                    setSelectedSubjectId(null);
                    setActiveNav('subjects');
                  }}
                />
              </div>
            </>
          )}

          {activeNav === 'subjects' && selectedSubject && (
            <SubjectReportPage subject={selectedSubject} onBack={closeSubjectReport} />
          )}

          {activeNav === 'subjects' && !selectedSubject && (
            <SubjectsPage subjects={visibleSubjects} onSelectSubject={openSubject} />
          )}
          
          {activeNav === 'progress'    && <ProgressPage overview={overview} subjects={subjects} progress={progress} />}
          {activeNav === 'settings'    && <SettingsPage profile={profile} />}
        </main>
      </div>
    </div>
  );
}
