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
  "caderno-pauta",
  "veu",
  "veu-tinta",
  "caneta",
  "post-it",
  "pauta",
  "pauta-cabeca",
  "etiqueta",
  "etiqueta-papel",
  "etiqueta-sombra",
  "etiqueta-luz",
  "painel-desenho",
  "tinta-desenho",
  "tinta-desenho-2",
  // Rodada 2 do redesenho (protótipo 14, G10): a cortina da troca de página, com o nome do destino.
  "cortina",
  "cortina-tinta",
  // Rodada 3 (área A, livros vivos e luz): a luz quente do brilho nos livros, a sombra quente e o halo
  // embaixo deles, a luz do mouse, as três temperaturas da lâmpada do lustre e o ponto de luz dos livros.
  "luz-quente",
  "sombra-quente",
  "halo-quente",
  "luz-mouse",
  "lampada-brasa",
  "lampada-ambar",
  "lampada-branca",
  "ponto-luz",
  // Rodada 4 (a versão final, direção §0): sem madeira em página nenhuma. Os tokens da prateleira de
  // madeira do 18 (--madeira, --madeira-topo, --madeira-borda, --madeira-luz) saíram; fica o latão das
  // luzes (o corpo, o brilho e a sombra), o mesmo do 18.
  "latao",
  "latao-luz",
  "latao-escuro",
  // Rodada 4 (P16-1, P16-2): a fita adesiva que cola a etiqueta de "Artigos recentes", a tira de Lista /
  // Cards e o papel da paginação (a do 16, translúcida; o CSS a usa a 72% no claro e a 38% no escuro).
  "fita",
] as const;

export type Token = (typeof TOKENS)[number];
export type Paleta = Record<Token, string>;

export const claro: Paleta = {
  // Rodada 4 (a versão final, G4): o claro do 20, o papel quente (20-home-claro.png); a folha um nada creme,
  // a tinta quente e o azul de sempre.
  paper: "#EFEAE2", // fundo da página
  "paper-hi": "#FFFDF9", // superfície das folhas
  well: "#F5F2EC", // código e cabeçalho de tabela: a folha com 4% de tinta, quente
  ink: "#1B1A18",
  "ink-2": "#5C5750", // 5,98:1 no papel, 7,04:1 na folha
  "ink-3": "#8A847A", // só texto grande ou decorativo, e só sobre a folha (D22, D26)
  rule: "#E4DDD2",
  acento: "#2549B8", // azul-tinta: tudo que é clicável
  "sobre-acento": "#FFFFFF",
  "aviso-nota": "#3F5878",
  "aviso-dica": "#2F6B4F", // também a linha adicionada no diff
  "aviso-importante": "#654262",
  "aviso-atencao": "#9A6B12",
  "aviso-cuidado": "#A3432A", // também a linha removida no diff
  quadro: "#FFFFFF", // moldura dos diagramas antigos, que têm fundo branco embutido (briefing §8.1)
  // Rodada 4: sem madeira (direção §0). A tábua que sobrou (a pilha do painel, a estante de lombadas antiga)
  // é uma pedra cinza-quente: o papel com 26% de tinta, e a borda com 36%.
  tabua: "#B2AEA7",
  "tabua-borda": "#9B9892",
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
  "marca-letra": "#F2EDE2", // o papel dos livros (PAPEL em src/livros/cores.js)
  // A pauta do miolo do caderno "cs" (A01, D52; src/lib/caderno.ts), no papel dos livros. Igual nos dois
  // temas: a tinta dos livros (TINTA_PAPEL) a 22% sobre o papel, como no protótipo do caderno.
  "caderno-pauta": "#BEBAB0",
  // Véu do visor de imagens e do livro ampliado (D33): escurece a página por trás, nos dois temas.
  veu: "#0C0F11",
  "veu-tinta": "#EEF1EE",
  // A caneta do caderno (D48): azul de caneta, igual em todos os livros. Só nos traços e nas notas à
  // mão; o texto marcado fica na cor normal, para não confundir com os links (--acento).
  caneta: "#1F4FB5",
  // A papelaria de estudo (C05, D52): o post-it do "Neste artigo" e as fichas pautadas (o livro do
  // artigo e a ficha dos atalhos). Um amarelo só, tirado do marca-texto da D48 (#FFE27A a 52% sobre a
  // folha); a pauta azul, a caneta (D48) a 18% sobre a folha; a linha do cabeçalho da ficha, vermelha, o
  // Cuidado a 50% sobre a folha. A pauta e o cabeçalho são decorativos (o texto fica na tinta de sempre).
  "post-it": "#FFF1BE",
  pauta: "#D4DFF3",
  "pauta-cabeca": "#D6A192",
  // As etiquetas do livro deitado da ficha "Do livro" (D57): a do artigo aberto no amarelo do post-it,
  // as outras no papel dos livros, com a luz e a sombra da foto. Como os livros, iguais nos dois temas.
  etiqueta: "#FFF1BE",
  "etiqueta-papel": "#F2EDE2",
  "etiqueta-sombra": "#000000",
  "etiqueta-luz": "#FFFFFF",
  // Os desenhos do corpo do post (figuras, animações e lousas, D60): a base do painel e a tinta. No
  // claro, a folha e a tinta de sempre; o texto secundário um pouco mais escuro que o --ink-2, para
  // passar de 4,5:1 sobre o fundo lavado das caixas. (D61: os mesmos papéis no papel quente.)
  "painel-desenho": "#FFFDF9",
  "tinta-desenho": "#1B1A18",
  "tinta-desenho-2": "#55504A",
  cortina: "#1B2A5E", // o azul-tinta escuro (protótipo 14)
  "cortina-tinta": "#EFEAE2", // o papel
  // Rodada 3 (área A): a luz do brilho é quente nos dois temas (255 236 200); a sombra dos livros é
  // marrom-âmbar, nunca cinza (60 38 8); o halo quente embaixo deles (255 170 70); a luz do mouse, âmbar
  // claro em multiply (255 214 150); a lâmpada: brasa, âmbar e branco quente; o ponto de luz, latão.
  "luz-quente": "#FFECC8",
  "sombra-quente": "#3C2608",
  "halo-quente": "#FFAA46",
  "luz-mouse": "#FFD696",
  "lampada-brasa": "#FF5C14",
  "lampada-ambar": "#FFA846",
  "lampada-branca": "#FFE8BE",
  "ponto-luz": "#B08D57",
  // O latão escovado dos abajures e da cordinha (o do 18).
  latao: "#B08D57",
  "latao-luz": "#E9D2A2",
  "latao-escuro": "#6E532E",
  // A fita adesiva (16): um creme amarelado translúcido, que o CSS põe a 74% sobre o que estiver embaixo
  // (no papel quente do 20, o creme do 16, #F3EBCF, sumia).
  fita: "#E6D7A8",
};

export const escuro: Paleta = {
  // Rodada 4 (G5): o escuro marrom do 19 (19-home-escuro.png), a sala na meia-luz, sem os tokens de
  // madeira. A folha é a mais clara que deixa os tons dos desenhos com 4,5:1 no painel de SRE (npm run
  // contraste). O preto e o azul-tinta de noite ficaram na amostra D2, nos protótipos do redesenho (D61).
  paper: "#1C1814",
  "paper-hi": "#25201B",
  well: "#2F2924",
  ink: "#EEE6D8",
  "ink-2": "#B8AD9C",
  "ink-3": "#8F8574",
  rule: "#3A3129",
  acento: "#93AEFF",
  "sobre-acento": "#0D1530",
  "aviso-nota": "#9DB3D4",
  "aviso-dica": "#86C3A2",
  "aviso-importante": "#C7A3C2",
  "aviso-atencao": "#E0B560",
  "aviso-cuidado": "#E7957C",
  quadro: "#FFFFFF",
  // A pedra cinza-quente na meia-luz: a folha com 14% de tinta; a borda, o papel com 30% de preto.
  tabua: "#3D3831",
  "tabua-borda": "#0D0A08",
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
  "caderno-pauta": "#BEBAB0",
  veu: "#050708",
  "veu-tinta": "#EEF1EE",
  caneta: "#8FA8FF",
  // No escuro, o post-it é um papel âmbar apagado, que não brilha na página escura: o marca-texto escuro
  // (#FFD65A) a uns 14% sobre a folha, puxado para o quente (a mistura pura, #35372E, dava um oliva frio,
  // por causa do verde da folha escura); a pauta, a caneta a 18%; o cabeçalho, o Cuidado a 50%.
  // (Na folha marrom do 19, os valores dele: o post-it âmbar apagado, a pauta e o cabeçalho.)
  "post-it": "#3E372B",
  pauta: "#3A3E48",
  "pauta-cabeca": "#7E5A4C",
  etiqueta: "#FFF1BE",
  "etiqueta-papel": "#F2EDE2",
  "etiqueta-sombra": "#000000",
  "etiqueta-luz": "#FFFFFF",
  // No escuro (D60), o painel dos desenhos fica um pouco acima da folha e mais neutro (antes, a cor do
  // livro a 20% sobre a folha, quase preto e esverdeado), e a tinta um pouco menos branca, para o traço
  // não brilhar no fundo escuro. (D61: a mesma distância sobre a folha marrom, sem puxar para o frio.)
  "painel-desenho": "#2D2A26",
  "tinta-desenho": "#D5CEC2",
  "tinta-desenho-2": "#C4BCB0",
  cortina: "#EFEAE2", // o papel do claro, com o texto azul (protótipo 14)
  "cortina-tinta": "#1B2A5E",
  // Rodada 3 (área A): no escuro, a luz do brilho um nada mais âmbar; o núcleo da sombra, preto (o que se
  // vê é o halo quente embaixo); a luz do mouse, âmbar em screen (255 190 110); o ponto de luz, aceso.
  "luz-quente": "#FFE3B4",
  "sombra-quente": "#000000",
  "halo-quente": "#FFAA46",
  "luz-mouse": "#FFBE6E",
  "lampada-brasa": "#FF5C14",
  "lampada-ambar": "#FFA846",
  "lampada-branca": "#FFE8BE",
  "ponto-luz": "#FFC978",
  // O latão aceso (o do 18).
  latao: "#E0B46A",
  "latao-luz": "#FBE6BA",
  "latao-escuro": "#8E6A35",
  // A fita no escuro: o mesmo creme mais apagado, que o CSS põe a 38%.
  fita: "#D9CFAF",
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
 * Os desenhos do corpo do post (D60): a cor do livro no painel (sobre --painel-desenho), o fundo lavado
 * das caixas (o tom puro sobre o painel), a cópia fora do registro (`cor`) e a sombra hachurada. No
 * escuro, o lavado mistura o tom puro (sem o branco do escuro) a 45%: as caixas ganham cor (com o tom
 * clareado a 30%, viravam marrom, oliva e cinza) e o texto claro em cima passa de 4,5:1. A cópia e a
 * sombra são mais discretas.
 */
export const DESENHO = {
  claro: { painel: 11, lavado: 16, corFora: 78, hachura: 0.75 },
  escuro: { painel: 10, lavado: 45, corFora: 62, hachura: 0.35 },
};

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
 * A tinta do link no texto do artigo (E3, D49): com o mouse ou o foco, o azul-tinta a essa força sobe
 * de baixo até perto da metade da letra. No escuro, um pouco mais forte, para se ver sobre a folha
 * escura, mas não os 24% do protótipo: com eles, o link passava a 4,1:1 sobre os avisos. O link
 * continua em azul-tinta por cima, com pelo menos 4,5:1 (`npm run contraste` confere).
 */
export const LINK_TINTA = { claro: 16, escuro: 18 };

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
 * Tons dos diagramas e gráficos (D58): cada ator ou lado do
 * diagrama ganha um tom, para a cor ajudar a memorizar. Iguais nos dois temas; no escuro, o CSS mistura
 * `--branco-no-escuro` de branco, como a cor da categoria. Todos passam de 4,5:1 como texto sobre a
 * folha e sobre o painel de todos os livros, nos dois temas (`npm run contraste` confere).
 */
export const DIAGRAMA = {
  azul: "#2F5FB3",
  verde: "#25734E",
  ambar: "#955A0A",
  vermelho: "#B23A2C",
  roxo: "#7C4FAB",
  petroleo: "#1A6F7A",
} as const;

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
    `--marca-texto:${rgba(MARCA_TEXTO[t].cor, MARCA_TEXTO[t].alfa)};` +
    `--link-tinta:${LINK_TINTA[t]}%;` +
    `--desenho-painel:${DESENHO[t].painel}%;--desenho-lavado:${DESENHO[t].lavado}%;` +
    `--desenho-cor-fora:${DESENHO[t].corFora}%;--desenho-hachura:${DESENHO[t].hachura};`;
  const diagrama = Object.entries(DIAGRAMA).map(([nome, cor]) => `--diag-${nome}:${cor};`).join("");
  const temaEscuro = `${variaveis(escuro)}${lousa(LOUSA.escuro)}${proporcoes("escuro")}--branco-no-escuro:${BRANCO_NO_ESCURO}%;color-scheme:dark;`;
  // Na impressão (D54): sempre o tema claro (o escuro saía cinza-claro no papel, que não leva o fundo), e
  // a lousa no quadro branco, com a caneta escura (a do vidro escuro, clara, sumia no papel).
  const lousaNoPapel =
    `--lousa:${escuro.lousa};--lousa-borda:${escuro["lousa-borda"]};--lousa-caneta:${escuro["lousa-caneta"]};` +
    `--lousa-mistura:${escuro["lousa-mistura"]};${lousa(LOUSA.escuro)}`;
  return (
    `:root{${variaveis(claro)}${lousa(LOUSA.claro)}${proporcoes("claro")}${diagrama}--branco-no-escuro:0%;color-scheme:light;}` +
    `@media screen and (prefers-color-scheme:dark){:root:not([data-theme="light"]){${temaEscuro}}}` +
    `@media screen{:root[data-theme="dark"]{${temaEscuro}}}` +
    `@media print{.lousa{${lousaNoPapel}}}`
  );
}
