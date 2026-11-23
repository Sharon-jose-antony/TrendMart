import React from 'react';
import { useData } from '../../context/DataContext';
import {
  ShoppingBag,
  AlertTriangle,
  UserPlus,
  PackageCheck,
  Database,
  PlusCircle,
  PackagePlus,
  CheckCircle,
} from 'lucide-react';

const ICON_MAP = {
  ShoppingBag,
  AlertTriangle,
  UserPlus,
  PackageCheck,
  Database,
  PlusCircle,
  PackagePlus,
  CheckCircle,
};

const COLOR_MAP = {
  emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  blue: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
};

const ActivityTimeline = () => {
  const { activities } = useData();

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-xs text-slate-400">
            Real-time chronological events across your store
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
          Live feed
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {activities.slice(0, 5).map((act) => {
          const IconComponent = ICON_MAP[act.icon] || ShoppingBag;
          const colorClasses = COLOR_MAP[act.color] || COLOR_MAP.indigo;

          return (
            <div key={act.id} className="relative group">
              {/* Timeline marker icon */}
              <div
                className={`absolute -left-6 top-0 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 shadow-sm ${colorClasses}`}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>

              {/* Event Content */}
              <div className="pl-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {act.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {act.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
