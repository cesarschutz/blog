/**
 * Medidas do livro 3D (D30), usadas pela gaveta (no navegador) e pela página do livro (no build).
 * A capa tem a proporção da referência (480 × 720) e a lombada, a largura dela em livros.json, na
 * mesma escala. Aberto, o livro fica quase de frente (GIRO graus a partir da lombada), com só uma
 * faixa da lombada à vista, e o que se vê fica no centro da caixa.
 */
// 72° (D39): a capa fica a 18° da frente e a lombada vira só uma faixa. Antes, 52° (D33).
export const GIRO = 72;

export function medidasDoLivro3D(larguraDaLombada: number, altura: number) {
  const u = altura / 720;
  const cw = Math.round(480 * u);
  const sw = Math.round(larguraDaLombada * u);
  const rad = (GIRO * Math.PI) / 180;
  // Girando em volta da borda direita da lombada, a lombada ocupa sw·cos e a capa cw·sen.
  const visivel = sw * Math.cos(rad) + cw * Math.sin(rad);
  return {
    u,
    bh: altura,
    cw,
    sw,
    x0: (cw - sw) / 2,
    x1: (cw - visivel) / 2 - sw + sw * Math.cos(rad),
  };
}
