/**
 * Sistemas Distribuídos: dois relógios de pêndulo pendurados na mesma viga, a experiência de Huygens
 * (1665). Dois relógios de parede, de caixa, lado a lado numa viga de madeira apoiada em dois
 * montantes; os pêndulos à vista, os mostradores marcando horas um pouco diferentes. Cada máquina tem
 * o seu relógio, e os dois se acertam só pela viga que os liga. O fantasma é o pêndulo do segundo
 * relógio na posição espelhada: ele oscila em oposição ao primeiro.
 *
 * No ícone ficam só as frentes (viga, montantes, pés, caixas, mostradores, ponteiros) e os pêndulos,
 * com a haste mais grossa: as faces que fogem, a hachura e os miúdos viram borrão em 40px.
 */
const V = [10, -7]; // a fuga das faces laterais (para a direita e para cima), a mesma no desenho inteiro

export default {
  instrumento: "dois relógios de pêndulo na mesma viga",
  cor: "#1c2c51",
  desenho({ t, hachura, chao, ponto, linha, poli, curva, arco, elipse, circulo, retangulo, mover, juntar }) {
    const [vx, vy] = V;
    const rad = (g) => (g * Math.PI) / 180;

    /** As faces de um bloco, de trás para a frente: o lado direito (na sombra), o tampo e a frente. */
    const bloco = (x, y, w, h, { tampo = true, sombra = true, passo = 4.2, icone = true, iconeFaces = false } = {}) => {
      const lado = poli([[x + w, y], [x + w + vx, y + vy], [x + w + vx, y + h + vy], [x + w, y + h]], true);
      t(lado, { papel: true, icone: icone && iconeFaces });
      if (sombra) hachura(lado, { angulo: 60, passo });
      if (tampo) t(poli([[x, y], [x + w, y], [x + w + vx, y + vy], [x + vx, y + vy]], true), { papel: true, icone: icone && iconeFaces });
      t(retangulo(x, y, w, h), { papel: true, icone });
    };

    // ---------- a viga e os montantes ----------
    bloco(42, 392, 390, 18); // a viga: o tampo à luz, o topo à direita na sombra
    // o veio da madeira na face da viga
    t(curva([[52, 398], [120, 397], [190, 399.5], [260, 398], [330, 400], [425, 398.5]]), { w: 3 });
    t(curva([[52, 405], [130, 405.5], [200, 404], [280, 405.5], [360, 404.5], [425, 405]]), { w: 3 });

    const montante = (x) => {
      bloco(x - 12, 664, 42, 8, { passo: 3.8 }); // o pé
      bloco(x, 410, 18, 254, { tampo: false }); // o montante, em cima do pé
      t(curva([[x + 7, 420], [x + 6, 480], [x + 8, 540], [x + 6.5, 600], [x + 8, 655]]), { w: 3 }); // o veio
    };
    montante(54);
    montante(404);
    // as mãos-francesas, do montante à viga
    t(poli([[72, 452], [72, 442], [108, 410], [118, 410]], true), { papel: true });
    t(poli([[404, 452], [404, 442], [368, 410], [358, 410]], true), { papel: true });
    chao(44, 440, 672, { altura: 6, passo: 3.8 }); // o chão, de um pé ao outro

    // ---------- um relógio ----------
    const relogio = (cx, { minutos, inclinacao, fantasma = false }) => {
      const topo = 420;
      const meio = 46; // meia largura da caixa e raio da capota
      const cArco = [cx, topo + meio];
      const base = 520;

      // o prego na viga e a argola da caixa
      ponto([cx, 404], 2.1);
      t(elipse([cx, 412], 3.5, 7), { w: 2, icone: false });

      // o rodapé da caixa (atrás do corpo)
      bloco(cx - meio - 3, base, 2 * (meio + 3), 6, { passo: 3.6, icone: false });

      // a faixa lateral (o lado direito e o alto da capota, que fogem para trás) e a frente
      const faixa = juntar([
        arco(cArco, meio, meio, 258, 360),
        linha([cx + meio, cArco[1]], [cx + meio, base]),
        linha([cx + meio, base], [cx + meio + vx, base + vy]),
        linha([cx + meio + vx, base + vy], [cx + meio + vx, cArco[1] + vy]),
        mover(arco(cArco, meio, meio, 360, 258), { dx: vx, dy: vy }),
      ]);
      t(faixa, { papel: true, icone: false });
      hachura(faixa, { angulo: 60, passo: 4.2 });
      const frente = juntar([
        arco(cArco, meio, meio, 180, 360),
        linha([cx + meio, cArco[1]], [cx + meio, base]),
        linha([cx + meio, base], [cx - meio, base]),
        linha([cx - meio, base], [cx - meio, cArco[1]]),
      ]);
      t(frente, { papel: true });
      // a moldura da porta de vidro
      const dentro = meio - 5;
      t(
        juntar([
          arco(cArco, dentro, dentro, 180, 360),
          linha([cx + dentro, cArco[1]], [cx + dentro, base - 5]),
          linha([cx + dentro, base - 5], [cx - dentro, base - 5]),
          linha([cx - dentro, base - 5], [cx - dentro, cArco[1]]),
        ]),
        { w: 3, icone: false },
      );

      // o mostrador: aro, anel das horas, traços das horas, furos de corda, ponteiros e o eixo
      const c = [cx, topo + 48];
      t(circulo(c, 35), { w: 1 });
      t(circulo(c, 31), { w: 2, icone: false });
      for (let i = 0; i < 12; i++) {
        const a = rad(-90 + i * 30);
        const u = [Math.cos(a), Math.sin(a)];
        const r0 = i % 3 ? 28 : 26;
        t(linha([c[0] + r0 * u[0], c[1] + r0 * u[1]], [c[0] + 31 * u[0], c[1] + 31 * u[1]]), { w: i % 3 ? 3 : 2, icone: false });
      }
      for (const lado of [-1, 1]) t(circulo([c[0] + lado * 13, c[1] + 11], 2), { w: 3, icone: false });
      const ponteiro = (angulo, comprimento, losango) => {
        const a = rad(angulo);
        const u = [Math.cos(a), Math.sin(a)];
        const n = [-u[1], u[0]];
        const p = (s, d = 0) => [c[0] + s * u[0] + d * n[0], c[1] + s * u[1] + d * n[1]];
        t(linha(c, p(comprimento)), { w: 2 });
        if (losango) t(poli([p(comprimento * 0.45), p(comprimento * 0.68, 3.2), p(comprimento * 0.9), p(comprimento * 0.68, -3.2)], true), { w: 2, papel: true, icone: false });
      };
      const horas = 10 + minutos / 60;
      ponteiro(-90 + horas * 30, 20, true);
      ponteiro(-90 + minutos * 6, 28, false);
      ponto(c, 1.8);

      // o pêndulo: sai por baixo da caixa, inclinado
      const pivo = [cx, topo + 30];
      const pendulo = (graus, fantasma) => {
        const u = [Math.sin(rad(graus)), Math.cos(rad(graus))];
        const em = (s) => [pivo[0] + s * u[0], pivo[1] + s * u[1]];
        const saida = em((base + 6 - pivo[1]) / u[1]);
        const sBob = 190;
        const bob = em(sBob);
        const rBob = 17;
        if (fantasma) {
          t(juntar([linha(saida, em(sBob - rBob)), arco(bob, rBob, rBob, -90 - graus, 270 - graus)], false), { fantasma: true });
          return;
        }
        t(linha(saida, bob), { w: 2, icone: false });
        t(linha(saida, bob), { w: 1, soIcone: true }); // no ícone a haste é mais grossa, senão some
        t(circulo(bob, rBob), { papel: true });
        // a sombra da lente: a lua entre o disco e o mesmo disco deslocado para a luz (alto, à esquerda)
        const d = [-5, -5];
        const f = (Math.acos(Math.hypot(...d) / (2 * rBob)) * 180) / Math.PI; // meio-ângulo até os cruzamentos
        const longe = (Math.atan2(-d[1], -d[0]) * 180) / Math.PI; // o lado oposto à luz: 45°
        const lua = juntar([
          arco(bob, rBob, rBob, longe - (180 - f), longe + (180 - f)),
          arco([bob[0] + d[0], bob[1] + d[1]], rBob, rBob, longe + f, longe - f),
        ]);
        hachura(lua, { angulo: 60, passo: 3.8, margem: 1 });
        // a haste que segue abaixo da lente e a porca de acerto
        t(linha(em(sBob + rBob), em(sBob + rBob + 6)), { w: 2, icone: false });
        t(mover(retangulo(bob[0] - 4, bob[1] + rBob + 6, 8, 4), { giro: -graus, centro: bob }), { w: 2, papel: true, icone: false });
      };
      pendulo(inclinacao, false);
      if (fantasma) pendulo(-inclinacao, true);
    };

    relogio(172, { minutos: 10, inclinacao: 9 });
    relogio(308, { minutos: 17, inclinacao: -9, fantasma: true });
  },
};
