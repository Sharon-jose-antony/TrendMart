import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import SearchModal from './SearchModal';
import LogoutModal from './LogoutModal';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Global hotkey: Ctrl+K or Cmd+K to open Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Protect route if unauthenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Topbar */}
        <Topbar
          toggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenLogout={() => setIsLogoutOpen(true)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
