/**
 * Cadastro das séries (briefing §4.2). As séries são revistas técnicas (D32): cada post é uma edição.
 * Os dados (título dividido, destaque, número de capa, edições, tarja do guia, emblema e medidas) vêm
 * de `docs/capas/livros.json`, e a regra está em `docs/capas/CAPAS.md` ("Séries: revista técnica").
 * Série nova entra aqui e lá, e passa pelo `npm run contraste`.
 */
import dados from "../../docs/capas/livros.json" with { type: "json" };

export interface Serie {
  chave: string;
  nome: string;
  /** O subtítulo da revista, usado também nas páginas. */
  descricao: string;
  /**
   * A série tem página própria em `src/pages/series/<chave>.astro` (a do Java); sem ela, a página
   * genérica `series/[chave].astro` lista os posts. O endereço é sempre `/series/<chave>/` (D32).
   */
  paginaPropria?: boolean;
  /** "SÉRIE 01" na capa. */
  numero: number;
  /** Palavra principal do título e o complemento, em itálico no destaque. */
  tituloPrincipal: string;
  complemento: string;
  /** Cor de destaque da revista; faz também o papel da cor da categoria (chip, barra, desenho, D23). */
  destaque: string;
  numeroDeCapa: string;
  rotuloDoNumero: string;
  /** As edições da capa; a última é a atual. */
  edicoes: string[];
  /** A tarja do material especial da série (opcional). */
  guia?: { titulo: string; linha: string };
  /** Arquivo do emblema em `docs/capas/` (ex.: "serie/xicara.svg"). */
  emblema: string;
  /** Lombada na estante, em unidades da referência (CAPAS.md). */
  emPe: { altura: number; largura: number };
  /** Lombada deitada na lateral, em px no tamanho real. */
  deitada: { comprimento: number; espessura: number; deslocamento: number };
}

/** O que só existe aqui (chave e página); o resto vem do livros.json, pelo título. */
const CADASTRO: { chave: string; nome: string; paginaPropria?: boolean }[] = [
  { chave: "java", nome: "Atualizações do Java", paginaPropria: true },
];

export const SERIES: Serie[] = CADASTRO.map((s) => {
  const l = dados.series.find((x) => x.titulo === s.nome);
  if (!l) throw new Error(`Série "${s.nome}" fora de docs/capas/livros.json`);
  return {
    ...s,
    descricao: l.subtitulo,
    numero: l.numero,
    tituloPrincipal: l.tituloPrincipal,
    complemento: l.complemento,
    destaque: l.destaque,
    numeroDeCapa: l.numeroDeCapa,
    rotuloDoNumero: l.rotuloDoNumero,
    edicoes: l.edicoes,
    guia: l.guia,
    emblema: l.emblema,
    emPe: l.lombadaEmPe,
    deitada: { deslocamento: 0, ...l.lombadaDeitada },
  };
});

export function serie(chave: string | undefined): Serie | undefined {
  return chave ? SERIES.find((s) => s.chave === chave) : undefined;
}
