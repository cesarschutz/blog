/**
 * Cadastro único das categorias (briefing §4.2). Categoria nova entra aqui, com um tecido
 * distinto dos demais, e passa pelo `npm run contraste`.
 *
 * Sem imports: o Node 24 roda este arquivo direto nos scripts.
 */

export interface Categoria {
  /** Igual ao frontmatter e à URL, que usa o nome cru: `/categories/<nome>/`. */
  nome: string;
  /** Cor do tecido: lombada, capa, chip, barra de leitura e destaque dos desenhos. */
  tecido: string;
  /** Cor do texto sobre o tecido. */
  texto: string;
  /** Frase da capa do livro. */
  descricao: string;
  /** Altura da lombada na estante, em px (protótipo). */
  alturaLombada: number;
}

export const CATEGORIAS: Categoria[] = [
  {
    nome: "Arquitetura",
    tecido: "#1F4D4A",
    texto: "#EFEADF",
    descricao: "Consistência, concorrência, mensageria e pagamentos: decisões que custam caro para mudar.",
    alturaLombada: 256,
  },
  {
    nome: "Java",
    tecido: "#7A3E25",
    texto: "#F2E7DA",
    descricao: "A linguagem, a JVM e o Spring por dentro.",
    alturaLombada: 240,
  },
  {
    nome: "Observabilidade",
    tecido: "#C39A3E",
    texto: "#1C2427",
    descricao: "Logs, traces e o que eles contam sobre o sistema.",
    alturaLombada: 248,
  },
  {
    nome: "DevOps",
    tecido: "#3F5878",
    texto: "#E8ECF2",
    descricao: "Kubernetes, rotinas agendadas e o ciclo de vida dos pods.",
    alturaLombada: 228,
  },
  {
    nome: "Dados",
    tecido: "#654262",
    texto: "#F1E7EF",
    descricao: "Onde os dados moram e como eles se movem.",
    alturaLombada: 236,
  },
  {
    nome: "Segurança",
    tecido: "#55612E",
    texto: "#EEF0E2",
    descricao: "Tokens, assinaturas e criptografia.",
    alturaLombada: 244,
  },
];

export function categoria(nome: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.nome === nome);
}
