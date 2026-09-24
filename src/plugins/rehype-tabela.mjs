/**
 * Envolve cada tabela num contêiner que rola na horizontal no celular (briefing §5.3). O contêiner
 * recebe foco pelo teclado, para quem não usa mouse conseguir rolar.
 */
export function rehypeTabela() {
  const envolver = (no) => {
    if (!Array.isArray(no.children)) return;
    no.children = no.children.map((filho) => {
      if (filho.type === "element" && filho.tagName === "table") {
        return { type: "element", tagName: "div", properties: { className: ["tabela"], tabIndex: 0 }, children: [filho] };
      }
      envolver(filho);
      return filho;
    });
  };
  return (arvore) => envolver(arvore);
}
