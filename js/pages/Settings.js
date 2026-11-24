/* ========================================================
   TRENDMART - MODULE 8: AMAZON SELLER CENTRAL SETTINGS
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

  // Seller profile state
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@trendmart.in",
    role: "Primary Account Owner",
    merchantId: "TM-IN-889421",
  });

  // Store settings state
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tm_store_settings"));
      return (
        saved || {
          storeName: "TrendMart E-Commerce Official",
          marketplace: "IN - India (TrendMart.in)",
          currency: "INR",
          lowStockThreshold: 10,
          contactEmail: "admin@trendmart.in",
          fulfillmentChannel: "TrendMart Express & Prime FBA",
        }
      );
    } catch {
      return {
        storeName: "TrendMart E-Commerce Official",
        marketplace: "IN - India (TrendMart.in)",
        currency: "INR",
        lowStockThreshold: 10,
        contactEmail: "admin@trendmart.in",
        fulfillmentChannel: "TrendMart Express & Prime FBA",
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

  // Handle form change
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
    setSaveMessage("Seller Central preferences updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // Logout handler
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setIsLoggedOut(true);

    sessionStorage.clear();
    localStorage.removeItem("tm_active_session");

    setTimeout(() => {
      if (typeof onNavigate === "function") {
        onNavigate("dashboard");
      }
      setIsLoggedOut(false);
    }, 1500);
  };

  const avatarInitial = (profile.name || "A").trim().charAt(0).toUpperCase();

  return (
    <div className="settings-container">
      {/* 1. SELLER CENTRAL SETTINGS HEADER */}
      <div className="settings-header-banner">
        <div className="seller-settings-info">
          <h2>
            <span>Seller Central Account & Store Settings</span>
            <span className="seller-token-pill">TOKEN: {profile.merchantId || "TM-IN-889421"}</span>
          </h2>
          <p>Configure theme appearance, marketplace fulfillment, catalog preferences, and security access.</p>
        </div>
      </div>

      {saveMessage && (
        <div className="amazon-safe-banner" style={{ fontSize: "0.9rem" }}>
          <span>✓ {saveMessage}</span>
        </div>
      )}

      {/* 2. THEME & APPEARANCE */}
      <div className="amazon-settings-card">
        <div className="amazon-card-header">
          <h3>
            <span>🎨</span>
            <span>Display Theme & Seller Central Appearance</span>
          </h3>
          <p>Choose your workspace theme. Changes apply seamlessly across all dashboards, tables, and dialogs.</p>
        </div>

        <div className="amazon-theme-grid">
          {/* Light Mode */}
          <div
            className={`amazon-theme-tile ${currentTheme === "light" ? "active-theme" : ""}`}
            onClick={() => handleThemeChange("light")}
          >
            <div className="mockup-frame mockup-light-theme">
              <div className="side-pane">
                <div className="side-bar-item amber"></div>
                <div className="side-bar-item"></div>
                <div className="side-bar-item"></div>
              </div>
              <div className="main-pane">
                <div className="mock-widget"></div>
              </div>
            </div>

            <div className="theme-tile-label-row">
              <div className="theme-name-group">
                <h4>☀️ Amazon Prime Daylight</h4>
                <p>High-contrast, clean professional e-commerce palette</p>
              </div>
              <div className="radio-check-bubble">
                {currentTheme === "light" ? "✓" : ""}
              </div>
            </div>
          </div>

          {/* Dark Mode */}
          <div
            className={`amazon-theme-tile ${currentTheme === "dark" ? "active-theme" : ""}`}
            onClick={() => handleThemeChange("dark")}
          >
            <div className="mockup-frame mockup-dark-theme">
              <div className="side-pane">
                <div className="side-bar-item amber"></div>
                <div className="side-bar-item"></div>
                <div className="side-bar-item"></div>
              </div>
              <div className="main-pane">
                <div className="mock-widget"></div>
              </div>
            </div>

            <div className="theme-tile-label-row">
              <div className="theme-name-group">
                <h4>🌙 Obsidian Night Mode</h4>
                <p>Deep dark palette optimized for evening monitoring</p>
              </div>
              <div className="radio-check-bubble">
                {currentTheme === "dark" ? "✓" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STORE & FULFILLMENT PREFERENCES */}
      <div className="amazon-settings-card">
        <div className="amazon-card-header">
          <h3>
            <span>🏬</span>
            <span>Storefront & Merchant Fulfillment Settings</span>
          </h3>
          <p>Set regional marketplace parameters, currency formatting, and safety thresholds.</p>
        </div>

        <form onSubmit={handleSaveSettings} className="merchant-form-grid">
          <div className="merchant-field-group">
            <label>Legal Merchant Store Name</label>
            <input
              type="text"
              name="storeName"
              value={storeSettings.storeName}
              onChange={handleSettingChange}
              required
            />
          </div>

          <div className="merchant-field-group">
            <label>Primary Marketplace</label>
            <select
              name="marketplace"
              value={storeSettings.marketplace}
              onChange={handleSettingChange}
            >
              <option value="IN - India (TrendMart.in)">IN - India (TrendMart.in)</option>
              <option value="US - United States (TrendMart.com)">US - United States (TrendMart.com)</option>
              <option value="EU - European Union (TrendMart.eu)">EU - European Union (TrendMart.eu)</option>
            </select>
          </div>

          <div className="merchant-field-group">
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

          <div className="merchant-field-group">
            <label>Low-Stock Restock Warning Level (units)</label>
            <input
              type="number"
              name="lowStockThreshold"
              min="1"
              max="100"
              value={storeSettings.lowStockThreshold}
              onChange={handleSettingChange}
            />
          </div>

          <div className="merchant-field-group merchant-full-row">
            <label>Default Fulfillment Channel</label>
            <select
              name="fulfillmentChannel"
              value={storeSettings.fulfillmentChannel}
              onChange={handleSettingChange}
            >
              <option value="TrendMart Express & Prime FBA">TrendMart Express & Prime FBA (Recommended)</option>
              <option value="Merchant Fulfilled Network (MFN)">Merchant Fulfilled Network (MFN)</option>
            </select>
          </div>

          <div className="merchant-field-group merchant-full-row">
            <label>Merchant Support & Notification Email</label>
            <input
              type="email"
              name="contactEmail"
              value={storeSettings.contactEmail}
              onChange={handleSettingChange}
            />
          </div>

          <div className="merchant-full-row merchant-btn-bar">
            <button type="submit" className="btn-amazon-primary">
              Save Merchant Settings
            </button>
          </div>
        </form>
      </div>

      {/* 4. SECURITY & SESSION */}
      <div className="amazon-settings-card">
        <div className="amazon-card-header">
          <h3>
            <span>🔐</span>
            <span>Seller Account Access & Security Sign-Out</span>
          </h3>
          <p>Manage your authorized administrative session and security credentials.</p>
        </div>

        <div className="session-card-content">
          <div className="session-badge-info">
            <div className="avatar-initial-box">{avatarInitial}</div>
            <div className="session-text">
              <h4>
                {profile.name}
                <span className="tag-owner">Primary Owner</span>
              </h4>
              <p>{profile.email} • Authenticated via Two-Factor Security</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-amazon-danger"
            onClick={() => setShowLogoutModal(true)}
          >
            <span>🚪</span>
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>

      {/* 5. LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div
          className="amazon-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
        >
          <div className="amazon-modal-card">
            <div className="amazon-modal-icon">⚠️</div>
            <h3>End Seller Central Session?</h3>
            <p>
              Are you sure you want to sign out of TrendMart Seller Central? You will be returned to the store overview.
            </p>

            <div className="amazon-safe-banner">
              <span>🛡️</span>
              <span>
                <strong>Catalog & Order Safe:</strong> Your listings, customer records, and active orders are securely preserved.
              </span>
            </div>

            <div className="amazon-modal-actions">
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
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. LOGOUT NOTIFICATION */}
      {isLoggedOut && (
        <div className="amazon-modal-overlay">
          <div className="amazon-modal-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", color: "#067d62", marginBottom: "0.5rem" }}>
              ✓
            </div>
            <h3>Signed Out Successfully</h3>
            <p>Your session has ended safely. Redirecting...</p>
          </div>
        </div>
      )}
    </div>
  );
};
