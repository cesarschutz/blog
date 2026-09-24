/**
 * Marca no frontmatter (`temMatematica`) os posts que têm fórmula, para o CSS do KaTeX só
 * carregar neles (D6).
 */
function temNo(no, tipos) {
  if (tipos.includes(no.type)) return true;
  return Array.isArray(no.children) && no.children.some((filho) => temNo(filho, tipos));
}

export function remarkTemMatematica() {
  return (arvore, arquivo) => {
    const frontmatter = arquivo.data.astro?.frontmatter;
    if (frontmatter) frontmatter.temMatematica = temNo(arvore, ["math", "inlineMath"]);
  };
}
