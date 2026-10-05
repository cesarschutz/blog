/**
 * Rodada 3, área 10 (F12-1): a tira de ficha de cada artigo, como a do protótipo 12 ("a ficha com os
 * números de cada um, muito legal"). Como na biblioteca, ela diz em que livro o artigo mora e em que
 * lugar dele:
 *
 * - à esquerda, a chamada: "Vol. 05 · ficha 2" (o volume da coleção e a ordem do artigo dentro do
 *   livro, do mais antigo ao mais novo) ou, numa série, "Coleção Java · ed. 7" (a ordem de leitura da
 *   série, a mesma da página dela);
 * - à direita, o tombo: a ordem do artigo no blog inteiro, do primeiro ao último ("nº 028").
 *
 * Tudo sai dos posts: cresce sozinho com o blog (N11). Usada pelo Cartao e pelo ItemLista.
 */
import { montarLivros } from "./estante";
import { getResumos, type Resumo } from "./posts";

interface Chamada {
  /** "Vol. 05 · ficha 2" ou "Coleção Java · ed. 7". */
  chamada: string;
  /** "nº 028". */
  tombo: string;
}

let cache: Promise<Map<string, Chamada>> | undefined;

function montar(): Promise<Map<string, Chamada>> {
  cache ??= (async () => {
    const [livros, resumos] = await Promise.all([montarLivros(), getResumos()]);
    const pelaData = (a: Resumo, b: Resumo) => a.publicado.getTime() - b.publicado.getTime() || a.slug.localeCompare(b.slug);
    const mapa = new Map<string, Chamada>();
    [...resumos].sort(pelaData).forEach((p, i) => {
      const livro = livros.find((l) => l.id === p.livro);
      // Na série, a ordem de leitura (getPostsDaSerie); no livro, a ordem de chegada.
      const doLivro = livro ? (livro.serie ? livro.posts : [...livro.posts].sort(pelaData)) : [];
      const n = doLivro.findIndex((x) => x.slug === p.slug) + 1;
      const colecao = livro?.revista ? livro.revista.complemento.replace(/^d[oa]s?\s+/i, "") : (livro?.nome ?? "");
      const chamada = !livro
        ? ""
        : livro.serie
          ? `Coleção ${colecao} · ed. ${n}`
          : `Vol. ${String(livro.volume ?? 0).padStart(2, "0")} · ficha ${n}`;
      mapa.set(p.slug, { chamada, tombo: `nº ${String(i + 1).padStart(3, "0")}` });
    });
    return mapa;
  })();
  return cache;
}

export async function chamadaDe(post: Resumo): Promise<Chamada> {
  return (await montar()).get(post.slug) ?? { chamada: "", tombo: "" };
}
