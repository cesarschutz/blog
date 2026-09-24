/**
 * RSS (/rss.xml): todos os posts, com o texto completo nos 10 mais recentes (D7), como no blog atual.
 * Post .md sai do `rendered.html`; post .mdx não tem, então é renderizado pela Container API do Astro
 * (D21), com `locals.rss`: as lousas viram texto e link, porque leitor de feed não roda script nem CSS.
 */
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { getContainerRenderer } from "@astrojs/mdx/container-renderer";
import { getPosts, resumir, type Post } from "../lib/posts";
import { semMd } from "../lib/formato";
import { url } from "../lib/url";

const COM_TEXTO_COMPLETO = 10;

export async function GET(contexto: APIContext) {
  const origem = new URL(url("/"), contexto.site).href.replace(/\/$/, "");
  const paraLeitor = (html: string, endereco: string) => {
    // Notas laterais: no leitor de RSS não há margem, então vão para o fim, numeradas.
    const notas: string[] = [];
    const corpo = html
      .replace(/<span class="nota-lateral"[^>]*><span class="numero-nota"[^>]*>(\d+)<\/span>\s*([\s\S]*?)<\/span>/g, (_, n, texto) => {
        notas.push(`<p><sup>${n}</sup> ${texto}</p>`);
        return "";
      })
      // A apresentação (os slides são imagens) vira um link para ela no site.
      .replace(/<section class="apresentacao"[\s\S]*?<\/section>/g, `<p><a href="${endereco}#apresentacao">Apresentação em slides, no site</a>.</p>`)
      // Botões (Copiar do código), scripts e estilos não fazem sentido num leitor de RSS.
      .replace(/<button[^>]*>[\s\S]*?<\/button>/g, "")
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, "")
      .replace(/<link\b[^>]*>/g, "");
    return `${corpo}${notas.length ? `<hr>${notas.join("")}` : ""}`.replace(/(href|src)="\/(?!\/)/g, `$1="${new URL(contexto.site!).origin}/`);
  };

  const posts = await getPosts();
  let container: AstroContainer | undefined;
  const htmlDoMdx = async (post: Post, endereco: string) => {
    container ??= await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
    const { Content } = await render(post);
    return container.renderToString(Content, { locals: { rss: { endereco } } });
  };
  const textos = await Promise.all(
    posts.map((post, i) => (i < COM_TEXTO_COMPLETO ? (post.rendered?.html ?? htmlDoMdx(post, resumir(post).url)) : undefined)),
  );
  return rss({
    title: "Cesar Schutz",
    description: "Artigos de Cesar Schutz, arquiteto de soluções, sobre arquitetura de software, Java e sistemas de pagamento.",
    site: origem,
    items: posts.map((post, i) => {
      const resumo = resumir(post);
      const html = textos[i];
      return {
        title: post.data.title,
        pubDate: post.data.published,
        description: semMd(post.data.description),
        link: resumo.url,
        categories: [resumo.rotulo, ...post.data.tags],
        content: html ? paraLeitor(html, resumo.url) : undefined,
      };
    }),
    customData: "<language>pt-BR</language>",
  });
}
