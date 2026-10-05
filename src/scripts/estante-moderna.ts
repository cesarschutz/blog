/**
 * A chegada das fileiras com abajures (linha 18; rodada 4, a versão final): as prateleiras da home
 * (ColecaoHome.astro), a fileira do topo da página do livro (Colecao.astro) e a estante de lombadas
 * (Estante.astro: o filtro por livro e a 404). Sem biblioteca: Web Animations API, só opacidade e transform.
 *
 * Quando a fileira pousa (a troca de página avisa com `cs:chegou`; sem nenhuma, na carga) e está à vista,
 * nesta ordem, **uma coisa de cada vez** (rodada 4, A1: "primeiro subir e descer os livros e depois o brilho
 * apenas"):
 *
 * 1. **Os abajures acendem um a um**, da esquerda para a direita, 60ms entre eles, com a curva da lâmpada
 *    incandescente do lustre (lampada.ts, a seção 1 de luz-realista.md): a brasa da boca chega primeiro, o
 *    feixe (com a poça) logo depois e o branco quente da boca por último, com o tremor do contato nos
 *    primeiros 150ms. A peça de latão não muda; só a luz.
 * 2. **Só a onda de molas** (só na home): cada livro sobe 6px e volta com a mola do hover (0,5s), 45ms
 *    depois do vizinho da esquerda. Nenhum brilho enquanto ela corre.
 * 3. **Só o brilho**: a faixa de luz desce cada livro (livro-vivo.ts, `ondaNaFileira`), 45ms entre eles,
 *    com os livros parados; começa quando a última mola acabou.
 *
 * Tudo nasce no mesmo instante, com os atrasos (WAAPI): a ordem vale mesmo com a CPU lenta, porque a onda e o
 * brilho correm no mesmo relógio e não se encostam. Na home, chegando de fora, quem chama a sequência é a
 * abertura (Abertura.astro, A1), na hora certa dela: ela marca a coleção com `data-conduzida`, e este script
 * a deixa para ela. Enquanto a sequência corre, a fileira leva `data-acendendo`.
 *
 * Uma vez por carga e por fileira. A troca de livro pela fileira do topo (troca.js marca
 * `data-chegou-por-livro`) não acende de novo: a fileira é a mesma. Com movimento reduzido, as luzes já
 * nascem acesas (CSS) e nada se mexe.
 */
import { amostrar, camada } from "./lampada";
import { ondaNaFileira } from "./livro-vivo";

const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
const raiz = document.documentElement;

/**
 * Os tempos da sequência, em ms, a partir do instante em que ela começa: as luzes (o passo entre elas e a
 * curva de cada uma), a onda de molas (quando começa, o passo e quanto dura cada mola) e o brilho (o passo e
 * quanto dura a faixa em cada livro). O brilho começa 20ms depois da última mola acabar.
 */
const SEQ = {
  luzPasso: 60,
  luzDuracao: 720,
  feixeAtras: 30,
  molaEm: 460,
  molaPasso: 45,
  molaDuracao: 500,
  brilhoPasso: 45,
  brilhoDuracao: 580,
} as const;

/** A força de repouso da brasa (luz.css, `.ponto-luz-brasa`): a curva termina nela. */
const BRASA_REPOUSO = 0.55;

let quadros: { brasa: Keyframe[]; feixe: Keyframe[]; boca: Keyframe[] } | null = null;
function curvas() {
  quadros ??= {
    brasa: amostrar(SEQ.luzDuracao, (t) => (camada("brasa", t, true) / 0.9) * BRASA_REPOUSO),
    feixe: amostrar(SEQ.luzDuracao, (t) => camada("cone", Math.max(0, t - SEQ.feixeAtras), true)),
    boca: amostrar(SEQ.luzDuracao, (t) => camada("nucleo", t, true)),
  };
  return quadros;
}

const visivel = (el: Element) => el.getClientRects().length > 0 && getComputedStyle(el).display !== "none";

/** Os abajures que aparecem (abaixo de 700px, metade deles fica escondida: um a cada dois livros). */
const abajures = (dono: HTMLElement) =>
  [...dono.querySelectorAll<HTMLElement>(".ponto-luz")].filter((l) => !l.closest(".lugar-luz") || visivel(l.closest(".lugar-luz")!));

/**
 * O clarão do cone ao acender (rodada 4): ele sobe até o aceso do hover junto com a lâmpada e assenta na força
 * dele (a de repouso, ou a acesa no lugar vazio). No claro, o cone de repouso é fraco, e sem o clarão o "um a
 * um" quase não se via. As curvas ficam guardadas por par de forças (quase todos os cones têm o mesmo).
 */
const claroes = new Map<string, Keyframe[]>();
function clarao(final: number, aceso: number): Keyframe[] {
  const pico = Math.max(final, aceso * 0.85);
  const chave = `${final.toFixed(3)}:${pico.toFixed(3)}`;
  let q = claroes.get(chave);
  if (!q) {
    const subida = 260;
    q = amostrar(SEQ.luzDuracao + 180, (t) =>
      t < subida ? pico * Math.pow(t / subida, 1.6) : final + (pico - final) * Math.exp(-(t - subida) / 210),
    );
    claroes.set(chave, q);
  }
  return q;
}

/** Acende as luzes de uma fileira, da esquerda para a direita, a partir de `atraso` ms. */
function acender(dono: HTMLElement, atraso = 0) {
  if (dono.hasAttribute("data-luzes-acesas")) return 0;
  const luzes = abajures(dono);
  const q = curvas();
  // Primeiro, todas as leituras (as forças de cada cone); depois, todas as animações: um cálculo de estilo só.
  const forcas = luzes.map((luz) => {
    const cone = luz.querySelector<HTMLElement>(".ponto-luz-cone");
    return {
      cone,
      final: cone ? parseFloat(getComputedStyle(cone).opacity) || 0 : 0,
      aceso: parseFloat(getComputedStyle(luz).getPropertyValue("--ponto-luz-aceso")) || 0.6,
    };
  });
  luzes.forEach((luz, i) => {
    const opcoes: KeyframeAnimationOptions = { duration: SEQ.luzDuracao, delay: atraso + i * SEQ.luzPasso, fill: "backwards", easing: "linear" };
    luz.querySelector<HTMLElement>(".ponto-luz-brasa")?.animate(q.brasa, opcoes);
    luz.querySelector<HTMLElement>(".ponto-luz-feixe")?.animate(q.feixe, opcoes);
    luz.querySelector<HTMLElement>(".ponto-luz-lampada")?.animate(q.boca, opcoes);
    const { cone, final, aceso } = forcas[i];
    cone?.animate(clarao(final, aceso), { ...opcoes, duration: SEQ.luzDuracao + 180 });
  });
  // No mesmo quadro em que as animações nascem (elas seguram o apagado no atraso): sem piscar.
  dono.setAttribute("data-luzes-acesas", "");
  return luzes.length;
}

/** Acesas na hora, sem a curva: a abertura pulada, o movimento reduzido. */
export function acenderJa(dono: HTMLElement) {
  dono.setAttribute("data-luzes-acesas", "");
}

/**
 * A onda de molas: cada livro sobe 6px (na escala da fileira) e volta, com a passada da mola do hover (sobe
 * rápido, passa um nada, assenta). Vai no `translate` do `.livro-vivo` (o `transform` é do hover e o `rotate`
 * é do mouse), e a sombra de contato (`.chao`, no plano do livro) desce o mesmo tanto, para ficar no chão.
 * Devolve quando a última termina (ms, a partir de agora).
 */
function ondaDeMolas(colecao: HTMLElement, atraso: number) {
  const lugares = [...colecao.querySelectorAll<HTMLElement>(".prateleira-livros > .livro-colecao:not(.vao)")];
  const kc = parseFloat(getComputedStyle(colecao).getPropertyValue("--kc")) || 1;
  const sobe = 6 * kc;
  const passo = (y: number): Keyframe[] => [
    { translate: "0 0", easing: "cubic-bezier(0.25, 0.7, 0.3, 1)" },
    { translate: `0 ${(-y).toFixed(2)}px`, offset: 0.36, easing: "cubic-bezier(0.5, 0, 0.5, 1)" },
    { translate: `0 ${(y * 0.14).toFixed(2)}px`, offset: 0.72, easing: "cubic-bezier(0.4, 0, 0.6, 1)" },
    { translate: "0 0" },
  ];
  lugares.forEach((lugar, i) => {
    // O livro que está sob o mouse fica de fora.
    if (lugar.matches(":hover")) return;
    const vivo = lugar.querySelector<HTMLElement>(".livro-vivo");
    const chao = lugar.querySelector<HTMLElement>(".livro-3d .chao");
    const opcoes: KeyframeAnimationOptions = { duration: SEQ.molaDuracao, delay: atraso + i * SEQ.molaPasso };
    vivo?.animate(passo(sobe), opcoes);
    chao?.animate(passo(-sobe), opcoes);
  });
  return atraso + Math.max(0, lugares.length - 1) * SEQ.molaPasso + SEQ.molaDuracao;
}

/**
 * A sequência inteira de uma fileira (as luzes, a onda e o brilho), começando agora. Com `molas`, a onda de
 * molas vem entre as luzes e o brilho (a home). Devolve quanto ela dura (ms).
 */
export function sequencia(dono: HTMLElement, { molas = false } = {}) {
  if (reduzido.matches) {
    acenderJa(dono);
    return 0;
  }
  const fileira = dono.querySelector<HTMLElement>(".prateleira-livros");
  const n = acender(dono, 0);
  dono.setAttribute("data-acendendo", "");
  // Sem molas, o brilho vem quando a última luz já começou a subir.
  let brilhoEm = Math.max(SEQ.molaEm, (n - 1) * SEQ.luzPasso + 200);
  if (molas) brilhoEm = ondaDeMolas(dono, SEQ.molaEm) + 20;
  let fim = brilhoEm;
  if (fileira) fim = brilhoEm + ondaNaFileira(fileira, { atraso: brilhoEm, passo: SEQ.brilhoPasso, duracao: SEQ.brilhoDuracao });
  setTimeout(() => dono.removeAttribute("data-acendendo"), fim);
  return fim;
}

/** Quando a fileira pousou: a troca de página (cs:chegou) ou, sem nenhuma, já. */
function depoisDePousar(fazer: () => void) {
  let feito = false;
  const uma = () => {
    if (feito) return;
    feito = true;
    fazer();
  };
  if (raiz.dataset.abertura) addEventListener("cs:aberto", uma, { once: true });
  else if (raiz.hasAttribute("data-vai-chegar") || raiz.hasAttribute("data-chegando")) addEventListener("cs:chegou", uma, { once: true });
  else uma();
  // Se ninguém avisar (a troca interrompida, a abertura pulada antes de o script dela chegar), vai assim mesmo.
  setTimeout(uma, 4000);
}

/** A chegada de uma fileira, quando ela está à vista (um respiro depois do pouso, o quadro mais cheio). */
function chegar(dono: HTMLElement) {
  // A home chegando de fora é da abertura (A1): ela chama a sequência na hora dela.
  if (dono.hasAttribute("data-conduzida")) return;
  const fileira = dono.querySelector<HTMLElement>(".prateleira-livros");
  const home = dono.matches("[data-colecao='home']");
  const olho = new IntersectionObserver(
    (vistas) => {
      if (!vistas.some((v) => v.isIntersecting)) return;
      olho.disconnect();
      setTimeout(() => sequencia(dono, { molas: home }), 90);
    },
    { threshold: 0.3 },
  );
  olho.observe(fileira ?? dono);
}

function iniciar() {
  const donos = [...document.querySelectorAll<HTMLElement>("[data-luzes-ao-chegar]")];
  if (!donos.length) return;
  // Movimento reduzido: as luzes já estão acesas (CSS); a onda e as molas não existem.
  if (reduzido.matches) {
    donos.forEach(acenderJa);
    return;
  }
  // A troca de livro pela fileira do topo: a mesma fileira, já acesa.
  if (raiz.hasAttribute("data-chegou-por-livro")) {
    delete raiz.dataset.chegouPorLivro;
    donos.forEach((d) => {
      acenderJa(d);
      const f = d.querySelector<HTMLElement>(".prateleira-livros");
      if (f) f.dataset.lvOndou = "";
    });
    return;
  }
  depoisDePousar(() => donos.forEach(chegar));
}

iniciar();
