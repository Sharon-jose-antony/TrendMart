# TrendMart – Module 8: Settings & Theme Management

Comprehensive Store Configuration and Appearance Management built for the **TrendMart** platform.

## Features
- **Visual Theme & Appearance**:
  - Interactive selection between **Light Mode** and **Dark Mode** with live UI preview mockups.
  - Global theme propagation via `document.documentElement[data-theme]` applying immediately to the sidebar, topbar, cards, tables, forms, and modals.
  - Persistent theme preference saved in `localStorage.getItem("tm_theme")`.
  - Broadcasts `tm-theme-updated` to synchronize topbar toggles seamlessly.
- **Store & Regional Preferences**:
  - Store brand name customization.
  - Multi-currency selection (₹ INR default, $ USD, € EUR).
  - Low-stock inventory alert threshold configuration (units).
  - Support contact email address for administrative notifications.
- **Session & Security Management**:
  - Active administrator session overview (Administrator name, email, Super Admin role badge).
  - **Secure Sign-Out**: Danger action button opening the confirmation modal.
- **Logout Confirmation Modal**:
  - Explicit confirmation preventing accidental session termination.
  - Clear guarantee that catalog data (`tm_products`, `tm_orders`, `tm_customers`, `tm_categories`) remains intact and protected.
  - Smooth session cleanup and redirection.

---

# TrendMart – Module 1: Dashboard

Premium E-Commerce Administration Dashboard built for the **TrendMart** platform.

## Features
- **Welcome Hero Section**: Personalized greeting using `tm_admin_profile`, live formatted date, and quick action buttons.
- **KPI Statistics**: Real-time totals for Products, Categories, Customers, and Orders directly wired into `window.StorageAPI`.
- **Sales & Revenue Analytics**: Interactive SVG trend chart with dynamic time-range filters (Past 7 Days, 30 Days, Year to Date) and hover tooltips.
- **Inventory Overview & Health**: Real-time low-stock alerts identifying products with $\le$ 10 units.
- **Recent Products Table**: Visual thumbnail, product name, category, formatted ₹ INR price, and stock badge (`In Stock` / `Low Stock`).
- **Recent Orders Table**: Order ID, customer name, order total, and order fulfillment status badge.
- **Quick Navigation**: Single-click access to Products, Categories, Customers, Orders, and Banners.

## Technology Stack
- **Framework**: React 18 (in-browser CDN)
- **Compiler**: Babel Standalone (`@babel/standalone`)
- **Styling**: Native CSS tokens & variables supporting Light Mode and Dark Mode (`css/style.css`, `css/settings.css`, `css/dashboard.css`)
- **Data Persistence**: `window.StorageAPI` (`localStorage`)

## Running the Application
No build tools or bundlers required. Simply open `index.html` in any modern web browser or serve via any static HTTP server:
```bash
# Using python HTTP server
python -m http.server 8000

# Or using npx serve
npx serve .