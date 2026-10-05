/**
 * Os dados do computador (/mac/dados.json, gerado no build em src/pages/mac/) e as peças comuns aos apps:
 * os tipos, a busca (uma vez), o texto cru de cada post e o desenho do post num painel tingido.
 */
import { url } from "../lib/url";

export interface LivroM {
  id: string;
  /** O nome da pasta no Terminal e no Editor ("arquitetura-de-software", "java"). */
  pasta: string;
  nome: string;
  serie: boolean;
  href: string;
  cor: string;
  volume: string | null;
  descricao: string;
  dados: string;
  contagem: string;
  foto: { src: string; largura: number; altura: number } | null;
  aberto: { src: string; largura: number; altura: number } | null;
  posts: string[];
}

export interface PostM {
  slug: string;
  ext: "md" | "mdx";
  url: string;
  titulo: string;
  subtitulo: string;
  tituloCompleto: string;
  descricao: string;
  /** O nome do arquivo no Finder: o título com ".pdf". */
  pdf: string;
  data: string;
  iso: string;
  /** A data da última mudança (a revisão, ou a publicação), para "Recentes" e a lista do Finder. */
  isoMod: string;
  atualizado: string | null;
  minutos: number;
  cor: string;
  livro: string;
  tags: string[];
  imagem: { alt: string; medio: string; largo: string; corpo: string } | null;
}

export interface TagM {
  nome: string;
  slug: string;
  href: string;
  cor: string;
  icone: string;
  posts: string[];
}

export interface DadosM {
  papel: string;
  livros: LivroM[];
  posts: PostM[];
  tags: TagM[];
}

let dados: Promise<DadosM> | undefined;

/** Os dados, buscados uma vez só (a falha libera uma nova tentativa). */
export function carregarDados(): Promise<DadosM> {
  dados ??= fetch(url("/mac/dados.json")).then((r) => {
    if (!r.ok) throw new Error(`/mac/dados.json: ${r.status}`);
    return r.json() as Promise<DadosM>;
  });
  dados.catch(() => (dados = undefined));
  return dados;
}

const textos = new Map<string, Promise<string>>();

/** O Markdown cru do post (o arquivo do repositório, com o frontmatter), para o Editor e o `cat`. */
export function textoDoPost(slug: string): Promise<string> {
  let p = textos.get(slug);
  if (!p) {
    p = fetch(url(`/mac/md/${encodeURIComponent(slug)}.txt`)).then((r) => {
      if (!r.ok) throw new Error(`/mac/md/${slug}.txt: ${r.status}`);
      return r.text();
    });
    p.catch(() => textos.delete(slug));
    textos.set(slug, p);
  }
  return p;
}

export const escapar = (texto: string) =>
  texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A ilustração do post como nos cards: o SVG do site, com as classes e as variáveis dele. */
export function desenhoDoPost(p: PostM, recorte: "medio" | "largo", classe = "cartao"): string {
  if (!p.imagem) return "";
  return `<svg class="ilustracao ${classe}" viewBox="${p.imagem[recorte]}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" style="--cor:${p.cor}">${p.imagem.corpo}</svg>`;
}

/** O livro deitado (a foto da D57), como <img>. */
export function fotoDoLivro(l: LivroM, classe = ""): string {
  const f = l.posts.length === 0 && l.aberto ? l.aberto : l.foto;
  if (!f) return "";
  return `<img class="${classe}" src="${url(f.src)}" width="${f.largura}" height="${f.altura}" alt="" decoding="async">`;
}

export interface Indices {
  livro: Map<string, LivroM>;
  post: Map<string, PostM>;
  /** O livro de cada post (um post pertence a um livro só). */
  livroDoPost: Map<string, LivroM>;
}

let indices: Indices | undefined;

export function indexar(d: DadosM): Indices {
  if (indices) return indices;
  const livroDoPost = new Map<string, LivroM>();
  for (const l of d.livros) for (const s of l.posts) if (!livroDoPost.has(s)) livroDoPost.set(s, l);
  indices = {
    livro: new Map(d.livros.map((l) => [l.id, l])),
    post: new Map(d.posts.map((p) => [p.slug, p])),
    livroDoPost,
  };
  return indices;
}
