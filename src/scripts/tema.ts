/**
 * Tema (D24, D33, D39, D52 C01): claro ou escuro, pelo botão do cabeçalho. O padrão é sempre claro,
 * sem seguir o sistema: a escolha fica em `localStorage["cs-theme"]`, com a data da última troca
 * em `localStorage["cs-prefs-quando"]` (compartilhada com o modo Lista/Cards, SeletorModo.astro) —
 * passados 3 dias dessa data, o script anti-piscada do <head> (Base.astro) ignora a escolha e volta
 * ao padrão. O evento "tema:mudou" mantém os controles em sincronia.
 */
import { amostrar, camada, duracaoDaSala, meioDaSala, quadrosDaSala, sala } from "./lampada";

type Escolha = "light" | "dark" | "";

const CHAVE = "cs-theme";
const QUANDO = "cs-prefs-quando";
const raiz = document.documentElement;
const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
const originais = metas.map((meta) => meta.content);

/**
 * A escolha em vigor nesta página. Vem do `data-theme` (o script do <head> o põe a partir do
 * armazenamento), e não do armazenamento, que pode estar bloqueado.
 */
function lerEscolha(): Escolha {
  const valor = raiz.dataset.theme;
  return valor === "light" || valor === "dark" ? valor : "";
}

/** O tema que está na tela: a escolha ou, sem escolha, claro (D52, C01: não segue mais o sistema). */
export function temaNaTela(): "light" | "dark" {
  return lerEscolha() || "light";
}

// A barra do navegador acompanha a escolha; em "sistema", volta às cores por media query.
// Só lê o estilo com uma escolha feita: ao abrir no tema do sistema (o normal, D33), a leitura
// forçava um recálculo de estilo da página inteira (53 ms com CPU 4× no java-25, D37).
function pintarBarra(valor: Escolha) {
  const fundo = valor ? getComputedStyle(raiz).getPropertyValue("--paper").trim() : "";
  metas.forEach((meta, i) => (meta.content = valor ? fundo : originais[i]));
}

function aplicarTema(valor: Escolha) {
  // C01 (D52): sem escolha (ou vencida), o padrão é sempre claro, nunca o do sistema.
  raiz.dataset.theme = valor || "light";
  try {
    if (valor) {
      localStorage.setItem(CHAVE, valor);
      localStorage.setItem(QUANDO, String(Date.now()));
    } else {
      localStorage.removeItem(CHAVE);
    }
  } catch {
    // Navegação privada ou armazenamento bloqueado: a escolha vale só nesta página.
  }
  pintarBarra(valor || "light");
  dispatchEvent(new CustomEvent("tema:mudou"));
}

/** Chama `ao` agora e sempre que o tema mudar (pelo botão do cabeçalho). */
export function aoMudarTema(ao: () => void) {
  addEventListener("tema:mudou", ao);
  ao();
}

pintarBarra(lerEscolha());
// Voltando pelo histórico (bfcache), o script do <head> relê a escolha, que pode ter mudado em outra página.
addEventListener("preferencias:relidas", () => {
  pintarBarra(lerEscolha());
  dispatchEvent(new CustomEvent("tema:mudou"));
});

/** Desfaz o que a troca em andamento pôs na página (as classes, o color-scheme e a lâmpada). */
let desfazer: (() => void) | null = null;

/** As peças da lâmpada no desenho do lustre (SeletorTema): o filamento, a brasa e a cúpula acesa. */
interface PecasDoLustre {
  nucleo?: Element | null;
  nucleoBrasa?: Element | null;
  cupula?: Element | null;
  /**
   * As cores do desenho do lustre (variáveis CSS do botão): ficam as do tema de antes até a sala passar
   * da metade e então viram de uma vez, no mesmo relógio da lâmpada.
   */
  cores?: { el: HTMLElement; props: readonly string[] };
}

/** As cores de antes seguram até `meio` (ms) e viram para as do tema novo (uma animação discreta, WAAPI). */
function virarCores(cores: NonNullable<PecasDoLustre["cores"]>, antes: string[], meio: number, inicio: number | null) {
  const estilo = getComputedStyle(cores.el);
  const depois = cores.props.map((p) => estilo.getPropertyValue(p));
  const duracao = meio + 50;
  const de = Object.fromEntries(cores.props.map((p, i) => [p, antes[i]]));
  const para = Object.fromEntries(cores.props.map((p, i) => [p, depois[i]]));
  const a = cores.el.animate(
    [
      { ...de, offset: 0 },
      { ...de, offset: meio / duracao },
      { ...para, offset: Math.min(1, (meio + 1) / duracao) },
      { ...para, offset: 1 },
    ],
    { duration: duracao, easing: "linear" },
  );
  if (inicio !== null) a.startTime = inicio;
  return a;
}

const CAMADAS_DO_HALO = [
  ["brasa", ".ll-brasa"],
  ["ambar", ".ll-ambar"],
  ["branco", ".ll-branco"],
  ["cone", ".ll-cone"],
] as const;

/** Põe o halo grande e o cone (Luz.astro, `.lustre-luz`) no centro do bulbo. */
function posicionarHalo(luz: HTMLElement, origem: Element) {
  const r = origem.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  for (const el of luz.querySelectorAll<HTMLElement>(":scope > span")) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    // O cone desce do bulbo; os halos ficam centrados nele.
    el.style.transform = el.classList.contains("ll-cone") ? `translate3d(${x - w / 2}px, ${y}px, 0)` : `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)`;
  }
}

/**
 * Troca o tema pelo lustre (rodada 3 do redesenho, T7; no lugar do círculo da D42): o tema é a luz.
 * Indo para o claro, a lâmpada acende (a brasa, o âmbar, o branco quente, com o tremor da partida) e
 * acender é o que clareia a sala; indo para o escuro, ela apaga, a sala escurece com a mesma curva e a
 * brasa sobra por meio segundo. As curvas são as de lampada.ts.
 *
 * A sala é a View Transition do próprio documento (classes `luz-acende` e `luz-apaga`, luz.css), e ela
 * escurece de verdade, nunca uma página misturada com a outra (o cinza lavado de um fade): apagando, a
 * foto da página clara perde o brilho com a lâmpada (`brightness`) até o piso, que tem o fundo da escura,
 * e só então sai de cima dela; acendendo, a clara entra no piso por cima da escura e acende com a lâmpada,
 * com o tremor da partida (quadrosDaSala, lampada.ts). O lustre e o halo ficam por cima, vivos (com nome
 * de transição), e o halo grande nasce no bulbo e passa do cabeçalho. Tudo amostrado no WAAPI, com o mesmo
 * instante de partida. Sem View Transitions, a lâmpada acende do mesmo jeito e o tema vira no meio da
 * curva. Com movimento reduzido, um fade de 150ms.
 *
 * `origem` é o bulbo; a promessa se cumpre quando a sala termina de mudar.
 */
export function trocarTema(valor: Escolha, origem: Element, pecas: PecasDoLustre = {}): Promise<void> {
  const liga = valor !== "dark";
  const podeTransicao = "startViewTransition" in document;
  // Clique no meio de uma troca: a anterior é desfeita antes.
  desfazer?.();

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (!podeTransicao) {
      aplicarTema(valor);
      return Promise.resolve();
    }
    raiz.classList.add("trocando-tema", "luz-fade");
    const transicao = document.startViewTransition(() => aplicarTema(valor));
    return transicao.finished.catch(() => {}).finally(() => raiz.classList.remove("trocando-tema", "luz-fade"));
  }

  const luz = document.querySelector<HTMLElement>(".lustre-luz");
  const animacoes: Animation[] = [];

  // A lâmpada: o filamento antes do halo, o halo antes do cone (lampada.ts). O halo é luz sobre a sala:
  // com a sala acesa ele quase não se vê (sobra 15%), e ao acender ele some no fim, junto com o susto.
  const DURACAO = liga ? 950 : 1150;
  const brilho = (t: number) => (1 - 0.85 * sala(t, liga)) * (liga ? Math.min(1, Math.max(0, (DURACAO - t) / 420)) : 1);
  const meio = meioDaSala(liga);
  const coresAntes = pecas.cores ? pecas.cores.props.map((p) => getComputedStyle(pecas.cores!.el).getPropertyValue(p)) : [];
  if (luz) {
    luz.classList.add("ativa");
    posicionarHalo(luz, origem);
  }
  /** Todas as camadas da lâmpada, de uma vez (o relógio comum vem depois, em `ready`). */
  const tocarLampada = () => {
    const animar = (el: Element | null | undefined, f: (t: number) => number) => {
      if (el) animacoes.push(el.animate(amostrar(DURACAO, f), { duration: DURACAO, fill: "both", easing: "linear" }));
    };
    animar(pecas.nucleoBrasa, (t) => camada("nucleoBrasa", t, liga));
    animar(pecas.nucleo, (t) => camada("nucleo", t, liga));
    animar(pecas.cupula, (t) => camada("cupula", t, liga));
    if (luz) for (const [nome, seletor] of CAMADAS_DO_HALO) animar(luz.querySelector(seletor), (t) => camada(nome, t, liga) * brilho(t));
  };
  /**
   * No fim, as cores são as do CSS de cada tema: as animações saem sem pulo. A classe da troca (que tira o
   * nome de transição de todo elemento, base.css) e o color-scheme da barra de rolagem só saem aqui, com
   * nada mais se mexendo: os dois recalculam o estilo da página inteira, e no meio da brasa isso dava um
   * tranco de 60ms com a CPU 4× mais lenta.
   */
  const quandoApagar = () =>
    Promise.all(animacoes.map((a) => a.finished)).then(
      () => {
        animacoes.forEach((a) => a.cancel());
        luz?.classList.remove("ativa");
        if (!raiz.classList.contains("luz-acende") && !raiz.classList.contains("luz-apaga")) {
          raiz.classList.remove("trocando-tema");
          raiz.style.removeProperty("color-scheme");
        }
      },
      () => {},
    );

  // A sala: quanto tempo até ela parar de mudar (lampada.ts).
  const SALA = duracaoDaSala(liga);
  if (!podeTransicao) {
    tocarLampada();
    void quandoApagar();
    const relogio = window.setTimeout(() => aplicarTema(valor), meio);
    desfazer = () => {
      clearTimeout(relogio);
      animacoes.forEach((a) => a.cancel());
      luz?.classList.remove("ativa");
      desfazer = null;
    };
    return new Promise((ok) => setTimeout(ok, SALA));
  }

  raiz.classList.add("trocando-tema", liga ? "luz-acende" : "luz-apaga");
  // A barra de rolagem da página fica fora da troca e seguiria o tema na hora: vira no fim, com a sala.
  raiz.style.colorScheme = getComputedStyle(raiz).colorScheme;
  // O tema novo entra com a lâmpada já no primeiro quadro dela, e as cores do lustre segurando as de antes
  // até a metade da sala. Com a CPU lenta, a foto da página antiga pode levar uns quadros: a lâmpada só
  // começa depois dela (o relógio é o de `ready`), para o começo do acender ou do apagar nunca se perder.
  const transicao = document.startViewTransition(() => {
    aplicarTema(valor);
    tocarLampada();
    if (pecas.cores) animacoes.push(virarCores(pecas.cores, coresAntes, meio, null));
  });
  transicao.ready.then(
    () => {
      const salaAnim = raiz.animate(quadrosDaSala(liga), {
        duration: SALA,
        fill: "both",
        easing: "linear",
        pseudoElement: liga ? "::view-transition-new(root)" : "::view-transition-old(root)",
      });
      // Um relógio só: a sala, a lâmpada e as cores do lustre partem no mesmo instante.
      const t = document.timeline.currentTime;
      if (typeof t === "number") for (const a of [...animacoes, salaAnim]) a.startTime = t;
      void quandoApagar();
    },
    () => {
      animacoes.forEach((a) => a.cancel());
      luz?.classList.remove("ativa");
      raiz.classList.remove("trocando-tema");
      raiz.style.removeProperty("color-scheme");
    },
  );
  const esta = () => {
    raiz.classList.remove("luz-acende", "luz-apaga");
    if (desfazer === esta) desfazer = null;
  };
  desfazer = () => {
    transicao.skipTransition();
    animacoes.forEach((a) => a.cancel());
    luz?.classList.remove("ativa");
    raiz.classList.remove("trocando-tema");
    raiz.style.removeProperty("color-scheme");
    esta();
  };
  return transicao.finished.catch(() => {}).finally(esta);
}
