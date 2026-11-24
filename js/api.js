// Shared TrendMart Universal API Client
(function () {
  const API_BASE = window.location.origin + '/api';

  window.TrendMartAPI = {
    // Health / Stats
    getStats: async () => {
      try {
        const res = await fetch(`${API_BASE}/stats`);
        return await res.json();
      } catch (e) {
        console.warn('[TrendMartAPI] Fallback to local stats', e);
        return window.StorageAPI ? window.StorageAPI.getStats() : null;
      }
    },

    // Products CRUD
    getProducts: async (params = {}) => {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/products${query ? '?' + query : ''}`);
        return await res.json();
      } catch (e) {
        console.warn('[TrendMartAPI] Fallback to local products', e);
        return window.StorageAPI ? window.StorageAPI.getProducts() : [];
      }
    },

    getProductById: async (id) => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        return await res.json();
      } catch (e) {
        return null;
      }
    },

    createProduct: async (productData) => {
      try {
        const res = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const created = await res.json();
        if (window.StorageAPI && window.StorageAPI.saveProduct) {
          window.StorageAPI.saveProduct(created);
        }
        return created;
      } catch (e) {
        if (window.StorageAPI && window.StorageAPI.saveProduct) {
          return window.StorageAPI.saveProduct(productData);
        }
        throw e;
      }
    },

    updateProduct: async (id, productData) => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        return await res.json();
      } catch (e) {
        if (window.StorageAPI && window.StorageAPI.saveProduct) {
          return window.StorageAPI.saveProduct({ id, ...productData });
        }
        throw e;
      }
    },

    deleteProduct: async (id) => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
        return await res.json();
      } catch (e) {
        if (window.StorageAPI && window.StorageAPI.deleteProduct) {
          return window.StorageAPI.deleteProduct(id);
        }
        return false;
      }
    },

    // Categories
    getCategories: async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        return await res.json();
      } catch (e) {
        return window.StorageAPI ? window.StorageAPI.getCategories() : [];
      }
    },

    // Orders CRUD
    getOrders: async (params = {}) => {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/orders${query ? '?' + query : ''}`);
        return await res.json();
      } catch (e) {
        return window.StorageAPI ? window.StorageAPI.getOrders() : [];
      }
    },

    getOrderById: async (id) => {
      try {
        const res = await fetch(`${API_BASE}/orders/${id}`);
        return await res.json();
      } catch (e) {
        return null;
      }
    },

    createOrder: async (orderData) => {
      try {
        const res = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        const created = await res.json();
        // Also sync local storage if present
        if (window.StorageAPI && window.StorageAPI.saveOrder) {
          window.StorageAPI.saveOrder(created);
        }
        return created;
      } catch (e) {
        if (window.StorageAPI && window.StorageAPI.saveOrder) {
          return window.StorageAPI.saveOrder(orderData);
        }
        throw e;
      }
    },

    updateOrderStatus: async (id, status, note = '') => {
      try {
        const res = await fetch(`${API_BASE}/orders/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, note })
        });
        const updated = await res.json();
        if (window.StorageAPI && window.StorageAPI.saveOrder) {
          window.StorageAPI.saveOrder(updated);
        }
        return updated;
      } catch (e) {
        if (window.StorageAPI && window.StorageAPI.saveOrder) {
          const orders = window.StorageAPI.getOrders();
          const target = orders.find(o => o.id === id);
          if (target) {
            target.status = status;
            window.StorageAPI.saveOrder(target);
            return target;
          }
        }
        throw e;
      }
    },

    // Customers
    getCustomers: async () => {
      try {
        const res = await fetch(`${API_BASE}/customers`);
        return await res.json();
      } catch (e) {
        return window.StorageAPI ? window.StorageAPI.getCustomers() : [];
      }
    },

    // Sellers
    getSellers: async () => {
      try {
        const res = await fetch(`${API_BASE}/sellers`);
        return await res.json();
      } catch (e) {
        return [];
      }
    },

    // Banners
    getBanners: async () => {
      try {
        const res = await fetch(`${API_BASE}/banners`);
        return await res.json();
      } catch (e) {
        return window.StorageAPI ? window.StorageAPI.getBanners() : [];
      }
    }
  };
})();
