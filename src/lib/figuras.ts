/**
 * As figuras dos posts (D58): diagramas, gráficos e as animações próprias (GSAP), em
 * src/figuras/<slug>/<nome>.svg e src/animacoes/<slug>/<nome>.svg, e os logos das ferramentas, em
 * src/marcas/<nome>.svg (viewBox 0 0 100 100).
 *
 * Um logo entra numa figura por um marcador, que vira o desenho do logo na hora do build:
 *   <g data-marca="aws" transform="translate(40 60) scale(.8)"/>
 * Assim o logo é desenhado uma vez só e reaparece em qualquer figura, do tamanho que ela pedir.
 */
const figuras = import.meta.glob<string>("../figuras/**/*.svg", { query: "?raw", import: "default", eager: true });
const animacoes = import.meta.glob<string>("../animacoes/**/*.svg", { query: "?raw", import: "default", eager: true });
const marcas = import.meta.glob<string>("../marcas/*.svg", { query: "?raw", import: "default", eager: true });

const raizDe = (fonte: string) => fonte.match(/<svg\b[^>]*>/)?.[0] ?? "";

/** O conteúdo de um SVG, sem a raiz e sem comentários. */
export function miolo(fonte: string): string {
  const raiz = raizDe(fonte);
  return fonte
    .slice(fonte.indexOf(raiz) + raiz.length, fonte.lastIndexOf("</svg>"))
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

/** O miolo do logo de uma ferramenta (src/marcas/<nome>.svg). */
export function marca(nome: string): string {
  const fonte = marcas[`../marcas/${nome}.svg`];
  if (!fonte) throw new Error(`Falta o logo src/marcas/${nome}.svg.`);
  return miolo(fonte);
}

export const marcasDisponiveis = () => Object.keys(marcas).map((c) => c.replace(/^\.\.\/marcas\/|\.svg$/g, ""));

/** Troca cada marcador <g data-marca="x" …/> (ou <g data-marca="x" …></g>) pelo desenho do logo. */
export function comMarcas(fonte: string): string {
  return fonte.replace(/<g\b([^>]*?)\bdata-marca="([^"]+)"([^>]*?)\s*(?:\/>|>\s*<\/g>)/g, (_, antes: string, nome: string, depois: string) => {
    let atributos = `${antes} ${depois}`.replace(/\s+/g, " ").trim();
    const classe = atributos.match(/\bclass="([^"]*)"/)?.[1];
    atributos = atributos.replace(/\s*\bclass="[^"]*"/, "").trim();
    const classes = ["marca", `marca-${nome}`, classe].filter(Boolean).join(" ");
    return `<g${atributos ? ` ${atributos}` : ""} class="${classes}">${marca(nome)}</g>`;
  });
}

/** Detalhes que se mexem sozinhos (figura.css): a figura só os anima na tela. */
const VIVAS = /class="[^"]*\b(fluxo|formiga|pacote|pulsa|pisca|gira|balanca|anda)\b/;

export interface Figura {
  alt: string;
  svg: string;
  viva: boolean;
}

function montar(fonte: string, caminho: string, classes: string): Figura {
  const raiz = raizDe(fonte);
  if (!raiz) throw new Error(`${caminho} não tem raiz <svg>.`);
  const alt = raiz.match(/\saria-label="([^"]*)"/)?.[1] ?? "";
  if (!alt) throw new Error(`${caminho} precisa de aria-label (o texto alternativo).`);
  const novaRaiz = raiz.replace(/<svg\b/, `<svg class="${classes}" role="img" focusable="false"`);
  const svg = comMarcas(fonte.replace(raiz, novaRaiz));
  return { alt, svg, viva: VIVAS.test(svg) };
}

export function figura(nome: string): Figura {
  const caminho = `../figuras/${nome}.svg`;
  const fonte = figuras[caminho];
  if (!fonte) throw new Error(`Falta a figura src/figuras/${nome}.svg.`);
  return montar(fonte, `src/figuras/${nome}.svg`, "ilustracao diagrama");
}

export function animacao(nome: string): Figura {
  const caminho = `../animacoes/${nome}.svg`;
  const fonte = animacoes[caminho];
  if (!fonte) throw new Error(`Falta o desenho da animação src/animacoes/${nome}.svg.`);
  return montar(fonte, `src/animacoes/${nome}.svg`, "ilustracao diagrama animada");
}
