#!/usr/bin/env node
/**
 * A página das cinco sugestões para o Cesar ver no app (artifact): lê colecoes.json e as fotos de
 * capturar.mjs (.render/colecoes/) e grava .render/colecoes/index.html. As fontes do blog (Besley,
 * Literata e IBM Plex Sans) entram como data URI, do node_modules: nada de Google Fonts.
 *
 *   node docs/prototipos/colecoes/capturar.mjs   (com o dev no ar)
 *   node docs/prototipos/colecoes/gerar-artifact.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..", "..", "..");
const dados = JSON.parse(readFileSync(join(aqui, "colecoes.json"), "utf8"));
const extras = JSON.parse(readFileSync(join(aqui, "artifact.json"), "utf8"));

const fonte = (pacote, arquivo) =>
  `data:font/woff2;base64,${readFileSync(join(raiz, "node_modules", "@fontsource-variable", pacote, "files", arquivo)).toString("base64")}`;

const titulos = Object.fromEntries(
  readdirSync(join(raiz, "src", "content", "posts")).map((arquivo) => {
    const texto = readFileSync(join(raiz, "src", "content", "posts", arquivo), "utf8");
    const titulo = /^title:\s*"?(.*?)"?\s*$/m.exec(texto)?.[1] ?? arquivo;
    return [arquivo.replace(/\.mdx?$/, ""), titulo.split(" — ")[0]];
  }),
);

// O tamanho de cada foto na página de origem (px de CSS, de capturar.mjs), para o width/height das
// <img>: a página não pula enquanto as fotos chegam, e as estantes ficam na mesma escala entre si.
const medidas = JSON.parse(readFileSync(join(raiz, ".render", "colecoes", "medidas.json"), "utf8"));
const dimensoes = (arquivo) => `width="${medidas[arquivo]?.largura ?? 180}" height="${medidas[arquivo]?.altura ?? 270}"`;

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const maiuscula = (t) => `${t.charAt(0).toUpperCase()}${t.slice(1)}`;
const lista = (itens) => `${maiuscula(itens.join(", "))}.`;
const vol = (n) => String(n).padStart(2, "0");

const sugestoes = dados.sugestoes.filter((s) => s.id !== "hoje");
const hoje = dados.sugestoes.find((s) => s.id === "hoje");
const livroDe = (s, slug) => ({ ...dados.livros[slug], ...(s.sobrescreve?.[slug] ?? {}) });

// Identidades (desenho e cor), na ordem em que aparecem: as de hoje e as novas. Livro renomeado divide
// a identidade com o de hoje ("Desenvolvimento de Software · Java e Spring · Backend").
const identidades = [];
for (const s of [hoje, ...sugestoes])
  for (const slug of s.livros) {
    const l = dados.livros[slug];
    const existente = identidades.find((i) => i.chave === l.desenho);
    if (existente) {
      if (!existente.nomes.includes(l.titulo)) existente.nomes.push(l.titulo);
    } else identidades.push({ chave: l.desenho, slug, nomes: [l.titulo], ...l });
  }

function cartaoLivro(s, slug, i) {
  const l = livroDe(s, slug);
  const posts = (s.posts?.[slug] ?? []).map((p) => titulos[p] ?? p);
  const novo = !l.deHoje;
  const etiqueta = novo ? "novo" : l.renomeiaDe ? `era ${l.renomeiaDe}` : "";
  return `<li class="livro">
  <img class="capa" src="capa-${s.id}-${slug}.webp" ${dimensoes(`capa-${s.id}-${slug}.webp`)} loading="lazy" alt="Capa do livro ${esc(l.titulo)}: ${esc(l.instrumento)} sobre ${esc(l.nomeCor)}.">
  <div class="ficha">
    <p class="volume">Volume ${vol(i + 1)}${etiqueta ? ` <span class="etiqueta${novo ? " nova" : ""}">${esc(etiqueta)}</span>` : ""}</p>
    <h4>${esc(l.titulo)}</h4>
    <p class="frase">${esc(l.frase)}</p>
    <p class="abrange"><span class="rotulo">Abrange</span> ${esc(lista(l.abrange))}</p>
    <p class="posts"><span class="rotulo">${posts.length ? `${posts.length} ${posts.length === 1 ? "post" : "posts"}` : "Sem posts ainda"}</span>${posts.length ? ` ${esc(posts.join("; "))}.` : ""}</p>
    <p class="identidade"><span class="amostra" style="background:${l.cor}"></span>${esc(l.nomeCor)} · ${esc(l.instrumento)}</p>
  </div>
</li>`;
}

function secaoSugestao(s, n) {
  const total = Object.values(s.posts ?? {}).flat().length;
  const extra = extras.sugestoes?.[s.id] ?? {};
  return `<section class="sugestao folha" id="${s.id}" aria-labelledby="${s.id}-titulo">
  <header class="cabeca">
    <p class="sobre">Sugestão ${n} · ${s.livros.length} livros</p>
    <h2 id="${s.id}-titulo">${esc(s.nome)}</h2>
    <p class="ideia">${esc(s.ideia)}</p>
  </header>
  <figure class="estante">
    <img src="estante-${s.id}.webp" ${dimensoes(`estante-${s.id}.webp`)} alt="A estante da sugestão ${n}: ${esc(s.livros.map((b) => dados.livros[b].titulo).join(", "))}, e a revista Atualizações do Java depois do aparador.">
    <figcaption>Os números nas lombadas são os posts de hoje que iriam para cada livro (${total} no total). A revista do Java fica fora da coleção, como hoje.</figcaption>
  </figure>
  <ol class="livros">
${s.livros.map((slug, i) => cartaoLivro(s, slug, i)).join("\n")}
  </ol>
  <div class="muda">
    <p><span class="rotulo">O que muda</span> ${esc(s.custo)}</p>
    ${extra.nota ? `<p class="nota">${esc(extra.nota)}</p>` : ""}
  </div>
</section>`;
}

function linhaComparacao(s, n) {
  const novos = s.livros.filter((b) => !dados.livros[b].deHoje).map((b) => dados.livros[b].titulo);
  const renomeados = s.livros.filter((b) => dados.livros[b].renomeiaDe).map((b) => `${dados.livros[b].renomeiaDe} → ${dados.livros[b].titulo}`);
  const atuais = new Set(hoje.livros.map((b) => dados.livros[b].titulo));
  const ficam = new Set(s.livros.map((b) => dados.livros[b].renomeiaDe ?? dados.livros[b].titulo));
  const saem = [...atuais].filter((t) => !ficam.has(t));
  const vazios = s.livros.filter((b) => !(s.posts?.[b] ?? []).length).length;
  return `<tr>
  <th scope="row"><a href="#${s.id}">${n} · ${esc(s.nome)}</a></th>
  <td class="num">${s.livros.length}</td>
  <td>${novos.length ? esc(novos.join(", ")) : "—"}</td>
  <td>${saem.length ? esc(saem.join(", ")) : "—"}</td>
  <td>${renomeados.length ? esc(renomeados.join("; ")) : "—"}</td>
  <td class="num">${vazios}</td>
</tr>`;
}

function identidade(i) {
  return `<li class="id">
  <span class="tecido" style="background:${i.cor}"></span>
  <div>
    <h4>${esc(i.nomes.join(" · "))}${i.deHoje ? "" : ' <span class="etiqueta nova">novo</span>'}</h4>
    <p><span class="rotulo">Cor</span> ${esc(i.nomeCor)} <code>${i.cor}</code>. ${esc(maiuscula(i.motivoCor))}.</p>
    <p><span class="rotulo">Desenho</span> ${esc(i.instrumento)}. ${esc(maiuscula(i.motivoDesenho))}.</p>
  </div>
</li>`;
}

const css = `
@font-face { font-family: "Besley"; font-weight: 400 900; font-display: swap; src: url(${fonte("besley", "besley-latin-wght-normal.woff2")}) format("woff2"); }
@font-face { font-family: "Literata"; font-weight: 200 900; font-display: swap; src: url(${fonte("literata", "literata-latin-wght-normal.woff2")}) format("woff2"); }
@font-face { font-family: "Literata"; font-style: italic; font-weight: 200 900; font-display: swap; src: url(${fonte("literata", "literata-latin-wght-italic.woff2")}) format("woff2"); }
@font-face { font-family: "IBM Plex Sans"; font-weight: 100 700; font-display: swap; src: url(${fonte("ibm-plex-sans", "ibm-plex-sans-latin-wght-normal.woff2")}) format("woff2"); }

/* As folhas claras do blog (DESIGN.md): o fundo, as folhas com borda fina, o azul-tinta só no que é
   clicável; títulos em Besley, texto em Literata, rótulos em IBM Plex Sans. */
:root {
  --paper: #f1f0eb;
  --paper-hi: #fffffe;
  --well: #f5f5f4;
  --ink: #1a2124;
  --ink-2: #57605e;
  --ink-3: #868d8a;
  --rule: #e2e0d8;
  --acento: #2549b8;
  --nova: #2f6b4f;
  --sombra: 0 1px 2px rgba(40, 38, 30, 0.04), 0 10px 28px -18px rgba(40, 38, 30, 0.28);
  --titulo: "Besley", "Iowan Old Style", Georgia, serif;
  --texto: "Literata", Georgia, "Times New Roman", serif;
  --ui: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --paper: #111618; --paper-hi: #1a2124; --well: #21282a; --ink: #e7e9e4; --ink-2: #a9b0ac; --ink-3: #7f8884;
    --rule: #2a3336; --acento: #93aeff; --nova: #86c3a2; --sombra: 0 12px 30px -18px rgba(0, 0, 0, 0.8);
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --paper: #111618; --paper-hi: #1a2124; --well: #21282a; --ink: #e7e9e4; --ink-2: #a9b0ac; --ink-3: #7f8884;
  --rule: #2a3336; --acento: #93aeff; --nova: #86c3a2; --sombra: 0 12px 30px -18px rgba(0, 0, 0, 0.8);
}

body { background: var(--paper); color: var(--ink); font: 400 1.0625rem/1.65 var(--texto); padding-inline: clamp(16px, 4vw, 40px); }
.pagina { max-width: 1180px; margin: 0 auto; padding-block: 40px 72px; display: grid; gap: 28px; }
h1, h2, h3, h4 { font-family: var(--titulo); font-weight: 800; letter-spacing: -0.01em; text-wrap: balance; margin: 0; color: var(--ink); }
p { margin: 0; }
a { color: var(--acento); text-underline-offset: 3px; }
a:focus-visible { outline: 2px solid var(--acento); outline-offset: 3px; border-radius: 2px; }
code { font-family: ui-monospace, "JetBrains Mono", Menlo, monospace; font-size: 0.85em; background: var(--well); padding: 0.05em 0.35em; border-radius: 4px; }
.rotulo { font-family: var(--ui); font-weight: 600; font-size: 0.78rem; letter-spacing: 0.04em; color: var(--ink-2); margin-right: 0.35em; }
.folha { background: var(--paper-hi); border: 1px solid var(--rule); border-radius: 14px; box-shadow: var(--sombra); padding: clamp(20px, 3.4vw, 40px); }

.abertura { display: grid; gap: 14px; }
.abertura .sobre, .sugestao .sobre { font-family: var(--ui); font-size: 0.85rem; color: var(--ink-2); }
.abertura h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); line-height: 1.05; }
.abertura .lead { max-width: 68ch; font-size: 1.12rem; color: var(--ink); }
.abertura .comoler { max-width: 68ch; color: var(--ink-2); }
.indice { display: flex; flex-wrap: wrap; gap: 8px 18px; font-family: var(--ui); font-size: 0.92rem; margin-top: 6px; }

.hoje { display: grid; gap: 12px; }
.hoje h2 { font-size: 1.35rem; }
.hoje p { color: var(--ink-2); max-width: 70ch; }
.hoje img, .estante img { max-width: 100%; height: auto; display: block; }

.comparacao h2 { font-size: 1.35rem; margin-bottom: 14px; }
.tabela { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; min-width: 760px; font-family: var(--ui); font-size: 0.9rem; }
th, td { text-align: left; vertical-align: top; padding: 10px 12px; border-top: 1px solid var(--rule); }
thead th { font-weight: 600; color: var(--ink-2); border-top: 0; font-size: 0.8rem; letter-spacing: 0.03em; }
tbody th { font-weight: 600; white-space: nowrap; }
td.num { font-variant-numeric: tabular-nums; text-align: right; white-space: nowrap; }

.sugestao { display: grid; gap: 22px; scroll-margin-top: 16px; }
.sugestao .cabeca { display: grid; gap: 8px; }
.sugestao h2 { font-size: clamp(1.7rem, 3.4vw, 2.3rem); line-height: 1.12; }
.sugestao .ideia { max-width: 70ch; }
.estante { margin: 0; display: grid; gap: 8px; }
.estante figcaption, .hoje figcaption { font-family: var(--ui); font-size: 0.82rem; color: var(--ink-3); }

.livros { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); gap: 26px 30px; }
.livro { display: grid; grid-template-columns: 112px 1fr; gap: 16px; align-items: start; }
.livro .capa { width: 112px; height: auto; border-radius: 2px 3px 3px 2px; box-shadow: 0 1px 1px rgba(0,0,0,.18), 0 10px 22px -10px rgba(0,0,0,.35); }
.ficha { display: grid; gap: 5px; min-width: 0; }
.ficha .volume { font-family: var(--ui); font-size: 0.78rem; color: var(--ink-3); display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.ficha h4 { font-size: 1.22rem; line-height: 1.2; }
.ficha .frase { font-style: italic; }
.ficha .abrange, .ficha .posts { font-size: 0.9rem; line-height: 1.5; color: var(--ink-2); }
.ficha .abrange { color: var(--ink); }
.identidade { font-family: var(--ui); font-size: 0.8rem; color: var(--ink-2); display: flex; align-items: center; gap: 7px; }
.amostra { width: 12px; height: 12px; border-radius: 3px; flex: none; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); }
.etiqueta { font-family: var(--ui); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.03em; color: var(--ink-2); border: 1px solid var(--rule); border-radius: 999px; padding: 0 7px; line-height: 1.6; }
.etiqueta.nova { color: var(--nova); border-color: color-mix(in oklab, var(--nova) 45%, transparent); }
.muda { border-top: 1px solid var(--rule); padding-top: 16px; display: grid; gap: 8px; max-width: 80ch; }
.muda .nota { color: var(--ink-2); }

.regras h2 { font-size: 1.35rem; margin-bottom: 12px; }
.regras ul { margin: 0; padding-left: 1.1em; display: grid; gap: 8px; max-width: 80ch; }
.regras li { font-size: 0.97rem; }
.regras li::marker { color: var(--ink-3); }
.recomendacao { display: grid; gap: 12px; }
.recomendacao h2 { font-size: 1.5rem; }
.recomendacao p { max-width: 70ch; }

.identidades h2 { font-size: 1.5rem; margin-bottom: 6px; }
.identidades > p { color: var(--ink-2); max-width: 70ch; margin-bottom: 18px; }
.identidades ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); gap: 20px 32px; }
.id { display: grid; grid-template-columns: 40px 1fr; gap: 14px; align-items: start; }
.tecido { width: 40px; height: 56px; border-radius: 2px 4px 4px 2px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); }
.id h4 { font-size: 1.08rem; display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.id p { font-size: 0.9rem; line-height: 1.5; margin-top: 4px; }
.rodape { font-family: var(--ui); font-size: 0.82rem; color: var(--ink-3); max-width: 80ch; }

@media (max-width: 520px) {
  .livro { grid-template-columns: 84px 1fr; gap: 12px; }
  .livro .capa { width: 84px; }
}
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
`;

const html = `<title>Cinco estantes</title>
<style>${css}</style>
<main class="pagina">
  <header class="abertura folha">
    <p class="sobre">Blog do Cesar Schutz · livros da coleção · ${esc(extras.data)}</p>
    <h1>Cinco estantes</h1>
    <p class="lead">${esc(extras.lead)}</p>
    <p class="comoler">${esc(extras.comoLer)}</p>
    <nav class="indice" aria-label="Sugestões">${sugestoes.map((s, i) => `<a href="#${s.id}">${i + 1} · ${esc(s.nome)} (${s.livros.length})</a>`).join("")}<a href="#cores-e-desenhos">Cores e desenhos</a></nav>
  </header>

  <section class="hoje folha" aria-labelledby="hoje-titulo">
    <h2 id="hoje-titulo">A estante de hoje, para comparar</h2>
    <p>Os oito livros como estão no site, com os posts de hoje.</p>
    <figure class="estante"><img src="estante-hoje.webp" ${dimensoes("estante-hoje.webp")} alt="A estante de hoje: ${esc(hoje.livros.map((b) => dados.livros[b].titulo).join(", "))}, e a revista do Java."></figure>
  </section>

  <section class="comparacao folha" aria-labelledby="comparacao-titulo">
    <h2 id="comparacao-titulo">As cinco lado a lado</h2>
    <div class="tabela">
      <table>
        <thead><tr><th scope="col">Sugestão</th><th scope="col">Livros</th><th scope="col">Entram</th><th scope="col">Saem</th><th scope="col">Mudam de nome</th><th scope="col">Sem posts</th></tr></thead>
        <tbody>
${sugestoes.map((s, i) => linhaComparacao(s, i + 1)).join("\n")}
        </tbody>
      </table>
    </div>
  </section>

  <section class="regras folha" aria-labelledby="regras-titulo">
    <h2 id="regras-titulo">Vale para todas</h2>
    <ul>
${(dados.valeParaTodas ?? []).map((t) => `      <li>${esc(t)}</li>`).join("\n")}
    </ul>
  </section>

${sugestoes.map((s, i) => secaoSugestao(s, i + 1)).join("\n\n")}

  <section class="recomendacao folha" aria-labelledby="recomendacao-titulo">
    <h2 id="recomendacao-titulo">${esc(extras.recomendacao.titulo)}</h2>
    ${extras.recomendacao.paragrafos.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}
  </section>

  <section class="identidades folha" id="cores-e-desenhos" aria-labelledby="cores-titulo">
    <h2 id="cores-titulo">Cores e desenhos</h2>
    <p>${esc(extras.identidades)}</p>
    <ul>
${identidades.map(identidade).join("\n")}
    </ul>
  </section>

  <p class="rodape">${esc(extras.rodape)}</p>
</main>
`;

writeFileSync(join(raiz, ".render", "colecoes", "index.html"), html);
console.log(`.render/colecoes/index.html (${(html.length / 1024).toFixed(0)} KB)`);
