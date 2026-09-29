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

/** O texto de um nó (sem as tags). */
const texto = (no) => (no.type === "text" ? no.value : Array.isArray(no.children) ? no.children.map(texto).join("") : "");

/** As células do cabeçalho da tabela ("Estado, Em inglês, …"), para dar nome ao contêiner. */
function cabecalho(tabela) {
  const celulas = [];
  const achar = (no) => {
    if (no.type !== "element") return;
    if (no.tagName === "th") celulas.push(texto(no).trim());
    else if (!celulas.length) (no.children ?? []).forEach(achar);
  };
  achar(tabela);
  return celulas.filter(Boolean).join(", ");
}

export function rehypeTabela() {
  const envolver = (no) => {
    if (!Array.isArray(no.children)) return;
    no.children = no.children.map((filho) => {
      if (filho.type === "element" && filho.tagName === "table") {
        // Quem chega pelo Tab ouve o que é a parada (D54): uma região com o nome das colunas.
        const colunas = cabecalho(filho);
        const nome = colunas ? `Tabela: ${colunas.length > 80 ? `${colunas.slice(0, 79)}…` : colunas}` : "Tabela";
        return { type: "element", tagName: "div", properties: { className: ["tabela"], tabIndex: 0, role: "region", ariaLabel: nome }, children: [filho] };
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
