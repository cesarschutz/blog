/**
 * Ícones de traço (viewBox 0 0 24 24), desenhados no protótipo. Quem usa aplica
 * `fill:none; stroke:currentColor` (ou a cor do aviso) com traço de 1.8.
 */
export const ICONES = {
  nota: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.01"/>',
  dica: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1V16h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3z"/>',
  importante: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.4v.01"/>',
  atencao: '<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.1v.01"/>',
  cuidado:
    '<path d="M12 21c-3.9 0-6.6-2.7-6.6-6.2 0-3.3 2.2-5.1 3.6-7.4.3 1.6 1.1 2.8 2.3 3.4.1-3.1 1.8-5.9 4.6-7.8-.4 2.8.9 4.6 2.1 6.3 1.1 1.5 1.9 3 1.9 5.1 0 3.9-3.5 6.6-7.9 6.6z"/>',
  subir: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  compartilhar: '<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6h14v-6"/>',
} as const;

export type NomeIcone = keyof typeof ICONES;
