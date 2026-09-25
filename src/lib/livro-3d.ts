/**
 * Medidas do livro 3D (D30, D40), usadas pela gaveta, pela página do livro e pelo livro ampliado. A
 * capa tem a proporção da referência (480 × 720) e a espessura é a largura da lombada em livros.json,
 * na mesma escala. Parado, o livro fica a GIRO graus da frente (a capa quase de frente, com só uma
 * faixa da lombada à vista, D39), girando em volta do próprio centro (Livro3D.astro).
 */
export const GIRO = 18;

export function medidasDoLivro3D(larguraDaLombada: number, altura: number) {
  const u = altura / 720;
  return {
    u,
    bh: altura,
    cw: Math.round(480 * u),
    sw: Math.round(larguraDaLombada * u),
  };
}
