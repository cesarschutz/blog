/**
 * Os ícones do computador, todos desenhados aqui (nada da Apple nem da Microsoft, C1): os dos apps (o
 * esquadro arredondado com o desenho dentro, pintado por CSS com as cores de cores.ts), a pasta, a
 * lixeira, a marca "cs" da barra de menus e os glifos pequenos das barras de ferramentas. Só strings de
 * SVG: o sistema as monta quando abre.
 */
import { MARCA_SVG, MARCA_VIEWBOX } from "../lib/marca";

export type AppId = "finder" | "previa" | "terminal" | "editor" | "sobre";

const desenhos: Record<AppId, string> = {
  // Arquivos: a pasta aberta com duas folhas, sobre o azul.
  finder:
    '<path class="i-aba" d="M14 21.5a3 3 0 0 1 3-3h8.6a3 3 0 0 1 2.1.9l2.2 2.2h17.6a3 3 0 0 1 3 3V43a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3Z"/>' +
    '<rect class="i-folha i-folha-atras" x="18.5" y="20" width="25" height="15" rx="1.4" transform="rotate(-5 31 27.5)"/>' +
    '<rect class="i-folha" x="21" y="21.8" width="25" height="15" rx="1.4"/>' +
    '<path class="i-linha" d="M24.6 26h12M24.6 29.2h16"/>' +
    '<path class="i-frente" d="M12.4 30a3 3 0 0 1 3-3h33.2a3 3 0 0 1 3 3.3l-1.5 13.4a3 3 0 0 1-3 2.6H16.9a3 3 0 0 1-3-2.6Z"/>' +
    '<rect class="i-etiqueta" x="25" y="34" width="14" height="4.6" rx="2.3"/>',
  // Pré-Visualização: a página com a dobra, a faixa colorida e a lupa.
  previa:
    '<path class="i-pagina" d="M17 11.5h21.5l9.5 9.5v30a2.5 2.5 0 0 1-2.5 2.5h-28.5a2.5 2.5 0 0 1-2.5-2.5v-37a2.5 2.5 0 0 1 2.5-2.5Z"/>' +
    '<path class="i-dobra" d="M38.5 11.5v7a2.5 2.5 0 0 0 2.5 2.5h7Z"/>' +
    '<path class="i-linhas" d="M21 26h16M21 30h20M21 34h12"/>' +
    '<rect class="i-faixa" x="20.5" y="39" width="22" height="7" rx="1.2"/>' +
    '<circle class="i-vidro" cx="42" cy="42" r="8.2"/>' +
    '<circle class="i-lente" cx="42" cy="42" r="8.2"/>' +
    '<path class="i-cabo" d="m48.2 48.2 5.6 5.6"/>',
  // Terminal: a tela escura com a faixa de título e o prompt verde.
  terminal:
    '<rect class="i-barra" x="9" y="9" width="46" height="8.5" rx="0"/>' +
    '<path class="i-prompt" d="m17.5 27 7.5 6.2-7.5 6.2"/>' +
    '<path class="i-prompt i-sublinha" d="M28.5 40.5h11"/>',
  // Editor: as chaves e o cursor, sobre o azul fundo.
  editor:
    '<path class="i-chave" d="M24.5 17.5h-1.6a3.4 3.4 0 0 0-3.4 3.4v6.4a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1 3.6 3.6v6.4a3.4 3.4 0 0 0 3.4 3.4h1.6"/>' +
    '<path class="i-chave" d="M39.5 17.5h1.6a3.4 3.4 0 0 1 3.4 3.4v6.4a3.6 3.6 0 0 0 3.6 3.6 3.6 3.6 0 0 0-3.6 3.6v6.4a3.4 3.4 0 0 1-3.4 3.4h-1.6"/>' +
    '<path class="i-cursor" d="M32 24.5v15"/>',
  // Sobre este computador: o livro "cs" da marca.
  sobre: `<svg x="17" y="12" width="30" height="39" viewBox="${MARCA_VIEWBOX}">${MARCA_SVG}</svg>`,
};

/** O ícone de um app: o esquadro (CSS) e o desenho (SVG). Decorativo: o nome do app está sempre ao lado. */
export function iconeDoApp(app: AppId, classe = ""): string {
  return `<span class="mac-app-icone mac-app-icone--${app}${classe ? ` ${classe}` : ""}" aria-hidden="true"><svg viewBox="0 0 64 64" focusable="false">${desenhos[app]}</svg></span>`;
}

/** A pasta do macOS (a da área de trabalho, do Finder e do Editor), com o livro gravado. */
export function pasta(classe = "mac-pasta"): string {
  return (
    `<svg class="${classe}" viewBox="0 0 64 52" aria-hidden="true" focusable="false">` +
    '<path class="p-fundo" d="M4 9.5C4 7 6 5 8.5 5h15.2c1.4 0 2.6.6 3.5 1.6l2.7 3.2c.6.7 1.4 1.1 2.3 1.1H55.5C58 10.9 60 12.9 60 15.4V44c0 2.5-2 4.5-4.5 4.5h-47C6 48.5 4 46.5 4 44Z"/>' +
    '<path class="p-frente" d="M4 20.6c0-2.4 2-4.4 4.4-4.4h47.2c2.4 0 4.4 2 4.4 4.4V44c0 2.5-2 4.5-4.5 4.5h-47C6 48.5 4 46.5 4 44Z"/>' +
    '<path class="p-brilho" d="M8.4 17.4h47.2"/>' +
    '<path class="p-gravura" d="M24.5 28.7c2.6-1.2 5.2-1.2 7.5.4 2.3-1.6 4.9-1.6 7.5-.4v10c-2.6-1.2-5.2-1.2-7.5.4-2.3-1.6-4.9-1.6-7.5-.4ZM32 29.1v10"/>' +
    "</svg>"
  );
}

/** O arquivo PDF pequeno das colunas e das listas, com a faixa na cor do livro (--cor). */
export const ARQUIVO_PDF =
  '<svg class="mac-arquivo" viewBox="0 0 15 19" aria-hidden="true" focusable="false">' +
  '<path class="a-papel" d="M1.5 1.2h8.2l3.8 3.8v12.3a.9.9 0 0 1-.9.9H2.4a.9.9 0 0 1-.9-.9Z"/>' +
  '<path class="a-dobra" d="M9.7 1.2V5h3.8Z"/>' +
  '<path class="a-linhas" d="M3.8 7.4h6.6M3.8 9.6h7.4M3.8 11.8h5"/>' +
  '<rect class="a-faixa" x="1.95" y="14.2" width="11.1" height="2.6" rx=".5"/></svg>';

/** A lixeira do Dock: o cesto de vidro com os frisos. */
export const LIXEIRA =
  '<span class="mac-app-icone mac-app-icone--lixeira" aria-hidden="true"><svg viewBox="0 0 64 64" focusable="false">' +
  '<path class="l-corpo" d="M15 17.5h34l-3.2 36.2a3.5 3.5 0 0 1-3.5 3.2H21.7a3.5 3.5 0 0 1-3.5-3.2Z"/>' +
  '<path class="l-frisos" d="M24 23.5 25.4 51M32 23.5V51M40 23.5 38.6 51"/>' +
  '<rect class="l-borda" x="12.5" y="12.5" width="39" height="6" rx="3"/>' +
  "</svg></span>";

/** A marca da barra de menus (no lugar da maçã): o livro "cs" do blog, numa cor só. */
export const MARCA_DA_BARRA = `<svg class="mac-marca" viewBox="${MARCA_VIEWBOX}" aria-hidden="true" focusable="false">${MARCA_SVG}</svg>`;

/** Glifos de traço (16 × 16, currentColor), das barras de ferramentas, menus e status. */
const glifos = {
  voltar: '<path d="M10 3 5 8l5 5"/>',
  avancar: '<path d="m6 3 5 5-5 5"/>',
  lateral: '<rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2.2"/><path d="M6.2 2.6v10.8"/>',
  colunas: '<rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2"/><path d="M5.9 2.6v10.8M10.1 2.6v10.8"/>',
  icones: '<rect x="2.2" y="2.2" width="4.6" height="4.6" rx="1.2"/><rect x="9.2" y="2.2" width="4.6" height="4.6" rx="1.2"/><rect x="2.2" y="9.2" width="4.6" height="4.6" rx="1.2"/><rect x="9.2" y="9.2" width="4.6" height="4.6" rx="1.2"/>',
  lista: '<path d="M5.5 4h8M5.5 8h8M5.5 12h8"/><circle cx="2.6" cy="4" r=".5"/><circle cx="2.6" cy="8" r=".5"/><circle cx="2.6" cy="12" r=".5"/>',
  busca: '<circle cx="7" cy="7" r="4.4"/><path d="m10.3 10.3 3.5 3.5"/>',
  mais: '<circle cx="7" cy="7" r="4.4"/><path d="m10.3 10.3 3.5 3.5M5 7h4M7 5v4"/>',
  menos: '<circle cx="7" cy="7" r="4.4"/><path d="m10.3 10.3 3.5 3.5M5 7h4"/>',
  partilhar: '<path d="M8 2.2v8.2M5.2 4.8 8 2l2.8 2.8"/><path d="M5.4 7.2H4.6a1.4 1.4 0 0 0-1.4 1.4v4a1.4 1.4 0 0 0 1.4 1.4h6.8a1.4 1.4 0 0 0 1.4-1.4v-4a1.4 1.4 0 0 0-1.4-1.4h-.8"/>',
  etiqueta: '<path d="M2.4 8.6V3.3a.9.9 0 0 1 .9-.9h5.3l5 5a1 1 0 0 1 0 1.4l-4.6 4.6a1 1 0 0 1-1.4 0Z"/><circle cx="5.4" cy="5.4" r=".9"/>',
  livro: '<path d="M3 3.2c1.8-.8 3.5-.8 5 .3 1.5-1.1 3.2-1.1 5-.3v9.6c-1.8-.8-3.5-.8-5 .3-1.5-1.1-3.2-1.1-5-.3ZM8 3.5v9.6"/>',
  revista: '<rect x="3.4" y="2" width="9.2" height="12" rx="1"/><path d="M5.6 5h4.8M5.6 7.4h4.8M5.6 9.8h3"/>',
  relogio: '<circle cx="8" cy="8" r="5.8"/><path d="M8 4.8V8l2.2 1.4"/>',
  casa: '<path d="M2.6 7.4 8 3l5.4 4.4M4.2 6.3v6.5h7.6V6.3"/>',
  lixo: '<path d="M3.2 4.6h9.6M6.2 4.6V3.2h3.6v1.4M4.4 4.6l.6 8.2h6l.6-8.2"/>',
  arquivos: '<path d="M2.4 4.4a1.4 1.4 0 0 1 1.4-1.4h2.6l1.4 1.4h4.4a1.4 1.4 0 0 1 1.4 1.4v5.8a1.4 1.4 0 0 1-1.4 1.4H3.8a1.4 1.4 0 0 1-1.4-1.4Z"/>',
  explorer: '<path d="M8.8 2.2H4.4a1.2 1.2 0 0 0-1.2 1.2v9.2a1.2 1.2 0 0 0 1.2 1.2h7.2a1.2 1.2 0 0 0 1.2-1.2V6.2Z"/><path d="M8.8 2.2v4h4"/>',
  ramo: '<circle cx="4.4" cy="3.6" r="1.4"/><circle cx="4.4" cy="12.4" r="1.4"/><circle cx="11.6" cy="5.6" r="1.4"/><path d="M4.4 5v6M11.6 7c0 2.6-3.6 2.4-6.4 4.2"/>',
  wifi: '<path d="M1.8 6.4a9 9 0 0 1 12.4 0M3.9 8.6a6 6 0 0 1 8.2 0M6 10.8a3 3 0 0 1 4 0"/><circle cx="8" cy="12.9" r=".6"/>',
  // O lustre do blog em miniatura (o botão do tema na barra de menus): aceso no claro, apagado no escuro.
  lustreAceso: '<path d="M8 .6v3.6"/><path d="M3.2 10.2a4.8 5.6 0 0 1 9.6 0Z"/><circle class="g-lampada" cx="8" cy="11.9" r="1.35"/><path d="M5.2 14.4 4.6 15.4M10.8 14.4l.6 1M8 14.7v1.1" class="g-raios"/>',
  lustreApagado: '<path d="M8 .6v3.6"/><path d="M3.2 10.2a4.8 5.6 0 0 1 9.6 0Z"/><circle cx="8" cy="11.9" r="1.35"/>',
  sol: '<circle cx="8" cy="8" r="2.8"/><path d="M8 1.6v1.6M8 12.8v1.6M1.6 8h1.6M12.8 8h1.6M3.5 3.5l1.1 1.1M11.4 11.4l1.1 1.1M3.5 12.5l1.1-1.1M11.4 4.6l1.1-1.1"/>',
  lua: '<path d="M12.8 9.6A5.6 5.6 0 0 1 6.4 3.2a5.6 5.6 0 1 0 6.4 6.4Z"/>',
  fechar: '<path d="m4.5 4.5 7 7M11.5 4.5l-7 7"/>',
  pasta: '<path d="M2.4 4.4a1.4 1.4 0 0 1 1.4-1.4h2.6l1.4 1.4h4.4a1.4 1.4 0 0 1 1.4 1.4v5.8a1.4 1.4 0 0 1-1.4 1.4H3.8a1.4 1.4 0 0 1-1.4-1.4Z"/>',
  seta: '<path d="m6 4 4 4-4 4"/>',
  layout: '<rect x="2" y="2.8" width="12" height="10.4" rx="1.6"/><path d="M2 9.4h12"/>',
  painel: '<rect x="2" y="2.8" width="12" height="10.4" rx="1.6"/><path d="M10 2.8v10.4"/>',
  remoto: '<path d="m3 6 2.8-2.8M3 6l2.8 2.8M13 10l-2.8-2.8M13 10l-2.8 2.8"/>',
  erro: '<circle cx="8" cy="8" r="5.6"/><path d="m5.9 5.9 4.2 4.2M10.1 5.9l-4.2 4.2"/>',
  aviso: '<path d="M8 2.4 14 13H2Z"/><path d="M8 6.6v3M8 11.3v.1"/>',
  sino: '<path d="M4.2 11.2V7.4a3.8 3.8 0 0 1 7.6 0v3.8l1.2 1.2H3Z"/><path d="M6.8 13.8a1.3 1.3 0 0 0 2.4 0"/>',
  ler: '<path d="M6.5 3.2H3.8a1.2 1.2 0 0 0-1.2 1.2v7.8a1.2 1.2 0 0 0 1.2 1.2h7.8a1.2 1.2 0 0 0 1.2-1.2V9.5M9 2.6h4.4V7M13.2 2.8 7.4 8.6"/>',
};

export type Glifo = keyof typeof glifos;

export function glifo(nome: Glifo, classe = "mac-glifo"): string {
  return `<svg class="${classe}" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${glifos[nome]}</svg>`;
}

/** A bateria da barra de menus (cheia, como num computador na tomada). */
export const BATERIA =
  '<svg class="mac-glifo mac-bateria" viewBox="0 0 26 13" aria-hidden="true" focusable="false">' +
  '<rect class="b-casco" x="0.75" y="0.75" width="21.5" height="11.5" rx="3.4"/>' +
  '<rect class="b-carga" x="2.6" y="2.6" width="17.8" height="7.8" rx="1.8"/>' +
  '<path class="b-polo" d="M24 4.6v3.8"/></svg>';
