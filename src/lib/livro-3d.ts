/**
 * Medidas do livro 3D (D30), usadas pela gaveta (no navegador) e pela página do livro (no build).
 * A capa tem a proporção da referência (480 × 720) e a lombada, a largura dela em livros.json, na
 * mesma escala. Aberto, o livro fica em três quartos (GIRO graus), com a lombada e a capa à vista, e
 * o que se vê fica no centro da caixa.
 */
// 52°, e não mais 62° (D33): a lombada aparece mais larga e o título dela fica legível.
export const GIRO = 52;

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
