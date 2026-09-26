/**
 * A caneta do caderno (D48): as marcações são estáticas e já vêm prontas do Markdown (sem JS, tudo
 * aparece). Este script só decide o lugar das notas escritas acima da palavra (nota na margem e
 * riscado com correção): se a nota passaria da margem direita do texto, ela vai logo depois da
 * palavra, na mesma letra. No celular (≤ 640px) o CSS já as põe depois. Mede de novo quando a largura
 * do texto muda e quando a letra à mão termina de carregar.
 */
export function canetaNoLugar() {
  const prosa = document.querySelector<HTMLElement>(".prose");
  const notas = [...document.querySelectorAll<HTMLElement>(".prose :is(.caneta-nota, .caneta-riscado.com-correcao)")];
  if (!prosa || !notas.length) return;
  let largura = -1;
  const medir = () => {
    for (const nota of notas) delete nota.dataset.lugar;
    const direita = prosa.getBoundingClientRect().right;
    for (const nota of notas) {
      const escrita = nota.querySelector<HTMLElement>(".caneta-escrita");
      if (!escrita || getComputedStyle(escrita).position !== "absolute") continue;
      if (escrita.getBoundingClientRect().right > direita + 2) nota.dataset.lugar = "depois";
    }
  };
  new ResizeObserver(([entrada]) => {
    const agora = Math.round(entrada.contentRect.width);
    if (agora === largura) return;
    largura = agora;
    medir();
  }).observe(prosa);
  document.fonts?.ready.then(medir);
}
