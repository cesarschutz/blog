#!/usr/bin/env node
/**
 * Prancha 09 · «A revista»
 *
 * A revista da série «Atualizações do Java» como uma revista de verdade, deitada na mesa: capa de
 * papel couché fino e flexível, com o reflexo de uma janela; lombada quadrada com a arte de
 * lombadaDaRevista(); miolo de folhas finas com o corte à vista no pé. A ponta da frente-baixo da
 * capa está levemente levantada e deixa ver as primeiras folhas por baixo, que sobem um pouco junto
 * com ela, em leque.
 *
 *   fnm exec --using=24 node pranchas/p09-revista.mjs  →  pranchas/p09-revista.svg
 *
 * Mundo (unidades da referência, 1 ≈ 0,32 mm): x da lombada (0) para a frente da revista (480),
 * y da mesa para cima, z do pé (0) para a cabeça (−720). A revista gira no plano da mesa (GIRO) e a
 * câmera, longe e alta, olha de frente (teleobjetiva: perspectiva fraca).
 *
 * A ponta levantada é um cilindro generalizado: cada ponto da capa além da linha de dobra sobe por um
 * perfil medido pelo comprimento de arco. Papel não estica, e essa superfície se desenrola no plano
 * sem esticar nada: a arte da capa entra inteira, só dobrada, como o papel de verdade.
 */
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { REVISTA, capaDaRevista, lombadaDaRevista } from "../base/base.mjs";
import {
  Prancha, camera, enquadrar, girarY, soma, sub, mul, dot, normal, lerp, limitar, suave, aleatorio,
  afim, matriz, pontos, area, gradiente, recortePoligono, filtroDesfoque, filtroGrao, n,
} from "../ferramentas/cena.mjs";

// ---------- medidas e pose ----------

const W = 480; // largura da capa
const H = 720; // altura da capa
/**
 * Espessura da revista. Os 80 da lombada do site dariam 26 mm: um livro, não uma revista. Uma revista
 * técnica grossa, de umas 250 páginas em couché, tem 12 a 14 mm: 40 unidades. A arte da lombada
 * (80 de largura) é escalada só na largura para caber nos 40, como a lombada de verdade dessa revista;
 * na pose a lombada aparece de raspão e a compressão não se percebe.
 */
const T = 36;
const C = 1; // espessura da capa (couché de uns 250 g, 0,3 mm)
const FOLHA = 0.3; // uma folha do miolo (couché de 90 g, 0,1 mm)
const GIRO = 20; // giro no plano da mesa: a cabeça vai para a esquerda e a lombada vira para nós
const ELEVACAO = 55; // altura da câmera, em graus acima da mesa
const DISTANCIA = 5200; // olho longe: teleobjetiva

/** Luz principal: uma janela grande no alto, à esquerda e um pouco atrás (direção PARA a luz). */
const LUZ = normal([-0.52, 0.74, -0.42]);
/** Rebatedor fraco do lado da câmera, à direita. */
const REBATE = normal([0.35, 0.45, 0.82]);

/**
 * A abertura da frente: numa revista de lombada quadrada as folhas não assentam perfeitamente, e a
 * frente fica um pouco mais alta que a lombada (aqui 2,5, uns 0,8 mm). Uma inclinação linear da
 * altura com x, de zero na mesa até o alto.
 */
const ABERTURA = 2.5;
const abrir = ([x, y, z]) => [x, y + (y / T) * ABERTURA * (x / W), z];

const CENTRO = [W / 2, 0, -H / 2];
/** Do espaço da revista para o mundo: a abertura e o giro no plano da mesa. */
const g = (p) => girarY(abrir(p), GIRO, CENTRO);
/** Direção do mundo de um vetor do espaço da revista (só o giro). */
const dirMundo = (v) => girarY(v, GIRO, [0, 0, 0]);

// Papéis (materiais, não o design): o corte do couché é branco, um pouco quente.
const BRANCO_FOLHA = "#f6f3ec";
const BRANCO_CORTE = "#f8f6f1";

// ---------- a prancha e a câmera ----------

const pr = new Prancha({
  prefixo: "p09",
  largura: 1200,
  altura: 950,
  titulo: "A revista: Atualizações do Java",
  descricao:
    "A revista da série Atualizações do Java deitada na mesa, em papel couché com brilho, lombada quadrada e a ponta da capa levemente levantada mostrando as folhas finas por baixo.",
});

const artCapa = pr.simbolo(capaDaRevista(), { largura: W, altura: H, nome: "capa" });
const artLombada = pr.simbolo(lombadaDaRevista({ altura: H }), { largura: REVISTA.largura, altura: H, nome: "lombada" });

const el = (ELEVACAO * Math.PI) / 180;
const alvo = [W / 2, T / 2, -H / 2];
const olho = soma(alvo, mul([0, Math.sin(el), Math.cos(el)], DISTANCIA));
const cam = camera({ olho, alvo, focal: 1000, centro: [600, 475] });
/** Olhar (do objeto para a câmera), para o especular. */
const VISTA = normal(sub(olho, alvo));

// ---------- a dobra da ponta (cilindro generalizado) ----------

/**
 * Uma dobra na ponta da frente-baixo de uma folha (capa ou folha do miolo) de W × H, com a base na
 * altura `y0`. A linha de dobra corta o canto: sai do pé a `a` do canto e da frente a `b` do canto.
 * Além dela, a folha sobe pelo perfil β(s) = βmax·(s/S)^p (s: distância à dobra, medida no papel),
 * que começa sem curvatura (a emenda com a parte plana é lisa) e curva mais perto da ponta.
 */
function criarDobra({ a, b, beta, p = 1.6, y0 }) {
  const L = Math.hypot(a, b);
  const F1 = [W - a, H]; // no pé
  const F2 = [W, H - b]; // na frente
  const d = [a / L, -b / L]; // ao longo da dobra (de F1 para F2), na arte
  const m = [b / L, a / L]; // atravessando a dobra, rumo ao canto
  const S = (a * b) / L; // do canto à dobra
  const bmax = (beta * Math.PI) / 180;
  // O perfil, integrado: x(s) (avanço no plano) e h(s) (altura).
  const N = 800;
  const X = [0];
  const Y = [0];
  const B = [0];
  for (let i = 1; i <= N; i++) {
    const s0 = ((i - 1) / N) * S;
    const s1 = (i / N) * S;
    const bm = bmax * Math.pow((s0 + s1) / 2 / S, p);
    X.push(X[i - 1] + Math.cos(bm) * (s1 - s0));
    Y.push(Y[i - 1] + Math.sin(bm) * (s1 - s0));
    B.push(bmax * Math.pow(s1 / S, p));
  }
  const perfil = (s) => {
    if (s <= 0) return [s, 0, 0];
    const k = Math.min(N - 1e-9, (s / S) * N);
    const i = Math.floor(k);
    const f = k - i;
    return [X[i] + (X[i + 1] - X[i]) * f, Y[i] + (Y[i + 1] - Y[i]) * f, B[i] + (B[i + 1] - B[i]) * f];
  };
  const sDe = (u, v) => (u - F1[0]) * m[0] + (v - F1[1]) * m[1];
  /** O ponto 3D (espaço da revista) do ponto (u, v) da arte. */
  const P = (u, v) => {
    const s = sDe(u, v);
    if (s <= 0) return [u, y0, -H + v];
    const q = [u - s * m[0], v - s * m[1]];
    const [x, h] = perfil(s);
    return [q[0] + m[0] * x, y0 + h, -H + q[1] + m[1] * x];
  };
  /** A normal (para cima) na distância s, já no mundo. */
  const normalEm = (s) => {
    const bt = perfil(s)[2];
    return normal(dirMundo([-Math.sin(bt) * m[0], Math.cos(bt), -Math.sin(bt) * m[1]]));
  };
  /** O intervalo de t (ao longo da dobra) dentro da folha, na distância s. */
  const faixaT = (s) => [(s * a) / b, L - (s * b) / a];
  const ponto = (t, s) => [F1[0] + t * d[0] + s * m[0], F1[1] + t * d[1] + s * m[1]];
  return { a, b, L, F1, F2, d, m, S, perfil, sDe, P, normalEm, faixaT, ponto, y0 };
}

// ---------- geometria da malha ----------

/** Recorta um polígono convexo pelo semiplano f(u, v) ≤ 0 (Sutherland–Hodgman). */
function recortar(poligono, f) {
  const saida = [];
  for (let i = 0; i < poligono.length; i++) {
    const A = poligono[i];
    const B = poligono[(i + 1) % poligono.length];
    const fa = f(A[0], A[1]);
    const fb = f(B[0], B[1]);
    if (fa <= 0) saida.push(A);
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
      const t = fa / (fa - fb);
      saida.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]);
    }
  }
  return saida;
}

/** Triângulos (leque) de um polígono convexo. */
const leque = (ps) => {
  const tris = [];
  for (let i = 1; i < ps.length - 1; i++) tris.push([ps[0], ps[i], ps[i + 1]]);
  return tris;
};

/** Alarga um polígono convexo `d` px para fora, deslocando cada aresta (com limite no bico). */
function inflar(ps, d) {
  const sentido = area(ps) > 0 ? 1 : -1;
  const k = ps.length;
  const linhas = ps.map((A, i) => {
    const B = ps[(i + 1) % k];
    const dx = B[0] - A[0];
    const dy = B[1] - A[1];
    const l = Math.hypot(dx, dy) || 1;
    // normal para fora (y da tela para baixo; área positiva = sentido horário)
    const nx = (sentido * dy) / l;
    const ny = (sentido * -dx) / l;
    return { A: [A[0] + nx * d, A[1] + ny * d], dx, dy, nx, ny };
  });
  return ps.map((P0, i) => {
    const l1 = linhas[(i - 1 + k) % k];
    const l2 = linhas[i];
    const det = l1.dx * l2.dy - l1.dy * l2.dx;
    if (Math.abs(det) < 1e-9) return [P0[0] + l2.nx * d, P0[1] + l2.ny * d];
    const t = ((l2.A[0] - l1.A[0]) * l2.dy - (l2.A[1] - l1.A[1]) * l2.dx) / det;
    let q = [l1.A[0] + l1.dx * t, l1.A[1] + l1.dy * t];
    const off = Math.hypot(q[0] - P0[0], q[1] - P0[1]);
    if (off > 3 * d) q = [P0[0] + ((q[0] - P0[0]) * 3 * d) / off, P0[1] + ((q[1] - P0[1]) * 3 * d) / off];
    return q;
  });
}

/**
 * Mapeia a arte `ref` nos triângulos da arte (em u, v) levados à tela por P (espaço da revista):
 * cada triângulo com a sua afim exata nos três cantos, recortado pelo triângulo da tela um pouco
 * inflado (contra a costura). Os vistos por trás somem.
 */
function mapear(ref, triangulos, P, { folga = 1.5 } = {}) {
  const partes = [];
  for (let tri of triangulos) {
    if (Math.abs(area(tri)) < 1e-6) continue;
    if (area(tri) < 0) tri = [tri[0], tri[2], tri[1]];
    const tela = tri.map(([u, v]) => cam.p(g(P(u, v))));
    if (area(tela) <= 0) continue;
    const mtx = afim(tri, tela);
    if (!mtx.every(Number.isFinite)) continue;
    const id = pr.id("tri");
    pr.def(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><polygon points="${pontos(inflar(tela, folga))}"/></clipPath>`);
    partes.push(`<g clip-path="url(#${id})"><use href="#${ref}" transform="${matriz(mtx)}"/></g>`);
  }
  return partes.join("");
}

/** Projeção de um ponto do espaço da revista. */
const tela = (p) => cam.p(g(p));

// ---------- a capa, as folhas em leque e a lombada ----------

const DOBRA = { a: 210, b: 255, beta: 48, p: 1.9 };
const capa = criarDobra({ ...DOBRA, y0: T });

/** As primeiras folhas do miolo sobem junto, menos que a capa: a dobra começa mais perto do canto. */
const FOLHAS = [
  { recuo: 4, fator: 0.6 },
  { recuo: 8, fator: 0.46 },
  { recuo: 13, fator: 0.34 },
  { recuo: 18, fator: 0.24 },
  { recuo: 24, fator: 0.15 },
  { recuo: 31, fator: 0.08 },
].map(({ recuo, fator }, i) => {
  const k = (capa.S - recuo) / capa.S; // a dobra paralela, mais perto do canto
  return criarDobra({ a: DOBRA.a * k, b: DOBRA.b * k, beta: DOBRA.beta * fator, p: DOBRA.p, y0: T - C - i * FOLHA });
});

// A malha da capa: a parte plana em células de 60 (recortadas na dobra) e a ponta em faixas
// paralelas à dobra (cada faixa é plana no 3D, porque as geratrizes do cilindro são paralelas).
const triCapa = [];
{
  const nu = 8;
  const nv = 12;
  for (let j = 0; j < nv; j++)
    for (let i = 0; i < nu; i++) {
      const u0 = (W * i) / nu;
      const u1 = (W * (i + 1)) / nu;
      const v0 = (H * j) / nv;
      const v1 = (H * (j + 1)) / nv;
      const celula = recortar(
        [
          [u0, v0],
          [u1, v0],
          [u1, v1],
          [u0, v1],
        ],
        (u, v) => capa.sDe(u, v),
      );
      if (celula.length >= 3) triCapa.push(...leque(celula));
    }
}
/** As faixas da ponta de uma dobra: `ns` faixas em s e `nt` pedaços em t. */
function malhaDaPonta(dobra, ns = 30, nt = 8) {
  const tris = [];
  const linha = (s) => {
    const [t0, t1] = dobra.faixaT(s);
    return Array.from({ length: nt + 1 }, (_, i) => dobra.ponto(lerp([t0], [t1], i / nt)[0], s));
  };
  for (let j = 0; j < ns; j++) {
    const s0 = (dobra.S * j) / ns;
    const s1 = (dobra.S * (j + 1)) / ns;
    const A = linha(s0);
    const B = linha(s1);
    for (let i = 0; i < nt; i++) {
      tris.push([A[i], A[i + 1], B[i + 1]]);
      tris.push([A[i], B[i + 1], B[i]]);
    }
  }
  return tris;
}
triCapa.push(...malhaDaPonta(capa, 32, 8));

/** O contorno de uma folha com dobra, na tela (a ponta amostrada pelo pé e pela frente). */
function contornoDaFolha(dobra, { amostras = 40 } = {}) {
  const ps = [];
  const P = (u, v) => tela(dobra.P(u, v));
  ps.push(P(0, 0), P(W, 0));
  for (let i = 0; i <= amostras; i++) ps.push(P(W, H - dobra.b + (dobra.b * i) / amostras));
  for (let i = 1; i <= amostras; i++) ps.push(P(W - (dobra.a * i) / amostras, H));
  ps.push(P(0, H));
  return ps;
}
/** Só a ponta (além da dobra), na tela. */
function contornoDaPonta(dobra, { amostras = 40 } = {}) {
  const ps = [];
  const P = (u, v) => tela(dobra.P(u, v));
  for (let i = 0; i <= amostras; i++) ps.push(P(W - dobra.a + (dobra.a * i) / amostras, H)); // pé, rumo ao canto
  for (let i = 1; i <= amostras; i++) ps.push(P(W, H - (dobra.b * i) / amostras)); // frente, rumo à dobra
  return ps;
}

// ---------- luz ----------

const CIMA = [0, 1, 0];
/**
 * Claridade de uma normal (mundo): ambiente, luz principal, rebatedor e o rebote da mesa clara, que
 * só as faces em pé enxergam (metade do céu delas é a mesa).
 */
const claridade = (N) => 0.62 + 0.45 * Math.max(0, dot(N, LUZ)) + 0.1 * Math.max(0, dot(N, REBATE)) + 0.09 * (1 - Math.abs(N[1]));
const CLARO_CAPA = claridade(CIMA);
/** Camada de luz relativa à capa plana: preto onde fica mais escuro, branco onde fica mais claro. */
const relativa = (N) => claridade(N) / CLARO_CAPA;

/**
 * O gradiente de uma grandeza que só muda com s (a distância à dobra), na tela: as geratrizes são
 * paralelas, então basta um gradiente linear perpendicular a elas, com as paradas nas posições em
 * que cada geratriz cai. `valor(s)` → [cor, opacidade].
 */
function gradienteDaPonta(dobra, valor, amostras = 48) {
  const L = dobra.L;
  const pT = (t, s) => tela(dobra.P(...dobra.ponto(t, s)));
  const a = pT(L / 2, 0);
  const b = pT(L / 2 + 10, 0);
  const gx = b[0] - a[0];
  const gy = b[1] - a[1];
  const gl = Math.hypot(gx, gy);
  let px = -gy / gl;
  let py = gx / gl;
  const canto = tela(dobra.P(W, H));
  if ((canto[0] - a[0]) * px + (canto[1] - a[1]) * py < 0) {
    px = -px;
    py = -py;
  }
  const amostrasS = Array.from({ length: amostras + 1 }, (_, i) => (dobra.S * i) / amostras);
  const pos = amostrasS.map((s) => {
    const [t0, t1] = dobra.faixaT(s);
    const q = pT((t0 + t1) / 2, s);
    return (q[0] - a[0]) * px + (q[1] - a[1]) * py;
  });
  const min = Math.min(0, ...pos);
  const max = Math.max(...pos);
  const paradas = amostrasS
    .map((s, i) => {
      const [cor, op] = valor(s);
      return [n(((pos[i] - min) / (max - min)) * 1000) / 1000, cor, n(op * 1000) / 1000];
    })
    .sort((x, y) => x[0] - y[0]);
  return gradiente(pr, [a[0] + px * min, a[1] + py * min], [a[0] + px * max, a[1] + py * max], paradas);
}

// ---------- enquadramento ----------

{
  const pts = [];
  for (const x of [0, W]) for (const z of [0, -H]) for (const y of [0, T]) pts.push(g([x, y, z]));
  pts.push(g(capa.P(W, H)));
  enquadrar(cam, pts, [160, 75, 830, 790]);
}

// ---------- sombras na mesa ----------

/** Envoltória convexa (cadeia monótona). */
function envoltoria(ps) {
  const q = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const baixo = [];
  for (const p of q) {
    while (baixo.length >= 2 && cruz(baixo[baixo.length - 2], baixo[baixo.length - 1], p) <= 0) baixo.pop();
    baixo.push(p);
  }
  const cima = [];
  for (const p of q.reverse()) {
    while (cima.length >= 2 && cruz(cima[cima.length - 2], cima[cima.length - 1], p) <= 0) cima.pop();
    cima.push(p);
  }
  return [...baixo.slice(0, -1), ...cima.slice(0, -1)];
}
/** Projeta um ponto do mundo na mesa (y = 0) ao longo da luz. */
const naMesa = (p) => sub(p, mul(LUZ, p[1] / LUZ[1]));

const pegada = [
  [0, 0, 0],
  [W, 0, 0],
  [W, 0, -H],
  [0, 0, -H],
].map((p) => cam.p(g(p)));
{
  // A sombra projetada: o contorno do alto (com a ponta levantada) levado à mesa pela luz.
  const alto = [];
  for (const [u, v] of [
    [0, 0],
    [W, 0],
    [0, H],
  ])
    alto.push(g(capa.P(u, v)));
  for (let i = 0; i <= 24; i++) alto.push(g(capa.P(W - capa.a + (capa.a * i) / 24, H)), g(capa.P(W, H - (capa.b * i) / 24)));
  const projetada = envoltoria([...alto.map((p) => cam.p(naMesa(p))), ...pegada]);

  const camadas = [];
  // Oclusão ambiente: larga e fraca, em volta de tudo.
  camadas.push(`<polygon points="${pontos(pegada)}" fill="#000" fill-opacity="0.10" filter="url(#${filtroDesfoque(pr, 26)})" transform="translate(4 10)"/>`);
  // Meia-sombra: a sombra projetada pela janela, macia (a janela é grande).
  camadas.push(`<polygon points="${pontos(projetada)}" fill="#000" fill-opacity="0.13" filter="url(#${filtroDesfoque(pr, 9)})"/>`);
  camadas.push(`<polygon points="${pontos(projetada)}" fill="#000" fill-opacity="0.08" filter="url(#${filtroDesfoque(pr, 3.5)})"/>`);
  // Contato: justo e mais escuro, onde a revista encosta na mesa.
  camadas.push(`<polygon points="${pontos(pegada)}" fill="#000" fill-opacity="0.34" filter="url(#${filtroDesfoque(pr, 1.1)})" transform="translate(0.4 0.8)"/>`);
  pr.add(`<g>${camadas.join("")}</g>`);
}

// ---------- o pé (corte das folhas) ----------

{
  const pe = [
    [0, 0, 0],
    [W, 0, 0],
    [W, T, 0],
    [0, T, 0],
  ].map(tela);
  const partes = [];
  partes.push(`<polygon points="${pontos(pe)}" fill="${BRANCO_FOLHA}"/>`);
  // O corte do couché é quase liso: uma estria fina e comprida (ruído esticado ao longo do pé, girado
  // com ele), por baixo das linhas das folhas.
  {
    const A = tela([0, 0, 0]);
    const B = tela([W, 0, 0]);
    const angulo = (Math.atan2(B[1] - A[1], B[0] - A[0]) * 180) / Math.PI;
    const idEstria = pr.id("estria");
    pr.def(
      `<filter id="${idEstria}" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.17  0 0 0 0 0.14  0 0 0 0.16 0"/></filter>`,
    );
    const rc = recortePoligono(pr, pe);
    partes.push(
      `<g clip-path="url(#${rc})"><g transform="rotate(${n(angulo)} ${n(A[0])} ${n(A[1])})"><rect x="${n(A[0] - 40)}" y="${n(A[1] - 60)}" width="${n(Math.hypot(B[0] - A[0], B[1] - A[1]) + 80)}" height="90" filter="url(#${idEstria})"/></g></g>`,
    );
  }
  // As folhas: linhas finas ao longo do pé, com o tom e a espessura variando; um fio um pouco mais
  // marcado a cada caderno (as revistas de lombada quadrada são cadernos colados).
  const rnd = aleatorio(909);
  const linhas = [];
  const topoDoMiolo = T - C;
  const quantas = 84;
  for (let i = 1; i < quantas; i++) {
    const y = C + ((topoDoMiolo - C) * (i + (rnd() - 0.5) * 0.7)) / quantas;
    const caderno = i % 12 === 0;
    const op = caderno ? 0.11 + rnd() * 0.04 : 0.03 + rnd() * 0.05;
    const lw = caderno ? 0.45 : 0.22 + rnd() * 0.2;
    // leve ondulação: as folhas não são perfeitamente retas no corte
    const ps = [];
    const passos = 10;
    const fase = rnd() * 6.28;
    for (let k = 0; k <= passos; k++) {
      const x = (W * k) / passos;
      const dy = Math.sin(fase + k * 0.9) * 0.12;
      ps.push(tela([x, y + dy, 0]));
    }
    linhas.push(`<polyline points="${pontos(ps)}" fill="none" stroke="#3a3128" stroke-opacity="${n(op * 1000) / 1000}" stroke-width="${n(lw)}"/>`);
  }
  partes.push(linhas.join(""));
  // As bordas das capas: o corte do couché, mais branco, com um fio de sombra onde a capa assenta.
  const faixa = (y0, y1, x0 = 0, x1 = W) => [
    [x0, y0, 0],
    [x1, y0, 0],
    [x1, y1, 0],
    [x0, y1, 0],
  ].map(tela);
  partes.push(`<polygon points="${pontos(faixa(0, C))}" fill="${BRANCO_CORTE}"/>`);
  partes.push(`<polygon points="${pontos(faixa(T - C, T, 0, W - capa.a))}" fill="${BRANCO_CORTE}"/>`);
  const fio = (y, x0, x1, op, lw) => {
    const A = tela([x0, y, 0]);
    const B = tela([x1, y, 0]);
    return `<line x1="${n(A[0])}" y1="${n(A[1])}" x2="${n(B[0])}" y2="${n(B[1])}" stroke="#000" stroke-opacity="${op}" stroke-width="${lw}"/>`;
  };
  partes.push(fio(T - C, 0, W - capa.a, 0.18, 0.5), fio(C, 0, W, 0.14, 0.45));
  // Luz: o pé encara a câmera e foge da janela; claridade só do ambiente e do rebatedor.
  const Npe = dirMundo([0, 0, 1]);
  const rel = relativa(Npe);
  const gPe = gradiente(pr, tela([0, T / 2, 0]), tela([W, T / 2, 0]), [
    [0, "#000", n((1 - rel - 0.03) * 1000) / 1000],
    [1, "#000", n((1 - rel + 0.04) * 1000) / 1000],
  ]);
  partes.push(`<polygon points="${pontos(pe)}" fill="url(#${gPe})"/>`);
  pr.add(`<g>${partes.join("")}</g>`);
}

// ---------- a lombada ----------

{
  const k = T / REVISTA.largura; // a arte (80 de largura) cabe na espessura
  const P = (u, v) => [0, u * k, -H + v];
  const tris = [];
  const nv = 12;
  for (let j = 0; j < nv; j++) {
    const v0 = (H * j) / nv;
    const v1 = (H * (j + 1)) / nv;
    tris.push(
      [
        [0, v0],
        [REVISTA.largura, v0],
        [REVISTA.largura, v1],
      ],
      [
        [0, v0],
        [REVISTA.largura, v1],
        [0, v1],
      ],
    );
  }
  const face = [
    [0, 0, 0],
    [0, T, 0],
    [0, T, -H],
    [0, 0, -H],
  ].map(tela);
  const partes = [mapear(artLombada, tris, P)];
  const rel = relativa(dirMundo([-1, 0, 0]));
  const gL = gradiente(pr, tela([0, T / 2, -H]), tela([0, T / 2, 0]), [
    [0, "#000", n((1 - rel - 0.02) * 1000) / 1000],
    [1, "#000", n((1 - rel + 0.03) * 1000) / 1000],
  ]);
  partes.push(`<polygon points="${pontos(face)}" fill="url(#${gL})"/>`);
  // A quina da dobra da capa na lombada pega a luz da janela: um fio claro.
  const A = tela([0, T, -H]);
  const B = tela([0, T, 0]);
  partes.push(`<line x1="${n(A[0])}" y1="${n(A[1])}" x2="${n(B[0])}" y2="${n(B[1])}" stroke="#fff" stroke-opacity="0.55" stroke-width="0.8"/>`);
  pr.add(`<g>${partes.join("")}</g>`);
}

// ---------- o vão sob a ponta: miolo e folhas em leque ----------

{
  const partes = [];
  // O alto do miolo, no canto, no fundo do vão (na sombra da capa).
  const fundo = criarDobra({ ...DOBRA, beta: 0, y0: T - C - FOLHAS.length * FOLHA });
  const cantoFundo = contornoDaPonta(fundo);
  partes.push(`<polygon points="${pontos(cantoFundo)}" fill="${BRANCO_FOLHA}"/>`);
  partes.push(`<polygon points="${pontos(cantoFundo)}" fill="#000" fill-opacity="0.32"/>`);
  // As folhas, da mais baixa para a mais alta: cada uma na sombra da de cima (mais funda perto da
  // dobra, onde o vão fecha) e mais clara na borda, por onde entra a luz do rebatedor.
  for (let i = FOLHAS.length - 1; i >= 0; i--) {
    const f = FOLHAS[i];
    const ponta = contornoDaPonta(f);
    partes.push(`<polygon points="${pontos(ponta)}" fill="${BRANCO_FOLHA}"/>`);
    const gF = gradienteDaPonta(f, (s) => ["#000", 0.3 - 0.2 * suave(0, f.S, s)]);
    partes.push(`<polygon points="${pontos(ponta)}" fill="url(#${gF})"/>`);
    // O corte da folha, no pé: um fio branco (o corte pega a luz), com um fio de sombra logo acima,
    // o vão até a folha de cima.
    const borda = [];
    const sombraDoVao = [];
    for (let k = 0; k <= 30; k++) {
      const u = W - f.a + (f.a * k) / 30;
      borda.push(tela(f.P(u, H)));
      const q = f.P(u, H);
      sombraDoVao.push(tela([q[0], q[1] + FOLHA * 0.9, q[2]]));
    }
    partes.push(`<polyline points="${pontos(sombraDoVao)}" fill="none" stroke="#000" stroke-opacity="0.18" stroke-width="0.4"/>`);
    partes.push(`<polyline points="${pontos(borda)}" fill="none" stroke="#fff" stroke-opacity="0.85" stroke-width="0.5"/>`);
  }
  pr.add(`<g>${partes.join("")}</g>`);
}

// ---------- a capa ----------

// Tinta no couché: um pouco mais funda que no papel fosco (sem o véu branco do fosco). Uma curva de
// gama leve, igual nos três canais: escurece os meios-tons, não mexe no branco nem no matiz.
const idTinta = pr.id("tinta");
pr.def(
  `<filter id="${idTinta}" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="gamma" exponent="1.07"/><feFuncG type="gamma" exponent="1.07"/><feFuncB type="gamma" exponent="1.07"/></feComponentTransfer></filter>`,
);
const contornoCapa = contornoDaFolha(capa);
// Por baixo das células, o papel da capa: se a prancha for mostrada pequena e a emenda entre duas
// células deixar passar meio pixel, aparece papel, e não a sombra que está embaixo da revista.
pr.add(`<g filter="url(#${idTinta})"><polygon points="${pontos(contornoCapa)}" fill="${REVISTA.papel}"/>${mapear(artCapa, triCapa, capa.P)}</g>`);
const contornoPonta = contornoDaPonta(capa);
const planoCapa = [capa.F1, [0, H], [0, 0], [W, 0], capa.F2].map(([u, v]) => tela(capa.P(u, v)));
{
  const partes = [];
  // Queda da luz da janela: mais claro perto dela (alto, à esquerda), um pouco mais escuro longe.
  const gQueda = gradiente(pr, tela([0, T, -H]), tela([W, T, 0]), [
    [0, "#fff", 0.05],
    [0.32, "#fff", 0],
    [0.66, "#000", 0.028],
    [1, "#000", 0.075],
  ]);
  partes.push(`<polygon points="${pontos(contornoCapa)}" fill="url(#${gQueda})"/>`);

  // A ponta levantada: a face que sobe olha para a janela (clareia) e o especular da janela corre
  // pela curva como um fio (a curva comprime o reflexo).
  const gPonta = gradienteDaPonta(capa, (s) => {
    const r = relativa(capa.normalEm(s));
    return r >= 1 ? ["#fff", Math.min(0.5, (r - 1) * 1.1)] : ["#000", Math.min(0.5, 1 - r)];
  });
  partes.push(`<polygon points="${pontos(contornoPonta)}" fill="url(#${gPonta})"/>`);

  // O vinco da dobradiça, a 20 da lombada: um sulco raso (lado escuro virado para longe da luz).
  const vinco = (du, cor, op, lw) => {
    const A = tela(capa.P(20 + du, 0));
    const B = tela(capa.P(20 + du, H));
    return `<line x1="${n(A[0])}" y1="${n(A[1])}" x2="${n(B[0])}" y2="${n(B[1])}" stroke="${cor}" stroke-opacity="${op}" stroke-width="${lw}"/>`;
  };
  partes.push(vinco(-0.6, "#000", 0.07, 0.9), vinco(0.8, "#fff", 0.16, 0.9));

  // Grão do couché: muito fino e fraco (o couché é liso).
  const idGrao = filtroGrao(pr, { base: 1.3, oitavas: 2, alfa: 0.04, semente: 9 });
  const rc = recortePoligono(pr, contornoCapa);
  partes.push(`<g clip-path="url(#${rc})"><rect x="0" y="0" width="1200" height="950" filter="url(#${idGrao})"/></g>`);
  pr.add(`<g>${partes.join("")}</g>`);
}

// ---------- o brilho do couché ----------

{
  const partes = [];
  // A janela refletida: uma faixa larga na diagonal (de baixo à esquerda para cima à direita). A
  // borda de cima é o caixilho, mais definida; a de baixo se perde devagar. As bordas são retas na
  // janela e saem com um arco levíssimo, porque a capa não é um plano perfeito. Camadas desfocadas,
  // e não um gradiente linear: a transição fica com cara de lente, não de CSS.
  const borda = (v0, v1, arco = 5) => {
    const ps = [];
    for (let i = 0; i <= 24; i++) {
      const u = (W * i) / 24;
      ps.push([u, v0 + (v1 - v0) * (i / 24) + arco * Math.sin((Math.PI * i) / 24)]);
    }
    return ps;
  };
  const faixa = (desde, ate) => {
    const cima = borda(...desde);
    const baixo = borda(...ate).reverse();
    return [...cima, ...baixo].map(([u, v]) => tela(capa.P(u, v)));
  };
  const E1 = [590, 150]; // o caixilho: v no lombo e na frente
  const desloca = ([a, b], d) => [a + d, b + d];
  const rp = recortePoligono(pr, planoCapa);
  const camadasBrilho = [
    { de: desloca(E1, -60), ate: E1, op: 0.03, desvio: 22 }, // halo acima do caixilho
    { de: E1, ate: desloca(E1, 46), op: 0.1, desvio: 2.2 }, // a borda definida
    { de: desloca(E1, 6), ate: desloca(E1, 170), op: 0.09, desvio: 11 }, // o corpo da janela
    { de: desloca(E1, 40), ate: desloca(E1, 280), op: 0.053, desvio: 30 }, // a luz se perdendo
  ];
  partes.push(
    `<g clip-path="url(#${rp})">${camadasBrilho
      .map((c) => `<polygon points="${pontos(faixa(c.de, c.ate))}" fill="#fff" fill-opacity="${c.op}" filter="url(#${filtroDesfoque(pr, c.desvio)})"/>`)
      .join("")}</g>`,
  );

  // O fio de brilho na curva: a normal da ponta passa pela meia direção entre a janela e a câmera.
  // A janela é comprida ao longo da dobra, então o reflexo é uma linha paralela à dobra.
  const Hm = normal(soma(LUZ, VISTA));
  const eixoM = normal(dirMundo([capa.m[0], 0, capa.m[1]]));
  const eixoD = normal(dirMundo([capa.d[0], 0, capa.d[1]]));
  // Só a parte da meia direção no plano da curva (a janela longa cobre a outra direção).
  const Hp = normal(sub(Hm, mul(eixoD, dot(Hm, eixoD))));
  const gFio = gradienteDaPonta(capa, (s) => {
    const N = capa.normalEm(s);
    const e = Math.pow(Math.max(0, dot(N, Hp)), 900);
    return ["#fff", Math.min(0.62, e * 0.62) * suave(0, capa.S * 0.08, s)];
  }, 160);
  partes.push(`<polygon points="${pontos(contornoPonta)}" fill="url(#${gFio})"/>`);

  // O corte da capa na ponta levantada: o miolo branco do couché aparece na borda. Junto da dobra ele
  // ainda está na sombra, como o resto do pé; clareia à medida que a ponta sobe e pega luz.
  const corte = [];
  for (let k = 0; k <= 40; k++) corte.push(tela(capa.P(W - capa.a + (capa.a * k) / 40, H)));
  const gCorte = gradiente(pr, corte[0], corte[corte.length - 1], [
    [0, BRANCO_CORTE, 0.2],
    [0.35, BRANCO_CORTE, 0.7],
    [1, BRANCO_CORTE, 0.92],
  ]);
  partes.push(`<polyline points="${pontos(corte)}" fill="none" stroke="url(#${gCorte})" stroke-width="0.9"/>`);

  // As quinas do fundo: o corte do papel é levemente arredondado e, visto de cima, a quina da cabeça
  // devolve a janela que está atrás (um fio claro); a da frente, virada para longe dela, quase nada.
  const fio = (pts, op, lw) => `<polyline points="${pontos(pts)}" fill="none" stroke="#fff" stroke-opacity="${op}" stroke-width="${lw}" stroke-linecap="round"/>`;
  const cabeca = Array.from({ length: 13 }, (_, i) => tela(capa.P((W * i) / 12, 0)));
  const frente = Array.from({ length: 13 }, (_, i) => tela(capa.P(W, ((H - capa.b) * i) / 12)));
  partes.push(fio(cabeca, 0.42, 0.7), fio(frente, 0.14, 0.6));
  pr.add(`<g>${partes.join("")}</g>`);
}

const saida = fileURLToPath(new URL("./p09-revista.svg", import.meta.url));
pr.salvar(saida);
console.log("✓", saida);
