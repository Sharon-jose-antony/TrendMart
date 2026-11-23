import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import LogoutModal from '../components/layout/LogoutModal';
import {
  Sun,
  Moon,
  Monitor,
  Check,
  User,
  Shield,
  Bell,
  Database,
  Download,
  RotateCcw,
  LogOut,
  Mail,
  Key,
  BadgeCheck,
} from 'lucide-react';

const Settings = () => {
  const { theme, setThemeMode } = useTheme();
  const { user, updateUserProfile } = useAuth();
  const { resetToDemoData, exportData } = useData();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@trendmart.com',
    role: user?.role || 'Super Administrator',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8 max-w-5xl"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your admin interface appearance, administrator profile credentials, and data storage preferences.
        </p>
      </div>

      {/* SECTION 1: APPEARANCE PREFERENCES */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Appearance & Theme
            </h2>
            <p className="text-xs text-slate-400">
              Select your visual preference. Persisted across browser sessions in LocalStorage.
            </p>
          </div>
        </div>

        {/* Theme Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={`relative p-5 rounded-2xl border-2 text-left transition-all group ${
              theme === 'light'
                ? 'border-brand-600 bg-brand-50/20 shadow-md shadow-brand-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            {/* Visual Preview Graphic */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mb-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex gap-2">
                <div className="w-1/4 h-14 bg-white rounded border border-slate-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-full h-6 bg-white rounded border border-slate-200" />
                  <div className="w-3/4 h-6 bg-brand-100 rounded border border-brand-200" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  Light Theme
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Crisp daylight mode with soft neutral tones
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  theme === 'light'
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {theme === 'light' && <Check className="w-3 h-3" />}
              </div>
            </div>
          </button>

          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={`relative p-5 rounded-2xl border-2 text-left transition-all group ${
              theme === 'dark'
                ? 'border-brand-500 bg-brand-950/20 shadow-md shadow-brand-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            {/* Visual Preview Graphic */}
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 mb-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex gap-2">
                <div className="w-1/4 h-14 bg-slate-900 rounded border border-slate-800" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-full h-6 bg-slate-900 rounded border border-slate-800" />
                  <div className="w-3/4 h-6 bg-brand-950 rounded border border-brand-800" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  Dark Theme
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  High-contrast midnight mode, easy on the eyes
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  theme === 'dark'
                    ? 'border-brand-500 bg-brand-600 text-white'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {theme === 'dark' && <Check className="w-3 h-3" />}
              </div>
            </div>
          </button>
        </div>

        {/* Live Persistence Confirmation Pill */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Active theme is safely stored under key <code className="font-mono text-brand-600 dark:text-brand-400 font-semibold">trendmart_theme</code> and automatically reapplied on page refresh.</span>
        </div>
      </div>

      {/* SECTION 2: ADMINISTRATOR ACCOUNT & SESSION */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Administrator Profile & Session
            </h2>
            <p className="text-xs text-slate-400">
              Current active session credentials and authority configuration
            </p>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
              alt={user?.name || 'Admin'}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {user?.name || 'Alex Morgan'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {user?.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email || 'alex.morgan@trendmart.com'} • {user?.role || 'Super Administrator'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Last authenticated: {user?.lastLogin || 'Today, 08:30 AM'}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Administrator Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Work Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Changes saved to session
              </span>
            ) : <span />}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Update Profile Information
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: DATA MANAGEMENT & BACKUP */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Data Management & Persistence
            </h2>
            <p className="text-xs text-slate-400">
              Manage your persistent catalog, orders, and customer records stored in LocalStorage
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Store Data */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Export Store Snapshot
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Download a JSON archive containing all products, orders, categories, and customers.
              </p>
            </div>
            <button
              onClick={exportData}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download JSON Archive
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Reset Demo Defaults
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Restore pristine sample products, categories, orders, and activity logs.
              </p>
            </div>
            <button
              onClick={resetToDemoData}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: DANGER ZONE & LOGOUT */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-950/60 shadow-sm">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base mb-1">
              <LogOut className="w-5 h-5" />
              <span>Session Termination</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Signing out will end your current session and clear your authentication token (<code className="font-mono text-xs">trendmart_auth</code>). Your store products, orders, and customer records will remain fully intact.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Log Out of TrendMart
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </motion.div>
  );
};

export default Settings;
