/**
 * A resposta que se perde (post da cobrança duplicada, seção 1). O app manda o pedido de R$ 250 e o
 * relógio dele começa a correr; o serviço captura no adquirente, a moeda cai na fatura do cliente e a
 * confirmação volta ao serviço. A resposta 201 sai para o app, tropeça no meio do caminho e cai: o X
 * vermelho marca o ponto, e o resto do caminho fica tracejado, o que não aconteceu. O relógio fecha a
 * volta (timeout), o app não sabe se cobrou e envia de novo pela curva de baixo; o serviço captura outra
 * vez, a segunda moeda cai, a segunda linha da fatura sai em vermelho e o carimbo "cobrado duas vezes"
 * desce. Nada do que foi escrito some: o quadro final (resposta-perdida.svg) mostra tudo.
 */
import type { GSAP } from "../../scripts/gsap";

export default function montar(gsap: GSAP, svg: SVGSVGElement) {
  const parte = (nome: string) => svg.querySelector<SVGElement>(`[data-parte="${nome}"]`)!;
  const [pedido1, captura1, capturada, moeda1, resposta, pedido2, captura2, moeda2] = [
    "pedido-1",
    "captura-1",
    "capturada",
    "moeda-1",
    "resposta",
    "pedido-2",
    "captura-2",
    "moeda-2",
  ].map(parte);
  const envelopes = [pedido1, captura1, capturada, moeda1, resposta, pedido2, captura2, moeda2];
  const ponteiro = parte("ponteiro");
  const arco = parte("arco");
  const xis = [parte("x-1"), parte("x-2")];
  const reenvio = parte("reenvio");
  const ponta = parte("reenvio-ponta");
  const carimbo = parte("carimbo");
  const tampaFantasma = parte("tampa-fantasma");
  const tampas = ["tampa-perde", "tampa-timeout", "tampa-duvida", "tampa-reenvio", "tampa-l1", "tampa-l2"].map(parte);
  const [tampaPerde, tampaTimeout, tampaDuvida, tampaReenvio, tampaL1, tampaL2] = tampas;

  // Escrever: a tampa, da cor do painel, encolhe para a direita e descobre o texto da esquerda para a
  // direita, como a mão escrevendo.
  const escrever = (tampa: SVGElement, duracao: number) =>
    gsap
      .timeline()
      .fromTo(tampa, { opacity: 1, scaleX: 1, transformOrigin: "100% 50%" }, { scaleX: 0, duration: duracao, ease: "none" })
      .set(tampa, { opacity: 0 });

  // Um envelope que aparece, anda pela seta e some dentro da caixa de destino.
  const levar = (envelope: SVGElement, dx: number, inicio: number, duracao = 0.9) =>
    gsap
      .timeline()
      .fromTo(envelope, { x: 0, y: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, inicio)
      .to(envelope, { x: dx, duration: duracao, ease: "power1.inOut" }, inicio + 0.15)
      .to(envelope, { opacity: 0, duration: 0.18 }, inicio + 0.15 + duracao);

  // A moeda da captura cai do adquirente na fatura.
  const cair = (moeda: SVGElement, inicio: number) =>
    gsap
      .timeline()
      .fromTo(moeda, { y: 0, opacity: 0 }, { opacity: 1, duration: 0.12 }, inicio)
      .to(moeda, { y: 48, duration: 0.5, ease: "power2.in" }, inicio + 0.08)
      .to(moeda, { opacity: 0, duration: 0.14 }, inicio + 0.5);

  const tl = gsap.timeline({ paused: true });
  tl.set(tampas, { opacity: 1, scaleX: 1, transformOrigin: "100% 50%" })
    .set(tampaFantasma, { opacity: 1 })
    .set(envelopes, { x: 0, y: 0, rotation: 0, opacity: 0, transformOrigin: "50% 50%" })
    // O traço que se desenha: o tracejado "1 2" (e não "1") não deixa a ponta redonda aparecer como um
    // ponto antes da hora, e o autoRound desligado deixa o GSAP andar em frações (senão ele arredonda o
    // px e o traço pula de inteiro para vazio no meio da tween).
    .set([...xis, arco, reenvio], { strokeDasharray: "1 2", strokeDashoffset: 1 })
    .set(ponteiro, { rotation: 0, svgOrigin: "150 268" })
    .set(arco, { scale: 1, svgOrigin: "150 268" })
    .set(ponta, { opacity: 0 })
    .set(carimbo, { opacity: 0, scale: 1, svgOrigin: "1075 372" });

  // 1. O app pede a cobrança, e o relógio dele começa a correr (o timeout chega quando a volta fecha).
  tl.add(levar(pedido1, 140, 0.3), 0)
    .to(ponteiro, { rotation: 360, svgOrigin: "150 268", duration: 5.6, ease: "none" }, 0.4)
    .to(arco, { strokeDashoffset: 0, duration: 5.6, ease: "none", autoRound: false }, 0.4);

  // 2. O serviço captura no adquirente; a moeda cai na fatura e a primeira linha é escrita. A
  //    confirmação volta ao serviço.
  tl.add(levar(captura1, 128, 1.8), 0)
    .add(cair(moeda1, 3.05), 0)
    .add(escrever(tampaL1, 0.6), 3.65)
    .add(levar(capturada, -128, 3.4, 0.85), 0);

  // 3. A resposta 201 sai para o app e se perde no meio do caminho: tropeça, cai e some. O X marca o
  //    ponto, e o resto do caminho aparece tracejado, o que não aconteceu.
  tl.fromTo(resposta, { x: 0, y: 0, rotation: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 4.4)
    .to(resposta, { x: -52, duration: 0.5, ease: "none" }, 4.55)
    .to(resposta, { rotation: -14, duration: 0.12, ease: "power1.out" }, 5.05)
    .to(resposta, { x: -70, y: 92, rotation: -38, opacity: 0, duration: 0.65, ease: "power2.in" }, 5.17)
    .to(xis[0], { strokeDashoffset: 0, duration: 0.18, ease: "power1.in", autoRound: false }, 5.1)
    .to(xis[1], { strokeDashoffset: 0, duration: 0.18, ease: "power1.in", autoRound: false }, 5.3)
    .to(tampaFantasma, { opacity: 0, duration: 0.45 }, 5.35)
    .add(escrever(tampaPerde, 0.6), 5.5);

  // 4. A volta do relógio fecha, e o anel dá um pulso: timeout. O app não sabe se cobrou.
  tl.to(arco, { scale: 1.12, svgOrigin: "150 268", duration: 0.14, ease: "power1.out", yoyo: true, repeat: 1 }, 6.0)
    .add(escrever(tampaTimeout, 0.4), 6.05)
    .add(escrever(tampaDuvida, 0.55), 6.55);

  // 5. Sem saber, o app envia de novo: o envelope corre pela curva enquanto ela se desenha.
  tl.to(reenvio, { strokeDashoffset: 0, duration: 1.1, ease: "none", autoRound: false }, 7.35)
    .fromTo(pedido2, { x: 0, y: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 7.3)
    .to(
      pedido2,
      {
        keyframes: [
          { x: 90, y: 2, duration: 0.24 },
          { x: 183, y: 1, duration: 0.25 },
          { x: 268, y: -10, duration: 0.23 },
          { x: 333, y: -40, duration: 0.19 },
          { x: 355, y: -63, duration: 0.09 },
          { x: 368, y: -94, duration: 0.1 },
        ],
        ease: "none",
      },
      7.35,
    )
    .to(ponta, { opacity: 1, duration: 0.12 }, 8.4)
    .to(pedido2, { y: -106, opacity: 0, duration: 0.2 }, 8.45)
    .add(escrever(tampaReenvio, 0.7), 7.8);

  // 6. O serviço captura outra vez; a segunda moeda cai e a segunda linha sai em vermelho.
  tl.add(levar(captura2, 128, 8.65), 0)
    .add(cair(moeda2, 9.85), 0)
    .add(escrever(tampaL2, 0.6), 10.45);

  // 7. O carimbo desce: o cliente foi cobrado duas vezes.
  tl.fromTo(
    carimbo,
    { opacity: 0, scale: 1.35, svgOrigin: "1075 372" },
    { opacity: 1, scale: 1, svgOrigin: "1075 372", duration: 0.35, ease: "power3.in" },
    11.2,
  );
  return tl;
}
