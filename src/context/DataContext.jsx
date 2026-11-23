import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem
} from '../utils/storage';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_BANNERS,
  SALES_ANALYTICS_DATA,
} from '../utils/mockData';
import { useToast } from './ToastContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { showToast } = useToast();

  // Products
  const [products, setProducts] = useState(() => {
    return getStorageItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  });

  // Categories
  const [categories, setCategories] = useState(() => {
    return getStorageItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  });

  // Customers
  const [customers, setCustomers] = useState(() => {
    return getStorageItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  });

  // Orders
  const [orders, setOrders] = useState(() => {
    return getStorageItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  });

  // Activities
  const [activities, setActivities] = useState(() => {
    return getStorageItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    return getStorageItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  });

  // Banners
  const [banners, setBanners] = useState(() => {
    return getStorageItem('trendmart_banners', INITIAL_BANNERS);
  });

  // Refresh animation state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Keep LocalStorage synchronized whenever state changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CUSTOMERS, customers);
  }, [customers]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTIVITIES, activities);
  }, [activities]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    setStorageItem('trendmart_banners', banners);
  }, [banners]);

  // Derived dynamic statistics (calculated from actual stored data)
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'Active').length;
  const totalCategories = categories.length;
  const totalCustomers = customers.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);

  const lowStockProducts = products.filter((p) => p.stock <= 10 && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  // Add Product
  const addProduct = (newProduct) => {
    const product = {
      id: `prod-${Date.now().toString(36)}`,
      sku: `TM-${(newProduct.category || 'GEN').substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Active',
      rating: 5.0,
      reviewsCount: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      ...newProduct,
      price: Number(newProduct.price) || 0,
      stock: Number(newProduct.stock) || 0,
    };

    setProducts((prev) => [product, ...prev]);

    // Add activity
    addActivity({
      title: 'New product added',
      description: `${product.name} was added to catalog`,
      type: 'product',
      icon: 'PlusCircle',
      color: 'indigo',
    });

    showToast(`Product "${product.name}" created successfully!`, 'success');
    return product;
  };

  // Update Product
  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('Product updated successfully', 'success');
  };

  // Delete Product
  const deleteProduct = (id) => {
    const item = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Product "${item?.name || id}" deleted`, 'info');
  };

  // Quick Restock Product
  const restockProduct = (id, quantityToAdd = 15) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Number(p.stock) + quantityToAdd;
          return {
            ...p,
            stock: newStock,
            status: newStock > 0 && p.status === 'Draft' ? 'Active' : p.status,
          };
        }
        return p;
      })
    );

    const product = products.find((p) => p.id === id);
    addActivity({
      title: 'Inventory Restocked',
      description: `Added +${quantityToAdd} units to ${product?.name || 'Product'}`,
      type: 'stock',
      icon: 'PackagePlus',
      color: 'emerald',
    });

    showToast(`Added +${quantityToAdd} units to ${product?.name || 'Product'}`, 'success');
  };

  // Update Order Status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );

    addActivity({
      title: 'Order Status Changed',
      description: `Order #${orderId} marked as ${newStatus}`,
      type: 'order',
      icon: 'CheckCircle',
      color: 'blue',
    });

    showToast(`Order #${orderId} updated to ${newStatus}`, 'success');
  };

  // Add Category
  const addCategory = (newCat) => {
    const category = {
      id: `cat-${Date.now().toString(36)}`,
      slug: (newCat.name || '').toLowerCase().replace(/\s+/g, '-'),
      itemCount: 0,
      icon: 'Tag',
      color: 'from-brand-500 to-indigo-600',
      badge: 'New',
      ...newCat,
    };
    setCategories((prev) => [...prev, category]);
    showToast(`Category "${category.name}" added`, 'success');
  };

  // Toggle Banner Status
  const toggleBannerStatus = (id) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === 'Active' ? 'Paused' : 'Active' }
          : b
      )
    );
    showToast('Banner status updated', 'info');
  };

  // Add Activity log
  const addActivity = (act) => {
    const newAct = {
      id: `act-${Date.now().toString(36)}`,
      time: 'Just now',
      ...act,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  // Notifications
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Dashboard Refresh simulation
  const refreshDashboard = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Re-read storage to ensure freshest data
      setProducts(getStorageItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
      setOrders(getStorageItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS));
      setCategories(getStorageItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES));
      setCustomers(getStorageItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS));
      setIsRefreshing(false);
      setLastRefreshed(new Date());
      showToast('Dashboard statistics refreshed', 'success');
    }, 600);
  };

  // Reset to sample data
  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setActivities(INITIAL_ACTIVITIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBanners(INITIAL_BANNERS);

    setStorageItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStorageItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStorageItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    setStorageItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setStorageItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStorageItem('trendmart_banners', INITIAL_BANNERS);

    showToast('Reset all store data to pristine demo defaults', 'info');
  };

  // Export Store Data to JSON
  const exportData = () => {
    const fullData = {
      exportDate: new Date().toISOString(),
      store: 'TrendMart Premium',
      products,
      categories,
      customers,
      orders,
      banners,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `trendmart-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Store data exported as JSON', 'success');
  };

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        customers,
        orders,
        activities,
        notifications,
        banners,
        // Dynamic calculations
        totalProducts,
        activeProducts,
        totalCategories,
        totalCustomers,
        totalOrders,
        totalRevenue,
        lowStockProducts,
        outOfStockProducts,
        salesAnalytics: SALES_ANALYTICS_DATA,
        // Actions
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        updateOrderStatus,
        addCategory,
        toggleBannerStatus,
        addActivity,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshDashboard,
        isRefreshing,
        lastRefreshed,
        resetToDemoData,
        exportData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
