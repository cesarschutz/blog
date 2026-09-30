#!/usr/bin/env node
/**
 * Prancha 10 · "Luz de janela": o livro SRE sob o sol baixo de fim de tarde, que entra por uma
 * janela à esquerda (fora do quadro). Uma direção de arte para o livro 3D do site.
 *
 *   fnm exec --using=24 node pranchas/p10-luz-de-janela.mjs  →  pranchas/p10-luz-de-janela.svg
 *
 * Tudo sai de uma cena 3D coerente (unidades da referência: capa 480 × 720, 1 u ≈ 0,32 mm):
 *
 * - O sol é uma luz direcional, baixa, da esquerda e um pouco de frente: bate quase de chapa na
 *   lombada e rasante na capa (uns 12°). A janela é um retângulo 3D com caixilhos (peitoril, verga,
 *   ombreiras, um montante e uma travessa). A mancha de sol em cada superfície (chão, capa, lombada)
 *   é a projeção exata dos vidros ao longo do raio de sol: a sombra de cada barra sai do chão e sobe
 *   no livro sem descontinuidade, dobrando na quina.
 * - Meia-sombra: o disco do sol (0,53°) projetado em cada plano é uma elipse, esticada na direção
 *   em que a luz rasante anda; o desfoque de cada borda segue essa elipse (curto e nítido). Na
 *   sombra do livro no chão, a elipse cresce com a distância até a aresta que faz a sombra: nítida
 *   no pé do livro, um pouco mais macia na ponta.
 * - Fora do sol, o livro fica só na luz do céu: uma camada escura, puxando de leve para o frio,
 *   translúcida. No sol, uma camada quente (branco-âmbar), translúcida, proporcional ao quanto a
 *   face encara o sol. As cores da capa e da lombada são as da base; luz e sombra só entram por cima.
 * - A luz rasante revela o grão do papel (relevo por feDiffuseLighting, só dentro da mancha de sol)
 *   e o vinco da dobradiça (a parede que encara o sol clareia; o fundo do vinco escurece).
 * - Fundo transparente: no chão, só a mancha de sol (camada âmbar translúcida, que no escuro vira um
 *   brilho quente), a sombra do livro e as sombras de contato.
 */
import { fileURLToPath } from "node:url";
import { capa, lombada, livro } from "../base/base.mjs";
import {
  Prancha, camera, enquadrar, superficie, girarY, soma, sub, mul, dot, cross, normal, aleatorio,
  linhasDasFolhas, pontos, caminho, gradiente, filtroGrao, contorno, n, grau, limitar,
} from "../ferramentas/cena.mjs";

// ---------- o livro ----------

const L = livro(process.env.LIVRO ?? "sre");
const W = 480; // largura da capa
const H = 720; // altura
const T = L.largura; // espessura (a largura da lombada): 126
const PAPELAO = 8; // espessura do papelão da capa
const SEIXA = 9; // quanto a capa passa do miolo no alto, no pé e na frente
const BOJO = T * 0.15; // saliência da lombada arredondada
const VINCO = 22; // o vinco da dobradiça, a partir da lombada
const DIVISAO = 300; // onde o papel da capa encontra a cor do livro (arte)
const MIOLO = "#f2e6cc"; // o creme do corte das folhas (um tom mais quente que o papel da capa)

// ---------- a cena ----------

const LARG = 1200;
const ALT = 1000;
const GIRO = 36; // o livro gira no eixo vertical: a lombada vem para o observador (como no site)
const SOL = { elevacao: 29, azimute: 50 }; // graus; o azimute vai de -X (esquerda) para +Z (observador)
const CAM = { elevacao: 17, azimute: -6, distancia: 5200 }; // teleobjetiva, levemente acima
const RAIO_SOL = grau(0.267); // raio angular do disco do sol

/**
 * A janela, em coordenadas do raio de sol que passa pelo pé da junta lombada-capa (B0): `b` é a
 * altura em que o caixilho corta o livro nessa junta (no chão, a mancha vai até b / tan(elevação)
 * além dela); `a` é a posição lateral vista do sol (a lombada ocupa a de -127 a 0; a capa, de 0 a
 * 120). `distancia` é quanto a janela está do livro (só muda a meia-sombra); `giro` é o quanto a
 * parede foge de ficar de frente para o sol (inclina a mancha no chão).
 */
const JANELA = {
  distancia: 950,
  giro: 15,
  peitoril: -110,
  travessa: [250, 292],
  verga: 700,
  ombreiras: [-215, 285],
  montante: [86, 110],
};

// Cores da luz (as do livro não mudam).
const SOL_COR = "#ffd8a0"; // branco-âmbar do sol baixo
const SOL_CHAO = "#ffb964"; // a mancha no chão, mais âmbar (para aparecer no branco)
const SOMBRA_COR = "#111b2c"; // a sombra: escura, puxando de leve para o frio
const CEU = normal([-0.55, 0.75, 0.38]); // a luz do céu que entra pela mesma janela (difusa)

// ---------- vetores da cena ----------

const CENTRO = [W / 2, 0, 0];
const M = (p) => girarY(p, GIRO, CENTRO); // local do livro → mundo
const Md = (v) => girarY(v, GIRO); // direções
const eS = grau(SOL.elevacao);
const aS = grau(SOL.azimute);
const s = normal([-Math.cos(eS) * Math.cos(aS), Math.sin(eS), Math.cos(eS) * Math.sin(aS)]); // para o sol
const ds = normal([-s[0], 0, -s[2]]); // para onde a luz anda, no chão

// Lombada arredondada: o arco passa por z = ±T/2 em x = 0 e sai BOJO para fora (u = 0 na
// contracapa, u = T na capa). `recuo` dá arcos concêntricos por dentro (cobertura, miolo).
const xc = (T * T / 4 - BOJO * BOJO) / (2 * BOJO);
const R = xc + BOJO;
const PHI = Math.asin(T / 2 / R);
const arco = (u, recuo = 0) => {
  const th = Math.PI + PHI - 2 * PHI * (u / T);
  return [xc + (R - recuo) * Math.cos(th), (R - recuo) * Math.sin(th)];
};
const lombP = (u, v) => {
  const [x, z] = arco(u);
  return M([x, H - v, z]);
};
const capaP = (u, v) => M([u, H - v, T / 2]);

// ---------- a janela e a projeção da luz ----------

const B0 = M([0, 0, T / 2]);
const Nw = girarY(ds, JANELA.giro); // a normal da parede, para dentro da sala
const Uw = normal(cross(Nw, [0, 1, 0])); // o eixo a (horizontal na janela)
const Ow = soma(B0, mul(s, JANELA.distancia));
/** Onde o raio de sol que passa por X atravessa a janela: [a, b, distância até ela]. */
const naJanela = (X) => {
  const t = dot(sub(Ow, X), Nw) / dot(s, Nw);
  const d = sub(soma(X, mul(s, t)), Ow);
  return [dot(d, Uw), d[1], t];
};
const daJanela = (a, b) => soma(Ow, soma(mul(Uw, a), [0, b, 0]));
/** Leva um ponto, ao longo do raio de sol, até o plano (Q, m). */
const noPlano = (X, Q, m) => sub(X, mul(s, dot(sub(X, Q), m) / dot(s, m)));
const CHAO = [[0, 0, 0], [0, 1, 0]];

const [o0, o1] = JANELA.ombreiras;
const [m0, m1] = JANELA.montante;
const [t0, t1] = JANELA.travessa;
const VIDROS = [
  [o0, m0, JANELA.peitoril, t0],
  [m1, o1, JANELA.peitoril, t0],
  [o0, m0, t1, JANELA.verga],
  [m1, o1, t1, JANELA.verga],
];

// ---------- câmera ----------

const alvo = M([W / 2, H * 0.4, 0]);
const ce = grau(CAM.elevacao);
const ca = grau(CAM.azimute);
const olho = soma(alvo, mul([Math.sin(ca) * Math.cos(ce), Math.sin(ce), Math.cos(ca) * Math.cos(ce)], CAM.distancia));
const cam = camera({ olho, alvo, focal: 1000, centro: [LARG / 2, ALT / 2] });

const cantos = [];
for (const x of [-BOJO, W]) for (const y of [0, H]) for (const z of [-T / 2, T / 2]) cantos.push(M([x, y, z]));
const manchaNoChao = VIDROS.flatMap(([a0, a1, b0, b1]) => [[a0, b0], [a1, b0], [a1, b1], [a0, b1]].map(([a, b]) => noPlano(daJanela(a, b), ...CHAO)));
enquadrar(cam, [...cantos, ...manchaNoChao], [60, 70, 1080, 860]);
{
  const caixa = (ps) => {
    const q = ps.map((p) => cam.p(p));
    return [Math.min(...q.map((a) => a[0])), Math.min(...q.map((a) => a[1])), Math.max(...q.map((a) => a[0])), Math.max(...q.map((a) => a[1]))].map(Math.round);
  };
  console.log("livro na tela:", caixa(cantos), " mancha:", caixa(manchaNoChao));
}

// ---------- auxiliares ----------

/** Casco convexo (Andrew) de pontos da tela. */
function casco(ps) {
  const p = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const meia = (lista) => {
    const h = [];
    for (const q of lista) {
      while (h.length >= 2 && cr(h[h.length - 2], h[h.length - 1], q) <= 0) h.pop();
      h.push(q);
    }
    return h;
  };
  const baixo = meia(p);
  const cima = meia([...p].reverse());
  return baixo.slice(0, -1).concat(cima.slice(0, -1));
}

/** Um vetor do mundo, em X0, levado para a tela (px por unidade). */
const naTela = (X0, v, d = 4) => {
  const a = cam.p(X0);
  const b = cam.p(soma(X0, mul(normal(v), d)));
  return [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
};

/**
 * A elipse da meia-sombra na tela: o disco do sol visto de uma borda a `dist` unidades, projetado no
 * plano de normal `m` (esticado 1 / cos da incidência na direção em que a luz anda) e levado para a
 * tela em X0. Devolve o desfoque gaussiano orientado { theta, s1, s2 } (px).
 */
function elipse(X0, m, dist, minimo = 0.45) {
  const r = 0.45 * dist * Math.tan(RAIO_SOL); // desvio do gaussiano ≈ metade do raio do disco projetado
  const incid = Math.max(Math.abs(dot(s, m)), 0.12);
  const l = normal(sub(mul(m, dot(s, m)), s)); // a direção em que a luz anda no plano
  const p = normal(cross(m, l));
  const jl = naTela(X0, l);
  const jp = naTela(X0, p);
  const sl = r / incid;
  const sp = r;
  const A = sl * sl * jl[0] * jl[0] + sp * sp * jp[0] * jp[0];
  const B = sl * sl * jl[0] * jl[1] + sp * sp * jp[0] * jp[1];
  const D = sl * sl * jl[1] * jl[1] + sp * sp * jp[1] * jp[1];
  const theta = 0.5 * Math.atan2(2 * B, A - D);
  const med = (A + D) / 2;
  const raio = Math.sqrt(((A - D) / 2) ** 2 + B * B);
  return { theta, s1: Math.max(Math.sqrt(med + raio), minimo), s2: Math.max(Math.sqrt(Math.max(med - raio, 0)), minimo) };
}

/**
 * Polígonos desfocados por uma elipse orientada: um <g> girado de theta, com o desfoque gaussiano
 * (s1 ao longo do eixo girado, s2 perpendicular) calculado no espaço girado.
 */
function desfocado(pr, poligonos, { theta, s1, s2 }, cor = "#fff", opacidade = 1) {
  const c = Math.cos(theta);
  const sn = Math.sin(theta);
  const local = ([x, y]) => [x * c + y * sn, -x * sn + y * c];
  const locais = poligonos.map((ps) => ps.map(local));
  const xs = locais.flat().map((q) => q[0]);
  const ys = locais.flat().map((q) => q[1]);
  const mg = 3.2 * Math.max(s1, s2) + 2;
  const id = pr.id("penumbra");
  pr.def(
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="${n(Math.min(...xs) - mg)}" y="${n(Math.min(...ys) - mg)}" width="${n(Math.max(...xs) - Math.min(...xs) + 2 * mg)}" height="${n(Math.max(...ys) - Math.min(...ys) + 2 * mg)}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${n(s1)} ${n(s2)}"/></filter>`,
  );
  const op = opacidade < 1 ? ` fill-opacity="${n(opacidade * 1000) / 1000}"` : "";
  return `<g transform="rotate(${n((theta * 180) / Math.PI)})"><g filter="url(#${id})">${locais.map((ps) => `<polygon points="${pontos(ps)}" fill="${cor}"${op}/>`).join("")}</g></g>`;
}

function mascara(pr, conteudo) {
  const id = pr.id("mascara");
  pr.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="-50" y="-50" width="${LARG + 100}" height="${ALT + 100}">${conteudo}</mask>`);
  return id;
}
const TUDO = `<rect x="-50" y="-50" width="${LARG + 100}" height="${ALT + 100}" fill="#fff"/>`;

function recorte(pr, ps) {
  const id = pr.id("recorte");
  pr.def(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><path d="${caminho(ps)}"/></clipPath>`);
  return id;
}

function desfoque(pr, sx, sy = sx, margem = 0.4) {
  const id = pr.id("desfoque");
  pr.def(`<filter id="${id}" x="-${margem}" y="-${margem}" width="${1 + 2 * margem}" height="${1 + 2 * margem}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${n(sx)} ${n(sy)}"/></filter>`);
  return id;
}

const op = (x) => n(limitar(x) * 1000) / 1000;

/** Os vidros projetados num plano (Q, m), na tela. */
const vidrosNoPlano = (Q, m) =>
  VIDROS.map(([a0, a1, b0, b1]) => [[a0, b0], [a1, b0], [a1, b1], [a0, b1]].map(([a, b]) => cam.p(noPlano(daJanela(a, b), Q, m))));

/**
 * Os vidros numa superfície vertical curva (a lombada): para cada u, a posição a na janela não
 * depende da altura, e b cresce com ela um para um. Devolve os polígonos na tela (um pouco além das
 * bordas da superfície, para o desfoque não apagar a luz na silhueta).
 */
function vidrosNaLombada(passos = 160) {
  const info = [];
  for (let i = -8; i <= passos + 8; i++) {
    const u = (T * i) / passos;
    const [x, z] = arco(u);
    const [a, b] = naJanela(M([x, 0, z]));
    info.push({ u, x, z, a, b });
  }
  const polys = [];
  for (const [a0, a1, b0, b1] of VIDROS) {
    const trecho = info.filter((q) => q.a >= a0 && q.a <= a1);
    if (trecho.length < 2) continue;
    const cima = trecho.map((q) => cam.p(M([q.x, limitar(b1 - q.b, -80, H + 80), q.z])));
    const baixo = trecho.map((q) => cam.p(M([q.x, limitar(b0 - q.b, -80, H + 80), q.z]))).reverse();
    polys.push([...cima, ...baixo]);
  }
  return polys;
}

/**
 * Um gradiente ao longo de u numa superfície cuja normal só muda com u (lombada, face plana).
 * Diferente do gradiente linear comum (linhas de mesmo tom perpendiculares ao eixo), este é oblíquo:
 * as linhas de mesmo tom seguem as verticais da superfície na tela (que a câmera, olhando de cima,
 * inclina). Numa face alta e estreita como a lombada, o gradiente comum escorregaria na altura e
 * desenharia uma diagonal falsa.
 */
function camadaAoLongoDeU(pr, { P, w, h, cor, opacidade, amostras = 40, vRef }) {
  const v = vRef ?? h / 2;
  const O = cam.p(P(0, v));
  const fim = cam.p(P(w, v));
  const X = [fim[0] - O[0], fim[1] - O[1]];
  const cima = cam.p(P(w / 2, 0));
  const baixo = cam.p(P(w / 2, h));
  const lv = Math.hypot(baixo[0] - cima[0], baixo[1] - cima[1]) || 1;
  const Y = [((baixo[0] - cima[0]) / lv) * 100, ((baixo[1] - cima[1]) / lv) * 100];
  const det = X[0] * Y[1] - X[1] * Y[0];
  const paradas = [];
  for (let i = 0; i <= amostras; i++) {
    const u = (w * i) / amostras;
    const u0 = Math.max(0, u - w / 400);
    const u1 = Math.min(w, u + w / 400);
    const nrm = normal(cross(sub(P(u1, v), P(u0, v)), sub(P(u, Math.max(0, v - 2)), P(u, Math.min(h, v + 2)))));
    const q = cam.p(P(u, v));
    const t = limitar(((q[0] - O[0]) * Y[1] - (q[1] - O[1]) * Y[0]) / det);
    paradas.push([n(t * 10000) / 10000, cor, op(opacidade(nrm, P(u, v), u))]);
  }
  paradas.sort((x, y) => x[0] - y[0]);
  const id = pr.id("obliquo");
  const m = [X[0], X[1], Y[0], Y[1], O[0], O[1]].map((x) => Math.round(x * 1000) / 1000).join(" ");
  pr.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0" gradientTransform="matrix(${m})">${paradas.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`,
  );
  return `<path d="${caminho(contorno(cam, P, w, h))}" fill="url(#${id})"/>`;
}

/** Um gradiente ao longo da altura de uma face (v), com as linhas de mesmo tom nas horizontais dela. */
function camadaAoLongoDeV(pr, { P, w, h, contornoTela, paradas }) {
  const O = cam.p(P(w / 2, h)); // o pé
  const topo = cam.p(P(w / 2, 0));
  const Y = [topo[0] - O[0], topo[1] - O[1]]; // do pé ao alto
  const esq = cam.p(P(0, h));
  const dir = cam.p(P(w, h));
  const lx = Math.hypot(dir[0] - esq[0], dir[1] - esq[1]) || 1;
  const X = [((dir[0] - esq[0]) / lx) * 100, ((dir[1] - esq[1]) / lx) * 100];
  const id = pr.id("obliquo");
  const m = [Y[0], Y[1], X[0], X[1], O[0], O[1]].map((x) => Math.round(x * 1000) / 1000).join(" ");
  pr.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0" gradientTransform="matrix(${m})">${paradas.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`,
  );
  return `<path d="${caminho(contornoTela)}" fill="url(#${id})"/>`;
}

/**
 * Relevo à luz rasante: o grão do papel como um mapa de altura (feTurbulence), iluminado de lado
 * (feDiffuseLighting) e reduzido só à variação em torno do plano: claro onde a fibra encara o sol,
 * escuro do outro lado. Devolve o id do filtro (para um <rect> recortado pela face).
 */
function filtroRelevo(pr, { azimute, elevacao, base = 0.75, relevo = 1.2, forca = 1.1, semente = 11 }) {
  const id = pr.id("relevo");
  const plano = Math.sin(grau(elevacao));
  const k = forca;
  pr.def(
    `<filter id="${id}" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB">` +
      `<feTurbulence type="fractalNoise" baseFrequency="${base}" numOctaves="3" seed="${semente}" result="ruido"/>` +
      `<feDiffuseLighting in="ruido" surfaceScale="${relevo}" diffuseConstant="1" lighting-color="#fff" result="luz"><feDistantLight azimuth="${n(azimute)}" elevation="${n(elevacao)}"/></feDiffuseLighting>` +
      `<feColorMatrix in="luz" values="0 0 0 0 1  0 0 0 0 0.93  0 0 0 0 0.8  ${n(k)} 0 0 0 ${n(-k * plano)}" result="claro"/>` +
      `<feColorMatrix in="luz" values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.06  ${n(-k)} 0 0 0 ${n(k * plano)}" result="escuro"/>` +
      `<feMerge><feMergeNode in="escuro"/><feMergeNode in="claro"/></feMerge></filter>`,
  );
  return id;
}

/** Uma linha 3D (lista de pontos) como caminho na tela. */
const traco = (ps) => caminho(ps.map((p) => cam.p(p)), false);

// ---------- a prancha ----------

const pr = new Prancha({
  prefixo: "p10",
  largura: LARG,
  altura: ALT,
  titulo: "Luz de janela",
  descricao:
    "O livro SRE em pé, sob o sol baixo de fim de tarde que entra por uma janela à esquerda: a mancha de luz cortada pelos caixilhos cai em diagonal sobre a capa e a lombada e continua no chão, onde o livro deixa uma sombra longa.",
});
const artCapa = pr.simbolo(capa(L.slug), { largura: W, altura: H, nome: "capa" });
const artLomb = pr.simbolo(lombada(L.slug), { largura: T, altura: H, nome: "lombada" });
const grao = filtroGrao(pr, { base: 0.85, oitavas: 2, alfa: 0.11, semente: 3 });

// ================= o chão =================

// A planta do livro (x, z locais): a lombada em arco, a frente e a trás das capas, a borda da frente.
const planta = [];
for (let i = 0; i <= 20; i++) planta.push(arco((T * i) / 20));
planta.push([W - 3, T / 2], [W, T / 2 - 3], [W, -T / 2 + 3], [W - 3, -T / 2]);
const pegada = planta.map(([x, z]) => cam.p(M([x, 0, z])));

/** A sombra de uma fatia horizontal do livro (de y0 a y1) no chão, na tela. */
const sombraDaFatia = (y0, y1) => {
  const ps = [];
  for (const [x, z] of planta) for (const y of [y0, y1]) ps.push(cam.p(noPlano(M([x, y, z]), ...CHAO)));
  return casco(ps);
};
const sombraToda = sombraDaFatia(0, H);
const pontaDaSombra = cam.p(noPlano(M([W / 2, H, 0]), ...CHAO));
const peDaSombra = cam.p(M([W * 0.6, 0, 0]));

// 1. A luz do céu entra pela mesma janela: o livro também a tapa, e deixa no chão uma sombra larga e
//    macia na mesma direção, mais escura junto ao pé. É ela que faz a sombra ler no fundo claro.
{
  const g = gradiente(pr, peDaSombra, pontaDaSombra, [[0, SOMBRA_COR, 0.16], [0.3, SOMBRA_COR, 0.09], [0.65, SOMBRA_COR, 0.035], [1, SOMBRA_COR, 0]]);
  pr.add(`<path d="${caminho(sombraToda)}" fill="url(#${g})" filter="url(#${desfoque(pr, 12, 7)})"/>`);
}

// 2. A mancha de sol no chão: os vidros projetados, menos a sombra do livro (em fatias, cada uma com
//    a meia-sombra da sua altura: nítida no pé, mais macia na ponta).
const partesDoChao = (() => {
  const X0 = noPlano(daJanela((o0 + o1) / 2, 200), ...CHAO);
  const luz = desfocado(pr, vidrosNoPlano(...CHAO), elipse(X0, [0, 1, 0], JANELA.distancia + 250));
  const pretas = [];
  const brancas = [];
  const fatias = 12;
  for (let i = 0; i < fatias; i++) {
    const y0 = (H * i) / fatias;
    const y1 = (H * (i + 1)) / fatias;
    const ym = (y0 + y1) / 2;
    const Xc = noPlano(M([W / 2, ym, 0]), ...CHAO);
    const fatia = [sombraDaFatia(Math.max(0, y0 - 22), Math.min(H, y1 + 22))];
    const el = elipse(Xc, [0, 1, 0], ym / Math.sin(eS), 0.35);
    pretas.push(desfocado(pr, fatia, el, "#000"));
    brancas.push(desfocado(pr, fatia, el, "#fff"));
  }
  return { luz, pretas: pretas.join(""), brancas: brancas.join("") };
})();
const mascChao = mascara(pr, partesDoChao.luz + partesDoChao.pretas);
// A janela inteira (com os caixilhos) no chão: a luz do céu passa em volta das barras finas, então a
// sombra que o livro faz nela ocupa o vão todo da janela.
const mascVidrosChao = (() => {
  const vao = [[o0, JANELA.peitoril], [o1, JANELA.peitoril], [o1, JANELA.verga], [o0, JANELA.verga]].map(([a, b]) => cam.p(noPlano(daJanela(a, b), ...CHAO)));
  const X0 = noPlano(daJanela((o0 + o1) / 2, 200), ...CHAO);
  return mascara(pr, desfocado(pr, [vao], elipse(X0, [0, 1, 0], JANELA.distancia + 250)));
})();
const mascSombraLivro = mascara(pr, partesDoChao.brancas);
// O brilho da mancha: a luz que o chão espalha em volta (quase invisível no claro; no escuro, um halo quente).
pr.add(`<g filter="url(#${desfoque(pr, 14, 10, 0.3)})"><rect x="0" y="0" width="${LARG}" height="${ALT}" fill="${SOL_CHAO}" fill-opacity="0.1" mask="url(#${mascChao})"/></g>`);
pr.add(`<rect x="0" y="0" width="${LARG}" height="${ALT}" fill="${SOL_CHAO}" fill-opacity="0.26" mask="url(#${mascChao})"/>`);
// Dentro da mancha, a sombra do livro também tapa o céu da janela: um pouco mais escura que o chão
// em volta, nítida como a do sol e mais leve na ponta.
{
  const g = gradiente(pr, peDaSombra, pontaDaSombra, [[0, SOMBRA_COR, 0.2], [0.5, SOMBRA_COR, 0.13], [1, SOMBRA_COR, 0.07]]);
  pr.add(`<g mask="url(#${mascVidrosChao})"><g mask="url(#${mascSombraLivro})"><rect x="0" y="0" width="${LARG}" height="${ALT}" fill="url(#${g})"/></g></g>`);
}

// 3. Sombra de contato: onde o livro encosta no chão (justa e escura) e a oclusão em volta.
{
  const larga = planta.map(([x, z]) => {
    const cx = W / 2;
    return cam.p(M([cx + (x - cx) * 1.06, 0, z * 1.35]));
  });
  pr.add(`<path d="${caminho(larga)}" fill="${SOMBRA_COR}" fill-opacity="0.28" filter="url(#${desfoque(pr, 7, 3.5)})"/>`);
  pr.add(`<path d="${caminho(pegada)}" fill="#000" fill-opacity="0.6" filter="url(#${desfoque(pr, 1.4, 0.9)})"/>`);
}

// ================= o livro =================

const contCapa = contorno(cam, capaP, W, H, 32);
const contLomb = contorno(cam, lombP, T, H, 32);

// ---------- o alto do livro (cabeça) ----------
// Desenhado antes das faces da frente, que o cobrem na borda. Tudo está acima da verga: fica na
// luz do céu, que vem de cima (a sombra aqui é mais leve que na capa).
{
  const yT = H; // o alto das capas e da lombada
  const yM = H - SEIXA; // o alto do miolo
  const zF = T / 2 - PAPELAO; // face de dentro da capa
  const zB = -T / 2 + PAPELAO; // face de dentro da contracapa
  const P3 = (x, y, z) => cam.p(M([x, y, z]));
  const partes = [];

  // O vão: tudo o que não for coberto pelas peças aparece como fresta escura.
  const topoFora = [];
  for (let i = 0; i <= 24; i++) {
    const [x, z] = arco((T * i) / 24);
    topoFora.push(P3(x, yT, z));
  }
  topoFora.push(P3(W, yT, T / 2), P3(W, yT, -T / 2));
  partes.push(`<path d="${caminho(topoFora)}" fill="#4a4034"/>`);

  // Borda de cima da contracapa (papelão forrado pela contracapa, na cor do livro).
  const bordaContra = [P3(1, yT, -T / 2), P3(W - 3, yT, -T / 2), P3(W, yT, -T / 2 + 3), P3(W, yT, zB), P3(1, yT, zB)];
  partes.push(`<path d="${caminho(bordaContra)}" fill="${L.cor}"/>`);
  // Face de dentro da contracapa (a guarda, em papel): acima do miolo e, na frente, pela fresta da
  // seixa, descendo e escurecendo (a luz do céu entra por cima).
  const fundo = 60;
  const guarda = [P3(3, yT, zB), P3(W - 0.5, yT, zB), P3(W - 0.5, yT - fundo, zB), P3(3, yT - fundo, zB)];
  const gG = gradiente(pr, P3(W / 2, yT, zB), P3(W / 2, yT - fundo, zB), [[0, "#000", 0.02], [SEIXA / fundo, "#000", 0.09], [0.45, "#000", 0.2], [1, "#000", 0.34]]);
  partes.push(`<path d="${caminho(guarda)}" fill="${L.papel}"/><path d="${caminho(guarda)}" fill="url(#${gG})"/>`);

  // O alto do miolo: a lombada do miolo é convexa (acompanha o arco, por dentro) e a frente é côncava.
  const nz = 28;
  const zs = [];
  for (let i = 0; i <= nz; i++) zs.push(zB + 0.4 + ((zF - zB - 0.8) * i) / nz);
  const uDeZ = (z) => z + T / 2;
  const xLombadaMiolo = (z) => arco(uDeZ(z), 7)[0];
  const xFrente = (z) => W - SEIXA - BOJO * 0.65 * (1 - ((2 * z) / (zF - zB)) ** 2);
  const alto = [...zs.map((z) => P3(xLombadaMiolo(z), yM, z)), ...[...zs].reverse().map((z) => P3(xFrente(z), yM, z))];
  partes.push(`<path d="${caminho(alto)}" fill="${MIOLO}"/>`);
  const rAlto = recorte(pr, alto);
  // As folhas: linhas finas ao longo do comprimento, e os cadernos (a cada 16 folhas) um pouco mais marcados.
  const quad = [M([0, yM, zF]), M([W, yM, zF]), M([W, yM, zB]), M([0, yM, zB])];
  partes.push(
    `<g clip-path="url(#${rAlto})">` +
      linhasDasFolhas(cam, quad, { quantas: 110, opacidade: 0.055, largura: 0.35, semente: 5, cor: "#6b5634" }) +
      linhasDasFolhas(cam, quad, { quantas: 7, opacidade: 0.09, largura: 0.5, semente: 9, cor: "#6b5634" }) +
      `</g>`,
  );
  // Oclusão no fundo do recuo: junto às capas e à lombada, o alto do miolo escurece.
  {
    const gz = gradiente(pr, P3(W / 2, yM, zF), P3(W / 2, yM, zB), [[0, "#000", 0.14], [0.14, "#000", 0.03], [0.55, "#000", 0], [0.88, "#000", 0.03], [1, "#000", 0.12]]);
    const gx = gradiente(pr, P3(xLombadaMiolo(0), yM, 0), P3(80, yM, 0), [[0, "#000", 0.16], [1, "#000", 0]]);
    partes.push(`<path d="${caminho(alto)}" fill="url(#${gz})"/><path d="${caminho(alto)}" fill="url(#${gx})"/>`);
  }

  // O aro de cima da lombada (a cobertura dobrada sobre o reforço), em papel. A metade de trás fica
  // atrás do cabeceado (vista de cima e de frente); a da frente, na frente dele.
  const aroEntre = (uA, uB) => {
    const fora = [];
    const dentro = [];
    for (let i = 0; i <= 16; i++) {
      const u = uA + ((uB - uA) * i) / 16;
      const [x, z] = arco(u);
      const [xi, zi] = arco(u, 2.4);
      fora.push(P3(x, yT, z));
      dentro.push(P3(xi, yT, zi));
    }
    return [...fora, ...dentro.reverse()];
  };
  const aroTras = aroEntre(0, T * 0.52);
  const aroFrente = aroEntre(T * 0.5, T);
  partes.push(`<path d="${caminho(aroTras)}" fill="${L.papel}"/>`);

  // O cabeceado: um cordão listrado no alto da lombada do miolo (sobe um pouco acima das folhas).
  {
    const yC = yM + 3.4;
    const topo = [...zs.map((z) => P3(arco(uDeZ(z), 3.2)[0], yC, z)), ...[...zs].reverse().map((z) => P3(arco(uDeZ(z), 7.6)[0], yC, z))];
    const frente = [...zs.map((z) => P3(arco(uDeZ(z), 7.6)[0], yC, z)), ...[...zs].reverse().map((z) => P3(arco(uDeZ(z), 7.6)[0], yM, z))];
    partes.push(`<path d="${caminho(frente)}" fill="${L.destaque}"/><path d="${caminho(frente)}" fill="#000" fill-opacity="0.3"/>`);
    partes.push(`<path d="${caminho(topo)}" fill="${L.destaque}"/>`);
    const listras = [];
    for (let i = 0; i < 30; i++) {
      const z = zB + ((zF - zB) * (i + 0.5)) / 30;
      const a = P3(arco(uDeZ(z), 3.2)[0], yC, z);
      const b = P3(arco(uDeZ(z), 7.6)[0], yC, z);
      listras.push(`<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="${L.papel}" stroke-opacity="0.7" stroke-width="0.55"/>`);
    }
    partes.push(listras.join(""));
  }

  partes.push(`<path d="${caminho(aroFrente)}" fill="${L.papel}"/>`);
  const aro = [...aroTras, ...aroFrente];
  const bordaCapa = [P3(0, yT, T / 2), P3(W - 3, yT, T / 2), P3(W, yT, T / 2 - 3), P3(W, yT, zF), P3(1.5, yT, zF)];
  partes.push(`<path d="${caminho(bordaCapa)}" fill="${L.papel}"/>`);

  // Luz do céu no alto: uma sombra fria leve por cima de tudo (o sol não chega aqui).
  const rTopo = recorte(pr, casco([...topoFora, ...aro, ...bordaCapa]));
  partes.push(`<g clip-path="url(#${rTopo})"><path d="${caminho(casco([...topoFora, ...aro, ...bordaCapa]))}" fill="${SOMBRA_COR}" fill-opacity="0.13"/></g>`);
  // As arestas de cima das capas pegam um fio da luz do céu.
  partes.push(`<path d="${traco([M([2, yT, T / 2 - 0.6]), M([W - 3, yT, T / 2 - 0.6])])}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="0.7"/>`);
  pr.add(partes.join(""));
}

// Uma faixa por baixo da junta lombada-capa, nas cores da arte: a emenda entre as duas superfícies
// não deixa passar o fundo.
{
  const quad = (v0, v1) => [lombP(T - 2.5, v0), capaP(2.5, v0), capaP(2.5, v1), lombP(T - 2.5, v1)].map((p) => cam.p(p));
  pr.add(`<path d="${caminho(quad(0.5, DIVISAO))}" fill="${L.papel}"/><path d="${caminho(quad(DIVISAO, H - 0.5))}" fill="${L.cor}"/>`);
}

// ---------- a lombada ----------
const lombada3D = (() => {
  const partes = [];
  partes.push(superficie(pr, { ref: artLomb, w: T, h: H, P: lombP, cam, nu: 28, nv: 8 }).svg);
  const rLomb = recorte(pr, contLomb);
  const vidros = vidrosNaLombada();
  const meio = lombP(T * 0.6, H * 0.5);
  const nMeio = normal(cross(sub(lombP(T * 0.62, H / 2), lombP(T * 0.58, H / 2)), [0, -1, 0]));
  const el = elipse(meio, nMeio, naJanela(meio)[2]);
  const mSol = mascara(pr, desfocado(pr, vidros, el));
  const mSombra = mascara(pr, TUDO + desfocado(pr, vidros, el, "#000"));
  // Sombra: mais leve onde a curva encara a janela (a luz do céu vem de lá).
  const sombra = camadaAoLongoDeU(pr, { P: lombP, w: T, h: H, cor: SOMBRA_COR, opacidade: (nrm) => 0.4 - 0.14 * Math.max(0, dot(nrm, CEU)) });
  // Sol: proporcional ao quanto a curva encara o sol.
  const sol = camadaAoLongoDeU(pr, { P: lombP, w: T, h: H, cor: SOL_COR, opacidade: (nrm) => 0.3 * Math.max(0, dot(nrm, s)) - 0.02 });
  // A curva foge do olho perto da contracapa: escurece um pouco (e a quina da capa, um fio).
  const volta = camadaAoLongoDeU(pr, { P: lombP, w: T, h: H, cor: "#000", opacidade: (nrm, X, u) => 0.16 * (1 - limitar(u / (T * 0.28))) ** 2 });
  // A mancha de sol no chão, à frente, rebate um pouco de luz quente no pé da lombada (nota-se na sombra).
  const rebatida = camadaAoLongoDeV(pr, { P: lombP, w: T, h: H, contornoTela: contLomb, paradas: [[0, SOL_COR, 0.13], [0.1, SOL_COR, 0.06], [0.3, SOL_COR, 0]] });
  partes.push(
    `<g clip-path="url(#${rLomb})">` +
      `<rect x="0" y="0" width="${LARG}" height="${ALT}" filter="url(#${grao})"/>` +
      `<g mask="url(#${mSombra})">${sombra}${rebatida}</g><g mask="url(#${mSol})">${sol}</g>${volta}` +
      `</g>`,
  );
  return { svg: partes.join(""), mSol, recorte: rLomb };
})();
pr.add(lombada3D.svg);

// ---------- a capa ----------
const capa3D = (() => {
  const partes = [];
  const rCapa = recorte(pr, contCapa);
  partes.push(`<g clip-path="url(#${rCapa})">${superficie(pr, { ref: artCapa, w: W, h: H, P: capaP, cam, nu: 10, nv: 10 }).svg}</g>`);
  const Qc = M([0, 0, T / 2]);
  const mc = Md([0, 0, 1]);
  const vidros = vidrosNoPlano(Qc, mc);
  const X0 = capaP(W * 0.4, H * 0.5);
  const el = elipse(X0, mc, naJanela(X0)[2]);
  const mSol = mascara(pr, desfocado(pr, vidros, el));
  const mSombra = mascara(pr, TUDO + desfocado(pr, vidros, el, "#000"));
  const lamb = Math.max(0, dot(mc, s));
  const face = caminho(contCapa);

  // A direção da luz rasante na tela (para o relevo): o sol projetado no plano da capa.
  const noPlanoDaCapa = sub(s, mul(mc, dot(s, mc)));
  const dirTela = naTela(X0, noPlanoDaCapa);
  const azimute = (Math.atan2(dirTela[1], dirTela[0]) * 180) / Math.PI;
  const relevo = filtroRelevo(pr, { azimute, elevacao: (Math.asin(lamb) * 180) / Math.PI, base: 1.15, relevo: 0.5, forca: 0.5 });

  const rebatida = camadaAoLongoDeV(pr, { P: capaP, w: W, h: H, contornoTela: contCapa, paradas: [[0, SOL_COR, 0.12], [0.1, SOL_COR, 0.055], [0.28, SOL_COR, 0]] });
  partes.push(
    `<g clip-path="url(#${rCapa})">` +
      `<rect x="0" y="0" width="${LARG}" height="${ALT}" filter="url(#${grao})"/>` +
      `<g mask="url(#${mSombra})"><path d="${face}" fill="${SOMBRA_COR}" fill-opacity="0.4"/>${rebatida}</g>` +
      `<g mask="url(#${mSol})"><path d="${face}" fill="${SOL_COR}" fill-opacity="${op(0.06 + 0.36 * lamb)}"/>` +
      `<rect x="0" y="0" width="${LARG}" height="${ALT}" filter="url(#${relevo})" opacity="0.6"/></g>` +
      `</g>`,
  );

  // O vinco da dobradiça: um canal raso de alto a baixo. Na sombra, só um fio escuro de oclusão; no
  // sol rasante, o fundo e a parede do lado da lombada escurecem, e a parede que encara o sol acende.
  const linha = (u, v0 = 3, v1 = H - 2) => traco([capaP(u, v0), capaP(u, v1)]);
  partes.push(`<g clip-path="url(#${rCapa})">`);
  partes.push(`<path d="${linha(VINCO - 1)}" stroke="#000" stroke-opacity="0.16" stroke-width="2.2" fill="none" filter="url(#${desfoque(pr, 0.6, 0.6)})"/>`);
  partes.push(`<g mask="url(#${mSol})"><path d="${linha(VINCO - 1.4)}" stroke="#1d160b" stroke-opacity="0.34" stroke-width="1.7" fill="none"/><path d="${linha(VINCO + 1.6)}" stroke="#fff4dc" stroke-opacity="0.75" stroke-width="1.05" fill="none"/></g>`);
  // A junta com a lombada: a cobertura dobra ali (um fio escuro).
  partes.push(`<path d="${linha(0.6)}" stroke="#000" stroke-opacity="0.18" stroke-width="1" fill="none"/>`);
  // Aresta de cima da capa: um fio claro (a borda arredondada pega a luz do céu).
  partes.push(`<path d="${traco([capaP(2, 0.8), capaP(W - 3, 0.8)])}" stroke="#fff" stroke-opacity="0.3" stroke-width="0.8" fill="none"/>`);
  partes.push(`</g>`);
  console.log(`capa: s·n = ${lamb.toFixed(3)}; relevo azimute ${azimute.toFixed(1)}°; elipse`, el);
  return { svg: partes.join(""), mSol, recorte: rCapa };
})();
pr.add(capa3D.svg);

// O brilho do sol (halação da lente): o que está no sol espalha um pouco de luz quente em volta,
// inclusive para fora da silhueta (no claro quase não se vê; no escuro, um halo).
{
  const f = desfoque(pr, 7, 7, 0.25);
  pr.add(
    `<g filter="url(#${f})" opacity="0.55">` +
      `<g clip-path="url(#${lombada3D.recorte})"><path d="${caminho(contLomb)}" fill="${SOL_COR}" fill-opacity="0.32" mask="url(#${lombada3D.mSol})"/></g>` +
      `<g clip-path="url(#${capa3D.recorte})"><path d="${caminho(contCapa)}" fill="${SOL_COR}" fill-opacity="0.1" mask="url(#${capa3D.mSol})"/></g>` +
      `</g>`,
  );
}

pr.salvar(fileURLToPath(new URL(process.env.SAIDA ?? "./p10-luz-de-janela.svg", import.meta.url)));
console.log("✓ pranchas/p10-luz-de-janela.svg");
