/**
 * Os dados do computador (rodada 3, C10): a árvore dos livros, das séries, dos posts e das tags, para o
 * Finder, a Pré-Visualização, o Terminal e o Editor. Estático, gerado no build e buscado só quando o
 * leitor chega perto do ícone (hover, foco ou toque): nenhuma página carrega isto de saída.
 *
 * - `livros`: as categorias, na ordem dos volumes, e as séries (O10), com a cor, a pasta (o nome no
 *   Terminal e no Editor), a foto do livro deitado (D57) e os posts na ordem do livro;
 * - `posts`: cada post, com o nome do arquivo (o título com ".pdf" no Finder; o slug com ".md" ou ".mdx"
 *   no Terminal e no Editor) e a ilustração (o corpo do SVG e os recortes), que entra num painel tingido,
 *   como nos cards;
 * - `tags`: as tags, com os posts, a cor do livro em que mais aparecem (o ponto colorido das Etiquetas
 *   do Finder) e o desenho do ícone (D52);
 * - `papel`: as variáveis do tema claro (tokens.ts), que as páginas do PDF usam nos dois temas.
 */
import type { APIRoute } from "astro";
import { dadosDoLivro, montarLivros } from "../../lib/estante";
import { fotoAberta, fotoDeitada } from "../../lib/fotos";
import { dataPorExtenso, semMd } from "../../lib/formato";
import { ilustracao } from "../../lib/ilustracoes";
import { getTags } from "../../lib/posts";
import { mioloDaTag, slugDaTag } from "../../lib/tags-svg";
import { claro, PAINEL, TOKENS } from "../../styles/tokens";

const fontes = import.meta.glob("../../content/posts/*.{md,mdx}");
const extensao = (slug: string) => (`../../content/posts/${slug}.mdx` in fontes ? "mdx" : "md");

/** O nome do arquivo no Finder: o título, sem o que o sistema não aceita num nome, com ".pdf". */
const nomeDoPdf = (titulo: string) => `${titulo.replace(/[/:\\]/g, "-").trim()}.pdf`;

export const GET: APIRoute = async () => {
  const livros = await montarLivros();
  const vistos = new Set<string>();
  const posts = livros.flatMap((l) =>
    l.posts
      .filter((p) => !vistos.has(p.slug) && vistos.add(p.slug))
      .map((p) => {
        const desenho = ilustracao(p.slug);
        return {
          slug: p.slug,
          ext: extensao(p.slug),
          url: p.url,
          titulo: p.titulo,
          subtitulo: p.subtitulo,
          tituloCompleto: p.tituloCompleto,
          descricao: semMd(p.descricao),
          pdf: nomeDoPdf(p.titulo),
          data: dataPorExtenso(p.publicado),
          iso: p.publicado.toISOString().slice(0, 10),
          isoMod: (p.atualizado ?? p.publicado).toISOString().slice(0, 10),
          atualizado: p.atualizado ? dataPorExtenso(p.atualizado) : null,
          minutos: p.minutos,
          cor: p.cor,
          livro: p.livro,
          tags: p.tags,
          imagem: desenho ? { alt: desenho.alt, medio: desenho.recortes.medio, largo: desenho.recortes.largo, corpo: desenho.corpo } : null,
        };
      }),
  );

  const corDoLivro = new Map(livros.map((l) => [l.id, l.cores.cor]));
  const tags = (await getTags()).map((t) => {
    const conta = new Map<string, number>();
    for (const p of t.posts) conta.set(p.livro, (conta.get(p.livro) ?? 0) + 1);
    const livro = [...conta].sort((a, b) => b[1] - a[1])[0]?.[0];
    return {
      nome: t.nome,
      slug: slugDaTag(t.nome),
      href: `/tags/${encodeURIComponent(t.nome)}/`,
      cor: (livro && corDoLivro.get(livro)) ?? "",
      icone: mioloDaTag(t.nome),
      posts: t.posts.map((p) => p.slug),
    };
  });

  const dados = {
    papel:
      TOKENS.map((t) => `--${t}:${claro[t]};`).join("") +
      `--painel-mistura:${PAINEL.claro}%;--branco-no-escuro:0%;color-scheme:light;`,
    livros: livros
      .filter((l) => !l.serie || l.posts.length > 0)
      .map((l) => {
        const foto = fotoDeitada(l);
        const aberto = l.posts.length === 0 ? fotoAberta(l) : undefined;
        return {
          id: l.id,
          pasta: l.serie ? l.id.replace(/^serie-/, "") : l.slug!,
          nome: l.nome,
          serie: l.serie,
          href: l.href,
          cor: l.cores.cor,
          volume: l.volume ? String(l.volume).padStart(2, "0") : null,
          descricao: l.descricao,
          dados: dadosDoLivro(l),
          contagem: l.contagem,
          foto: foto ? { src: foto.src, largura: foto.largura, altura: foto.altura } : null,
          aberto: aberto ?? null,
          posts: l.posts.map((p) => p.slug),
        };
      }),
    posts,
    tags,
  };

  return new Response(JSON.stringify(dados), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
