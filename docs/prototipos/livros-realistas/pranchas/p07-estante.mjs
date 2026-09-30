#!/usr/bin/env node
/**
 * Prancha 07 · A estante: a estante da home com lombadas de verdade.
 *
 * Os oito livros da coleção em pé, na ordem dos volumes, com 6 entre eles; a Carreira inclinada 6°
 * pelo canto de baixo do lado direito, com o alto da capa apoiado no alto do aparador; o aparador de
 * metal; e a revista depois dele. É a composição de hoje (hoje/estante.png, docs/capas/CAPAS.md,
 * seção "Estante"); só o realismo muda: as cores, os desenhos e os textos são os da base.
 *
 * A câmera fica de frente, com teleobjetiva e sem inclinar (como uma lente de descentramento): as
 * verticais continuam verticais e a perspectiva quase some, mas o olho fica um pouco acima do alto dos
 * livros, e o alto de cada um aparece como uma fatia (as bordas das capas, o cabeceado e o alto do
 * miolo). A luz principal é grande e suave, do alto à esquerda e um pouco de frente; as sombras caem
 * para a direita e para trás.
 *
 * Mundo em unidades da referência (1 unidade ≈ 0,32 mm): X para a direita, Y para cima, Z para o
 * observador. O tampo da prateleira está em y = 0; a frente das lombadas, em z = 0; a parede, atrás.
 *
 *   fnm exec --using=24 node pranchas/p07-estante.mjs  →  pranchas/p07-estante.svg
 */
import { fileURLToPath } from "node:url";
import { LIVROS, REVISTA, PAPEL, lombadaDaEstante, lombadaDaRevistaNaEstante } from "../base/base.mjs";
import {
  Prancha, camera, enquadrar, superficie, gradiente, recortePoligono, filtroDesfoque, filtroGrao,
  linhasDasFolhas, pontos, caminho, soma, sub, mul, dot, normal, girarZ, grau, limitar, suave, n,
} from "../ferramentas/cena.mjs";

// ---------------------------------------------------------------------------- medidas e materiais

const VAO = 6; // entre os livros (CAPAS.md)
const SEIXA = 9; // a capa passa do miolo no alto, no pé e na frente
const PAPELAO = 8; // espessura da capa dura
const SALIENCIA = 0.14; // quanto a lombada arredondada sai para a frente (fração da espessura)
const COIFA = 2.4; // o alto da lombada afunda um pouco no meio (a coifa), e o cabeceado aparece atrás
const INCLINACAO = 6; // a Carreira, girando pelo canto de baixo do lado direito
const RECUO = { dados: -12 }; // variação natural: um livro uns 4 mm mais para trás

const TAMPO = "#b5bab4"; // prateleira: o tampo
const BORDA = "#9ba19b"; // prateleira: a borda da frente
const METAL = ["#6f7775", "#9aa19f", "#7a8280"]; // o gradiente do aparador no site
const MIOLO = "#ebe4d3"; // o papel das folhas, um nada mais quente e mais escuro que o da capa

const APARADOR = { raio: 6, alto: 470, raioBase: 24, altoBase: 9, z: -45 };

// ---------------------------------------------------------------------------- a disposição

let cursor = 0;
const posicoes = LIVROS.map((l) => {
  const x = cursor;
  cursor += l.largura + VAO;
  return x;
});
const ULTIMO = LIVROS.length - 1;
const PIVO = posicoes[ULTIMO] + LIVROS[ULTIMO].largura; // o canto de baixo à direita da Carreira
const sen6 = Math.sin(grau(INCLINACAO));
const cos6 = Math.cos(grau(INCLINACAO));
// O centro da barra do aparador: a meia esfera do alto (raio 6) encosta na capa da Carreira inclinada.
// Dá 1168,8: a barra começa em 1162,8, como no site (6 de vão + 43 de margem depois do pivô).
const XA = PIVO + (APARADOR.raio + (APARADOR.alto - APARADOR.raio) * sen6) / cos6;
const X_REVISTA = PIVO + VAO + 43 + 12 + 25 + VAO; // 1206, como no site
const ESTANTE = { x0: -44, x1: X_REVISTA + REVISTA.largura + 44, zFrente: 70, zFundo: -490, espessura: 20 };

// ---------------------------------------------------------------------------- a câmera e a luz

const XC = (ESTANTE.x0 + ESTANTE.x1) / 2;
const D_CAM = 30000; // teleobjetiva longa: o olho a uns 9,6 m de uma estante de 44 cm
const ACIMA = 3.3; // graus: quanto o olho fica acima do alto do livro mais alto
const Y_OLHO = 660 + D_CAM * Math.tan(grau(ACIMA));
// O alvo na mesma altura do olho: o olhar não inclina e as verticais não convergem.
const cam = camera({ olho: [XC, Y_OLHO, D_CAM], alvo: [XC, Y_OLHO, 0], focal: 1000, centro: [800, 450] });

const LUZ = normal([-0.62, 0.64, 0.45]); // para a luz: do alto, à esquerda, um pouco de frente
const REBATIDA = normal([0.55, 0.15, 0.82]); // preenchimento fraco, da direita
const SOMBRA = mul(LUZ, -1); // para onde as sombras caem

// ---------------------------------------------------------------------------- utilidades

const pr = new Prancha({
  prefixo: "p07",
  largura: 1600,
  altura: 900,
  titulo: "A estante",
  descricao: "Os oito livros da coleção em pé na prateleira, a Carreira inclinada no aparador de metal e a revista da série depois dele, com lombadas arredondadas, cabeceado, alto das folhas e sombras.",
});

const op = (a) => n(limitar(a) * 1000) / 1000;
const poli = (ps, cor, opacidade = 1, extra = "") =>
  `<polygon points="${pontos(ps)}" fill="${cor}"${opacidade < 1 ? ` fill-opacity="${op(opacidade)}"` : ""}${extra}/>`;
const desfoques = new Map();
const borra = (d) => {
  const k = Math.round(d * 100) / 100;
  if (!desfoques.has(k)) desfoques.set(k, filtroDesfoque(pr, k, { margem: 0.3 }));
  return desfoques.get(k);
};

/** Fecho convexo 2D (cadeia monótona). */
function fecho(ps) {
  const p = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const baixo = [];
  const cima = [];
  for (const q of p) {
    while (baixo.length >= 2 && cr(baixo.at(-2), baixo.at(-1), q) <= 0) baixo.pop();
    baixo.push(q);
  }
  for (const q of [...p].reverse()) {
    while (cima.length >= 2 && cr(cima.at(-2), cima.at(-1), q) <= 0) cima.pop();
    cima.push(q);
  }
  return baixo.slice(0, -1).concat(cima.slice(0, -1));
}

/** Leva um ponto, na direção da sombra, até um plano { p, n }. */
function naSombra(q, plano) {
  const t = dot(plano.n, sub(plano.p, q)) / dot(plano.n, SOMBRA);
  return soma(q, mul(SOMBRA, t));
}

/** A sombra de um corpo convexo (os seus pontos 3D) num plano, já na tela. */
const sombraNoPlano = (pts, plano) => fecho(pts.map((q) => cam.p(naSombra(q, plano))));

/** Brilho de uma face com a normal `nr` (0 a ~1): ambiente, luz principal e rebatida. */
const brilho = (nr, ambiente = 0.3) => ambiente + 0.62 * Math.max(0, dot(nr, LUZ)) + 0.14 * Math.max(0, dot(nr, REBATIDA));

// ---------------------------------------------------------------------------- os livros

/** O arco da lombada (visto de cima): passa por (0, −s), (T/2, 0) e (T, −s). */
function arco(T) {
  const s = SALIENCIA * T;
  const R = (T * T / 4 + s * s) / (2 * s);
  const phi = Math.asin(T / 2 / R);
  const ang = (t) => -phi + 2 * phi * t;
  return {
    s,
    R,
    phi,
    comprimento: 2 * R * phi,
    /** [x, z] no arco, com t de 0 (lado da contracapa) a 1 (lado da capa), pelo comprimento. */
    xz: (t) => [T / 2 + R * Math.sin(ang(t)), -R + R * Math.cos(ang(t))],
    normal: (t) => [Math.sin(ang(t)), 0, Math.cos(ang(t))],
    zEm: (x) => {
      const k = (x - T / 2) / R;
      return -R + R * Math.sqrt(Math.max(0, 1 - k * k));
    },
  };
}

function montarLivro(l, x0) {
  const T = l.largura;
  const H = l.altura;
  const D = (480 * H) / 720; // a largura da capa: a profundidade do livro
  const recuo = RECUO[l.slug] ?? 0;
  const giro = l === LIVROS[ULTIMO] ? -INCLINACAO : 0; // negativo = horário, visto de frente
  const A = arco(T);
  const M = (p) => {
    const q = [x0 + p[0], p[1], p[2] + recuo];
    return giro ? girarZ(q, giro, [PIVO, 0, 0]) : q;
  };
  const Mn = (v) => (giro ? girarZ(v, giro) : v);
  // A luz no sistema do livro (para as sombras dentro do alto dele).
  const luzLocal = giro ? girarZ(LUZ, -giro) : LUZ;
  /** A altura do alto da lombada: a coifa afunda no meio, e os cantos são amaciados (raio 2,5). */
  const cabeca = (t) => {
    const d = Math.min(t, 1 - t) * A.comprimento;
    const r = 2.5;
    const canto = d < r ? r - Math.sqrt(Math.max(0, r * r - (r - d) ** 2)) : 0;
    return H - COIFA * Math.pow(Math.sin(Math.PI * t), 1.6) - canto;
  };
  const pe = (t) => {
    const d = Math.min(t, 1 - t) * A.comprimento;
    const r = 1.2;
    return d < r ? r - Math.sqrt(Math.max(0, r * r - (r - d) ** 2)) : 0;
  };
  const centro = M([T / 2, H / 2, -D / 2]);
  return { l, slug: l.slug, T, H, D, x0, recuo, giro, A, M, Mn, luzLocal, cabeca, pe, centro };
}

const livros = LIVROS.map((l, i) => montarLivro(l, posicoes[i]));
const carreira = livros[ULTIMO];

/** Os oito cantos de um livro (a caixa, para as sombras). */
function cantos(b) {
  const r = [];
  for (const x of [0, b.T]) for (const y of [0, b.H]) for (const z of [0, -b.D]) r.push(b.M([x, y, z]));
  return r;
}

// A revista: lombada quadrada, plana, em papel; mais funda que os livros (a capa tem 480 × 720).
const RV = {
  x0: X_REVISTA,
  T: REVISTA.largura,
  H: REVISTA.altura,
  D: (480 * REVISTA.altura) / 720,
  M: (p) => [X_REVISTA + p[0], p[1], p[2]],
};
const cantosDaRevista = () => {
  const r = [];
  for (const x of [0, RV.T]) for (const y of [0, RV.H]) for (const z of [0, -RV.D]) r.push(RV.M([x, y, z]));
  return r;
};

// ---------------------------------------------------------------------------- enquadramento

{
  const chave = [];
  for (const x of [ESTANTE.x0, ESTANTE.x1])
    for (const z of [ESTANTE.zFrente, ESTANTE.zFundo]) for (const y of [0, -ESTANTE.espessura]) chave.push([x, y, z]);
  for (const b of livros) chave.push(...cantos(b));
  chave.push(...cantosDaRevista());
  enquadrar(cam, chave, [50, 38, 1500, 796]);
}
const ESC = cam.focal / D_CAM; // px da tela por unidade, no plano das lombadas

// ---------------------------------------------------------------------------- texturas

const GRAO = filtroGrao(pr, { base: 0.85, oitavas: 2, alfa: 0.1, semente: 3 });
const GRAO_FINO = filtroGrao(pr, { base: 1.1, oitavas: 2, alfa: 0.05, semente: 11 });
const caixa = (ps) => {
  const xs = ps.map((p) => p[0]);
  const ys = ps.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return [x, y, Math.max(...xs) - x, Math.max(...ys) - y];
};
const grao = (ps, filtro = GRAO, recorte) => {
  const [x, y, w, h] = caixa(ps);
  const id = recorte ?? recortePoligono(pr, ps);
  return `<rect x="${n(x - 2)}" y="${n(y - 2)}" width="${n(w + 4)}" height="${n(h + 4)}" filter="url(#${filtro})" clip-path="url(#${id})"/>`;
};

// ---------------------------------------------------------------------------- a prateleira

const tampo3D = [
  [ESTANTE.x0, 0, ESTANTE.zFrente],
  [ESTANTE.x1, 0, ESTANTE.zFrente],
  [ESTANTE.x1, 0, ESTANTE.zFundo],
  [ESTANTE.x0, 0, ESTANTE.zFundo],
];
const TAMPO_TELA = tampo3D.map((p) => cam.p(p));
const RECORTE_TAMPO = recortePoligono(pr, TAMPO_TELA);

/** A parede: a sombra da prateleira embaixo dela e o canto escuro onde o tampo encontra a parede. */
function parede() {
  const { x0, x1, zFrente, zFundo, espessura } = ESTANTE;
  let s = "";
  // Canto do tampo com a parede: uma faixa escura que sobe um pouco pela parede.
  const a = cam.p([x0, 0, zFundo]);
  const b = cam.p([x1, 0, zFundo]);
  const alto = 34 * ESC;
  const g = gradiente(pr, [0, a[1]], [0, a[1] - alto], [[0, "#000", 0.16], [0.35, "#000", 0.06], [1, "#000", 0]]);
  s += `<rect x="${n(a[0])}" y="${n(a[1] - alto)}" width="${n(b[0] - a[0])}" height="${n(alto + 2)}" fill="url(#${g})"/>`;
  // A sombra da prateleira na parede, embaixo da borda da frente (luz grande do alto: larga e suave).
  const e = cam.p([x0, -espessura, zFrente]);
  const d = cam.p([x1, -espessura, zFrente]);
  const fundoSombra = 70 * ESC;
  const g2 = gradiente(pr, [0, e[1]], [0, e[1] + fundoSombra], [[0, "#000", 0.2], [0.18, "#000", 0.12], [0.55, "#000", 0.04], [1, "#000", 0]]);
  s += `<rect x="${n(e[0] + 6)}" y="${n(e[1] - 2)}" width="${n(d[0] - e[0] - 12)}" height="${n(fundoSombra)}" fill="url(#${g2})" filter="url(#${borra(3 * ESC)})"/>`;
  return s;
}

/** O tampo: a cor do site, a luz da frente para o fundo, a queda da luz para a direita. */
function tampo() {
  const { zFrente, zFundo, x0, x1 } = ESTANTE;
  let s = poli(TAMPO_TELA, TAMPO);
  const f = cam.p([XC, 0, zFrente]);
  const t = cam.p([XC, 0, zFundo]);
  const g = gradiente(pr, f, t, [
    [0, "#fff", 0.1],
    [0.05, "#fff", 0.03],
    [0.14, "#000", 0.02],
    [0.55, "#000", 0.04],
    [0.86, "#000", 0.07],
    [0.97, "#000", 0.14],
    [1, "#000", 0.22],
  ]);
  s += poli(TAMPO_TELA, `url(#${g})`);
  const e = cam.p([x0, 0, zFrente]);
  const d = cam.p([x1, 0, zFrente]);
  const g2 = gradiente(pr, e, d, [[0, "#fff", 0.05], [0.45, "#fff", 0], [1, "#000", 0.06]]);
  s += poli(TAMPO_TELA, `url(#${g2})`);
  s += grao(TAMPO_TELA, GRAO_FINO, RECORTE_TAMPO);
  return s;
}

/** A borda da frente da prateleira: a quina de cima pega luz; embaixo, um fio mais escuro. */
function frenteDaEstante() {
  const { x0, x1, zFrente, espessura } = ESTANTE;
  const r = 1.6;
  // Cantos amaciados nas pontas.
  const ps = [];
  const quina = (cx, cy, a0, a1) => {
    for (let i = 0; i <= 6; i++) {
      const a = a0 + ((a1 - a0) * i) / 6;
      ps.push(cam.p([cx + r * Math.cos(a), cy + r * Math.sin(a), zFrente]));
    }
  };
  quina(x0 + r, -r, Math.PI, Math.PI / 2);
  quina(x1 - r, -r, Math.PI / 2, 0);
  quina(x1 - r, -espessura + r, 0, -Math.PI / 2);
  quina(x0 + r, -espessura + r, -Math.PI / 2, -Math.PI);
  let s = poli(ps, BORDA);
  const topo = cam.p([XC, 0, zFrente]);
  const baixo = cam.p([XC, -espessura, zFrente]);
  const g = gradiente(pr, topo, baixo, [
    [0, "#fff", 0.34],
    [0.07, "#fff", 0.16],
    [0.14, "#fff", 0.03],
    [0.5, "#000", 0.0],
    [0.9, "#000", 0.07],
    [1, "#000", 0.2],
  ]);
  s += poli(ps, `url(#${g})`);
  const e = cam.p([x0, -espessura / 2, zFrente]);
  const d = cam.p([x1, -espessura / 2, zFrente]);
  const g2 = gradiente(pr, e, d, [[0, "#fff", 0.05], [0.45, "#fff", 0], [1, "#000", 0.07]]);
  s += poli(ps, `url(#${g2})`);
  s += grao(ps, GRAO_FINO);
  return s;
}

/** As sombras no tampo: a de cada corpo (projetada pela luz) e o contato de cada livro. */
function sombrasNoTampo() {
  const plano = { p: [0, 0, 0], n: [0, 1, 0] };
  const corpos = [...livros.map((b) => cantos(b)), cantosDaRevista(), pontosDoAparador()];
  const formas = corpos.map((pts) => sombraNoPlano(pts, plano));
  const todas = formas.map((f) => `<polygon points="${pontos(f)}"/>`).join("");
  let s = `<g clip-path="url(#${RECORTE_TAMPO})">`;
  // Núcleo e meia-sombra: a luz é grande, a borda da sombra abre com a distância.
  s += `<g fill="#000" opacity="0.13" filter="url(#${borra(6 * ESC)})">${todas}</g>`;
  s += `<g fill="#000" opacity="0.08" filter="url(#${borra(1.8 * ESC)})">${todas}</g>`;
  // Oclusão da fileira: o tampo logo à frente dos livros recebe menos luz do céu.
  const fila = [];
  for (const b of livros) {
    if (b.giro) continue;
    for (let i = 0; i <= 12; i++) {
      const [x, z] = b.A.xz(i / 12);
      fila.push([b.M([x, 0, z]), b]);
    }
  }
  const contato = (dz, opacidade, desvio) => {
    let c = "";
    for (const b of livros) {
      if (b.giro) continue;
      const frente = [];
      const tras = [];
      for (let i = 0; i <= 16; i++) {
        const [x, z] = b.A.xz(i / 16);
        frente.push(cam.p(b.M([x, 0, z + dz])));
        tras.push(cam.p(b.M([x, 0, z - 6])));
      }
      c += `<polygon points="${pontos([...frente, ...tras.reverse()])}"/>`;
    }
    // A revista: lombada reta.
    c += `<polygon points="${pontos([[0, 0, dz], [RV.T, 0, dz], [RV.T, 0, -6], [0, 0, -6]].map((p) => cam.p(RV.M(p))))}"/>`;
    // A Carreira toca o tampo só no canto do pivô.
    const [xz1, zz1] = carreira.A.xz(1);
    const [xz0, zz0] = carreira.A.xz(0.72);
    c += `<polygon points="${pontos([[xz0, 0, zz0 + dz * 0.6], [xz1 + 1, 0, zz1 + dz], [xz1 + 1, 0, zz1 - 20], [xz0, 0, zz0 - 20]].map((p) => cam.p(carreira.M([p[0], 0, p[2]]))))}"/>`;
    return `<g fill="#000" opacity="${opacidade}" filter="url(#${borra(desvio)})">${c}</g>`;
  };
  s += contato(26, 0.16, 3.2 * ESC);
  s += contato(8, 0.24, 1.2 * ESC);
  s += contato(2, 0.4, 0.5 * ESC);
  s += `</g>`;
  return s;
}

// ---------------------------------------------------------------------------- o aparador

function pontosDoAparador() {
  const r = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    r.push([XA + APARADOR.raioBase * Math.cos(a), 0, APARADOR.z + APARADOR.raioBase * Math.sin(a)]);
    r.push([XA + APARADOR.raioBase * Math.cos(a), APARADOR.altoBase, APARADOR.z + APARADOR.raioBase * Math.sin(a)]);
    r.push([XA + APARADOR.raio * Math.cos(a), APARADOR.alto - APARADOR.raio, APARADOR.z + APARADOR.raio * Math.sin(a)]);
  }
  r.push([XA, APARADOR.alto, APARADOR.z]);
  return r;
}

/** O raio da luz a partir de `q` bate na Carreira? (caixa do livro, no sistema dele) */
function carreiraTapa(q) {
  const b = carreira;
  // Leva o ponto e a direção para o sistema do livro.
  const local = (p) => {
    const s = girarZ(p, -b.giro, [PIVO, 0, 0]);
    return [s[0] - b.x0, s[1], s[2] - b.recuo];
  };
  const o = local(q);
  const d = girarZ(LUZ, -b.giro);
  let t0 = 0;
  let t1 = 1e6;
  const lim = [[0, b.T], [0, b.H], [-b.D, -b.A.s * 0.35]];
  for (let k = 0; k < 3; k++) {
    if (Math.abs(d[k]) < 1e-9) {
      if (o[k] < lim[k][0] || o[k] > lim[k][1]) return false;
      continue;
    }
    let a = (lim[k][0] - o[k]) / d[k];
    let c = (lim[k][1] - o[k]) / d[k];
    if (a > c) [a, c] = [c, a];
    t0 = Math.max(t0, a);
    t1 = Math.min(t1, c);
  }
  return t1 > t0;
}

function aparador() {
  const { raio, alto, raioBase, altoBase, z } = APARADOR;
  let s = "";
  const circ = (y, rr, a0, a1, k = 40) => {
    const ps = [];
    for (let i = 0; i <= k; i++) {
      const a = a0 + ((a1 - a0) * i) / k;
      ps.push(cam.p([XA + rr * Math.cos(a), y, z + rr * Math.sin(a)]));
    }
    return ps;
  };
  // A base: um disco de aço (48 × 9), com a borda da frente e o tampo em elipse.
  const lado = [...circ(altoBase, raioBase, 0, Math.PI), ...circ(0, raioBase, Math.PI, 0)];
  const cimaBase = circ(altoBase, raioBase, 0, Math.PI * 2, 64);
  const e = cam.p([XA - raioBase, altoBase / 2, z]);
  const d = cam.p([XA + raioBase, altoBase / 2, z]);
  // Contato no tampo: um anel escuro e justo.
  const anel = circ(0, raioBase + 1.5, 0, Math.PI * 2, 48);
  s += `<polygon points="${pontos(anel)}" fill="#000" fill-opacity="0.35" filter="url(#${borra(1.4 * ESC)})"/>`;
  const gLado = gradiente(pr, e, d, [
    [0, "#5c6462"],
    [0.12, METAL[0]],
    [0.3, "#b9c0bd"],
    [0.42, METAL[1]],
    [0.7, "#646c6a"],
    [0.9, "#596160"],
    [1, METAL[2]],
  ]);
  s += poli(lado, `url(#${gLado})`);
  const f = cam.p([XA, altoBase, z + raioBase]);
  const t = cam.p([XA, altoBase, z - raioBase]);
  const gCima = gradiente(pr, f, t, [[0, "#c4cac7"], [0.3, "#aab1ae"], [1, "#8d9592"]]);
  s += poli(cimaBase, `url(#${gCima})`);
  // A quina do tampo do disco pega luz.
  const quina = circ(altoBase - 0.4, raioBase - 0.3, 0, Math.PI, 40);
  s += `<polyline points="${pontos(quina)}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="${n(0.7 * ESC)}"/>`;
  // A sombra da Carreira no tampo do disco (projetada no plano dele).
  const sombraCarreira = sombraNoPlano(cantos(carreira), { p: [0, altoBase, 0], n: [0, 1, 0] });
  const rCima = recortePoligono(pr, cimaBase);
  s += `<g clip-path="url(#${rCima})"><polygon points="${pontos(sombraCarreira)}" fill="#000" fill-opacity="0.3" filter="url(#${borra(2.2 * ESC)})"/></g>`;
  // A sombra da barra no tampo do disco.
  const barraNaBase = sombraNoPlano(
    [0, 1, 2, 3, 4, 5, 6, 7].flatMap((i) => {
      const a = (i / 8) * Math.PI * 2;
      return [[XA + raio * Math.cos(a), altoBase, z + raio * Math.sin(a)], [XA + raio * Math.cos(a), alto, z + raio * Math.sin(a)]];
    }),
    { p: [0, altoBase, 0], n: [0, 1, 0] },
  );
  s += `<g clip-path="url(#${rCima})"><polygon points="${pontos(barraNaBase)}" fill="#000" fill-opacity="0.28" filter="url(#${borra(1 * ESC)})"/></g>`;
  // A barra: cilindro de aço de raio 6 com o alto em meia esfera.
  const topoBarra = alto - raio;
  const silh = [];
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI + (Math.PI * i) / 24; // meia volta da esquerda para a direita, por cima
    silh.push(cam.p([XA + raio * Math.cos(a + Math.PI), topoBarra + raio * Math.sin(a - Math.PI) * -1, z]));
  }
  const barra = [cam.p([XA - raio, altoBase, z]), ...silh.reverse(), cam.p([XA + raio, altoBase, z])];
  // (a silhueta: sobe pela esquerda, contorna o alto e desce pela direita)
  const contornoBarra = [cam.p([XA - raio, altoBase - 0.5, z])];
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI - (Math.PI * i) / 24;
    contornoBarra.push(cam.p([XA + raio * Math.cos(a), topoBarra + raio * Math.sin(a), z]));
  }
  contornoBarra.push(cam.p([XA + raio, altoBase - 0.5, z]));
  void barra;
  const be = cam.p([XA - raio, 200, z]);
  const bd = cam.p([XA + raio, 200, z]);
  const gBarra = gradiente(pr, be, bd, [
    [0, "#586160"],
    [0.1, METAL[0]],
    [0.26, "#c3c9c6"],
    [0.34, "#dfe4e1"],
    [0.45, METAL[1]],
    [0.72, "#626a68"],
    [0.9, "#5b6361"],
    [1, METAL[2]],
  ]);
  const rBarra = recortePoligono(pr, contornoBarra);
  s += poli(contornoBarra, `url(#${gBarra})`);
  // A sombra da Carreira na barra: de onde o raio da luz bate no livro para cima (meia-sombra larga).
  let yLuz = altoBase;
  for (let y = altoBase; y <= alto; y += 2) {
    const q = [XA - raio * 0.7, y, z + raio * 0.7];
    if (!carreiraTapa(q)) yLuz = y;
    else break;
  }
  const pa = cam.p([XA, yLuz - 30, z]);
  const pb = cam.p([XA, yLuz + 50, z]);
  const gSombra = gradiente(pr, pa, pb, [[0, "#000", 0], [1, "#000", 0.34]]);
  s += `<g clip-path="url(#${rBarra})"><rect x="${n(be[0] - 2)}" y="${n(cam.p([XA, alto + 2, z])[1])}" width="${n(bd[0] - be[0] + 4)}" height="${n(cam.p([XA, altoBase, z])[1] - cam.p([XA, alto + 2, z])[1])}" fill="url(#${gSombra})"/>`;
  // O brilho da meia esfera do alto e a luz do tampo refletida no pé da barra.
  const cap = cam.p([XA - raio * 0.35, topoBarra + raio * 0.55, z]);
  const gCap = pr.id("brilho");
  pr.def(`<radialGradient id="${gCap}" gradientUnits="userSpaceOnUse" cx="${n(cap[0])}" cy="${n(cap[1])}" r="${n(4 * ESC)}"><stop offset="0" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`);
  s += `<circle cx="${n(cap[0])}" cy="${n(cap[1])}" r="${n(4 * ESC)}" fill="url(#${gCap})"/>`;
  const pe0 = cam.p([XA, altoBase, z]);
  const pe1 = cam.p([XA, altoBase + 40, z]);
  const gPe = gradiente(pr, pe0, pe1, [[0, "#fff", 0.16], [1, "#fff", 0]]);
  s += `<rect x="${n(be[0] - 2)}" y="${n(pe1[1])}" width="${n(bd[0] - be[0] + 4)}" height="${n(pe0[1] - pe1[1])}" fill="url(#${gPe})"/>`;
  s += `</g>`;
  // Contato da barra com o disco.
  const junta = circ(altoBase + 0.3, raio + 0.8, 0, Math.PI, 16);
  s += `<polyline points="${pontos(junta)}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="${n(0.8 * ESC)}" filter="url(#${borra(0.4 * ESC)})"/>`;
  return s;
}

// ---------------------------------------------------------------------------- os lados nos vãos

/**
 * Nos vãos, a câmera vê um pedaço do lado de um dos vizinhos: à esquerda do centro, a capa (lado +x)
 * do livro da esquerda; à direita, a contracapa (lado −x) do livro da direita. Quase tudo fica no
 * escuro do vão; a parte que passa do vizinho mais baixo pega a luz conforme o lado.
 */
function ladoVisivel(b, lado, vizinho) {
  const { T, H, D, A, M } = b;
  const x = lado === "capa" ? T : 0;
  const face = (y0, y1) => [[x, y0, -A.s], [x, y1, -A.s], [x, y1, -D], [x, y0, -D]].map((p) => cam.p(M(p)));
  let s = "";
  if (lado === "capa") {
    // A capa: papel em cima (300 de 720, na escala do livro) e a cor embaixo.
    const div = H - (300 * H) / 720;
    s += poli(face(div, H), PAPEL) + poli(face(0, div), b.l.cor);
  } else {
    s += poli(face(0, H), b.l.cor); // a contracapa: lisa, na cor do livro
  }
  const inteira = face(0, H);
  const nr = b.Mn(lado === "capa" ? [1, 0, 0] : [-1, 0, 0]);
  const luz = brilho(nr);
  // O lado que foge da luz escurece; o que a encara fica quase como é.
  s += poli(inteira, "#000", limitar((0.78 - luz) * 0.9, 0.04, 0.5));
  // O vão: do chão até a altura do vizinho, escuro, mais fundo quanto mais para dentro.
  const hv = vizinho.giro ? vizinho.H * 0.97 : vizinho.H;
  const noVao = face(0, Math.min(H, hv) - 2);
  const frente = cam.p(M([x, H / 2, -A.s]));
  const fundo = cam.p(M([x, H / 2, -D]));
  const g = gradiente(pr, frente, fundo, [[0, "#000", 0.5], [0.12, "#000", 0.66], [0.4, "#000", 0.8], [1, "#000", 0.86]]);
  s += `<polygon points="${pontos(noVao)}" fill="url(#${g})" filter="url(#${borra(1.2 * ESC)})"/>`;
  return s;
}

/**
 * O fundo de um vão: pela fresta de 6 entre dois livros de 13 a 15 cm de fundo se vê a parede e o
 * tampo na sombra deles; só perto do alto do mais baixo entra um pouco de luz.
 */
function fundoDoVao(a, b) {
  const h = Math.min(a.H, b.H);
  const e0 = cam.p(a.M([a.T - 1, 0, -a.A.s]));
  const e1 = cam.p(a.M([a.T - 1, h, -a.A.s]));
  const d1 = cam.p(b.M([1, h, -b.A.s]));
  const d0 = cam.p(b.M([1, 0, -b.A.s]));
  const g = gradiente(pr, [0, e0[1]], [0, e1[1]], [
    [0, "#000", 0.8],
    [0.55, "#000", 0.74],
    [0.8, "#000", 0.6],
    [0.93, "#000", 0.42],
    [1, "#000", 0.3],
  ]);
  return poli([e0, e1, d1, d0], `url(#${g})`);
}

function lados() {
  let s = "";
  for (let i = 0; i < livros.length - 1; i++) {
    const a = livros[i];
    const b = livros[i + 1];
    if (b.giro) continue; // o vão da Carreira é a cunha, tratada à parte
    s += fundoDoVao(a, b);
    const xv = a.x0 + a.T + VAO / 2;
    s += xv < XC ? ladoVisivel(a, "capa", b) : ladoVisivel(b, "contracapa", a);
  }
  s += cunhaDaCarreira();
  s += ladoDaRevista();
  return s;
}

/**
 * A cunha entre o SRE e a Carreira inclinada: a contracapa da Carreira aparece inteira no alto (a
 * face encara a luz), com a sombra do SRE embaixo e o escuro do vão onde a cunha fecha.
 */
function cunhaDaCarreira() {
  const b = carreira;
  const vizinho = livros[ULTIMO - 1];
  const { T, H, D, A, M } = b;
  // O fundo da cunha: a parede e o tampo na sombra do SRE; no alto (a cunha abre até uns 70), a luz
  // que passa por cima do SRE chega à parede e o fundo clareia.
  const hv = vizinho.H;
  const naBorda = (y) => (y - T * sen6) / cos6; // a altura, na borda esquerda da Carreira, de um y do mundo
  const pe = M([1, 0, -A.s]);
  const fundo = [
    cam.p(vizinho.M([vizinho.T - 1, 0, -vizinho.A.s])),
    cam.p(vizinho.M([vizinho.T - 1, hv, -vizinho.A.s])),
    cam.p(M([1, naBorda(hv), -A.s])),
    cam.p(pe),
    cam.p([pe[0], 0, pe[2]]),
  ];
  const f0 = cam.p([0, 0, -A.s]);
  const f1 = cam.p([0, hv, -A.s]);
  const gf = gradiente(pr, [0, f0[1]], [0, f1[1]], [
    [0, "#000", 0.8],
    [0.35, "#000", 0.68],
    [0.62, "#000", 0.46],
    [0.8, "#000", 0.24],
    [0.93, "#000", 0.1],
    [1, "#000", 0.04],
  ]);
  let s = poli(fundo, `url(#${gf})`);
  const face = [[0, 0, -A.s], [0, H, -A.s], [0, H, -D], [0, 0, -D]].map((p) => cam.p(M(p)));
  s += poli(face, b.l.cor);
  const luz = brilho(b.Mn([-1, 0, 0]));
  s += poli(face, "#000", limitar((0.8 - luz) * 0.9, 0.02, 0.5));
  const rec = recortePoligono(pr, face);
  // A sombra do SRE na contracapa: projetada no plano da face.
  const plano = { p: M([0, 0, 0]), n: b.Mn([-1, 0, 0]) };
  const somb = sombraNoPlano(cantos(vizinho), plano);
  s += `<g clip-path="url(#${rec})">`;
  s += `<polygon points="${pontos(somb)}" fill="#000" fill-opacity="0.3" filter="url(#${borra(3 * ESC)})"/>`;
  s += `<polygon points="${pontos(somb)}" fill="#000" fill-opacity="0.12" filter="url(#${borra(1 * ESC)})"/>`;
  // Oclusão: a cunha fecha embaixo (6 de vão no pé, uns 70 no alto do SRE).
  const baixo = cam.p(M([0, 0, -A.s]));
  const cima = cam.p(M([0, vizinho.H, -A.s]));
  const g = gradiente(pr, baixo, cima, [[0, "#000", 0.62], [0.25, "#000", 0.34], [0.6, "#000", 0.12], [1, "#000", 0.02]]);
  s += poli(face, `url(#${g})`);
  // Mais fundo, mais escuro.
  const f0 = cam.p(M([0, H / 2, -A.s]));
  const f1 = cam.p(M([0, H / 2, -D]));
  const g2 = gradiente(pr, f0, f1, [[0, "#000", 0], [0.5, "#000", 0.08], [1, "#000", 0.2]]);
  s += poli(face, `url(#${g2})`);
  s += grao(face, GRAO, rec);
  s += `</g>`;
  // O vão embaixo do canto que levantou: o tampo sob o livro, no escuro.
  const cunha = [];
  for (let i = 0; i <= 12; i++) {
    const [x, z] = A.xz(i / 12);
    cunha.push(cam.p(M([x, 0, z])));
  }
  const chao = [];
  for (let i = 12; i >= 0; i--) {
    const [x, z] = A.xz(i / 12);
    const p = M([x, 0, z]);
    chao.push(cam.p([p[0], 0, p[2] + 2]));
  }
  s += `<polygon points="${pontos([...cunha, ...chao])}" fill="#000" fill-opacity="0.55" filter="url(#${borra(0.8 * ESC)})"/>`;
  return s;
}

/**
 * O lado da revista que a câmera vê (a quarta capa, em papel, com a faixa laranja no alto como a
 * lombada e a capa): encara a luz, com as sombras da Carreira e do aparador.
 */
function ladoDaRevista() {
  const { T, H, D, M } = RV;
  const face = (y0, y1) => [[0, y0, 0], [0, y1, 0], [0, y1, -D], [0, y0, -D]].map((p) => cam.p(M(p)));
  const toda = face(0, H);
  let s = poli(toda, REVISTA.papel);
  s += poli(face(H - 14, H), REVISTA.destaque);
  const luz = brilho([-1, 0, 0]);
  s += poli(toda, "#000", limitar((0.8 - luz) * 0.9, 0.03, 0.5));
  const rec = recortePoligono(pr, toda);
  const plano = { p: M([0, 0, 0]), n: [-1, 0, 0] };
  const somb = [sombraNoPlano(cantos(carreira), plano), sombraNoPlano(pontosDoAparador().filter((p) => p[1] > APARADOR.altoBase + 1), plano), sombraNoPlano(pontosDoAparador().filter((p) => p[1] <= APARADOR.altoBase + 1), plano)];
  s += `<g clip-path="url(#${rec})">`;
  const todas = somb.map((f) => `<polygon points="${pontos(f)}"/>`).join("");
  s += `<g fill="#000" opacity="0.22" filter="url(#${borra(3.5 * ESC)})">${todas}</g>`;
  s += `<g fill="#000" opacity="0.1" filter="url(#${borra(1 * ESC)})">${todas}</g>`;
  // Oclusão: mais fundo e mais perto do tampo, mais escuro.
  const f0 = cam.p(M([0, H / 2, 0]));
  const f1 = cam.p(M([0, H / 2, -D]));
  s += poli(toda, `url(#${gradiente(pr, f0, f1, [[0, "#000", 0], [0.6, "#000", 0.06], [1, "#000", 0.18]])})`);
  const b0 = cam.p(M([0, 0, -D / 3]));
  const b1 = cam.p(M([0, 60, -D / 3]));
  s += poli(toda, `url(#${gradiente(pr, b0, b1, [[0, "#000", 0.2], [1, "#000", 0]])})`);
  s += grao(toda, GRAO, rec);
  s += `</g>`;
  // A dobra da capa na lombada: uma quina clara.
  const q0 = cam.p(M([0, 0.5, -0.6]));
  const q1 = cam.p(M([0, H - 0.5, -0.6]));
  s += `<line x1="${n(q0[0])}" y1="${n(q0[1])}" x2="${n(q1[0])}" y2="${n(q1[1])}" stroke="#fff" stroke-opacity="0.3" stroke-width="${n(0.8 * ESC)}"/>`;
  void T;
  return s;
}

// ---------------------------------------------------------------------------- o alto dos livros

/**
 * O alto de um livro de capa dura, visto de um pouco acima: as duas capas (papelão forrado) passam a
 * seixa do miolo; entre elas, o alto do miolo, creme, com as folhas; na frente, atrás da coifa, o
 * cabeceado. A contracapa (à esquerda) é lisa na cor do livro; a capa (à direita) é papel no alto.
 */
function topoDoLivro(b) {
  const { T, H, D, A, M, l } = b;
  const yM = H - SEIXA;
  const xa = PAPELAO + 0.7;
  const xb = T - PAPELAO - 0.7;
  const zTras = -(D - SEIXA);
  const tela = (p) => cam.p(M(p));
  const zDorso = (x) => A.zEm(x) - 4; // o dorso do miolo, atrás da lombada
  let s = "";

  // 1. A face de dentro da capa que a câmera vê (a guarda, em papel), acima do miolo e na seixa da frente.
  const esquerda = b.centro[0] < XC;
  const xi = esquerda ? PAPELAO : T - PAPELAO;
  const guarda = [[xi, yM - 16, -D + 0.5], [xi, H, -D + 0.5], [xi, H, A.zEm(xi) - 3], [xi, yM, A.zEm(xi) - 3]].map(tela);
  s += poli(guarda, PAPEL) + poli(guarda, "#000", 0.3);

  // 2. O alto do miolo: papel creme, iluminado de cima.
  const miolo = [];
  const k = 20;
  for (let i = 0; i <= k; i++) {
    const x = xa + ((xb - xa) * i) / k;
    miolo.push([x, yM, zDorso(x)]);
  }
  miolo.push([xb, yM, zTras], [xa, yM, zTras]);
  const mt = miolo.map(tela);
  const rMiolo = recortePoligono(pr, mt);
  s += poli(mt, MIOLO);
  s += `<g clip-path="url(#${rMiolo})">`;
  s += linhasDasFolhas(cam, [[xa, yM, -A.s - 2], [xa, yM, zTras], [xb, yM, zTras], [xb, yM, -A.s - 2]].map(M), {
    quantas: Math.round(T / 1.9),
    opacidade: 0.075,
    largura: 0.38,
    semente: 17 + T,
  });
  // A sombra da capa da esquerda no miolo (a luz vem da esquerda e passa por cima da seixa).
  const L = b.luzLocal;
  const w = (SEIXA * -L[0]) / L[1];
  const dz = (SEIXA * L[2]) / L[1];
  const sombraE = [[xa - 1, yM, -A.s], [xa + w, yM, -A.s - dz], [xa + w, yM, zTras], [xa - 1, yM, zTras]].map(tela);
  s += `<polygon points="${pontos(sombraE)}" fill="#000" fill-opacity="0.2" filter="url(#${borra(0.7 * ESC)})"/>`;
  // Oclusão no fundo da calha: junto das capas e no fundo.
  const e0 = tela([xa, yM, -D / 2]);
  const e1 = tela([xb, yM, -D / 2]);
  s += poli(mt, `url(#${gradiente(pr, e0, e1, [[0, "#000", 0.14], [0.08, "#000", 0.03], [0.92, "#000", 0.02], [1, "#000", 0.1]])})`);
  const f0 = tela([T / 2, yM, -A.s]);
  const f1 = tela([T / 2, yM, zTras]);
  s += poli(mt, `url(#${gradiente(pr, f0, f1, [[0, "#000", 0.12], [0.35, "#000", 0.02], [0.9, "#fff", 0.04], [1, "#000", 0.06]])})`);
  s += `</g>`;

  // 3. O cabeceado: um cordão de duas cores no dorso do miolo, visto por cima da coifa.
  const listras = Math.max(10, Math.round((xb - xa) / 2.3));
  const zc = (x) => zDorso(x) + 0.3;
  const corA = l.cor;
  const corB = PAPEL;
  let cab = "";
  for (let i = 0; i < listras; i++) {
    const x0 = xa + ((xb - xa) * i) / listras;
    const x1 = xa + ((xb - xa) * (i + 1)) / listras;
    const q = [[x0, yM + 0.5, zc(x0)], [x1, yM + 0.5, zc(x1)], [x1, H - 0.35, zc(x1)], [x0, H - 0.35, zc(x0)]].map(tela);
    cab += poli(alargarX(q, 0.25), i % 2 ? corB : corA);
  }
  const contornoCab = [];
  for (let i = 0; i <= 16; i++) {
    const x = xa + ((xb - xa) * i) / 16;
    contornoCab.push(tela([x, H - 0.35, zc(x)]));
  }
  for (let i = 16; i >= 0; i--) {
    const x = xa + ((xb - xa) * i) / 16;
    contornoCab.push(tela([x, yM + 0.5, zc(x)]));
  }
  const rCab = recortePoligono(pr, contornoCab);
  s += `<g clip-path="url(#${rCab})">${cab}`;
  // O cordão é redondo: claro em cima, escuro embaixo; e fica no fundo da coifa, na sombra.
  const c0 = tela([T / 2, H - 0.35, zc(T / 2)]);
  const c1 = tela([T / 2, H - 4.5, zc(T / 2)]);
  s += poli(contornoCab, `url(#${gradiente(pr, c0, c1, [[0, "#fff", 0.28], [0.3, "#fff", 0.05], [0.7, "#000", 0.25], [1, "#000", 0.45]])})`);
  s += poli(contornoCab, "#000", 0.12);
  s += `</g>`;

  // 4. O alto das capas: papelão forrado, com a quina de fora amaciada.
  const capa = (x0, x1, cor, zf0, zf1) => {
    const ps = [[x0, H, zf0], [x1, H, zf1], [x1, H, -D + 1.2], [x0, H, -D + 1.2]].map(tela);
    let c = poli(ps, cor);
    const a = tela([x0, H, -D / 2]);
    const bb = tela([x1, H, -D / 2]);
    // Face de cima: recebe a luz principal; a quina de fora (à esquerda) brilha um pouco.
    c += poli(ps, `url(#${gradiente(pr, a, bb, [[0, "#fff", x0 === 0 ? 0.12 : 0.04], [0.3, "#fff", 0.07], [0.7, "#fff", 0.05], [1, "#000", x1 === T ? 0.1 : 0.04]])})`);
    return c;
  };
  s += capa(0, PAPELAO, l.cor, -A.s, A.zEm(PAPELAO) - 2.5);
  s += capa(T - PAPELAO, T, PAPEL, A.zEm(T - PAPELAO) - 2.5, -A.s);
  // A quina de trás das capas (a seixa da frente do livro): um fio mais escuro.
  const tras = [tela([0, H, -D + 1.2]), tela([T, H, -D + 1.2])];
  void tras;
  return s;
}

/** Alarga um quadrilátero só no sentido horizontal (contra a costura entre as listras). */
function alargarX(q, d) {
  const cx = q.reduce((s, p) => s + p[0], 0) / q.length;
  return q.map(([x, y]) => [x + Math.sign(x - cx) * d, y]);
}

/** A sombra do vizinho da esquerda, mais alto, no alto do livro (a luz vem da esquerda). */
function sombraDoVizinho(a, b) {
  if (a.H <= b.H + 1) return "";
  let s = "";
  const pts = cantos(a);
  for (const [y, recorte] of [
    [b.H, contornoDoAlto(b, "capas")],
    [b.H - SEIXA, contornoDoAlto(b, "miolo")],
  ]) {
    const somb = sombraNoPlano(pts, { p: b.M([0, y, 0]), n: b.Mn([0, 1, 0]) });
    const id = recortePoligono(pr, recorte);
    s += `<g clip-path="url(#${id})"><polygon points="${pontos(somb)}" fill="#000" fill-opacity="0.24" filter="url(#${borra(1.2 * ESC)})"/></g>`;
  }
  return s;
}

/** O contorno do alto (as capas, ou o miolo) de um livro, na tela. */
function contornoDoAlto(b, qual) {
  const { T, H, D, A, M } = b;
  if (qual === "miolo") {
    const yM = H - SEIXA;
    return [[PAPELAO, yM, -A.s * 0.2], [T - PAPELAO, yM, -A.s * 0.2], [T - PAPELAO, yM, -(D - SEIXA)], [PAPELAO, yM, -(D - SEIXA)]].map((p) => cam.p(M(p)));
  }
  return [[0, H, 0], [T, H, 0], [T, H, -D], [0, H, -D]].map((p) => cam.p(M(p)));
}

/** O alto da revista: a capa mole rente ao miolo (sem seixa), folhas finas. */
function topoDaRevista() {
  const { T, H, D, M } = RV;
  const tela = (p) => cam.p(M(p));
  const todo = [[0, H, 0], [T, H, 0], [T, H, -D], [0, H, -D]].map(tela);
  let s = poli(todo, MIOLO);
  const rec = recortePoligono(pr, todo);
  s += `<g clip-path="url(#${rec})">`;
  s += linhasDasFolhas(cam, [[1.2, H, -1.2], [1.2, H, -D], [T - 1.2, H, -D], [T - 1.2, H, -1.2]].map(M), { quantas: 46, opacidade: 0.1, largura: 0.35, semente: 91 });
  const a = tela([0, H, -D / 2]);
  const b = tela([T, H, -D / 2]);
  s += poli(todo, `url(#${gradiente(pr, a, b, [[0, "#fff", 0.2], [0.03, "#fff", 0.04], [0.95, "#000", 0.03], [1, "#000", 0.14]])})`);
  s += `</g>`;
  // As bordas da capa (papel da capa, 1,2 de espessura).
  for (const x of [0, T - 1.2]) s += poli([[x, H, -0.5], [x + 1.2, H, -0.5], [x + 1.2, H, -D], [x, H, -D]].map(tela), REVISTA.papel);
  return s;
}

// ---------------------------------------------------------------------------- as lombadas

/** A silhueta da lombada na tela: o pé no arco, o alto na coifa. */
function silhuetaDaLombada(b, k = 48) {
  const { A, M } = b;
  const ps = [];
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    const [x, z] = A.xz(t);
    ps.push(cam.p(M([x, b.pe(t), z])));
  }
  for (let i = k; i >= 0; i--) {
    const t = i / k;
    const [x, z] = A.xz(t);
    ps.push(cam.p(M([x, b.cabeca(t), z])));
  }
  return ps;
}

/**
 * A luz da lombada arredondada: para cada ponto da curva, a luz principal (Lambert), a rebatida, a
 * oclusão perto dos vãos e um brilho largo e suave (Blinn-Phong de expoente baixo). Vira dois
 * gradientes ao longo da curva, na tela: um escuro e um claro.
 */
function luzDaLombada(b, forma) {
  const { T, H, A, M, Mn } = b;
  const yRef = H / 2;
  const pa = cam.p(M([...A.xz(0).slice(0, 1), yRef, A.xz(0)[1]]));
  const pb = cam.p(M([A.xz(1)[0], yRef, A.xz(1)[1]]));
  const eixo = [pb[0] - pa[0], pb[1] - pa[1]];
  const l2 = eixo[0] ** 2 + eixo[1] ** 2;
  const escuro = [];
  const claro = [];
  const REF = 0.74; // o brilho em que a cor impressa aparece como é
  const amostras = 40;
  for (let i = 0; i <= amostras; i++) {
    const t = i / amostras;
    const [x, z] = A.xz(t);
    const q = cam.p(M([x, yRef, z]));
    const off = limitar(((q[0] - pa[0]) * eixo[0] + (q[1] - pa[1]) * eixo[1]) / l2);
    const nr = Mn(A.normal(t));
    // Os vizinhos tiram luz perto das bordas (o vão tem 6 de largura).
    const borda = Math.min(t, 1 - t);
    const oclusao = 1 - 0.45 * (1 - suave(0, 0.16, borda));
    const lamb = Math.max(0, dot(nr, LUZ));
    const reb = Math.max(0, dot(nr, REBATIDA));
    const I = 0.3 * oclusao + 0.62 * lamb * (0.75 + 0.25 * oclusao) + 0.14 * reb;
    let e = limitar(((REF - I) / REF) * 0.85, 0, 0.7);
    // O vinco da junta: um fio escuro em cada borda.
    if (t < 0.025) e = Math.max(e, 0.3 * (1 - t / 0.025));
    if (t > 0.975) e = Math.max(e, 0.42 * (1 - (1 - t) / 0.025));
    const V = normal(sub(cam.olho, M([x, yRef, z])));
    const Hh = normal(soma(LUZ, V));
    const esp = Math.pow(Math.max(0, dot(nr, Hh)), 9) * 0.1;
    const c = limitar(Math.max(0, I - REF) * 0.6 + esp, 0, 0.4);
    escuro.push([off, "#000", op(e)]);
    claro.push([off, "#fff", op(c)]);
  }
  escuro.sort((p, q) => p[0] - q[0]);
  claro.sort((p, q) => p[0] - q[0]);
  let s = poli(forma, `url(#${gradiente(pr, pa, pb, escuro)})`);
  s += poli(forma, `url(#${gradiente(pr, pa, pb, claro)})`);
  // Na vertical: o alto recebe um pouco mais da luz de cima; o pé, junto do tampo, um pouco menos.
  const v0 = cam.p(M([T / 2, H, 0]));
  const v1 = cam.p(M([T / 2, 0, 0]));
  s += poli(forma, `url(#${gradiente(pr, v0, v1, [[0, "#fff", 0.05], [0.2, "#fff", 0.01], [0.75, "#000", 0], [0.94, "#000", 0.04], [1, "#000", 0.1]])})`);
  return s;
}

function lombadaDoLivro(b) {
  const { T, H, A, M } = b;
  const P = (u, v) => {
    const [x, z] = A.xz(u / T);
    return M([x, H - v, z]);
  };
  const arte = pr.simbolo(lombadaDaEstante(b.slug), { largura: T, altura: H, nome: `lombada-${b.slug}` });
  const { svg } = superficie(pr, { ref: arte, w: T, h: H, P, cam, nu: 30, nv: 1, folga: 0.4 });
  const forma = silhuetaDaLombada(b);
  const rec = recortePoligono(pr, forma);
  let s = `<g clip-path="url(#${rec})">${svg}`;
  s += luzDaLombada(b, forma);
  s += grao(forma, GRAO, rec);
  s += `</g>`;
  // A coifa: a borda de cima, redonda, pega a luz do alto.
  const k = 40;
  const alto = [];
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    const [x, z] = A.xz(t);
    alto.push(cam.p(M([x, b.cabeca(t) - 0.9, z])));
  }
  s += `<polyline points="${pontos(alto.slice(1, -1))}" fill="none" stroke="#fff" stroke-opacity="0.34" stroke-width="${n(1.1 * ESC)}" stroke-linecap="round"/>`;
  // O pé: um fio escuro onde a lombada encosta no tampo.
  const pe = [];
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    const [x, z] = A.xz(t);
    pe.push(cam.p(M([x, b.pe(t) + 0.4, z])));
  }
  s += `<polyline points="${pontos(pe)}" fill="none" stroke="#000" stroke-opacity="0.28" stroke-width="${n(0.8 * ESC)}"/>`;
  return s;
}

/** A lombada da revista: quadrada, plana; as dobras da capa nas duas bordas. */
function lombadaDaRevista() {
  const { T, H, M } = RV;
  const arte = pr.simbolo(lombadaDaRevistaNaEstante(), { largura: T, altura: H, nome: "lombada-revista" });
  const P = (u, v) => M([u, H - v, 0]);
  const { svg } = superficie(pr, { ref: arte, w: T, h: H, P, cam, nu: 2, nv: 1, folga: 0.3 });
  const r = 1.6;
  const forma = [];
  const quina = (cx, cy, a0, a1) => {
    for (let i = 0; i <= 5; i++) {
      const a = a0 + ((a1 - a0) * i) / 5;
      forma.push(cam.p(M([cx + r * Math.cos(a), cy + r * Math.sin(a), 0])));
    }
  };
  quina(r, H - r, Math.PI, Math.PI / 2);
  quina(T - r, H - r, Math.PI / 2, 0);
  forma.push(cam.p(M([T, 0, 0])), cam.p(M([0, 0, 0])));
  const rec = recortePoligono(pr, forma);
  let s = `<g clip-path="url(#${rec})">${svg}`;
  const a = cam.p(M([0, H / 2, 0]));
  const b = cam.p(M([T, H / 2, 0]));
  // Face plana de frente: luz quase uniforme; as dobras viram: a da esquerda pega luz, a da direita não.
  const I = brilho([0, 0, 1]);
  const e = limitar(((0.74 - I) / 0.74) * 0.85, 0, 0.5);
  s += poli(forma, `url(#${gradiente(pr, a, b, [[0, "#000", 0.16], [0.012, "#fff", 0.16], [0.035, "#fff", 0.03], [0.1, "#000", e], [0.85, "#000", e + 0.03], [0.965, "#000", e + 0.1], [1, "#000", 0.42]])})`);
  const v0 = cam.p(M([T / 2, H, 0]));
  const v1 = cam.p(M([T / 2, 0, 0]));
  s += poli(forma, `url(#${gradiente(pr, v0, v1, [[0, "#fff", 0.05], [0.2, "#fff", 0.01], [0.75, "#000", 0], [0.94, "#000", 0.04], [1, "#000", 0.1]])})`);
  s += grao(forma, GRAO, rec);
  s += `</g>`;
  const t0 = cam.p(M([r, H - 0.6, 0]));
  const t1 = cam.p(M([T - r, H - 0.6, 0]));
  s += `<line x1="${n(t0[0])}" y1="${n(t0[1])}" x2="${n(t1[0])}" y2="${n(t1[1])}" stroke="#fff" stroke-opacity="0.3" stroke-width="${n(0.9 * ESC)}"/>`;
  const p0 = cam.p(M([0, 0.4, 0]));
  const p1 = cam.p(M([T, 0.4, 0]));
  s += `<line x1="${n(p0[0])}" y1="${n(p0[1])}" x2="${n(p1[0])}" y2="${n(p1[1])}" stroke="#000" stroke-opacity="0.28" stroke-width="${n(0.8 * ESC)}"/>`;
  return s;
}

// ---------------------------------------------------------------------------- a montagem

pr.add(`<g id="${pr.id("parede")}">${parede()}</g>`);
pr.add(`<g id="${pr.id("tampo")}">${tampo()}${sombrasNoTampo()}</g>`);
pr.add(`<g id="${pr.id("lados")}">${lados()}</g>`);
pr.add(`<g id="${pr.id("aparador")}">${aparador()}</g>`);
{
  let s = "";
  for (const b of livros) s += topoDoLivro(b);
  for (let i = 0; i < livros.length - 1; i++) s += sombraDoVizinho(livros[i], livros[i + 1]);
  s += topoDaRevista();
  pr.add(`<g id="${pr.id("altos")}">${s}</g>`);
}
{
  let s = "";
  for (const b of livros) s += lombadaDoLivro(b);
  s += lombadaDaRevista();
  pr.add(`<g id="${pr.id("lombadas")}">${s}</g>`);
}
pr.add(`<g id="${pr.id("frente")}">${frenteDaEstante()}</g>`);

const saida = fileURLToPath(new URL("./p07-estante.svg", import.meta.url));
pr.salvar(saida);
console.log("✓", saida, `(${Math.round(pr.svg().length / 1024)} KB, ${n(ESC)} px por unidade)`);
