import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';
import { ArrowUpRight, ShoppingBag, Clock } from 'lucide-react';

const STATUS_VARIANTS = {
  Delivered: 'success',
  Processing: 'info',
  Pending: 'warning',
  Cancelled: 'danger',
};

const RecentOrders = () => {
  const { orders, updateOrderStatus } = useData();

  // Show top 6 most recent orders
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Recent Orders</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {orders.length} total
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Incoming customer transactions and real-time fulfillment status
          </p>
        </div>

        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-5 sm:px-6">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Order ID */}
                <td className="py-3 px-5 sm:px-6 font-mono font-bold text-brand-600 dark:text-brand-400">
                  {order.id}
                </td>

                {/* Customer */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={order.customer.avatar}
                      alt={order.customer.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {order.customer.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-slate-400 font-medium">
                  {formatDate(order.date)}
                </td>

                {/* Amount */}
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  {formatCurrency(order.amount)}
                </td>

                {/* Status Badge */}
                <td className="py-3 px-4">
                  <Badge variant={STATUS_VARIANTS[order.status] || 'neutral'}>
                    {order.status}
                  </Badge>
                </td>

                {/* Quick Status Dropdown Action */}
                <td className="py-3 px-5 sm:px-6 text-right">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                    title="Change order status"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
