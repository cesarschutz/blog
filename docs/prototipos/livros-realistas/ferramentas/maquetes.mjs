#!/usr/bin/env node
/**
 * Maquetes (rascunho): abre as páginas do blog no dev, troca o livro de hoje pela prancha realista
 * no lugar decidido e fotografa a tela inteira em maquetes/*.png. Não é a implementação: é só para
 * o Cesar ver como cada livro fica na página. As peças (maquetes/pecas/*.svg) saem das pranchas
 * parametrizadas (LIVRO=<slug> SAIDA=../maquetes/pecas/<nome>.svg node pranchas/pNN-….mjs; a 06 aceita
 * EM_BRANCO=1) e não vão para o git; os PNGs foram convertidos para WebP (sharp) antes do commit.
 *
 *   node ferramentas/maquetes.mjs   (DEV=http://127.0.0.1:4322 · GALERIA=http://127.0.0.1:4341)
 */
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "./modulos.mjs";

const PASTA = join(dirname(fileURLToPath(import.meta.url)), "..", "maquetes");
const DEV = process.env.DEV ?? "http://127.0.0.1:4322";
const GAL = process.env.GALERIA ?? "http://127.0.0.1:4341";
const peca = (nome) => `${GAL}/maquetes/pecas/${nome}.svg`;
const LIVROS = ["arquitetura-de-software", "desenvolvimento-de-software", "dados", "ia", "seguranca", "devops", "sre", "carreira"];

const nav = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await nav.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const p = await ctx.newPage();

async function abrir(url) {
  await p.goto(DEV + url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);
}
/** Troca o conteúdo de um elemento por uma prancha (<object>), do tamanho pedido. */
async function trocar(seletor, url, estilo = "width:100%;height:100%", indice = 0) {
  await p.evaluate(
    ({ seletor, url, estilo, indice }) => {
      const el = document.querySelectorAll(seletor)[indice];
      if (!el) throw new Error(`não achei ${seletor}`);
      el.innerHTML = `<object type="image/svg+xml" data="${url}" style="display:block;${estilo};color-scheme:light;pointer-events:none"></object>`;
    },
    { seletor, url, estilo, indice },
  );
}
async function esperar() {
  await p.evaluate(async () => {
    for (const o of document.querySelectorAll("object")) {
      if (!o.contentDocument || o.contentDocument.readyState !== "complete") await new Promise((ok) => (o.addEventListener("load", ok, { once: true }), setTimeout(ok, 8000)));
    }
  });
  await p.waitForTimeout(1500);
}
async function foto(nome, { cheia = false, rolarAte } = {}) {
  if (rolarAte) await p.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "start" }), rolarAte);
  await p.waitForTimeout(300);
  await p.screenshot({ path: join(PASTA, nome), fullPage: cheia });
  console.log("✓", nome);
}

// 1. Home: a estante (07) e, com um livro tirado dela, a gaveta com a luz de janela (10).
await abrir("/");
await p.evaluate(() => document.querySelector(".prateleira-livros .lombada")?.click());
await p.waitForTimeout(1500);
await p.evaluate(() => (document.querySelector(".estante").style.cssText += ";height:auto"));
await trocar(".estante", peca("p07-estante"), "width:118%;max-width:none;aspect-ratio:1600/900;height:auto;margin:-6% 0 -4% -9%");
await trocar(".livro-na-gaveta", peca("p10-arquitetura-de-software"), "width:430px;max-width:none;aspect-ratio:1200/1000;height:auto;margin:-10px 0 0 -70px");
await esperar();
await foto("01-home.png", { cheia: false });
await p.evaluate(() => document.querySelector(".gaveta")?.scrollIntoView({ block: "center" }));
await foto("02-home-gaveta.png");

// 2. Categorias: a grade com a capa dura (01) em cada livro.
await abrir("/categories/");
const n = await p.evaluate(() => document.querySelectorAll(".livro-em-pe").length);
for (let i = 0; i < Math.min(n, 8); i++) await trocar(".livro-em-pe", peca(`p01-${LIVROS[i]}`), "width:170%;max-width:none;aspect-ratio:1200/1000;height:auto;margin:-12% 0 0 -35%", i);
await p.evaluate(() => document.querySelectorAll(".livro-em-pe").forEach((e) => (e.style.cssText += ";width:100%;height:auto;overflow:visible")));
await esperar();
await foto("03-categorias.png", { cheia: true });

// 3. Página do livro: a pilha (08) na lateral e a capa dura (01) no topo.
await abrir("/categories/Arquitetura%20de%20Software/");
await trocar(".pilha", peca("p08-pilha"), "width:100%;aspect-ratio:1100/1000;height:auto");
await p.evaluate(() => (document.querySelector(".pilha").style.cssText += ";height:auto"));
await trocar(".topo-livro .livro-em-pe, .livro-em-pe", peca("p01-arquitetura-de-software"), "width:175%;max-width:none;aspect-ratio:1200/1000;height:auto;margin:-14% 0 0 -38%");
await esperar();
await foto("04-pagina-do-livro.png");

// 4. Artigo: a ficha "Do livro" com o livro deitado, a fita e as etiquetas (04).
await abrir("/posts/cobranca-duplicada-no-retry/");
await trocar(".foto", peca("p04-arquitetura-de-software"), "width:100%;aspect-ratio:1200/950;height:auto");
await p.evaluate(() => {
  const f = document.querySelector(".foto");
  f.style.cssText += ";height:auto;aspect-ratio:auto;background:none";
});
await esperar();
await foto("05-artigo.png");

// 5. Livro sem artigos: o livro aberto em branco (06), pequeno.
await abrir("/categories/IA/");
await p.evaluate((url) => {
  const alvo = [...document.querySelectorAll("p")].find((x) => x.textContent.includes("ainda não tem artigos"));
  const o = document.createElement("object");
  o.type = "image/svg+xml";
  o.data = url;
  o.style.cssText = "display:block;width:300px;aspect-ratio:1300/1000;height:auto;margin:-20px 0 -10px -24px;color-scheme:light;pointer-events:none";
  alvo.parentElement.insertBefore(o, alvo);
}, peca("p06-ia-em-branco"));
await esperar();
await foto("06-livro-sem-artigos.png");

// 6. Busca sem resultado: o mesmo livro aberto em branco (06), pequeno.
await abrir("/");
await p.keyboard.press("Meta+k");
await p.waitForTimeout(800);
await p.keyboard.type("kubernetes em cobol");
await p.waitForTimeout(1200);
await p.evaluate((url) => {
  const caixa = document.querySelector("dialog[open]") ?? document.querySelector("[role=dialog]");
  if (!caixa) throw new Error("a busca não abriu");
  const campo = caixa.querySelector("input");
  let res = [...caixa.querySelectorAll("*")].reverse().find((x) => x.children.length === 0 && /índice|resultado|nada|encontr/i.test(x.textContent));
  const alvo = res?.parentElement ?? caixa;
  const bloco = document.createElement("div");
  bloco.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0 20px;text-align:center";
  bloco.innerHTML = `<object type="image/svg+xml" data="${url}" style="width:260px;aspect-ratio:1300/1000;height:auto;color-scheme:light;pointer-events:none"></object><p style="margin:0;font-weight:600">Nada encontrado para “${campo?.value ?? ""}”</p><p style="margin:0;opacity:.7">Tente outra palavra ou veja os livros.</p>`;
  if (res) res.replaceWith(bloco);
  else alvo.append(bloco);
}, peca("p06-ia-em-branco"));
await esperar();
await foto("07-busca-sem-resultado.png");

// 7. Séries: o livro da série (09).
await abrir("/series/");
await trocar(".livro-em-pe", peca("p09-revista"), "width:150%;max-width:none;aspect-ratio:1200/950;height:auto;margin:-10% 0 0 -25%");
await esperar();
await foto("08-series.png");

await nav.close();
