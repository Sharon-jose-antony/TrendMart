import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { RotateCw, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomeSection = ({ selectedRange, setSelectedRange }) => {
  const { user } = useAuth();
  const { refreshDashboard, isRefreshing, lastRefreshed } = useData();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Formatted date string
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const ranges = ['7 Days', '30 Days', '90 Days', '1 Year'];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/20 mb-8">
      {/* Decorative ambient background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Greeting and subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-brand-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">{user?.name ? user.name.split(' ')[0] : 'Admin'}</span>!
          </h1>
          <p className="text-sm sm:text-base text-indigo-200/90 max-w-xl leading-relaxed">
            Here's what's happening with your store today. Monitor live sales, fulfill orders, and optimize inventory health.
          </p>
        </div>

        {/* Right: Actions & Range Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Time range pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/40 backdrop-blur-md border border-white/10 text-xs font-medium">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedRange === range
                    ? 'bg-brand-600 text-white shadow-sm font-semibold'
                    : 'text-indigo-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Refresh Action Button */}
          <button
            onClick={refreshDashboard}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/15 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60"
            title="Refresh dashboard metrics"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-300' : ''}`}
            />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
