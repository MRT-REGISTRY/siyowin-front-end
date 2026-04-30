'use client';

import Image from 'next/image';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  TrendingUp,
  Settings,
  X,
} from 'lucide-react';
import { StudentProfile } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  'layout-dashboard': LayoutDashboard,
  'book-open': BookOpen,
  trophy: Trophy,
  'trending-up': TrendingUp,
  settings: Settings,
};

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface Props {
  navItems: NavItem[];
  activeNav: string;
  onNavChange: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile | null;
}

export default function DashboardSidebar({
  navItems,
  activeNav,
  onNavChange,
  isOpen,
  onClose,
  profile,
}: Props) {
  return (
    <aside className={`sd-sidebar ${isOpen ? 'sd-sidebar-open' : ''}`}>
      <div className="sd-sidebar-logo">
        <div className="sd-logo-img-wrap">
          <Image
            src="/photos/logo.png"
            alt="Siyowin Logo"
            width={120}
            height={44}
            className="sd-logo-img"
            priority
          />
        </div>
        <button
          className="sd-sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <p className="sd-sidebar-section-label">MENU</p>

      <nav className="sd-sidebar-nav">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              className={`sd-nav-item ${isActive ? 'sd-nav-item-active' : ''}`}
              onClick={() => {
                onNavChange(item.id);
                onClose();
              }}
            >
              {Icon && <Icon size={18} />}
              <span>{item.label}</span>
              {isActive && <div className="sd-nav-active-dot" />}
            </button>
          );
        })}
      </nav>

      <div className="sd-sidebar-footer">
        <div className="sd-sidebar-avatar">{profile?.avatar ?? ''}</div>
        <div className="sd-sidebar-footer-info">
          <p className="sd-sidebar-footer-name">{profile?.name ?? 'Student'}</p>
          <p className="sd-sidebar-footer-role">
            {profile ? `${profile.grade} - ${profile.classId.toUpperCase()}` : 'Student profile'}
          </p>
        </div>
      </div>
    </aside>
  );
}
