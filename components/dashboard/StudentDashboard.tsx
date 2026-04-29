'use client';

import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';
import OverviewCards from './OverviewCards';
import SubjectCards from './SubjectCards';
import ProgressChart from './ProgressChart';
import HomeworkSection from './HomeworkSection';
import LeaderboardPreview from './LeaderboardPreview';
import SubjectsPage from './pages/SubjectsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: 'layout-dashboard' },
  { id: 'subjects',    label: 'My Subjects',  icon: 'book-open' },
  { id: 'leaderboard', label: 'Leaderboard',  icon: 'trophy' },
  { id: 'progress',    label: 'Progress',     icon: 'trending-up' },
  { id: 'settings',    label: 'Settings',     icon: 'settings' },
];

export default function StudentDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="sd-root">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div className="sd-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <div className="sd-main-wrapper">
        <DashboardNavbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="sd-content">
          {activeNav === 'dashboard' && (
            <>
              <div className="sd-greeting">
                <div>
                  <h1 className="sd-greeting-title">
                    Good afternoon, <span className="sd-highlight">Alex! 👋</span>
                  </h1>
                  <p className="sd-greeting-sub">Here&apos;s a summary of your academic performance this term.</p>
                </div>
                <div className="sd-term-badge">Term 2 · 2026</div>
              </div>
              <OverviewCards />
              <div className="sd-mid-grid">
                <SubjectCards />
                <ProgressChart />
              </div>
              <div className="sd-bottom-grid">
                <HomeworkSection />
                <LeaderboardPreview />
              </div>
            </>
          )}

          {activeNav === 'subjects'    && <SubjectsPage />}
          {activeNav === 'leaderboard' && <LeaderboardPage />}
          {activeNav === 'progress'    && <ProgressPage />}
          {activeNav === 'settings'    && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
