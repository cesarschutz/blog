/**
 * Notas de rodapé do Markdown (`[^1]`) viram notas laterais (briefing §5.3). O texto da nota vai
 * para logo depois da chamada, num <span role="note">: em telas ≥ 1180px o CSS o põe na margem; nas
 * menores ele fica fechado e abre no lugar ao tocar no número (por :target, sem JS; com JS, o script
 * da página alterna). A seção de notas do fim sai. Nota com lista ou código perde esses blocos: a
 * nota lateral só leva parágrafos.
 */
import { el, substituir, texto, textoDe } from "./hast.mjs";

const elemento = (no, tag) => no.type === "element" && no.tagName === tag;

/** Os parágrafos da nota, sem a seta de volta, emendados por <br>. */
function conteudo(item) {
  const paragrafos = item.children.filter((filho) => elemento(filho, "p"));
  return paragrafos.flatMap((p, i) => {
    const partes = p.children.filter((filho) => !(elemento(filho, "a") && "dataFootnoteBackref" in filho.properties));
    const ultima = partes.at(-1);
    if (ultima?.type === "text") ultima.value = ultima.value.trimEnd();
    return i ? [el("br"), ...partes] : partes;
  });
}

export function rehypeNotasLaterais() {
  return (arvore) => {
    const notas = new Map();
    substituir(arvore, (no) => {
      if (!elemento(no, "section") || !("dataFootnotes" in no.properties)) return undefined;
      const lista = no.children.find((filho) => elemento(filho, "ol"));
      for (const item of lista?.children ?? []) if (elemento(item, "li")) notas.set(`#${item.properties.id}`, conteudo(item));
      return [];
    });
    if (!notas.size) return;

    const postas = new Set();
    substituir(arvore, (no) => {
      const link = elemento(no, "sup") ? no.children.find((filho) => elemento(filho, "a")) : undefined;
      if (!link || !("dataFootnoteRef" in link.properties)) return undefined;
      const numero = textoDe(link).trim();
      const id = `nota-${numero}`;
      const chamada = el("sup", { className: ["ref-nota"] }, [
        el("a", { href: `#${id}`, ariaLabel: `Nota ${numero}`, dataRefNota: "" }, [texto(numero)]),
      ]);
      if (postas.has(id)) return [chamada];
      postas.add(id);
      const nota = el("span", { className: ["nota-lateral"], id, role: "note" }, [
        el("span", { className: ["numero-nota"], ariaHidden: "true" }, [texto(numero)]),
        texto(" "),
        ...(notas.get(link.properties.href) ?? []),
      ]);
      return [chamada, nota];
    });
  };
}
