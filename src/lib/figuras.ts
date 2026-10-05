/**
 * As figuras dos posts (D58): diagramas, gráficos e as animações próprias (GSAP), em
 * src/figuras/<slug>/<nome>.svg e src/animacoes/<slug>/<nome>.svg, e os logos das ferramentas, em
 * src/marcas/<nome>.svg (viewBox 0 0 100 100).
 *
 * Um logo entra numa figura por um marcador, que vira o desenho do logo na hora do build:
 *   <g data-marca="kubernetes" transform="translate(40 60) scale(.8)"/>
 * Assim o logo é desenhado uma vez só e reaparece em qualquer figura, do tamanho que ela pedir.
 *
 * Todo logo passa pela regra de marca do dono (D64, src/marcas/regras.json): o redesenho à mão só onde a
 * política permite; onde ela pede o arquivo oficial, ele entra sem alteração (src/marcas/oficiais/); onde
 * ela não permite o logo, ou a marca ainda não foi conferida, o build quebra com o motivo.
 */
import regras from "../marcas/regras.json";
const figuras = import.meta.glob<string>("../figuras/**/*.svg", { query: "?raw", import: "default", eager: true });
const animacoes = import.meta.glob<string>("../animacoes/**/*.svg", { query: "?raw", import: "default", eager: true });
const marcas = import.meta.glob<string>("../marcas/*.svg", { query: "?raw", import: "default", eager: true });
const oficiais = import.meta.glob<string>("../marcas/oficiais/*.svg", { query: "?url", import: "default", eager: true });

type Uso = "redesenho" | "oficial" | "nao";
interface RegraDeMarca {
  marca: string;
  dono: string;
  texto: Uso;
  diagrama: Uso;
  condicoes: string;
  fontes: string[];
  conferido: string;
  certeza: string;
}
type DesenhoDaMarca = { tipo: "redesenho"; miolo: string } | { tipo: "oficial"; url: string };

const raizDe = (fonte: string) => fonte.match(/<svg\b[^>]*>/)?.[0] ?? "";

/** O conteúdo de um SVG, sem a raiz e sem comentários. */
function miolo(fonte: string): string {
  const raiz = raizDe(fonte);
  return fonte
    .slice(fonte.indexOf(raiz) + raiz.length, fonte.lastIndexOf("</svg>"))
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

/** A regra de marca registrada (src/marcas/regras.json), ou undefined se a marca não foi conferida. */
function regraDaMarca(nome: string): RegraDeMarca | undefined {
  const regra = (regras as Record<string, unknown>)[nome];
  return regra && typeof regra === "object" ? (regra as RegraDeMarca) : undefined;
}

/**
 * O logo de uma ferramenta, no texto (o ícone ao lado do nome) ou num diagrama, conforme a regra de marca:
 * o redesenho da casa (src/marcas/<nome>.svg) ou o arquivo oficial (src/marcas/oficiais/<nome>.svg).
 */
export function marca(nome: string, onde: "texto" | "diagrama"): DesenhoDaMarca {
  const regra = regraDaMarca(nome);
  if (!regra) {
    throw new Error(
      `O logo "${nome}" não tem a regra de marca conferida. Antes de usar, leia a política oficial do dono da marca e registre o resultado em src/marcas/regras.json (skill figura, "Logos das ferramentas", D64).`,
    );
  }
  const uso = regra[onde];
  if (uso === "nao") {
    throw new Error(
      `A marca ${regra.marca} (${regra.dono}) não permite o logo ${onde === "texto" ? "no texto" : "em diagrama"}: use só o nome. ${regra.condicoes} Fonte: ${regra.fontes[0]} (conferido em ${regra.conferido}).`,
    );
  }
  if (uso === "oficial") {
    const url = oficiais[`../marcas/oficiais/${nome}.svg`];
    if (!url) {
      throw new Error(
        `A marca ${regra.marca} só permite o arquivo oficial, sem alterar: baixe-o da fonte (${regra.fontes.join(", ")}) para src/marcas/oficiais/${nome}.svg, com o OK do Cesar.`,
      );
    }
    return { tipo: "oficial", url };
  }
  const fonte = marcas[`../marcas/${nome}.svg`];
  if (!fonte) throw new Error(`Falta o logo src/marcas/${nome}.svg.`);
  return { tipo: "redesenho", miolo: miolo(fonte) };
}

/** Troca cada marcador <g data-marca="x" …/> (ou <g data-marca="x" …></g>) pelo desenho do logo. */
export function comMarcas(fonte: string): string {
  return fonte.replace(/<g\b([^>]*?)\bdata-marca="([^"]+)"([^>]*?)\s*(?:\/>|>\s*<\/g>)/g, (_, antes: string, nome: string, depois: string) => {
    let atributos = `${antes} ${depois}`.replace(/\s+/g, " ").trim();
    const classe = atributos.match(/\bclass="([^"]*)"/)?.[1];
    atributos = atributos.replace(/\s*\bclass="[^"]*"/, "").trim();
    const classes = ["marca", `marca-${nome}`, classe].filter(Boolean).join(" ");
    const desenho = marca(nome, "diagrama");
    // O arquivo oficial entra como imagem, sem nenhuma alteração (nem o traço nem as cores da casa).
    const conteudo = desenho.tipo === "oficial" ? `<image href="${desenho.url}" width="100" height="100" preserveAspectRatio="xMidYMid meet"/>` : desenho.miolo;
    return `<g${atributos ? ` ${atributos}` : ""} class="${classes}">${conteudo}</g>`;
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
