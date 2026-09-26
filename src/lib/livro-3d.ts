/**
 * Medidas do livro 3D (D30, D40), usadas pela gaveta, pela página do livro e pelo livro ampliado. A
 * capa tem a proporção da referência (480 × 720) e a espessura é a largura da lombada em livros.json,
 * na mesma escala. Parado, o livro fica a GIRO graus da frente, de lado, com a lombada bem à vista,
 * como na gaveta da home (D43; em todo o site desde 26/09/2026, D46), girando em volta do próprio
 * centro (Livro3D.astro).
 */
export const GIRO = 38;

export function medidasDoLivro3D(larguraDaLombada: number, altura: number) {
  const u = altura / 720;
  return {
    u,
    bh: altura,
    cw: Math.round(480 * u),
    sw: Math.round(larguraDaLombada * u),
  };
}
