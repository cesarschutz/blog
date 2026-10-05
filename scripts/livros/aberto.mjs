/**
 * O livro aberto, com as páginas em branco e uma folha virando (D57, prancha 06), para os vazios: o
 * livro ainda sem artigos e a busca sem resultado. Copiado de
 * docs/historico/livros-realistas/pranchas/p06-folheando.mjs, só com o modo em branco (sem o sumário,
 * a abertura do artigo e a epígrafe, que pediam medir o texto no Chrome).
 *
 * O livro aberto e deitado na mesa, visto de frente e de cima (44°), com teleobjetiva e girado 2°.
 * À esquerda, um bloco fino de folhas; à direita, o resto do livro; uma folha no meio da virada sobe
 * da calha, passa do meio e enrola para a esquerda.
 *
 * - Geometria: cada folha do bloco é uma curva em comprimento de arco que sai da dobra no fundo da
 *   calha e se achata na altura do bloco; a borda da frente sai em degraus e o pé mostra o leque.
 * - A folha que vira é um cilindro de papel levemente torcido (virada pelo canto de cima).
 * - Luz: principal grande do alto à esquerda, preenchimento fraco da frente, ambiente; oclusão na
 *   calha; a folha levantada deixa passar luz. Sombras da folha nas páginas e do livro na mesa.
 *
 *   livroAberto({ cor, papel }) → { svg, largura, altura }
 */
import { PAPEL } from "./base.mjs";
import {
  Prancha,
  camera,
  enquadrar,
  girarY,
  soma,
  sub,
  mul,
  dot,
  cross,
  normal,
  limitar,
  suave,
  pontos,
  caminho,
  n,
  area,
  alargar,
  filtroDesfoque,
  filtroGrao,
  aleatorio,
} from "./cena.mjs";

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

/** O livro aberto em branco, nas cores `cor` (capa, contracapa e lombada) e `papel` (o alto da capa da frente). */
export function livroAberto(L) {
  // ---------- cores ----------

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const paraHex = (rgb) =>
    "#" +
    rgb
      .map((v) =>
        Math.round(limitar(v, 0, 255))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("");
  /** Mistura em sRGB: t = 0 dá `a`, t = 1 dá `b`. */
  const misturar = (a, b, t) => paraHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
  const PAPEL_MIOLO = PAPEL; // o papel das folhas: o mesmo creme da capa

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
    prefixo: "aberto",
    largura: LARGURA,
    altura: ALTURA,
    titulo: "Um livro aberto, com as páginas em branco e uma folha virando",
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
  /**
   * Uma página em branco: cada célula em dois triângulos opacos, com o papel já iluminado (λ nos três
   * vértices, 1 = papel plano iluminado), num gradiente linear exato. Opacos, os triângulos podem se
   * sobrepor um pouco (contra a costura) sem escurecer a emenda, o que a camada de luz translúcida da
   * prancha 06 fazia nas páginas pequenas. `Pp(u, v)` → ponto do livro; `us`, `vs`: as divisas das células.
   */
  function mapear({ Pp, us, vs, papel, luz, folga = 0.5 }) {
    const partes = [];
    const base = hex(papel);
    const iluminado = (l) => (l <= 1 ? paraHex(base.map((c) => c * l)) : paraHex(base.map((c) => c + (255 - c) * Math.min(1, (l - 1) * 0.9))));
    const cor = (v, parada) => (parada ? `stop-color="${iluminado(v)}"` : iluminado(v));
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
        for (const idx of [
          [0, 1, 2],
          [0, 2, 3],
        ]) {
          const d = idx.map((k) => tela[k]);
          if (Math.abs(area(d)) < 0.02) continue;
          partes.push(
            `<polygon points="${pontos(alargar(d, folga))}" ${gradienteTriangulo(
              d,
              idx.map((k) => lam[k]),
              cor,
              [1],
            )}/>`,
          );
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
    partes.push(
      `<g clip-path="url(#${recorte(envoltoria([...baixo, ...cima].map(P)))})"><rect width="${LARGURA}" height="${ALTURA}" filter="url(#${grao})"/></g>`,
    );
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
      listras.push(
        `<rect x="${n(x)}" y="${n(y - 12)}" width="${n((b[0] - a[0]) / 32)}" height="16" fill="${i % 2 ? L.papel : L.cor}" transform="rotate(-25 ${n(x)} ${n(y)})"/>`,
      );
    }
    pr.add(
      `<g clip-path="url(#${recorte(pc)})"><polygon points="${pontos(pc)}" fill="${L.cor}"/>${listras.join("")}<polygon points="${pontos(pc)}" fill="#000" fill-opacity="0.35"/></g>`,
    );
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
    pr.def(
      `<radialGradient id="${gr}" gradientUnits="userSpaceOnUse" cx="${n(d0[0])}" cy="${n(d0[1])}" r="${n(b.t * 1.5 + 30)}"><stop offset="0" stop-color="#000" stop-opacity="0.24"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`,
    );
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
      dentro.push(
        `<path d="${caminho(ps, false)}" fill="none" stroke="#3a2c1c" stroke-opacity="${n(op * 1000) / 1000}" stroke-width="${n(0.3 + rnd() * 0.45)}"/>`,
      );
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
      dentro.push(
        `<line x1="${n(p0[0])}" y1="${n(p0[1])}" x2="${n(p1[0])}" y2="${n(p1[1])}" stroke="#3a2c1c" stroke-opacity="${n(op * 1000) / 1000}" stroke-width="${n(0.3 + rnd() * 0.4)}"/>`,
      );
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
  pr.add(mapear({ Pp: paginaEsq, us: usEsq, vs: vsPag, papel: PAPEL_MIOLO, luz: (u, v) => luzDaPagina(ESQ, PG_W - u, Z0 + v) }));
  const contornoEsq = contornoDe(paginaEsq, PG_W, PG_H);

  pr.add(frenteDoBloco(DIR, 41));
  pr.add(peDoBloco(DIR, 51));
  pr.add(mapear({ Pp: paginaDir, us: usDir, vs: vsPag, papel: PAPEL_MIOLO, luz: (u, v) => luzDaPagina(DIR, u, Z0 + v) }));
  const contornoDir = contornoDe(paginaDir, PG_W, PG_H);

  // Grão do papel nas duas páginas.
  {
    const grao = filtroGrao(pr, { base: 0.85, oitavas: 2, alfa: 0.065, semente: 3 });
    for (const c of [contornoEsq, contornoDir])
      pr.add(`<g clip-path="url(#${recorte(c)})"><rect width="${LARGURA}" height="${ALTURA}" filter="url(#${grao})"/></g>`);
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
        polys.push(
          `<polygon points="${pontos(
            alargar(
              ss.map((x) => P(x.q)),
              0.6,
            ),
          )}"/>`,
        );
      }
      saida.push(`<g filter="url(#${desfoque(c.desvio)})" opacity="${c.op}" fill="#000">${polys.join("")}</g>`);
    }
    pr.add(`<g clip-path="url(#${paginas})">${saida.join("")}</g>`);
  }

  // A folha: triângulos opacos do fundo para a frente, com o papel já iluminado.
  const PAPEL_RGB = hex(PAPEL_MIOLO);
  const corDoPapel = (l) => (l <= 1 ? paraHex(PAPEL_RGB.map((c) => c * l)) : paraHex(PAPEL_RGB.map((c) => c + (255 - c) * Math.min(1, (l - 1) * 0.9))));

  {
    const partes = [];
    const corPapel = (v, parada) => (parada ? `stop-color="${corDoPapel(v)}"` : corDoPapel(v));
    for (const t of trisFolha) {
      if (Math.abs(area(t.tela)) < 0.01) continue;
      partes.push(`<polygon points="${pontos(alargar(t.tela, 0.45))}" ${gradienteTriangulo(t.tela, t.lams, corPapel, [1])}/>`);
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

  return { svg: pr.svg(), largura: LARGURA, altura: ALTURA };
}
