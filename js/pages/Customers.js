
window.Customers = function Customers() {
  const { useState, useEffect } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState("");

  // Load customers from LocalStorage
  useEffect(() => {
    setCustomers(get(KEYS.CUSTOMERS));
  }, []);

  // Search customers
  const filteredCustomers = customers.filter((customer) => {
    const name = String(customer.name || "").toLowerCase();
    const email = String(customer.email || "").toLowerCase();
    const query = search.toLowerCase();

    return name.includes(query) || email.includes(query);
  });

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
    } catch (error) {
      setMessage("Unable to delete customer. Please try again.");
    }
  };

  return (
    <div className="customers-page">

      {/* Header */}
      <div className="customers-header">
        <div>
          <h2>Customer Management</h2>
          <p>Manage and view your registered customers.</p>
        </div>
      </div>

      {/* Notification */}
      {message && (
        <div className="customer-message">
          {message}
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      {/* Customer Statistics */}
      <div className="customers-stat-card">
        <div>
          <p>Total Customers</p>
          <h2>{customers.length}</h2>
        </div>
        <span>👥</span>
      </div>

      {/* Search */}
      <div className="customers-toolbar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customer Table */}
      <div className="table-card customers-table">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.mobile}</td>
                <td>{customer.address}</td>

                <td>
                  <div className="customer-actions">
                    <button
                      className="customer-view-btn"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      View
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

            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-message">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="customer-modal-overlay">
          <div className="customer-modal">

            <h3>Customer Details</h3>

            <p>
              <strong>Name:</strong> {selectedCustomer.name}
            </p>

            <p>
              <strong>Email:</strong> {selectedCustomer.email}
            </p>

            <p>
              <strong>Mobile:</strong> {selectedCustomer.mobile}
            </p>

            <p>
              <strong>Address:</strong> {selectedCustomer.address}
            </p>

            <button
              onClick={() => setSelectedCustomer(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
