
window.Products = function Products() {
  const { useState, useEffect } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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

  const [formData, setFormData] = useState({ ...emptyForm });

  // Load products and categories
  useEffect(() => {
    window.StorageAPI.init();

    setProducts(get(KEYS.PRODUCTS) || []);
    setCategories(get(KEYS.CATEGORIES) || []);
  }, []);

  // Display notification
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // General input handling
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
  };

  // Sequential field validation
  const validatePreviousField = (currentField) => {
    const fieldOrder = [
      "name",
      "image",
      "category",
      "price",
      "stock",
      "description"
    ];

    const currentIndex = fieldOrder.indexOf(currentField);

    if (currentIndex <= 0) return;

    const previousField = fieldOrder[currentIndex - 1];

    let valid = true;
    let errorMessage = "";

    switch (previousField) {
      case "name":
        valid = formData.name.trim() !== "";
        errorMessage = "Please enter the product name first.";
        break;

      case "image":
        valid = formData.image !== "";
        errorMessage = "Please upload a product image first.";
        break;

      case "category":
        valid = categories.some(
          (category) => category.name === formData.category
        );
        errorMessage = "Please select a category first.";
        break;

      case "price":
        valid =
          /^\d+(\.\d{1,2})?$/.test(formData.price) &&
          Number(formData.price) > 0 &&
          Number.isFinite(Number(formData.price));

        errorMessage = "Please enter a valid price first.";
        break;

      case "stock":
        valid =
          /^\d+$/.test(formData.stock) &&
          Number.isSafeInteger(Number(formData.stock));

        errorMessage = "Please enter a valid stock quantity first.";
        break;

      default:
        break;
    }

    if (!valid) {
      setError(errorMessage);
    } else {
      setError("");
    }
  };

  // Price: numbers only, maximum two decimal places
  const handlePriceChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        price: ""
      }));

      setError("Price is required.");
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      setError("Price must contain numbers only (up to 2 decimal places).");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      price: value
    }));

    setError("");
  };

  // Stock: whole numbers only
  const handleStockChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        stock: ""
      }));

      setError("Stock quantity is required.");
      return;
    }

    if (!/^\d+$/.test(value)) {
      setError("Stock quantity must contain whole numbers only.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      stock: value
    }));

    setError("");
  };

  // Product image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Image size must not exceed 1 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result
      }));

      setError("");
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  // Check all six required fields
  const isFormValid = (
    formData.name.trim() !== "" &&
    formData.image !== "" &&

    categories.some(
      (category) => category.name === formData.category
    ) &&

    /^\d+(\.\d{1,2})?$/.test(formData.price) &&
    Number.isFinite(Number(formData.price)) &&
    Number(formData.price) > 0 &&

    /^\d+$/.test(formData.stock) &&
    Number.isSafeInteger(Number(formData.stock)) &&
    Number(formData.stock) >= 0 &&

    formData.description.trim() !== ""
  );

  // Open Add Product form
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ ...emptyForm });
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

  // Close Add/Edit form
  const closeFormModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ ...emptyForm });
    setError("");
  };

  // Add or Update Product
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const name = formData.name.trim();
    const description = formData.description.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);

    // Required fields
    if (
      !name ||
      !formData.image ||
      !formData.category ||
      formData.price.trim() === "" ||
      formData.stock.trim() === "" ||
      !description
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Price validation
    if (
      !/^\d+(\.\d{1,2})?$/.test(formData.price) ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError("Price must be greater than zero and contain valid numbers.");
      return;
    }

    // Stock validation
    if (
      !/^\d+$/.test(formData.stock) ||
      !Number.isSafeInteger(stock) ||
      stock < 0
    ) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    // Category validation
    const categoryExists = categories.some(
      (category) => category.name === formData.category
    );

    if (!categoryExists) {
      setError("Please select a valid category.");
      return;
    }

    // Prepare product
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
      closeFormModal();

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

  // Open Delete confirmation
  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (!productToDelete) return;

    const updatedProducts = products.filter(
      (product) => product.id !== productToDelete.id
    );

    try {
      save(KEYS.PRODUCTS, updatedProducts);

      setProducts(updatedProducts);
      setShowDeleteModal(false);
      setProductToDelete(null);

      showMessage("Product deleted successfully!");
    } catch (err) {
      setShowDeleteModal(false);
      setProductToDelete(null);
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

        <button
          type="button"
          className="product-add-btn"
          onClick={handleAdd}
        >
          + Add Product
        </button>
      </div>

      {/* NOTIFICATION */}
      {message && (
        <div className={`product-message ${messageType}`}>
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
          >
            ✕
          </button>
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
                        type="button"
                        className="product-edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="product-delete-btn"
                        onClick={() => handleDelete(product)}
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
              closeFormModal();
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
                type="button"
                className="product-modal-close"
                onClick={closeFormModal}
              >
                ✕
              </button>

            </div>

            {error && (
              <div
                className="product-form-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="product-form"
              noValidate
            >

              {/* PRODUCT NAME */}
              <div className="product-form-group">

                <label>Product Name *</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => validatePreviousField("name")}
                  maxLength="100"
                  required
                />

              </div>

              {/* PRODUCT IMAGE */}
              <div className="product-form-group">

                <label>Product Image *</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  onFocus={() => validatePreviousField("image")}
                />

                <small>Maximum image size: 1 MB</small>

                {/* IMAGE PREVIEW */}
                {formData.image && (

                  <div className="product-preview-container">

                    <p>Image Preview</p>

                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="product-image-preview"
                      onError={() => {
                        setError("Unable to display the selected image.");
                      }}
                    />

                  </div>

                )}

              </div>

              {/* CATEGORY */}
              <div className="product-form-group">

                <label>Category *</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  onFocus={() => validatePreviousField("category")}
                  required
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}

                </select>

                {categories.length === 0 && (
                  <small>
                    No categories available. Add a category first.
                  </small>
                )}

              </div>

              {/* PRICE */}
              <div className="product-form-group">

                <label>Price (₹) *</label>

                <input
                  type="text"
                  name="price"
                  placeholder="Enter price"
                  inputMode="decimal"
                  value={formData.price}
                  onChange={handlePriceChange}
                  onFocus={() => validatePreviousField("price")}
                  autoComplete="off"
                  required
                />

              </div>

              {/* STOCK */}
              <div className="product-form-group">

                <label>Stock Quantity *</label>

                <input
                  type="text"
                  name="stock"
                  placeholder="Enter stock quantity"
                  inputMode="numeric"
                  value={formData.stock}
                  onChange={handleStockChange}
                  onFocus={() => validatePreviousField("stock")}
                  autoComplete="off"
                  required
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
                  onFocus={() => validatePreviousField("description")}
                  maxLength="1000"
                  required
                />

              </div>

              {/* FORM BUTTONS */}
              <div className="product-form-actions">

                <button
                  type="button"
                  className="product-cancel-btn"
                  onClick={closeFormModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="product-save-btn"
                  disabled={!isFormValid}
                >
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* CUSTOM DELETE CONFIRMATION */}
      {showDeleteModal && (

        <div
          className="product-delete-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelDelete();
            }
          }}
        >

          <div
            className="product-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >

            <div className="delete-warning-icon">
              ⚠️
            </div>

            <h2 id="delete-modal-title">
              Delete Product?
            </h2>

            <p id="delete-modal-description">
              Are you sure you want to delete
              <strong> {productToDelete?.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">

              <button
                type="button"
                className="delete-cancel-btn"
                onClick={cancelDelete}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};
