
window.Orders = function Orders() {
  const { useState, useEffect } = React;
  const { KEYS, get, save } = window.StorageAPI;

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState("");

  // Load orders
  useEffect(() => {
    setOrders(get(KEYS.ORDERS));
  }, []);

  // Search orders
  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    return (
      String(order.id).toLowerCase().includes(query) ||
      String(order.customer).toLowerCase().includes(query)
    );
  });

  // Statistics
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  // UPDATE ORDER STATUS
  const handleStatusChange = (id, newStatus) => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === id
          ? { ...order, status: newStatus }
          : order
      );

      save(KEYS.ORDERS, updatedOrders);

      setOrders(updatedOrders);

      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus
        });
      }

      setMessage("Order status updated successfully!");
    } catch (error) {
      setMessage("Unable to update order status.");
    }
  };

  // DELETE ORDER
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      const updatedOrders = orders.filter(
        (order) => order.id !== id
      );

      save(KEYS.ORDERS, updatedOrders);

      setOrders(updatedOrders);
      setSelectedOrder(null);

      setMessage("Order deleted successfully!");
    } catch (error) {
      setMessage("Unable to delete order.");
    }
  };

  return (
    <div className="orders-page">

      {/* HEADER */}
      <div className="orders-header">
        <div>
          <h2>Order Management</h2>
          <p>Manage and track all customer orders.</p>
        </div>
      </div>

      {/* NOTIFICATION */}
      {message && (
        <div className="order-message">
          <span>{message}</span>
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="orders-stats-grid">

        <div className="order-stat-card">
          <p>Total Orders</p>
          <h2>{orders.length}</h2>
          <span>🛒</span>
        </div>

        <div className="order-stat-card">
          <p>Total Revenue</p>
          <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
          <span>💰</span>
        </div>

        <div className="order-stat-card">
          <p>Pending Orders</p>
          <h2>{pendingOrders}</h2>
          <span>⏳</span>
        </div>

        <div className="order-stat-card">
          <p>Delivered Orders</p>
          <h2>{deliveredOrders}</h2>
          <span>✅</span>
        </div>

      </div>

      {/* SEARCH */}
      <div className="orders-toolbar">
        <input
          type="text"
          placeholder="Search by Order ID or Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ORDERS TABLE */}
      <div className="table-card orders-table">

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>

                <td>{order.id}</td>

                <td>{order.customer}</td>

                <td>
                  ₹{Number(order.total || 0).toLocaleString("en-IN")}
                </td>

                {/* STATUS DROPDOWN */}
                <td>
                  <select
                    className={`order-status-select ${String(order.status).toLowerCase()}`}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>

                {/* ACTIONS */}
                <td>
                  <div className="order-actions">

                    <button
                      className="order-view-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>

                    <button
                      className="order-delete-btn"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-message">
                  No orders found.
                </td>
              </tr>
            )}

          </tbody>
        </table>

      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="customer-modal-overlay">
          <div className="customer-modal">

            <h3>Order Details</h3>

            <p>
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>

            <p>
              <strong>Customer:</strong> {selectedOrder.customer}
            </p>

            <p>
              <strong>Total Amount:</strong> ₹
              {Number(selectedOrder.total || 0).toLocaleString("en-IN")}
            </p>

            <p>
              <strong>Order Status:</strong> {selectedOrder.status}
            </p>

            <button
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
