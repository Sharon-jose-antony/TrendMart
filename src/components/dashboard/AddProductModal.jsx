import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../common/Modal';
import { Package, Image as ImageIcon } from 'lucide-react';

const AddProductModal = ({ isOpen, onClose }) => {
  const { categories, addProduct } = useData();

  const [formData, setFormData] = useState({
    name: '',
    category: categories[0]?.name || 'Electronics',
    price: '',
    cost: '',
    stock: '',
    status: 'Active',
    image: '',
  });

  const [errors, setErrors] = useState({});

  const sampleImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80',
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Valid price is required';
    if (!formData.stock || Number(formData.stock) < 0) errs.stock = 'Valid stock count is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const productPayload = {
      ...formData,
      image:
        formData.image ||
        sampleImages[Math.floor(Math.random() * sampleImages.length)],
    };

    addProduct(productPayload);
    // Reset form
    setFormData({
      name: '',
      category: categories[0]?.name || 'Electronics',
      price: '',
      cost: '',
      stock: '',
      status: 'Active',
      image: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Product"
      subtitle="Enter product details to publish to the TrendMart catalog"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Product Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Bang & Olufsen Beoplay H95"
            className={`w-full px-3.5 py-2 rounded-xl border ${
              errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
            } bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30`}
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="Active">Active (Visible)</option>
              <option value="Draft">Draft (Hidden)</option>
            </select>
          </div>
        </div>

        {/* Price, Cost & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Retail Price ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="199.99"
              className={`w-full px-3.5 py-2 rounded-xl border ${
                errors.price ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30`}
            />
            {errors.price && <p className="text-[11px] text-rose-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Unit Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="95.00"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Stock <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="25"
              className={`w-full px-3.5 py-2 rounded-xl border ${
                errors.stock ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30`}
            />
            {errors.stock && <p className="text-[11px] text-rose-500 mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Product Image URL (Optional)
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://images.unsplash.com/... (Leave blank for high-res sample)"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Publish Product
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
