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
 * - Sem nenhuma palavra que case, o Pagefind encurta o termo até sobrar uma letra ("bananada" → "b")
 *   e devolve qualquer coisa. Por isso cada resultado é conferido: exato se todo termo começa alguma
 *   palavra do post (texto, título, descrição ou tags); parecido se cada termo divide com alguma
 *   palavra pelo menos 60% do começo (3 letras no mínimo). Os exatos vêm primeiro; os parecidos só
 *   aparecem, marcados, quando não há exato; o resto sai (D37).
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

const palavrasDe = (d: DadosPagefind) =>
  new Set(normalizar([d.content, d.meta.title, d.meta.descricao, d.meta.tags].join(" ")).split(/[^a-z0-9]+/).filter(Boolean));

const prefixoComum = (a: string, b: string) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};

/** "exato", "parecido" ou undefined (fora), pelos termos já normalizados. */
function conferir(d: DadosPagefind, termos: string[]): "exato" | "parecido" | undefined {
  const palavras = [...palavrasDe(d)];
  if (termos.every((t) => palavras.some((p) => p.startsWith(t)))) return "exato";
  const parecido = termos.every((t) => {
    const minimo = Math.max(3, Math.ceil(t.length * 0.6));
    return palavras.some((p) => prefixoComum(p, t) >= minimo);
  });
  return parecido ? "parecido" : undefined;
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
    const normalizados = normalizar(termos).split(/[^a-z0-9]+/).filter((t) => t.length >= 2);
    const conferidos = dados.map((d) => ({ d, tipo: conferir(d, normalizados) }));
    const exatos = conferidos.filter((c) => c.tipo === "exato");
    if (exatos.length) return exatos.map((c) => paraResultado(c.d));
    return conferidos.filter((c) => c.tipo === "parecido").map((c) => ({ ...paraResultado(c.d), aproximado: true }));
  },
};
