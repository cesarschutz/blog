#!/usr/bin/env node
/**
 * Imagens de compartilhamento (D10), depois do build: cada dist/og/<nome>/index.html é fotografada
 * no Chrome em 1200×630 e vira dist/og/<nome>.png; a pasta com o HTML sai do dist. Usa o Chrome
 * instalado (o dos runners do GitHub Actions também serve) via playwright-core.
 *
 *   node scripts/og.mjs [pasta do build]   (padrão: dist)
 */
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const dist = process.argv[2] ?? "dist";
const pastaOg = join(dist, "og");
if (!existsSync(pastaOg)) {
  console.log("og: nenhuma página em dist/og/, nada a fazer.");
  process.exit(0);
}
const nomes = readdirSync(pastaOg).filter((n) => existsSync(join(pastaOg, n, "index.html")));

const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png" };
const servidor = createServer((pedido, resposta) => {
  const caminho = normalize(decodeURIComponent(new URL(pedido.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let arquivo = join(dist, caminho);
  if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = join(arquivo, "index.html");
  if (!existsSync(arquivo)) {
    resposta.writeHead(404).end();
    return;
  }
  resposta.writeHead(200, { "Content-Type": TIPOS[extname(arquivo)] ?? "application/octet-stream" });
  resposta.end(readFileSync(arquivo));
});
await new Promise((ok) => servidor.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${servidor.address().port}`;

let navegador;
try {
  navegador = await chromium.launch({ channel: "chrome", headless: true });
} catch (erro) {
  console.error("og: não achei o Chrome para gerar as imagens de compartilhamento.", erro.message);
  servidor.close();
  process.exit(1);
}
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
let bytes = 0;
for (const nome of nomes) {
  await pagina.goto(`${base}/og/${nome}/`, { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  const foto = await pagina.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } });
  const png = await sharp(foto).png({ compressionLevel: 9, palette: true, quality: 92 }).toBuffer();
  await sharp(png).toFile(join(pastaOg, `${nome}.png`));
  rmSync(join(pastaOg, nome), { recursive: true, force: true });
  bytes += png.length;
}
await navegador.close();
servidor.close();
console.log(`og: ${nomes.length} imagens em ${pastaOg}/ (${(bytes / 1048576).toFixed(1)} MB).`);
