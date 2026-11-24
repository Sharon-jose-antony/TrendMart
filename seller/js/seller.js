// TrendMart Seller Hub React Application - Enterprise SaaS Edition
const { useState, useEffect, useMemo } = React;

function SellerHubApp() {
  const [currentView, setCurrentView] = useState('inventory');
  const [sellers, setSellers] = useState([]);
  const [currentSeller, setCurrentSeller] = useState(() => {
    return window.TrendMartAPI.getCurrentSeller() || {
      id: 'seller-1',
      storeName: 'AeroTech Electronics',
      ownerName: 'Vikram Malhotra',
      email: 'vikram@aerotech.com'
    };
  });
  const [activeSellerId, setActiveSellerId] = useState(() => {
    const s = window.TrendMartAPI.getCurrentSeller();
    return s ? s.id : 'seller-1';
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Seller Auth Modal State
  const [isSellerAuthOpen, setIsSellerAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState({
    storeName: '',
    ownerName: '',
    email: 'vikram@aerotech.com',
    password: 'password123',
    phone: '',
    address: ''
  });

  const handleSellerLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await window.TrendMartAPI.sellerLogin(authForm.email, authForm.password);
      if (res.error) {
        setAuthError(res.error);
      } else {
        setCurrentSeller(res.seller);
        setActiveSellerId(res.seller.id);
        setIsSellerAuthOpen(false);
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed');
    }
  };

  const handleSellerRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await window.TrendMartAPI.sellerRegister(authForm);
      if (res.error) {
        setAuthError(res.error);
      } else {
        setCurrentSeller(res.seller);
        setActiveSellerId(res.seller.id);
        setIsSellerAuthOpen(false);
        loadSellerData();
      }
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  const handleSellerLogout = () => {
    window.TrendMartAPI.setCurrentSeller(null);
    setCurrentSeller(null);
  };

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
  });

  // Load Initial Data
  const loadSellerData = async () => {
    try {
      setLoading(true);
      const [allSellers, allCats, allProds, allOrders] = await Promise.all([
        window.TrendMartAPI.getSellers(),
        window.TrendMartAPI.getCategories(),
        window.TrendMartAPI.getProducts(),
        window.TrendMartAPI.getOrders()
      ]);
      setSellers(allSellers || []);
      setCategories(allCats || []);
      setProducts(allProds || []);
      setOrders(allOrders || []);
    } catch (e) {
      console.error('Failed to load seller data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, []);

  const activeSeller = useMemo(() => {
    return sellers.find(s => s.id === activeSellerId) || {
      id: activeSellerId,
      storeName: 'My Store',
      ownerName: 'Seller'
    };
  }, [sellers, activeSellerId]);

  // Products belonging to active seller
  const sellerProducts = useMemo(() => {
    return products.filter(p => p.sellerId === activeSellerId);
  }, [products, activeSellerId]);

  // Orders containing products from this seller
  const sellerOrders = useMemo(() => {
    return orders.filter(o => (o.items || []).some(it => it.sellerId === activeSellerId));
  }, [orders, activeSellerId]);

  // Store Analytics
  const sellerRevenue = sellerOrders.reduce((sum, o) => {
    const itemTotal = (o.items || [])
      .filter(it => it.sellerId === activeSellerId)
      .reduce((s, it) => s + (it.price * it.quantity), 0);
    return sum + itemTotal;
  }, 0);

  const lowStockProducts = sellerProducts.filter(p => p.stock <= 10);

  // --- CRUD: Create / Edit Product ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: categories[0] ? categories[0].name : 'Electronics',
      price: '',
      originalPrice: '',
      stock: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stock: p.stock,
      description: p.description,
      image: p.image
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice) || Number(productForm.price),
      stock: Number(productForm.stock),
      sellerId: activeSellerId,
      sellerName: activeSeller.storeName
    };

    try {
      if (editingProduct) {
        await window.TrendMartAPI.updateProduct(editingProduct.id, payload);
      } else {
        await window.TrendMartAPI.createProduct(payload);
      }
      setIsProductModalOpen(false);
      loadSellerData();
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  // --- CRUD: Delete Product ---
  const handleDeleteProduct = async (id, title) => {
    if (confirm(`Are you sure you want to remove "${title}" from your store catalog?`)) {
      try {
        await window.TrendMartAPI.deleteProduct(id);
        loadSellerData();
      } catch (err) {
        alert('Failed to delete product: ' + err.message);
      }
    }
  };

  // --- CRUD: Update Order Status ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await window.TrendMartAPI.updateOrderStatus(orderId, newStatus, `Updated by seller ${activeSeller.storeName}`);
      loadSellerData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <div className="seller-app">
      {/* 1. Professional Sidebar */}
      <aside className="seller-sidebar">
        <div className="seller-brand">
          <img 
            src="assets/logo-light.png" 
            alt="TrendMart Logo" 
            className="seller-brand-img"
          />
          <span className="seller-brand-tag">Seller Center</span>
        </div>

        <ul className="seller-nav">
          <li
            className={`seller-nav-item ${currentView === 'inventory' ? 'active' : ''}`}
            onClick={() => setCurrentView('inventory')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>Products & Stock</span>
            <span className="nav-count-badge">{sellerProducts.length}</span>
          </li>
          <li
            className={`seller-nav-item ${currentView === 'orders' ? 'active' : ''}`}
            onClick={() => setCurrentView('orders')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Orders & Dispatch</span>
            <span className="nav-count-badge">{sellerOrders.length}</span>
          </li>
          <li
            className={`seller-nav-item ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <span>Earnings & Analytics</span>
          </li>
        </ul>

        {/* Ecosystem Interconnected Navigation */}
        <div className="seller-portal-links">
          <div className="portal-links-label">TrendMart Ecosystem</div>
          <a href="http://localhost:3001" className="seller-nav-link" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Customer Store (3001)</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          <a href="http://localhost:3000" className="seller-nav-link" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Admin Console (3000)</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="seller-main">
        {/* Modern Topbar */}
        <header className="seller-topbar">
          <div className="seller-store-select-wrap">
            {currentSeller ? (
              <div className="seller-profile-chip">
                <div className="seller-profile-avatar">
                  {(currentSeller.storeName || 'S').charAt(0).toUpperCase()}
                </div>
                <div className="seller-profile-details">
                  <span className="seller-profile-name">{currentSeller.storeName}</span>
                  <span className="seller-profile-sub">{currentSeller.ownerName}</span>
                </div>
                <button
                  className="btn-ghost-sm"
                  onClick={() => { setAuthError(''); setIsSellerAuthOpen(true); }}
                  title="Switch Vendor Store"
                >
                  Switch
                </button>
                <button
                  className="btn-ghost-sm btn-ghost-danger"
                  onClick={handleSellerLogout}
                  title="Sign out of seller account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button className="btn-primary-sm" onClick={() => { setAuthError(''); setIsSellerAuthOpen(true); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>Seller Sign In / Register</span>
              </button>
            )}
          </div>

          <div className="topbar-actions">
            <div className="live-sync-indicator" title="Connected to Central Database (Port 5000)">
              <span className="live-sync-pulse"></span>
              <span>Live DB Connected</span>
            </div>
            <button className="btn-primary" onClick={handleOpenAddProduct}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add Product</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Views */}
        <div className="seller-content">
          {/* Refined KPI Metric Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Store Revenue</span>
                <div className="metric-icon-wrap icon-blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
              </div>
              <div className="metric-value">₹{sellerRevenue.toLocaleString('en-IN')}</div>
              <div className="metric-subtext">Cumulative vendor sales</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Active Catalog</span>
                <div className="metric-icon-wrap icon-purple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
              </div>
              <div className="metric-value">{sellerProducts.length}</div>
              <div className="metric-subtext">Published marketplace items</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Incoming Orders</span>
                <div className="metric-icon-wrap icon-green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
              </div>
              <div className="metric-value">{sellerOrders.length}</div>
              <div className="metric-subtext">Orders placed by customers</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Stock Attention</span>
                <div className={`metric-icon-wrap ${lowStockProducts.length > 0 ? 'icon-amber' : 'icon-gray'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
              </div>
              <div className="metric-value">{lowStockProducts.length}</div>
              <div className="metric-subtext">Items with ≤ 10 units in inventory</div>
            </div>
          </div>

          {/* VIEW 1: PRODUCTS INVENTORY (CRUD) */}
          {currentView === 'inventory' && (
            <div>
              <div className="section-header-bar">
                <div>
                  <h2 className="section-title">Product Catalog & Inventory</h2>
                  <p className="section-desc">
                    Manage pricing, update stock units, or publish new merchandise to the customer storefront.
                  </p>
                </div>
                <button className="btn-primary" onClick={handleOpenAddProduct}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Add Product</span>
                </button>
              </div>

              <div className="data-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Selling Price</th>
                      <th>Stock Level</th>
                      <th>Inventory Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="table-empty-cell">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                          </svg>
                          <div>No products listed yet in this store catalog.</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-muted)', marginTop: '0.25rem' }}>
                            Click &ldquo;Add Product&rdquo; above to publish your first offering!
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sellerProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="product-row-title">
                              <img src={p.image} alt={p.title} className="product-thumb" />
                              <div>
                                <span className="product-item-name">{p.title}</span>
                                <span className="product-item-sku">SKU: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="category-badge">{p.category}</span>
                          </td>
                          <td>
                            <div className="price-stack">
                              <span className="selling-price">₹{p.price.toLocaleString('en-IN')}</span>
                              {p.originalPrice > p.price && (
                                <span className="mrp-price">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="stock-number">{p.stock}</span> units
                          </td>
                          <td>
                            <span className={`status-pill ${
                              p.stock > 10 ? 'status-in-stock' : (p.stock > 0 ? 'status-low-stock' : 'status-out-of-stock')
                            }`}>
                              <span className="status-dot"></span>
                              {p.stock > 10 ? 'In Stock' : (p.stock > 0 ? 'Low Stock' : 'Out of Stock')}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                              <button className="btn-icon" onClick={() => handleOpenEditProduct(p)} title="Edit product pricing and inventory">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                <span>Edit</span>
                              </button>
                              <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteProduct(p.id, p.title)} title="Delete product">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 2: ORDERS MANAGEMENT */}
          {currentView === 'orders' && (
            <div>
              <div className="section-header-bar">
                <div>
                  <h2 className="section-title">Order Processing & Fulfillment</h2>
                  <p className="section-desc">
                    Track incoming purchases placed on the Customer Storefront and update dispatch status.
                  </p>
                </div>
              </div>

              <div className="data-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Store Items</th>
                      <th>Order Total</th>
                      <th>Status</th>
                      <th>Update Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="table-empty-cell">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                          </svg>
                          <div>No customer orders for this store yet.</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-muted)', marginTop: '0.25rem' }}>
                            Orders placed on the customer storefront will synchronize here automatically.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sellerOrders.map(o => {
                        const storeItems = (o.items || []).filter(it => it.sellerId === activeSellerId);
                        const storeAmount = storeItems.reduce((s, it) => s + (it.price * it.quantity), 0);

                        return (
                          <tr key={o.id}>
                            <td>
                              <span className="order-code">{o.orderNumber || o.id}</span>
                              <div className="order-date">
                                {new Date(o.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </td>
                            <td>
                              <div className="customer-info">
                                <span className="customer-name">{o.customerName}</span>
                                <span className="customer-address">{o.shippingAddress}</span>
                              </div>
                            </td>
                            <td>
                              <div className="order-item-list">
                                {storeItems.map((it, idx) => (
                                  <div key={idx} className="order-item-chip">
                                    <span className="order-item-title">{it.title}</span>
                                    <span className="order-item-qty">x{it.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="order-amount-wrap">
                                <span className="order-amount">₹{storeAmount.toLocaleString('en-IN')}</span>
                                <span className="order-payment-tag">{o.paymentMethod}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`status-pill ${
                                o.status === 'Delivered' ? 'status-delivered' : 
                                o.status === 'Shipped' ? 'status-shipped' : 'status-processing'
                              }`}>
                                <span className="status-dot"></span>
                                {o.status}
                              </span>
                            </td>
                            <td>
                              <select
                                className="fulfillment-select"
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Mark Shipped</option>
                                <option value="Delivered">Mark Delivered</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 3: EARNINGS & ANALYTICS */}
          {currentView === 'analytics' && (
            <div>
              <div className="section-header-bar">
                <div>
                  <h2 className="section-title">Store Performance & Insights</h2>
                  <p className="section-desc">
                    Comprehensive overview of financial payouts and logistics efficiency for {activeSeller.storeName}.
                  </p>
                </div>
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-card-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--sh-primary)' }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <h3 className="analytics-card-title">Vendor Account Profile</h3>
                  </div>
                  <div className="profile-detail-list">
                    <div className="profile-detail-row">
                      <span className="detail-key">Storefront Name</span>
                      <span className="detail-val">{activeSeller.storeName}</span>
                    </div>
                    <div className="profile-detail-row">
                      <span className="detail-key">Account Proprietor</span>
                      <span className="detail-val">{activeSeller.ownerName}</span>
                    </div>
                    <div className="profile-detail-row">
                      <span className="detail-key">Business Email</span>
                      <span className="detail-val">{activeSeller.email}</span>
                    </div>
                    <div className="profile-detail-row">
                      <span className="detail-key">Helpline Number</span>
                      <span className="detail-val">{activeSeller.phone || '+91 98765 43210'}</span>
                    </div>
                    <div className="profile-detail-row">
                      <span className="detail-key">Dispatch Warehouse</span>
                      <span className="detail-val">{activeSeller.address || 'Central Logistic Park, Sector 4, Bangalore'}</span>
                    </div>
                    <div className="profile-detail-row">
                      <span className="detail-key">Merchant Rating</span>
                      <span className="detail-val rating-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>{activeSeller.rating || '4.8'} / 5.0</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-card-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    <h3 className="analytics-card-title">Fulfillment Health & Metrics</h3>
                  </div>
                  <div className="profile-detail-list">
                    <div className="profile-detail-row">
                      <span className="detail-key">Fulfilled Orders</span>
                      <span className="detail-val" style={{ color: '#10b981', fontWeight: 700 }}>
                        {sellerOrders.filter(o => o.status === 'Delivered').length} orders
                      </span>
                    </div>
                    <div className="profile-detail-row">
                      <span className="detail-key">Pending Dispatch</span>
                      <span className="detail-val" style={{ color: '#f59e0b', fontWeight: 700 }}>
                        {sellerOrders.filter(o => o.status !== 'Delivered').length} orders
                      </span>
                    </div>
                    <div className="profile-detail-row">
                      <span className="detail-key">Stock Health</span>
                      <span className="detail-val">
                        {lowStockProducts.length === 0 ? 'Optimal (No stockouts)' : `${lowStockProducts.length} low-stock alerts`}
                      </span>
                    </div>
                    <div className="profile-detail-row">
                      <span className="detail-key">Net Payout Accrued</span>
                      <span className="detail-val payout-val">₹{sellerRevenue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Form Modal (Add / Edit) */}
      {isProductModalOpen && (
        <div className="seller-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--sh-primary)' }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <h3>{editingProduct ? 'Edit Catalog Product' : 'Add New Product to Store'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsProductModalOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="modal-body">
              <div className="form-group">
                <label className="form-label">Product Name / Title</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Available Inventory Units</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="form-control"
                    placeholder="e.g. 50"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-control"
                    placeholder="e.g. 2999"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Original MRP (₹)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="e.g. 4999"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image URL</label>
                <input
                  type="url"
                  required
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Key Specifications</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Describe technical specs, warranty, packaging details..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsProductModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seller Authentication Modal (Login / Register Store) */}
      {isSellerAuthOpen && (
        <div className="seller-modal-overlay" onClick={() => setIsSellerAuthOpen(false)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--sh-primary)' }}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <h3>{authMode === 'login' ? 'Seller Hub Portal Sign In' : 'Register New Merchant Account'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsSellerAuthOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {/* Modern Tab Switcher */}
              <div className="auth-tab-bar">
                <button
                  type="button"
                  className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                >
                  Register Store
                </button>
              </div>

              {authError && (
                <div className="auth-error-banner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{authError}</span>
                </div>
              )}

              {authMode === 'login' ? (
                <form onSubmit={handleSellerLogin}>
                  <div className="form-group">
                    <label className="form-label">Registered Business Email</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      required
                      className="form-control"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    />
                  </div>

                  <div className="demo-stores-panel">
                    <div className="demo-panel-title">Demo Merchant Accounts:</div>
                    <div className="demo-chip-group">
                      <button
                        type="button"
                        className="demo-store-chip"
                        onClick={() => setAuthForm({ ...authForm, email: 'vikram@aerotech.com', password: 'password123' })}
                      >
                        AeroTech Electronics
                      </button>
                      <button
                        type="button"
                        className="demo-store-chip"
                        onClick={() => setAuthForm({ ...authForm, email: 'pooja@urbanchic.in', password: 'password123' })}
                      >
                        Urban Chic Apparels
                      </button>
                      <button
                        type="button"
                        className="demo-store-chip"
                        onClick={() => setAuthForm({ ...authForm, email: 'rameshwar@heritagehome.in', password: 'password123' })}
                      >
                        Heritage Home
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
                    Sign In to Seller Dashboard
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSellerRegister}>
                  <div className="form-group">
                    <label className="form-label">Storefront Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Apex Sports Gear"
                      value={authForm.storeName}
                      onChange={(e) => setAuthForm({ ...authForm, storeName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Proprietor / Contact Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Sanjay Singhal"
                      value={authForm.ownerName}
                      onChange={(e) => setAuthForm({ ...authForm, ownerName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Email</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      placeholder="contact@store.com"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      required
                      className="form-control"
                      placeholder="Minimum 6 characters"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
                    Register Merchant Account
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Render into DOM
const rootEl = document.getElementById('seller-root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<SellerHubApp />);
}
