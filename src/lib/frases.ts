/**
 * Frases de autores (D33), as 125 revisadas contra a fonte (src/data/frases.json), mostradas num
 * post-it (PostIt.astro) na home e nos artigos. Cada frase tem `temas`: as tags e o livro
 * ("livro-dados", "serie-java") a que ela se aplica, ou "geral" (D37). A home sorteia entre todas e
 * sai no HTML com a primeira do arquivo (uma frase sobre o assunto do blog). Cada artigo sorteia só
 * entre as do assunto dele (conjuntoDoArtigo) e sai no HTML com uma delas, escolhida pelo nome dele.
 * "outra frase" busca a lista em /frases.json.
 */
import lista from "../data/frases.json";

export { tamanhoDaFrase } from "./tamanho-da-frase";

export interface Frase {
  texto: string;
  autor: string;
  /** O que o link do autor leva a ler (vira o título do link). */
  contexto: string;
  url: string;
  /** Tags e livro a que a frase se aplica, ou "geral". */
  temas: string[];
}

export const FRASES: Frase[] = lista;

/**
 * As frases de um artigo (D37), pelos `temas` dele (as tags e o livro): cada tag em comum vale 2 e o
 * livro, 1. Entram as que têm pelo menos a nota da 3ª melhor, então são sempre 3 ou mais, e as mais
 * ligadas ao assunto; sem nenhuma em comum, as "geral".
 */
export function conjuntoDoArtigo(temas: string[]): number[] {
  const nota = (f: Frase) => f.temas.reduce((soma, t) => soma + (temas.includes(t) ? (/^(livro|serie)-/.test(t) ? 1 : 2) : 0), 0);
  const notas = FRASES.map((f, i) => ({ i, n: nota(f) })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
  if (!notas.length) return FRASES.flatMap((f, i) => (f.temas.includes("geral") ? [i] : []));
  const corte = notas[Math.min(2, notas.length - 1)].n;
  return notas.filter((x) => x.n >= corte).map((x) => x.i).sort((a, b) => a - b);
}

/**
 * A frase que a página mostra sem JavaScript. Sem `chave`, a da home (a primeira do arquivo); num
 * artigo, uma do conjunto dele, escolhida pelo slug (`chave`), para variar de um artigo para outro.
 */
export function fraseDaPagina(chave?: string, conjunto?: number[]): { frase: Frase; indice: number } {
  if (!chave) return { frase: FRASES[0], indice: 0 };
  const opcoes = conjunto?.length ? conjunto : FRASES.map((_, i) => i).slice(1);
  let h = 0;
  for (const c of chave) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const indice = opcoes[h % opcoes.length];
  return { frase: FRASES[indice], indice };
}

