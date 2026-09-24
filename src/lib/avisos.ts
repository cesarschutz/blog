/**
 * Os cinco avisos do briefing (§5.3): nome exibido e marcadores aceitos no Markdown, em português
 * e em inglês (`> [!DICA]` ou `> [!TIP]`). Usados por Aviso.astro e por src/plugins/rehype-avisos.mjs.
 */
export type TipoAviso = "nota" | "dica" | "importante" | "atencao" | "cuidado";

export const NOMES_DOS_AVISOS: Record<TipoAviso, string> = {
  nota: "Nota",
  dica: "Dica",
  importante: "Importante",
  atencao: "Atenção",
  cuidado: "Cuidado",
};

/** Marcador do Markdown, em minúsculas e sem acento, para o tipo do aviso. */
export const MARCADORES_DOS_AVISOS: Record<string, TipoAviso> = {
  nota: "nota",
  note: "nota",
  dica: "dica",
  tip: "dica",
  importante: "importante",
  important: "importante",
  atencao: "atencao",
  warning: "atencao",
  cuidado: "cuidado",
  caution: "cuidado",
};
