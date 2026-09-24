/**
 * O desenho grande da capa de cada livro (D30) e o emblema de cada revista (D32), servidos à parte:
 * na home, a gaveta só busca quando o livro abre e põe inline na capa (Capa.astro e Gaveta.astro).
 * Saem de docs/capas já preparados (src/lib/livros-svg.ts). Categoria: /livros/<slug>.svg; série:
 * /livros/serie-<chave>.svg.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { CATEGORIAS } from "../../data/taxonomia";
import { SERIES } from "../../data/series";
import { desenhoDaCapa, iconeDoLivro } from "../../lib/livros-svg";

export const getStaticPaths = (() => [
  ...CATEGORIAS.map((c) => ({ params: { slug: c.slug }, props: { svg: desenhoDaCapa(c.slug) } })),
  ...SERIES.map((s) => ({ params: { slug: `serie-${s.chave}` }, props: { svg: iconeDoLivro(s.emblema) } })),
]) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response((props.svg as string).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
