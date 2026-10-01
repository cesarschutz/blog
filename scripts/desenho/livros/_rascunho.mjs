/** Livro ainda sem desenho (só na página de comparação, /amostra/colecoes/): um lápis deitado. */
export default {
  instrumento: "lápis (livro ainda sem desenho)",
  desenho({ t, linha, poli, retangulo, mover, chao }) {
    const g = { giro: -18, centro: [240, 560] };
    t(mover(retangulo(150, 545, 170, 30, 2), g), { papel: true });
    t(mover(poli([[320, 545], [362, 560], [320, 575]], true), g), { papel: true });
    t(mover(poli([[350, 556], [362, 560], [350, 564]], true), g), { w: 2 });
    t(mover(retangulo(126, 545, 24, 30, 6), g), { papel: true });
    t(mover(linha([150, 560], [320, 560]), g), { w: 2 });
    chao(150, 340, 640, { altura: 5 });
  },
};
