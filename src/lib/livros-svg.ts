/**
 * Desenhos e ícones dos livros (D30), lidos de `docs/capas/desenhos/` e `docs/capas/icones/` e
 * preparados no build para entrar inline (a cor vem de currentColor e das variáveis):
 *
 * - sem o comentário e sem o <style> de cada arquivo: as classes `cz-*` têm espessuras diferentes no
 *   desenho e no ícone, e dois <style> na mesma página brigariam. As regras ficam em livro.css,
 *   presas a `.desenho-capa` e `.icone-livro`;
 * - traços simplificados (Ramer–Douglas–Peucker, 0,1 unidade, invisível na capa de 480 de largura):
 *   o tremor do traço fica, e os arquivos caem para cerca de um terço;
 * - o ícone e o emblema da série ganham o viewBox justo do desenho (os arquivos têm muita sobra),
 *   para caber bem na ponta da lombada deitada e na área de cima da lombada em pé.
 */
const desenhos = import.meta.glob<string>("../../docs/capas/desenhos/*.svg", { query: "?raw", import: "default", eager: true });
const icones = import.meta.glob<string>("../../docs/capas/icones/*.svg", { query: "?raw", import: "default", eager: true });
const emblemas = import.meta.glob<string>("../../docs/capas/serie/*.svg", { query: "?raw", import: "default", eager: true });

type Ponto = [number, number];

function rdp(pontos: Ponto[], tolerancia: number): Ponto[] {
  if (pontos.length < 3) return pontos;
  const [x1, y1] = pontos[0];
  const [x2, y2] = pontos[pontos.length - 1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const n = Math.hypot(dx, dy);
  let maior = 0;
  let indice = 0;
  for (let i = 1; i < pontos.length - 1; i++) {
    const [x, y] = pontos[i];
    const d = n ? Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / n : Math.hypot(x - x1, y - y1);
    if (d > maior) [maior, indice] = [d, i];
  }
  if (maior <= tolerancia) return [pontos[0], pontos[pontos.length - 1]];
  return [...rdp(pontos.slice(0, indice + 1), tolerancia).slice(0, -1), ...rdp(pontos.slice(indice), tolerancia)];
}

const numero = (v: number) => String(Math.round(v * 10) / 10);

/** Simplifica os `d` (só M, L e Z, como nos arquivos) e devolve os pontos para medir a caixa. */
function simplificar(corpo: string, tolerancia: number) {
  const todos: Ponto[] = [];
  const saida = corpo.replace(/\sd="([^"]*)"/g, (_, d: string) => {
    const trechos = d.match(/M[^M]*/g) ?? [];
    const novo = trechos.map((trecho) => {
      const fecha = /Z\s*$/.test(trecho);
      const pontos = [...trecho.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])] as Ponto);
      todos.push(...pontos);
      const p = rdp(pontos, tolerancia);
      return `M${p.map(([x, y]) => `${numero(x)} ${numero(y)}`).join("L")}${fecha ? "Z" : ""}`;
    });
    return ` d="${novo.join("")}"`;
  });
  for (const m of corpo.matchAll(/<circle[^>]*\scx="([\d.]+)"[^>]*\scy="([\d.]+)"[^>]*\sr="([\d.]+)"/g)) {
    const [cx, cy, r] = [Number(m[1]), Number(m[2]), Number(m[3])];
    todos.push([cx - r, cy - r], [cx + r, cy + r]);
  }
  return { corpo: saida, pontos: todos };
}

/** O conteúdo do SVG, sem a raiz, o comentário e o <style>. */
function miolo(fonte: string, arquivo: string) {
  const raiz = fonte.match(/<svg\b[^>]*>/)?.[0];
  if (!raiz) throw new Error(`${arquivo} não tem raiz <svg>.`);
  return fonte
    .slice(fonte.indexOf(raiz) + raiz.length, fonte.lastIndexOf("</svg>"))
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/style="fill: /g, 'style="fill:')
    .trim();
}

const cacheDesenho = new Map<string, string>();
const cacheIcone = new Map<string, { corpo: string; caixa: [number, number, number, number] }>();

/** O desenho da parte clara da capa (viewBox 0 300 480 420, D32), pronto para entrar inline. */
export function desenhoDaCapa(slug: string): string {
  const pronto = cacheDesenho.get(slug);
  if (pronto) return pronto;
  const arquivo = `../../docs/capas/desenhos/${slug}.svg`;
  const fonte = desenhos[arquivo];
  if (!fonte) throw new Error(`Falta docs/capas/desenhos/${slug}.svg`);
  const { corpo } = simplificar(miolo(fonte, arquivo), 0.1);
  const svg = `<svg class="desenho-capa" viewBox="0 300 480 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${corpo}</svg>`;
  cacheDesenho.set(slug, svg);
  return svg;
}

export const temDesenho = (slug: string) => `../../docs/capas/desenhos/${slug}.svg` in desenhos;

/** Lê um ícone (`icones/<slug>.svg`) ou um emblema de série (`serie/<nome>.svg`, pelo caminho). */
function lerIcone(chave: string) {
  const pronto = cacheIcone.get(chave);
  if (pronto) return pronto;
  const arquivo = chave.startsWith("serie/") ? `../../docs/capas/${chave}` : `../../docs/capas/icones/${chave}.svg`;
  const fonte = (chave.startsWith("serie/") ? emblemas : icones)[arquivo];
  if (!fonte) throw new Error(`Falta ${arquivo.replace("../../", "")}`);
  const { corpo, pontos } = simplificar(miolo(fonte, arquivo), 0.12);
  const xs = pontos.map((p) => p[0]);
  const ys = pontos.map((p) => p[1]);
  // Folga de 1,5 unidade para o traço e a ponta arredondada não serem cortados na borda.
  const f = 1.5;
  const caixa: [number, number, number, number] = [
    Math.min(...xs) - f,
    Math.min(...ys) - f,
    Math.max(...xs) - Math.min(...xs) + 2 * f,
    Math.max(...ys) - Math.min(...ys) + 2 * f,
  ];
  const lido = { corpo, caixa };
  cacheIcone.set(chave, lido);
  return lido;
}

/**
 * O ícone da lombada (pelo slug) ou o emblema da série (pelo caminho, "serie/xicara.svg"), com o
 * viewBox justo. `girado`: 90° no sentido horário, para a lombada em pé (a caixa troca largura e
 * altura, e o desenho gira dentro dela).
 */
export function iconeDoLivro(chave: string, girado = false): string {
  const { corpo, caixa } = lerIcone(chave);
  const [x, y, w, h] = caixa.map((v) => Math.round(v * 10) / 10);
  const atributos = `class="icone-livro" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"`;
  if (!girado) return `<svg ${atributos} viewBox="${x} ${y} ${w} ${h}">${corpo}</svg>`;
  // Girar 90° no sentido horário em volta da origem leva (x, y) a (−y, x): a caixa nova começa em
  // (−(y + h), x), com largura h e altura w.
  return `<svg ${atributos} viewBox="${-(y + h)} ${x} ${h} ${w}"><g transform="rotate(90)">${corpo}</g></svg>`;
}

const grao = import.meta.glob<string>("../../docs/capas/grao.svg", { query: "?raw", import: "default", eager: true });

/** O grão de papel (docs/capas/grao.svg) como url() de CSS, para a variável --grao (Base.astro). */
export const GRAO_CSS = `url("data:image/svg+xml,${encodeURIComponent(Object.values(grao)[0].trim()).replace(/'/g, "%27")}")`;
