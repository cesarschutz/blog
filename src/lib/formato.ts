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

/**
 * O título do post em duas partes (D44): "Assunto — complemento" vira o assunto, grande, e o
 * complemento numa linha própria, menor (`.titulo-sub`, base.css), sem o travessão à vista. Para o
 * leitor de tela e para a busca, o travessão continua lá (escondido), e o título se lê inteiro.
 * O texto é o do título original, letra por letra: a inicial maiúscula do complemento é só visual
 * (`::first-letter`), para a busca e o leitor de tela lerem o título como ele é.
 */
export function tituloEmPartes(tituloCompleto: string): string {
  const [assunto, ...resto] = tituloCompleto.split(" — ");
  const principal = `<span class="titulo-principal">${tituloComQuebras(assunto)}</span>`;
  if (!resto.length) return principal;
  return `${principal}<span class="sr"> — </span><span class="titulo-sub">${tituloComQuebras(resto.join(" — "))}</span>`;
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
