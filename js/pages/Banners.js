window.Banners = function Banners() {
  const { useState, useEffect, useMemo } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
  const FALLBACK_BANNER =
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=85";

  const DEFAULT_BANNERS = [
    {
      id: 1001,
      title: "Festive Mega Sale",
      subtitle: "Up to 50% off across top categories",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=85",
      active: true,
      createdAt: "Default Storefront Banner",
    },
    {
      id: 1002,
      title: "New Season Electronics Drop",
      subtitle: "Latest audio, smart devices & accessories",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=85",
      active: false,
      createdAt: "Campaign Queue",
    },
  ];

  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [makeActiveOnCreate, setMakeActiveOnCreate] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  function notify(msg, type = "success") {
    setToast(msg);
    setToastType(type);
    window.setTimeout(() => setToast(""), 3000);
  }

  function clearFieldError(fieldName) {
    setFieldErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }

  function normalizeSingleActive(list, preferredActiveId = null) {
    if (!Array.isArray(list) || list.length === 0) return [];

    let chosenId = null;
    if (
      preferredActiveId !== null &&
      list.some((item) => item.id === preferredActiveId)
    ) {
      chosenId = preferredActiveId;
    } else {
      const existingActive = list.find((item) => Boolean(item.active));
      chosenId = existingActive ? existingActive.id : null;
    }

    return list.map((item) => ({
      ...item,
      active: chosenId !== null && item.id === chosenId,
    }));
  }

  function persistBanners(nextList, preferredActiveId = null) {
    const normalized = normalizeSingleActive(nextList, preferredActiveId);
    save(KEYS.BANNERS, normalized);
    setBanners(normalized);
    return normalized;
  }

  function loadBanners() {
    const stored = get ? get(KEYS.BANNERS) : null;
    if (Array.isArray(stored) && stored.length > 0) {
      setBanners(normalizeSingleActive(stored));
    } else {
      const initial = normalizeSingleActive(DEFAULT_BANNERS, 1001);
      try {
        save(KEYS.BANNERS, initial);
      } catch {
        // Ignore restricted storage write errors
      }
      setBanners(initial);
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file.type || !file.type.startsWith("image/")) {
        reject(new Error(`"${file.name}" is not a valid image file.`));
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error(`"${file.name}" exceeds the 2 MB size limit.`));
        return;
      }

      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          name: file.name,
          dataUrl: reader.result,
        });
      reader.onerror = () =>
        reject(new Error(`Could not read "${file.name}".`));
      reader.readAsDataURL(file);
    });
  }

  async function handleLocalFilesChange(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setError("");
    clearFieldError("image");

    const accepted = [];
    const errors = [];

    for (const file of files) {
      try {
        const parsed = await readFileAsDataUrl(file);
        accepted.push(parsed);
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (accepted.length > 0) {
      setUploadedImages((prev) => [...prev, ...accepted]);
    }

    if (errors.length > 0) {
      setFieldErrors((prev) => ({ ...prev, image: errors.join(" ") }));
    }

    event.target.value = "";
  }

  function removeUploadedImage(indexToRemove) {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function validateBannerForm() {
    const nextErrors = {};
    const trimmedTitle = title.trim();
    const trimmedUrl = imageUrl.trim();
    const hasUploads = uploadedImages.length > 0;
    const hasUrl = Boolean(trimmedUrl);

    if (!trimmedTitle) {
      nextErrors.title = "Banner title is required.";
    } else if (trimmedTitle.length < 3) {
      nextErrors.title = "Banner title must be at least 3 characters.";
    }

    if (!hasUploads && !hasUrl) {
      nextErrors.image =
        "Upload at least one local photo or enter a valid Image URL.";
    }

    if (hasUrl) {
      const isValidUrl =
        /^https?:\/\/.+/i.test(trimmedUrl) || trimmedUrl.startsWith("/");
      if (!isValidUrl) {
        nextErrors.imageUrl =
          "Enter a valid URL starting with http:// or https://.";
      }
    }

    return nextErrors;
  }

  function handleAddBanners(event) {
    event.preventDefault();
    setError("");

    const validationErrors = validateBannerForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setSaving(true);

    try {
      const trimmedTitle = title.trim();
      const trimmedSubtitle = subtitle.trim();
      const trimmedUrl = imageUrl.trim();
      const hasUploads = uploadedImages.length > 0;
      const hasUrl = Boolean(trimmedUrl);

      const sources = [];

      uploadedImages.forEach((item, idx) => {
        sources.push({
          title:
            uploadedImages.length > 1 || hasUrl
              ? `${trimmedTitle} (${idx + 1})`
              : trimmedTitle,
          subtitle: trimmedSubtitle || "Featured campaign on TrendMart",
          image: item.dataUrl,
        });
      });

      if (hasUrl) {
        sources.push({
          title: hasUploads ? `${trimmedTitle} (URL)` : trimmedTitle,
          subtitle: trimmedSubtitle || "Featured campaign on TrendMart",
          image: trimmedUrl,
        });
      }

      const baseId = Date.now();
      const createdBanners = sources.map((src, index) => ({
        id: baseId + index,
        title: src.title,
        subtitle: src.subtitle,
        image: src.image,
        active: false,
        createdAt: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      const combined = [...createdBanners.reverse(), ...banners];
      const activeTargetId = makeActiveOnCreate
        ? createdBanners[createdBanners.length - 1].id
        : null;

      persistBanners(combined, activeTargetId);

      setTitle("");
      setSubtitle("");
      setImageUrl("");
      setUploadedImages([]);
      setMakeActiveOnCreate(true);

      notify(
        createdBanners.length > 1
          ? `${createdBanners.length} banners uploaded successfully!`
          : "Banner added successfully!"
      );
    } catch {
      setError("Storage quota full. Try smaller images or remove older banners.");
    } finally {
      setSaving(false);
    }
  }

  function handleSetActive(bannerId) {
    const updated = banners.map((b) => ({
      ...b,
      active: b.id === bannerId,
    }));
    try {
      persistBanners(updated, bannerId);
      notify("Active storefront banner updated. Only 1 banner is live.");
    } catch {
      notify("Unable to update active banner.", "error");
    }
  }

  function handleDeactivate(bannerId) {
    const updated = banners.map((b) =>
      b.id === bannerId ? { ...b, active: false } : b
    );
    try {
      persistBanners(updated, null);
      notify("Banner set to Inactive.");
    } catch {
      notify("Unable to update banner status.", "error");
    }
  }

  function handleDeleteBanner(banner) {
    if (!window.confirm(`Delete banner "${banner.title}"?`)) {
      return;
    }

    const remaining = banners.filter((item) => item.id !== banner.id);
    try {
      persistBanners(remaining, null);
      notify(`Deleted "${banner.title}".`);
    } catch {
      notify("Unable to delete banner.", "error");
    }
  }

  const activeBanner = useMemo(
    () => banners.find((item) => Boolean(item.active)) || null,
    [banners]
  );

  const activeCount = activeBanner ? 1 : 0;

  return (
    <div className="banners-page">
      <div className="banners-topbar">
        <div>
          <h2>Banners</h2>
          <p className="banners-subtitle">
            Upload single or multiple banners and control the single live
            storefront banner.
          </p>
        </div>

        <div className="banners-summary-pill">
          <span>Total: {banners.length}</span>
          <strong>Live on Storefront: {activeCount} / 1</strong>
        </div>
      </div>

      {toast && (
        <div className={`banners-toast banners-toast--${toastType}`}>
          <span>{toast}</span>
          <button type="button" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      )}

      {/* LIVE STOREFRONT PREVIEW (STRICTLY SINGLE ACTIVE BANNER) */}
      <section className="banners-preview-card">
        <div className="banners-section-head">
          <h3>Live Storefront Preview ({activeCount} Active)</h3>
          <span className="banners-rule-badge">Single-Active Rule</span>
        </div>

        {activeBanner ? (
          <div className="banners-hero-preview">
            <img
              src={activeBanner.image || FALLBACK_BANNER}
              alt={activeBanner.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_BANNER;
              }}
            />
            <div className="banners-hero-overlay">
              <span className="banners-live-tag">LIVE ON STOREFRONT</span>
              <h4>{activeBanner.title}</h4>
              {activeBanner.subtitle && <p>{activeBanner.subtitle}</p>}
            </div>
          </div>
        ) : (
          <div className="banners-hero-empty">
            <strong>No Active Banner Selected</strong>
            <p>
              Select &ldquo;Set Active&rdquo; on any banner below to display it
              on the storefront.
            </p>
          </div>
        )}
      </section>

      {/* UPLOAD / CREATE MULTIPLE BANNERS */}
      <section className="banners-form-card">
        <div className="banners-section-head">
          <h3>Manage Banners</h3>
          <small>Local photos (max 2 MB each) or image URLs</small>
        </div>

        <form onSubmit={handleAddBanners} className="banners-form" noValidate>
          <div className="banners-form-grid">
            <div className="banners-field">
              <label htmlFor="banner-title">Banner Title *</label>
              <input
                id="banner-title"
                type="text"
                className={`input-control ${fieldErrors.title ? "is-invalid" : ""}`}
                placeholder="e.g. Mega Sale 50% Off"
                maxLength={70}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearFieldError("title");
                }}
              />
              {fieldErrors.title && (
                <span className="banners-field-error">{fieldErrors.title}</span>
              )}
            </div>

            <div className="banners-field">
              <label htmlFor="banner-subtitle">Tagline / Subtitle</label>
              <input
                id="banner-subtitle"
                type="text"
                className="input-control"
                placeholder="e.g. Limited time offers across store"
                maxLength={100}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div className="banners-field">
              <label htmlFor="banner-url">Image URL (optional if uploading)</label>
              <input
                id="banner-url"
                type="url"
                className={`input-control ${fieldErrors.imageUrl ? "is-invalid" : ""}`}
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  clearFieldError("imageUrl");
                  clearFieldError("image");
                }}
              />
              {fieldErrors.imageUrl && (
                <span className="banners-field-error">
                  {fieldErrors.imageUrl}
                </span>
              )}
            </div>

            <div className="banners-field">
              <label htmlFor="banner-files">
                Upload Local Photos (Multiple Allowed)
              </label>
              <input
                id="banner-files"
                type="file"
                className={`input-control banners-file-input ${fieldErrors.image ? "is-invalid" : ""}`}
                accept="image/*"
                multiple
                onChange={handleLocalFilesChange}
              />
              {fieldErrors.image && (
                <span className="banners-field-error">{fieldErrors.image}</span>
              )}
            </div>
          </div>

          {uploadedImages.length > 0 && (
            <div className="banners-staged-grid">
              {uploadedImages.map((fileObj, idx) => (
                <div key={`${fileObj.name}-${idx}`} className="banners-staged-item">
                  <img src={fileObj.dataUrl} alt={fileObj.name} />
                  <div className="banners-staged-meta">
                    <span title={fileObj.name}>{fileObj.name}</span>
                    <button
                      type="button"
                      className="btn btn-delete btn-sm"
                      onClick={() => removeUploadedImage(idx)}
                      aria-label={`Remove ${fileObj.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="banners-form-footer">
            <label className="banners-checkbox-label">
              <input
                type="checkbox"
                checked={makeActiveOnCreate}
                onChange={(e) => setMakeActiveOnCreate(e.target.checked)}
              />
              <span>Set newly uploaded banner as the single Active banner</span>
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? "Uploading..."
                : uploadedImages.length > 1
                  ? `+ Upload ${uploadedImages.length} Banners`
                  : "+ Add Banner"}
            </button>
          </div>

          {error && <div className="banners-error">{error}</div>}
        </form>
      </section>

      {/* ALL BANNERS LIST */}
      <section className="banners-list-section">
        <div className="banners-section-head">
          <h3>Saved Banners ({banners.length})</h3>
          <small>Only one banner can be Active at a time</small>
        </div>

        {banners.length === 0 ? (
          <div className="banners-empty-state">
            <p>No banners in storage yet. Upload local photos above to begin.</p>
          </div>
        ) : (
          <div className="banners-grid">
            {banners.map((banner) => {
              const isActive = Boolean(banner.active);
              return (
                <article
                  key={banner.id}
                  className={`banners-card ${isActive ? "is-active" : ""}`}
                >
                  <div className="banners-card-thumb">
                    <img
                      src={banner.image || FALLBACK_BANNER}
                      alt={banner.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_BANNER;
                      }}
                    />
                  </div>

                  <div className="banners-card-body">
                    <h4>{banner.title}</h4>
                    {banner.subtitle && (
                      <p className="banners-card-sub">{banner.subtitle}</p>
                    )}

                    <div className="banners-status-row">
                      <span>Status:</span>
                      <strong
                        className={
                          isActive ? "status-active" : "status-inactive"
                        }
                      >
                        {isActive ? "Active (Live)" : "Inactive"}
                      </strong>
                    </div>

                    <div className="banners-card-actions">
                      {isActive ? (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDeactivate(banner.id)}
                        >
                          Set Inactive
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSetActive(banner.id)}
                        >
                          Set Active
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-delete btn-sm"
                        onClick={() => handleDeleteBanner(banner)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};