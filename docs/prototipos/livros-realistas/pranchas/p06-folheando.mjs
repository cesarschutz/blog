#!/usr/bin/env node
/**
 * Prancha 06 · Folheando (livro: Desenvolvimento de Software).
 *
 * O livro aberto e deitado na mesa, visto de frente e de cima (44°), com teleobjetiva e girado 2°.
 * Aberto no começo: à esquerda o sumário (o começo do livro, um bloco fino de folhas), à direita a
 * abertura do primeiro artigo (o resto do livro, um bloco grosso). Uma folha está no meio da virada:
 * sobe da calha, passa do meio e enrola para a esquerda, com o verso em branco à vista e, de leve, a
 * epígrafe do outro lado aparecendo contra a luz.
 *
 * A história das páginas, para tudo ser coerente: iv (verso) é o sumário; a folha que vira é v/vi,
 * com a epígrafe do livro na frente (v, a frase da capa) e o verso em branco (vi); 1 (frente) é a
 * abertura do artigo. No meio da virada, vemos iv à esquerda, 1 à direita e o verso vi na folha.
 *
 * Como o realismo foi feito:
 * - Geometria: cada folha do bloco é uma curva em comprimento de arco que sai da dobra no fundo da
 *   calha e se achata na altura do bloco; as folhas de baixo quase não curvam. Como toda folha tem a
 *   mesma largura, as de cima (que gastam mais papel na curva) terminam antes: a borda da frente sai
 *   em degraus, e o pé mostra o leque das folhas entrando na lombada.
 * - A folha que vira é um cilindro de papel levemente torcido (a ponta de cima mais adiantada que a
 *   de baixo, como quem vira a página pelo canto de cima).
 * - Mapeamento: a arte plana de cada página (papel e tinta) vai em triângulos com afim exata; a luz
 *   entra em cada triângulo como um gradiente linear exato entre os três vértices (interpolação
 *   linear contínua de triângulo para triângulo), dentro do mesmo recorte do papel opaco: sem costura
 *   e sem degrau.
 * - Luz: principal grande do alto à esquerda (e um pouco de trás), preenchimento fraco da frente à
 *   direita, ambiente; oclusão no fundo da calha; a folha levantada deixa passar luz (translucidez).
 * - Sombras: da folha sobre as páginas (projetada pela luz sobre a superfície curva de verdade, em
 *   três camadas de desfoque) e do livro na mesa (contato, meia-sombra do bloco grosso e ambiente).
 *
 * Os textos são medidos no Chrome com as próprias fontes (Bitter e Newsreader itálico) antes da
 * composição (alinhamento, pontilhados e justificação exatos); por isso o gerador abre o Chrome.
 *
 *   fnm exec --using=24 node pranchas/p06-folheando.mjs  →  pranchas/p06-folheando.svg
 */
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { livro, PAPEL, TINTA_PAPEL, BITTER, NEWSREADER, FONTES } from "../base/base.mjs";
import { Prancha, camera, enquadrar, girarY, soma, sub, mul, dot, cross, normal, limitar, suave, afim, matriz, pontos, caminho, n, area, alargar, filtroDesfoque, filtroGrao, aleatorio } from "../ferramentas/cena.mjs";
import { chromium } from "../ferramentas/modulos.mjs";
import { servir } from "../ferramentas/servidor.mjs";

const PASTA = fileURLToPath(new URL("..", import.meta.url));
const L = livro(process.env.LIVRO ?? "desenvolvimento-de-software");
const MEDIDAS = JSON.parse(readFileSync(new URL("../base/medidas.json", import.meta.url), "utf8"));
const POSTS = MEDIDAS.livros[L.slug].posts.length ? MEDIDAS.livros[L.slug].posts : MEDIDAS.livros["desenvolvimento-de-software"].posts; // com a descrição (a base só traz título, subtítulo e datas)

// ---------- medidas do livro (unidades da referência: a capa tem 480 × 720) ----------

const PG_W = 468; // largura da folha, da dobra à borda da frente (em comprimento de arco)
const PG_H = 702; // altura das folhas: 720 menos 9 de seixa no alto e no pé
const Z0 = -PG_H / 2; // cabeça (longe do observador)
const Z1 = PG_H / 2; // pé (perto)
const SEIXA = 9;
const TABUA = 8; // espessura do papelão das capas
const CAPA_H = 720;
const T_ESQ = 20; // o começo do livro (folhas de rosto e sumário)
const T_DIR = 100; // o resto do livro
const Y_CALHA = 14; // altura da dobra no fundo da calha
const ESPALHA_ESQ = 10; // as dobras se espalham um pouco pela lombada
const ESPALHA_DIR = 16;
const GIRO = 2; // o livro gira 2° na mesa
const ELEVACAO = 44; // câmera: graus acima da mesa
const LARGURA = 1300;
const ALTURA = 1000;

// ---------- cores ----------

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const paraHex = (rgb) => "#" + rgb.map((v) => Math.round(limitar(v, 0, 255)).toString(16).padStart(2, "0")).join("");
/** Mistura em sRGB: t = 0 dá `a`, t = 1 dá `b`. */
const misturar = (a, b, t) => paraHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
const TINTA = TINTA_PAPEL; // #1f1c18
const DESTAQUE = L.destaque; // #7a4430 (a cor do livro)
const PAPEL_MIOLO = PAPEL; // o papel das folhas: o mesmo creme da capa
/** Tinta mais clara sem transparência (misturada ao papel): a célula pode repetir a letra na emenda sem escurecer. */
const tom = (t) => misturar(PAPEL_MIOLO, TINTA, t);

// ---------- tipografia: estilos e medição no Chrome ----------

function estilo({ familia = "bitter", peso = 400, corpo, italico = false, espacamento = 0, opsz, numeros = "lining-nums" }) {
  return [
    `font-family:${familia === "bitter" ? BITTER : NEWSREADER}`,
    `font-weight:${peso}`,
    `font-size:${n(corpo)}px`,
    italico ? "font-style:italic" : "",
    espacamento ? `letter-spacing:${n(espacamento)}px` : "",
    opsz ? `font-variation-settings:'opsz' ${opsz}` : "",
    `font-variant-numeric:${numeros}`,
    "text-rendering:geometricPrecision",
  ]
    .filter(Boolean)
    .join(";");
}
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const esp = (est) => Number(/letter-spacing:([-\d.]+)px/.exec(est)?.[1] ?? 0);

/** Mede no Chrome, com as fontes dos livros, a largura de cada [texto, estilo] (inclui o espaçamento entre letras). */
async function medir(pares) {
  const servidor = await servir(0);
  const base = `http://127.0.0.1:${servidor.address().port}`;
  const navegador = await chromium.launch({ channel: "chrome", headless: true });
  const nome = `_p06-medir-${process.pid}.html`;
  const arquivo = `${PASTA}.render/${nome}`;
  try {
    writeFileSync(arquivo, `<!doctype html><meta charset="utf-8">${FONTES}<svg id="s" xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>`);
    const pagina = await navegador.newPage();
    await pagina.goto(`${base}/.render/${nome}`);
    rmSync(arquivo, { force: true });
    return await pagina.evaluate(async (lista) => {
      await Promise.all(["400 20px 'Bitter Variable'", "800 20px 'Bitter Variable'", "italic 400 20px 'Newsreader Variable'"].map((f) => document.fonts.load(f, "Aãç")));
      await document.fonts.ready;
      const svg = document.getElementById("s");
      return lista.map(([texto, est]) => {
        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("style", est);
        t.textContent = texto;
        svg.appendChild(t);
        const w = t.getComputedTextLength();
        t.remove();
        return w;
      });
    }, pares);
  } finally {
    rmSync(arquivo, { force: true });
    await navegador.close();
    servidor.close();
  }
}

// Os estilos das páginas: títulos em Bitter, subtítulos no itálico da Newsreader, texto corrido em Bitter 400.
const E = {
  rotulo: estilo({ peso: 700, corpo: 8.6, espacamento: 2.1 }),
  sumario: estilo({ peso: 800, corpo: 36, espacamento: -0.7 }),
  nomeLivro: estilo({ familia: "news", corpo: 15.5, italico: true, opsz: 16 }),
  numero: estilo({ peso: 700, corpo: 10.5 }),
  tituloItem: estilo({ peso: 600, corpo: 12.8, espacamento: -0.1 }),
  subItem: estilo({ familia: "news", corpo: 11.2, italico: true, opsz: 12 }),
  dataItem: estilo({ peso: 400, corpo: 9.8 }),
  folio: estilo({ peso: 400, corpo: 9.6 }),
  titulo: estilo({ peso: 800, corpo: 27, espacamento: -0.6 }),
  subtitulo: estilo({ familia: "news", corpo: 15.5, italico: true, opsz: 16 }),
  data: estilo({ peso: 600, corpo: 8.2, espacamento: 1.5 }),
  epigrafe: estilo({ familia: "news", corpo: 19, italico: true, opsz: 18 }),
};
const ALTURA_MAIUSCULA = 0.707; // Bitter 800 (medida no Chrome)
// O corpo do parágrafo é escolhido entre estes (o que justifica melhor e não deixa palavra sozinha).
const CORPOS = [10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11, 11.1, 11.2];
const estiloCorpo = (c) => estilo({ peso: 400, corpo: c });
const entrelinhaDe = (c) => Math.round(c * 1.58 * 10) / 10;
/** A capitular ocupa três linhas: do alto das maiúsculas da primeira à linha de base da terceira. */
const estiloCapitular = (c) => estilo({ peso: 800, corpo: (2 * entrelinhaDe(c) + c * ALTURA_MAIUSCULA) / ALTURA_MAIUSCULA });

// ---------- as páginas (artes planas, 468 × 702) ----------

const texto = (t, x, y, est, cor, extra = "") => `<text x="${n(x)}" y="${n(y)}" fill="${cor}" style="${est}"${extra}>${esc(t)}</text>`;

/** Quebra um texto em linhas pela largura medida. */
function quebrar(t, est, largura, lg) {
  const out = [];
  let cur = "";
  for (const w of t.split(" ")) {
    const teste = cur ? `${cur} ${w}` : w;
    if (cur && lg(teste, est) > largura) {
      out.push(cur);
      cur = w;
    } else cur = teste;
  }
  if (cur) out.push(cur);
  return out;
}

/**
 * Cada página é uma lista de peças de tinta (sem o papel): { svg, caixa: [u0, v0, u1, v1] }. O
 * mapeamento põe o papel e, em cada célula, só as peças que a tocam.
 */
function montarPaginas(W) {
  const pecas = { sumario: [], artigo: [], epigrafe: [] };
  const lg = (t, est) => W.get(`${est}|${t}`) - esp(est); // largura visível (sem o espaço depois da última letra)
  const linhaBase = 268; // a linha do título, a mesma nas duas páginas

  // --- Sumário (página da esquerda, iv; u = 0 na borda da frente, 468 na dobra) ---
  const S = pecas.sumario;
  const itens = [];
  const x0 = 56; // margem de fora
  const x1 = PG_W - 88; // margem de dentro (a calha come um pouco)
  S.push({ svg: texto(`VOLUME 0${L.volume}`, x0, linhaBase - 36, E.rotulo, DESTAQUE), caixa: [x0, linhaBase - 46, x0 + 80, linhaBase - 30] });
  S.push({ svg: texto("Sumário", x0 - 1.5, linhaBase, E.sumario, TINTA), caixa: [x0 - 4, linhaBase - 30, x0 + 160, linhaBase + 10] });
  S.push({ svg: texto(L.titulo, x0, linhaBase + 25, E.nomeLivro, tom(0.78)), caixa: [x0, linhaBase + 12, x0 + 200, linhaBase + 30] });
  S.push({ svg: `<rect x="${x0}" y="${linhaBase + 42}" width="34" height="1.5" fill="${DESTAQUE}"/>`, caixa: [x0, linhaBase + 41, x0 + 34, linhaBase + 44] });
  let y = linhaBase + 104;
  const xt = x0 + 20; // títulos e subtítulos
  POSTS.forEach((p, i) => {
    const partes = [];
    partes.push(texto(String(i + 1), x0, y, E.numero, DESTAQUE));
    partes.push(texto(p.titulo, xt, y, E.tituloItem, TINTA));
    partes.push(texto(p.dia, x1, y, E.dataItem, tom(0.62), ` text-anchor="end"`));
    // Pontilhado entre o fim do título e a data.
    const a = xt + lg(p.titulo, E.tituloItem) + 7;
    const b = x1 - lg(p.dia, E.dataItem) - 7;
    const pts = [];
    for (let x = b; x >= a; x -= 4.3) pts.push(`<circle cx="${n(x)}" cy="${n(y - 1.6)}" r="0.62"/>`);
    partes.push(`<g fill="${tom(0.5)}">${pts.join("")}</g>`);
    const linhas = quebrar(p.subtitulo, E.subItem, x1 - xt, lg);
    linhas.forEach((l, k) => partes.push(texto(l, xt, y + 15.5 + k * 13.6, E.subItem, tom(0.72))));
    const fim = y + 15.5 + (linhas.length - 1) * 13.6;
    S.push({ svg: partes.join(""), caixa: [x0, y - 12, x1, fim + 4] });
    itens.push({ y, fim, x0, x1 });
    y = fim + 26;
  });
  S.push({ svg: texto("iv", (x0 + x1) / 2, 655, E.folio, tom(0.55), ` text-anchor="middle"`), caixa: [(x0 + x1) / 2 - 12, 645, (x0 + x1) / 2 + 12, 658] });

  // --- Abertura do artigo 1 (página da direita, 1; u = 0 na dobra) ---
  const A = pecas.artigo;
  const a0 = 112; // margem de dentro (a curva da calha é funda deste lado)
  const a1 = PG_W - 56;
  const larguraCol = a1 - a0;
  const P0 = POSTS[0];
  A.push({ svg: texto("ARTIGO 1", a0, linhaBase - 36, E.rotulo, DESTAQUE), caixa: [a0, linhaBase - 46, a0 + 70, linhaBase - 30] });
  const linhasTitulo = quebrar(P0.titulo, E.titulo, larguraCol, lg);
  linhasTitulo.forEach((l, k) => A.push({ svg: texto(l, a0 - 1.2, linhaBase + k * 30, E.titulo, TINTA), caixa: [a0 - 3, linhaBase + k * 30 - 22, a1, linhaBase + k * 30 + 7] }));
  let ya = linhaBase + (linhasTitulo.length - 1) * 30 + 30;
  const linhasSub = quebrar(P0.subtitulo, E.subtitulo, larguraCol, lg);
  linhasSub.forEach((l, k) => A.push({ svg: texto(l, a0, ya + k * 19, E.subtitulo, tom(0.8)), caixa: [a0, ya + k * 19 - 13, a1, ya + k * 19 + 5] }));
  ya += (linhasSub.length - 1) * 19 + 24;
  A.push({ svg: texto(P0.data.toUpperCase(), a0, ya, E.data, tom(0.55)), caixa: [a0, ya - 8, a0 + 110, ya + 2] });
  ya += 18;
  A.push({ svg: `<rect x="${a0}" y="${n(ya)}" width="34" height="1.5" fill="${DESTAQUE}"/>`, caixa: [a0, ya - 1, a0 + 34, ya + 3] });
  ya += 34;
  // O parágrafo: a descrição real, justificada, com capitular de três linhas na cor do livro. O
  // corpo sai da lista CORPOS: o que tem os espaços mais iguais e a última linha nem curta nem cheia.
  const primeira = P0.descricao[0];
  const compor = (c) => {
    const est = estiloCorpo(c);
    const recuo = W.get(`${estiloCapitular(c)}|${primeira}`) + 4.5;
    const espaco = W.get(`${est}|x x`) - W.get(`${est}|xx`);
    const larguraLinha = (k) => larguraCol - (k < 3 ? recuo : 0);
    const somaPalavras = (ws) => ws.reduce((s, w) => s + W.get(`${est}|${w}`), 0) + espaco * (ws.length - 1);
    const linhas = [];
    let atual = [];
    for (const w of P0.descricao.slice(1).split(" ")) {
      const teste = [...atual, w];
      if (atual.length && somaPalavras(teste) > larguraLinha(linhas.length)) {
        linhas.push(atual);
        atual = [w];
      } else atual = teste;
    }
    if (atual.length) linhas.push(atual);
    let ruim = (c - 10.7) ** 2 * 3;
    linhas.forEach((ws, i) => {
      if (i === linhas.length - 1) return;
      const extra = (larguraLinha(i) - somaPalavras(ws)) / Math.max(1, ws.length - 1);
      ruim += (extra / espaco) ** 2;
    });
    const ult = linhas[linhas.length - 1];
    const cheia = somaPalavras(ult) / larguraLinha(linhas.length - 1);
    if (linhas.length < 3) ruim += 50;
    else if (linhas.length === 3) ruim += cheia < 0.5 ? (0.5 - cheia) ** 2 * 60 : 0;
    else ruim += cheia < 0.35 ? (0.35 - cheia) ** 2 * 80 + 2 : cheia > 0.9 ? 2 : 0;
    return { c, est, recuo, espaco, larguraLinha, somaPalavras, linhas, ruim };
  };
  const melhor = CORPOS.map(compor).sort((a, b) => a.ruim - b.ruim)[0];
  const { c: corpo, est: E_CORPO, recuo, espaco, larguraLinha, somaPalavras, linhas } = melhor;
  const entrelinha = entrelinhaDe(corpo);
  const partesP = [`<text x="${n(a0 - 0.8)}" y="${n(ya + 2 * entrelinha)}" fill="${DESTAQUE}" style="${estiloCapitular(corpo)}">${esc(primeira)}</text>`];
  linhas.forEach((ws, i) => {
    const ultima = i === linhas.length - 1;
    const folgaEsp = !ultima && ws.length > 1 ? (larguraLinha(i) - somaPalavras(ws)) / (ws.length - 1) : 0;
    let x = a0 + (i < 3 ? recuo : 0);
    const spans = ws.map((w) => {
      const s = `<tspan x="${n(x)}">${esc(w)}</tspan>`;
      x += W.get(`${E_CORPO}|${w}`) + espaco + folgaEsp;
      return s;
    });
    partesP.push(`<text y="${n(ya + i * entrelinha)}" fill="${tom(0.9)}" style="${E_CORPO}">${spans.join("")}</text>`);
  });
  const fimP = ya + (linhas.length - 1) * entrelinha;
  A.push({ svg: partesP.join(""), caixa: [a0 - 2, ya - 36, a1, fimP + 5] });
  A.push({ svg: texto("1", (a0 + a1) / 2, 655, E.folio, tom(0.55), ` text-anchor="middle"`), caixa: [(a0 + a1) / 2 - 10, 645, (a0 + a1) / 2 + 10, 658] });

  // --- A epígrafe (frente v da folha que vira), para aparecer espelhada contra a luz no verso vi ---
  const ce = (a0 + a1) / 2;
  pecas.epigrafe.push({ svg: texto(L.frase, ce, linhaBase, E.epigrafe, TINTA, ` text-anchor="middle"`), caixa: [ce - 150, linhaBase - 16, ce + 150, linhaBase + 6] });
  pecas.info = { itens, linhasTitulo, linhas: linhas.length, corpo, fimLista: y, fimParagrafo: fimP };
  return pecas;
}

/** Os pares [texto, estilo] que a composição precisa medir (todos os trechos possíveis das linhas). */
function pedidosDeMedida() {
  const lista = [];
  const trechos = (t, est) => {
    const ws = t.split(" ");
    for (let i = 0; i < ws.length; i++) for (let j = i + 1; j <= ws.length; j++) lista.push([ws.slice(i, j).join(" "), est]);
  };
  for (const p of POSTS) {
    lista.push([p.titulo, E.tituloItem], [p.dia, E.dataItem]);
    trechos(p.subtitulo, E.subItem);
  }
  const P0 = POSTS[0];
  trechos(P0.titulo, E.titulo);
  trechos(P0.subtitulo, E.subtitulo);
  for (const c of CORPOS) {
    for (const w of P0.descricao.slice(1).split(" ")) lista.push([w, estiloCorpo(c)]);
    lista.push(["x x", estiloCorpo(c)], ["xx", estiloCorpo(c)], [P0.descricao[0], estiloCapitular(c)]);
  }
  return lista;
}

// ---------- geometria: as folhas do bloco ----------

function integral(f, a, b, k = 400) {
  let s = 0;
  for (let i = 0; i < k; i++) s += f(a + ((i + 0.5) * (b - a)) / k);
  return (s * (b - a)) / k;
}

/**
 * O corte de uma folha: sai da dobra (x0, y0) com o ângulo phi0 e se achata até a altura y1 (o
 * ângulo cai como (1 − s/Lc)^p ao longo do arco). `lado`: +1 à direita, −1 à esquerda. `onda`: um
 * desvio de altura na parte plana (a página nunca é perfeitamente reta). Devolve em(s) → [x, y, ângulo].
 */
function perfil({ x0, y0, y1, phi0, lado, p = 1.5, onda = null, passo = 0.5 }) {
  const subida = y1 - y0;
  const I = integral((t) => Math.sin(phi0 * (1 - t) ** p), 0, 1);
  const Lc = subida > 0.01 && phi0 > 0.001 ? subida / I : 0;
  const total = Math.ceil(PG_W / passo);
  const xs = [];
  const ys = [];
  let x = x0;
  let y = y0;
  for (let i = 0; i <= total; i++) {
    const s = i * passo;
    const ang = Lc > 0 && s < Lc ? phi0 * (1 - s / Lc) ** p : 0;
    xs.push(x);
    ys.push(y + (onda ? onda(s, Lc) : 0));
    x += lado * Math.cos(ang) * passo;
    y += Math.sin(ang) * passo;
  }
  // O ângulo de verdade (com a onda) sai da própria curva.
  const em = (s) => {
    const f = limitar(s / passo, 0, total - 1e-9);
    const i = Math.floor(f);
    const t = f - i;
    const j = Math.min(total, i + 1);
    const i0 = Math.max(0, i - 1);
    const i1 = Math.min(total, i + 2);
    return [xs[i] + (xs[j] - xs[i]) * t, ys[i] + (ys[j] - ys[i]) * t, Math.atan2(ys[i1] - ys[i0], lado * (xs[i1] - xs[i0]))];
  };
  return { em, Lc };
}

/** Um bloco de folhas: f = 0 é a folha de cima (a página à vista), f = 1 a de baixo, sobre a tábua. */
function bloco({ lado, t, espalha, phiTopo, p, onda }) {
  const alturaTopo = TABUA + t - Y_CALHA;
  const cache = new Map();
  const folha = (f) => {
    const chave = Math.round(f * 10000);
    if (cache.has(chave)) return cache.get(chave);
    const y0 = Y_CALHA - (Y_CALHA - TABUA) * f;
    const y1 = TABUA + t * (1 - f);
    const subida = y1 - y0;
    const phi0 = subida > 0 ? phiTopo * Math.sqrt(Math.min(1, subida / alturaTopo)) : 0;
    const r = perfil({ x0: lado * espalha * f, y0, y1, phi0, lado, p, onda: f === 0 ? onda : null });
    cache.set(chave, r);
    return r;
  };
  return { lado, t, espalha, folha, topo: folha(0), base: folha(1), frente: (f) => folha(f).em(PG_W) };
}

const ESQ = bloco({
  lado: -1,
  t: T_ESQ,
  espalha: ESPALHA_ESQ,
  phiTopo: (38 * Math.PI) / 180,
  p: 1.6,
  onda: (s, Lc) => 1.1 * Math.sin((2 * Math.PI * s) / 300 + 0.6) * suave(Lc, Lc + 90, s) + 1.3 * suave(PG_W - 45, PG_W, s),
});
const DIR = bloco({
  lado: 1,
  t: T_DIR,
  espalha: ESPALHA_DIR,
  phiTopo: (84 * Math.PI) / 180,
  p: 1.35,
  onda: (s, Lc) => 1.2 * Math.sin((2 * Math.PI * s) / 280 + 2.1) * suave(Lc, Lc + 80, s) + 1.6 * suave(PG_W - 40, PG_W, s),
});

// As tábuas: a borda de fora passa 9 da folha de baixo (a seixa).
const TAB_E = { x0: ESQ.base.em(PG_W)[0] - SEIXA };
TAB_E.x1 = TAB_E.x0 + 480;
const TAB_D = { x1: DIR.base.em(PG_W)[0] + SEIXA };
TAB_D.x0 = TAB_D.x1 - 480;

// ---------- geometria: a folha que vira ----------

/**
 * O corte da folha que vira: o ângulo da tangente ao longo do arco (graus), de 86° na dobra (quase
 * em pé, junto da parede da página da direita) até 200° na borda (passou do meio e enrola para a
 * esquerda). A torção faz a parte de cima ir mais adiante que a de baixo (a folha é virada pelo
 * canto de cima); o papel quase não estica (menos de 2%).
 */
const CURVA_FOLHA = [
  [0, 86],
  [50, 93],
  [180, 116],
  [330, 158],
  [430, 188],
  [468, 200],
];
const TORCAO = [0.84, 0.4]; // fator do giro: 0,84 no meio, ±0,4 entre a cabeça e o pé
const anguloFolha = (s) => {
  for (let i = 0; i < CURVA_FOLHA.length - 1; i++) {
    const [s0, a0] = CURVA_FOLHA[i];
    const [s1, a1] = CURVA_FOLHA[i + 1];
    if (s <= s1) {
      const t = (s - s0) / (s1 - s0);
      const u = t * t * (3 - 2 * t);
      return ((a0 + (a1 - a0) * (0.5 * t + 0.5 * u)) * Math.PI) / 180;
    }
  }
  return (CURVA_FOLHA[CURVA_FOLHA.length - 1][1] * Math.PI) / 180;
};
const cortesDaFolha = new Map();
function corteDaFolha(z) {
  const chave = Math.round(z * 4) / 4;
  if (cortesDaFolha.has(chave)) return cortesDaFolha.get(chave);
  const fator = TORCAO[0] + TORCAO[1] * (-chave / Z1);
  const pts = [];
  let x = -0.6;
  let y = Y_CALHA;
  const phi0 = anguloFolha(0);
  for (let s = 0; s <= PG_W + 0.5; s += 0.5) {
    pts.push([x, y]);
    const ph = phi0 + (anguloFolha(s) - phi0) * fator;
    x += Math.cos(ph) * 0.5;
    y += Math.sin(ph) * 0.5;
  }
  cortesDaFolha.set(chave, pts);
  return pts;
}
function folhaP(s, z) {
  const pts = corteDaFolha(z);
  const f = limitar(s / 0.5, 0, pts.length - 1.000001);
  const i = Math.floor(f);
  const t = f - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t, z];
}

// ---------- câmera e luz ----------

const gir = (p) => girarY(p, GIRO, [0, 0, 0]);
const el = (ELEVACAO * Math.PI) / 180;
const ALVO = [0, 60, 0];
const cam = camera({ olho: soma(ALVO, [0, 6000 * Math.sin(el), 6000 * Math.cos(el)]), alvo: ALVO, focal: 3000, centro: [LARGURA / 2, ALTURA / 2] });
const P = (p) => cam.p(gir(p)); // ponto do livro → tela
const profundidade = (p) => cam.projetar(gir(p))[2];
const OLHO_LIVRO = girarY(cam.olho, -GIRO, [0, 0, 0]); // o olho nas coordenadas do livro

const LUZ = girarY(normal([-0.52, 0.8, -0.3]), -GIRO); // para a luz: alto, à esquerda e um pouco de trás
const PREENCHE = girarY(normal([0.2, 0.55, 0.8]), -GIRO); // rebatedor fraco, do lado do fotógrafo
const K = { amb: 0.36, dif: 0.6, pre: 0.2, trans: 0.42, envolve: 0.45 };
/** A luz principal é grande (uma janela, um softbox): o difuso "envolve" a forma (Lambert envolvente). */
const difusa = (x) => Math.max(0, (x + K.envolve) / (1 + K.envolve));
const brilho = (N) => K.amb + K.dif * difusa(dot(N, LUZ)) + K.pre * Math.max(0, dot(N, PREENCHE));
const B_PLANO = brilho([0, 1, 0]);
/** Queda suave da luz grande: um pouco mais clara no alto à esquerda, um pouco mais baixa embaixo à direita. */
const queda = ([x, , z]) => 1.012 + 0.03 * (-x / 480) + 0.022 * (-z / Z1);

// ---------- a prancha ----------

const pr = new Prancha({
  prefixo: "p06",
  largura: LARGURA,
  altura: ALTURA,
  titulo: "Folheando: o livro Desenvolvimento de Software aberto no sumário, com uma folha virando",
  descricao:
    "O livro Desenvolvimento de Software aberto e deitado na mesa. Na página da esquerda, o sumário com os seis artigos; na da direita, a abertura do artigo Filtros de serialização no Jackson. Uma folha está no meio da virada, curvada, com o verso à vista e a sombra sobre a página.",
});

// Enquadramento: o livro inteiro, a folha e o respiro da sombra.
{
  const pts = [];
  for (const x of [TAB_E.x0, TAB_D.x1]) for (const z of [-CAPA_H / 2, CAPA_H / 2]) pts.push(gir([x, 0, z]), gir([x + 60, 0, z + 50]));
  for (let s = 0; s <= PG_W; s += 26) for (let z = Z0; z <= Z1; z += 39) pts.push(gir(folhaP(s, z)));
  enquadrar(cam, pts, [40, 26, LARGURA - 80, ALTURA - 60]);
}

// ---------- ferramentas de desenho ----------

const recorte = (ps) => {
  const id = pr.id("r");
  pr.def(`<clipPath id="${id}"><polygon points="${pontos(ps)}"/></clipPath>`);
  return id;
};
const recorteCaminho = (d) => {
  const id = pr.id("r");
  pr.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
  return id;
};
const desfoque = (d) => filtroDesfoque(pr, d, { margem: 0.3 });
const gradLinear = (a, b, paradas) => {
  const id = pr.id("g");
  pr.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}">${paradas.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`).join("")}</linearGradient>`,
  );
  return id;
};

/**
 * O gradiente linear exato de um triângulo da tela com valores nos três vértices (uma função linear
 * no plano: o valor de cada ponto é a sua projeção na direção de maior variação). Devolve o atributo
 * de preenchimento; `cor(v)` dá a cor de cada parada (as paradas extras marcam onde `cor` dobra).
 */
function gradienteTriangulo([p0, p1, p2], [a0, a1, a2], cor, dobras = []) {
  const e1 = [p1[0] - p0[0], p1[1] - p0[1]];
  const e2 = [p2[0] - p0[0], p2[1] - p0[1]];
  const det = e1[0] * e2[1] - e1[1] * e2[0];
  const amin = Math.min(a0, a1, a2);
  const amax = Math.max(a0, a1, a2);
  if (Math.abs(det) < 1e-6 || amax - amin < 0.003) return `fill="${cor((a0 + a1 + a2) / 3)}"`;
  const gx = ((a1 - a0) * e2[1] - (a2 - a0) * e1[1]) / det;
  const gy = (e1[0] * (a2 - a0) - e2[0] * (a1 - a0)) / det;
  const g2 = gx * gx + gy * gy;
  const ini = [p0[0] + (gx * (amin - a0)) / g2, p0[1] + (gy * (amin - a0)) / g2];
  const fim = [p0[0] + (gx * (amax - a0)) / g2, p0[1] + (gy * (amax - a0)) / g2];
  const vals = [amin, ...dobras.filter((d) => d > amin && d < amax), amax];
  const id = pr.id("g");
  pr.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(ini[0])}" y1="${n(ini[1])}" x2="${n(fim[0])}" y2="${n(fim[1])}">${vals.map((v) => `<stop offset="${n(((v - amin) / (amax - amin)) * 1000) / 1000}" ${cor(v, true)}/>`).join("")}</linearGradient>`,
  );
  return `fill="url(#${id})"`;
}
// Cor de uma camada de luz: preto que escurece ou branco que clareia, pela opacidade.
const camadaPreta = (v, parada) => (parada ? `stop-color="#000" stop-opacity="${n(v * 1000) / 1000}"` : `#000" fill-opacity="${n(v * 1000) / 1000}`);
const camadaBranca = (v, parada) => (parada ? `stop-color="#fff" stop-opacity="${n(v * 1000) / 1000}"` : `#fff" fill-opacity="${n(v * 1000) / 1000}`);

/** A luz de um triângulo (λ nos vértices, 1 = papel plano iluminado): preto onde escurece, branco onde clareia. */
function luzTriangulo(tri, lams, folga = 0.8) {
  const poly = pontos(alargar(tri, folga));
  let s = "";
  const escuro = lams.map((l) => Math.max(0, 1 - l));
  const claro = lams.map((l) => Math.max(0, (l - 1) * 0.9));
  if (escuro.some((v) => v > 0.003)) s += `<polygon points="${poly}" ${gradienteTriangulo(tri, escuro, camadaPreta)}/>`;
  if (claro.some((v) => v > 0.003)) s += `<polygon points="${poly}" ${gradienteTriangulo(tri, claro, camadaBranca)}/>`;
  return s;
}

/**
 * Mapeia uma página: papel opaco + as peças de tinta que tocam a célula (afim exata em cada
 * triângulo) + a luz do triângulo, tudo no mesmo recorte. `Pp(u, v)` → ponto do livro; `us`, `vs`:
 * as divisas das células na arte; `luz(u, v)` → λ.
 */
function mapear({ Pp, us, vs, papel, pecas, luz, folga = 0.5 }) {
  const partes = [];
  const lamCache = new Map();
  const lamEm = (u, v) => {
    const k = `${u}|${v}`;
    if (!lamCache.has(k)) lamCache.set(k, luz(u, v));
    return lamCache.get(k);
  };
  for (let j = 0; j < vs.length - 1; j++)
    for (let i = 0; i < us.length - 1; i++) {
      const [u0, u1, v0, v1] = [us[i], us[i + 1], vs[j], vs[j + 1]];
      const uv = [
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
      ];
      const tela = uv.map(([u, v]) => P(Pp(u, v)));
      const lam = uv.map(([u, v]) => lamEm(u, v));
      const tocam = pecas.filter(({ caixa: [a, b, c, d] }) => c >= u0 - 2 && a <= u1 + 2 && d >= v0 - 2 && b <= v1 + 2);
      for (const idx of [
        [0, 1, 2],
        [0, 2, 3],
      ]) {
        const o = idx.map((k) => uv[k]);
        const d = idx.map((k) => tela[k]);
        if (Math.abs(area(d)) < 0.02) continue;
        const m = afim(o, d);
        if (!m.every(Number.isFinite)) continue;
        const id = pr.id("c");
        pr.def(`<clipPath id="${id}"><polygon points="${pontos(alargar(d, folga))}"/></clipPath>`);
        const arte = `<rect x="${n(u0 - 3)}" y="${n(v0 - 3)}" width="${n(u1 - u0 + 6)}" height="${n(v1 - v0 + 6)}" fill="${papel}"/>${tocam.map((t) => `<use href="#${t.id}"/>`).join("")}`;
        partes.push(`<g clip-path="url(#${id})"><g transform="${matriz(m)}">${arte}</g>${luzTriangulo(d, idx.map((k) => lam[k]))}</g>`);
      }
    }
  return partes.join("");
}

/** O contorno (tela) de uma superfície Pp(u, v) de w × h. */
function contornoDe(Pp, w, h, k = 48) {
  const ps = [];
  for (let i = 0; i <= k; i++) ps.push(P(Pp((w * i) / k, 0)));
  for (let i = 1; i <= k; i++) ps.push(P(Pp(w, (h * i) / k)));
  for (let i = k - 1; i >= 0; i--) ps.push(P(Pp((w * i) / k, h)));
  for (let i = k - 1; i >= 1; i--) ps.push(P(Pp(0, (h * i) / k)));
  return ps;
}

/** Envoltória convexa (tela). */
function envoltoria(ps) {
  const q = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const baixo = [];
  for (const p of q) {
    while (baixo.length >= 2 && cr(baixo[baixo.length - 2], baixo[baixo.length - 1], p) <= 0) baixo.pop();
    baixo.push(p);
  }
  const cima = [];
  for (const p of q.reverse()) {
    while (cima.length >= 2 && cr(cima[cima.length - 2], cima[cima.length - 1], p) <= 0) cima.pop();
    cima.push(p);
  }
  return [...baixo.slice(0, -1), ...cima.slice(0, -1)];
}

/** Um retângulo arredondado no chão (y) de x0..x1 × z0..z1, em pontos do livro. */
function retanguloArredondado(x0, x1, z0, z1, y, r, passos = 5) {
  const ps = [];
  const canto = (cx, cz, a0) => {
    for (let k = 0; k <= passos; k++) {
      const a = a0 + (k / passos) * (Math.PI / 2);
      ps.push([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]);
    }
  };
  canto(x1 - r, z1 - r, 0);
  canto(x0 + r, z1 - r, Math.PI / 2);
  canto(x0 + r, z0 + r, Math.PI);
  canto(x1 - r, z0 + r, (3 * Math.PI) / 2);
  return ps;
}

// ---------- as peças de tinta (medidas e compostas) ----------

const W = new Map();
{
  const vistos = new Map();
  for (const [t, e] of pedidosDeMedida()) vistos.set(`${e}|${t}`, [t, e]);
  const lista = [...vistos.values()];
  const larguras = await medir(lista);
  lista.forEach(([t, e], i) => W.set(`${e}|${t}`, larguras[i]));
}
const PECAS = montarPaginas(W);
// Maquete (livro sem artigos, busca sem resultado): EM_BRANCO=1 deixa as páginas sem texto.
if (process.env.EM_BRANCO) for (const k of ["sumario", "artigo", "epigrafe"]) PECAS[k] = [];
for (const lista of [PECAS.sumario, PECAS.artigo])
  for (const p of lista) {
    p.id = pr.id("tinta");
    pr.def(`<g id="${p.id}">${p.svg}</g>`);
  }

// As superfícies das páginas (u, v na arte → ponto do livro).
const paginaEsq = (u, v) => {
  const [x, y] = ESQ.topo.em(PG_W - u);
  return [x, y, Z0 + v];
};
const paginaDir = (u, v) => {
  const [x, y] = DIR.topo.em(u);
  return [x, y, Z0 + v];
};
/** Normal (para cima) da página no arco s. */
const normalPagina = (b, s) => {
  const ang = b.topo.em(s)[2];
  return b.lado > 0 ? [-Math.sin(ang), Math.cos(ang), 0] : [Math.sin(ang), Math.cos(ang), 0];
};

// ---------- 1. sombras na mesa ----------

/** Projeta um ponto do livro na mesa (y = 0) pela direção da luz. */
const naMesa = ([x, y, z]) => [x - (LUZ[0] / LUZ[1]) * y, 0, z - (LUZ[2] / LUZ[1]) * y];
{
  const pegada = retanguloArredondado(TAB_E.x0, TAB_D.x1, -CAPA_H / 2, CAPA_H / 2, 0, 4, 6);
  const base = pegada.map(P);
  // Ambiente larga (o livro tapa o céu da mesa em volta).
  pr.add(`<polygon points="${pontos(alargar(base, 10))}" fill="#000" fill-opacity="0.1" filter="url(#${desfoque(26)})"/>`);
  // Meia-sombra: o bloco grosso da direita joga sombra para a direita e para a frente.
  const topoDir = [];
  for (let f = 0; f <= 1.0001; f += 0.1) {
    const [x, y] = DIR.frente(f);
    topoDir.push(naMesa([x, y, Z0]), naMesa([x, y, Z1]));
  }
  for (let s = 0; s <= PG_W; s += 30) {
    const [x, y] = DIR.topo.em(s);
    topoDir.push(naMesa([x, y, Z1]));
  }
  pr.add(`<polygon points="${pontos(envoltoria([...pegada, ...topoDir].map(P)))}" fill="#000" fill-opacity="0.13" filter="url(#${desfoque(13)})"/>`);
  pr.add(`<polygon points="${pontos(alargar(base, 1.5))}" fill="#000" fill-opacity="0.2" filter="url(#${desfoque(4)})"/>`);
  // Contato: justo e escuro onde a tábua encosta na mesa.
  pr.add(`<polygon points="${pontos(base.map(([x, y]) => [x + 0.5, y + 0.8]))}" fill="#000" fill-opacity="0.42" filter="url(#${desfoque(1.2)})"/>`);
}

// ---------- 2. as tábuas (papelão forrado) ----------

/**
 * Uma tábua: a laje de papelão com os cantos um pouco arredondados. A face de cima mostra a dobra do
 * forro (a cor do livro; e o papel nos 300 de cima da capa da frente); as bordas, o forro dobrado.
 * `corEm(z)`: a cor do forro na altura z.
 */
function tabua({ x0, x1, corEm, semente }) {
  const z0 = -CAPA_H / 2;
  const z1 = CAPA_H / 2;
  const baixo = retanguloArredondado(x0, x1, z0, z1, 0, 3.5);
  const cima = retanguloArredondado(x0, x1, z0, z1, TABUA, 3.5);
  const partes = [];
  // As bordas: um quadrilátero por trecho do contorno, com a luz da normal de cada um.
  partes.push(`<polygon points="${pontos(baixo.map(P))}" fill="${misturar(corEm(z1), "#000000", 0.35)}"/>`);
  for (let i = 0; i < baixo.length; i++) {
    const j = (i + 1) % baixo.length;
    const a = baixo[i];
    const b = baixo[j];
    const nrm = normal([b[2] - a[2], 0, -(b[0] - a[0])]); // para fora
    if (dot(nrm, sub(OLHO_LIVRO, a)) <= 0) continue;
    const lam = (0.6 + 0.5 * Math.max(0, dot(nrm, LUZ)) + 0.22 * Math.max(0, dot(nrm, PREENCHE))) / B_PLANO;
    const q = alargar([baixo[i], baixo[j], cima[j], cima[i]].map(P), 0.35);
    partes.push(`<polygon points="${pontos(q)}" fill="${corEm((a[2] + b[2]) / 2)}"/>`);
    if (lam < 1) partes.push(`<polygon points="${pontos(q)}" fill="#000" fill-opacity="${n((1 - lam) * 1000) / 1000}"/>`);
  }
  // A face de cima (o avesso da capa: a dobra do forro; o resto fica sob o miolo).
  const topo = cima.map(P);
  partes.push(`<polygon points="${pontos(topo)}" fill="${corEm(z1)}"/>`);
  if (corEm(z0) !== corEm(z1)) {
    const corte = z0 + 300; // onde a capa passa do papel para a cor
    const ps = [
      [x0 - 1, TABUA, z0 - 1],
      [x1 + 1, TABUA, z0 - 1],
      [x1 + 1, TABUA, corte],
      [x0 - 1, TABUA, corte],
    ].map(P);
    partes.push(`<g clip-path="url(#${recorte(topo)})"><polygon points="${pontos(ps)}" fill="${corEm(z0)}"/></g>`);
  }
  // Luz de cima: a queda da luz grande.
  const g = gradLinear(P([x0, TABUA, z0]), P([x1, TABUA, z1]), [
    [0, "#fff", 0.05],
    [0.5, "#000", 0],
    [1, "#000", 0.07],
  ]);
  partes.push(`<polygon points="${pontos(topo)}" fill="url(#${g})"/>`);
  // Grão do forro.
  const grao = filtroGrao(pr, { base: 0.9, oitavas: 2, alfa: 0.13, semente });
  partes.push(`<g clip-path="url(#${recorte(envoltoria([...baixo, ...cima].map(P)))})"><rect width="${LARGURA}" height="${ALTURA}" filter="url(#${grao})"/></g>`);
  return partes.join("");
}
const corCapaFrente = (z) => (z < -CAPA_H / 2 + 300 ? L.papel : L.cor);
pr.add(tabua({ x0: TAB_E.x0, x1: TAB_E.x1, corEm: corCapaFrente, semente: 5 }));
pr.add(tabua({ x0: TAB_D.x0, x1: TAB_D.x1, corEm: () => L.cor, semente: 11 }));

// ---------- 3. o pé da lombada: o forro entre as tábuas e o cabeceado ----------

{
  // O forro da lombada: liga as duas tábuas por baixo do miolo (no pé, na cor do livro).
  const zq = CAPA_H / 2;
  const [xa, xb] = [TAB_E.x1 - 5, TAB_D.x0 + 5];
  const frente = [
    [xa, 0, zq],
    [xb, 0, zq],
    [xb, TABUA - 1, zq],
    [xa, TABUA - 1, zq],
  ].map(P);
  const cima = [
    [xa, TABUA - 1, zq],
    [xb, TABUA - 1, zq],
    [xb, TABUA - 1, Z1 - 4],
    [xa, TABUA - 1, Z1 - 4],
  ].map(P);
  pr.add(`<polygon points="${pontos(cima)}" fill="${misturar(L.cor, "#000000", 0.3)}"/>`);
  pr.add(`<polygon points="${pontos(frente)}" fill="${L.cor}"/><polygon points="${pontos(frente)}" fill="#000" fill-opacity="0.3"/>`);
  // O cabeceado: um cordão listrado na ponta da lombada do miolo, no fundo da calha.
  const cab = [];
  const k = 14;
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    cab.push([-ESPALHA_ESQ + t * (ESPALHA_ESQ + ESPALHA_DIR), Y_CALHA - 5 + 5.5 * Math.sin(Math.PI * t) ** 0.6, Z1 + 1.6]);
  }
  for (let i = k; i >= 0; i--) cab.push([-ESPALHA_ESQ + (i / k) * (ESPALHA_ESQ + ESPALHA_DIR), TABUA - 0.5, Z1 + 1.6]);
  const pc = cab.map(P);
  const a = P([-12, TABUA, Z1 + 1.6]);
  const b = P([18, TABUA, Z1 + 1.6]);
  const listras = [];
  for (let i = 0; i < 16; i++) {
    const t = i / 16;
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    listras.push(`<rect x="${n(x)}" y="${n(y - 12)}" width="${n((b[0] - a[0]) / 32)}" height="16" fill="${i % 2 ? L.papel : L.cor}" transform="rotate(-25 ${n(x)} ${n(y)})"/>`);
  }
  pr.add(`<g clip-path="url(#${recorte(pc)})"><polygon points="${pontos(pc)}" fill="${L.cor}"/>${listras.join("")}<polygon points="${pontos(pc)}" fill="#000" fill-opacity="0.35"/></g>`);
}

// ---------- 4. os blocos de folhas: o pé e a borda da frente ----------

const COR_CORTE = misturar(PAPEL_MIOLO, "#6a5236", 0.07); // o corte das folhas, um pouco mais escuro que a página

/** O pé de um bloco (z = Z1): o leque das folhas entrando na lombada, com as linhas das folhas. */
function peDoBloco(b, semente) {
  const partes = [];
  const topo = [];
  for (let s = 0; s <= PG_W; s += 2) topo.push(b.topo.em(s));
  const frente = [];
  for (let f = 0; f <= 1.0001; f += 0.02) frente.push(b.frente(f));
  const baseC = [];
  for (let s = PG_W; s >= 0; s -= 4) baseC.push(b.base.em(s));
  const dobras = [];
  for (let f = 1; f >= -0.0001; f -= 0.05) dobras.push(b.folha(f).em(0));
  const poly = [...topo, ...frente, ...baseC, ...dobras].map(([x, y]) => P([x, y, Z1]));
  partes.push(`<polygon points="${pontos(poly)}" fill="${COR_CORTE}"/>`);
  const dentro = [];
  // Luz do pé: a face olha para o observador e foge da luz principal; o fundo (perto da tábua) é mais escuro.
  const g = gradLinear(P([0, TABUA + b.t, Z1]), P([0, TABUA, Z1]), [
    [0, "#000", 0.07],
    [0.7, "#000", 0.12],
    [1, "#000", 0.22],
  ]);
  dentro.push(`<rect width="${LARGURA}" height="${ALTURA}" fill="url(#${g})"/>`);
  // O leque: mais escuro junto da dobra.
  const d0 = P([b.lado * 4, Y_CALHA - 2, Z1]);
  const gr = pr.id("g");
  pr.def(`<radialGradient id="${gr}" gradientUnits="userSpaceOnUse" cx="${n(d0[0])}" cy="${n(d0[1])}" r="${n(b.t * 1.5 + 30)}"><stop offset="0" stop-color="#000" stop-opacity="0.24"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`);
  dentro.push(`<rect width="${LARGURA}" height="${ALTURA}" fill="url(#${gr})"/>`);
  // As linhas das folhas (cada uma é o corte de uma folha), com espessura e tom que variam.
  const rnd = aleatorio(semente);
  const quantas = Math.round(b.t * 0.95);
  for (let i = 1; i < quantas; i++) {
    const f = limitar((i + (rnd() - 0.5) * 0.7) / quantas, 0.002, 0.998);
    const fl = b.folha(f);
    const ps = [];
    for (let s = 0; s <= PG_W; s += s < 120 ? 6 : 24) ps.push(P([...fl.em(s).slice(0, 2), Z1]));
    const op = 0.05 + rnd() * 0.1 + (i % 16 === 0 ? 0.08 : 0);
    dentro.push(`<path d="${caminho(ps, false)}" fill="none" stroke="#3a2c1c" stroke-opacity="${n(op * 1000) / 1000}" stroke-width="${n(0.3 + rnd() * 0.45)}"/>`);
  }
  const grao = filtroGrao(pr, { base: 1.1, oitavas: 2, alfa: 0.1, semente: semente + 3 });
  dentro.push(`<rect width="${LARGURA}" height="${ALTURA}" filter="url(#${grao})"/>`);
  partes.push(`<g clip-path="url(#${recorte(poly)})">${dentro.join("")}</g>`);
  // O fio claro da borda da página de cima (a quina do papel pega a luz).
  const quina = topo.filter((_, i) => i % 2 === 0).map(([x, y]) => P([x, y, Z1]));
  partes.push(`<path d="${caminho(quina, false)}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="0.6"/>`);
  return partes.join("");
}

/** A borda da frente de um bloco: as bordas das folhas em degraus finos, vistas de cima. */
function frenteDoBloco(b, semente) {
  const curva = [];
  for (let f = 0; f <= 1.0001; f += 0.02) curva.push(b.frente(f));
  const poly = [...curva.map(([x, y]) => P([x, y, Z0])), ...[...curva].reverse().map(([x, y]) => P([x, y, Z1]))];
  if (Math.abs(area(poly)) < 1) return "";
  const partes = [`<polygon points="${pontos(poly)}" fill="${COR_CORTE}"/>`];
  const dentro = [];
  // Luz: a normal média da borda (para fora e para cima).
  const [xa, ya] = b.frente(0);
  const [xb, yb] = b.frente(1);
  const tg = normal([xb - xa, yb - ya, 0]);
  let nrm = [tg[1], -tg[0], 0];
  if (nrm[1] < 0) nrm = mul(nrm, -1);
  // Tom artístico, preso entre 0,84 e 1,02: a luz grande envolve o corte (nunca fica cinza chapado).
  const lam = limitar((brilho(nrm) / B_PLANO) * 0.97, 0.84, 1.02);
  if (lam < 1) dentro.push(`<rect width="${LARGURA}" height="${ALTURA}" fill="#000" fill-opacity="${n((1 - lam) * 1000) / 1000}"/>`);
  else dentro.push(`<rect width="${LARGURA}" height="${ALTURA}" fill="#fff" fill-opacity="${n((lam - 1) * 600) / 1000}"/>`);
  // Mais escuro embaixo (perto da tábua).
  const g = gradLinear(P([xa, ya, 0]), P([xb, yb, 0]), [
    [0, "#000", 0],
    [0.75, "#000", 0.04],
    [1, "#000", 0.14],
  ]);
  dentro.push(`<rect width="${LARGURA}" height="${ALTURA}" fill="url(#${g})"/>`);
  const rnd = aleatorio(semente);
  const quantas = Math.round(b.t * 0.9);
  for (let i = 1; i < quantas; i++) {
    const f = limitar((i + (rnd() - 0.5) * 0.7) / quantas, 0, 1);
    const [x, y] = b.frente(f);
    const p0 = P([x, y, Z0]);
    const p1 = P([x, y, Z1]);
    const op = 0.05 + rnd() * 0.11 + (i % 16 === 0 ? 0.07 : 0);
    dentro.push(`<line x1="${n(p0[0])}" y1="${n(p0[1])}" x2="${n(p1[0])}" y2="${n(p1[1])}" stroke="#3a2c1c" stroke-opacity="${n(op * 1000) / 1000}" stroke-width="${n(0.3 + rnd() * 0.4)}"/>`);
  }
  const grao = filtroGrao(pr, { base: 1.1, oitavas: 2, alfa: 0.1, semente: semente + 5 });
  dentro.push(`<rect width="${LARGURA}" height="${ALTURA}" filter="url(#${grao})"/>`);
  partes.push(`<g clip-path="url(#${recorte(poly)})">${dentro.join("")}</g>`);
  return partes.join("");
}

// ---------- 5. as páginas ----------

/** A luz de uma página no arco s (a partir da dobra) e na altura z: o Lambert da curva, a oclusão da calha e a queda da luz. */
function luzDaPagina(b, s, z) {
  const [x, y] = b.topo.em(s);
  const oc = b.lado < 0 ? 1 - 0.46 * Math.exp(-s / 22) - 0.16 * Math.exp(-s / 80) : 1 - 0.34 * Math.exp(-s / 16) - 0.1 * Math.exp(-s / 70);
  return (brilho(normalPagina(b, s)) / B_PLANO) * oc * queda([x, y, z]);
}

// Células: mais finas perto da dobra, onde a página curva.
const usEsq = [0, 40, 90, 140, 190, 240, 290, 340, 380, 404, 422, 436, 447, 455, 461, 465, 468];
const usDir = [0, 3, 7, 12, 18, 25, 33, 42, 52, 63, 75, 88, 102, 117, 133, 150, 170, 194, 222, 256, 300, 350, 410, 468];
const vsPag = [];
for (let k = 0; k <= 13; k++) vsPag.push((PG_H * k) / 13);

pr.add(frenteDoBloco(ESQ, 21));
pr.add(peDoBloco(ESQ, 31));
pr.add(mapear({ Pp: paginaEsq, us: usEsq, vs: vsPag, papel: PAPEL_MIOLO, pecas: PECAS.sumario, luz: (u, v) => luzDaPagina(ESQ, PG_W - u, Z0 + v) }));
const contornoEsq = contornoDe(paginaEsq, PG_W, PG_H);

pr.add(frenteDoBloco(DIR, 41));
pr.add(peDoBloco(DIR, 51));
pr.add(mapear({ Pp: paginaDir, us: usDir, vs: vsPag, papel: PAPEL_MIOLO, pecas: PECAS.artigo, luz: (u, v) => luzDaPagina(DIR, u, Z0 + v) }));
const contornoDir = contornoDe(paginaDir, PG_W, PG_H);

// Grão do papel nas duas páginas.
{
  const grao = filtroGrao(pr, { base: 0.85, oitavas: 2, alfa: 0.065, semente: 3 });
  for (const c of [contornoEsq, contornoDir]) pr.add(`<g clip-path="url(#${recorte(c)})"><rect width="${LARGURA}" height="${ALTURA}" filter="url(#${grao})"/></g>`);
}

// ---------- 6. a folha que vira ----------

// Malha da folha em (s, z).
const ssFolha = [];
for (let k = 0; k <= 44; k++) ssFolha.push((PG_W * k) / 44);
const zsFolha = [];
for (let k = 0; k <= 16; k++) zsFolha.push(Z0 + (PG_H * k) / 16);

/** A normal da frente (a página v) da folha em (s, z). */
function normalFolha(s, z) {
  const a = folhaP(Math.max(0, s - 0.8), z);
  const b = folhaP(Math.min(PG_W, s + 0.8), z);
  const c = folhaP(s, Math.max(Z0, z - 2));
  const d = folhaP(s, Math.min(Z1, z + 2));
  return normal(cross(sub(d, c), sub(b, a)));
}

/** λ da folha num vértice, pelo lado que o observador vê (normal N desse lado). */
function luzDaFolha(p, N) {
  const atravessa = difusa(-dot(N, LUZ)); // a luz que bate do outro lado e atravessa o papel
  let l = brilho(N) + K.trans * atravessa;
  l *= 1 - 0.4 * Math.exp(-(p[1] - Y_CALHA) / 30); // oclusão perto da calha (a folha nasce entre as páginas)
  return (l / B_PLANO) * queda(p);
}

const trisFolha = [];
{
  const vert = new Map();
  const vertice = (i, j) => {
    const k = `${i}|${j}`;
    if (!vert.has(k)) {
      const s = ssFolha[i];
      const z = zsFolha[j];
      const p = folhaP(s, z);
      vert.set(k, { s, z, p, t: P(p), N: normalFolha(s, z) });
    }
    return vert.get(k);
  };
  for (let j = 0; j < zsFolha.length - 1; j++)
    for (let i = 0; i < ssFolha.length - 1; i++) {
      const q = [vertice(i, j), vertice(i + 1, j), vertice(i + 1, j + 1), vertice(i, j + 1)];
      for (const idx of [
        [0, 1, 2],
        [0, 2, 3],
      ]) {
        const vs = idx.map((k) => q[k]);
        const centro = mul(soma(soma(vs[0].p, vs[1].p), vs[2].p), 1 / 3);
        const Nc = normal(soma(soma(vs[0].N, vs[1].N), vs[2].N));
        const frente = dot(Nc, sub(OLHO_LIVRO, centro)) > 0; // vemos a página v (a frente)?
        const lams = vs.map((v) => luzDaFolha(v.p, frente ? v.N : mul(v.N, -1)));
        trisFolha.push({ vs, lams, frente, prof: profundidade(centro), tela: vs.map((v) => v.t) });
      }
    }
  trisFolha.sort((a, b) => b.prof - a.prof);
}

// Conferência: quanto a folha cobre das linhas do sumário (deve ser 0) e a menor altura dela sobre a página.
{
  const dentro = ([x, y], [a, b, c]) => {
    const d = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
    const d1 = d([x, y], a, b);
    const d2 = d([x, y], b, c);
    const d3 = d([x, y], c, a);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  };
  const msgs = PECAS.info.itens.map(({ y, fim, x0, x1 }, k) => {
    let tot = 0;
    let cob = 0;
    for (let u = x0; u <= x1; u += 6)
      for (const v of [y - 9, y - 3, y + 1, ...(fim > y ? [fim - 8, fim] : [])]) {
        tot++;
        const q = P(paginaEsq(u, v));
        if (trisFolha.some((t) => dentro(q, t.tela))) cob++;
      }
    return `${k + 1}: ${Math.round((100 * cob) / tot)}%`;
  });
  let yMin = Infinity;
  for (const t of trisFolha) for (const v of t.vs) if (v.p[0] < -40) yMin = Math.min(yMin, v.p[1]);
  console.log(`cobertura do sumário pela folha: ${msgs.join(", ")}; menor altura da folha sobre a página: ${yMin.toFixed(0)}`);
}

/** A altura da superfície de cima (as duas páginas) em x, para a sombra da folha cair nela. */
function alturaDaPagina(x) {
  const b = x >= 0 ? DIR : ESQ;
  if (b.lado * x >= b.lado * b.topo.em(PG_W)[0]) return TABUA; // fora do miolo: a tábua
  let a = 0;
  let c = PG_W;
  for (let k = 0; k < 40; k++) {
    const m = (a + c) / 2;
    if (b.lado * b.topo.em(m)[0] < b.lado * x) a = m;
    else c = m;
  }
  return b.topo.em(a)[1];
}
/** Leva um ponto da folha pela direção da luz até a página de baixo; devolve o ponto e a distância. */
function sombraNaPagina(p) {
  let t0 = 0;
  let t1 = 0;
  for (let k = 0; k < 400; k++) {
    t1 = t0 + 4;
    const q = sub(p, mul(LUZ, t1));
    if (q[1] <= alturaDaPagina(q[0])) break;
    t0 = t1;
  }
  for (let k = 0; k < 24; k++) {
    const m = (t0 + t1) / 2;
    const q = sub(p, mul(LUZ, m));
    if (q[1] <= alturaDaPagina(q[0])) t1 = m;
    else t0 = m;
  }
  return { q: sub(p, mul(LUZ, t1)), t: t1 };
}

// A sombra da folha nas páginas: três camadas (longe, meia e contato), cada uma a união dos
// triângulos projetados, desfocada; as camadas somam perto da raiz, onde a sombra é mais funda.
{
  const proj = new Map();
  const sp = (v) => {
    const k = `${v.s}|${v.z}`;
    if (!proj.has(k)) proj.set(k, sombraNaPagina(v.p));
    return proj.get(k);
  };
  const camadas = [
    { max: Infinity, desvio: 22, op: 0.16 },
    { max: 170, desvio: 9, op: 0.13 },
    { max: 55, desvio: 3, op: 0.14 },
  ];
  const paginas = recorteCaminho(`${caminho(contornoEsq)}${caminho(contornoDir)}`);
  const saida = [];
  for (const c of camadas) {
    const polys = [];
    for (const t of trisFolha) {
      const ss = t.vs.map(sp);
      if (Math.max(...ss.map((x) => x.t)) > c.max) continue;
      polys.push(`<polygon points="${pontos(alargar(ss.map((x) => P(x.q)), 0.6))}"/>`);
    }
    saida.push(`<g filter="url(#${desfoque(c.desvio)})" opacity="${c.op}" fill="#000">${polys.join("")}</g>`);
  }
  pr.add(`<g clip-path="url(#${paginas})">${saida.join("")}</g>`);
}

// A folha: triângulos opacos do fundo para a frente, com o papel já iluminado.
const PAPEL_RGB = hex(PAPEL_MIOLO);
const corDoPapel = (l) => (l <= 1 ? paraHex(PAPEL_RGB.map((c) => c * l)) : paraHex(PAPEL_RGB.map((c) => c + (255 - c) * Math.min(1, (l - 1) * 0.9))));

// A epígrafe espelhada (o verso vi mostra, contra a luz, o que está impresso na frente v).
const idEpigrafe = pr.id("epigrafe");
{
  const desf = pr.id("f");
  pr.def(`<filter id="${desf}" x="-0.1" y="-0.5" width="1.2" height="2"><feGaussianBlur stdDeviation="0.5"/></filter>`);
  pr.def(`<g id="${idEpigrafe}"><g transform="translate(${PG_W} 0) scale(-1 1)" filter="url(#${desf})" opacity="0.11">${PECAS.epigrafe.map((p) => p.svg).join("")}</g></g>`);
}
const caixaEpigrafe = (() => {
  const [a, b, c, d] = PECAS.epigrafe[0]?.caixa ?? [0, 0, 1, 1];
  return [PG_W - c, b, PG_W - a, d]; // espelhada
})();

{
  const partes = [];
  const corPapel = (v, parada) => (parada ? `stop-color="${corDoPapel(v)}"` : corDoPapel(v));
  for (const t of trisFolha) {
    if (Math.abs(area(t.tela)) < 0.01) continue;
    partes.push(`<polygon points="${pontos(alargar(t.tela, 0.45))}" ${gradienteTriangulo(t.tela, t.lams, corPapel, [1])}/>`);
    // A epígrafe aparece de leve no verso (o lado em branco), onde ela cai.
    if (!t.frente) {
      const uv = t.vs.map((v) => [PG_W - v.s, v.z - Z0]);
      const [a, b, c, d] = caixaEpigrafe;
      const us = uv.map((q) => q[0]);
      const vs = uv.map((q) => q[1]);
      if (Math.max(...us) >= a && Math.min(...us) <= c && Math.max(...vs) >= b && Math.min(...vs) <= d) {
        const m = afim(uv, t.tela);
        partes.push(`<g clip-path="url(#${recorte(t.tela)})"><use href="#${idEpigrafe}" transform="${matriz(m)}"/></g>`);
      }
    }
  }
  pr.add(partes.join(""));
  // Grão do papel na folha.
  const idF = pr.id("r");
  pr.def(`<clipPath id="${idF}">${trisFolha.map((t) => `<polygon points="${pontos(alargar(t.tela, 0.3))}"/>`).join("")}</clipPath>`);
  const grao = filtroGrao(pr, { base: 0.85, oitavas: 2, alfa: 0.06, semente: 9 });
  pr.add(`<g clip-path="url(#${idF})"><rect width="${LARGURA}" height="${ALTURA}" filter="url(#${grao})"/></g>`);
  // O fio da borda livre e do pé da folha (a quina do papel).
  const borda = [];
  for (let z = Z0; z <= Z1 + 0.01; z += 12) borda.push(P(folhaP(PG_W, z)));
  pr.add(`<path d="${caminho(borda, false)}" fill="none" stroke="#3a2c1c" stroke-opacity="0.12" stroke-width="0.5"/>`);
  const pe = [];
  for (let s = 0; s <= PG_W + 0.01; s += 6) pe.push(P(folhaP(s, Z1)));
  pr.add(`<path d="${caminho(pe, false)}" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="0.7"/>`);
}

const saida = fileURLToPath(new URL(process.env.SAIDA ?? "./p06-folheando.svg", import.meta.url));
pr.salvar(saida);
console.log("✓", saida, `(${PECAS.info.linhasTitulo.length} linhas no título; parágrafo em ${PECAS.info.linhas} linhas, corpo ${PECAS.info.corpo}; lista até v=${Math.round(PECAS.info.fimLista)})`);
