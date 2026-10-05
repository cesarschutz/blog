/**
 * O livro deitado na mesa, com a fita marcadora de cetim (D57, prancha 04 "Edição de estudo"), para a
 * ficha "Do livro" do artigo. Copiado de docs/historico/livros-realistas/pranchas/p04-edicao-de-estudo.mjs
 * e girado para o outro lado (o mesmo ângulo, espelhado: a cabeça vai para a esquerda e a lombada vira
 * para o observador; a câmera é refeita, a imagem não é espelhada, e o texto da capa continua legível).
 *
 * As etiquetas de papel (uma por artigo do livro) não entram na imagem: livroDeitado() devolve os oito
 * lugares delas (o contorno na tela, a luz ao longo da tira e a sombra na mesa), e o site desenha por
 * cima, em SVG, as do livro (a do artigo aberto no amarelo do post-it). Artigo novo não pede etiqueta nova.
 *
 * Referencial do livro (antes de girar no plano): x vai da lombada (0) à borda da frente (W); y sobe
 * da mesa (0) até a capa (T); z vai do alto (0) ao pé (H), isto é, na direção do observador. A capa é
 * o plano y = T, com a arte plana mapeada (u → x, v → z).
 *
 * Ordem de pintura (do fundo para a frente): sombras na mesa, contracapa (com as seixas), miolo (a
 * frente côncava e o pé, com as folhas), lombada, pé da lombada (a caixa, o oco e o cabeceado), fita,
 * capa (as bordas e a face com a arte) e, por cima dela, a luz, o grão e o vinco.
 *
 *   livroDeitado({ capa, lombada, espessura, cor, papel, corFita?, divisao? })
 *     → { svg, largura, altura, etiquetas: [...], capa: [...], livro: [...] }
 */
import {
  Prancha,
  camera,
  enquadrar,
  superficie,
  girarY,
  soma,
  sub,
  mul,
  dot,
  cross,
  normal,
  comprimento,
  lerp,
  grau,
  limitar,
  suave,
  aleatorio,
  pontos,
  caminho,
  gradiente,
  gradienteRadial,
  recortePoligono,
  filtroGrao,
  n,
} from "./cena.mjs";

// ------------------------------------------------------------------------------------ o livro

/**
 * Os oito lugares das etiquetas, na ordem de leitura (o primeiro é o começo do livro). A folha em que
 * cada uma está (`y`, de 0 = logo embaixo da capa a 1 = junto da contracapa) segue a ordem; ao longo da
 * borda da frente (`z`), elas se espalham fora de ordem, como quem marca estudando (no alto, a cabeça
 * fica longe da câmera e a etiqueta quase some). Tortas, com a ponta caindo ou enrolando um pouco, e
 * uma dobrada. Um livro com n artigos usa n
 * lugares espalhados por igual (lugarDaEtiqueta, no site); passando de oito, vizinhos dividem um.
 */
const LUGARES = [
  { z: 128, y: 0, largura: 31, sai: 70, giro: -2.5, queda: 1.5 },
  { z: 468, y: 0.14, largura: 30, sai: 64, giro: 4, queda: 1.2 },
  { z: 262, y: 0.28, largura: 32, sai: 76, giro: 3, queda: -2 },
  { z: 606, y: 0.42, largura: 29, sai: 66, giro: -2, queda: 0.8 },
  { z: 336, y: 0.57, largura: 31, sai: 72, giro: -3.5, queda: -1 },
  { z: 540, y: 0.71, largura: 31, sai: 80, giro: -5, queda: -2.5, dobra: 0.62, angDobra: 22 },
  { z: 196, y: 0.85, largura: 30, sai: 70, giro: 4.5, queda: -1.5 },
  { z: 404, y: 1, largura: 32, sai: 66, giro: -1.5, queda: 1 },
].map((l) => ({ ...l, lado: "frente" }));

/**
 * `LIVRO`: { capa, lombada (as artes planas, 480 × 720 e espessura × 720), espessura, cor (contracapa,
 * lombada e o forro abaixo da divisão), papel (o alto da capa), divisao (onde o papel da capa acaba;
 * Infinity = capa toda em papel), corFita? }.
 */
export function livroDeitado(LIVRO) {
  const W = 480; // largura da capa
  const H = 720; // altura da capa (do alto ao pé)
  const T = LIVRO.espessura; // espessura do livro = largura da lombada
  const PAPELAO = 8; // espessura de cada capa (papelão forrado)
  const SEIXA = 9; // quanto as capas passam do miolo, na frente, no alto e no pé
  const VINCO = 22; // o vinco da dobradiça, contado da lombada
  const ABAULADO = Math.round(0.15 * T); // saliência da lombada arredondada (~21)
  const CONCAVO = 14; // a frente do miolo é côncava: as folhas acompanham o arredondamento da lombada
  const RAIO_CANTO = 3.5; // cantos das capas levemente arredondados (o papel dobrado por cima)
  const CAIXA = 3; // espessura da lombada da caixa (papelão fino e o forro)
  const OCO = 2.5; // o oco entre a lombada da caixa e o dorso do miolo
  const CABECEADO = 6; // o rolinho do cabeceado, no pé do dorso
  const Y0 = PAPELAO; // o miolo começa em cima da contracapa
  const Y1 = T - PAPELAO; // e termina embaixo da capa
  const DIVISAO = LIVRO.divisao ?? 300; // onde o papel da capa encontra a cor do livro (v da arte)

  // ------------------------------------------------------------------------------------ cores

  // Conversões sRGB ↔ OKLab (a fita e o miolo saem das cores do livro, nunca de uma cor inventada).
  const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const gama = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
  function hexParaOklch(hex) {
    const [r, g, b] = [1, 3, 5].map((i) => linear(parseInt(hex.slice(i, i + 2), 16) / 255));
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return [L, Math.hypot(A, B), Math.atan2(B, A)];
  }
  function oklchParaHex([L, C, h]) {
    const A = C * Math.cos(h);
    const B = C * Math.sin(h);
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    const rgb = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
    return (
      "#" +
      rgb
        .map((v) =>
          Math.round(limitar(gama(limitar(v))) * 255)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
    );
  }

  const COR = LIVRO.cor; // #606a37: a parte de baixo da capa, a contracapa, a lombada
  const PAPEL_CAPA = LIVRO.papel; // #f2ede2: a parte de cima da capa
  const [corL, corC, corH] = hexParaOklch(COR);
  /** A fita de cetim: a cor do livro, mais escura e um pouco menos saturada. */
  const COR_FITA = LIVRO.corFita ?? oklchParaHex([corL * 0.8, corC * 0.8, corH]);
  const [papL, papC, papH] = hexParaOklch(PAPEL_CAPA);
  /** O papel do miolo: o papel do site, um pouco mais creme (o corte das folhas é mais quente). */
  const MIOLO = oklchParaHex([papL - 0.025, papC + 0.014, papH]);
  /** O cabeceado: listras no creme do miolo e na cor da fita. */
  const CABECEADO_CLARO = oklchParaHex([papL - 0.07, papC + 0.02, papH]);

  // ------------------------------------------------------------------------------------ a cena

  const LARG = 1200;
  const ALT = 950;
  const GIRO = 19; // graus no plano da mesa: a cabeça vai para a esquerda e a lombada vira para o observador (a 04 usa −19)
  const CENTRO = [W / 2, 0, H / 2];
  /** Do referencial do livro para o mundo (o centro do livro na origem). */
  const mundo = (p) => sub(girarY(p, GIRO, CENTRO), CENTRO);

  const ELEVACAO = 57; // graus: câmera alta
  const DISTANCIA = 5200; // teleobjetiva: olho longe, perspectiva fraca
  const alvo = [0, T / 2, 0];
  const olho = soma(alvo, [0, DISTANCIA * Math.sin(grau(ELEVACAO)), DISTANCIA * Math.cos(grau(ELEVACAO))]);
  const cam = camera({ olho, alvo, focal: 1000, centro: [LARG / 2, ALT / 2] });
  /** Do referencial do livro direto para a tela. */
  const tela = (p) => cam.p(mundo(p));

  /** A luz principal (uma janela grande, difusa), no mundo: a direção PARA ela. Alto, à esquerda, um pouco atrás. */
  const LUZ = normal([-0.6, 1.0, -0.3]);
  /** A mesma luz e o olhar no referencial do livro. */
  const LUZ_L = girarY(LUZ, -GIRO);
  const OLHAR_L = normal(girarY(sub(olho, alvo), -GIRO));
  const MEIO_L = normal(soma(LUZ_L, OLHAR_L)); // meia direção (brilho especular)

  /**
   * Claridade de uma face pela normal (no referencial do livro): a janela grande "abraça" a forma
   * (Lambert com envoltório), mais a luz do céu (o que olha para cima clareia) e um preenchimento fraco.
   */
  function claridade(nL) {
    const nn = normal(nL);
    const envolve = limitar((dot(nn, LUZ_L) + 0.5) / 1.5);
    const ceu = 0.5 + 0.5 * nn[1];
    return 0.5 + 0.5 * (0.35 * ceu + 0.65 * envolve);
  }
  const CLARO_CAPA = claridade([0, 1, 0]);
  /**
   * A camada de luz de uma face, relativa à capa (que fica com a cor do site): [cor, opacidade].
   * A razão de claridade é de luz linear; a camada translúcida age sobre cores em sRGB, então a razão
   * passa pela gama antes (sem isso, a sombra sai escura e cinzenta demais).
   */
  function luzDaFace(nL, forca = 1) {
    const g = (claridade(nL) / CLARO_CAPA) ** (1 / 2.2);
    return g < 1 ? ["#000", limitar((1 - g) * forca, 0, 0.85)] : ["#fff", limitar((g - 1) * forca, 0, 0.3)];
  }

  // ------------------------------------------------------------------------------------ perfis

  // A lombada da caixa: um arco pelas quinas das capas (x = 0 em y = 0 e y = T), saliente no meio.
  const xcL = (T * T) / 4 / (2 * ABAULADO) - ABAULADO / 2;
  const RL = xcL + ABAULADO;
  const phiL = Math.asin(T / 2 / RL);
  /** A face de fora da lombada na altura y (negativa: para fora do livro). */
  const xLombada = (y) => xcL - Math.sqrt(Math.max(0, RL * RL - (y - T / 2) ** 2));
  /** A lombada pela coordenada u da arte (0 = lado da contracapa, embaixo; T = lado da capa, em cima). */
  function lombadaEm(u) {
    const f = -phiL + 2 * phiL * (u / T);
    return { x: xcL - RL * Math.cos(f), y: T / 2 + RL * Math.sin(f), normal: [-Math.cos(f), Math.sin(f), 0] };
  }
  const tMiolo = (y) => limitar((y - Y0) / (Y1 - Y0));
  const curva = (t) => 1 - (2 * t - 1) ** 2; // 0 nas folhas de fora, 1 no meio do miolo
  /** A borda da frente do miolo (côncava) na altura y. */
  const xFrente = (y) => W - SEIXA - CONCAVO * curva(tMiolo(y));
  /** O dorso do miolo (dentro da lombada, depois da caixa, do oco e do cabeceado) na altura y. */
  const xDorso = (y) => xLombada(y) + CAIXA + OCO + CABECEADO;

  /** O contorno das capas na planta [x, z]: cantos da frente arredondados; do lado da lombada, retos. */
  function contornoPlanta(r = RAIO_CANTO, passos = 6) {
    const ps = [[0, 0]];
    for (let k = 0; k <= passos; k++) {
      const a = -Math.PI / 2 + ((Math.PI / 2) * k) / passos;
      ps.push([W - r + r * Math.cos(a), r + r * Math.sin(a)]);
    }
    for (let k = 0; k <= passos; k++) {
      const a = ((Math.PI / 2) * k) / passos;
      ps.push([W - r + r * Math.cos(a), H - r + r * Math.sin(a)]);
    }
    ps.push([0, H]);
    return ps;
  }
  /** A parte do contorno que a câmera vê de lado: da frente (depois do canto do alto) até o pé na lombada. */
  const bordaVisivel = () => contornoPlanta().slice(1 + 6);

  // ------------------------------------------------------------------------------------ utilidades

  const pr = new Prancha({
    prefixo: "deitado",
    largura: LARG,
    altura: ALT,
    titulo: "Um livro de capa dura deitado na mesa, com a fita marcadora",
  });

  /** Desfoque com a região do filtro na tela inteira (formas finas não cortam o borrão). */
  const filtros = new Map();
  function desfoque(desvio) {
    const k = n(desvio);
    if (!filtros.has(k)) {
      const id = pr.id("desfoque");
      pr.def(
        `<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${LARG}" height="${ALT}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${k}"/></filter>`,
      );
      filtros.set(k, id);
    }
    return filtros.get(k);
  }
  const op = (a) => n(Math.round(a * 1000) / 1000);
  const poligono = (ps, atributos = "") => `<polygon points="${pontos(ps)}" ${atributos}/>`;
  /** Uma camada de luz (preto ou branco translúcido) num polígono da tela. */
  function camadaDeLuz(ps, [cor, a]) {
    return a > 0.003 ? poligono(ps, `fill="${cor}" fill-opacity="${op(a)}"`) : "";
  }
  /** Envoltória convexa (cadeia monótona) de pontos da tela. */
  function envoltoria(ps) {
    const p = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const giro = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const meia = (lista) => {
      const r = [];
      for (const q of lista) {
        while (r.length >= 2 && giro(r[r.length - 2], r[r.length - 1], q) <= 0) r.pop();
        r.push(q);
      }
      return r.slice(0, -1);
    };
    return meia(p).concat(meia([...p].reverse()));
  }
  /** Um ponto do livro levado à mesa pela luz (a sombra dele); `fracao` < 1 encurta a sombra. */
  function naMesa(pL, fracao = 1) {
    const pw = mundo(pL);
    const k = (fracao * pw[1]) / LUZ[1];
    return cam.p([pw[0] - LUZ[0] * k, 0, pw[2] - LUZ[2] * k]);
  }
  /** Catmull-Rom em 3D, amostrado por comprimento de arco (passo em unidades). */
  function curvaSuave(ps, passo = 1.5) {
    const denso = [];
    for (let i = 0; i < ps.length - 1; i++) {
      const p0 = ps[Math.max(0, i - 1)];
      const p1 = ps[i];
      const p2 = ps[i + 1];
      const p3 = ps[Math.min(ps.length - 1, i + 2)];
      for (let k = 0; k < 40; k++) {
        const t = k / 40;
        const t2 = t * t;
        const t3 = t2 * t;
        denso.push(
          [0, 1, 2].map(
            (j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3),
          ),
        );
      }
    }
    denso.push(ps[ps.length - 1]);
    const acum = [0];
    for (let i = 1; i < denso.length; i++) acum.push(acum[i - 1] + comprimento(sub(denso[i], denso[i - 1])));
    const total = acum[acum.length - 1];
    const saida = [];
    let j = 0;
    for (let s = 0; s <= total + 1e-6; s += passo) {
      while (j < acum.length - 2 && acum[j + 1] < s) j++;
      const t = (s - acum[j]) / (acum[j + 1] - acum[j] || 1);
      saida.push({ s, p: lerp(denso[j], denso[j + 1], limitar(t)) });
    }
    if (total - saida[saida.length - 1].s > 0.2) saida.push({ s: total, p: denso[denso.length - 1] });
    return { amostras: saida, total };
  }

  // ------------------------------------------------------------------------------------ o que há na mesa

  /**
   * Marcadores de papel entre as folhas. Na frente: `z` (centro, ao longo da borda), `y` (a folha em
   * que está), quanto `sai` além da capa, `giro` no plano (torto), `queda` da ponta (negativa: cai) e
   * `dobra` (onde a tira dobra para baixo, 0 a 1). No alto: `x` em vez de `z`.
   */
  // A folha de cada lugar: de logo embaixo da capa até junto da contracapa.
  // A etiqueta do artigo aberto sai mais para fora (PUXADA): a mesma tira, puxada, que o site usa no lugar da normal.
  const PUXADA = 20;
  const MARCADORES = LUGARES.map((l, ordem) => ({ ...l, ordem, y: Y1 - 10 - (Y1 - Y0 - 20) * l.y }));
  const PUXADAS = MARCADORES.map((m) => ({ ...m, sai: m.sai + PUXADA }));

  /** A superfície de um marcador: Q(s, w), s de 0 (onde sai das folhas) a 1 (ponta), w na largura. */
  function marcadorP(m) {
    const g = grau(m.giro);
    if (m.lado === "frente") {
      const x0 = xFrente(m.y);
      const d = [Math.cos(g), 0, Math.sin(g)];
      const a = [-Math.sin(g), 0, Math.cos(g)];
      const comp = W + m.sai - x0;
      return { comp, Q: (s, w) => pontoDoMarcador([x0, m.y, m.z], d, a, comp, m, s, w) };
    }
    const z0 = SEIXA;
    const d = [Math.sin(g), 0, -Math.cos(g)];
    const a = [Math.cos(g), 0, Math.sin(g)];
    const comp = SEIXA + m.sai;
    return { comp, Q: (s, w) => pontoDoMarcador([m.x, m.y, z0], d, a, comp, m, s, w) };
  }
  function pontoDoMarcador(base, d, a, comp, m, s, w) {
    // Uma leve curva (queda ou enrolado para cima) e, se houver, a dobra: depois dela a tira desce.
    let p;
    if (m.dobra && s > m.dobra) {
      const ang = grau(m.angDobra);
      const dentro = soma(base, mul(d, m.dobra * comp));
      const resto = (s - m.dobra) * comp;
      p = soma(dentro, soma(mul(d, resto * Math.cos(ang)), [0, -resto * Math.sin(ang), 0]));
      p[1] += m.queda * m.dobra * m.dobra;
    } else {
      p = soma(base, mul(d, s * comp));
      p[1] += m.queda * s * s;
    }
    return soma(p, mul(a, w));
  }

  /** A fita marcadora (linha do meio, no referencial do livro): sai do pé do miolo perto da lombada, cai e pousa na mesa. */
  const FITA_X = 26;
  const FITA_Y = 58;
  const FITA_LARGURA = 19;
  const FITA_CORTE = 15; // a ponta cortada em diagonal: uma borda passa a outra
  // O trecho que cai fica num plano só (x constante): a fita não torce no ar; ela só vira na mesa.
  const PONTOS_FITA = [
    [FITA_X, FITA_Y, H - SEIXA],
    [FITA_X, FITA_Y - 0.6, H - SEIXA + 3.5],
    [FITA_X, FITA_Y - 6, H - 1.5],
    [FITA_X, 36, H + 0.8],
    [FITA_X, 14, H + 1.6],
    [FITA_X, 4, H + 5],
    [FITA_X, 0.5, H + 16],
    [FITA_X - 3, 0.5, H + 52],
    [FITA_X - 16, 0.5, H + 96],
    [FITA_X - 45, 0.5, H + 131],
    [FITA_X - 86, 0.5, H + 152],
  ];

  /**
   * O referencial da fita em cada amostra: tangente, largura (w) e normal (nr), por transporte paralelo
   * a partir da saída (onde a largura corre ao longo da lombada, −x): sem torção onde a fita fica quase
   * vertical. Na mesa, um leve rolar (a fita nunca fica perfeitamente chata).
   */
  function referencialDaFita(amostras) {
    let w = [-1, 0, 0];
    return amostras.map((a, i) => {
      const p0 = amostras[Math.max(0, i - 1)].p;
      const p1 = amostras[Math.min(amostras.length - 1, i + 1)].p;
      const t = normal(sub(p1, p0));
      w = normal(sub(w, mul(t, dot(t, w))));
      let ww = w;
      let nr = normal(cross(w, t));
      if (a.p[1] < 1.5) {
        const rolar = grau(7) * Math.sin(a.s / 34 + 0.8);
        nr = normal(soma(mul(nr, Math.cos(rolar)), mul(w, Math.sin(rolar))));
        ww = normal(cross(t, nr));
      }
      return { a, t, w: ww, nr };
    });
  }

  // ------------------------------------------------------------------------------------ enquadrar

  let CAIXA_IMAGEM;
  const fita = curvaSuave(PONTOS_FITA, 1.2);
  const FITA_REF = referencialDaFita(fita.amostras);
  {
    const quadro = [];
    for (const [x, z] of contornoPlanta()) for (const y of [0, T]) quadro.push(mundo([x, y, z]));
    quadro.push(mundo([-ABAULADO, T / 2, 0]), mundo([-ABAULADO, T / 2, H]));
    for (const m of PUXADAS) {
      const { Q } = marcadorP(m);
      quadro.push(mundo(Q(1, -m.largura / 2)), mundo(Q(1, m.largura / 2)));
    }
    for (const a of fita.amostras) quadro.push(mundo(a.p));
    // a sombra do livro também tem de caber (ela vai para a direita e um pouco para a frente)
    for (const [x, z] of contornoPlanta()) {
      const pw = mundo([x, T, z]);
      const k = pw[1] / LUZ[1];
      quadro.push([pw[0] - LUZ[0] * k, 0, pw[2] - LUZ[2] * k]);
    }
    enquadrar(cam, quadro, [70, 34, LARG - 140, ALT - 80]);
    // A caixa da imagem: tudo o que foi enquadrado, com folga para os desfoques das sombras.
    const tela = quadro.map((p) => cam.p(p));
    const xs = tela.map((p) => p[0]);
    const ys = tela.map((p) => p[1]);
    const folga = 30;
    CAIXA_IMAGEM = [Math.floor(Math.min(...xs) - folga), Math.floor(Math.min(...ys) - folga)];
    CAIXA_IMAGEM.push(Math.ceil(Math.max(...xs) + folga) - CAIXA_IMAGEM[0], Math.ceil(Math.max(...ys) + folga) - CAIXA_IMAGEM[1]);
  }

  // ------------------------------------------------------------------------------------ as artes planas

  const artCapa = pr.simbolo(LIVRO.capa, { largura: W, altura: H, nome: "capa" });
  const artLombada = pr.simbolo(LIVRO.lombada, { largura: T, altura: H, nome: "lombada" });

  // ------------------------------------------------------------------------------------ 1. sombras na mesa

  {
    const planta = contornoPlanta();
    const base = planta.map(([x, z]) => tela([x, 0, z]));
    const alto = [...planta.map(([x, z]) => [x, T, z]), [xLombada(T / 2), T / 2, 0], [xLombada(T / 2), T / 2, H]];
    const sombraEm = (fracao) => envoltoria([...base, ...alto.map((p) => naMesa(p, fracao))]);
    const folga = (d) =>
      [
        [-d - 6, -d],
        [W + d, -d],
        [W + d, H + d],
        [-d - 6, H + d],
      ].map(([x, z]) => tela([x, 0, z]));
    pr.add(
      [
        `<g>`,
        // oclusão larga e fraca (o livro tira a luz do céu da mesa em volta)
        poligono(folga(16), `fill="#000" fill-opacity="0.08" filter="url(#${desfoque(26)})"`),
        // sombra projetada: longa e mais clara, borrando com a distância
        poligono(sombraEm(1), `fill="#000" fill-opacity="0.13" filter="url(#${desfoque(18)})"`),
        poligono(sombraEm(0.6), `fill="#000" fill-opacity="0.14" filter="url(#${desfoque(9)})"`),
        poligono(sombraEm(0.25), `fill="#000" fill-opacity="0.16" filter="url(#${desfoque(4)})"`),
        // contato: justo e escuro, onde a contracapa toca a mesa
        poligono(folga(0.5), `fill="#000" fill-opacity="0.42" filter="url(#${desfoque(1.6)})"`),
        `</g>`,
      ].join(""),
    );

    // a fita: a parte que cai projeta uma sombra macia; a que está na mesa, um contato justo
    const bordas = FITA_REF.map(({ a, w }) => ({ a, esq: soma(a.p, mul(w, FITA_LARGURA / 2)), dir: soma(a.p, mul(w, -FITA_LARGURA / 2)) }));
    const noAr = bordas.filter((b) => b.a.p[1] > 1.5);
    const naMesaFita = bordas.filter((b) => b.a.p[1] <= 1.5);
    if (noAr.length > 1) {
      const ps = [...noAr.map((b) => naMesa(b.esq)), ...noAr.map((b) => naMesa(b.dir)).reverse()];
      pr.add(poligono(ps, `fill="#000" fill-opacity="0.2" filter="url(#${desfoque(3.2)})"`));
    }
    if (naMesaFita.length > 1) {
      const ps = [...naMesaFita.map((b) => tela(b.esq)), ...naMesaFita.map((b) => tela(b.dir)).reverse()];
      pr.add(poligono(ps, `fill="#000" fill-opacity="0.16" filter="url(#${desfoque(3.5)})" transform="translate(1.2 1.4)"`));
      pr.add(poligono(ps, `fill="#000" fill-opacity="0.34" filter="url(#${desfoque(0.9)})" transform="translate(0.5 0.7)"`));
    }
  }

  // ------------------------------------------------------------------------------------ 3. contracapa

  {
    // A face de cima da contracapa (só as seixas aparecem: o forro dobrado por dentro, na cor do livro).
    const face = contornoPlanta().map(([x, z]) => tela([x, PAPELAO, z]));
    pr.add(poligono(face, `fill="${COR}"`));
    // As seixas ficam à sombra do miolo (a luz vem da lombada e do alto): escuras, mais junto das folhas.
    pr.add(poligono(face, `fill="#000" fill-opacity="0.3"`));
    // A borda da contracapa (papelão forrado), de lado.
    pr.add(bordaDaCapa(0, PAPELAO, () => COR));
  }

  /**
   * A borda de uma capa (papelão forrado), a parte que a câmera vê: da frente (depois do canto do
   * alto) ao pé na lombada, entre as alturas y0 e y1. `corEm(z, lado)` dá a cor do forro. A borda de
   * cima avança 1 unidade para dentro (para baixo da face que vem por cima, sem costura).
   */
  function bordaDaCapa(y0, y1, corEm) {
    const ps = bordaVisivel();
    const partes = [];
    // Fatias com a cor do forro (na frente da capa, o papel até a divisão e a cor do livro depois).
    const dentro = ([x, z], d) => [x >= W - RAIO_CANTO - 0.01 && z < H - RAIO_CANTO ? x - d : x, z >= H - RAIO_CANTO - 0.01 && x < W - RAIO_CANTO ? z - d : z];
    const fatia = (lista, cor) => {
      const cima = lista.map((q) => tela([dentro(q, 1)[0], y1, dentro(q, 1)[1]]));
      const baixo = lista.map(([x, z]) => tela([x, y0, z])).reverse();
      partes.push(poligono([...cima, ...baixo], `fill="${cor}"`));
    };
    // divide a lista na divisão do papel (z = DIVISAO na borda da frente)
    const antes = [ps[0], [W, DIVISAO]];
    const depois = [[W, DIVISAO], ...ps.slice(1)];
    const c0 = corEm(DIVISAO - 1);
    const c1 = corEm(DIVISAO + 1);
    if (c0 === c1) fatia(ps, c0);
    else {
      fatia(antes, c0);
      fatia(depois, c1);
    }
    // A luz de cada trecho (a borda da frente foge da luz; a do pé, menos).
    for (let i = 0; i < ps.length - 1; i++) {
      const [xa, za] = ps[i];
      const [xb, zb] = ps[i + 1];
      const nrm = normal([zb - za, 0, -(xb - xa)]);
      const q = [tela([xa, y1, za]), tela([xb, y1, zb]), tela([xb, y0, zb]), tela([xa, y0, za])];
      partes.push(camadaDeLuz(q, luzDaFace(nrm)));
    }
    return `<g>${partes.join("")}</g>`;
  }

  // ------------------------------------------------------------------------------------ 4. lombada (a curva, de relance)

  {
    const P = (u, v) => {
      const l = lombadaEm(u);
      return mundo([l.x, l.y, v]);
    };
    const s = superficie(pr, { ref: artLombada, w: T, h: H, P, cam, nu: 30, nv: 6 });
    pr.add(s.svg);
    // A luz: cada fatia pela sua normal (a curva que encara a janela clareia; a que foge escurece).
    const partes = [];
    for (const c of s.celulas) {
      if (!c.deFrente) continue;
      const l = lombadaEm((c.u0 + c.u1) / 2);
      partes.push(camadaDeLuz(c.tela, luzDaFace(l.normal, 1.1)));
    }
    pr.add(`<g filter="url(#${desfoque(0.35)})">${partes.join("")}</g>`);
  }

  // ------------------------------------------------------------------------------------ 5. o pé da lombada: caixa, oco e cabeceado

  {
    const passos = 40;
    const arco = (dx, z, y0 = 0, y1 = T) => {
      const ps = [];
      for (let k = 0; k <= passos; k++) {
        const y = y0 + ((y1 - y0) * k) / passos;
        ps.push(tela([xLombada(y) + dx, y, z]));
      }
      return ps;
    };
    // O oco: o vão escuro entre a lombada da caixa e o miolo (visto de frente, no fundo do pé).
    const fundo = [...arco(CAIXA, H), ...arco(CAIXA + OCO + CABECEADO + 1, H - SEIXA, Y0, Y1).reverse()];
    pr.add(poligono(fundo, `fill="${COR}"`));
    pr.add(poligono(fundo, `fill="#000" fill-opacity="0.58"`));
    // O cabeceado: o rolinho de linha trançada no pé do dorso, rente às folhas. Listras miúdas e
    // inclinadas (a trança), em dois tons próximos, e a luz de um cilindro por cima.
    const zc = H - SEIXA + 0.8;
    const dentro = CAIXA + OCO;
    const fora = CAIXA + OCO + CABECEADO;
    const escuro = oklchParaHex([(corL * 0.8 + papL) / 2, corC * 0.45, corH]);
    const listras = [];
    const nListras = 34;
    for (let k = 0; k < nListras; k++) {
      const ya = Y0 + 1.5 + ((Y1 - Y0 - 3) * k) / nListras;
      const yb = Y0 + 1.5 + ((Y1 - Y0 - 3) * (k + 1)) / nListras;
      const q = [
        tela([xLombada(ya) + dentro, ya, zc]),
        tela([xLombada(ya) + fora, ya + 1.6, zc]),
        tela([xLombada(yb) + fora, yb + 1.6, zc]),
        tela([xLombada(yb) + dentro, yb, zc]),
      ];
      listras.push(poligono(q, `fill="${k % 2 ? escuro : CABECEADO_CLARO}"`));
    }
    const rolo = [...arco(dentro, zc, Y0 + 1.5, Y1 - 1.5), ...arco(fora, zc, Y0 + 1.5, Y1 - 1.5).reverse()];
    const recRolo = recortePoligono(pr, rolo);
    const a = tela([xLombada(T / 2) + dentro, T / 2, zc]);
    const b = tela([xLombada(T / 2) + fora, T / 2, zc]);
    const g = gradiente(pr, a, b, [
      [0, "#000", 0.42],
      [0.5, "#000", 0.14],
      [0.8, "#000", 0.2],
      [1, "#000", 0.38],
    ]);
    pr.add(`<g clip-path="url(#${recRolo})">${listras.join("")}${poligono(rolo, `fill="url(#${g})"`)}</g>`);
  }

  // ------------------------------------------------------------------------------------ 6. miolo: a frente côncava e o pé

  /**
   * O corte das folhas visto de perto: estrias finas ao longo das folhas (ruído alongado, girado para a
   * direção de p0 → p1 na tela), recortadas pelo polígono da face. `alfa`: força; `cor`: da estria.
   */
  function estrias(ps, p0, p1, { alfa = 0.1, atraves = 0.95, ao = 0.0035, semente = 3, cor = [0.23, 0.19, 0.13] } = {}) {
    const ang = (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI;
    const xs = ps.map((p) => p[0]);
    const ys = ps.map((p) => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const r = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 6;
    const id = pr.id("estrias");
    const [cr, cg, cb] = cor;
    pr.def(
      `<filter id="${id}" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${ao} ${atraves}" numOctaves="2" seed="${semente}"/><feColorMatrix values="0 0 0 0 ${cr} 0 0 0 0 ${cg} 0 0 0 0 ${cb} ${n(alfa * 5)} 0 0 0 ${n(-alfa * 2.1)}"/></filter>`,
    );
    const rec = recortePoligono(pr, ps);
    return `<g clip-path="url(#${rec})"><rect x="${n(cx - r)}" y="${n(cy - r)}" width="${n(2 * r)}" height="${n(2 * r)}" transform="rotate(${n(ang)} ${n(cx)} ${n(cy)})" filter="url(#${id})"/></g>`;
  }

  {
    // A frente do miolo: P(t, z), t de 0 (folha de baixo) a 1 (folha de cima).
    const yDe = (t) => Y0 + t * (Y1 - Y0);
    const F = (t, z) => [xFrente(yDe(t)), yDe(t), z];
    const passos = 24;
    const za = SEIXA;
    const zb = H - SEIXA;
    const frente = [];
    for (let k = 0; k <= passos; k++) frente.push(tela(F(0, za + ((zb - za) * k) / passos)));
    // no pé, avança 2 unidades para dentro do plano do pé (por baixo da face do pé, que vem depois)
    for (let k = 0; k <= passos; k++) {
      const t = k / passos;
      frente.push(tela([xFrente(yDe(t)) - 2, yDe(t), zb]));
    }
    for (let k = passos; k >= 0; k--) frente.push(tela(F(1, za + ((zb - za) * k) / passos)));
    for (let k = passos; k >= 0; k--) frente.push(tela(F(k / passos, za)));
    pr.add(poligono(frente, `fill="${MIOLO}"`));
    // Luz: a metade de baixo olha um pouco para cima (clareia); a de cima fica sob a capa (escurece).
    {
      const zm = (za + zb) / 2;
      const a = tela(F(0, zm));
      const b = tela(F(1, zm));
      const paradas = [];
      for (let k = 0; k <= 12; k++) {
        const t = k / 12;
        const dx = (-CONCAVO * 4 * (1 - 2 * t)) / (Y1 - Y0); // dx/dy da curva côncava
        const nrm = normal([1, -dx, 0]);
        const [, base] = luzDaFace(nrm);
        const sobCapa = 0.16 * suave(0.5, 1, t); // a capa por cima tira a luz do céu
        const junto = 0.05 * (1 - suave(0, 0.1, t)); // o canto com a seixa
        paradas.push([t, "#000", limitar(base + sobCapa + junto, 0, 0.8)]);
      }
      pr.add(poligono(frente, `fill="url(#${gradiente(pr, a, b, paradas)})"`));
    }
    // As folhas: estrias finas ao longo da borda e, por cima, poucas linhas (os cadernos) e uns fios
    // claros (uma folha ou outra que sai um tiquinho e pega luz).
    {
      const ao = [tela(F(0.5, za)), tela(F(0.5, zb))];
      pr.add(estrias(frente, ao[0], ao[1], { alfa: 0.075, semente: 11 }));
      pr.add(estrias(frente, ao[0], ao[1], { alfa: 0.05, semente: 12, cor: [1, 1, 1], atraves: 0.6 }));
      const rnd = aleatorio(404);
      const linhas = [];
      const cadernos = 11;
      for (let i = 1; i < cadernos; i++) {
        const t = (i + (rnd() - 0.5) * 0.35) / cadernos;
        const a = tela(F(t, za + 0.5));
        const b = tela(F(t, zb - 0.5));
        linhas.push(
          `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="#3a3122" stroke-opacity="${op(0.07 + rnd() * 0.05)}" stroke-width="${n(0.45 + rnd() * 0.25)}"/>`,
        );
      }
      for (let i = 0; i < 16; i++) {
        const t = 0.04 + rnd() * 0.9;
        const z0 = za + 10 + rnd() * 240;
        const z1 = zb - 10 - rnd() * 240;
        const a = tela(F(t, z0));
        const b = tela(F(t, z1));
        linhas.push(
          `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="#fff" stroke-opacity="${op(0.1 + rnd() * 0.12)}" stroke-width="0.4"/>`,
        );
      }
      const rec = recortePoligono(pr, frente);
      pr.add(`<g clip-path="url(#${rec})">${linhas.join("")}</g>`);
    }

    // O pé do miolo: plano z = H − SEIXA, entre o dorso (arredondado) e a frente (côncava).
    const pe = [];
    const passosY = 30;
    for (let k = 0; k <= passosY; k++) {
      const y = Y0 + ((Y1 - Y0) * k) / passosY;
      pe.push(tela([xDorso(y) - 1, y, zb]));
    }
    for (let k = passosY; k >= 0; k--) {
      const y = Y0 + ((Y1 - Y0) * k) / passosY;
      pe.push(tela([xFrente(y), y, zb]));
    }
    pr.add(poligono(pe, `fill="${MIOLO}"`));
    {
      const xm = W / 2;
      const a = tela([xm, Y0, zb]);
      const b = tela([xm, Y1, zb]);
      const [, base] = luzDaFace([0, 0, 1]);
      pr.add(
        poligono(
          pe,
          `fill="url(#${gradiente(pr, a, b, [
            [0, "#000", base + 0.04],
            [0.07, "#000", base],
            [0.55, "#000", base + 0.02],
            [1, "#000", base + 0.14],
          ])})"`,
        ),
      );
      // junto da lombada o pé escurece (o oco, a curva das folhas)
      const c = tela([xDorso(T / 2), T / 2, zb]);
      const d = tela([xDorso(T / 2) + 70, T / 2, zb]);
      pr.add(
        poligono(
          pe,
          `fill="url(#${gradiente(pr, c, d, [
            [0, "#000", 0.16],
            [1, "#000", 0],
          ])})"`,
        ),
      );
    }
    // As folhas no pé: estrias ao longo da largura; perto da lombada, linhas que se abrem em leque (o
    // arredondamento), e os cadernos.
    {
      const ao = [tela([0, T / 2, zb]), tela([W, T / 2, zb])];
      pr.add(estrias(pe, ao[0], ao[1], { alfa: 0.07, semente: 21 }));
      pr.add(estrias(pe, ao[0], ao[1], { alfa: 0.045, semente: 22, cor: [1, 1, 1], atraves: 0.6 }));
      const rnd = aleatorio(505);
      const linhas = [];
      const quantas = 34;
      for (let i = 1; i < quantas; i++) {
        const t = (i + (rnd() - 0.5) * 0.6) / quantas;
        const y = Y0 + t * (Y1 - Y0);
        const x0 = xDorso(y) - 3;
        const caderno = i % 3 === 0;
        const x1 = caderno ? xFrente(y) + 3 : xDorso(y) + 40 + rnd() * 60;
        const ps = [];
        for (let k = 0; k <= 26; k++) {
          const x = x0 + (x1 - x0) * (k / 26) ** 1.6;
          const leque = (y - T / 2) * 0.12 * Math.exp(-(x - xDorso(y)) / 30);
          ps.push(tela([x, y + leque, zb]));
        }
        const opac = caderno ? 0.07 + rnd() * 0.05 : 0.05 + rnd() * 0.06;
        // as do leque somem para dentro (a linha se afina e some onde as folhas ficam retas)
        const idg = caderno
          ? null
          : gradiente(pr, ps[0], ps[ps.length - 1], [
              [0, "#3a3122", opac],
              [1, "#3a3122", 0],
            ]);
        linhas.push(
          `<path d="${caminho(ps, false)}" fill="none" stroke="${idg ? `url(#${idg})` : "#3a3122"}"${idg ? "" : ` stroke-opacity="${op(opac)}"`} stroke-width="${n(caderno ? 0.5 : 0.4)}"/>`,
        );
      }
      const rec = recortePoligono(pr, pe);
      pr.add(`<g clip-path="url(#${rec})">${linhas.join("")}</g>`);
    }

    // A caixa da lombada, no pé: a borda do forro em arco (na frente do oco).
    const arcoCaixa = [];
    const passosC = 40;
    for (let k = 0; k <= passosC; k++) {
      const y = (T * k) / passosC;
      arcoCaixa.push(tela([xLombada(y), y, H]));
    }
    for (let k = passosC; k >= 0; k--) {
      const y = (T * k) / passosC;
      arcoCaixa.push(tela([xLombada(y) + CAIXA, y, H]));
    }
    pr.add(poligono(arcoCaixa, `fill="${COR}"`));
    pr.add(camadaDeLuz(arcoCaixa, luzDaFace([0, 0, 1])));
  }

  // ------------------------------------------------------------------------------------ 7. as etiquetas (para o site)

  /**
   * Uma etiqueta, para o site desenhar por cima da imagem: a tira de papel (o contorno na tela), a luz
   * ao longo dela (perto do livro ela está na penumbra da capa; na ponta, na luz; a ponta que enrola
   * para cima clareia, a que cai escurece), o véu junto das folhas, o vinco da dobra e a sombra na mesa.
   * Os pontos saem na tela da imagem; `luz.pretas` e `luz.brancas` são as paradas [s, opacidade] de um
   * gradiente de `luz.de` a `luz.ate`.
   */
  function dadosDaEtiqueta(m) {
    const { Q, comp } = marcadorP(m);
    const passos = 16;
    const esq = [];
    const dir = [];
    for (let k = 0; k <= passos; k++) {
      esq.push(tela(Q(k / passos, -m.largura / 2)));
      dir.push(tela(Q(k / passos, m.largura / 2)));
    }
    const contorno = [...esq, ...[...dir].reverse()];
    const paradas = [];
    for (let k = 0; k <= 12; k++) {
      const s = k / 12;
      const p = Q(s, 0);
      let luz = 1;
      if (m.lado === "frente") {
        // o raio até a janela passa por cima da capa? (penumbra larga: a janela é grande)
        const dist = (p[0] - W) / -LUZ_L[0];
        const altura = p[1] + LUZ_L[1] * dist;
        luz = p[0] < W ? 0.2 : suave(-45, 35, altura - T);
      }
      const ds = 0.02;
      const ao = normal(sub(Q(Math.min(1, s + ds), 0), Q(Math.max(0, s - ds), 0)));
      const atraves = normal(sub(Q(s, m.largura / 2), Q(s, -m.largura / 2)));
      let nrm = normal(cross(atraves, ao));
      if (nrm[1] < 0) nrm = mul(nrm, -1);
      const [cor, a] = luzDaFace(nrm);
      const escuro = (cor === "#000" ? a : -a) + (1 - luz) * 0.13;
      paradas.push([s, limitar(escuro, -0.5, 0.5)]);
    }
    const sombra = [];
    for (let k = 0; k <= 8; k++) sombra.push(naMesa(Q(k / 8, -m.largura / 2)));
    for (let k = 8; k >= 0; k--) sombra.push(naMesa(Q(k / 8, m.largura / 2)));
    return {
      ordem: m.ordem,
      contorno,
      luz: {
        de: tela(Q(0, 0)),
        ate: tela(Q(1, 0)),
        pretas: paradas.map(([s, v]) => [s, Math.max(0, v)]),
        brancas: paradas.map(([s, v]) => [s, Math.max(0, -v)]),
      },
      // Junto das folhas (ou da capa, no alto), o papel perde a luz do céu: um véu curto na base.
      veu: { de: tela(Q(0, 0)), ate: tela(Q(Math.min(1, 14 / comp), 0)) },
      dobra: m.dobra ? [tela(Q(m.dobra, -m.largura / 2)), tela(Q(m.dobra, m.largura / 2))] : null,
      sombra: { contorno: sombra, desvio: 2 + m.y * 0.05 },
    };
  }

  // ------------------------------------------------------------------------------------ 8. a fita de cetim

  {
    // Onde a fita sai: as folhas se afastam um fio (a fresta) e, atrás do trecho que cai, o pé do miolo
    // perde um pouco de luz.
    {
      const zp = H - SEIXA;
      const veu = [
        [FITA_X - 14, Y0 + 1],
        [FITA_X + 14, Y0 + 1],
        [FITA_X + 14, FITA_Y + 3],
        [FITA_X - 14, FITA_Y + 3],
      ].map(([x, y]) => tela([x, y, zp]));
      pr.add(poligono(veu, `fill="#000" fill-opacity="0.12" filter="url(#${desfoque(2.6)})"`));
      const f0 = tela([FITA_X - FITA_LARGURA / 2 - 2.5, FITA_Y + 1, zp]);
      const f1 = tela([FITA_X + FITA_LARGURA / 2 + 2.5, FITA_Y + 1, zp]);
      pr.add(
        `<line x1="${n(f0[0])}" y1="${n(f0[1])}" x2="${n(f1[0])}" y2="${n(f1[1])}" stroke="#2a2418" stroke-opacity="0.45" stroke-width="0.8" stroke-linecap="round"/>`,
      );
    }
    const dados = FITA_REF;
    const N = dados.length;
    const total = fita.total;
    const bordaEsq = [];
    const bordaDir = [];
    for (const d of dados) {
      bordaEsq.push(soma(d.a.p, mul(d.w, FITA_LARGURA / 2)));
      if (d.a.s <= total - FITA_CORTE) bordaDir.push(soma(d.a.p, mul(d.w, -FITA_LARGURA / 2)));
    }
    const contornoFita = [...bordaEsq.map(tela), ...bordaDir.map(tela).reverse()];
    const rec = recortePoligono(pr, contornoFita);
    const partes = [`<polygon points="${pontos(contornoFita)}" fill="${COR_FITA}"/>`];
    // Luz difusa por trecho (a parte que cai olha para o observador e fica à sombra; a da mesa, na luz).
    const luz = [];
    const brilho = [];
    const fio = [];
    for (let i = 0; i < N - 1; i++) {
      const d0 = dados[i];
      const d1 = dados[i + 1];
      const e0 = soma(d0.a.p, mul(d0.w, FITA_LARGURA / 2));
      const e1 = soma(d1.a.p, mul(d1.w, FITA_LARGURA / 2));
      const r0 = soma(d0.a.p, mul(d0.w, -FITA_LARGURA / 2));
      const r1 = soma(d1.a.p, mul(d1.w, -FITA_LARGURA / 2));
      const q = [tela(e0), tela(e1), tela(r1), tela(r0)];
      const nr = normal(soma(d0.nr, d1.nr));
      luz.push(camadaDeLuz(q, luzDaFace(nr, 1.15)));
      // Brilho largo do cetim (reflexo da janela), onde a normal encara a meia direção.
      const esp = Math.max(0, dot(nr, MEIO_L)) ** 10;
      if (esp > 0.01) brilho.push(poligono(q, `fill="#fff" fill-opacity="${op(esp * 0.16)}"`));
      // O fio de brilho estreito: o cetim é levemente abaulado na largura, então o reflexo é uma
      // linha que corre ao longo da fita, um pouco para o lado da luz.
      const lado = limitar(dot(MEIO_L, d0.w) * 2.2, -0.42, 0.42);
      const forca = Math.max(0, dot(nr, MEIO_L)) ** 3 * (1 - Math.abs(lado) * 1.2);
      if (forca > 0.02) {
        const c0 = soma(d0.a.p, mul(d0.w, lado * FITA_LARGURA - 1.2));
        const c1 = soma(d1.a.p, mul(d1.w, lado * FITA_LARGURA - 1.2));
        const c2 = soma(d1.a.p, mul(d1.w, lado * FITA_LARGURA + 1.2));
        const c3 = soma(d0.a.p, mul(d0.w, lado * FITA_LARGURA + 1.2));
        fio.push(poligono([tela(c0), tela(c1), tela(c2), tela(c3)], `fill="#fff" fill-opacity="${op(forca * 0.42)}"`));
      }
    }
    partes.push(
      `<g clip-path="url(#${rec})"><g filter="url(#${desfoque(0.8)})">${luz.join("")}</g><g filter="url(#${desfoque(1.6)})">${brilho.join("")}</g><g filter="url(#${desfoque(0.7)})">${fio.join("")}</g></g>`,
    );
    // As ourelas: um fio mais escuro em cada borda.
    partes.push(`<path d="${caminho(bordaEsq.map(tela), false)}" fill="none" stroke="#000" stroke-opacity="0.28" stroke-width="0.7"/>`);
    partes.push(`<path d="${caminho(bordaDir.map(tela), false)}" fill="none" stroke="#000" stroke-opacity="0.28" stroke-width="0.7"/>`);
    // O corte em diagonal: uns fiozinhos soltos, bem discretos.
    {
      const rnd = aleatorio(19);
      const pontaE = bordaEsq[bordaEsq.length - 1];
      const pontaD = bordaDir[bordaDir.length - 1];
      for (let k = 1; k < 6; k++) {
        const q = lerp(pontaD, pontaE, k / 6 + (rnd() - 0.5) * 0.05);
        const t = dados[N - 1].t;
        const a = tela(q);
        const b = tela(soma(q, mul(t, 1.2 + rnd() * 1.4)));
        partes.push(
          `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="${COR_FITA}" stroke-opacity="0.8" stroke-width="0.45" stroke-linecap="round"/>`,
        );
      }
    }
    pr.add(`<g>${partes.join("")}</g>`);
  }

  // ------------------------------------------------------------------------------------ 9. a capa

  {
    // A borda da capa (papelão forrado): na frente, o papel até a divisão e a cor do livro depois.
    pr.add(bordaDaCapa(T - PAPELAO, T, (z) => (z < DIVISAO ? PAPEL_CAPA : COR)));

    // A face com a arte, mapeada; cantos da frente arredondados.
    const P = (u, v) => mundo([u, T, v]);
    const s = superficie(pr, { ref: artCapa, w: W, h: H, P, cam, nu: 8, nv: 10 });
    const contornoCapa = contornoPlanta().map(([x, z]) => tela([x, T, z]));
    const rec = recortePoligono(pr, contornoCapa);
    const camadas = [s.svg];

    // Luz sobre a capa: a janela está no alto à esquerda (mais luz ali, caindo devagar para o pé e a frente).
    {
      const a = tela([0, T, 0]);
      const b = tela([W, T, H]);
      camadas.push(
        `<rect x="0" y="0" width="${LARG}" height="${ALT}" fill="url(#${gradiente(pr, a, b, [
          [0, "#fff", 0.07],
          [0.45, "#fff", 0],
          [0.55, "#000", 0],
          [1, "#000", 0.08],
        ])})"/>`,
      );
      // O reflexo largo e fraco da janela no papel fosco (fora da capa, à esquerda; só a cauda aparece).
      const c = tela([-260, T, 300]);
      camadas.push(
        `<rect x="0" y="0" width="${LARG}" height="${ALT}" fill="url(#${gradienteRadial(pr, c, 640, [
          [0, "#fff", 0.1],
          [0.55, "#fff", 0.035],
          [1, "#fff", 0],
        ])})"/>`,
      );
    }
    // O grão do papel (como o grao.svg do site) e uma nuvem bem larga e fraca (o papel não é uniforme).
    {
      const grao = filtroGrao(pr, { base: 0.85, oitavas: 2, alfa: 0.09, semente: 5 });
      const nuvem = filtroGrao(pr, { base: 0.012, oitavas: 3, alfa: 0.035, semente: 9 });
      camadas.push(`<rect x="0" y="0" width="${LARG}" height="${ALT}" filter="url(#${grao})"/>`);
      camadas.push(`<rect x="0" y="0" width="${LARG}" height="${ALT}" filter="url(#${nuvem})"/>`);
    }
    // O vinco da dobradiça: a encosta que desce para o vinco foge da luz; a que sobe para a capa a encara.
    {
      const faixa = (u0, u1) => [tela([u0, T, 0]), tela([u1, T, 0]), tela([u1, T, H]), tela([u0, T, H])];
      const g1 = gradiente(pr, tela([VINCO - 9, T, H / 2]), tela([VINCO - 1, T, H / 2]), [
        [0, "#000", 0],
        [1, "#000", 0.07],
      ]);
      camadas.push(poligono(faixa(VINCO - 9, VINCO - 1), `fill="url(#${g1})"`));
      const linha = (u, cor, a, larg, desf) => {
        const p0 = tela([u, T, 1]);
        const p1 = tela([u, T, H - 1]);
        return `<line x1="${n(p0[0])}" y1="${n(p0[1])}" x2="${n(p1[0])}" y2="${n(p1[1])}" stroke="${cor}" stroke-opacity="${a}" stroke-width="${larg}" filter="url(#${desfoque(desf)})"/>`;
      };
      camadas.push(linha(VINCO - 0.6, "#000", 0.15, 1.1, 0.55));
      camadas.push(linha(VINCO + 1.4, "#fff", 0.2, 1, 0.55));
      const g2 = gradiente(pr, tela([VINCO + 2, T, H / 2]), tela([VINCO + 6, T, H / 2]), [
        [0, "#fff", 0.05],
        [1, "#fff", 0],
      ]);
      camadas.push(poligono(faixa(VINCO + 2, VINCO + 6), `fill="url(#${g2})"`));
      // entre a lombada e o vinco, o forro arredonda para a lombada e pega um pouco mais de luz
      const g3 = gradiente(pr, tela([0, T, H / 2]), tela([VINCO - 10, T, H / 2]), [
        [0, "#fff", 0.06],
        [1, "#fff", 0],
      ]);
      camadas.push(poligono(faixa(0, VINCO - 10), `fill="url(#${g3})"`));
    }
    pr.add(`<g clip-path="url(#${rec})">${camadas.join("")}</g>`);

    // As arestas: as de trás e da lombada pegam um fio de luz; as da frente e do pé, um fio de sombra.
    {
      const planta = contornoPlanta();
      const fio = (lista, cor, a, larg) =>
        `<path d="${caminho(
          lista.map(([x, z]) => tela([x, T, z])),
          false,
        )}" fill="none" stroke="${cor}" stroke-opacity="${a}" stroke-width="${larg}" stroke-linecap="round"/>`;
      pr.add(
        fio(
          [
            [0, H],
            [0, 0],
            [W - RAIO_CANTO, 0],
          ],
          "#fff",
          0.35,
          0.7,
        ),
      );
      pr.add(fio(planta.slice(1 + 6), "#000", 0.18, 0.8));
    }
  }

  // ------------------------------------------------------------------------------------ a imagem e as etiquetas

  /** Pontos da tela na caixa da imagem, com uma casa decimal. */
  const [cx, cy, cw, ch] = CAIXA_IMAGEM;
  const naCaixa = (ps) => ps.map(([x, y]) => [Math.round((x - cx) * 10) / 10, Math.round((y - cy) * 10) / 10]);
  const svg = pr
    .svg()
    .replace(`viewBox="0 0 ${LARG} ${ALT}" width="${LARG}" height="${ALT}"`, `viewBox="${cx} ${cy} ${cw} ${ch}" width="${cw}" height="${ch}"`);
  const planta = contornoPlanta();
  const silhueta = envoltoria([
    ...planta.map(([x, z]) => tela([x, 0, z])),
    ...planta.map(([x, z]) => tela([x, T, z])),
    ...[0, H].map((z) => tela([xLombada(T / 2), T / 2, z])),
  ]);
  return {
    svg,
    largura: cw,
    altura: ch,
    /** A face da capa (as etiquetas saem de baixo dela) e a silhueta do livro (as sombras delas ficam na mesa). */
    capa: naCaixa(planta.map(([x, z]) => tela([x, T, z]))),
    livro: naCaixa(silhueta),
    /** Os oito lugares, na ordem de leitura; `puxadas`: os mesmos, com a tira puxada (a do artigo aberto). */
    etiquetas: MARCADORES.map(dadosDaEtiqueta).map(naCaixaDaEtiqueta),
    puxadas: PUXADAS.map(dadosDaEtiqueta).map(naCaixaDaEtiqueta),
  };

  function naCaixaDaEtiqueta(e) {
    return {
      ...e,
      contorno: naCaixa(e.contorno),
      luz: { ...e.luz, de: naCaixa([e.luz.de])[0], ate: naCaixa([e.luz.ate])[0] },
      veu: { de: naCaixa([e.veu.de])[0], ate: naCaixa([e.veu.ate])[0] },
      dobra: e.dobra && naCaixa(e.dobra),
      sombra: { ...e.sombra, contorno: naCaixa(e.sombra.contorno) },
    };
  }
}
