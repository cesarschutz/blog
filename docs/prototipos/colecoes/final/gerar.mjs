#!/usr/bin/env node
/**
 * A página do resultado final da coleção de 13 (D61) para o Cesar ver no app (artifact): lê
 * final/dados.json, final/artifact.json e as fotos de capturar.mjs (.render/colecoes/estante-final.webp,
 * capa-final-<slug>.webp, estante-hoje.webp) e grava .render/colecoes/final.html. As fontes do blog
 * entram como data URI, do node_modules: nada de Google Fonts.
 *
 *   node docs/prototipos/colecoes/final/montar.mjs
 *   node docs/prototipos/colecoes/capturar.mjs final     (com o dev no ar)
 *   node docs/prototipos/colecoes/final/gerar.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..", "..", "..");
const { livros } = JSON.parse(readFileSync(join(aqui, "dados.json"), "utf8"));
const textos = JSON.parse(readFileSync(join(aqui, "artifact.json"), "utf8"));
const medidas = JSON.parse(readFileSync(join(raiz, ".render", "colecoes", "medidas.json"), "utf8"));

const fonte = (pacote, arquivo) =>
  `data:font/woff2;base64,${readFileSync(join(raiz, "node_modules", "@fontsource-variable", pacote, "files", arquivo)).toString("base64")}`;

const titulos = Object.fromEntries(
  readdirSync(join(raiz, "src", "content", "posts")).map((arquivo) => {
    const texto = readFileSync(join(raiz, "src", "content", "posts", arquivo), "utf8");
    const titulo = /^title:\s*"?(.*?)"?\s*$/m.exec(texto)?.[1] ?? arquivo;
    return [arquivo.replace(/\.mdx?$/, ""), titulo.split(" — ")[0]];
  }),
);

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const vol = (n) => String(n).padStart(2, "0");
const dimensoes = (arquivo, l = 180, a = 270) => `width="${medidas[arquivo]?.largura ?? l}" height="${medidas[arquivo]?.altura ?? a}"`;
const total = livros.reduce((n, l) => n + l.posts.length, 0);

function livro(l) {
  const posts = l.posts.map((p) => titulos[p] ?? p);
  const arquivo = `capa-final-${l.slug}.webp`;
  return `<article class="livro folha" id="${l.slug}" aria-labelledby="${l.slug}-titulo" style="--cor:${l.cor}">
  <div class="capa-e-tecido">
    <img class="capa" src="${arquivo}" ${dimensoes(arquivo)} loading="lazy" alt="Capa do livro ${esc(l.titulo)}, Volume ${vol(l.volume)}: ${esc(l.instrumento)}, na cor ${esc(l.nomeCor)}.">
  </div>
  <div class="ficha">
    <p class="volume">Volume ${vol(l.volume)}${l.novo ? ' <span class="etiqueta">livro novo</span>' : ""}</p>
    <h3 id="${l.slug}-titulo">${esc(l.titulo)}</h3>
    <p class="frase">${esc(l.frase)}</p>
    <p class="temas">${l.temas.map(esc).join(" · ")}</p>
    <div class="abrange">
      <p class="rotulo">Abrange</p>
      <ul>${l.abrange.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
    </div>
    <p class="posts"><span class="rotulo">${posts.length ? `${posts.length} ${posts.length === 1 ? "post" : "posts"} de hoje` : "Começa sem posts"}</span>${posts.length ? ` ${esc(posts.join("; "))}.` : ""}</p>
    <div class="identidade">
      <p><span class="amostra" aria-hidden="true"></span><span class="rotulo">Cor</span> ${esc(l.nomeCor)} <code>${l.cor}</code>. ${esc(l.motivoCurto ?? l.motivoCor)}</p>
      <p><span class="rotulo">Desenho</span> ${esc(l.instrumento)}${l.data ? ` (${esc(l.data)})` : ""}. ${esc(l.historia ?? l.trabalho ?? "")}</p>
    </div>
  </div>
</article>`;
}

const css = `
@font-face { font-family: "Besley"; font-weight: 400 900; font-display: swap; src: url(${fonte("besley", "besley-latin-wght-normal.woff2")}) format("woff2"); }
@font-face { font-family: "Literata"; font-weight: 200 900; font-display: swap; src: url(${fonte("literata", "literata-latin-wght-normal.woff2")}) format("woff2"); }
@font-face { font-family: "Literata"; font-style: italic; font-weight: 200 900; font-display: swap; src: url(${fonte("literata", "literata-latin-wght-italic.woff2")}) format("woff2"); }
@font-face { font-family: "IBM Plex Sans"; font-weight: 100 700; font-display: swap; src: url(${fonte("ibm-plex-sans", "ibm-plex-sans-latin-wght-normal.woff2")}) format("woff2"); }

/* As folhas claras do blog (DESIGN.md). Leitura: a estante no alto, o princípio do conjunto e a paleta,
   e um livro por folha, na ordem dos volumes (a mesma da estante). */
:root {
  --paper: #f1f0eb;
  --paper-hi: #fffffe;
  --well: #f5f5f4;
  --ink: #1a2124;
  --ink-2: #57605e;
  --ink-3: #868d8a;
  --rule: #e2e0d8;
  --acento: #2549b8;
  --sombra: 0 1px 2px rgba(40, 38, 30, 0.04), 0 10px 28px -18px rgba(40, 38, 30, 0.28);
  --titulo: "Besley", "Iowan Old Style", Georgia, serif;
  --texto: "Literata", Georgia, "Times New Roman", serif;
  --ui: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --paper: #111618; --paper-hi: #1a2124; --well: #21282a; --ink: #e7e9e4; --ink-2: #a9b0ac; --ink-3: #7f8884;
    --rule: #2a3336; --acento: #93aeff; --sombra: 0 12px 30px -18px rgba(0, 0, 0, 0.8);
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --paper: #111618; --paper-hi: #1a2124; --well: #21282a; --ink: #e7e9e4; --ink-2: #a9b0ac; --ink-3: #7f8884;
  --rule: #2a3336; --acento: #93aeff; --sombra: 0 12px 30px -18px rgba(0, 0, 0, 0.8);
}

body { background: var(--paper); color: var(--ink); font: 400 1.0625rem/1.65 var(--texto); padding-inline: clamp(16px, 4vw, 40px); }
.pagina { max-width: 1180px; margin: 0 auto; padding-block: 40px 72px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 28px; }
h1, h2, h3 { font-family: var(--titulo); font-weight: 800; letter-spacing: -0.01em; text-wrap: balance; margin: 0; color: var(--ink); }
p { margin: 0; }
a { color: var(--acento); text-underline-offset: 3px; }
a:focus-visible { outline: 2px solid var(--acento); outline-offset: 3px; border-radius: 2px; }
code { font-family: ui-monospace, "JetBrains Mono", Menlo, monospace; font-size: 0.85em; background: var(--well); padding: 0.05em 0.35em; border-radius: 4px; }
.rotulo { font-family: var(--ui); font-weight: 600; font-size: 0.78rem; letter-spacing: 0.04em; color: var(--ink-2); margin-right: 0.35em; }
.folha { background: var(--paper-hi); border: 1px solid var(--rule); border-radius: 14px; box-shadow: var(--sombra); padding: clamp(20px, 3.4vw, 40px); }

.abertura { display: grid; gap: 14px; }
.abertura .sobre { font-family: var(--ui); font-size: 0.85rem; color: var(--ink-2); }
.abertura h1 { font-size: clamp(2.3rem, 5.4vw, 3.6rem); line-height: 1.04; }
.abertura .lead { max-width: 68ch; font-size: 1.12rem; }
.abertura .comoler { max-width: 68ch; color: var(--ink-2); }
.estante { margin: 8px 0 0; display: grid; gap: 8px; }
.estante img { max-width: 100%; height: auto; display: block; }
.estante figcaption { font-family: var(--ui); font-size: 0.82rem; color: var(--ink-3); }

.conjunto { display: grid; gap: 14px; }
.conjunto h2, .muda h2, .decidir h2, .antes h2 { font-size: clamp(1.4rem, 2.6vw, 1.75rem); }
.conjunto p { max-width: 70ch; }
.paleta { list-style: none; margin: 8px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 150px), 1fr)); gap: 12px; }
.paleta li { display: grid; grid-template-columns: 22px 1fr; gap: 10px; align-items: center; font-family: var(--ui); font-size: 0.82rem; line-height: 1.35; }
.paleta .tecido { width: 22px; height: 34px; border-radius: 2px 4px 4px 2px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); }
.paleta a { color: var(--ink); text-decoration: none; }
.paleta a:hover { text-decoration: underline; }
.paleta .hex { color: var(--ink-3); font-variant-numeric: tabular-nums; }

.livros { display: grid; gap: 22px; }
.livro { display: grid; grid-template-columns: minmax(0, 250px) minmax(0, 1fr); gap: clamp(20px, 3.4vw, 44px); align-items: start; scroll-margin-top: 16px; }
.capa { width: 100%; max-width: 250px; height: auto; display: block; border-radius: 2px 3px 3px 2px; box-shadow: 0 1px 1px rgba(0,0,0,.18), 0 16px 30px -14px rgba(0,0,0,.4); }
.ficha { display: grid; gap: 10px; min-width: 0; max-width: 68ch; }
.volume { font-family: var(--ui); font-size: 0.8rem; color: var(--ink-3); display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; font-variant-numeric: tabular-nums; }
.etiqueta { font-family: var(--ui); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.03em; color: var(--ink-2); border: 1px solid var(--rule); border-radius: 999px; padding: 0 8px; line-height: 1.6; }
.livro h3 { font-size: clamp(1.6rem, 3vw, 2.1rem); line-height: 1.1; }
.frase { font-style: italic; font-size: 1.18rem; }
.temas { font-family: var(--ui); font-size: 0.86rem; color: var(--ink-2); }
.abrange ul { margin: 4px 0 0; padding-left: 1.1em; columns: 2 16rem; column-gap: 28px; font-size: 0.95rem; line-height: 1.5; }
.abrange li { break-inside: avoid; margin-bottom: 3px; }
.abrange li::marker { color: var(--ink-3); }
.posts { font-size: 0.92rem; color: var(--ink-2); line-height: 1.5; }
.identidade { display: grid; gap: 8px; border-top: 1px solid var(--rule); padding-top: 12px; font-size: 0.93rem; line-height: 1.55; }
.identidade .amostra { display: inline-block; width: 12px; height: 12px; border-radius: 3px; background: var(--cor); box-shadow: inset 0 0 0 1px rgba(0,0,0,.14); margin-right: 7px; vertical-align: -1px; }

.muda ul, .decidir ul { margin: 12px 0 0; padding-left: 1.1em; display: grid; gap: 8px; max-width: 80ch; }
.muda li::marker, .decidir li::marker { color: var(--ink-3); }
.antes { display: grid; gap: 10px; }
.antes p { color: var(--ink-2); max-width: 70ch; }
.antes img { max-width: 100%; height: auto; display: block; }
.rodape { font-family: var(--ui); font-size: 0.82rem; color: var(--ink-3); max-width: 80ch; }

@media (max-width: 640px) {
  .livro { grid-template-columns: minmax(0, 1fr); }
  .capa { max-width: 200px; }
}
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
`;

const html = `<title>${esc(textos.titulo)}</title>
<style>${css}</style>
<main class="pagina">
  <header class="abertura folha">
    <p class="sobre">Blog do Cesar Schutz · a coleção de livros · ${esc(textos.data)}</p>
    <h1>${esc(textos.titulo)}</h1>
    <p class="lead">${esc(textos.lead)}</p>
    <p class="comoler">${esc(textos.comoLer)}</p>
    <figure class="estante">
      <img src="estante-final.webp" ${dimensoes("estante-final.webp", 1200, 380)} alt="A estante nova: ${esc(livros.map((l) => l.titulo).join(", "))}, e a revista Atualizações do Java depois do aparador.">
      <figcaption>Em ordem alfabética, que é a ordem dos volumes. Os números nas lombadas são os posts de hoje em cada livro (${total} no total); a revista do Java fica fora da coleção, como hoje.</figcaption>
    </figure>
  </header>

  <section class="conjunto folha" aria-labelledby="conjunto-titulo">
    <h2 id="conjunto-titulo">${esc(textos.conjunto.titulo)}</h2>
    ${textos.conjunto.paragrafos.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}
    <ul class="paleta" aria-label="As treze cores, na ordem da estante">
${livros.map((l) => `      <li><span class="tecido" style="background:${l.cor}" aria-hidden="true"></span><span><a href="#${l.slug}">${vol(l.volume)} ${esc(l.titulo)}</a><br>${esc(l.nomeCor)} <span class="hex">${l.cor}</span></span></li>`).join("\n")}
    </ul>
  </section>

  <div class="livros">
${livros.map(livro).join("\n")}
  </div>

  <section class="decidir folha" aria-labelledby="decidir-titulo">
    <h2 id="decidir-titulo">Para você decidir</h2>
    <ul>${textos.decidir.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
  </section>

  <section class="muda folha" aria-labelledby="muda-titulo">
    <h2 id="muda-titulo">O que muda no site, quando você aprovar</h2>
    <ul>${textos.muda.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
  </section>

  <section class="antes folha" aria-labelledby="antes-titulo">
    <h2 id="antes-titulo">A estante de hoje, para comparar</h2>
    <p>Os oito livros como estão no site.</p>
    <img src="estante-hoje.webp" ${dimensoes("estante-hoje.webp", 1000, 380)} loading="lazy" alt="A estante de hoje: Arquitetura de Software, Desenvolvimento de Software, Dados, IA, Segurança, DevOps, SRE e Carreira, e a revista do Java.">
  </section>

  <p class="rodape">${esc(textos.rodape)}</p>
</main>
`;

writeFileSync(join(raiz, ".render", "colecoes", "final.html"), html);
console.log(`.render/colecoes/final.html (${(html.length / 1024).toFixed(0)} KB)`);
