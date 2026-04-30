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
}

export default function DashboardSidebar({
  navItems,
  activeNav,
  onNavChange,
  isOpen,
  onClose,
}: Props) {
  return (
    <aside className={`sd-sidebar ${isOpen ? 'sd-sidebar-open' : ''}`}>
      {/* Logo */}
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

      {/* Nav label */}
      <p className="sd-sidebar-section-label">MENU</p>

      {/* Navigation */}
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

      {/* Bottom profile */}
      <div className="sd-sidebar-footer">
        <div className="sd-sidebar-avatar">A</div>
        <div className="sd-sidebar-footer-info">
          <p className="sd-sidebar-footer-name">Alex Johnson</p>
          <p className="sd-sidebar-footer-role">Grade 11 · Section B</p>
        </div>
      </div>
    </aside>
  );
}
