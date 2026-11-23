import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-slate-200 dark:border-slate-800 text-xs font-sans">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name === 'revenue' ? 'Revenue' : entry.name === 'orders' ? 'Orders' : entry.name}:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {entry.name === 'revenue' || entry.name === 'profit'
                  ? formatCurrency(entry.value)
                  : `${entry.value} orders`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const SalesChart = ({ selectedRange, setSelectedRange }) => {
  const { salesAnalytics } = useData();
  const [chartType, setChartType] = useState('area'); // 'area' | 'bar'

  const currentData = salesAnalytics[selectedRange] || salesAnalytics['7 Days'];

  // Calculate period totals
  const totalPeriodRevenue = currentData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalPeriodOrders = currentData.reduce((acc, curr) => acc + curr.orders, 0);
  const averageOrderValue = totalPeriodOrders > 0 ? totalPeriodRevenue / totalPeriodOrders : 0;

  const ranges = ['7 Days', '30 Days', '90 Days', '1 Year'];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Sales & Revenue Analytics
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Demo Data
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time sales performance, volume metrics, and profitability trajectory
          </p>
        </div>

        {/* Chart View & Range Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Trend Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Volume Bars
            </button>
          </div>

          {/* Time range switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedRange === range
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Period Gross Sales
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {formatCurrency(totalPeriodRevenue)}
          </div>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Total Orders Logged
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {totalPeriodOrders}
          </div>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Avg. Order Value (AOV)
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {formatCurrency(averageOrderValue)}
          </div>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickFormatter={(val) => `$${formatCompactNumber(val)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="profit"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#profitGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend & Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-1 bg-brand-600 rounded-full" /> Revenue ($)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-1 bg-purple-500 rounded-full" /> Net Profit ($)
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <Info className="w-3.5 h-3.5" />
          <span>Interactive data adapts to selected timeframe</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
