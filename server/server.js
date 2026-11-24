const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const PORT = process.env.PORT || 5000;
const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to send JSON responses
function sendJSON(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', err => reject(err));
  });
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Static file server handler
function serveStatic(req, res, pathname) {
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT_DIR, safePath);

  // If directory, try index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + pathname);
  }
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // --- REST API ROUTING ---
  if (pathname.startsWith('/api/')) {
    try {
      // 1. Health check
      if (pathname === '/api/health') {
        return sendJSON(res, 200, { status: 'healthy', timestamp: new Date().toISOString() });
      }

      // 1.5 Authentication Endpoints
      if (pathname === '/api/auth/customer/login' && method === 'POST') {
        const body = await parseBody(req);
        const result = db.customerLogin(body.email, body.password);
        return sendJSON(res, result.error ? 401 : 200, result);
      }
      if (pathname === '/api/auth/customer/register' && method === 'POST') {
        const body = await parseBody(req);
        const result = db.customerRegister(body);
        return sendJSON(res, result.error ? 400 : 201, result);
      }
      if (pathname === '/api/auth/seller/login' && method === 'POST') {
        const body = await parseBody(req);
        const result = db.sellerLogin(body.email, body.password);
        return sendJSON(res, result.error ? 401 : 200, result);
      }
      if (pathname === '/api/auth/seller/register' && method === 'POST') {
        const body = await parseBody(req);
        const result = db.sellerRegister(body);
        return sendJSON(res, result.error ? 400 : 201, result);
      }

      // 2. Stats endpoint (KPIs for Admin / Seller)
      if (pathname === '/api/stats' && method === 'GET') {
        return sendJSON(res, 200, db.getStats());
      }

      // 3. Products
      if (pathname === '/api/products' && method === 'GET') {
        return sendJSON(res, 200, db.getProducts(parsedUrl.query));
      }
      if (pathname === '/api/products' && method === 'POST') {
        const body = await parseBody(req);
        const created = db.createProduct(body);
        return sendJSON(res, 201, created);
      }
      const productMatch = pathname.match(/^\/api\/products\/([^\/]+)$/);
      if (productMatch) {
        const id = productMatch[1];
        if (method === 'GET') {
          const item = db.getProductById(id);
          return item ? sendJSON(res, 200, item) : sendJSON(res, 404, { error: 'Product not found' });
        }
        if (method === 'PUT') {
          const body = await parseBody(req);
          const updated = db.updateProduct(id, body);
          return updated ? sendJSON(res, 200, updated) : sendJSON(res, 404, { error: 'Product not found' });
        }
        if (method === 'DELETE') {
          const deleted = db.deleteProduct(id);
          return deleted ? sendJSON(res, 200, { success: true }) : sendJSON(res, 404, { error: 'Product not found' });
        }
      }

      // 4. Categories
      if (pathname === '/api/categories' && method === 'GET') {
        return sendJSON(res, 200, db.getCategories());
      }
      if (pathname === '/api/categories' && method === 'POST') {
        const body = await parseBody(req);
        return sendJSON(res, 201, db.createCategory(body));
      }

      // 5. Orders
      if (pathname === '/api/orders' && method === 'GET') {
        return sendJSON(res, 200, db.getOrders(parsedUrl.query));
      }
      if (pathname === '/api/orders' && method === 'POST') {
        const body = await parseBody(req);
        const created = db.createOrder(body);
        return sendJSON(res, 201, created);
      }
      const orderMatch = pathname.match(/^\/api\/orders\/([^\/]+)$/);
      if (orderMatch && method === 'GET') {
        const item = db.getOrderById(orderMatch[1]);
        return item ? sendJSON(res, 200, item) : sendJSON(res, 404, { error: 'Order not found' });
      }
      const orderStatusMatch = pathname.match(/^\/api\/orders\/([^\/]+)\/status$/);
      if (orderStatusMatch && method === 'PUT') {
        const body = await parseBody(req);
        const updated = db.updateOrderStatus(orderStatusMatch[1], body.status, body.note);
        return updated ? sendJSON(res, 200, updated) : sendJSON(res, 404, { error: 'Order not found' });
      }

      // 6. Customers
      if (pathname === '/api/customers' && method === 'GET') {
        return sendJSON(res, 200, db.getCustomers());
      }

      // 7. Sellers
      if (pathname === '/api/sellers' && method === 'GET') {
        return sendJSON(res, 200, db.getSellers());
      }
      const sellerMatch = pathname.match(/^\/api\/sellers\/([^\/]+)$/);
      if (sellerMatch && method === 'GET') {
        const s = db.getSellerById(sellerMatch[1]);
        return s ? sendJSON(res, 200, s) : sendJSON(res, 404, { error: 'Seller not found' });
      }

      // 8. Banners
      if (pathname === '/api/banners' && method === 'GET') {
        return sendJSON(res, 200, db.getBanners());
      }

      // 9. Reset seed data
      if (pathname === '/api/seed' && method === 'POST') {
        return sendJSON(res, 200, { success: true, data: db.resetData() });
      }

      return sendJSON(res, 404, { error: 'Unknown API endpoint: ' + pathname });
    } catch (err) {
      console.error('[API Server Error]', err);
      return sendJSON(res, 500, { error: 'Internal Server Error', message: err.message });
    }
  }

  // --- STATIC FILE SERVING ---
  serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 TrendMart Central Ecosystem Server running on http://localhost:${PORT}`);
  console.log(`📡 REST API Base:          http://localhost:${PORT}/api/`);
  console.log(`👑 Admin Panel:            http://localhost:${PORT}/`);
  console.log(`🛍️ Customer Storefront:    http://localhost:${PORT}/customer/`);
  console.log(`💼 Seller Portal:          http://localhost:${PORT}/seller/`);
  console.log(`=======================================================`);
});
