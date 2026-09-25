/**
 * Cadastro das categorias (briefing §4.2). Cada categoria é um livro da coleção, no estilo "edição de
 * estudo" (D30, D32): os dados vêm de `docs/capas/livros.json` e as cores, de `docs/capas/cores.js`
 * (a partir da cor principal). A regra completa de capas, lombadas e livros novos está em
 * `docs/capas/CAPAS.md`. Categoria nova = livro novo lá, e depois o `npm run contraste`.
 *
 * Os scripts do Node também leem este arquivo (contraste.mjs), por isso os imports usam o caminho
 * com extensão e o atributo de JSON.
 */
import dados from "../../docs/capas/livros.json" with { type: "json" };
import { coresDoLivro, PAPEL, TINTA_PAPEL } from "../../docs/capas/cores.js";

export interface CoresDoLivro {
  /** Bloco de cima da capa e da lombada (na série, o destaque). */
  cor: string;
  /** Texto e ícone sobre a cor. */
  tinta: string;
  /** A cor escurecida até ter contraste sobre o papel: título da lombada, número e desenho. */
  destaque: string;
  /** Parte clara da capa e da lombada. */
  papel: string;
  /** Texto comum sobre o papel. */
  tintaPapel: string;
  /**
   * Variantes para texto pequeno (D35), só onde a cor principal não passa de 4,5:1: a cor por trás de
   * texto claro pequeno (Carreira) e o destaque como texto pequeno sobre o papel (série). As capas e
   * os títulos grandes continuam com a cor principal.
   */
  corTexto?: string;
  destaqueTexto?: string;
}

export interface Categoria {
  /** Igual ao frontmatter e à URL, que usa o nome cru: `/categories/<nome>/`. */
  nome: string;
  /** Nome dos arquivos em `docs/capas/desenhos/` e `docs/capas/icones/`. */
  slug: string;
  /** Volume da coleção: o "VOLUME 01" da capa. */
  volume: number;
  /** O título como quebra na capa e nas lombadas ("Arquitetura" / "de Software"). */
  linhas: string[];
  /** Corpo e entrelinha do título na capa, na referência de 480px de largura. */
  corpoNaCapa: number;
  entrelinhaNaCapa: number;
  /** A frase da capa (o que vem depois dos dois-pontos do subtítulo). */
  frase: string;
  /** O subtítulo completo ("quatro temas: uma frase curta"), usado nas páginas. */
  descricao: string;
  temas: string[];
  /** Cor principal: chip, barra de leitura, palco dos desenhos e o livro. */
  cor: string;
  cores: CoresDoLivro;
  instrumento: string;
  /** Lombada na estante, em unidades da referência (CAPAS.md). */
  emPe: { altura: number; largura: number };
  /** Lombada deitada na lateral, em px no tamanho real. */
  deitada: { comprimento: number; espessura: number; deslocamento: number };
}

export const CATEGORIAS: Categoria[] = dados.livros.map((l) => ({
  nome: l.titulo,
  slug: l.slug,
  volume: l.volume,
  linhas: l.linhasDoTitulo,
  corpoNaCapa: l.corpoDoTitulo,
  entrelinhaNaCapa: l.entrelinhaDoTitulo,
  frase: l.frase,
  descricao: l.subtituloCompleto,
  temas: l.temas,
  cor: l.cor,
  cores: { ...coresDoLivro(l.cor), papel: PAPEL, tintaPapel: TINTA_PAPEL, corTexto: l.corTexto },
  instrumento: l.instrumento,
  emPe: l.lombadaEmPe,
  deitada: l.lombadaDeitada,
}));

/**
 * Nomes antigos das categorias (até 24/09/2026), que viraram livros com outro nome (D30). As URLs
 * antigas redirecionam para as novas (astro.config.mjs).
 */
export const NOMES_ANTIGOS: Record<string, string> = {
  Arquitetura: "Arquitetura de Software",
  Java: "Desenvolvimento de Software",
  Observabilidade: "SRE",
};

export function categoria(nome: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.nome === nome);
}
