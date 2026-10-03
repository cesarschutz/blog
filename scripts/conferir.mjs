#!/usr/bin/env node
/**
 * Conferência de um post no navegador (D53), a que as skills `post` (passo 7) e `caneta` (passo 5)
 * pedem: abre /posts/<slug>/ no Chrome (playwright-core) em 320, 390, 768, 1280 e 1600px, nos temas
 * claro e escuro, e mede em cada combinação a rolagem lateral (e quem passa da janela), erros e avisos
 * do console, requisições com falha, imagens sem `alt` e as marcas da caneta (cortadas pela janela ou
 * por um bloco, e notas escritas por cima de outro texto). Mais uma passada em 390px com movimento
 * reduzido, só pelo console. Sai com 1 se achar qualquer problema. Precisa do dev (ou do preview) no ar.
 *
 *   node scripts/conferir.mjs <slug> [--base http://127.0.0.1:4322] [--capturas]
 *   (--capturas: páginas inteiras em .astro/conferir/<slug>/<largura>-<tema>.png)
 */
import { mkdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { opcoesDoChrome } from "./chrome.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const argumentos = process.argv.slice(2);
const opcao = (nome) => {
  const i = argumentos.indexOf(nome);
  return i >= 0 ? argumentos[i + 1] : undefined;
};
const base = (opcao("--base") ?? "http://127.0.0.1:4322").replace(/\/+$/, "");
const capturas = argumentos.includes("--capturas");
const slug = argumentos.find((a, i) => !a.startsWith("--") && argumentos[i - 1] !== "--base");
if (!slug) {
  console.error("Uso: npm run conferir -- <slug> [--base http://127.0.0.1:4322] [--capturas]");
  process.exit(2);
}

const LARGURAS = [320, 390, 768, 1280, 1600];
const TEMAS = [
  ["claro", "light"],
  ["escuro", "dark"],
];
// Um caminho começando com "/" abre a página direto (uma página que não é post).
const endereco = slug.startsWith("/") ? `${base}${slug}` : `${base}/posts/${encodeURIComponent(slug)}/`;

try {
  const resposta = await fetch(endereco);
  if (resposta.status >= 400) {
    console.error(`conferir: ${endereco} respondeu ${resposta.status} (o slug existe?).`);
    process.exit(2);
  }
} catch {
  console.error(`conferir: não achei o site em ${base}. Rode: fnm exec --using=24 npm run dev -- --host 127.0.0.1`);
  process.exit(2);
}

let navegador;
try {
  navegador = await chromium.launch(opcoesDoChrome);
} catch (erro) {
  console.error("conferir: não achei o Chrome.", erro.message);
  process.exit(2);
}

const pastaCapturas = join(raiz, ".astro", "conferir", slug.replace(/^\/|\/$/g, "").replace(/\//g, "-"));
if (capturas) mkdirSync(pastaCapturas, { recursive: true });

/** Mede a página já assentada; roda no navegador. */
function medir() {
  const TOL = 1;
  const largura = document.documentElement.clientWidth;
  const curto = (el) => {
    if (el.id) return `#${el.id}`;
    const classes = [...el.classList].filter((c) => !c.startsWith("astro-") && !c.startsWith("ec-") && c.length < 30).slice(0, 2);
    let s = el.tagName.toLowerCase() + classes.map((c) => `.${c}`).join("");
    const pai = el.parentElement?.closest("[id], article, main, header, footer, nav, section, aside, figure, pre, li, p");
    if (pai && pai !== document.body) {
      const p = pai.id ? `#${pai.id}` : pai.tagName.toLowerCase() + ([...pai.classList].filter((c) => !c.startsWith("astro-")).slice(0, 1).map((c) => `.${c}`).join(""));
      s = `${p} ${s}`;
    }
    return s;
  };
  const fixo = (el) => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const pos = getComputedStyle(e).position;
      if (pos === "fixed") return true;
    }
    return false;
  };
  const visivel = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    const st = getComputedStyle(el);
    return st.visibility !== "hidden" && st.display !== "none" && Number(st.opacity) !== 0;
  };
  /** Os ancestrais que cortam o que passa deles (e a caixa que eles mostram). */
  const cortes = (el) => {
    const lista = [];
    for (let e = el.parentElement; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      const st = getComputedStyle(e);
      if (st.overflowX !== "visible" || st.overflowY !== "visible") lista.push({ e, x: st.overflowX !== "visible", y: st.overflowY !== "visible" });
    }
    return lista;
  };
  const semCorte = (el) => cortes(el).every(({ x }) => !x);

  // 1. Rolagem lateral e quem passa da janela (fora do que um ancestral já corta e do que é fixo).
  const scrollWidth = document.documentElement.scrollWidth;
  const passam = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || (r.right <= largura + TOL && r.left >= -TOL)) continue;
    if (!visivel(el) || fixo(el) || !semCorte(el)) continue;
    passam.push(el);
  }
  // Só os de cima: o filho de um que já passa não conta de novo.
  const topo = passam.filter((el) => !passam.some((o) => o !== el && o.contains(el)));
  const passaDaJanela = topo.slice(0, 8).map((el) => {
    const r = el.getBoundingClientRect();
    return `${curto(el)} (${Math.round(r.left)}→${Math.round(r.right)} de ${largura}px)`;
  });

  // 2. Imagens sem alt.
  const semAlt = [...document.querySelectorAll("img:not([alt])")].map((img) => img.currentSrc || img.src || curto(img));

  // 3. Caneta: marcas cortadas pela janela ou por um bloco (rolagem do código, folha) e notas por cima de texto.
  const SELETOR_MARCAS = [
    ".caneta",
    ".caneta-marca",
    ".caneta-sinal-margem",
    ".caneta-escrita",
    ".caneta-numero",
    ".caneta-chave-lado",
    ".caneta-codigo-circulo",
    ".caneta-linhas-barra",
    ".caneta-sinal-item",
    ".caneta-comentario > .caneta-svg",
  ].join(", ");
  const marcas = [...document.querySelectorAll(SELETOR_MARCAS)].filter((el) => !el.classList.contains("caneta-sr") && visivel(el));
  const cortadas = [];
  for (const el of marcas) {
    const r = el.getBoundingClientRect();
    const motivos = [];
    if (r.left < -TOL || r.right > largura + TOL) motivos.push(`janela (${Math.round(r.left)}→${Math.round(r.right)} de ${largura}px)`);
    for (const { e, x, y } of cortes(el)) {
      const c = e.getBoundingClientRect();
      const esq = c.left + e.clientLeft;
      const dir = esq + e.clientWidth;
      const cima = c.top + e.clientTop;
      const baixo = cima + e.clientHeight;
      if ((x && (r.left < esq - TOL || r.right > dir + TOL)) || (y && (r.top < cima - TOL || r.bottom > baixo + TOL))) {
        motivos.push(`cortada por ${curto(e)}`);
        break;
      }
    }
    if (motivos.length) cortadas.push(`${curto(el)} "${(el.textContent ?? "").trim().slice(0, 30)}": ${motivos.join("; ")}`);
  }

  // Notas escritas (acima da palavra, correção do riscado): o texto delas não pode cobrir outro texto.
  // A caixa de um texto (Range) vai do topo ao pé da fonte, com folga acima e abaixo das letras (na
  // Caveat, a caixa da nota encosta na da linha de baixo sem que a tinta se toque): cada caixa perde
  // 20% da altura em cima e embaixo, o que sobra é a faixa da tinta, e só vale sobreposição de tinta.
  const IGNORAR = ".caneta-sr, svg, script, style, .caneta-escrita, [aria-hidden='true']";
  const retangulos = (no) => {
    const faixa = document.createRange();
    faixa.selectNodeContents(no);
    return [...faixa.getClientRects()]
      .filter((r) => r.width > 0.5 && r.height > 0.5)
      .map((r) => ({ left: r.left, right: r.right, top: r.top + r.height * 0.2, bottom: r.bottom - r.height * 0.2 }));
  };
  const textos = (raizEl, ignorar) => {
    const lista = [];
    const andar = document.createTreeWalker(raizEl, NodeFilter.SHOW_TEXT, {
      acceptNode: (t) => (!t.nodeValue.trim() || (ignorar && t.parentElement?.closest(ignorar)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    for (let t = andar.nextNode(); t; t = andar.nextNode()) lista.push(t);
    return lista;
  };
  const conteudo = document.querySelector("article") ?? document.querySelector("main") ?? document.body;
  const notas = [...document.querySelectorAll(".caneta-nota-texto, .caneta-correcao")].filter(visivel);
  const cobrem = [];
  if (notas.length) {
    const outros = textos(conteudo, IGNORAR).flatMap((t) => retangulos(t).map((r) => ({ r, t })));
    for (const nota of notas) {
      const proprios = textos(nota, ".caneta-sr").flatMap(retangulos);
      const achado = outros.find(({ r }) =>
        proprios.some((p) => Math.min(p.right, r.right) - Math.max(p.left, r.left) > 1.5 && Math.min(p.bottom, r.bottom) - Math.max(p.top, r.top) > 1),
      );
      if (achado) cobrem.push(`"${textos(nota, ".caneta-sr").map((t) => t.nodeValue).join("").trim()}" cobre "${achado.t.nodeValue.trim().slice(0, 30)}"`);
    }
  }

  return {
    largura,
    scrollWidth,
    tema: document.documentElement.dataset.theme,
    passaDaJanela,
    semAlt,
    marcas: marcas.length,
    notas: notas.length,
    cortadas,
    cobrem,
  };
}

/** Rola a página inteira (imagens preguiçosas, lousas) e volta ao topo. */
async function percorrer(pagina) {
  await pagina.evaluate(async () => {
    const passo = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
      scrollTo(0, y);
      await new Promise((ok) => setTimeout(ok, 60));
    }
    scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((ok) => setTimeout(ok, 200));
    scrollTo(0, 0);
  });
}

async function abrir({ largura, tema, reduzido }) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: largura < 768 ? 800 : 900 },
    deviceScaleFactor: 1,
    colorScheme: tema === "dark" ? "dark" : "light",
    reducedMotion: reduzido ? "reduce" : "no-preference",
  });
  // O site não segue o sistema (D52, C01): o tema vem da escolha guardada, válida por 3 dias (Base.astro).
  await contexto.addInitScript((valor) => {
    try {
      localStorage.setItem("cs-theme", valor);
      localStorage.setItem("cs-prefs-quando", String(Date.now()));
    } catch {}
  }, tema);
  const pagina = await contexto.newPage();
  const achados = { console: [], rede: [] };
  pagina.on("console", (msg) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    const onde = msg.location()?.url ? ` (${msg.location().url.replace(base, "")}:${msg.location().lineNumber})` : "";
    achados.console.push(`${msg.type() === "error" ? "erro" : "aviso"}: ${msg.text().slice(0, 200)}${onde}`);
  });
  pagina.on("pageerror", (erro) => achados.console.push(`exceção: ${String(erro.message ?? erro).slice(0, 200)}`));
  pagina.on("requestfailed", (pedido) => {
    const falha = pedido.failure()?.errorText ?? "falhou";
    // Pré-carregamento cancelado pelo próprio navegador (regras de especulação) não é falha do site.
    if (falha === "net::ERR_ABORTED" && pedido.resourceType() !== "document" && pedido.resourceType() !== "image") return;
    achados.rede.push(`${falha}: ${pedido.url().replace(base, "")}`);
  });
  pagina.on("response", (resposta) => {
    if (resposta.status() >= 400) achados.rede.push(`${resposta.status()}: ${resposta.url().replace(base, "")}`);
  });
  // Chegando de dentro do site (referer da mesma origem), a abertura (Abertura.astro) não toca.
  await pagina.goto(endereco, { waitUntil: "load", referer: `${base}/` });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForFunction(() => !document.documentElement.dataset.abertura, null, { timeout: 10000 }).catch(() => {});
  return { contexto, pagina, achados };
}

/**
 * Uma passada numa combinação, num contexto novo (armazenamento limpo). O dev recarrega a página
 * sozinho quando um arquivo muda ou quando o Vite reotimiza as dependências: aí a passada recomeça,
 * até 3 vezes.
 */
async function passada(opcoes, { medirTudo = true, arquivo } = {}) {
  for (let tentativa = 1; ; tentativa++) {
    const { contexto, pagina, achados } = await abrir(opcoes);
    try {
      await percorrer(pagina);
      await pagina.waitForTimeout(800);
      await pagina.evaluate(() => document.fonts.ready);
      const m = medirTudo ? await pagina.evaluate(medir) : null;
      if (arquivo) await pagina.screenshot({ path: arquivo, fullPage: true });
      return { m, achados };
    } catch (erro) {
      if (tentativa === 3 || !/context was destroyed|navigat/i.test(String(erro.message))) throw erro;
    } finally {
      await contexto.close();
    }
  }
}

// Uma visita de aquecimento, fora da conta: no dev recém-ligado, o Vite descobre as dependências
// carregadas sob demanda (o GSAP) na primeira visita, otimiza de novo e responde 504 ("Outdated
// Optimize Dep") ao que já estava a caminho.
await passada({ largura: 1280, tema: "light" }, { medirTudo: false });

const linhas = [];
let problemas = 0;
let viteVelho = false;
const doVite = (c) => c.includes("Outdated Optimize Dep") || c.includes("/.vite/deps/");

for (const largura of LARGURAS) {
  for (const [nomeTema, tema] of TEMAS) {
    const arquivo = capturas ? join(pastaCapturas, `${largura}-${nomeTema}.png`) : undefined;
    const { m, achados } = await passada({ largura, tema }, { arquivo });
    const lista = [];
    if (m.tema !== tema) lista.push(`tema na tela é "${m.tema}", esperado "${tema}"`);
    if (m.scrollWidth > m.largura) lista.push(`rolagem lateral: scrollWidth ${m.scrollWidth} > ${m.largura}px`);
    if (m.passaDaJanela.length) lista.push(`passa da janela: ${m.passaDaJanela.join(", ")}`);
    viteVelho ||= [...achados.console, ...achados.rede].some(doVite);
    for (const c of achados.console) lista.push(`console ${c}`);
    for (const r of [...new Set(achados.rede)]) lista.push(`rede ${r}`);
    for (const s of m.semAlt) lista.push(`imagem sem alt: ${s}`);
    for (const c of m.cortadas) lista.push(`caneta cortada: ${c}`);
    for (const c of m.cobrem) lista.push(`nota por cima do texto: ${c}`);
    problemas += lista.length;
    linhas.push({ nome: `${largura} ${nomeTema}`, lista, info: m.marcas ? `caneta: ${m.marcas} peça${m.marcas > 1 ? "s" : ""}, ${m.notas} nota${m.notas === 1 ? "" : "s"} escrita${m.notas === 1 ? "" : "s"}` : "sem caneta" });
  }
}

// Movimento reduzido: só o console (a versão estática das animações não pode quebrar).
{
  const { achados } = await passada({ largura: 390, tema: "light", reduzido: true }, { medirTudo: false });
  viteVelho ||= achados.console.some(doVite);
  const lista = achados.console.map((c) => `console ${c}`);
  problemas += lista.length;
  linhas.push({ nome: "390 reduzido", lista, info: "só console" });
}

await navegador.close();

console.log(`\nConferência de ${endereco}\n`);
const coluna = Math.max(...linhas.map((l) => l.nome.length));
for (const { nome, lista, info } of linhas) {
  console.log(`${nome.padEnd(coluna)}  ${lista.length ? `✗ ${lista.length} problema${lista.length > 1 ? "s" : ""}` : "ok"}  (${info})`);
  for (const item of lista) console.log(`${" ".repeat(coluna)}    - ${item}`);
}
if (viteVelho)
  console.log("\nAviso: falhas em /node_modules/.vite/deps/ são do dev (o Vite reotimizou as dependências), não do post. Espere o dev assentar e rode de novo.");
if (capturas) console.log(`\nCapturas em ${relative(raiz, pastaCapturas)}/`);
console.log(problemas ? `\n✗ ${problemas} problema${problemas > 1 ? "s" : ""}.` : "\n✓ Tudo ok nas 10 combinações e no movimento reduzido.");
process.exit(problemas ? 1 : 0);
