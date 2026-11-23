import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const BrandLogo = ({ isCollapsed = false, className = '', height = 'h-8' }) => {
  const { isDark } = useTheme();

  if (isCollapsed) {
    return (
      <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all group-hover:border-brand-500/50 shrink-0">
        <img
          src={isDark ? '/logo-icon-dark.webp' : '/logo-icon-light.webp'}
          alt="TrendMart Icon"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center py-1 transition-all ${className}`}>
      <img
        src={isDark ? '/logo-dark.webp' : '/logo-light.webp'}
        alt="TrendMart Logo"
        className={`${height} w-auto object-contain transition-all duration-200 rounded-lg`}
      />
    </div>
  );
};

export default BrandLogo;
