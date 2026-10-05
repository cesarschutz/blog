/**
 * Rodada 3 do redesenho (área 8): o que a ficha do resultado da busca busca, só quando precisa.
 *
 * - `dadosDoPost(url)`: os dados de um post (livro, volume, tempo, data, tags e a ilustração no recorte
 *   médio), de /busca/<slug>.json. Cada post vem uma vez só (a promessa fica guardada); a falha não fica,
 *   para a próxima passada tentar de novo.
 * - `livrosDaBusca()`: os livros 3D, um por livro com artigos, de /busca/livros/ (o mesmo LivroEmPe do
 *   site, em HTML), como um mapa id → elemento pronto para entrar na ficha. Também uma vez só.
 */
import { url } from "../url";

export interface DadosDoPost {
  slug: string;
  titulo: string;
  livro: string;
  livroNome: string;
  volume: string;
  minutos: number;
  data: string;
  cor: string;
  tags: string[];
  imagem: { alt: string; recorte: string; corpo: string } | null;
}

/** O slug de um endereço de post ("/posts/<slug>/", com ou sem a base). */
function slugDoEndereco(endereco: string): string | undefined {
  const caminho = new URL(endereco, location.href).pathname;
  const achado = caminho.match(/\/posts\/([^/]+)\/?$/);
  return achado ? decodeURIComponent(achado[1]) : undefined;
}

const posts = new Map<string, Promise<DadosDoPost>>();

export function dadosDoPost(endereco: string): Promise<DadosDoPost> | undefined {
  const slug = slugDoEndereco(endereco);
  if (!slug) return undefined;
  let p = posts.get(slug);
  if (!p) {
    p = fetch(url(`/busca/${encodeURIComponent(slug)}.json`)).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<DadosDoPost>;
    });
    p.catch(() => posts.delete(slug));
    posts.set(slug, p);
  }
  return p;
}

let livros: Promise<Map<string, HTMLElement>> | undefined;

export function livrosDaBusca(): Promise<Map<string, HTMLElement>> {
  livros ??= fetch(url("/busca/livros/"))
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.text();
    })
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const mapa = new Map<string, HTMLElement>();
      for (const el of doc.querySelectorAll<HTMLElement>("[data-livro-busca]")) {
        const livro = document.importNode(el, true);
        // Fora da troca de página: o livro da busca nunca ganha nome de transição (o da página, sim).
        livro.querySelectorAll("[data-vt]").forEach((v) => v.removeAttribute("data-vt"));
        livro.querySelectorAll<HTMLElement>(".livro-em-pe").forEach((v) => {
          v.style.removeProperty("view-transition-name");
          v.style.removeProperty("view-transition-class");
        });
        mapa.set(el.dataset.livroBusca!, livro);
      }
      return mapa;
    })
    .catch((erro) => {
      livros = undefined;
      throw erro;
    });
  return livros;
}
