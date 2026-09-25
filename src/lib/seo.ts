/**
 * Dados estruturados das páginas de lista (D37): categoria, série, tag e todos os artigos são uma
 * CollectionPage do site. O artigo tem o seu (BlogPosting e a trilha) em posts/[slug].astro; a home,
 * o WebSite.
 */
export function paginaDeColecao(nome: string, descricao: string, endereco: URL | string, site: URL | undefined) {
  const url = new URL(endereco, site).href;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: nome,
    description: descricao,
    url,
    inLanguage: "pt-BR",
    isPartOf: { "@type": "WebSite", name: "Cesar Schutz", url: new URL("/", site).href },
  };
}
