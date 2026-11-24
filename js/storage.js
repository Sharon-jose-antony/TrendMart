// Unified Storage Layer for TrendMart Admin Panel & Ecosystem
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
        { id: 1, name: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60", icon: "⚡" },
        { id: 2, name: "Fashion & Apparel", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&auto=format&fit=crop&q=60", icon: "👔" },
        { id: 3, name: "Home & Kitchen", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200&auto=format&fit=crop&q=60", icon: "🏡" },
        { id: 4, name: "Beauty & Wellness", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=60", icon: "✨" },
        { id: 5, name: "Sports & Outdoors", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&auto=format&fit=crop&q=60", icon: "⚽" }
      ],
      tm_products: [
        // --- Electronics ---
        {
          id: 1,
          name: "Noise-Cancelling Wireless Headphones Pro",
          title: "Noise-Cancelling Wireless Headphones Pro",
          category: "Electronics",
          price: 4999,
          originalPrice: 8999,
          stock: 45,
          rating: 4.8,
          sellerName: "AeroTech Electronics",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
          description: "Active hybrid noise cancellation with 40-hour playtime, high-res audio drivers, and memory foam ear cushions."
        },
        {
          id: 2,
          name: "Smart Fitness Tracker Watch AMOLED",
          title: "Smart Fitness Tracker Watch AMOLED",
          category: "Electronics",
          price: 2499,
          originalPrice: 4999,
          stock: 12,
          rating: 4.5,
          sellerName: "AeroTech Electronics",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
          description: "Track heart rate, SpO2, sleep quality, and 120 sports modes with 1.43-inch Always-On AMOLED touch display."
        },
        {
          id: 3,
          name: "Mechanical Gaming Keyboard RGB Backlit",
          title: "Mechanical Gaming Keyboard RGB Backlit",
          category: "Electronics",
          price: 3499,
          originalPrice: 5999,
          stock: 28,
          rating: 4.7,
          sellerName: "AeroTech Electronics",
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
          description: "Hot-swappable tactile switches, per-key RGB lighting, and aircraft-grade aluminum top plate."
        },
        {
          id: 4,
          name: "3-in-1 Fast Wireless Magnetic Charging Station",
          title: "3-in-1 Fast Wireless Magnetic Charging Station",
          category: "Electronics",
          price: 1899,
          originalPrice: 3299,
          stock: 5,
          rating: 4.6,
          sellerName: "AeroTech Electronics",
          image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=500&auto=format&fit=crop&q=60",
          description: "Simultaneously charge phone, smartwatch, and wireless earbuds with 15W Qi-certified safety surge protection."
        },
        {
          id: 5,
          name: "Portable Waterproof Bluetooth Outdoor Speaker",
          title: "Portable Waterproof Bluetooth Outdoor Speaker",
          category: "Electronics",
          price: 2199,
          originalPrice: 3999,
          stock: 19,
          rating: 4.9,
          sellerName: "AeroTech Electronics",
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60",
          description: "360-degree immersive punchy bass, IPX7 water resistance rating, dual pairing mode, and 18-hour battery life."
        },

        // --- Fashion & Apparel ---
        {
          id: 6,
          name: "Tailored Slim-Fit Cotton Oxford Shirt",
          title: "Tailored Slim-Fit Cotton Oxford Shirt",
          category: "Fashion & Apparel",
          price: 1299,
          originalPrice: 2299,
          stock: 60,
          rating: 4.6,
          sellerName: "Urban Chic Apparels",
          image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60",
          description: "100% breathable combed organic cotton. Classic button-down collar and durable pearlized buttons."
        },
        {
          id: 7,
          name: "Vintage Washed Denim Trucker Jacket",
          title: "Vintage Washed Denim Trucker Jacket",
          category: "Fashion & Apparel",
          price: 2799,
          originalPrice: 4499,
          stock: 22,
          rating: 4.7,
          sellerName: "Urban Chic Apparels",
          image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60",
          description: "Heavyweight premium ring-spun denim with antique brass buttons, twin chest pockets, and relaxed tailored silhouette."
        },
        {
          id: 8,
          name: "Minimalist Vegan Leather Crossbody Bag",
          title: "Minimalist Vegan Leather Crossbody Bag",
          category: "Fashion & Apparel",
          price: 1699,
          originalPrice: 2999,
          stock: 8,
          rating: 4.8,
          sellerName: "Urban Chic Apparels",
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60",
          description: "Scratch-resistant vegan leather with gold-tone hardware, multiple interior dividers, and adjustable strap."
        },
        {
          id: 9,
          name: "Classic Low-Top Canvas Sneakers White",
          title: "Classic Low-Top Canvas Sneakers White",
          category: "Fashion & Apparel",
          price: 1499,
          originalPrice: 2499,
          stock: 35,
          rating: 4.5,
          sellerName: "Urban Chic Apparels",
          image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60",
          description: "Cushioned vulcanized rubber sole with reinforced toe cap and breathable canvas upper for all-day comfort."
        },
        {
          id: 10,
          name: "Polarized Aviator Sunglasses UV400",
          title: "Polarized Aviator Sunglasses UV400",
          category: "Fashion & Apparel",
          price: 899,
          originalPrice: 1799,
          stock: 40,
          rating: 4.4,
          sellerName: "Urban Chic Apparels",
          image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60",
          description: "Ultralight stainless frame with shatterproof TAC polarized lenses, anti-glare coating, and hard case."
        },

        // --- Home & Kitchen ---
        {
          id: 11,
          name: "Artisanal Ceramic Pour-Over Coffee Dripper Set",
          title: "Artisanal Ceramic Pour-Over Coffee Dripper Set",
          category: "Home & Kitchen",
          price: 1899,
          originalPrice: 2599,
          stock: 16,
          rating: 4.9,
          sellerName: "Heritage Home & Living",
          image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=60",
          description: "Handcrafted ceramic cone dripper with heat-resistant borosilicate glass carafe and bamboo coaster collar."
        },
        {
          id: 12,
          name: "Ergonomic Memory Foam Lumbar Support Cushion",
          title: "Ergonomic Memory Foam Lumbar Support Cushion",
          category: "Home & Kitchen",
          price: 999,
          originalPrice: 1799,
          stock: 4,
          rating: 4.4,
          sellerName: "Heritage Home & Living",
          image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop&q=60",
          description: "High-density orthopedic memory foam engineered with 3D breathable mesh cover and dual adjustable straps."
        },
        {
          id: 13,
          name: "Premium Damascus Pattern Chef Knife Set (3-Piece)",
          title: "Premium Damascus Pattern Chef Knife Set (3-Piece)",
          category: "Home & Kitchen",
          price: 3299,
          originalPrice: 5999,
          stock: 14,
          rating: 4.9,
          sellerName: "Heritage Home & Living",
          image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60",
          description: "High-carbon Japanese stainless steel blades with ergonomic Pakkawood handles and magnetic display block."
        },
        {
          id: 14,
          name: "Ultrasonic Essential Oil Aromatherapy Diffuser",
          title: "Ultrasonic Essential Oil Aromatherapy Diffuser",
          category: "Home & Kitchen",
          price: 1199,
          originalPrice: 1999,
          stock: 25,
          rating: 4.7,
          sellerName: "Heritage Home & Living",
          image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60",
          description: "500ml capacity tank with 7 ambient LED mood light modes, whisper-quiet operation, and auto shut-off safety."
        },

        // --- Beauty & Wellness ---
        {
          id: 15,
          name: "Botanical Vitamin C Glow Face Serum (30ml)",
          title: "Botanical Vitamin C Glow Face Serum (30ml)",
          category: "Beauty & Wellness",
          price: 799,
          originalPrice: 1299,
          stock: 50,
          rating: 4.8,
          sellerName: "Urban Chic Apparels",
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60",
          description: "Pure 15% Ethyl Ascorbic acid enriched with hyaluronic acid, ferulic acid, and aloe extract for radiant skin."
        },
        {
          id: 16,
          name: "Cold-Pressed Moroccan Argan Hair Treatment Oil",
          title: "Cold-Pressed Moroccan Argan Hair Treatment Oil",
          category: "Beauty & Wellness",
          price: 649,
          originalPrice: 1099,
          stock: 32,
          rating: 4.7,
          sellerName: "Urban Chic Apparels",
          image: "https://images.unsplash.com/photo-1608248597359-548d1e2e17ea?w=500&auto=format&fit=crop&q=60",
          description: "100% pure organic virgin argan oil. Repairs split ends, tames frizz, and restores silky lustrous shine."
        },
        {
          id: 17,
          name: "Detoxifying Activated Bamboo Charcoal Face Scrub",
          title: "Detoxifying Activated Bamboo Charcoal Face Scrub",
          category: "Beauty & Wellness",
          price: 499,
          originalPrice: 899,
          stock: 3,
          rating: 4.5,
          sellerName: "Urban Chic Apparels",
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
          description: "Gentle exfoliating micro-beads infuse walnut shell and tea tree oil to unclog pores and remove excess oil."
        },

        // --- Sports & Outdoors ---
        {
          id: 18,
          name: "Eco-Friendly High-Density Non-Slip Yoga Mat",
          title: "Eco-Friendly High-Density Non-Slip Yoga Mat",
          category: "Sports & Outdoors",
          price: 1399,
          originalPrice: 2299,
          stock: 30,
          rating: 4.8,
          sellerName: "AeroTech Electronics",
          image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=60",
          description: "6mm dual-layer TPE alignment grid mat with carrying strap. Tear-resistant, waterproof, and non-toxic."
        },
        {
          id: 19,
          name: "Insulated Stainless Steel Sports Flask (750ml)",
          title: "Insulated Stainless Steel Sports Flask (750ml)",
          category: "Sports & Outdoors",
          price: 799,
          originalPrice: 1499,
          stock: 45,
          rating: 4.6,
          sellerName: "AeroTech Electronics",
          image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
          description: "Double-wall vacuum insulation keeps liquids cold for 24 hours or hot for 12 hours. BPA-free leakproof chug cap."
        },
        {
          id: 20,
          name: "Latex Resistance Loop Exercise Bands Set (5 Pack)",
          title: "Latex Resistance Loop Exercise Bands Set (5 Pack)",
          category: "Sports & Outdoors",
          price: 599,
          originalPrice: 1199,
          stock: 50,
          rating: 4.7,
          sellerName: "AeroTech Electronics",
          image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&auto=format&fit=crop&q=60",
          description: "5 resistance levels from Extra Light to Extra Heavy. Ideal for stretching, physical therapy, and workouts."
        }
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
        { id: "ORD-1001", customer: "Aarav Sharma", customerName: "Aarav Sharma", total: 4999, totalAmount: 4999, status: "Delivered", date: "2026-03-25" },
        { id: "ORD-1002", customer: "Diya Patel", customerName: "Diya Patel", total: 2598, totalAmount: 2598, status: "Processing", date: "2026-03-28" },
        { id: "ORD-1003", customer: "Rohan Verma", customerName: "Rohan Verma", total: 3499, totalAmount: 3499, status: "Shipped", date: "2026-03-29" },
        { id: "ORD-1004", customer: "Priya Nair", customerName: "Priya Nair", total: 1899, totalAmount: 1899, status: "Delivered", date: "2026-03-30" },
      ],
      tm_banners: [
        { id: 1, title: "Summer Mega Fest 2026", subtitle: "Up to 60% OFF on Top Tech, Fashion & Kitchen Gear", active: true },
        { id: 2, title: "Smart Living, Smarter Prices", subtitle: "Trending home decor & kitchen essentials", active: true }
      ]
    };

    // Initialize or auto-upgrade stored data
    Object.keys(seed).forEach((key) => {
      const existing = localStorage.getItem(key);
      if (!existing) {
        localStorage.setItem(key, JSON.stringify(seed[key]));
      } else if (key === "tm_products") {
        try {
          const list = JSON.parse(existing);
          if (!Array.isArray(list) || list.length < 15) {
            localStorage.setItem(key, JSON.stringify(seed.tm_products));
          }
        } catch (e) {
          localStorage.setItem(key, JSON.stringify(seed.tm_products));
        }
      } else if (key === "tm_categories") {
        try {
          const list = JSON.parse(existing);
          if (!Array.isArray(list) || list.length < 5) {
            localStorage.setItem(key, JSON.stringify(seed.tm_categories));
          }
        } catch (e) {
          localStorage.setItem(key, JSON.stringify(seed.tm_categories));
        }
      } else if (key === "tm_customers") {
        try {
          const list = JSON.parse(existing);
          if (Array.isArray(list) && list.length < 12) {
            const existingIds = new Set(list.map((c) => c.id));
            const merged = [...list];
            seed.tm_customers.forEach((c) => {
              if (!existingIds.has(c.id)) merged.push(c);
            });
            localStorage.setItem(key, JSON.stringify(merged));
          }
        } catch (e) {
          localStorage.setItem(key, JSON.stringify(seed.tm_customers));
        }
      } else if (key === "tm_orders") {
        try {
          const list = JSON.parse(existing);
          if (!Array.isArray(list) || list.length < 3) {
            localStorage.setItem(key, JSON.stringify(seed.tm_orders));
          }
        } catch (e) {
          localStorage.setItem(key, JSON.stringify(seed.tm_orders));
        }
      }
    });

    // Live background sync from central DB
    const apiBase = (typeof window !== 'undefined' && window.location && window.location.port === '5000') 
      ? '/api' 
      : 'http://localhost:5000/api';

    if (typeof fetch === 'function') {
      // Sync products
      fetch(`${apiBase}/products`)
        .then(r => r.json())
        .then(apiProducts => {
          if (Array.isArray(apiProducts) && apiProducts.length >= 15) {
            const normalized = apiProducts.map(p => ({
              ...p,
              name: p.title || p.name,
              title: p.title || p.name
            }));
            localStorage.setItem("tm_products", JSON.stringify(normalized));
          }
        })
        .catch(() => {});

      // Sync orders
      fetch(`${apiBase}/orders`)
        .then(r => r.json())
        .then(apiOrders => {
          if (Array.isArray(apiOrders) && apiOrders.length > 0) {
            const normalized = apiOrders.map(o => ({
              ...o,
              customer: o.customerName || o.customer || 'Customer',
              total: Number(o.totalAmount || o.total || 0)
            }));
            localStorage.setItem("tm_orders", JSON.stringify(normalized));
          }
        })
        .catch(() => {});

      // Sync customers
      fetch(`${apiBase}/customers`)
        .then(r => r.json())
        .then(apiCustomers => {
          if (Array.isArray(apiCustomers) && apiCustomers.length > 0) {
            localStorage.setItem("tm_customers", JSON.stringify(apiCustomers));
          }
        })
        .catch(() => {});
    }
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
