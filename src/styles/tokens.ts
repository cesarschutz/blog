/**
 * Tokens de cor do blog (briefing §4.2). É a fonte única: daqui saem as variáveis CSS
 * (injetadas pelo layout), o teste de contraste (`npm run contraste`) e, nas próximas fases,
 * o tema do Expressive Code e a imagem de compartilhamento.
 *
 * Sem imports: o Node 24 roda este arquivo direto nos scripts.
 */

export const TOKENS = [
  "paper",
  "paper-hi",
  "well",
  "ink",
  "ink-2",
  "ink-3",
  "rule",
  "link",
  "aviso-nota",
  "aviso-dica",
  "aviso-importante",
  "aviso-atencao",
  "aviso-cuidado",
  "quadro",
  "tabua",
  "tabua-borda",
  "lousa",
  "lousa-borda",
  "lousa-caneta",
  "lousa-mistura",
] as const;

export type Token = (typeof TOKENS)[number];
export type Paleta = Record<Token, string>;

export const claro: Paleta = {
  paper: "#ECEEE9",
  "paper-hi": "#F7F8F4",
  well: "#E0E3DC",
  ink: "#1C2427",
  "ink-2": "#56605E",
  "ink-3": "#7A8381", // só texto grande ou decorativo (D22)
  rule: "#C4CAC3",
  link: "#244A8A",
  "aviso-nota": "#3F5878",
  "aviso-dica": "#2F6B4F", // também a linha adicionada no diff
  "aviso-importante": "#654262",
  "aviso-atencao": "#9A6B12",
  "aviso-cuidado": "#A3432A", // também a linha removida no diff
  quadro: "#FFFFFF", // moldura dos diagramas antigos, que têm fundo branco embutido (briefing §8.1)
  tabua: "#B5BBB1", // prateleira da estante (protótipo)
  "tabua-borda": "#959C92",
  // Lousa (briefing §7): o contrário da página. No tema claro, vidro escuro com caneta clara.
  lousa: "#15191C",
  "lousa-borda": "#2C3438",
  "lousa-caneta": "#F4F6F5",
  "lousa-mistura": "#9FF5DC", // o destaque é a cor da categoria misturada com esta (LOUSA.mistura)
};

export const escuro: Paleta = {
  paper: "#182022",
  "paper-hi": "#1F282A",
  well: "#12181A",
  ink: "#E3E6DF",
  "ink-2": "#A7AFAB",
  "ink-3": "#848D89",
  rule: "#343E40",
  link: "#9FB8E8",
  "aviso-nota": "#9DB3D4",
  "aviso-dica": "#86C3A2",
  "aviso-importante": "#C7A3C2",
  "aviso-atencao": "#E0B560",
  "aviso-cuidado": "#E7957C",
  quadro: "#FFFFFF",
  tabua: "#3B4547",
  "tabua-borda": "#2A3234",
  // No tema escuro, quadro branco suavizado (nunca branco puro) com caneta escura.
  lousa: "#CFD5D1",
  "lousa-borda": "#8F989D",
  "lousa-caneta": "#16212B",
  "lousa-mistura": "#0B6F58",
};

/**
 * No tema escuro, o que usa a cor da categoria (destaque dos desenhos, barra de leitura, chip)
 * leva essa porcentagem de branco na mistura (briefing §4.2 e D22).
 */
export const BRANCO_NO_ESCURO = 42;

/**
 * O que a lousa tem de diferente em cada tema, além das cores: quanto da mistura entra no destaque,
 * quanto de caneta o destaque leva no traço e no texto para passar de 3:1 e 4,5:1 em todas as
 * categorias (no quadro branco, Observabilidade pede 20% e 45%; `npm run contraste` confere), a
 * opacidade da hachura, a espessura da borda (vidro fino, alumínio grosso) e o reflexo.
 */
export const LOUSA = {
  claro: {
    mistura: 55,
    canetaNoTraco: 0,
    canetaNoTexto: 0,
    hachura: 0.22,
    borda: "1px",
    reflexo: "linear-gradient(118deg, rgb(255 255 255 / 0.07) 0%, rgb(255 255 255 / 0.015) 26%, transparent 27%)",
  },
  escuro: {
    mistura: 35,
    canetaNoTraco: 20,
    canetaNoTexto: 45,
    hachura: 0.3,
    borda: "3px",
    reflexo: "linear-gradient(118deg, rgb(255 255 255 / 0.28) 0%, transparent 30%)",
  },
};

/**
 * Variáveis CSS dos dois temas. Sem `data-theme` no `<html>`, o tema segue o sistema.
 * `--branco-no-escuro` permite escrever uma vez só: color-mix(in oklab, var(--cor), #fff var(--branco-no-escuro)).
 */
export function cssDosTokens(): string {
  const variaveis = (paleta: Paleta) => TOKENS.map((t) => `--${t}:${paleta[t]};`).join("");
  const lousa = (l: (typeof LOUSA)["claro"]) =>
    `--lousa-mistura-pct:${l.mistura}%;--lousa-caneta-traco:${l.canetaNoTraco}%;--lousa-caneta-texto:${l.canetaNoTexto}%;` +
    `--lousa-hachura:${l.hachura};--lousa-borda-largura:${l.borda};--lousa-reflexo:${l.reflexo};`;
  const temaEscuro = `${variaveis(escuro)}${lousa(LOUSA.escuro)}--branco-no-escuro:${BRANCO_NO_ESCURO}%;color-scheme:dark;`;
  return (
    `:root{${variaveis(claro)}${lousa(LOUSA.claro)}--branco-no-escuro:0%;color-scheme:light;}` +
    `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${temaEscuro}}}` +
    `:root[data-theme="dark"]{${temaEscuro}}`
  );
}
