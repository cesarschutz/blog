#!/usr/bin/env node
/**
 * Ícones das tags (D52, B11): um desenho por tag, no traço dos ícones das lombadas
 * (src/livros/icones/): caneta com leve tremor, duas espessuras (cz-w1 no contorno, cz-w2 nos
 * detalhes, cz-w3 no que é bem fino), pontas redondas, um preenchimento de papel (`--tag-papel`) que
 * tapa o que fica atrás e, se for o caso, um único elemento fantasma tracejado (cz-gh). Só
 * currentColor e variáveis: sem cor fixa, sem id e sem defs. Nada de logotipo de marca: cada tag é
 * uma metáfora num objeto de ofício (a folha para Spring, a nuvem para AWS, o leme para Kubernetes).
 *
 * Cada ícone é escrito aqui em geometria limpa (linhas, arcos, curvas), numa caixa de 120 × 120, com
 * o desenho entre 14 e 106 mais ou menos; o script passa a caneta (o tremor vem de um ruído suave,
 * com semente tirada do nome, igual a cada vez) e grava src/livros/tags/<slug>.svg. Tag nova: um
 * desenho novo em DESENHOS, `node scripts/desenho/tags.mjs <slug>` e a conferência em /amostra/tags/
 * (regra em docs/capas/CAPAS.md, "Tags novas").
 *
 *   node scripts/desenho/tags.mjs            (todas)
 *   node scripts/desenho/tags.mjs spring aws (só estas)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pasta = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "livros", "tags");

/** O slug do arquivo a partir do nome da tag: sem acento, minúsculo, com hífen ("Banco de Dados" → "banco-de-dados"). */
export const slugDaTag = (nome) =>
  nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ---------- a caneta: pontos, tremor e saída ----------

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
const sementeDe = (texto) => [...texto].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 11);
const rad = (g) => (g * Math.PI) / 180;

/** Pontos ao longo de uma função t → [x, y], com um ponto a cada ~0,8 unidade. */
function amostrar(f, comprimentoAprox) {
  const n = Math.max(2, Math.ceil(comprimentoAprox / 0.8));
  return Array.from({ length: n + 1 }, (_, i) => f(i / n));
}

const distancia = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** As formas: cada uma devolve { pts, fechada }. */
const F = {
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
  /** Arco de elipse, em graus (0 = direita, 90 = embaixo, como no SVG), girado `giro` graus. */
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
  /** Retângulo de cantos arredondados (r = 0 para canto vivo). */
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
  /** Leva uma forma para outro lugar: gira `giro` graus em volta de `centro` e desloca. */
  mover: (forma, { giro = 0, centro = [60, 60], dx = 0, dy = 0 } = {}) => {
    const g = rad(giro);
    const pts = forma.pts.map(([x, y]) => {
      const [u, v] = [x - centro[0], y - centro[1]];
      return [centro[0] + u * Math.cos(g) - v * Math.sin(g) + dx, centro[1] + u * Math.sin(g) + v * Math.cos(g) + dy];
    });
    return { ...forma, pts };
  },
};

/** Ruído suave de 1 dimensão (valores sorteados a cada nó, interpolação de cosseno), periódico em `periodo` nós. */
function ruido(r, nos, periodo = 0) {
  const valores = Array.from({ length: nos + 2 }, () => r() * 2 - 1);
  return (s) => {
    const i = Math.floor(s);
    const f = s - i;
    const k = (j) => valores[periodo ? ((j % periodo) + periodo) % periodo : Math.min(j, valores.length - 1)];
    const m = (1 - Math.cos(f * Math.PI)) / 2;
    return k(i) * (1 - m) + k(i + 1) * m;
  };
}

/** Passa a caneta: desloca cada ponto pela normal, com o ruído ao longo do comprimento. */
function tremer(forma, r, amplitude = 0.42, passo = 13) {
  const { pts, fechada } = forma;
  const comp = [0];
  for (let i = 1; i < pts.length; i++) comp.push(comp[i - 1] + distancia(pts[i - 1], pts[i]));
  const total = comp.at(-1) + (fechada ? distancia(pts.at(-1), pts[0]) : 0);
  const nos = Math.max(2, Math.round(total / passo));
  const n = ruido(r, nos, fechada ? nos : 0);
  // Um nada de deslocamento no traço inteiro, como a mão que não volta exatamente ao mesmo lugar.
  const [dx, dy] = [(r() - 0.5) * 0.5, (r() - 0.5) * 0.5];
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

/**
 * Um desenho: a lista de traços, na ordem de pintura (o preenchido tapa o que veio antes).
 * `t(forma, { w, papel, fantasma })`: w 1 (contorno), 2 (detalhe) ou 3 (bem fino); papel: preenche
 * com --tag-papel; fantasma: tracejado (um só por desenho).
 */
function desenhar(nome, desenho) {
  const r = sorteio(sementeDe(nome));
  const tracos = [];
  const t = (forma, { w = 1, papel = false, fantasma = false } = {}) => {
    const pts = rdp(tremer(forma, r, w === 1 ? 0.42 : w === 2 ? 0.34 : 0.26), 0.09);
    const lista = forma.fechada ? [...pts, pts[0]] : pts;
    const d = `M${lista.map(([x, y]) => `${num(x)} ${num(y)}`).join(" L")}${forma.fechada ? " Z" : ""}`;
    tracos.push({ d, classe: fantasma ? "cz-gh" : `cz-ln cz-w${w}`, papel: papel && forma.fechada });
  };
  desenho({ ...F, t });
  // Traços seguidos da mesma espessura, sem preenchimento, viram um caminho só.
  const saida = [];
  for (const tr of tracos) {
    const anterior = saida.at(-1);
    if (anterior && !anterior.papel && !tr.papel && anterior.classe === tr.classe) anterior.d += ` ${tr.d}`;
    else saida.push({ ...tr });
  }
  return saida
    .map((tr) => `<path class="${tr.classe}" d="${tr.d}"${tr.papel ? ' style="fill: var(--tag-papel)"' : ""}></path>`)
    .join("");
}

const ESTILO =
  "<style>.cz-ln{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}.cz-w1{stroke-width:1.3px}.cz-w2{stroke-width:.85px}.cz-w3{stroke-width:.7px}.cz-gh{fill:none;stroke:currentColor;stroke-width:1.3px;stroke-linecap:round;stroke-dasharray:2.5 5.5;opacity:.8}</style>";

// ---------- os desenhos (caixa de 120 × 120) ----------

/** Folha: da base à ponta, com a largura dada, curvada para o lado `lado` (1 ou −1). */
function folha({ bezier, t }, base, ponta, largura, lado = 1) {
  const [dx, dy] = [ponta[0] - base[0], ponta[1] - base[1]];
  const l = Math.hypot(dx, dy);
  const [nx, ny] = [-dy / l, dx / l];
  const p = (k, w) => [base[0] + dx * k + nx * w, base[1] + dy * k + ny * w];
  const contorno = {
    pts: [
      ...bezier(base, p(0.25, largura * lado), p(0.7, largura * 0.9 * lado), ponta).pts,
      ...bezier(ponta, p(0.72, -largura * 0.55 * lado), p(0.3, -largura * 0.6 * lado), base).pts.slice(1, -1),
    ],
    fechada: true,
  };
  t(contorno, { papel: true });
  t(bezier(p(0.08, 0), p(0.4, largura * 0.12 * lado), p(0.7, largura * 0.14 * lado), p(0.9, 0)), { w: 2 });
}

export const DESENHOS = {
  /** Spring: um broto com duas folhas saindo da terra (a primavera do nome, sem o logotipo). */
  Spring: {
    o: "broto com duas folhas",
    d(f) {
      const { t, curva } = f;
      t(curva([[34, 101], [46, 97.5], [60, 96.8], [74, 97.5], [86, 101]]));
      t(curva([[60, 97], [58.6, 84], [60.2, 70], [61.8, 58], [61, 44]]));
      folha(f, [59.6, 80], [24, 58], 12, -1);
      folha(f, [61.2, 64], [98, 38], 14, 1);
      folha(f, [61, 46], [66, 18], 6, 1);
      t(f.linha([46, 101.8], [49, 104.5]), { w: 2 });
      t(f.linha([70, 102], [73.5, 104.2]), { w: 2 });
    },
  },

  /** JVM: o moedor de café de manivela (a máquina que mói o grão). */
  JVM: {
    o: "moedor de café de manivela",
    d({ t, retangulo, curva, linha, circulo, elipse, poli }) {
      t(retangulo(33, 62, 54, 42, 2), { papel: true });
      t(linha([33, 68], [87, 68]), { w: 2 });
      t(retangulo(43, 78, 34, 17, 1.5), { papel: true, w: 2 });
      t(circulo([60, 86.5], 2.4), { w: 2 });
      t(poli([[36, 62], [44, 51], [76, 51], [84, 62]]), { w: 1 });
      t(elipse([60, 51], 16, 3.6), { papel: true, w: 2 });
      t(linha([60, 51], [60, 33]));
      t(curva([[60, 33], [72, 30.5], [84, 29], [92, 30]]));
      t(retangulo(88.5, 14, 7, 16, 3.5), { papel: true });
      t(circulo([60, 33], 2.6), { papel: true, w: 2 });
      t(linha([40, 99.5], [80, 99.5]), { w: 3 });
    },
  },

  /** LTS: a âncora (o que segura por muito tempo). */
  LTS: {
    o: "âncora",
    d({ t, circulo, retangulo, arco, poli }) {
      t(arco([60, 64], 33, 33, 18, 162));
      t(poli([[86.2, 72.6], [95.4, 61.8], [96.6, 76.4]], true), { papel: true, w: 2 });
      t(poli([[33.8, 72.6], [24.6, 61.8], [23.4, 76.4]], true), { papel: true, w: 2 });
      t(retangulo(57, 30, 6, 67, 3), { papel: true });
      t(retangulo(40, 37, 40, 6.5, 3.25), { papel: true });
      t(circulo([60, 23], 7));
      t(circulo([60, 97.5], 3.2), { papel: true, w: 2 });
    },
  },

  /** Concorrência: o semáforo da ferrovia, que deixa um trem passar de cada vez (Dijkstra). */
  "Concorrência": {
    o: "semáforo de ferrovia",
    d({ t, retangulo, linha, circulo, mover, poli }) {
      t(poli([[40, 106], [80, 106]]));
      t(retangulo(50, 99, 20, 7, 1), { papel: true });
      t(retangulo(56.5, 26, 7, 74, 1.5), { papel: true });
      t(poli([[54, 26], [66, 26], [60, 19]], true), { papel: true, w: 2 });
      const braco = mover(retangulo(60, 36, 38, 8, 1), { giro: -32, centro: [60, 40] });
      t(braco, { papel: true });
      t(mover(linha([86, 36], [86, 44]), { giro: -32, centro: [60, 40] }), { w: 2 });
      t(mover(linha([91, 36], [91, 44]), { giro: -32, centro: [60, 40] }), { w: 2 });
      t(retangulo(40, 38, 13, 26, 5), { papel: true });
      t(circulo([46.5, 45], 3.6), { w: 2 });
      t(circulo([46.5, 57], 3.6), { w: 2 });
      t(circulo([60, 40], 2.2), { papel: true, w: 2 });
    },
  },

  /** Virtual Threads: o carretel de linha, com a linha que desce até a agulha (os fios leves). */
  "Virtual Threads": {
    o: "carretel de linha com agulha",
    d({ t, elipse, arco, retangulo, curva, poli, mover }) {
      t(elipse([52, 90], 22, 6), { papel: true });
      t(retangulo(36, 36, 32, 54, 0), { papel: true });
      for (const y of [44, 50.5, 57, 63.5, 70, 76.5, 83]) t(arco([52, y - 4], 16, 4, 20, 160), { w: 2 });
      t(elipse([52, 34], 22, 6), { papel: true });
      t(elipse([52, 34], 5, 1.5), { w: 2 });
      t(curva([[67.6, 62], [80, 66], [88, 76], [87, 88], [84, 96]]), { w: 2 });
      const agulha = mover(
        { pts: [...poli([[76, 104], [80.5, 70], [82.5, 70], [79.5, 104]], true).pts], fechada: true },
        { giro: 28, centro: [80, 88] },
      );
      t(agulha, { papel: true, w: 2 });
      t(mover(elipse([81.5, 74], 0.7, 2.4), { giro: 28, centro: [80, 88] }), { w: 3 });
    },
  },

  /** Trade-offs: a balança de pratos, um lado mais pesado que o outro. */
  "Trade-offs": {
    o: "balança de pratos desequilibrada",
    d({ t, linha, retangulo, arco, circulo, poli, mover }) {
      t(retangulo(44, 96, 32, 7, 2), { papel: true });
      t(poli([[52, 96], [56.5, 89], [63.5, 89], [68, 96]]), { w: 2 });
      t(retangulo(57.5, 28, 5, 61, 1.5), { papel: true });
      const giro = -7;
      const viga = mover(retangulo(20, 31.5, 80, 5, 2.5), { giro, centro: [60, 34] });
      t(viga, { papel: true });
      const [e, d] = [mover({ pts: [[23, 34]] }, { giro, centro: [60, 34] }).pts[0], mover({ pts: [[97, 34]] }, { giro, centro: [60, 34] }).pts[0]];
      t(linha(e, [e[0] - 11, 74]), { w: 2 });
      t(linha(e, [e[0] + 11, 74]), { w: 2 });
      t(linha(d, [d[0] - 11, 64]), { w: 2 });
      t(linha(d, [d[0] + 11, 64]), { w: 2 });
      t({ pts: [...arco([e[0], 74], 14, 7, 0, 180).pts], fechada: true }, { papel: true });
      t({ pts: [...arco([d[0], 64], 14, 7, 0, 180).pts], fechada: true }, { papel: true });
      t(retangulo(e[0] - 6, 66.5, 12, 7.5, 1.2), { papel: true, w: 2 });
      t(circulo([60, 24], 3.6), { papel: true, w: 2 });
    },
  },

  /** Linguagem: a pena molhada no tinteiro. */
  Linguagem: {
    o: "pena no tinteiro",
    d({ t, retangulo, elipse, curva, linha, bezier }) {
      t({ pts: curva([[35, 103], [34, 88], [40, 80], [52, 76.5], [68, 76.5], [80, 80], [86, 88], [85, 103]]).pts, fechada: true }, { papel: true });
      t(linha([41, 90], [79, 90]), { w: 3 });
      t(bezier([59, 74], [66, 58], [74, 44], [84, 30]), { w: 2 });
      t(retangulo(51, 68, 18, 9, 1.5), { papel: true });
      t(elipse([60, 68], 9, 2.2), { papel: true, w: 2 });
      t(bezier([60.5, 68], [64, 62], [66, 58], [68, 55]), { w: 2 });
      const pena = {
        pts: [
          ...bezier([66, 56], [64, 40], [80, 20], [101, 12]).pts,
          ...bezier([101, 12], [98, 30], [86, 50], [70, 58]).pts.slice(1, -1),
        ],
        fechada: true,
      };
      t(pena, { papel: true });
      t(bezier([67, 58], [74, 46], [86, 30], [100, 13]), { w: 2 });
      for (const [a, b] of [[[74, 45], [70, 38]], [[80, 36.5], [77, 29]], [[86, 29], [84, 22]], [[78, 44], [84, 45]], [[84, 36], [91, 36]], [[90, 29], [96, 27.5]]]) t(linha(a, b), { w: 3 });
    },
  },

  /** Pagamentos: a pilha de moedas e uma moeda de pé. */
  Pagamentos: {
    o: "pilha de moedas",
    d({ t, elipse, arco, linha, circulo, poli }) {
      const moeda = (cx, y) => {
        const lado = {
          pts: [...arco([cx, y], 21, 5.5, 0, 180).pts, [cx - 21, y - 6], ...arco([cx, y - 6], 21, 5.5, 180, 360).pts, [cx + 21, y]],
          fechada: true,
        };
        t(lado, { papel: true });
        t(arco([cx, y - 6], 21, 5.5, 0, 180), { w: 2 });
      };
      moeda(47, 100);
      moeda(49, 92);
      moeda(46.5, 84);
      moeda(48.5, 76);
      t(elipse([48.5, 70], 21, 5.5), { papel: true });
      t(elipse([48.5, 70], 14, 3.4), { w: 2 });
      t(circulo([87, 82], 15), { papel: true });
      t(circulo([87, 82], 10.5), { w: 2 });
      t(poli([[84.3, 78.6], [88, 75.8], [88, 88.4]]), { w: 2 });
      t(linha([84.8, 88.4], [91.2, 88.4]), { w: 2 });
      t(linha([70, 100.5], [102, 100.5]), { w: 3 });
    },
  },

  /** Mensageria: a caixa de correio com a bandeirinha levantada e a carta esperando. */
  Mensageria: {
    o: "caixa de correio com a bandeira levantada",
    d({ t, retangulo, linha, poli, arco }) {
      t(linha([38, 106], [84, 106]));
      t(retangulo(55, 70, 9, 36, 1), { papel: true });
      const caixa = {
        pts: [...poli([[28, 72], [28, 56]]).pts, ...arco([42, 56], 14, 14, 180, 270).pts.slice(1), ...linha([42, 42], [78, 42]).pts.slice(1), ...arco([78, 56], 14, 14, 270, 360).pts.slice(1), ...linha([92, 56], [92, 72]).pts.slice(1)],
        fechada: true,
      };
      t(caixa, { papel: true });
      t(linha([35, 44.5], [35, 72]), { w: 2 });
      t(retangulo(29.5, 55, 3.5, 7, 1), { w: 2 });
      t(retangulo(84, 26, 3.5, 34, 1), { papel: true, w: 2 });
      t(poli([[87.5, 27], [102, 27], [102, 36], [87.5, 36]], true), { papel: true, w: 2 });
      const carta = { pts: poli([[14, 48], [34, 44.5], [36.5, 57], [16.5, 60.5]], true).pts, fechada: true };
      t(carta, { papel: true, w: 2 });
      t(poli([[14.3, 48.3], [26, 54], [34.3, 44.8]]), { w: 3 });
    },
  },

  /** Logs: o rolo de papel com as linhas do registro, a hora e a mensagem. */
  Logs: {
    o: "rolo de papel com as linhas do registro",
    d({ t, retangulo, elipse, curva, linha, arco }) {
      const papel = { pts: [...curva([[33, 30], [34, 60], [32, 92]]).pts, ...curva([[32, 92], [60, 93], [88, 92]]).pts.slice(1), ...curva([[88, 92], [86, 60], [87, 30]]).pts.slice(1), ...linha([87, 30], [33, 30]).pts.slice(1, -1)], fechada: true };
      t(papel, { papel: true });
      const linhas = [[46, 84], [46, 76], [46, 80], [46, 72], [46, 82], [46, 68]];
      linhas.forEach(([h, fim], i) => {
        const y = 41 + i * 8.2;
        t(linha([39, y], [h, y]), { w: 2 });
        t(linha([h + 4, y], [fim, y]), { w: 3 });
      });
      t(retangulo(26, 22, 68, 11, 5.5), { papel: true });
      t(elipse([26.5, 27.5], 2.2, 5.5), { w: 2 });
      t(elipse([93.5, 27.5], 2.2, 5.5), { w: 2 });
      const rolo = { pts: [...curva([[30, 92], [45, 90], [75, 90], [90, 92]]).pts, ...arco([90, 97.5], 5, 5.5, -90, 90).pts.slice(1), ...linha([90, 103], [30, 103]).pts.slice(1), ...arco([30, 97.5], 5, 5.5, 90, 270).pts.slice(1, -1)], fechada: true };
      t(rolo, { papel: true });
      t(arco([30, 97.5], 2.4, 3.2, -90, 180), { w: 2 });
    },
  },

  /** Kubernetes: o leme do navio (o timoneiro do nome), com oito raios. */
  Kubernetes: {
    o: "leme de navio",
    d({ t, circulo, linha, retangulo, mover }) {
      const c = [60, 60];
      for (let i = 0; i < 8; i++) {
        const a = rad(i * 45 + 22.5);
        const pega = mover(retangulo(58.5, 14, 3.4, 13, 1.7), { giro: i * 45 + 22.5 + 90, centro: c });
        t(pega, { papel: true, w: 1 });
        t(linha([c[0] + Math.cos(a) * 7, c[1] + Math.sin(a) * 7], [c[0] + Math.cos(a) * 33, c[1] + Math.sin(a) * 33]), { w: 1 });
      }
      t(circulo(c, 29), {});
      t(circulo(c, 23.5), { w: 2 });
      t(circulo(c, 8), { papel: true });
      t(circulo(c, 3), { w: 2 });
    },
  },

  /** Banco de Dados: o barril de aduelas e aros (o velho cilindro de guardar dados). */
  "Banco de Dados": {
    o: "barril",
    d({ t, curva, elipse, arco }) {
      const corpo = { pts: [...curva([[38, 26], [32.5, 62], [38, 98]]).pts, ...arco([60, 98], 22, 5.5, 180, 0).pts.slice(1), ...curva([[82, 98], [87.5, 62], [82, 26]]).pts.slice(1, -1)], fechada: true };
      t(corpo, { papel: true });
      for (const [y, rx] of [[38, 24.6], [45, 25.5], [79, 25.5], [86, 24.6]]) t(arco([60, y], rx, 5.5, 5, 175), {});
      for (const x of [48, 60, 72]) t(curva([[x, 32], [x + (x - 60) * 0.14, 62], [x, 102]]), { w: 3 });
      t(elipse([60, 26], 22, 5.5), { papel: true });
      t(elipse([60, 26], 17.5, 3.8), { w: 2 });
    },
  },

  /** Migração: a mala de viagem com as correias e os cantos de metal. */
  "Migração": {
    o: "mala de viagem",
    d({ t, retangulo, linha }) {
      t(retangulo(46, 30, 28, 18, 7));
      t(retangulo(22, 44, 76, 56, 6), { papel: true });
      t(retangulo(50.5, 34.5, 19, 9.5, 4.5), { w: 2 });
      for (const x of [38, 78]) {
        t(linha([x, 44.5], [x, 99.5]), { w: 2 });
        t(linha([x + 5, 44.5], [x + 5, 99.5]), { w: 2 });
        t(retangulo(x - 1.5, 62, 8, 7, 1), { papel: true, w: 2 });
      }
      t(linha([22.5, 58], [97.5, 58]), { w: 3 });
    },
  },

  /** Criptografia: o cadeado de segredo, com o disco de números no corpo. */
  Criptografia: {
    o: "cadeado de segredo com disco",
    d({ t, retangulo, arco, linha, circulo }) {
      const alca = { pts: [...linha([42, 58], [42, 38]).pts, ...arco([60, 38], 18, 18, 180, 360).pts.slice(1), ...linha([78, 38], [78, 58]).pts.slice(1)], fechada: false };
      t(alca, {});
      const dentro = { pts: [...linha([49, 58], [49, 38.5]).pts, ...arco([60, 38.5], 11, 11, 180, 360).pts.slice(1), ...linha([71, 38.5], [71, 58]).pts.slice(1)], fechada: false };
      t(dentro, { w: 2 });
      t(retangulo(28, 54, 64, 50, 7), { papel: true });
      t(circulo([60, 79], 16), { papel: true, w: 1 });
      for (let i = 0; i < 20; i++) {
        const a = rad(i * 18 - 90);
        const r0 = i % 5 === 0 ? 10.5 : 12.6;
        t(linha([60 + Math.cos(a) * r0, 79 + Math.sin(a) * r0], [60 + Math.cos(a) * 15, 79 + Math.sin(a) * 15]), { w: 3 });
      }
      t(circulo([60, 79], 5.5), { papel: true, w: 2 });
      t(linha([60, 79], [63.6, 75.2]), { w: 2 });
      t(linha([57, 59.5], [63, 59.5]), { w: 2 });
    },
  },

  /** Microsserviços: os favos, cada célula a sua, e uma ainda por fazer (fantasma). */
  "Microsserviços": {
    o: "favos de mel",
    d({ t, poli }) {
      const r = 13;
      const hex = ([cx, cy]) => poli(Array.from({ length: 6 }, (_, i) => [cx + r * Math.cos(rad(60 * i - 90)), cy + r * Math.sin(rad(60 * i - 90))]), true);
      const w = Math.sqrt(3) * (r + 1.2);
      const dy = 1.5 * (r + 1.2);
      const cheios = [[60 - w / 2, 60 - dy], [60 + w / 2, 60 - dy], [60 - w, 60], [60, 60], [60 + w, 60], [60 - w / 2, 60 + dy]];
      for (const c of cheios) t(hex(c), { papel: true });
      t(hex([60 + w / 2, 60 + dy]), { fantasma: true });
    },
  },

  /** Idempotência: a chave antiga com a etiqueta amarrada (a chave de idempotência). */
  "Idempotência": {
    o: "chave antiga com etiqueta",
    d({ t, circulo, retangulo, linha, poli, curva, mover }) {
      const g = { giro: 45, centro: [60, 60] };
      t(mover(retangulo(30, 57, 58, 6, 3), g), { papel: true });
      t(mover(poli([[74, 63], [74, 73], [79, 73], [79, 68], [83, 68], [83, 73], [87, 73], [87, 63]], true), g), { papel: true });
      t(mover(circulo([22, 60], 12), g), { papel: true });
      t(mover(circulo([22, 60], 5.5), g), { w: 2 });
      t(mover(linha([34, 57], [34, 63]), g), { w: 2 });
      t(curva([[38, 38], [52, 30], [62, 30.5], [70, 34]]), { w: 2 });
      const etiqueta = mover(poli([[70, 30], [80, 25], [102, 38], [96, 50], [74, 42]], true), { giro: 0, centro: [60, 60] });
      t(etiqueta, { papel: true });
      t(circulo([76.5, 33], 1.8), { w: 2 });
      t(linha([83, 38], [95, 44.5]), { w: 3 });
    },
  },

  /** Gradle: a bigorna e o martelo (onde a peça se forja), com as faíscas. */
  Gradle: {
    o: "bigorna e martelo",
    d({ t, poli, curva, retangulo, linha, mover }) {
      const bigorna = {
        pts: [
          ...poli([[36, 64], [99, 64], [99, 73], [85, 75]]).pts,
          ...curva([[85, 75], [78, 80], [77, 88]]).pts.slice(1),
          ...poli([[77, 88], [88, 97], [88, 104], [34, 104], [34, 97], [45, 88]]).pts.slice(1),
          ...curva([[45, 88], [44, 80], [38, 75]]).pts.slice(1),
          ...curva([[38, 75], [27, 72], [14, 65.5], [36, 64]]).pts.slice(1, -1),
        ],
        fechada: true,
      };
      t(bigorna, { papel: true });
      t(linha([38, 68], [97, 68]), { w: 3 });
      t(linha([40, 97], [82, 97]), { w: 2 });
      const g = { giro: -32, centro: [62, 46] };
      t(mover(retangulo(64, 44, 42, 5, 2.5), g), { papel: true });
      t(mover(retangulo(50, 36, 14, 22, 2), g), { papel: true });
      t(mover(linha([50.5, 41], [63.5, 41]), g), { w: 3 });
      for (const [a, b] of [[[50, 60], [44, 55]], [[47, 63.5], [38, 62]], [[55, 57.5], [53.5, 50.5]]]) t(linha(a, b), { w: 2 });
    },
  },

  /** AWS: a nuvem, com outra menor atrás. */
  AWS: {
    o: "nuvem",
    d({ t, curva, arco, linha }) {
      const nuvem = (pts) => ({ pts: curva(pts, true).pts, fechada: true });
      t(nuvem([[72, 48], [78, 37], [90, 34], [99, 41], [103, 51], [95, 58], [78, 58]]), { papel: true, w: 2 });
      const principal = {
        pts: [
          ...arco([31, 76], 12, 12, 90, 250).pts,
          ...arco([50, 61], 16, 16, 205, 320).pts.slice(1),
          ...arco([73, 61], 19, 19, 235, 355).pts.slice(1),
          ...arco([91, 76], 13, 13, 270, 450).pts.slice(1),
          ...linha([91, 89], [31, 88]).pts.slice(1, -1),
        ],
        fechada: true,
      };
      t(principal, { papel: true });
      t(arco([50, 61], 10, 10, 215, 285), { w: 3 });
      t(arco([73, 61], 13, 13, 250, 320), { w: 3 });
    },
  },

  /** AOP: o espeto de notas, com o prego que atravessa todas elas (o que corta as camadas). */
  AOP: {
    o: "espeto de notas",
    d({ t, elipse, arco, linha, poli, mover }) {
      t({ pts: [...arco([60, 99], 26, 6.5, 0, 180).pts, ...arco([60, 93], 26, 6.5, 180, 360).pts], fechada: true }, { papel: true });
      t(elipse([60, 93], 26, 6.5), { w: 2 });
      t(linha([60, 93], [60, 22]), {});
      const nota = (y, giro, dx, larga = 50) =>
        mover(poli([[60 - larga / 2, y], [60 + larga / 2 - 6, y - 7], [60 + larga / 2, y + 1], [60 - larga / 2 + 6, y + 8]], true), { giro, centro: [60, y], dx });
      const notas = [
        [84, -4, -1],
        [75, 5, 2],
        [66, -7, -2, 46],
        [57, 3, 1.5, 44],
      ];
      for (const [y, giro, dx, larga] of notas) {
        t(nota(y, giro, dx, larga), { papel: true });
        t(mover(linha([54, y - 1], [64, y - 2.6]), { giro, centro: [60, y], dx }), { w: 3 });
      }
      t(linha([60, 55], [60, 24]), {});
      t(linha([60, 24], [60, 15]), { w: 2 });
    },
  },

  /** JWT: o ingresso com o canhoto destacável e o carimbo (a assinatura) no canhoto. */
  JWT: {
    o: "ingresso com canhoto e carimbo",
    d({ t, poli, arco, linha, circulo, mover }) {
      const g = { giro: -9, centro: [60, 60] };
      const ingresso = {
        pts: [
          ...poli([[16, 38], [104, 38], [104, 54]]).pts,
          ...arco([104, 60], 6, 6, 270, 90, 0).pts.slice(1).map(([x, y]) => [208 - x, y]),
          ...poli([[104, 66], [104, 82], [16, 82], [16, 66]]).pts.slice(1),
          ...arco([16, 60], 6, 6, 90, -90).pts.slice(1, -1).map(([x, y]) => [32 - x, y]),
        ],
        fechada: true,
      };
      t(mover(ingresso, g), { papel: true });
      t(mover(linha([80, 41], [80, 79]), g), { fantasma: true });
      for (const [y, fim] of [[50, 62], [58, 70], [66, 56], [74, 66]]) t(mover(linha([26, y], [fim, y]), g), { w: 2 });
      t(mover(circulo([92, 60], 7.5), g), { w: 2 });
      t(mover(circulo([92, 60], 4.5), g), { w: 3 });
    },
  },
};

// ---------- gravar ----------

const pedidos = process.argv.slice(2);
mkdirSync(pasta, { recursive: true });
for (const [nome, { o, d }] of Object.entries(DESENHOS)) {
  const slug = slugDaTag(nome);
  if (pedidos.length && !pedidos.includes(slug)) continue;
  const corpo = desenhar(nome, d);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" aria-hidden="true"><!-- Ícone da tag ${nome}: ${o}. Gerado por scripts/desenho/tags.mjs; não edite à mão. -->${ESTILO}${corpo}</svg>\n`;
  writeFileSync(join(pasta, `${slug}.svg`), svg);
  console.log(`src/livros/tags/${slug}.svg (${(svg.length / 1024).toFixed(1)} KB)`);
}
