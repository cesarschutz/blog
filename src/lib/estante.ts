/**
 * Os livros (D30, D32): um por categoria, na ordem dos volumes da coleção ("edição de estudo"), e um
 * por série (revista técnica). Os dados e as medidas vêm de `docs/capas/livros.json` (pela taxonomia
 * e pelo cadastro das séries) e as cores, de `docs/capas/cores.js`. A regra visual está em
 * `docs/capas/CAPAS.md`. O número das lombadas, da capa da revista e da página do livro é o total de
 * artigos, contado pelos posts; sem artigos, ele não aparece.
 */
import { PAPEL, TINTA_PAPEL } from "../../docs/capas/cores.js";
import { CATEGORIAS, type CoresDoLivro } from "../data/taxonomia";
import { SERIES } from "../data/series";
import { normalizar } from "./busca/tipos";
import { getPostsDaSerie, getResumos, urlCategoria, urlSerie, type Resumo } from "./posts";

export interface Livro {
  /** Único na página: também é o view-transition-name (D29). */
  id: string;
  nome: string;
  href: string;
  serie: boolean;
  /** Arquivos de desenho e ícone em docs/capas (só categorias). */
  slug?: string;
  /** Volume da coleção (só categorias). */
  volume?: number;
  /** O título como quebra na capa e nas lombadas. */
  linhas: string[];
  /** Corpo e entrelinha do título na capa, na referência de 480px (só categorias). */
  corpoNaCapa?: number;
  entrelinhaNaCapa?: number;
  /** A frase da capa (só categorias). */
  frase?: string;
  /** Subtítulo completo, usado nas páginas. */
  descricao: string;
  cores: CoresDoLivro;
  /** A revista (só séries): título dividido, número de capa, edições, tarja e emblema. */
  revista?: {
    numero: number;
    tituloPrincipal: string;
    complemento: string;
    numeroDeCapa: string;
    rotuloDoNumero: string;
    edicoes: string[];
    guia?: { titulo: string; linha: string };
    emblema: string;
  };
  emPe: { altura: number; largura: number };
  deitada: { comprimento: number; espessura: number; deslocamento: number };
  posts: Resumo[];
  /** "7 artigos, 2026", "5 artigos, de 2025 a 2026", "7 edições" (série) ou "Ainda sem artigos". */
  contagem: string;
}

function contagem(posts: Resumo[], serie: boolean): string {
  if (posts.length === 0) return "Ainda sem artigos";
  if (serie) return `${posts.length} ${posts.length === 1 ? "edição" : "edições"}`;
  const anos = posts.map((p) => p.publicado.getUTCFullYear());
  const [min, max] = [Math.min(...anos), Math.max(...anos)];
  const quantos = `${posts.length} ${posts.length === 1 ? "artigo" : "artigos"}`;
  return min === max ? `${quantos}, ${max}` : `${quantos}, de ${min} a ${max}`;
}

let cache: Promise<Livro[]> | undefined;

/** Todos os livros: as categorias (inclusive as ainda sem artigos) e, depois, as séries com posts. */
export function montarLivros(): Promise<Livro[]> {
  cache ??= (async () => {
    const resumos = await getResumos();
    const categorias = [...CATEGORIAS].sort((a, b) => a.volume - b.volume);
    const series = await Promise.all(SERIES.map(async (s) => ({ s, posts: await getPostsDaSerie(s.chave) })));
    return [
      ...categorias.map((c): Livro => {
        const posts = resumos.filter((r) => r.categoria?.nome === c.nome);
        return {
          id: `livro-${c.slug}`,
          nome: c.nome,
          href: urlCategoria(c.nome),
          serie: false,
          slug: c.slug,
          volume: c.volume,
          linhas: c.linhas,
          corpoNaCapa: c.corpoNaCapa,
          entrelinhaNaCapa: c.entrelinhaNaCapa,
          frase: c.frase,
          descricao: c.descricao,
          cores: c.cores,
          emPe: c.emPe,
          deitada: c.deitada,
          posts,
          contagem: contagem(posts, false),
        };
      }),
      ...series
        .filter(({ posts }) => posts.length > 0)
        .map(
          ({ s, posts }): Livro => ({
            id: `serie-${s.chave}`,
            nome: s.nome,
            href: urlSerie(s),
            serie: true,
            linhas: [s.nome],
            descricao: s.descricao,
            // A revista é papel com o destaque: a faixa do topo, o complemento, o número e a barra.
            cores: { cor: s.destaque, tinta: PAPEL, destaque: s.destaque, papel: PAPEL, tintaPapel: TINTA_PAPEL },
            revista: {
              numero: s.numero,
              tituloPrincipal: s.tituloPrincipal,
              complemento: s.complemento,
              numeroDeCapa: s.numeroDeCapa,
              rotuloDoNumero: s.rotuloDoNumero,
              edicoes: s.edicoes,
              guia: s.guia,
              emblema: s.emblema,
            },
            emPe: s.emPe,
            deitada: s.deitada,
            posts,
            contagem: contagem(posts, true),
          }),
        ),
    ];
  })();
  return cache;
}

/** Variáveis de cor do livro, para o style de lombadas e capas. */
export const coresDoLivroCss = (l: Livro) =>
  `--livro-cor:${l.cores.cor};--livro-tinta:${l.cores.tinta};--livro-destaque:${l.cores.destaque};` +
  `--livro-papel:${l.cores.papel};--livro-tinta-papel:${l.cores.tintaPapel}`;

/** Texto que o filtro do sumário procura: título, subtítulo e tags, sem acento. */
export const textoDoFiltro = (p: Resumo) => normalizar(`${p.titulo} ${p.subtitulo} ${p.tags.join(" ")}`);
