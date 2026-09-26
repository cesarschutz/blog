/**
 * Lista, cards e filtro (D41, ideia 1), com GSAP e Flip sob demanda.
 *
 * - Lista ⇄ Cards: um formato não vira o outro. Os artigos à vista somem rápido (0,16s cada, em
 *   sequência), o formato muda e eles reaparecem um a um, subindo 10px (0,38s, `stagger` 0,04s).
 * - Filtro por livro (arquivo e tags): com Flip, os que ficam deslizam até o lugar novo sem mudar de
 *   tamanho (`scale`), os que saem encolhem e somem (soltos, `absoluteOnLeave`), os que entram
 *   crescem e aparecem.
 *
 * A área da lista (`[data-area-lista]`) nunca encolhe no meio da animação, senão o painel e a página
 * pulam: ela guarda a altura do começo e só no fim fica com a nova, sem animar a altura. Só
 * transformações e opacidade; com movimento reduzido (ou antes de o GSAP chegar), a troca é direta.
 */
import { adiantar, carregarFlip, movimentoReduzido } from "./gsap";

type Flip = Awaited<ReturnType<typeof carregarFlip>>;

let pronto: Flip | null = null;
const carregar = () => carregarFlip().then((f) => (pronto = f));

/** Começa o download do GSAP e do Flip quando o leitor chega perto dos controles. */
export function adiantarLista(...alvos: (Element | null)[]) {
  if (movimentoReduzido.matches) return;
  for (const alvo of alvos) if (alvo) adiantar(alvo, carregar);
}

const areas = () => [...document.querySelectorAll<HTMLElement>("[data-area-lista]")];

/** Os artigos à vista: no formato atual, fora do filtro e dentro da tela (com uma folga). */
function aVista(itens: HTMLElement[]) {
  const alto = innerHeight;
  return itens.filter((el) => {
    if (!el.offsetParent) return false;
    const r = el.getBoundingClientRect();
    return r.bottom > -40 && r.top < alto + 40;
  });
}

const itensDoModo = () =>
  [...document.querySelectorAll<HTMLElement>(".lista-modo > li, .cartoes-modo > li")].filter((el) => el.offsetParent);

// A animação em curso: um clique novo a termina antes de começar outra.
let terminar: (() => void) | null = null;

/** Segura a altura das áreas da lista e devolve como soltar. */
function segurar(extra: HTMLElement[] = []) {
  const todas = [...areas(), ...extra];
  const alturas = todas.map((el) => el.offsetHeight);
  return {
    aplicar: () => todas.forEach((el, i) => (el.style.minHeight = `${alturas[i]}px`)),
    soltar: () => todas.forEach((el) => (el.style.minHeight = "")),
  };
}

/** Troca Lista ⇄ Cards: some, muda, reaparece. `aplicar` faz a troca de verdade. */
export function trocarModo(aplicar: () => void) {
  terminar?.();
  if (movimentoReduzido.matches || !pronto) {
    aplicar();
    return;
  }
  const { gsap } = pronto;
  const saindo = aVista(itensDoModo());
  const altura = segurar();
  altura.aplicar();
  for (const a of areas()) a.classList.add("movendo");
  let entrada: gsap.core.Tween | null = null;
  const fim = () => {
    altura.soltar();
    for (const a of areas()) a.classList.remove("movendo");
    terminar = null;
  };
  const saida = gsap.to(saindo, {
    opacity: 0,
    y: 6,
    duration: 0.16,
    stagger: 0.02,
    ease: "power1.in",
    onComplete: () => {
      aplicar();
      gsap.set(saindo, { clearProps: "opacity,transform" });
      const entrando = aVista(itensDoModo());
      entrada = gsap.fromTo(
        entrando,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.04, ease: "power2.out", clearProps: "opacity,transform", onComplete: fim },
      );
      if (!entrando.length) fim();
    },
  });
  terminar = () => {
    saida.progress(1);
    entrada?.progress(1);
  };
}

/**
 * Filtra com Flip. `mudar` marca `data-fora` nos artigos e grupos que saem (o `hidden` tem
 * `!important` e o Flip não conseguiria mostrá-los enquanto somem).
 */
export function filtrarComFlip(lista: HTMLElement, mudar: () => void) {
  terminar?.();
  if (movimentoReduzido.matches || !pronto) {
    mudar();
    return;
  }
  const { gsap, Flip } = pronto;
  const grupos = [...lista.querySelectorAll<HTMLElement>("[data-grupo]")];
  const itens = itensDoModo().filter((el) => lista.contains(el));
  const titulos = [...lista.querySelectorAll<HTMLElement>(".ano")];
  const antes = Flip.getState([...itens, ...titulos, ...grupos]);
  // Só anima o que está perto da tela, antes ou depois: o resto troca direto, sem custo (no celular,
  // animar os 27 artigos do arquivo custava mais de 100ms de layout com a CPU 4× mais lenta).
  const perto = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return (r.width || r.height) > 0 && r.bottom > -120 && r.top < innerHeight + 120;
  };
  const pertoAntes = new Set([...itens, ...titulos, ...grupos].filter(perto));
  const altura = segurar();
  altura.aplicar();

  mudar();

  // Grupos que somem vão inteiros (título e artigos); dentro deles, nada anima sozinho.
  const gruposSaindo = grupos.filter((g) => g.hasAttribute("data-fora") && pertoAntes.has(g));
  const dentroDeQuemSai = (el: HTMLElement) => grupos.some((g) => g.hasAttribute("data-fora") && g.contains(el));
  const anima = (el: HTMLElement) => !dentroDeQuemSai(el) && (pertoAntes.has(el) || perto(el));
  const alvos = [...itens, ...titulos].filter(anima);
  lista.classList.add("movendo");

  const animacao = Flip.from(antes, {
    targets: [...alvos, ...gruposSaindo],
    duration: 0.55,
    ease: "power2.inOut",
    // Só quem sai fica solto (absolute), para não ocupar lugar enquanto some. Os que ficam deslizam
    // no fluxo, por transform, com o mesmo tamanho: soltos, os artigos longe da tela (que não animam)
    // subiriam para o lugar deles e apareceriam no meio da animação.
    absoluteOnLeave: true,
    scale: true,
    stagger: 0.02,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, delay: 0.2 }),
    // Quem sai some de vez ao fim do próprio tween (e não no fim do Flip), ainda perto do clique:
    // assim a saída não conta como deslocamento de layout inesperado (CLS).
    onLeave: (els) =>
      gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.25, onComplete: () => els.forEach((el) => ((el as HTMLElement).style.display = "none")) }),
    onComplete: () => {
      altura.soltar();
      lista.classList.remove("movendo");
      terminar = null;
    },
  });
  terminar = () => animacao.progress(1);
}
