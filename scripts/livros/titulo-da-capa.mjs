#!/usr/bin/env node
/**
 * O corpo do título na capa de um livro novo (CAPAS.md): "o corpo é o que faz a linha mais longa
 * ocupar 404px, com teto de 108px"; a entrelinha é igual ao corpo em títulos de uma linha e, nos de
 * duas, a dos livros de hoje (0,96 do corpo). Mede no Chrome, com a Bitter 800 do projeto e o letter-spacing da capa
 * (−0,03em). Mede também a frase (Newsreader itálico 24px, opsz 24, em 404px): quantas linhas ela ocupa.
 *
 *   node scripts/livros/titulo-da-capa.mjs "Arquitetura|de Software" "Dados" --frase "As decisões caras de desfazer."
 *   node scripts/livros/titulo-da-capa.mjs --json arquivo.json   (lista de { linhas: [...], frase })
 *
 * A barra separa as linhas do título. Saída: JSON com corpo, entrelinha e as linhas da frase.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
// As fontes entram como data URI: a página em branco do Chrome não carrega file://.
const fonte = (pacote, arquivo) =>
  `data:font/woff2;base64,${readFileSync(join(raiz, "node_modules", "@fontsource-variable", pacote, "files", arquivo)).toString("base64")}`;

export async function medirTitulos(itens) {
  const { chromium } = await import(pathToFileURL(join(raiz, "node_modules", "playwright-core", "index.mjs")).href);
  const caminhos = [process.env.CHROME_PATH, "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter((c) => c && existsSync(c));
  const navegador = await chromium.launch(caminhos.length ? { executablePath: caminhos[0] } : { channel: "chrome" });
  const pagina = await navegador.newPage();
  await pagina.setContent(`<!doctype html><meta charset="utf-8"><style>
    @font-face{font-family:B;font-weight:100 900;src:url(${fonte("bitter", "bitter-latin-wght-normal.woff2")}) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
    @font-face{font-family:B;font-weight:100 900;src:url(${fonte("bitter", "bitter-latin-ext-wght-normal.woff2")}) format("woff2");unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
    @font-face{font-family:N;font-style:italic;font-weight:200 800;src:url(${fonte("newsreader", "newsreader-latin-opsz-italic.woff2")}) format("woff2")}
    @font-face{font-family:N;font-style:italic;font-weight:200 800;src:url(${fonte("newsreader", "newsreader-latin-ext-opsz-italic.woff2")}) format("woff2");unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
    .t{font-family:B;font-weight:800;font-size:100px;letter-spacing:-.03em;white-space:nowrap;position:absolute}
    .f{font-family:N;font-style:italic;font-weight:400;font-size:24px;line-height:31px;width:404px;text-wrap:balance;font-variation-settings:"opsz" 24;position:absolute}
  </style><body></body>`);
  const resultado = await pagina.evaluate(async (itens) => {
    await Promise.all([...document.fonts].map((f) => f.load()));
    // Garante que as duas famílias carregaram, com os acentos.
    await document.fonts.load('800 100px B', "ÁÇÃÉÍÓÚçãõêâ");
    await document.fonts.load('italic 400 24px N', "ÁÇÃÉÍÓÚçãõêâ");
    const largura = (texto) => {
      const s = document.createElement("span");
      s.className = "t";
      s.textContent = texto;
      document.body.append(s);
      const w = s.getBoundingClientRect().width;
      s.remove();
      return w;
    };
    const linhasDaFrase = (frase) => {
      if (!frase) return 0;
      const p = document.createElement("p");
      p.className = "f";
      p.textContent = frase;
      document.body.append(p);
      const h = p.getBoundingClientRect().height;
      p.remove();
      return Math.round(h / 31);
    };
    return itens.map(({ linhas, frase }) => {
      const maior = Math.max(...linhas.map(largura));
      const exato = (404 / maior) * 100;
      // Calibrado com os oito livros de hoje (73, 50, 82 e 104, as entrelinhas 70 e 48): a medida do
      // Chrome dá ~2% a mais que a das referências, e a entrelinha de duas linhas é 0,96 do corpo.
      const corpo = Math.min(108, Math.round(exato * 0.98));
      const entrelinha = linhas.length > 1 ? Math.round(corpo * 0.96) : corpo;
      return { linhas, corpo, entrelinha, exato: Math.round(exato * 100) / 100, frase, linhasDaFrase: linhasDaFrase(frase) };
    });
  }, itens);
  await navegador.close();
  return resultado;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  let itens = [];
  const j = args.indexOf("--json");
  if (j >= 0) itens = JSON.parse(readFileSync(args[j + 1], "utf8"));
  else {
    const f = args.indexOf("--frase");
    const frase = f >= 0 ? args[f + 1] : undefined;
    itens = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--frase").map((t) => ({ linhas: t.split("|"), frase }));
  }
  console.log(JSON.stringify(await medirTitulos(itens), null, 1));
}
