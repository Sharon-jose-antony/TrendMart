import React from 'react';
import { Gauge, CheckCircle2, TrendingUp, Truck, Zap } from 'lucide-react';

const StorePerformance = () => {
  const metrics = [
    {
      label: 'Store Conversion Rate',
      value: '3.48%',
      change: '+0.6%',
      isGood: true,
      desc: 'Industry benchmark: 2.5%',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      label: 'Customer Retention Rate',
      value: '82.4%',
      change: '+4.2%',
      isGood: true,
      desc: 'Repeat buyers in 90 days',
      icon: CheckCircle2,
      color: 'text-indigo-500',
    },
    {
      label: 'Avg. Fulfillment Speed',
      value: '1.4 days',
      change: '-0.3 days',
      isGood: true,
      desc: 'Dispatch to transit',
      icon: Truck,
      color: 'text-blue-500',
    },
    {
      label: 'Checkout Completion',
      value: '76.2%',
      change: '+2.1%',
      isGood: true,
      desc: 'Cart abandonment: 23.8%',
      icon: Zap,
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Store Performance Summary</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              Optimal Health
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational efficiency metrics compared against top 10% global e-commerce benchmarks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {m.label}
                </span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>

              <div className="my-2">
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {m.value}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  <span>{m.change}</span>
                  <span className="text-[10px] text-slate-400 font-normal">vs last month</span>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                {m.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorePerformance;
