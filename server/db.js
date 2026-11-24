const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'trendmart_db.json');

// Default Seed Data
const DEFAULT_SEED = {
  categories: [
    { id: 'cat-1', name: 'Electronics', slug: 'electronics', icon: '⚡', description: 'Gadgets, smartphones, and smart gear' },
    { id: 'cat-2', name: 'Fashion & Apparel', slug: 'fashion', icon: '👔', description: 'Clothing, footwear, and accessories' },
    { id: 'cat-3', name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏡', description: 'Decor, kitchenware, and furniture' },
    { id: 'cat-4', name: 'Beauty & Wellness', slug: 'beauty', icon: '✨', description: 'Skincare, haircare, and personal grooming' },
    { id: 'cat-5', name: 'Sports & Outdoors', slug: 'sports', icon: '⚽', description: 'Sporting goods and fitness gear' }
  ],
  sellers: [
    {
      id: 'seller-1',
      storeName: 'AeroTech Electronics',
      ownerName: 'Vikram Malhotra',
      email: 'vikram@aerotech.com',
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
      phone: '+91 98112 34567',
      address: 'Bandra West, Mumbai, Maharashtra 400050',
      rating: 4.6,
      totalSales: 320000,
      status: 'active',
      joinedAt: '2026-02-10'
    },
    {
      id: 'seller-3',
      storeName: 'Heritage Home Decor',
      ownerName: 'Rameshwar Sharma',
      email: 'rameshwar@heritagehome.in',
      phone: '+91 98290 12345',
      address: 'MI Road, Jaipur, Rajasthan 302001',
      rating: 4.9,
      totalSales: 280000,
      status: 'active',
      joinedAt: '2026-03-01'
    }
  ],
  products: [
    {
      id: 'prod-1',
      title: 'Noise-Cancelling Wireless Headphones Pro',
      description: 'Active noise cancellation with 40-hour battery life, high-res audio drivers, and comfortable memory foam ear cushions.',
      price: 4999,
      originalPrice: 8999,
      category: 'Electronics',
      categoryId: 'cat-1',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 45,
      rating: 4.7,
      reviewsCount: 128,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-10T10:00:00Z'
    },
    {
      id: 'prod-2',
      title: 'Smart Fitness Tracker Watch AMOLED',
      description: 'Track heart rate, SpO2, sleep stages, and over 100 sport modes with 1.4-inch vibrant AMOLED display.',
      price: 2499,
      originalPrice: 4999,
      category: 'Electronics',
      categoryId: 'cat-1',
      sellerId: 'seller-1',
      sellerName: 'AeroTech Electronics',
      stock: 6,
      rating: 4.5,
      reviewsCount: 84,
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-12T11:30:00Z'
    },
    {
      id: 'prod-3',
      title: 'Tailored Slim-Fit Cotton Oxford Shirt',
      description: 'Crafted from 100% breathable organic cotton. Classic button-down collar perfect for professional and casual styling.',
      price: 1299,
      originalPrice: 2299,
      category: 'Fashion & Apparel',
      categoryId: 'cat-2',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 80,
      rating: 4.6,
      reviewsCount: 65,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-15T09:15:00Z'
    },
    {
      id: 'prod-4',
      title: 'Minimalist Ceramic Pour-Over Coffee Maker',
      description: 'Artisanal ceramic dripper with wooden collar and heat-resistant glass carafe for the quintessential morning brew.',
      price: 1899,
      originalPrice: 2599,
      category: 'Home & Kitchen',
      categoryId: 'cat-3',
      sellerId: 'seller-3',
      sellerName: 'Heritage Home Decor',
      stock: 18,
      rating: 4.9,
      reviewsCount: 42,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-18T14:20:00Z'
    },
    {
      id: 'prod-5',
      title: 'Ergonomic Memory Foam Lumbar Cushion',
      description: 'Orthopedic posture support cushion engineered with high-density memory foam and breathable 3D mesh fabric.',
      price: 999,
      originalPrice: 1799,
      category: 'Home & Kitchen',
      categoryId: 'cat-3',
      sellerId: 'seller-3',
      sellerName: 'Heritage Home Decor',
      stock: 4,
      rating: 4.4,
      reviewsCount: 31,
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-20T16:45:00Z'
    },
    {
      id: 'prod-6',
      title: 'Botanical Vitamin C Brightening Serum (30ml)',
      description: 'Pure 15% Vitamin C blended with hyaluronic acid and ferulic acid for radiant skin texture and antioxidant protection.',
      price: 799,
      originalPrice: 1299,
      category: 'Beauty & Wellness',
      categoryId: 'cat-4',
      sellerId: 'seller-2',
      sellerName: 'Urban Chic Apparels',
      stock: 55,
      rating: 4.8,
      reviewsCount: 110,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
      createdAt: '2026-03-22T08:00:00Z'
    }
  ],
  customers: [
    {
      id: 'cust-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
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
      phone: '+91 97112 33445',
      address: 'Sector 62, Noida, Uttar Pradesh 201309',
      ordersCount: 1,
      totalSpent: 4999,
      registeredAt: '2026-02-18'
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
      paymentMethod: 'UPI / Card',
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
          productId: 'prod-3',
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
      subtitle: 'Up to 60% OFF on Top Electronics & Apparel',
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
    if (!fs.existsSync(DB_FILE)) {
      this.saveData(DEFAULT_SEED);
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
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
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
      category: item.category || 'General',
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

  createCategory(cat) {
    const data = this.loadData();
    const newCat = {
      id: 'cat-' + Date.now(),
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
      icon: cat.icon || '🏷️',
      description: cat.description || ''
    };
    data.categories = [...(data.categories || []), newCat];
    this.saveData(data);
    return newCat;
  }

  // --- Orders CRUD ---
  getOrders(query = {}) {
    let list = this.loadData().orders || [];
    if (query.customerId) {
      list = list.filter(o => o.customerId === query.customerId);
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
    let cust = (data.customers || []).find(c => c.id === newOrder.customerId || c.email === newOrder.customerEmail);
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
      note: note || `Status updated to ${newStatus}`
    });
    this.saveData(data);
    return order;
  }

  // --- Customers CRUD ---
  getCustomers() {
    return this.loadData().customers || [];
  }

  // --- Sellers CRUD ---
  getSellers() {
    return this.loadData().sellers || [];
  }

  getSellerById(id) {
    return (this.loadData().sellers || []).find(s => s.id === id) || null;
  }

  // --- Banners ---
  getBanners() {
    return this.loadData().banners || [];
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
