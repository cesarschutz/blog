/**
 * Rodada 3 do redesenho (área A, "Livros vivos"): o livro 3D (e a foto do livro deitado) no navegador.
 * O visual está em livro-vivo.css; a marcação, em Livro3D.astro. Carregado em toda página (Luz.astro).
 *
 * - **O livro acompanha o mouse** (T9): até ±6° no eixo vertical e ±4° no horizontal a partir do giro
 *   da vez, com atraso (lerp 0,12 por quadro, uns 90ms) e a volta ao repouso em ~0,45s. Vai na
 *   propriedade `rotate` do `.livro-vivo`, que compõe com o `transform` do giro com mola (CSS) sem passar
 *   pela transição dele.
 * - **Sem brilho no hover** (rodada 4, H4): a mancha quente da capa e da lombada, a faixa e a varredura
 *   amarelavam o livro e saíram; o hover é o giro com mola, o seguir o mouse e a sombra.
 * - **A onda de luz da fileira** (T4, item 4): uma vez por carga, 0,6s depois de a fileira pousar (a
 *   abertura avisa com `cs:aberto`; a troca de página, com `cs:chegou`), uma faixa desce cada livro,
 *   60ms depois do vizinho da esquerda, 1,2s cada. Nas fileiras de livros 3D (`.colecao`) e nas de
 *   lombadas (`.estante`, o filtro).
 * - **O teclado e o toque:** o foco visível dá a pose do hover (CSS); o toque dá a pose enquanto o dedo
 *   está no livro (`data-lv-toque`).
 *
 * Custo: um requestAnimationFrame só, que dorme parado; por quadro, um retângulo lido (o da caixa do
 * livro sob o mouse) antes de escrever, e só `rotate`, `transform` e `opacity` escritos direto nos
 * elementos (nada de variável CSS herdada pelo livro inteiro, que recalcularia o desenho da capa).
 * Com movimento reduzido, nada segue o mouse: o livro fica parado.
 */

const reduzido = matchMedia("(prefers-reduced-motion: reduce)");

/** Quem dispara o livro vivo: o cartão em volta dele ou o próprio livro. */
const CARTAO = "[data-livro-gira], .livro-colecao";
const LIVRO = ".livro-em-pe, .livro-na-gaveta, .palco-ampliado[data-lv-repouso] .livro-3d-caixa";
const FOTO = ".do-livro, .livro-do-artigo, [data-foto-gira]";

/** O quanto o livro acompanha o mouse, em graus: no eixo vertical (y) e no horizontal (x). */
const SEGUE = { livro: { y: 6, x: 4 }, foto: { y: 7, x: 5 } } as const;

interface Vivo {
  tipo: "livro" | "foto";
  /** O que conta como "sob o mouse" (o cartão ou o livro). */
  gatilho: HTMLElement;
  /** A caixa do livro 3D (ou a foto): onde o mouse é medido. */
  caixa: HTMLElement;
  /** Quem gira com o mouse: o `.livro-vivo` (ou a foto). */
  gira: HTMLElement;
  x: number;
  y: number;
  on: number;
  tx: number;
  ty: number;
  ton: number;
  /** As medidas da caixa, lidas no começo do quadro (antes de escrever). */
  w: number;
  h: number;
}

const ponteiro = { x: 0, y: 0 };
let atual: Vivo | null = null;
const soltando = new Set<Vivo>();
let pedido = 0;

const limitar = (v: number, a = -1, b = 1) => (v < a ? a : v > b ? b : v);

function parado(el: Element) {
  return !!el.closest("[data-livro-parado]");
}

/** O livro (ou a foto) sob o elemento, se houver. */
function acharVivo(el: Element): Omit<Vivo, "x" | "y" | "on" | "tx" | "ty" | "ton" | "w" | "h"> | null {
  const cartao = el.closest<HTMLElement>(CARTAO);
  const livro = el.closest<HTMLElement>(LIVRO);
  const gatilho = cartao ?? livro;
  if (gatilho) {
    const caixa = gatilho.matches(".livro-3d-caixa") ? gatilho : gatilho.querySelector<HTMLElement>(".livro-3d-caixa");
    const gira = caixa?.querySelector<HTMLElement>(".livro-vivo");
    if (caixa && gira && !parado(caixa)) {
      return { tipo: "livro", gatilho, caixa, gira };
    }
  }
  const ficha = el.closest<HTMLElement>(FOTO);
  const foto = ficha?.querySelector<HTMLElement>(".foto-do-livro");
  if (ficha && foto && !parado(foto)) return { tipo: "foto", gatilho: ficha, caixa: foto, gira: foto };
  return null;
}

function escrever(v: Vivo) {
  const s = SEGUE[v.tipo];
  // Virar para o mouse: à direita, a capa olha para a direita (giro maior); em cima, o alto recua.
  const ry = v.x * s.y;
  const rx = -v.y * s.x;
  const ang = Math.hypot(rx, ry);
  v.gira.style.rotate = ang < 0.01 ? "" : `${(rx / ang).toFixed(4)} ${(ry / ang).toFixed(4)} 0 ${ang.toFixed(2)}deg`;
}

function limpar(v: Vivo) {
  v.gira.style.removeProperty("rotate");
  if (v.caixa.dataset.lv === "off") delete v.caixa.dataset.lv;
}

function pedirQuadro() {
  if (!pedido) pedido = requestAnimationFrame(quadro);
}

function quadro() {
  pedido = 0;
  let mais = false;

  // Leitura primeiro: a caixa do livro sob o mouse (o livro olha para o ponteiro, mesmo fora dele).
  if (atual) {
    if (!atual.caixa.isConnected || !atual.gatilho.isConnected || !gatilhoValido(atual)) {
      soltar(atual);
    } else {
      const r = atual.caixa.getBoundingClientRect();
      atual.w = r.width;
      atual.h = r.height;
      if (r.width > 0 && r.height > 0) {
        atual.tx = limitar((ponteiro.x - (r.left + r.width / 2)) / (r.width * 0.6));
        atual.ty = limitar((ponteiro.y - (r.top + r.height / 2)) / (r.height * 0.6));
      }
    }
  }

  const todos = atual ? [atual, ...soltando] : [...soltando];
  for (const v of todos) {
    v.x += (v.tx - v.x) * 0.12;
    v.y += (v.ty - v.y) * 0.12;
    v.on += (v.ton - v.on) * (v.ton > v.on ? 0.16 : 0.12);
    const quieto = Math.abs(v.tx - v.x) < 0.002 && Math.abs(v.ty - v.y) < 0.002 && Math.abs(v.ton - v.on) < 0.004;
    if (quieto && v !== atual) {
      soltando.delete(v);
      limpar(v);
      continue;
    }
    escrever(v);
    if (!quieto) mais = true;
  }
  if (mais) pedirQuadro();
}

/** O livro do ampliado só vale fechado (o palco tira `data-lv-repouso` quando ele abre). */
function gatilhoValido(v: Vivo) {
  if (v.tipo === "livro" && v.gatilho.matches(".livro-3d-caixa")) return v.gatilho.closest(".palco-ampliado[data-lv-repouso]") !== null;
  return true;
}

function soltar(v: Vivo) {
  if (reduzido.matches) {
    // Sem movimento: a mancha parada só some.
    if (atual === v) atual = null;
    delete v.caixa.dataset.lv;
    return;
  }
  v.tx = 0;
  v.ty = 0;
  v.ton = 0;
  if (v.caixa.dataset.lv === "on") v.caixa.dataset.lv = "off";
  if (atual === v) atual = null;
  soltando.add(v);
  pedirQuadro();
}

/** Na hora, sem voltar devagar: antes de alguém medir ou copiar o livro (o ampliado, a gaveta). */
function soltarJa(v: Vivo) {
  soltando.delete(v);
  if (atual === v) atual = null;
  v.caixa.dataset.lv = "off";
  limpar(v);
}

function entrar(achado: NonNullable<ReturnType<typeof acharVivo>>) {
  // O livro que ainda voltava ao lugar continua de onde estava.
  const voltando = [...soltando].find((s) => s.caixa === achado.caixa);
  if (voltando) soltando.delete(voltando);
  atual = voltando ?? { ...achado, x: 0, y: 0, on: 0, tx: 0, ty: 0, ton: 1, w: 0, h: 0 };
  atual.gatilho = achado.gatilho;
  atual.ton = 1;
  const caixa = atual.caixa;
  caixa.dataset.lv = "on";
  pedirQuadro();
}

document.addEventListener(
  "pointerover",
  (e) => {
    if (e.pointerType !== "mouse" || !(e.target instanceof Element)) return;
    ponteiro.x = e.clientX;
    ponteiro.y = e.clientY;
    const achado = acharVivo(e.target);
    if (achado?.caixa === atual?.caixa) return;
    if (atual) soltar(atual);
    if (!achado) return;
    if (reduzido.matches) {
      // Só a mancha parada (CSS), sem seguir o mouse.
      achado.caixa.dataset.lv = "on";
      atual = { ...achado, x: 0, y: 0, on: 1, tx: 0, ty: 0, ton: 1, w: 0, h: 0 };
      return;
    }
    entrar(achado);
  },
  { passive: true },
);

addEventListener(
  "pointermove",
  (e) => {
    if (e.pointerType !== "mouse") return;
    ponteiro.x = e.clientX;
    ponteiro.y = e.clientY;
    if (atual && !reduzido.matches) pedirQuadro();
  },
  { passive: true },
);

// A página rola sob o mouse parado: o livro sob ele continua olhando para o ponteiro.
addEventListener(
  "scroll",
  () => {
    if (atual && !reduzido.matches) pedirQuadro();
  },
  { passive: true },
);

// O mouse saiu da janela: o livro volta ao lugar.
document.addEventListener("mouseout", (e) => {
  if (e.relatedTarget || !atual) return;
  if (reduzido.matches) {
    delete atual.caixa.dataset.lv;
    atual = null;
    return;
  }
  soltar(atual);
});

// ---------- o teclado: o foco visível marca o livro (a pose é do CSS) ----------

let focado: HTMLElement | null = null;
document.addEventListener("focusin", (e) => {
  if (!(e.target instanceof Element)) return;
  if (focado) {
    if (focado.dataset.lv === "on" && focado !== atual?.caixa) delete focado.dataset.lv;
    focado = null;
  }
  if (!e.target.matches(":focus-visible")) return;
  const achado = acharVivo(e.target);
  if (!achado || achado.caixa === atual?.caixa) return;
  focado = achado.caixa;
  achado.caixa.dataset.lv = "on";
});

document.addEventListener("focusout", () => {
  if (!focado) return;
  const f = focado;
  // O foco foi para outro elemento do mesmo livro: o focusin seguinte decide.
  requestAnimationFrame(() => {
    if (focado !== f || f.closest(CARTAO + ", " + LIVRO + ", " + FOTO)?.matches(":focus-within")) return;
    if (f !== atual?.caixa) delete f.dataset.lv;
    focado = null;
  });
});

// ---------- o toque: a pose enquanto o dedo está no livro ----------

document.addEventListener(
  "pointerdown",
  (e) => {
    if (!(e.target instanceof Element)) return;
    // Antes de o livro abrir grande (ou ir para a gaveta), ele volta ao lugar na hora: quem mede e copia o
    // livro o encontra parado (o hover some com data-livro-parado, sem transição).
    const medido = e.target.closest("[data-ampliar-livro], [data-ampliar], .livro-na-gaveta");
    if (medido) {
      for (const caixa of medido.querySelectorAll<HTMLElement>(".livro-3d-caixa")) {
        const vivo = caixa.querySelector<HTMLElement>(".livro-vivo");
        if (!vivo || caixa.closest(".palco-ampliado")) continue;
        vivo.dataset.lvSolto = "";
        caixa.dataset.livroParado = "";
        const v = atual?.caixa === caixa ? atual : [...soltando].find((s) => s.caixa === caixa);
        if (v) soltarJa(v);
        // Volta a responder quando o mouse sair dele (ou já, no toque).
        const devolver = () => {
          delete caixa.dataset.livroParado;
          requestAnimationFrame(() => delete vivo.dataset.lvSolto);
        };
        if (e.pointerType === "mouse") medido.addEventListener("pointerleave", devolver, { once: true });
        else setTimeout(devolver, 900);
      }
      return;
    }
    if (e.pointerType === "mouse" || reduzido.matches) return;
    const achado = acharVivo(e.target);
    if (!achado) return;
    const alvo = achado.gatilho;
    alvo.dataset.lvToque = "";
    achado.caixa.dataset.lv = "on";
    const tirar = () => {
      setTimeout(() => {
        delete alvo.dataset.lvToque;
        if (achado.caixa.dataset.lv === "on" && achado.caixa !== atual?.caixa) delete achado.caixa.dataset.lv;
      }, 650);
    };
    addEventListener("pointerup", tirar, { once: true });
    addEventListener("pointercancel", tirar, { once: true });
  },
  { capture: true, passive: true },
);

// Movimento reduzido ligado no meio da visita: tudo volta ao estado parado.
reduzido.addEventListener("change", () => {
  if (!reduzido.matches) return;
  if (atual) soltarJa(atual);
  for (const v of [...soltando]) soltarJa(v);
});

// ---------- a onda de luz da fileira (uma vez por carga) ----------

const ONDA = { duracao: 1200, passo: 60, espera: 600 };

/** O tempo da onda numa fileira (rodada 4: a sequência da home a quer mais curta, depois da onda de molas). */
type TempoDaOnda = { atraso?: number; passo?: number; duracao?: number };

function ondaNoLivro(caixa: HTMLElement, atraso: number, duracao = ONDA.duracao) {
  const ondas = [...caixa.querySelectorAll<HTMLElement>(".lv-onda")];
  if (!ondas.length) return;
  caixa.dataset.lvOnda = "";
  const quadros: Keyframe[] = [
    { opacity: 0, transform: "translateY(-105%)" },
    { opacity: 1, offset: 0.22 },
    { opacity: 1, offset: 0.72 },
    { opacity: 0, transform: "translateY(215%)" },
  ];
  const anims = ondas.map((o) => o.animate(quadros, { duration: duracao, delay: atraso, easing: "cubic-bezier(0.45, 0.05, 0.35, 1)", fill: "both" }));
  Promise.all(anims.map((a) => a.finished))
    .catch(() => {})
    .finally(() => {
      anims.forEach((a) => a.cancel());
      delete caixa.dataset.lvOnda;
    });
}

function ondaNaLombada(lombada: HTMLElement, atraso: number, duracao = ONDA.duracao) {
  let camada = lombada.querySelector<HTMLElement>(":scope > .luz-brilho");
  if (!camada) {
    camada = document.createElement("span");
    camada.className = "luz-brilho";
    camada.setAttribute("aria-hidden", "true");
    lombada.append(camada);
  }
  const onda = document.createElement("i");
  onda.className = "lv-onda";
  camada.append(onda);
  const a = onda.animate(
    [
      { opacity: 0, transform: "translateY(-105%)" },
      { opacity: 1, offset: 0.22 },
      { opacity: 1, offset: 0.72 },
      { opacity: 0, transform: "translateY(215%)" },
    ],
    { duration: duracao, delay: atraso, easing: "cubic-bezier(0.45, 0.05, 0.35, 1)", fill: "both" },
  );
  a.finished.catch(() => {}).finally(() => onda.remove());
}

/**
 * A onda numa fileira: da esquerda para a direita, na ordem dos livros. Devolve quanto ela dura (ms, do
 * atraso ao fim da última faixa), para quem vem depois.
 */
export function ondaNaFileira(fileira: HTMLElement, tempo: TempoDaOnda = {}) {
  if (reduzido.matches || fileira.dataset.lvOndou) return 0;
  fileira.dataset.lvOndou = "";
  const { atraso = 0, passo = ONDA.passo, duracao = ONDA.duracao } = tempo;
  // O livro que foi para a gaveta não brilha (só o contorno dele está na fileira).
  const livros = [...fileira.querySelectorAll<HTMLElement>(".livro-3d-caixa, .lombada")].filter(
    (el) => el.getClientRects().length > 0 && !el.closest(".retirado"),
  );
  livros.forEach((el, i) => {
    if (el.matches(".livro-3d-caixa")) ondaNoLivro(el, atraso + i * passo, duracao);
    else ondaNaLombada(el, atraso + i * passo, duracao);
  });
  return livros.length ? (livros.length - 1) * passo + duracao : 0;
}

/** Quando a fileira pousou: a abertura (cs:aberto), a troca de página (cs:chegou) ou, sem nenhuma, a carga. */
function depoisDePousar(fazer: () => void) {
  const raiz = document.documentElement;
  let feito = false;
  const uma = () => {
    if (feito) return;
    feito = true;
    setTimeout(fazer, ONDA.espera);
  };
  if (raiz.dataset.abertura) addEventListener("cs:aberto", uma, { once: true });
  else if (raiz.hasAttribute("data-vai-chegar")) addEventListener("cs:chegou", uma, { once: true });
  else uma();
  // Se ninguém avisar (a troca interrompida, a abertura pulada antes de o script chegar), vai assim mesmo.
  setTimeout(uma, 4000);
}

function ligarOndas() {
  if (reduzido.matches) return;
  // Linha 18: a fileira com `data-onda-propria` (a da prateleira moderna) chama a onda quando as luzes de
  // quadro acabam de acender (estante-moderna.ts), e não aqui.
  const fileiras = [...document.querySelectorAll<HTMLElement>(".colecao .prateleira-livros, .estante .prateleira-livros, [data-lv-fileira]")].filter(
    (f) => !f.closest("[data-onda-propria]"),
  );
  if (!fileiras.length) return;
  depoisDePousar(() => {
    const olho = new IntersectionObserver(
      (vistas) => {
        for (const v of vistas) {
          if (!v.isIntersecting) continue;
          olho.unobserve(v.target);
          ondaNaFileira(v.target as HTMLElement);
        }
      },
      { threshold: 0.35 },
    );
    fileiras.forEach((f) => olho.observe(f));
  });
}

ligarOndas();

/**
 * Para as outras peças (a linha 18 refaz a onda; a gaveta e quem mede o livro o soltam antes): a onda numa
 * fileira (uma vez por fileira, `data-lv-ondou`) e o livro parado na hora.
 */
(window as unknown as { csLivroVivo?: object }).csLivroVivo = {
  onda: ondaNaFileira,
  soltar(caixa: HTMLElement) {
    const v = atual?.caixa === caixa ? atual : [...soltando].find((s) => s.caixa === caixa);
    if (v) soltarJa(v);
  },
};
