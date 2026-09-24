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
