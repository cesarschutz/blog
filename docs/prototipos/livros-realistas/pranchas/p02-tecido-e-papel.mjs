#!/usr/bin/env node
/**
 * Prancha 02 · Meia-encadernação: tecido e papel (livro Dados).
 *
 * A capa como meia-encadernação de verdade: a parte de cor (v de 300 a 720) em tecido de
 * encadernação (linho) e a parte clara (0 a 300) em papel de algodão colado por cima, com a borda de
 * baixo do papel sobrepondo o tecido. A lombada segue igual: papel em cima, tecido embaixo.
 *
 *   fnm exec --using=24 node pranchas/p02-tecido-e-papel.mjs            →  pranchas/p02-tecido-e-papel.svg
 *   fnm exec --using=24 node pranchas/p02-tecido-e-papel.mjs --plano x.svg   (a capa plana com os
 *                                                   materiais, sem 3D: para conferir as texturas)
 *
 * Como os materiais são feitos:
 * - Linho: uma trama tafetá (fio por cima, fio por baixo, passo de 2,25) desenhada num <pattern> com a
 *   luz já "assada" (cada laçada é um calombo claro do lado da luz e escuro do outro, os vãos escuros).
 *   O padrão está no espaço da arte, então é mapeado junto com ela, em perspectiva. Por cima, os
 *   "slubs" do linho (fios mais grossos aqui e ali, com o seu fio de luz e de sombra), manchas largas
 *   de tingimento e a penugem fina, estas duas no espaço da tela.
 * - Tinta no tecido (frase, desenho, assinatura): uma máscara com o mesmo padrão afina a tinta nos
 *   vãos da trama; o relevo da trama passa por cima da tinta (a tinta segue os fios).
 * - Papel de algodão: feltro (ruído em relevo, luz do alto à esquerda) e grão fino, na tela.
 * - Tipografia (letterpress): o título e a linha do topo afundam no papel. O relevo sai de um filtro
 *   na tela sobre a máscara das letras: sombra fina por dentro do lado da luz, fio claro do outro, e o
 *   papel descendo em volta (almofada).
 * - Construção: tábuas de 8, seixa de 9, lombada arredondada (bojo de 18), vinco da dobradiça em 22,
 *   cabeceado listrado, miolo creme com as folhas, frente do miolo côncava, cantos arredondados.
 * - Luz: uma janela grande do alto à esquerda, rasante na capa (20° acima do plano). A sombra no chão é
 *   a soma de várias direções da janela (contato escuro, penumbra que abre com a distância).
 */
import { fileURLToPath } from "node:url";
import { livro, partesDaCapa, lombada, PAPEL } from "../base/base.mjs";
import {
  Prancha, camera, enquadrar, girarY, soma, sub, mul, dot, cross, normal, grau, limitar,
  aleatorio, afim, matriz, pontos, alargar, area, contorno, gradiente, filtroDesfoque, n,
} from "../ferramentas/cena.mjs";

// ---------- o livro ----------

const L = livro("dados");
const W = 480; // largura da capa (da junta até a frente)
const H = 720; // altura da capa
const T = L.largura; // espessura do livro = largura da lombada (128)
const DIVISAO = 300; // onde o papel acaba e o tecido começa (na capa e na lombada)
const TABUA = 8; // papelão de cada capa
const SEIXA = 9; // quanto a capa passa do miolo no alto, no pé e na frente
const BOJO = 18; // saliência da lombada arredondada (14% da espessura)
const XB = 27; // onde começa a tábua da capa (o vão da dobradiça fica antes, com o vinco em 22)
const VINCO = 22;
const RAIO_CANTO = 2.4; // cantos da capa, um pouco arredondados

// A lombada: arco que passa por z = ±T/2 em x = 0 e sai BOJO para fora (x negativo).
const XC = (T * T / 4 - BOJO * BOJO) / (2 * BOJO);
const R = XC + BOJO;
const PHI = Math.asin(T / 2 / R);
/** Ângulo no arco para a coordenada u da arte da lombada (0 = lado da contracapa, T = lado da capa). */
const angulo = (u) => Math.PI + PHI - 2 * PHI * (u / T);
/** Ponto do arco (sem giro), a uma distância `recuo` para dentro. */
const arco = (u, y, recuo = 0) => {
  const th = angulo(u);
  return [XC + (R - recuo) * Math.cos(th), y, (R - recuo) * Math.sin(th)];
};

// ---------- materiais (no espaço da arte) ----------

const PASSO = 2.25; // passo dos fios do linho (unidades da arte; ≈ 0,7 mm)
const COR = L.cor; // #5f4662: a cor média do tecido continua sendo a do livro

/**
 * A cor `hex` sob uma luz `k` vezes mais forte (conta feita em luz linear): é o "claro" do tecido.
 * Branco por cima de uma cor escura a acinzenta; a mesma cor mais iluminada mantém o matiz.
 */
function clarear(hex, k) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const srgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
  return `#${[1, 3, 5].map((i) => Math.round(255 * srgb(Math.min(1, lin(parseInt(hex.slice(i, i + 2), 16) / 255) * k))).toString(16).padStart(2, "0")).join("")}`;
}
const CLARO = clarear(COR, 2.6); // o linho mais iluminado (o topo dos fios, os fios grossos)

/** A borda de baixo do papel colado: reta, com uma ondulação mínima de colagem à mão. */
const bordaDoPapel = (u, fase = 0) => DIVISAO + 0.14 * Math.sin(u / 37 + 0.4 + fase) + 0.09 * Math.sin(u / 13.1 + 1.3 + fase * 2);

/** As definições dos materiais (padrões, gradientes, máscaras) nas defs da prancha. Devolve os ids. */
function definirMateriais(pr) {
  const p = PASSO;
  const S = 2 * p;
  const ids = {};
  // Gradientes (objectBoundingBox: cada um serve para todas as laçadas do mesmo tipo).
  const grad = (nome, x2, y2, paradas) => {
    const id = pr.id(nome);
    pr.def(`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${paradas.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${n(a * 1000) / 1000}"/>`).join("")}</linearGradient>`);
    return id;
  };
  const largU = 0.64 * p; // largura visível do fio de urdume (mais fino)
  const largT = 0.86 * p; // e do fio de trama (mais grosso: o linho marca mais na horizontal)
  const comp = 1.08 * p; // comprimento da laçada (passa um pouco da célula)
  const furos = []; // os vãos: o ladrilho menos as laçadas (evenodd)
  const retangulos = [];
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 2; i++) {
      const urdume = (i + j) % 2 === 0;
      const w = urdume ? largU : comp;
      const h = urdume ? comp : largT;
      const x = (i + 0.5) * p - w / 2;
      const y = (j + 0.5) * p - h / 2;
      const r = (urdume ? largU : largT) / 2;
      retangulos.push({ urdume, ret: `x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}"` });
      furos.push(urdume
        ? `M${n(x)} ${n(y + r)}a${n(r)} ${n(r)} 0 0 1 ${n(w)} 0v${n(h - 2 * r)}a${n(r)} ${n(r)} 0 0 1 ${n(-w)} 0Z`
        : `M${n(x + r)} ${n(y)}h${n(w - 2 * r)}a${n(r)} ${n(r)} 0 0 1 0 ${n(h)}h${n(-(w - 2 * r))}a${n(r)} ${n(r)} 0 0 1 0 ${n(-h)}Z`);
    }
  }
  const vaos = `<path d="M0 0H${n(S)}V${n(S)}H0Z${furos.join("")}" fill-rule="evenodd"`;
  /**
   * Um ladrilho da trama tafetá com a luz assada: cada laçada é um calombo (claro do lado da luz,
   * escuro do outro), redondo na largura e em arco no comprimento; os vãos, escuros. `claro`: a cor
   * do claro (o linho mais iluminado no tecido nu; branco em cima da tinta); `k`: força.
   */
  const ladrilho = (nome, claro, k, vao, espelhar) => {
    const g = (sufixo, x2, y2, a, b) => grad(`${nome}-${sufixo}`, x2, y2, [[0, claro, a * k], [0.3, claro, a * 0.4 * k], [0.52, claro, 0], [0.7, "#000", b * 0.16 * k], [1, "#000", b * k]]);
    const urdT = g("ut", 1, 0, 0.15, 0.17); // urdume (fio vertical por cima): redondo na largura
    const urdL = g("ul", 0, 1, 0.06, 0.08); // e em arco no comprimento
    const traT = g("tt", 0, 1, 0.17, 0.19); // trama (fio horizontal por cima): redonda na altura
    const traL = g("tl", 1, 0, 0.05, 0.06);
    const lacadas = retangulos.map(({ urdume, ret }) => `<rect ${ret} fill="url(#${urdume ? urdT : traT})"/><rect ${ret} fill="url(#${urdume ? urdL : traL})"/>`).join("");
    const id = pr.id(nome);
    pr.def(`<pattern id="${id}" width="${n(S)}" height="${n(S)}" patternUnits="userSpaceOnUse"${espelhar ? ` patternTransform="scale(-1 1)"` : ""}>${vaos} fill="#000" fill-opacity="${vao}"/>${lacadas}</pattern>`);
    return id;
  };
  ids.trama = ladrilho("trama", CLARO, 1, 0.13, false);
  ids.tramaEsp = ladrilho("trama-e", CLARO, 1, 0.13, true); // lombada: a luz chega pelo lado da capa
  ids.tramaTinta = ladrilho("trama-t", "#fff", 0.8, 0.05, false);
  ids.tramaTintaEsp = ladrilho("trama-te", "#fff", 0.8, 0.05, true);
  // Cobertura da tinta no tecido: cheia em cima dos fios, rala nos vãos.
  ids.cobertura = pr.id("cobertura");
  pr.def(`<pattern id="${ids.cobertura}" width="${n(S)}" height="${n(S)}" patternUnits="userSpaceOnUse"><rect width="${n(S)}" height="${n(S)}" fill="#fff"/>${vaos} fill="#000" fill-opacity="0.16"/></pattern>`);
  const mascara = (nome, largura) => {
    const id = pr.id(nome);
    pr.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="-10" y="280" width="${largura + 20}" height="${H - 270}"><rect x="-10" y="280" width="${largura + 20}" height="${H - 270}" fill="url(#${ids.cobertura})"/></mask>`);
    return id;
  };
  ids.mascaraTinta = mascara("mascara-tinta", W);
  ids.mascaraTintaLombada = mascara("mascara-tinta-l", T);
  // Fios grossos (slubs): gradientes que somem nas pontas.
  const ponta = (nome, x2, y2, c) => grad(nome, x2, y2, [[0, c, 0], [0.25, c, 1], [0.75, c, 1], [1, c, 0]]);
  ids.slubClaroH = ponta("slub-ch", 1, 0, CLARO);
  ids.slubEscuroH = ponta("slub-eh", 1, 0, "#000");
  ids.slubClaroV = ponta("slub-cv", 0, 1, CLARO);
  ids.slubEscuroV = ponta("slub-ev", 0, 1, "#000");
  return ids;
}

/**
 * A tinta do tecido em branco e o que ela tapa (os fundos do desenho, na cor do tecido) em preto: a
 * máscara "só a tinta". `emPreto` é o contrário ("só o tecido", com um fundo branco por baixo).
 */
const emBranco = (s) => s.replaceAll(L.tinta, "#fff").replaceAll(COR, "#000");
const emPreto = (s) => s.replaceAll(L.tinta, "#000").replaceAll(COR, "#fff");

/**
 * Os fios grossos do linho (slubs) numa área da arte: trechos de fio de trama (horizontais) e de
 * urdume (verticais) um pouco mais grossos, cada um com o fio de luz do lado da luz e a sombra do
 * outro, e um tom próprio (o fio grosso tinge um pouco diferente). `tom`: só o tom (vai por baixo da
 * tinta); senão, só o relevo (vai por cima). `espelhar`: a luz vem da direita.
 */
function slubs(ids, { u0, u1, v0, v1, quantosH, quantosV, semente, tom, espelhar = false, forca = 1 }) {
  const rnd = aleatorio(semente);
  const p = PASSO;
  const partes = [];
  const lado = espelhar ? -1 : 1;
  for (let k = 0; k < quantosH; k++) {
    const linha = Math.floor((v0 + rnd() * (v1 - v0)) / p);
    const y = (linha + 0.5) * p;
    const comp = 10 + rnd() ** 1.5 * 120;
    const x = u0 - 10 + rnd() * (u1 - u0 + 20 - comp);
    const g = (0.35 + rnd() * 0.65) * forca;
    const op = (v) => n(v * g * 1000) / 1000;
    if (tom) {
      // o fio grosso tinge diferente: um pouco mais claro (mais comum) ou mais escuro
      const claro = rnd() < 0.62;
      partes.push(`<rect x="${n(x)}" y="${n(y - 0.45 * p)}" width="${n(comp)}" height="${n(0.9 * p)}" fill="url(#${claro ? ids.slubClaroH : ids.slubEscuroH})" fill-opacity="${op(claro ? 0.075 : 0.06)}"/>`);
    } else {
      // o fio grosso sobe: a metade de cima pega luz, e ele faz sombra logo abaixo
      partes.push(`<rect x="${n(x)}" y="${n(y - 0.5 * p)}" width="${n(comp)}" height="${n(0.48 * p)}" fill="url(#${ids.slubClaroH})" fill-opacity="${op(0.09)}"/>`);
      partes.push(`<rect x="${n(x)}" y="${n(y + 0.08 * p)}" width="${n(comp)}" height="${n(0.62 * p)}" fill="url(#${ids.slubEscuroH})" fill-opacity="${op(0.12)}"/>`);
    }
  }
  for (let k = 0; k < quantosV; k++) {
    const coluna = Math.floor((u0 + rnd() * (u1 - u0)) / p);
    const x = (coluna + 0.5) * p;
    const comp = 10 + rnd() ** 1.5 * 80;
    const y = v0 - 10 + rnd() * (v1 - v0 + 20 - comp);
    const g = (0.35 + rnd() * 0.65) * forca;
    const op = (v) => n(v * g * 1000) / 1000;
    if (tom) {
      const claro = rnd() < 0.55;
      partes.push(`<rect x="${n(x - 0.4 * p)}" y="${n(y)}" width="${n(0.8 * p)}" height="${n(comp)}" fill="url(#${claro ? ids.slubClaroV : ids.slubEscuroV})" fill-opacity="${op(claro ? 0.05 : 0.045)}"/>`);
    } else {
      // luz do lado da luz (esquerda na capa, direita na lombada), sombra do outro
      const xl = lado > 0 ? x - 0.46 * p : x - 0.02 * p;
      const xs = lado > 0 ? x + 0.02 * p : x - 0.5 * p;
      partes.push(`<rect x="${n(xl)}" y="${n(y)}" width="${n(0.44 * p)}" height="${n(comp)}" fill="url(#${ids.slubClaroV})" fill-opacity="${op(0.06)}"/>`);
      partes.push(`<rect x="${n(xs)}" y="${n(y)}" width="${n(0.48 * p)}" height="${n(comp)}" fill="url(#${ids.slubEscuroV})" fill-opacity="${op(0.08)}"/>`);
    }
  }
  return partes.join("");
}

/**
 * Fios irregulares: cada fio de trama (linha) e de urdume (coluna) tem o seu tom, um pouco mais claro
 * ou mais escuro que o vizinho, de ponta a ponta. É o "mesclado" do linho, que nunca repete (o padrão
 * da trama repete a cada 2 fios; isto não). Vai por baixo da tinta.
 */
function fiosIrregulares({ u0, u1, v0, v1, semente, forca = 1 }) {
  const rnd = aleatorio(semente);
  const p = PASSO;
  const partes = [];
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5; // ~normal, entre -1 e 1
  for (let y = Math.floor(v0 / p) * p; y < v1; y += p) {
    const t = gauss();
    const a = Math.abs(t) * 0.055 * forca;
    if (a < 0.006) continue;
    partes.push(`<rect x="${n(u0)}" y="${n(y)}" width="${n(u1 - u0)}" height="${n(p)}" fill="${t > 0 ? CLARO : "#000"}" fill-opacity="${n(a * 1000) / 1000}"/>`);
  }
  for (let x = Math.floor(u0 / p) * p; x < u1; x += p) {
    const t = gauss();
    const a = Math.abs(t) * 0.03 * forca;
    if (a < 0.006) continue;
    partes.push(`<rect x="${n(x)}" y="${n(v0)}" width="${n(p)}" height="${n(v1 - v0)}" fill="${t > 0 ? CLARO : "#000"}" fill-opacity="${n(a * 1000) / 1000}"/>`);
  }
  return partes.join("");
}

/** O caminho do papel colado (do alto até a borda ondulada), na largura `w`. */
function caminhoDoPapel(w, fase = 0) {
  const ps = [];
  for (let k = 0; k <= 60; k++) {
    const u = (w * k) / 60;
    ps.push([u, bordaDoPapel(u, fase)]);
  }
  return `M-2 -2H${n(w + 2)}V${n(ps[ps.length - 1][1])}${ps.reverse().map(([u, v]) => `L${n(u)} ${n(v)}`).join("")}L-2 ${n(ps[ps.length - 1][1])}Z`;
}

/** A borda do papel: o fio de luz no papel e a sombra fina e macia caindo no tecido. */
function bordaColada(pr, w, fase = 0, forca = 1) {
  const ps = [];
  for (let k = 0; k <= 60; k++) {
    const u = (w * k) / 60;
    ps.push([u, bordaDoPapel(u, fase)]);
  }
  const linha = (dv) => ps.map(([u, v], i) => `${i ? "L" : "M"}${n(u)} ${n(v + dv)}`).join("");
  const faixaSombra = `${linha(0)}${[...ps].reverse().map(([u, v]) => `L${n(u)} ${n(v + 4.2)}`).join("")}Z`;
  const gs = pr.id("borda-sombra");
  pr.def(`<linearGradient id="${gs}" gradientUnits="userSpaceOnUse" x1="0" y1="${DIVISAO}" x2="0" y2="${DIVISAO + 4.2}"><stop offset="0" stop-color="#000" stop-opacity="${0.42 * forca}"/><stop offset="0.3" stop-color="#000" stop-opacity="${0.2 * forca}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>`);
  return [
    `<path d="${faixaSombra}" fill="url(#${gs})"/>`,
    // a espessura do papel (a aresta cortada, clara, com as fibras) e o fio de luz logo acima
    `<path d="${linha(-0.25)}" fill="none" stroke="#fff" stroke-opacity="${0.5 * forca}" stroke-width="0.42"/>`,
    `<path d="${linha(-0.85)}" fill="none" stroke="#fff" stroke-opacity="${0.16 * forca}" stroke-width="0.8"/>`,
  ].join("");
}

/** Gradiente em u (userSpaceOnUse) para faixas verticais: paradas [u, cor, opacidade]. */
function gradU(pr, paradas) {
  const u0 = paradas[0][0];
  const u1 = paradas[paradas.length - 1][0];
  const id = pr.id("gu");
  pr.def(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${u0}" y1="0" x2="${u1}" y2="0">${paradas.map(([u, c, a]) => `<stop offset="${n((u - u0) / (u1 - u0))}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`);
  return id;
}
function gradV(pr, paradas) {
  const v0 = paradas[0][0];
  const v1 = paradas[paradas.length - 1][0];
  const id = pr.id("gv");
  pr.def(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${v0}" x2="0" y2="${v1}">${paradas.map(([v, c, a]) => `<stop offset="${n((v - v0) / (v1 - v0))}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`);
  return id;
}

/** A arte da capa com os materiais (480 × 720), para mapear. */
function arteDaCapa(pr, ids) {
  const c = partesDaCapa(L.slug);
  const tintaNoTecido = `${c.frase}${c.desenho}${c.assinatura}`;
  const soTinta = pr.id("so-tinta");
  const soTecido = pr.id("so-tecido");
  pr.def(`<mask id="${soTinta}" maskUnits="userSpaceOnUse" x="-10" y="280" width="${W + 20}" height="${H - 270}">${emBranco(tintaNoTecido)}</mask>`);
  pr.def(`<mask id="${soTecido}" maskUnits="userSpaceOnUse" x="-10" y="280" width="${W + 20}" height="${H - 270}"><rect x="-10" y="280" width="${W + 20}" height="${H - 270}" fill="#fff"/>${emPreto(tintaNoTecido)}</mask>`);
  // Vinco da dobradiça: o tecido (e o papel) afundam num canal; a parede da esquerda foge da luz, a
  // da direita a encara. Depois, a borda da tábua deixa um degrau quase invisível.
  const vEsc = gradU(pr, [[VINCO - 9, "#000", 0], [VINCO - 4.5, "#000", 0.07], [VINCO - 1.2, "#000", 0.3], [VINCO + 0.6, "#000", 0.24], [VINCO + 1.6, "#000", 0], [XB + 0.6, "#000", 0], [XB + 1.6, "#000", 0.05], [XB + 3.5, "#000", 0]]);
  const vClaro = gradU(pr, [[VINCO + 0.6, "#fff", 0], [VINCO + 2.4, "#fff", 0.24], [VINCO + 4.2, "#fff", 0.1], [XB - 0.4, "#fff", 0], [XB + 0.6, "#fff", 0.08], [XB + 1.4, "#fff", 0]]);
  // A dobra da junta (onde a lombada vira capa) e os filetes das bordas (o forro dobra sobre a tábua).
  const junta = gradU(pr, [[0, "#000", 0.2], [1.2, "#000", 0.06], [3, "#000", 0]]);
  const frente = gradU(pr, [[W - 3.2, "#000", 0], [W - 1.4, "#000", 0.1], [W, "#000", 0.3]]);
  const alto = gradV(pr, [[0, "#fff", 0.42], [0.9, "#fff", 0.2], [2.2, "#fff", 0]]);
  const pe = gradV(pr, [[H - 3, "#000", 0], [H - 1.2, "#000", 0.14], [H, "#000", 0.38]]);
  return [
    // o tecido (continua por baixo do papel)
    `<rect x="-2" y="${DIVISAO - 12}" width="${W + 4}" height="${H - DIVISAO + 14}" fill="${COR}"/>`,
    fiosIrregulares({ u0: -2, u1: W + 2, v0: DIVISAO - 12, v1: H + 2, semente: 5 }),
    slubs(ids, { u0: 0, u1: W, v0: DIVISAO - 6, v1: H, quantosH: 150, quantosV: 55, semente: 11, tom: true }),
    // a tinta, assentada na trama (rala nos vãos)
    `<g mask="url(#${ids.mascaraTinta})">${tintaNoTecido}</g>`,
    // o relevo dos fios: no tecido nu, com o claro do próprio linho; na tinta, com o claro branco
    `<g mask="url(#${soTecido})"><rect x="-2" y="${DIVISAO - 12}" width="${W + 4}" height="${H - DIVISAO + 14}" fill="url(#${ids.trama})"/>${slubs(ids, { u0: 0, u1: W, v0: DIVISAO - 6, v1: H, quantosH: 150, quantosV: 55, semente: 11, tom: false })}</g>`,
    `<g mask="url(#${soTinta})"><rect x="-2" y="${DIVISAO - 12}" width="${W + 4}" height="${H - DIVISAO + 14}" fill="url(#${ids.tramaTinta})"/></g>`,
    // o papel colado por cima, com a tipografia
    `<path d="${caminhoDoPapel(W)}" fill="${L.papel}"/>`,
    c.topo,
    c.titulo,
    bordaColada(pr, W),
    // geometria: vinco, junta e bordas
    `<rect x="${VINCO - 10}" y="-2" width="${XB - VINCO + 16}" height="${H + 4}" fill="url(#${vEsc})"/>`,
    `<rect x="${VINCO}" y="-2" width="${XB - VINCO + 4}" height="${H + 4}" fill="url(#${vClaro})"/>`,
    `<rect x="-1" y="-2" width="4" height="${H + 4}" fill="url(#${junta})"/>`,
    `<rect x="${W - 3.2}" y="-2" width="5" height="${H + 4}" fill="url(#${frente})"/>`,
    `<rect x="-2" y="-1" width="${W + 4}" height="3.2" fill="url(#${alto})"/>`,
    `<rect x="-2" y="${H - 3}" width="${W + 4}" height="4" fill="url(#${pe})"/>`,
  ].join("");
}

/** A arte da lombada com os materiais (T × 720), para mapear. */
function arteDaLombada(pr, ids) {
  const plana = lombada(L.slug, { fundo: false });
  const corte = plana.indexOf("<text");
  const icone = plana.slice(0, corte);
  const textos = plana.slice(corte);
  const soTinta = pr.id("so-tinta-l");
  const soTecido = pr.id("so-tecido-l");
  pr.def(`<mask id="${soTinta}" maskUnits="userSpaceOnUse" x="-10" y="280" width="${T + 20}" height="${H - 270}">${emBranco(textos)}</mask>`);
  pr.def(`<mask id="${soTecido}" maskUnits="userSpaceOnUse" x="-10" y="280" width="${T + 20}" height="${H - 270}"><rect x="-10" y="280" width="${T + 20}" height="${H - 270}" fill="#fff"/>${emPreto(textos)}</mask>`);
  const alto = gradV(pr, [[0, "#fff", 0.34], [1, "#fff", 0.14], [2.4, "#fff", 0]]);
  const pe = gradV(pr, [[H - 3, "#000", 0], [H - 1.2, "#000", 0.12], [H, "#000", 0.34]]);
  return [
    `<rect x="-2" y="${DIVISAO - 12}" width="${T + 4}" height="${H - DIVISAO + 14}" fill="${L.corDaLombada}"/>`,
    fiosIrregulares({ u0: -2, u1: T + 2, v0: DIVISAO - 12, v1: H + 2, semente: 31 }),
    slubs(ids, { u0: 0, u1: T, v0: DIVISAO - 6, v1: H, quantosH: 44, quantosV: 16, semente: 29, tom: true }),
    `<g mask="url(#${ids.mascaraTintaLombada})">${textos}</g>`,
    `<g mask="url(#${soTecido})"><rect x="-2" y="${DIVISAO - 12}" width="${T + 4}" height="${H - DIVISAO + 14}" fill="url(#${ids.tramaEsp})" opacity="0.75"/>${slubs(ids, { u0: 0, u1: T, v0: DIVISAO - 6, v1: H, quantosH: 44, quantosV: 16, semente: 29, tom: false, espelhar: true, forca: 0.7 })}</g>`,
    `<g mask="url(#${soTinta})"><rect x="-2" y="${DIVISAO - 12}" width="${T + 4}" height="${H - DIVISAO + 14}" fill="url(#${ids.tramaTintaEsp})" opacity="0.75"/></g>`,
    `<path d="${caminhoDoPapel(T, 2.1)}" fill="${L.papel}"/>`,
    icone,
    bordaColada(pr, T, 2.1, 0.8),
    `<rect x="-2" y="-1" width="${T + 4}" height="3.4" fill="url(#${alto})"/>`,
    `<rect x="-2" y="${H - 3}" width="${T + 4}" height="4" fill="url(#${pe})"/>`,
  ].join("");
}

// ---------- materiais na tela (filtros sobre as faces já mapeadas) ----------

/** Região de filtro (userSpaceOnUse) que cobre um polígono da tela, com folga. */
function regiao(ps, folga = 8) {
  const xs = ps.map((q) => q[0]);
  const ys = ps.map((q) => q[1]);
  const x = Math.min(...xs) - folga;
  const y = Math.min(...ys) - folga;
  return `filterUnits="userSpaceOnUse" x="${n(x)}" y="${n(y)}" width="${n(Math.max(...xs) - x + folga)}" height="${n(Math.max(...ys) - y + folga)}"`;
}

/**
 * Relevo por diferença deslocada: a altura h (no alfa) comparada com a vizinha do lado da luz (um
 * pixel da tela para o alto e para a esquerda). Onde a superfície desce em direção à luz, ela encara
 * a luz: clareia; onde sobe, escurece. Deslocamento inteiro em px da tela (o Chrome arredonda os
 * fracionários), então o relevo tem o mesmo tamanho físico em qualquer densidade de tela.
 */
const relevoPrimitivas = ({ entrada, ganho, claro, escuro, d = 1, corEscura = [0, 0, 0] }) => `
  <feOffset in="${entrada}" dx="${d}" dy="${d}" result="viz"/>
  <feComposite in="${entrada}" in2="viz" operator="arithmetic" k1="0" k2="${ganho}" k3="${-ganho}" k4="0.5" result="dif"/>
  <feComponentTransfer in="dif" result="difC"><feFuncA type="table" tableValues="0 0 1"/></feComponentTransfer>
  <feComponentTransfer in="dif" result="difE"><feFuncA type="table" tableValues="1 0 0"/></feComponentTransfer>
  <feColorMatrix in="difC" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${claro} 0" result="luzR"/>
  <feColorMatrix in="difE" type="matrix" values="0 0 0 0 ${corEscura[0]}  0 0 0 0 ${corEscura[1]}  0 0 0 0 ${corEscura[2]}  0 0 0 ${escuro} 0" result="sombraR"/>
  <feMerge><feMergeNode in="sombraR"/><feMergeNode in="luzR"/></feMerge>`;

/**
 * Feltro do papel de algodão: relevo macio e irregular (marcas do feltro), com a sombra num tom quente,
 * e um grão finíssimo de fibra. `freq`: [x, y] por px. `letras`: as letras impressas (preto, na tela):
 * a prensa amassa o feltro debaixo delas, então ali o relevo do papel quase some.
 */
function feltro(pr, poligono, { freq = [0.34, 0.34], semente = 5, forca = 1, letras = "" } = {}) {
  const id = pr.id("feltro");
  const quente = [0.32, 0.24, 0.14]; // a sombra do papel creme é quente, não cinza
  pr.def(`<filter id="${id}" ${regiao(poligono)} color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${freq[0]} ${freq[1]}" numOctaves="2" seed="${semente}" result="ruido"/>
  <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="altura"/>
  <feGaussianBlur in="altura" stdDeviation="0.55" result="fino"/>
  <feTurbulence type="fractalNoise" baseFrequency="${n(freq[0] * 0.2)} ${n(freq[1] * 0.2)}" numOctaves="2" seed="${semente + 7}" result="ruido2"/>
  <feColorMatrix in="ruido2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="altura2"/>
  <feGaussianBlur in="altura2" stdDeviation="1.4" result="largo"/>
  <feComposite in="fino" in2="largo" operator="arithmetic" k1="0" k2="0.55" k3="1.6" k4="-0.5" result="alturaM"/>${relevoPrimitivas({ entrada: "alturaM", ganho: 6, claro: n(0.07 * forca), escuro: n(0.04 * forca), corEscura: quente })}
</filter>`);
  const idGrao = pr.id("grao-papel");
  pr.def(`<filter id="${idGrao}" ${regiao(poligono)} color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${n(freq[0] * 2.6)} ${n(freq[1] * 2.6)}" numOctaves="1" seed="${semente + 3}"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.18  0 0 0 ${n(-0.1 * forca)} ${n(0.05 * forca)}"/></filter>`);
  const ps = pontos(poligono);
  let mascara = "";
  if (letras) {
    const mid = pr.id("sem-feltro");
    pr.def(`<mask id="${mid}" ${regiao(poligono).replace("filterUnits", "maskUnits")}><polygon points="${ps}" fill="#fff"/><g opacity="0.75">${letras}</g></mask>`);
    mascara = ` mask="url(#${mid})"`;
  }
  return `<g${mascara}><polygon points="${ps}" filter="url(#${id})"/><polygon points="${ps}" filter="url(#${idGrao})"/></g>`;
}

/**
 * O tecido visto de longe: manchas largas de tingimento (muito fracas) e a penugem do linho (pontinhos
 * de fibra que pegam luz). `freq`: [x, y] por px (a lombada, vista de lado, pede ruído mais fino em x).
 */
function tecidoNaTela(pr, poligono, { semente = 9, freq = [1, 1], forca = 1 } = {}) {
  const idM = pr.id("manchas");
  pr.def(`<filter id="${idM}" ${regiao(poligono)} color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${n(0.012 * freq[0])} ${n(0.02 * freq[1])}" numOctaves="3" seed="${semente}" result="r"/>
  <feColorMatrix in="r" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="a"/>
  <feComponentTransfer in="a" result="c"><feFuncA type="table" tableValues="0 0 1"/></feComponentTransfer>
  <feComponentTransfer in="a" result="e"><feFuncA type="table" tableValues="1 0 0"/></feComponentTransfer>
  <feColorMatrix in="c" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${n(0.06 * forca)} 0" result="cc"/>
  <feColorMatrix in="e" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${n(0.07 * forca)} 0" result="ee"/>
  <feMerge><feMergeNode in="ee"/><feMergeNode in="cc"/></feMerge>
</filter>`);
  const idP = pr.id("penugem");
  pr.def(`<filter id="${idP}" ${regiao(poligono)} color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${n(0.9 * freq[0])} ${n(0.9 * freq[1])}" numOctaves="2" seed="${semente + 1}" result="r"/>
  <feColorMatrix in="r" type="matrix" values="0 0 0 0 1  0 0 0 0 0.97  0 0 0 0 0.94  1.3 0 0 0 -0.62" result="brilho"/>
  <feComponentTransfer in="brilho"><feFuncA type="gamma" amplitude="${n(0.5 * forca)}" exponent="1.6" offset="0"/></feComponentTransfer>
</filter>`);
  const ps = pontos(poligono);
  return `<polygon points="${ps}" filter="url(#${idM})"/><polygon points="${ps}" filter="url(#${idP})"/>`;
}

/**
 * O relevo da tipografia (letterpress) a partir da máscara das letras já mapeadas (`letras`: o SVG
 * das letras em preto, na tela). A letra afunda: por dentro, sombra fina na borda do lado da luz e
 * fio claro na borda oposta; por fora, o papel desce até a letra (almofada larga e macia).
 */
function letterpress(pr, letras, caixa, { forca = 1 } = {}) {
  const id = pr.id("letterpress");
  const [x, y, w, h] = caixa;
  const k = (v) => n(v * forca);
  pr.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" color-interpolation-filters="sRGB">
  <feGaussianBlur in="SourceAlpha" stdDeviation="0.4" result="a"/>
  <feOffset in="a" dx="1" dy="1" result="aDaLuz"/>
  <feOffset in="a" dx="-1" dy="-1" result="aDoOutro"/>
  <feComposite in="a" in2="aDaLuz" operator="out" result="dentroSombra"/>
  <feComposite in="a" in2="aDoOutro" operator="out" result="dentroLuz"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b"/>
  <feOffset in="b" dx="-2" dy="-2" result="bDoOutro"/>
  <feOffset in="b" dx="2" dy="2" result="bDaLuz"/>
  <feComposite in="bDoOutro" in2="a" operator="out" result="foraSombra"/>
  <feComposite in="bDaLuz" in2="a" operator="out" result="foraLuz"/>
  <feGaussianBlur in="dentroSombra" stdDeviation="0.35" result="dentroSombraM"/>
  <feColorMatrix in="dentroSombraM" type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.02  0 0 0 0 0.05  0 0 0 ${k(0.55)} 0" result="s1"/>
  <feColorMatrix in="dentroLuz" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${k(0.2)} 0" result="l1"/>
  <feColorMatrix in="foraSombra" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.14  0 0 0 0 0.08  0 0 0 ${k(0.16)} 0" result="s2"/>
  <feColorMatrix in="foraLuz" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${k(0.35)} 0" result="l2"/>
  <feMerge><feMergeNode in="s2"/><feMergeNode in="l2"/><feMergeNode in="s1"/><feMergeNode in="l1"/></feMerge>
</filter>`);
  return `<g filter="url(#${id})">${letras}</g>`;
}

/** A máscara das letras impressas no papel (o título e a linha do topo), em preto, para o relevo. */
function letrasDaCapa(qual) {
  const c = partesDaCapa(L.slug);
  const preto = (s) => s.replace(/fill="[^"]*"/g, 'fill="#000"').replace(/opacity="[^"]*"/g, "");
  return qual === "titulo" ? preto(c.titulo) : preto(c.topo);
}

// ---------- modo plano (conferir as texturas sem 3D) ----------

if (process.argv.includes("--plano")) {
  const destino = process.argv[process.argv.indexOf("--plano") + 1];
  const escala = 1.19;
  const x0 = 30;
  const y0 = 30;
  const pr = new Prancha({ prefixo: "p02", largura: Math.ceil(W * escala + 2 * x0), altura: Math.ceil(H * escala + 2 * y0), titulo: "p02 plana" });
  const ids = definirMateriais(pr);
  const art = pr.simbolo(arteDaCapa(pr, ids), { largura: W, altura: H, nome: "capa" });
  const tr = `matrix(${escala} 0 0 ${escala} ${x0} ${y0})`;
  const q = (u, v) => [x0 + u * escala, y0 + v * escala];
  const papel = [q(0, 0), q(W, 0), q(W, DIVISAO), q(0, DIVISAO)];
  const tecido = [q(0, DIVISAO), q(W, DIVISAO), q(W, H), q(0, H)];
  pr.add(`<use href="#${art}" transform="${tr}"/>`);
  const letras = `<g transform="${tr}">${letrasDaCapa("titulo")}${letrasDaCapa("topo")}</g>`;
  pr.add(`<g clip-path="url(#${recorte(pr, papel)})">${feltro(pr, papel, { letras })}</g>`);
  pr.add(letterpress(pr, `<g transform="${tr}">${letrasDaCapa("titulo")}</g>`, [x0, y0, W * escala, DIVISAO * escala]));
  pr.add(letterpress(pr, `<g transform="${tr}">${letrasDaCapa("topo")}</g>`, [x0, y0, W * escala, 100 * escala], { forca: 0.45 }));
  pr.add(`<g clip-path="url(#${recorte(pr, tecido)})">${tecidoNaTela(pr, tecido)}</g>`);
  pr.salvar(destino);
  console.log("✓ plana", destino);
  process.exit(0);
}

function recorte(pr, ps) {
  const id = pr.id("recorte");
  pr.def(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><polygon points="${pontos(ps)}"/></clipPath>`);
  return id;
}

// ---------- pose, câmera e luz ----------

const GIRO = 16; // o livro gira para mostrar uma fatia da lombada
const g = (p) => girarY(p, GIRO, [W / 2, 0, 0]);
const ELEVACAO = 12; // a câmera olha um pouco de cima: aparece o alto (tábuas, seixa, miolo, cabeceado)
const DIST = 5200; // teleobjetiva: perspectiva fraca

const pr = new Prancha({
  prefixo: "p02",
  largura: 1200,
  altura: 1000,
  titulo: "Meia-encadernação: tecido e papel",
  descricao: "O livro Dados em pé, quase de frente: a parte de cor em linho de encadernação e a parte clara em papel de algodão colado por cima, com o título em tipografia.",
});

const cam = camera({
  olho: [W / 2, H / 2 + DIST * Math.sin(grau(ELEVACAO)), DIST * Math.cos(grau(ELEVACAO))],
  alvo: [W / 2, H / 2, 0],
  focal: 1000,
  centro: [600, 500],
});
const cantos = [];
for (const x of [-BOJO, W]) for (const y of [0, H]) for (const z of [-T / 2, T / 2]) cantos.push(g([x, y, z]));
enquadrar(cam, cantos, [160, 52, 720, 872]);

// A luz: grande e suave, do alto à esquerda. Na capa, ela chega rasante (20° acima do plano), vindo
// de cima e da esquerda (50° acima da horizontal, no plano da capa): é o que revela a trama.
const E1 = normal(sub(g([1, 0, 0]), g([0, 0, 0]))); // o u da capa no mundo
const E2 = [0, 1, 0];
const NC = normal(cross(E1, E2)); // normal da capa
const LUZ = normal(soma(mul(soma(mul(E1, -Math.cos(grau(50))), mul(E2, Math.sin(grau(50)))), Math.cos(grau(20))), mul(NC, Math.sin(grau(20)))));

/** Claridade de uma face (ambiente + Lambert), relativa à da capa (a capa é a exposição de referência). */
const AMBIENTE = 0.58;
const claridade = (nrm) => (AMBIENTE + (1 - AMBIENTE) * Math.max(0, dot(normal(nrm), LUZ))) / (AMBIENTE + (1 - AMBIENTE) * dot(NC, LUZ));

// ---------- mapeamento (cópia adaptada do superficie da cena, com cortes à escolha) ----------

const faixa = (a, b, k) => Array.from({ length: k + 1 }, (_, i) => a + ((b - a) * i) / k);

/**
 * Mapeia a arte `ref` (um <symbol>) na superfície P(u, v) com os cortes `us` × `vs`. Cada célula vira
 * dois triângulos com a afim exata nos três cantos. Igual ao superficie() da cena, mas com os cortes
 * escolhidos (a lombada precisa de fatias finas em u; a capa, de poucas) e as afins guardadas, para
 * mapear outras artes (a máscara das letras) nas mesmas células.
 */
function mapear({ ref, P, us, vs, folga = 0.45 }) {
  const partes = [];
  for (let j = 0; j < vs.length - 1; j++) {
    for (let i = 0; i < us.length - 1; i++) {
      const uv = [[us[i], vs[j]], [us[i + 1], vs[j]], [us[i + 1], vs[j + 1]], [us[i], vs[j + 1]]];
      const tela = uv.map(([u, v]) => cam.p(P(u, v)));
      for (const idx of [[0, 1, 2], [0, 2, 3]]) {
        const destino = idx.map((k) => tela[k]);
        if (area(destino) <= 0) continue; // vista por trás
        const m = afim(idx.map((k) => uv[k]), destino);
        if (!m.every(Number.isFinite)) continue;
        const id = pr.id("tri");
        pr.def(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><polygon points="${pontos(alargar(destino, folga))}"/></clipPath>`);
        partes.push(`<g clip-path="url(#${id})"><use href="#${ref}" transform="${matriz(m)}"/></g>`);
      }
    }
  }
  return partes.join("");
}

/** Contorno na tela de P(u, v) em [u0, u1] × [v0, v1]. */
function contornoDe(P, u0, u1, v0, v1, k = 24) {
  return contorno(cam, (u, v) => P(u0 + u, v0 + v), u1 - u0, v1 - v0, k);
}

const poligono = (ps, atributos) => `<polygon points="${pontos(ps)}" ${atributos}/>`;
const tela = (p) => cam.p(g(p));

// ---------- superfícies ----------

/** A capa (plana), em z = T/2: u da junta (0) até a frente (W), v do alto (0) ao pé (H). */
const Pcapa = (u, v) => g([u, H - v, T / 2]);
/** A lombada arredondada. */
const Plomb = (u, v) => g(arco(u, H - v));

/** O contorno da capa com os cantos da frente arredondados (na tela). */
function contornoDaCapa() {
  const ps = [];
  const r = RAIO_CANTO;
  ps.push([0, 0]);
  for (let k = 0; k <= 6; k++) {
    const a = -Math.PI / 2 + (k / 6) * (Math.PI / 2);
    ps.push([W - r + r * Math.cos(a), r + r * Math.sin(a)]);
  }
  for (let k = 0; k <= 6; k++) {
    const a = (k / 6) * (Math.PI / 2);
    ps.push([W - r + r * Math.cos(a), H - r + r * Math.sin(a)]);
  }
  ps.push([0, H]);
  return ps.map(([u, v]) => cam.p(Pcapa(u, v)));
}

// ---------- sombras no chão ----------

/** Envoltória convexa (monotone chain) de pontos da tela. */
function envoltoria(ps) {
  const q = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const x = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const baixo = [];
  for (const p of q) {
    while (baixo.length >= 2 && x(baixo[baixo.length - 2], baixo[baixo.length - 1], p) <= 0) baixo.pop();
    baixo.push(p);
  }
  const cima = [];
  for (const p of [...q].reverse()) {
    while (cima.length >= 2 && x(cima[cima.length - 2], cima[cima.length - 1], p) <= 0) cima.pop();
    cima.push(p);
  }
  return [...baixo.slice(0, -1), ...cima.slice(0, -1)];
}

/**
 * A sombra de uma luz grande: a projeção do livro no chão por várias direções da janela (uma
 * amostragem da área da luz), cada uma fraca; perto do livro todas se somam (escuro e justo), longe
 * elas se abrem e somem (a penumbra cresce com a distância, como numa foto).
 */
function sombraNoChao() {
  const base = [];
  for (let k = 0; k <= 16; k++) base.push(arco((T * k) / 16, 0));
  base.push([W, 0, T / 2], [W, 0, -T / 2]);
  const topo = base.map(([x, , z]) => [x, H, z]);
  const pontos3 = [...base, ...topo].map(g);
  const rnd = aleatorio(202);
  const amostras = [];
  for (let i = 0; i < 18; i++) {
    const a = (rnd() - 0.5) * 30;
    const b = (rnd() - 0.5) * 0.5;
    const d = normal(soma(girarY(LUZ, a), [0, b, 0]));
    const proj = pontos3.map((p) => {
      const t = p[1] / d[1];
      return cam.p([p[0] - d[0] * t, 0, p[2] - d[2] * t]);
    });
    amostras.push(envoltoria(proj));
  }
  const pegada = envoltoria(pontos3.slice(0, base.length).map((p) => cam.p(p)));
  // Some com a distância: do pé do livro até o fim da sombra do alto.
  const pe = cam.p(g([W / 2, 0, 0]));
  const t = H / LUZ[1];
  const longe = cam.p(g([W / 2 - LUZ[0] * t, 0, -LUZ[2] * t]));
  const gm = gradiente(pr, pe, longe, [[0, "#fff", 1], [0.18, "#fff", 0.75], [0.45, "#fff", 0.3], [0.8, "#fff", 0.06], [1, "#fff", 0]]);
  const mid = pr.id("mascara-sombra");
  pr.def(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="1000"><rect width="1200" height="1000" fill="url(#${gm})"/></mask>`);
  const f1 = filtroDesfoque(pr, 7, { margem: 0.3 });
  const f2 = filtroDesfoque(pr, 22, { margem: 0.5 });
  return [
    // oclusão ambiente larga e fraca
    `<polygon points="${pontos(alargar(pegada, 20))}" fill="#000" fill-opacity="0.12" filter="url(#${f2})"/>`,
    // a sombra da luz grande (soma das amostras), sumindo com a distância
    `<g mask="url(#${mid})"><g filter="url(#${f1})" opacity="0.62">${amostras.map((ps) => `<polygon points="${pontos(ps)}" fill="#000" fill-opacity="0.07"/>`).join("")}</g></g>`,
    // contato: justo e mais escuro onde as capas tocam o chão
    `<polygon points="${pontos(alargar(pegada, 2))}" fill="#000" fill-opacity="0.26" filter="url(#${filtroDesfoque(pr, 5)})"/>`,
    `<polygon points="${pontos(pegada)}" fill="#000" fill-opacity="0.55" filter="url(#${filtroDesfoque(pr, 1.4)})"/>`,
  ].join("");
}

// ---------- o alto do livro (visto de cima) ----------

const ALTO_MIOLO = H - SEIXA; // 711
const Z_MIOLO = T / 2 - TABUA - 0.6; // o miolo entre as tábuas
const CONCAVO = 14; // a frente do miolo é côncava (espelho da lombada arredondada)
const frenteDoMiolo = (z) => W - SEIXA - CONCAVO * (1 - (z / Z_MIOLO) ** 2);

function alto() {
  const partes = [];
  const claro = (k) => `fill="#fff" fill-opacity="${k}"`;
  // Tábua de trás: a face de cima e a face de dentro que aparece acima do miolo (o papel dobrado).
  const trasTopo = [[XB, H, -T / 2], [W - RAIO_CANTO, H, -T / 2], [W, H, -T / 2 + RAIO_CANTO], [W, H, -T / 2 + TABUA], [XB, H, -T / 2 + TABUA]].map(tela);
  partes.push(poligono(trasTopo, `fill="${L.papel}"`), poligono(trasTopo, claro(0.2)));
  const trasDentro = [[XB - 4, ALTO_MIOLO - 2, -T / 2 + TABUA], [W, ALTO_MIOLO - 2, -T / 2 + TABUA], [W, H, -T / 2 + TABUA], [XB - 4, H, -T / 2 + TABUA]].map(tela);
  partes.push(poligono(trasDentro, `fill="${L.papel}"`));
  // O vão da seixa da frente (entre as tábuas, além do miolo): a guarda da tábua de trás, na sombra.
  const vao = [];
  for (let k = 0; k <= 12; k++) {
    const z = -Z_MIOLO + (2 * Z_MIOLO * k) / 12;
    vao.push(tela([frenteDoMiolo(z), ALTO_MIOLO, z]));
  }
  vao.push(tela([W, ALTO_MIOLO, Z_MIOLO]), tela([W, ALTO_MIOLO, -Z_MIOLO]));
  partes.push(poligono(vao, `fill="${L.papel}"`), poligono(vao, `fill="#000" fill-opacity="0.34"`));
  // O miolo: papel creme com as linhas das folhas, entre a lombada e a frente côncava.
  const miolo = [];
  for (let k = 0; k <= 24; k++) miolo.push(tela(arco((T * k) / 24, ALTO_MIOLO, 5)));
  for (let k = 12; k >= 0; k--) {
    const z = -Z_MIOLO + (2 * Z_MIOLO * k) / 12;
    miolo.push(tela([frenteDoMiolo(z), ALTO_MIOLO, z]));
  }
  partes.push(poligono(miolo, `fill="${L.papel}"`), poligono(miolo, claro(0.16)));
  const rnd = aleatorio(71);
  const folhas = [];
  for (let i = 1; i < 110; i++) {
    const t = (i + (rnd() - 0.5) * 0.7) / 110;
    const a = tela(arco(T * t, ALTO_MIOLO, 5));
    const z = -Z_MIOLO + 2 * Z_MIOLO * t;
    const b = tela([frenteDoMiolo(z), ALTO_MIOLO, z]);
    folhas.push(`<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="#4a3a3e" stroke-opacity="${n(0.08 + rnd() * 0.12)}" stroke-width="${n(0.2 + rnd() * 0.3)}"/>`);
  }
  partes.push(folhas.join(""));
  // Sombra da tábua da frente sobre o miolo (a luz vem da frente e de cima) e o canto junto da tábua de trás.
  partes.push(poligono([[XB, ALTO_MIOLO, Z_MIOLO], [W - SEIXA, ALTO_MIOLO, Z_MIOLO], [W - SEIXA, ALTO_MIOLO, Z_MIOLO - 8], [XB, ALTO_MIOLO, Z_MIOLO - 8]].map(tela), `fill="#000" fill-opacity="0.12"`));
  partes.push(poligono([[XB, ALTO_MIOLO, -Z_MIOLO], [W, ALTO_MIOLO, -Z_MIOLO], [W, ALTO_MIOLO + 1.6, -Z_MIOLO], [XB, ALTO_MIOLO + 1.6, -Z_MIOLO]].map(tela), `fill="#000" fill-opacity="0.18"`));
  // O oco da lombada (entre a lombada da capa e o miolo): escuro.
  const oco = [];
  for (let k = 0; k <= 24; k++) oco.push(tela(arco((T * k) / 24, H, 1.6)));
  for (let k = 24; k >= 0; k--) oco.push(tela(arco((T * k) / 24, ALTO_MIOLO, 5)));
  partes.push(poligono(oco, `fill="#241c22" fill-opacity="0.9"`));
  // Cabeceado: um cordão listrado no alto da lombada do miolo.
  const listras = [];
  const nL = 34;
  for (let k = 0; k < nL; k++) {
    const u0 = (T * k) / nL;
    const u1 = (T * (k + 1)) / nL;
    const q = [tela(arco(u0, ALTO_MIOLO + 4.5, 2.2)), tela(arco(u1, ALTO_MIOLO + 4.5, 2.2)), tela(arco(u1, ALTO_MIOLO + 3, 6)), tela(arco(u0, ALTO_MIOLO + 3, 6))];
    listras.push(poligono(q, `fill="${k % 2 ? L.cor : L.tinta}"`));
  }
  partes.push(listras.join(""));
  // A borda de cima da lombada da capa (o papel dobrado sobre o reforço): uma tira fina e clara.
  const borda = [];
  for (let k = 0; k <= 24; k++) borda.push(tela(arco((T * k) / 24, H, 0)));
  for (let k = 24; k >= 0; k--) borda.push(tela(arco((T * k) / 24, H, 1.6)));
  partes.push(poligono(borda, `fill="${L.papel}"`), poligono(borda, claro(0.22)));
  // Tábua da frente: a face de cima (papel dobrado sobre a borda), bem iluminada; na junta, só o forro.
  const frenteTopo = [[XB, H, T / 2 - TABUA], [W, H, T / 2 - TABUA], [W, H, T / 2 - RAIO_CANTO], [W - RAIO_CANTO, H, T / 2], [XB, H, T / 2]].map(tela);
  const junta = [[0, H, T / 2 - 1.6], [XB, H, T / 2 - 1.6], [XB, H, T / 2], [0, H, T / 2]].map(tela);
  partes.push(poligono(frenteTopo, `fill="${L.papel}"`), poligono(frenteTopo, claro(0.24)));
  partes.push(poligono(junta, `fill="${L.papel}"`), poligono(junta, claro(0.18)));
  return partes.join("");
}

// ---------- montagem ----------

const ids = definirMateriais(pr);
pr.add(sombraNoChao());
pr.add(alto());

// Lombada: arte com os materiais, luz ao longo da curva, e o tecido e o papel vistos de lado.
const artLombada = pr.simbolo(arteDaLombada(pr, ids), { largura: T, altura: H, nome: "lombada" });
pr.add(mapear({ ref: artLombada, P: Plomb, us: faixa(0, T, 32), vs: faixa(0, H, 6) }));
{
  const a = cam.p(Plomb(0, H / 2));
  const b = cam.p(Plomb(T, H / 2));
  const eixo = [b[0] - a[0], b[1] - a[1]];
  const l2 = eixo[0] ** 2 + eixo[1] ** 2;
  const paradas = [];
  for (let k = 0; k <= 40; k++) {
    const u = (T * k) / 40;
    const nrm = normal(sub(Plomb(u, H / 2), g(arco(u, H / 2, 10))));
    const q = cam.p(Plomb(u, H / 2));
    const t = limitar(((q[0] - a[0]) * eixo[0] + (q[1] - a[1]) * eixo[1]) / l2);
    const c = claridade(nrm);
    paradas.push([n(t), c >= 1 ? "#fff" : "#000", n(Math.min(0.3, Math.abs(c - 1) * (c >= 1 ? 0.55 : 0.9)))]);
  }
  paradas.sort((x, y) => x[0] - y[0]);
  const gid = gradiente(pr, a, b, paradas);
  const lomb = contornoDe(Plomb, 0, T, 0, H);
  pr.add(`<polygon points="${pontos(lomb)}" fill="url(#${gid})"/>`);
  const papelL = contornoDe(Plomb, 0, T, 0, DIVISAO);
  const tecidoL = contornoDe(Plomb, 0, T, DIVISAO, H);
  pr.add(`<g clip-path="url(#${recorte(pr, papelL)})">${feltro(pr, papelL, { freq: [0.3, 0.11], semente: 12, forca: 0.7 })}</g>`);
  pr.add(`<g clip-path="url(#${recorte(pr, tecidoL)})">${tecidoNaTela(pr, tecidoL, { semente: 21, freq: [2.5, 1], forca: 0.7 })}</g>`);
}

// Capa: arte com os materiais, recortada pelo contorno de cantos arredondados; por cima, o feltro do
// papel, o relevo da tipografia e o tecido visto de longe.
const artCapa = pr.simbolo(arteDaCapa(pr, ids), { largura: W, altura: H, nome: "capa" });
const US = faixa(0, W, 6);
const VS = faixa(0, H, 8);
const idContorno = recorte(pr, contornoDaCapa());
pr.add(`<g clip-path="url(#${idContorno})">${mapear({ ref: artCapa, P: Pcapa, us: US, vs: VS })}</g>`);
{
  const papelC = [];
  for (let k = 0; k <= 30; k++) papelC.push(cam.p(Pcapa((W * k) / 30, 0)));
  for (let k = 30; k >= 0; k--) papelC.push(cam.p(Pcapa((W * k) / 30, bordaDoPapel((W * k) / 30))));
  const tecidoC = contornoDe(Pcapa, 0, W, DIVISAO, H);
  pr.add(`<g clip-path="url(#${idContorno})"><g clip-path="url(#${recorte(pr, papelC)})">${feltro(pr, papelC)}</g></g>`);
  const artTitulo = pr.simbolo(letrasDaCapa("titulo"), { largura: W, altura: H, nome: "titulo" });
  const artTopo = pr.simbolo(letrasDaCapa("topo"), { largura: W, altura: H, nome: "topo" });
  const caixa = (ps) => {
    const xs = ps.map((q) => q[0]);
    const ys = ps.map((q) => q[1]);
    return [Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) - Math.min(...xs) + 12, Math.max(...ys) - Math.min(...ys) + 12];
  };
  pr.add(letterpress(pr, mapear({ ref: artTitulo, P: Pcapa, us: US, vs: faixa(0, 360, 4), folga: 0.3 }), caixa(contornoDe(Pcapa, 0, W, 150, 290))));
  pr.add(letterpress(pr, mapear({ ref: artTopo, P: Pcapa, us: US, vs: faixa(0, 90, 1), folga: 0.3 }), caixa(contornoDe(Pcapa, 0, W, 20, 60)), { forca: 0.45 }));
  pr.add(`<g clip-path="url(#${idContorno})"><g clip-path="url(#${recorte(pr, tecidoC)})">${tecidoNaTela(pr, tecidoC)}</g></g>`);
  // A luz da janela na capa: um pouco mais clara no alto à esquerda, caindo para o pé e para a frente.
  const c0 = cam.p(Pcapa(0, 0));
  const c1 = cam.p(Pcapa(W, H));
  const gl = gradiente(pr, c0, c1, [[0, "#fff", 0.05], [0.35, "#fff", 0], [0.6, "#000", 0.02], [1, "#000", 0.1]]);
  pr.add(`<polygon points="${pontos(contornoDaCapa())}" fill="url(#${gl})"/>`);
}

const saida = fileURLToPath(new URL("./p02-tecido-e-papel.svg", import.meta.url));
pr.salvar(saida);
console.log("✓", saida);
