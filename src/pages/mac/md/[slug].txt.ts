/**
 * O Markdown cru de cada post (rodada 3, C10), para o Editor (o arquivo aberto numa aba) e o Terminal
 * (`cat`): o arquivo de src/content/posts, com o frontmatter, como está no repositório. Gerado no build e
 * baixado só quando o arquivo abre. O conteúdo do post não muda (O1): é só uma leitura do arquivo.
 *
 * Sai como .txt (texto puro), e não .md: assim o servidor de qualquer hospedagem o entrega como texto.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getPosts } from "../../../lib/posts";

const arquivos = import.meta.glob<string>("../../../content/posts/*.{md,mdx}", { query: "?raw", import: "default" });

export const getStaticPaths = (async () => (await getPosts()).map((p) => ({ params: { slug: p.id } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug!;
  const carregar = arquivos[`../../../content/posts/${slug}.md`] ?? arquivos[`../../../content/posts/${slug}.mdx`];
  if (!carregar) return new Response("", { status: 404 });
  return new Response(await carregar(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
