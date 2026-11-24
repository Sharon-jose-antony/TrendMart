window.Profile = function Profile() {
  const { useState, useEffect } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
  const DEFAULT_AVATAR =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=85";

  const DEFAULT_PROFILE = {
    fullName: "Admin 1",
    email: "admin@trendmart.in",
    role: "Store Administrator",
    accessCode: "TrendMart#2026",
    avatar: DEFAULT_AVATAR,
    lastUpdated: "Initial Admin Session",
  };

  const [form, setForm] = useState(DEFAULT_PROFILE);
  const [confirmAccessCode, setConfirmAccessCode] = useState(
    DEFAULT_PROFILE.accessCode
  );
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFileName, setAvatarFileName] = useState("Current admin photo");
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const stored = get ? get(KEYS.PROFILE) : null;
    if (stored && typeof stored === "object" && !Array.isArray(stored)) {
      const merged = {
        ...DEFAULT_PROFILE,
        ...stored,
        avatar: stored.avatar || DEFAULT_AVATAR,
      };
      setForm(merged);
      setConfirmAccessCode(merged.accessCode || "");
    }
  }, []);

  function broadcastProfileUpdate(profileData) {
    window.dispatchEvent(
      new CustomEvent("trendmart:profile-updated", { detail: profileData })
    );
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setStatusMessage("");
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleFieldBlur(field) {
    const validationErrors = validateForm();
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  }

  function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Please select a valid image file (PNG, JPG, or WEBP).",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Admin profile photo must be 2 MB or smaller.",
      }));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextProfile = { ...form, avatar: reader.result };
      setForm(nextProfile);
      setAvatarFileName(file.name);
      setStatusMessage("");
      setErrors((prev) => {
        const next = { ...prev };
        delete next.avatar;
        return next;
      });
      try {
        save(KEYS.PROFILE, nextProfile);
      } catch {
        // Ignore storage errors until form save
      }
      broadcastProfileUpdate(nextProfile);
    };
    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        avatar: "Unable to read the selected profile photo.",
      }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handleResetAvatar() {
    const nextProfile = { ...form, avatar: DEFAULT_AVATAR };
    setForm(nextProfile);
    setAvatarFileName("Default admin avatar");
    setErrors((prev) => {
      const next = { ...prev };
      delete next.avatar;
      return next;
    });
    try {
      save(KEYS.PROFILE, nextProfile);
    } catch {
      // Ignore storage errors until form save
    }
    broadcastProfileUpdate(nextProfile);
  }

  function validateForm() {
    const nextErrors = {};
    const trimmedName = String(form.fullName || "").trim();
    const trimmedEmail = String(form.email || "").trim();
    const trimmedRole = String(form.role || "").trim();
    const code = String(form.accessCode || "");
    const confirmCode = String(confirmAccessCode || "");

    if (!trimmedName) {
      nextErrors.fullName = "Admin name is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.fullName = "Admin name must be at least 2 characters.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Admin email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address (e.g. admin@trendmart.in).";
    }

    if (!trimmedRole) {
      nextErrors.role = "Admin role is required.";
    }

    if (!code.trim()) {
      nextErrors.accessCode = "Admin password / access key is required.";
    } else if (code.length < 6) {
      nextErrors.accessCode = "Must be at least 6 characters long.";
    }

    if (!confirmCode.trim()) {
      nextErrors.confirmAccessCode = "Please confirm your password / access key.";
    } else if (code !== confirmCode) {
      nextErrors.confirmAccessCode = "Passwords / access keys do not match.";
    }

    if (!String(form.avatar || "").trim()) {
      nextErrors.avatar = "Please upload or keep an admin profile photo.";
    }

    return nextErrors;
  }

  function handleSaveProfile(event) {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatusMessage("");
      return;
    }

    const updatedProfile = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      accessCode: form.accessCode,
      avatar: form.avatar,
      lastUpdated: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      save(KEYS.PROFILE, updatedProfile);
      setForm(updatedProfile);
      setErrors({});
      setStatusMessage("Admin profile & sign-in credentials saved.");
      broadcastProfileUpdate(updatedProfile);
    } catch {
      setErrors({
        submit: "Unable to save profile in browser storage.",
      });
    }
  }

  return (
    <div className="profile-auth-wrapper">
      <div className="profile-auth-card">
        <div className="profile-auth-header">
          <div className="profile-avatar-block">
            <img
              src={form.avatar || DEFAULT_AVATAR}
              alt={form.fullName || "Admin"}
              className="profile-avatar-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
          </div>

          <h2>{form.fullName || "Admin Account"}</h2>
          <p className="profile-auth-subtitle">
            TrendMart Admin Identity &amp; Security Credentials
          </p>

          <div className="profile-avatar-controls">
            <label htmlFor="admin-avatar-upload" className="profile-upload-btn">
              Upload Admin Photo
            </label>
            <input
              id="admin-avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetAvatar}
            >
              Reset
            </button>
          </div>
          <span className="profile-avatar-caption">{avatarFileName}</span>
          {errors.avatar && (
            <span className="profile-field-error">{errors.avatar}</span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="profile-auth-form" noValidate>
          <div className="profile-input-group">
            <label htmlFor="admin-name">Full Name</label>
            <input
              id="admin-name"
              type="text"
              placeholder="Enter admin name"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              onBlur={() => handleFieldBlur("fullName")}
              className={`input-control ${errors.fullName ? "is-invalid" : ""}`}
            />
            {errors.fullName && (
              <span className="profile-field-error">{errors.fullName}</span>
            )}
          </div>

          <div className="profile-input-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@trendmart.in"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={() => handleFieldBlur("email")}
              className={`input-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <span className="profile-field-error">{errors.email}</span>
            )}
          </div>

          <div className="profile-input-group">
            <label htmlFor="admin-role">Role</label>
            <input
              id="admin-role"
              type="text"
              placeholder="Store Administrator"
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              onBlur={() => handleFieldBlur("role")}
              className={`input-control ${errors.role ? "is-invalid" : ""}`}
            />
            {errors.role && (
              <span className="profile-field-error">{errors.role}</span>
            )}
          </div>

          <div className="profile-input-group">
            <div className="profile-label-row">
              <label htmlFor="admin-password">Admin Password / Access Key</label>
              <button
                type="button"
                className="profile-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={form.accessCode}
              onChange={(e) => updateField("accessCode", e.target.value)}
              onBlur={() => handleFieldBlur("accessCode")}
              className={`input-control ${errors.accessCode ? "is-invalid" : ""}`}
            />
            {errors.accessCode && (
              <span className="profile-field-error">{errors.accessCode}</span>
            )}
          </div>

          <div className="profile-input-group">
            <label htmlFor="admin-confirm-password">Confirm Password</label>
            <input
              id="admin-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmAccessCode}
              onChange={(e) => {
                setConfirmAccessCode(e.target.value);
                setStatusMessage("");
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.confirmAccessCode;
                  return next;
                });
              }}
              onBlur={() => handleFieldBlur("confirmAccessCode")}
              className={`input-control ${
                errors.confirmAccessCode ? "is-invalid" : ""
              }`}
            />
            {errors.confirmAccessCode && (
              <span className="profile-field-error">
                {errors.confirmAccessCode}
              </span>
            )}
          </div>

          {errors.submit && (
            <div className="profile-form-alert is-error">{errors.submit}</div>
          )}

          {statusMessage && (
            <div className="profile-form-alert is-success">
              {statusMessage} ({form.lastUpdated})
            </div>
          )}

          <button type="submit" className="btn btn-primary profile-submit-btn">
            Save Admin Profile
          </button>
        </form>
      </div>
    </div>
  );
};