window.Dashboard = function Dashboard({ onNavigate }) {
  const { useState, useEffect } = React;
  const { KEYS, get } = window.StorageAPI;

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    customers: 0,
    orders: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const products = get(KEYS.PRODUCTS);
    const categories = get(KEYS.CATEGORIES);
    const customers = get(KEYS.CUSTOMERS);
    const orders = get(KEYS.ORDERS);

    setStats({
      products: products.length,
      categories: categories.length,
      customers: customers.length,
      orders: orders.length,
    });

    setRecentProducts([...products].reverse().slice(0, 5));
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.products, icon: "📦" },
    { label: "Total Categories", value: stats.categories, icon: "🗂️" },
    { label: "Total Customers", value: stats.customers, icon: "👥" },
    { label: "Total Orders", value: stats.orders, icon: "🛒" },
  ];

  const quickLinks = [
    { id: "categories", label: "Manage Categories" },
    { id: "products", label: "Manage Products" },
    { id: "orders", label: "View Orders" },
    { id: "banners", label: "Promo Banners" },
  ];

  return (
    <div>
      {/* KPI Totals */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <div>
              <p className="stat-label">{card.label}</p>
              <p className="stat-value">{card.value}</p>
            </div>
            <div className="stat-icon">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Quick Navigation */}
      <h2 className="section-title">Quick Navigation</h2>
      <div className="quick-nav-grid">
        {quickLinks.map((link) => (
          <button
            key={link.id}
            className="quick-card"
            onClick={() => onNavigate(link.id)}
          >
            <span>{link.label}</span>
            <span>→</span>
          </button>
        ))}
      </div>

      {/* Recently Added Products */}
      <h2 className="section-title">Recently Added Products</h2>
      <div className="table-card">
        {recentProducts.length === 0 ? (
          <p style={{ padding: "1rem", color: "var(--text-muted)" }}>
            No products added yet.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="product-cell">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-thumb"
                      />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>₹{Number(item.price).toLocaleString("en-IN")}</td>
                  <td>{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};