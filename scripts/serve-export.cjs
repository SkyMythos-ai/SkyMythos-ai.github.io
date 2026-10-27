const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon', '.xml': 'application/xml; charset=utf-8',
};

function serve(directory, port = 4173, prefix = '') {
  const root = fs.realpathSync(directory);
  const server = http.createServer((request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
    try {
      let pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      if (prefix && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) { response.writeHead(404).end(); return; }
      pathname = pathname.slice(prefix.length);
      let file = path.resolve(root, `.${pathname || '/'}`);
      if (file !== root && !file.startsWith(`${root}${path.sep}`)) throw new Error('Outside export root');
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      file = fs.realpathSync(file);
      if (!file.startsWith(`${root}${path.sep}`) || !fs.statSync(file).isFile()) throw new Error('Outside export root');
      response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      if (request.method === 'HEAD') response.end(); else fs.createReadStream(file).pipe(response);
    } catch {
      const missing = path.join(root, '404.html');
      if (fs.existsSync(missing)) {
        response.writeHead(404, { 'Content-Type': mime['.html'] });
        if (request.method === 'HEAD') response.end(); else fs.createReadStream(missing).pipe(response);
      } else {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      }
    }
  });
  server.listen(port, '127.0.0.1', () => console.log(`Serving ${root} on http://127.0.0.1:${port}${prefix}/`));
  return server;
}

if (require.main === module) {
  const server = serve(path.resolve(process.argv[2] || 'out'), Number(process.argv[3] || process.env.PORT || 3000), process.env.BASE_PATH || '');
  for (const event of ['SIGINT', 'SIGTERM']) process.once(event, () => server.close());
}
module.exports = { serve };
