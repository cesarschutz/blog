/**
 * Tokens de cor do blog (briefing §4.2, variação "Folhas claras" da D26). É a fonte única: daqui
 * saem as variáveis CSS (injetadas pelo layout), o teste de contraste (`npm run contraste`), o tema
 * do Expressive Code e a imagem de compartilhamento.
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
  "acento",
  "sobre-acento",
  "aviso-nota",
  "aviso-dica",
  "aviso-importante",
  "aviso-atencao",
  "aviso-cuidado",
  "quadro",
  "tabua",
  "tabua-borda",
  "aparador",
  "aparador-luz",
  "aparador-fundo",
  "lousa",
  "lousa-borda",
  "lousa-caneta",
  "lousa-mistura",
  "marca",
  "marca-letra",
  "veu",
  "veu-tinta",
  "caneta",
] as const;

export type Token = (typeof TOKENS)[number];
export type Paleta = Record<Token, string>;

export const claro: Paleta = {
  paper: "#F1F0EB", // fundo da página
  "paper-hi": "#FFFFFE", // superfície das folhas
  well: "#F5F5F4", // código e cabeçalho de tabela: a superfície com 4% de tinta
  ink: "#1A2124",
  "ink-2": "#57605E",
  "ink-3": "#868D8A", // só texto grande ou decorativo, e só sobre a folha (D22, D26)
  rule: "#E2E0D8",
  acento: "#2549B8", // azul-tinta: tudo que é clicável
  "sobre-acento": "#FFFFFF",
  "aviso-nota": "#3F5878",
  "aviso-dica": "#2F6B4F", // também a linha adicionada no diff
  "aviso-importante": "#654262",
  "aviso-atencao": "#9A6B12",
  "aviso-cuidado": "#A3432A", // também a linha removida no diff
  quadro: "#FFFFFF", // moldura dos diagramas antigos, que têm fundo branco embutido (briefing §8.1)
  tabua: "#B5BAB4", // prateleira da estante e da pilha (docs/capas/CAPAS.md)
  "tabua-borda": "#9BA19B",
  aparador: "#7A8280", // o aparador que separa categorias e séries: gradiente de três tons (CAPAS.md)
  "aparador-luz": "#9AA19F",
  "aparador-fundo": "#6F7775",
  // Lousa (briefing §7): o contrário da página. No tema claro, vidro escuro com caneta clara.
  lousa: "#15191C",
  "lousa-borda": "#2C3438",
  "lousa-caneta": "#F4F6F5",
  "lousa-mistura": "#9FF5DC", // o destaque é a cor da categoria misturada com esta (LOUSA.mistura)
  // Marca (D33, D47): o livro "cs" tem a capa do Volume 01 (a fita da série saiu na D47).
  // Como os livros, é igual nos dois temas.
  marca: "#2D4B46",
  "marca-letra": "#F2EDE2", // o papel dos livros (PAPEL em docs/capas/cores.js)
  // Véu do visor de imagens e do livro ampliado (D33): escurece a página por trás, nos dois temas.
  veu: "#0C0F11",
  "veu-tinta": "#EEF1EE",
  // A caneta do caderno (D48): azul de caneta, igual em todos os livros. Só nos traços e nas notas à
  // mão; o texto marcado fica na cor normal, para não confundir com os links (--acento).
  caneta: "#1F4FB5",
};

export const escuro: Paleta = {
  paper: "#111618",
  "paper-hi": "#1A2124",
  well: "#21282A",
  ink: "#E7E9E4",
  "ink-2": "#A9B0AC",
  "ink-3": "#7F8884",
  rule: "#2A3336",
  acento: "#93AEFF",
  "sobre-acento": "#0D1530",
  "aviso-nota": "#9DB3D4",
  "aviso-dica": "#86C3A2",
  "aviso-importante": "#C7A3C2",
  "aviso-atencao": "#E0B560",
  "aviso-cuidado": "#E7957C",
  quadro: "#FFFFFF",
  tabua: "#3B4547",
  "tabua-borda": "#2A3234",
  aparador: "#4E5759",
  "aparador-luz": "#687173",
  "aparador-fundo": "#434B4D",
  // No tema escuro, quadro branco suavizado (nunca branco puro) com caneta escura.
  lousa: "#CFD5D1",
  "lousa-borda": "#8F989D",
  "lousa-caneta": "#16212B",
  "lousa-mistura": "#0B6F58",
  marca: "#2D4B46",
  "marca-letra": "#F2EDE2",
  veu: "#050708",
  "veu-tinta": "#EEF1EE",
  caneta: "#8FA8FF",
};

/**
 * No tema escuro, o que usa a cor da categoria (destaque dos desenhos, barra de leitura, quadradinho
 * do chip) leva essa porcentagem de branco na mistura (briefing §4.2 e D22).
 */
export const BRANCO_NO_ESCURO = 42;

/**
 * Palco dos desenhos (D26): o painel é a cor da categoria misturada à superfície, com esta
 * porcentagem da cor. As áreas preenchidas do desenho usam a mesma cor do painel.
 */
export const PAINEL = { claro: 11, escuro: 20 };

/**
 * Nome da categoria no chip, tingido (D26): no claro, a cor com 34% de tinta (30% até a D30, quando
 * o dourado do SRE pediu um pouco mais para passar de 4,5:1); no escuro, a cor com 50% de branco.
 * `npm run contraste` confere os dois sobre a folha.
 */
export const CHIP = { claro: { tinta: 34, branco: 0 }, escuro: { tinta: 0, branco: 50 } };

/**
 * Marca-texto do caderno (D48): o amarelo clássico, igual em todos os livros. No escuro, o mesmo
 * amarelo transparente sobre a folha (um âmbar suave). `npm run contraste` confere o texto por cima.
 */
export const MARCA_TEXTO = { claro: { cor: "#FFE27A", alfa: 1 }, escuro: { cor: "#FFD65A", alfa: 0.3 } };

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

// ---------- mistura em oklab, igual ao color-mix(in oklab, …) do CSS ----------

const canais = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const linear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gama = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function paraOklab(hex: string): number[] {
  const [r, g, b] = canais(hex).map(linear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function deOklab([L, A, B]: number[]): string {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(gama);
  return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
}

/** Igual a `color-mix(in oklab, a, b p%)`: `a` entra com (100 − p)% e `b` com p%. */
export function misturar(a: string, b: string, p: number): string {
  const x = paraOklab(a);
  const y = paraOklab(b);
  return deOklab(x.map((v, i) => v * (1 - p / 100) + y[i] * (p / 100)));
}

const rgba = (hex: string, alfa: number) =>
  alfa === 1 ? hex : `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ")} / ${alfa})`;

/**
 * Variáveis CSS dos dois temas. Sem `data-theme` no `<html>`, o tema segue o sistema.
 * `--branco-no-escuro` permite escrever uma vez só: color-mix(in oklab, var(--cor), #fff var(--branco-no-escuro)).
 */
export function cssDosTokens(): string {
  const variaveis = (paleta: Paleta) => TOKENS.map((t) => `--${t}:${paleta[t]};`).join("");
  const lousa = (l: (typeof LOUSA)["claro"]) =>
    `--lousa-mistura-pct:${l.mistura}%;--lousa-caneta-traco:${l.canetaNoTraco}%;--lousa-caneta-texto:${l.canetaNoTexto}%;` +
    `--lousa-hachura:${l.hachura};--lousa-borda-largura:${l.borda};--lousa-reflexo:${l.reflexo};`;
  const proporcoes = (t: "claro" | "escuro") =>
    `--painel-mistura:${PAINEL[t]}%;--chip-tinta:${CHIP[t].tinta}%;--chip-branco:${CHIP[t].branco}%;` +
    `--marca-texto:${rgba(MARCA_TEXTO[t].cor, MARCA_TEXTO[t].alfa)};`;
  const temaEscuro = `${variaveis(escuro)}${lousa(LOUSA.escuro)}${proporcoes("escuro")}--branco-no-escuro:${BRANCO_NO_ESCURO}%;color-scheme:dark;`;
  return (
    `:root{${variaveis(claro)}${lousa(LOUSA.claro)}${proporcoes("claro")}--branco-no-escuro:0%;color-scheme:light;}` +
    `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${temaEscuro}}}` +
    `:root[data-theme="dark"]{${temaEscuro}}`
  );
}
