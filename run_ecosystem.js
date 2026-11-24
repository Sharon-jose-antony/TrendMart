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
    const parsed = url.parse(req.url);
    let safePath = path.normalize(parsed.pathname).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(rootDir, safePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
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
      res.end(`404 Not Found on ${siteName}: ${parsed.pathname}`);
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
