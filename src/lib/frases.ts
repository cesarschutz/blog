/**
 * Frases de autores (D33), as mesmas 132 do blog atual (src/data/frases.json), mostradas num post-it
 * (PostIt.astro) na home e nos artigos. Cada página já sai com uma frase no HTML: a home, com a
 * primeira do arquivo (uma frase sobre o assunto do blog, como no blog atual); cada artigo, com uma
 * escolhida pelo nome dele, para variar de um para outro sem JavaScript. "outra frase" busca a lista
 * em /frases.json.
 */
import lista from "../data/frases.json";

export { tamanhoDaFrase } from "./tamanho-da-frase";

export interface Frase {
  texto: string;
  autor: string;
  /** O que o link do autor leva a ler (vira o título do link). */
  contexto: string;
  url: string;
}

export const FRASES: Frase[] = lista;

/** A frase que a página mostra sem JavaScript; `chave` é o slug do artigo (sem chave, a da home). */
export function fraseDaPagina(chave?: string): { frase: Frase; indice: number } {
  if (!chave) return { frase: FRASES[0], indice: 0 };
  let h = 0;
  for (const c of chave) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const indice = 1 + (h % (FRASES.length - 1));
  return { frase: FRASES[indice], indice };
}

