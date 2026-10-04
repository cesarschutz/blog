/**
 * O ícone do computador (rodada 3, C2; o Macintosh do protótipo 12), desenhado à caneta preta como os de
 * `src/lib/traco.ts` (C04, D52): o tremor da mão fica gravado na geometria, sai de uma semente tirada do
 * nome (sempre igual para o mesmo desenho) e não usa filtro. Só roda no build (o frontmatter de
 * Computador.astro); nada daqui vai para o navegador.
 *
 * As medidas do computador estão numa caixa de 80 × 80: o gabinete (um Macintosh clássico), o pé, o
 * teclado deitado na frente e o mouse com o fio. A tela de vidro (a peça que cresce na câmera) é um
 * elemento HTML por cima do desenho, nas medidas de TELA.
 */

type Ponto = [number, number];

/** Sorteio com semente (mulberry32), o mesmo de traco.ts. */
function sorteio(semente: number) {
  let s = semente | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const sementeDe = (texto: string) => [...texto].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);
const f = (n: number) => n.toFixed(2);

/** Curva suave passando pelos pontos (Catmull-Rom em Bézier), como em traco.ts. */
function curva(p: Ponto[]) {
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] ?? c;
    d += ` C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`;
  }
  return d;
}

/** Uma linha quebrada à mão: retas levemente embarrigadas e cantos vivos. */
function quebrada(p: Ponto[], texto: string, bojo = 0.3, amp = 0.3) {
  const r = sorteio(sementeDe(texto) + 3);
  const q = p.map(([x, y]) => [x + (r() - 0.5) * amp, y + (r() - 0.5) * amp] as Ponto);
  let d = `M${f(q[0][0])} ${f(q[0][1])}`;
  for (let i = 1; i < q.length; i++) {
    const [x0, y0] = q[i - 1];
    const [x1, y1] = q[i];
    const l = Math.hypot(x1 - x0, y1 - y0) || 1;
    const b = (r() - 0.5) * 2 * bojo;
    d += ` Q${f((x0 + x1) / 2 - ((y1 - y0) / l) * b)} ${f((y0 + y1) / 2 + ((x1 - x0) / l) * b)} ${f(x1)} ${f(y1)}`;
  }
  return d;
}

/**
 * Um retângulo de cantos redondos numa volta só, como a mão faz: começa no alto, logo depois do canto da
 * esquerda, dá a volta e passa um nada do começo. Os lados ganham pontos a cada ~7 unidades, cada um
 * com o seu tremor.
 */
function caixa(x: number, y: number, w: number, h: number, raio: number, texto: string, amp = 0.35) {
  const r = sorteio(sementeDe(texto));
  const j = () => (r() - 0.5) * amp;
  const p: Ponto[] = [];
  const lado = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 7));
    for (let i = 0; i < n; i++) p.push([x0 + ((x1 - x0) * i) / n + j(), y0 + ((y1 - y0) * i) / n + j()]);
  };
  const canto = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 2; i++) {
      const a = a0 + (Math.PI / 2) * (i / 2);
      p.push([cx + Math.cos(a) * raio + j() * 0.5, cy + Math.sin(a) * raio + j() * 0.5]);
    }
  };
  lado(x + raio, y, x + w - raio, y);
  canto(x + w - raio, y + raio, -Math.PI / 2);
  lado(x + w, y + raio, x + w, y + h - raio);
  canto(x + w - raio, y + h - raio, 0);
  lado(x + w - raio, y + h, x + raio, y + h);
  canto(x + raio, y + h - raio, Math.PI / 2);
  lado(x, y + h - raio, x, y + raio);
  canto(x + raio, y + raio, Math.PI);
  // Passa um nada do começo, sem fechar certinho.
  p.push([x + raio + Math.min(5, w * 0.18), y + j() * 0.6 - 0.15]);
  return curva(p);
}

/** Uma volta à mão em torno de (cx, cy), que passa do ponto de partida. */
function volta(cx: number, cy: number, rx: number, ry: number, texto: string, n = 12, tremor = 0.08) {
  const r = sorteio(sementeDe(texto));
  const p: Ponto[] = [];
  const inicio = -Math.PI * 0.62;
  for (let i = 0; i <= n; i++) {
    const a = inicio + (1.08 * 2 * Math.PI * i) / n;
    const k = 1 + (r() - 0.5) * tremor + (i / n) * 0.05;
    p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return curva(p);
}

/** Onde fica o vidro da tela, na caixa de 80 × 80 do computador (em %, para o elemento HTML por cima). */
export const TELA = { x: 23.4, y: 10.4, w: 29.2, h: 22.2 };

/**
 * O computador. `corpo` é o gabinete, o pé e a moldura da tela (o que pula no hover); `mesa`, o teclado,
 * o mouse e o fio, que ficam na mesa; `sombra`, a sombra de contato embaixo de tudo.
 */
export function desenhoDoComputador() {
  const gabinete = caixa(16, 3, 44, 52, 5, "gabinete", 0.4);
  const moldura = caixa(21, 8, 34, 27, 3.4, "moldura", 0.3);
  const vidro = caixa(TELA.x - 0.6, TELA.y - 0.6, TELA.w + 1.2, TELA.h + 1.2, 2.4, "vidro", 0.2);
  const queixo = quebrada([[16.6, 47.4], [38, 47.1], [59.4, 47.5]], "queixo", 0.3, 0.25);
  const disquete = quebrada([[40.5, 41.2], [53.2, 41]], "disquete", 0.2, 0.2);
  const fenda = quebrada([[42.6, 42.8], [51.2, 42.9]], "fenda", 0.15, 0.15);
  const luz = volta(23.6, 41.6, 1.05, 1.05, "luz", 8, 0.1);
  const pe = quebrada([[21.5, 55], [23, 59.4], [53.2, 59.6], [54.6, 55.1]], "pé", 0.25, 0.3);
  const teclado = quebrada([[11.2, 62.4], [51.2, 62.2], [54.2, 72.6], [6.8, 72.8], [11.2, 62.4]], "teclado", 0.3, 0.35);
  const teclas1 = quebrada([[13.4, 65.4], [49.4, 65.3]], "teclas 1", 0.2, 0.2);
  const teclas2 = quebrada([[11.8, 68.6], [51, 68.5]], "teclas 2", 0.2, 0.2);
  const espaco = quebrada([[22.5, 70.9], [37.5, 70.95]], "espaço", 0.2, 0.2);
  const mouse = volta(65.6, 67.4, 4.2, 5.4, "mouse", 12, 0.07);
  const botao = quebrada([[61.8, 65.6], [69.4, 65.4]], "botão", 0.25, 0.2);
  const fio = curva(
    (
      [
        [65.6, 62],
        [65.3, 59.4],
        [63.2, 57.2],
        [60.2, 54.4],
      ] as Ponto[]
    ).map(([x, y], i) => [x + (i % 2 ? 0.2 : -0.15), y] as Ponto),
  );
  return {
    corpo: { gabinete, moldura, vidro, queixo, disquete, fenda, luz, pe },
    mesa: { teclado, teclas: [teclas1, teclas2, espaco], mouse, botao, fio },
  };
}
