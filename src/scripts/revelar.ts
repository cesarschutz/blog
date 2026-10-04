/**
 * As listas e os cards que aparecem ao rolar (rodada 3, área 7: T13, G21, "como na Apple").
 *
 * Todo elemento com `data-revelar` dentro do <main> (os cards e os itens de lista, marcados pelos
 * componentes) que está **abaixo da dobra** quando a página chega espera escondido e aparece quando 15%
 * dele entra na tela: sobe 14px e vai de 0 a 1 em 0,5s, `cubic-bezier(.2,.7,.2,1)`, com 60ms entre os da
 * mesma linha (no máximo 180ms numa linha; uma linha que chega junto com outra espera mais 70ms). Uma vez
 * só: o que já apareceu não some de novo.
 *
 * O que está à vista na chegada (ou acima dela) não espera nem anima: a página, a troca (as folhas sob a
 * cortina, troca.js) e a abertura cuidam dele. Só `transform` e `opacity` (os componentes deixam essas duas
 * livres; o hover deles usa `translate`).
 *
 * A decisão de quem espera vem da primeira leitura do IntersectionObserver, depois do layout da página
 * (sem medir à força no carregamento, D54). Voltando pelo histórico ou com #âncora, ela espera o `load`,
 * para a rolagem já estar restaurada (senão, um card à vista podia ficar esperando).
 *
 * Fica de fora: sem JS, sem IntersectionObserver ou com movimento reduzido (tudo visível desde o começo);
 * o que está dentro de `[data-gira]` (os artigos da página do livro, que chegam girando pela página); o que
 * está escondido (Lista ou Cards fora de uso): ele é examinado de novo quando o modo troca
 * (`data-post-view`), quando os cards são montados (`cartoes:prontos`) ou quando entra algo novo no <main>.
 */

const SELETOR = "#conteudo [data-revelar]";
const DURACAO = 500;
const SUBIDA = 14;
const CURVA = "cubic-bezier(0.2, 0.7, 0.2, 1)";
const PASSO_NA_LINHA = 60;
const MAX_NA_LINHA = 180;
const PASSO_ENTRE_LINHAS = 70;
const MAX_ENTRE_LINHAS = 210;
const ESPERA = "revelar-espera";

const raiz = document.documentElement;
const reduzido = matchMedia("(prefers-reduced-motion: reduce)");

/** Os já decididos (esperando, revelados ou que já estavam à vista): ninguém é decidido duas vezes. */
const vistos = new WeakSet<Element>();
const esperando = new Set<HTMLElement>();
const animacoes = new Set<Animation>();

function candidatos(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(SELETOR)].filter((el) => !vistos.has(el) && !el.closest("[data-gira]"));
}

/** Mostra tudo o que espera, sem animar (movimento reduzido ligado no meio, ou impressão). */
function soltarTodos() {
  cancelAnimationFrame(quadro);
  quadro = 0;
  fila = [];
  for (const animacao of animacoes) animacao.cancel();
  animacoes.clear();
  for (const el of esperando) {
    el.classList.remove(ESPERA);
    revela.unobserve(el);
  }
  esperando.clear();
}

/* ---------- a revelação ---------- */

let fila: HTMLElement[] = [];
let quadro = 0;

function revelarFila() {
  quadro = 0;
  const itens = fila.map((el) => ({ el, r: el.getBoundingClientRect() })).sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left);
  fila = [];
  let topoDaLinha = Number.NEGATIVE_INFINITY;
  let linha = -1;
  let coluna = 0;
  for (const { el, r } of itens) {
    // A mesma linha: o topo a menos de 12px do primeiro da linha (os cards de uma grade têm o mesmo topo).
    if (Math.abs(r.top - topoDaLinha) > 12) {
      linha++;
      coluna = 0;
      topoDaLinha = r.top;
    } else coluna++;
    const atraso = Math.min(coluna * PASSO_NA_LINHA, MAX_NA_LINHA) + Math.min(linha * PASSO_ENTRE_LINHAS, MAX_ENTRE_LINHAS);
    esperando.delete(el);
    el.classList.remove(ESPERA);
    if (reduzido.matches) continue;
    const animacao = el.animate(
      [
        { opacity: 0, transform: `translateY(${SUBIDA}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: DURACAO, delay: atraso, easing: CURVA, fill: "backwards" },
    );
    animacoes.add(animacao);
    animacao.addEventListener("finish", () => animacoes.delete(animacao), { once: true });
  }
}

const revela = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      // 15% à vista; um item mais alto que a tela (raro) aparece quando ocupa 40% dela.
      const alto = e.intersectionRect.height >= innerHeight * 0.4;
      if (e.intersectionRatio < 0.15 && !alto) continue;
      revela.unobserve(el);
      if (esperando.has(el)) fila.push(el);
    }
    if (fila.length && !quadro) quadro = requestAnimationFrame(revelarFila);
  },
  { threshold: [0, 0.05, 0.1, 0.15] },
);

/* ---------- quem espera ---------- */

// A primeira leitura de cada candidato: abaixo da tela, espera; à vista ou acima, fica como está. Escondido
// (tamanho zero), fica para a próxima vez que alguém pedir uma leitura nova.
const decide = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    const el = e.target as HTMLElement;
    decide.unobserve(el);
    const r = e.boundingClientRect;
    if (r.width === 0 && r.height === 0) continue;
    vistos.add(el);
    const fundo = e.rootBounds ? e.rootBounds.bottom : innerHeight;
    if (e.isIntersecting || r.top < fundo || reduzido.matches) continue;
    el.classList.add(ESPERA);
    esperando.add(el);
    revela.observe(el);
  }
});

function examinar() {
  if (reduzido.matches) return;
  for (const el of candidatos()) decide.observe(el);
}

let marcado = 0;
function examinarLogo() {
  if (marcado) return;
  marcado = requestAnimationFrame(() => {
    marcado = 0;
    examinar();
  });
}

function iniciar() {
  examinar();
  // Lista ou Cards (SeletorModo): a forma que aparece é examinada; os cards montados depois também.
  new MutationObserver(examinarLogo).observe(raiz, { attributes: true, attributeFilter: ["data-post-view"] });
  addEventListener("cartoes:prontos", examinarLogo);
  // O que entra no <main> depois (um filtro, uma página montada pelo script) e quem pedir de novo.
  const main = document.getElementById("conteudo");
  if (main) new MutationObserver((mudancas) => mudancas.some((m) => m.addedNodes.length) && examinarLogo()).observe(main, { childList: true, subtree: true });
  addEventListener("cs:revelar", examinarLogo);
  reduzido.addEventListener("change", () => reduzido.matches && soltarTodos());
  addEventListener("beforeprint", soltarTodos);
}

if ("IntersectionObserver" in window && !reduzido.matches) {
  const navegacao = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const restaura = navegacao?.type === "back_forward" || !!location.hash;
  if (restaura && document.readyState !== "complete") {
    addEventListener("load", () => requestAnimationFrame(iniciar), { once: true });
  } else iniciar();
}

// Um módulo (sem isso, o TypeScript trata as constantes daqui como globais e elas colidem com as de outros scripts).
export {};
