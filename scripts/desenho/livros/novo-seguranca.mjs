/**
 * Segurança: a fechadura detectora de Chubb (1818), com a tampa retirada, e a sua chave. Se uma gazua
 * ou uma chave errada levanta uma alavanca além do ponto, o detector trava a fechadura e fica
 * levantado até a chave verdadeira ser girada ao contrário: o dono fica sabendo que alguém tentou.
 *
 * É um objeto de porta: de frente, com a fuga leve para a direita (o mesmo vetor de fundo da caixa
 * registradora, com pouca profundidade), olho um pouco acima, luz do alto à esquerda. A caixa
 * retangular, mais larga que alta, sem tampa: o aro das paredes à vista, a face interna da parede
 * esquerda na sombra, a chapa de fundo com uma hachura leve (o ferro no escuro da caixa). Dentro, de
 * trás para a frente: o ferrolho no alto, saindo pela face direita; as seis alavancas em leque em
 * torno do pivô no alto à esquerda, cada uma com a sua janela (a passagem do pino do ferrolho); por
 * cima delas, a alavanca detectora, mais fina e com o dente na ponta, e a mola de lâmina que a segura;
 * o buraco da chave embaixo, no centro. Na frente, à esquerda, deitada na mesa, a chave grande: o anel,
 * a haste com o colar e o palhetão com os seis degraus (um por alavanca) e o batente do ferrolho.
 *
 * O fantasma é a alavanca detectora na posição travada, levantada até prender o ferrolho: a prova de
 * que alguém tentou. No ícone ficam a caixa, o ferrolho, o buraco da chave, a chave e três alavancas.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.5;
const B = 0.36;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;

// A caixa (a frente, na verdadeira grandeza) e as profundidades.
const [cx0, cy0, CW, CH] = [106, 432, 294, 196]; // x 106–400, y 432–628; a chave fica na frente, abaixo da base
const [cx1, cy1] = [cx0 + CW, cy0 + CH];
const E = 8; // a espessura das paredes (o aro que aparece com a tampa fora)
const DC = 18; // a profundidade da caixa
const ZP = 14; // onde fica a chapa de fundo
const ZM = 10; // onde fica o mecanismo (o meio da espessura)
const [ix0, iy0, ix1, iy1] = [cx0 + E, cy0 + E, cx1 - E, cy1 - E]; // o vão por dentro do aro

export default {
  instrumento: "fechadura detectora de Chubb, com a tampa retirada, e a sua chave",
  titulo: "Segurança",
  cor: "#7c322b",
  desenho({ t, hachura, chao, ponto, cheio, linha, poli, curva, arco, elipse, circulo, retangulo, mover, juntar }) {
    const quad = (pontos) => poli(pontos, true);
    /** Um ponto do mecanismo: coordenadas na chapa (u, v, da quina de cima à esquerda do vão), no plano z = ZM. */
    const M = (u, v) => P(ix0 + u, iy0 + v, ZM);
    const [MW, MH] = [ix1 - ix0, iy1 - iy0]; // 284 × 184

    // ---------- a chapa de fundo, hachurada de leve ----------
    const chapa = quad([P(ix0, iy0, ZP), P(ix1, iy0, ZP), P(ix1, iy1, ZP), P(ix0, iy1, ZP)]);
    t(chapa, { w: 3, papel: true });
    hachura(chapa, { angulo: 60, passo: 11, margem: 1.5 });

    // ---------- o ferrolho, no alto, da língua de dentro até sair pela parede direita ----------
    const [fv0, fv1] = [12, 38]; // o alto e a base do ferrolho, na chapa
    const fuDentro = 96; // onde começa, dentro da caixa
    const xCabeca = cx1 + A * ZM + 30; // até onde a cabeça sai, fora da caixa
    t(
      poli(
        [M(fuDentro, fv0), [xCabeca, M(0, fv0)[1]], [xCabeca, M(0, fv1)[1]], M(124, fv1), M(124, fv1 + 10), M(fuDentro, fv1 + 10)],
        true,
      ),
      { papel: true },
    );

    // ---------- as alavancas em leque, em torno do pivô ----------
    const pivo = M(36, 80);
    const comprimento = 196;
    /** O perfil de uma alavanca com o pivô na origem, apontando para a direita: o olho, a barra e a ponta redonda. */
    const perfilAlavanca = (meia) => {
      const xo = Math.sqrt(11 * 11 - meia * meia); // onde a barra encosta no olho do pivô
      const a = (Math.atan2(-meia, xo) * 180) / Math.PI;
      return juntar([
        arco([0, 0], 11, 11, a, -a - 360), // o olho, pela esquerda, de cima para baixo
        linha([xo, meia], [comprimento - meia, meia]),
        arco([comprimento - meia, 0], meia, meia, 90, -90), // a ponta
        linha([comprimento - meia, -meia], [xo, -meia]),
      ]);
    };
    /** Leva um perfil para o pivô, girado `graus` (positivo desce a ponta). */
    const noPivo = (forma, graus) => mover(forma, { giro: graus, centro: [0, 0], dx: pivo[0], dy: pivo[1] });
    const angulos = [25, 20, 15, 10, 5, 0]; // da de trás (mais baixa) para a da frente
    for (const graus of angulos) {
      const noIcone = graus % 10 === 5; // três perfis no ícone: 25, 15 e 5
      t(noPivo(perfilAlavanca(9), graus), { w: 2, papel: true, icone: noIcone });
      const janela = noPivo(retangulo(150, 1, 10, 7), graus);
      hachura(janela, { angulo: 60, passo: 3.2, margem: 0.6 });
      t(janela, { w: 2, icone: false });
    }
    // O pino do ferrolho, que passa pela janela da alavanca da frente.
    ponto(M(36 + 155, 80 + 4.5), 2.6);

    // A alavanca detectora, mais fina, com o dente na ponta, por cima das outras; e a mola de lâmina.
    const perfilDetector = () => {
      const meia = 5;
      const xo = Math.sqrt(11 * 11 - meia * meia);
      const a = (Math.atan2(-meia, xo) * 180) / Math.PI;
      return juntar([
        arco([0, 0], 11, 11, a, -a - 360),
        poli([[xo, meia], [comprimento, meia], [comprimento, -14], [comprimento - 8, -14], [comprimento - 8, -meia], [xo, -meia]]),
      ]);
    };
    const repouso = -6; // o detector em repouso; o fantasma sobe 10°
    t(noPivo(perfilDetector(), repouso), { w: 2, papel: true, icone: false });
    ponto(pivo, 3);
    ponto(M(14, 44), 2.2); // o parafuso da mola
    t(curva([M(14, 44), M(40, 42), M(72, 52), M(104, 66)]), { w: 2, icone: false });

    // ---------- o buraco da chave, no centro, embaixo ----------
    const bk = M(142, 160);
    t(circulo(bk, 14), { w: 2, icone: false }); // o espelho
    cheio(
      juntar([
        arco(bk, 7.5, 7.5, 120, 420),
        poli([[bk[0] + 7.5 * Math.cos(rad(60)), bk[1] + 7.5 * Math.sin(rad(60))], [bk[0] + 4.5, bk[1] + 20], [bk[0] - 4.5, bk[1] + 20]]),
      ]),
    );

    // ---------- as faces de dentro que aparecem com a tampa fora: a parede esquerda (sombra) e a de baixo ----------
    const faceEsq = quad([[ix0, iy0], P(ix0, iy0, ZP), P(ix0, iy1, ZP), [ix0, iy1]]);
    t(faceEsq, { w: 2, papel: true, icone: false });
    hachura(faceEsq, { angulo: 60, passo: 3.6, margem: 0.5 });
    t(quad([[ix0, iy1], P(ix0, iy1, ZP), P(ix1, iy1, ZP), [ix1, iy1]]), { w: 2, papel: true, icone: false });

    // ---------- o aro das paredes (a frente da caixa sem a tampa) ----------
    t(quad([[cx0, cy0], [cx1, cy0], [cx1, iy0], [cx0, iy0]]), { w: 3, papel: true });
    t(quad([[cx0, iy1], [cx1, iy1], [cx1, cy1], [cx0, cy1]]), { w: 3, papel: true });
    t(quad([[cx0, cy0], [ix0, cy0], [ix0, cy1], [cx0, cy1]]), { w: 3, papel: true });
    t(quad([[ix1, cy0], [cx1, cy0], [cx1, cy1], [ix1, cy1]]), { w: 3, papel: true });
    t(retangulo(ix0, iy0, MW, MH), { w: 2, icone: false });
    t(retangulo(cx0, cy0, CW, CH));
    for (const c of [[cx0 + 4, cy0 + 4], [cx1 - 4, cy0 + 4], [cx1 - 4, cy1 - 4]]) cheio(circulo(c, 2.3), { icone: false });

    // A face de cima (à luz) e a face da direita (na sombra), com a fuga leve.
    t(quad([[cx0, cy0], [cx1, cy0], P(cx1, cy0, DC), P(cx0, cy0, DC)]), { papel: true });
    const faceDir = quad([[cx1, cy0], P(cx1, cy0, DC), P(cx1, cy1, DC), [cx1, cy1]]);
    t(faceDir, { papel: true });
    hachura(faceDir, { angulo: 60, passo: 4.2 });

    // A cabeça do ferrolho, fora da caixa: a frente, a face de cima e a ponta (na sombra).
    const [hx0, hy0, hy1] = [cx1 + A * ZM, M(0, fv0)[1], M(0, fv1)[1]];
    const dz = DC - ZM; // da frente da cabeça até o fundo da caixa
    t(quad([[hx0, hy0], [xCabeca, hy0], P(xCabeca, hy0, dz), P(hx0, hy0, dz)]), { papel: true });
    const ponta = quad([[xCabeca, hy0], P(xCabeca, hy0, dz), P(xCabeca, hy1, dz), [xCabeca, hy1]]);
    t(ponta, { papel: true });
    hachura(ponta, { angulo: 60, passo: 3.4, margem: 0.5 });
    t(quad([[hx0, hy0], [xCabeca, hy0], [xCabeca, hy1], [hx0, hy1]]), { papel: true });

    // ---------- a sombra da caixa no chão ----------
    chao(cx0, cx1, cy1 + 2);
    const [fx, fy] = P(cx1, cy1, DC); // a quina de trás da face da direita, no chão
    hachura(quad([[cx1 - 1, cy1 + 1.5], [fx - 1, fy + 1], [fx + 3, fy + 4.5], [cx1 + 3, cy1 + 5]]), { angulo: 38, passo: 3.6, margem: 0.2 });

    // ---------- o fantasma: o detector levantado, preso no ferrolho ----------
    t(noPivo(perfilDetector(), repouso - 10), { fantasma: true });

    // ---------- a chave, deitada na mesa, na frente e à esquerda ----------
    const ky = 648; // o eixo da haste
    const [kx0, kx1] = [100, 252]; // a haste, do anel à ponta
    // O palhetão, com os seis degraus (um por alavanca) e o batente do ferrolho na ponta.
    const degraus = [18, 24, 14, 22, 26, 18];
    const bx = 196;
    const borda = [[bx, ky - 4]];
    degraus.forEach((d, i) => borda.push([bx + 7 * i, ky + 4 + d], [bx + 7 * (i + 1), ky + 4 + d]));
    borda.push([bx + 42, ky + 30], [bx + 50, ky + 30], [bx + 50, ky - 4]);
    t(poli(borda, true), { papel: true });
    t(retangulo(kx0, ky - 6, kx1 - kx0, 12, 1), { papel: true }); // a haste
    t(linha([kx0 + 12, ky], [bx - 2, ky]), { w: 3, icone: false }); // o fio da haste
    t(retangulo(kx0 + 2, ky - 10, 9, 20, 1.5), { w: 2, papel: true, icone: false }); // o colar
    t(elipse([72, 650], 32, 28), { papel: true }); // o anel
    t(elipse([72, 650], 20, 17), { w: 2 }); // o vazio do anel
    chao(44, 250, 679, { altura: 6, desvio: 3 });
  },
};
