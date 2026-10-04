/**
 * Rodada 3 do redesenho (área 8, a busca): a ficha de um resultado, buscada só quando o leitor passa
 * por ele na busca (Busca.astro, src/lib/busca/ficha.ts). Estático: um arquivo por post, para crescer
 * com o blog sem a busca baixar tudo de uma vez.
 *
 * - o livro do post (id, nome e "Vol. 05" ou "Série"), o tempo de leitura, a data e as tags;
 * - a ilustração no recorte médio (3:2), com o corpo do SVG, que a busca embute num painel tingido
 *   pela cor do livro, como nos cards.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { montarLivros } from "../../lib/estante";
import { dataPorExtenso } from "../../lib/formato";
import { ilustracao } from "../../lib/ilustracoes";
import { getResumos, type Resumo } from "../../lib/posts";

export const getStaticPaths = (async () => {
  const posts = await getResumos();
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as Resumo;
  const livro = (await montarLivros()).find((l) => l.id === post.livro);
  const desenho = ilustracao(post.slug);
  const volume = livro?.serie ? "Série" : livro?.volume ? `Vol. ${String(livro.volume).padStart(2, "0")}` : "";
  const dados = {
    slug: post.slug,
    titulo: post.titulo,
    livro: post.livro,
    livroNome: livro?.nome ?? post.rotulo,
    volume,
    minutos: post.minutos,
    data: dataPorExtenso(post.publicado),
    cor: post.cor,
    tags: post.tags,
    imagem: desenho ? { alt: desenho.alt, recorte: desenho.recortes.medio, corpo: desenho.corpo } : null,
  };
  return new Response(JSON.stringify(dados), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
