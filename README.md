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
- **Styling**: Native CSS tokens & variables supporting Light Mode and Dark Mode (`css/style.css`, `css/dashboard.css`)
- **Data Persistence**: `window.StorageAPI` (`localStorage`)

## Running the Application
No build tools or bundlers required. Simply open `index.html` in any modern web browser or serve via any static HTTP server:
```bash
# Using python HTTP server
python -m http.server 8000

# Or using npx serve
npx serve .
```
Open `http://localhost:8000` in your browser.
