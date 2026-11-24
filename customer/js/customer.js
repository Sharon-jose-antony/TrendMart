// TrendMart Customer Storefront React Application
const { useState, useEffect, useMemo } = React;

function CustomerStoreApp() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State for Checkout
  const [checkoutForm, setCheckoutForm] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 11223',
    address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
    paymentMethod: 'UPI'
  });

  // Load Data from Backend DB via Universal API
  const loadStoreData = async () => {
    try {
      setLoading(true);
      const [prods, cats, bans] = await Promise.all([
        window.TrendMartAPI.getProducts(),
        window.TrendMartAPI.getCategories(),
        window.TrendMartAPI.getBanners()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      setBanners(bans || []);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreData();
    // Load local cart if saved
    const savedCart = localStorage.getItem('tm_customer_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
  }, []);

  // Save cart changes
  useEffect(() => {
    localStorage.setItem('tm_customer_cart', JSON.stringify(cart));
  }, [cart]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory || p.categoryId === activeCategory;
      const matchSearch = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Cart operations
  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Cannot add more than ${product.stock} items in stock.`);
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          if (nextQty > item.stock) {
            alert(`Only ${item.stock} available in stock.`);
            return item;
          }
          return { ...item, quantity: nextQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle Checkout submission -> Interconnected DB CRUD!
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderPayload = {
      customerName: checkoutForm.name,
      customerEmail: checkoutForm.email,
      customerPhone: checkoutForm.phone,
      shippingAddress: checkoutForm.address,
      paymentMethod: checkoutForm.paymentMethod,
      paymentStatus: checkoutForm.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      totalAmount: cartTotal,
      items: cart.map(item => ({
        productId: item.id,
        sellerId: item.sellerId,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const createdOrder = await window.TrendMartAPI.createOrder(orderPayload);
      setOrderSuccess(createdOrder);
      setCart([]);
      setIsCheckoutOpen(false);
      // Reload store data to reflect updated stock in DB
      loadStoreData();
    } catch (err) {
      alert('Order placement failed: ' + err.message);
    }
  };

  // View Customer's Orders
  const openMyOrders = async () => {
    try {
      const orders = await window.TrendMartAPI.getOrders();
      setMyOrders(orders || []);
      setIsMyOrdersOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="store-app">
      {/* 1. Header / Navbar */}
      <header className="store-header">
        <div className="store-topbar">
          <div className="store-brand" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
            <img src="assets/logo-light.png" alt="TrendMart" className="store-brand-logo" onError={(e) => { e.target.style.display='none'; }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4338ca', letterSpacing: '-0.02em', marginLeft: '0.25rem' }}>TrendMart</h2>
          </div>

          <div className="store-search-wrap">
            <span className="store-search-icon">🔍</span>
            <input
              type="text"
              className="store-search-input"
              placeholder="Search products, brands, or electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="store-nav-actions">
            <button className="store-btn store-btn-secondary" onClick={openMyOrders}>
              📦 My Orders
            </button>

            <button className="store-btn store-btn-primary" onClick={() => setIsCartOpen(true)}>
              🛒 Cart
              {cartCount > 0 && <span className="store-badge">{cartCount}</span>}
            </button>

            <a href="http://localhost:3000" className="store-btn store-btn-secondary" title="Switch to Admin Management">
              ⚙️ Admin Panel (3000)
            </a>
            <a href="http://localhost:3002" className="store-btn store-btn-secondary" title="Switch to Seller Portal">
              💼 Seller Hub (3002)
            </a>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="category-filter-bar">
          <div className="category-filter-inner">
            <button
              className={`cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              🔥 All Deals
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-pill ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Main Storefront Container */}
      <main className="store-container">
        {/* Hero Promo Banner */}
        {banners.length > 0 && (
          <div className="store-hero">
            <div className="store-hero-content">
              <span className="store-hero-badge">TRENDMART EXCLUSIVE</span>
              <h1>{banners[0].title}</h1>
              <p>{banners[0].subtitle}</p>
              <button 
                className="store-btn store-btn-primary"
                style={{ padding: '0.8rem 1.75rem', fontSize: '1rem', background: '#ffffff', color: '#312e81' }}
                onClick={() => setActiveCategory(banners[0].category || 'all')}
              >
                {banners[0].linkText || 'Shop Now'} →
              </button>
            </div>
            <img src={banners[0].image} alt="Banner" className="store-hero-img" />
          </div>
        )}

        {/* Product Catalog Grid */}
        <div className="products-section-header">
          <div>
            <h2 className="products-section-title">
              {activeCategory === 'all' ? 'Featured Marketplace Products' : activeCategory}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--tm-text-muted)' }}>
              Showing {filteredProducts.length} verified products with direct seller fulfillment
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>Loading verified products from TrendMart database...</h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--tm-surface)', borderRadius: '12px' }}>
            <span style={{ fontSize: '3rem' }}>🛍️</span>
            <h3 style={{ marginTop: '1rem' }}>No products found</h3>
            <p style={{ color: 'var(--tm-text-muted)', marginTop: '0.5rem' }}>Try adjusting your search query or switching categories.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const discount = product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;

              return (
                <div key={product.id} className="product-card">
                  <div className="product-img-wrap" onClick={() => setQuickViewProduct(product)}>
                    <img src={product.image} alt={product.title} className="product-img" />
                    {discount && <span className="product-discount-pill">{discount}% OFF</span>}
                    <span className={`product-stock-tag ${
                      product.stock > 10 ? 'tag-in-stock' : (product.stock > 0 ? 'tag-low-stock' : 'tag-out-of-stock')
                    }`}>
                      {product.stock > 10 ? 'In Stock' : (product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock')}
                    </span>
                  </div>

                  <div className="product-body">
                    <div className="product-category-row">
                      <span>{product.category}</span>
                      <span>⭐ {product.rating || '4.5'}</span>
                    </div>

                    <h3 className="product-title" onClick={() => setQuickViewProduct(product)}>
                      {product.title}
                    </h3>

                    <div className="product-seller">
                      🏪 Sold by: <strong>{product.sellerName || 'TrendMart Seller'}</strong>
                    </div>

                    <div className="product-price-row">
                      <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice > product.price && (
                        <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <button
                      className="add-to-cart-btn"
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product)}
                    >
                      {product.stock <= 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Shopping Cart ({cartCount} items)</h3>
              <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>🛒</span>
                  <h4 style={{ marginTop: '0.75rem' }}>Your Cart is Empty</h4>
                  <p style={{ color: 'var(--tm-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Explore our marketplace and add some products!</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{item.title}</h4>
                      <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                      <div className="cart-qty-row">
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>-</button>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>+</button>
                        <button 
                          style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Delivery</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
                </div>
                <div className="cart-summary-total">
                  <span>Grand Total</span>
                  <span style={{ color: '#4338ca' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                >
                  Proceed to Checkout (₹{cartTotal.toLocaleString('en-IN')}) →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Complete Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Secure Checkout – TrendMart</h3>
              <button className="cart-close-btn" onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>
            <form onSubmit={handlePlaceOrder} className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea
                  rows="3"
                  required
                  className="form-textarea"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={checkoutForm.paymentMethod}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                >
                  <option value="UPI">UPI / QR (Instant GooglePay / PhonePe)</option>
                  <option value="Credit / Debit Card">Credit or Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                </select>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total Payable:</span>
                  <span style={{ color: '#4338ca', fontSize: '1.2rem' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button type="submit" className="checkout-btn">
                Confirm & Place Order (₹{cartTotal.toLocaleString('en-IN')})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Order Success & Live Tracking Modal */}
      {orderSuccess && (
        <div className="modal-overlay" onClick={() => setOrderSuccess(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: '#ecfdf5' }}>
              <h3 style={{ color: '#065f46' }}>🎉 Order Placed Successfully!</h3>
              <button className="cart-close-btn" onClick={() => setOrderSuccess(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', margin: '1rem 0' }}>✅</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Thank you, {orderSuccess.customerName}!</h3>
              <p style={{ color: 'var(--tm-text-muted)', fontSize: '0.9rem' }}>
                Order ID: <strong style={{ color: '#4338ca' }}>{orderSuccess.orderNumber || orderSuccess.id}</strong>
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--tm-text-muted)', marginTop: '0.25rem' }}>
                Delivering to: {orderSuccess.shippingAddress}
              </p>

              <div className="order-tracker-timeline" style={{ textAlign: 'left', marginTop: '1.5rem' }}>
                {(orderSuccess.trackingHistory || []).map((step, idx) => (
                  <div key={idx} className="tracker-node completed">
                    <div className="tracker-status">{step.status}</div>
                    <div className="tracker-time">{new Date(step.timestamp).toLocaleString()} – {step.note}</div>
                  </div>
                ))}
              </div>

              <button
                className="store-btn store-btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => setOrderSuccess(null)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. My Orders History Modal */}
      {isMyOrdersOpen && (
        <div className="modal-overlay" onClick={() => setIsMyOrdersOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 My Order History</h3>
              <button className="cart-close-btn" onClick={() => setIsMyOrdersOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              {myOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>No orders placed yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myOrders.map(order => (
                    <div key={order.id} style={{ border: '1px solid var(--tm-border)', borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div>
                          <strong style={{ color: '#4338ca' }}>{order.orderNumber || order.id}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--tm-text-muted)' }}>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                        </div>
                        <span style={{ 
                          padding: '0.3rem 0.75rem', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700,
                          background: order.status === 'Delivered' ? '#dcfce7' : '#dbeafe',
                          color: order.status === 'Delivered' ? '#166534' : '#1e40af'
                        }}>
                          {order.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.88rem', margin: '0.5rem 0' }}>
                        {(order.items || []).map((it, i) => (
                          <div key={i} style={{ color: 'var(--tm-text)' }}>
                            • {it.title} (x{it.quantity}) – ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', borderTop: '1px dashed var(--tm-border)', paddingTop: '0.5rem' }}>
                        <span style={{ fontWeight: 700 }}>Total: ₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                        <button 
                          className="store-btn store-btn-secondary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          onClick={() => setTrackedOrder(order)}
                        >
                          View Tracking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Live Tracking Modal for an Order */}
      {trackedOrder && (
        <div className="modal-overlay" onClick={() => setTrackedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Live Tracking: {trackedOrder.orderNumber || trackedOrder.id}</h3>
              <button className="cart-close-btn" onClick={() => setTrackedOrder(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div><strong>Current Status:</strong> <span style={{ color: '#4338ca', fontWeight: 700 }}>{trackedOrder.status}</span></div>
                <div style={{ fontSize: '0.82rem', color: 'var(--tm-text-muted)', marginTop: '0.2rem' }}>Destination: {trackedOrder.shippingAddress}</div>
              </div>

              <div className="order-tracker-timeline">
                {(trackedOrder.trackingHistory || [
                  { status: 'Order Placed', timestamp: trackedOrder.orderDate, note: 'Order confirmed' },
                  { status: trackedOrder.status, timestamp: new Date().toISOString(), note: 'In progress' }
                ]).map((step, idx) => (
                  <div key={idx} className="tracker-node completed">
                    <div className="tracker-status">{step.status}</div>
                    <div className="tracker-time">{new Date(step.timestamp).toLocaleString()} – {step.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Quick View Product Modal */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{quickViewProduct.title}</h3>
              <button className="cart-close-btn" onClick={() => setQuickViewProduct(null)}>✕</button>
            </div>
            <div className="modal-body">
              <img src={quickViewProduct.image} alt={quickViewProduct.title} style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#4338ca', fontWeight: 600 }}>{quickViewProduct.category}</span>
                <span>⭐ {quickViewProduct.rating || '4.5'} ({quickViewProduct.reviewsCount || 0} reviews)</span>
              </div>
              <p style={{ color: 'var(--tm-text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                {quickViewProduct.description}
              </p>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4338ca', marginBottom: '1rem' }}>
                ₹{quickViewProduct.price.toLocaleString('en-IN')}
              </div>
              <button
                className="checkout-btn"
                disabled={quickViewProduct.stock <= 0}
                onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
              >
                {quickViewProduct.stock <= 0 ? 'Out of Stock' : 'Add to Cart & View Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Render into DOM
const rootEl = document.getElementById('customer-root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<CustomerStoreApp />);
}
