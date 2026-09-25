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
  // Interface (D26, protótipo "mais vida"): busca, tema, a seta do "Ler artigo", o relógio do tempo
  // de leitura nas listas e o RSS do painel da home.
  busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  lua: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  rss: '<path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8"/><circle cx="6" cy="18" r="1.4"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  // Blog atual (D33): calendário da data, os dois modos da lista, GitHub e LinkedIn do cabeçalho.
  calendario: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  lista: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  grade: '<rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/>',
  github:
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  linkedin:
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  // Menu de aparência (D33): tema do sistema, som dos livros ligado e desligado, fechar.
  sistema: '<rect width="18" height="12" x="3" y="4" rx="2"/><path d="M8 20h8M12 16v4"/>',
  som: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  semSom: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/>',
  fechar: '<path d="M18 6 6 18M6 6l12 12"/>',
  externo: '<path d="M7 17 17 7M8 7h9v9"/>',
  ampliar: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
} as const;

export type NomeIcone = keyof typeof ICONES;
