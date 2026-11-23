import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ACCENT_STYLES = {
  indigo: {
    bgLight: 'bg-indigo-50/80',
    bgDark: 'dark:bg-indigo-950/30',
    iconColor: 'text-brand-600 dark:text-brand-400',
    border: 'hover:border-brand-500/40',
    glow: 'hover:shadow-indigo-500/10',
    badge: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
  },
  violet: {
    bgLight: 'bg-purple-50/80',
    bgDark: 'dark:bg-purple-950/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    border: 'hover:border-purple-500/40',
    glow: 'hover:shadow-purple-500/10',
    badge: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400',
  },
  emerald: {
    bgLight: 'bg-emerald-50/80',
    bgDark: 'dark:bg-emerald-950/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'hover:border-emerald-500/40',
    glow: 'hover:shadow-emerald-500/10',
    badge: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  amber: {
    bgLight: 'bg-amber-50/80',
    bgDark: 'dark:bg-amber-950/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    border: 'hover:border-amber-500/40',
    glow: 'hover:shadow-amber-500/10',
    badge: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400',
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  accent = 'indigo',
}) => {
  const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.indigo;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 ${styles.border} ${styles.glow}`}
    >
      <div className="flex items-start justify-between">
        {/* Title and Value */}
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </div>
        </div>

        {/* Coordinated Lucide Icon */}
        <div
          className={`w-12 h-12 rounded-2xl ${styles.bgLight} ${styles.bgDark} ${styles.iconColor} flex items-center justify-center shrink-0 shadow-sm`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Comparison & Change Indicator */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold">
          {isPositive ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              {change}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3.5 h-3.5" />
              {change}
            </span>
          )}
          <span className="text-slate-400 font-normal">vs last period</span>
        </div>

        {subtitle && (
          <span className="text-slate-400 font-medium hidden sm:inline-block">
            {subtitle}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
