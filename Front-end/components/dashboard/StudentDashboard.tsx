'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';
import OverviewCards from './OverviewCards';
import SubjectCards from './SubjectCards';
import ProgressChart from './ProgressChart';
import HomeworkSection from './HomeworkSection';
import SubjectsPage from './pages/SubjectsPage';
import SubjectReportPage from './pages/SubjectReportPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import { apiGet } from '@/utils/api';
import { ApiSubjectRecord, DashboardOverview, StudentProfile, SubjectRecord } from '@/types';
import { normalizeSubjects } from '@/utils/subjects';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: 'layout-dashboard' },
  { id: 'subjects',    label: 'My Subjects',  icon: 'book-open' },
  { id: 'progress',    label: 'Progress',     icon: 'trending-up' },
  { id: 'settings',    label: 'Settings',     icon: 'settings' },
];

export default function StudentDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [progress, setProgress] = useState<Array<{ month: string; score: number; classAvg: number }>>([]);
  const [homework, setHomework] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedSubject = selectedSubjectId ? subjects.find((subject) => subject.id === selectedSubjectId) ?? null : null;

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
        navItems={NAV_ITEMS}
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
        <DashboardNavbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="sd-content">
          {loading && <p className="sdp-card">Loading dashboard...</p>}
          {!loading && error && <p className="sdp-card text-red-600">{error}</p>}
          {activeNav === 'dashboard' && (
            <>
              <div className="sd-greeting">
                <div>
                  <h1 className="sd-greeting-title">
                    Good afternoon, <span className="sd-highlight">{profile?.name.split(' ')[0] ?? 'Student'}!</span>
                  </h1>
                  <p className="sd-greeting-sub">Here&apos;s a summary of your academic performance this term.</p>
                </div>
                <div className="sd-term-badge">{profile ? `${profile.term} - ${profile.year}` : 'Current term'}</div>
              </div>
              <OverviewCards overview={overview} subjects={subjects} />
              <div className="sd-mid-grid">
                <SubjectCards
                  subjects={subjects}
                  onSelectSubject={openSubject}
                  onViewAll={() => {
                    setSelectedSubjectId(null);
                    setActiveNav('subjects');
                  }}
                />
                <ProgressChart data={progress} />
              </div>
              <div className="sd-bottom-grid">
                <HomeworkSection homework={homework} />
              </div>
            </>
          )}

          {activeNav === 'subjects' && selectedSubject && (
            <SubjectReportPage subject={selectedSubject} onBack={closeSubjectReport} />
          )}

          {activeNav === 'subjects' && !selectedSubject && (
            <SubjectsPage subjects={subjects} onSelectSubject={openSubject} />
          )}
          
          {activeNav === 'progress'    && <ProgressPage overview={overview} subjects={subjects} progress={progress} />}
          {activeNav === 'settings'    && <SettingsPage profile={profile} />}
        </main>
      </div>
    </div>
  );
}
