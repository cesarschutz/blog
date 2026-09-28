/**
 * O gesto de copiar (D49, protótipo E3; o visual em copiado.css): o botão ganha `.copiado` (o decalque
 * e o visto) e o rótulo rola letra por letra até o texto novo, com a largura acompanhando; depois de
 * 1,6s, tudo volta. O Copiar do código (artigo.ts) e o "Copiar link" (RodapeArtigo.astro) usam o mesmo
 * gesto, para o site ter um jeito só de dizer "copiado". Com movimento reduzido, o texto troca seco.
 */
import "../styles/copiado.css";

const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
const voltas = new WeakMap<HTMLElement, number>();
const limpezas = new WeakMap<HTMLElement, number>();

/** O texto em letras soltas (o espaço fica duro: numa letra sozinha, ele sumiria). */
function emLetras(el: HTMLElement, texto: string) {
  el.replaceChildren(
    ...[...texto].map((c, i) => {
      const letra = document.createElement("span");
      letra.className = "letra";
      letra.style.setProperty("--i", String(i));
      letra.textContent = c === " " ? "\u00a0" : c;
      return letra;
    }),
  );
}

/** Leva o rótulo ao texto novo: o velho sobe e some, o novo sobe de baixo, e a largura acompanha. */
function rolarRotulo(rotulo: HTMLElement, texto: string) {
  if ((rotulo.dataset.texto ?? rotulo.textContent) === texto) return;
  rotulo.dataset.texto = texto;
  const antes = rotulo.getBoundingClientRect().width;
  rotulo.getAnimations().forEach((a) => a.cancel());
  clearTimeout(limpezas.get(rotulo));
  rotulo.querySelectorAll(".saindo").forEach((s) => s.remove());
  const atual = rotulo.firstElementChild as HTMLElement | null;
  const novo = texto ? document.createElement("span") : null;
  if (reduzir.matches) {
    atual?.remove();
    if (novo) {
      novo.textContent = texto;
      rotulo.append(novo);
    }
    return;
  }
  if (atual) {
    if (!atual.querySelector(".letra")) emLetras(atual, atual.textContent ?? "");
    atual.classList.remove("entrando");
    atual.classList.add("saindo");
  }
  if (novo) {
    emLetras(novo, texto);
    novo.classList.add("entrando");
    rotulo.append(novo);
  }
  const depois = novo ? novo.getBoundingClientRect().width : 0;
  const largura = rotulo.animate([{ width: `${antes}px` }, { width: `${depois}px` }], {
    duration: 350,
    easing: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    fill: "forwards",
  });
  // Quando as letras chegam, o texto volta a ser um só (as letras soltas perdem o kerning).
  limpezas.set(
    rotulo,
    window.setTimeout(() => {
      atual?.remove();
      if (novo) {
        novo.removeAttribute("class");
        novo.textContent = texto;
      }
      largura.cancel();
    }, Math.max(350, 400 + texto.length * 12)),
  );
}

/**
 * O botão diz "copiado" (ou, com `ok` falso, só mostra o texto, sem o visto) e volta ao repouso
 * depois de 1,6s. Chamar de novo nesse meio-tempo só adia a volta.
 */
export function mostrarCopiado(botao: HTMLElement, texto: string, repouso: string, ok = true) {
  const rotulo = botao.querySelector<HTMLElement>(".rotulo-rola");
  botao.classList.toggle("copiado", ok);
  if (rotulo) rolarRotulo(rotulo, texto);
  clearTimeout(voltas.get(botao));
  voltas.set(
    botao,
    window.setTimeout(() => {
      botao.classList.remove("copiado");
      if (rotulo) rolarRotulo(rotulo, repouso);
    }, 1600),
  );
}
