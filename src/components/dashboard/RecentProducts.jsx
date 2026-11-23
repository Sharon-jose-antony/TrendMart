import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { Search, ArrowUpRight, Package, Plus } from 'lucide-react';

const RecentProducts = ({ onOpenAddModal }) => {
  const { products } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products by search term and take the latest 6
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products.slice(0, 6);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term)
      )
      .slice(0, 6);
  }, [products, searchTerm]);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Recent Products</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {products.length} total
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active catalog items, inventory levels, and stock indicators
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter products..."
              className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-44 sm:w-56"
            />
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Table Content */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={
            searchTerm
              ? `No products match "${searchTerm}". Try a different keyword.`
              : 'You have not added any products to the store yet.'
          }
          actionLabel={searchTerm ? 'Clear Filter' : 'Add First Product'}
          onAction={searchTerm ? () => setSearchTerm('') : onOpenAddModal}
        />
      ) : (
        <div className="overflow-x-auto -mx-5 sm:-mx-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-5 sm:px-6">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 sm:px-6 text-right">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock === 0;
                const isLowStock = p.stock > 0 && p.stock <= 10;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Image & Name */}
                    <td className="py-3 px-5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-slate-900 dark:text-white truncate hover:text-brand-600 transition-colors">
                            {p.name}
                          </p>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(p.price)}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 font-medium ${
                          isOutOfStock
                            ? 'text-rose-600 dark:text-rose-400'
                            : isLowStock
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOutOfStock
                              ? 'bg-rose-500'
                              : isLowStock
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-emerald-500'
                          }`}
                        />
                        {isOutOfStock ? 'Out of stock' : `${p.stock} units`}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <Badge variant={p.status === 'Active' ? 'success' : 'neutral'}>
                        {p.status}
                      </Badge>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-5 sm:px-6 text-right text-slate-400 font-medium">
                      {formatDate(p.dateAdded)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentProducts;
