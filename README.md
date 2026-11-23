# 🛍️ TrendMart – Module 1: Dashboard

This branch (`feat/module-1-dashboard`) implements **Module 1 (Primary Dashboard)** for the **TrendMart** E-Commerce Admin Platform using React.js, Vite, and Tailwind CSS.

---

## 🌟 Included in Module 1:

- **Welcome Section**: Time-sensitive greeting, formatted date, live dashboard refresh button.
- **Dynamic KPI Statistic Cards**:
  - Total Products (calculated from store data)
  - Total Categories (calculated from taxonomy)
  - Total Customers (with growth indicators)
  - Total Orders (with total revenue calculation)
- **Sales & Revenue Analytics**:
  - Interactive Recharts component with multi-gradient fills (Area & Bar views).
  - Multi-period filters: 7 Days, 30 Days, 90 Days, 1 Year.
  - KPI summary badges (Gross Sales, Orders Volume, Average Order Value).
- **Recent Products Table**: Search filter, category badges, stock level indicators (*In Stock*, *Low Stock*, *Out of Stock*).
- **Recent Orders Table**: Live order status switcher (*Pending*, *Processing*, *Delivered*, *Cancelled*).
- **Quick Navigation**: Shortcuts to store management workflows.
- **Inventory Alerts**: Stock ratio health bar and low-stock items with one-click **"+15 Restock"** button.
- **Recent Activity Feed**: Real-time event log.
- **Store Performance**: Conversion rate, retention, fulfillment speed, cart completion benchmarks.
- **Navigation Shell**: Responsive collapsible sidebar with official brand logo, topbar breadcrumbs, global command palette (`Ctrl+K`), and notification popover.

---

## 💻 Quick Start

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
