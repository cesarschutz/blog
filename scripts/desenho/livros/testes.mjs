/**
 * Testes: fio de prumo de pedreiro diante de uma parede. A parede de tijolo, vista de frente, saiu do
 * prumo (as fiadas continuam niveladas, mas a quina da esquerda foi andando); o pino de madeira
 * cravado na primeira junta segura o fio, que desce vertical até o peso de latão pontudo. O fantasma
 * é a vertical verdadeira que a quina devia seguir, a partir da raiz do pino: no alto coincide com a
 * parede, embaixo a cunha aberta mostra o erro. O prumo não mede: compara com a gravidade.
 */
export default {
  instrumento: "fio de prumo diante da parede",
  desenho({ t, hachura, chao, cheio, linha, poli, arco, circulo, retangulo, juntar }) {
    // ---- a parede ----
    const topo = 392; // o alto da parede
    const chaoY = 668; // o chão
    const fiadas = 8;
    const fiada = (chaoY - topo) / fiadas; // 34,5: altura de cada fiada
    const L = 68; // comprimento do tijolo
    const junta = 2; // meia junta de argamassa (os tijolos ficam 4 afastados)
    const quina = 168; // x da quina no alto
    const desvio = 30; // quanto a quina anda para a direita até o chão (saiu do prumo)
    const quinaEm = (y) => quina + (desvio * (y - topo)) / (chaoY - topo);
    const yDa = (i) => topo + fiada * i;
    // Cada fiada, deslocada como a quina; o lado direito termina em dente (meio tijolo por fiada).
    const origem = (i) => quinaEm(yDa(i) + fiada / 2);
    const fim = (i) => origem(i) + (i % 2 === 0 ? 3.5 : 3) * L;

    const tijolos = []; // [x0, x1] de cada tijolo, por fiada, na coordenada da fiada (0 = a quina)
    for (let i = 0; i < fiadas; i++) {
      const cortes = i % 2 === 0 ? [0, L, 2 * L, 3 * L, 3.5 * L] : [0, L / 2, 1.5 * L, 2.5 * L, 3 * L];
      tijolos.push(cortes.slice(0, -1).map((a, k) => [a, cortes[k + 1]]));
    }
    const celulas = [];
    for (let i = 0; i < fiadas; i++) {
      const [y0, y1] = [yDa(i), yDa(i + 1)];
      const o = origem(i);
      tijolos[i].forEach(([a, b], k) => {
        const ultimo = k === tijolos[i].length - 1;
        // Nas bordas da parede o tijolo encosta no contorno; por dentro, fica a junta.
        const cima = i === 0 ? y0 : y0 + junta;
        const baixo = i === fiadas - 1 ? y1 : y1 - junta;
        const direita = ultimo ? o + b : o + b - junta;
        if (k === 0) {
          // O primeiro tijolo da fiada: o lado esquerdo acompanha a quina inclinada.
          t(poli([[quinaEm(cima), cima], [direita, cima], [direita, baixo], [quinaEm(baixo), baixo]], true), { w: 2, icone: false });
          celulas.push([[quinaEm(cima) + 3, cima + 3], [direita - 3, cima + 3], [direita - 3, baixo - 3], [quinaEm(baixo) + 3, baixo - 3]]);
        } else {
          const esquerda = o + a + junta;
          t(retangulo(esquerda, cima, direita - esquerda, baixo - cima, 1.5), { w: 2, icone: false });
          celulas.push([[esquerda + 3, cima + 3], [direita - 3, cima + 3], [direita - 3, baixo - 3], [esquerda + 3, baixo - 3]]);
        }
      });
    }
    // Alguns tijolos mais escuros, como as pedras do arco.
    const porFiada = (i, k) => celulas[tijolos.slice(0, i).reduce((n, f) => n + f.length, 0) + k];
    for (const [i, k] of [[1, 2], [3, 0], [4, 3], [6, 1], [7, 2]]) hachura(porFiada(i, k), { angulo: 60, passo: 4.4 });

    // O contorno da parede por cima dos tijolos: o alto, a quina inclinada e o lado em dente.
    t(linha([quina, topo], [fim(0), topo]), { w: 1, icone: false });
    t(linha([quina, topo], [quina + desvio, chaoY]), { w: 1, icone: false });
    const dente = [[fim(0), topo]];
    for (let i = 0; i < fiadas; i++) {
      dente.push([fim(i), yDa(i + 1)]);
      if (i + 1 < fiadas) dente.push([fim(i + 1), yDa(i + 1)]);
    }
    t(poli(dente), { w: 1, icone: false });

    // ---- o pino e o fio ----
    const juntaY = yDa(1); // a primeira junta, onde o pino está cravado
    const raiz = quinaEm(juntaY); // onde o pino entra na parede
    const fio = raiz - 36; // x do fio
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
    const y0 = 532; // o alto da tampa
    const r = 25; // meio diâmetro do corpo
    const corpo = y0 + 9; // o alto do ombro abaulado
    const ombro = corpo + 8; // onde o lado reto começa
    const base = ombro + 48; // onde o cone começa
    const ponta = y0 + 128;
    t(linha([fio, juntaY + 7], [fio, y0]), { w: 2, icone: false }); // o fio, na capa
    t(linha([fio, y0 - 64], [fio, y0]), { w: 2, soIcone: true }); // no ícone, só um pedaço do fio
    // O corpo com o cone, uma peça só: ombro abaulado, lados retos, cone longo.
    t(
      juntar([
        arco([fio, ombro], r, 8, 180, 360),
        linha([fio + r, ombro], [fio + r, base]),
        linha([fio + r, base], [fio, ponta]),
        linha([fio, ponta], [fio - r, base]),
        linha([fio - r, base], [fio - r, ombro]),
      ]),
      { papel: true },
    );
    // A tampa recartilhada onde o fio entra, por cima do ombro.
    t(retangulo(fio - 10, y0, 20, 10, 2), { papel: true });
    t(linha([fio - 10, y0 + 5], [fio + 10, y0 + 5]), { w: 3 });
    // O anel torneado entre corpo e cone, e a ponta de aço.
    t(linha([fio - r, base], [fio + r, base]), { w: 2 });
    t(linha([fio - r, base - 5], [fio + r, base - 5]), { w: 3 });
    t(arco([fio, ombro + 2], r, 3, 180, 360), { w: 3 }); // a linha torneada do ombro
    t(linha([fio - 6, ponta - 14], [fio + 6, ponta - 14]), { w: 3 });
    // Sombra: o lado direito do corpo, do cone e da tampa.
    hachura([[fio + 8, corpo + 3], [fio + r - 1.5, ombro + 1], [fio + r - 1.5, base - 6.5], [fio + 8, base - 6.5]], { angulo: 62, passo: 4 });
    hachura([[fio + 8, base - 4], [fio + r - 1.5, base - 4], [fio + r - 1.5, base - 1.5], [fio + 8, base - 1.5]], { angulo: 62, passo: 4 });
    hachura([[fio + 2, base + 2], [fio + r - 3, base + 2], [fio + 1, ponta - 4]], { angulo: 62, passo: 4 });
    hachura([[fio + 3, y0 + 1.5], [fio + 8.5, y0 + 1.5], [fio + 8.5, y0 + 8.5], [fio + 3, y0 + 8.5]], { angulo: 62, passo: 3.6 });

    // ---- o chão ----
    t(linha([fio - 56, chaoY], [fim(fiadas - 1) + 8, chaoY]), { w: 1, icone: false });
    chao(fio - 34, fim(fiadas - 1) + 2, chaoY + 1);
    // Uns tufos de capim, como no arco.
    for (const [x, d] of [[fio - 50, 0], [fio - 44, 1], [fio - 38, 0], [fio + 34, 1], [fio + 40, 0], [fim(fiadas - 1) + 12, 0], [fim(fiadas - 1) + 17, 1]]) {
      t(linha([x, chaoY - 1], [x + (d ? 2.5 : -2), chaoY - 7]), { w: 3, icone: false });
    }
  },
};
