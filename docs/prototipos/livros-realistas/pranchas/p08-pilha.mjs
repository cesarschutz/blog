#!/usr/bin/env node
/**
 * Prancha 08 · "A pilha": os oito livros da coleção deitados numa pilha sobre a prateleira, como a
 * pilha lateral das páginas de livro (Categorias), fotografados de frente, um pouco acima do topo,
 * com teleobjetiva.
 *
 *   fnm exec --using=24 node pranchas/p08-pilha.mjs  →  pranchas/p08-pilha.svg
 *
 * Geometria (unidades da referência; a capa tem 480 × 720):
 * - Cada livro deita de capa para cima, com a lombada virada para o observador e a cabeça à esquerda:
 *   é a lombada em pé (lombadaDaEstante) girada 90° para a esquerda. No referencial do livro,
 *   a corre ao longo do comprimento (0 = cabeça, à esquerda; comprimento = livro.altura), b sobe pela
 *   espessura (0 = contracapa, embaixo; espessura = livro.largura) e c entra no livro (0 = o alto do
 *   arco da lombada; a capa tem 480 · altura / 720 de largura, para trás).
 * - A lombada é um arco de círculo (saliência de ~15% da espessura) entre dois fios: as bordas das
 *   capas (o papelão forrado na cor do livro), à mostra acima e abaixo do arco.
 * - O volume 01 fica embaixo; cada livro se desloca para o lado pelo `deslocamento` de livros.json
 *   (10 + deslocamento, como a margem do site) e gira de leve no plano (±0,5 a 1,5°), com um pequeno
 *   recuo ou avanço em profundidade.
 * - A pintura vai de baixo para cima (a câmera está acima de tudo): cada livro cobre o topo do de
 *   baixo, e o que sobra à mostra (as pontas e as frestas) aparece sozinho, com a luz e a sombra certas.
 *
 * Luz: uma janela grande do alto à esquerda (e um pouco de frente), um céu de estúdio (o teto claro),
 * um preenchimento fraco da frente e um rebatimento baixo. A mesma direção serve para o gradiente de
 * cada lombada, para as sombras que um livro joga no de baixo e para a sombra na prateleira.
 */
import { fileURLToPath } from "node:url";
import { livro, lombadaDaEstante, capa } from "../base/base.mjs";
import {
  Prancha,
  camera,
  enquadrar,
  superficie,
  girarY,
  sub,
  dot,
  normal,
  grau,
  limitar,
  pontos,
  gradiente,
  filtroDesfoque,
  filtroGrao,
  recortePoligono,
  n,
} from "../ferramentas/cena.mjs";

const LARGURA = 1100;
const ALTURA = 1000;
const pr = new Prancha({
  prefixo: "p08",
  largura: LARGURA,
  altura: ALTURA,
  titulo: "A pilha",
  descricao:
    "Os oito livros da coleção deitados numa pilha sobre a prateleira, com as lombadas viradas para quem olha: do volume 01, Arquitetura de Software, embaixo, ao 08, Carreira, em cima.",
});

// ---------- os livros ----------

const ORDEM = ["arquitetura-de-software", "desenvolvimento-de-software", "dados", "ia", "seguranca", "devops", "sre", "carreira"];

/**
 * Os pequenos desalinhamentos, escolhidos à mão para a pilha parecer arrumada por uma pessoa:
 * giro no plano (graus; positivo leva a ponta direita para trás) e recuo em profundidade (positivo
 * vem para a frente). A saliência da lombada e a altura dos fios variam um pouco de livro para livro.
 */
const AJUSTES = {
  "arquitetura-de-software": { giro: 0.6, recuo: 0, saliencia: 0.15, fio: 3.2 },
  "desenvolvimento-de-software": { giro: -1.1, recuo: -6, saliencia: 0.16, fio: 3.0 },
  dados: { giro: 0.9, recuo: 7, saliencia: 0.14, fio: 2.8 },
  ia: { giro: -0.7, recuo: -3, saliencia: 0.15, fio: 2.8 },
  seguranca: { giro: 1.3, recuo: 5, saliencia: 0.16, fio: 3.1 },
  devops: { giro: -1.4, recuo: -8, saliencia: 0.15, fio: 2.9 },
  sre: { giro: 0.5, recuo: 6, saliencia: 0.14, fio: 2.8 },
  carreira: { giro: -0.9, recuo: -2, saliencia: 0.15, fio: 3.0 },
};

/** A lombada termina um nadinha antes das capas nas duas pontas (o cabeceado fica recolhido). */
const RECOLHIDO = 0.8;

/**
 * O perfil da lombada, de uma dobradiça à outra (s de -1 a 1): c = -bojo · |s|^EXPOENTE. Com 2, é quase
 * um arco de círculo; acima disso, o meio (onde fica o título) achata e a curva se fecha perto das
 * dobradiças, como numa lombada arredondada de verdade.
 */
const EXPOENTE = 2.7;

let alturaAcumulada = 0;
const LIVROS = ORDEM.map((slug, indice) => {
  const L = livro(slug);
  const aj = AJUSTES[slug];
  const k = {
    slug,
    indice,
    L,
    comp: L.altura, // comprimento, ao longo de x (a altura do livro em pé)
    esp: L.largura, // espessura, ao longo de y (a largura da lombada)
    prof: (480 * L.altura) / 720, // largura da capa, para trás (z)
    x0: 10 + L.deslocamento, // a ponta da cabeça, como a margem do site
    y0: alturaAcumulada,
    giro: aj.giro,
    recuo: aj.recuo,
    fio: aj.fio,
  };
  k.bojo = k.esp * aj.saliencia;
  // O perfil da lombada vai de um fio ao outro, e o alto sai `bojo` para a frente. A arte corre pelo
  // comprimento do arco (como o papel impresso colado na lombada): uma tabela do comprimento por s.
  k.meiaCorda = (k.esp - 2 * k.fio) / 2;
  k.perfil = [];
  let acumulado = 0;
  for (let i = 0; i <= 400; i++) {
    const s = -1 + i / 200;
    const [b, c] = pontoDoPerfil(k, s);
    const ant = k.perfil.at(-1);
    if (ant) acumulado += Math.hypot(b - ant.b, c - ant.c);
    k.perfil.push({ s, b, c, l: acumulado });
  }
  k.arcoTotal = acumulado;
  alturaAcumulada += k.esp;
  return k;
});
const TOPO = alturaAcumulada;

/** Do referencial do livro (a, b, c) para o mundo: gira no plano em volta do centro do livro. */
function mundo(k, a, b, c) {
  const cm = -(k.bojo + k.prof / 2);
  const q = girarY([a - k.comp / 2, b, c - cm], k.giro);
  return [q[0] + k.x0 + k.comp / 2, q[1] + k.y0, q[2] + cm + k.recuo];
}

/** Altura b e profundidade c do perfil da lombada em s (-1 na dobradiça de baixo, 1 na de cima). */
function pontoDoPerfil(k, s) {
  return [k.esp / 2 + s * k.meiaCorda, -k.bojo * Math.abs(s) ** EXPOENTE];
}

/** O s do perfil para a coordenada u da arte da lombada (0 = contracapa, embaixo), pelo comprimento do arco. */
function sDaArte(k, u) {
  const alvo = limitar(u / k.esp) * k.arcoTotal;
  const t = k.perfil;
  let lo = 0;
  let hi = t.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (t[m].l < alvo) lo = m;
    else hi = m;
  }
  const f = t[hi].l > t[lo].l ? (alvo - t[lo].l) / (t[hi].l - t[lo].l) : 0;
  return t[lo].s + (t[hi].s - t[lo].s) * f;
}

/** Normal do perfil em s, no mundo (sobe na metade de cima, desce na de baixo). */
function normalDoPerfil(k, s) {
  const dcdb = (-k.bojo * EXPOENTE * Math.abs(s) ** (EXPOENTE - 1) * Math.sign(s)) / k.meiaCorda;
  return girarY(normal([0, -dcdb, 1]), k.giro);
}

/** A frente do livro na altura b: o perfil entre os fios, e os fios (as bordas das capas) no plano c = -bojo. */
function cFrente(k, b) {
  if (b <= k.fio || b >= k.esp - k.fio) return -k.bojo;
  return pontoDoPerfil(k, (b - k.esp / 2) / k.meiaCorda)[1];
}
const frente = (k, a, b) => mundo(k, a, b, cFrente(k, b));

/** P(u, v) da lombada: u na espessura da arte (0 = contracapa, embaixo), v no comprimento (0 = cabeça). */
const lombadaP = (k) => (u, v) => {
  const [b, c] = pontoDoPerfil(k, sDaArte(k, u));
  return mundo(k, RECOLHIDO + (v * (k.comp - 2 * RECOLHIDO)) / k.comp, b, c);
};

/** P(u, v) da capa (em cima): u de 0 (lado da lombada) a 480 (frente do livro), v de 0 (cabeça) a 720 (pé). */
const capaP = (k) => (u, v) => mundo(k, (v * k.comp) / 720, k.esp, -k.bojo - (u * k.prof) / 480);
/** Um ponto da capa de cima, pela distância d (para trás) a partir da borda da lombada. */
const naCapa = (k, a, d) => mundo(k, a, k.esp, -k.bojo - d);


// ---------- a luz ----------

/** Direção PARA a luz principal: do alto, à esquerda e um pouco de frente. */
const LUZ = normal([-0.5, 0.65, 0.57]);
/** Preenchimento fraco, da frente e um pouco à direita (o rebatimento do estúdio). */
const PREENCHIMENTO = normal([0.35, 0.25, 1]);

/**
 * Claridade de uma face com normal `nrm`: a janela grande (Lambert "embrulhado", luz macia), o céu
 * do estúdio (o que olha para cima recebe mais), o preenchimento e o rebatimento de baixo.
 */
function claridade(nrm) {
  const principal = Math.max(0, (dot(nrm, LUZ) + 0.3) / 1.3);
  const ceu = 0.22 * ((1 + nrm[1]) / 2);
  const preench = Math.max(0, dot(nrm, PREENCHIMENTO)) * 0.24;
  const rebatimento = Math.max(0, -nrm[1]) * 0.12;
  return principal + ceu + preench + rebatimento;
}
/** A referência: a face que olha para a câmera fica com a cor do site. */
const REFERENCIA = claridade(normal([0, 0.12, 1]));

// ---------- a câmera ----------

const XS = LIVROS.flatMap((k) => [k.x0, k.x0 + k.comp]);
const X_MIN = Math.min(...XS);
const X_MAX = Math.max(...XS);
const X_MEIO = (X_MIN + X_MAX) / 2;
const PROF_MAX = Math.max(...LIVROS.map((k) => k.bojo + k.prof));

/** A prateleira: a do site vai de 0 a 680 (a pilha cabe nela); aqui, um nada mais, e a borda à frente das lombadas. */
const PRAT = { x0: -6, x1: 686, frente: 52, fundo: -PROF_MAX - 14, borda: 15 };

// Teleobjetiva: o olho longe (uns 4,5 m de uma pilha de 34 cm), um pouco acima do topo da pilha, a
// ponto de a capa do livro de cima aparecer como uma faixa. Longe assim, o ângulo quase não muda do
// topo à base, e as pontas quase não convergem.
const DISTANCIA = 14000;
const ELEVACAO_NO_TOPO = 6; // graus acima da capa do livro de cima
const olho = [X_MEIO, TOPO + DISTANCIA * Math.tan(grau(ELEVACAO_NO_TOPO)), DISTANCIA];
const alvo = [X_MEIO, TOPO * 0.48, -PROF_MAX / 2];
const cam = camera({ olho, alvo, focal: 1000, centro: [LARGURA / 2, ALTURA / 2] });

const chave = [];
for (const k of LIVROS)
  for (const a of [0, k.comp]) for (const b of [0, k.esp]) for (const c of [0, -k.bojo - k.prof]) chave.push(mundo(k, a, b, c));
for (const x of [PRAT.x0, PRAT.x1]) for (const z of [PRAT.frente, PRAT.fundo]) chave.push([x, 0, z], [x, -PRAT.borda, z]);
enquadrar(cam, chave, [80, 66, LARGURA - 160, ALTURA - 132]);

const P = (p) => cam.p(p);

// ---------- utilidades de desenho ----------

/** Envoltória convexa (cadeia monótona) de pontos 2D. */
function envoltoria(ps) {
  const q = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const baixo = [];
  for (const p of q) {
    while (baixo.length >= 2 && cr(baixo.at(-2), baixo.at(-1), p) <= 0) baixo.pop();
    baixo.push(p);
  }
  const cima = [];
  for (const p of [...q].reverse()) {
    while (cima.length >= 2 && cr(cima.at(-2), cima.at(-1), p) <= 0) cima.pop();
    cima.push(p);
  }
  return [...baixo.slice(0, -1), ...cima.slice(0, -1)];
}

/** Retângulo de cantos arredondados no plano (s, t). `raios`: [s0t0, s1t0, s1t1, s0t1]. */
function retanguloArredondado(s0, s1, t0, t1, raios, passos = 6) {
  const [r0, r1, r2, r3] = raios;
  const ps = [];
  const canto = (cs, ct, r, ang0) => {
    if (r <= 0) return ps.push([cs, ct]);
    for (let i = 0; i <= passos; i++) {
      const t = ang0 + (Math.PI / 2) * (i / passos);
      ps.push([cs + r * Math.cos(t), ct + r * Math.sin(t)]);
    }
  };
  canto(s0 + r0, t0 + r0, r0, Math.PI);
  canto(s1 - r1, t0 + r1, r1, 1.5 * Math.PI);
  canto(s1 - r2, t1 - r2, r2, 0);
  canto(s0 + r3, t1 - r3, r3, 0.5 * Math.PI);
  return ps;
}

/** Densifica uma polilinha fechada (a perspectiva e o arco não cortam caminho nas arestas longas). */
function densificar(ps, passo) {
  const saida = [];
  for (let i = 0; i < ps.length; i++) {
    const a = ps[i];
    const b = ps[(i + 1) % ps.length];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const m = Math.max(1, Math.ceil(d / passo));
    for (let j = 0; j < m; j++) saida.push([a[0] + ((b[0] - a[0]) * j) / m, a[1] + ((b[1] - a[1]) * j) / m]);
  }
  return saida;
}

function limites(ps) {
  const xs = ps.map((p) => p[0]);
  const ys = ps.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

/** O contorno (tela) da frente do livro, fios e lombada, com os cantos um pouco arredondados. */
function contornoFrente(k, r = 4) {
  const ret = densificar(retanguloArredondado(0, k.comp, 0, k.esp, [r, r, r, r]), 6);
  return ret.map(([a, b]) => P(frente(k, a, b)));
}

/**
 * O contorno (tela) só do arco da lombada (entre os fios), com as pontas do cabeceado arredondadas
 * (a lombada termina `RECOLHIDO` antes das capas, e o canto dela é macio).
 */
function contornoLombada(k, r = 3) {
  const ret = densificar(retanguloArredondado(RECOLHIDO, k.comp - RECOLHIDO, k.fio, k.esp - k.fio, [r, r, r, r]), 5);
  return ret.map(([a, b]) => P(frente(k, a, b)));
}

/** O contorno (tela) da capa de cima, com os cantos da frente do livro arredondados. */
function contornoCapa(k, rFrente = 6, rLombada = 2.5) {
  const ret = densificar(retanguloArredondado(0, k.comp, 0, k.prof, [rLombada, rLombada, rFrente, rFrente]), 10);
  return ret.map(([a, d]) => P(naCapa(k, a, d)));
}

/** Uma faixa da frente entre as alturas b0 e b1 e os comprimentos a0 e a1 (tela). */
function faixaFrente(k, b0, b1, a0 = 0, a1 = k.comp, m = 16) {
  const ps = [];
  const bs = [];
  for (let i = 0; i <= 10; i++) bs.push(b0 + ((b1 - b0) * i) / 10);
  for (let i = 0; i <= m; i++) ps.push(P(frente(k, a0 + ((a1 - a0) * i) / m, b0)));
  for (const b of bs.slice(1)) ps.push(P(frente(k, a1, b)));
  for (let i = m - 1; i >= 0; i--) ps.push(P(frente(k, a0 + ((a1 - a0) * i) / m, b1)));
  for (const b of bs.slice(1, -1).reverse()) ps.push(P(frente(k, a0, b)));
  return ps;
}

/** Uma faixa da capa de cima entre as distâncias d0 e d1 (para trás) e os comprimentos a0 e a1 (tela). */
function faixaCapa(k, d0, d1, a0 = 0, a1 = k.comp, m = 16) {
  const ps = [];
  for (let i = 0; i <= m; i++) ps.push(P(naCapa(k, a0 + ((a1 - a0) * i) / m, d0)));
  for (let i = m; i >= 0; i--) ps.push(P(naCapa(k, a0 + ((a1 - a0) * i) / m, d1)));
  return ps;
}

/**
 * Um gradiente que atravessa a frente do livro, de baixo (b = 0) para cima (b = esp), perpendicular
 * à faixa na tela (o livro girado fica um nadinha inclinado). `paradas`: [[b, cor, opacidade]].
 */
function gradienteAtravessado(k, paradas) {
  const meio = k.comp / 2;
  const e0 = P(frente(k, 0, k.esp / 2));
  const e1 = P(frente(k, k.comp, k.esp / 2));
  let nx = -(e1[1] - e0[1]);
  let ny = e1[0] - e0[0];
  const l = Math.hypot(nx, ny);
  nx /= l;
  ny /= l;
  const o = P(frente(k, meio, 0));
  const t1 = P(frente(k, meio, k.esp));
  let comp = (t1[0] - o[0]) * nx + (t1[1] - o[1]) * ny;
  if (comp < 0) {
    nx = -nx;
    ny = -ny;
    comp = -comp;
  }
  const t = (b) => {
    const q = P(frente(k, meio, b));
    return limitar(((q[0] - o[0]) * nx + (q[1] - o[1]) * ny) / comp);
  };
  const ps = paradas.map(([b, cor, op]) => [n(t(b) * 10000) / 10000, cor, n(op * 1000) / 1000]).sort((x, y) => x[0] - y[0]);
  return gradiente(pr, o, [o[0] + nx * comp, o[1] + ny * comp], ps);
}

/** Gradiente ao longo do livro (da cabeça ao pé), na tela. `paradas`: [[a, cor, opacidade]]. */
function gradienteAoLongo(k, paradas, b = k.esp / 2) {
  const o = P(frente(k, 0, b));
  const f = P(frente(k, k.comp, b));
  const ps = paradas.map(([a, cor, op]) => [n(limitar(a / k.comp) * 10000) / 10000, cor, n(op * 1000) / 1000]).sort((x, y) => x[0] - y[0]);
  return gradiente(pr, o, f, ps);
}

const poligono = (ps, atributos) => `<polygon points="${pontos(ps)}" ${atributos}/>`;
const recorte = (ps) => recortePoligono(pr, ps);
const desfoques = new Map();
/** Um filtro de desfoque por valor (reaproveitado). */
function desfoque(d) {
  const chaveD = n(d);
  if (!desfoques.has(chaveD)) desfoques.set(chaveD, filtroDesfoque(pr, d, { margem: 1.5 }));
  return desfoques.get(chaveD);
}

/** A sombra de pontos 3D projetada pela luz num plano horizontal y (tela). */
function sombraNoPlano(pts, y) {
  const q = pts.map((p) => {
    const t = (p[1] - y) / LUZ[1];
    return [p[0] - LUZ[0] * t, p[2] - LUZ[2] * t];
  });
  return densificar(envoltoria(q), 20).map(([x, z]) => P([x, y, z]));
}
/** A caixa do livro (a frente fica um pouco atrás do alto do arco, que joga sombra para trás). */
function caixa(k) {
  const cs = [];
  for (const a of [0, k.comp]) for (const b of [0, k.esp]) for (const c of [-k.bojo * 0.4, -k.bojo - k.prof]) cs.push(mundo(k, a, b, c));
  return cs;
}

/** Onde dois livros vizinhos se sobrepõem no comprimento, no referencial de `k` (a0, a1). */
function sobreposicao(k, outro) {
  const x0 = Math.max(k.x0, outro.x0);
  const x1 = Math.min(k.x0 + k.comp, outro.x0 + outro.comp);
  return [x0 - k.x0, x1 - k.x0];
}

/** Profundidade (z do mundo) do fio da frente de `k` no x do mundo dado. */
function zDoFio(k, x) {
  const a = limitar(x - k.x0, 0, k.comp);
  return mundo(k, a, 0, -k.bojo)[2];
}

/** Uma máscara que vale `op0` na cabeça e `op1` no pé (a luz que chega mais na esquerda). */
function mascaraAoLongo(k, paradas) {
  const id = pr.id("mascara");
  const g = gradienteAoLongo(k, paradas);
  const c = limites(contornoFrente(k));
  pr.def(
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="${n(c[0] - 20)}" y="${n(c[1] - 20)}" width="${n(c[2] - c[0] + 40)}" height="${n(c[3] - c[1] + 40)}"><rect x="${n(c[0] - 20)}" y="${n(c[1] - 20)}" width="${n(c[2] - c[0] + 40)}" height="${n(c[3] - c[1] + 40)}" fill="url(#${g})"/></mask>`,
  );
  return id;
}

// ---------- as artes ----------

const ARTE = Object.fromEntries(
  LIVROS.map((k) => [
    k.slug,
    {
      lombada: pr.simbolo(lombadaDaEstante(k.slug), { largura: k.esp, altura: k.comp, nome: "lombada" }),
      capa: pr.simbolo(capa(k.slug), { largura: 480, altura: 720, nome: "capa" }),
    },
  ]),
);

// ---------- a prateleira ----------

function prateleira() {
  const { x0, x1, frente: zf, fundo: zb, borda } = PRAT;
  const tampo = densificar([P([x0, 0, zf]), P([x1, 0, zf]), P([x1, 0, zb]), P([x0, 0, zb])], 30);
  const bordaPs = densificar([P([x0, 0, zf]), P([x1, 0, zf]), P([x1, -borda, zf]), P([x0, -borda, zf])], 30);
  const partes = [];
  partes.push(poligono(tampo, `fill="#b5bab4"`));
  partes.push(poligono(bordaPs, `fill="#9ba19b"`));

  // A luz no tampo: mais clara à esquerda (perto da janela), e o fundo, longe da borda, um nada mais escuro.
  const gL = gradiente(pr, P([x0, 0, zf]), P([x1, 0, zf]), [
    [0, "#fff", 0.1],
    [0.45, "#fff", 0],
    [1, "#000", 0.07],
  ]);
  partes.push(poligono(tampo, `fill="url(#${gL})"`));
  const gF = gradiente(pr, P([X_MEIO, 0, zf]), P([X_MEIO, 0, zb]), [
    [0, "#fff", 0.06],
    [0.15, "#fff", 0],
    [1, "#000", 0.08],
  ]);
  partes.push(poligono(tampo, `fill="url(#${gF})"`));
  // A borda: o canto de cima, arredondado, pega a luz; embaixo, ela se fecha em sombra.
  const gB = gradiente(pr, P([X_MEIO, 0, zf]), P([X_MEIO, -borda, zf]), [
    [0, "#fff", 0.22],
    [0.08, "#fff", 0.06],
    [0.2, "#fff", 0],
    [0.7, "#000", 0.06],
    [1, "#000", 0.18],
  ]);
  partes.push(poligono(bordaPs, `fill="url(#${gB})"`));
  const gBL = gradiente(pr, P([x0, -borda / 2, zf]), P([x1, -borda / 2, zf]), [
    [0, "#fff", 0.06],
    [0.5, "#fff", 0],
    [1, "#000", 0.08],
  ]);
  partes.push(poligono(bordaPs, `fill="url(#${gBL})"`));
  // A aresta de trás do tampo (vista dos lados da pilha): um fio de sombra.
  const tras = [];
  for (let i = 0; i <= 20; i++) tras.push(P([x0 + ((x1 - x0) * i) / 20, 0, zb + 1]));
  partes.push(`<polyline points="${pontos(tras)}" fill="none" stroke="#000" stroke-opacity="0.12" stroke-width="0.9"/>`);
  // As pontas da tábua: a da esquerda pega a luz, a da direita fica na sombra.
  const pontaE = [P([x0, 0, zf]), P([x0, 0, zb]), P([x0, -1, zb]), P([x0, -1, zf])];
  partes.push(`<polyline points="${pontos([P([x0 + 0.6, 0, zb]), P([x0 + 0.6, 0, zf]), P([x0 + 0.6, -borda, zf])])}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="0.9"/>`);
  partes.push(`<polyline points="${pontos([P([x1 - 0.6, 0, zb]), P([x1 - 0.6, 0, zf]), P([x1 - 0.6, -borda, zf])])}" fill="none" stroke="#000" stroke-opacity="0.14" stroke-width="0.9"/>`);
  void pontaE;

  // Sombras da pilha no tampo (recortadas pelo tampo).
  const rec = recorte(tampo);
  const base = LIVROS[0];
  const s = [];
  // ambiente larga: a pegada da pilha, bem desfocada
  const pegada = [0, base.comp].flatMap((a) => [mundo(base, a, 0, 4), mundo(base, a, 0, -base.bojo - base.prof)]).map((p) => [p[0], p[2]]);
  const pegadaTela = densificar(envoltoria(pegada), 20).map(([x, z]) => P([x, 0, z]));
  s.push(poligono(pegadaTela, `fill="#000" fill-opacity="0.14" filter="url(#${desfoque(14)})"`));
  // a sombra projetada dos livros de baixo (a dos de cima cai atrás da pilha, fora da vista)
  for (const k of LIVROS.slice(0, 3)) s.push(poligono(sombraNoPlano(caixa(k), 0), `fill="#000" fill-opacity="0.15" filter="url(#${desfoque(6)})"`));
  // meia-sombra junto à lombada de baixo
  const meia = [];
  for (let i = 0; i <= 16; i++) meia.push(P(mundo(base, -2 + ((base.comp + 4) * i) / 16, 0, 2)));
  for (let i = 16; i >= 0; i--) meia.push(P(mundo(base, -2 + ((base.comp + 4) * i) / 16, 0, -base.bojo - 20)));
  s.push(poligono(meia, `fill="#000" fill-opacity="0.2" filter="url(#${desfoque(3.5)})"`));
  // contato: a linha escura justa onde o livro de baixo encosta
  const contato = [];
  for (let i = 0; i <= 16; i++) contato.push(P(mundo(base, 1 + ((base.comp - 2) * i) / 16, 0, -base.bojo + 2.5)));
  for (let i = 16; i >= 0; i--) contato.push(P(mundo(base, 1 + ((base.comp - 2) * i) / 16, 0, -base.bojo - 10)));
  s.push(poligono(contato, `fill="#000" fill-opacity="0.5" filter="url(#${desfoque(1.3)})"`));
  partes.push(`<g clip-path="url(#${rec})">${s.join("")}</g>`);

  // Grão fino da pintura da prateleira.
  const grao = filtroGrao(pr, { base: 1.1, oitavas: 2, alfa: 0.06, semente: 11 });
  const caixaT = limites([...tampo, ...bordaPs]);
  const rT = recorte(envoltoria([...tampo, ...bordaPs]));
  partes.push(
    `<g clip-path="url(#${rT})"><rect x="${n(caixaT[0])}" y="${n(caixaT[1])}" width="${n(caixaT[2] - caixaT[0])}" height="${n(caixaT[3] - caixaT[1])}" filter="url(#${grao})"/></g>`,
  );
  return partes.join("\n");
}

// ---------- um livro ----------

function umLivro(k) {
  const acima = LIVROS[k.indice + 1];
  const abaixo = LIVROS[k.indice - 1];
  const partes = [];
  const cor = k.L.cor;

  // Faixas (no comprimento) em que este livro está à mostra por cima: fora do livro de cima.
  const [a0c, a1c] = acima ? sobreposicao(k, acima) : [k.comp / 2, k.comp / 2];

  // 1. A capa de cima (a arte da capa girada: a cabeça à esquerda). Nos livros do meio da pilha, só
  //    as pontas e as frestas ficam à mostra; o livro de cima pinta por cima do resto.
  const contCapa = contornoCapa(k);
  const recCapa = recorte(contCapa);
  const mapaCapa = superficie(pr, { ref: ARTE[k.slug].capa, w: 480, h: 720, P: capaP(k), cam, nu: acima ? 3 : 6, nv: acima ? 6 : 12 });
  partes.push(`<g clip-path="url(#${recCapa})">${mapaCapa.svg}</g>`);

  // A luz na capa: ela olha para o alto e recebe a janela e o céu (um véu claro), com um nada mais de
  // luz na cabeça (perto da janela).
  const luzCapa = [];
  const relCapa = claridade([0, 1, 0]) / REFERENCIA;
  const veu = limitar((relCapa - 1) * 0.55 + 0.04, 0, 0.2);
  const gCapa = gradiente(pr, P(naCapa(k, 0, 0)), P(naCapa(k, k.comp, 0)), [
    [0, "#fff", veu + 0.04],
    [0.5, "#fff", veu],
    [1, "#fff", Math.max(0, veu - 0.04)],
  ]);
  luzCapa.push(poligono(contCapa, `fill="url(#${gCapa})"`));
  // A canaleta da dobradiça logo atrás da lombada e o vinco a ~22 unidades dela.
  const linhaCapa = (d, corL, op, larg) => {
    const ps = [];
    for (let i = 0; i <= 24; i++) ps.push(P(naCapa(k, 1.5 + ((k.comp - 3) * i) / 24, d)));
    return `<polyline points="${pontos(ps)}" fill="none" stroke="${corL}" stroke-opacity="${op}" stroke-width="${larg}" stroke-linecap="round"/>`;
  };
  luzCapa.push(poligono(faixaCapa(k, 0, 5), `fill="#000" fill-opacity="0.16" filter="url(#${desfoque(0.8)})"`));
  luzCapa.push(linhaCapa(22, "#000", 0.2, 0.8));
  luzCapa.push(linhaCapa(24.4, "#fff", 0.26, 0.9));
  // A borda de trás (o papelão) fecha um nada mais escura contra o fundo.
  luzCapa.push(linhaCapa(k.prof - 0.5, "#000", 0.2, 1));
  // As quinas das pontas da capa: a da cabeça vira para a janela (clara), a do pé foge dela.
  const linhaPonta = (a, corL, op, larg) => {
    const ps = [];
    for (let i = 0; i <= 12; i++) ps.push(P(naCapa(k, a, 4 + ((k.prof - 10) * i) / 12)));
    return `<polyline points="${pontos(ps)}" fill="none" stroke="${corL}" stroke-opacity="${op}" stroke-width="${larg}" stroke-linecap="round"/>`;
  };
  luzCapa.push(linhaPonta(0.7, "#fff", 0.3, 1.1));
  luzCapa.push(linhaPonta(k.comp - 0.6, "#000", 0.16, 1));
  if (acima) {
    // A sombra do livro de cima na capa à mostra: a projetada pela luz (para a direita e para trás),
    // com a penumbra, e a de contato em volta dele.
    // A janela é grande: a penumbra cresce com a altura de quem faz a sombra (o livro de cima tem
    // mais de 100 unidades), então a sombra na capa à mostra é larga e macia, e só escurece de
    // verdade junto do livro de cima.
    const sombraCapa = sombraNoPlano(caixa(acima), k.y0 + k.esp);
    luzCapa.push(poligono(sombraCapa, `fill="#000" fill-opacity="0.26" filter="url(#${desfoque(9)})"`));
    luzCapa.push(poligono(sombraCapa, `fill="#000" fill-opacity="0.1" filter="url(#${desfoque(3)})"`));
    const pe = [];
    for (const a of [0, acima.comp]) for (const c of [-acima.bojo + 1, -acima.bojo - acima.prof]) pe.push(mundo(acima, a, 0, c));
    const pegada = densificar(envoltoria(pe.map((p) => [p[0], p[2]])), 20).map(([x, z]) => P([x, k.y0 + k.esp, z]));
    luzCapa.push(poligono(pegada, `fill="#000" fill-opacity="0.26" filter="url(#${desfoque(2.4)})"`));
    luzCapa.push(poligono(pegada, `fill="#000" fill-opacity="0.3" filter="url(#${desfoque(0.7)})"`));
    // O vão junto da ponta do livro de cima: ele tapa metade do céu, e mais ainda no fundo. À direita
    // (longe da janela) o vão é mais fundo; à esquerda, a janela ainda entra.
    const vao = (aParede, sentido, forca, largura) => {
      const a1 = aParede + sentido * largura;
      const g = gradiente(pr, P(naCapa(k, aParede, k.prof * 0.4)), P(naCapa(k, a1, k.prof * 0.4)), [
        [0, "#000", forca],
        [0.45, "#000", forca * 0.35],
        [1, "#000", 0],
      ]);
      const ps = [P(naCapa(k, aParede, -2)), P(naCapa(k, a1, -2)), P(naCapa(k, a1, k.prof + 2)), P(naCapa(k, aParede, k.prof + 2))];
      const gF = gradiente(pr, P(naCapa(k, aParede, 0)), P(naCapa(k, aParede, k.prof)), [
        [0, "#000", 0],
        [1, "#000", forca * 0.5],
      ]);
      return poligono(ps, `fill="url(#${g})"`) + poligono(ps, `fill="url(#${gF})"`);
    };
    const [a0v, a1v] = sobreposicao(k, acima);
    if (a1v < k.comp - 0.5) luzCapa.push(vao(a1v, 1, 0.26, 46));
    if (a0v > 0.5) luzCapa.push(vao(a0v, -1, 0.12, 26));
  }
  partes.push(`<g clip-path="url(#${recCapa})">${luzCapa.join("")}</g>`);

  // 2. A frente: os fios (as bordas das capas) e a lombada arredondada por cima.
  const contFrente = contornoFrente(k);
  const recFrente = recorte(contFrente);
  const frenteSvg = [];
  // O fundo da frente: nas pontas, a lombada recolhida deixa ver a dobra do cabeceado, na sombra.
  frenteSvg.push(
    poligono(faixaFrente(k, -1, k.esp + 1, -1, k.comp / 2), `fill="${k.L.papel}"`),
    poligono(faixaFrente(k, -1, k.esp + 1, k.comp / 2, k.comp + 1), `fill="${k.L.corDaLombada}"`),
    poligono(contFrente, `fill="#000" fill-opacity="0.22"`),
  );
  // Os fios são as bordas do papelão das duas capas, forradas na cor do livro (a arte impressa fica
  // nas faces): um de cada lado da lombada.
  frenteSvg.push(poligono(faixaFrente(k, -1, k.fio + 1), `fill="${cor}"`));
  frenteSvg.push(poligono(faixaFrente(k, k.esp - k.fio - 1, k.esp + 1), `fill="${cor}"`));
  // O fio olha para a frente, mas fica na dobra entre a lombada e a capa: um pouco mais escuro.
  frenteSvg.push(poligono(faixaFrente(k, -1, k.fio + 1), `fill="#000" fill-opacity="0.2"`));
  frenteSvg.push(poligono(faixaFrente(k, k.esp - k.fio - 1, k.esp + 1), `fill="#000" fill-opacity="0.1"`));
  // A quina do papelão da capa, onde ela está à mostra, pega a luz (um fio claro e fino).
  const quinas = [];
  if (!acima) quinas.push([0, k.comp]);
  else {
    if (a0c > 1) quinas.push([0, a0c]);
    if (a1c < k.comp - 1) quinas.push([a1c, k.comp]);
  }
  for (const [q0, q1] of quinas) frenteSvg.push(poligono(faixaFrente(k, k.esp - 0.9, k.esp + 1, q0, q1, 8), `fill="#fff" fill-opacity="0.22"`));

  const recLombada = recorte(contornoLombada(k));
  const lombadaSvg = [];
  const mapa = superficie(pr, { ref: ARTE[k.slug].lombada, w: k.esp, h: k.comp, P: lombadaP(k), cam, nu: 32, nv: 1 });
  lombadaSvg.push(mapa.svg);

  // 3. A luz da lombada: o gradiente do arco (claro no alto, escuro embaixo), o brilho largo da
  //    janela correndo pela curva e o fio de brilho logo abaixo da quina de cima.
  const contL = contornoLombada(k);
  const paradasEscuro = [];
  const paradasClaro = [];
  const V = normal(sub(olho, frente(k, k.comp / 2, k.esp / 2)));
  const H = normal([LUZ[0] + V[0], LUZ[1] + V[1], LUZ[2] + V[2]]);
  for (let i = 0; i <= 64; i++) {
    const sPerfil = -1 + i / 32;
    const [b] = pontoDoPerfil(k, sPerfil);
    const nrm = normalDoPerfil(k, sPerfil);
    const rel = claridade(nrm) / REFERENCIA;
    const esc = Math.max(0, 1 - rel) * 0.78;
    const nh = Math.max(0, dot(nrm, H));
    const brilhoLargo = Math.pow(nh, 14) * 0.11;
    const brilhoFino = Math.pow(nh, 90) * 0.12;
    const cla = Math.max(0, rel - 1) * 0.3 + brilhoLargo + brilhoFino;
    paradasEscuro.push([b, "#000", esc]);
    paradasClaro.push([b, "#fff", cla]);
  }
  lombadaSvg.push(poligono(contL, `fill="url(#${gradienteAtravessado(k, paradasEscuro)})"`));
  // O brilho é mais forte na cabeça (mais perto da janela) e cai para o pé.
  const mBrilho = mascaraAoLongo(k, [
    [0, "#fff", 1],
    [k.comp * 0.5, "#fff", 0.8],
    [k.comp, "#fff", 0.55],
  ]);
  lombadaSvg.push(`<g mask="url(#${mBrilho})">${poligono(contL, `fill="url(#${gradienteAtravessado(k, paradasClaro)})"`)}</g>`);

  // 4. As pontas: a cabeça (à esquerda) vira para a janela e clareia na dobra; o pé fecha em sombra.
  lombadaSvg.push(
    poligono(
      contL,
      `fill="url(#${gradienteAoLongo(k, [
        [0, "#fff", 0.16],
        [RECOLHIDO + 1.2, "#fff", 0.1],
        [RECOLHIDO + 4, "#fff", 0],
        [k.comp - RECOLHIDO - 6, "#000", 0],
        [k.comp - RECOLHIDO - 1.5, "#000", 0.12],
        [k.comp, "#000", 0.26],
      ])})"`,
    ),
  );
  frenteSvg.push(`<g clip-path="url(#${recLombada})">${lombadaSvg.join("")}</g>`);
  // A lombada fica um nadinha à frente dos fios: um risco de sombra onde ela encontra cada um.
  frenteSvg.push(poligono(faixaFrente(k, k.fio - 0.4, k.fio + 1.1, RECOLHIDO, k.comp - RECOLHIDO), `fill="#000" fill-opacity="0.18" filter="url(#${desfoque(0.5)})"`));
  frenteSvg.push(poligono(faixaFrente(k, k.esp - k.fio - 0.9, k.esp - k.fio + 0.3, RECOLHIDO, k.comp - RECOLHIDO), `fill="#000" fill-opacity="0.1" filter="url(#${desfoque(0.5)})"`));

  // 5. Oclusão nas frestas: embaixo, onde ele pousa no livro de baixo (ou na prateleira); em cima,
  //    onde o de cima pousa nele. Só onde de fato encosta, com as pontas esmaecendo.
  const [a0b, a1b] = abaixo ? sobreposicao(k, abaixo) : [-10, k.comp + 10];
  frenteSvg.push(poligono(faixaFrente(k, -8, 16, a0b + 5, a1b - 5), `fill="#000" fill-opacity="0.3" filter="url(#${desfoque(5.5)})"`));
  frenteSvg.push(poligono(faixaFrente(k, -3, 3.4, a0b + 2, a1b - 2), `fill="#000" fill-opacity="0.34" filter="url(#${desfoque(1.3)})"`));
  if (acima) {
    frenteSvg.push(poligono(faixaFrente(k, k.esp - 12, k.esp + 8, a0c + 5, a1c - 5), `fill="#000" fill-opacity="0.2" filter="url(#${desfoque(4)})"`));
    frenteSvg.push(poligono(faixaFrente(k, k.esp - 2.2, k.esp + 3, a0c + 2, a1c - 2), `fill="#000" fill-opacity="0.24" filter="url(#${desfoque(1)})"`));
    // Onde o livro de cima avança sobre este, a sombra dele cai no alto da lombada.
    const sombraAvanco = [];
    const topo = [];
    const passos = 24;
    for (let i = 0; i <= passos; i++) {
      const a = a0c + ((a1c - a0c) * i) / passos;
      const x = k.x0 + a;
      const o = zDoFio(acima, x) - zDoFio(k, x); // > 0: o de cima está mais à frente
      const d = Math.max(0, o) / (1 + LUZ[2] / LUZ[1]);
      sombraAvanco.push(P(frente(k, a, k.esp - k.fio - d)));
      topo.push(P(frente(k, a, k.esp + 3)));
    }
    frenteSvg.push(poligono([...sombraAvanco, ...topo.reverse()], `fill="#000" fill-opacity="0.3" filter="url(#${desfoque(1.2)})"`));
  }

  partes.push(`<g clip-path="url(#${recFrente})">${frenteSvg.join("")}</g>`);
  return { svg: partes.join("\n"), contFrente, contCapa };
}

// ---------- montagem ----------

pr.add(prateleira());
const contornos = [];
for (const k of LIVROS) {
  const r = umLivro(k);
  pr.add(r.svg);
  contornos.push(r.contFrente, r.contCapa);
}

// Por cima de tudo: o grão do papel e a queda da luz, mais fraca embaixo e à direita (longe da janela).
const recPilha = pr.id("pilha");
pr.def(`<clipPath id="${recPilha}" clipPathUnits="userSpaceOnUse">${contornos.map((c) => `<polygon points="${pontos(c)}"/>`).join("")}</clipPath>`);
const cx = limites(contornos.flat());
const grao = filtroGrao(pr, { base: 1.05, oitavas: 2, alfa: 0.065, semente: 5 });
const gQueda = gradiente(pr, [cx[0], cx[1]], [cx[2], cx[3]], [
  [0, "#000", 0],
  [0.5, "#000", 0.025],
  [1, "#000", 0.09],
]);
const retPilha = `x="${n(cx[0] - 2)}" y="${n(cx[1] - 2)}" width="${n(cx[2] - cx[0] + 4)}" height="${n(cx[3] - cx[1] + 4)}"`;
pr.add(`<g clip-path="url(#${recPilha})"><rect ${retPilha} filter="url(#${grao})"/><rect ${retPilha} fill="url(#${gQueda})"/></g>`);

const saida = fileURLToPath(new URL("./p08-pilha.svg", import.meta.url));
pr.salvar(saida);
console.log("✓", saida);
