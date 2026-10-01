/**
 * Dados: o tabulador de Hollerith (1890), a máquina que apurou o censo dos EUA em seis meses em vez
 * de sete anos. Cada pessoa virou um cartão perfurado; a prensa de pinos fechava um circuito pelos
 * furos, os mostradores contavam e o separador abria a tampa do compartimento certo.
 *
 * Vista de 3/4 pela frente-direita, olho um pouco acima, em projeção oblíqua (o fundo foge para
 * cima e para a direita, como a caixa registradora). A luz vem do alto à esquerda: hachura nas faces
 * da direita e na sombra sob o tampo. Da esquerda para a direita: o gabinete de carvalho em forma
 * de escrivaninha (o tampo, as gavetas), sobre ele e atrás, à esquerda, o painel em pé com os
 * mostradores em grade de 4 × 5 (simplificação declarada dos 40 da máquina); na mesa, à direita, a
 * prensa de cartões: o leito com um cartão deitado (três fileiras de furos) e a caixa dos pinos
 * levantada numa dobradiça atrás, com o cabo de madeira na ponta; ao lado do gabinete, no chão, o
 * separador: uma caixa com fileiras de tampas, uma delas aberta. O fantasma é o cartão no ar,
 * caindo no compartimento aberto: o dado indo para a gaveta certa.
 *
 * No ícone ficam o gabinete, o painel (com uma grade de 3 × 4 mostradores grandes, só dele) e a
 * prensa levantada; o separador, as gavetas, os ponteiros, o cartão e os furos ficam de fora.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.5;
const B = 0.36;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;
/** p + v·s, em 3D. */
const soma = (p, v, s = 1) => [p[0] + v[0] * s, p[1] + v[1] * s, p[2] + v[2] * s];

export default {
  instrumento: "tabulador de Hollerith",
  titulo: "Dados",
  cor: "#624a72",
  desenho({ t, hachura, chao, ponto, cheio, linha, poli, circulo, retangulo, mover }) {
    /** Face plana por pontos 3D [x, y, z], fechada. */
    const face = (pontos) => poli(pontos.map(([x, y, z]) => P(x, y, z)), true);
    /** Aresta entre dois pontos 3D. */
    const aresta = (a, b) => linha(P(...a), P(...b));
    /**
     * Uma caixa vista de frente-direita e de cima: o lado direito (na sombra), o tampo e a frente,
     * nessa ordem, cada face tapando o que ficou atrás.
     */
    const caixa = (x0, x1, y0, y1, z0, z1, { icone, sombra = true, passo = 4.2, w = 1 } = {}) => {
      const lado = face([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]);
      t(lado, { w, papel: true, icone });
      if (sombra) hachura(lado, { angulo: 60, passo });
      t(face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]), { w, papel: true, icone });
      t(face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]), { w, papel: true, icone });
    };

    // ---------- medidas ----------
    const [X0, X1, D] = [58, 308, 96]; // o tampo: esquerda, direita e profundidade
    const [YT, ET, YB] = [556, 8, 668]; // o tampo (a frente, em cima), a espessura dele e o chão
    const RB = 4; // quanto o tampo sobra do corpo, na frente e dos lados

    // ---------- o gabinete: o corpo com as gavetas, a sombra sob o tampo, o tampo ----------
    caixa(X0 + RB, X1 - RB, YT + ET - 2, YB, RB, D);
    const [cx0, cx1, cy0] = [X0 + RB, X1 - RB, YT + ET];
    hachura(face([[cx0, cy0, RB], [cx1, cy0, RB], [cx1, cy0 + 7, RB], [cx0, cy0 + 7, RB]]), { angulo: 60, passo: 3 });
    // duas gavetas em cima (com os puxadores) e dois painéis de porta embaixo
    for (const [gx0, gx1] of [[cx0 + 8, 178], [186, cx1 - 8]]) {
      const g = face([[gx0, 574, RB], [gx1, 574, RB], [gx1, 598, RB], [gx0, 598, RB]]);
      t(g, { w: 2, icone: false });
      cheio(circulo(P((gx0 + gx1) / 2, 586, RB), 1.9), { icone: false }); // o puxador
      t(face([[gx0 + 3, 606, RB], [gx1 - 3, 606, RB], [gx1 - 3, 656, RB], [gx0 + 3, 656, RB]]), { w: 3 });
    }
    t(aresta([cx0 + 2, YB - 5, RB], [cx1 - 2, YB - 5, RB]), { w: 3 }); // o friso do rodapé
    caixa(X0, X1, YT, YT + ET, 0, D, { passo: 3.6 });

    // ---------- o painel dos mostradores, em pé sobre o tampo, atrás e à esquerda ----------
    const [PX0, PX1, PZ0, PZ1, PH] = [X0 + 1, 220, D - 16, D - 2, 136];
    const PY0 = YT - PH;
    caixa(PX0, PX1, PY0, YT, PZ0, PZ1);
    t(face([[PX0 + 5, PY0 + 5, PZ0], [PX1 - 5, PY0 + 5, PZ0], [PX1 - 5, YT - 5, PZ0], [PX0 + 5, YT - 5, PZ0]]), { w: 3 }); // a moldura
    // 4 × 5 mostradores, cada um com o seu ponteiro
    const angulos = [200, 250, 320, 20, 70, 110, 160, 230, 290, 340, 30, 80, 130, 210, 270, 330, 40, 100, 150, 240];
    for (let f = 0; f < 4; f++) {
      for (let c = 0; c < 5; c++) {
        const centro = [(PX0 + PX1) / 2 + (c - 2) * 31, PY0 + 21 + f * 30, PZ0];
        t(circulo(P(...centro), 11), { w: 2, papel: true, icone: false });
        const a = rad(angulos[f * 5 + c]);
        t(aresta(centro, soma(centro, [Math.cos(a), Math.sin(a), 0], 8.5)), { w: 2, icone: false });
      }
    }
    // No ícone, a grade é de 3 × 4 mostradores grandes: a 30px, vinte círculos viram pontinhos.
    for (let f = 0; f < 3; f++) {
      for (let c = 0; c < 4; c++) {
        t(circulo(P(PX0 + 20.25 + c * 40.5, PY0 + 22.7 + f * 45.3, PZ0), 17), { w: 1, soIcone: true });
      }
    }

    // ---------- a prensa de cartões, na mesa, à direita ----------
    const [LX0, LX1, LZ0, LZ1, LY] = [242, 306, 10, 80, YT - 10]; // o leito
    caixa(LX0, LX1, LY, YT, LZ0, LZ1, { passo: 3.4 });
    // o cartão deitado no leito, com três fileiras de furos
    t(face([[246, LY, 24], [302, LY, 24], [302, LY, 52], [246, LY, 52]]), { w: 2, papel: true, icone: false });
    const furos = (em) => {
      for (const [j, dz] of [7, 14, 21].entries()) for (let i = 0; i < 9; i++) t(circulo(em(249.5 + 6.1 * i, dz, j), 1.3), { w: 3 });
    };
    furos((x, dz) => P(x, LY, 24 + dz));
    // a caixa dos pinos, levantada na dobradiça de trás: a face dos pinos, a ponta e o lado direito
    const [teta, L, E] = [60, 70, 11]; // a abertura, o comprimento e a espessura
    const ao = [0, -Math.sin(rad(teta)), -Math.cos(rad(teta))]; // da dobradiça para a ponta
    const esp = [0, -Math.cos(rad(teta)), Math.sin(rad(teta))]; // a espessura, para fora
    const H0 = [LX0, LY, LZ1];
    const H1 = [LX1, LY, LZ1];
    const F0 = soma(H0, ao, L);
    const F1 = soma(H1, ao, L);
    const lado = face([H1, F1, soma(F1, esp, E), soma(H1, esp, E)]);
    t(lado, { papel: true });
    hachura(lado, { angulo: 60, passo: 3.4 });
    t(face([F0, F1, soma(F1, esp, E), soma(F0, esp, E)]), { papel: true }); // a ponta
    t(face([H0, H1, F1, F0]), { papel: true }); // a face dos pinos
    // os pinos, na mesma grade dos furos do cartão (é o que fecha o circuito pelos furos)
    furos((x, dz) => P(...soma([x, LY, LZ1], ao, L - 14 - dz)));
    t(aresta(H0, H1), { w: 2, icone: false }); // a dobradiça
    ponto(P(...H1), 1.8);
    // o cabo de madeira, na ponta, preso por dois estribos
    const meio = soma(soma(F0, [1, 0, 0], (LX1 - LX0) / 2), esp, E / 2);
    const cabo = P(...soma(meio, ao, 13));
    for (const dx of [-13, 13]) {
      const pe = soma(meio, [1, 0, 0], dx);
      t(aresta(pe, soma(pe, ao, 13)), { w: 2, icone: false });
    }
    t(retangulo(cabo[0] - 19, cabo[1] - 4, 38, 8, 4), { w: 2, papel: true });

    // ---------- o separador, no chão, à direita do gabinete ----------
    const [SX0, SX1, SZ0, SZ1, SY] = [318, 388, 6, 94, 612];
    caixa(SX0, SX1, SY, YB, SZ0, SZ1, { icone: false });
    const aberta = 1; // a tampa aberta (da frente para trás)
    for (let i = 0; i < 4; i++) {
      const [z0, z1] = [SZ0 + 2 + 21 * i, SZ0 + 21 + 21 * i];
      const tampa = face([[SX0 + 6, SY, z0], [SX1 - 6, SY, z0], [SX1 - 6, SY, z1], [SX0 + 6, SY, z1]]);
      if (i !== aberta) {
        t(tampa, { w: 2, icone: false });
        cheio(circulo(P((SX0 + SX1) / 2, SY, z0 + 4), 1.5), { icone: false }); // o botão da tampa
        continue;
      }
      // o compartimento aberto (escuro) e a tampa levantada na dobradiça de trás
      hachura(tampa, { angulo: 60, passo: 2.6, margem: 0.5 });
      t(tampa, { w: 2, icone: false });
      const fi = rad(75);
      const sobe = [0, -Math.sin(fi), -Math.cos(fi)];
      const aba = face([[SX0 + 6, SY, z1], [SX1 - 6, SY, z1], soma([SX1 - 6, SY, z1], sobe, 19), soma([SX0 + 6, SY, z1], sobe, 19)]);
      t(aba, { w: 2, papel: true, icone: false });
    }

    // ---------- o fantasma: o cartão no ar, caindo no compartimento aberto ----------
    {
      // o canto de baixo do cartão (girado 28° no sentido anti-horário) encosta na boca da fenda aberta
      const [sx, sy] = P((SX0 + SX1) / 2 + 2, SY + 1, SZ0 + 2 + 21 * aberta);
      const [fx, fy] = [sx + 19.5, sy - 25.1];
      t(mover(retangulo(fx - 29, fy - 13, 58, 26, 1.5), { giro: -28, centro: [fx, fy] }), { fantasma: true });
    }

    // ---------- a sombra no chão ----------
    chao(cx0, cx1 + 2, YB + 3);
    chao(SX0 + 3, SX1 + 2, YB + 3);
    hachura(poli([[SX1 + 3, YB + 1.5], [SX1 + 45, YB - 30], [SX1 + 49, YB - 26], [SX1 + 7, YB + 5.5]], true), { angulo: 38, passo: 3.6, margem: 0.2 });
  },
};
