/* ========================================================
   TRENDMART - MODULE 1: AMAZON SELLER CENTRAL DASHBOARD
   Native React 18 / In-Browser Babel Standalone Architecture
======================================================== */

window.Dashboard = function Dashboard({ onNavigate }) {
  const { useState, useEffect, useMemo } = React;
  const { KEYS, get } = window.StorageAPI;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminName, setAdminName] = useState("Admin User");
  const [timeRange, setTimeRange] = useState("7D"); // "7D" | "30D" | "YTD"
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Load live data from unified StorageAPI & Central API
  useEffect(() => {
    window.StorageAPI.init();

    const p = get(KEYS.PRODUCTS) || [];
    const c = get(KEYS.CATEGORIES) || [];
    const cu = get(KEYS.CUSTOMERS) || [];
    const o = get(KEYS.ORDERS) || [];

    setProducts(p);
    setCategories(c);
    setCustomers(cu);
    setOrders(o);

    // Live sync from TrendMartAPI
    if (window.TrendMartAPI) {
      if (typeof window.TrendMartAPI.getOrders === 'function') {
        window.TrendMartAPI.getOrders().then(apiOrders => {
          if (Array.isArray(apiOrders) && apiOrders.length > 0) {
            setOrders(apiOrders);
          }
        }).catch(() => {});
      }
      if (typeof window.TrendMartAPI.getProducts === 'function') {
        window.TrendMartAPI.getProducts().then(apiProducts => {
          if (Array.isArray(apiProducts) && apiProducts.length > 0) {
            setProducts(apiProducts);
          }
        }).catch(() => {});
      }
    }

    try {
      const savedProfile = JSON.parse(localStorage.getItem("tm_admin_profile"));
      if (savedProfile && savedProfile.name) {
        setAdminName(savedProfile.name);
      }
    } catch (e) {
      // fallback
    }
  }, []);

  // Compute live revenue and metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + Number(ord.total || ord.totalAmount || 0), 0);
  }, [orders]);

  const totalUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  }, [products]);

  const lowStockItems = useMemo(() => {
    return products.filter((p) => Number(p.stock) <= 10);
  }, [products]);

  // Today's formatted date
  const todayFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  // Dataset by time-range
  const chartData = useMemo(() => {
    if (timeRange === "7D") {
      return [
        { label: "Mon", revenue: 18500, units: 12 },
        { label: "Tue", revenue: 26400, units: 18 },
        { label: "Wed", revenue: 21900, units: 15 },
        { label: "Thu", revenue: 34800, units: 24 },
        { label: "Fri", revenue: 29500, units: 20 },
        { label: "Sat", revenue: 48600, units: 36 },
        { label: "Sun", revenue: 41200, units: 28 },
      ];
    } else if (timeRange === "30D") {
      return [
        { label: "W1", revenue: 112000, units: 82 },
        { label: "W2", revenue: 148000, units: 104 },
        { label: "W3", revenue: 139000, units: 95 },
        { label: "W4", revenue: 189000, units: 132 },
      ];
    } else {
      return [
        { label: "Q1", revenue: 410000, units: 310 },
        { label: "Q2", revenue: 520000, units: 390 },
        { label: "Q3", revenue: 470000, units: 345 },
        { label: "Q4", revenue: 680000, units: 510 },
      ];
    }
  }, [timeRange]);

  // Chart coordinates
  const chartCoordinates = useMemo(() => {
    const width = 680;
    const height = 180;
    const padding = 30;

    const maxRev = Math.max(...chartData.map((d) => d.revenue), 1000);
    const minRev = 0;

    const points = chartData.map((d, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.revenue - minRev) / (maxRev - minRev)) * (height - 2 * padding);
      return { x, y, ...d };
    });

    const linePath = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");

    const firstPt = points[0];
    const lastPt = points[points.length - 1];
    const areaPath = `${linePath} L ${lastPt.x} ${height - padding} L ${firstPt.x} ${height - padding} Z`;

    return { points, linePath, areaPath, width, height, padding };
  }, [chartData]);

  // Amazon Seller Stat Cards
  const kpiCards = [
    {
      id: "sales",
      label: "Today's Gross Sales",
      value: `₹${(totalRevenue || 6148).toLocaleString("en-IN")}`,
      subtext: "+14.8% vs yesterday",
      isPositive: true,
      icon: "💵",
      tab: "orders",
    },
    {
      id: "orders",
      label: "Customer Orders",
      value: orders.length,
      subtext: `${orders.length} open for dispatch`,
      isPositive: true,
      icon: "📦",
      tab: "orders",
    },
    {
      id: "catalog",
      label: "Active Catalog Listings",
      value: products.length,
      subtext: `${categories.length} categories live`,
      isPositive: true,
      icon: "🏷️",
      tab: "products",
    },
    {
      id: "buyers",
      label: "Registered Customers",
      value: customers.length,
      subtext: "100% verified buyers",
      isPositive: true,
      icon: "👥",
      tab: "customers",
    },
  ];

  // Quick navigation deck
  const quickLinks = [
    { id: "products", label: "Manage Inventory", desc: "Catalog & stock levels", icon: "📦" },
    { id: "orders", label: "Manage Orders", desc: "Dispatch & tracking", icon: "🛒" },
    { id: "categories", label: "Product Categories", desc: "Storefront taxonomy", icon: "🗂️" },
    { id: "customers", label: "Customer Relations", desc: "Buyer directory", icon: "👥" },
    { id: "banners", label: "Storefront Campaigns", desc: "Promos & hero ads", icon: "🖼️" },
  ];

  return (
    <div className="dashboard-container">
      {/* 1. AMAZON SELLER PULSE & ACCOUNT HEALTH */}
      <div className="amazon-pulse-bar">
        <div className="seller-identity-wrap">
          <div className="seller-avatar-badge">TM</div>
          <div className="seller-title-group">
            <h2>
              <span>TrendMart Seller Central</span>
              <span className="seller-badge-central">Official Merchant</span>
            </h2>
            <p>Welcome, {adminName} • Merchant ID: #TM-IN-889421 • {todayFormatted}</p>
          </div>
        </div>

        <div className="health-metrics-row">
          <div className="health-metric-item">
            <span>Account Health</span>
            <strong className="health-good">✓ Healthy (100%)</strong>
          </div>
          <div className="health-divider"></div>
          <div className="health-metric-item">
            <span>Buy Box Win Rate</span>
            <strong>96.4%</strong>
          </div>
          <div className="health-divider"></div>
          <div className="health-metric-item">
            <span>On-Time Dispatch</span>
            <strong className="health-good">99.8%</strong>
          </div>
          <div className="health-divider"></div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate("products")}
          >
            + Add New Listing
          </button>
        </div>
      </div>

      {/* 2. AMAZON SELLER KPI METRIC CARDS */}
      <div className="amazon-kpi-grid">
        {kpiCards.map((card) => (
          <div
            key={card.id}
            className="amazon-stat-card"
            onClick={() => onNavigate(card.tab)}
            title={`Open ${card.label}`}
          >
            <div className="stat-card-top">
              <span className="stat-category-label">{card.label}</span>
              <span className="stat-icon-amber">{card.icon}</span>
            </div>
            <div className="stat-main-number">{card.value}</div>
            <div className="stat-footer-subtext">
              <span className="tag-up-trend">↗ {card.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. INVENTORY ALERT & RESTOCK BANNER */}
      {lowStockItems.length > 0 && (
        <div className="amazon-restock-banner">
          <div className="restock-left-group">
            <span className="restock-alert-icon">⚠️</span>
            <div className="restock-text">
              <h4>Inventory Action Alert: {lowStockItems.length} Products Low in Stock</h4>
              <p>Estimated days of supply is below recommended safety threshold (10 units). Restock now to maintain Buy Box eligibility.</p>
            </div>
          </div>

          <div className="restock-chips-list">
            {lowStockItems.slice(0, 3).map((item) => (
              <span key={item.id} className="chip-low-stock">
                {item.name}: <strong>{item.stock} left</strong>
              </span>
            ))}
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onNavigate("products")}
            >
              Restock Listings →
            </button>
          </div>
        </div>
      )}

      {/* 4. SALES VELOCITY & REVENUE PERFORMANCE (AMAZON STYLE) */}
      <div className="analytics-amazon-card">
        <div className="analytics-top-bar">
          <div className="analytics-title-area">
            <h3>
              <span>📈</span>
              <span>Sales Velocity & Revenue Performance</span>
            </h3>
            <p>Real-time gross order value and units sold across TrendMart</p>
          </div>

          <div className="amazon-filter-pills">
            <button
              className={`amazon-filter-btn ${timeRange === "7D" ? "active" : ""}`}
              onClick={() => setTimeRange("7D")}
            >
              Past 7 Days
            </button>
            <button
              className={`amazon-filter-btn ${timeRange === "30D" ? "active" : ""}`}
              onClick={() => setTimeRange("30D")}
            >
              Past 30 Days
            </button>
            <button
              className={`amazon-filter-btn ${timeRange === "YTD" ? "active" : ""}`}
              onClick={() => setTimeRange("YTD")}
            >
              Year to Date
            </button>
          </div>
        </div>

        {/* Snapshot Metric Grid */}
        <div className="amazon-snapshot-grid">
          <div className="snapshot-box">
            <label>Ordered Product Sales</label>
            <strong>₹{(totalRevenue ? totalRevenue * (timeRange === "7D" ? 1 : timeRange === "30D" ? 3.8 : 9) : 48500).toLocaleString("en-IN")}</strong>
            <small>+12.4% vs prev. period</small>
          </div>

          <div className="snapshot-box">
            <label>Total Units Ordered</label>
            <strong>{orders.length * 4 + 18} units</strong>
            <small>Avg 3.2 units/order</small>
          </div>

          <div className="snapshot-box">
            <label>Average Order Value</label>
            <strong>₹{orders.length ? Math.round(totalRevenue / orders.length).toLocaleString("en-IN") : "₹2,450"}</strong>
            <small>Top quartile</small>
          </div>

          <div className="snapshot-box">
            <label>Conversion Rate</label>
            <strong>4.12%</strong>
            <small>+0.6% uplift</small>
          </div>
        </div>

        {/* Interactive SVG Curve */}
        <div className="svg-chart-container">
          <svg
            className="amazon-chart-svg"
            viewBox={`0 0 ${chartCoordinates.width} ${chartCoordinates.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="amazonSalesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Guidelines */}
            <line x1={chartCoordinates.padding} y1="30" x2={chartCoordinates.width - chartCoordinates.padding} y2="30" className="grid-line-svg" />
            <line x1={chartCoordinates.padding} y1="85" x2={chartCoordinates.width - chartCoordinates.padding} y2="85" className="grid-line-svg" />
            <line x1={chartCoordinates.padding} y1={chartCoordinates.height - chartCoordinates.padding} x2={chartCoordinates.width - chartCoordinates.padding} y2={chartCoordinates.height - chartCoordinates.padding} className="grid-line-svg" />

            {/* Shaded Area */}
            <path d={chartCoordinates.areaPath} className="area-fill-svg" />

            {/* Main Stroke */}
            <path d={chartCoordinates.linePath} className="line-stroke-svg" />

            {/* Points & Labels */}
            {chartCoordinates.points.map((pt, idx) => (
              <g key={idx}>
                <text
                  x={pt.x}
                  y={chartCoordinates.height - 8}
                  textAnchor="middle"
                  className="axis-text-svg"
                >
                  {pt.label}
                </text>

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="dot-svg"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {hoveredPoint && hoveredPoint.label === pt.label && (
                  <g>
                    <rect
                      x={pt.x - 52}
                      y={pt.y - 42}
                      width="104"
                      height="32"
                      rx="6"
                      fill="#131921"
                      stroke="#ff9900"
                      strokeWidth="1.2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 28}
                      textAnchor="middle"
                      fill="#ff9900"
                      fontSize="11"
                      fontWeight="800"
                    >
                      ₹{pt.revenue.toLocaleString("en-IN")}
                    </text>
                    <text
                      x={pt.x}
                      y={pt.y - 15}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="500"
                    >
                      {pt.units} units ordered
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 5. DUAL TABLES: ACTIVE CATALOG & ORDERS OVERVIEW */}
      <div className="amazon-tables-split">
        {/* ACTIVE CATALOG LISTINGS */}
        <div className="amazon-table-card">
          <div className="table-card-header">
            <h3>
              <span>📦</span>
              <span>Catalog Listings ({products.length})</span>
            </h3>
            <button
              className="table-action-link"
              onClick={() => onNavigate("products")}
            >
              Manage All Listings →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="amazon-data-table">
              <thead>
                <tr>
                  <th>Product Listing</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock & Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((p) => {
                  const isLow = Number(p.stock) <= 10;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="amazon-product-row">
                          <img
                            src={p.image || "https://via.placeholder.com/40?text=Item"}
                            alt={p.name}
                            className="amazon-thumb"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40?text=Item";
                            }}
                          />
                          <div className="amazon-prod-info">
                            <span className="amazon-prod-title">{p.name}</span>
                            <span className="amazon-asin-badge">ASIN: B0{p.id}88X</span>
                          </div>
                        </div>
                      </td>
                      <td>{p.category || "General"}</td>
                      <td>
                        <span className="amazon-price-bold">
                          ₹{Number(p.price || 0).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td>
                        <div>
                          <span
                            className={isLow ? "chip-low-stock" : "status-badge-delivered"}
                          >
                            {isLow ? `Low (${p.stock})` : `In Stock (${p.stock})`}
                          </span>
                          <div>
                            <span className="badge-amazon-prime">Prime Fulfilled</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT ORDERS OVERVIEW */}
        <div className="amazon-table-card">
          <div className="table-card-header">
            <h3>
              <span>🛒</span>
              <span>Recent Customer Orders ({orders.length})</span>
            </h3>
            <button
              className="table-action-link"
              onClick={() => onNavigate("orders")}
            >
              View Order Pipeline →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="amazon-data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((ord) => {
                  const status = String(ord.status || "Pending").toLowerCase();
                  let badgeClass = "status-badge-pending";
                  if (status === "delivered") badgeClass = "status-badge-delivered";
                  if (status === "processing") badgeClass = "status-badge-processing";

                  return (
                    <tr key={ord.id}>
                      <td>
                        <strong style={{ color: "#007185", fontFamily: "monospace" }}>
                          #{ord.id}
                        </strong>
                      </td>
                      <td>
                        <div>
                          <strong>{ord.customer}</strong>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            Standard Delivery
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong className="amazon-price-bold">
                          ₹{Number(ord.total || 0).toLocaleString("en-IN")}
                        </strong>
                      </td>
                      <td>
                        <span className={badgeClass}>
                          {ord.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. QUICK NAVIGATION TILES */}
      <div className="amazon-quick-links-area">
        <h3 className="quick-links-header">Seller Central Management Shortcuts</h3>
        <div className="quick-tiles-grid">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              className="quick-tile-btn"
              onClick={() => onNavigate(link.id)}
            >
              <span className="tile-icon">{link.icon}</span>
              <span className="tile-label">{link.label}</span>
              <span className="tile-desc">{link.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
