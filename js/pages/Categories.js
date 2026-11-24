window.Categories = function Categories({ onNavigate }) {
  const { useState, useEffect, useMemo } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const CATALOGUE_PRESETS = [
    {
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=85",
      description: "Clothing, footwear and accessories",
    },
    {
      name: "Mobiles",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=85",
      description: "Smartphones, tablets and mobile accessories",
    },
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=85",
      description: "Audio, computers, cameras and gadgets",
    },
    {
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=85",
      description: "Skincare, makeup and personal care",
    },
    {
      name: "Home",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=85",
      description: "Home decor, kitchen and everyday living",
    },
    {
      name: "Appliances",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=85",
      description: "Kitchen and home appliances",
    },
    {
      name: "Toys & Baby",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&q=85",
      description: "Toys, games and baby essentials",
    },
    {
      name: "Food & Grocery",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=85",
      description: "Pantry, fresh food and daily essentials",
    },
    {
      name: "Automotive",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&q=85",
      description: "Car care, accessories and equipment",
    },
    {
      name: "Sports & Fitness",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=85",
      description: "Fitness, sports and outdoor equipment",
    },
    {
      name: "Furniture",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=85",
      description: "Sofas, tables, beds and storage",
    },
    {
      name: "Books",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=85",
      description: "Books, stationery and learning",
    },
    {
      name: "Two Wheelers",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&q=85",
      description: "Motorcycles, scooters and riding gear",
    },
    {
      name: "Jewellery & Watches",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=85",
      description: "Jewellery, watches and accessories",
    },
  ];

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=85";

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  function buildSeedCategories() {
    const baseTime = Date.now() - CATALOGUE_PRESETS.length * 1000;
    return CATALOGUE_PRESETS.map((preset, index) => ({
      id: baseTime + index * 1000,
      name: preset.name,
      description: preset.description,
      image: preset.image,
    }));
  }

  function loadData() {
    const storedCats = get(KEYS.CATEGORIES);
    const storedProds = get(KEYS.PRODUCTS);

    const safeProds = Array.isArray(storedProds) ? storedProds : [];
    setProducts(safeProds);

    if (Array.isArray(storedCats) && storedCats.length > 0) {
      const enriched = storedCats.map((cat) => {
        const match = CATALOGUE_PRESETS.find(
          (p) => p.name.toLowerCase() === String(cat.name || "").toLowerCase()
        );
        return {
          ...cat,
          description:
            cat.description ||
            match?.description ||
            "Curated TrendMart store category",
          image: cat.image || match?.image || FALLBACK_IMAGE,
        };
      });
      setCategories(enriched);
    } else {
      const seeded = buildSeedCategories();
      try {
        save(KEYS.CATEGORIES, seeded);
      } catch {
        // Ignore storage write failure in restricted contexts
      }
      setCategories(seeded);
    }
  }

  function showToast(message, type = "success") {
    setToast(message);
    setToastType(type);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  }

  function getProductCount(categoryName) {
    return products.filter(
      (product) =>
        String(product.category || "").toLowerCase() ===
        String(categoryName || "").toLowerCase()
    ).length;
  }

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();

    let result = categories.filter((category) => {
      const matchesQuery =
        !q ||
        String(category.name || "").toLowerCase().includes(q) ||
        String(category.description || "").toLowerCase().includes(q);

      if (!matchesQuery) return false;

      const count = getProductCount(category.name);
      if (statusFilter === "active") return count > 0;
      if (statusFilter === "empty") return count === 0;
      return true;
    });

    if (sort === "newest") {
      result = [...result].sort((a, b) => Number(b.id) - Number(a.id));
    } else if (sort === "oldest") {
      result = [...result].sort((a, b) => Number(a.id) - Number(b.id));
    } else if (sort === "az") {
      result = [...result].sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    } else if (sort === "za") {
      result = [...result].sort((a, b) =>
        String(b.name || "").localeCompare(String(a.name || ""))
      );
    } else if (sort === "products-high") {
      result = [...result].sort(
        (a, b) => getProductCount(b.name) - getProductCount(a.name)
      );
    }

    return result;
  }, [categories, products, search, statusFilter, sort]);

  const totalProducts = products.length;

  const usedCategories = useMemo(
    () =>
      categories.filter((category) => getProductCount(category.name) > 0)
        .length,
    [categories, products]
  );

  const emptyCategories = Math.max(0, categories.length - usedCategories);

  const maxCategoryProducts = useMemo(() => {
    const counts = categories.map((c) => getProductCount(c.name));
    return Math.max(1, ...counts);
  }, [categories, products]);

  function openAddModal() {
    setEditingId(null);
    setName("");
    setDescription("");
    setImage("");
    setImageName("");
    setError("");
    setShowModal(true);
  }

  function openEditModal(category) {
    setEditingId(category.id);
    setName(category.name || "");
    setDescription(category.description || "");
    setImage(category.image || "");
    setImageName(
      String(category.image || "").startsWith("data:")
        ? "Uploaded category image"
        : "Catalogue / preset image"
    );
    setError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setImage("");
    setImageName("");
    setError("");
  }

  function applyCataloguePreset(preset) {
    if (!name.trim()) {
      setName(preset.name);
    }
    if (!description.trim()) {
      setDescription(preset.description);
    }
    setImage(preset.image);
    setImageName(`${preset.name} photo`);
    setError("");
  }

  function handleRestoreCatalogueDefaults() {
    if (
      !window.confirm(
        "Reset categories to the 14 TrendMart catalogue categories and images?"
      )
    ) {
      return;
    }

    const seeded = buildSeedCategories();
    try {
      save(KEYS.CATEGORIES, seeded);
      setCategories(seeded);
      showToast("Restored 14 TrendMart catalogue categories!");
    } catch {
      showToast("Unable to save categories to storage.", "error");
    }
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setImageName(file.name);
      setError("");
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDesc =
      description.trim() || `${trimmedName} products and essentials`;

    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    if (!image.trim()) {
      setError("Please upload an image, enter a URL, or pick a catalogue photo.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        String(category.name || "").toLowerCase() ===
          trimmedName.toLowerCase() && category.id !== editingId
    );

    if (duplicate) {
      setError("This category already exists.");
      return;
    }

    setSaving(true);

    try {
      let updatedCategories;

      if (editingId !== null) {
        updatedCategories = categories.map((category) =>
          category.id === editingId
            ? {
                ...category,
                name: trimmedName,
                description: trimmedDesc,
                image: image.trim(),
              }
            : category
        );
      } else {
        const newCategory = {
          id: Date.now(),
          name: trimmedName,
          description: trimmedDesc,
          image: image.trim(),
        };

        updatedCategories = [...categories, newCategory];
      }

      save(KEYS.CATEGORIES, updatedCategories);
      setCategories(updatedCategories);
      closeModal();

      showToast(
        editingId !== null
          ? "Category updated successfully!"
          : "New category added successfully!"
      );
    } catch (err) {
      setError("Unable to save. Storage may be full.");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(category) {
    const productCount = getProductCount(category.name);

    if (productCount > 0) {
      showToast(
        `Cannot delete ${category.name}. Reassign its ${productCount} products first.`,
        "error"
      );
      return;
    }

    if (
      !window.confirm(`Are you sure you want to delete "${category.name}"?`)
    ) {
      return;
    }

    const updatedCategories = categories.filter(
      (item) => item.id !== category.id
    );

    try {
      save(KEYS.CATEGORIES, updatedCategories);
      setCategories(updatedCategories);
      showToast("Category deleted successfully!");
    } catch (err) {
      showToast("Unable to delete category.", "error");
    }
  }

  return (
    <div className="cat-page">
      {/* HEADER */}
      <div className="cat-header">
        <div>
          <div className="cat-breadcrumb">
            Dashboard / <span>Categories</span>
          </div>

          <h2>Category Management</h2>

          <p>
            Organize store departments, assign catalogue imagery, and monitor
            product distribution.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="cat-cancel-btn"
            onClick={handleRestoreCatalogueDefaults}
            title="Load all 14 TrendMart catalogue categories"
          >
            ↻ Sync Catalogue
          </button>

          <button
            type="button"
            className="cat-add-btn"
            onClick={openAddModal}
          >
            <span>＋</span> Add Category
          </button>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className={`cat-toast ${toastType}`}>
          <span>{toastType === "success" ? "✓" : "!"}</span>
          {toast}
          <button type="button" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="cat-stats-grid">
        <div className="cat-stat-card">
          <div className="cat-stat-icon purple">▦</div>
          <div>
            <p>Total Categories</p>
            <h3>{categories.length}</h3>
            <span>All store categories</span>
          </div>
        </div>

        <div className="cat-stat-card">
          <div className="cat-stat-icon green">✓</div>
          <div>
            <p>Active Categories</p>
            <h3>{usedCategories}</h3>
            <span>With assigned products</span>
          </div>
        </div>

        <div className="cat-stat-card">
          <div className="cat-stat-icon blue">▣</div>
          <div>
            <p>Total Products</p>
            <h3>{totalProducts}</h3>
            <span>Across all categories</span>
          </div>
        </div>

        <div className="cat-stat-card">
          <div className="cat-stat-icon orange">!</div>
          <div>
            <p>Empty Categories</p>
            <h3>{emptyCategories}</h3>
            <span>Without assigned products</span>
          </div>
        </div>
      </div>

      {/* CATEGORY TOOLBAR */}
      <div className="cat-toolbar">
        <div className="cat-toolbar-title">
          <h3>All Categories</h3>
          <span>{filteredCategories.length} results</span>
        </div>

        <div className="cat-toolbar-actions">
          <div className="cat-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search categories or descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cat-sort"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="active">Active (Has Products)</option>
            <option value="empty">Empty (0 Products)</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cat-sort"
            aria-label="Sort categories"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Name A - Z</option>
            <option value="za">Name Z - A</option>
            <option value="products-high">Most Products</option>
          </select>
        </div>
      </div>

      {/* CATEGORY GRID */}
      {filteredCategories.length > 0 ? (
        <div className="cat-grid">
          {filteredCategories.map((category) => {
            const count = getProductCount(category.name);
            const barWidth =
              count > 0
                ? Math.max(12, Math.round((count / maxCategoryProducts) * 100))
                : 0;

            return (
              <div className="cat-card" key={category.id}>
                <div className="cat-card-image">
                  <img
                    src={category.image || FALLBACK_IMAGE}
                    alt={category.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <span
                    className={
                      count > 0 ? "cat-status active" : "cat-status empty"
                    }
                  >
                    {count > 0 ? "Active" : "Empty"}
                  </span>
                </div>

                <div className="cat-card-body">
                  <div className="cat-card-top">
                    <div>
                      <h4>{category.name}</h4>
                      <p>
                        {category.description ||
                          "Curated TrendMart store category"}
                      </p>
                    </div>
                  </div>

                  <div className="cat-product-count">
                    <div>
                      <span>Products assigned</span>
                      <strong>{count}</strong>
                    </div>

                    <div className="cat-count-bar">
                      <div style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>

                  <div className="cat-card-actions">
                    {typeof onNavigate === "function" && (
                      <button
                        type="button"
                        className="cat-edit-btn"
                        onClick={() => onNavigate("products")}
                      >
                        ▣ Products
                      </button>
                    )}

                    <button
                      type="button"
                      className="cat-edit-btn"
                      onClick={() => openEditModal(category)}
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      className="cat-delete-btn"
                      onClick={() => handleDelete(category)}
                    >
                      ♲ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="cat-empty-state">
          <div>🗂️</div>

          <h3>
            {search || statusFilter !== "all"
              ? "No matching categories found"
              : "No categories available"}
          </h3>

          <p>
            {search || statusFilter !== "all"
              ? "Try clearing your search or changing the status filter."
              : "Start organizing your store by creating your first category or syncing catalogue presets."}
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.65rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="cat-add-btn"
              onClick={openAddModal}
            >
              ＋ Create Category
            </button>
            <button
              type="button"
              className="cat-cancel-btn"
              onClick={handleRestoreCatalogueDefaults}
            >
              ↻ Sync Catalogue
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="cat-modal-overlay" onClick={closeModal}>
          <div className="cat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cat-modal-header">
              <div>
                <h3>
                  {editingId !== null ? "Edit Category" : "Create New Category"}
                </h3>

                <p>
                  {editingId !== null
                    ? "Update category details, description, or image."
                    : "Add a category with a custom upload or catalogue photo."}
                </p>
              </div>

              <button
                type="button"
                className="cat-modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="cat-form-group">
                <label htmlFor="cat-name">
                  Category Name <span>*</span>
                </label>

                <input
                  id="cat-name"
                  type="text"
                  placeholder="Example: Electronics"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  maxLength={50}
                  required
                />

                <small>Choose a clear and unique category name.</small>
              </div>

              <div className="cat-form-group">
                <label htmlFor="cat-desc">Description</label>

                <input
                  id="cat-desc"
                  type="text"
                  placeholder="Example: Audio, computers, cameras and gadgets"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={120}
                />
              </div>

              <div className="cat-form-group">
                <label htmlFor="cat-img-url">Image URL</label>

                <input
                  id="cat-img-url"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image.startsWith("data:") ? "" : image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setImageName("Custom image URL");
                    setError("");
                  }}
                />

                <small>
                  Or pick a catalogue photo below / upload a file (max 2 MB):
                </small>

                <div
                  style={{
                    display: "flex",
                    gap: "0.4rem",
                    flexWrap: "wrap",
                    marginTop: "0.5rem",
                  }}
                >
                  {CATALOGUE_PRESETS.slice(0, 7).map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className="cat-cancel-btn"
                      style={{
                        padding: "0.25rem 0.55rem",
                        fontSize: "0.75rem",
                      }}
                      onClick={() => applyCataloguePreset(preset)}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cat-form-group">
                <label>
                  Category Image <span>*</span>
                </label>

                <label className="cat-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  {image ? (
                    <div className="cat-upload-preview">
                      <img
                        src={image}
                        alt="Preview"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />

                      <div>
                        <strong>Image ready</strong>
                        <p>{imageName || "Selected image"}</p>
                        <span>Click to upload a different file</span>
                      </div>
                    </div>
                  ) : (
                    <div className="cat-upload-placeholder">
                      <span>↑</span>
                      <strong>Click to upload image</strong>
                      <p>PNG, JPG, WEBP (Maximum 2 MB)</p>
                    </div>
                  )}
                </label>
              </div>

              {error && <div className="cat-form-error">⚠ {error}</div>}

              <div className="cat-modal-footer">
                <button
                  type="button"
                  className="cat-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cat-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};