#!/usr/bin/env node
/**
 * A marca do blog (D33): o livro "cs", com a capa do Volume 01 e a fita da série.
 *
 * Gera, a partir da fonte Besley 800 que o site já usa:
 * - src/lib/marca.ts: o SVG da marca (as letras viram traçado, sem depender da fonte carregar), que o
 *   componente Marca.astro usa com as cores dos tokens;
 * - public/favicon.svg, public/favicon.ico (16, 32 e 48 px) e public/apple-touch-icon.png (180 px).
 *
 * As letras saem do Chrome: ele imprime "cs" num PDF com a fonte variável no peso 800, e o
 * `pdftocairo` (poppler, do Homebrew) converte o PDF em SVG com o contorno de cada letra.
 *   node scripts/marca.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";
import { claro } from "../src/styles/tokens.ts";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONTE = join(RAIZ, "node_modules/@fontsource-variable/besley/files/besley-latin-wght-normal.woff2");
const ITALICO = join(RAIZ, "node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2");

// ---------- 1. o contorno das letras: "cs" em Besley 800 e "blog" em Newsreader itálico ----------
const pasta = mkdtempSync(join(tmpdir(), "marca-"));
const navegador = await chromium.launch({ channel: "chrome" });

/** Imprime o texto num PDF com a fonte dada e devolve o contorno de cada letra e a caixa do conjunto. */
async function contorno(nome, fonte, estilo, texto) {
  const pagina = await navegador.newPage();
  await pagina.setContent(
    `<style>@font-face{font-family:F;src:url("${pathToFileURL(fonte)}");font-weight:100 900;font-style:normal italic}
     body{margin:0}p{margin:0;font-family:F;font-size:1000px;line-height:1;${estilo}}</style><p>${texto}</p>`,
  );
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.pdf({ path: join(pasta, `${nome}.pdf`), width: "2600px", height: "1200px" });
  await pagina.close();
  execFileSync("pdftocairo", ["-svg", join(pasta, `${nome}.pdf`), join(pasta, `${nome}.svg`)]);
  const svg = readFileSync(join(pasta, `${nome}.svg`), "utf8");
  const glifos = Object.fromEntries(
    [...svg.matchAll(/<g id="(glyph-[\d-]+)">\s*<path d="([^"]+)"/g)].map(([, id, d]) => [id, d]),
  );
  const usos = [...svg.matchAll(/<use xlink:href="#(glyph-[\d-]+)" x="([\d.-]+)" y="([\d.-]+)"\/>/g)].map(
    ([, id, x, y]) => ({ d: glifos[id], x: Number(x), y: Number(y) }),
  );
  if (usos.length !== texto.length) throw new Error(`"${texto}": esperava ${texto.length} letras, vieram ${usos.length}`);
  // Caixa das letras (os pontos extremos das curvas de uma fonte ficam nos nós).
  const numeros = (d) => d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const u of usos) {
    const n = numeros(u.d);
    for (let i = 0; i < n.length; i += 2) {
      x0 = Math.min(x0, n[i] + u.x);
      x1 = Math.max(x1, n[i] + u.x);
      y0 = Math.min(y0, n[i + 1] + u.y);
      y1 = Math.max(y1, n[i + 1] + u.y);
    }
  }
  return { usos, x0, y0, x1, y1 };
}

const { usos, x0, y0, x1, y1 } = await contorno("cs", FONTE, "font-weight:800", "cs");
const blog = await contorno("blog", ITALICO, 'font-style:italic;font-weight:420;font-variation-settings:"opsz" 24', "blog");
await navegador.close();

// ---------- 2. a marca: capa 40 × 52, dobradiça, letras e a fita que sai por baixo ----------
const LARGURA = 40;
const CAPA = 52;
const ALTURA = 60;
const LETRAS = 25.5; // largura de "cs"
const escala = LETRAS / (x1 - x0);
const centroX = (5 + LARGURA) / 2; // à direita da dobradiça
const centroY = 23.5;
const tx = centroX - ((x0 + x1) / 2) * escala;
const ty = centroY - ((y0 + y1) / 2) * escala;
const arredondar = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));
const letras = usos
  .map((u) => `<path transform="translate(${u.x.toFixed(1)} ${u.y.toFixed(1)})" d="${arredondar(u.d).replace(/\s+/g, " ").trim()}"/>`)
  .join("");

/** SVG interno da marca, com classes para o CSS pintar (Marca.astro). */
const interno =
  `<path class="marca-fita" d="M27 44h6v16l-3-3.4-3 3.4z"/>` +
  `<rect class="marca-capa" width="${LARGURA}" height="${CAPA}" rx="3.2"/>` +
  `<rect class="marca-dobra" x="4" width="1" height="${CAPA}"/>` +
  `<g class="marca-letras" transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${escala.toFixed(5)})">${letras}</g>`;

// "blog": caixa justa em unidades de 1/100 do corpo, a partir da linha de base.
const E = 0.1;
const bx = blog.x0 - 8;
const blogSvg = `<g transform="scale(${E}) translate(${(-bx).toFixed(1)} 0)">` +
  blog.usos
    .map((u) => `<path transform="translate(${u.x.toFixed(1)} ${(u.y - blog.y1).toFixed(1)})" d="${arredondar(u.d).replace(/\s+/g, " ").trim()}"/>`)
    .join("") +
  "</g>";
const viewBoxBlog = `0 ${((blog.y0 - blog.y1) * E).toFixed(1)} ${((blog.x1 - blog.x0 + 16) * E).toFixed(1)} ${((blog.y1 - blog.y0) * E).toFixed(1)}`;

writeFileSync(
  join(RAIZ, "src/lib/marca.ts"),
  `/**
 * A marca do blog (D33), gerada por scripts/marca.mjs (não edite à mão): o livro "cs" com a capa do
 * Volume 01, a dobradiça, as letras em Besley 800 (em traçado) e a fita da série saindo por baixo.
 * As classes são pintadas pelo Marca.astro com os tokens --marca, --marca-letra e --marca-fita.
 */
export const MARCA_VIEWBOX = "0 0 ${LARGURA} ${ALTURA}";
export const MARCA_SVG = ${JSON.stringify(interno)};

/**
 * "blog" em Newsreader itálico (a fonte das frases dos livros), em traçado: a palavra aparece em toda
 * página, e a fonte inteira pesaria 147 KB por ela. Pintado com currentColor.
 */
export const BLOG_VIEWBOX = "${viewBoxBlog}";
export const BLOG_SVG = ${JSON.stringify(blogSvg)};
/** Quanto da altura do "blog" fica abaixo da linha de base (a perna do g), para alinhar com o nome. */
export const BLOG_DESCENDENTE = ${((blog.y1 - blog.usos[0].y) / (blog.y1 - blog.y0)).toFixed(4)};
`,
);

// ---------- 3. ícones: o livro sobre um quadrado de papel ----------
const pintado = interno
  .replace('class="marca-fita"', `fill="${claro["marca-fita"]}"`)
  .replace('class="marca-capa"', `fill="${claro.marca}"`)
  .replace('class="marca-dobra"', 'fill="#000" fill-opacity=".24"')
  .replace('class="marca-letras"', `fill="${claro["marca-letra"]}"`);
const icone = (lado, raio, fundo = claro["marca-letra"]) => {
  const altura = lado * 0.86;
  const s = altura / ALTURA;
  const x = (lado - LARGURA * s) / 2;
  const y = (lado - altura) / 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}">` +
    `<rect width="${lado}" height="${lado}" rx="${raio}" fill="${fundo}"/>` +
    `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(4)})">${pintado}</g></svg>`
  );
};

const favicon = icone(64, 14);
writeFileSync(join(RAIZ, "public/favicon.svg"), favicon + "\n");

const png = (svgTexto, lado) => sharp(Buffer.from(svgTexto), { density: 384 }).resize(lado, lado).png().toBuffer();
// ICO com PNG dentro (aceito por todos os navegadores atuais): 16, 32 e 48 px.
const tamanhos = [16, 32, 48];
const imagens = await Promise.all(tamanhos.map((t) => png(favicon, t)));
const cabecalho = Buffer.alloc(6 + 16 * imagens.length);
cabecalho.writeUInt16LE(0, 0);
cabecalho.writeUInt16LE(1, 2);
cabecalho.writeUInt16LE(imagens.length, 4);
let deslocamento = cabecalho.length;
imagens.forEach((img, i) => {
  const e = 6 + 16 * i;
  cabecalho.writeUInt8(tamanhos[i], e);
  cabecalho.writeUInt8(tamanhos[i], e + 1);
  cabecalho.writeUInt16LE(1, e + 4);
  cabecalho.writeUInt16LE(32, e + 6);
  cabecalho.writeUInt32LE(img.length, e + 8);
  cabecalho.writeUInt32LE(deslocamento, e + 12);
  deslocamento += img.length;
});
writeFileSync(join(RAIZ, "public/favicon.ico"), Buffer.concat([cabecalho, ...imagens]));
// No iPhone o sistema arredonda os cantos: o quadrado vai sem raio.
writeFileSync(join(RAIZ, "public/apple-touch-icon.png"), await png(icone(180, 0), 180));

console.log(`marca: letras ${(x1 - x0).toFixed(0)} × ${(y1 - y0).toFixed(0)} pt → escala ${escala.toFixed(4)}`);
console.log("gerados: src/lib/marca.ts, public/favicon.svg, public/favicon.ico, public/apple-touch-icon.png");
