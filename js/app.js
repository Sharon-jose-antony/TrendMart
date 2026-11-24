const { useState, useEffect } = React;

const DEFAULT_ADMIN_PROFILE = {
  name: "Admin User",
  email: "admin@trendmart.in",
  role: "Super Admin",
  phone: "+91 98765 43210",
};

function getSavedAdminProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem("tm_admin_profile"));
    return saved ? { ...DEFAULT_ADMIN_PROFILE, ...saved } : DEFAULT_ADMIN_PROFILE;
  } catch {
    return DEFAULT_ADMIN_PROFILE;
  }
}

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem(window.StorageAPI.KEYS.THEME) || "light"
  );
  const [adminProfile, setAdminProfile] = useState(getSavedAdminProfile);

  useEffect(() => {
    window.StorageAPI.init();
    setAdminProfile(getSavedAdminProfile());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(window.StorageAPI.KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    const syncProfile = () => setAdminProfile(getSavedAdminProfile());
    const syncTheme = (e) => {
      if (e.detail && e.detail.theme) {
        setTheme(e.detail.theme);
      }
    };

    window.addEventListener("tm-profile-updated", syncProfile);
    window.addEventListener("tm-theme-updated", syncTheme);
    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener("tm-profile-updated", syncProfile);
      window.removeEventListener("tm-theme-updated", syncTheme);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const displayName = (adminProfile.name || "Admin User").trim();
  const avatarInitial = displayName.charAt(0).toUpperCase() || "A";

  return (
    <div className="app-layout">
      <window.Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <h1 className="topbar-title">{activeTab}</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              title={`${displayName} (${adminProfile.role})`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.35rem 0.75rem 0.35rem 0.4rem",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                background: "var(--bg-main)",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {avatarInitial}
              </span>
              <span>{displayName}</span>
            </button>

            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
        </header>

        <main className="content-area">
          {activeTab === "dashboard" && (
            <window.Dashboard onNavigate={setActiveTab} />
          )}

          {activeTab === "categories" && <window.Categories />}

          {activeTab === "customers" && <window.Customers />}

          {activeTab === "orders" && <window.Orders />}

          {activeTab === "products" && <window.Products />}

          {activeTab === "banners" && <window.Banners />}

          {activeTab === "profile" && <window.Profile />}

          {activeTab === "settings" && (
            <window.Settings onNavigate={setActiveTab} />
          )}

          {![
            "dashboard",
            "customers",
            "orders",
            "products",
            "banners",
            "profile",
            "settings",
          ].includes(activeTab) && (
            <div className="placeholder-box">
              <h2>{activeTab.toUpperCase()} Module</h2>
              <p>Ready to build next.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
