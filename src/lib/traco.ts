/**
 * Os traços de caneta da interface (D49): o sublinhado do menu e do rodapé (protótipo E1), o colchete
 * da lista e o círculo da paginação (E2), a rasura da 404 e a ondinha da busca vazia (E4). Cada um é
 * sempre o mesmo para o mesmo texto: o tremor sai de uma semente tirada do texto, e fica igual em toda
 * visita. O sublinhado é uma linha quase reta, com a ponta que sobe um pouco no fim, numa caixa de
 * 100 × 8 que estica até a largura do link (o SVG com preserveAspectRatio="none" e o traço sem escala,
 * vector-effect), sem o filtro de turbulência, que custaria a cada quadro.
 */

/** Sorteio com semente (mulberry32): o mesmo texto dá sempre o mesmo tremor. */
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

/** Curva suave passando pelos pontos (Catmull-Rom convertido em Bézier). */
function curva(p: [number, number][]) {
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

/**
 * O caminho do traço para um texto. `outro` dá um tremor diferente para o mesmo texto (o traço leve
 * do mouse não é igual ao da seção atual). `quantos` fixa quantos pontos o traço tem (o sublinhado de
 * cada linha do sumário, B05 da D52, conta pela largura da linha, e não pelo texto inteiro).
 */
export function tracoDeCaneta(texto: string, outro = 0, amplitude = 0.9, quantos?: number) {
  const r = sorteio(sementeDe(texto) + outro);
  // Um ponto a cada ~16px do texto (uns dois caracteres), como no protótipo.
  const n = Math.max(3, quantos ?? Math.round(texto.length / 2));
  const pontos: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const y = 4 + (r() - 0.5) * 2 * amplitude + (i === n ? -amplitude : 0) + (i === 0 ? amplitude * 0.5 : 0);
    pontos.push([1 + (98 * i) / n, y]);
  }
  return curva(pontos);
}

/**
 * O colchete na margem de um artigo da lista (D49, protótipo E2): gancho em cima, a descida levemente
 * torta e o gancho embaixo, numa caixa de 14 × `altura`. O SVG estica até a altura do item (o traço
 * sem escala), e o tremor é o de cada título.
 */
export function colcheteDeCaneta(texto: string, altura = 170) {
  const r = sorteio(sementeDe(texto));
  const j = () => (r() - 0.5) * 1.2;
  const p: [number, number][] = [
    [11, 1.5],
    [6 + j() * 0.4, 2.6],
    [4 + j() * 0.3, 7],
  ];
  const n = Math.max(2, Math.round((altura - 14) / 22));
  for (let i = 1; i < n; i++) p.push([4 + j(), 7 + ((altura - 14) * i) / n]);
  p.push([4.3 + j() * 0.3, altura - 7], [6.2, altura - 2.4], [11, altura - 1.2]);
  return curva(p);
}

/**
 * A rasura sobre o endereço errado da 404 (D49, protótipo E4), numa caixa de `largura` × `altura` px:
 * o primeiro traço vai da esquerda para a direita, descendo um nada; o segundo volta, mais curto e
 * um pouco abaixo. O tremor é o do endereço.
 */
export function rasuraDeCaneta(largura: number, altura: number, texto: string): [string, string] {
  const r = sorteio(sementeDe(texto));
  const j = () => (r() - 0.5) * 1.6;
  const n = Math.max(4, Math.round(largura / 40));
  const m = Math.ceil(n * 0.6);
  const ida: [number, number][] = [];
  const volta: [number, number][] = [];
  for (let i = 0; i <= n; i++) ida.push([2 + ((largura - 4) * i) / n, altura * 0.5 - (i / n) * 2 + j()]);
  for (let i = 0; i <= m; i++) volta.push([largura - 3 - (largura * 0.62 * i) / m, altura * 0.6 + j() * 0.8]);
  return [curva(ida), curva(volta)];
}

/**
 * A ondinha de revisor sob o termo que a busca não achou (D49, protótipo E4), numa caixa de
 * `largura` × 6 px: meias-ondas de 3,2px, cada crista com a altura um pouco diferente.
 */
export function ondaDeCaneta(largura: number, texto: string) {
  const r = sorteio(sementeDe(texto));
  const passo = 3.2;
  let d = `M0 ${f(3 + (r() - 0.5) * 0.4)}`;
  let cima = true;
  for (let x = 0; x < largura; x += passo) {
    const proximo = Math.min(largura, x + passo);
    d += ` Q${f(x + passo / 2)} ${f(cima ? 0.4 + r() * 0.5 : 5.2 + r() * 0.5)} ${f(proximo)} 3`;
    cima = !cima;
  }
  return d;
}

/**
 * O círculo à mão numa caixa de 48 × 48 (D49, protótipo E2: a paginação e os perfis do cabeçalho):
 * começa um pouco antes do topo e passa do ponto de partida (uma volta e 8%), como quem circula.
 */
export function circuloDeCaneta(texto: string, rx = 18.5, ry = 17.5) {
  return volta(texto, 24, 24, rx, ry);
}

/* ---------------------------------------------------------------------------------------------------
 * A caneta preta (C04 da D52): os desenhos de quem fez a página. A azul marca (o estado, a navegação e
 * as marcações do texto); a preta desenha (os ícones de data, tempo e código, a lupa, o sol e a lua, os
 * contornos dos botões do cabeçalho e a assinatura da home). Tudo sai daqui, gerado no build, sempre
 * igual para o mesmo nome (a semente é o texto), sem filtro. O tremor acompanha o tamanho: nos ícones
 * de 14 a 22px, até 0,3 unidade na caixa de 24 (mais que isso lê como borrão); na assinatura, mais.
 * ------------------------------------------------------------------------------------------------- */

type Ponto = [number, number];

/** O tremor da mão num desenho pequeno: cada ponto sai até `amp / 2` do lugar. */
function tremer(p: Ponto[], texto: string, amp = 0.3): Ponto[] {
  const r = sorteio(sementeDe(texto));
  return p.map(([x, y]) => [x + (r() - 0.5) * amp, y + (r() - 0.5) * amp]);
}

/** Vários trechos numa linha só, com um canto entre eles (a ponta da lua, por exemplo). */
function trechos(...grupos: Ponto[][]) {
  return grupos.map((g, i) => (i === 0 ? curva(g) : curva(g).replace(/^M[^C]+/, ""))).join("");
}

/**
 * Uma linha quebrada à mão: retas levemente embarrigadas (o bojo sai da semente) e cantos vivos, como
 * a ponta de um "<" ou os ponteiros de um relógio.
 */
function quebrada(p: Ponto[], texto: string, bojo = 0.25) {
  const r = sorteio(sementeDe(texto) + 3);
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 1; i < p.length; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const l = Math.hypot(x1 - x0, y1 - y0) || 1;
    const b = (r() - 0.5) * 2 * bojo;
    d += ` Q${f((x0 + x1) / 2 - ((y1 - y0) / l) * b)} ${f((y0 + y1) / 2 + ((x1 - x0) / l) * b)} ${f(x1)} ${f(y1)}`;
  }
  return d;
}

interface Volta {
  /** Onde a caneta encosta (radianos; 0 é a direita, e o ângulo cresce no sentido do relógio). */
  inicio?: number;
  /** Um pouco mais de uma volta, como quem circula. */
  voltas?: number;
  /** A irregularidade do raio. */
  tremor?: number;
  /** Quanto o fim sai para fora, sem fechar certinho. */
  abre?: number;
  n?: number;
}

/** Uma volta à mão em torno de (cx, cy). É o círculo da paginação (D49), em qualquer caixa. */
function volta(texto: string, cx: number, cy: number, rx: number, ry: number, o: Volta = {}) {
  const { inicio = -Math.PI * 0.62, voltas = 1.08, tremor = 0.07, abre = 0.06, n = 16 } = o;
  const r = sorteio(sementeDe(texto));
  const p: Ponto[] = [];
  for (let i = 0; i <= n; i++) {
    const a = inicio + (voltas * 2 * Math.PI * i) / n;
    const k = 1 + (r() - 0.5) * tremor + (i / n) * abre;
    p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return curva(p);
}

/** A lupa da busca: a lente numa volta que passa do ponto de partida e o cabo, reto e firme. */
export function lupaDeCaneta() {
  return [
    volta("lupa", 10.4, 10.5, 6.9, 6.5, { inicio: -Math.PI * 0.85, voltas: 1.13, tremor: 0.08, abre: 0.1 }),
    quebrada(tremer([[15.3, 15.8], [20.6, 20.3]], "cabo", 0.2), "cabo", 0.5),
  ];
}

/**
 * O calendário da data: um bloquinho de mesa. A folha numa volta só (começa no alto, à esquerda, e passa
 * um nada do começo), a linha do cabeçalho, as duas argolas e o dia marcado com um visto.
 */
export function calendarioDeCaneta() {
  const folha = tremer(
    [
      [6.4, 5.7], [12, 5.5], [17.7, 5.4], [19.6, 5.9], [20.3, 7.8], [20.4, 13], [20.1, 18.7], [19.4, 20.3],
      [17.6, 20.8], [12, 20.9], [6.3, 20.6], [4.6, 20], [4, 18.4], [3.8, 13], [3.9, 7.9], [4.5, 6.2],
      [6.5, 5.3], [9.6, 5.0],
    ],
    "calendário",
    0.3,
  );
  return [
    curva(folha),
    quebrada(tremer([[3.5, 10.4], [21, 9.9]], "cabeçalho", 0.2), "cabeçalho", 0.4),
    quebrada(tremer([[8.1, 2.7], [8.5, 7.4]], "argola", 0.2), "argola", 0.3),
    quebrada(tremer([[15.9, 2.9], [15.6, 7.3]], "outra argola", 0.2), "outra argola", 0.3),
    quebrada(tremer([[8.4, 14.9], [10.5, 17.1], [14.9, 12.7]], "dia", 0.15), "dia", 0.3),
  ];
}

/** O relógio do tempo de leitura: o aro numa volta que passa do começo e os ponteiros num gesto só. */
export function relogioDeCaneta() {
  return [
    volta("relógio", 12, 12, 8.9, 8.5, { inicio: -Math.PI * 0.6, voltas: 1.12, tremor: 0.07, abre: 0.09 }),
    quebrada(tremer([[11.9, 6.6], [12.1, 12.2], [15.8, 14.4]], "ponteiros", 0.2), "ponteiros", 0.4),
  ];
}

/** O código-fonte: "<", a barra e ">", cada um num traço, com as pontas vivas. */
export function codigoDeCaneta() {
  return [
    quebrada(tremer([[8.4, 6.1], [2.7, 12.2], [7.8, 17.8]], "menor", 0.25), "menor", 0.45),
    quebrada(tremer([[15.7, 6.5], [21.3, 11.8], [16.2, 17.4]], "maior", 0.25), "maior", 0.45),
    quebrada(tremer([[14.1, 3.7], [9.9, 20.3]], "barra", 0.2), "barra", 0.7),
  ];
}

/**
 * A lua do botão de tema: a borda de fora num arco só até a ponta de baixo e, dali, a mordida de volta
 * até a ponta de cima, cruzando um nada o começo. As duas pontas ficam vivas.
 */
export function luaDeCaneta() {
  const [ox, oy] = [12, 12];
  const [bx, by] = [17.2, 6.8];
  const cima: Ponto = [9.3, 3.9];
  const baixo: Ponto = [20.1, 14.7];
  const R = Math.hypot(cima[0] - ox, cima[1] - oy);
  const Rb = Math.hypot(cima[0] - bx, cima[1] - by);
  const a0 = Math.atan2(cima[1] - oy, cima[0] - ox) + 2 * Math.PI;
  const a1 = Math.atan2(baixo[1] - oy, baixo[0] - ox);
  const fora: Ponto[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = a0 + ((a1 - a0) * i) / 12;
    fora.push([ox + Math.cos(a) * R, oy + Math.sin(a) * R]);
  }
  const b0 = Math.atan2(baixo[1] - by, baixo[0] - bx);
  const b1 = Math.atan2(cima[1] - by, cima[0] - bx) + 2 * Math.PI + 0.2;
  const dentro: Ponto[] = [];
  for (let i = 0; i <= 8; i++) {
    const a = b0 + ((b1 - b0) * i) / 8;
    const k = 1 + (i / 8) * 0.06;
    dentro.push([bx + Math.cos(a) * Rb * k, by + Math.sin(a) * Rb * k]);
  }
  return trechos(tremer(fora, "lua", 0.25), tremer(dentro, "mordida", 0.2));
}

/** O sol: o miolo numa volta que passa do começo e oito raios, cada um de dentro para fora. */
export function solDeCaneta() {
  const r = sorteio(sementeDe("raios do sol"));
  const raios: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 4 + (r() - 0.5) * 0.16;
    const r0 = 6.7 + (r() - 0.5) * 0.6;
    const r1 = 9.4 + (r() - 0.5) * 1.4;
    raios.push(quebrada([[12 + Math.cos(a) * r0, 12 + Math.sin(a) * r0], [12 + Math.cos(a) * r1, 12 + Math.sin(a) * r1]], `raio ${i}`, 0.25));
  }
  return { miolo: volta("sol", 12, 12, 4.3, 4.1, { inicio: -Math.PI * 0.6, voltas: 1.12, tremor: 0.08, abre: 0.1, n: 12 }), raios };
}

/**
 * O contorno à mão de um botão redondo do cabeçalho (tema, busca e menu no celular), numa caixa de
 * 40 × 40: uma volta que passa do começo, rente à borda.
 */
export function contornoDeCaneta(texto: string) {
  return volta(texto, 20, 20, 18.7, 18.4, { inicio: -Math.PI * 0.7, voltas: 1.06, tremor: 0.04, abre: 0.03, n: 18 });
}

/**
 * O contorno à mão do campo de busca, numa caixa de `largura` × `altura` px: a pílula numa volta só,
 * que começa no alto, logo depois da curva da esquerda, e passa um nada do começo.
 */
export function pilulaDeCaneta(largura: number, altura: number, texto: string) {
  const r = sorteio(sementeDe(texto));
  const j = (a: number) => (r() - 0.5) * 2 * a;
  const raio = altura / 2 - 1;
  const [x0, x1, cy] = [1 + raio, largura - 1 - raio, altura / 2];
  const p: Ponto[] = [];
  const n = Math.max(3, Math.round((x1 - x0) / 36));
  for (let i = 0; i < n; i++) p.push([x0 + ((x1 - x0) * i) / n, 1 + j(0.35)]);
  for (let i = 0; i <= 6; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / 6;
    const k = 1 + j(0.02);
    p.push([x1 + Math.cos(a) * raio * k, cy + Math.sin(a) * raio * k]);
  }
  for (let i = 1; i < n; i++) p.push([x1 - ((x1 - x0) * i) / n, altura - 1 + j(0.35)]);
  for (let i = 0; i <= 6; i++) {
    const a = Math.PI / 2 + (Math.PI * i) / 6;
    const k = 1 + j(0.02) + (i / 6) * 0.02;
    p.push([x0 + Math.cos(a) * raio * k, cy + Math.sin(a) * raio * k]);
  }
  p.push([x0 + 14, 0.6 + j(0.2)]);
  return curva(p);
}
