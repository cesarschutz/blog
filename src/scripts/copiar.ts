/**
 * O Copiar dos blocos de código (D41): o ícone do Expressive Code (uma máscara no `::after`) dá lugar
 * a um SVG de dois retângulos, e ao copiar o da frente vira um visto (MorphSVG, `back.out`) por 1,6s,
 * enquanto o próprio Expressive Code diz "Copiado". O MorphSVG só vem quando o leitor chega perto do
 * botão. Com movimento reduzido, o visto aparece e some sem se transformar.
 */
import { adiantar, carregarMorph, movimentoReduzido } from "./gsap";

const FRENTE = "M9 9h10v10H9z";
const VISTO = "M5 12.5l4.5 4.5L19 7";
const TRAS = "M5 15V5h10";

export function copiarVivo() {
  const botoes = [...document.querySelectorAll<HTMLButtonElement>(".expressive-code .copy button")];
  for (const botao of botoes) {
    botao.classList.add("com-icone");
    botao.insertAdjacentHTML(
      "beforeend",
      `<svg class="icone-copiar" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="tras" d="${TRAS}"/><path class="frente" d="${FRENTE}"/></svg>`,
    );
    const frente = botao.querySelector<SVGPathElement>(".frente")!;
    const tras = botao.querySelector<SVGPathElement>(".tras")!;
    let volta = 0;
    if (!movimentoReduzido.matches) adiantar(botao, carregarMorph, { ocioso: false });
    // O Expressive Code só mostra o "Copiado" (um `.feedback` no aviso ao lado) quando a cópia deu
    // certo, depois de esperar a área de transferência: o visto vai junto com ele.
    const aviso = botao.parentElement?.querySelector("[aria-live]");
    if (!aviso) continue;
    new MutationObserver(async (mudancas) => {
      if (!mudancas.some((m) => [...m.addedNodes].some((n) => (n as Element).classList?.contains("feedback")))) return;
      clearTimeout(volta);
      const gsap = movimentoReduzido.matches ? null : await carregarMorph().catch(() => null);
      if (gsap) {
        gsap.to(frente, { morphSVG: VISTO, duration: 0.35, ease: "back.out(2)" });
        gsap.to(tras, { opacity: 0, duration: 0.15 });
      } else {
        frente.setAttribute("d", VISTO);
        tras.style.opacity = "0";
      }
      volta = window.setTimeout(() => {
        if (gsap) {
          gsap.to(frente, { morphSVG: FRENTE, duration: 0.35, ease: "power2.inOut" });
          gsap.to(tras, { opacity: 1, duration: 0.2, clearProps: "opacity" });
        } else {
          frente.setAttribute("d", FRENTE);
          tras.style.opacity = "";
        }
      }, 1600);
    }).observe(aviso, { childList: true });
  }
}
