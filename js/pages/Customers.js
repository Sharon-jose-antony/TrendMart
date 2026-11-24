/* ========================================================
   TRENDMART - CUSTOMERS MANAGEMENT WITH PAGINATION
   Native React 18 / In-Browser Babel Standalone Architecture
======================================================== */

window.Customers = function Customers() {
  const { useState, useEffect, useMemo } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Load customers from LocalStorage
  useEffect(() => {
    window.StorageAPI.init();
    setCustomers(get(KEYS.CUSTOMERS));
  }, []);

  // Filter customers by search
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter((customer) => {
      const name = String(customer.name || "").toLowerCase();
      const email = String(customer.email || "").toLowerCase();
      const mobile = String(customer.mobile || "").toLowerCase();
      const address = String(customer.address || "").toLowerCase();
      return (
        name.includes(query) ||
        email.includes(query) ||
        mobile.includes(query) ||
        address.includes(query)
      );
    });
  }, [customers, search]);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + PAGE_SIZE);

  // Delete customer
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      const updatedCustomers = customers.filter(
        (customer) => customer.id !== id
      );

      save(KEYS.CUSTOMERS, updatedCustomers);
      setCustomers(updatedCustomers);
      setSelectedCustomer(null);
      setMessage("Customer deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Unable to delete customer. Please try again.");
    }
  };

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <div>
          <h2>Customer Directory & Accounts</h2>
          <p>Manage, search and review all registered TrendMart buyer accounts.</p>
        </div>
      </div>

      {/* Notification */}
      {message && (
        <div className="customer-message">
          <span>{message}</span>
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      {/* Centered Search Toolbar */}
      <div className="customers-toolbar">
        <input
          type="text"
          placeholder="🔍 Search customers by name, email, mobile, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customer Table with 10-Entry Pagination */}
      <div className="table-card customers-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Email Address</th>
              <th>Mobile Number</th>
              <th>Shipping Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCustomers.map((customer, index) => (
              <tr key={customer.id}>
                <td style={{ color: "var(--text-muted)", fontSize: "0.8rem", width: "40px" }}>
                  {startIndex + index + 1}
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {String(customer.name || "C").charAt(0).toUpperCase()}
                    </div>
                    <strong>{customer.name}</strong>
                  </div>
                </td>
                <td>{customer.email}</td>
                <td>{customer.mobile}</td>
                <td>{customer.address}</td>

                <td>
                  <div className="customer-actions">
                    <button
                      className="customer-view-btn"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      View Details
                    </button>

                    <button
                      className="customer-delete-btn"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedCustomers.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-message">
                  No customers found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Bar (Max 10 Entries Per Slot) */}
        {filteredCustomers.length > 0 && (
          <div className="pagination-bar">
            <div className="pagination-info">
              Showing <strong>{startIndex + 1}</strong> to{" "}
              <strong>{Math.min(startIndex + PAGE_SIZE, filteredCustomers.length)}</strong> of{" "}
              <strong>{filteredCustomers.length}</strong> customers
            </div>

            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ◀ Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`pagination-btn ${pageNum === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="customer-modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="customer-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Customer Account Details</h3>

            <p>
              <strong>Customer ID:</strong> #CUST-{selectedCustomer.id}
            </p>
            <p>
              <strong>Full Name:</strong> {selectedCustomer.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedCustomer.email}
            </p>
            <p>
              <strong>Mobile Number:</strong> {selectedCustomer.mobile}
            </p>
            <p>
              <strong>Shipping Address:</strong> {selectedCustomer.address}
            </p>
            <p>
              <strong>Account Status:</strong> <span style={{ color: "#059669", fontWeight: 600 }}>Active Verified Buyer</span>
            </p>

            <button onClick={() => setSelectedCustomer(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
