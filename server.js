import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './server/api.js';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.CODEFIELD_PORT || process.env.PORT) || 8765;
const host = process.env.HOST || '127.0.0.1';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

async function serveStatic(req, res, pathname) {
  let path = resolve(root, '.' + decodeURIComponent(pathname));
  if (!path.startsWith(root + sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  const relative = path.slice(root.length + 1).replace(/\\/g, '/');
  if (!['app', 'demo', 'src'].some(directory => relative === directory || relative.startsWith(directory + '/'))) {
    res.writeHead(404).end('Not found');
    return;
  }
  try {
    const info = await stat(path);
    if (info.isDirectory()) path = join(path, 'index.html');
  } catch {
    res.writeHead(404).end('Not found');
    return;
  }
  try {
    const data = await readFile(path);
    res.writeHead(200, {
      'Content-Type': types[extname(path).toLowerCase()] || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': ['.html', '.js', '.css'].includes(extname(path).toLowerCase()) ? 'no-cache' : 'public, max-age=60',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404).end('Not found');
  }
}

createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url, 'http://localhost');
    decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end('Invalid URL');
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    if (req.headers.origin && req.headers.origin !== 'http://' + req.headers.host && req.headers.origin !== 'https://' + req.headers.host) {
      res.writeHead(403).end('Cross-origin request denied');
      return;
    }
    await handleApi(req, res, url);
    return;
  }
  if (url.pathname === '/') {
    res.writeHead(302, { Location: '/app/' }).end();
    return;
  }
  await serveStatic(req, res, url.pathname);
}).listen(port, host, () => {
  console.log(`Codefield running at http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${port}/`);
  if (host === '0.0.0.0') console.log('Listening on all interfaces; only use this on a trusted network.');
  console.log('Local models: Ollama :11434 · Strata Desktop :47831/v1 (terminal :8080/v1) · LM Studio :1234/v1');
});
