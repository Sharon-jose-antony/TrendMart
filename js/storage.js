window.StorageAPI = {
  KEYS: {
    PRODUCTS: "tm_products",
    CATEGORIES: "tm_categories",
    CUSTOMERS: "tm_customers",
    ORDERS: "tm_orders",
    BANNERS: "tm_banners",
    THEME: "tm_theme",
  },

  init: function () {
    const seed = {
      tm_categories: [
        { id: 1, name: "Electronics", image: "https://via.placeholder.com/60?text=Elec" },
        { id: 2, name: "Fashion", image: "https://via.placeholder.com/60?text=Fash" },
        { id: 3, name: "Home & Living", image: "https://via.placeholder.com/60?text=Home" },
      ],
      tm_products: [
        {
          id: 101,
          name: "Wireless Headphones",
          category: "Electronics",
          price: 2999,
          stock: 24,
          image: "https://via.placeholder.com/60?text=Audio",
        },
        {
          id: 102,
          name: "Leather Watch",
          category: "Fashion",
          price: 1850,
          stock: 15,
          image: "https://via.placeholder.com/60?text=Watch",
        },
        {
          id: 103,
          name: "Ceramic Desk Lamp",
          category: "Home & Living",
          price: 1299,
          stock: 8,
          image: "https://via.placeholder.com/60?text=Lamp",
        },
      ],
      tm_customers: [
        { id: 1, name: "Aarav Sharma", email: "aarav@example.com", mobile: "9876543210", address: "Mumbai, IN" },
        { id: 2, name: "Priya Nair", email: "priya@example.com", mobile: "9123456780", address: "Bengaluru, IN" },
      ],
      tm_orders: [
        { id: "ORD-1001", customer: "Aarav Sharma", total: 2999, status: "Pending" },
        { id: "ORD-1002", customer: "Priya Nair", total: 3149, status: "Delivered" },
      ],
    };

    Object.keys(seed).forEach((key) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(seed[key]));
      }
    });
  },

  get: function (key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (err) {
      return [];
    }
  },

  save: function (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
};