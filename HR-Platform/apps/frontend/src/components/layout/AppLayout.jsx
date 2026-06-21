import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * AppLayout Component
 * Main app layout wrapper with responsive sidebar drawer and layout styling
 */
export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-overlay)',
            zIndex: 90,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Main Content Area */}
      <div className="app-content">
        <Header onMenuClick={toggleSidebar} />
        <main className="app-content-inner animate-fade-in-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
