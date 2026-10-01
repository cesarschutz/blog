/**
 * Testes: fio de prumo diante da parede da oficina. Um trecho de parede de tijolo, de frente, com um
 * nada de vista de cima e da direita (para ter corpo): as fiadas continuam niveladas e o lado direito
 * está certo, mas a quina da esquerda foi andando, fiada a fiada, e saiu uns 3° do prumo. Um suporte
 * de madeira cravado no alto da parede, na primeira junta, segura o fio, que desce vertical até o
 * peso: o corpo cilíndrico de latão com a cabeça recartilhada e o cone de ponta para baixo. O
 * fantasma é a vertical verdadeira que a quina devia seguir, a partir da raiz do suporte: no alto
 * coincide com a parede, embaixo a cunha aberta mostra o erro. O prumo não mede: compara com a
 * gravidade, a referência que não falha.
 *
 * Coleção de 13 (direção de arte, ficha 13): o desenho da rodada anterior trazido para dentro. Saem o
 * baldrame e o capim (a parede assenta no piso da oficina, só com a faixa de sombra do chão); o peso
 * cresce para 22% da largura da área, para o ícone ler; a parede inclina só uns 3°; o pino vira um
 * suporte de madeira com a sua sombra na parede. No ícone ficam o peso, o fio, o suporte e as
 * arestas da parede que mostram a inclinação (um trecho do alto e a quina); o resto da parede, os
 * tijolos, as faces que fogem e a hachura ficam fora.
 */
export default {
  instrumento: "fio de prumo",
  titulo: "Testes",
  cor: "#3e4349",
  desenho({ t, hachura, chao, cheio, linha, poli, arco, circulo, retangulo, juntar }) {
    // ---- a parede ----
    const topo = 392; // o alto da parede
    const chaoY = 668; // onde a parede assenta no piso
    const fiadas = 10;
    const fiada = (chaoY - topo) / fiadas; // 27,6: altura de cada fiada
    const L = 58; // comprimento do tijolo
    const quina = 170; // x da quina no alto
    const desvio = 30; // quanto a quina anda para a direita até o chão (uns 6° fora do prumo: a parede tem de ler torta)
    const direita = 418; // o lado direito, esse certo
    const fundo = [13, -7.5]; // a profundidade: para onde as faces de cima e da direita recuam
    const quinaEm = (y) => quina + (desvio * (y - topo)) / (chaoY - topo);
    const yDa = (i) => topo + fiada * i;
    const origem = (i) => quinaEm(yDa(i) + fiada / 2); // de onde os tijolos da fiada partem
    const recua = ([x, y]) => [x + fundo[0], y + fundo[1]];
    const fio = 104; // x do fio

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
    // O contorno por cima: o alto, a quina inclinada e o lado direito. No ícone fica só o canto da
    // parede, as duas arestas que mostram a inclinação: um trecho do alto e a quina, que o fio
    // vertical denuncia. Com a parede inteira no ícone, o cone ficava com 6px na lombada.
    t(linha([quina, topo], [quina + 72, topo]), { w: 1, icone: true });
    t(linha([quina + 72, topo], [direita, topo]), { w: 1, icone: false });
    t(linha([quina, topo], [quina + desvio, chaoY]), { w: 1, icone: true });
    t(linha([direita, topo], [direita, chaoY]), { w: 1, icone: false });

    // ---- o suporte e o fio ----
    const juntaY = yDa(1); // a primeira junta, onde o suporte está cravado
    const raiz = quinaEm(juntaY); // onde o suporte entra na parede
    const braco = { x0: fio - 12, x1: raiz + 44, y: juntaY - 5, h: 10 }; // o braço de madeira, cravado na parede
    // O fantasma: a vertical verdadeira, da raiz do suporte ao chão. No alto coincide com a quina; embaixo abre a cunha.
    t(linha([raiz, juntaY + 9], [raiz, chaoY - 1]), { fantasma: true });
    // A sombra do braço na parede, antes do braço (que a tapa em parte).
    hachura([[raiz + 1, braco.y + braco.h - 1], [braco.x1 + 1, braco.y + braco.h - 1], [braco.x1 + 1, braco.y + braco.h + 6], [raiz + 1, braco.y + braco.h + 6]], { angulo: 62, passo: 3.2, margem: 0.4 });
    t(retangulo(braco.x0, braco.y, braco.x1 - braco.x0, braco.h, 3), { papel: true });
    t(linha([braco.x0 + 4, braco.y + 3.2], [braco.x1 - 4, braco.y + 3.6]), { w: 3, icone: false }); // o veio da madeira
    t(linha([braco.x0 + 8, braco.y + 6.8], [braco.x1 - 6, braco.y + 6.4]), { w: 3, icone: false });
    // Os dois pregos que cravam o braço na parede.
    cheio(circulo([raiz + 14, braco.y + 5], 1.7), { icone: false });
    cheio(circulo([braco.x1 - 10, braco.y + 5], 1.7), { icone: false });
    // O nó: o fio dá a volta no braço.
    t(circulo([fio, juntaY], 7.5), { w: 2, icone: false });
    cheio(circulo([fio, juntaY + 7], 1.9), { icone: false });

    // ---- o peso ----
    const y0 = 468; // o alto da cabeça
    const r = 45; // meio diâmetro do corpo: 22% da largura da área
    const corpo = y0 + 14; // o alto do ombro abaulado
    const ombro = corpo + 12; // onde o lado reto começa
    const base = ombro + 62; // onde o cone começa
    const ponta = y0 + 180;
    t(linha([fio, juntaY + 7.5], [fio, y0]), { w: 2, icone: true }); // o fio
    // O corpo com o cone, uma peça só: ombro abaulado, lados retos, cone longo.
    t(
      juntar([
        arco([fio, ombro], r, 12, 180, 360),
        linha([fio + r, ombro], [fio + r, base]),
        linha([fio + r, base], [fio, ponta]),
        linha([fio, ponta], [fio - r, base]),
        linha([fio - r, base], [fio - r, ombro]),
      ]),
      { papel: true },
    );
    // A cabeça cilíndrica recartilhada onde o fio entra, por cima do ombro.
    t(retangulo(fio - 15, y0, 30, 15, 2.5), { papel: true });
    for (const dx of [-10.5, -6, -1.5, 3, 7.5, 12]) t(linha([fio + dx, y0 + 2.5], [fio + dx, y0 + 12.5]), { w: 3 }); // o recartilhado
    // O anel torneado entre corpo e cone, e a ponta de aço.
    t(linha([fio - r, base], [fio + r, base]), { w: 2 });
    t(linha([fio - r, base - 7], [fio + r, base - 7]), { w: 3 });
    t(arco([fio, ombro + 2.5], r, 5, 180, 360), { w: 3 }); // a linha torneada do ombro
    t(linha([fio - 9, ponta - 20], [fio + 9, ponta - 20]), { w: 3 });
    // Sombra: a metade direita do corpo, do cone e da cabeça.
    hachura([[fio + 12, corpo + 5], [fio + r - 2, ombro + 1.5], [fio + r - 2, base - 9], [fio + 12, base - 9]], { angulo: 62, passo: 4 });
    hachura([[fio + 12, base - 5.5], [fio + r - 2, base - 5.5], [fio + r - 2, base - 1.5], [fio + 12, base - 1.5]], { angulo: 62, passo: 4 });
    hachura([[fio + 3, base + 2], [fio + r - 4, base + 2], [fio + 1.5, ponta - 5]], { angulo: 62, passo: 4 });
    hachura([[fio + 4, y0 + 1.5], [fio + 13, y0 + 1.5], [fio + 13, y0 + 13.5], [fio + 4, y0 + 13.5]], { angulo: 62, passo: 3.4 });

    // ---- o chão: a faixa de sombra sob a parede ----
    chao(quinaEm(chaoY) - 6, direita + fundo[0] + 2, chaoY + 1, { altura: 6 });
  },
};
