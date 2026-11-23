import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Tags,
  Package,
  Users,
  ShoppingBag,
  Image,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Categories', path: '/categories', icon: Tags },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Orders', path: '/orders', icon: ShoppingBag },
  { name: 'Banners', path: '/banners', icon: Image },
  { name: 'Profile', path: '/profile', icon: UserCheck },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isCollapsed, toggleCollapse, isMobileOpen, closeMobile }) => {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 overflow-hidden py-1 group"
            onClick={closeMobile}
          >
            <BrandLogo isCollapsed={isCollapsed} />
          </NavLink>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
            aria-label="Close mobile sidebar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:scale-110'
                      }`}
                    />

                    {!isCollapsed ? (
                      <span className="truncate">{item.name}</span>
                    ) : (
                      /* Tooltip on collapsed state */
                      <div className="fixed left-20 ml-2 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Store Status Pill */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800">
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  Store Online
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  v2.4.0 • 99.98% Uptime
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2" title="Store Online: 99.98% Uptime">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
