#!/usr/bin/env node
/**
 * Prancha 01 · "Capa dura em três quartos" (a prancha de referência).
 *
 * O livro 3D do site (Arquitetura de Software, volume 01), construído como uma capa dura de
 * verdade e fotografado em pé no chão, em três quartos, com a lombada à esquerda virada para o
 * observador. A arte impressa (capa e lombada) é a da base, sem mudar nada: só entram a forma, o
 * material, a luz e a sombra, sempre como camadas translúcidas pretas e brancas por cima.
 *
 * Construção, em unidades da referência (capa 480 × 720; 1 unidade ≈ 0,32 mm):
 * - duas capas de papelão de 8 de espessura, forradas pelo papel impresso, que dobra nas bordas
 *   (na borda de cima, a cor impressa daquela altura: o papel na frente e a cor do livro atrás,
 *   porque a contracapa é lisa na cor do livro);
 * - seixa de 9 no alto, no pé e na frente: o miolo tem 702 de altura e fica 9 abaixo das capas;
 * - lombada arredondada (saliência de 15% da espessura), com a arte de lombada() medida no arco;
 * - o vinco da dobradiça na capa, a 22 da lombada, de alto a baixo (sulco raso);
 * - o cabeceado listrado no alto da lombada, entre a lombada e o miolo;
 * - o miolo em papel creme mais claro, com as linhas das folhas e a frente côncava do arredondamento.
 *
 * Luz: uma principal grande (softbox) do alto à esquerda e à frente, um preenchimento fraco da
 * direita e a luz ambiente. A lombada recebe mais luz e leva um brilho largo na curva; a capa cai de
 * leve da lombada para a frente; o alto do miolo é a parte mais clara. As camadas de luz ficam dentro
 * das artes (no espaço u, v da arte), para o mapeamento em células levá-las exatas para a superfície.
 *
 *   fnm exec --using=24 node pranchas/p01-capa-dura.mjs  →  pranchas/p01-capa-dura.svg
 */
import { fileURLToPath } from "node:url";
import { capa, lombada, livro } from "../base/base.mjs";
import {
  Prancha,
  camera,
  enquadrar,
  superficie,
  girarY,
  soma,
  sub,
  mul,
  dot,
  normal,
  lerp,
  limitar,
  suave,
  aleatorio,
  pontos,
  caminho,
  gradiente,
  gradienteRadial,
  filtroGrao,
  contorno,
  n,
} from "../ferramentas/cena.mjs";

const L = livro(process.env.LIVRO ?? "arquitetura-de-software");

// ---------- medidas do livro (unidades da referência) ----------

const W = 480; // largura da capa
const H = 720; // altura da capa
const T = L.largura; // espessura total (150): a largura da arte da lombada
const E = 8; // espessura do papelão das capas
const S = 9; // seixa: quanto a capa passa do miolo no alto, no pé e na frente
const ZI = T / 2 - E; // face de dentro das capas (67): o miolo vai de -ZI a +ZI
const TOPO = H - S; // alto do miolo (711)
const VINCO = 22; // o vinco da dobradiça, medido da lombada, na capa
const GIRO = 37; // a capa a 37° da frente: a lombada vira para o observador

// Lombada arredondada: um arco que passa pelas duas capas (z = ±T/2 em x = 0) e sai B para fora.
const B = 0.15 * T; // saliência (15% da espessura)
const XC = (T * T / 4 - B * B) / (2 * B); // centro do arco, dentro do livro
const R = XC + B; // raio do arco (136,25)
const PHI = Math.asin(T / 2 / R); // meio ângulo do arco
const theta = (u) => -PHI + 2 * PHI * (u / T); // u = 0 na contracapa, u = T na capa
const noArco = (r, th) => [XC - r * Math.cos(th), r * Math.sin(th)]; // [x, z] local

// Miolo: a lombada do miolo fica 4 para dentro da lombada da capa (parede de 2,5 e o oco); a frente
// é côncava (o arredondamento empurra o meio das folhas para dentro).
const RM = R - 4; // raio da lombada do miolo
const ZOMBRO = T / 2 - 3.5; // o miolo abre nos ombros até quase encostar na capa
const XOMBRO = 26; // onde o ombro termina e começam as capas de papelão
const FRENTE = W - S; // frente do miolo nas pontas (471)
const CONCAVO = 12; // quanto o meio da frente entra

// ---------- mundo e câmera ----------

// O livro gira em volta do seu centro no chão; y para cima, z para o observador.
const CENTRO = [W / 2, 0, 0];
const mundo = (p) => girarY(p, GIRO, CENTRO);
const direcao = (v) => girarY(v, GIRO);

const pr = new Prancha({
  prefixo: "p01",
  largura: 1200,
  altura: 1000,
  titulo: "Capa dura em três quartos: Arquitetura de Software",
  descricao:
    "O livro Arquitetura de Software, volume 01, como uma capa dura de verdade: em pé, em três quartos, com a lombada arredondada à esquerda, o miolo à vista no alto e a sombra suave no chão.",
});

// Teleobjetiva: o olho longe (5.600 unidades, uns 1,8 m) e um pouco acima do livro.
const DIST = 5600;
const ELEVACAO = 16; // graus, do olho para o centro do livro (uns 13° no alto dele)
const alvo = [W / 2, H / 2, 0];
const olho = [alvo[0], alvo[1] + DIST * Math.tan((ELEVACAO * Math.PI) / 180), alvo[2] + DIST];
const cam = camera({ olho, alvo, focal: 1000, centro: [600, 500] });

const pontosDoLivro = [];
for (const y of [0, H]) {
  for (let i = 0; i <= 24; i++) {
    const [x, z] = noArco(R, -PHI + (2 * PHI * i) / 24);
    pontosDoLivro.push(mundo([x, y, z]));
  }
  pontosDoLivro.push(mundo([W, y, T / 2]), mundo([W, y, -T / 2]));
}
// O livro com 80% da altura da tela, um pouco à esquerda do centro (a sombra vai para a direita).
enquadrar(cam, pontosDoLivro, [170, 95, 780, 800]);

const tela = (p) => cam.p(mundo(p)); // ponto local → tela
const telaPs = (ps) => ps.map(tela);
/** Pixels por unidade perto de um ponto local (para larguras de traço e desfoques). */
const escalaEm = (p) => {
  const a = tela(p);
  const b = tela(soma(p, [0, 1, 0]));
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
};

// ---------- luz ----------

const rad = (g) => (g * Math.PI) / 180;
// Principal: softbox grande, 35° à esquerda da câmera e 50° acima (direção PARA a luz, no mundo).
const LUZ = [Math.sin(rad(-35)) * Math.cos(rad(50)), Math.sin(rad(50)), Math.cos(rad(-35)) * Math.cos(rad(50))];
const PREENCHIMENTO = normal([0.85, 0.2, 0.5]); // fraco, da direita
/** Lambert "embrulhado" (luz de área grande) + preenchimento + ambiente. */
const iluminacao = (nw) => {
  const k = Math.max(0, (dot(nw, LUZ) + 0.2) / 1.2);
  const f = Math.max(0, dot(nw, PREENCHIMENTO));
  return 0.28 + 0.66 * k + 0.14 * f;
};

// ---------- utilidades de desenho ----------

const poligono = (ps, atributos) => `<polygon points="${pontos(ps)}" ${atributos}/>`;

/** Desfoque com região própria (em px da tela), para sombras finas não serem cortadas. */
function desfoque(sx, sy, caixa) {
  const id = pr.id("desfoque");
  const [x0, y0, x1, y1] = caixa;
  const m = 3 * Math.max(sx, sy) + 4;
  pr.def(
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="${n(x0 - m)}" y="${n(y0 - m)}" width="${n(x1 - x0 + 2 * m)}" height="${n(y1 - y0 + 2 * m)}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${n(sx)} ${n(sy)}"/></filter>`,
  );
  return id;
}
const caixaDe = (ps) => [Math.min(...ps.map((p) => p[0])), Math.min(...ps.map((p) => p[1])), Math.max(...ps.map((p) => p[0])), Math.max(...ps.map((p) => p[1]))];

/** Envoltória convexa (cadeia monótona) de pontos da tela. */
function envoltoria(ps) {
  const q = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const x = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const baixo = [];
  for (const p of q) {
    while (baixo.length >= 2 && x(baixo[baixo.length - 2], baixo[baixo.length - 1], p) <= 0) baixo.pop();
    baixo.push(p);
  }
  const cima = [];
  for (const p of q.reverse()) {
    while (cima.length >= 2 && x(cima[cima.length - 2], cima[cima.length - 1], p) <= 0) cima.pop();
    cima.push(p);
  }
  return [...baixo.slice(0, -1), ...cima.slice(0, -1)];
}

/** Um traço desfocado ao longo de pontos locais (sombra de canto, oclusão, fio de luz). */
function tracoDesfocado(psLocais, { cor = "#000", opacidade, largura, desvio, fechar = false }) {
  const ps = telaPs(psLocais);
  const f = desfoque(desvio, desvio, caixaDe(ps));
  return `<path d="${caminho(ps, fechar)}" fill="none" stroke="${cor}" stroke-opacity="${opacidade}" stroke-width="${n(largura)}" stroke-linecap="round" stroke-linejoin="round" filter="url(#${f})"/>`;
}

/** Paradas de gradiente a partir de uma função de 0 a 1. */
const paradas = (f, cor, amostras = 24) => Array.from({ length: amostras + 1 }, (_, i) => [n(i / amostras), cor, n(limitar(f(i / amostras), 0, 1) * 1000) / 1000]);

// ---------- 1. a arte da capa, com a luz no espaço da arte ----------

/**
 * A capa plana da base e, por cima, a luz como camadas translúcidas no espaço (u, v) da arte:
 * a queda suave da lombada para a frente, a queda do alto para o pé, o brilho acetinado largo e
 * fraco, o vinco da dobradiça, as bordas arredondadas (fio de luz no alto, fio escuro na frente e no
 * pé) e a oclusão perto do chão. Os cantos da frente saem um pouco arredondados.
 */
function capaIluminada() {
  const g = (x1, y1, x2, y2, st) => gradiente(pr, [x1, y1], [x2, y2], st);
  // Queda da lombada para a frente (a capa foge da luz principal; a frente está mais longe dela).
  const queda = g(0, 0, W, 0, paradas((t) => 0.05 + 0.1 * Math.pow(t, 1.2), "#000"));
  // Do alto para o pé: a softbox está no alto.
  const vertical = g(0, 0, 0, H, paradas((t) => 0.065 * Math.pow(t, 1.6), "#000"));
  // Oclusão perto do chão (o chão tapa metade do ambiente).
  const chao = g(0, H - 40, 0, H, paradas((t) => 0.1 * Math.pow(t, 2.2), "#000"));
  // Brilho acetinado da laminação fosca: muito largo e fraco, no alto, perto da lombada.
  const brilho = gradienteRadial(pr, [150, 210], 430, paradas((t) => 0.05 * Math.pow(1 - t, 1.6), "#fff", 16));
  // O vinco: a parede do lado da lombada foge da luz (fio de sombra); a do outro lado a encara.
  const vSombra = g(VINCO - 3.5, 0, VINCO, 0, [["0", "#000", 0], ["0.7", "#000", 0.2], ["1", "#000", 0.26]]);
  const vFundo = g(VINCO, 0, VINCO + 1.2, 0, [["0", "#000", 0.2], ["1", "#000", 0.08]]);
  const vLuz = g(VINCO + 1.2, 0, VINCO + 5, 0, [["0", "#fff", 0.22], ["0.45", "#fff", 0.12], ["1", "#fff", 0]]);
  // Bordas arredondadas: o alto encara a luz; a frente e o pé fogem dela.
  const alto = g(0, 0, 0, 3, [["0", "#fff", 0.42], ["0.5", "#fff", 0.16], ["1", "#fff", 0]]);
  const frente = g(W - 4, 0, W, 0, [["0", "#000", 0], ["0.6", "#000", 0.08], ["1", "#000", 0.26]]);
  const pe = g(0, H - 3, 0, H, [["0", "#000", 0], ["1", "#000", 0.3]]);
  // A quina com a lombada: arredondada, pega um pouco da luz da lombada.
  const quina = g(0, 0, 4, 0, [["0", "#fff", 0.1], ["1", "#fff", 0]]);
  const rc = 3.5; // raio dos cantos da frente
  const recorte = pr.id("recorte-capa");
  pr.def(
    `<clipPath id="${recorte}"><path d="M0 0H${W - rc}Q${W} 0 ${W} ${rc}V${H - rc}Q${W} ${H} ${W - rc} ${H}H0Z"/></clipPath>`,
  );
  const r = (x, y, w, h, id) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="url(#${id})"/>`;
  return `<g clip-path="url(#${recorte})">${capa(L.slug)}${[
    r(0, 0, W, H, queda),
    r(0, 0, W, H, vertical),
    r(0, H - 40, W, 40, chao),
    r(0, 0, W, H, brilho),
    r(VINCO - 3.5, 0, 3.5, H, vSombra),
    r(VINCO, 0, 1.2, H, vFundo),
    r(VINCO + 1.2, 0, 3.8, H, vLuz),
    r(0, 0, W, 3, alto),
    r(W - 4, 0, 4, H, frente),
    r(0, H - 3, W, 3, pe),
    r(0, 0, 4, H, quina),
  ].join("")}</g>`;
}

// ---------- 2. a arte da lombada, com a luz no espaço da arte ----------

/** A normal da lombada no mundo, em u. */
const normalDaLombada = (u) => {
  const th = theta(u);
  return direcao([-Math.cos(th), 0, Math.sin(th)]);
};

/**
 * A lombada plana da base e a luz ao longo de u, calculada com a normal de cada ponto do arco: a
 * parte que vira para trás escurece (e mais ainda no contorno, rasante), a que encara a softbox
 * clareia, e a curva leva um brilho largo e suave (o reflexo da softbox na laminação fosca).
 */
function lombadaIluminada() {
  const I0 = 0.745; // exposição: a parte mais iluminada da lombada fica na cor do site
  const V = normal(sub(olho, mundo([0, H / 2, 0])));
  const Hm = normal(soma(LUZ, V));
  const escuro = (t) => {
    const u = t * T;
    const I = iluminacao(normalDaLombada(u));
    const rasante = 0.12 * (1 - suave(0, 34, u)); // o contorno de trás, quase de perfil
    return Math.max(0, 1 - I / I0) * 1.15 + rasante;
  };
  const claro = (t) => {
    const u = t * T;
    const nh = Math.max(0, dot(normalDaLombada(u), Hm));
    return 0.26 * Math.pow(nh, 5) * (1 - 0.35 * suave(0.93, 1, t)); // cai um pouco na quina
  };
  const g = (x1, y1, x2, y2, st) => gradiente(pr, [x1, y1], [x2, y2], st);
  const sombraU = g(0, 0, T, 0, paradas(escuro, "#000", 30));
  const brilhoU = g(0, 0, T, 0, paradas(claro, "#fff", 30));
  const vertical = g(0, 0, 0, H, paradas((t) => 0.065 * Math.pow(t, 1.6), "#000"));
  const chao = g(0, H - 40, 0, H, paradas((t) => 0.1 * Math.pow(t, 2.2), "#000"));
  const alto = g(0, 0, 0, 3, [["0", "#fff", 0.4], ["0.5", "#fff", 0.15], ["1", "#fff", 0]]);
  const pe = g(0, H - 3, 0, H, [["0", "#000", 0], ["1", "#000", 0.3]]);
  const r = (x, y, w, h, id) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="url(#${id})"/>`;
  return `${lombada(L.slug)}${[
    r(0, 0, T, H, sombraU),
    r(0, 0, T, H, brilhoU),
    r(0, 0, T, H, vertical),
    r(0, H - 40, T, 40, chao),
    r(0, 0, T, 3, alto),
    r(0, H - 3, T, 3, pe),
  ].join("")}`;
}

const artCapa = pr.simbolo(capaIluminada(), { largura: W, altura: H, nome: "capa" });
const artLombada = pr.simbolo(lombadaIluminada(), { largura: T, altura: H, nome: "lombada" });

// As superfícies.
const capaP = (u, v) => mundo([u, H - v, T / 2]);
const lombP = (u, v) => {
  const [x, z] = noArco(R, theta(u));
  return mundo([x, H - v, z]);
};

// ---------- 3. sombras no chão ----------

// A pegada do livro no chão: a lombada arredondada e as duas capas até a frente.
const pegadaLocal = [];
for (let i = 0; i <= 24; i++) {
  const [x, z] = noArco(R, -PHI + (2 * PHI * i) / 24);
  pegadaLocal.push([x, 0, z]);
}
pegadaLocal.push([W - 2, 0, T / 2], [W, 0, T / 2 - 2], [W, 0, -T / 2 + 2], [W - 2, 0, -T / 2]);
const pegada = telaPs(pegadaLocal);
const escalaChao = escalaEm([W / 2, 0, 0]);

/** A sombra no chão de um ponto local à altura h, pela luz principal (no mundo). */
const noChao = (p, h) => {
  const q = mundo(p);
  return cam.p([q[0] - (LUZ[0] / LUZ[1]) * h, 0, q[2] - (LUZ[2] / LUZ[1]) * h]);
};

function sombras() {
  const partes = [];
  // Oclusão ambiente: larga e fraca, em volta da pegada.
  {
    const cx = caixaDe(pegada);
    const f1 = desfoque(34 * escalaChao, 13 * escalaChao, cx);
    partes.push(poligono(pegada, `fill="#000" fill-opacity="0.13" filter="url(#${f1})"`));
  }
  // Sombra projetada: a sombra do livro cortado em alturas crescentes, cada fatia mais desfocada
  // (a penumbra da luz grande abre com a distância) e mais fraca. Junto da base, todas se somam.
  // A fatia do alto do livro quase não marca: a penumbra da softbox lá é enorme.
  const fatias = [
    [18, 0.13],
    [45, 0.11],
    [90, 0.085],
    [160, 0.065],
    [260, 0.05],
    [400, 0.035],
    [560, 0.022],
  ];
  for (const [h, op] of fatias) {
    const ps = envoltoria([...pegada, ...pegadaLocal.map((p) => noChao(p, h))]);
    const sx = (2 + 0.16 * h) * escalaChao;
    const f = desfoque(sx, sx * 0.4, caixaDe(ps));
    partes.push(poligono(ps, `fill="#000" fill-opacity="${op}" filter="url(#${f})"`));
  }
  // Contato: justo e escuro, onde as capas e a lombada tocam o chão.
  {
    const cx = caixaDe(pegada);
    const f2 = desfoque(5 * escalaChao, 2.2 * escalaChao, cx);
    const f3 = desfoque(1.3 * escalaChao, 0.8 * escalaChao, cx);
    partes.push(poligono(pegada, `fill="#000" fill-opacity="0.3" filter="url(#${f2})"`));
    partes.push(poligono(pegada, `fill="#000" fill-opacity="0.55" filter="url(#${f3})"`));
    // A linha de contato: a fresta escura onde a borda de baixo da capa e a lombada tocam o chão.
    const base = [];
    for (let i = 0; i <= 24; i++) {
      const [x, z] = noArco(R, -PHI + (2 * PHI * i) / 24);
      base.push([x, 0, z]);
    }
    base.push([W - 3, 0, T / 2]);
    partes.push(tracoDesfocado(base, { opacidade: 0.5, largura: 1.8 * escalaChao, desvio: 0.8 * escalaChao }));
  }
  return `<g>${partes.join("")}</g>`;
}

// ---------- 4. o alto do livro ----------

const CREME = "#f7f3e8"; // papel do miolo: creme, mais claro que o papel impresso
const VERDE = L.cor;
const PAPEL = L.papel;

/** O contorno do alto do miolo (local, na altura y): lombada, ombros, lados e a frente côncava. */
function contornoDoMiolo(y) {
  const ps = [];
  const th1 = Math.asin(ZOMBRO / RM);
  // Lombada do miolo, de trás para a frente.
  for (let i = 0; i <= 20; i++) {
    const [x, z] = noArco(RM, -th1 + (2 * th1 * i) / 20);
    ps.push([x, y, z]);
  }
  // Ombro da frente: do arco até a face de dentro da capa.
  const [xa, za] = noArco(RM, th1);
  for (let i = 1; i <= 6; i++) {
    const t = i / 6;
    ps.push([lerp([xa], [XOMBRO], t)[0], y, za + (ZI - za) * suave(0, 1, t)]);
  }
  // Frente côncava, de z = +ZI a -ZI.
  for (let i = 0; i <= 16; i++) {
    const z = ZI - (2 * ZI * i) / 16;
    ps.push([FRENTE - CONCAVO * (1 - (z / ZI) ** 2), y, z]);
  }
  // Ombro de trás.
  for (let i = 0; i < 6; i++) {
    const t = 1 - i / 6;
    ps.push([lerp([xa], [XOMBRO], t)[0], y, -(za + (ZI - za) * suave(0, 1, t))]);
  }
  return ps;
}

/** Gradiente na tela cujas linhas de mesmo tom seguem a direção local `ao`; vai de A (0) a B (1). */
function gradienteAlinhado(A, B, ao, st) {
  const a = tela(A);
  const b = tela(B);
  const c = tela(soma(A, ao));
  const d = [c[0] - a[0], c[1] - a[1]];
  const l = Math.hypot(d[0], d[1]) || 1;
  const p = [-d[1] / l, d[0] / l];
  const s = (b[0] - a[0]) * p[0] + (b[1] - a[1]) * p[1];
  return gradiente(pr, a, [a[0] + p[0] * s, a[1] + p[1] * s], st);
}

/**
 * As linhas das folhas no alto do miolo: cada folha vai da lombada (abrindo nos ombros) até a frente
 * côncava. Poucas e fracas (na escala da foto, as folhas não se separam: o corte é um papel liso com
 * estrias), e mais marcadas entre um caderno e outro.
 */
function linhasDoMiolo() {
  const rnd = aleatorio(11);
  const quantas = 34;
  const partes = [];
  for (let i = 1; i < quantas; i++) {
    const t = (i + (rnd() - 0.5) * 0.8) / quantas;
    const zf = -ZI + 2 * ZI * t; // na frente
    const zl = zf * (ZOMBRO / ZI); // na lombada, abrindo nos ombros
    const [xs, zs] = noArco(RM, Math.asin(limitar(zl / RM, -1, 1)));
    const xf = FRENTE - CONCAVO * (1 - (zf / ZI) ** 2);
    const ps = [];
    const passos = 14;
    const onda = (rnd() - 0.5) * 0.8; // folhas não perfeitamente alinhadas
    for (let k = 0; k <= passos; k++) {
      const s = k / passos;
      const x = xs + (xf - xs) * s;
      const z = zs + (zf - zs) * suave(0, 0.07, s) + onda * Math.sin(s * Math.PI);
      ps.push([x, TOPO, z]);
    }
    const caderno = i % 6 === 0; // entre um caderno e outro, a linha marca mais
    const op = caderno ? 0.13 : 0.035 + rnd() * 0.05;
    const lw = caderno ? 0.5 : 0.3 + rnd() * 0.25;
    partes.push(`<path d="${caminho(telaPs(ps), false)}" fill="none" stroke="#6b5a3e" stroke-opacity="${n(op * 1000) / 1000}" stroke-width="${n(lw)}"/>`);
    // Algumas folhas passam um fio das outras e pegam luz.
    if (rnd() < 0.22) {
      const q = ps.map(([x, y, z]) => [x, y, z + 0.6]);
      partes.push(`<path d="${caminho(telaPs(q), false)}" fill="none" stroke="#fff" stroke-opacity="${n((0.25 + rnd() * 0.25) * 1000) / 1000}" stroke-width="0.4"/>`);
    }
  }
  return partes.join("");
}

function altoDoLivro() {
  const partes = [];

  // Capa de trás, por dentro: acima do miolo aparece a dobra do papel impresso (a contracapa é lisa
  // na cor do livro); abaixo dela, a guarda em papel (só aparece no vão da frente). Do ombro para a
  // frente é o papelão (face de dentro em z = -ZI); entre a lombada e o ombro é a dobradiça, só o
  // papel da capa, mais para trás (z = -ZJ), e a ponta do papelão, virada para a lombada.
  const ZJ = T / 2 - 2;
  const dentro = (y0, y1) => [
    telaPs([[0.5, y1, -ZJ], [XOMBRO, y1, -ZJ], [XOMBRO, y0, -ZJ], [0.5, y0, -ZJ]]),
    telaPs([[XOMBRO, y1, -ZJ], [XOMBRO, y1, -ZI], [XOMBRO, y0, -ZI], [XOMBRO, y0, -ZJ]]),
    telaPs([[XOMBRO, y1, -ZI], [W - 0.5, y1, -ZI], [W - 0.5, y0, -ZI], [XOMBRO, y0, -ZI]]),
  ];
  const pinta = (ps, atributos) => ps.map((p) => poligono(p, atributos)).join("");
  partes.push(pinta(dentro(660, 710.2), `fill="${PAPEL}"`));
  partes.push(pinta(dentro(709.8, H), `fill="${VERDE}"`));
  {
    // A face de dentro vira para a frente, como a capa: a mesma queda de luz, e o canto com o miolo
    // (embaixo) escurece.
    const g1 = gradienteAlinhado([0, H, -ZI], [0, 690, -ZI], [1, 0, 0], [["0", "#000", 0.1], ["0.3", "#000", 0.14], ["0.55", "#000", 0.3], ["1", "#000", 0.45]]);
    partes.push(pinta(dentro(660, H), `fill="url(#${g1})"`));
    const g2 = gradienteAlinhado([0, H, -ZI], [W, H, -ZI], [0, 1, 0], [["0", "#000", 0.05], ["1", "#000", 0.14]]);
    partes.push(pinta(dentro(660, H), `fill="url(#${g2})"`));
    // No vão da frente (abaixo do alto do miolo) a face de dentro fica entre as duas capas: sombra.
    const g3 = gradienteAlinhado([0, TOPO, -ZI], [0, 680, -ZI], [1, 0, 0], [["0", "#000", 0.2], ["1", "#000", 0.5]]);
    partes.push(pinta(dentro(660, TOPO + 0.2), `fill="url(#${g3})"`));
    // A dobradiça fica mais funda (entre a lombada e o papelão): mais escura.
    partes.push(poligono(dentro(660, H)[0], `fill="#000" fill-opacity="0.18"`));
  }
  // A borda de cima do papelão de trás (e a da dobradiça, só o papel), forrada de verde; encara a luz.
  const bordaTras = telaPs([[0, H, -T / 2], [W - 2.5, H, -T / 2], [W, H, -T / 2 + 2.5], [W, H, -ZI], [XOMBRO, H, -ZI], [XOMBRO, H, -ZJ], [0, H, -ZJ]]);
  partes.push(poligono(bordaTras, `fill="${VERDE}"`));
  partes.push(poligono(bordaTras, `fill="#fff" fill-opacity="0.2"`));

  // O alto do miolo: papel creme, a face mais clara do livro, com as linhas das folhas.
  const miolo = telaPs(contornoDoMiolo(TOPO));
  const recMiolo = pr.id("recorte-miolo");
  pr.def(`<clipPath id="${recMiolo}"><polygon points="${pontos(miolo)}"/></clipPath>`);
  partes.push(poligono(miolo, `fill="${CREME}"`));
  const m = [];
  // Luz: branca por cima (encara a softbox), caindo de leve da lombada para a frente.
  {
    const g = gradienteAlinhado([0, TOPO, 0], [W, TOPO, 0], [0, 0, 1], [["0", "#fff", 0.34], ["0.5", "#fff", 0.26], ["1", "#fff", 0.16]]);
    m.push(poligono(miolo, `fill="url(#${g})"`));
  }
  m.push(linhasDoMiolo());
  // Oclusão no canto com a capa de trás, junto da lombada (a parede dela) e a sombra fina da capa da
  // frente sobre o miolo, junto da borda de cima dela.
  const px = escalaEm([W / 2, H, 0]);
  m.push(tracoDesfocado([[XOMBRO, TOPO, -ZI + 0.5], [FRENTE + 4, TOPO, -ZI + 0.5]], { opacidade: 0.3, largura: 2.4 * px, desvio: 1.6 * px }));
  {
    const arco = [];
    const r = RM - 8.6;
    const th1 = Math.asin((ZOMBRO - 4) / r);
    for (let i = 0; i <= 24; i++) {
      const [x, z] = noArco(r, -th1 + (2 * th1 * i) / 24);
      arco.push([x, TOPO, z]);
    }
    m.push(tracoDesfocado(arco, { opacidade: 0.22, largura: 3 * px, desvio: 2 * px }));
  }
  m.push(tracoDesfocado([[0, H, ZI], [W, H, ZI]], { opacidade: 0.5, largura: 1.6 * px, desvio: 1.5 * px }));
  partes.push(`<g clip-path="url(#${recMiolo})">${m.join("")}</g>`);

  // O oco entre a lombada da capa e a do miolo: um fio escuro atrás da borda da lombada, que some
  // nas pontas (lá a dobradiça fecha o oco).
  {
    const arco = [];
    for (let i = 0; i <= 30; i++) {
      const [x, z] = noArco(R - 3.2, -PHI * 0.86 + (2 * PHI * 0.86 * i) / 30);
      arco.push([x, H - 2.5, z]);
    }
    partes.push(tracoDesfocado(arco, { cor: "#14120f", opacidade: 0.6, largura: 4 * px, desvio: 0.7 * px }));
  }

  // O cabeceado.
  partes.push(cabeceado());

  // A borda de cima da lombada da capa (o papel impresso sobre o reforço da lombada): um fio claro.
  {
    const ps = [];
    // Vai 1 além da face da lombada (por baixo dela), contra o fio de fundo na emenda.
    for (let i = 0; i <= 24; i++) {
      const [x, z] = noArco(R + 1, -PHI + (2 * PHI * i) / 24);
      ps.push(tela([x, H, z]));
    }
    for (let i = 24; i >= 0; i--) {
      const [x, z] = noArco(R - 2.4, -PHI * 0.99 + (2 * PHI * 0.99 * i) / 24);
      ps.push(tela([x, H, z]));
    }
    partes.push(poligono(ps, `fill="${PAPEL}"`));
    partes.push(poligono(ps, `fill="#fff" fill-opacity="0.35"`));
  }

  // A borda de cima da capa da frente: o papel impresso dobrado sobre o papelão (papel, porque o
  // alto da capa é papel); encara a luz. Passa 1 da face da capa (por baixo dela), contra a emenda.
  const bordaFrente = telaPs([[0, H, ZI], [W, H, ZI], [W, H, T / 2 - 2.5], [W - 2.5, H, T / 2], [W - 4, H, T / 2 + 1], [0, H, T / 2 + 1]]);
  partes.push(poligono(bordaFrente, `fill="${PAPEL}"`));
  partes.push(poligono(bordaFrente, `fill="#fff" fill-opacity="0.36"`));
  return partes.join("");
}

/**
 * O cabeceado: um fio (núcleo com linha enrolada) listrado em dois tons, papel e a cor do livro
 * escurecida, colado no alto da lombada do miolo, de uma capa à outra. O alto dele fica quase rente
 * à capa (719,5), e a borda da lombada tapa a parte de baixo: ele aparece mais atrás, onde a curva
 * da lombada deixa ver por dentro, e vira um fio fino na frente.
 */
function cabeceado() {
  const rc = 4; // raio do fio
  const rr = R - 7; // eixo do fio (encostado na parede da lombada, por dentro)
  const yc = H - 0.5 - rc; // o alto do fio a 719,5
  const thMax = Math.asin((ZOMBRO - 2) / rr);
  const nArco = 110; // fatias ao longo do fio
  const nVolta = 12; // fatias em volta do fio
  const passo = 2.1; // largura de cada listra (a linha dá voltas no núcleo: a listra inclina)
  const claro = hex(PAPEL);
  const escuro = hex("#1c2e2a"); // a cor do livro escurecida
  // Um ponto do tubo: th ao longo do arco, ps em volta (ps = 0 para fora, π/2 para cima).
  const ponto = (th, ps) => {
    const [x, z] = noArco(rr, th);
    const rad = [-Math.cos(th), Math.sin(th)]; // para fora do arco, no plano do chão (local)
    return [x + rc * Math.cos(ps) * rad[0], yc + rc * Math.sin(ps), z + rc * Math.cos(ps) * rad[1]];
  };
  const quads = [];
  for (let i = 0; i < nArco; i++) {
    const a = -thMax + (2 * thMax * i) / nArco;
    const b = -thMax + (2 * thMax * (i + 1)) / nArco;
    for (let j = 0; j < nVolta; j++) {
      const p0 = (2 * Math.PI * j) / nVolta;
      const p1 = (2 * Math.PI * (j + 1)) / nVolta;
      const cm = ponto((a + b) / 2, (p0 + p1) / 2);
      const [xc, zc] = noArco(rr, (a + b) / 2);
      const nl = normal(sub(cm, [xc, yc, zc])); // normal local do tubo
      const nw = direcao(nl);
      const V = normal(sub(olho, mundo(cm)));
      if (dot(nw, V) <= 0.02) continue; // a metade de trás do tubo
      // A listra: fatias de comprimento `passo` ao longo do arco, deslocadas com a volta (hélice).
      const s = rr * ((a + b) / 2 + thMax) + (passo * (p0 + p1)) / (2 * Math.PI) * 0.9;
      const cor = Math.floor(s / passo) % 2 ? escuro : claro;
      const I = 0.62 + 0.5 * Math.max(0, (dot(nw, LUZ) + 0.25) / 1.25);
      const ps = [ponto(a, p0), ponto(b, p0), ponto(b, p1), ponto(a, p1)].map(tela);
      quads.push({ z: cam.projetar(mundo(cm))[2], ps, cor: sombreado(cor, I) });
    }
  }
  quads.sort((x, y) => y.z - x.z);
  return `<g>${quads.map((q) => `<polygon points="${pontos(q.ps)}" fill="${q.cor}" stroke="${q.cor}" stroke-width="0.25" stroke-linejoin="round"/>`).join("")}</g>`;
}

/** "#rrggbb" → [r, g, b]. */
function hex(c) {
  return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
}
/** A cor com a luz I (1 = como impressa; abaixo escurece, acima clareia para o branco). */
function sombreado([r, g, b], I) {
  const f = (v) => Math.round(I <= 1 ? v * I : v + (255 - v) * Math.min(1, (I - 1) * 1.2));
  return `#${[r, g, b].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
}

// ---------- 5. montagem ----------

// P01_DEPURAR=sombra desenha só as sombras (para conferir a sombra sozinha).
const DEPURAR = process.env.P01_DEPURAR ?? "";
pr.add(sombras());
if (DEPURAR !== "sombra") montarLivro();
else pr.add(`<polygon points="${pontos(envoltoria(pontosDoLivro.map((p) => cam.p(p))))}" fill="none" stroke="#c00" stroke-width="0.6"/>`);

function montarLivro() {
pr.add(altoDoLivro());

// Um forro sob a quina capa–lombada: as duas artes terminam na mesma linha e o antisserrilhado das
// duas deixaria passar o fundo (ou o oco escuro atrás) num fio. O forro tem as cores impressas ali.
{
  const faixa = (v0, v1) => [lombP(T - 2.5, v0), capaP(2.5, v0), capaP(2.5, v1), lombP(T - 2.5, v1)].map((p) => cam.p(p));
  pr.add(poligono(faixa(0, 300), `fill="${PAPEL}"`) + poligono(faixa(300, H), `fill="${VERDE}"`));
  pr.add(poligono(faixa(0, H), `fill="#000" fill-opacity="0.05"`));
}

// A lombada arredondada, com a arte medida no arco (32 fatias no arco, 8 na altura).
const lomb = superficie(pr, { ref: artLombada, w: T, h: H, P: lombP, cam, nu: 36, nv: 8 });
pr.add(`<g>${lomb.svg}</g>`);

// A capa (plana), com a perspectiva em células.
const cap = superficie(pr, { ref: artCapa, w: W, h: H, P: capaP, cam, nu: 12, nv: 12 });
pr.add(`<g>${cap.svg}</g>`);

// O grão do papel (como o do site), por cima da capa e da lombada.
{
  const grao = filtroGrao(pr, { base: 0.85, oitavas: 2, alfa: 0.11, semente: 5 });
  const rec = pr.id("recorte-grao");
  const formaCapa = contorno(cam, capaP, W, H, 16);
  const formaLombada = contorno(cam, lombP, T, H, 24);
  pr.def(`<clipPath id="${rec}"><polygon points="${pontos(formaCapa)}"/><polygon points="${pontos(formaLombada)}"/></clipPath>`);
  const cx = caixaDe([...formaCapa, ...formaLombada]);
  const ret = (f) => `<rect x="${n(cx[0] - 2)}" y="${n(cx[1] - 2)}" width="${n(cx[2] - cx[0] + 4)}" height="${n(cx[3] - cx[1] + 4)}" filter="url(#${f})"/>`;
  pr.add(`<g clip-path="url(#${rec})">${ret(grao)}</g>`);
}
}

const saida = fileURLToPath(new URL(process.env.SAIDA ?? "./p01-capa-dura.svg", import.meta.url));
pr.salvar(saida);
console.log("✓", saida);
