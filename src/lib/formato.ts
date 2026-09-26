/** Formatação de datas e de Markdown curto (descrições), em pt-BR. */

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "10 set 2026". As datas do frontmatter são tratadas em UTC, como no blog atual. */
export function dataPorExtenso(data: Date): string {
  return `${data.getUTCDate()} ${MESES[data.getUTCMonth()]} ${data.getUTCFullYear()}`;
}

/** "10 set", para listas agrupadas por ano. */
export function diaEMes(data: Date): string {
  return `${data.getUTCDate()} ${MESES[data.getUTCMonth()]}`;
}

/** "2026-09-10", para `datetime` e JSON-LD. */
export function dataIso(data: Date): string {
  return data.toISOString().slice(0, 10);
}

const escapar = (texto: string) => texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Descrição com `código` e **negrito** em HTML. */
export function mdEmLinha(texto: string): string {
  return escapar(texto)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/**
 * Título em HTML com um ponto de quebra (`<wbr>`) depois do ponto de um identificador
 * ("AopUtils.getTargetClass()"): na coluna estreita, quebra ali e não no meio da palavra. O
 * travessão fica preso à palavra seguinte (D39), para nunca sobrar sozinho numa linha.
 */
export function tituloComQuebras(texto: string): string {
  return escapar(texto)
    .replace(/(?<=\.)(?=[A-Za-z])/g, "<wbr>")
    .replace(/ — /g, " —&nbsp;");
}

/** Descrição sem marcação, para meta tags, RSS e JSON-LD. */
export function semMd(texto: string): string {
  return texto.replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}

/** Meta description: até 155 caracteres, cortada no fim de uma palavra. */
export function descricaoCurta(texto: string, limite = 155): string {
  const limpo = semMd(texto);
  if (limpo.length <= limite) return limpo;
  const corte = limpo.slice(0, limite + 1).replace(/\s+\S*$/, "");
  return `${corte.replace(/[,;:.—-]+$/, "")}…`;
}

/**
 * Nome da View Transition do desenho ou do título de um post (D41): o mesmo no cartão, na lista, no
 * destaque e no topo do post, para o navegador levar um ao outro ao trocar de página. A classe
 * (`desenho-post` ou `titulo-post`) dá o tempo e o jeito da animação, em base.css.
 */
export function transicaoPost(slug: string, parte: "desenho" | "titulo"): string {
  return `view-transition-name:${parte}-${slug.replace(/[^a-z0-9-]/gi, "-")};view-transition-class:${parte}-post`;
}
