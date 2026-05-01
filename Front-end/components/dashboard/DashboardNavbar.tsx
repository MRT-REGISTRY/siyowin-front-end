'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { StudentProfile } from '@/types';

interface Props {
  onMenuToggle: () => void;
  profile: StudentProfile | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function DashboardNavbar({ onMenuToggle, profile, searchValue, onSearchChange }: Props) {
  const avatar = profile?.avatar || profile?.name.charAt(0).toUpperCase() || 'S';

  return (
    <header className="sd-navbar">
      <div className="sd-navbar-left">
        <button
          className="sd-menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div className="sd-search-bar">
          <Search size={15} className="sd-search-icon" />
          <input
            type="text"
            placeholder="Search subjects, assignments..."
            className="sd-search-input"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      <div className="sd-navbar-right">
        <button className="sd-notif-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="sd-notif-dot" />
        </button>

        <div className="sd-navbar-profile">
          <div className="sd-navbar-avatar">{avatar}</div>
          <div className="sd-navbar-profile-info">
            <p className="sd-navbar-name">{profile?.name ?? 'Student'}</p>
            <p className="sd-navbar-role">Student</p>
          </div>
        </div>
      </div>
    </header>
  );
}
