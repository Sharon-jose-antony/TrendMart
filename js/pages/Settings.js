/* ========================================================
   TRENDMART - MODULE 8: SETTINGS COMPONENT
   Native React 18 / In-Browser Babel Standalone Architecture
======================================================== */

window.Settings = function Settings({ onNavigate }) {
  const { useState, useEffect } = React;
  const { KEYS } = window.StorageAPI || { KEYS: { THEME: "tm_theme" } };

  // Current theme state
  const [currentTheme, setCurrentTheme] = useState(() => {
    return (
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("tm_theme") ||
      "light"
    );
  });

  // Admin profile state
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@trendmart.in",
    role: "Super Admin",
  });

  // Store settings state
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tm_store_settings"));
      return (
        saved || {
          storeName: "TrendMart E-Commerce",
          currency: "INR",
          lowStockThreshold: 10,
          contactEmail: "admin@trendmart.in",
          autoInvoice: true,
        }
      );
    } catch {
      return {
        storeName: "TrendMart E-Commerce",
        currency: "INR",
        lowStockThreshold: 10,
        contactEmail: "admin@trendmart.in",
        autoInvoice: true,
      };
    }
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Load existing profile from storage
  useEffect(() => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem("tm_admin_profile"));
      if (savedProfile) {
        setProfile((prev) => ({ ...prev, ...savedProfile }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Theme changer handler
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(KEYS.THEME || "tm_theme", newTheme);

    // Notify app.js or topbar
    window.dispatchEvent(
      new CustomEvent("tm-theme-updated", { detail: { theme: newTheme } })
    );
  };

  // Handle form change for store preferences
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStoreSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save store settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem("tm_store_settings", JSON.stringify(storeSettings));
    setSaveMessage("Store preferences saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // Perform secure logout
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setIsLoggedOut(true);

    // Clear session-specific flag without deleting business data
    sessionStorage.clear();
    localStorage.removeItem("tm_active_session");

    // Notification toast/state
    setTimeout(() => {
      // If a login page exists or tab can be reset
      if (typeof onNavigate === "function") {
        onNavigate("dashboard");
      }
      setIsLoggedOut(false);
    }, 1500);
  };

  const avatarInitial = (profile.name || "A").trim().charAt(0).toUpperCase();

  return (
    <div className="settings-container">
      {/* PAGE HEADER */}
      <div className="settings-header">
        <div>
          <h2>Store & System Settings</h2>
          <p>Configure theme appearance, store defaults, and session security.</p>
        </div>
      </div>

      {saveMessage && (
        <div className="settings-success-alert">
          <span>✓ {saveMessage}</span>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 700 }}
            onClick={() => setSaveMessage("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* SECTION 1: APPEARANCE & THEME */}
      <div className="settings-card">
        <h3 className="settings-section-title">
          <span>🎨</span>
          <span>Appearance & Visual Theme</span>
        </h3>
        <p className="settings-section-subtitle">
          Select your desired theme mode. Changes apply immediately across all modules, sidebar, and modals.
        </p>

        <div className="theme-selector-grid">
          {/* Light Theme Card */}
          <div
            className={`theme-card-option ${currentTheme === "light" ? "selected" : ""}`}
            onClick={() => handleThemeChange("light")}
          >
            <div className="theme-preview-mockup mockup-light">
              <div className="mock-sidebar">
                <div className="mock-sidebar-line active"></div>
                <div className="mock-sidebar-line"></div>
                <div className="mock-sidebar-line"></div>
              </div>
              <div className="mock-content">
                <div className="mock-card"></div>
              </div>
            </div>

            <div className="theme-card-info">
              <div className="theme-card-text">
                <h4>☀️ Light Mode</h4>
                <p>Clean, high-contrast, modern daylight palette</p>
              </div>
              <div className="theme-check-badge">
                {currentTheme === "light" ? "✓" : ""}
              </div>
            </div>
          </div>

          {/* Dark Theme Card */}
          <div
            className={`theme-card-option ${currentTheme === "dark" ? "selected" : ""}`}
            onClick={() => handleThemeChange("dark")}
          >
            <div className="theme-preview-mockup mockup-dark">
              <div className="mock-sidebar">
                <div className="mock-sidebar-line active"></div>
                <div className="mock-sidebar-line"></div>
                <div className="mock-sidebar-line"></div>
              </div>
              <div className="mock-content">
                <div className="mock-card"></div>
              </div>
            </div>

            <div className="theme-card-info">
              <div className="theme-card-text">
                <h4>🌙 Dark Mode</h4>
                <p>Deep obsidian theme optimized for low-light environments</p>
              </div>
              <div className="theme-check-badge">
                {currentTheme === "dark" ? "✓" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: STORE PREFERENCES */}
      <div className="settings-card">
        <h3 className="settings-section-title">
          <span>🏬</span>
          <span>Store & Catalog Preferences</span>
        </h3>
        <p className="settings-section-subtitle">
          Configure default regional settings and inventory stock warning thresholds.
        </p>

        <form onSubmit={handleSaveSettings} className="settings-form-grid">
          <div className="settings-input-group">
            <label>Store Brand Name</label>
            <input
              type="text"
              name="storeName"
              value={storeSettings.storeName}
              onChange={handleSettingChange}
              required
            />
          </div>

          <div className="settings-input-group">
            <label>Display Currency</label>
            <select
              name="currency"
              value={storeSettings.currency}
              onChange={handleSettingChange}
            >
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
            </select>
          </div>

          <div className="settings-input-group">
            <label>Low Stock Warning Threshold (units)</label>
            <input
              type="number"
              name="lowStockThreshold"
              min="1"
              max="100"
              value={storeSettings.lowStockThreshold}
              onChange={handleSettingChange}
            />
          </div>

          <div className="settings-input-group">
            <label>Store Support & Alerts Email</label>
            <input
              type="email"
              name="contactEmail"
              value={storeSettings.contactEmail}
              onChange={handleSettingChange}
            />
          </div>

          <div className="settings-full-width settings-actions-row">
            <button type="submit" className="btn btn-primary">
              Save Store Preferences
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: SESSION & LOGOUT */}
      <div className="settings-card">
        <h3 className="settings-section-title">
          <span>🔐</span>
          <span>Administrator Session & Security</span>
        </h3>
        <p className="settings-section-subtitle">
          Manage your active administration login session and security sign-out.
        </p>

        <div className="session-user-box">
          <div className="session-user-left">
            <div className="session-avatar">{avatarInitial}</div>
            <div className="session-user-details">
              <h4>
                {profile.name} <span className="session-badge-role">{profile.role}</span>
              </h4>
              <p>{profile.email} • Active Session Established</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-logout-danger"
            onClick={() => setShowLogoutModal(true)}
          >
            <span>🚪</span>
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div
          className="settings-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
        >
          <div className="settings-modal-box">
            <div className="modal-icon-danger">⚠️</div>
            <h3>Confirm Sign Out</h3>
            <p>
              Are you sure you want to end your current administrative session?
            </p>

            <div className="modal-notice-banner">
              <span>🛡️</span>
              <span>
                <strong>Data Safe:</strong> Your store catalog, orders, and customer records will remain fully preserved and untouched.
              </span>
            </div>

            <div className="modal-actions-pair">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-delete"
                onClick={handleConfirmLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT SUCCESS NOTIFICATION */}
      {isLoggedOut && (
        <div className="settings-modal-overlay">
          <div className="settings-modal-box" style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2.5rem",
                color: "#059669",
                marginBottom: "0.75rem",
              }}
            >
              ✓
            </div>
            <h3>Session Successfully Ended</h3>
            <p>You have been safely signed out. Returning to dashboard overview...</p>
          </div>
        </div>
      )}
    </div>
  );
};
