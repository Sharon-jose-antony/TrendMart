window.Banners = function Banners() {
  const { useState, useEffect } = React;
  const KEY = "tm_banners";

  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
    setBanners(saved);
  }, []);

  const saveList = (list) => {
    setBanners(list);
    localStorage.setItem(KEY, JSON.stringify(list));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return alert("Title and Image URL are required.");
    const newBanner = { id: Date.now(), title: title.trim(), image: image.trim(), active: true };
    saveList([newBanner, ...banners]);
    setTitle("");
    setImage("");
  };

  const toggleActive = (id) => {
    saveList(banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
    setSlideIndex(0);
  };

  const handleDelete = (id) => {
    saveList(banners.filter((b) => b.id !== id));
    setSlideIndex(0);
  };

  const activeBanners = banners.filter((b) => b.active);
  const currentSlide = activeBanners[slideIndex] || activeBanners[0];

  return (
    <div>
      {/* Live Storefront Preview */}
      <h2 className="section-title">Live Storefront Preview ({activeBanners.length} Active)</h2>
      {activeBanners.length === 0 ? (
        <div className="table-card" style={{ padding: "1.5rem", marginBottom: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
          No active banners. Activate or add a banner below to preview it here.
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            height: "200px",
            borderRadius: "14px",
            overflow: "hidden",
            marginBottom: "1.5rem",
            border: "1px solid var(--border)",
          }}
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.2) 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "1.5rem 2rem",
              color: "#fff",
            }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", opacity: 0.85, marginBottom: "0.35rem" }}>
              Live on Storefront
            </span>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{currentSlide.title}</h3>
          </div>

          {activeBanners.length > 1 && (
            <div style={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setSlideIndex((slideIndex - 1 + activeBanners.length) % activeBanners.length)}
              >
                ◀ Prev
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setSlideIndex((slideIndex + 1) % activeBanners.length)}
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}

      {/* Manage Banners */}
      <h2 className="section-title">Manage Banners</h2>

      <form onSubmit={handleAdd} className="table-card" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <input
          type="text"
          className="input-control"
          style={{ flex: 1, minWidth: "200px" }}
          placeholder="Banner Title (e.g. Mega Sale 50% Off)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="url"
          className="input-control"
          style={{ flex: 1, minWidth: "220px" }}
          placeholder="Image URL (https://...)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">+ Add Banner</button>
      </form>

      <div className="products-grid">
        {banners.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No banners added yet.</p>
        ) : (
          banners.map((b) => (
            <div key={b.id} className="product-card">
              <div className="card-img-wrap" style={{ height: "150px" }}>
                <img src={b.image} alt={b.title} />
              </div>
              <div className="card-body">
                <h3 className="card-title">{b.title}</h3>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem", color: b.active ? "#059669" : "#d97706" }}>
                  Status: {b.active ? "Active" : "Inactive"}
                </p>
                <div className="card-footer">
                  <button className="btn btn-sm btn-secondary" onClick={() => toggleActive(b.id)}>
                    {b.active ? "Disable" : "Activate"}
                  </button>
                  <button className="btn btn-sm btn-delete" onClick={() => handleDelete(b.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};