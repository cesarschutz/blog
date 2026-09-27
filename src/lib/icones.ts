/**
 * Ícones de traço (viewBox 0 0 24 24), desenhados no protótipo. Quem usa aplica
 * `fill:none; stroke:currentColor` (ou a cor do aviso) com traço de 1.8.
 *
 * Os da caneta preta (C04 da D52: o calendário, o relógio, o código-fonte, a lua e o sol) não são
 * desenhados aqui: saem de src/lib/traco.ts, à mão, com a mesma semente em toda visita.
 */
import { calendarioDeCaneta, codigoDeCaneta, luaDeCaneta, relogioDeCaneta, solDeCaneta } from "./traco";

const caminhos = (lista: string[]) => lista.map((d) => `<path d="${d}"/>`).join("");

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
  // A lua e o sol do botão de tema, à caneta (C04; SeletorTema.astro usa os caminhos soltos).
  lua: caminhos([luaDeCaneta()]),
  sol: caminhos([solDeCaneta().miolo, ...solDeCaneta().raios]),
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  // Os dois arcos separados, do de dentro para o de fora: o sinal se escreve no hover (traco.css, D49).
  rss: '<path class="arco-rss" pathLength="1" d="M5 11a8 8 0 0 1 8 8"/><path class="arco-rss" pathLength="1" d="M5 5a14 14 0 0 1 14 14"/><circle cx="6" cy="18" r="1.4"/>',
  relogio: caminhos(relogioDeCaneta()),
  // Blog atual (D33): calendário da data e os dois modos da lista. GitHub e LinkedIn: MARCAS, abaixo.
  calendario: caminhos(calendarioDeCaneta()),
  lista: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  grade: '<rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/>',
  fechar: '<path d="M18 6 6 18M6 6l12 12"/>',
  externo: '<path d="M7 17 17 7M8 7h9v9"/>',
  ampliar: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  // O código-fonte do artigo (D52): os dois sinais de maior e menor e a barra, à caneta (C04).
  codigo: caminhos(codigoDeCaneta()),
  teclado: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12.5h.01M10 12.5h.01M14 12.5h.01M18 12.5h.01M8 16h8"/>',
} as const;

export type NomeIcone = keyof typeof ICONES;

/**
 * As marcas do GitHub e do LinkedIn (C04, D52): as oficiais, preenchidas e em preto, como as regras
 * das duas pedem (nada de redesenhar o logotipo). O GitHub é a Invertocat (Octicons "mark-github",
 * caixa de 16); o LinkedIn, o [in] (caixa de 24). A caneta entra no gesto: o círculo à mão do hover.
 */
export const MARCAS = {
  github: {
    viewBox: "0 0 16 16",
    d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z",
  },
  linkedin: {
    viewBox: "0 0 24 24",
    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
} as const;
