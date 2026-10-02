/**
 * O texto de um post para a Pré-Visualização do computador (rodada 3, C7; o parser do protótipo 14), que
 * o mostra como um PDF (apps/previa.ts). Buscado só quando o leitor abre o arquivo.
 *
 * Sai do Markdown cru (`entry.body`), sem os componentes: os títulos (## e ###), os parágrafos, as
 * listas, os blocos de código, as citações e os avisos, e as tabelas. As marcações da caneta
 * (`:marca[...]{...}`, `:::exclamacao`) ficam só com o texto; imagens, lousas e figuras saem (o PDF
 * é simples, e o post de verdade continua no blog). O conteúdo dos posts não muda (O1): isto só lê.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getPosts, type Post } from "../../../lib/posts";

export const getStaticPaths = (async () => (await getPosts()).map((post) => ({ params: { slug: post.id }, props: { post } }))) satisfies GetStaticPaths;

type Bloco =
  | { t: "h2" | "h3" | "p" | "citacao"; html: string }
  | { t: "aviso"; tipo: string; html: string }
  | { t: "ul" | "ol"; itens: string[]; inicio?: number }
  | { t: "codigo"; linhas: string[]; titulo?: string; lingua?: string }
  | { t: "tabela"; cabeca: string[]; linhas: string[][] };

const escapar = (texto: string) => texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** O Markdown de uma linha em HTML simples: código, negrito, itálico e links (só o texto). */
function emLinha(md: string): string {
  const codigos: string[] = [];
  let s = md
    // As marcações da caneta e os textos com atributos: só o texto.
    .replace(/:[a-z-]+\[([^\]]*)\](\{[^}]*\})?/g, "$1")
    .replace(/\\([$*_`[\]#])/g, "$1")
    .replace(/`([^`]+)`/g, (_, c: string) => {
      codigos.push(c);
      return `\u0000${codigos.length - 1}\u0000`;
    })
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<\/?[a-zA-Z][^>]*>/g, "");
  s = escapar(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
    .replace(/(^|[^\w])_([^_\s][^_]*)_(?!\w)/g, "$1<em>$2</em>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i: string) => `<code>${escapar(codigos[Number(i)])}</code>`).trim();
}

const AVISOS: Record<string, string> = { NOTA: "Nota", NOTE: "Nota", DICA: "Dica", TIP: "Dica", IMPORTANTE: "Importante", IMPORTANT: "Importante", ATENCAO: "Atenção", WARNING: "Atenção", CUIDADO: "Cuidado", CAUTION: "Cuidado" };

function blocos(post: Post): Bloco[] {
  const linhas = (post.body ?? "").replace(/\r/g, "").split("\n");
  const saida: Bloco[] = [];
  let paragrafo: string[] = [];
  const fecharParagrafo = () => {
    const texto = paragrafo.join(" ").trim();
    paragrafo = [];
    const html = texto ? emLinha(texto) : "";
    if (html) saida.push({ t: "p", html });
  };

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    const aparada = linha.trim();

    // Código: até a cerca que fecha.
    const cerca = aparada.match(/^(`{3,}|~{3,})(\S*)(.*)$/);
    if (cerca) {
      fecharParagrafo();
      const fim = cerca[1];
      const corpo: string[] = [];
      for (i++; i < linhas.length && !linhas[i].trim().startsWith(fim); i++) corpo.push(linhas[i].replace(/\t/g, "  "));
      const titulo = cerca[3].match(/title="([^"]*)"/)?.[1];
      saida.push({ t: "codigo", linhas: corpo, titulo, lingua: cerca[2] || undefined });
      continue;
    }

    if (!aparada) {
      fecharParagrafo();
      continue;
    }

    // Imports e exports do MDX, e as cercas das marcações (:::exclamacao … :::): fora.
    if (/^(import|export)\s/.test(aparada) || /^:::/.test(aparada)) {
      fecharParagrafo();
      continue;
    }

    // Componentes (<Lousa … />, <FraseDestaque … />) e HTML solto: fora, até fechar.
    if (/^<[A-Za-z/]/.test(aparada)) {
      fecharParagrafo();
      const resumo = aparada.match(/^<summary>(.*)<\/summary>$/);
      if (resumo) {
        saida.push({ t: "h3", html: emLinha(resumo[1]) });
        continue;
      }
      const componente = aparada.match(/^<([A-Z]\w*)/);
      if (componente && !/\/>\s*$/.test(aparada) && !aparada.includes(`</${componente[1]}>`)) {
        for (i++; i < linhas.length; i++) {
          const l = linhas[i].trim();
          if (/^\/>$/.test(l) || /\/>\s*$/.test(l) || l.includes(`</${componente[1]}>`)) break;
        }
      }
      continue;
    }

    // Títulos.
    const titulo = aparada.match(/^(#{2,4})\s+(.*?)\s*(\{[^}]*\})?$/);
    if (titulo) {
      fecharParagrafo();
      saida.push({ t: titulo[1].length === 2 ? "h2" : "h3", html: emLinha(titulo[2]) });
      continue;
    }

    // Tabela.
    if (aparada.startsWith("|")) {
      fecharParagrafo();
      const celulas = (l: string) => l.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => emLinha(c.trim()));
      const cabeca = celulas(aparada);
      const corpo: string[][] = [];
      for (i++; i < linhas.length && linhas[i].trim().startsWith("|"); i++) {
        if (/^\|?\s*:?-{2,}/.test(linhas[i].trim())) continue;
        corpo.push(celulas(linhas[i]));
      }
      i--;
      saida.push({ t: "tabela", cabeca, linhas: corpo });
      continue;
    }

    // Citação e aviso.
    if (aparada.startsWith(">")) {
      fecharParagrafo();
      const corpo: string[] = [];
      for (; i < linhas.length && linhas[i].trim().startsWith(">"); i++) corpo.push(linhas[i].trim().replace(/^>\s?/, ""));
      i--;
      const tipo = corpo[0]?.match(/^\[!(\w+)\]/)?.[1];
      if (tipo) corpo[0] = corpo[0].replace(/^\[!\w+\]\s*/, "");
      const html = emLinha(corpo.filter(Boolean).join(" "));
      if (html) saida.push(tipo ? { t: "aviso", tipo: AVISOS[tipo.toUpperCase()] ?? "Nota", html } : { t: "citacao", html });
      continue;
    }

    // Listas (um nível; os itens de baixo entram no item de cima).
    const item = linha.match(/^(\s*)([-*+]|(\d+)[.)])\s+(.*)$/);
    if (item && item[1].length < 2) {
      fecharParagrafo();
      const ordenada = Boolean(item[3]);
      const itens: string[] = [];
      let atual = item[4];
      for (i++; i < linhas.length; i++) {
        const l = linhas[i];
        const proximo = l.match(/^(\s*)([-*+]|(\d+)[.)])\s+(.*)$/);
        if (proximo && proximo[1].length < 2) {
          itens.push(atual);
          atual = proximo[4];
        } else if (l.trim() && /^\s/.test(l) && !/^\s*(`{3,}|~{3,})/.test(l)) {
          atual += ` ${l.trim().replace(/^([-*+]|\d+[.)])\s+/, "")}`;
        } else if (!l.trim() && linhas[i + 1]?.match(/^(\s*)([-*+]|\d+[.)])\s+/)) {
          continue;
        } else break;
      }
      itens.push(atual);
      i--;
      saida.push({ t: ordenada ? "ol" : "ul", itens: itens.map(emLinha), inicio: ordenada ? Number(item[3]) : undefined });
      continue;
    }

    paragrafo.push(aparada);
  }
  fecharParagrafo();
  return saida;
}

export const GET: APIRoute = ({ props }) => {
  const post = props.post as Post;
  return new Response(JSON.stringify({ slug: post.id, blocos: blocos(post) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
