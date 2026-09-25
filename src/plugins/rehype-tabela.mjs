/**
 * Envolve cada tabela num contêiner que rola na horizontal no celular (briefing §5.3). O contêiner
 * recebe foco pelo teclado, para quem não usa mouse conseguir rolar.
 *
 * Também põe um ponto de quebra (`<wbr>`) depois de cada ponto do código em linha
 * ("AopUtils.getTargetClass"), em todo o texto: numa coluna estreita ou numa célula, o nome quebra ali
 * e não no meio da palavra (D39).
 */
const QUEBRA = /(?<=\.)(?=[A-Za-z_$])/;

function quebrarCodigo(no) {
  if (!Array.isArray(no.children)) return;
  if (no.type === "element" && no.tagName === "pre") return;
  if (no.type === "element" && no.tagName === "code") {
    no.children = no.children.flatMap((filho) => {
      if (filho.type !== "text" || !QUEBRA.test(filho.value)) return [filho];
      return filho.value
        .split(QUEBRA)
        .flatMap((parte, i) => (i === 0 ? [{ type: "text", value: parte }] : [{ type: "element", tagName: "wbr", properties: {}, children: [] }, { type: "text", value: parte }]));
    });
    return;
  }
  no.children.forEach(quebrarCodigo);
}

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
  return (arvore) => {
    envolver(arvore);
    quebrarCodigo(arvore);
  };
}
