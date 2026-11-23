
window.Products = function Products() {
  const { useState, useEffect } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [error, setError] = useState("");

  const emptyForm = {
    name: "",
    image: "",
    category: "",
    price: "",
    stock: "",
    description: ""
  };

  const [formData, setFormData] = useState(emptyForm);

  // Load existing products and categories
  useEffect(() => {
    window.StorageAPI.init();

    setProducts(get(KEYS.PRODUCTS));
    setCategories(get(KEYS.CATEGORIES));
  }, []);

  // Display notification
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle product image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Image size must be less than 1 MB.");
      e.target.value = "";
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result
      }));
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  // Open Add Product form
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setError("");
    setShowModal(true);
  };

  // Open Edit Product form
  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      image: product.image || "",
      category: product.category || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      description: product.description || ""
    });

    setError("");
    setShowModal(true);
  };

  // Add or Update Product
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const name = formData.name.trim();
    const description = formData.description.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);

    // Validate required fields
    if (
      !name ||
      !formData.image ||
      !formData.category ||
      formData.price === "" ||
      formData.stock === "" ||
      !description
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    if (
      !Number.isSafeInteger(stock) ||
      stock < 0
    ) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    const categoryExists = categories.some(
      (category) => category.name === formData.category
    );

    if (!categoryExists) {
      setError("Please select a valid category.");
      return;
    }

    const productData = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name,
      image: formData.image,
      category: formData.category,
      price,
      stock,
      description
    };

    let updatedProducts;

    if (editingProduct) {
      updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? productData
          : product
      );
    } else {
      updatedProducts = [...products, productData];
    }

    try {
      save(KEYS.PRODUCTS, updatedProducts);

      setProducts(updatedProducts);
      setShowModal(false);
      setEditingProduct(null);
      setFormData(emptyForm);

      showMessage(
        editingProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
    } catch (err) {
      setError(
        "Unable to save product. Storage may be full. Try a smaller image."
      );
    }
  };

  // Delete Product
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    try {
      save(KEYS.PRODUCTS, updatedProducts);
      setProducts(updatedProducts);

      showMessage("Product deleted successfully!");
    } catch (err) {
      showMessage("Unable to delete product.", "error");
    }
  };

  // Search and category filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = String(product.name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Low stock count
  const lowStockCount = products.filter(
    (product) => Number(product.stock) <= 10
  ).length;

  return (
    <div className="products-page">

      {/* PAGE HEADER */}
      <div className="products-header">
        <div>
          <h2>Product Management</h2>
          <p>Manage, add, edit and organize your store products.</p>
        </div>

        <button className="product-add-btn" onClick={handleAdd}>
          + Add Product
        </button>
      </div>

      {/* NOTIFICATION */}
      {message && (
        <div className={`product-message ${messageType}`}>
          <span>{message}</span>
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="products-stats">

        <div className="product-stat-card">
          <div>
            <p>Total Products</p>
            <h3>{products.length}</h3>
          </div>
          <span>📦</span>
        </div>

        <div className="product-stat-card">
          <div>
            <p>Low Stock Products</p>
            <h3>{lowStockCount}</h3>
          </div>
          <span>⚠️</span>
        </div>

      </div>

      {/* SEARCH AND FILTER */}
      <div className="products-toolbar">

        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

      </div>

      {/* PRODUCT TABLE */}
      <div className="products-table-card">

        <table className="products-table">

          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredProducts.length > 0 ? (

              filteredProducts.map((product) => (

                <tr key={product.id}>

                  <td>
                    <div className="product-info">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />

                      <span>{product.name}</span>

                    </div>
                  </td>

                  <td>{product.category}</td>

                  <td>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`stock-badge ${
                        Number(product.stock) <= 10
                          ? "low-stock"
                          : "in-stock"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="product-description-cell">
                    {product.description || "—"}
                  </td>

                  <td>
                    <div className="product-actions">

                      <button
                        className="product-edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="product-delete-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="6" className="product-empty">
                  No products found.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (

        <div
          className="product-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >

          <div className="product-modal">

            <div className="product-modal-header">

              <div>
                <h2>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>

                <p>
                  Enter the product information below.
                </p>
              </div>

              <button
                className="product-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>

            </div>

            {error && (
              <div className="product-form-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="product-form">

              {/* PRODUCT NAME */}
              <div className="product-form-group">
                <label>Product Name *</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* PRODUCT IMAGE */}
              <div className="product-form-group">
                <label>Product Image *</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <small>Maximum image size: 1 MB</small>

                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="product-image-preview"
                  />
                )}
              </div>

              {/* CATEGORY */}
              <div className="product-form-group">
                <label>Category *</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}

                </select>

                {categories.length === 0 && (
                  <small>No categories available. Add a category first.</small>
                )}
              </div>

              {/* PRICE */}
              <div className="product-form-group">
                <label>Price (₹) *</label>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              {/* STOCK */}
              <div className="product-form-group">
                <label>Stock Quantity *</label>

                <input
                  type="number"
                  name="stock"
                  placeholder="Enter stock quantity"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="product-form-group">
                <label>Description *</label>

                <textarea
                  name="description"
                  placeholder="Enter product description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* FORM BUTTONS */}
              <div className="product-form-actions">

                <button
                  type="button"
                  className="product-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="product-save-btn">
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};
