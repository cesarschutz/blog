import { createServer } from "node:http";
import { readFileSync, statSync, existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import { gzipSync } from "node:zlib";
export async function servir(pasta) {
  const tipos = {
    ".html": "text/html;charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".png": "image/png",
    ".webp": "image/webp",
    ".xml": "application/xml",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
  };
  const root = resolve(pasta);
  const cache = new Map();
  const server = createServer((req, res) => {
    let file;
    try {
      file = resolve(
        root,
        "." + decodeURIComponent(new URL(req.url, "http://local").pathname),
      );
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (!file.startsWith(root + "/") && file !== root) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file += "/index.html";
    if (!existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    const mime = tipos[extname(file)] ?? "application/octet-stream";
    let data = cache.get(file);
    if (!data) {
      data = readFileSync(file);
      cache.set(file, data);
    }
    const zip =
      /text|json|xml|svg/.test(mime) &&
      /gzip/.test(req.headers["accept-encoding"] ?? "");
    res.writeHead(200, {
      "Content-Type": mime,
      ...(zip ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}),
      "Cache-Control": file.includes("/_astro/")
        ? "public,max-age=31536000,immutable"
        : "no-cache",
    });
    res.end(zip ? gzipSync(data) : data);
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((ok) => server.close(ok)),
  };
}
