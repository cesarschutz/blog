/**
 * Apresentação do NotebookLM (briefing §5.3 e §8.3). Nos posts com deck em src/data/decks.json,
 * insere a seção "Apresentação" (sempre sem número, D14) logo antes de "Fontes": os slides numa
 * faixa que rola sem JS (scroll-snap) e o link do PDF gerado no build. O script de
 * Apresentacao.astro liga as setas, o contador e a tela cheia. Post com deck e sem a seção "Fontes"
 * quebra o build: a apresentação não tem outro lugar certo.
 */
import { basename } from "node:path";
import decks from "../data/decks.json" with { type: "json" };
import { el, texto, textoDe } from "./hast.mjs";

const ehFontes = (no) => no.type === "element" && no.tagName === "h2" && /^(\d+[.)]?\s+)?fontes$/i.test(textoDe(no).trim());

/** Botão que só aparece com JS; `acao` vira o atributo data-* ("tela-cheia" → data-tela-cheia). */
const botao = (acao, rotulo) =>
  el("button", { type: "button", className: ["botao"], [`data${acao.replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase())}`]: "", hidden: true }, [
    texto(rotulo),
  ]);

function secao(slug, deck, base) {
  const pasta = `${base}posts/${slug}`;
  const total = deck.slides;
  const slides = Array.from({ length: total }, (_, i) =>
    el("li", { className: ["slide"] }, [
      el("img", {
        src: `${pasta}/deck/${String(i + 1).padStart(2, "0")}.webp`,
        alt: `Slide ${i + 1} de ${total}: ${deck.titulo}`,
        width: deck.largura,
        height: deck.altura,
        loading: "lazy",
        decoding: "async",
      }),
    ]),
  );
  return el("section", { className: ["apresentacao"], ariaLabelledBy: "apresentacao", dataApresentacao: "" }, [
    el("h2", { id: "apresentacao" }, [texto("Apresentação")]),
    el("ul", { className: ["slides"], tabIndex: 0, ariaLabel: `${deck.titulo}, ${total} slides` }, slides),
    el("div", { className: ["barra-slides"] }, [
      el("span", { className: ["posicao"], dataPosicao: "", ariaLive: "polite", hidden: true }, [texto(`1 de ${total}`)]),
      botao("anterior", "Anterior"),
      botao("proximo", "Próximo"),
      botao("tela-cheia", "Tela cheia"),
      el("a", { className: ["botao"], href: `${pasta}/apresentacao.pdf`, download: `${slug}.pdf` }, [texto("Baixar PDF")]),
    ]),
  ]);
}

/** @param {{ base?: string }} [opcoes] */
export function rehypeApresentacao({ base = "/" } = {}) {
  return (arvore, arquivo) => {
    const slug = arquivo.path ? basename(arquivo.path).replace(/\.mdx?$/, "") : "";
    const deck = decks[slug];
    if (!deck) return;
    const i = arvore.children.findIndex(ehFontes);
    if (i < 0) {
      throw new Error(`O post "${slug}" tem apresentação (src/data/decks.json), mas não tem a seção "## Fontes", antes da qual ela entra.`);
    }
    arvore.children.splice(i, 0, secao(slug, deck, base), texto("\n"));
  };
}
