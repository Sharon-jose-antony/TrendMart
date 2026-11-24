window.Sidebar = function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "categories", label: "Categories", icon: "🗂️" },
    { id: "products", label: "Products", icon: "📦" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "banners", label: "Banners", icon: "🖼️" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <span>TrendMart</span>
        <button className="close-btn" onClick={onClose} aria-label="Close menu">
          ✕
        </button>
      </div>

      <ul className="nav-list">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <a 
          href="http://localhost:3001" 
          target="_blank" 
          style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
        >
          <span>🛍️</span>
          <span>Customer Store (3001) ↗</span>
        </a>
        <a 
          href="http://localhost:3002" 
          target="_blank" 
          style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
        >
          <span>💼</span>
          <span>Seller Hub (3002) ↗</span>
        </a>
      </div>
    </aside>
  );
};