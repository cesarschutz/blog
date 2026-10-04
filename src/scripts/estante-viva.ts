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
 * - em repouso: nada (rodada 4, H11). A estante não se mexe sozinha com a página parada; antes, depois de 3s
 *   sem gesto, um livro sorteado era tocado na cabeça a cada 4 a 7s. Só o mouse, o foco e o toque a mexem.
 *
 * O livro fora da prateleira (na mão ou na gaveta) é da gaveta, e o vizinho tombado não espia: a
 * estante viva não mexe neles. O repouso de cada lombada (a inclinada da home, 6°; a escolhida no
 * filtro, 10px acima) fica com o GSAP, que escreve o `transform`, e o CSS não manda mais. Só
 * transformações. Com movimento reduzido, nada se move (a legenda continua).
 *
 * Durante a abertura da home (D51, `data-abertura` no <html>), a estante é a cena: não responde ao mouse
 * nem ao foco (sem tombar e sem a legenda, B12 da D52).
 */
import { descanso, foraDaPrateleira } from "./estante-gesto";
import { adiantar, carregarGsap, movimentoReduzido, temMouse, type GSAP } from "./gsap";

/** Quanto o livro tocado na cabeça tomba para a frente. */
const TOQUE = -5;

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

export function estanteViva(raiz: HTMLElement) {
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

  // O foco do teclado faz o mesmo que o mouse; a legenda aparece mesmo com movimento reduzido.
  for (const el of lombadas) {
    el.addEventListener("focus", () => {
      if (!el.matches(":focus-visible") || naAbertura()) return;
      // Pelo tocar (que não anima com movimento reduzido), para o blur saber limpar a legenda (D54).
      if (movimentoReduzido.matches) return tocar(el);
      // Sem o GSAP (a rede falhou), a lombada só não tomba: o foco e o link continuam.
      carregarGsap().then((g) => {
        preparar(g);
        if (document.activeElement === el) tocar(el);
      }, () => {});
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
      carregarGsap().then(preparar, () => {});
      return;
    }
    tocar(naColuna(e.clientX));
  });
  raiz.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") tocar(null);
  });

  if (temMouse.matches && !movimentoReduzido.matches) adiantar(raiz, () => carregarGsap().then(preparar));
}
