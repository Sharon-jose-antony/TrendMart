import React from 'react';
import { useData } from '../../context/DataContext';
import { AlertTriangle, PackagePlus, CheckCircle, PackageCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const InventoryAlerts = () => {
  const { products, lowStockProducts, outOfStockProducts, restockProduct } = useData();

  const totalProductsCount = products.length;
  const inStockCount = totalProductsCount - outOfStockProducts.length;
  const inStockPercentage =
    totalProductsCount > 0 ? Math.round((inStockCount / totalProductsCount) * 100) : 100;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Inventory Health
              </h3>
              <p className="text-xs text-slate-400">
                Stock balance & re-order recommendations
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              lowStockProducts.length === 0 && outOfStockProducts.length === 0
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
            }`}
          >
            {lowStockProducts.length + outOfStockProducts.length} Attention Items
          </span>
        </div>

        {/* In-stock Ratio Progress Bar */}
        <div className="space-y-1.5 mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Overall Stock Availability</span>
            <span>{inStockPercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${inStockPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>{inStockCount} in stock</span>
            <span>{outOfStockProducts.length} sold out</span>
          </div>
        </div>

        {/* Low-stock Item Cards */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Immediate Restock Needed
          </span>

          {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-center text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>All inventory levels are optimal! No low stock alerts.</span>
            </div>
          ) : (
            [...outOfStockProducts, ...lowStockProducts].slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.sku} • {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold block ${
                        item.stock === 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                    </span>
                    <span className="text-[10px] text-slate-400">Stock level</span>
                  </div>

                  <button
                    onClick={() => restockProduct(item.id, 15)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/80 dark:hover:bg-brand-900 text-brand-600 dark:text-brand-300 text-xs font-semibold transition-colors"
                    title="Quick restock 15 units"
                  >
                    <PackagePlus className="w-3.5 h-3.5" />
                    <span>+15</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryAlerts;
