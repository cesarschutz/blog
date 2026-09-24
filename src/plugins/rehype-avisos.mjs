/**
 * Avisos escritos no Markdown (briefing §5.3), na sintaxe do GitHub: a citação que começa com
 * `[!NOTA]`, `[!DICA]`, `[!IMPORTANTE]`, `[!ATENCAO]` ou `[!CUIDADO]` (ou NOTE, TIP, IMPORTANT,
 * WARNING e CAUTION) vira o mesmo aviso do componente Aviso.astro. Texto na linha do marcador troca
 * o rótulo: `> [!DICA] Chave boa`. Marcador desconhecido fica como citação comum.
 */
import { ICONES } from "../lib/icones.ts";
import { MARCADORES_DOS_AVISOS, NOMES_DOS_AVISOS } from "../lib/avisos.ts";
import { el, substituir, texto } from "./hast.mjs";

const MARCADOR = /^\[!([^\]\s]+)\][ \t]*([^\n]*)\n?/;
const semAcento = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** O SVG do ícone, a partir do texto de src/lib/icones.ts (só elementos simples, sem filhos). */
function icone(tipo) {
  const partes = [...ICONES[tipo].matchAll(/<(\w+)([^>]*?)\/>/g)].map(([, tag, atributos]) =>
    el(tag, Object.fromEntries([...atributos.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, nome, valor]) => [nome, valor]))),
  );
  return el("svg", { viewBox: "0 0 24 24", ariaHidden: "true", focusable: "false" }, partes);
}

function aviso(citacao) {
  const primeiro = citacao.children.find((filho) => filho.type === "element");
  const inicio = primeiro?.tagName === "p" ? primeiro.children[0] : undefined;
  const achado = inicio?.type === "text" ? inicio.value.match(MARCADOR) : null;
  const tipo = achado && MARCADORES_DOS_AVISOS[semAcento(achado[1])];
  if (!tipo) return undefined;

  inicio.value = inicio.value.slice(achado[0].length);
  if (!inicio.value) primeiro.children.shift();
  const corpo = citacao.children.filter((filho) => filho.type === "element" && (filho !== primeiro || filho.children.length));
  const rotulo = achado[2].trim() || NOMES_DOS_AVISOS[tipo];
  const destaque = el("strong", { className: ["aviso-rotulo"] }, [texto(/[.:!?]$/.test(rotulo) ? rotulo : `${rotulo}.`)]);
  if (corpo[0]?.tagName === "p") corpo[0].children.unshift(destaque, texto(" "));
  else corpo.unshift(el("p", {}, [destaque]));

  return [el("aside", { className: ["aviso"], dataAviso: tipo, ariaLabel: rotulo }, [icone(tipo), el("div", { className: ["aviso-corpo"] }, corpo)])];
}

export function rehypeAvisos() {
  return (arvore) => substituir(arvore, (no) => (no.type === "element" && no.tagName === "blockquote" ? aviso(no) : undefined));
}
