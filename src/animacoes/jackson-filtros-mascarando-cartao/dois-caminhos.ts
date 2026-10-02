/**
 * Os dois caminhos até o log (post do Jackson, seção 7). Primeiro, pelo toString(): o cartão vai direto
 * ao log, sem passar pelo filtro, e o número e o CVV são escritos inteiros; depois de um tempo para ler,
 * as duas linhas são riscadas. Depois, pelo logJson.toJson(): o cartão atravessa o MascaraCartaoFilter,
 * ganha a fita no meio do número, o CVV cai e fica para trás, e o log recebe a linha mascarada, escrita
 * embaixo. Nada do que foi escrito some: o quadro final (dois-caminhos.svg) mostra as duas linhas.
 */
import type { GSAP } from "../../scripts/gsap";

export default function montar(gsap: GSAP, svg: SVGSVGElement) {
  const parte = (nome: string) => svg.querySelector<SVGElement>(`[data-parte="${nome}"]`)!;
  const cartao1 = parte("cartao-1");
  const cartao2 = parte("cartao-2");
  const fita = parte("fita");
  const cvv = parte("cvv");
  const riscos = [parte("risco-1"), parte("risco-2")];
  const tampas = ["tampa-l1", "tampa-l1b", "tampa-l2", "tampa-l2b"].map(parte);
  const [tampaL1, tampaL1b, tampaL2, tampaL2b] = tampas;

  // Escrever: a tampa, da cor da folha, encolhe para a direita e descobre o texto da esquerda para a
  // direita, como a mão escrevendo.
  const escrever = (tampa: SVGElement, duracao: number) =>
    gsap
      .timeline()
      .fromTo(tampa, { opacity: 1, scaleX: 1, transformOrigin: "100% 50%" }, { scaleX: 0, duration: duracao, ease: "none" })
      .set(tampa, { opacity: 0 });

  const tl = gsap.timeline({ paused: true });
  tl.set(tampas, { opacity: 1, scaleX: 1, transformOrigin: "100% 50%" })
    .set(riscos, { strokeDasharray: 1, strokeDashoffset: 1 })
    .set([cartao1, cartao2], { x: 0, y: 0, opacity: 0 })
    .set(fita, { scaleX: 0, transformOrigin: "0% 50%" })
    .set(cvv, { x: 0, y: 0, opacity: 1 });

  // 1. Pelo toString(): o cartão, com o CVV, vai direto ao log.
  tl.to(cartao1, { opacity: 1, duration: 0.25 }, 0.3)
    .to(
      cartao1,
      {
        keyframes: [
          { x: 80, y: -14, duration: 0.35 },
          { x: 180, y: -64, duration: 0.45 },
          { x: 340, y: -66, duration: 0.55 },
          { x: 440, y: -66, duration: 0.35 },
        ],
        ease: "none",
      },
      0.6,
    )
    .to(cartao1, { opacity: 0, duration: 0.2 }, 2.25)
    .add(escrever(tampaL1, 0.8), 2.35)
    .add(escrever(tampaL1b, 0.4), 3.2);

  // Um tempo para ler, e as duas linhas são riscadas: é o que não pode chegar ao log.
  // autoRound desligado: com pathLength="1", o GSAP arredondaria o dashoffset para 1 ou 0 e o risco
  // apareceria de uma vez, em vez de se desenhar.
  tl.to(riscos[0], { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut", autoRound: false }, 4.7).to(
    riscos[1],
    { strokeDashoffset: 0, duration: 0.4, ease: "power1.inOut", autoRound: false },
    5.3,
  );

  // 2. Pelo logJson.toJson(): o cartão atravessa o filtro, ganha a fita no número e perde o CVV.
  tl.to(cartao2, { opacity: 1, duration: 0.25 }, 6.1)
    .to(
      cartao2,
      {
        keyframes: [
          { x: 50, y: 12, duration: 0.4 },
          { x: 90, y: 20, duration: 0.35 },
          { x: 255, y: 20, duration: 0.7 },
        ],
        ease: "none",
      },
      6.35,
    )
    .to(fita, { scaleX: 1, duration: 0.5, ease: "power1.out" }, 7.85)
    .to(cvv, { y: 44, opacity: 0, duration: 0.7, ease: "power1.in" }, 8.1)
    .to(
      cartao2,
      {
        keyframes: [
          { x: 420, y: 20, duration: 0.7 },
          { x: 452, y: 48, duration: 0.3 },
          { x: 470, y: 60, duration: 0.2 },
        ],
        ease: "none",
      },
      8.6,
    )
    .to(cartao2, { opacity: 0, duration: 0.2 }, 9.7)
    .add(escrever(tampaL2, 0.8), 9.8)
    .add(escrever(tampaL2b, 0.45), 10.65);
  return tl;
}
