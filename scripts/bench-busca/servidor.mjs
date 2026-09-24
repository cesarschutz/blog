/**
 * Servidor estático para a medição da busca (D2), parecido com o GitHub Pages: gzip nos arquivos de
 * texto, ETag com resposta 304 e cache curto (`maxAge` 0 força a revalidação na visita repetida).
 *
 * Rede lenta simulada aqui, e não pelo DevTools: o CDP só limita a página, e o Pagefind baixa o índice
 * de dentro de um Web Worker. `latenciaMs` atrasa cada resposta; `bytesPorSegundo` é a banda total,
 * dividida entre as transferências simultâneas.
 */
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { gzipSync } from "node:zlib";

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".txt": "text/plain; charset=utf-8",
};
const COMPRIMIR = /^(text\/|application\/(json|xml|wasm)|image\/svg)/;

/** Divide a banda entre as respostas em andamento, em fatias a cada 10 ms. */
function criarCompassador(bytesPorSegundo) {
  const fila = [];
  const porTique = Math.max(1, Math.floor(bytesPorSegundo / 100));
  setInterval(() => {
    let orcamento = porTique;
    while (orcamento > 0 && fila.length) {
      const parte = Math.max(1, Math.floor(orcamento / fila.length));
      for (const item of [...fila]) {
        const fatia = item.corpo.subarray(item.enviado, item.enviado + parte);
        item.res.write(fatia);
        item.enviado += fatia.length;
        orcamento -= fatia.length;
        if (item.enviado >= item.corpo.length) {
          item.res.end();
          fila.splice(fila.indexOf(item), 1);
        }
        if (orcamento <= 0) break;
      }
    }
  }, 10).unref();
  return (res, corpo) => fila.push({ res, corpo, enviado: 0 });
}

export function servir(pasta, porta, { maxAge = 600, latenciaMs = 0, bytesPorSegundo = 0 } = {}) {
  const cache = new Map();
  const enviarCompassado = bytesPorSegundo ? criarCompassador(bytesPorSegundo) : undefined;

  const responder = (req, res) => {
    const caminho = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let arquivo = normalize(join(pasta, caminho));
    if (!arquivo.startsWith(pasta)) return res.writeHead(403).end();
    if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = join(arquivo, "index.html");
    if (!existsSync(arquivo)) {
      res.writeHead(404, { "Content-Type": TIPOS[".html"] });
      return res.end(existsSync(join(pasta, "404.html")) ? readFileSync(join(pasta, "404.html")) : "404");
    }
    if (!cache.has(arquivo)) {
      const corpo = readFileSync(arquivo);
      const tipo = TIPOS[extname(arquivo)] ?? "application/octet-stream";
      const etag = `"${createHash("sha1").update(corpo).digest("hex").slice(0, 16)}"`;
      cache.set(arquivo, { corpo, tipo, etag, gz: COMPRIMIR.test(tipo) ? gzipSync(corpo, { level: 9 }) : undefined });
    }
    const { corpo, tipo, etag, gz } = cache.get(arquivo);
    const cabecalhos = { "Content-Type": tipo, ETag: etag, "Cache-Control": `max-age=${maxAge}` };
    if (req.headers["if-none-match"] === etag) return res.writeHead(304, cabecalhos).end();
    const usarGzip = gz && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
    const enviado = usarGzip ? gz : corpo;
    res.writeHead(200, { ...cabecalhos, ...(usarGzip ? { "Content-Encoding": "gzip" } : {}), "Content-Length": enviado.length });
    if (enviarCompassado) enviarCompassado(res, enviado);
    else res.end(enviado);
  };

  const servidor = createServer((req, res) => (latenciaMs ? setTimeout(() => responder(req, res), latenciaMs) : responder(req, res)));
  return new Promise((ok) => servidor.listen(porta, "127.0.0.1", () => ok(servidor)));
}
