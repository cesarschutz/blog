/**
 * O traço de caneta do menu e do rodapé (D49, protótipo E1): uma linha quase reta, com um tremor
 * pequeno e a ponta que sobe um pouco no fim, sempre o mesmo para o mesmo texto (o tremor sai de uma
 * semente tirada do texto, e fica igual em toda visita). O caminho fica numa caixa de 100 × 8 e estica
 * até a largura do link (o SVG com preserveAspectRatio="none" e o traço sem escala, vector-effect), sem
 * o filtro de turbulência, que custaria a cada quadro.
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
 * do mouse não é igual ao da seção atual).
 */
export function tracoDeCaneta(texto: string, outro = 0, amplitude = 0.9) {
  const r = sorteio(sementeDe(texto) + outro);
  // Um ponto a cada ~16px do texto (uns dois caracteres), como no protótipo.
  const n = Math.max(3, Math.round(texto.length / 2));
  const pontos: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const y = 4 + (r() - 0.5) * 2 * amplitude + (i === n ? -amplitude : 0) + (i === 0 ? amplitude * 0.5 : 0);
    pontos.push([1 + (98 * i) / n, y]);
  }
  return curva(pontos);
}
