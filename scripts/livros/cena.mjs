/**
 * Copiado de docs/prototipos/livros-realistas/ferramentas/cena.mjs (D57), para o site não depender da
 * pasta de protótipos. A cena das pranchas, sem dependências: vetores, câmera com perspectiva, a arte plana da base
 * mapeada em superfícies 3D (planas ou curvas), luz, sombras e texturas, e o montador do SVG.
 *
 * Mundo: X para a direita, Y para cima, Z para o observador (mão direita). A unidade é a da
 * referência dos livros: a capa tem 480 × 720 e a espessura do livro é a largura da lombada
 * (livros.json), então 1 unidade ≈ 0,32 mm num livro de 23 cm. A tela (SVG) tem y para baixo.
 *
 * Mapeamento de textura: o SVG só tem transformações afins; a perspectiva e as curvas saem em
 * células. Cada célula (u0..u1 × v0..v1 da arte plana) é levada por uma afim exata em três cantos e
 * recortada pelo quadrilátero projetado (um pouco alargado, para não aparecer costura). Com células
 * pequenas na tela (uns 4 a 12 px), o erro some. Na face plana e com a câmera pouco inclinada, basta
 * fatiar na direção do encurtamento (nu × 1 ou 1 × nv).
 */
import { writeFileSync } from "node:fs";
import { documento } from "./base.mjs";

// ---------- números e vetores ----------

export const n = (v) => String(Math.round(v * 100) / 100);
export const soma = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const comprimento = (a) => Math.hypot(a[0], a[1], a[2]);
export const normal = (a) => mul(a, 1 / (comprimento(a) || 1));
export const lerp = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
export const grau = (g) => (g * Math.PI) / 180;
export const limitar = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const suave = (a, b, x) => {
  const t = limitar((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Rotação de um ponto em volta de um eixo que passa por `centro` (graus, regra da mão direita). */
export function girar(p, eixo, graus, centro = [0, 0, 0]) {
  const k = normal(eixo);
  const t = grau(graus);
  const q = sub(p, centro);
  const c = Math.cos(t);
  const s = Math.sin(t);
  // Rodrigues
  const r = soma(soma(mul(q, c), mul(cross(k, q), s)), mul(k, dot(k, q) * (1 - c)));
  return soma(r, centro);
}
export const girarX = (p, g, c) => girar(p, [1, 0, 0], g, c);
export const girarY = (p, g, c) => girar(p, [0, 1, 0], g, c);
export const girarZ = (p, g, c) => girar(p, [0, 0, 1], g, c);

/** Aleatório com semente (mulberry32): a mesma prancha sai igual a cada vez. */
export function aleatorio(semente = 1) {
  let a = typeof semente === "string" ? [...semente].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 2654435761), 1) >>> 0 : semente >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- câmera ----------

/**
 * Câmera de perspectiva (ou ortográfica, com `orto: true`). `olho` e `alvo` no mundo; `focal` em px
 * da tela (quanto maior, mais tele; com o olho a 3000 unidades, focal ≈ 3000 mostra o objeto em
 * tamanho de referência); `centro` é onde o alvo cai na tela. Use `enquadrar` para acertar o tamanho.
 */
export function camera({ olho, alvo, cima = [0, 1, 0], focal = 1000, centro = [0, 0], orto = false, escala = 1 }) {
  const f = normal(sub(alvo, olho));
  const r = normal(cross(f, cima));
  const u = cross(r, f);
  const cam = {
    olho,
    alvo,
    f,
    r,
    u,
    focal,
    centro: [...centro],
    orto,
    escala,
    /** [x, y] na tela e a profundidade (distância ao longo do olhar). */
    projetar(p) {
      const d = sub(p, olho);
      const xc = dot(d, r);
      const yc = dot(d, u);
      const zc = dot(d, f);
      if (cam.orto) return [cam.centro[0] + cam.escala * xc, cam.centro[1] - cam.escala * yc, zc];
      return [cam.centro[0] + (cam.focal * xc) / zc, cam.centro[1] - (cam.focal * yc) / zc, zc];
    },
    /** Só [x, y]. */
    p(p) {
      const [x, y] = cam.projetar(p);
      return [x, y];
    },
    /** Direção do olho até o ponto (para saber se uma face está de frente). */
    visada(p) {
      return normal(sub(p, olho));
    },
  };
  return cam;
}

/**
 * Acerta a escala (focal ou escala ortográfica) e o centro para os pontos caberem na caixa
 * [x, y, largura, altura] da tela. Devolve a caixa ocupada.
 */
export function enquadrar(cam, pontos, [bx, by, bw, bh]) {
  const caixa = () => {
    const ps = pontos.map((p) => cam.p(p));
    const xs = ps.map((q) => q[0]);
    const ys = ps.map((q) => q[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  };
  for (let i = 0; i < 3; i++) {
    const [x0, y0, x1, y1] = caixa();
    const k = Math.min(bw / (x1 - x0), bh / (y1 - y0));
    if (cam.orto) cam.escala *= k;
    else cam.focal *= k;
    const [a0, b0, a1, b1] = caixa();
    cam.centro[0] += bx + bw / 2 - (a0 + a1) / 2;
    cam.centro[1] += by + bh / 2 - (b0 + b1) / 2;
  }
  const [x0, y0, x1, y1] = caixa();
  return [x0, y0, x1 - x0, y1 - y0];
}

// ---------- afins e homografias ----------

/** A afim (matrix(a b c d e f) do SVG) que leva três pontos de origem a três de destino. */
export function afim([s0, s1, s2], [d0, d1, d2]) {
  const S = [s1[0] - s0[0], s2[0] - s0[0], s1[1] - s0[1], s2[1] - s0[1]]; // [[a, b], [c, d]] em colunas
  const D = [d1[0] - d0[0], d2[0] - d0[0], d1[1] - d0[1], d2[1] - d0[1]];
  const det = S[0] * S[3] - S[1] * S[2];
  const inv = [S[3] / det, -S[1] / det, -S[2] / det, S[0] / det];
  // M = D · S⁻¹
  const m00 = D[0] * inv[0] + D[1] * inv[2];
  const m01 = D[0] * inv[1] + D[1] * inv[3];
  const m10 = D[2] * inv[0] + D[3] * inv[2];
  const m11 = D[2] * inv[1] + D[3] * inv[3];
  const e = d0[0] - (m00 * s0[0] + m01 * s0[1]);
  const f = d0[1] - (m10 * s0[0] + m11 * s0[1]);
  return [m00, m10, m01, m11, e, f];
}
export const matriz = (m) => `matrix(${m.map((x) => (Math.round(x * 10000) / 10000).toString()).join(" ")})`;

/** Homografia (3 × 3, por linhas) que leva os quatro cantos de origem aos quatro de destino. */
export function homografia(de, para) {
  // Resolve A·h = b (8 incógnitas, h33 = 1) por eliminação de Gauss.
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = de[i];
    const [X, Y] = para[i];
    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]);
    b.push(X);
    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]);
    b.push(Y);
  }
  const m = A.map((l, i) => [...l, b[i]]);
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let l = c + 1; l < 8; l++) if (Math.abs(m[l][c]) > Math.abs(m[p][c])) p = l;
    [m[c], m[p]] = [m[p], m[c]];
    for (let l = 0; l < 8; l++) {
      if (l === c) continue;
      const k = m[l][c] / m[c][c];
      for (let k2 = c; k2 < 9; k2++) m[l][k2] -= k * m[c][k2];
    }
  }
  const h = m.map((l, i) => l[8] / l[i]);
  return [...h, 1];
}
export function aplicarH(H, [x, y]) {
  const w = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
}

// ---------- polígonos na tela ----------

export const pontos = (ps) => ps.map(([x, y]) => `${n(x)},${n(y)}`).join(" ");
export const caminho = (ps, fechar = true) => `M${ps.map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}${fechar ? "Z" : ""}`;
/** Área com sinal (positiva no sentido horário da tela, que tem y para baixo). */
export const area = (ps) => ps.reduce((s, p, i) => s + (p[0] * ps[(i + 1) % ps.length][1] - ps[(i + 1) % ps.length][0] * p[1]), 0) / 2;

/** Alarga um polígono convexo `d` px para fora (a partir do centro), contra a costura entre células. */
export function alargar(ps, d) {
  const cx = ps.reduce((s, p) => s + p[0], 0) / ps.length;
  const cy = ps.reduce((s, p) => s + p[1], 0) / ps.length;
  return ps.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const l = Math.hypot(dx, dy) || 1;
    return [x + (dx / l) * d, y + (dy / l) * d];
  });
}

// ---------- a prancha (montador do SVG) ----------

/**
 * Junta defs e camadas e grava o SVG com as fontes (base.documento). Os ids saem com o prefixo da
 * prancha (`p01-…`), para nada colidir se duas pranchas um dia dividirem a mesma página.
 */
export class Prancha {
  constructor({ prefixo, largura, altura, titulo, descricao = "" }) {
    Object.assign(this, { prefixo, largura, altura, titulo, descricao });
    this.defs = [];
    this.camadas = [];
    this.contador = 0;
  }
  id(nome = "x") {
    return `${this.prefixo}-${nome}-${++this.contador}`;
  }
  def(s) {
    this.defs.push(s);
    return this;
  }
  add(s) {
    this.camadas.push(s);
    return this;
  }
  /** Guarda um fragmento da base como <symbol> reutilizável e devolve o id (para <use href="#id">). */
  simbolo(fragmento, { largura, altura, nome = "arte" }) {
    const id = this.id(nome);
    this.def(`<symbol id="${id}" viewBox="0 0 ${n(largura)} ${n(altura)}" width="${n(largura)}" height="${n(altura)}" overflow="visible">${fragmento}</symbol>`);
    return id;
  }
  svg() {
    return documento({ largura: this.largura, altura: this.altura, titulo: this.titulo, descricao: this.descricao, defs: this.defs.join("\n"), miolo: this.camadas.join("\n") });
  }
  salvar(caminhoDoArquivo) {
    writeFileSync(caminhoDoArquivo, this.svg());
    return caminhoDoArquivo;
  }
}

// ---------- superfícies texturizadas ----------

/**
 * Mapeia a arte plana `ref` (id de um <symbol> de `w` × `h`) numa superfície 3D P(u, v) → [x, y, z],
 * com u de 0 a w e v de 0 a h na arte (v para baixo, como na tela da arte). Devolve o SVG das células
 * (e as põe nas defs da prancha) e a lista de células, com a normal e o quadrilátero na tela, para
 * sombrear por cima.
 *
 * - `nu`, `nv`: células em cada direção (fatie onde a superfície curva ou encurta).
 * - `costas`: "esconder" (padrão) não desenha a célula vista por trás; "mostrar" desenha;
 *   `refCostas` desenha outra arte nas costas (espelhada, para ler certo de trás).
 * - `folga`: quanto alargar cada recorte (px), contra a costura.
 * - `ordenar`: desenha do fundo para a frente (para superfícies que se cobrem, como a folha virando).
 * - `recorte`: só as células com u0..u1 × v0..v1 dentro desta caixa da arte [u0, v0, u1, v1].
 */
export function superficie(prancha, { ref, refCostas, w, h, P, cam, nu = 16, nv = 1, costas = "esconder", folga = 0.45, ordenar = false, recorte }) {
  const celulas = [];
  const [ru0, rv0, ru1, rv1] = recorte ?? [0, 0, w, h];
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const u0 = (w * i) / nu;
      const u1 = (w * (i + 1)) / nu;
      const v0 = (h * j) / nv;
      const v1 = (h * (j + 1)) / nv;
      if (u1 <= ru0 || u0 >= ru1 || v1 <= rv0 || v0 >= rv1) continue;
      const c3 = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)];
      const tela = c3.map((p) => cam.p(p));
      const meio = P((u0 + u1) / 2, (v0 + v1) / 2);
      const nrm = normal(cross(sub(P(u1, (v0 + v1) / 2), P(u0, (v0 + v1) / 2)), sub(P((u0 + u1) / 2, v0), P((u0 + u1) / 2, v1))));
      // De frente = a arte aparece sem espelhar na tela (u para a direita e v para baixo dão área
      // positiva, com o y da tela para baixo). De trás, ela apareceria espelhada.
      const deFrente = area(tela) > 0;
      celulas.push({ i, j, u0, u1, v0, v1, c3, tela, meio, normal: nrm, profundidade: cam.projetar(meio)[2], deFrente });
    }
  }
  const lista = ordenar ? [...celulas].sort((x, y) => y.profundidade - x.profundidade) : celulas;
  const saida = [];
  // Cada célula vira dois triângulos, cada um com a sua afim exata nos três cantos: as emendas
  // entre triângulos vizinhos coincidem (a arte fica contínua), e o erro da perspectiva fica só
  // dentro de cada triângulo, pequeno com células pequenas.
  const tri = (c, idx, deFrente) => {
    let arte = ref;
    const uv = [
      [c.u0, c.v0],
      [c.u1, c.v0],
      [c.u1, c.v1],
      [c.u0, c.v1],
    ];
    let origem = idx.map((k) => uv[k]);
    if (!deFrente) {
      if (costas === "esconder" && !refCostas) return;
      if (refCostas) {
        arte = refCostas;
        origem = origem.map(([u, v]) => [w - u, v]); // a arte das costas é lida de trás: espelha em u
      }
    }
    const destino = idx.map((k) => c.tela[k]);
    const m = afim(origem, destino);
    if (!m.every(Number.isFinite)) return;
    const id = prancha.id("cel");
    prancha.def(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><polygon points="${pontos(alargar(destino, folga))}"/></clipPath>`);
    saida.push(`<g clip-path="url(#${id})"><use href="#${arte}" transform="${matriz(m)}"/></g>`);
  };
  for (const c of lista) {
    const a1 = area([c.tela[0], c.tela[1], c.tela[2]]);
    const a2 = area([c.tela[0], c.tela[2], c.tela[3]]);
    tri(c, [0, 1, 2], a1 > 0);
    tri(c, [0, 2, 3], a2 > 0);
  }
  return { svg: saida.join(""), celulas };
}

/** P(u, v) de uma face plana: `origem` é o canto (u=0, v=0) e `eixoU`, `eixoV` os vetores de 1 unidade da arte. */
export const plano = (origem, eixoU, eixoV) => (u, v) => soma(origem, soma(mul(eixoU, u), mul(eixoV, v)));

/**
 * Sombreamento de Lambert por célula, por cima de uma superfície: preto onde a face foge da luz e
 * (opcional) branco onde ela encara a luz. `luz`: direção PARA a luz (normalizada aqui).
 * `ambiente` é o piso de claridade. Devolve polígonos (sem costura, com folga) para uma camada.
 */
export function sombrear(celulas, { luz, ambiente = 0.35, forca = 0.55, brilho = 0, folga = 0.5, cor = "#000", corBrilho = "#fff" }) {
  const L = normal(luz);
  const partes = [];
  for (const c of celulas) {
    if (!c.deFrente) continue;
    const lamb = Math.max(0, dot(c.normal, L));
    const claro = ambiente + (1 - ambiente) * lamb; // 0..1
    const escuro = (1 - claro) * forca;
    const ps = pontos(alargar(c.tela, folga));
    if (escuro > 0.004) partes.push(`<polygon points="${ps}" fill="${cor}" fill-opacity="${n(escuro * 1000) / 1000}"/>`);
    if (brilho > 0) {
      const b = Math.max(0, lamb - 0.75) * 4 * brilho;
      if (b > 0.004) partes.push(`<polygon points="${ps}" fill="${corBrilho}" fill-opacity="${n(b * 1000) / 1000}"/>`);
    }
  }
  return partes.join("");
}

/** O contorno (polígono da tela) de uma superfície P(u, v), com `amostras` pontos por borda. */
export function contorno(cam, P, w, h, amostras = 24) {
  const ps = [];
  for (let i = 0; i <= amostras; i++) ps.push(cam.p(P((w * i) / amostras, 0)));
  for (let i = 1; i <= amostras; i++) ps.push(cam.p(P(w, (h * i) / amostras)));
  for (let i = amostras - 1; i >= 0; i--) ps.push(cam.p(P((w * i) / amostras, h)));
  for (let i = amostras - 1; i >= 1; i--) ps.push(cam.p(P(0, (h * i) / amostras)));
  return ps;
}

/**
 * Luz de uma superfície cuja normal só muda com u (face plana, lombada arredondada, folha curvada em
 * uma direção): um polígono só, com o contorno da superfície, e um gradiente ao longo de u (na tela,
 * na altura `vRef`) com o Lambert de cada amostra. Sem costura nenhuma. `luz`: direção PARA a luz.
 * `ambiente`: o piso de claridade; `forca`: quanto o escuro pesa; `brilho`: realce onde a face
 * encara a luz (0 a 1), a partir de `limiarBrilho`. Devolve o SVG (duas camadas, sombra e brilho).
 */
export function sombrearFace(prancha, { P, w, h, cam, luz, ambiente = 0.4, forca = 0.6, brilho = 0, limiarBrilho = 0.8, amostras = 32, vRef, cor = "#000", corBrilho = "#fff", especular }) {
  const L = normal(luz);
  const v = vRef ?? h / 2;
  const du = w / 400;
  const dv = h / 400;
  const a = cam.p(P(0, v));
  const b = cam.p(P(w, v));
  const eixo = [b[0] - a[0], b[1] - a[1]];
  const l2 = eixo[0] ** 2 + eixo[1] ** 2 || 1;
  const escuro = [];
  const claro = [];
  for (let i = 0; i <= amostras; i++) {
    const u = (w * i) / amostras;
    const u0 = Math.max(0, u - du);
    const u1 = Math.min(w, u + du);
    const nrm = normal(cross(sub(P(u1, v), P(u0, v)), sub(P(u, Math.max(0, v - dv)), P(u, Math.min(h, v + dv)))));
    const q = cam.p(P(u, v));
    const t = limitar(((q[0] - a[0]) * eixo[0] + (q[1] - a[1]) * eixo[1]) / l2);
    const lamb = Math.max(0, dot(nrm, L));
    const c = ambiente + (1 - ambiente) * lamb;
    escuro.push([t, cor, n((1 - c) * forca * 1000) / 1000]);
    let bri = brilho > 0 ? Math.max(0, lamb - limiarBrilho) / (1 - limiarBrilho) * brilho : 0;
    if (especular) {
      // Brilho especular (Blinn-Phong) com o olho: a meia direção entre a luz e o olhar.
      const V = normal(sub(cam.olho, P(u, v)));
      const Hh = normal(soma(L, V));
      bri += Math.pow(Math.max(0, dot(nrm, Hh)), especular.expoente ?? 40) * (especular.forca ?? 0.3);
    }
    claro.push([t, corBrilho, n(bri * 1000) / 1000]);
  }
  escuro.sort((x, y) => x[0] - y[0]);
  claro.sort((x, y) => x[0] - y[0]);
  const forma = pontos(contorno(cam, P, w, h));
  const g1 = gradiente(prancha, a, b, escuro);
  let svg = `<polygon points="${forma}" fill="url(#${g1})"/>`;
  if (claro.some((c) => c[2] > 0)) {
    const g2 = gradiente(prancha, a, b, claro);
    svg += `<polygon points="${forma}" fill="url(#${g2})"/>`;
  }
  return svg;
}

// ---------- luz, sombra e textura ----------

/** Um filtro de desfoque (feGaussianBlur) nas defs; devolve o id. `margem` alarga a região do filtro. */
export function filtroDesfoque(prancha, desvio, { margem = 0.6 } = {}) {
  const id = prancha.id("desfoque");
  prancha.def(`<filter id="${id}" x="-${margem}" y="-${margem}" width="${1 + 2 * margem}" height="${1 + 2 * margem}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${n(desvio)}"/></filter>`);
  return id;
}

/**
 * Sombra suave de um polígono da tela, em camadas (contato escuro e justo, meia-sombra e ambiente
 * larga). `camadas`: [{ desvio, opacidade, dx, dy, encolher }]. Devolve o SVG.
 */
export function sombra(prancha, poligono, camadas, { cor = "#000" } = {}) {
  return camadas
    .map(({ desvio, opacidade, dx = 0, dy = 0 }) => {
      const id = filtroDesfoque(prancha, desvio);
      return `<polygon points="${pontos(poligono.map(([x, y]) => [x + dx, y + dy]))}" fill="${cor}" fill-opacity="${opacidade}" filter="url(#${id})"/>`;
    })
    .join("");
}

/**
 * Grão de papel (como o grao.svg do site): um retângulo de ruído só com alfa, para pôr por cima de
 * uma área (recortada pela face). `base`: frequência (maior = mais fino); `alfa`: força.
 */
export function filtroGrao(prancha, { base = 0.85, oitavas = 2, alfa = 0.11, semente = 3, cor = [0, 0, 0] } = {}) {
  const id = prancha.id("grao");
  const [r, g, b] = cor;
  prancha.def(
    `<filter id="${id}" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${base}" numOctaves="${oitavas}" seed="${semente}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 ${alfa} 0"/></filter>`,
  );
  return id;
}

/** Um recorte (clipPath) com um polígono da tela; devolve o id. */
export function recortePoligono(prancha, poligono) {
  const id = prancha.id("recorte");
  prancha.def(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><polygon points="${pontos(poligono)}"/></clipPath>`);
  return id;
}

/** Gradiente linear em coordenadas da tela; `paradas`: [[deslocamento 0..1, cor, opacidade]]. */
export function gradiente(prancha, [x1, y1], [x2, y2], paradas) {
  const id = prancha.id("grad");
  prancha.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}">${paradas.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`,
  );
  return id;
}

/** Gradiente radial em coordenadas da tela. */
export function gradienteRadial(prancha, [cx, cy], r, paradas, { fx, fy, transformacao } = {}) {
  const id = prancha.id("radial");
  prancha.def(
    `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}"${fx != null ? ` fx="${n(fx)}" fy="${n(fy)}"` : ""}${transformacao ? ` gradientTransform="${transformacao}"` : ""}>${paradas.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</radialGradient>`,
  );
  return id;
}

/**
 * As linhas das folhas no corte do miolo (topo, pé ou frente), num quadrilátero 3D [a, b, c, d]
 * (a→b ao longo da folha, a→d atravessando as folhas). Linhas finas, com espessura e tom que variam
 * um pouco, como papel de verdade. Devolve o SVG (sem o fundo: pinte o papel por baixo).
 */
export function linhasDasFolhas(cam, [a, b, c, d], { quantas = 60, cor = "#000", opacidade = 0.12, largura = 0.5, semente = 7, ondulacao = 0 } = {}) {
  const rnd = aleatorio(semente);
  const linhas = [];
  for (let i = 1; i < quantas; i++) {
    const t = (i + (rnd() - 0.5) * 0.6) / quantas;
    const p0 = lerp(a, d, t);
    const p1 = lerp(b, c, t);
    const op = opacidade * (0.45 + rnd() * 1.1);
    const lw = largura * (0.6 + rnd() * 0.8);
    if (ondulacao) {
      const passos = 8;
      const ps = [];
      for (let k = 0; k <= passos; k++) {
        const q = lerp(p0, p1, k / passos);
        const [x, y] = cam.p(q);
        ps.push([x, y + Math.sin(k * 1.7 + i) * ondulacao * rnd()]);
      }
      linhas.push(`<path d="${caminho(ps, false)}" fill="none" stroke="${cor}" stroke-opacity="${n(op * 1000) / 1000}" stroke-width="${n(lw * 100) / 100}"/>`);
    } else {
      const [x0, y0] = cam.p(p0);
      const [x1, y1] = cam.p(p1);
      linhas.push(`<line x1="${n(x0)}" y1="${n(y0)}" x2="${n(x1)}" y2="${n(y1)}" stroke="${cor}" stroke-opacity="${n(op * 1000) / 1000}" stroke-width="${n(lw * 100) / 100}"/>`);
    }
  }
  return linhas.join("");
}

/** O polígono (tela) de uma face 3D. */
export const face = (cam, ps) => ps.map((p) => cam.p(p));
