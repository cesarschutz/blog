/**
 * Livros da estante da home (briefing §5.1): um por categoria e um por série, com a espessura da
 * lombada acompanhando o número de posts: min(104, 34 + 14·log2(1+n)) px, como no protótipo.
 */
import { SERIES } from "../data/series";
import { normalizar } from "./busca/tipos";
import { getCategorias, getPostsDaSerie, urlCategoria, urlSerie, type Resumo } from "./posts";

export interface Livro {
  id: string;
  nome: string;
  href: string;
  tecido: string;
  texto: string;
  fita?: string;
  altura: number;
  largura: number;
  descricao: string;
  serie: boolean;
  posts: Resumo[];
  /** "7 artigos, 2026", "5 artigos, de 2025 a 2026" ou "7 partes". */
  contagem: string;
  /** Tamanho do nome na lombada (em unidades de --u, que valem 1px na estante inteira), para caber na altura. */
  tamanhoNome: number;
}

/**
 * O nome vai na vertical: cabe se letras × largura média ≤ altura livre. Largura média medida na
 * Besley: 0,62 a 0,73 em em pé (negrito) e 0,56 em no itálico da série. Espaço fixo: faixas,
 * contagem e margens.
 */
function tamanhoDoNome(nome: string, altura: number, serie: boolean): number {
  const livre = altura - (serie ? 107 : 92);
  const porLetra = serie ? 0.58 : 0.66;
  return Math.min(16, Math.floor((livre / (nome.length * porLetra)) * 10) / 10);
}

const LARGURA_DA_SERIE = 62;
export const larguraDaLombada = (n: number) => Math.min(104, Math.round(34 + 14 * Math.log2(1 + n)));

function contagem(posts: Resumo[], serie: boolean): string {
  if (serie) return `${posts.length} ${posts.length === 1 ? "parte" : "partes"}`;
  const anos = posts.map((p) => p.publicado.getUTCFullYear());
  const [min, max] = [Math.min(...anos), Math.max(...anos)];
  const quantos = `${posts.length} ${posts.length === 1 ? "artigo" : "artigos"}`;
  return min === max ? `${quantos}, ${max}` : `${quantos}, de ${min} a ${max}`;
}

export async function montarLivros(): Promise<Livro[]> {
  const categorias = await getCategorias();
  const series = await Promise.all(SERIES.map(async (s) => ({ s, posts: await getPostsDaSerie(s.chave) })));
  return [
    ...categorias.map(({ categoria, posts }, i) => ({
      id: `livro-${i}`,
      nome: categoria.nome,
      href: urlCategoria(categoria.nome),
      tecido: categoria.tecido,
      texto: categoria.texto,
      altura: categoria.alturaLombada,
      largura: larguraDaLombada(posts.length),
      descricao: categoria.descricao,
      serie: false,
      posts,
      contagem: contagem(posts, false),
      tamanhoNome: tamanhoDoNome(categoria.nome, categoria.alturaLombada, false),
    })),
    ...series
      .filter(({ posts }) => posts.length > 0)
      .map(({ s, posts }) => ({
        id: `serie-${s.chave}`,
        nome: s.nome,
        href: urlSerie(s),
        tecido: s.encadernacao,
        texto: s.letras,
        fita: s.fita,
        altura: s.alturaLombada,
        largura: LARGURA_DA_SERIE,
        descricao: s.descricao,
        serie: true,
        posts,
        contagem: contagem(posts, true),
        tamanhoNome: tamanhoDoNome(s.nome, s.alturaLombada, true),
      })),
  ];
}

/** Texto que o filtro do sumário procura: título, subtítulo e tags, sem acento. */
export const textoDoFiltro = (p: Resumo) => normalizar(`${p.titulo} ${p.subtitulo} ${p.tags.join(" ")}`);

/** Tamanho do título na capa: pela palavra mais longa (mínimo de 8 letras), até 13cqw. */
export const tamanhoDoTituloDaCapa = (nome: string) =>
  Math.min(13, 74 / (0.64 * Math.max(...nome.split(" ").map((p) => p.length), 8))).toFixed(2);
