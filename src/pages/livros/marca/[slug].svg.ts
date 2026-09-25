/**
 * O desenho do livro como máscara da marca d'água (D39): o mesmo desenho da capa (ou o emblema da
 * revista), com o traço embutido no próprio arquivo, porque ele entra como `mask-image` e não recebe
 * o CSS da página. A máscara é de luminância: o traço é branco (aparece) e o papel que tapa os traços
 * de trás (--capa-papel, --serie-papel) é preto (some), como na capa. A cor vem de quem usa a
 * máscara (o fundo do elemento, na cor do livro). Assim a marca d'água não repete o desenho no HTML e fica no cache.
 * Categoria: /livros/marca/<slug>.svg; série: /livros/marca/serie-<chave>.svg.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { CATEGORIAS } from "../../../data/taxonomia";
import { SERIES } from "../../../data/series";
import { desenhoDaCapa, iconeDoLivro } from "../../../lib/livros-svg";

const TRACO = `<style>
  svg { --capa-papel: black; --serie-papel: black; --lombada-cor: black; }
  path, circle { vector-effect: non-scaling-stroke; }
  .cz-ln, .cz-gh, .cz-ghs { fill: none; stroke: white; stroke-linecap: round; stroke-linejoin: round; }
  .cz-fi { fill: white; stroke: none; }
  .cz-w1 { stroke-width: 1.6px; }
  .cz-w2 { stroke-width: 1.1px; }
  .cz-w3 { stroke-width: 0.7px; }
  .cz-gh { stroke-width: 1.1px; stroke-dasharray: 3 6; }
</style>`;

export const getStaticPaths = (() => [
  ...CATEGORIAS.map((c) => ({ params: { slug: c.slug }, props: { svg: desenhoDaCapa(c.slug) } })),
  ...SERIES.map((s) => ({ params: { slug: `serie-${s.chave}` }, props: { svg: iconeDoLivro(s.emblema) } })),
]) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(
    (props.svg as string).replace(/<svg ([^>]*)>/, (_, attrs: string) => `<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${TRACO}`),
    { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } },
  );
