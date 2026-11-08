const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const DATA_FILE = path.join(BASE_DIR, 'data', 'user_profiles.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS headers for local usage
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = req.url.split('?')[0];

  // API Endpoint: Save User Profile
  if (req.method === 'POST' && parsedUrl === '/api/save-record') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const newRecord = JSON.parse(body);
        newRecord.savedAt = new Date().toISOString();

        let records = [];
        try {
          if (fs.existsSync(DATA_FILE)) {
            records = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
          }
        } catch (e) { records = []; }

        // Update existing record by name+dob or prepend new
        const existingIdx = records.findIndex(r => r.name === newRecord.name && r.dob === newRecord.dob);
        if (existingIdx >= 0) {
          records[existingIdx] = newRecord;
        } else {
          records.unshift(newRecord);
        }

        // Keep last 100 records
        if (records.length > 100) records = records.slice(0, 100);

        fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Profile saved successfully locally' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API Endpoint: Get Saved Profiles
  if (req.method === 'GET' && parsedUrl === '/api/records') {
    try {
      const records = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) : [];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(records));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
    }
    return;
  }

  // Static File Serving
  let reqPath = decodeURI(parsedUrl);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(BASE_DIR, reqPath);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for client-side routing
      const fallback = path.join(BASE_DIR, 'index.html');
      fs.readFile(fallback, (err2, data) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err2, data) => {
      if (err2) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const url = `http://localhost:${PORT}`;
  console.log('========================================================');
  console.log('        PROVIDENCE - VEDIC DESTINY & PANCHANGAM         ');
  console.log('========================================================');
  console.log(`Server actively running on:`);
  console.log(`  Local:     ${url}`);
  console.log(`  Data File: ${DATA_FILE}`);
  console.log('========================================================');
  console.log('Press Ctrl+C to stop the server.');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is currently in use. Trying port ${Number(PORT) + 1}...`);
    server.listen(Number(PORT) + 1, '0.0.0.0');
  } else {
    console.error('Server error:', err);
  }
});
