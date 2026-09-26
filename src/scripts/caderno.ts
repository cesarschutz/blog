/**
 * O caderno marcado (D41; como a versão A do protótipo docs/prototipos/caderno-marcado.html): cada
 * marcação do artigo (src/plugins/marcacoes.mjs) acontece uma vez, quando o trecho entra na tela,
 * com o topo dele a 80% da altura, e fica: rolar de volta não apaga. A página sempre abre limpa
 * (atualizar ou entrar de novo recomeça), e o que já passou do ponto é marcado ao abrir.
 *
 * A pintura do marca-texto e do termo é uma camada de fundo própria (`background-image`), animada pelo
 * `background-size`; os traços da caneta (sublinhado, círculo, colchete), pelo DrawSVG. Sem JS, com
 * movimento reduzido ou na impressão, tudo aparece já marcado. O GSAP, o ScrollTrigger e o DrawSVG
 * começam a baixar quando a primeira marcação está a uma tela e meia de aparecer.
 */
import { carregarRolagem, movimentoReduzido } from "./gsap";

type Rolagem = Awaited<ReturnType<typeof carregarRolagem>>;

const MARCA = 0.8;

function animacao({ gsap }: Rolagem, el: HTMLElement) {
  const tipo = el.dataset.marcacao;
  if (tipo === "marca")
    return gsap.fromTo(el, { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.8, ease: "power2.inOut", paused: true });
  if (tipo === "termos")
    return gsap.fromTo(
      el.querySelectorAll(".termo"),
      { backgroundSize: "0% 100%" },
      { backgroundSize: "100% 100%", duration: 0.45, stagger: 0.12, ease: "power2.out", paused: true },
    );
  const traco = el.querySelector(":scope > svg path");
  return gsap.fromTo(traco, { drawSVG: "0%" }, { drawSVG: "100%", duration: tipo === "circulo" ? 0.9 : 0.6, ease: "power1.inOut", paused: true });
}

function ligar(rolagem: Rolagem, alvos: HTMLElement[]) {
  const { ScrollTrigger } = rolagem;
  for (const el of alvos) {
    const anim = animacao(rolagem, el);
    // Tudo começa em branco; o que já passou do ponto (a página abriu no meio do artigo) marca na hora.
    anim.progress(0);
    ScrollTrigger.create({ trigger: el, start: `top ${MARCA * 100}%`, once: true, onEnter: () => anim.play() });
  }
}

export function cadernoMarcado() {
  const alvos = [...document.querySelectorAll<HTMLElement>(".prose [data-marcacao]")];
  if (!alvos.length || movimentoReduzido.matches) return;
  const perto = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      perto.disconnect();
      carregarRolagem().then((r) => ligar(r, alvos));
    },
    { rootMargin: "0px 0px 150% 0px" },
  );
  alvos.forEach((el) => perto.observe(el));
}
