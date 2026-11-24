/* ========================================================
   TRENDMART - PROFESSIONAL SIDEBAR NAVIGATION
   Native React 18 / In-Browser Babel Standalone Architecture
======================================================== */

// Professional Brand Logo supporting Light and Dark modes
function BrandLogo() {
  const [theme, setTheme] = React.useState(() => {
    return document.documentElement.getAttribute("data-theme") || "light";
  });

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(current);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const handleThemeUpdate = (e) => {
      if (e.detail && e.detail.theme) setTheme(e.detail.theme);
    };
    window.addEventListener("tm-theme-updated", handleThemeUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("tm-theme-updated", handleThemeUpdate);
    };
  }, []);

  const logoSrc = theme === "dark" ? "assets/logo-dark.png" : "assets/logo-light.png";

  return (
    <div className="sidebar-brand-wrap">
      <img
        src={logoSrc}
        alt="TrendMart - Shop Smarter, Live Better"
        className="sidebar-brand-image"
      />
    </div>
  );
}

// Professional SVG Icons
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  Categories: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  ),
  Products: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  Customers: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Orders: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  ),
  Banners: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  Profile: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

window.Sidebar = function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", Icon: Icons.Dashboard },
    { id: "categories", label: "Categories", Icon: Icons.Categories },
    { id: "products", label: "Products", Icon: Icons.Products },
    { id: "customers", label: "Customers", Icon: Icons.Customers },
    { id: "orders", label: "Orders", Icon: Icons.Orders },
    { id: "banners", label: "Banners", Icon: Icons.Banners },
    { id: "profile", label: "Profile", Icon: Icons.Profile },
    { id: "settings", label: "Settings", Icon: Icons.Settings },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <BrandLogo />
        <button className="close-btn" onClick={onClose} aria-label="Close menu">
          ✕
        </button>
      </div>

      <ul className="nav-list">
        {menuItems.map((item) => {
          const ItemIcon = item.Icon;
          return (
            <li key={item.id}>
              <button
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
              >
                <ItemIcon />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
