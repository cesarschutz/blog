#!/usr/bin/env node
/**
 * As fotos do post para a apresentação (D74, skill `apresentacao`): a capa colada, as figuras (paradas,
 * em passos e o quadro final das animações), as lousas, a ficha "Do livro", as tags e a marca, e a tira
 * da ficha do post (Vol., ficha e nº). Tudo vai para saida/slides/<slug>/ (fora do git).
 *
 *   node scripts/slides/capturar.mjs <slug> [--base URL] [--escuro]
 *     --base    de onde fotografar: o site no ar (padrão) ou, para um post ainda não publicado, o dev
 *               (http://127.0.0.1:<porta>)
 *     --escuro  fotografa também no tema escuro (os arquivos ganham "-escuro")
 *
 * Com o movimento reduzido, a figura em passos sai inteira e a animação, no quadro final. As evidências
 * (prints) não são fotografadas: o roteiro usa os PNG de src/evidencias/<slug>/.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const [slug, ...resto] = process.argv.slice(2);
if (!slug) {
  console.error("Uso: node scripts/slides/capturar.mjs <slug> [--base URL] [--escuro]");
  process.exit(2);
}
const opcao = (nome, padrao) => {
  const i = resto.indexOf(nome);
  return i >= 0 ? resto[i + 1] : padrao;
};
const BASE = opcao("--base", "https://blog.cesarschutz.com.br").replace(/\/$/, "");
const TEMAS = resto.includes("--escuro") ? ["light", "dark"] : ["light"];
const PASTA = join(RAIZ, "saida", "slides", slug);
mkdirSync(join(PASTA, "img"), { recursive: true });

// O computador do canto e a aba "topo" ficam fora das fotos.
const ESCONDER = ".computador, .aba-topo, [class*=aba-topo] { display: none !important; }";
const dados = { slug, base: BASE, quando: new Date().toISOString(), tira: null, fotos: [] };
const navegador = await chromium.launch({ channel: "chrome", headless: true });

async function abrir(tema, escala, caminho) {
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: escala,
    reducedMotion: "reduce",
    colorScheme: tema,
  });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem("cs-theme", t);
      localStorage.setItem("cs-prefs-quando", String(Date.now()));
    } catch {}
  }, tema);
  const p = await ctx.newPage();
  p.setDefaultTimeout(30000);
  const r = await p.goto(`${BASE}${caminho}`, { waitUntil: "load", timeout: 60000 });
  if (!r || r.status() >= 400) {
    throw new Error(`${BASE}${caminho} respondeu ${r ? r.status() : "nada"}; post novo: use --base com o endereço do dev`);
  }
  await p.waitForTimeout(3000);
  await p.addStyleTag({ content: ESCONDER });
  return { ctx, p };
}

async function foto(p, loc, nome, sufixo, escala) {
  await loc.scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  const arquivo = `${nome}${sufixo}.png`;
  await loc.screenshot({ path: join(PASTA, "img", arquivo) });
  const caixa = await loc.boundingBox();
  dados.fotos.push({ arquivo, largura: Math.round(caixa.width * escala), altura: Math.round(caixa.height * escala) });
  console.log("ok", arquivo);
}

try {
  for (const tema of TEMAS) {
    const sufixo = tema === "dark" ? "-escuro" : "";
    // As peças do post, em densidade 2.
    let { ctx, p } = await abrir(tema, 2, `/posts/${slug}/`);
    const capa = p.locator(".foto-colada").first();
    if (await capa.count()) await foto(p, capa, "capa", sufixo, 2);
    const figuras = p.locator("figure.figura");
    const conta = { figura: 0, passos: 0, animacao: 0 };
    for (let i = 0; i < (await figuras.count()); i++) {
      const fig = figuras.nth(i);
      const classe = (await fig.getAttribute("class")) || "";
      const tipo = classe.includes("figura-passos") ? "passos" : classe.includes("animacao") ? "animacao" : "figura";
      const palco = fig.locator(".figura-palco").first();
      if (await palco.count()) await foto(p, palco, `${tipo}-${++conta[tipo]}`, sufixo, 2);
    }
    const lousas = p.locator(".lousa-palco");
    for (let i = 0; i < (await lousas.count()); i++) await foto(p, lousas.nth(i), `lousa-${i + 1}`, sufixo, 2);
    const doLivro = p.locator(".do-livro").first();
    if (await doLivro.count()) await foto(p, doLivro, "do-livro", sufixo, 2);
    await ctx.close();

    // A marca e as tags, em densidade 4 (no slide elas ficam pequenas e precisam de nitidez).
    ({ ctx, p } = await abrir(tema, 4, `/posts/${slug}/`));
    const tags = p.locator("a.pilula-tag");
    for (let i = 0; i < (await tags.count()); i++) await foto(p, tags.nth(i), `tag-${i + 1}`, sufixo, 4);
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(500);
    const marca = p.locator("header a[href='/']").first();
    if (await marca.count()) await foto(p, marca, "marca", sufixo, 4);
    await ctx.close();
  }

  // A tira da ficha do post (a chamada "Vol. NN · ficha N" e o tombo "nº NNN"), dos cartões da home.
  for (const caminho of ["/", "/2/", "/3/", "/archive/"]) {
    const { ctx, p } = await abrir("light", 1, caminho).catch(() => ({}));
    if (!p) continue;
    const tira = await p.evaluate((s) => {
      for (const li of document.querySelectorAll("li.cartao")) {
        if (!li.querySelector(`a[href$="/posts/${s}/"]`)) continue;
        const spans = li.querySelectorAll(".tira-ficha span");
        if (spans.length) return { chamada: spans[0].textContent.trim(), tombo: spans[1]?.textContent.trim() ?? "" };
      }
      return null;
    }, slug);
    await ctx.close();
    if (tira) {
      dados.tira = tira;
      console.log("ok tira:", tira.chamada, "·", tira.tombo);
      break;
    }
  }
  if (!dados.tira) console.log("sem a tira da ficha: o post não apareceu nos cartões da home nem do arquivo");
} finally {
  await navegador.close();
}
writeFileSync(join(PASTA, "dados.json"), JSON.stringify(dados, null, 2) + "\n");
console.log("dados:", join(PASTA, "dados.json"));
