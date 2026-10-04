#!/usr/bin/env node
/**
 * Desenhos dos livros novos (CAPAS.md, "Livros novos"): o instrumento de ofício da capa e o ícone da
 * lombada, no traço dos oito livros da coleção. Cada livro é um módulo em scripts/desenho/livros/
 * (`<slug>.mjs`), escrito em geometria limpa (linhas, arcos, curvas, retângulos), na ordem de pintura;
 * este script passa a caneta (tremor suave, com semente tirada do slug, igual a cada vez), gera a
 * hachura e grava:
 *
 * - src/livros/desenhos/<slug>.svg: a parte clara da capa, viewBox 0 300 480 420. O objeto fica na
 *   área de x 36 a 444 e de y 384 a 678, apoiado na base. Traços de 1,8 (cz-w1, contorno), 1,2 (cz-w2,
 *   detalhe) e 0,7 (cz-w3, hachura e o bem fino); um único elemento fantasma (cz-gh, tracejado; ou
 *   cz-ghs, contínuo e fraco); pontos cheios em cz-fi; o que tapa o que fica atrás em var(--capa-papel).
 * - src/livros/icones/<slug>.svg: o ícone da lombada, 120 × 160, só com os traços principais (sem a
 *   hachura e sem o fantasma), a mesma geometria reduzida e com o tremor na escala do ícone;
 *   preenchimentos em var(--lombada-cor).
 *
 *   node scripts/desenho/livros.mjs <slug> [<slug>…]        (grava os dois arquivos de cada livro)
 *   node scripts/desenho/livros.mjs <slug> --ver [--cor #hex] [--tinta #hex]
 *                                          (grava e fotografa: .render/livros/<slug>.png, a capa
 *                                           e o ícone sobre a cor do livro, como no site)
 *
 * O módulo de cada livro:
 *
 *   export default {
 *     instrumento: "caixa de correio de coluna",
 *     desenho({ t, hachura, chao, ponto, cheio, linha, poli, curva, bezier, arco, elipse, circulo,
 *               retangulo, mover, juntar }) {
 *       t(retangulo(150, 420, 180, 250, 6), { papel: true });   // contorno (w1) que tapa o de trás
 *       t(linha([170, 470], [310, 470]), { w: 2 });              // detalhe
 *       hachura(retangulo(300, 420, 30, 250), { angulo: 60 });   // sombra (w3)
 *       t(arco([240, 400], 60, 30, 180, 360), { fantasma: true }); // o único fantasma
 *       chao(130, 350, 672);                                     // a sombra no chão
 *     },
 *   };
 *
 * `icone: false` num traço tira ele do ícone; `icone: true` põe no ícone um traço fino (w3) que faz
 * falta ao desenho pequeno. `soIcone: true` desenha só no ícone.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const pastaLivros = join(raiz, "scripts", "desenho", "livros");

// ---------- sorteio e ruído ----------

/** Sorteio com semente (mulberry32), para o tremor ser sempre o mesmo. */
function sorteio(semente) {
  let s = semente | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const sementeDe = (texto) => [...texto].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 17);
const rad = (g) => (g * Math.PI) / 180;
const distancia = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Ruído suave de 1 dimensão (valores sorteados a cada nó, interpolação de cosseno), periódico em `periodo` nós. */
function ruido(r, nos, periodo = 0) {
  const valores = Array.from({ length: nos + 2 }, () => r() * 2 - 1);
  return (s) => {
    const i = Math.floor(s);
    const f = s - i;
    const k = (j) => valores[periodo ? ((j % periodo) + periodo) % periodo : Math.min(Math.max(j, 0), valores.length - 1)];
    const m = (1 - Math.cos(f * Math.PI)) / 2;
    return k(i) * (1 - m) + k(i + 1) * m;
  };
}

// ---------- as formas (geometria limpa) ----------

/** Pontos ao longo de uma função t → [x, y], com um ponto a cada ~1 unidade. */
function amostrar(f, comprimentoAprox, passo = 1) {
  const n = Math.max(2, Math.ceil(comprimentoAprox / passo));
  return Array.from({ length: n + 1 }, (_, i) => f(i / n));
}

/** As formas: cada uma devolve { pts, fechada }. Ângulos em graus (0 = direita, 90 = embaixo, como no SVG). */
export const F = {
  linha: (a, b) => ({ pts: amostrar((t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], distancia(a, b)), fechada: false }),

  /** Linha quebrada pelos pontos dados (cantos vivos). */
  poli: (pontos, fechada = false) => {
    const lista = fechada ? [...pontos, pontos[0]] : pontos;
    const pts = [];
    for (let i = 0; i < lista.length - 1; i++) {
      const seg = F.linha(lista[i], lista[i + 1]).pts;
      pts.push(...(i ? seg.slice(1) : seg));
    }
    if (fechada) pts.pop();
    return { pts, fechada };
  },

  /** Arco de elipse de a0 a a1 graus, girado `giro` graus. */
  arco: (c, rx, ry, a0, a1, giro = 0) => {
    const g = rad(giro);
    const f = (t) => {
      const a = rad(a0 + (a1 - a0) * t);
      const x = rx * Math.cos(a);
      const y = ry * Math.sin(a);
      return [c[0] + x * Math.cos(g) - y * Math.sin(g), c[1] + x * Math.sin(g) + y * Math.cos(g)];
    };
    return { pts: amostrar(f, (Math.abs(a1 - a0) / 360) * 2 * Math.PI * Math.max(rx, ry)), fechada: false };
  },

  elipse: (c, rx, ry, giro = 0) => {
    const { pts } = F.arco(c, rx, ry, 0, 360, giro);
    pts.pop();
    return { pts, fechada: true };
  },

  circulo: (c, r) => F.elipse(c, r, r),

  /** Bézier cúbica. */
  bezier: (p0, p1, p2, p3) => {
    const f = (t) => {
      const u = 1 - t;
      return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
    };
    return { pts: amostrar(f, distancia(p0, p1) + distancia(p1, p2) + distancia(p2, p3)), fechada: false };
  },

  /** Curva suave passando pelos pontos (Catmull-Rom). */
  curva: (pontos, fechada = false) => {
    const p = pontos;
    const n = p.length;
    const pega = (i) => (fechada ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
    const pts = [];
    const segs = fechada ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const [a, b, c, d] = [pega(i - 1), pega(i), pega(i + 1), pega(i + 2)];
      const seg = F.bezier(b, [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6], [c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6], c).pts;
      pts.push(...(i ? seg.slice(1) : seg));
    }
    if (fechada) pts.pop();
    return { pts, fechada };
  },

  /** Retângulo (x, y, largura, altura), com cantos arredondados de raio r (0 = canto vivo). */
  retangulo: (x, y, w, h, r = 0) => {
    if (!r) return F.poli([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true);
    const pts = [
      ...F.linha([x + r, y], [x + w - r, y]).pts,
      ...F.arco([x + w - r, y + r], r, r, -90, 0).pts.slice(1),
      ...F.linha([x + w, y + r], [x + w, y + h - r]).pts.slice(1),
      ...F.arco([x + w - r, y + h - r], r, r, 0, 90).pts.slice(1),
      ...F.linha([x + w - r, y + h], [x + r, y + h]).pts.slice(1),
      ...F.arco([x + r, y + h - r], r, r, 90, 180).pts.slice(1),
      ...F.linha([x, y + h - r], [x, y + r]).pts.slice(1),
      ...F.arco([x + r, y + r], r, r, 180, 270).pts.slice(1, -1),
    ];
    return { pts, fechada: true };
  },

  /** Leva uma forma para outro lugar: escala, gira `giro` graus em volta de `centro` e desloca. */
  mover: (forma, { giro = 0, centro = [240, 530], dx = 0, dy = 0, escala = 1 } = {}) => {
    const g = rad(giro);
    const pts = forma.pts.map(([x, y]) => {
      const [u, v] = [(x - centro[0]) * escala, (y - centro[1]) * escala];
      return [centro[0] + u * Math.cos(g) - v * Math.sin(g) + dx, centro[1] + u * Math.sin(g) + v * Math.cos(g) + dy];
    });
    return { ...forma, pts };
  },

  /** Junta formas abertas, na ordem, numa forma só (fechada por padrão): o contorno de uma peça. */
  juntar: (formas, fechada = true) => {
    const pts = [];
    for (const f of formas) pts.push(...(pts.length ? f.pts.slice(1) : f.pts));
    if (fechada && pts.length > 2 && distancia(pts[0], pts.at(-1)) < 0.01) pts.pop();
    return { pts, fechada };
  },
};

// ---------- a caneta ----------

/** Passa a caneta: desloca cada ponto pela normal, com o ruído ao longo do comprimento. */
function tremer(forma, r, amplitude, passo) {
  const { pts, fechada } = forma;
  if (pts.length < 2 || amplitude === 0) return pts.map((p) => [...p]);
  const comp = [0];
  for (let i = 1; i < pts.length; i++) comp.push(comp[i - 1] + distancia(pts[i - 1], pts[i]));
  const total = comp.at(-1) + (fechada ? distancia(pts.at(-1), pts[0]) : 0) || 1;
  const nos = Math.max(2, Math.round(total / passo));
  const n = ruido(r, nos, fechada ? nos : 0);
  // Um nada de deslocamento no traço inteiro, como a mão que não volta exatamente ao mesmo lugar.
  const [dx, dy] = [(r() - 0.5) * amplitude, (r() - 0.5) * amplitude];
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const [tx, ty] = [b[0] - a[0], b[1] - a[1]];
    const l = Math.hypot(tx, ty) || 1;
    const d = n((comp[i] / total) * nos) * amplitude;
    return [p[0] - (ty / l) * d + dx, p[1] + (tx / l) * d + dy];
  });
}

/** Ramer–Douglas–Peucker, para o arquivo não levar pontos que não mudam o traço. */
function rdp(pontos, tolerancia) {
  if (pontos.length < 3) return pontos;
  const [x1, y1] = pontos[0];
  const [x2, y2] = pontos.at(-1);
  const [dx, dy] = [x2 - x1, y2 - y1];
  const n = Math.hypot(dx, dy);
  let maior = 0;
  let indice = 0;
  for (let i = 1; i < pontos.length - 1; i++) {
    const [x, y] = pontos[i];
    const d = n ? Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / n : Math.hypot(x - x1, y - y1);
    if (d > maior) [maior, indice] = [d, i];
  }
  if (maior <= tolerancia) return [pontos[0], pontos.at(-1)];
  return [...rdp(pontos.slice(0, indice + 1), tolerancia).slice(0, -1), ...rdp(pontos.slice(indice), tolerancia)];
}

const num = (v) => String(Math.round(v * 10) / 10);
const caminho = (pts, fechada) => `M${(fechada ? [...pts, pts[0]] : pts).map(([x, y]) => `${num(x)} ${num(y)}`).join(" L")}${fechada ? " Z" : ""}`;

// ---------- hachura ----------

/**
 * Linhas paralelas dentro de um polígono (regra par-ímpar, serve para côncavo), a `angulo` graus da
 * horizontal (positivo sobe para a direita, como a hachura dos livros), com `passo` entre elas.
 * Devolve uma lista de segmentos [[a, b], …].
 */
function linhasDaHachura(poligono, { angulo = 55, passo = 4.2, margem = 0.8 } = {}, r = Math.random) {
  const g = rad(angulo);
  // Gira o polígono para as linhas ficarem horizontais: a direção (cos g, −sin g) vira (1, 0).
  const [c, s] = [Math.cos(g), Math.sin(g)];
  const gira = ([x, y]) => [x * c - y * s, x * s + y * c];
  const volta = ([x, y]) => [x * c + y * s, -x * s + y * c];
  const p = poligono.map(gira);
  const ys = p.map((q) => q[1]);
  const [ymin, ymax] = [Math.min(...ys), Math.max(...ys)];
  const segmentos = [];
  for (let y = ymin + passo * (0.35 + r() * 0.3); y < ymax; y += passo) {
    const xs = [];
    for (let i = 0; i < p.length; i++) {
      const [a, b] = [p[i], p[(i + 1) % p.length]];
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
    }
    xs.sort((m, n) => m - n);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      // A mão não para exatamente na borda: um pouco antes ou um nada depois.
      const x0 = xs[i] + margem + (r() - 0.5) * 1.2;
      const x1 = xs[i + 1] - margem + (r() - 0.5) * 1.2;
      if (x1 - x0 > 1.6) segmentos.push([volta([x0, y]), volta([x1, y])]);
    }
  }
  return segmentos;
}

// ---------- o desenho ----------

const ESTILO_CAPA =
  "<style>.cz-ln{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}.cz-w1{stroke-width:1.8px}.cz-w2{stroke-width:1.2px}.cz-w3{stroke-width:.7px}.cz-gh{fill:none;stroke:currentColor;stroke-width:1.3px;stroke-linecap:round;stroke-dasharray:2.5 5.5;opacity:.8}.cz-ghs{fill:none;stroke:currentColor;stroke-width:1.1px;stroke-linecap:round;opacity:.8}.cz-fi{fill:currentColor;stroke:none}</style>";
const ESTILO_ICONE =
  "<style>.cz-ln{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}.cz-w1{stroke-width:1.3px}.cz-w2{stroke-width:.85px}.cz-w3{stroke-width:.7px}.cz-gh{fill:none;stroke:currentColor;stroke-width:1.3px;stroke-linecap:round;stroke-dasharray:2.5 5.5;opacity:.8}.cz-ghs{fill:none;stroke:currentColor;stroke-width:1.1px;stroke-linecap:round;opacity:.8}.cz-fi{fill:currentColor;stroke:none}</style>";

/** Tremor de cada espessura: amplitude e distância entre os nós do ruído (na unidade do desenho). */
const TREMOR_CAPA = { 1: [0.55, 24], 2: [0.42, 20], 3: [0.3, 16], gh: [0.4, 22] };
const TREMOR_ICONE = { 1: [0.4, 13], 2: [0.32, 11], 3: [0.24, 9], gh: [0.3, 12] };

/**
 * Roda o desenho do livro e devolve a lista de traços em geometria limpa:
 * { pts, fechada, classe ("cz-ln cz-w1" | … | "cz-gh" | "cz-ghs" | "cz-fi"), papel, w, icone, capa }.
 */
function tracosDo(slug, desenho) {
  const r = sorteio(sementeDe(`${slug}:hachura`));
  const tracos = [];
  let fantasmas = 0;

  const t = (forma, { w = 1, papel = false, fantasma = false, icone, soIcone = false } = {}) => {
    if (!forma?.pts?.length) throw new Error(`${slug}: traço sem pontos.`);
    let classe = `cz-ln cz-w${w}`;
    if (fantasma) {
      fantasmas++;
      classe = fantasma === "solido" ? "cz-ghs" : "cz-gh";
    }
    tracos.push({
      pts: forma.pts,
      fechada: forma.fechada,
      classe,
      w: fantasma ? "gh" : w,
      papel: papel && forma.fechada,
      capa: !soIcone,
      // No ícone: os traços principais (w1 e w2) e os preenchidos; nunca a hachura nem o fantasma.
      icone: soIcone || (icone ?? (!fantasma && w !== 3)),
    });
  };

  /** Hachura (w3) dentro de uma forma fechada ou de uma lista de pontos. */
  const hachura = (area, opcoes = {}) => {
    const poligono = Array.isArray(area) ? area : area.pts;
    for (const [a, b] of linhasDaHachura(poligono, opcoes, r)) t(F.linha(a, b), { w: opcoes.w ?? 3, icone: false });
  };

  /** A sombra no chão: uma faixa de hachura fina embaixo do objeto, de x0 a x1, a partir de y. */
  const chao = (x0, x1, y, { altura = 7, desvio = 4, angulo = 38, passo = 3.6 } = {}) => {
    hachura([[x0, y], [x1, y], [x1 + desvio, y + altura], [x0 + desvio, y + altura]], { angulo, passo, margem: 0.2 });
  };

  /** Ponto cheio (cz-fi): o pino, o furo, o olho de uma peça. */
  const ponto = (c, raio = 2) => tracos.push({ circulo: [c[0], c[1], raio], classe: "cz-fi", capa: true, icone: true });

  /** Forma cheia (cz-fi): o preto de uma peça pequena. */
  const cheio = (forma, { icone = true } = {}) =>
    tracos.push({ pts: forma.pts, fechada: true, classe: "cz-fi", w: 2, papel: false, capa: true, icone });

  desenho({ ...F, t, hachura, chao, ponto, cheio });
  if (fantasmas > 1) console.warn(`  aviso: ${slug} tem ${fantasmas} elementos fantasmas (a regra pede um só).`);
  return tracos;
}

/** Monta o SVG de um conjunto de traços já na escala final. */
function corpoSvg(tracos, { r, tremor, varPapel, quais }) {
  const saida = [];
  for (const tr of tracos) {
    if (!tr[quais]) continue;
    if (tr.circulo) {
      const [cx, cy, raio] = tr.circulo;
      saida.push({ html: `<circle class="cz-fi" cx="${num(cx)}" cy="${num(cy)}" r="${num(raio)}"></circle>` });
      continue;
    }
    const [amp, passo] = tremor[tr.w] ?? tremor[2];
    const pts = rdp(tremer(tr, r, amp, passo), 0.08);
    const d = caminho(pts, tr.fechada);
    if (tr.classe === "cz-fi") {
      saida.push({ html: `<path class="cz-fi" d="${d}"></path>` });
      continue;
    }
    const anterior = saida.at(-1);
    // Traços seguidos da mesma classe, sem preenchimento, viram um caminho só.
    if (anterior?.classe === tr.classe && !anterior.papel && !tr.papel) anterior.d += ` ${d}`;
    else saida.push({ classe: tr.classe, d, papel: tr.papel });
  }
  return saida
    .map((s) => s.html ?? `<path class="${s.classe}" d="${s.d}"${s.papel ? ` style="fill: var(${varPapel})"` : ""}></path>`)
    .join("");
}

/** Caixa de todos os pontos dos traços escolhidos. */
function caixa(tracos, quais) {
  const xs = [];
  const ys = [];
  for (const tr of tracos) {
    if (!tr[quais]) continue;
    if (tr.circulo) {
      const [cx, cy, raio] = tr.circulo;
      xs.push(cx - raio, cx + raio);
      ys.push(cy - raio, cy + raio);
    } else for (const [x, y] of tr.pts) xs.push(x), ys.push(y);
  }
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

/** O desenho da capa e o ícone da lombada de um livro. */
export function desenharLivro(slug, { instrumento, desenho, titulo = slug }) {
  const tracos = tracosDo(slug, desenho);

  const [x0, y0, x1, y1] = caixa(tracos, "capa");
  const avisos = [];
  if (x0 < 30 || x1 > 450) avisos.push(`sai da área na horizontal (x de ${num(x0)} a ${num(x1)}; o alvo é de 36 a 444)`);
  if (y0 < 378 || y1 > 690) avisos.push(`sai da área na vertical (y de ${num(y0)} a ${num(y1)}; o alvo é de 384 a 678, mais a sombra no chão)`);

  const capa =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 300 480 420" width="480" height="420" aria-hidden="true">` +
    `<!-- ${titulo}: ${instrumento}. Parte clara da capa (y 300 a 720). Traço em currentColor (destaque); preenchimentos em var(--capa-papel). Gerado por scripts/desenho/livros.mjs; não edite à mão. -->` +
    ESTILO_CAPA +
    corpoSvg(tracos, { r: sorteio(sementeDe(slug)), tremor: TREMOR_CAPA, varPapel: "--capa-papel", quais: "capa" }) +
    `</svg>\n`;

  // O ícone: a mesma geometria, reduzida para caber em 120 × 160 (com folga), e o tremor na escala dele.
  const [i0, j0, i1, j1] = caixa(tracos, "icone");
  const escala = Math.min(96 / (i1 - i0), 132 / (j1 - j0));
  const [cx, cy] = [(i0 + i1) / 2, (j0 + j1) / 2];
  const leva = ([x, y]) => [60 + (x - cx) * escala, 80 + (y - cy) * escala];
  const reduzidos = tracos
    .filter((tr) => tr.icone)
    .map((tr) =>
      tr.circulo
        ? { ...tr, circulo: [...leva(tr.circulo), Math.max(0.9, tr.circulo[2] * escala)] }
        : { ...tr, pts: tr.pts.map(leva) },
    );
  const icone =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" width="120" height="160" aria-hidden="true">` +
    `<!-- Ícone da lombada: ${instrumento}. Em pé na lombada vertical ele gira 90° no sentido horário; na lombada deitada fica sem giro. Gerado por scripts/desenho/livros.mjs; não edite à mão. -->` +
    ESTILO_ICONE +
    corpoSvg(reduzidos, { r: sorteio(sementeDe(`${slug}:icone`)), tremor: TREMOR_ICONE, varPapel: "--lombada-cor", quais: "icone" }) +
    `</svg>\n`;

  return { capa, icone, avisos };
}

// ---------- conferência ----------

/** Cor do texto e do desenho sobre a cor do livro (a mesma regra de src/livros/cores.js). */
async function tintaDe(cor) {
  const { coresDoLivro } = await import(pathToFileURL(join(raiz, "src", "livros", "cores.js")).href);
  return coresDoLivro(cor);
}

/** Fotografa a capa (a parte de baixo, na cor do livro, como no site) e o ícone, lado a lado. */
async function fotografar(slug, capa, icone, cor) {
  const { chromium } = await import(pathToFileURL(join(raiz, "node_modules", "playwright-core", "index.mjs")).href);
  const { tinta, destaque } = await tintaDe(cor);
  const caminhos = [process.env.CHROME_PATH, "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter((c) => c && existsSync(c));
  const navegador = await chromium.launch(caminhos.length ? { executablePath: caminhos[0] } : { channel: "chrome" });
  const pagina = await navegador.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
  const semRaiz = (svg) => svg.replace(/ width="\d+" height="\d+"/, "");
  await pagina.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#e9e6de;font:14px system-ui;display:flex;gap:24px;padding:24px;align-items:flex-start}
    .capa{width:960px;height:840px;background:${cor};color:${tinta};--capa-papel:${cor}}
    .papel{width:480px;height:420px;background:#f2ede2;color:${destaque};--capa-papel:#f2ede2}
    .icone{width:240px;height:320px;background:${cor};color:${tinta};--lombada-cor:${cor};border-radius:6px}
    .pilha{display:flex;flex-direction:column;gap:24px}
    svg{display:block;width:100%;height:100%}
  </style><div class="capa">${semRaiz(capa)}</div><div class="pilha"><div class="papel">${semRaiz(capa)}</div><div class="icone">${semRaiz(icone)}</div></div>`);
  const pasta = join(raiz, ".render", "livros");
  mkdirSync(pasta, { recursive: true });
  const arquivo = join(pasta, `${slug}.png`);
  await pagina.screenshot({ path: arquivo, fullPage: true });
  await navegador.close();
  return arquivo;
}

// ---------- gravar ----------

const argumentos = process.argv.slice(2);
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ver = argumentos.includes("--ver");
  const opcao = (nome) => {
    const i = argumentos.indexOf(nome);
    return i >= 0 ? argumentos[i + 1] : undefined;
  };
  const cor = opcao("--cor") ?? "#465976";
  const slugs = argumentos.filter((a, i) => !a.startsWith("--") && !["--cor", "--tinta"].includes(argumentos[i - 1]));
  if (!slugs.length) {
    console.error("Uso: node scripts/desenho/livros.mjs <slug> [<slug>…] [--ver] [--cor #hex]");
    process.exit(1);
  }
  for (const slug of slugs) {
    const arquivo = join(pastaLivros, `${slug}.mjs`);
    if (!existsSync(arquivo)) {
      console.error(`Falta scripts/desenho/livros/${slug}.mjs`);
      process.exitCode = 1;
      continue;
    }
    const modulo = (await import(`${pathToFileURL(arquivo).href}?v=${Date.now()}`)).default;
    const { capa, icone, avisos } = desenharLivro(slug, modulo);
    writeFileSync(join(raiz, "src", "livros", "desenhos", `${slug}.svg`), capa);
    writeFileSync(join(raiz, "src", "livros", "icones", `${slug}.svg`), icone);
    console.log(`${slug}: desenho ${(capa.length / 1024).toFixed(1)} KB, ícone ${(icone.length / 1024).toFixed(1)} KB`);
    for (const a of avisos) console.warn(`  aviso: ${a}`);
    if (ver) console.log(`  foto: ${await fotografar(slug, capa, icone, modulo.cor ?? cor)}`);
  }
}
