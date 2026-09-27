/**
 * Os ícones das tags (D52, B11), vizinhos dos ícones das lombadas (livros-svg.ts): um desenho por tag
 * em `docs/capas/tags/<slug>.svg`, no traço dos ícones das capas, gerado por
 * `scripts/desenho/tags.mjs` (regra em docs/capas/CAPAS.md, "Tags novas"). Entram inline, sem o
 * comentário e o <style> do arquivo (o traço fica em IconeTag.astro), na caixa fixa de 120 × 120: a
 * caixa é a mesma em todos, para os ícones terem o mesmo peso lado a lado (o desenho já vem centrado
 * nela), e não a caixa justa de cada um, como nas lombadas.
 *
 * Tag sem ícone quebra o build (a página /tags/ desenha todos), com o caminho do arquivo que falta e
 * onde está a regra: tag nova num post pede o ícone junto (skill `post`).
 */
const arquivos = import.meta.glob<string>("../../docs/capas/tags/*.svg", { query: "?raw", import: "default", eager: true });

/**
 * O nome do arquivo a partir do nome da tag: sem acento, minúsculo e com hífen ("Banco de Dados" →
 * "banco-de-dados", "Concorrência" → "concorrencia"). O script dos ícones usa a mesma regra.
 */
export const slugDaTag = (nome: string) =>
  nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const caminho = (slug: string) => `../../docs/capas/tags/${slug}.svg`;

export const temIconeDaTag = (nome: string) => caminho(slugDaTag(nome)) in arquivos;

const cache = new Map<string, string>();

/** O miolo do SVG da tag (sem a raiz, o comentário e o <style>), pronto para entrar inline. */
export function mioloDaTag(nome: string): string {
  const slug = slugDaTag(nome);
  const pronto = cache.get(slug);
  if (pronto) return pronto;
  const fonte = arquivos[caminho(slug)];
  if (!fonte) {
    throw new Error(
      `Falta o ícone da tag "${nome}": docs/capas/tags/${slug}.svg. Toda tag usada num post tem um ícone ` +
        `(D52): desenhe em scripts/desenho/tags.mjs e rode \`node scripts/desenho/tags.mjs ${slug}\` ` +
        `(regra em docs/capas/CAPAS.md, "Tags novas").`,
    );
  }
  const raiz = fonte.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const miolo = fonte
    .slice(fonte.indexOf(raiz) + raiz.length, fonte.lastIndexOf("</svg>"))
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/style="fill: /g, 'style="fill:')
    .trim();
  cache.set(slug, miolo);
  return miolo;
}
