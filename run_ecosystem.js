const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const REPO_ROOT = __dirname;
const CUSTOMER_DIR = path.join(REPO_ROOT, 'customer');
const SELLER_DIR = path.join(REPO_ROOT, 'seller');

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

function createStaticServer(siteName, rootDir, port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const rawPath = parsedUrl.pathname || '/';

    // Transparent proxy for REST API to Central Server (Port 5000)
    if (rawPath.startsWith('/api/')) {
      const proxyReq = http.request({
        hostname: 'localhost',
        port: 5000,
        path: req.url,
        method: req.method,
        headers: { ...req.headers, host: 'localhost:5000' }
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, {
          ...proxyRes.headers,
          'Access-Control-Allow-Origin': '*'
        });
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: 'API Gateway Proxy Error', message: err.message }));
      });

      req.pipe(proxyReq);
      return;
    }

    let cleanPath = rawPath.replace(/^\/(customer|seller)(\/|$)/, '/');
    let safePath = path.normalize(cleanPath).replace(/^(\.\.[\/\\])+/, '');
    if (safePath.startsWith(path.sep)) safePath = safePath.slice(1);

    let filePath = path.join(rootDir, safePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // Fallback: if not found, check if it's requesting root or html
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      if (rawPath === '/' || rawPath === '' || rawPath.endsWith('/') || !path.extname(rawPath)) {
        const fallbackIndex = path.join(rootDir, 'index.html');
        if (fs.existsSync(fallbackIndex)) {
          filePath = fallbackIndex;
        }
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found on ${siteName}: ${rawPath}`);
    }
  });

  server.listen(port, () => {
    console.log(`🌐 [${siteName}] running on http://localhost:${port}`);
  });
  return server;
}

// Start Distinct Websites
console.log('================================================================');
console.log('🚀 Launching TrendMart Multi-Site Ecosystem (React 18 CDN + CSS)');
console.log('================================================================');

// 1. Site 1: Admin Panel (Port 3000)
createStaticServer('TrendMart Admin Panel', REPO_ROOT, 3000);

// 2. Site 2: Customer Storefront (Port 3001)
createStaticServer('TrendMart Customer Store', CUSTOMER_DIR, 3001);

// 3. Site 3: Seller Hub Portal (Port 3002)
createStaticServer('TrendMart Seller Hub', SELLER_DIR, 3002);

// 4. Central Database & REST API (Port 5000)
require('./server/server.js');
