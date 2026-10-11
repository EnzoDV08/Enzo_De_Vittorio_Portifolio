// Serves build/client like a static host: clean URLs, no trailing slash, 404.html fallback.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = "build/client";
const port = Number(process.env.PORT ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
};

const isFile = (p) => existsSync(p) && statSync(p).isFile();

function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const base = join(root, clean);
  for (const candidate of [base, `${base}.html`, join(base, "index.html")]) {
    if (isFile(candidate)) return candidate;
  }
  return null;
}

createServer((req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  if (path.length > 1 && path.endsWith("/")) {
    res.writeHead(301, { Location: path.slice(0, -1) }).end();
    return;
  }
  const file = resolve(path);
  const fallback = join(root, "404.html");
  const target = file ?? (isFile(fallback) ? fallback : null);
  if (!target) {
    res.writeHead(404).end("Not found");
    return;
  }
  res.writeHead(file ? 200 : 404, {
    "Content-Type": types[extname(target)] ?? "application/octet-stream",
  });
  createReadStream(target).pipe(res);
}).listen(port, () => console.log(`preview: http://localhost:${port}`));
