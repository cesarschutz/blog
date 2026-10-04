/**
 * Envolve cada tabela num contêiner que rola na horizontal no celular (briefing §5.3). O contêiner
 * recebe foco pelo teclado, para quem não usa mouse conseguir rolar.
 *
 * Também põe um ponto de quebra (`<wbr>`) depois de cada ponto do código em linha
 * ("AopUtils.getTargetClass"), em todo o texto: numa coluna estreita ou numa célula, o nome quebra ali
 * e não no meio da palavra (D39).
 *
 * E marca as colunas de texto (D70): a coluna em que alguma célula do corpo tem 30 letras ou mais
 * ganha `data-texto` na célula do cabeçalho. No celular, o CSS (prosa.css) dá a essa coluna uma largura
 * mínima, para o texto não encolher até uma palavra por linha; a tabela que não couber rola.
 */
const QUEBRA = /(?<=\.)(?=[A-Za-z_$])/;

/** A partir de quantas letras na maior célula a coluna é de texto (frase), e não de rótulo, número ou sim/não. */
const LETRAS_DE_TEXTO = 30;

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

/** Os elementos filhos de um nó; com `nomes`, só os dessas tags. */
const filhos = (no, ...nomes) => (no.children ?? []).filter((f) => f.type === "element" && (!nomes.length || nomes.includes(f.tagName)));

/** As linhas da tabela, na ordem, cada uma dizendo se é do cabeçalho (`thead`). */
function linhas(tabela) {
  const lista = [];
  for (const parte of filhos(tabela)) {
    if (parte.tagName === "tr") lista.push({ tr: parte, cabecalho: false });
    else for (const tr of filhos(parte, "tr")) lista.push({ tr, cabecalho: parte.tagName === "thead" });
  }
  return lista;
}

/** Quantas letras o leitor vê na célula (o MathML que o KaTeX repete para o leitor de tela não conta). */
const letras = (no) =>
  (no.type === "element" && no.tagName === "math" ? "" : no.type === "text" ? no.value : (no.children ?? []).map(letras).join(""));

/**
 * Marca as colunas de texto com `data-texto` na primeira linha (a do cabeçalho; sem `thead`, a primeira
 * que houver). Tabela com célula mesclada fica como está: não dá para dizer de que coluna é o texto.
 */
function marcarColunasDeTexto(tabela) {
  const todas = linhas(tabela);
  if (!todas.length) return;
  const celulas = todas.map(({ tr }) => filhos(tr, "th", "td"));
  if (celulas.flat().some((c) => Number(c.properties?.colSpan ?? 1) > 1 || Number(c.properties?.rowSpan ?? 1) > 1)) return;
  const temCabecalho = todas.some((l) => l.cabecalho);
  celulas[0].forEach((primeira, coluna) => {
    const maior = Math.max(
      0,
      ...celulas
        .filter((_, i) => !temCabecalho || !todas[i].cabecalho)
        .map((linha) => (linha[coluna] ? letras(linha[coluna]).replace(/\s+/g, " ").trim().length : 0)),
    );
    if (maior >= LETRAS_DE_TEXTO) primeira.properties = { ...primeira.properties, dataTexto: "" };
  });
}

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

/**
 * A opção `saida` (astro.config) não muda nada aqui: é o número da versão do HTML que este plugin gera.
 * Ela entra na configuração que o Astro compara para refazer o HTML guardado dos posts .md (D70).
 */
export function rehypeTabela() {
  const envolver = (no) => {
    if (!Array.isArray(no.children)) return;
    no.children = no.children.map((filho) => {
      if (filho.type === "element" && filho.tagName === "table") {
        // Quem chega pelo Tab ouve o que é a parada (D54): uma região com o nome das colunas.
        const colunas = cabecalho(filho);
        const nome = colunas ? `Tabela: ${colunas.length > 80 ? `${colunas.slice(0, 79)}…` : colunas}` : "Tabela";
        marcarColunasDeTexto(filho);
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
