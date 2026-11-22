const { useState, useEffect } = React;

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem(window.StorageAPI.KEYS.THEME) || "light"
  );

  useEffect(() => {
    window.StorageAPI.init();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(window.StorageAPI.KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

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

          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </header>

        <main className="content-area">
          {activeTab === "dashboard" ? (
            <window.Dashboard onNavigate={setActiveTab} />
          ) : activeTab === "products" ? (
            <window.Products />
          ) : (
            <div className="placeholder-box">
              <h2>{activeTab.toUpperCase()} Module</h2>
              <p style={{ marginTop: "0.5rem" }}>
                Ready to build next.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);