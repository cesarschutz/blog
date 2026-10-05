/**
 * A doca da coleção da home (D78, pedido do Cesar: "um efeito tipo o dock do Mac, quando passar o mouse no
 * livro ele aumentar de tamanho"). Só com mouse e sem movimento reduzido.
 *
 * O livro sob o mouse cresce até 1 + AUMENTO, e os vizinhos da mesma prateleira crescem menos, pela distância
 * do mouse ao meio de cada lugar (um sino de cosseno de ALCANCE lugares para cada lado). Cada livro cresce de
 * pé, pela base (a `.tomba`, com a origem no pé). Para eles não se atropelarem, a prateleira se ajeita como a
 * doca: os de um lado do mouse vão para a esquerda e os do outro, para a direita, cada um com a soma do que os
 * de antes cresceram; e, para ela não passar de onde vai o texto, os vãos fecham por igual o que ela cresceu
 * (as pontas saem no máximo SOBRA px). O maior fica por cima dos vizinhos (`z-index` da `.tomba`, e não do
 * lugar: o lugar que abre a prateleira leva a lâmina dela, que passaria por cima dos outros livros).
 *
 * Com as prateleiras (D84), a doca vale na prateleira em que o mouse está: os lugares são agrupados pela altura
 * deles na tela, a cada quadro (a forma muda com a largura). Os livros ficaram grandes, e o aumento caiu de
 * 1,5× para 1,14×; ele cresce para dentro do teto do lugar (onde fica o abajur) e nunca passa dele.
 *
 * Custo: um requestAnimationFrame só, que dorme parado. Por quadro, lê o retângulo da prateleira e as medidas
 * de layout dos lugares (`offsetLeft` e `offsetTop`, que não mudam com o `translate`), e depois escreve
 * `translate` e `scale` na `.tomba`. O `.livro-vivo` de dentro (o hover com mola, o seguir o mouse e a onda de
 * molas) continua por conta de livro-vivo.ts e estante-moderna.ts.
 */

const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
const comMouse = matchMedia("(hover: hover) and (pointer: fine)");
const raiz = document.documentElement;

/** O livro sob o mouse fica 1 + AUMENTO vezes maior. */
const AUMENTO = 0.14;
/** Até quantos lugares para cada lado o aumento chega (o sino vai a zero aí). */
const ALCANCE = 2.2;
/** O quanto as pontas da prateleira podem sair, em px (a margem do corte da coleção é de 12px). */
const SOBRA = 10;
/** A fração do caminho até o alvo a cada 1/60 s (a doca segue o mouse de perto, sem atraso de mola); a conta
 * usa o tempo do quadro, e a doca anda na mesma velocidade com a tela a 60, 120 ou 30 quadros por segundo. */
const SEGUE = 0.24;

interface Lugar {
  lugar: HTMLElement;
  tomba: HTMLElement;
  s: number;
  x: number;
}

interface Doca {
  prat: HTMLElement;
  lugares: Lugar[];
  /** O mouse, na tela; null quando ele saiu da coleção. */
  mouse: { x: number; y: number } | null;
  pedido: number;
  /** O instante do quadro anterior (0 quando a doca estava parada). */
  antes: number;
}

function parado() {
  return reduzido.matches || !!raiz.dataset.abertura;
}

/** O livro clicado está indo para a página dele: a doca para onde está (o voo parte do tamanho que se vê). */
const indo = () => raiz.hasAttribute("data-abre-livro");

function soltar(l: Lugar) {
  l.s = 1;
  l.x = 0;
  l.tomba.style.removeProperty("translate");
  l.tomba.style.removeProperty("scale");
  l.tomba.style.removeProperty("z-index");
}

function soltarJa(doca: Doca) {
  doca.mouse = null;
  if (doca.pedido) cancelAnimationFrame(doca.pedido);
  doca.pedido = 0;
  doca.antes = 0;
  doca.lugares.forEach(soltar);
}

type Medida = { c: number; w: number; h: number; topo: number; pe: number; teto: number };

/** Os alvos de uma prateleira: o tamanho de cada lugar e o deslocamento que abre espaço para ele. */
function alvos(medidas: Medida[], mx: number | null) {
  if (mx === null) return medidas.map(() => ({ s: 1, x: 0 }));
  const passo = medidas.length > 1 ? (medidas[medidas.length - 1].c - medidas[0].c) / (medidas.length - 1) : medidas[0].w;
  const raio = passo * ALCANCE;
  // O teto: o livro cresce para dentro do alto do lugar (o abajur), sem passar dele.
  const altura = Math.max(...medidas.map((m) => m.h), 1);
  const aumento = Math.min(AUMENTO, medidas[0].teto / altura);
  const s = medidas.map((m) => {
    const d = Math.abs(mx - m.c);
    return d >= raio ? 1 : 1 + aumento * (0.5 + 0.5 * Math.cos((Math.PI * d) / raio));
  });
  const extra = medidas.map((m, i) => m.w * (s[i] - 1));
  const total = extra.reduce((a, b) => a + b, 0);
  const sai = Math.min(SOBRA, total / 2);
  const ponta0 = medidas[0].c;
  const vao = medidas[medidas.length - 1].c - ponta0 || 1;
  let antes = 0;
  return medidas.map((m, i) => {
    const x = antes + extra[i] / 2 - sai - (total - 2 * sai) * ((m.c - ponta0) / vao);
    antes += extra[i];
    return { s: s[i], x };
  });
}

function quadro(doca: Doca, agora: number) {
  doca.pedido = 0;
  const passou = doca.antes ? Math.min(agora - doca.antes, 100) : 1000 / 60;
  doca.antes = agora;
  const segue = 1 - Math.pow(1 - SEGUE, passou / (1000 / 60));
  const { prat, lugares } = doca;
  if (indo()) {
    doca.antes = 0;
    return;
  }
  if (parado()) {
    soltarJa(doca);
    return;
  }

  // Leitura: a coleção na tela e os lugares no layout (sem o translate), agrupados por prateleira.
  const r = prat.getBoundingClientRect();
  const medidas: Medida[] = lugares.map((l) => {
    const estilo = getComputedStyle(l.lugar);
    const entre = parseFloat(estilo.getPropertyValue("--k-entre")) || 0;
    return {
      c: l.lugar.offsetLeft + l.lugar.offsetWidth / 2,
      w: l.lugar.offsetWidth,
      h: l.tomba.offsetHeight,
      topo: l.lugar.offsetTop + entre,
      pe: l.lugar.offsetTop + l.lugar.offsetHeight,
      teto: (parseFloat(estilo.paddingTop) - entre) * 0.75,
    };
  });
  const prateleiras = new Map<number, number[]>();
  medidas.forEach((m, i) => {
    const chave = Math.round(m.pe);
    prateleiras.set(chave, [...(prateleiras.get(chave) ?? []), i]);
  });
  const mx = doca.mouse === null ? null : doca.mouse.x - r.left;
  const my = doca.mouse === null ? null : doca.mouse.y - r.top;
  const alvo: { s: number; x: number }[] = [];
  for (const indices of prateleiras.values()) {
    const ms = indices.map((i) => medidas[i]);
    const dentro = my !== null && my >= ms[0].topo && my <= ms[0].pe;
    alvos(ms, dentro ? mx : null).forEach((a, k) => (alvo[indices[k]] = a));
  }

  // Escrita: cada um anda uma fração do caminho até o alvo.
  let mais = false;
  lugares.forEach((l, i) => {
    l.s += (alvo[i].s - l.s) * segue;
    l.x += (alvo[i].x - l.x) * segue;
    const quieto = Math.abs(alvo[i].s - l.s) < 0.001 && Math.abs(alvo[i].x - l.x) < 0.1;
    if (quieto) {
      l.s = alvo[i].s;
      l.x = alvo[i].x;
    } else mais = true;
    if (l.s === 1 && l.x === 0) {
      soltar(l);
      return;
    }
    l.tomba.style.translate = `${l.x.toFixed(2)}px 0`;
    l.tomba.style.scale = l.s.toFixed(4);
    l.tomba.style.zIndex = String(Math.round((l.s - 1) * 1000) + 2);
  });
  if (mais) pedir(doca);
  else doca.antes = 0;
}

function pedir(doca: Doca) {
  if (!doca.pedido) doca.pedido = requestAnimationFrame((agora) => quadro(doca, agora));
}

function ligar(colecao: HTMLElement) {
  const prat = colecao.querySelector<HTMLElement>(".prateleira-livros");
  if (!prat) return;
  const lugares = [...prat.querySelectorAll<HTMLElement>(":scope > .livro-colecao")]
    .map((lugar) => ({ lugar, tomba: lugar.querySelector<HTMLElement>(".tomba") }))
    .filter((l): l is { lugar: HTMLElement; tomba: HTMLElement } => !!l.tomba)
    .map((l) => ({ ...l, s: 1, x: 0 }));
  if (!lugares.length) return;
  const doca: Doca = { prat, lugares, mouse: null, pedido: 0, antes: 0 };

  const seguir = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !comMouse.matches || parado() || indo()) return;
    doca.mouse = { x: e.clientX, y: e.clientY };
    pedir(doca);
  };
  prat.addEventListener("pointerenter", seguir, { passive: true });
  prat.addEventListener("pointermove", seguir, { passive: true });
  prat.addEventListener("pointerleave", () => {
    doca.mouse = null;
    pedir(doca);
  });
  // A página rola sob o mouse parado: a prateleira passa por ele e a doca acompanha (ou solta, quando sai).
  addEventListener("scroll", () => doca.mouse !== null && pedir(doca), { passive: true });
  // O clique leva o livro à página dele: a doca para onde está, e o voo parte do tamanho que o leitor vê (soltar
  // tudo no clique fazia o livro encolher 14% e os vizinhos pularem de volta antes do voo, D84). Voltando pelo
  // histórico (bfcache), ela volta ao repouso.
  prat.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest("a.tomba") || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (doca.pedido) cancelAnimationFrame(doca.pedido);
    doca.pedido = 0;
    doca.mouse = null;
  });
  addEventListener("pageshow", (e) => e.persisted && soltarJa(doca));
  reduzido.addEventListener("change", () => reduzido.matches && soltarJa(doca));
}

for (const colecao of document.querySelectorAll<HTMLElement>("[data-colecao='home']")) ligar(colecao);

export {};
