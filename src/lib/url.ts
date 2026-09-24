/**
 * Caminho interno respeitando o `base` do Astro. A pré-visualização vive em /novo-blog/ (D26);
 * em produção o base é "/". Todo link interno de componente passa por aqui; os links dentro do
 * Markdown são ajustados por um plugin (Fase 2).
 */
export function url(caminho: string): string {
  if (!caminho.startsWith("/") || caminho.startsWith("//")) return caminho;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${caminho}`;
}
