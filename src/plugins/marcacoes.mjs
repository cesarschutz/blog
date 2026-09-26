/**
 * O caderno marcado (D41): as marcações à caneta, escritas no Markdown com diretivas
 * (remark-directive). O guia editorial (o que marcar, o que nunca marcar, os limites) está em
 * docs/marcacoes.md; o visual, no DESIGN.md; o movimento, em src/scripts/caderno.ts.
 *
 *   :marca[a ideia principal da seção]        marca-texto
 *   :sublinhado[não basta]                    sublinhado à caneta
 *   :circulo[P-521]                           círculo à caneta
 *   :::termos … :::                           em volta de uma lista: o primeiro `código` de cada item
 *   :::colchete … :::                         em volta do parágrafo que resume a seção
 *
 * O remark valida e dá as classes; o rehype põe os traços (SVG) da caneta. Regras que o build cobra
 * (docs/marcacoes.md): no máximo 8 marcações por artigo, nunca duas no mesmo parágrafo, nada em
 * títulos. Diretiva de texto com outro nome volta a ser texto (um "a:b" no meio da frase não some).
 */
import { el } from "./hast.mjs";

const EM_LINHA = { marca: "marca-texto", sublinhado: "sublinhado", circulo: "circulo" };
const BLOCO = { termos: "termos", colchete: "margem" };
const MAXIMO = 8;

/** Um nó de texto de volta, para diretivas de texto que não são marcações. */
function comoTexto(no) {
  const nome = { type: "text", value: `:${no.name}` };
  if (!no.children?.length) return [nome];
  return [nome, { type: "text", value: "[" }, ...no.children, { type: "text", value: "]" }];
}

function erro(arquivo, no, mensagem) {
  const onde = no.position ? `:${no.position.start.line}` : "";
  throw new Error(`Marcações (docs/marcacoes.md), ${arquivo.path ?? "post"}${onde}: ${mensagem}`);
}

export function remarkMarcacoes() {
  return (arvore, arquivo) => {
    let total = 0;
    const visitar = (no, pai, dentroDeTitulo, paragrafo) => {
      if (!Array.isArray(no.children)) return;
      no.children = no.children.flatMap((filho) => {
        if (filho.type === "textDirective") {
          const classe = EM_LINHA[filho.name];
          if (!classe) {
            const trocados = comoTexto(filho);
            trocados.forEach((t) => visitar(t, no, dentroDeTitulo, paragrafo));
            return trocados;
          }
          if (dentroDeTitulo) erro(arquivo, filho, `:${filho.name} dentro de um título`);
          if (paragrafo) {
            paragrafo.marcas = (paragrafo.marcas ?? 0) + 1;
            if (paragrafo.marcas > 1) erro(arquivo, filho, "duas marcações no mesmo parágrafo");
          }
          total++;
          filho.data = { hName: "span", hProperties: { className: [classe], dataMarcacao: filho.name } };
          visitar(filho, no, dentroDeTitulo, paragrafo);
          return [filho];
        }
        if (filho.type === "containerDirective" || filho.type === "leafDirective") {
          const classe = BLOCO[filho.name];
          if (!classe || filho.type === "leafDirective") erro(arquivo, filho, `diretiva desconhecida "${filho.name}"`);
          total++;
          if (filho.name === "termos") {
            const lista = filho.children.find((c) => c.type === "list");
            if (!lista) erro(arquivo, filho, ":::termos precisa de uma lista dentro");
            lista.data = { ...lista.data, hProperties: { className: ["termos"], dataMarcacao: "termos" } };
            for (const item of lista.children) {
              const codigo = achar(item, "inlineCode");
              if (codigo) codigo.data = { ...codigo.data, hProperties: { className: ["termo"] } };
            }
            // A lista fica no lugar do contêiner, sem um <div> em volta.
            visitar(lista, filho, false, null);
            return filho.children;
          }
          filho.data = { hName: "div", hProperties: { className: [classe], dataMarcacao: filho.name } };
          const marcado = { marcas: 1 };
          for (const p of filho.children) visitar(p, filho, false, p.type === "paragraph" ? marcado : null);
          return [filho];
        }
        // O texto alternativo da imagem é calculado antes deste plugin: um "às 03:00" nele virava
        // diretiva e perdia o ":00". Ele volta a ser o texto do Markdown original.
        if (filho.type === "image" && filho.position && String(filho.alt ?? "") !== "") {
          const fonte = String(arquivo.value).slice(filho.position.start.offset, filho.position.end.offset);
          const rotulo = fonte.match(/^!\[([\s\S]*?)\]\(/)?.[1];
          if (rotulo?.includes(":")) filho.alt = rotulo.replace(/\\([\\`*_{}\[\]()#+\-.!:|])/g, "$1");
        }
        const titulo = dentroDeTitulo || filho.type === "heading";
        visitar(filho, no, titulo, filho.type === "paragraph" ? {} : paragrafo);
        return [filho];
      });
    };
    visitar(arvore, null, false, null);
    if (total > MAXIMO) erro(arquivo, arvore, `${total} marcações; o limite é ${MAXIMO} por artigo`);
  };
}

function achar(no, tipo) {
  if (no.type === tipo) return no;
  for (const filho of no.children ?? []) {
    const achado = achar(filho, tipo);
    if (achado) return achado;
  }
}

// ---------- os traços da caneta ----------

// Traços à mão, alternados para duas marcações iguais não saírem idênticas.
const SUBLINHADOS = ["M1 6.5 C 18 3.5, 36 8, 55 5.5 S 86 4, 99 6", "M1 6 C 20 8.5, 45 3.5, 62 6 S 90 7.5, 99 5.5"];
const CIRCULOS = [
  "M10 25 C 5 10, 38 3, 68 5 C 94 7, 99 27, 80 35 C 55 43, 12 40, 6 26 C 4 17, 16 9, 30 7",
  "M88 20 C 92 8, 60 3, 34 5 C 8 7, 2 25, 18 35 C 40 44, 86 40, 94 26 C 97 16, 84 8, 70 7",
];
const COLCHETE = "M10 2 C 4 2, 3 5, 3.5 12 L 4 88 C 4 95, 5 98, 10 98";

const traco = (classe, viewBox, d) =>
  el("svg", { className: [classe], viewBox, preserveAspectRatio: "none", ariaHidden: "true", focusable: "false" }, [el("path", { d })]);

export function rehypeMarcacoes() {
  return (arvore) => {
    let sub = 0;
    let circ = 0;
    const visitar = (no) => {
      for (const filho of no.children ?? []) {
        const m = filho.type === "element" && filho.properties?.dataMarcacao;
        if (m === "sublinhado") filho.children.push(traco("traco-caneta", "0 0 100 10", SUBLINHADOS[sub++ % 2]));
        else if (m === "circulo") filho.children.push(traco("traco-caneta", "0 0 100 44", CIRCULOS[circ++ % 2]));
        else if (m === "colchete") filho.children.unshift(traco("colchete", "0 0 12 100", COLCHETE));
        visitar(filho);
      }
    };
    visitar(arvore);
  };
}
