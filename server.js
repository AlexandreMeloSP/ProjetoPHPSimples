const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const BASE_PATH = process.env.BASE_PATH || '/divinajo';

const mimeTypes = {
  '.html': 'text/html',
  '.php': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

function processPhp(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Process php includes
  content = content.replace(/<\?php\s+include\s+['"]([^'"]+)['"]\s*;\s*\?>/g, (match, file) => {
    const incPath = path.join(path.dirname(filePath), file);
    if (fs.existsSync(incPath)) {
      return processPhp(incPath);
    }
    return '';
  });
  // Process simple php date
  content = content.replace(/<\?php\s+echo\s+date\(["']Y["']\);\s*\?>/g, new Date().getFullYear());
  return content;
}

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  // Redirect /divinajo to /divinajo/ so relative paths resolve correctly
  if (reqUrl === BASE_PATH && BASE_PATH !== '') {
    res.writeHead(301, { Location: `${BASE_PATH}/` });
    res.end();
    return;
  }

  // Remove base path prefix if present (e.g. /divinajo or /divinajo/)
  if (reqUrl === `${BASE_PATH}/`) {
    reqUrl = '/index.php';
  } else if (reqUrl.startsWith(`${BASE_PATH}/`)) {
    reqUrl = reqUrl.substring(BASE_PATH.length);
  }

  if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.php';

  const filePath = path.resolve(__dirname, '.' + reqUrl);

  if (filePath !== __dirname && !filePath.startsWith(__dirname + path.sep)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('403 Forbidden');
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<h1>404 Not Found</h1>');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.php') {
    try {
      const html = processPhp(filePath);
      // Inject <base> tag so relative assets always resolve to BASE_PATH
      const baseTag = `<base href="${BASE_PATH}/">`;
      const withBase = html.replace('</head>', `  ${baseTag}\n</head>`);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(withBase);
    } catch (err) {
      res.statusCode = 500;
      res.end('PHP Processing Error: ' + err.message);
    }
  } else {
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error reading file');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
