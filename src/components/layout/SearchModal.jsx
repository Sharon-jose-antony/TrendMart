import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Modal from '../common/Modal';
import { Search, Package, ShoppingBag, Users, Tags, ArrowRight, CornerDownLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, orders, customers, categories } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return { products: [], orders: [], customers: [], categories: [] };

    return {
      products: products
        .filter((p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
        .slice(0, 3),
      orders: orders
        .filter((o) => o.id.toLowerCase().includes(term) || o.customer.name.toLowerCase().includes(term))
        .slice(0, 3),
      customers: customers
        .filter((c) => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
        .slice(0, 3),
      categories: categories
        .filter((cat) => cat.name.toLowerCase().includes(term))
        .slice(0, 2),
    };
  }, [searchTerm, products, orders, customers, categories]);

  const hasResults =
    results.products.length > 0 ||
    results.orders.length > 0 ||
    results.customers.length > 0 ||
    results.categories.length > 0;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Search input bar */}
        <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, orders, customers, categories..."
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none text-base"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results view */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1">
          {!searchTerm ? (
            <div className="py-6 text-center text-slate-400 text-sm">
              <p>Type to search across store catalog, orders, and users.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Headphones
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  ORD-9482
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Electronics
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Sarah
                </span>
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              No matching records found for "{searchTerm}"
            </div>
          ) : (
            <>
              {/* Products */}
              {results.products.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Products
                  </div>
                  <div className="space-y-1">
                    {results.products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect('/products')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                              {p.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {p.sku} • {p.category}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {formatCurrency(p.price)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders */}
              {results.orders.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> Orders
                  </div>
                  <div className="space-y-1">
                    {results.orders.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => handleSelect('/orders')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                            #
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                              {o.id} • {o.customer.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              Status: {o.status} • {o.itemsCount} items
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {formatCurrency(o.amount)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {results.customers.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Customers
                  </div>
                  <div className="space-y-1">
                    {results.customers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelect('/customers')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                              {c.name}
                            </div>
                            <div className="text-xs text-slate-400">{c.email}</div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {c.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {results.categories.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
                    <Tags className="w-3.5 h-3.5" /> Categories
                  </div>
                  <div className="space-y-1">
                    {results.categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleSelect('/categories')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                      >
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                          {cat.name}
                        </div>
                        <span className="text-xs text-slate-400">
                          {cat.itemCount} items
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="w-3.5 h-3.5" /> to select
            </span>
            <span>ESC to close</span>
          </div>
          <span>TrendMart Fast Search</span>
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
