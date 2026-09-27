/**
 * A estante viva (D40, D49), com GSAP sob demanda:
 *
 * - o toque na cabeça (home e estante de filtro; D49, protótipo D1): o livro sob o mouse tomba um nada
 *   para a frente, 5°, pela borda de baixo, ainda apoiado na prateleira, e mostra a cabeça (o topo das
 *   páginas). Os vizinhos não se mexem e nada flutua (antes, D47, o livro subia 16px e os vizinhos,
 *   2px). Ao sair, ele cai de volta em pé. Embaixo, a legenda mostra o nome e a contagem. O foco do
 *   teclado faz o mesmo. Só com mouse; no toque, a lombada abre o livro direto (Gaveta.astro, que faz o
 *   gesto de tirar e guardar, estante-gesto.ts).
 *
 * - em repouso (só a home, `emRepouso`): depois de 3s sem mouse, toque, tecla ou rolagem, com a estante
 *   ao menos metade visível e a aba ativa, a cada 4 a 7s um livro sorteado é tocado na cabeça: tomba um
 *   pouco e volta ao lugar. Qualquer interação para tudo na hora e devolve o livro ao lugar. Desligada
 *   com movimento reduzido.
 *
 * O livro fora da prateleira (na mão ou na gaveta) é da gaveta, e o vizinho tombado não espia: a
 * estante viva não mexe neles. O repouso de cada lombada (a inclinada da home, 6°; a escolhida no
 * filtro, 10px acima) fica com o GSAP, que escreve o `transform`, e o CSS não manda mais. Só
 * transformações. Com movimento reduzido, nada se move (a legenda continua).
 *
 * Durante a abertura da home (D51, `data-abertura` no <html>), a estante é a cena: não responde ao mouse
 * nem ao foco (sem tombar e sem a legenda, B12 da D52) e o repouso espera ela acabar (`cs:aberto`).
 */
import { descanso, foraDaPrateleira } from "./estante-gesto";
import { adiantar, carregarGsap, movimentoReduzido, temMouse, type GSAP } from "./gsap";

/** Quanto o livro tocado na cabeça tomba para a frente. */
const TOQUE = -5;
const OCIOSO = 3000;

const escolhida = (el: HTMLElement) => (el.getAttribute("aria-pressed") === "true" ? -10 : 0);
const naAbertura = () => document.documentElement.hasAttribute("data-abertura");

const prontas = new WeakSet<HTMLElement>();
/**
 * Passa as lombadas da prateleira para o GSAP, uma vez (a gaveta chama também, antes do gesto): o CSS
 * deixa de animar o transform (`.viva`), e cada lombada fica no repouso dela.
 */
export function prepararPrateleira(gsap: GSAP, prateleira: HTMLElement) {
  if (prontas.has(prateleira)) return;
  prontas.add(prateleira);
  prateleira.classList.add("viva");
  for (const el of prateleira.querySelectorAll<HTMLElement>(".lombada")) {
    if (el.dataset.tombado !== undefined || foraDaPrateleira(el)) continue;
    gsap.set(el, { ...descanso(el), y: escolhida(el) });
  }
}

export function estanteViva(raiz: HTMLElement, { emRepouso = false } = {}) {
  const lombadas = [...raiz.querySelectorAll<HTMLElement>(".lombada")];
  const legenda = raiz.parentElement?.querySelector<HTMLElement>("[data-legenda-estante]");
  if (!lombadas.length) return;

  const mostrarLegenda = (el: HTMLElement | null) => {
    if (!legenda) return;
    legenda.innerHTML = el ? `<b>${el.dataset.titulo}</b> · ${el.dataset.conta}` : "";
  };

  let gsap: GSAP | null = null;
  const preparar = (g: GSAP) => {
    if (gsap) return;
    gsap = g;
    prepararPrateleira(g, raiz);
    // A lombada escolhida no filtro muda de repouso: vai para o lugar novo.
    new MutationObserver((mudancas) => {
      for (const m of mudancas) {
        const el = m.target as HTMLElement;
        g.to(el, { y: escolhida(el), duration: 0.45, ease: "power3.out", overwrite: "auto" });
      }
    }).observe(raiz, { subtree: true, attributes: true, attributeFilter: ["aria-pressed"] });
  };

  // ---------- o toque na cabeça ----------
  let sob: HTMLElement | null = null;

  /** O livro tocado tomba 5° para a frente; o que estava tocado cai de volta em pé. */
  function tocar(el: HTMLElement | null) {
    if (el === sob) return;
    const antes = sob;
    sob = el;
    mostrarLegenda(el);
    if (!gsap || movimentoReduzido.matches) return;
    if (antes && !foraDaPrateleira(antes)) gsap.to(antes, { rotationX: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
    if (el && !foraDaPrateleira(el)) gsap.to(el, { rotationX: TOQUE, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  }

  /** A lombada sob o mouse, pela coluna dela (com 3px de folga, para o vão entre dois livros não piscar). */
  function naColuna(x: number) {
    return (
      lombadas.find((el) => {
        if (el.classList.contains("segurando")) return false;
        const caixa = el.getBoundingClientRect();
        return x >= caixa.left - 3 && x <= caixa.right + 3;
      }) ?? null
    );
  }

  // ---------- em repouso ----------
  let relogio = 0;
  let visivel = false;
  let ativo = false;
  let proxima: gsap.core.Tween | null = null;
  let espiada: gsap.core.Timeline | null = null;
  let espiado: HTMLElement | null = null;

  function iniciarRepouso() {
    if (!gsap || ativo || !visivel || document.hidden || movimentoReduzido.matches || sob || naAbertura()) return;
    const g = gsap;
    ativo = true;
    const espiar = () => {
      const livres = lombadas.filter((el) => !foraDaPrateleira(el) && el.dataset.tombado === undefined);
      const el = livres[Math.floor(Math.random() * livres.length)];
      if (el) {
        espiado = el;
        espiada = g
          .timeline()
          .to(el, { rotationX: -7, duration: 0.55, ease: "power2.out" })
          .to(el, { rotationX: 0, duration: 0.3, ease: "power2.in" }, "+=0.5")
          .to(el, { rotationX: -0.8, duration: 0.07, ease: "power1.out" })
          .to(el, { rotationX: 0, duration: 0.12, ease: "power1.in" });
      }
      proxima = g.delayedCall(4 + Math.random() * 3, espiar);
    };
    proxima = g.delayedCall(1.6, espiar);
  }

  function pararRepouso() {
    if (!ativo || !gsap) return;
    ativo = false;
    proxima?.kill();
    espiada?.kill();
    proxima = espiada = null;
    if (espiado && espiado !== sob && !foraDaPrateleira(espiado) && espiado.dataset.tombado === undefined) {
      gsap.to(espiado, { rotationX: 0, duration: 0.25, ease: "power2.in", overwrite: "auto" });
    }
    espiado = null;
  }

  // Qualquer interação para tudo na hora e recomeça a contar os 3 segundos.
  function mexeu() {
    pararRepouso();
    clearTimeout(relogio);
    if (visivel && !document.hidden) relogio = window.setTimeout(iniciarRepouso, OCIOSO);
  }

  if (emRepouso && !movimentoReduzido.matches) {
    new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        mexeu();
      },
      { threshold: 0.5 },
    ).observe(raiz);
    for (const evento of ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"]) {
      addEventListener(evento, mexeu, { passive: true });
    }
    document.addEventListener("visibilitychange", mexeu);
    // A abertura acabou: começa a contar os 3 segundos do repouso.
    addEventListener("cs:aberto", mexeu);
    movimentoReduzido.addEventListener("change", mexeu);
    // Sem mouse, o GSAP vem quando a página fica ociosa, para o repouso poder começar.
    adiantar(raiz, () => carregarGsap().then((g) => {
      preparar(g);
      mexeu();
    }));
  }

  // O foco do teclado faz o mesmo que o mouse; a legenda aparece mesmo com movimento reduzido.
  for (const el of lombadas) {
    el.addEventListener("focus", () => {
      if (!el.matches(":focus-visible") || naAbertura()) return;
      if (movimentoReduzido.matches) return mostrarLegenda(el);
      carregarGsap().then((g) => {
        preparar(g);
        if (document.activeElement === el) tocar(el);
      });
    });
    el.addEventListener("blur", (e) => {
      // Indo para outra lombada, quem cuida é o foco dela.
      if (lombadas.includes(e.relatedTarget as HTMLElement)) return;
      tocar(null);
    });
  }

  raiz.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || naAbertura()) return;
    if (!gsap && !movimentoReduzido.matches) {
      carregarGsap().then(preparar);
      return;
    }
    tocar(naColuna(e.clientX));
  });
  raiz.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") tocar(null);
  });

  if (temMouse.matches && !movimentoReduzido.matches) adiantar(raiz, () => carregarGsap().then(preparar));
}
