/**
 * A capa viva (capa-viva.css): o detalhe do tipo evento (balança, pulsa, pisca, sobe, treme, escreve,
 * enche) vai até o fim mesmo que o mouse saia no meio; sem isto, tirar o mouse cortava o movimento e o
 * desenho pulava de volta. A classe fica 1,4 s (o evento mais longo dura 1,3 s). Os de estado (gira,
 * desliza) não precisam: a volta deles é a transição do CSS.
 */
const EVENTOS = ".mexe-balanca, .mexe-pulsa, .mexe-pisca, .mexe-sobe, .mexe-treme, .mexe-escreve, .mexe-enche";

for (const alvo of document.querySelectorAll<HTMLElement>(".cartao, .item.completo, [data-desenhar-topo]")) {
  if (!alvo.querySelector(EVENTOS)) continue;
  alvo.addEventListener("pointerenter", () => {
    if (alvo.classList.contains("mexendo")) return;
    alvo.classList.add("mexendo");
    setTimeout(() => alvo.classList.remove("mexendo"), 1400);
  });
}
