/**
 * A ficha "Do livro" do post (rodada 3, área 5 da direção): o papel colado com fita que, com o mouse ou
 * o foco, toma a cor do livro (P1), como os cartões de Livros. Estas são as duas cores da pintura, as
 * mesmas da grade de Livros (GradeLivros): a do livro por baixo (a variante de texto pequeno, quando o
 * livro tem uma, para o texto claro por cima passar de 4,5:1) e a tinta clara dele por cima. Os livros
 * não mudam com o tema (D39): a pintura também não.
 */
import type { Livro } from "./estante";
import type { Resumo } from "./posts";
import { dataPorExtenso } from "./formato";

/** `--pinta` (a cor do livro) e `--sobre-pinta` (a tinta clara dele), para o `style` da ficha. */
export function pinturaDoLivro(l: Livro): string {
  const pinta = (l.serie ? l.cores.destaqueTexto : l.cores.corTexto) ?? l.cores.cor;
  return `--pinta:${pinta};--sobre-pinta:${l.cores.tinta}`;
}

/**
 * Os dados da ficha em atributos, para as linhas do redesenho usarem só com CSS (`attr()`): a linha 19
 * faz da ficha uma ficha de empréstimo com o carimbo da data de publicação.
 */
export function dadosDaFicha(l: Livro, atual?: Resumo): Record<string, string> {
  return {
    "data-livro-nome": l.nome,
    ...(l.volume ? { "data-volume": String(l.volume).padStart(2, "0") } : {}),
    ...(atual ? { "data-publicado": dataPorExtenso(atual.publicado) } : {}),
  };
}
