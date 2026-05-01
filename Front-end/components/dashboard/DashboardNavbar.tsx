'use client';

import { Bell, Search, Menu } from 'lucide-react';

interface Props {
  onMenuToggle: () => void;
}

export default function DashboardNavbar({ onMenuToggle }: Props) {
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
            placeholder="Search subjects, assignments…"
            className="sd-search-input"
          />
        </div>
      </div>

      <div className="sd-navbar-right">
        <button className="sd-notif-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="sd-notif-dot" />
        </button>

        <div className="sd-navbar-profile">
          <div className="sd-navbar-avatar">A</div>
          <div className="sd-navbar-profile-info">
            <p className="sd-navbar-name">Alex Johnson</p>
            <p className="sd-navbar-role">Student</p>
          </div>
        </div>
      </div>
    </header>
  );
}
