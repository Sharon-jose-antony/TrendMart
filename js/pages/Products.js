window.Products = function Products() {
  const { useState, useEffect } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const emptyForm = {
    name: "",
    image: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [toast, setToast] = useState({ type: "", text: "" });
  const [showModal, setShowModal] = useState(false);

  const FALLBACK_IMG =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80";

  useEffect(() => {
    setProducts(get(KEYS.PRODUCTS));
    setCategories(get(KEYS.CATEGORIES));
  }, []);

  const showMessage = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      name: product.name || "",
      image: product.image || "",
      category: product.category || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      description: product.description || "",
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.image.trim() ||
      !form.category.trim() ||
      form.price === "" ||
      form.stock === "" ||
      !form.description.trim()
    ) {
      showMessage("error", "Please fill in all required fields.");
      return;
    }

    if (Number(form.price) <= 0) {
      showMessage("error", "Price must be greater than 0.");
      return;
    }

    if (Number(form.stock) < 0) {
      showMessage("error", "Stock quantity cannot be negative.");
      return;
    }

    let updatedList;
    if (editingId !== null) {
      updatedList = products.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: form.name.trim(),
              image: form.image.trim(),
              category: form.category,
              price: Number(form.price),
              stock: Number(form.stock),
              description: form.description.trim(),
            }
          : p
      );
      showMessage("success", "Product updated successfully.");
    } else {
      const newProduct = {
        id: Date.now(),
        name: form.name.trim(),
        image: form.image.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
      };
      updatedList = [newProduct, ...products];
      showMessage("success", "Product added to catalog.");
    }

    setProducts(updatedList);
    save(KEYS.PRODUCTS, updatedList);
    closeModal();
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    const updatedList = products.filter((p) => p.id !== id);
    setProducts(updatedList);
    save(KEYS.PRODUCTS, updatedList);
    showMessage("success", `"${name}" removed.`);
  };

  const getStockBadge = (stock) => {
    const qty = Number(stock);
    if (qty === 0)
      return (
        <span className="badge badge-danger">
          <span className="badge-dot"></span> Out of Stock
        </span>
      );
    if (qty <= 10)
      return (
        <span className="badge badge-warning">
          <span className="badge-dot"></span> Low ({qty})
        </span>
      );
    return (
      <span className="badge badge-success">
        <span className="badge-dot"></span> In Stock ({qty})
      </span>
    );
  };

  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
    0
  );
  const lowStockCount = products.filter(
    (p) => Number(p.stock) > 0 && Number(p.stock) <= 10
  ).length;
  const outOfStockCount = products.filter((p) => Number(p.stock) === 0).length;

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        filterCategory === "All" || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "stock-asc") return Number(a.stock) - Number(b.stock);
      return Number(b.id) - Number(a.id);
    });

  return (
    <div>
      {/* Floating Toast */}
      {toast.text && (
        <div className={`toast toast-${toast.type}`}>
          <i
            className={
              toast.type === "success"
                ? "ri-checkbox-circle-fill"
                : "ri-error-warning-fill"
            }
          ></i>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-heading">Product Catalog</h1>
          <p className="page-subtitle">
            Manage inventory, pricing, and storefront availability.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="ri-add-line"></i> Add Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p className="stat-label">Total Products</p>
            <p className="stat-value">{products.length}</p>
          </div>
          <div className="stat-icon icon-indigo">
            <i className="ri-shopping-bag-3-line"></i>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-label">Inventory Value</p>
            <p className="stat-value">₹{totalValue.toLocaleString("en-IN")}</p>
          </div>
          <div className="stat-icon icon-emerald">
            <i className="ri-wallet-3-line"></i>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-label">Low Stock</p>
            <p className="stat-value">{lowStockCount}</p>
          </div>
          <div className="stat-icon icon-amber">
            <i className="ri-alert-line"></i>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-label">Out of Stock</p>
            <p className="stat-value">{outOfStockCount}</p>
          </div>
          <div className="stat-icon icon-rose">
            <i className="ri-close-circle-line"></i>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="module-toolbar">
        <div className="toolbar-filters">
          <div className="search-box">
            <i className="ri-search-line"></i>
            <input
              type="text"
              className="input-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="input-control"
            style={{ maxWidth: "190px" }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="input-control"
            style={{ maxWidth: "180px" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-asc">Stock: Low to High</option>
          </select>
        </div>

        {/* Grid / Table Toggle */}
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <i className="ri-layout-grid-line"></i>
          </button>
          <button
            className={`view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Table View"
          >
            <i className="ri-list-check"></i>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="table-card empty-state">
          <i className="ri-inbox-2-line"></i>
          <p style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>
            No products found
          </p>
          <p style={{ fontSize: "0.88rem" }}>
            Adjust your filters or click "Add Product" to create a new listing.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="products-grid">
          {filteredProducts.map((item) => (
            <div className="product-card" key={item.id}>
              <div className="card-img-wrap">
                <img
                  src={item.image || FALLBACK_IMG}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMG;
                  }}
                />
                <span className="card-cat-pill">{item.category}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-desc">
                  {item.description || "No description provided for this item."}
                </p>
                <div className="card-meta">
                  <span className="card-price">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </span>
                  {getStockBadge(item.stock)}
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-sm btn-edit"
                    onClick={() => openEditModal(item)}
                  >
                    <i className="ri-pencil-line"></i> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-delete"
                    onClick={() => handleDelete(item.id, item.name)}
                  >
                    <i className="ri-delete-bin-line"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="product-cell">
                      <img
                        src={item.image || FALLBACK_IMG}
                        alt={item.name}
                        className="product-thumb"
                        onError={(e) => {
                          e.target.src = FALLBACK_IMG;
                        }}
                      />
                      <div>
                        <div className="product-name">{item.name}</div>
                        <div className="product-sub">
                          {item.description || "No description"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-category">{item.category}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </td>
                  <td>{getStockBadge(item.stock)}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => openEditModal(item)}
                      >
                        <i className="ri-pencil-line"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Split Add / Edit Modal with Live Preview */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId !== null ? "Edit Product" : "Create New Product"}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="modal-split">
              <form onSubmit={handleSubmit} className="modal-form-side">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="input-control"
                      placeholder="e.g. Studio Headphones"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      className="input-control"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      className="input-control"
                      placeholder="1499"
                      value={form.price}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      className="input-control"
                      placeholder="25"
                      value={form.stock}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label>Product Image (URL or Upload) *</label>
                    <div className="upload-row">
                      <input
                        type="url"
                        name="image"
                        className="input-control"
                        placeholder="Paste image URL..."
                        value={form.image}
                        onChange={handleChange}
                      />
                      <label className="file-upload-btn">
                        <i className="ri-upload-2-line"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-group form-full">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      rows="3"
                      className="input-control"
                      placeholder="Highlight key product specs..."
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="ri-check-line"></i>
                    {editingId !== null ? "Update Product" : "Save Product"}
                  </button>
                </div>
              </form>

              {/* Live Storefront Card Preview */}
              <div className="modal-preview-side">
                <p className="preview-label">Live Card Preview</p>
                <div className="product-card" style={{ pointerEvents: "none" }}>
                  <div className="card-img-wrap">
                    <img
                      src={form.image || FALLBACK_IMG}
                      alt="Preview"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMG;
                      }}
                    />
                    <span className="card-cat-pill">
                      {form.category || "Category"}
                    </span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">
                      {form.name || "Product Name"}
                    </h3>
                    <p className="card-desc">
                      {form.description ||
                        "Your product description will appear here as you type."}
                    </p>
                    <div className="card-meta" style={{ marginBottom: 0 }}>
                      <span className="card-price">
                        ₹{Number(form.price || 0).toLocaleString("en-IN")}
                      </span>
                      {getStockBadge(form.stock === "" ? 15 : form.stock)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};