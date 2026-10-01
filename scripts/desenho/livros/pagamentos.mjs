/**
 * Pagamentos: caixa registradora mecânica, das de latão do fim do século XIX (inventada em 1879
 * contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia).
 *
 * Vista de frente e um pouco de cima, em projeção oblíqua como a gaveta de fichas do Dados: a frente
 * é plana e o fundo (z) foge para cima e para a direita. A luz vem do alto à esquerda: os lados
 * direitos da base, do corpo e da cabeça ficam na sombra, e a faixa sob o beiral da cabeça também.
 * De baixo para cima: a base de madeira com a gaveta do dinheiro (puxador em concha e fechadura), o
 * corpo com o teclado em três degraus de teclas redondas, a cabeça com o visor envidraçado onde três
 * bandeirinhas estão levantadas (em branco) e a placa arqueada em cima; no lado direito, a manivela.
 * O fantasma é o comprovante que sai por cima e enrola como papel de bobina: a venda que ficou
 * registrada (o dinheiro vai para a gaveta, o registro sai no papel).
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.72;
const B = 0.34;
const P = (x, y, z = 0) => [x + A * z, y - B * z];

export default {
  instrumento: "caixa registradora mecânica",
  cor: "#467866",
  desenho({ t, hachura, chao, ponto, linha, poli, curva, arco, circulo, retangulo, juntar }) {
    /** Face plana por pontos 3D [x, y, z], fechada. */
    const face = (pontos) => poli(pontos.map(([x, y, z]) => P(x, y, z)), true);
    /** Aresta entre dois pontos 3D. */
    const aresta = (a, b) => linha(P(...a), P(...b));
    /** Círculo deitado no plano do lado direito (x fixo): vira uma elipse inclinada na projeção. */
    const circuloLado = (x, yc, zc, r) => {
      const n = Math.max(24, Math.ceil(2 * Math.PI * r));
      const pts = Array.from({ length: n }, (_, i) => {
        const a = (2 * Math.PI * i) / n;
        return P(x, yc + r * Math.sin(a), zc + r * Math.cos(a));
      });
      return { pts, fechada: true };
    };

    const D = 120; // a profundidade da máquina

    // ---------- a base de madeira, com a gaveta do dinheiro ----------
    const [bx0, bx1, by0, by1] = [90, 310, 616, 668];
    t(face([[bx0, by1, 0], [bx0, by0, 0], [bx0, by0, D], [bx1, by0, D], [bx1, by1, D], [bx1, by1, 0]]), { papel: true });
    t(aresta([bx0, by0, 0], [bx1, by0, 0]));
    t(aresta([bx1, by0, 0], [bx1, by1, 0]));
    hachura(face([[bx1, by0, 0], [bx1, by1, 0], [bx1, by1, D], [bx1, by0, D]]), { angulo: 60, passo: 4.2 });
    t(linha([94, 663], [306, 663]), { w: 3 }); // o friso do rodapé

    t(retangulo(104, 624, 192, 36, 2)); // a frente da gaveta
    const concha = juntar([arco([200, 643], 13, 8, 0, 180), linha([187, 643], [213, 643])]);
    hachura(concha, { angulo: 60, passo: 3 });
    t(concha, { w: 2 });
    ponto([200, 632], 2.2); // a fechadura

    // ---------- o corpo: o lado direito e o teclado em degraus ----------
    const [X0, X1] = [102, 298];
    const zs = [6, 21.3, 36.7, 52]; // onde começa cada degrau (e onde termina o último)
    const ys = [602, 580, 558, 536]; // o pé de cada degrau; o topo é 22 acima
    // O perfil do lado, da frente para trás: a saia, os três degraus e a faixa sob a cabeça.
    const perfil = [[6, 616], [6, 580], [21.3, 580], [21.3, 558], [36.7, 558], [36.7, 536], [52, 536], [52, 520]];

    const lado = face([...perfil.map(([z, y]) => [X1, y, z]), [X1, 520, D], [X1, 616, D]]);
    t(lado, { papel: true, w: 3 }); // só o preenchimento (o contorno fino some sob as arestas grossas)
    t(aresta([X1, 520, D], [X1, 616, D]));
    t(aresta([X1, 616, D], [X1, 616, 6]));
    hachura(lado, { angulo: 60, passo: 4.2 });

    const frente = face([...perfil.map(([z, y]) => [X0, y, z]), ...[...perfil].reverse().map(([z, y]) => [X1, y, z])]);
    t(frente, { papel: true });
    t(aresta([X0 + 4, 606, 6], [X1 - 4, 606, 6]), { w: 3 }); // o friso da saia
    for (let i = 0; i < 3; i++) {
      const y = ys[i] - 22; // o piso do degrau
      t(aresta([X0, y, zs[i]], [X1, y, zs[i]]), { w: 2 });
      t(aresta([X0, y, zs[i + 1]], [X1, y, zs[i + 1]]), { w: 2 });
    }
    // As teclas: oito por degrau, redondas, em pé no fundo de cada piso.
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) t(circulo(P(116 + 24 * j, ys[i] - 29, zs[i] + 7.5), 6.5), { w: 2, papel: true });
    }
    // A faixa sob o beiral da cabeça fica na sombra.
    hachura(face([[X0, 520, 52], [X1, 520, 52], [X1, 536, 52], [X0, 536, 52]]), { angulo: 60, passo: 3.6 });

    // ---------- a cabeça: o visor com as bandeirinhas ----------
    const [cx0, cx1, cy0, cy1, cz] = [96, 304, 456, 520, 38];
    t(face([[cx0, cy1, cz], [cx0, cy0, cz], [cx0, cy0, D], [cx1, cy0, D], [cx1, cy1, D], [cx1, cy1, cz]]), { papel: true });
    t(aresta([cx0, cy0, cz], [cx1, cy0, cz]));
    t(aresta([cx1, cy0, cz], [cx1, cy1, cz]));
    hachura(face([[cx1, cy0, cz], [cx1, cy1, cz], [cx1, cy1, D], [cx1, cy0, D]]), { angulo: 60, passo: 4.2 });
    t(aresta([cx0 + 5, 462, cz], [cx1 - 5, 462, cz]), { w: 3 }); // o friso de cima
    const [vx, vy] = P(108, 466, cz);
    t(retangulo(vx, vy, 184, 44, 5), { w: 2 }); // o vidro do visor
    t(aresta([113, 504, cz], [287, 504, cz]), { w: 3 }); // o peitoril
    for (const x of [146, 196, 258]) {
      const [sx, sy] = P(x, 504, cz);
      const bandeira = juntar([linha([sx - 9, sy], [sx - 9, sy - 21]), arco([sx, sy - 21], 9, 9, 180, 360), linha([sx + 9, sy - 21], [sx + 9, sy])]);
      t(bandeira, { w: 2, papel: true });
    }

    // ---------- o fantasma: o comprovante que sai por cima e enrola ----------
    const trilha = [[104, 456], [104, 440], [102, 426], [95, 417], [86, 415], [78, 420], [74, 430], [76, 440]];
    const borda = (z) => curva(trilha.map(([x, y]) => P(x, y, z)));
    const [fa, fb] = [borda(62), borda(84)];
    const fita = juntar([fa, linha(fa.pts.at(-1), fb.pts.at(-1)), { pts: [...fb.pts].reverse(), fechada: false }, linha(fb.pts[0], fa.pts[0])]);
    t(fita, { fantasma: true });

    // ---------- a placa arqueada em cima da cabeça ----------
    const pz = 46;
    const [pl, pr] = [P(136, 456, pz), P(264, 456, pz)];
    const placa = juntar([linha(pl, P(136, 450, pz)), arco(P(200, 450, pz), 64, 16, 180, 360), linha(P(264, 450, pz), pr), linha(pr, pl)]);
    t(placa, { papel: true });
    t(arco(P(200, 450, pz), 58, 11, 180, 360), { w: 3 });

    // ---------- a manivela, no lado direito ----------
    const [hy, hz] = [574, 84]; // o cubo
    const [ky, kz] = [542, 104]; // a ponta do braço
    const [ny, nz] = [1.6, 2.55]; // meia largura do braço, perpendicular a ele
    t(face([[X1, hy + ny, hz + nz], [X1, ky + ny, kz + nz], [X1, ky - ny, kz - nz], [X1, hy - ny, hz - nz]]), { w: 2, papel: true });
    t(circuloLado(X1, hy, hz, 9), { papel: true });
    ponto(P(X1, hy, hz), 2);
    const [kx, kyy] = P(X1, ky, kz);
    t(retangulo(kx - 2, kyy - 4.5, 20, 9, 4.5), { papel: true }); // a maçaneta

    // ---------- a sombra no chão ----------
    chao(88, 312, 670);
    hachura(poli([[311, 669.5], [397, 628.5], [401, 632.5], [315, 673.5]], true), { angulo: 38, passo: 3.6, margem: 0.2 });
  },
};
