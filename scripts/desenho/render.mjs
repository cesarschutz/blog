#!/usr/bin/env node
/**
 * Renderiza a folha de conferência de cada ilustração (/amostra/desenhos/ do dev) nos temas claro e
 * escuro e junta as duas num PNG só, em .render/desenhos/<slug>.png, para olhar antes de aceitar o
 * desenho (skill desenho). Precisa do `npm run dev` no ar.
 *
 *   node scripts/desenho/render.mjs [slug…]   (sem slug, todas; ENDERECO troca o endereço do dev)
 */
import { mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const endereco = process.env.ENDERECO ?? "http://127.0.0.1:4322";
const pedidos = process.argv.slice(2);
const slugs = pedidos.length
  ? pedidos
  : readdirSync(join(raiz, "src", "ilustracoes"))
      .filter((f) => f.endsWith(".svg"))
      .map((f) => f.replace(/\.svg$/, ""));
const saida = join(raiz, ".render", "desenhos");
mkdirSync(saida, { recursive: true });

try {
  await fetch(`${endereco}/amostra/desenhos/`);
} catch {
  console.error(`Não achei o dev em ${endereco}. Rode: fnm exec --using=24 npm run dev`);
  process.exit(1);
}

const navegador = await chromium.launch({ channel: "chrome", headless: true });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
for (const slug of slugs) {
  const fotos = [];
  for (const tema of ["claro", "escuro"]) {
    // O dev recarrega a página quando um desenho acabou de mudar: tenta de novo algumas vezes.
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      try {
        await pagina.goto(`${endereco}/amostra/desenhos/?slug=${encodeURIComponent(slug)}&tema=${tema}`, { waitUntil: "load" });
        await pagina.evaluate(() => document.fonts.ready);
        await pagina.waitForTimeout(300);
        const folha = pagina.locator(`.conferencia[data-slug="${slug}"]`);
        if (!(await folha.count())) {
          console.error(`✗ ${slug}: não aparece na folha (falta o post ou a ilustração).`);
          break;
        }
        fotos.push(await folha.screenshot());
        break;
      } catch (erro) {
        if (tentativa === 3) throw erro;
        await pagina.waitForTimeout(1000);
      }
    }
  }
  if (fotos.length !== 2) continue;
  const [a, b] = await Promise.all(fotos.map((f) => sharp(f).metadata()));
  const largura = Math.max(a.width, b.width);
  const arquivo = join(saida, `${slug}.png`);
  await sharp({ create: { width: largura, height: a.height + b.height, channels: 3, background: "#888888" } })
    .composite([
      { input: fotos[0], top: 0, left: 0 },
      { input: fotos[1], top: a.height, left: 0 },
    ])
    .png()
    .toFile(arquivo);
  console.log(`✓ ${slug}: ${arquivo}`);
}
await navegador.close();
