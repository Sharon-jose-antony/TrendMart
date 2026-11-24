window.Orders = function Orders() {
  const { useState, useEffect, useMemo, useCallback } = React;
  const { KEYS, get, save } = window.StorageAPI || { KEYS: { ORDERS: 'tm_orders' }, get: () => [], save: () => {} };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // "success" | "error"

  // Normalize order object from either REST API or LocalStorage
  const normalizeOrder = (o) => ({
    ...o,
    id: o.id || o.orderNumber || ('ORD-' + Math.floor(1000 + Math.random() * 9000)),
    orderNumber: o.orderNumber || o.id,
    customer: o.customerName || o.customer || 'Customer',
    customerName: o.customerName || o.customer || 'Customer',
    customerEmail: o.customerEmail || '',
    customerPhone: o.customerPhone || '',
    shippingAddress: o.shippingAddress || 'Standard Delivery',
    total: Number(o.totalAmount || o.total || 0),
    totalAmount: Number(o.totalAmount || o.total || 0),
    status: o.status || 'Processing',
    date: o.orderDate || o.date || new Date().toISOString(),
    items: Array.isArray(o.items) ? o.items : [],
    paymentMethod: o.paymentMethod || 'Online Payment',
    paymentStatus: o.paymentStatus || 'Paid'
  });

  // Load orders from Central API with LocalStorage fallback
  const loadOrders = useCallback(async (showToast = false) => {
    try {
      if (window.TrendMartAPI && typeof window.TrendMartAPI.getOrders === 'function') {
        const apiOrders = await window.TrendMartAPI.getOrders();
        if (Array.isArray(apiOrders) && apiOrders.length > 0) {
          const normalized = apiOrders.map(normalizeOrder);
          setOrders(normalized);
          save(KEYS.ORDERS, normalized);
          if (showToast) {
            setMessage("Orders synchronized with Central Database!");
            setMessageType("success");
          }
          return;
        }
      }
    } catch (err) {
      console.warn('[Orders.js] API fetch failed, falling back to storage:', err);
    }

    // Fallback to localStorage
    const local = get(KEYS.ORDERS);
    if (Array.isArray(local) && local.length > 0) {
      setOrders(local.map(normalizeOrder));
    }
    if (showToast) {
      setMessage("Orders refreshed from local cache.");
      setMessageType("success");
    }
  }, []);

  // Initial load + periodic synchronization
  useEffect(() => {
    setLoading(true);
    loadOrders().finally(() => setLoading(false));

    // Live sync interval to capture new orders from storefront or status changes from sellers
    const interval = setInterval(() => {
      loadOrders(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [loadOrders]);

  // Search filter
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) => {
      const orderIdStr = String(order.id || '').toLowerCase();
      const orderNumStr = String(order.orderNumber || '').toLowerCase();
      const customerStr = String(order.customer || order.customerName || '').toLowerCase();
      const emailStr = String(order.customerEmail || '').toLowerCase();
      const statusStr = String(order.status || '').toLowerCase();

      return (
        orderIdStr.includes(query) ||
        orderNumStr.includes(query) ||
        customerStr.includes(query) ||
        emailStr.includes(query) ||
        statusStr.includes(query)
      );
    });
  }, [orders, search]);

  // Statistics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter((order) => order.status === "Pending" || order.status === "Processing").length;
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter((order) => order.status === "Delivered").length;
  }, [orders]);

  // UPDATE ORDER STATUS
  const handleStatusChange = async (id, newStatus) => {
    try {
      // 1. Optimistic UI update
      const updatedOrders = orders.map((order) =>
        (order.id === id || order.orderNumber === id)
          ? { ...order, status: newStatus }
          : order
      );
      setOrders(updatedOrders);
      save(KEYS.ORDERS, updatedOrders);

      if (selectedOrder && (selectedOrder.id === id || selectedOrder.orderNumber === id)) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus
        });
      }

      // 2. Persist to Central Database
      if (window.TrendMartAPI && typeof window.TrendMartAPI.updateOrderStatus === 'function') {
        await window.TrendMartAPI.updateOrderStatus(id, newStatus, 'Status updated via Admin Panel');
      }

      setMessage(`Order ${id} status updated to ${newStatus}!`);
      setMessageType("success");
    } catch (error) {
      console.error('Failed to update status:', error);
      setMessage("Unable to update order status: " + error.message);
      setMessageType("error");
    }
  };

  // DELETE ORDER
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete order "${id}" from the database?`
    );

    if (!confirmed) return;

    try {
      // 1. Delete from Central DB
      if (window.TrendMartAPI && typeof window.TrendMartAPI.deleteOrder === 'function') {
        await window.TrendMartAPI.deleteOrder(id);
      }

      // 2. Update local state
      const updatedOrders = orders.filter((order) => order.id !== id && order.orderNumber !== id);
      setOrders(updatedOrders);
      save(KEYS.ORDERS, updatedOrders);

      if (selectedOrder && (selectedOrder.id === id || selectedOrder.orderNumber === id)) {
        setSelectedOrder(null);
      }

      setMessage("Order deleted successfully!");
      setMessageType("success");
    } catch (error) {
      console.error('Failed to delete order:', error);
      setMessage("Unable to delete order: " + error.message);
      setMessageType("error");
    }
  };

  return (
    <div className="orders-page">

      {/* HEADER */}
      <div className="orders-header">
        <div>
          <h2>Order Management</h2>
          <p>Manage, track, and update fulfillment status for customer orders across the marketplace.</p>
        </div>
        <button 
          className="order-refresh-btn" 
          onClick={() => loadOrders(true)} 
          title="Synchronize live orders from Central Database"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>Refresh Live Data</span>
        </button>
      </div>

      {/* NOTIFICATION */}
      {message && (
        <div className="order-message" style={{
          background: messageType === 'error' ? '#fee2e2' : '#dcfce7',
          color: messageType === 'error' ? '#991b1b' : '#166534',
          borderColor: messageType === 'error' ? '#fecaca' : '#bbf7d0'
        }}>
          <span>{message}</span>
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="orders-stats-grid">

        <div className="order-stat-card">
          <div>
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </span>
        </div>

        <div className="order-stat-card">
          <div>
            <p>Total Revenue</p>
            <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </span>
        </div>

        <div className="order-stat-card">
          <div>
            <p>Active Fulfillment</p>
            <h2>{pendingOrders}</h2>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </span>
        </div>

        <div className="order-stat-card">
          <div>
            <p>Delivered Orders</p>
            <h2>{deliveredOrders}</h2>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>

      </div>

      {/* SEARCH */}
      <div className="orders-toolbar">
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name, or Status..."
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
              <tr key={order.id || order.orderNumber}>

                <td>
                  <strong style={{ color: 'var(--accent, #4f46e5)' }}>
                    {order.orderNumber || order.id}
                  </strong>
                  {order.id !== order.orderNumber && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {order.id}</div>
                  )}
                </td>

                <td>
                  <strong>{order.customer || order.customerName}</strong>
                  {order.customerEmail && (
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                  )}
                </td>

                <td>
                  <strong>₹{Number(order.total || order.totalAmount || 0).toLocaleString("en-IN")}</strong>
                  {order.paymentMethod && (
                    <div style={{ fontSize: '11px', color: '#10b981' }}>{order.paymentMethod}</div>
                  )}
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
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
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
                  {loading ? "Loading live orders from database..." : "No orders found."}
                </td>
              </tr>
            )}

          </tbody>
        </table>

      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="customer-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-details-modal-box" onClick={(e) => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Order Summary Details</h3>
              <button 
                style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', textTransform: 'uppercase' }}>Tracking Number:</strong>
                <span style={{ fontWeight: 700, color: 'var(--accent, #4f46e5)' }}>{selectedOrder.orderNumber || selectedOrder.id}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', textTransform: 'uppercase' }}>Fulfillment Status:</strong>
                <select
                  className={`order-status-select ${String(selectedOrder.status).toLowerCase()}`}
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', textTransform: 'uppercase' }}>Customer Name:</strong>
                <span>{selectedOrder.customer || selectedOrder.customerName}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', textTransform: 'uppercase' }}>Contact Email:</strong>
                <span>{selectedOrder.customerEmail || 'N/A'}</span>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', textTransform: 'uppercase' }}>Delivery Address:</strong>
                <span>{selectedOrder.shippingAddress || 'Standard Delivery Address'}</span>
              </div>
            </div>

            {/* Items list if available */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Ordered Items ({selectedOrder.items.length}):
                </strong>
                <div style={{ background: 'var(--bg-subtle, #f8fafc)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                      <span>• {item.title || item.name} <strong>(x{item.quantity})</strong></span>
                      <span style={{ fontWeight: 600 }}>₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '10px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Payment Method: {selectedOrder.paymentMethod || 'Online'}</div>
                <div style={{ fontSize: '17px', fontWeight: 800 }}>
                  Total: ₹{Number(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString("en-IN")}
                </div>
              </div>
              <button
                className="customer-view-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
