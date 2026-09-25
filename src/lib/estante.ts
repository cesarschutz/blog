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
  /** "7 artigos · o último em 2026", "5 artigos · de 2025 a 2026", "7 edições" (série) ou "Ainda sem artigos". */
  contagem: string;
}

function contagem(posts: Resumo[], serie: boolean): string {
  if (posts.length === 0) return "Ainda sem artigos";
  if (serie) return `${posts.length} ${posts.length === 1 ? "edição" : "edições"}`;
  const anos = posts.map((p) => p.publicado.getUTCFullYear());
  const [min, max] = [Math.min(...anos), Math.max(...anos)];
  const quantos = `${posts.length} ${posts.length === 1 ? "artigo" : "artigos"}`;
  // "7 artigos, 2026" não dizia o que o ano era (D37).
  if (min !== max) return `${quantos} · de ${min} a ${max}`;
  return posts.length === 1 ? `${quantos} · de ${max}` : `${quantos} · o último em ${max}`;
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
            cores: { cor: s.destaque, tinta: PAPEL, destaque: s.destaque, papel: PAPEL, tintaPapel: TINTA_PAPEL, destaqueTexto: s.destaqueTexto },
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
  `--livro-papel:${l.cores.papel};--livro-tinta-papel:${l.cores.tintaPapel};` +
  `--livro-cor-texto:${l.cores.corTexto ?? l.cores.cor};--livro-destaque-texto:${l.cores.destaqueTexto ?? l.cores.destaque}`;

/** Texto que o filtro do sumário procura: título, subtítulo e tags, sem acento. */
export const textoDoFiltro = (p: Resumo) => normalizar(`${p.titulo} ${p.subtitulo} ${p.tags.join(" ")}`);

/**
 * Largura natural da estante, em unidades da referência (as medidas de estante.css): 16 de respiro de
 * cada lado, 6 entre os livros e o aparador (12 de largura, 43 de margem à esquerda para o livro
 * inclinado encostar no alto dele e 25 à direita). Em px, vezes o teto de --u (0,42). A estante de
 * filtro (D33) pode não ter o aparador.
 */
export function larguraDaEstante(livros: Livro[], comAparador = true): number {
  const itens = livros.length + (comAparador ? 1 : 0);
  const aparador = comAparador ? 43 + 12 + 25 : 0;
  return Math.ceil(2 * 16 + livros.reduce((soma, l) => soma + l.emPe.largura, 0) + 6 * (itens - 1) + aparador);
}

/** Linha curta do livro, para legendas (D33): "Volume 01 · 6 artigos" ou "Série · 7 edições". */
export function dadosDoLivro(l: Livro): string {
  const n = l.posts.length;
  if (l.serie) return `Série · ${n} ${n === 1 ? "edição" : "edições"}`;
  const volume = `Volume ${String(l.volume).padStart(2, "0")}`;
  return n === 0 ? `${volume} · ainda sem artigos` : `${volume} · ${n} ${n === 1 ? "artigo" : "artigos"}`;
}
