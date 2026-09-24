/**
 * Série "Atualizações do Java": só versões LTS (skill serie-java). Cada post java-NN reúne o que as
 * versões intermediárias trouxeram desde a LTS anterior. Nova LTS lançada: tirar `upcoming` e criar
 * o post da próxima.
 *
 * Sem imports: o Node 24 roda este arquivo direto nos scripts.
 */

export interface JavaLts {
  version: number;
  /** Mês e ano de lançamento (ou previsto). */
  release: string;
  /** Versões cujo conteúdo o post reúne. */
  covers: string;
  upcoming?: boolean;
}

export const JAVA_LTS: JavaLts[] = [
  { version: 29, release: "set/2027", covers: "Java 26 e 27 já lançados", upcoming: true },
  { version: 25, release: "set/2025", covers: "Java 22, 23, 24 e 25" },
  { version: 21, release: "set/2023", covers: "Java 18, 19, 20 e 21" },
  { version: 17, release: "set/2021", covers: "Java 12 a 17" },
  { version: 11, release: "set/2018", covers: "Java 9, 10 e 11" },
  { version: 8, release: "mar/2014", covers: "Mudanças desde o Java 7" },
];

/** LTS já lançadas, da mais nova para a mais antiga. */
export const RELEASED_LTS = JAVA_LTS.filter((v) => !v.upcoming);

/**
 * Versão intermediária → LTS que a absorveu. Gera os redirecionamentos
 * /posts/java-NN/ → /posts/java-<LTS>/#java-NN. O 27 entrou por coerência (D7).
 */
export const ABSORBED: Record<number, number> = {
  9: 11,
  10: 11,
  12: 17,
  13: 17,
  14: 17,
  15: 17,
  16: 17,
  18: 21,
  19: 21,
  20: 21,
  22: 25,
  23: 25,
  24: 25,
  26: 29,
  27: 29,
};

/** Post que abre a série (Parte 1 na ordem de leitura). */
export const GUIA_JAVA = "guia-atualizacoes-java";
