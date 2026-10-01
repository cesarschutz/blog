/**
 * Testes: fio de prumo de pedreiro diante de uma parede. Um trecho de parede de tijolo, de frente,
 * com um nada de vista de cima e da direita (para ter corpo): as fiadas continuam niveladas e o lado
 * direito está certo, mas a quina da esquerda foi andando, fiada a fiada, e saiu do prumo. O pino de
 * madeira cravado na primeira junta segura o fio, que desce vertical até o peso de latão pontudo. O
 * fantasma é a vertical verdadeira que a quina devia seguir, a partir da raiz do pino: no alto
 * coincide com a parede, embaixo a cunha aberta mostra o erro. O prumo não mede: compara com a
 * gravidade, a referência que não falha.
 */
export default {
  instrumento: "fio de prumo diante da parede",
  desenho({ t, hachura, chao, cheio, linha, poli, arco, circulo, retangulo, juntar }) {
    // ---- a parede ----
    const topo = 392; // o alto da parede
    const chaoY = 660; // onde a parede assenta no baldrame
    const fiadas = 10;
    const fiada = (chaoY - topo) / fiadas; // 26,8: altura de cada fiada
    const L = 56; // comprimento do tijolo
    const quina = 166; // x da quina no alto
    const desvio = 30; // quanto a quina anda para a direita até o chão (saiu do prumo)
    const direita = 404; // o lado direito, esse certo
    const fundo = [13, -7.5]; // a profundidade: para onde as faces de cima e da direita recuam
    const quinaEm = (y) => quina + (desvio * (y - topo)) / (chaoY - topo);
    const yDa = (i) => topo + fiada * i;
    const origem = (i) => quinaEm(yDa(i) + fiada / 2); // de onde os tijolos da fiada partem
    const recua = ([x, y]) => [x + fundo[0], y + fundo[1]];
    const fio = quina - 36; // x do fio

    // ---- o baldrame (a viga de fundação em que a parede assenta) ----
    const baldrame = { x0: fio - 46, x1: direita + 8, y0: chaoY, h: 10 };
    const cantos = [[baldrame.x0, baldrame.y0], [baldrame.x1, baldrame.y0], [baldrame.x1, baldrame.y0 + baldrame.h], [baldrame.x0, baldrame.y0 + baldrame.h]];
    t(poli([cantos[0], recua(cantos[0]), recua(cantos[1]), cantos[1]], true), { w: 1, papel: true, icone: false }); // a face de cima
    t(poli([cantos[1], recua(cantos[1]), recua(cantos[2]), cantos[2]], true), { w: 1, papel: true, icone: false }); // a face da direita
    hachura([cantos[1], recua(cantos[1]), recua(cantos[2]), cantos[2]], { angulo: 60, passo: 4 });
    t(poli(cantos, true), { w: 1, papel: true, icone: false }); // a frente

    // A face de cima da parede e a face da direita, que fica na sombra.
    const cima = [[quina, topo], recua([quina, topo]), recua([direita, topo]), [direita, topo]];
    t(poli(cima, true), { w: 1, papel: true, icone: false });
    const lado = [[direita, topo], recua([direita, topo]), recua([direita, chaoY]), [direita, chaoY]];
    t(poli(lado, true), { w: 1, papel: true, icone: false });
    hachura(lado, { angulo: 60, passo: 4 });
    // As fiadas continuam na face lateral: os topos dos tijolos, de leve.
    for (let i = 1; i < fiadas; i++) t(linha([direita + 1, yDa(i)], recua([direita - 1, yDa(i)])), { w: 3, icone: false });

    // A frente: as juntas horizontais (entre fiadas) e as verticais (alternadas a meio tijolo).
    for (let i = 1; i < fiadas; i++) {
      const y = yDa(i);
      t(linha([quinaEm(y), y], [direita, y]), { w: 2, icone: false });
    }
    for (let i = 0; i < fiadas; i++) {
      const [y0, y1] = [yDa(i), yDa(i + 1)];
      for (let x = origem(i) + (i % 2 === 0 ? L / 2 : L); x < direita - 9; x += L) t(linha([x, y0 + 0.5], [x, y1 - 0.5]), { w: 3, icone: false });
    }
    // O contorno por cima: o alto, a quina inclinada e o lado direito.
    t(linha([quina, topo], [direita, topo]), { w: 1, icone: false });
    t(linha([quina, topo], [quina + desvio, chaoY]), { w: 1, icone: false });
    t(linha([direita, topo], [direita, chaoY]), { w: 1, icone: false });

    // ---- o pino e o fio ----
    const juntaY = yDa(1); // a primeira junta, onde o pino está cravado
    const raiz = quinaEm(juntaY); // onde o pino entra na parede
    const pino = { y: juntaY - 4.5, h: 9 };
    // O fantasma: a vertical verdadeira, da raiz do pino ao chão. No alto coincide com a quina; embaixo abre a cunha.
    t(linha([raiz, juntaY + 8], [raiz, chaoY - 1]), { fantasma: true });
    t(retangulo(fio - 12, pino.y, raiz + 2 - (fio - 12), pino.h, 3), { papel: true, icone: false });
    t(linha([fio - 9, pino.y + 3], [raiz - 2, pino.y + 3.5]), { w: 3, icone: false }); // o veio da madeira
    t(linha([fio - 6, pino.y + 6.5], [raiz - 6, pino.y + 6]), { w: 3, icone: false });
    // O nó: o fio dá a volta no pino.
    t(circulo([fio, juntaY], 7), { w: 2, icone: false });
    cheio(circulo([fio, juntaY + 6.5], 1.9), { icone: false });

    // ---- o peso ----
    const y0 = 512; // o alto da tampa
    const r = 27; // meio diâmetro do corpo
    const corpo = y0 + 10; // o alto do ombro abaulado
    const ombro = corpo + 9; // onde o lado reto começa
    const base = ombro + 52; // onde o cone começa
    const ponta = y0 + 138;
    t(linha([fio, juntaY + 7], [fio, y0]), { w: 2, icone: false }); // o fio, na capa
    t(linha([fio, y0 - 46], [fio, y0]), { w: 2, soIcone: true }); // no ícone, só um pedaço do fio
    // O corpo com o cone, uma peça só: ombro abaulado, lados retos, cone longo.
    t(
      juntar([
        arco([fio, ombro], r, 9, 180, 360),
        linha([fio + r, ombro], [fio + r, base]),
        linha([fio + r, base], [fio, ponta]),
        linha([fio, ponta], [fio - r, base]),
        linha([fio - r, base], [fio - r, ombro]),
      ]),
      { papel: true },
    );
    // A tampa recartilhada onde o fio entra, por cima do ombro.
    t(retangulo(fio - 11, y0, 22, 11, 2), { papel: true });
    for (const dx of [-7, -3.5, 0, 3.5, 7]) t(linha([fio + dx, y0 + 2], [fio + dx, y0 + 9]), { w: 3 }); // o recartilhado
    // O anel torneado entre corpo e cone, e a ponta de aço.
    t(linha([fio - r, base], [fio + r, base]), { w: 2 });
    t(linha([fio - r, base - 5.5], [fio + r, base - 5.5]), { w: 3 });
    t(arco([fio, ombro + 2], r, 3.5, 180, 360), { w: 3 }); // a linha torneada do ombro
    t(linha([fio - 6.5, ponta - 15], [fio + 6.5, ponta - 15]), { w: 3 });
    // Sombra: o lado direito do corpo, do cone e da tampa.
    hachura([[fio + 9, corpo + 3.5], [fio + r - 1.5, ombro + 1], [fio + r - 1.5, base - 7], [fio + 9, base - 7]], { angulo: 62, passo: 4 });
    hachura([[fio + 9, base - 4.5], [fio + r - 1.5, base - 4.5], [fio + r - 1.5, base - 1.5], [fio + 9, base - 1.5]], { angulo: 62, passo: 4 });
    hachura([[fio + 2, base + 2], [fio + r - 3, base + 2], [fio + 1, ponta - 4]], { angulo: 62, passo: 4 });
    hachura([[fio + 3.5, y0 + 1.5], [fio + 9.5, y0 + 1.5], [fio + 9.5, y0 + 9.5], [fio + 3.5, y0 + 9.5]], { angulo: 62, passo: 3.6 });

    // ---- o chão ----
    const solo = baldrame.y0 + baldrame.h;
    t(linha([baldrame.x0 - 14, solo], [baldrame.x1 + fundo[0] + 6, solo]), { w: 2, icone: false });
    chao(baldrame.x0 + 2, baldrame.x1 + 2, solo + 1, { altura: 6 });
    // Uns tufos de capim, como no arco.
    for (const [x, d] of [[baldrame.x0 - 11, 0], [baldrame.x0 - 6, 1], [baldrame.x1 + fundo[0] + 2, 1], [baldrame.x1 + fundo[0] + 7, 0]]) {
      t(linha([x, solo - 1], [x + (d ? 2.5 : -2), solo - 7]), { w: 3, icone: false });
    }
  },
};
