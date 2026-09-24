// Cores de cada livro de categoria a partir da cor principal. Mesmas regras das imagens de referência.
// Uso: import { coresDoLivro, PAPEL, TINTA_PAPEL } from './cores.js';

export const PAPEL = '#f2ede2';        // parte clara da capa e da lombada
export const TINTA_PAPEL = '#1f1c18';  // texto comum sobre o papel
const CLARA = '#efe8d8';
const ESCURA = '#29251b';

function hexParaRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const paraLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const paraSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function luminancia(hex) {
  const [r, g, b] = hexParaRgb(hex).map((v) => paraLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function paraOklab(hex) {
  const [r, g, b] = hexParaRgb(hex).map((v) => paraLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function deOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return '#' + rgb.map((v) => Math.round(Math.min(1, Math.max(0, paraSrgb(Math.max(0, v)))) * 255).toString(16).padStart(2, '0')).join('');
}
function escurecer(hex, dL) {
  const [L, a, b] = paraOklab(hex);
  return deOklab([L + dL, a, b]);
}

export function coresDoLivro(cor) {
  // destaque: a cor do livro escurecida até ter contraste sobre o papel (título da lombada, número, desenho)
  let destaque = cor;
  while (luminancia(destaque) > 0.14) destaque = escurecer(destaque, -0.03);
  return {
    cor, // bloco de cima da capa e da lombada
    tinta: luminancia(cor) > 0.3 ? ESCURA : CLARA, // texto e ícone sobre a cor
    destaque,
  };
}
