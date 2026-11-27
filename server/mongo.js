const mongoose = require('mongoose');
const { Category, Seller, Customer, Product, Order, Banner } = require('./models');

function stripMeta(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  delete obj._id;
  delete obj.__v;
  return obj;
}

function stripPassword(doc) {
  const obj = stripMeta(doc);
  if (!obj) return null;
  const { password: _, ...safe } = obj;
  return safe;
}

function computeStockStatus(stock) {
  const qty = Number(stock) || 0;
  return qty > 10 ? 'In Stock' : (qty > 0 ? 'Low Stock' : 'Out of Stock');
}

class MongoDBStore {
  async connect(uri) {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async seedIfEmpty(seedData) {
    const [catCount, prodCount, sellerCount] = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments(),
      Seller.countDocuments()
    ]);

    if (catCount === 0 && prodCount === 0 && sellerCount === 0) {
      await this.resetData(seedData);
      return true;
    }
    return false;
  }

  // --- Authentication Methods ---
  async customerLogin(email, password) {
    const normalized = (email || '').toLowerCase().trim();
    const cust = await Customer.findOne({ email: normalized });
    if (!cust) return { error: 'Invalid email or password' };
    if (cust.password && cust.password !== password) return { error: 'Invalid email or password' };
    return { success: true, user: stripPassword(cust), role: 'customer' };
  }

  async customerRegister(data) {
    const normalized = (data.email || '').toLowerCase().trim();
    const existing = await Customer.findOne({ email: normalized });
    if (existing) return { error: 'An account with this email already exists' };

    const newCustomer = await Customer.create({
      id: 'cust-' + Date.now(),
      name: data.name || 'TrendMart Customer',
      email: normalized,
      password: data.password || 'password123',
      phone: data.phone || '',
      address: data.address || '',
      ordersCount: 0,
      totalSpent: 0,
      registeredAt: new Date().toISOString()
    });

    return { success: true, user: stripPassword(newCustomer), role: 'customer' };
  }

  async sellerLogin(email, password) {
    const normalized = (email || '').toLowerCase().trim();
    const seller = await Seller.findOne({ email: normalized });
    if (!seller) return { error: 'Invalid seller credentials' };
    if (seller.password && seller.password !== password) return { error: 'Invalid seller credentials' };
    return { success: true, seller: stripPassword(seller), role: 'seller' };
  }

  async sellerRegister(data) {
    const normalized = (data.email || '').toLowerCase().trim();
    const existing = await Seller.findOne({ email: normalized });
    if (existing) return { error: 'A seller store with this email already exists' };

    const newSeller = await Seller.create({
      id: 'seller-' + Date.now(),
      storeName: data.storeName || 'New Seller Store',
      ownerName: data.ownerName || data.storeName || 'Store Owner',
      email: normalized,
      password: data.password || 'password123',
      phone: data.phone || '',
      address: data.address || '',
      rating: 5.0,
      totalSales: 0,
      status: 'active',
      joinedAt: new Date().toISOString()
    });

    return { success: true, seller: stripPassword(newSeller), role: 'seller' };
  }

  // --- Products CRUD ---
  async getProducts(query = {}) {
    const filter = {};
    if (query.sellerId) {
      filter.sellerId = query.sellerId;
    }
    let list = await Product.find(filter).sort({ createdAt: -1 }).lean();
    list = list.map(stripMeta);

    if (query.category) {
      const catQ = query.category.toLowerCase();
      list = list.filter(p => (p.category || '').toLowerCase() === catQ || p.categoryId === query.category);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getProductById(id) {
    const prod = await Product.findOne({ id }).lean();
    return stripMeta(prod);
  }

  async createProduct(item) {
    const stock = Number(item.stock) || 0;
    const created = await Product.create({
      id: 'prod-' + Date.now(),
      title: item.title || 'Untitled Product',
      description: item.description || '',
      price: Number(item.price) || 0,
      originalPrice: Number(item.originalPrice) || Number(item.price) || 0,
      category: item.category || 'Electronics',
      categoryId: item.categoryId || 'cat-1',
      sellerId: item.sellerId || 'seller-1',
      sellerName: item.sellerName || 'Direct Seller',
      stock,
      rating: 5.0,
      reviewsCount: 0,
      status: computeStockStatus(stock),
      image: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      createdAt: new Date().toISOString()
    });
    return stripMeta(created);
  }

  async updateProduct(id, updates) {
    const existing = await Product.findOne({ id }).lean();
    if (!existing) return null;

    const stock = updates.stock !== undefined ? Number(updates.stock) : existing.stock;
    const nextUpdates = {
      ...updates,
      stock,
      status: computeStockStatus(stock)
    };
    delete nextUpdates._id;
    delete nextUpdates.__v;

    const updated = await Product.findOneAndUpdate(
      { id },
      { $set: nextUpdates },
      { new: true }
    ).lean();
    return stripMeta(updated);
  }

  async deleteProduct(id) {
    const res = await Product.deleteOne({ id });
    return res.deletedCount > 0;
  }

  // --- Categories CRUD ---
  async getCategories() {
    const list = await Category.find({}).lean();
    return list.map(stripMeta);
  }

  async createCategory(item) {
    const name = item.name || 'New Category';
    const slug = item.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const created = await Category.create({
      id: item.id || ('cat-' + Date.now()),
      name,
      slug,
      icon: item.icon || '📦',
      description: item.description || ''
    });
    return stripMeta(created);
  }

  // --- Orders CRUD ---
  async getOrders(query = {}) {
    let list = await Order.find({}).sort({ orderDate: -1 }).lean();
    list = list.map(stripMeta);

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
      list = list.filter(o => (o.status || '').toLowerCase() === query.status.toLowerCase());
    }
    return list;
  }

  async getOrderById(id) {
    const order = await Order.findOne({ $or: [{ id }, { orderNumber: id }] }).lean();
    return stripMeta(order);
  }

  async createOrder(orderData) {
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const orderNumber = 'TM-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);

    // Decrement stock for purchased products
    if (Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const prod = await Product.findOne({ id: item.productId });
        if (prod) {
          prod.stock = Math.max(0, (prod.stock || 0) - (item.quantity || 1));
          prod.status = computeStockStatus(prod.stock);
          await prod.save();
        }
      }
    }

    const now = new Date().toISOString();
    const newOrder = await Order.create({
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
      orderDate: now,
      trackingHistory: [
        { status: 'Order Placed', timestamp: now, note: 'Order confirmed successfully on TrendMart' },
        { status: 'Processing', timestamp: now, note: 'Seller notified for dispatch packaging' }
      ]
    });

    const normalizedEmail = (newOrder.customerEmail || '').toLowerCase().trim();
    const existingCust = await Customer.findOne({
      $or: [{ id: newOrder.customerId }, { email: normalizedEmail }]
    });

    if (existingCust) {
      existingCust.ordersCount = (existingCust.ordersCount || 0) + 1;
      existingCust.totalSpent = (existingCust.totalSpent || 0) + newOrder.totalAmount;
      await existingCust.save();
    } else if (normalizedEmail) {
      await Customer.create({
        id: newOrder.customerId,
        name: newOrder.customerName,
        email: normalizedEmail,
        phone: newOrder.customerPhone,
        address: newOrder.shippingAddress,
        ordersCount: 1,
        totalSpent: newOrder.totalAmount,
        registeredAt: now
      });
    }

    return stripMeta(newOrder);
  }

  async updateOrderStatus(id, newStatus, note = '') {
    const order = await Order.findOne({ $or: [{ id }, { orderNumber: id }] });
    if (!order) return null;

    order.status = newStatus;
    if (!order.trackingHistory) order.trackingHistory = [];
    order.trackingHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`
    });
    await order.save();
    return stripMeta(order);
  }

  async deleteOrder(id) {
    const res = await Order.deleteOne({ $or: [{ id }, { orderNumber: id }] });
    return res.deletedCount > 0;
  }

  // --- Customers CRUD ---
  async getCustomers() {
    const list = await Customer.find({}).lean();
    return list.map(stripPassword);
  }

  // --- Sellers CRUD ---
  async getSellers() {
    const list = await Seller.find({}).lean();
    return list.map(stripPassword);
  }

  async getSellerById(id) {
    const s = await Seller.findOne({ id }).lean();
    return stripPassword(s);
  }

  // --- Banners ---
  async getBanners() {
    const list = await Banner.find({}).lean();
    return list.map(stripMeta);
  }

  async saveBanners(bannersList) {
    const incoming = Array.isArray(bannersList) ? bannersList : [];

    let activeAssigned = false;
    const normalized = incoming.map((item, idx) => {
      const wantsActive = Boolean(item.active) && !activeAssigned;
      if (wantsActive) activeAssigned = true;
      return {
        ...item,
        id: item.id || ('ban-' + Date.now() + '-' + idx),
        linkText: item.linkText || 'Shop the Sale',
        category: item.category || 'Electronics',
        active: wantsActive
      };
    });

    await Banner.deleteMany({});
    if (normalized.length > 0) {
      await Banner.insertMany(normalized);
    }
    return normalized;
  }

  // --- KPI Aggregates ---
  async getStats() {
    const [products, orders, totalCustomers, totalCategories, totalSellers] = await Promise.all([
      Product.find({}, 'stock').lean(),
      Order.find({}, 'totalAmount').lean(),
      Customer.countDocuments(),
      Category.countDocuments(),
      Seller.countDocuments()
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const lowStockCount = products.filter(p => (p.stock || 0) <= 10).length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCustomers,
      totalCategories,
      totalSellers,
      totalRevenue,
      lowStockCount
    };
  }

  // --- Reset / Seed ---
  async resetData(seedData) {
    await Promise.all([
      Category.deleteMany({}),
      Seller.deleteMany({}),
      Customer.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Banner.deleteMany({})
    ]);

    const tasks = [];
    if (seedData.categories?.length) tasks.push(Category.insertMany(seedData.categories));
    if (seedData.sellers?.length) tasks.push(Seller.insertMany(seedData.sellers));
    if (seedData.customers?.length) tasks.push(Customer.insertMany(seedData.customers));
    if (seedData.products?.length) tasks.push(Product.insertMany(seedData.products));
    if (seedData.orders?.length) tasks.push(Order.insertMany(seedData.orders));
    if (seedData.banners?.length) tasks.push(Banner.insertMany(seedData.banners));
    await Promise.all(tasks);

    return seedData;
  }
}

module.exports = MongoDBStore;
