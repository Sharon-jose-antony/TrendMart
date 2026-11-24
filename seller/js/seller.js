// TrendMart Seller Hub React Application
const { useState, useEffect, useMemo } = React;

function SellerHubApp() {
  const [currentView, setCurrentView] = useState('inventory');
  const [sellers, setSellers] = useState([]);
  const [activeSellerId, setActiveSellerId] = useState('seller-1');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (confirm(`Are you sure you want to remove "${title}" from your store?`)) {
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
      {/* 1. Sidebar */}
      <aside className="seller-sidebar">
        <div className="seller-brand">
          <span style={{ fontSize: '1.5rem' }}>💼</span>
          <div>
            <div className="seller-brand-title">TrendMart</div>
            <span className="seller-brand-tag">Seller Center</span>
          </div>
        </div>

        <ul className="seller-nav">
          <li
            className={`seller-nav-item ${currentView === 'inventory' ? 'active' : ''}`}
            onClick={() => setCurrentView('inventory')}
          >
            📦 Products & Stock ({sellerProducts.length})
          </li>
          <li
            className={`seller-nav-item ${currentView === 'orders' ? 'active' : ''}`}
            onClick={() => setCurrentView('orders')}
          >
            🛒 Store Orders ({sellerOrders.length})
          </li>
          <li
            className={`seller-nav-item ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
          >
            📈 Earnings & Analytics
          </li>
        </ul>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--sh-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="../customer/" className="seller-nav-item" style={{ textDecoration: 'none' }} target="_blank">
            🛍️ Open Customer Store →
          </a>
          <a href="../" className="seller-nav-item" style={{ textDecoration: 'none' }}>
            👑 Admin Dashboard →
          </a>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="seller-main">
        {/* Topbar */}
        <header className="seller-topbar">
          <div className="seller-store-select-wrap">
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--sh-text-muted)' }}>Store Profile:</span>
            <select
              className="seller-store-select"
              value={activeSellerId}
              onChange={(e) => setActiveSellerId(e.target.value)}
            >
              {sellers.map(s => (
                <option key={s.id} value={s.id}>
                  🏪 {s.storeName} ({s.ownerName})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
              ● Live DB Synchronized
            </span>
            <button className="btn-primary" onClick={handleOpenAddProduct}>
              + Add New Product
            </button>
          </div>
        </header>

        {/* Dynamic Content Views */}
        <div className="seller-content">
          {/* KPI Cards Strip */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-wrap icon-blue">💰</div>
              <div>
                <div className="metric-value">₹{sellerRevenue.toLocaleString('en-IN')}</div>
                <div className="metric-label">Total Store Revenue</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap icon-purple">📦</div>
              <div>
                <div className="metric-value">{sellerProducts.length}</div>
                <div className="metric-label">Active Listed Products</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap icon-green">🛒</div>
              <div>
                <div className="metric-value">{sellerOrders.length}</div>
                <div className="metric-label">Incoming Orders</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap icon-amber">⚠️</div>
              <div>
                <div className="metric-value">{lowStockProducts.length}</div>
                <div className="metric-label">Low Stock Alerts</div>
              </div>
            </div>
          </div>

          {/* VIEW 1: PRODUCTS INVENTORY (CRUD) */}
          {currentView === 'inventory' && (
            <div>
              <div className="section-header-bar">
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Product Inventory Management</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sh-text-muted)' }}>
                    Add, edit pricing, restock units, or remove items from the marketplace
                  </p>
                </div>
                <button className="btn-primary" onClick={handleOpenAddProduct}>
                  + Add Product
                </button>
              </div>

              <div className="data-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Selling Price</th>
                      <th>Stock Units</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                          No products listed yet. Click "+ Add Product" to publish your first item!
                        </td>
                      </tr>
                    ) : (
                      sellerProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="product-row-title">
                              <img src={p.image} alt={p.title} className="product-thumb" />
                              <div>
                                <strong style={{ color: 'var(--sh-text)' }}>{p.title}</strong>
                                <div style={{ fontSize: '0.78rem', color: 'var(--sh-text-muted)' }}>ID: {p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td>
                            <strong>₹{p.price.toLocaleString('en-IN')}</strong>
                            {p.originalPrice > p.price && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--sh-text-muted)', marginLeft: '0.4rem', textDecoration: 'line-through' }}>
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </td>
                          <td>
                            <strong>{p.stock}</strong> units
                          </td>
                          <td>
                            <span className={`status-pill ${
                              p.stock > 10 ? 'status-in-stock' : (p.stock > 0 ? 'status-low-stock' : 'status-out-of-stock')
                            }`}>
                              {p.stock > 10 ? 'In Stock' : (p.stock > 0 ? 'Low Stock' : 'Out of Stock')}
                            </span>
                          </td>
                          <td>
                            <div className="action-btn-group">
                              <button className="btn-icon" onClick={() => handleOpenEditProduct(p)}>
                                ✏️ Edit
                              </button>
                              <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteProduct(p.id, p.title)}>
                                🗑️ Delete
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
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Orders & Fulfillment</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sh-text-muted)' }}>
                    Fulfill customer purchases and update dispatch tracking
                  </p>
                </div>
              </div>

              <div className="data-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Ordered Items</th>
                      <th>Total Amount</th>
                      <th>Fulfillment Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                          No customer orders for this store yet. Orders placed on the storefront will appear here instantly!
                        </td>
                      </tr>
                    ) : (
                      sellerOrders.map(o => {
                        const storeItems = (o.items || []).filter(it => it.sellerId === activeSellerId);
                        const storeAmount = storeItems.reduce((s, it) => s + (it.price * it.quantity), 0);

                        return (
                          <tr key={o.id}>
                            <td>
                              <strong style={{ color: '#0284c7' }}>{o.orderNumber || o.id}</strong>
                              <div style={{ fontSize: '0.78rem', color: 'var(--sh-text-muted)' }}>
                                {new Date(o.orderDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <strong>{o.customerName}</strong>
                              <div style={{ fontSize: '0.78rem', color: 'var(--sh-text-muted)' }}>{o.shippingAddress}</div>
                            </td>
                            <td>
                              {storeItems.map((it, idx) => (
                                <div key={idx} style={{ fontSize: '0.84rem' }}>
                                  • {it.title} (x{it.quantity})
                                </div>
                              ))}
                            </td>
                            <td>
                              <strong>₹{storeAmount.toLocaleString('en-IN')}</strong>
                              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>{o.paymentMethod}</div>
                            </td>
                            <td>
                              <span className={`status-pill ${
                                o.status === 'Delivered' ? 'status-delivered' : 
                                o.status === 'Shipped' ? 'status-shipped' : 'status-processing'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td>
                              <select
                                className="seller-store-select"
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
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Store Performance & Analytics</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sh-text-muted)' }}>
                    Financial overview and sales insights for {activeSeller.storeName}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <div className="data-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Vendor Profile</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div><strong>Store:</strong> {activeSeller.storeName}</div>
                    <div><strong>Proprietor:</strong> {activeSeller.ownerName}</div>
                    <div><strong>Registered Email:</strong> {activeSeller.email}</div>
                    <div><strong>Helpline:</strong> {activeSeller.phone}</div>
                    <div><strong>Dispatch Hub:</strong> {activeSeller.address}</div>
                    <div><strong>Vendor Rating:</strong> ⭐ {activeSeller.rating || '4.8'} / 5.0</div>
                  </div>
                </div>

                <div className="data-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Fulfillment Health</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div><strong>Total Fulfilled Orders:</strong> {sellerOrders.filter(o => o.status === 'Delivered').length}</div>
                    <div><strong>Active Pending Fulfillment:</strong> {sellerOrders.filter(o => o.status !== 'Delivered').length}</div>
                    <div><strong>Inventory Health:</strong> {lowStockProducts.length === 0 ? '🟢 All products well-stocked' : `⚠️ ${lowStockProducts.length} items low in stock`}</div>
                    <div><strong>Net Payout Balance:</strong> <span style={{ color: '#0284c7', fontWeight: 800 }}>₹{sellerRevenue.toLocaleString('en-IN')}</span></div>
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
              <h3>{editingProduct ? 'Edit Store Product' : 'Add New Product to Store'}</h3>
              <button style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }} onClick={() => setIsProductModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveProduct} className="modal-body">
              <div className="form-group">
                <label className="form-label">Product Title</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Wireless Bluetooth Earbuds"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  <label className="form-label">Stock Units</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-control"
                    placeholder="e.g. 1999"
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
                    placeholder="e.g. 2999"
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
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Key features, specifications, and warranty..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.8rem' }}>
                {editingProduct ? 'Save Product Changes' : 'Publish Product to Marketplace'}
              </button>
            </form>
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
