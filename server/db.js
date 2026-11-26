const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'trendmart_db.json');

// Default Seed Data
const DEFAULT_SEED = {
  categories: [
    { id: 'cat-1', name: 'Electronics', slug: 'electronics', icon: '⚡', description: 'Gadgets, smartphones, audio, and smart gear' },
    { id: 'cat-2', name: 'Fashion & Apparel', slug: 'fashion', icon: '👔', description: 'Clothing, footwear, watches, and accessories' },
    { id: 'cat-3', name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏡', description: 'Cookware, appliances, decor, and furniture' },
    { id: 'cat-4', name: 'Beauty & Wellness', slug: 'beauty', icon: '✨', description: 'Skincare, haircare, and personal grooming' },
    { id: 'cat-5', name: 'Sports & Outdoors', slug: 'sports', icon: '⚽', description: 'Fitness gear, yoga, athletic apparel, and outdoor' }
  ],
  sellers: [
    {
      id: 'seller-1',
      storeName: 'AeroTech Electronics',
      ownerName: 'Vikram Malhotra',
      email: 'vikram@aerotech.com',
      password: 'password123',
      phone: '+91 98765 43210',
      address: 'Indiranagar, Bengaluru, Karnataka 560038',
      rating: 4.8,
      totalSales: 450000,
      status: 'active',
      joinedAt: '2026-01-15'
    },
    {
      id: 'seller-2',
      storeName: 'Urban Chic Apparels',
      ownerName: 'Pooja Singhania',
      email: 'pooja@urbanchic.in',
      password: 'password123',
      phone: '+91 98112 34567',
      address: 'Bandra West, Mumbai, Maharashtra 400050',
      rating: 4.6,
      totalSales: 320000,
      status: 'active',
      joinedAt: '2026-02-10'
    },
    {
      id: 'seller-3',
      storeName: 'Heritage Home & Living',
      ownerName: 'Rameshwar Sharma',
      email: 'rameshwar@heritagehome.in',
      password: 'password123',
      phone: '+91 98290 12345',
      address: 'MI Road, Jaipur, Rajasthan 302001',
      rating: 4.9,
      totalSales: 280000,
      status: 'active',
      joinedAt: '2026-03-01'
    }
  ],
  customers: [
    {
      id: 'cust-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      password: 'password123',
      phone: '+91 98765 11223',
      address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
      ordersCount: 4,
      totalSpent: 12496,
      registeredAt: '2026-01-20'
    },
    {
      id: 'cust-2',
      name: 'Diya Patel',
      email: 'diya.patel@example.com',
      password: 'password123',
      phone: '+91 98234 55667',
      address: 'B-12, Shanti Kunj, Satellite Road, Ahmedabad 380015',
      ordersCount: 2,
      totalSpent: 4398,
      registeredAt: '2026-02-05'
    },
    {
      id: 'cust-3',
      name: 'Rohan Verma',
      email: 'rohan.verma@example.com',
      password: 'password123',
      phone: '+91 97112 33445',
      address: 'Sector 62, Noida, Uttar Pradesh 201309',
      ordersCount: 1,
      totalSpent: 4999,
      registeredAt: '2026-02-18'
    }
  ],
  products: [
    // --- ELECTRONICS ---
    {
      id: 'prod-1',
      title: 'Noise-Cancelling Wireless Headphones Pro',
      description: 'Active hybrid noise cancellation with 40-hour playtime, high-res audio drivers, and comfortable memory foam ear cushions.',
      price: 4999,
      originalPrice: 8999,
      category: 'Electronics',
      categoryId: 'cat-1',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 45,
      rating: 4.8,
      reviewsCount: 142,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-10T10:00:00Z'
    },
    {
      id: 'prod-2',
      title: 'Smart Fitness Tracker Watch AMOLED',
      description: 'Track heart rate, SpO2, sleep quality, and 120 sports modes with 1.43-inch vibrant Always-On AMOLED touch display.',
      price: 2499,
      originalPrice: 4999,
      category: 'Electronics',
      categoryId: 'cat-1',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 12,
      rating: 4.5,
      reviewsCount: 89,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-12T11:30:00Z'
    },
    {
      id: 'prod-3',
      title: 'Mechanical Gaming Keyboard RGB Backlit',
      description: 'Hot-swappable tactile switches, per-key RGB lighting effects, aircraft-grade aluminum top plate, and detachable braided USB-C cable.',
      price: 3499,
      originalPrice: 5999,
      category: 'Electronics',
      categoryId: 'cat-1',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 28,
      rating: 4.7,
      reviewsCount: 64,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-14T09:00:00Z'
    },
    {
      id: 'prod-4',
      title: '3-in-1 Fast Wireless Magnetic Charging Station',
      description: 'Simultaneously charge your phone, smartwatch, and wireless earbuds with 15W Qi-certified safety surge protection.',
      price: 1899,
      originalPrice: 3299,
      category: 'Electronics',
      categoryId: 'cat-1',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 5,
      rating: 4.6,
      reviewsCount: 38,
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-16T14:20:00Z'
    },
    {
      id: 'prod-5',
      title: 'Portable Waterproof Bluetooth Outdoor Speaker',
      description: '360-degree immersive punchy bass, IPX7 water resistance rating, dual pairing mode, and 18-hour continuous battery life.',
      price: 2199,
      originalPrice: 3999,
      category: 'Electronics',
      categoryId: 'cat-1',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 19,
      rating: 4.9,
      reviewsCount: 112,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-18T16:45:00Z'
    },

    // --- FASHION & APPAREL ---
    {
      id: 'prod-6',
      title: 'Tailored Slim-Fit Cotton Oxford Shirt',
      description: '100% breathable combed organic cotton. Features classic button-down collar and durable pearlized buttons.',
      price: 1299,
      originalPrice: 2299,
      category: 'Fashion & Apparel',
      categoryId: 'cat-2',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 60,
      rating: 4.6,
      reviewsCount: 78,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-11T12:00:00Z'
    },
    {
      id: 'prod-7',
      title: 'Vintage Washed Denim Trucker Jacket',
      description: 'Heavyweight premium ring-spun denim with antique brass buttons, twin chest pockets, and relaxed tailored silhouette.',
      price: 2799,
      originalPrice: 4499,
      category: 'Fashion & Apparel',
      categoryId: 'cat-2',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 22,
      rating: 4.7,
      reviewsCount: 53,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-13T15:10:00Z'
    },
    {
      id: 'prod-8',
      title: 'Minimalist Vegan Leather Crossbody Bag',
      description: 'Scratch-resistant vegan leather with gold-tone hardware, multiple interior dividers, and adjustable strap.',
      price: 1699,
      originalPrice: 2999,
      category: 'Fashion & Apparel',
      categoryId: 'cat-2',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 8,
      rating: 4.8,
      reviewsCount: 95,
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-15T11:40:00Z'
    },
    {
      id: 'prod-9',
      title: 'Classic Low-Top Canvas Sneakers White',
      description: 'Cushioned vulcanized rubber sole with reinforced toe cap and breathable canvas upper for all-day comfort.',
      price: 1499,
      originalPrice: 2499,
      category: 'Fashion & Apparel',
      categoryId: 'cat-2',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 35,
      rating: 4.5,
      reviewsCount: 67,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-17T13:20:00Z'
    },
    {
      id: 'prod-10',
      title: 'Polarized Aviator Sunglasses UV400',
      description: 'Ultralight stainless frame with shatterproof TAC polarized lenses, anti-glare coating, and protective hard case.',
      price: 899,
      originalPrice: 1799,
      category: 'Fashion & Apparel',
      categoryId: 'cat-2',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 40,
      rating: 4.4,
      reviewsCount: 42,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-19T08:30:00Z'
    },

    // --- HOME & KITCHEN ---
    {
      id: 'prod-11',
      title: 'Artisanal Ceramic Pour-Over Coffee Dripper Set',
      description: 'Handcrafted ceramic cone dripper with heat-resistant borosilicate glass carafe and bamboo coaster collar.',
      price: 1899,
      originalPrice: 2599,
      category: 'Home & Kitchen',
      categoryId: 'cat-3',
      sellerId: 'seller-3',
      sellerName: 'Heritage Home & Living',
      stock: 16,
      rating: 4.9,
      reviewsCount: 51,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-12T10:00:00Z'
    },
    {
      id: 'prod-12',
      title: 'Ergonomic Memory Foam Lumbar Support Cushion',
      description: 'High-density orthopedic memory foam engineered with 3D breathable mesh cover and dual adjustable back straps.',
      price: 999,
      originalPrice: 1799,
      category: 'Home & Kitchen',
      categoryId: 'cat-3',
      sellerId: 'seller-3',
      sellerName: 'Heritage Home & Living',
      stock: 4,
      rating: 4.4,
      reviewsCount: 38,
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-14T14:45:00Z'
    },
    {
      id: 'prod-13',
      title: 'Premium Damascus Pattern Chef Knife Set (3-Piece)',
      description: 'High-carbon Japanese stainless steel blades with ergonomic Pakkawood handles and magnetic display block.',
      price: 3299,
      originalPrice: 5999,
      category: 'Home & Kitchen',
      categoryId: 'cat-3',
      sellerId: 'seller-3',
      sellerName: 'Heritage Home & Living',
      stock: 14,
      rating: 4.9,
      reviewsCount: 88,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-16T17:15:00Z'
    },
    {
      id: 'prod-14',
      title: 'Ultrasonic Essential Oil Aromatherapy Diffuser',
      description: '500ml capacity tank with 7 ambient LED mood light modes, whisper-quiet operation, and auto shut-off safety.',
      price: 1199,
      originalPrice: 1999,
      category: 'Home & Kitchen',
      categoryId: 'cat-3',
      sellerId: 'seller-3',
      sellerName: 'Heritage Home & Living',
      stock: 25,
      rating: 4.7,
      reviewsCount: 76,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-18T11:00:00Z'
    },

    // --- BEAUTY & WELLNESS ---
    {
      id: 'prod-15',
      title: 'Botanical Vitamin C Glow Face Serum (30ml)',
      description: 'Pure 15% Ethyl Ascorbic acid enriched with hyaluronic acid, ferulic acid, and aloe extract for vibrant radiant skin.',
      price: 799,
      originalPrice: 1299,
      category: 'Beauty & Wellness',
      categoryId: 'cat-4',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 50,
      rating: 4.8,
      reviewsCount: 130,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-13T09:30:00Z'
    },
    {
      id: 'prod-16',
      title: 'Cold-Pressed Moroccan Argan Hair Treatment Oil',
      description: '100% pure organic virgin argan oil. Repairs split ends, tames frizz, and restores silky lustrous shine.',
      price: 649,
      originalPrice: 1099,
      category: 'Beauty & Wellness',
      categoryId: 'cat-4',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 32,
      rating: 4.7,
      reviewsCount: 92,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1608248597359-548d1e2e17ea?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-15T15:20:00Z'
    },
    {
      id: 'prod-17',
      title: 'Detoxifying Activated Bamboo Charcoal Face Scrub',
      description: 'Gentle exfoliating micro-beads infuse walnut shell and tea tree oil to unclog pores and remove excess oil.',
      price: 499,
      originalPrice: 899,
      category: 'Beauty & Wellness',
      categoryId: 'cat-4',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 3,
      rating: 4.5,
      reviewsCount: 45,
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-17T12:40:00Z'
    },

    // --- SPORTS & OUTDOORS ---
    {
      id: 'prod-18',
      title: 'Eco-Friendly High-Density Non-Slip Yoga Mat',
      description: '6mm dual-layer TPE alignment grid mat with carrying strap. Tear-resistant, waterproof, and non-toxic.',
      price: 1399,
      originalPrice: 2299,
      category: 'Sports & Outdoors',
      categoryId: 'cat-5',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 30,
      rating: 4.8,
      reviewsCount: 84,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-11T16:00:00Z'
    },
    {
      id: 'prod-19',
      title: 'Insulated Stainless Steel Sports Flask (750ml)',
      description: 'Double-wall vacuum insulation keeps liquids cold for 24 hours or hot for 12 hours. BPA-free leakproof chug cap.',
      price: 799,
      originalPrice: 1499,
      category: 'Sports & Outdoors',
      categoryId: 'cat-5',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 45,
      rating: 4.6,
      reviewsCount: 71,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-14T08:15:00Z'
    },
    {
      id: 'prod-20',
      title: 'Latex Resistance Loop Exercise Bands Set (5 Pack)',
      description: '5 resistance levels from Extra Light to Extra Heavy. Ideal for stretching, physical therapy, glutes, and home workouts.',
      price: 599,
      originalPrice: 1199,
      category: 'Sports & Outdoors',
      categoryId: 'cat-5',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 50,
      rating: 4.7,
      reviewsCount: 118,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-16T10:30:00Z'
    }
  ],
  orders: [
    {
      id: 'ORD-1001',
      orderNumber: 'TM-2026-1001',
      customerId: 'cust-1',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav.sharma@example.com',
      customerPhone: '+91 98765 11223',
      shippingAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
      items: [
        {
          productId: 'prod-1',
          sellerId: 'seller-1',
          title: 'Noise-Cancelling Wireless Headphones Pro',
          quantity: 1,
          price: 4999
        }
      ],
      totalAmount: 4999,
      paymentMethod: 'UPI / QR',
      paymentStatus: 'Paid',
      status: 'Delivered',
      orderDate: '2026-03-25T14:32:00Z',
      trackingHistory: [
        { status: 'Order Placed', timestamp: '2026-03-25T14:32:00Z', note: 'Order confirmed' },
        { status: 'Processing', timestamp: '2026-03-25T16:00:00Z', note: 'Packed by seller AeroTech Electronics' },
        { status: 'Shipped', timestamp: '2026-03-26T09:30:00Z', note: 'Dispatched via BlueDart Express' },
        { status: 'Delivered', timestamp: '2026-03-27T15:20:00Z', note: 'Delivered to customer' }
      ]
    },
    {
      id: 'ORD-1002',
      orderNumber: 'TM-2026-1002',
      customerId: 'cust-2',
      customerName: 'Diya Patel',
      customerEmail: 'diya.patel@example.com',
      customerPhone: '+91 98234 55667',
      shippingAddress: 'B-12, Shanti Kunj, Satellite Road, Ahmedabad 380015',
      items: [
        {
          productId: 'prod-6',
          sellerId: 'seller-2',
          title: 'Tailored Slim-Fit Cotton Oxford Shirt',
          quantity: 2,
          price: 1299
        }
      ],
      totalAmount: 2598,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      status: 'Processing',
      orderDate: '2026-03-28T10:15:00Z',
      trackingHistory: [
        { status: 'Order Placed', timestamp: '2026-03-28T10:15:00Z', note: 'Order confirmed' },
        { status: 'Processing', timestamp: '2026-03-28T11:00:00Z', note: 'Awaiting seller dispatch' }
      ]
    }
  ],
  banners: [
    {
      id: 'ban-1',
      title: 'Summer Mega Fest 2026',
      subtitle: 'Up to 60% OFF on Top Tech, Fashion & Kitchen Gear',
      linkText: 'Shop the Sale',
      category: 'Electronics',
      active: true,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 'ban-2',
      title: 'Smart Living, Smarter Prices',
      subtitle: 'Trending home decor & kitchen essentials curated for you',
      linkText: 'Explore Home',
      category: 'Home & Kitchen',
      active: true,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80'
    }
  ]
};

// Database Initialization & Persistence Helper
class TrendMartDB {
  constructor() {
    this.ensureDataFile();
  }

  ensureDataFile() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    // Always initialize or merge with rich default seed
    if (!fs.existsSync(DB_FILE)) {
      this.saveData(DEFAULT_SEED);
    } else {
      try {
        const existing = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        if (!existing.products || existing.products.length < 15) {
          existing.products = DEFAULT_SEED.products;
          existing.sellers = DEFAULT_SEED.sellers;
          existing.customers = DEFAULT_SEED.customers;
          this.saveData(existing);
        }
      } catch (e) {
        this.saveData(DEFAULT_SEED);
      }
    }
  }

  loadData() {
    try {
      this.ensureDataFile();
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('[TrendMartDB] Error loading database file:', err);
      return DEFAULT_SEED;
    }
  }

  saveData(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('[TrendMartDB] Error saving database file:', err);
      return false;
    }
  }

  // --- Authentication Methods ---
  customerLogin(email, password) {
    const customers = this.loadData().customers || [];
    const cust = customers.find(c => c.email.toLowerCase() === (email || '').toLowerCase().trim());
    if (!cust) return { error: 'Invalid email or password' };
    if (cust.password && cust.password !== password) return { error: 'Invalid email or password' };
    const { password: _, ...safeUser } = cust;
    return { success: true, user: safeUser, role: 'customer' };
  }

  customerRegister(data) {
    const dbData = this.loadData();
    const existing = (dbData.customers || []).find(c => c.email.toLowerCase() === (data.email || '').toLowerCase().trim());
    if (existing) return { error: 'An account with this email already exists' };

    const newCustomer = {
      id: 'cust-' + Date.now(),
      name: data.name || 'TrendMart Customer',
      email: data.email.toLowerCase().trim(),
      password: data.password || 'password123',
      phone: data.phone || '',
      address: data.address || '',
      ordersCount: 0,
      totalSpent: 0,
      registeredAt: new Date().toISOString()
    };
    dbData.customers = [...(dbData.customers || []), newCustomer];
    this.saveData(dbData);
    const { password: _, ...safeUser } = newCustomer;
    return { success: true, user: safeUser, role: 'customer' };
  }

  sellerLogin(email, password) {
    const sellers = this.loadData().sellers || [];
    const seller = sellers.find(s => s.email.toLowerCase() === (email || '').toLowerCase().trim());
    if (!seller) return { error: 'Invalid seller credentials' };
    if (seller.password && seller.password !== password) return { error: 'Invalid seller credentials' };
    const { password: _, ...safeSeller } = seller;
    return { success: true, seller: safeSeller, role: 'seller' };
  }

  sellerRegister(data) {
    const dbData = this.loadData();
    const existing = (dbData.sellers || []).find(s => s.email.toLowerCase() === (data.email || '').toLowerCase().trim());
    if (existing) return { error: 'A seller store with this email already exists' };

    const newSeller = {
      id: 'seller-' + Date.now(),
      storeName: data.storeName || 'New Seller Store',
      ownerName: data.ownerName || data.storeName,
      email: data.email.toLowerCase().trim(),
      password: data.password || 'password123',
      phone: data.phone || '',
      address: data.address || '',
      rating: 5.0,
      totalSales: 0,
      status: 'active',
      joinedAt: new Date().toISOString()
    };
    dbData.sellers = [...(dbData.sellers || []), newSeller];
    this.saveData(dbData);
    const { password: _, ...safeSeller } = newSeller;
    return { success: true, seller: safeSeller, role: 'seller' };
  }

  // --- Products CRUD ---
  getProducts(query = {}) {
    let list = this.loadData().products || [];
    if (query.category) {
      list = list.filter(p => p.category.toLowerCase() === query.category.toLowerCase() || p.categoryId === query.category);
    }
    if (query.sellerId) {
      list = list.filter(p => p.sellerId === query.sellerId);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return list;
  }

  getProductById(id) {
    const list = this.loadData().products || [];
    return list.find(p => p.id === id) || null;
  }

  createProduct(item) {
    const data = this.loadData();
    const newProduct = {
      id: 'prod-' + Date.now(),
      title: item.title || 'Untitled Product',
      description: item.description || '',
      price: Number(item.price) || 0,
      originalPrice: Number(item.originalPrice) || Number(item.price) || 0,
      category: item.category || 'Electronics',
      categoryId: item.categoryId || 'cat-1',
      sellerId: item.sellerId || 'seller-1',
      sellerName: item.sellerName || 'Direct Seller',
      stock: Number(item.stock) || 0,
      rating: 5.0,
      reviewsCount: 0,
      status: Number(item.stock) > 10 ? 'In Stock' : (Number(item.stock) > 0 ? 'Low Stock' : 'Out of Stock'),
      image: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      createdAt: new Date().toISOString()
    };
    data.products = [newProduct, ...(data.products || [])];
    this.saveData(data);
    return newProduct;
  }

  updateProduct(id, updates) {
    const data = this.loadData();
    const idx = (data.products || []).findIndex(p => p.id === id);
    if (idx === -1) return null;
    const existing = data.products[idx];
    const stock = updates.stock !== undefined ? Number(updates.stock) : existing.stock;
    const updated = {
      ...existing,
      ...updates,
      stock,
      status: stock > 10 ? 'In Stock' : (stock > 0 ? 'Low Stock' : 'Out of Stock')
    };
    data.products[idx] = updated;
    this.saveData(data);
    return updated;
  }

  deleteProduct(id) {
    const data = this.loadData();
    const initialLen = (data.products || []).length;
    data.products = (data.products || []).filter(p => p.id !== id);
    this.saveData(data);
    return data.products.length < initialLen;
  }

  // --- Categories CRUD ---
  getCategories() {
    return this.loadData().categories || [];
  }

  // --- Orders CRUD ---
  getOrders(query = {}) {
    let list = this.loadData().orders || [];
    if (query.customerId) {
      list = list.filter(o => o.customerId === query.customerId);
    }
    if (query.customerEmail) {
      list = list.filter(o => (o.customerEmail || '').toLowerCase() === query.customerEmail.toLowerCase());
    }
    if (query.sellerId) {
      list = list.filter(o => (o.items || []).some(item => item.sellerId === query.sellerId));
    }
    if (query.status) {
      list = list.filter(o => o.status.toLowerCase() === query.status.toLowerCase());
    }
    return list;
  }

  getOrderById(id) {
    const list = this.loadData().orders || [];
    return list.find(o => o.id === id || o.orderNumber === id) || null;
  }

  createOrder(orderData) {
    const data = this.loadData();
    const orderId = 'ORD-' + (Math.floor(1000 + Math.random() * 9000));
    const orderNumber = 'TM-' + new Date().getFullYear() + '-' + (Math.floor(10000 + Math.random() * 90000));

    // Decrement stock for purchased products
    if (Array.isArray(orderData.items)) {
      orderData.items.forEach(item => {
        const prod = (data.products || []).find(p => p.id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
          prod.status = prod.stock > 10 ? 'In Stock' : (prod.stock > 0 ? 'Low Stock' : 'Out of Stock');
        }
      });
    }

    const newOrder = {
      id: orderId,
      orderNumber,
      customerId: orderData.customerId || 'cust-' + Date.now(),
      customerName: orderData.customerName || 'Customer',
      customerEmail: orderData.customerEmail || 'customer@example.com',
      customerPhone: orderData.customerPhone || '',
      shippingAddress: orderData.shippingAddress || '',
      items: orderData.items || [],
      totalAmount: Number(orderData.totalAmount) || 0,
      paymentMethod: orderData.paymentMethod || 'Online Payment',
      paymentStatus: orderData.paymentStatus || 'Paid',
      status: 'Processing',
      orderDate: new Date().toISOString(),
      trackingHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: 'Order confirmed successfully on TrendMart'
        },
        {
          status: 'Processing',
          timestamp: new Date().toISOString(),
          note: 'Seller notified for dispatch packaging'
        }
      ]
    };

    // Update customer total spend & orders count
    let cust = (data.customers || []).find(c => c.id === newOrder.customerId || c.email.toLowerCase() === newOrder.customerEmail.toLowerCase());
    if (cust) {
      cust.ordersCount = (cust.ordersCount || 0) + 1;
      cust.totalSpent = (cust.totalSpent || 0) + newOrder.totalAmount;
    } else {
      cust = {
        id: newOrder.customerId,
        name: newOrder.customerName,
        email: newOrder.customerEmail,
        phone: newOrder.customerPhone,
        address: newOrder.shippingAddress,
        ordersCount: 1,
        totalSpent: newOrder.totalAmount,
        registeredAt: new Date().toISOString()
      };
      data.customers = [...(data.customers || []), cust];
    }

    data.orders = [newOrder, ...(data.orders || [])];
    this.saveData(data);
    return newOrder;
  }

  updateOrderStatus(id, newStatus, note = '') {
    const data = this.loadData();
    const order = (data.orders || []).find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = newStatus;
    if (!order.trackingHistory) order.trackingHistory = [];
    order.trackingHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to \${newStatus}`
    });
    this.saveData(data);
    return order;
  }

  deleteOrder(id) {
    const data = this.loadData();
    const initialLen = (data.orders || []).length;
    data.orders = (data.orders || []).filter(o => o.id !== id && o.orderNumber !== id);
    if (data.orders.length < initialLen) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // --- Customers CRUD ---
  getCustomers() {
    return (this.loadData().customers || []).map(({ password, ...c }) => c);
  }

  // --- Sellers CRUD ---
  getSellers() {
    return (this.loadData().sellers || []).map(({ password, ...s }) => s);
  }

  getSellerById(id) {
    const s = (this.loadData().sellers || []).find(s => s.id === id);
    if (!s) return null;
    const { password, ...safe } = s;
    return safe;
  }

  // --- Banners ---
  getBanners() {
    return this.loadData().banners || [];
  }

  saveBanners(bannersList) {
    const data = this.loadData();
    const incoming = Array.isArray(bannersList) ? bannersList : [];

    // Enforce single active banner rule across backend & storefront
    let activeAssigned = false;
    const normalized = incoming.map((item) => {
      const wantsActive = Boolean(item.active) && !activeAssigned;
      if (wantsActive) activeAssigned = true;
      return {
        ...item,
        linkText: item.linkText || 'Shop the Sale',
        category: item.category || 'Electronics',
        active: wantsActive,
      };
    });

    data.banners = normalized;
    this.saveData(data);
    return normalized;
  }

  // --- KPI Aggregates ---
  getStats() {
    const data = this.loadData();
    const products = data.products || [];
    const orders = data.orders || [];
    const customers = data.customers || [];
    const categories = data.categories || [];
    const sellers = data.sellers || [];

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const lowStockCount = products.filter(p => p.stock <= 10).length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalCategories: categories.length,
      totalSellers: sellers.length,
      totalRevenue,
      lowStockCount
    };
  }

  // Reset to seed
  resetData() {
    this.saveData(DEFAULT_SEED);
    return DEFAULT_SEED;
  }
}

module.exports = new TrendMartDB();