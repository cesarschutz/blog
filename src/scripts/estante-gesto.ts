/**
 * A estante de verdade (D49, protótipo D1): tirar um livro como se tira de uma estante, com o dedo na
 * cabeça dele, puxando para a frente. O livro tomba sobre a borda de baixo, sai para perto do leitor e
 * só então anda (a gaveta, Gaveta.astro, leva o livro até ela). O vizinho da direita, que perde o
 * apoio, tomba até encostar no outro livro e volta a ficar em pé quando o livro é guardado. Nada
 * flutua: ou o livro está apoiado na prateleira, ou está na mão.
 *
 * Aqui ficam a geometria e os movimentos que a estante viva (estante-viva.ts) e a gaveta dividem, em
 * transformações 3D do GSAP, dentro da perspectiva da prateleira (estante.css).
 */
import type { GSAP } from "./gsap";

/**
 * As lombadas ficam sempre com uma transformação 3D, como no CSS (`rotateX(0deg)`, estante.css), também
 * paradas: o GSAP, por padrão, volta ao 2D no fim de cada movimento, e no celular (Safari) a lombada
 * girada só em 2D, dentro da prateleira em 3D, perdia o desenho (o vizinho que tomba, D54). O `force3D`
 * fica guardado no GSAP de cada lombada: vale para os movimentos seguintes dela.
 */
export const EM_3D = { force3D: true } as const;

/**
 * Onde a lombada descansa: em pé, girando pela borda de baixo; a última da coleção, inclinada 6° sobre
 * o aparador, gira pelo canto de baixo à direita.
 */
export function descanso(el: HTMLElement) {
  const inclinada = el.classList.contains("inclinada");
  return { rotation: inclinada ? 6 : 0, transformOrigin: inclinada ? "100% 100%" : "50% 100%", ...EM_3D };
}

/** O livro na mão (`segurando`) ou na gaveta (`retirado`): quem mexe nele é a gaveta. */
export const foraDaPrateleira = (el: HTMLElement) => el.matches(".segurando, .retirado");

/** A profundidade do livro: a capa tem 480 de largura para 720 de altura (CAPAS.md). */
export const profundidade = (el: HTMLElement) => (el.offsetHeight * 480) / 720;

/**
 * Quanto levantar o livro que vem para a frente: perto do olho ele cresce, e o pé dele desceria abaixo
 * da prateleira na projeção. Levantando isso (mais 3px de folga para passar a borda da tábua), o pé
 * continua na linha da tábua, como quem ergue o livro um nada para tirá-lo. O olho é o
 * perspective-origin da prateleira (estante.css: um pouco acima dos livros, D57), e o pé fica embaixo
 * dela, `abaixo` px abaixo do olho. Na projeção, o pé a z vai para abaixo · d / (d − z); o y do GSAP
 * entra antes dela (translate3d), e quem zera o desvio é −abaixo · z / d.
 */
export function levantar(prateleira: HTMLElement, z: number) {
  const estilo = getComputedStyle(prateleira);
  const perspectiva = parseFloat(estilo.perspective) || 1400;
  const olho = parseFloat(estilo.perspectiveOrigin.split(" ")[1]);
  const abaixo = prateleira.offsetHeight - (Number.isFinite(olho) ? olho : prateleira.offsetHeight * 0.45);
  return -(abaixo * z) / perspectiva - 3;
}

export type Tombado = { el: HTMLElement; graus: number };

/**
 * O vizinho da direita perde o apoio e tomba para a esquerda, girando pela quina de baixo, até encostar
 * no vizinho da esquerda: ou a quina de cima dele toca a lateral do outro (sen θ = vão / altura), ou a
 * lateral dele pousa na quina de cima do outro, se o outro for mais baixo (tg θ = vão / altura do
 * outro). Não tombam o livro inclinado da ponta (apoiado no aparador), o primeiro da fileira (sem
 * vizinho da esquerda não há onde encostar) nem um livro que não está na prateleira. As categorias e as
 * séries são fileiras separadas pelo aparador.
 */
export function quemTomba(el: HTMLElement): Tombado | null {
  const serie = el.classList.contains("de-serie");
  const fileira = [...el.parentElement!.querySelectorAll<HTMLElement>(".lombada")].filter(
    (l) => l.classList.contains("de-serie") === serie,
  );
  const k = fileira.indexOf(el);
  const esq = fileira[k - 1];
  const dir = fileira[k + 1];
  if (!esq || !dir || dir.classList.contains("inclinada") || dir.dataset.tombado !== undefined) return null;
  if (foraDaPrateleira(esq) || foraDaPrateleira(dir)) return null;
  // Medidas do layout (sem as transformações): o vão é o lugar do livro que saiu, com as duas folgas.
  const vao = dir.offsetLeft - (esq.offsetLeft + esq.offsetWidth);
  let th = Math.asin(Math.min(1, vao / dir.offsetHeight));
  if (dir.offsetHeight * Math.cos(th) > esq.offsetHeight) th = Math.atan(vao / esq.offsetHeight);
  return { el: dir, graus: (th * 180) / Math.PI };
}

/** O vizinho tomba: começa devagar e acelera, como queda; bate, volta um nada e assenta. */
export function tombar(gsap: GSAP, t: Tombado | null, dur: number, direto = false) {
  if (!t) return;
  t.el.dataset.tombado = "";
  gsap.killTweensOf(t.el, "rotation,rotationX");
  gsap.set(t.el, { transformOrigin: "0% 100%", ...EM_3D });
  if (direto) return void gsap.set(t.el, { rotation: -t.graus, rotationX: 0 });
  gsap
    .timeline()
    .to(t.el, { rotation: -t.graus, rotationX: 0, duration: 0.46 * dur, ease: "power2.in" }, 0.12)
    .to(t.el, { rotation: -t.graus + 0.7, duration: 0.06, ease: "power1.out" })
    .to(t.el, { rotation: -t.graus, duration: 0.12, ease: "power1.in" });
}

/** Empurrado de volta pelo livro que entra, o vizinho sai do encosto e para em pé, sem quicar. */
export function endireitar(gsap: GSAP, t: Tombado | null, dur: number, direto = false) {
  if (!t) return;
  delete t.el.dataset.tombado;
  gsap.killTweensOf(t.el, "rotation");
  gsap.set(t.el, EM_3D);
  const emPe = () => gsap.set(t.el, { transformOrigin: "50% 100%" });
  if (direto) {
    gsap.set(t.el, { rotation: 0 });
    return emPe();
  }
  gsap.to(t.el, { rotation: 0, duration: 0.3 * dur, ease: "power2.out", onComplete: emPe });
}
