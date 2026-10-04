/**
 * Detectar ou evitar (post de bloqueio otimista e pessimista, seção 1): as transações A (azul) e B
 * (âmbar) querem debitar a mesma conta (a linha, em roxo), primeiro no otimista, depois no pessimista.
 *
 * Otimista: A e B leem a linha e levam a version 1; A grava, e a linha passa a saldo 90, version 2
 * (UPDATE 1); o UPDATE de B, filtrado pela version 1, bate na linha e volta (UPDATE 0): a version 1
 * de B é riscada, B relê a version 2 e grava, e a linha passa a saldo 80, version 3.
 *
 * Pessimista: A pede a linha com FOR UPDATE e a trava azul fecha; B pede a mesma linha e para no meio
 * do caminho, com o relógio vermelho andando (espera a trava, sem erro); A grava o saldo 90 e faz
 * COMMIT, e a trava azul abre; o pedido de B segue, a trava âmbar fecha, B lê o saldo 90 e grava 80.
 *
 * Nada do que foi escrito some: o valor velho é riscado e o novo vem embaixo. O quadro final
 * (detectar-ou-evitar.svg) mostra as duas histórias inteiras.
 */
import type { GSAP } from "../../scripts/gsap";

export default function montar(gsap: GSAP, svg: SVGSVGElement) {
  const partes = (nome: string) => [...svg.querySelectorAll<SVGElement>(`[data-parte="${nome}"]`)];
  const parte = (nome: string) => partes(nome)[0];

  const leA = parte("le-a");
  const leB1 = parte("le-b1");
  const leB2 = parte("le-b2");
  const envioA = parte("envio-a");
  const envioB = parte("envio-b");
  const envioPA = parte("envio-pa");
  const envioPB = parte("envio-pb");
  const recusa = parte("recusa");
  const relogio = parte("relogio");
  const ponteiro = parte("ponteiro");
  const travaA = parte("trava-a");
  const travaB = parte("trava-b");
  const argolaA = parte("argola-a");
  const argolaB = parte("argola-b");

  // O que é desenhado pelo traço: os riscos e as marcas de certo e errado.
  const tracos = ["risca-o1", "risca-o2", "risca-p1", "risca-p2", "risca-b1", "certo-a", "certo-b", "certo-pa", "certo-pb", "errado-b"];
  const tampas = [
    "tampa-o90",
    "tampa-o80",
    "tampa-p90",
    "tampa-p80",
    "tampa-a-ok",
    "tampa-pa-trava",
    "tampa-pa-commit",
    "tampa-b-zero",
    "tampa-b-ok",
    "tampa-pb-trava",
    "tampa-pb-espera",
    "tampa-pb-le",
  ];

  const tl = gsap.timeline({ paused: true });

  // Escrever: a tampa, da cor do fundo da caixa, encolhe para a direita e descobre o texto da esquerda
  // para a direita, como a mão escrevendo.
  const escrever = (nome: string, duracao: number) =>
    gsap
      .timeline()
      .fromTo(partes(nome), { opacity: 1, scaleX: 1, transformOrigin: "100% 50%" }, { scaleX: 0, duration: duracao, ease: "none" })
      .set(partes(nome), { opacity: 0 });
  // Desenhar um traço (risco, certo, errado) do começo ao fim.
  const desenhar = (nome: string, duracao: number, quando: number) =>
    tl.to(partes(nome), { strokeDashoffset: 0, duration: duracao, ease: "power1.inOut" }, quando);

  tl.set(tampas.flatMap(partes), { opacity: 1, scaleX: 1, transformOrigin: "100% 50%" })
    .set(tracos.flatMap(partes), { strokeDasharray: 1, strokeDashoffset: 1 })
    .set(leA, { x: 232, opacity: 0 })
    .set([leB1, leB2], { x: -200, opacity: 0 })
    .set([envioA, envioB, envioPA, envioPB], { x: 0, y: 0, rotation: 0, opacity: 0 })
    .set(recusa, { scale: 0, transformOrigin: "50% 50%" })
    .set(relogio, { scale: 0, transformOrigin: "50% 50%" })
    .set(ponteiro, { rotation: 0, svgOrigin: "842 404" })
    .set([travaA, travaB], { opacity: 0 })
    .set(argolaA, { y: 0 })
    .set(argolaB, { y: -9 });

  // ---------- Otimista ----------

  // 1. A e B leem a linha: cada uma leva a version 1.
  tl.to([leA, leB1], { opacity: 1, duration: 0.2 }, 0.2).to([leA, leB1], { x: 0, duration: 0.75, ease: "power2.out" }, 0.2);

  // 2. A grava com WHERE version = 1: a linha passa a saldo 90, version 2, e A recebe UPDATE 1.
  tl.to(envioA, { opacity: 1, duration: 0.12 }, 1.15)
    .to(envioA, { x: 112, duration: 0.5, ease: "power1.inOut" }, 1.15)
    .to(envioA, { opacity: 0, duration: 0.12 }, 1.62);
  desenhar("risca-o1", 0.25, 1.68);
  tl.add(escrever("tampa-o90", 0.35), 1.93).add(escrever("tampa-a-ok", 0.4), 1.98);
  desenhar("certo-a", 0.2, 2.4);

  // 3. B grava com WHERE version = 1, mas a linha já está na version 2: o pedido bate e volta,
  //    a version 1 de B é riscada, e B recebe UPDATE 0.
  tl.to(envioB, { opacity: 1, duration: 0.12 }, 2.75)
    .to(envioB, { x: -112, duration: 0.5, ease: "power1.in" }, 2.75)
    .to(recusa, { scale: 1, duration: 0.25, ease: "back.out(2.2)" }, 3.25)
    .to(envioB, { x: -64, y: 40, rotation: -32, duration: 0.5, ease: "power2.out" }, 3.25)
    .to(envioB, { opacity: 0, duration: 0.2 }, 3.55);
  desenhar("risca-b1", 0.25, 3.4);
  tl.add(escrever("tampa-b-zero", 0.4), 3.6);
  desenhar("errado-b", 0.2, 4.0);

  // 4. B relê (version 2) e grava de novo: a linha passa a saldo 80, version 3, e B recebe UPDATE 1.
  tl.to(leB2, { opacity: 1, duration: 0.2 }, 4.3)
    .to(leB2, { x: 0, duration: 0.65, ease: "power2.out" }, 4.3)
    .set(envioB, { x: 0, y: 0, rotation: 0 }, 5.0)
    .to(envioB, { opacity: 1, duration: 0.12 }, 5.0)
    .to(envioB, { x: -112, duration: 0.45, ease: "power1.inOut" }, 5.0)
    .to(envioB, { opacity: 0, duration: 0.12 }, 5.43);
  desenhar("risca-o2", 0.25, 5.48);
  tl.add(escrever("tampa-o80", 0.35), 5.73).add(escrever("tampa-b-ok", 0.4), 5.78);
  desenhar("certo-b", 0.2, 6.2);

  // ---------- Pessimista ----------

  // 1. A pede a linha com FOR UPDATE, e a trava azul fecha.
  tl.add(escrever("tampa-pa-trava", 0.4), 6.6)
    .to(envioPA, { opacity: 1, duration: 0.12 }, 6.8)
    .to(envioPA, { x: 112, duration: 0.45, ease: "power1.inOut" }, 6.8)
    .to(envioPA, { opacity: 0, duration: 0.12 }, 7.2)
    .to(travaA, { opacity: 1, duration: 0.15 }, 7.15)
    .to(argolaA, { y: 9, duration: 0.25, ease: "power2.in" }, 7.3);

  // 2. B pede a mesma linha e para no meio do caminho: espera a trava, sem erro.
  tl.add(escrever("tampa-pb-trava", 0.4), 7.7)
    .to(envioPB, { opacity: 1, duration: 0.12 }, 7.9)
    .to(envioPB, { x: -54, duration: 0.4, ease: "power1.out" }, 7.9)
    .to(relogio, { scale: 1, duration: 0.25, ease: "back.out(2.2)" }, 8.3)
    .add(escrever("tampa-pb-espera", 0.4), 8.35)
    .to(ponteiro, { rotation: 720, duration: 1.6, ease: "none" }, 8.5);

  // 3. A grava o saldo 90 e faz COMMIT: a trava azul abre.
  desenhar("risca-p1", 0.25, 8.9);
  tl.add(escrever("tampa-p90", 0.35), 9.15).add(escrever("tampa-pa-commit", 0.35), 9.45);
  desenhar("certo-pa", 0.2, 9.8);
  tl.to(argolaA, { y: 0, duration: 0.3, ease: "power2.out" }, 9.85);

  // 4. A vez de B: o pedido segue, a trava âmbar fecha, B lê o saldo 90, já atualizado, e grava 80.
  tl.to(envioPB, { x: -112, duration: 0.35, ease: "power1.in" }, 10.15)
    .to(envioPB, { opacity: 0, duration: 0.12 }, 10.45)
    .to(travaB, { opacity: 1, duration: 0.15 }, 10.4)
    .to(argolaB, { y: 0, duration: 0.25, ease: "power2.in" }, 10.5)
    .add(escrever("tampa-pb-le", 0.4), 10.8);
  desenhar("certo-pb", 0.2, 11.2);
  desenhar("risca-p2", 0.25, 11.4);
  tl.add(escrever("tampa-p80", 0.35), 11.65);
  return tl;
}
