// Shared TrendMart Universal API Client
(function () {
  const API_BASE = window.TRENDMART_API_BASE || 
    (window.location.port === '5000' ? window.location.origin + '/api' : 'http://localhost:5000/api');

  window.TrendMartAPI = {
    // Auth helpers
    getCurrentCustomer: () => {
      try {
        const u = localStorage.getItem('tm_customer_session');
        return u ? JSON.parse(u) : null;
      } catch (e) { return null; }
    },
    setCurrentCustomer: (user) => {
      if (!user) localStorage.removeItem('tm_customer_session');
      else localStorage.setItem('tm_customer_session', JSON.stringify(user));
    },
    getCurrentSeller: () => {
      try {
        const s = localStorage.getItem('tm_seller_session');
        return s ? JSON.parse(s) : null;
      } catch (e) { return null; }
    },
    setCurrentSeller: (seller) => {
      if (!seller) localStorage.removeItem('tm_seller_session');
      else localStorage.setItem('tm_seller_session', JSON.stringify(seller));
    },
    customerLogin: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/customer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        window.TrendMartAPI.setCurrentCustomer(data.user);
      }
      return data;
    },
    customerRegister: async (formData) => {
      const res = await fetch(`${API_BASE}/auth/customer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        window.TrendMartAPI.setCurrentCustomer(data.user);
      }
      return data;
    },
    sellerLogin: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/seller/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.seller) {
        window.TrendMartAPI.setCurrentSeller(data.seller);
      }
      return data;
    },
    sellerRegister: async (formData) => {
      const res = await fetch(`${API_BASE}/auth/seller/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.seller) {
        window.TrendMartAPI.setCurrentSeller(data.seller);
      }
      return data;
    },
    // Health / Stats
    getStats: async () => {
      try {
        const res = await fetch(`${API_BASE}/stats`, { cache: 'no-store' });
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
        const res = await fetch(`${API_BASE}/products${query ? '?' + query : ''}`, { cache: 'no-store' });
        return await res.json();
      } catch (e) {
        console.warn('[TrendMartAPI] Fallback to local products', e);
        return window.StorageAPI ? window.StorageAPI.getProducts() : [];
      }
    },

    getProductById: async (id) => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' });
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
        const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
        return await res.json();
      } catch (e) {
        return window.StorageAPI ? window.StorageAPI.getCategories() : [];
      }
    },

    // Orders CRUD
    getOrders: async (params = {}) => {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/orders${query ? '?' + query : ''}`, { cache: 'no-store' });
        return await res.json();
      } catch (e) {
        return window.StorageAPI ? window.StorageAPI.getOrders() : [];
      }
    },

    getOrderById: async (id) => {
      try {
        const res = await fetch(`${API_BASE}/orders/${id}`, { cache: 'no-store' });
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

    deleteOrder: async (id) => {
      try {
        const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (window.StorageAPI && window.StorageAPI.KEYS) {
          const cur = window.StorageAPI.get(window.StorageAPI.KEYS.ORDERS) || [];
          window.StorageAPI.save(window.StorageAPI.KEYS.ORDERS, cur.filter(o => o.id !== id && o.orderNumber !== id));
        }
        return data.success;
      } catch (e) {
        if (window.StorageAPI && window.StorageAPI.KEYS) {
          const cur = window.StorageAPI.get(window.StorageAPI.KEYS.ORDERS) || [];
          window.StorageAPI.save(window.StorageAPI.KEYS.ORDERS, cur.filter(o => o.id !== id && o.orderNumber !== id));
          return true;
        }
        return false;
      }
    },

    // Customers
    getCustomers: async () => {
      try {
        const res = await fetch(`${API_BASE}/customers`, { cache: 'no-store' });
        return await res.json();
      } catch (e) {
        return window.StorageAPI ? window.StorageAPI.getCustomers() : [];
      }
    },

    // Sellers
    getSellers: async () => {
      try {
        const res = await fetch(`${API_BASE}/sellers`, { cache: 'no-store' });
        return await res.json();
      } catch (e) {
        return [];
      }
    },

    // Banners
    getBanners: async () => {
      try {
        const res = await fetch(`${API_BASE}/banners`, { cache: 'no-store' });
        return await res.json();
      } catch (e) {
        return window.StorageAPI ? window.StorageAPI.getBanners() : [];
      }
    }
  };
})();