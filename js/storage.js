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
    image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    description: "Premium wireless headphones featuring noise cancellation, high-quality sound, comfortable ear cushions and long-lasting battery life. Ideal for music, gaming and everyday use."
  },
  {
    id: 102,
    name: "Leather Watch",
    category: "Fashion",
    price: 1850,
    stock: 15,
image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",    description: "Elegant wristwatch with a premium leather strap, stylish dial and durable construction. Suitable for both formal and casual occasions."
  },
  {
    id: 103,
    name: "Ceramic Desk Lamp",
    category: "Home & Living",
    price: 1299,
    stock: 8,
image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",    description: "Modern ceramic desk lamp providing soft ambient lighting. Perfect for bedrooms, study tables and office spaces."
  },
  {
    id: 104,
    name: "Smart Watch",
    category: "Electronics",
    price: 3499,
    stock: 18,
image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=600&q=80",    description: "Feature-rich smartwatch with fitness tracking, heart rate monitoring, activity tracking and notification alerts."
  },
  {
    id: 105,
    name: "Leather Backpack",
    category: "Fashion",
    price: 1899,
    stock: 15,
image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",    description: "Stylish and durable backpack with spacious compartments, secure storage and comfortable shoulder straps for college, work and travel."
  },
  {
    id: 106,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 2499,
    stock: 20,
image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",    description: "Portable Bluetooth speaker delivering clear audio, rich bass, wireless connectivity and convenient controls for indoor and outdoor entertainment."
  },
  {
    id: 107,
    name: "Cotton T-Shirt",
    category: "Fashion",
    price: 799,
    stock: 32,
image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",    description: "Comfortable everyday cotton T-shirt featuring a breathable fabric, regular fit and versatile design suitable for casual wear."
  },
  {
    id: 108,
    name: "Table Organizer",
    category: "Home & Living",
    price: 599,
    stock: 12,
image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=600&q=80",    description: "Practical desk organizer with multiple compartments for stationery, accessories and everyday essentials. Helps maintain a neat workspace."
  },
  {
    id: 109,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 999,
    stock: 25,
image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80",    description: "Ergonomic wireless mouse with responsive tracking, comfortable grip and reliable connectivity for laptops and desktop computers."
  },
  {
    id: 110,
    name: "Decorative Wall Clock",
    category: "Home & Living",
    price: 1499,
    stock: 7,
image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80",    description: "Modern decorative wall clock with a stylish design, easy-to-read display and durable construction for living rooms and bedrooms."
  }
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