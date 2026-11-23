/* ========================================================
   TRENDMART - MODULE 1: DASHBOARD COMPONENT
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

  // Load data from unified window.StorageAPI
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

    try {
      const savedProfile = JSON.parse(localStorage.getItem("tm_admin_profile"));
      if (savedProfile && savedProfile.name) {
        setAdminName(savedProfile.name);
      }
    } catch (e) {
      // fallback to default
    }
  }, []);

  // Compute total revenue and metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + Number(ord.total || 0), 0);
  }, [orders]);

  const avgOrderValue = useMemo(() => {
    if (!orders.length) return 0;
    return Math.round(totalRevenue / orders.length);
  }, [orders, totalRevenue]);

  // Identify low-stock inventory (stock <= 10)
  const lowStockItems = useMemo(() => {
    return products.filter((p) => Number(p.stock) <= 10);
  }, [products]);

  // Today's formatted date
  const todayFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Time-range specific sales chart datasets
  const chartData = useMemo(() => {
    if (timeRange === "7D") {
      return [
        { label: "Mon", revenue: 14500, orders: 4 },
        { label: "Tue", revenue: 22800, orders: 6 },
        { label: "Wed", revenue: 19400, orders: 5 },
        { label: "Thu", revenue: 31200, orders: 8 },
        { label: "Fri", revenue: 28900, orders: 7 },
        { label: "Sat", revenue: 42500, orders: 12 },
        { label: "Sun", revenue: 36800, orders: 10 },
      ];
    } else if (timeRange === "30D") {
      return [
        { label: "Week 1", revenue: 98000, orders: 28 },
        { label: "Week 2", revenue: 135000, orders: 39 },
        { label: "Week 3", revenue: 124000, orders: 34 },
        { label: "Week 4", revenue: 168000, orders: 46 },
      ];
    } else {
      return [
        { label: "Q1", revenue: 340000, orders: 95 },
        { label: "Q2", revenue: 420000, orders: 118 },
        { label: "Q3", revenue: 390000, orders: 104 },
        { label: "Q4", revenue: 560000, orders: 152 },
      ];
    }
  }, [timeRange]);

  // Chart SVG Coordinates Calculation
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

    return { points, linePath, areaPath, width, height, padding, maxRev };
  }, [chartData]);

  // Stat cards definition
  const statCards = [
    {
      id: "products",
      label: "Total Products",
      value: products.length,
      icon: "📦",
      trend: "+8% this month",
      navTab: "products",
    },
    {
      id: "categories",
      label: "Total Categories",
      value: categories.length,
      icon: "🗂️",
      trend: "All catalog active",
      navTab: "categories",
    },
    {
      id: "customers",
      label: "Total Customers",
      value: customers.length,
      icon: "👥",
      trend: "+15% new users",
      navTab: "customers",
    },
    {
      id: "orders",
      label: "Total Orders",
      value: orders.length,
      icon: "🛒",
      trend: `₹${totalRevenue.toLocaleString("en-IN")} vol`,
      navTab: "orders",
    },
  ];

  // Quick navigation deck
  const quickLinks = [
    {
      id: "products",
      label: "Products",
      desc: "Manage catalog & stock",
      icon: "📦",
    },
    {
      id: "categories",
      label: "Categories",
      desc: "Organize taxonomy",
      icon: "🗂️",
    },
    {
      id: "customers",
      label: "Customers",
      desc: "View buyer directory",
      icon: "👥",
    },
    {
      id: "orders",
      label: "Orders",
      desc: "Track & fulfill sales",
      icon: "🛒",
    },
    {
      id: "banners",
      label: "Banners",
      desc: "Storefront campaigns",
      icon: "🖼️",
    },
  ];

  // Recent 5 products
  const recentProductsList = useMemo(() => {
    return [...products].reverse().slice(0, 5);
  }, [products]);

  // Recent 5 orders
  const recentOrdersList = useMemo(() => {
    return [...orders].reverse().slice(0, 5);
  }, [orders]);

  return (
    <div className="dashboard-container">
      {/* SECTION A: WELCOME HERO */}
      <div className="welcome-hero">
        <div className="welcome-content">
          <h2>Welcome back, {adminName} 👋</h2>
          <p>
            Here is what is happening across TrendMart today. All systems and store modules are operational.
          </p>
        </div>
        <div className="welcome-actions">
          <div className="welcome-date-badge">
            <span>📅</span>
            <span>{todayFormatted}</span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate("products")}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* SECTION B: STATISTICS KPI CARDS */}
      <div className="stats-grid-dashboard">
        {statCards.map((card) => (
          <div
            key={card.id}
            className="dashboard-stat-card"
            onClick={() => onNavigate(card.navTab)}
            title={`Click to view ${card.label}`}
          >
            <div className="stat-metric-wrap">
              <span className="stat-label-text">{card.label}</span>
              <span className="stat-number-text">{card.value}</span>
              <span className="stat-trend-pill trend-up">
                <span>↗</span>
                <span>{card.trend}</span>
              </span>
            </div>
            <div className="stat-icon-wrapper">
              <span>{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION G: INVENTORY HEALTH & LOW STOCK ALERT */}
      {lowStockItems.length > 0 && (
        <div className="inventory-alert-card">
          <div className="inventory-alert-left">
            <div className="inventory-alert-icon">⚠️</div>
            <div className="inventory-alert-text">
              <h4>Inventory Attention Needed ({lowStockItems.length} Low-Stock Products)</h4>
              <p>Items have 10 or fewer units remaining. Restock to prevent lost sales.</p>
            </div>
          </div>
          <div className="inventory-alert-tags">
            {lowStockItems.slice(0, 3).map((item) => (
              <span key={item.id} className="low-stock-chip">
                {item.name}: <strong>{item.stock} left</strong>
              </span>
            ))}
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onNavigate("products")}
            >
              Manage Inventory →
            </button>
          </div>
        </div>
      )}

      {/* SECTION C: SALES ANALYTICS & INTERACTIVE CHART */}
      <div className="analytics-section-card">
        <div className="analytics-header-row">
          <div className="analytics-title-group">
            <h3>Sales & Revenue Performance</h3>
            <p>Real-time transaction tracking across customer checkouts</p>
          </div>

          <div className="filter-btn-group">
            <button
              className={`filter-pill-btn ${timeRange === "7D" ? "active" : ""}`}
              onClick={() => setTimeRange("7D")}
            >
              Past 7 Days
            </button>
            <button
              className={`filter-pill-btn ${timeRange === "30D" ? "active" : ""}`}
              onClick={() => setTimeRange("30D")}
            >
              Past 30 Days
            </button>
            <button
              className={`filter-pill-btn ${timeRange === "YTD" ? "active" : ""}`}
              onClick={() => setTimeRange("YTD")}
            >
              Year to Date
            </button>
          </div>
        </div>

        {/* Metric summary pills */}
        <div className="chart-summary-pills">
          <div className="summary-metric-box">
            <span>Period Revenue</span>
            <strong>₹{totalRevenue ? (totalRevenue * (timeRange === "7D" ? 1 : timeRange === "30D" ? 3.5 : 8)).toLocaleString("en-IN") : "₹78,450"}</strong>
          </div>
          <div className="summary-metric-box">
            <span>Avg. Order Value</span>
            <strong>₹{avgOrderValue ? avgOrderValue.toLocaleString("en-IN") : "₹2,140"}</strong>
          </div>
          <div className="summary-metric-box">
            <span>Store Conversion Rate</span>
            <strong>3.84%</strong>
          </div>
        </div>

        {/* SVG Interactive Chart */}
        <div className="svg-chart-wrapper">
          <svg
            className="chart-svg"
            viewBox={`0 0 ${chartCoordinates.width} ${chartCoordinates.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="dashboardChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Guidelines */}
            <line
              x1={chartCoordinates.padding}
              y1="30"
              x2={chartCoordinates.width - chartCoordinates.padding}
              y2="30"
              className="chart-grid-line"
            />
            <line
              x1={chartCoordinates.padding}
              y1="85"
              x2={chartCoordinates.width - chartCoordinates.padding}
              y2="85"
              className="chart-grid-line"
            />
            <line
              x1={chartCoordinates.padding}
              y1={chartCoordinates.height - chartCoordinates.padding}
              x2={chartCoordinates.width - chartCoordinates.padding}
              y2={chartCoordinates.height - chartCoordinates.padding}
              className="chart-grid-line"
            />

            {/* Area Fill */}
            <path d={chartCoordinates.areaPath} className="chart-area-fill" />

            {/* Stroke Line */}
            <path d={chartCoordinates.linePath} className="chart-line-stroke" />

            {/* Interactive Data Points & Labels */}
            {chartCoordinates.points.map((pt, idx) => (
              <g key={idx}>
                <text
                  x={pt.x}
                  y={chartCoordinates.height - 8}
                  textAnchor="middle"
                  className="chart-axis-label"
                >
                  {pt.label}
                </text>

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  className="chart-dot"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {hoveredPoint && hoveredPoint.label === pt.label && (
                  <g>
                    <rect
                      x={pt.x - 45}
                      y={pt.y - 36}
                      width="90"
                      height="26"
                      rx="6"
                      fill="var(--bg-sidebar)"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 19}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10.5"
                      fontWeight="700"
                    >
                      ₹{pt.revenue.toLocaleString("en-IN")}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* SECTION D & E: RECENT PRODUCTS & RECENT ORDERS TABLE PAIR */}
      <div className="dashboard-tables-grid">
        {/* RECENT PRODUCTS */}
        <div className="dashboard-panel-card">
          <div className="panel-header">
            <h3>
              <span>📦</span>
              <span>Recent Products</span>
            </h3>
            <button
              className="panel-view-all-btn"
              onClick={() => onNavigate("products")}
            >
              View Catalog →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            {recentProductsList.length === 0 ? (
              <div className="empty-state" style={{ padding: "2rem" }}>
                <i>📦</i>
                <p>No products in store catalog yet.</p>
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProductsList.map((p) => {
                    const isLow = Number(p.stock) <= 10;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="product-cell-flex">
                            <img
                              src={p.image || "https://via.placeholder.com/40?text=Item"}
                              alt={p.name}
                              className="product-thumb-small"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/40?text=Item";
                              }}
                            />
                            <div className="product-cell-text">
                              <span className="product-cell-name">{p.name}</span>
                              <span className="product-cell-category">ID: #{p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>{p.category || "General"}</td>
                        <td>
                          <strong>₹{Number(p.price || 0).toLocaleString("en-IN")}</strong>
                        </td>
                        <td>
                          <span
                            className={`stock-badge ${isLow ? "low-stock" : "in-stock"}`}
                          >
                            {isLow ? `Low Stock (${p.stock})` : `In Stock (${p.stock})`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="dashboard-panel-card">
          <div className="panel-header">
            <h3>
              <span>🛒</span>
              <span>Recent Orders</span>
            </h3>
            <button
              className="panel-view-all-btn"
              onClick={() => onNavigate("orders")}
            >
              All Orders →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            {recentOrdersList.length === 0 ? (
              <div className="empty-state" style={{ padding: "2rem" }}>
                <i>🛒</i>
                <p>No customer orders recorded yet.</p>
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrdersList.map((ord) => {
                    const statusClass = String(ord.status || "pending").toLowerCase();
                    return (
                      <tr key={ord.id}>
                        <td>
                          <strong>{ord.id}</strong>
                        </td>
                        <td>{ord.customer}</td>
                        <td>
                          <strong>₹{Number(ord.total || 0).toLocaleString("en-IN")}</strong>
                        </td>
                        <td>
                          <span className={`order-status ${statusClass}`}>
                            {ord.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* SECTION F: QUICK NAVIGATION */}
      <div className="quick-nav-section">
        <h3 className="quick-nav-title">Quick Module Navigation</h3>
        <div className="quick-nav-cards-row">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              className="quick-nav-item"
              onClick={() => onNavigate(link.id)}
            >
              <span className="quick-nav-icon">{link.icon}</span>
              <span className="quick-nav-label">{link.label}</span>
              <span className="quick-nav-desc">{link.desc}</span>
              <span className="quick-nav-arrow">Open Module →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
