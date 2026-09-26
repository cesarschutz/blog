/**
 * As páginas de dentro de cada livro (D49, protótipo D2), servidas à parte, como o desenho da capa
 * ([slug].svg.ts): o livro ampliado (LivroAmpliado.astro) só busca quando o leitor abre o livro, e
 * monta a guarda, o sumário, uma página por artigo, o fim do volume e o próximo livro da coleção.
 * Categoria: /livros/<slug>.json; série: /livros/serie-<chave>.json.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { montarLivros, type Livro } from "../../lib/estante";
import { dataPorExtenso, diaEMes, semMd } from "../../lib/formato";
import { iconeDoLivro } from "../../lib/livros-svg";

const volume = (l: Livro) => (l.volume ? String(l.volume).padStart(2, "0") : null);

export const getStaticPaths = (async () => {
  const livros = await montarLivros();
  return livros.map((l, i) => ({
    params: { slug: l.serie ? l.id : l.slug! },
    // O próximo da coleção, na ordem da estante; depois do último, o primeiro.
    props: { livro: l, proximo: livros[(i + 1) % livros.length] },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const l = props.livro as Livro;
  const p = props.proximo as Livro;
  const dados = {
    nome: l.nome,
    serie: l.serie,
    volume: volume(l),
    href: l.href,
    // O ícone do livro (o emblema, na série), em pé, para o ex-libris da guarda.
    icone: iconeDoLivro(l.revista?.emblema ?? l.slug!),
    posts: l.posts.map((post) => ({
      titulo: post.titulo,
      subtitulo: post.subtitulo,
      descricao: semMd(post.descricao),
      dia: diaEMes(post.publicado),
      data: dataPorExtenso(post.publicado),
      url: post.url,
    })),
    proximo: {
      nome: p.nome,
      serie: p.serie,
      volume: volume(p),
      frase: p.frase ?? p.descricao,
      href: p.href,
      destaque: p.cores.destaque,
    },
  };
  return new Response(JSON.stringify(dados), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
