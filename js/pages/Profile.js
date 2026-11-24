window.Profile = function Profile() {
  const { useState, useEffect } = React;
  const KEY = "tm_admin_profile";

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@trendmart.in",
    role: "Super Admin",
    phone: "+91 98765 43210",
  });
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

const handleSave = (e) => {
  e.preventDefault();
  localStorage.setItem(KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("tm-profile-updated"));
  setSavedMsg("Profile updated!");
  setTimeout(() => setSavedMsg(""), 2500);
};

  return (
    <div className="table-card" style={{ padding: "1.5rem", maxWidth: "600px" }}>
      <h2 className="section-title">Admin Profile</h2>
      {savedMsg && <p style={{ color: "#059669", fontWeight: 600, marginBottom: "1rem" }}>{savedMsg}</p>}

      <form onSubmit={handleSave} className="form-grid">
        <div className="form-group form-full">
          <label>Full Name</label>
          <input name="name" className="input-control" value={profile.name} onChange={handleChange} />
        </div>
        <div className="form-group form-full">
          <label>Email</label>
          <input name="email" type="email" className="input-control" value={profile.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input name="role" className="input-control" value={profile.role} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input name="phone" className="input-control" value={profile.phone} onChange={handleChange} />
        </div>
        <div className="form-actions form-full">
          <button type="submit" className="btn btn-primary">Save Profile</button>
        </div>
      </form>
    </div>
  );
};