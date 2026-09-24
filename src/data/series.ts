/**
 * Cadastro das séries (briefing §4.2). Cada série define a própria encadernação.
 * Série nova entra aqui e passa pelo `npm run contraste`.
 *
 * Sem imports: o Node 24 roda este arquivo direto nos scripts.
 */

export interface Serie {
  chave: string;
  nome: string;
  descricao: string;
  /** Página própria da série; sem ela, a série ganha `/series/<chave>/`. */
  url?: string;
  encadernacao: string;
  letras: string;
  fita: string;
  /** Faz o papel da cor da categoria: barra de leitura, chip e desenho (D23). */
  destaque: string;
  /** Altura da lombada na estante, em px (protótipo). */
  alturaLombada: number;
}

export const SERIES: Serie[] = [
  {
    chave: "java",
    nome: "Atualizações do Java",
    descricao: "Cada versão do Java explicada: o que mudou, por que importa e exemplos de código.",
    url: "/java/",
    encadernacao: "#3A2A22",
    letras: "#D8B66C",
    fita: "#9E3B26",
    destaque: "#9E3B26",
    alturaLombada: 262,
  },
];

export function serie(chave: string | undefined): Serie | undefined {
  return chave ? SERIES.find((s) => s.chave === chave) : undefined;
}
