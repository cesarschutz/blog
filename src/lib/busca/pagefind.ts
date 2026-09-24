/**
 * Motor B da D2: Pagefind 1.5 com a nossa interface. O índice fica em fragmentos (dist/pagefind/),
 * gerado depois do build. Acentos: normalizados pelo próprio Pagefind.
 * - Frase exata: o Pagefind 1.5 aceita a busca entre aspas (não documentada no pacote, conferida no
 *   código e nos testes da D2), mas não ranqueia: todo resultado vem com nota 1. Com mais de uma
 *   palavra, rodam as duas buscas sobre os mesmos pedaços do índice; a exata diz quem tem a frase, e a
 *   ordem vem das notas da busca por todas as palavras. Primeiro os que têm a frase, depois os demais.
 * - `#tag` sozinha: procura a palavra da tag (palavraDaTag), em ordem de data, com a descrição no
 *   lugar do trecho. O filtro sem termo baixaria o índice inteiro (4 MB com 500 posts).
 * - `#tag texto`: o texto, filtrado pela tag.
 * Só baixa o texto dos resultados exibidos.
 */
import { url } from "../url";
import { escaparHtml, normalizar, palavraDaTag, separarTag, type MotorDeBusca, type ResultadoBusca } from "./tipos";

interface DadosPagefind {
  url: string;
  content: string;
  excerpt: string;
  meta: Record<string, string>;
}

interface ResultadoPagefind {
  id: string;
  data(): Promise<DadosPagefind>;
}

interface Pagefind {
  options(opcoes: Record<string, unknown>): Promise<void>;
  init(): Promise<void>;
  filters(): Promise<Record<string, Record<string, number>>>;
  search(termo: string | null, opcoes?: Record<string, unknown>): Promise<{ results: ResultadoPagefind[] }>;
}

const LIMITE = 10;

let carregando: Promise<Pagefind> | undefined;

function carregar(): Promise<Pagefind> {
  carregando ??= (async (): Promise<Pagefind> => {
    const pagefind: Pagefind = await import(/* @vite-ignore */ url("/pagefind/pagefind.js"));
    await pagefind.options({
      baseUrl: url("/"),
      excerptLength: 24,
      ranking: { metaWeights: { title: 10, tags: 6, descricao: 3 } },
    });
    await pagefind.init();
    return pagefind;
  })().catch((erro) => {
    // Sem cache da falha: a próxima busca tenta carregar de novo.
    carregando = undefined;
    throw erro;
  });
  return carregando;
}

async function nomeDaTag(pagefind: Pagefind, digitada: string): Promise<string | undefined> {
  const tags = Object.keys((await pagefind.filters()).tag ?? {});
  const alvo = normalizar(digitada);
  return tags.find((t) => normalizar(t) === alvo) ?? tags.find((t) => normalizar(t).startsWith(alvo));
}

const paraResultado = (d: DadosPagefind, comDescricao = false): ResultadoBusca => ({
  url: d.url,
  titulo: d.meta.title ?? "",
  rotulo: d.meta.rotulo ?? "",
  data: d.meta.data ?? "",
  trecho: comDescricao ? escaparHtml(d.meta.descricao ?? "") : d.excerpt,
});

export const motorPagefind: MotorDeBusca = {
  async preparar() {
    await carregar();
  },

  async buscar(consulta) {
    const pagefind = await carregar();
    const { tag, texto } = separarTag(consulta);
    const termos = texto.replace(/"/g, " ").trim().replace(/\s+/g, " ");
    const nome = tag ? await nomeDaTag(pagefind, tag) : undefined;
    if (tag && !nome) return [];
    if (nome && !termos) {
      const busca = await pagefind.search(palavraDaTag(nome), { sort: { data: "desc" } });
      const dados = await Promise.all(busca.results.slice(0, LIMITE).map((r) => r.data()));
      return dados.map((d) => paraResultado(d, true));
    }
    if (normalizar(termos).length < 2) return [];

    const opcoes = { filters: nome ? { tag: nome } : {} };
    const [exata, todas] = await Promise.all([
      termos.includes(" ") ? pagefind.search(`"${termos}"`, opcoes) : undefined,
      pagefind.search(termos, opcoes),
    ]);
    const comFrase = new Set(exata?.results.map((r) => r.id));
    const ordem = [...todas.results.filter((r) => comFrase.has(r.id)), ...todas.results.filter((r) => !comFrase.has(r.id))];
    const dados = await Promise.all(ordem.slice(0, LIMITE).map((r) => r.data()));
    return dados.map((d) => paraResultado(d));
  },
};
