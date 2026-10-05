#!/usr/bin/env node
/**
 * Prancha 05 · "Capa entreaberta" (livro IA).
 *
 * O livro em pé, visto de frente e da direita, com a câmera um pouco acima e teleobjetiva. A capa
 * dura gira pela dobradiça da lombada e abre ~64° na direção de quem olha: aparece o verso da capa
 * (a guarda com a assinatura do blog em moldura, emoldurada pela dobra do forro na cor do livro), a
 * espessura do papelão na borda aberta, três folhas soltas em leque e a folha de rosto no miolo. Luz
 * grande e suave do alto, à esquerda de quem olha: a capa e as folhas fazem sombra macia na folha de
 * rosto, a calha escurece e o livro assenta no chão com sombra de contato.
 *
 * Geometria (unidades da referência: capa 480 × 720, espessura 120):
 * - X para a direita, Y para cima, Z para o observador. O livro fechado tem a capa em z = +60, a
 *   contracapa em z = −60, a lombada à esquerda (x ≈ 0) e o corte da frente à direita (x ≈ 480).
 * - Papelão de 8; seixa de 9 (o miolo tem 702 de altura e vai até x = 471); lombada arredondada, com
 *   o dorso do miolo convexo e o corte da frente côncavo (o mesmo arredondamento).
 * - A capa gira em torno da quina da calha G = (3, 52): a dobra da guarda, onde a face interna do
 *   papelão encontra a primeira folha. As folhas soltas nascem do mesmo eixo.
 *
 * Por que a câmera fica tão à direita: o verso da capa só fica de frente para quem olha quando a
 * soma da abertura da capa com o ângulo da câmera passa de 90°. Com a capa a 64° e a câmera a 50°, o
 * verso aparece a ~0,41 da largura. As folhas do leque ficam perto do plano vertical que passa pela
 * calha e pelo olho ("de perfil"): mais abertas, elas tapariam a assinatura ou o título.
 *
 * A luz de cada face é pintada na própria arte plana (gradientes nas coordenadas da arte) e vai para
 * a superfície junto com ela, pelo mesmo mapeamento: assim o sombreado acompanha a perspectiva. As
 * sombras projetadas (da capa e das folhas na folha de rosto, do livro no chão) saem de 15 amostras
 * da janela de luz, cada uma com a sua parte da opacidade: a penumbra alarga sozinha com a distância.
 *
 *   fnm exec --using=24 node pranchas/p05-entreaberto.mjs  →  pranchas/p05-entreaberto.svg
 */
import { fileURLToPath } from "node:url";
import { livro, versoDaCapa, BITTER, NEWSREADER } from "../base/base.mjs";
import {
  Prancha, camera, enquadrar, superficie, gradiente, filtroDesfoque, filtroGrao, recortePoligono,
  pontos, caminho, soma, sub, mul, dot, normal, grau, limitar, suave, aleatorio, n,
} from "../ferramentas/cena.mjs";

const L = livro("ia");
const W = 480; // largura da capa
const H = 720; // altura da capa
const T = L.largura; // espessura do livro (120)
const E = 8; // papelão
const S = 9; // seixa
const Y0 = S; // pé do miolo
const Y1 = H - S; // alto do miolo (711)
const HM = Y1 - Y0; // altura do miolo (702)
const GX = 3; // quina da calha (eixo da capa e das folhas)
const GZ = T / 2 - E; // 52: a face da frente do miolo
const XF = W - S; // 471: o corte da frente do miolo
const LF = XF - GX; // 468: largura da folha
const CONCAVO = 9; // o corte da frente é côncavo (o dorso é arredondado)
const PAPEL_ROSTO = "#f6f2e9"; // a folha de rosto: creme um pouco mais claro que o papel da capa
const CREME_CABECEADO = "#e8dfca";

// ---------- pose ----------

const THETA = 64; // abertura da capa (graus)
const PHI = 50; // câmera: quanto à direita da frente (graus)
const EPS = 13; // câmera: quanto acima (graus)
const DIST = 4600; // teleobjetiva: olho longe, perspectiva fraca

const TH = grau(THETA);
const dCapa = [Math.cos(TH), 0, Math.sin(TH)]; // ao longo da capa, da dobradiça para a borda livre
const nDentro = [Math.sin(TH), 0, -Math.cos(TH)]; // normal da face interna (o verso)
const nFora = mul(nDentro, -1);
const S_LIVRE = W - GX; // 477: da dobradiça até a borda livre

/** A face interna da capa (o verso), na arte do verso: U de 0 (borda livre, à esquerda) a 480 (dobradiça). */
const sDe = (U) => ((W - U) * S_LIVRE) / W;
const versoP = (U, V) => [GX + sDe(U) * dCapa[0], H - V, GZ + sDe(U) * dCapa[2]];
/** A outra face do papelão (a capa impressa, que não se vê daqui). */
const foraP = (U, V) => soma(versoP(U, V), mul(nFora, E));

/** A folha de rosto: a face da frente do miolo (u da calha para o corte, v de cima para baixo). */
const rostoP = (u, v) => [GX + u, Y1 - v, GZ];

/** O corte da frente (côncavo): x em função de z, de z = +52 (frente) a z = −52 (fundo). */
const xCorte = (z) => XF - CONCAVO * (1 - (z / GZ) ** 2);
/** O dorso do miolo (convexo): a lombada arredondada por dentro. */
const xDorso = (z) => GX - 11 * (1 - (z / GZ) ** 2);
/** O corte da frente como superfície: u de 0 (junto da folha de rosto) a 104 (junto da contracapa). */
const corteP = (u, v) => {
  const z = GZ - u;
  return [xCorte(z), Y1 - v, z];
};

// ---------- câmera ----------

const alvo = [210, 340, 150];
const olho = [
  alvo[0] + DIST * Math.cos(grau(EPS)) * Math.sin(grau(PHI)),
  alvo[1] + DIST * Math.sin(grau(EPS)),
  alvo[2] + DIST * Math.cos(grau(EPS)) * Math.cos(grau(PHI)),
];
const cam = camera({ olho, alvo, focal: 1000, centro: [600, 500] });
const olhar = normal(sub(olho, alvo)); // do livro para a câmera

/** O plano vertical pela calha que contém o olho: uma folha nesse ângulo fica de perfil. */
const ALFA_PERFIL = (Math.atan2(olho[2] - GZ, olho[0] - GX) * 180) / Math.PI;

// ---------- luz ----------

/**
 * A luz principal é uma janela grande (softbox) no alto, à esquerda de quem olha (~36° à esquerda da
 * câmera). Azimute medido de +X para +Z (90° = de frente para a capa fechada). As sombras saem de
 * amostras espalhadas pela janela.
 */
const LUZ = { az: 76, el: 55, meiaLargura: 18, meiaAltura: 12 };
const dirLuz = (az, el) => [Math.cos(grau(el)) * Math.cos(grau(az)), Math.sin(grau(el)), Math.cos(grau(el)) * Math.sin(grau(az))];
const L0 = dirLuz(LUZ.az, LUZ.el);
const AMOSTRAS_LUZ = [];
for (const a of [-1, -0.5, 0, 0.5, 1]) for (const e of [-1, 0, 1]) AMOSTRAS_LUZ.push(dirLuz(LUZ.az + a * LUZ.meiaLargura, LUZ.el + e * LUZ.meiaAltura));

/**
 * Claridade de uma face (0 a ~1): ambiente (a sala clara), a principal (Lambert com a janela
 * alargada, porque ela é grande) e um rebatedor fraco do lado da câmera. `vis`: quanto da janela a
 * face vê (1 = toda). O papel da folha de rosto, iluminado, fica com a cor certa (REF).
 */
const AMB = 0.6;
const PRINC = 0.42;
const REBATE = 0.16;
const lambJanela = (nrm) => limitar((dot(nrm, L0) + 0.12) / 1.12); // a janela grande "abraça" um pouco
function claridade(nrm, { vis = 1, extra = 0 } = {}) {
  return AMB + PRINC * lambJanela(nrm) * vis + REBATE * Math.max(0, dot(nrm, olhar)) + extra;
}
const REF = claridade([0, 0, 1]);
const rel = (nrm, op) => claridade(nrm, op) / REF;

// ---------- folhas soltas (leque) ----------

/**
 * Uma folha que nasce na calha e curva: o ângulo vai de `raiz` (junto da costura) a `ponta` (na
 * borda livre), com a curva perto da calha (`lambda`). A folha torce um pouco de cima para baixo
 * (`torcao`, graus, somada à ponta no pé e tirada no alto): em pé, as folhas abrem mais em cima.
 * P(u, v): u ao longo da folha (da calha à borda livre), v de cima para baixo.
 */
function folhaCurva({ ponta, raiz, lambda = 80, torcao = 0, bojo = 0, largura = LF, tom = 1 }) {
  const N = 160;
  const curva = (pontaV) => {
    const pts = [[GX, GZ]];
    let x = GX;
    let z = GZ;
    for (let i = 0; i < N; i++) {
      const s = ((i + 0.5) * largura) / N;
      const a = grau(pontaV + (raiz - pontaV) * Math.exp(-s / lambda));
      x += (Math.cos(a) * largura) / N;
      z += (Math.sin(a) * largura) / N;
      pts.push([x, z]);
    }
    return pts;
  };
  // Três curvas (alto, meio e pé): a torção vai do alto ao pé e o bojo empurra o meio, para a borda
  // livre não sair reta como régua.
  const cima = curva(ponta - torcao / 2);
  const meio = curva(ponta + bojo);
  const baixo = curva(ponta + torcao / 2);
  const em = (pts, s) => {
    const t = limitar(s / largura) * N;
    const i = Math.min(N - 1, Math.floor(t));
    const f = t - i;
    return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
  };
  const P = (u, v) => {
    const t = v / HM;
    const a = em(cima, u);
    const m = em(meio, u);
    const b = em(baixo, u);
    // Bézier quadrática que passa pelo meio em t = 0,5
    const c = [2 * m[0] - (a[0] + b[0]) / 2, 2 * m[1] - (a[1] + b[1]) / 2];
    const k0 = (1 - t) ** 2;
    const k1 = 2 * t * (1 - t);
    const k2 = t * t;
    return [k0 * a[0] + k1 * c[0] + k2 * b[0], Y1 - v, k0 * a[1] + k1 * c[1] + k2 * b[1]];
  };
  /** Normal do lado de frente (recto) no ponto u, à meia altura. */
  const normalEm = (u) => {
    const q0 = P(Math.max(0, u - 1), HM / 2);
    const q1 = P(Math.min(largura, u + 1), HM / 2);
    const t = normal(sub(q1, q0));
    return [-t[2], 0, t[0]];
  };
  return { P, largura, ponta, raiz, normalEm, tom, deCostas: ponta > ALFA_PERFIL };
}

const FOLHAS = [
  // descolando da folha de rosto: sai rente a ela e sobe; é a que mais recebe a janela
  folhaCurva({ ponta: ALFA_PERFIL - 5.2, raiz: ALFA_PERFIL - 15, lambda: 115, torcao: 3.6, bojo: -0.7, tom: 1.02 }),
  folhaCurva({ ponta: ALFA_PERFIL - 1.6, raiz: ALFA_PERFIL - 8, lambda: 100, torcao: 2.2, bojo: -0.4, tom: 0.97 }),
  // a guarda solta: acompanha a capa (sai íngreme) e cai um pouco; fica de costas para nós
  folhaCurva({ ponta: ALFA_PERFIL + 1.9, raiz: ALFA_PERFIL + 9, lambda: 85, torcao: -1.6, bojo: 0.5, tom: 1 }),
];

// ---------- enquadramento ----------

const chave = [
  versoP(0, 0), versoP(0, H), foraP(0, 0), foraP(0, H),
  [xCorte(GZ), Y1, GZ], [xCorte(GZ), Y0, GZ], [W, H, -T / 2], [W, 0, -T / 2], [W, 0, -GZ],
  [-20, H, 0], [0, H, -T / 2], [0, 0, -T / 2], ...FOLHAS.map((f) => f.P(LF, HM)),
];
enquadrar(cam, chave, [250, 92, 680, 816]);

const p = (q) => cam.p(q);
const pr = new Prancha({
  prefixo: "p05",
  largura: 1200,
  altura: 1000,
  titulo: "IA · capa entreaberta",
  descricao: "O livro IA em pé, com a capa dura entreaberta: o verso da capa com a assinatura do blog, três folhas em leque e a folha de rosto.",
});

// ---------- utilidades de desenho ----------

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const op3 = (x) => n(limitar(x) * 1000) / 1000;
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function txt(t, { x, y, familia, peso, corpo, espacamento = 0, italico = false, opsz, cor, opacidade = 1, ancora }) {
  const estilo = [
    `font-family:${familia}`,
    `font-weight:${peso}`,
    `font-size:${n(corpo)}px`,
    italico ? "font-style:italic" : "",
    espacamento ? `letter-spacing:${n(espacamento)}px` : "",
    opsz ? `font-variation-settings:'opsz' ${opsz}` : "",
    "font-variant-numeric:lining-nums",
    "text-rendering:geometricPrecision",
  ]
    .filter(Boolean)
    .join(";");
  return `<text x="${n(x)}" y="${n(y)}" fill="${cor}"${opacidade < 1 ? ` opacity="${opacidade}"` : ""}${ancora ? ` text-anchor="${ancora}"` : ""} style="${estilo}">${esc(t)}</text>`;
}

/** O contorno na tela de uma superfície P(u, v) (u de 0 a w, v de 0 a h). */
function contornoTela(P, w, h, nu = 24, nv = 6) {
  const ps = [];
  for (let i = 0; i <= nu; i++) ps.push(p(P((w * i) / nu, 0)));
  for (let j = 1; j <= nv; j++) ps.push(p(P(w, (h * j) / nv)));
  for (let i = nu - 1; i >= 0; i--) ps.push(p(P((w * i) / nu, h)));
  for (let j = nv - 1; j >= 1; j--) ps.push(p(P(0, (h * j) / nv)));
  return ps;
}

/**
 * A luz de uma face pintada na arte plana (w × h): `fu(u)` e `fv(v)` são a claridade relativa ao
 * longo de cada eixo da arte (1 = a cor certa; abaixo escurece com preto, acima clareia com branco).
 * Vai para a superfície junto com a arte, pelo mesmo mapeamento.
 */
function luzNaArte(w, h, { fu, fv, nu = 24, nv = 12 } = {}) {
  const camada = (f, amostras, eixo) => {
    const escuro = [];
    const claro = [];
    for (let i = 0; i <= amostras; i++) {
      const t = i / amostras;
      const k = f(t * (eixo === "u" ? w : h));
      escuro.push([n(t * 10000) / 10000, "#000", op3(1 - k)]);
      claro.push([n(t * 10000) / 10000, "#fff", op3(k - 1)]);
    }
    const fim = eixo === "u" ? [w, 0] : [0, h];
    let s = `<rect width="${n(w)}" height="${n(h)}" fill="url(#${gradiente(pr, [0, 0], fim, escuro)})"/>`;
    if (claro.some((c) => Number(c[2]) > 0)) s += `<rect width="${n(w)}" height="${n(h)}" fill="url(#${gradiente(pr, [0, 0], fim, claro)})"/>`;
    return s;
  };
  return (fu ? camada(fu, nu, "u") : "") + (fv ? camada(fv, nv, "v") : "");
}

/** Grão de papel por cima de um polígono da tela (ruído só com alfa, bem fraco). */
function grao(poligono, { alfa = 0.05, base = 0.9, semente = 5 } = {}) {
  const f = filtroGrao(pr, { base, oitavas: 2, alfa, semente });
  const r = recortePoligono(pr, poligono);
  const xs = poligono.map((q) => q[0]);
  const ys = poligono.map((q) => q[1]);
  const x0 = Math.floor(Math.min(...xs)) - 2;
  const y0 = Math.floor(Math.min(...ys)) - 2;
  return `<g clip-path="url(#${r})"><rect x="${x0}" y="${y0}" width="${Math.ceil(Math.max(...xs) - x0) + 4}" height="${Math.ceil(Math.max(...ys) - y0) + 4}" filter="url(#${f})"/></g>`;
}

/** A sombra de um ponto no plano z = zp, na direção oposta à luz `d`. */
const sombraEmZ = (q, d, zp) => {
  const t = (q[2] - zp) / d[2];
  return [q[0] - d[0] * t, q[1] - d[1] * t, zp];
};
/** A sombra de um ponto no chão (y = 0), na direção oposta à luz `d`. */
const sombraNoChao = (q, d) => {
  const t = q[1] / d[1];
  return [q[0] - d[0] * t, 0, q[2] - d[2] * t];
};

/** Envoltória convexa (cadeia monótona) de pontos da tela. */
function envoltoria(ps) {
  const a = [...ps].sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  const cr = (o, p1, p2) => (p1[0] - o[0]) * (p2[1] - o[1]) - (p1[1] - o[1]) * (p2[0] - o[0]);
  const baixo = [];
  for (const q of a) {
    while (baixo.length >= 2 && cr(baixo.at(-2), baixo.at(-1), q) <= 0) baixo.pop();
    baixo.push(q);
  }
  const cima = [];
  for (const q of [...a].reverse()) {
    while (cima.length >= 2 && cr(cima.at(-2), cima.at(-1), q) <= 0) cima.pop();
    cima.push(q);
  }
  return [...baixo.slice(0, -1), ...cima.slice(0, -1)];
}

/** Um traço borrado na tela (contato, vinco). */
function traco(ps, { largura, opacidade, desvio, cor = "#000" }) {
  return `<path d="${caminho(ps, false)}" stroke="${cor}" stroke-opacity="${opacidade}" stroke-width="${largura}" stroke-linecap="round" stroke-linejoin="round" fill="none"${desvio ? ` filter="url(#${filtroDesfoque(pr, desvio, { margem: 3 })})"` : ""}/>`;
}

// ---------- artes planas (com a luz de cada face) ----------

/** A folha de rosto (468 × 702): tipografia de livro, centrada, com margens largas. */
function folhaDeRosto() {
  const cx = 246; // o centro da mancha, um pouco para o lado do corte (a calha "come" papel)
  return [
    `<rect width="${LF}" height="${HM}" fill="${PAPEL_ROSTO}"/>`,
    txt("VOLUME 04", { x: cx + 1.4, y: 152, familia: BITTER, peso: 700, corpo: 11.5, espacamento: 2.8, cor: L.destaque, opacidade: 0.74, ancora: "middle" }),
    txt("IA", { x: cx + 2.2, y: 322, familia: BITTER, peso: 800, corpo: 150, espacamento: -4.5, cor: L.destaque, ancora: "middle" }),
    `<rect x="${cx - 18}" y="362" width="36" height="1.5" fill="${L.destaque}" opacity="0.55"/>`,
    txt("Software feito com IA", { x: cx, y: 410, familia: NEWSREADER, peso: 400, corpo: 24, italico: true, opsz: 24, cor: L.tintaPapel, opacidade: 0.84, ancora: "middle" }),
    txt("e software que usa IA.", { x: cx, y: 441, familia: NEWSREADER, peso: 400, corpo: 24, italico: true, opsz: 24, cor: L.tintaPapel, opacidade: 0.84, ancora: "middle" }),
    txt("CESAR SCHUTZ", { x: cx + 1.4, y: 606, familia: BITTER, peso: 700, corpo: 11.5, espacamento: 2.8, cor: L.tintaPapel, opacidade: 0.58, ancora: "middle" }),
    // a luz: a calha fecha (oclusão), o pé fica um pouco mais fechado que o alto
    luzNaArte(LF, HM, {
      fu: (u) => 1 - 0.34 * Math.exp(-u / 13) - 0.1 * Math.exp(-u / 55),
      fv: (v) => 1.015 - 0.075 * suave(HM * 0.45, HM, v),
    }),
  ].join("");
}

/**
 * O verso da capa como num livro de verdade: a guarda (versoDaCapa, papel com a assinatura em
 * moldura) colada sobre o forro, que dobra da capa impressa por cima do papelão e fica à vista numa
 * margem de 10 no alto, no pé e na borda livre (papel em cima, a cor do livro de 300 para baixo).
 * Longe da janela, ele só recebe o ambiente, o rebatedor e o reflexo da folha de rosto (mais forte
 * perto da calha); bem na quina, a oclusão escurece.
 */
const DOBRA = 10;
function versoComForro() {
  const d = DOBRA;
  const base = rel(nDentro) + 0.1; // + o reflexo difuso do papel à frente
  return [
    versoDaCapa(L.slug),
    `<rect x="0" y="0" width="${W}" height="${d}" fill="#000" opacity="0.03"/>`,
    `<rect x="0" y="${d}" width="${d}" height="${300 - d}" fill="#000" opacity="0.03"/>`,
    `<rect x="0" y="300" width="${d}" height="${H - 300}" fill="${L.cor}"/>`,
    `<rect x="0" y="${H - d}" width="${W}" height="${d}" fill="${L.cor}"/>`,
    // a borda da guarda sobre o forro: um fio de sombra e, rente, um de luz
    `<path d="M${W} ${d + 0.5}H${d + 0.5}V${H - d - 0.5}H${W}" fill="none" stroke="#000" stroke-opacity="0.16" stroke-width="0.9"/>`,
    `<path d="M${W} ${d + 1.5}H${d + 1.5}V${H - d - 1.5}H${W}" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="0.7"/>`,
    luzNaArte(W, H, {
      nu: 28,
      fu: (U) => {
        const sd = sDe(U); // distância da dobradiça
        return base + 0.07 * Math.exp(-sd / 140) - 0.3 * Math.exp(-sd / 11) - 0.07 * Math.exp(-sd / 45) - 0.03 * (sd / S_LIVRE);
      },
      fv: (v) => 1.03 - 0.1 * suave(H * 0.4, H, v),
    }),
  ].join("");
}

/** O corte da frente (104 × 702): o papel, as linhas das folhas e a luz (foge da janela). */
function corteDaFrente() {
  const rnd = aleatorio(707);
  const w = 2 * GZ;
  const linhas = [];
  for (let i = 1; i < 78; i++) {
    const u = (w * (i + (rnd() - 0.5) * 0.8)) / 78;
    const op = 0.045 + rnd() * 0.1 + (rnd() < 0.07 ? 0.09 : 0);
    linhas.push(`<rect x="${n(u)}" y="0" width="${n(0.35 + rnd() * 0.45)}" height="${HM}" fill="#000" opacity="${op3(op)}"/>`);
  }
  return [
    `<rect width="${w}" height="${HM}" fill="${L.papel}"/>`,
    ...linhas,
    luzNaArte(w, HM, {
      nu: 16,
      fu: (u) => {
        const z = GZ - u;
        const inc = Math.atan((2 * CONCAVO * z) / (GZ * GZ)); // inclinação do côncavo
        return rel([Math.cos(inc), 0, -Math.sin(inc)]) * (1 - 0.05 * suave(0, 20, u) * suave(2 * GZ, 2 * GZ - 20, u));
      },
      fv: (v) => 1.02 - 0.09 * suave(HM * 0.5, HM, v),
    }),
  ].join("");
}

/** Uma folha solta (468 × 702): o papel e a luz (a janela, a oclusão na calha e no fundo do "V"). */
function folhaSolta(f) {
  return [
    `<rect width="${LF}" height="${HM}" fill="${L.papel}"/>`,
    luzNaArte(LF, HM, {
      nu: 28,
      fu: (u) => {
        const nrm = f.deCostas ? mul(f.normalEm(u), -1) : f.normalEm(u);
        const vis = 0.3 + 0.7 * suave(10, 300, u); // perto da calha, a capa e as vizinhas tampam a janela
        const translucido = f.deCostas ? 0.1 * vis : 0; // o papel fino deixa passar um pouco de luz
        return rel(nrm, { vis, extra: translucido }) * (1 - 0.22 * Math.exp(-u / 26));
      },
      fv: (v) => 1.03 - 0.2 * suave(HM * 0.3, HM, v),
    }),
  ].join("");
}

const artVerso = pr.simbolo(versoComForro(), { largura: W, altura: H, nome: "verso" });
const artRosto = pr.simbolo(folhaDeRosto(), { largura: LF, altura: HM, nome: "rosto" });
const artCorte = pr.simbolo(corteDaFrente(), { largura: 2 * GZ, altura: HM, nome: "corte" });

// ---------- polígonos da tela usados em várias camadas ----------

const telaRosto = [rostoP(0, 0), rostoP(LF, 0), rostoP(LF, HM), rostoP(0, HM)].map(p);
const telaVerso = [versoP(0, 0), versoP(W, 0), versoP(W, H), versoP(0, H)].map(p);
const telaCorte = contornoTela(corteP, 2 * GZ, HM, 24, 4);

// ============================================================================================
// 1. O chão: oclusão larga, a sombra da janela (amostrada), o fundo do "V" e o contato.
// ============================================================================================
{
  // A pegada do livro: o bloco (miolo, lombada e contracapa) e a capa aberta (uma faixa no chão).
  const bloco = [[-20, 0, 0], [-10, 0, 52], [GX, 0, 58], [W, 0, 52], [W, 0, -T / 2], [0, 0, -T / 2], [-12, 0, -40]];
  const capaChao = [versoP(0, H), versoP(W, H), foraP(W, H), foraP(0, H)];
  const pegada = envoltoria([...bloco, ...capaChao].map(p));
  pr.add(`<g opacity="0.14" filter="url(#${filtroDesfoque(pr, 30, { margem: 1 })})"><polygon points="${pontos(pegada)}"/></g>`);
  pr.add(`<g opacity="0.16" filter="url(#${filtroDesfoque(pr, 10, { margem: 1 })})"><polygon points="${pontos(envoltoria(bloco.map(p)))}"/></g>`);

  // A sombra da janela: cada amostra projeta o bloco e a capa no chão; a união de cada uma leva a
  // sua parte da opacidade.
  const blocoAlto = [];
  for (const q of bloco) blocoAlto.push(q, [q[0], H, q[2]]);
  const capaAlta = [versoP(0, 0), versoP(W, 0), versoP(0, H), versoP(W, H)];
  let camadas = "";
  for (const d of AMOSTRAS_LUZ) {
    const sb = envoltoria(blocoAlto.map((q) => p(sombraNoChao(q, d))));
    const sc = envoltoria(capaAlta.map((q) => p(sombraNoChao(q, d))));
    camadas += `<g opacity="${op3(0.22 / AMOSTRAS_LUZ.length)}"><polygon points="${pontos(sb)}"/><polygon points="${pontos(sc)}"/></g>`;
  }
  pr.add(`<g filter="url(#${filtroDesfoque(pr, 5, { margem: 1 })})">${camadas}</g>`);

  // O fundo do "V" entre a capa aberta e o miolo: quanto mais perto da calha, menos céu ele vê.
  const G0 = [GX, 0, GZ];
  const F0 = versoP(0, H);
  const R0 = [XF, 0, GZ + 2];
  for (const [k, op, desvio] of [[1, 0.09, 12], [0.62, 0.11, 8], [0.36, 0.13, 5], [0.18, 0.16, 3], [0.08, 0.2, 1.6]]) {
    const tri = [G0, lerp3(G0, F0, k), lerp3(G0, R0, k)].map(p);
    pr.add(`<polygon points="${pontos(tri)}" fill="#000" fill-opacity="${op}" filter="url(#${filtroDesfoque(pr, desvio, { margem: 1 })})"/>`);
  }
  // debaixo das folhas soltas (elas pairam 9 acima do chão): uma sombra estreita
  for (const f of FOLHAS) {
    const base = [];
    for (let i = 0; i <= 16; i++) {
      const q = f.P((LF * i) / 16, HM);
      base.push(p([q[0], 0, q[2]]));
    }
    pr.add(traco(base, { largura: 3, opacidade: 0.2, desvio: 2 }));
  }

  // Contato: onde o papelão encosta no chão (a capa aberta, a contracapa) e o pé do miolo.
  pr.add(traco([p(versoP(0, H)), p(versoP(W, H))], { largura: 5, opacidade: 0.4, desvio: 2.4 }));
  pr.add(traco([p(versoP(0, H)), p(versoP(W, H))], { largura: 1.6, opacidade: 0.55, desvio: 0.7 }));
  pr.add(traco([p([W, 0, -GZ]), p([W, 0, -T / 2])], { largura: 4, opacidade: 0.5, desvio: 1.6 }));
  pr.add(traco([p([XF, 0, GZ]), p([W, 0, -GZ])], { largura: 7, opacidade: 0.28, desvio: 3.2 }));
  pr.add(traco([p([GX + 20, 0, GZ + 3]), p([XF - 4, 0, GZ + 3])], { largura: 6, opacidade: 0.22, desvio: 3.5 }));
}

// ============================================================================================
// 2. A contracapa: o que aparece dela (a face interna na seixa, o alto e a borda da frente).
// ============================================================================================
{
  const zi = -GZ;
  const ze = -T / 2;
  const alem = [[xCorte(zi), 0, zi], [W, 0, zi], [W, H, zi], [xCorte(zi), H, zi]].map(p);
  const acima = [[xDorso(zi) - 4, Y1, zi], [W, Y1, zi], [W, H, zi], [xDorso(zi) - 4, H, zi]].map(p);
  const borda = [[W, 0, zi], [W, 0, ze], [W, H, ze], [W, H, zi]].map(p);
  const alto = [[-4, H, zi], [W, H, zi], [W, H, ze], [-4, H, ze]].map(p);
  const cor = L.cor;
  pr.add(`<polygon points="${pontos(alem)}" fill="${cor}"/><polygon points="${pontos(acima)}" fill="${cor}"/>`);
  pr.add(`<polygon points="${pontos(borda)}" fill="${cor}"/><polygon points="${pontos(alto)}" fill="${cor}"/>`);
  // luz: a face interna vê a janela, mas funda na seixa; a borda recebe pouco; o alto, de cima
  pr.add(`<polygon points="${pontos(alem)}" fill="#000" fill-opacity="0.18"/><polygon points="${pontos(acima)}" fill="#000" fill-opacity="0.26"/>`);
  pr.add(`<polygon points="${pontos(borda)}" fill="#000" fill-opacity="${op3(1 - rel([1, 0, 0]) + 0.06)}"/>`);
  pr.add(`<polygon points="${pontos(alto)}" fill="#fff" fill-opacity="0.1"/>`);
}

// ============================================================================================
// 3. A cabeça da lombada (vista de cima): a borda do forro na lombada, o oco e o cabeceado.
// ============================================================================================
{
  // O arco da lombada da capa, por dentro: passa por (−1, ±57) e sai até −13 no meio (fica ~4 de
  // folga do dorso do miolo, o "oco" de uma lombada solta). Por fora, 2,4 a mais (papelão fino).
  const arcoLombada = (folga, i, N) => {
    const meia = 57 + folga * 0.3;
    const b = 12 + folga;
    const xc = (meia * meia - b * b) / (2 * b);
    const R = xc + b;
    const phi = Math.asin(meia / R);
    const th = Math.PI + phi - (2 * phi * i) / N;
    return [-1 + xc + R * Math.cos(th), R * Math.sin(th)];
  };
  const N = 30;
  const fora = [];
  const dentro = [];
  for (let i = 0; i <= N; i++) {
    const [x, z] = arcoLombada(2.4, i, N);
    fora.push(p([x, H, z]));
    const [x2, z2] = arcoLombada(0, i, N);
    dentro.push(p([x2, H - 0.3, z2]));
  }
  const dorso = [];
  for (let i = 0; i <= N; i++) {
    const z = 57 - (114 * i) / N;
    const zz = Math.max(-GZ, Math.min(GZ, z));
    dorso.push(p([xDorso(zz) - 0.5, Y1 + 1, zz]));
  }
  // o oco (sombra entre a lombada e o miolo), escuro mas não preto
  pr.add(`<polygon points="${pontos([...dentro, ...[...dorso].reverse()])}" fill="#3b2f2c"/>`);
  // a borda do forro (papel, a parte de cima da lombada), iluminada de cima
  pr.add(`<polygon points="${pontos([...fora, ...[...dentro].reverse()])}" fill="${L.papel}"/>`);
  pr.add(`<polygon points="${pontos([...fora, ...[...dentro].reverse()])}" fill="#000" fill-opacity="0.06"/>`);
  // O cabeceado: um cordão fino, listrado na cor do livro e no creme, sobre o dorso do miolo; o
  // alto do cordão pega a luz, os lados fecham.
  const listras = [];
  const M = 46;
  const r = 2.3;
  for (let i = 0; i < M; i++) {
    const z0 = GZ - 1 - ((2 * GZ - 2) * i) / M;
    const z1 = GZ - 1 - ((2 * GZ - 2) * (i + 1)) / M;
    const q = [
      [xDorso(z0) - 1.2, Y1 + r * 1.4, z0],
      [xDorso(z1) - 1.2, Y1 + r * 1.4, z1],
      [xDorso(z1) + r * 1.5, Y1 + 0.3, z1],
      [xDorso(z0) + r * 1.5, Y1 + 0.3, z0],
    ].map(p);
    listras.push(`<polygon points="${pontos(q)}" fill="${i % 2 ? L.cor : CREME_CABECEADO}"/>`);
  }
  pr.add(`<g>${listras.join("")}</g>`);
  const cordao = [];
  for (let i = 0; i <= N; i++) {
    const z = GZ - 1 - ((2 * GZ - 2) * i) / N;
    cordao.push(p([xDorso(z) + 0.2, Y1 + r * 1.2, z]));
  }
  pr.add(`<path d="${caminho(cordao, false)}" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="0.8"/>`);
}

// ============================================================================================
// 4. O miolo: a cabeça (o alto das folhas), o corte da frente e a folha de rosto.
// ============================================================================================
{
  const rnd = aleatorio(505);
  // --- cabeça ---
  const N = 26;
  const borda = [];
  for (let i = 0; i <= N; i++) borda.push([xCorte(GZ - (2 * GZ * i) / N), Y1, GZ - (2 * GZ * i) / N]);
  for (let i = 0; i <= N; i++) borda.push([xDorso(-GZ + (2 * GZ * i) / N), Y1, -GZ + (2 * GZ * i) / N]);
  const cabeca = borda.map(p);
  pr.add(`<polygon points="${pontos(cabeca)}" fill="${L.papel}"/>`);
  // as linhas das folhas na cabeça: do dorso ao corte, a z constante
  const linhas = [];
  for (let i = 1; i < 70; i++) {
    const z = GZ - ((2 * GZ) * (i + (rnd() - 0.5) * 0.7)) / 70;
    const op = 0.04 + rnd() * 0.09;
    linhas.push(`<path d="${caminho([p([xDorso(z) + 1, Y1, z]), p([(xDorso(z) + xCorte(z)) / 2, Y1, z]), p([xCorte(z), Y1, z])], false)}" stroke="#000" stroke-opacity="${op3(op)}" stroke-width="${n((0.35 + rnd() * 0.45) * 100) / 100}" fill="none"/>`);
  }
  pr.add(`<g clip-path="url(#${recortePoligono(pr, cabeca)})">${linhas.join("")}</g>`);
  // luz de cima; o fundo da cabeça (perto da contracapa) um pouco mais fechado
  const fCab = rel([0, 1, 0]);
  const gCab = gradiente(pr, p([240, Y1, GZ]), p([240, Y1, -GZ]), [[0, "#fff", op3(fCab - 1 + 0.02)], [1, "#000", 0.07]]);
  pr.add(`<polygon points="${pontos(cabeca)}" fill="url(#${gCab})"/>`);
  // perto da calha, a capa e as folhas fecham a luz
  const gCab2 = gradiente(pr, p([GX, Y1, 30]), p([GX + 150, Y1, 30]), [[0, "#000", 0.22], [1, "#000", 0]]);
  pr.add(`<polygon points="${pontos(cabeca)}" fill="url(#${gCab2})"/>`);
  pr.add(grao(cabeca, { alfa: 0.05, semente: 11 }));
  // a quina da cabeça com a folha de rosto pega um fio de luz
  pr.add(`<path d="${caminho([p([GX + 30, Y1, GZ]), p([XF - 2, Y1, GZ])], false)}" stroke="#fff" stroke-opacity="0.45" stroke-width="0.7" fill="none"/>`);

  // --- corte da frente (côncavo) ---
  pr.add(superficie(pr, { ref: artCorte, w: 2 * GZ, h: HM, P: corteP, cam, nu: 10, nv: 6 }).svg);
  pr.add(grao(telaCorte, { alfa: 0.05, semente: 12 }));
  // a quina com a folha de rosto: um fio de luz
  pr.add(`<path d="${caminho([p(corteP(0.4, 0)), p(corteP(0.4, HM))], false)}" stroke="#fff" stroke-opacity="0.35" stroke-width="0.6" fill="none"/>`);

  // --- folha de rosto ---
  pr.add(superficie(pr, { ref: artRosto, w: LF, h: HM, P: rostoP, cam, nu: 10, nv: 8 }).svg);
  // Sombra macia da capa e das folhas: cada amostra da janela projeta a capa e as folhas no plano da
  // folha de rosto; a união de cada amostra leva a sua parte do que a janela dá à folha.
  const perdaMax = (PRINC * lambJanela([0, 0, 1])) / REF;
  let camadas = "";
  for (const d of AMOSTRAS_LUZ) {
    const polis = [[versoP(W, 0), versoP(0, 0), versoP(0, H), versoP(W, H)].map((q) => p(sombraEmZ(q, d, GZ)))];
    for (const f of FOLHAS) {
      const cima = [];
      const baixo = [];
      for (let i = 0; i <= 20; i++) {
        const u = (f.largura * i) / 20;
        cima.push(p(sombraEmZ(f.P(u, 0), d, GZ)));
        baixo.push(p(sombraEmZ(f.P(u, HM), d, GZ)));
      }
      polis.push([...cima, ...baixo.reverse()]);
    }
    camadas += `<g opacity="${n((perdaMax / AMOSTRAS_LUZ.length) * 10000) / 10000}">${polis.map((q) => `<polygon points="${pontos(q)}"/>`).join("")}</g>`;
  }
  pr.add(`<g clip-path="url(#${recortePoligono(pr, telaRosto)})"><g filter="url(#${filtroDesfoque(pr, 4, { margem: 1 })})">${camadas}</g></g>`);
  pr.add(grao(telaRosto, { alfa: 0.045, semente: 13 }));
}

// ============================================================================================
// 5. O verso da capa (a guarda e a dobra do forro) e a espessura do papelão.
// ============================================================================================
{
  pr.add(superficie(pr, { ref: artVerso, w: W, h: H, P: versoP, cam, nu: 12, nv: 8 }).svg);
  pr.add(grao(telaVerso, { alfa: 0.05, semente: 14 }));

  // A espessura do papelão na borda livre: o forro dobra por cima (papel em cima, a cor embaixo).
  const bordaP = (a, V) => lerp3(versoP(0, V), foraP(0, V), a);
  const alto = [bordaP(0, 0), bordaP(1, 0), bordaP(1, 300), bordaP(0, 300)].map(p);
  const baixo = [bordaP(0, 300), bordaP(1, 300), bordaP(1, H), bordaP(0, H)].map(p);
  pr.add(`<polygon points="${pontos(alto)}" fill="${L.papel}"/><polygon points="${pontos(baixo)}" fill="${L.cor}"/>`);
  // de frente para a janela e para nós; o forro arredonda a quina: mais claro no meio
  const fb = rel(dCapa);
  const a0 = p(bordaP(0, 360));
  const a1 = p(bordaP(1, 360));
  const gb = gradiente(pr, a0, a1, [[0, "#000", 0.1], [0.3, "#fff", op3(fb - 1 + 0.06)], [0.65, "#fff", 0.03], [1, "#000", 0.14]]);
  pr.add(`<polygon points="${pontos([bordaP(0, 0), bordaP(1, 0), bordaP(1, H), bordaP(0, H)].map(p))}" fill="url(#${gb})"/>`);
  // o pé da borda, perto do chão, fecha um pouco
  const gp = gradiente(pr, p(bordaP(0.5, H * 0.55)), p(bordaP(0.5, H)), [[0, "#000", 0], [1, "#000", 0.12]]);
  pr.add(`<polygon points="${pontos([bordaP(0, 0), bordaP(1, 0), bordaP(1, H), bordaP(0, H)].map(p))}" fill="url(#${gp})"/>`);

  // O alto do papelão (visto de cima): papel, iluminado; a quina com o verso pega um fio de luz.
  const topo = [versoP(W, 0), versoP(0, 0), foraP(0, 0), foraP(W, 0)].map(p);
  pr.add(`<polygon points="${pontos(topo)}" fill="${L.papel}"/><polygon points="${pontos(topo)}" fill="#fff" fill-opacity="0.12"/>`);
  pr.add(`<path d="${caminho([p(versoP(4, 0)), p(versoP(W - 10, 0))], false)}" stroke="#fff" stroke-opacity="0.5" stroke-width="0.7" fill="none"/>`);
}

// ============================================================================================
// 6. A quina da calha: o vinco escuro onde a guarda encontra a primeira folha (sob as folhas).
// ============================================================================================
pr.add(traco([p([GX, Y1, GZ]), p([GX, Y0 + 2, GZ])], { largura: 2.4, opacidade: 0.32, desvio: 1.2 }));

// ============================================================================================
// 7. As folhas em leque. De frente para nós (recto) as que ficam abaixo do perfil, de costas as de
//    cima; cada lado se pinta de fora para dentro (a mais próxima do perfil cobre as outras).
// ============================================================================================
{
  const ordem = [...FOLHAS].sort((a, b) => Math.abs(b.ponta - ALFA_PERFIL) - Math.abs(a.ponta - ALFA_PERFIL));
  for (const f of ordem) {
    const art = pr.simbolo(folhaSolta(f), { largura: LF, altura: HM, nome: "folha" });
    pr.add(superficie(pr, { ref: art, w: LF, h: HM, P: f.P, cam, nu: 36, nv: 4, costas: "mostrar" }).svg);
    // a borda livre pega a janela: um fio de luz, que some no fundo do "V"
    const livre = [];
    for (let j = 0; j <= 8; j++) livre.push(p(f.P(LF, (HM * j) / 8)));
    const gl = gradiente(pr, livre[0], livre.at(-1), [[0, "#fff", 0.6], [0.7, "#fff", 0.35], [1, "#fff", 0.05]]);
    pr.add(`<path d="${caminho(livre, false)}" fill="none" stroke="url(#${gl})" stroke-width="0.8"/>`);
    // o alto da folha: um fio de sombra fino (a espessura do papel vista de cima)
    const alto = [];
    for (let i = 0; i <= 30; i++) alto.push(p(f.P((LF * i) / 30, 0)));
    pr.add(`<path d="${caminho(alto, false)}" fill="none" stroke="#000" stroke-opacity="0.14" stroke-width="0.6"/>`);
  }
}

const saida = fileURLToPath(new URL("./p05-entreaberto.svg", import.meta.url));
pr.salvar(saida);
console.log("✓", saida, "· perfil das folhas:", n(ALFA_PERFIL), "° · REF", n(REF));
