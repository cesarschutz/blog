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
  const r = sorteio(sementeDe(texto));
  const p: [number, number][] = [];
  const n = 16;
  const inicio = -Math.PI * 0.62;
  const voltas = 1.08;
  for (let i = 0; i <= n; i++) {
    const a = inicio + (voltas * 2 * Math.PI * i) / n;
    const k = 1 + (r() - 0.5) * 0.07 + (i / n) * 0.06;
    p.push([24 + Math.cos(a) * rx * k, 24 + Math.sin(a) * ry * k]);
  }
  return curva(p);
}
