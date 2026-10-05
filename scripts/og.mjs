#!/usr/bin/env node
/**
 * Imagens de compartilhamento (D10), depois do build: cada dist/og/<nome>/index.html é fotografada
 * no Chrome em 1200×630 e vira dist/og/<nome>.png; a pasta com o HTML sai do dist. Usa o Chrome
 * instalado (o dos runners do GitHub Actions também serve) via playwright-core, aberto por
 * scripts/chrome.mjs, e serve o dist por scripts/servir.mjs (D84).
 *
 *   node scripts/og.mjs [pasta do build]   (padrão: dist)
 */
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";
import { opcoesDoChrome } from "./chrome.mjs";
import { servir } from "./servir.mjs";
import sharp from "sharp";

const dist = process.argv[2] ?? "dist";
const pastaOg = join(dist, "og");
if (!existsSync(pastaOg)) {
  console.log("og: nenhuma página em dist/og/, nada a fazer.");
  process.exit(0);
}
const nomes = readdirSync(pastaOg).filter((n) => existsSync(join(pastaOg, n, "index.html")));

const servidor = await servir(dist);
const base = servidor.url;

let navegador;
try {
  navegador = await chromium.launch(opcoesDoChrome);
} catch (erro) {
  console.error("og: não achei o Chrome para gerar as imagens de compartilhamento.", erro.message);
  await servidor.close();
  process.exit(1);
}
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
let bytes = 0;
for (const nome of nomes) {
  await pagina.goto(`${base}/og/${nome}/`, { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  // O cartão encolhe o título que não cabe depois de carregar as fontes (CartaoCompartilhamento).
  await pagina.waitForSelector("[data-ajustado]", { timeout: 5000 });
  const foto = await pagina.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } });
  const png = await sharp(foto).png({ compressionLevel: 9, palette: true, quality: 92 }).toBuffer();
  await sharp(png).toFile(join(pastaOg, `${nome}.png`));
  rmSync(join(pastaOg, nome), { recursive: true, force: true });
  bytes += png.length;
}
await navegador.close();
await servidor.close();
console.log(`og: ${nomes.length} imagens em ${pastaOg}/ (${(bytes / 1048576).toFixed(1)} MB).`);
