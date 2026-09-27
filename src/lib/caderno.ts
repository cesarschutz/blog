/**
 * O miolo do caderno "cs" (A01, D52): a página que aparece quando a capa da marca abre, no cabeçalho, na
 * marca grande da home e no caderno da abertura das outras telas. Papel dos livros (--marca-letra) com a
 * pauta de caderno (--caderno-pauta), igual nos dois temas, como os livros (D39), e a mesma nos três
 * lugares. Tem o viewBox da marca (MARCA_VIEWBOX, 0 0 40 52): a página fica atrás da capa, com uma folga
 * nas bordas, e a pauta começa mais baixo, como numa folha de caderno.
 *
 * As linhas são dois traçados: a pauta e as entrelinhas (as linhas do meio). No cabeçalho, onde o
 * caderno tem 27px de altura, só a pauta aparece, mais fina (com todas, a página virava uma escada
 * cinza). Os traços têm 1px na tela em qualquer tamanho (non-scaling-stroke), e as cores vão no próprio
 * desenho, pelos tokens, para o caderno sair igual em qualquer lugar em que for embutido.
 */
const ESQ = 3;
const TOPO = 1.2;
const LARGURA = 36;
const ALTURA = 49.6;
/** A primeira linha, o espaço entre elas e quantas cabem (a última fica a ~3,7 da borda de baixo). */
const PRIMEIRA = 8.6;
const PASSO = 3.5;
const LINHAS = 12;

const linha = (i: number) => `M${ESQ + 0.7} ${(PRIMEIRA + i * PASSO).toFixed(2)}H${ESQ + LARGURA - 0.7}`;
const indices = Array.from({ length: LINHAS }, (_, i) => i);
// As cores no estilo (só ele aceita os tokens); a espessura em atributo, que o CSS de quem embute pode trocar.
const traco = `style="fill:none;stroke:var(--caderno-pauta)" stroke-width="1" vector-effect="non-scaling-stroke"`;

export const MIOLO_SVG =
  `<rect class="caderno-pagina" x="${ESQ}" y="${TOPO}" width="${LARGURA}" height="${ALTURA}" rx="2" ` +
  `style="fill:var(--marca-letra);stroke:var(--caderno-pauta)" stroke-width="1" vector-effect="non-scaling-stroke"/>` +
  `<path class="caderno-pauta" d="${indices.filter((i) => i % 2 === 0).map(linha).join("")}" ${traco}/>` +
  `<path class="caderno-entrelinha" d="${indices.filter((i) => i % 2 === 1).map(linha).join("")}" ${traco}/>`;
