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
        { id: 1, name: "Aarav Sharma", email: "aarav@example.com", mobile: "9876543210", address: "Mumbai, Maharashtra" },
        { id: 2, name: "Priya Nair", email: "priya@example.com", mobile: "9123456780", address: "Bengaluru, Karnataka" },
        { id: 3, name: "Rohan Verma", email: "rohan.v@example.com", mobile: "9811223344", address: "New Delhi, Delhi" },
        { id: 4, name: "Ananya Iyer", email: "ananya.iyer@example.com", mobile: "9822334455", address: "Chennai, Tamil Nadu" },
        { id: 5, name: "Vikramaditya Singh", email: "vikram.singh@example.com", mobile: "9833445566", address: "Jaipur, Rajasthan" },
        { id: 6, name: "Sneha Patel", email: "sneha.p@example.com", mobile: "9844556677", address: "Ahmedabad, Gujarat" },
        { id: 7, name: "Arjun Kapoor", email: "arjun.k@example.com", mobile: "9855667788", address: "Pune, Maharashtra" },
        { id: 8, name: "Meera Nambiar", email: "meera.n@example.com", mobile: "9866778899", address: "Kochi, Kerala" },
        { id: 9, name: "Kabir Chatterjee", email: "kabir.c@example.com", mobile: "9877889900", address: "Kolkata, West Bengal" },
        { id: 10, name: "Divya Deshmukh", email: "divya.d@example.com", mobile: "9888990011", address: "Hyderabad, Telangana" },
        { id: 11, name: "Rajesh Kulkarni", email: "rajesh.k@example.com", mobile: "9899001122", address: "Nagpur, Maharashtra" },
        { id: 12, name: "Neha Bansal", email: "neha.bansal@example.com", mobile: "9900112233", address: "Chandigarh, Punjab" },
      ],
      tm_orders: [
        { id: "ORD-1001", customer: "Aarav Sharma", total: 2999, status: "Pending" },
        { id: "ORD-1002", customer: "Priya Nair", total: 3149, status: "Delivered" },
        { id: "ORD-1003", customer: "Rohan Verma", total: 1850, status: "Processing" },
        { id: "ORD-1004", customer: "Ananya Iyer", total: 4299, status: "Delivered" },
      ],
    };

    Object.keys(seed).forEach((key) => {
      const existing = localStorage.getItem(key);
      if (!existing) {
        localStorage.setItem(key, JSON.stringify(seed[key]));
      } else if (key === "tm_customers") {
        try {
          const list = JSON.parse(existing);
          if (Array.isArray(list) && list.length < 10) {
            // Merge seed customers to guarantee 10+ entries
            const existingIds = new Set(list.map((c) => c.id));
            const merged = [...list];
            seed.tm_customers.forEach((c) => {
              if (!existingIds.has(c.id)) merged.push(c);
            });
            localStorage.setItem(key, JSON.stringify(merged));
          }
        } catch (e) {
          localStorage.setItem(key, JSON.stringify(seed[key]));
        }
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
