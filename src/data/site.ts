/**
 * Recursos opcionais e desligados (briefing §5.3), como no blog atual: ficam prontos e só ligam
 * quando configurados aqui.
 * - Estatísticas com GoatCounter: o código do site (o "cesarschutz" de cesarschutz.goatcounter.com).
 * - Comentários com Giscus (Discussions do GitHub): habilitar Discussions no repositório, instalar o
 *   app Giscus e copiar os quatro valores que https://giscus.app mostra.
 */
export const ESTATISTICAS = {
  goatcounter: "",
};

export const COMENTARIOS = {
  repo: "",
  repoId: "",
  categoria: "",
  categoriaId: "",
};

export const COMENTARIOS_LIGADOS = Object.values(COMENTARIOS).every(Boolean);
