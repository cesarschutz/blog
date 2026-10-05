/**
 * As fichas que caem de cima (rodada 3, área 6: F12-8, F14-4; o 11): numa lista marcada com
 * `data-fichas-caem`, cada ficha cai 36px, de cima para baixo, uma a uma (da esquerda para a direita e
 * de cima para baixo, 40ms entre elas), em 0,45s, com um assentar de 2px e um nada de giro, que se
 * endireita no pouso, como papel solto caindo na mesa.
 *
 * Quando: na troca de página, quando a cortina começa a sair (`cs:cortina-saindo`, do troca.js); ao
 * chegar de fora ou recarregar, quando a abertura termina (`cs:aberto` ou `cs:chegou`); sem nenhuma
 * das duas, na carga. Se o aviso não vier, a folga solta as fichas assim mesmo. As que estão abaixo da
 * dobra caem quando entram na tela (15% à vista), nunca todas de uma vez.
 *
 * As fichas ficam fora da troca de página (`data-fora-da-troca` na lista), para não animarem duas
 * vezes. Antes deste script, o CSS da página as esconde (só com JS e sem movimento reduzido) e as
 * devolve sozinho em 3s se ele não vier; com ele, a lista ganha `data-caem`, e cada ficha que cai ganha
 * `data-caiu`. Com movimento reduzido, nada se esconde nem se mexe.
 *
 * Exportado para o fichário de Tags (as gavetas por letra da 19, fichario.ts): `soltarFichas(fichas)` faz
 * cair, agora, as fichas dadas, na ordem da tela; `quandoAVista()` avisa quando a página está à vista (o
 * fichário espera por ele para puxar as gavetas).
 *
 * Rodada 4 (A3): numa lista com `data-jogadas`, as fichas acima da dobra chegam pela cortina jogadas do
 * alto à direita (troca.js, `jogarFichas`), como no blog de hoje; a troca as marca com `data-caiu` (e
 * `data-jogada`) e esta queda passa por cima delas. As de baixo da dobra continuam caindo ao rolar.
 */

const QUEDA = 36;
const DURACAO = 450;
const PASSO = 40;
const ASSENTA = 2;
const GIRO = 1.4;

const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
const quedas = new Map<HTMLElement, Set<Animation>>();
function cancelarQueda(el: HTMLElement) {
  quedas.get(el)?.forEach((a) => a.cancel());
  quedas.delete(el);
}
function guardarQueda(el: HTMLElement, animacao: Animation) {
  const ativas = quedas.get(el) ?? new Set<Animation>();
  quedas.set(el, ativas);
  ativas.add(animacao);
  void animacao.finished.then(() => {
    ativas.delete(animacao);
    if (!ativas.size && quedas.get(el) === ativas) quedas.delete(el);
  }, () => {});
}
reduzido.addEventListener("change", () => {
  if (reduzido.matches) [...quedas.keys()].forEach(cancelarQueda);
});

/** O fim do cabeçalho fixo: o que está embaixo dele não está à vista. */
function topoVisivel() {
  const t = document.querySelector(".topo-fixo");
  return t ? t.getBoundingClientRect().bottom : 0;
}

/** Na ordem da tela: de cima para baixo e, na mesma linha, da esquerda para a direita. */
function naOrdem(fichas: HTMLElement[]) {
  return fichas
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .sort((a, b) => Math.round(a.r.top / 48) - Math.round(b.r.top / 48) || a.r.left - b.r.left)
    .map((x) => x.el);
}

function cair(el: HTMLElement, atraso: number, lado: number) {
  cancelarQueda(el);
  el.dataset.caiu = "";
  if (reduzido.matches || !el.animate) return;
  const giro = lado * GIRO;
  // A queda desacelera como papel no ar (não como pedra), passa 2px do lugar e assenta.
  guardarQueda(el, el.animate(
    [
      { transform: `translateY(${-QUEDA}px) rotate(${giro}deg)`, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
      { transform: `translateY(${ASSENTA}px) rotate(${(-giro * 0.12).toFixed(2)}deg)`, offset: 0.72, easing: "cubic-bezier(0.33, 0, 0.3, 1)" },
      { transform: "none" },
    ],
    { duration: DURACAO, delay: atraso, fill: "backwards" },
  ));
  guardarQueda(el, el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 190, delay: atraso, easing: "linear", fill: "backwards" }));
}

/** Faz cair, agora, as fichas dadas (na ordem da tela, 40ms entre elas). */
export function soltarFichas(fichas: HTMLElement[]) {
  naOrdem(fichas.filter((f) => !f.hasAttribute("data-caiu"))).forEach((f, i) => cair(f, i * PASSO, i % 2 ? -1 : 1));
}

/** O aviso de que a página está à vista: a cortina saindo, a abertura acabando ou a carga. */
export function quandoAVista(): Promise<void> {
  const raiz = document.documentElement;
  return new Promise((pronto) => {
    let foi = false;
    const ir = () => {
      if (foi) return;
      foi = true;
      pronto();
    };
    if (raiz.hasAttribute("data-abertura")) {
      addEventListener("cs:aberto", ir, { once: true });
      addEventListener("cs:chegou", ir, { once: true });
      // A abertura tem a trava dela de 7s (Base.astro); a folga vem logo depois.
      setTimeout(ir, 7600);
      return;
    }
    if (raiz.hasAttribute("data-vai-chegar") || raiz.hasAttribute("data-chegando") || raiz.classList.contains("cortina")) {
      // Voltando pelo histórico, a cortina sai para baixo e descobre a tela de cima para baixo: as fichas
      // (embaixo do título e da nuvem) esperam metade da saída.
      addEventListener(
        "cs:cortina-saindo",
        (e) => {
          const d = (e as CustomEvent<{ volta?: boolean; duracao?: number }>).detail;
          setTimeout(ir, d?.volta ? (d.duracao ?? 360) * 0.5 : 0);
        },
        { once: true },
      );
      // Sem o aviso da cortina (uma troca sem ela, ou a cortina mudou), a chegada inteira avisa.
      addEventListener("cs:chegou", ir, { once: true });
      setTimeout(ir, 2200);
      return;
    }
    requestAnimationFrame(ir);
  });
}

/** Liga a queda numa lista (`data-fichas-caem`): as fichas são os filhos diretos. */
export function fichasCaem(lista: HTMLElement) {
  if (lista.hasAttribute("data-caem")) return;
  const fichas = [...lista.children] as HTMLElement[];
  if (reduzido.matches || !("IntersectionObserver" in window)) {
    fichas.forEach((f) => (f.dataset.caiu = ""));
    lista.dataset.caem = "";
    return;
  }
  lista.dataset.caem = "";
  quandoAVista().then(() => {
    const topo = topoVisivel();
    const H = innerHeight;
    const agora: HTMLElement[] = [];
    const depois: HTMLElement[] = [];
    for (const f of fichas) {
      const r = f.getBoundingClientRect();
      // Já passou (a página voltou rolada): fica no lugar, sem cair.
      if (r.bottom <= topo) f.dataset.caiu = "";
      else if (r.top < H - 40) agora.push(f);
      else depois.push(f);
    }
    soltarFichas(agora);
    if (!depois.length) return;
    const olho = new IntersectionObserver(
      (entradas) => {
        const chegaram = entradas.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        chegaram.forEach((f) => olho.unobserve(f));
        soltarFichas(chegaram);
      },
      { threshold: 0.15 },
    );
    depois.forEach((f) => olho.observe(f));
  });
}
