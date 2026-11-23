import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Tags,
  Users,
  ShoppingBag,
  Image,
  ArrowRight,
} from 'lucide-react';

const QuickActions = ({ onOpenAddProduct }) => {
  const navigate = useNavigate();
  const { totalProducts, totalCategories, totalCustomers, totalOrders, banners } = useData();

  const actions = [
    {
      title: 'Add Product',
      desc: 'Create new catalog item',
      icon: PlusCircle,
      count: `${totalProducts} items`,
      color: 'from-blue-600 to-indigo-600',
      action: onOpenAddProduct,
    },
    {
      title: 'Manage Categories',
      desc: 'Organize store taxonomy',
      icon: Tags,
      count: `${totalCategories} categories`,
      color: 'from-purple-600 to-violet-600',
      action: () => navigate('/categories'),
    },
    {
      title: 'View Customers',
      desc: 'Customer CRM & loyalty',
      icon: Users,
      count: `${totalCustomers} clients`,
      color: 'from-emerald-600 to-teal-600',
      action: () => navigate('/customers'),
    },
    {
      title: 'Manage Orders',
      desc: 'Fulfill & track orders',
      icon: ShoppingBag,
      count: `${totalOrders} orders`,
      color: 'from-amber-600 to-orange-600',
      action: () => navigate('/orders'),
    },
    {
      title: 'Manage Banners',
      desc: 'Marketing campaigns',
      icon: Image,
      count: `${banners.length} promos`,
      color: 'from-rose-600 to-pink-600',
      action: () => navigate('/banners'),
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Quick Navigation & Actions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rapid access shortcuts to key operational administration workflows
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={act.title}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={act.action}
              className="flex flex-col text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                {act.title}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {act.desc}
              </span>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 w-full">
                <span>{act.count}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-brand-600 dark:text-brand-400" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
