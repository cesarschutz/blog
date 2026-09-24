/**
 * Ilustrações dos posts (briefing §6): um SVG por post em src/ilustracoes/<slug>.svg. A raiz traz o
 * texto alternativo (aria-label) e os recortes (data-largo, data-medio, data-quadrado e data-og,
 * como "x y largura altura" no espaço do desenho). Todos os lugares usam recortes do mesmo arquivo.
 * As regras de desenho ficam na skill `desenho`; a validação, em scripts/desenho/validar.mjs.
 */
const arquivos = import.meta.glob<string>("../ilustracoes/*.svg", { query: "?raw", import: "default", eager: true });

export type Recorte = "largo" | "medio" | "quadrado" | "og";

/** Proporção de cada recorte (largura / altura). O de compartilhamento é livre. */
export const PROPORCOES: Record<Exclude<Recorte, "og">, number> = { largo: 1100 / 468, medio: 3 / 2, quadrado: 1 };

export interface Ilustracao {
  alt: string;
  recortes: Record<Recorte, string>;
  /** Conteúdo do SVG, sem a raiz. */
  corpo: string;
}

export function ilustracao(slug: string): Ilustracao | undefined {
  const fonte = arquivos[`../ilustracoes/${slug}.svg`];
  if (!fonte) return undefined;
  const raiz = fonte.match(/<svg\b[^>]*>/)?.[0];
  if (!raiz) throw new Error(`src/ilustracoes/${slug}.svg não tem raiz <svg>.`);
  const atributo = (nome: string) => raiz.match(new RegExp(`\\s${nome}="([^"]*)"`))?.[1];
  const recorte = (nome: Recorte) => {
    const valor = atributo(`data-${nome}`);
    if (!valor) throw new Error(`src/ilustracoes/${slug}.svg não declara o recorte data-${nome}.`);
    return valor;
  };
  return {
    alt: atributo("aria-label") ?? "",
    recortes: { largo: recorte("largo"), medio: recorte("medio"), quadrado: recorte("quadrado"), og: recorte("og") },
    corpo: fonte.slice(fonte.indexOf(raiz) + raiz.length, fonte.lastIndexOf("</svg>")).trim(),
  };
}

export const temIlustracao = (slug: string) => `../ilustracoes/${slug}.svg` in arquivos;
