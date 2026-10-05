/**
 * As fotos dos livros (D57): imagens paradas geradas das pranchas 04 e 06 por
 * `node scripts/livros/fotos.mjs` (com o dev no ar), em `public/livros/fotos/`, com os dados em
 * `src/livros/fotos.json`.
 *
 * - O livro deitado (ficha "Do livro" do artigo): a foto e os oito lugares das etiquetas, na caixa da
 *   imagem. O site desenha por cima uma etiqueta por artigo (FotoDoLivro.astro).
 * - O livro aberto em branco (livro sem artigos e busca sem resultado, LivroEmBranco.astro).
 *
 * O número de artigos da lombada está na foto: quando ele ficar para trás (artigo novo), o build avisa
 * uma vez por livro, e a foto continua valendo (as etiquetas saem sempre dos posts de hoje).
 */
import dados from "../livros/fotos.json" with { type: "json" };
import type { Livro } from "./estante";
import { url } from "./url";

type Ponto = [number, number];
type Paradas = [number, number][];

export interface Etiqueta {
  contorno: Ponto[];
  luz: { de: Ponto; ate: Ponto; pretas: Paradas; brancas: Paradas };
  veu: { de: Ponto; ate: Ponto };
  dobra: Ponto[] | null;
  sombra: { contorno: Ponto[]; desvio: number };
}

interface FotoDeitada {
  src: string;
  largura: number;
  altura: number;
  /** A caixa da imagem nas unidades da cena (o viewBox das etiquetas). */
  caixa: [number, number];
  /** A face da capa: as etiquetas saem de baixo dela. */
  capa: Ponto[];
  /** A silhueta do livro: as sombras das etiquetas ficam só na mesa. */
  livro: Ponto[];
  /** Os oito lugares das etiquetas, na ordem de leitura; `puxadas`: as mesmas, mais para fora (a do artigo aberto). */
  etiquetas: Etiqueta[];
  puxadas: Etiqueta[];
}

interface DadosDeitado extends Omit<FotoDeitada, "src"> {
  artigos: number;
}

const DEITADO = dados.deitado as unknown as Record<string, DadosDeitado>;
const ABERTO = dados.aberto as Record<string, { largura: number; altura: number }>;

/** A chave da foto: o slug da categoria ou o id da série ("serie-java"). */
const chave = (l: Livro) => (l.serie ? l.id : l.slug!);

const avisados = new Set<string>();

export function fotoDeitada(l: Livro): FotoDeitada | undefined {
  const k = chave(l);
  const d = DEITADO[k];
  if (!d) {
    avisar(k, `sem a foto do livro deitado de "${l.nome}"`);
    return undefined;
  }
  if (d.artigos !== l.posts.length) avisar(k, `a foto de "${l.nome}" tem ${d.artigos} na lombada e o livro tem ${l.posts.length} artigos`);
  const { artigos: _, ...resto } = d;
  return { ...resto, src: url(`/livros/fotos/${k}-deitado.webp`) };
}

/** O livro aberto em branco: de um livro sem artigos, ou "busca" (o livro da marca). */
export function fotoAberta(qual: Livro | "busca"): { src: string; largura: number; altura: number } | undefined {
  const k = qual === "busca" ? "busca" : chave(qual);
  const d = ABERTO[k];
  if (!d) {
    avisar(`${k}-aberto`, `sem a foto do livro aberto de "${qual === "busca" ? "busca" : qual.nome}"`);
    return undefined;
  }
  return { ...d, src: url(`/livros/fotos/${k}-aberto.webp`) };
}

function avisar(k: string, texto: string) {
  if (avisados.has(k)) return;
  avisados.add(k);
  console.warn(`[fotos dos livros] ${texto}: rode node scripts/livros/fotos.mjs com o dev no ar (D57).`);
}

/** Os artigos do livro na ordem de leitura: a da série (as partes) ou a de publicação, do mais antigo ao mais novo. */
export const ordemDeLeitura = (l: Livro) => (l.serie ? l.posts : [...l.posts].sort((a, b) => a.publicado.getTime() - b.publicado.getTime()));

/** Onde o artigo está no livro, para o rótulo da ficha: "este é o 3º" ou, na série, "esta é a 7ª". */
export function posicaoNoLivro(l: Livro, urlDoArtigo: string): string | undefined {
  const i = ordemDeLeitura(l).findIndex((p) => p.url === urlDoArtigo);
  if (i < 0) return undefined;
  return l.serie ? `esta é a ${i + 1}ª` : `este é o ${i + 1}º`;
}

/**
 * O lugar da etiqueta de cada artigo (0 a 7), pela ordem de leitura: n artigos usam n lugares
 * espalhados por igual; passando de oito, artigos vizinhos dividem um lugar.
 */
export function lugarDaEtiqueta(i: number, n: number, lugares = 8): number {
  if (n <= 1) return 0;
  if (n > lugares) return Math.floor((i * lugares) / n);
  return Math.round((i * (lugares - 1)) / (n - 1));
}
