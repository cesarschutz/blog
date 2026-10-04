/**
 * A doca da fileira da home (D78, pedido do Cesar: "um efeito tipo o dock do Mac, quando passar o mouse no
 * livro ele aumentar de tamanho"). Só com mouse e sem movimento reduzido.
 *
 * O livro sob o mouse cresce até AUMENTO (1,5×), e os vizinhos crescem menos, pela distância do mouse ao meio
 * de cada lugar (um sino de cosseno de ALCANCE lugares para cada lado). Cada livro cresce de pé, pela base (a
 * `.tomba`, com a origem no pé). Para eles não se atropelarem, a fileira se ajeita como a doca: os de um lado
 * do mouse vão para a esquerda e os do outro, para a direita, cada um com a soma do que os de antes cresceram;
 * e, para a fileira não passar de onde vai o texto, os vãos fecham por igual o que ela cresceu (as pontas
 * saem no máximo SOBRA px). O maior fica por cima dos vizinhos (`z-index` do lugar).
 *
 * O quanto o livro cresce para cima cabe no teto da fileira: abaixo de ~1100px, onde o teto é mais baixo, o
 * aumento diminui até caber.
 *
 * Custo: um requestAnimationFrame só, que dorme parado. Por quadro, lê o retângulo da prateleira e as medidas
 * de layout dos lugares (`offsetLeft`, que não mudam com o `translate`), e depois escreve `translate` e
 * `scale` na `.tomba` e o `z-index` no lugar. O `.livro-vivo` de dentro (o hover com mola, o seguir o mouse
 * e a onda de molas) continua por conta de livro-vivo.ts e estante-moderna.ts.
 */

const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
const comMouse = matchMedia("(hover: hover) and (pointer: fine)");
const raiz = document.documentElement;

/** O livro sob o mouse fica 1 + AUMENTO vezes maior. */
const AUMENTO = 0.5;
/** Até quantos lugares para cada lado o aumento chega (o sino vai a zero aí). */
const ALCANCE = 2.6;
/** O quanto as pontas da fileira podem sair, em px (a margem do corte da coleção é de 12px). */
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
  /** O mouse, em x da tela; null quando ele saiu da fileira. */
  mouse: number | null;
  pedido: number;
  /** O instante do quadro anterior (0 quando a doca estava parada). */
  antes: number;
}

function parado(doca: Doca) {
  return reduzido.matches || !!raiz.dataset.abertura || raiz.hasAttribute("data-abre-livro") || !!doca.prat.closest("[data-livro-parado]");
}

function soltarJa(doca: Doca) {
  doca.mouse = null;
  if (doca.pedido) cancelAnimationFrame(doca.pedido);
  doca.pedido = 0;
  doca.antes = 0;
  for (const l of doca.lugares) {
    l.s = 1;
    l.x = 0;
    l.tomba.style.removeProperty("translate");
    l.tomba.style.removeProperty("scale");
    l.lugar.style.removeProperty("z-index");
  }
}

function quadro(doca: Doca, agora: number) {
  doca.pedido = 0;
  const passou = doca.antes ? Math.min(agora - doca.antes, 100) : 1000 / 60;
  doca.antes = agora;
  const segue = 1 - Math.pow(1 - SEGUE, passou / (1000 / 60));
  const { prat, lugares } = doca;
  if (parado(doca)) {
    soltarJa(doca);
    return;
  }

  // Leitura: a prateleira na tela e os lugares no layout (sem o translate).
  const r = prat.getBoundingClientRect();
  const medidas = lugares.map((l) => ({ c: l.lugar.offsetLeft + l.lugar.offsetWidth / 2, w: l.lugar.offsetWidth, h: l.tomba.offsetHeight }));
  const passo = medidas.length > 1 ? (medidas[medidas.length - 1].c - medidas[0].c) / (medidas.length - 1) : medidas[0]?.w || 1;
  const raio = passo * ALCANCE;
  // O teto: o livro cresce para cima até o alto da prateleira (mais 4px, longe do título da seção).
  const teto = parseFloat(getComputedStyle(prat).paddingTop) + 4;
  const altura = Math.max(...medidas.map((m) => m.h), 1);
  const aumento = Math.min(AUMENTO, teto / altura);

  // Os alvos: o tamanho de cada um e o deslocamento que abre lugar para ele.
  const mx = doca.mouse === null ? null : doca.mouse - r.left;
  const alvoS = medidas.map((m) => {
    if (mx === null) return 1;
    const d = Math.abs(mx - m.c);
    return d >= raio ? 1 : 1 + aumento * (0.5 + 0.5 * Math.cos((Math.PI * d) / raio));
  });
  const extra = medidas.map((m, i) => m.w * (alvoS[i] - 1));
  const total = extra.reduce((a, b) => a + b, 0);
  const sai = Math.min(SOBRA, total / 2);
  const ponta0 = medidas[0]?.c ?? 0;
  const vao = (medidas[medidas.length - 1]?.c ?? 0) - ponta0 || 1;
  let antes = 0;
  const alvoX = medidas.map((m, i) => {
    const x = antes + extra[i] / 2 - sai - (total - 2 * sai) * ((m.c - ponta0) / vao);
    antes += extra[i];
    return x;
  });

  // Escrita: cada um anda uma fração do caminho até o alvo.
  let mais = false;
  lugares.forEach((l, i) => {
    l.s += (alvoS[i] - l.s) * segue;
    l.x += (alvoX[i] - l.x) * segue;
    const quieto = Math.abs(alvoS[i] - l.s) < 0.001 && Math.abs(alvoX[i] - l.x) < 0.1;
    if (quieto) {
      l.s = alvoS[i];
      l.x = alvoX[i];
    } else mais = true;
    if (l.s === 1 && l.x === 0) {
      l.tomba.style.removeProperty("translate");
      l.tomba.style.removeProperty("scale");
      l.lugar.style.removeProperty("z-index");
      return;
    }
    l.tomba.style.translate = `${l.x.toFixed(2)}px 0`;
    l.tomba.style.scale = l.s.toFixed(4);
    l.lugar.style.zIndex = String(Math.round((l.s - 1) * 1000) + 1);
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
    if (e.pointerType !== "mouse" || !comMouse.matches || parado(doca)) return;
    doca.mouse = e.clientX;
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
  // O clique leva o livro à página dele, e a viagem começa da pose de repouso (como o livro vivo, Colecao).
  prat.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a.tomba, a.nome-livro")) soltarJa(doca);
  });
  reduzido.addEventListener("change", () => reduzido.matches && soltarJa(doca));
}

for (const colecao of document.querySelectorAll<HTMLElement>("[data-colecao='home']")) ligar(colecao);

export {};
