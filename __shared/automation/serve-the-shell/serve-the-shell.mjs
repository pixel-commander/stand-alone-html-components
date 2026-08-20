import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join, dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const SHIPPER = join(HERE, '..', 'ship-new-project', 'ship-new-project.mjs');

const PORT = 8123;
const NAME_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function typeFor(path) {
  return TYPES[extname(path).toLowerCase()] || 'application/octet-stream';
}

function insideRoot(path) {
  const root = resolve(ROOT);
  const target = resolve(path);
  return target === root || target.startsWith(root + sep);
}

function runShipper(project_name) {
  return new Promise((done) => {
    execFile('node', [SHIPPER, project_name], { cwd: ROOT }, (error, stdout, stderr) => {
      const text = [stdout, stderr].filter(Boolean).join('\n');
      done({ ok: !error, text });
    });
  });
}

async function serveFile(request_path, response) {
  const relative_path = request_path === '/' ? 'index.html' : decodeURIComponent(request_path.slice(1));
  const target = join(ROOT, relative_path);

  if (!insideRoot(target)) {
    response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    return response.end('outside the root');
  }

  try {
    const info = await stat(target);
    const file = info.isDirectory() ? join(target, 'index.html') : target;
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': typeFor(file), 'cache-control': 'no-store' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('not here — ' + relative_path);
  }
}

async function serveShip(url, response) {
  const project_name = url.searchParams.get('name') || '';

  if (!NAME_PATTERN.test(project_name)) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
    return response.end('ship — not a project name');
  }

  const result = await runShipper(project_name);
  console.log('ship ' + project_name + ' — ' + (result.ok ? 'written' : 'blocked'));
  response.writeHead(result.ok ? 200 : 409, { 'content-type': 'text/plain; charset=utf-8' });
  response.end(result.text);
}

const SERVER = createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost:' + PORT);

  if (url.pathname === '/ship') return serveShip(url, response);
  return serveFile(url.pathname, response);
});

SERVER.listen(PORT, () => {
  console.log('serve-the-shell — http://localhost:' + PORT + '/');
  console.log('  ctrl-c to stop');
});
