/**
 * Acesso aos posts: ordenação estável, título e subtítulo, tempo de leitura, agrupamentos e
 * navegação entre artigos. As páginas usam só estas funções, nunca getCollection direto.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { categoria as buscarCategoria, CATEGORIAS, type Categoria } from "../data/taxonomia";
import { serie as buscarSerie, type Serie } from "../data/series";
import { GUIA_JAVA, JAVA_LTS } from "../data/java";
import { url } from "./url";

export type Post = CollectionEntry<"posts">;

export interface Resumo {
  slug: string;
  url: string;
  titulo: string;
  subtitulo: string;
  /** Título inteiro do frontmatter, como as listas e os cards mostram (igual ao blog atual). */
  tituloCompleto: string;
  descricao: string;
  publicado: Date;
  atualizado?: Date;
  tags: string[];
  categoria?: Categoria;
  serie?: Serie;
  /** Nome que aparece como rótulo: a categoria ou a série. */
  rotulo: string;
  urlRotulo: string;
  /** Cor que faz o papel da categoria (tecido ou destaque da série, D23). */
  cor: string;
  minutos: number;
}

/** Divide "Assunto — complemento" em título e subtítulo (com inicial maiúscula). */
export function dividirTitulo(titulo: string): { titulo: string; subtitulo: string } {
  const [principal, ...resto] = titulo.split(" — ");
  const sub = resto.join(" — ");
  return { titulo: principal, subtitulo: sub ? sub.charAt(0).toUpperCase() + sub.slice(1) : "" };
}

/** Palavras ÷ 200, como no blog atual (conta o Markdown inteiro, com código). */
export function minutosDeLeitura(corpo: string): number {
  const palavras = corpo.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

export const urlPost = (slug: string) => url(`/posts/${slug}/`);
export const urlCategoria = (nome: string) => url(`/categories/${encodeURIComponent(nome)}/`);
export const urlTag = (nome: string) => url(`/tags/${encodeURIComponent(nome)}/`);
export const urlSerie = (s: Serie) => url(s.url ?? `/series/${s.chave}/`);

let cache: Post[] | undefined;

/**
 * Posts publicados, do mais novo para o mais antigo. Rascunhos só aparecem no dev.
 * Empate de data: ordem alfabética do slug, como o blog atual fazia de fato.
 */
export async function getPosts(): Promise<Post[]> {
  if (!cache) {
    const todos = await getCollection("posts", ({ data }) => (import.meta.env.PROD ? !data.draft : true));
    cache = todos.sort(
      (a, b) => b.data.published.getTime() - a.data.published.getTime() || a.id.localeCompare(b.id),
    );
  }
  return cache;
}

export function resumir(post: Post): Resumo {
  const { titulo, subtitulo } = dividirTitulo(post.data.title);
  const cat = post.data.category ? buscarCategoria(post.data.category) : undefined;
  const ser = buscarSerie(post.data.series);
  return {
    slug: post.id,
    url: urlPost(post.id),
    titulo,
    subtitulo,
    tituloCompleto: post.data.title,
    descricao: post.data.description,
    publicado: post.data.published,
    atualizado: post.data.updated,
    tags: post.data.tags,
    categoria: cat,
    serie: ser,
    rotulo: ser?.nome ?? cat?.nome ?? "",
    urlRotulo: ser ? urlSerie(ser) : cat ? urlCategoria(cat.nome) : url("/archive/"),
    cor: ser?.destaque ?? cat?.tecido ?? "#56605E",
    minutos: minutosDeLeitura(post.body ?? ""),
  };
}

export async function getResumos(): Promise<Resumo[]> {
  return (await getPosts()).map(resumir);
}

export interface Grupo {
  nome: string;
  posts: Resumo[];
}

/** Tags com os posts de cada uma: mais usadas primeiro, depois ordem alfabética. */
export async function getTags(): Promise<Grupo[]> {
  const mapa = new Map<string, Resumo[]>();
  for (const r of await getResumos()) for (const t of r.tags) mapa.set(t, [...(mapa.get(t) ?? []), r]);
  return [...mapa]
    .map(([nome, posts]) => ({ nome, posts }))
    .sort((a, b) => b.posts.length - a.posts.length || a.nome.localeCompare(b.nome, "pt-BR"));
}

/** Categorias na ordem do cadastro, só as que têm posts (posts de série ficam de fora). */
export async function getCategorias(): Promise<(Grupo & { categoria: Categoria })[]> {
  const resumos = await getResumos();
  return CATEGORIAS.map((c) => ({
    nome: c.nome,
    categoria: c,
    posts: resumos.filter((r) => r.categoria?.nome === c.nome),
  })).filter((g) => g.posts.length > 0);
}

/** Posts de uma série em ordem de leitura. Na série Java: o guia e depois as LTS em ordem crescente. */
export async function getPostsDaSerie(chave: string): Promise<Resumo[]> {
  const daSerie = (await getResumos()).filter((r) => r.serie?.chave === chave);
  if (chave === "java") {
    const ordem = [GUIA_JAVA, ...[...JAVA_LTS].sort((a, b) => a.version - b.version).map((v) => `java-${v.version}`)];
    return ordem.map((slug) => daSerie.find((r) => r.slug === slug)).filter((r): r is Resumo => Boolean(r));
  }
  return daSerie.sort((a, b) => a.publicado.getTime() - b.publicado.getTime());
}

/**
 * Anterior e próximo. Dentro de uma série, segue a ordem de leitura; fora dela, a data de
 * publicação (anterior = mais antigo), considerando todos os posts, como no blog atual.
 */
export async function getVizinhos(slug: string): Promise<{ anterior?: Resumo; proximo?: Resumo; naSerie?: Serie }> {
  const resumos = await getResumos();
  const atual = resumos.find((r) => r.slug === slug);
  if (atual?.serie) {
    const ordem = await getPostsDaSerie(atual.serie.chave);
    const i = ordem.findIndex((r) => r.slug === slug);
    return { anterior: ordem[i - 1], proximo: ordem[i + 1], naSerie: atual.serie };
  }
  const i = resumos.findIndex((r) => r.slug === slug);
  return { anterior: resumos[i + 1], proximo: resumos[i - 1] };
}
