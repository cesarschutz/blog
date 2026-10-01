/**
 * Pagamentos: caixa registradora mecânica, das de latão do fim do século XIX (inventada em 1879
 * contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia).
 *
 * Vista de frente e um pouco de cima, em projeção oblíqua como a gaveta de fichas do Dados: a frente
 * é plana e o fundo (z) foge para cima e para a direita. A luz vem do alto à esquerda: os lados
 * direitos da base, do corpo e da cabeça ficam na sombra, e a faixa sob o beiral da cabeça também.
 * De baixo para cima: a base de madeira com a gaveta do dinheiro (puxador em concha e fechadura), o
 * corpo com a rampa do teclado (quatro fileiras de teclas redondas), a cabeça abobadada com o visor
 * envidraçado onde três bandeirinhas estão levantadas (em branco); no lado direito, a manivela.
 * O fantasma é o comprovante que sai pela lateral esquerda (onde ficava a impressora) e enrola
 * como papel de bobina: a venda que ficou registrada.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.55;
const B = 0.28;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;

export default {
  instrumento: "caixa registradora mecânica",
  cor: "#467866",
  desenho({ t, hachura, chao, ponto, linha, poli, curva, arco, retangulo, juntar }) {
    /** Face plana por pontos 3D [x, y, z], fechada. */
    const face = (pontos) => poli(pontos.map(([x, y, z]) => P(x, y, z)), true);
    /** Aresta entre dois pontos 3D. */
    const aresta = (a, b) => linha(P(...a), P(...b));
    /** Pontos de uma elipse num plano qualquer: centro 3D, dois vetores 3D (os semieixos), de a0 a a1 graus. */
    const elipse3 = (c, u, v, a0 = 0, a1 = 360) => {
      const n = Math.max(12, Math.ceil(((Math.abs(a1 - a0) / 360) * 2 * Math.PI * Math.max(Math.hypot(...u), Math.hypot(...v))) / 1.5));
      const pts = Array.from({ length: n + 1 }, (_, i) => {
        const a = rad(a0 + ((a1 - a0) * i) / n);
        return P(c[0] + u[0] * Math.cos(a) + v[0] * Math.sin(a), c[1] + u[1] * Math.cos(a) + v[1] * Math.sin(a), c[2] + u[2] * Math.cos(a) + v[2] * Math.sin(a));
      });
      return { pts, fechada: false };
    };
    const fechada = (forma) => ({ pts: forma.pts.slice(0, -1), fechada: true });

    const D = 100; // a profundidade da máquina

    // ---------- a base de madeira, com a gaveta do dinheiro ----------
    const [bx0, bx1, by0, by1] = [116, 316, 622, 668];
    t(face([[bx0, by1, 0], [bx0, by0, 0], [bx0, by0, D], [bx1, by0, D], [bx1, by1, D], [bx1, by1, 0]]), { papel: true });
    t(aresta([bx0, by0, 0], [bx1, by0, 0]));
    t(aresta([bx1, by0, 0], [bx1, by1, 0]));
    hachura(face([[bx1, by0, 0], [bx1, by1, 0], [bx1, by1, D], [bx1, by0, D]]), { angulo: 60, passo: 4.2 });
    t(linha([120, 664], [312, 664]), { w: 3 }); // o friso do rodapé

    t(retangulo(128, 630, 176, 32, 2)); // a frente da gaveta
    const concha = juntar([arco([216, 648], 11, 6.5, 0, 180), linha([205, 648], [227, 648])]);
    hachura(concha, { angulo: 60, passo: 3 });
    t(concha, { w: 2 });
    ponto([216, 638.5], 2.2); // a fechadura

    // ---------- o corpo: a rampa do teclado ----------
    const [X0, X1] = [126, 306];
    // O perfil do lado, da frente para trás: a saia, a rampa do teclado e o ombro sob a cabeça.
    const perfil = [[10, 622], [10, 604], [58, 518], [58, 500]];

    const lado = face([...perfil.map(([z, y]) => [X1, y, z]), [X1, 500, D], [X1, 622, D]]);
    t(lado, { papel: true, w: 3 }); // só o preenchimento (o contorno fino some sob as arestas grossas)
    t(aresta([X1, 500, D], [X1, 622, D]));
    t(aresta([X1, 622, D], [X1, 622, 10]));
    hachura(lado, { angulo: 60, passo: 4.2 });

    t(face([...perfil.map(([z, y]) => [X0, y, z]), ...[...perfil].reverse().map(([z, y]) => [X1, y, z])]), { papel: true });
    t(aresta([X0, 604, 10], [X1, 604, 10]), { w: 2 }); // o pé da rampa
    t(aresta([X0, 518, 58], [X1, 518, 58]), { w: 2 }); // o alto da rampa
    // As teclas: quatro fileiras de oito, redondas, levantadas da rampa pelas hastes.
    const rampa = [0, -86, 48]; // o vetor da rampa, do pé ao alto
    const cr = Math.hypot(rampa[1], rampa[2]);
    const sobe = [0, rampa[1] / cr, rampa[2] / cr]; // ao longo da rampa, para cima
    const fora = [0, sobe[2], -sobe[1]]; // a normal da rampa, para fora
    for (const s of [0.13, 0.37, 0.61, 0.85]) {
      for (let j = 0; j < 8; j++) {
        const c = [146 + 20 * j, 604 + rampa[1] * s + fora[1] * 6, 10 + rampa[2] * s + fora[2] * 6];
        t(fechada(elipse3(c, [7, 0, 0], [0, sobe[1] * 7, sobe[2] * 7])), { w: 2, papel: true });
      }
    }
    // O ombro, sob o beiral da cabeça, fica na sombra.
    hachura(face([[X0, 500, 58], [X1, 500, 58], [X1, 518, 58], [X0, 518, 58]]), { angulo: 60, passo: 3.6 });

    // ---------- o fantasma: o comprovante que sai pela lateral e enrola ----------
    const trilha = [[120, 480], [96, 480], [76, 474], [62, 462], [58, 446], [66, 434], [80, 430], [92, 436]];
    const borda = (z) => curva(trilha.map(([x, y]) => P(x, y, z)));
    const [fa, fb] = [borda(55), borda(85)];
    t(juntar([fa, linha(fa.pts.at(-1), fb.pts.at(-1)), { pts: [...fb.pts].reverse(), fechada: false }, linha(fb.pts[0], fa.pts[0])]), { fantasma: true });

    // ---------- a cabeça abobadada, com o visor ----------
    const [cx0, cx1, cy0, cy1, cz] = [120, 312, 440, 500, 46];
    const [cm, rx, ry] = [(cx0 + cx1) / 2, (cx1 - cx0) / 2, 25];
    const arcoFrente = (a0, a1, z) => elipse3([cm, cy0, z], [rx, 0, 0], [0, -ry, 0], a0, a1);
    // Onde a silhueta da abóbada passa da frente para trás: a tangente paralela ao vetor de fundo.
    const at = 180 - (Math.atan2(ry * A, rx * B) * 180) / Math.PI;
    const silhueta = juntar([
      aresta([cx0, cy1, cz], [cx0, cy0, cz]),
      arcoFrente(180, at, cz),
      aresta([cm + rx * Math.cos(rad(at)), cy0 - ry * Math.sin(rad(at)), cz], [cm + rx * Math.cos(rad(at)), cy0 - ry * Math.sin(rad(at)), D]),
      arcoFrente(at, 0, D),
      aresta([cx1, cy0, D], [cx1, cy1, D]),
      aresta([cx1, cy1, D], [cx1, cy1, cz]),
      aresta([cx1, cy1, cz], [cx0, cy1, cz]),
    ]);
    t(silhueta, { papel: true });
    t(arcoFrente(at, 0, cz)); // o resto do arco da frente
    t(aresta([cx1, cy0, cz], [cx1, cy1, cz])); // a quina da frente
    t(aresta([cx1, cy0, cz], [cx1, cy0, D])); // o alto do lado
    hachura(face([[cx1, cy0, cz], [cx1, cy1, cz], [cx1, cy1, D], [cx1, cy0, D]]), { angulo: 60, passo: 4.2 });
    // O flanco direito da abóbada também fica na sombra.
    hachura(juntar([arcoFrente(0, 38, cz), arcoFrente(38, 0, D)]), { angulo: 60, passo: 5 });
    t(elipse3([cm, cy0, cz], [rx - 6, 0, 0], [0, -(ry - 5), 0], 180, 0), { w: 3 }); // o friso da abóbada
    const [vx, vy] = P(132, 452, cz);
    t(retangulo(vx, vy, 168, 40, 5), { w: 2 }); // o vidro do visor
    t(aresta([137, 486, cz], [295, 486, cz]), { w: 3 }); // o peitoril
    for (const x of [160, 214, 262]) {
      const [sx, sy] = P(x, 486, cz);
      t(juntar([linha([sx - 6.5, sy], [sx - 6.5, sy - 20]), arco([sx, sy - 20], 6.5, 6.5, 180, 360), linha([sx + 6.5, sy - 20], [sx + 6.5, sy])]), { w: 2, papel: true });
    }

    // ---------- a manivela, no lado direito ----------
    const [hy, hz] = [566, 76]; // o cubo
    const [ky, kz] = [534, 94]; // a ponta do braço
    const [ny, nz] = [1.7, 3.0]; // meia largura do braço, perpendicular a ele
    t(face([[X1, hy + ny, hz + nz], [X1, ky + ny, kz + nz], [X1, ky - ny, kz - nz], [X1, hy - ny, hz - nz]]), { w: 2, papel: true });
    t(fechada(elipse3([X1, hy, hz], [0, 11, 0], [0, 0, 11])), { papel: true });
    ponto(P(X1, hy, hz), 2.2);
    const [kx, kyy] = P(X1, ky, kz);
    t(retangulo(kx - 2, kyy - 5, 22, 10, 5), { papel: true }); // a maçaneta

    // ---------- a sombra no chão ----------
    chao(114, 318, 670);
    hachura(poli([[317, 669.5], [372, 641], [376, 645], [321, 673.5]], true), { angulo: 38, passo: 3.6, margem: 0.2 });
  },
};
