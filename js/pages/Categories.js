
window.Categories = function Categories() {
  const { useState, useEffect, useMemo } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [saving, setSaving] = useState(false);

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setCategories(get(KEYS.CATEGORIES));
    setProducts(get(KEYS.PRODUCTS));
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
      product =>
        String(product.category || "").toLowerCase() ===
        String(categoryName).toLowerCase()
    ).length;
  }

  const filteredCategories = useMemo(() => {
    let result = categories.filter(category =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "newest") {
      result.sort((a, b) => b.id - a.id);
    } else if (sort === "oldest") {
      result.sort((a, b) => a.id - b.id);
    } else if (sort === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "za") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [categories, search, sort]);

  const totalProducts = products.length;

  const usedCategories = categories.filter(
    category => getProductCount(category.name) > 0
  ).length;

  const emptyCategories = categories.length - usedCategories;

  function openAddModal() {
    setEditingId(null);
    setName("");
    setImage("");
    setImageName("");
    setError("");
    setShowModal(true);
  }

  function openEditModal(category) {
    setEditingId(category.id);
    setName(category.name);
    setImage(category.image);
    setImageName("Current category image");
    setError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setName("");
    setImage("");
    setImageName("");
    setError("");
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];

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

    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    if (!image) {
      setError("Please upload a category image.");
      return;
    }

    const duplicate = categories.some(category =>
      category.name.toLowerCase() === trimmedName.toLowerCase() &&
      category.id !== editingId
    );

    if (duplicate) {
      setError("This category already exists.");
      return;
    }

    setSaving(true);

    try {
      let updatedCategories;

      if (editingId !== null) {
        updatedCategories = categories.map(category =>
          category.id === editingId
            ? {
                ...category,
                name: trimmedName,
                image: image
              }
            : category
        );
      } else {
        const newCategory = {
          id: Date.now(),
          name: trimmedName,
          image: image
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

  if (!window.confirm(
    `Are you sure you want to delete "${category.name}"?`
  )) {
    return;
  }

  const updatedCategories = categories.filter(
    item => item.id !== category.id
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
            Organize your store and manage product categories
            from one place.
          </p>
        </div>

        <button className="cat-add-btn" onClick={openAddModal}>
          <span>＋</span> Add Category
        </button>
      </div>

      {/* TOAST */}

      {toast && (
        <div className={`cat-toast ${toastType}`}>
          <span>{toastType === "success" ? "✓" : "!"}</span>
          {toast}
          <button onClick={() => setToast("")}>×</button>
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
              placeholder="Search categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="cat-sort"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Name A - Z</option>
            <option value="za">Name Z - A</option>
          </select>

        </div>

      </div>

      {/* CATEGORY GRID */}

      {filteredCategories.length > 0 ? (

        <div className="cat-grid">

          {filteredCategories.map((category, index) => {

            const count = getProductCount(category.name);

            return (
              <div className="cat-card" key={category.id}>

                <div className="cat-card-image">

                  <img
                    src={category.image}
                    alt={category.name}
                  />

                  <span className={
                    count > 0
                      ? "cat-status active"
                      : "cat-status empty"
                  }>
                    {count > 0 ? "Active" : "Empty"}
                  </span>

                </div>

                <div className="cat-card-body">

                  <div className="cat-card-top">
                    <div>
                      <h4>{category.name}</h4>
                      <p>Category #{category.id}</p>
                    </div>

                    <span className="cat-card-icon">🗂️</span>
                  </div>

                  <div className="cat-product-count">
                    <div>
                      <span>Products assigned</span>
                      <strong>{count}</strong>
                    </div>

                    <div className="cat-count-bar">
                      <div
                        style={{
                          width: `${count > 0 ? 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="cat-card-actions">

                    <button
                      className="cat-edit-btn"
                      onClick={() => openEditModal(category)}
                    >
                      ✎ Edit
                    </button>

                    <button
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
            {search
              ? "No matching categories found"
              : "No categories available"}
          </h3>

          <p>
            {search
              ? "Try another category name."
              : "Start organizing your store by creating your first category."}
          </p>

          {!search && (
            <button className="cat-add-btn" onClick={openAddModal}>
              ＋ Create First Category
            </button>
          )}

        </div>

      )}

      {/* ADD / EDIT MODAL */}

      {showModal && (

        <div
          className="cat-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="cat-modal"
            onClick={e => e.stopPropagation()}
          >

            <div className="cat-modal-header">

              <div>
                <h3>
                  {editingId !== null
                    ? "Edit Category"
                    : "Create New Category"}
                </h3>

                <p>
                  {editingId !== null
                    ? "Update the category information below."
                    : "Add a new category to your store."}
                </p>
              </div>

              <button
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
                  onChange={e => {
                    setName(e.target.value);
                    setError("");
                  }}
                  maxLength={50}
                  required
                />

                <small>
                  Choose a clear and unique category name.
                </small>

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
                      <img src={image} alt="Preview" />

                      <div>
                        <strong>Image selected</strong>
                        <p>{imageName}</p>
                        <span>Click to change image</span>
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

              {error && (
                <div className="cat-form-error">
                  ⚠ {error}
                </div>
              )}

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
