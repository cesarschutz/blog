#!/usr/bin/env node
/**
 * Prancha 03 · "Brochura com orelhas".
 *
 * A Carreira (volume 08) como uma brochura de cabeceira: capa mole em cartão fosco, com orelhas (a
 * capa dobra para dentro na frente) e o corte da frente irregular (deckle edge). Deitada na mesa,
 * girada no plano, vista de cima com teleobjetiva. A ponta de baixo da frente da capa empena e sobe
 * alguns graus: por baixo aparecem a orelha (o verso do cartão, sem impressão) e as folhas.
 *
 * Coordenadas do livro (antes de girar e centrar): x da lombada (0) para a frente (480), y da mesa
 * (0) para cima (a espessura, 134), z do alto (0, a cabeça) para o pé (720). A arte da capa tem
 * u = x e v = z. A câmera fica na frente do pé, alta: vê a capa, o pé (as folhas cortadas retas) e,
 * de raspão, a frente (a dobra da orelha e o corte irregular). A lombada fica do lado oposto à frente
 * (as duas nunca aparecem juntas): dela se vê só a quina, a capa dobrando para ela, de perfil.
 *
 * Camadas, do fundo para a frente: sombras na mesa → o pé (folhas, cartões cortados) → a frente
 * (dobra de trás e folhas, camada por camada) → a fresta do canto (a folha de cima, a orelha) → a
 * dobra da frente → a capa (arte mapeada) → luz, grão e fios da capa.
 *
 *   fnm exec --using=24 node pranchas/p03-brochura.mjs  →  pranchas/p03-brochura.svg
 */
import { fileURLToPath } from "node:url";
import { capa, livro } from "../base/base.mjs";
import {
  Prancha,
  camera,
  enquadrar,
  girarY,
  afim,
  matriz,
  alargar,
  area,
  pontos,
  gradiente,
  gradienteRadial,
  recortePoligono,
  filtroDesfoque,
  aleatorio,
  lerp,
  suave,
  limitar,
  normal,
  dot,
  sub,
  n,
  grau,
} from "../ferramentas/cena.mjs";

const L = livro("carreira");
const W = 480; // largura da capa
const H = 720; // altura da capa
const T = L.largura; // espessura do livro (134): a largura da lombada

// ---------- parâmetros ----------

const GIRO = -14; // giro no plano (graus): negativo gira no sentido horário na tela e mostra a frente
const ELEVACAO = 53; // altura da câmera (graus acima da mesa)
const DISTANCIA = 6000; // olho longe: teleobjetiva, perspectiva fraca
const CARTAO = 1; // espessura do cartão da capa (~0,3 mm)
const AR = 1; // o fio de ar dentro da dobra (a dobra não é vincada a seco: é redonda)
const DOBRA = 2 * CARTAO + AR; // a dobra da orelha: capa + ar + orelha
const ORELHA = 300; // largura da orelha (da dobra para dentro)
const RAIO_CANTO = 4; // cantos da capa amaciados
const RAIO_LOMBADA = 1.6; // a quina da capa na lombada (brochura: quadrada, mas o cartão não quebra)
const FRENTE = W + 0.4; // onde fica, em média, o corte da frente das folhas (rente à dobra)
// O empeno: a ponta de baixo da frente sobe. Dobradiça reta de (U0, H) a (W, V0); além dela o
// cartão curva (a subida cresce com o quadrado da distância, sem quina na dobradiça).
const U0 = 240;
const V0 = 400;
const ELEVA = 25; // quanto a ponta sobe (unidades; ~8 mm): uns 7° na média, 14° na ponta
const ORELHA_SEGUE = 0.12; // longe da dobra, a orelha sobe só isto do que a capa sobe (cai nas folhas)
const ORELHA_SOLTA = 78; // em quanto (da dobra para dentro) a orelha se descola da capa
const VINCO = 21; // o vinco da dobradiça na capa, a ~7 mm da lombada

// Luz: a principal é grande e suave, do alto à esquerda e ao fundo; um preenchimento fraco vem da
// frente. Direções PARA a luz. A capa (virada para cima) é a referência: sai com a cor dela.
const LUZ = normal([-0.5, 1.05, -0.5]);
const PREENCHE = normal([0.25, 0.6, 0.75]);
const AMBIENTE = 0.72;
const PRINCIPAL = 0.22;
const FILL = 0.14;
const claridade = (nrm) => AMBIENTE + PRINCIPAL * Math.max(0, dot(nrm, LUZ)) + FILL * Math.max(0, dot(nrm, PREENCHE));

// ---------- cores ----------

const PAPEL = L.papel; // #f2ede2: papel da capa, verso do cartão e folhas
const COR = L.cor; // #9a7650: a cor do livro (capa embaixo, contracapa)
const COR_LOMBADA = L.corDaLombada; // #816342: a lombada
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const paraHex = (rgb) => "#" + rgb.map((x) => Math.round(limitar(x, 0, 255)).toString(16).padStart(2, "0")).join("");
/** Luz e sombra como camada translúcida já composta: a cor misturada ao preto (t > 0) ou ao branco (t < 0). */
const tom = (c, t) => paraHex(hex(c).map((x) => (t >= 0 ? x * (1 - t) : x + (255 - x) * -t)));
const op = (x) => String(Math.round(limitar(x, 0, 1) * 1000) / 1000);

// ---------- geometria ----------

/** Do livro (x, y, z) para o mundo: centrado na origem e girado no plano da mesa. */
const mundo = (x, y, z) => girarY([x - W / 2, y, z - H / 2], GIRO);
/** Um vetor do livro (normal de face) levado ao mundo. */
const noMundo = (v) => girarY(v, GIRO);

// Empeno da ponta.
const EX = H - V0;
const EZ = W - U0;
const EL = Math.hypot(EX, EZ);
const DMAX = ((W - U0) * EX) / EL; // distância do canto até a dobradiça
const alem = (u, v) => Math.max(0, ((u - U0) * EX + (v - H) * EZ) / EL);
const subida = (d) => ELEVA * (d / DMAX) ** 2;
/** O cartão não estica: a ponta que sobe recua um pouco para a dobradiça. */
const recolhe = (d) => ((2 / 3) * ELEVA ** 2 * d ** 3) / DMAX ** 4;
/** Quanto a orelha acompanha a capa: toda na dobra, pouco mais para dentro. */
const segue = (u) => ORELHA_SEGUE + (1 - ORELHA_SEGUE) * suave(W - ORELHA_SOLTA, W, u);

/** Um ponto da capa (ou de uma camada paralela a ela, na altura y quando plana). */
function naCapa(u, v, y = T) {
  const d = alem(u, v);
  const r = recolhe(d);
  return mundo(u - (r * EX) / EL, y + subida(d), v - (r * EZ) / EL);
}
/** Um ponto da orelha da frente (y: altura quando plana; o verso de cima fica em T − 1 − AR). */
function naOrelha(u, v, y = T - CARTAO - AR) {
  const d = alem(u, v);
  const k = segue(u);
  const r = recolhe(d) * k * k;
  return mundo(u - (r * EX) / EL, y + k * subida(d), v - (r * EZ) / EL);
}
/** A normal da capa empenada (no mundo), para a luz. */
function normalDaCapa(u, v) {
  const d = alem(u, v);
  const i = Math.atan((2 * ELEVA * d) / DMAX ** 2);
  return noMundo(normal([(-EX / EL) * Math.sin(i), Math.cos(i), (-EZ / EL) * Math.sin(i)]));
}

// ---------- câmera ----------

const pr = new Prancha({
  prefixo: "p03",
  largura: 1200,
  altura: 950,
  titulo: "Carreira, brochura com orelhas",
  descricao:
    "O volume 08, Carreira, como uma brochura de capa mole em cartão fosco, com orelhas e o corte da frente irregular, deitada na mesa, com a ponta da capa levemente levantada.",
});

const olho = [0, T / 2 + DISTANCIA * Math.sin(grau(ELEVACAO)), DISTANCIA * Math.cos(grau(ELEVACAO))];
const cam = camera({ olho, alvo: [0, T / 2, 0], focal: 1000, centro: [600, 475] });
const tp = (x, y, z) => cam.p(mundo(x, y, z));
{
  const cantos = [];
  for (const x of [0, W]) for (const y of [0, T]) for (const z of [0, H]) cantos.push(mundo(x, y, z));
  cantos.push(naCapa(W, H));
  enquadrar(cam, cantos, [210, 52, 730, 792]);
}

// Claridade de cada face, relativa à da capa (que sai com a cor verdadeira).
const C_CAPA = claridade([0, 1, 0]);
const escurecer = (nrm) => limitar(1 - claridade(nrm) / C_CAPA, 0, 0.9);
const S_PE = escurecer(noMundo([0, 0, 1])); // o pé (as folhas cortadas, de frente)
const S_FRENTE = escurecer(noMundo([1, 0, 0])); // a frente (o corte irregular)

// ---------- mapeamento da arte (células escolhidas à mão) ----------

/**
 * Como `superficie` da cena, mas com a lista de células pronta: grossas onde a capa é plana, finas
 * só onde ela empena. As emendas entre células de tamanhos diferentes caem na parte plana (a projeção
 * de uma reta é reta), então não abrem fresta.
 */
function mapear(ref, P, celulas, folga = 0.45) {
  const saida = [];
  for (const [u0, u1, v0, v1] of celulas) {
    const uv = [
      [u0, v0],
      [u1, v0],
      [u1, v1],
      [u0, v1],
    ];
    const tela = uv.map(([u, v]) => cam.p(P(u, v)));
    for (const idx of [
      [0, 1, 2],
      [0, 2, 3],
    ]) {
      const destino = idx.map((k) => tela[k]);
      if (area(destino) <= 0) continue;
      const m = afim(
        idx.map((k) => uv[k]),
        destino,
      );
      if (!m.every(Number.isFinite)) continue;
      const id = pr.id("cel");
      pr.def(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><polygon points="${pontos(alargar(destino, folga))}"/></clipPath>`);
      saida.push(`<g clip-path="url(#${id})"><use href="#${ref}" transform="${matriz(m)}"/></g>`);
    }
  }
  return saida.join("");
}

function celulasDaCapa() {
  const cel = [];
  const NU = 8;
  const NV = 10;
  for (let j = 0; j < NV; j++)
    for (let i = 0; i < NU; i++) {
      const u0 = (W * i) / NU;
      const u1 = (W * (i + 1)) / NU;
      const v0 = (H * j) / NV;
      const v1 = (H * (j + 1)) / NV;
      const curva = [
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
      ].some(([u, v]) => alem(u, v) > 0);
      if (!curva) {
        cel.push([u0, u1, v0, v1]);
        continue;
      }
      const k = 3;
      for (let b = 0; b < k; b++)
        for (let a = 0; a < k; a++)
          cel.push([u0 + ((u1 - u0) * a) / k, u0 + ((u1 - u0) * (a + 1)) / k, v0 + ((v1 - v0) * b) / k, v0 + ((v1 - v0) * (b + 1)) / k]);
    }
  return cel;
}

/** O contorno da capa com os cantos amaciados, em (u, v), amostrado onde o empeno curva a borda. */
function contornoUV(r = RAIO_CANTO, passos = 30) {
  const ps = [];
  const arco = (cx, cz, a0, a1) => {
    for (let k = 0; k <= 8; k++) {
      const a = grau(a0 + ((a1 - a0) * k) / 8);
      ps.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]);
    }
  };
  arco(r, r, 180, 270);
  arco(W - r, r, 270, 360);
  for (let k = 1; k < passos; k++) ps.push([W, r + ((H - 2 * r) * k) / passos]);
  arco(W - r, H - r, 0, 90);
  for (let k = 1; k < passos; k++) ps.push([W - r - ((W - 2 * r) * k) / passos, H]);
  arco(r, H - r, 90, 180);
  return ps;
}

/** Fecho convexo (Andrew) de pontos da tela. */
function casco(q0) {
  const q = [...q0].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const baixo = [];
  for (const p of q) {
    while (baixo.length >= 2 && cruz(baixo[baixo.length - 2], baixo[baixo.length - 1], p) <= 0) baixo.pop();
    baixo.push(p);
  }
  const cima = [];
  for (const p of [...q].reverse()) {
    while (cima.length >= 2 && cruz(cima[cima.length - 2], cima[cima.length - 1], p) <= 0) cima.pop();
    cima.push(p);
  }
  return [...baixo.slice(0, -1), ...cima.slice(0, -1)];
}

/** Uma faixa (polígono) entre duas linhas da tela. */
const faixa = (a, b) => pontos([...a, ...[...b].reverse()]);

// ---------- texturas (ruído com média zero, no plano de cada face) ----------

/**
 * Um ruído (feTurbulence) que entra duas vezes, com a mesma semente: preto onde passa do meio e
 * branco onde fica abaixo dele. A média fica quase no zero: o material aparece sem mudar a cor.
 * `base`: frequência (em unidades da face; "x y" alonga o ruído); `k`: força.
 */
function parDeRuido(nome, { base, oitavas = 2, semente, k, limiar = 0.5 }) {
  return [false, true].map((branco) => {
    const id = pr.id(nome);
    const c = branco ? 1 : 0;
    const a = branco ? -k : k;
    const b = branco ? k * limiar : -k * limiar;
    pr.def(
      `<filter id="${id}" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${base}" numOctaves="${oitavas}" seed="${semente}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${c} 0 0 0 0 ${c} 0 0 0 0 ${c} ${a} 0 0 0 ${b}"/></filter>`,
    );
    return id;
  });
}

/**
 * Pinta ruídos no plano de uma face: `o`, `eu`, `ev` (pontos 3D da face em (0, 0), (w, 0) e (0, h))
 * dão a afim da face para a tela; o retângulo w × h (com folga) recebe os filtros e é recortado por
 * `recorte` (id). `ruidos`: [[idDoFiltro, opacidade]].
 */
function texturaNaFace({ o, eu, ev, w, h, recorte, ruidos, folga = 30 }) {
  const m = afim(
    [
      [0, 0],
      [w, 0],
      [0, h],
    ],
    [cam.p(o), cam.p(eu), cam.p(ev)],
  );
  const rets = ruidos
    .map(([id, opacidade = 1]) => `<rect x="${-folga}" y="${-folga}" width="${w + 2 * folga}" height="${h + 2 * folga}" filter="url(#${id})"${opacidade < 1 ? ` opacity="${opacidade}"` : ""}/>`)
    .join("");
  return `<g clip-path="url(#${recorte})"><g transform="${matriz(m)}">${rets}</g></g>`;
}

// ---------- as folhas (o miolo) ----------

// O miolo vai de DOBRA a T − DOBRA na altura (entre as duas orelhas), em camadas de algumas folhas.
// Cada camada tem o seu corte da frente: um recuo de base (as camadas de um mesmo caderno parecidas),
// ondas longas e curtas e a fibra (o deckle edge). No pé e no alto o corte é reto.
const NCAMADAS = 84;
const camadas = [];
{
  const rnd = aleatorio("p03-folhas");
  let base = 0;
  let y = DOBRA;
  const alturas = Array.from({ length: NCAMADAS }, () => 0.6 + rnd() * 0.8);
  const soma = alturas.reduce((s, x) => s + x, 0);
  for (let i = 0; i < NCAMADAS; i++) {
    if (i % 5 === 0 || rnd() < 0.12) base = (rnd() - 0.6) * 2.4;
    const b = base + (rnd() - 0.5) * 1.1;
    const ondas = [
      { a: 0.25 + rnd() * 0.35, l: 110 + rnd() * 160, f: rnd() * 6.283 },
      { a: 0.3 + rnd() * 0.35, l: 22 + rnd() * 34, f: rnd() * 6.283 },
      { a: 0.12 + rnd() * 0.16, l: 6 + rnd() * 7, f: rnd() * 6.283 },
    ];
    const fibra = Array.from({ length: 241 }, () => (rnd() - 0.5) * 0.45);
    const y0 = y;
    y += ((T - 2 * DOBRA) * alturas[i]) / soma;
    camadas.push({
      y0,
      y1: y,
      tom: rnd(),
      /** O corte da frente desta camada, em z (0 a H). */
      frente(z) {
        const k = Math.min(fibra.length - 1, Math.round((z / H) * (fibra.length - 1)));
        const d = b + ondas.reduce((s, o) => s + o.a * Math.sin((z / o.l) * 6.283 + o.f), 0) + fibra[k];
        return FRENTE + Math.min(1.2, d);
      },
    });
  }
}
const PASSOS_Z = 120; // amostras ao longo do corte da frente
const zs = Array.from({ length: PASSOS_Z + 1 }, (_, k) => (H * k) / PASSOS_Z);
const TOPO = T - DOBRA; // o alto do miolo (a folha de cima)

// ---------- montagem ----------

const artCapa = pr.simbolo(capa(L.slug), { largura: W, altura: H, nome: "capa" });
const contornoCapa = contornoUV().map(([u, v]) => cam.p(naCapa(u, v)));

// === 1. sombras na mesa ===
{
  // A pegada do livro e a sombra do alto projetada na mesa pela luz (a ponta levantada vai mais longe).
  const pegada = [mundo(-RAIO_LOMBADA, 0, 0), mundo(W + 1.3, 0, 0), mundo(W + 1.3, 0, H), mundo(-RAIO_LOMBADA, 0, H)];
  const naMesa = (p, k = 1) => {
    const t = (p[1] / LUZ[1]) * k;
    return [p[0] - LUZ[0] * t, 0, p[2] - LUZ[2] * t];
  };
  const alto = contornoUV(RAIO_CANTO, 10).map(([u, v]) => naCapa(u, v));
  const projetar = (k) => casco([...pegada, ...alto.map((p) => naMesa(p, k))].map((p) => cam.p(p)));
  const perto = pegada.map((p) => cam.p(p));
  const camada = (ps, desvio, opacidade) => {
    const id = filtroDesfoque(pr, desvio, { margem: 0.35 });
    return `<polygon points="${pontos(ps)}" fill="#000" fill-opacity="${opacidade}" filter="url(#${id})"/>`;
  };
  pr.add(
    `<g>${camada(alargar(perto, 18), 34, 0.12)}${camada(projetar(1), 26, 0.13)}${camada(projetar(0.45), 12, 0.15)}${camada(projetar(0.14), 4, 0.2)}${camada(alargar(perto, 0.6), 1.6, 0.42)}${camada(perto, 0.7, 0.5)}</g>`,
  );
}

// === 2. a frente: a dobra de trás e o corte irregular das folhas, camada por camada ===
{
  const s = S_FRENTE;
  const partes = [];
  // A dobra da orelha de trás, rente à mesa: meia-volta do cartão, na cor da contracapa.
  const perfilTras = (z, a) => mundo(W + (DOBRA / 2) * Math.cos(grau(a)), DOBRA / 2 + (DOBRA / 2) * Math.sin(grau(a)), z);
  const linha = (a) => zs.map((z) => cam.p(perfilTras(z, a)));
  partes.push(`<polygon points="${faixa(linha(90), linha(-90))}" fill="${tom(COR, s + 0.14)}"/>`);
  partes.push(`<polygon points="${faixa(linha(90), linha(10))}" fill="${tom(COR, s * 0.7)}"/>`);
  // As camadas de folhas, de baixo para cima: o alto de cada uma (pega a luz de cima onde passa da
  // de cima) e o corte (a borda das folhas, na sombra).
  for (const c of camadas) {
    const borda = zs.map((z) => [c.frente(z), z]);
    const cimaFora = borda.map(([x, z]) => tp(x, c.y1, z));
    const baixoFora = borda.map(([x, z]) => tp(x, c.y0, z));
    const cimaDentro = zs.map((z) => tp(W - 10, c.y1, z));
    const v = c.tom - 0.5;
    partes.push(`<polygon points="${faixa(cimaFora, cimaDentro)}" fill="${tom(PAPEL, s * 0.4 + 0.02 * v)}"/>`);
    partes.push(`<polygon points="${faixa(cimaFora, baixoFora)}" fill="${tom(PAPEL, s + 0.03 + 0.04 * v)}"/>`);
  }
  // A fibra do corte irregular: fiapos curtos ao longo da frente e manchas longas (as folhas que
  // avançam e recuam juntas), no plano da frente, só dentro da faixa.
  const faixaFrente = recortePoligono(pr, [...zs.map((z) => tp(W + 0.2, TOPO, z)), ...[...zs].reverse().map((z) => tp(W + 0.2, DOBRA, z))]);
  const fiapo = parDeRuido("fiapo", { base: "0.09 0.8", oitavas: 2, semente: 31, k: 0.22 });
  const lote = parDeRuido("lote", { base: "0.011 0.32", oitavas: 2, semente: 37, k: 0.18 });
  partes.push(
    texturaNaFace({ o: mundo(FRENTE, 0, 0), eu: mundo(FRENTE, 0, H), ev: mundo(FRENTE, T, 0), w: H, h: T, recorte: faixaFrente, ruidos: [[lote[0]], [lote[1]], [fiapo[0]], [fiapo[1]]] }),
  );
  pr.add(`<g>${partes.join("")}</g>`);
}

// === 3. o pé: as folhas cortadas retas, vistas de frente ===
{
  const s = S_PE;
  const partes = [];
  // O pé inteiro num polígono só: da lombada até o canto da frente, onde cada camada termina no seu
  // comprimento (o perfil serrilhado do deckle visto de frente).
  const perfil = camadas.flatMap((c) => [tp(c.frente(H), c.y0, H), tp(c.frente(H), c.y1, H)]);
  const fundo = [tp(1.2, DOBRA, H), ...perfil, tp(1.2, TOPO, H)];
  partes.push(`<polygon points="${pontos(fundo)}" fill="${tom(PAPEL, s)}"/>`);
  // As folhas: veios finos ao longo do pé, que somem e voltam no comprimento (um ruído bem alongado
  // no plano do pé), mais o grão do papel. Poucos fios marcados: as divisas dos cadernos.
  const recPe = recortePoligono(pr, fundo);
  const veio = parDeRuido("veio", { base: "0.004 0.62", oitavas: 2, semente: 21, k: 0.3 });
  const graoPe = parDeRuido("graope", { base: "0.7 0.9", oitavas: 2, semente: 23, k: 0.14 });
  partes.push(
    texturaNaFace({ o: mundo(0, 0, H), eu: mundo(W, 0, H), ev: mundo(0, T, H), w: W, h: T, recorte: recPe, ruidos: [[veio[0]], [veio[1]], [graoPe[0]], [graoPe[1]]] }),
  );
  {
    const r2 = aleatorio("p03-pe");
    let y = DOBRA;
    while (y < TOPO - 3) {
      y += 5 + r2() * 9;
      const a = tp(1.4 + r2() * 4, y, H);
      const b = tp(FRENTE - 1.5 - r2() * 3, y, H);
      partes.push(`<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="#000" stroke-opacity="${op(0.025 + r2() * 0.035)}" stroke-width="${n(0.3 + r2() * 0.25)}"/>`);
    }
  }
  // Luz no pé: mais escuro rente à mesa e logo abaixo da capa; um pouco mais claro à esquerda (a luz).
  const g1 = gradiente(pr, tp(W / 2, TOPO, H), tp(W / 2, DOBRA, H), [
    [0, "#000", 0.06],
    [0.06, "#000", 0.012],
    [0.78, "#000", 0.0],
    [1, "#000", 0.07],
  ]);
  partes.push(`<polygon points="${pontos(fundo)}" fill="url(#${g1})"/>`);
  const g2 = gradiente(pr, tp(0, T / 2, H), tp(W, T / 2, H), [
    [0, "#fff", 0.07],
    [0.5, "#fff", 0],
    [1, "#000", 0.035],
  ]);
  partes.push(`<polygon points="${pontos(fundo)}" fill="url(#${g2})"/>`);
  // Os cartões cortados embaixo: a contracapa e a orelha de trás (e o ar onde não há orelha).
  const fio = (x0, x1, y0, y1, cor) => `<polygon points="${pontos([tp(x0, y0, H), tp(x1, y0, H), tp(x1, y1, H), tp(x0, y1, H)])}" fill="${cor}"/>`;
  partes.push(fio(RAIO_LOMBADA, W, 0, CARTAO, tom(PAPEL, s + 0.06)));
  partes.push(fio(RAIO_LOMBADA, W, CARTAO, CARTAO + AR, tom(PAPEL, s + 0.2)));
  partes.push(fio(W - ORELHA, W, CARTAO + AR, DOBRA, tom(PAPEL, s * 0.75)));
  partes.push(fio(RAIO_LOMBADA, W - ORELHA, CARTAO + AR, DOBRA, tom(PAPEL, s + 0.14)));
  // Em cima, onde não há orelha, a capa pousa direto nas folhas: um fio de sombra.
  partes.push(fio(RAIO_LOMBADA, W - ORELHA, TOPO, T - CARTAO, tom(PAPEL, s + 0.16)));
  // A lombada no pé: o cartão que dobra em volta do miolo (cantos macios) e o fio da cola.
  {
    const r = RAIO_LOMBADA;
    const arco = (cx, cy, a0, a1, raio) =>
      Array.from({ length: 7 }, (_, k) => {
        const a = grau(a0 + ((a1 - a0) * k) / 6);
        return tp(cx + raio * Math.cos(a), cy + raio * Math.sin(a), H);
      });
    const fora = [...arco(r, T - r, 90, 180, r), ...arco(r, r, 180, 270, r)];
    const dentro = [...arco(r, r, 270, 180, r - CARTAO), ...arco(r, T - r, 180, 90, r - CARTAO)];
    partes.push(`<polygon points="${pontos([...fora, ...dentro])}" fill="${tom(PAPEL, s + 0.1)}"/>`);
    partes.push(fio(r, r + 0.6, DOBRA, TOPO, tom(PAPEL, s + 0.1)));
  }
  pr.add(`<g>${partes.join("")}</g>`);
}

// === 4. a fresta do canto: a folha de cima e a orelha (o verso do cartão, sem impressão) ===
{
  // Uma fresta vista de fora mostra a superfície de dentro indo da boca (clara: pega o preenchimento
  // da frente) ao fundo (escuro: a capa em cima tapa a luz). O escuro depende da profundidade em
  // relação à abertura, então a fresta é pintada em faixas entre a linha da boca e a linha do fundo,
  // na proporção de cada ponto: acompanha a forma de lente de cada abertura.
  const fresta = (boca, fundo, cor, t0, t1, faixas = 12) => {
    let svg = "";
    for (let k = 0; k < faixas; k++) {
      const a = boca.map((p, i) => lerp(p, fundo[i], k / faixas));
      const b = boca.map((p, i) => lerp(p, fundo[i], (k + 1) / faixas));
      svg += `<polygon points="${faixa(a, b)}" fill="${tom(cor, t0 + (t1 - t0) * ((k + 0.5) / faixas) ** 0.8)}"/>`;
    }
    return svg;
  };
  const partes = [];
  const topo = camadas[camadas.length - 1];
  // Embaixo da orelha: a folha de cima, vista pelo pé (boca no corte do pé) e pela frente (boca no
  // corte irregular da folha de cima; o fundo é a dobra levantada).
  const up = Array.from({ length: 61 }, (_, k) => U0 - 20 + ((W - (U0 - 20)) * k) / 60);
  const bocaPe = [...up.map((u) => tp(u, TOPO, H)), tp(topo.frente(H), TOPO, H)];
  const fundoPe = [...up.map((u) => cam.p(naOrelha(u, H, TOPO))), cam.p(naOrelha(W, H, TOPO))];
  partes.push(fresta(bocaPe, fundoPe, PAPEL, 0.1, 0.62));
  const zf = Array.from({ length: 41 }, (_, k) => V0 - 20 + ((H - (V0 - 20)) * k) / 40);
  partes.push(fresta(zf.map((z) => tp(topo.frente(z), TOPO, z)), zf.map((z) => cam.p(naOrelha(W, z, TOPO))), PAPEL, 0.14, 0.55));
  // A sombra que a orelha levantada faz na folha logo abaixo do fio dela (contato, macia).
  const us = Array.from({ length: 61 }, (_, k) => W - ORELHA + (ORELHA * k) / 60);
  {
    const id = filtroDesfoque(pr, 1, { margem: 0.5 });
    const fioBaixo = us.filter((u) => u > U0 - 20).map((u) => cam.p(naOrelha(u, H, TOPO)));
    partes.push(`<polyline points="${pontos(fioBaixo)}" fill="none" stroke="#000" stroke-opacity="0.28" stroke-width="1.8" filter="url(#${id})"/>`);
  }
  // O fio do cartão da orelha, no pé (a borda cortada, clara).
  partes.push(`<polygon points="${faixa(us.map((u) => cam.p(naOrelha(u, H, TOPO + CARTAO))), us.map((u) => cam.p(naOrelha(u, H, TOPO))))}" fill="${tom(PAPEL, S_PE * 0.7)}"/>`);
  // Entre a orelha e a capa: o verso de cima da orelha (o cartão sem impressão), da boca (o fio da
  // orelha) até o fundo (a borda da capa, que tapa o resto). Onde a orelha está deitada, a fresta é
  // só o fio de ar da dobra: uma linha escura.
  partes.push(fresta(us.map((u) => cam.p(naOrelha(u, H, TOPO + CARTAO))), us.map((u) => cam.p(naCapa(u, H, T - CARTAO))), PAPEL, 0.08, 0.56));
  // O fio do cartão da capa, no pé (a borda cortada: o miolo do cartão, claro, na sombra do pé).
  const uc = Array.from({ length: 81 }, (_, k) => RAIO_LOMBADA + ((W - RAIO_CANTO - RAIO_LOMBADA) * k) / 80);
  partes.push(`<polygon points="${faixa(uc.map((u) => cam.p(naCapa(u, H, T))), uc.map((u) => cam.p(naCapa(u, H, T - CARTAO))))}" fill="${tom(PAPEL, S_PE * 0.6)}"/>`);
  pr.add(`<g>${partes.join("")}</g>`);
}

// === 5. a dobra da orelha da frente (a capa que vira para dentro), arredondada ===
{
  // Perfil em meia-volta: do alto da capa (90°) até um pouco abaixo do meio (o resto fica escondido
  // embaixo). A cor é a da capa na borda: papel até 300, a cor do livro dali para baixo. Acompanha o
  // empeno da ponta.
  const perfil = (z, a) => {
    const d = alem(W, z);
    const r = recolhe(d);
    const yc = T - DOBRA / 2 + subida(d);
    return mundo(W - (r * EX) / EL + (DOBRA / 2) * Math.cos(grau(a)), yc + (DOBRA / 2) * Math.sin(grau(a)), z - (r * EZ) / EL);
  };
  const trecho = (z0, z1, cor) => {
    const zz = Array.from({ length: 49 }, (_, k) => z0 + ((z1 - z0) * k) / 48);
    const linha = (a) => zz.map((z) => cam.p(perfil(z, a)));
    return (
      `<polygon points="${faixa(linha(90), linha(-25))}" fill="${tom(cor, S_FRENTE + 0.06)}"/>` +
      `<polygon points="${faixa(linha(90), linha(20))}" fill="${tom(cor, S_FRENTE * 0.55)}"/>` +
      `<polygon points="${faixa(linha(90), linha(55))}" fill="${tom(cor, S_FRENTE * 0.15)}"/>`
    );
  };
  pr.add(`<g>${trecho(RAIO_CANTO, 300, PAPEL)}${trecho(300, H - RAIO_CANTO, COR)}</g>`);
}

// === 6. a quina da lombada: a capa dobrando para a lombada, de perfil (pega a luz) ===
{
  // Meia quina arredondada entre a capa (90°) e a lombada (180°); a parte que a câmera vê vai até
  // ~170°. Cor da lombada na borda (papel em cima, #816342 embaixo), com a luz de cada ângulo: a
  // quina vai virando para o lado da lombada e perde o preenchimento da frente (escurece para fora).
  const r = RAIO_LOMBADA;
  const perfil = (z, a) => mundo(r * Math.cos(grau(a)), T - r + r * Math.sin(grau(a)), z);
  const trecho = (z0, z1, cor) => {
    const zz = Array.from({ length: 25 }, (_, k) => z0 + ((z1 - z0) * k) / 24);
    const linha = (a) => zz.map((z) => cam.p(perfil(z, a)));
    const luzEm = (a) => escurecer(noMundo([Math.cos(grau(a)), Math.sin(grau(a)), 0]));
    return (
      `<polygon points="${faixa(linha(90), linha(172))}" fill="${tom(cor, luzEm(155))}"/>` +
      `<polygon points="${faixa(linha(90), linha(128))}" fill="${tom(cor, luzEm(112))}"/>`
    );
  };
  pr.add(`<g>${trecho(RAIO_CANTO, 300, PAPEL)}${trecho(300, H, COR_LOMBADA)}</g>`);
}

// === 7. a capa: a arte plana mapeada, com os cantos amaciados ===
const recorteCapa = recortePoligono(pr, contornoCapa);
pr.add(`<g clip-path="url(#${recorteCapa})">${mapear(artCapa, (u, v) => naCapa(u, v), celulasDaCapa())}</g>`);

// === 8. o material da capa: fibra do cartão fosco e o grão, no espaço da capa ===
{
  // A afim da capa (três cantos) leva o retângulo 480 × 720 do grão para a tela: a fibra encurta com
  // a perspectiva e corre no sentido da lombada, como no cartão de verdade. O grão fino (um pouco mais
  // forte que o do site), as fibras (alongadas no sentido da altura, só as mais fortes aparecem) e
  // uma mancha larga e fraquíssima (a tinta pousada no cartão sem brilho).
  const grao = parDeRuido("grao", { base: "0.9", oitavas: 2, semente: 5, k: 0.2 });
  const fibra = parDeRuido("fibra", { base: "0.5 0.13", oitavas: 3, semente: 11, k: 0.55 });
  const mancha = parDeRuido("mancha", { base: "0.02 0.03", oitavas: 2, semente: 17, k: 0.075 });
  pr.add(
    texturaNaFace({
      o: naCapa(0, 0),
      eu: naCapa(W, 0),
      ev: naCapa(0, H),
      w: W,
      h: H,
      recorte: recorteCapa,
      folga: 40,
      ruidos: [[mancha[0]], [mancha[1]], [grao[0]], [grao[1], 0.8], [fibra[0], 0.22], [fibra[1], 0.2]],
    }),
  );
}

// === 9. luz na capa ===
{
  const partes = [];
  // Queda suave da luz grande (radial, a partir de fora do canto de cima à esquerda): a capa clareia
  // um pouco perto da luz e escurece um pouco longe dela.
  const centro = cam.p(naCapa(-170, -230));
  const [fx, fy] = cam.p(naCapa(W, H));
  const raio = Math.hypot(fx - centro[0], fy - centro[1]) * 1.02;
  const g = gradienteRadial(pr, centro, raio, [
    [0, "#fff", 0.09],
    [0.38, "#fff", 0.03],
    [0.62, "#fff", 0],
    [1, "#000", 0.06],
  ]);
  partes.push(`<polygon points="${pontos(contornoCapa)}" fill="url(#${g})"/>`);
  // O vinco da dobradiça, a ~7 mm da lombada: um sulco raso (a parede que foge da luz escurece, a
  // que olha para ela clareia) e, na tinta, o risco claro de quem já abriu o livro algumas vezes.
  {
    const vs = Array.from({ length: 13 }, (_, k) => (H * k) / 12);
    const linha = (u) => vs.map((v) => cam.p(naCapa(u, v)));
    partes.push(`<polyline points="${pontos(linha(VINCO - 0.5))}" fill="none" stroke="#000" stroke-opacity="0.085" stroke-width="0.75"/>`);
    partes.push(`<polyline points="${pontos(linha(VINCO + 0.6))}" fill="none" stroke="#fff" stroke-opacity="0.13" stroke-width="0.6"/>`);
    const tinta = vs.filter((v) => v >= 300).map((v) => cam.p(naCapa(VINCO + 0.1, v)));
    partes.push(`<polyline points="${pontos(tinta)}" fill="none" stroke="${PAPEL}" stroke-opacity="0.14" stroke-width="0.45" stroke-dasharray="9 3 22 2 5 4 30 3"/>`);
  }
  // O empeno: a ponta que sobe vira para a luz (clareia um pouco), da dobradiça ao canto.
  const reg = [];
  for (let k = 0; k <= 16; k++) reg.push(cam.p(naCapa(...lerp([U0, H], [W, V0], k / 16))));
  reg.push(cam.p(naCapa(W + 2, V0)), cam.p(naCapa(W + 2, H + 2)), cam.p(naCapa(U0, H + 2)));
  const q0 = cam.p(naCapa(...lerp([U0, H], [W, V0], 0.5)));
  const q1 = cam.p(naCapa(W, H));
  const paradas = [];
  for (let k = 0; k <= 10; k++) {
    const t = k / 10;
    const [u, v] = lerp(lerp([U0, H], [W, V0], 0.5), [W, H], t);
    const ganho = claridade(normalDaCapa(u, v)) / C_CAPA - 1;
    paradas.push([n(t), ganho >= 0 ? "#fff" : "#000", op(Math.abs(ganho) * 1.3)]);
  }
  const gE = gradiente(pr, q0, q1, paradas);
  partes.push(`<g clip-path="url(#${recorteCapa})"><polygon points="${pontos(reg)}" fill="url(#${gE})"/></g>`);
  pr.add(`<g>${partes.join("")}</g>`);
}

const saida = fileURLToPath(new URL("./p03-brochura.svg", import.meta.url));
pr.salvar(saida);
console.log("✓", saida);
