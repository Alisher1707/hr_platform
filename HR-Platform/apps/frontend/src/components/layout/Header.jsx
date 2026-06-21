import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ThemeToggle from '../ui/ThemeToggle';

/**
 * Header Component
 * Premium header displaying page title, theme switcher and responsive menu toggler
 */
export function Header({ onMenuClick }) {
  const { user } = useAuthStore();
  const location = useLocation();

  // Determine page title based on path
  const getPageDetails = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) {
      return { title: 'Tizim statistikasi', subtitle: 'Tizimning umumiy holati va xizmatlar' };
    }
    if (path.includes('/admin/employees')) {
      return { title: 'Xodimlar ro\'yxati', subtitle: 'Kompaniyadagi barcha faol xodimlar boshqaruvi' };
    }
    if (path.includes('/admin/invites')) {
      return { title: 'Taklifnomalar', subtitle: 'Yangi a\'zolar taklif qilish havolalari' };
    }
    if (path.includes('/hr/dashboard')) {
      return { title: 'HR Dashboard', subtitle: 'Kandidatlar va ishga qabul qilish monitoringi' };
    }
    if (path.includes('/hr/kanban')) {
      return { title: 'Ishga Qabul Kanban Doskasi', subtitle: 'Nomzodlarni bosqichma-bosqich saralash' };
    }
    return { title: 'HR Platform', subtitle: 'Recruiting Management System' };
  };

  const { title, subtitle } = getPageDetails();

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="btn btn-ghost btn-icon" 
          onClick={onMenuClick}
          style={{ display: 'none' /* Will be toggled on mobile via CSS */ }}
          id="mobile-menu-toggle"
        >
          ☰
        </button>
        <div>
          <div className="header-title">{title}</div>
          <div className="header-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {subtitle}
          </div>
        </div>
      </div>

      <div className="header-right">
        <ThemeToggle />
        <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 0.5rem' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '600' }}>
            {user?.firstName}
          </span>
          <div 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'var(--accent-light)', 
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.8125rem'
            }}
          >
            {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
