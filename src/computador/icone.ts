/**
 * O ícone do computador (Computador.astro): o mínimo que roda em toda página. Mostra o botão, adianta o
 * sistema (sistema.ts, com o CSS e os dados) no primeiro hover, foco ou toque, para o clique não esperar,
 * e abre no clique.
 *
 * O lugar dele (C2: "ele aparece inteiro e quando rolo ele vai para baixo e some um pouco"), só com
 * `transform` no próprio botão (a área de clique anda junto):
 * - de 768px para cima, ele nunca sai da tela: inteiro no canto com a página parada, mesmo por cima de uma
 *   lasca do conteúdo (a revisão final da rodada 3 decidiu assim); rolando para baixo, afunda 60% na borda
 *   e fica espiando; rolando para cima, parando ou com o mouse por perto, volta inteiro;
 * - no celular (abaixo de 768px, a margem tem 12px), ele só aparece onde não cobre texto, controle nem
 *   imagem (inteiro, espiando ou fora da tela; `cobre`, pelo hit test do navegador), e o caminho é o item
 *   "Computador" do menu.
 * No hover e no foco, volta inteiro por cima do que for: é o leitor apontando para ele.
 */
const botao = document.querySelector<HTMLButtonElement>("[data-computador]");

if (botao) {
  botao.hidden = false;
  type Sistema = typeof import("./sistema");
  let modulo: Promise<Sistema> | undefined;
  const carregar = () => {
    modulo ??= import("./sistema");
    modulo.catch(() => (modulo = undefined));
    return modulo;
  };
  const adiantar = () => void carregar().then((m) => m.preparar()).catch(() => {});
  for (const tipo of ["pointerenter", "focus", "pointerdown"]) botao.addEventListener(tipo, adiantar, { once: true, passive: true });
  botao.addEventListener("click", () => {
    void carregar()
      .then((m) => m.entrar(botao))
      .catch(() => {});
  });

  // O item "Computador" do menu do celular (Cabecalho.astro; sem JS, ele não aparece): o menu fecha (o
  // clique num link o fecha) e o computador abre a partir do ícone, que sobe inteiro para a câmera achá-lo.
  for (const item of document.querySelectorAll<HTMLElement>("[data-abrir-computador]")) item.hidden = false;
  document.addEventListener(
    "click",
    (e) => {
      const item = (e.target as Element).closest("[data-abrir-computador]");
      if (!item) return;
      e.preventDefault();
      void carregar().then((m) => m.preparar()).catch(() => {});
      const quando = () => {
        if (document.documentElement.hasAttribute("data-menu-aberto")) return void setTimeout(quando, 60);
        setTimeout(() => {
          void carregar()
            .then((m) => m.entrar(botao))
            .catch(() => {});
        }, 120);
      };
      setTimeout(quando, 60);
    },
    { capture: true },
  );

  // A tecla ` (crase; no ABNT2, a tecla morta dela) fora de um campo: o Terminal suspenso desce por cima
  // da página, sem entrar no computador (o mesmo do computador, a direção de arte pediu, como no 15).
  const editavel = (el: EventTarget | null) => el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  addEventListener("keydown", (e) => {
    // No ABNT2, a crase é Shift + a tecla do acento agudo (sem Shift, é o ´); no US internacional, a tecla
    // morta da crase fica no Backquote, sem Shift.
    const crase = e.key === "`" || (e.key === "Dead" && ((e.code === "Backquote" && !e.shiftKey) || (e.code === "BracketLeft" && e.shiftKey)));
    if (!crase || e.metaKey || e.ctrlKey || e.altKey || e.repeat || editavel(e.target)) return;
    if (document.documentElement.dataset.abertura || document.querySelector("dialog[open]")) return;
    e.preventDefault();
    void carregar()
      .then((m) => m.terminalNoBlog(botao))
      .catch(() => {});
  });

  // ---------- o lugar do ícone ----------

  type Estado = "inteiro" | "espiando" | "escondido";
  /** Quanto o ícone afunda quando espia (a fração da altura dele, a mesma do CSS). */
  const AFUNDA = 0.6;
  /** A folga em volta do ícone no teste do celular (px): o giro de 3 graus e nada encostado na borda. */
  const FOLGA = 4;
  /** Com a página parada, quanto ele espera para voltar inteiro (de 768px para cima). */
  const VOLTA = 600;
  /** De 768px para cima, o ícone nunca sai da tela (C2; a revisão final da rodada 3). */
  const largo = matchMedia("(min-width: 768px)");

  const aplicar = (estado: Estado) => {
    botao.classList.toggle("espiando", estado === "espiando");
    botao.classList.toggle("escondido", estado === "escondido");
  };
  const NIVEL: Record<Estado, number> = { inteiro: 0, espiando: 1, escondido: 2 };
  /** O estado que está valendo (sem o hover, o foco e o mouse por perto, que voltam inteiro pelo CSS). */
  const atual = (): Estado => (botao.classList.contains("escondido") ? "escondido" : botao.classList.contains("espiando") ? "espiando" : "inteiro");

  // ----- no celular (abaixo de 768px): o ícone só aparece onde não cobre nada -----

  /** Coisas do conteúdo que o ícone não pode cobrir (além do texto): controles e imagens. */
  const CONTROLE =
    "a[href], button, input, select, textarea, summary, label, [role='button'], [role='link'], [role='tab'], [role='slider'], [tabindex]:not([tabindex='-1'])";
  const IMAGEM = "img, picture, video, canvas, figure, .painel, .ilustracao";

  /** Há um caractere de texto (não espaço) exatamente neste ponto? */
  const textoEm = (x: number, y: number) => {
    const d = document as Document & {
      caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
      caretRangeFromPoint?: (x: number, y: number) => Range | null;
    };
    let no: Node | null = null;
    let em = 0;
    if (d.caretPositionFromPoint) {
      const p = d.caretPositionFromPoint(x, y);
      if (p) [no, em] = [p.offsetNode, p.offset];
    } else if (d.caretRangeFromPoint) {
      const r = d.caretRangeFromPoint(x, y);
      if (r) [no, em] = [r.startContainer, r.startOffset];
    }
    if (!no || no.nodeType !== Node.TEXT_NODE) return false;
    // Texto que não se desenha (num SVG guardado, sem caixa) devolve caixas de mentira: fora.
    const pai = no.parentElement?.getBoundingClientRect();
    if (!pai || (pai.width === 0 && pai.height === 0)) return false;
    const texto = no.textContent ?? "";
    const faixa = document.createRange();
    for (const i of [em - 1, em]) {
      if (i < 0 || i >= texto.length || /\s/.test(texto[i])) continue;
      faixa.setStart(no, i);
      faixa.setEnd(no, i + 1);
      for (const q of faixa.getClientRects()) if (x >= q.left - 1 && x <= q.right + 1 && y >= q.top - 1 && y <= q.bottom + 1) return true;
    }
    return false;
  };

  /** Há conteúdo (texto, controle ou imagem) neste ponto? O ícone tem de estar fora do hit test. */
  const conteudoEm = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    if (!el || el === document.documentElement || el === document.body) return false;
    return !!(el.closest(CONTROLE) || el.closest(IMAGEM) || textoEm(x, y));
  };

  /**
   * As caixas do conteúdo de um elemento: a caixa inteira, se for controle ou imagem; senão, as linhas de
   * texto dele. Texto que anda sozinho (o nome do rodapé respira: o peso muda e a largura junto) ganha uma
   * folga de 0,15em dos lados, para valer em qualquer ponto da animação; e a caixa que corta o texto
   * (overflow) corta as linhas também.
   */
  const caixasDe = (el: Element, caixas: DOMRect[]) => {
    if (el.matches(IMAGEM) || el.matches(CONTROLE)) {
      caixas.push(el.getBoundingClientRect());
      // Desenho que transborda a própria caixa (um carimbo girado que sai do quadro): as partes dele.
      const svg = el instanceof SVGSVGElement ? el : el.querySelector("svg");
      if (svg && getComputedStyle(svg).overflow === "visible")
        for (const parte of Array.from(svg.children).slice(0, 40)) if (parte instanceof SVGGraphicsElement) caixas.push(parte.getBoundingClientRect());
      return;
    }
    const estilo = getComputedStyle(el);
    const folga = el.getAnimations().some((a) => a.playState === "running") ? 0.15 * parseFloat(estilo.fontSize) : 0;
    const corte = estilo.overflowX !== "visible" || estilo.overflowY !== "visible" ? el.getBoundingClientRect() : null;
    const faixa = document.createRange();
    const andar = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n = andar.nextNode();
    for (let i = 0; n && i < 400; n = andar.nextNode(), i++) {
      if (!n.textContent?.trim()) continue;
      faixa.selectNodeContents(n);
      for (const q of faixa.getClientRects()) {
        let [e, t, d, b] = [q.left - folga, q.top, q.right + folga, q.bottom];
        if (corte) [e, t, d, b] = [Math.max(e, corte.left), Math.max(t, corte.top), Math.min(d, corte.right), Math.min(b, corte.bottom)];
        if (d > e && b > t) caixas.push(new DOMRect(e, t, d - e, b - t));
      }
    }
  };

  /**
   * O que não recebe o mouse (pointer-events: none, como o nome grande do rodapé) escapa do hit test: a
   * lista sai junto com a vigia (abaixo), e as caixas desses elementos contam como conteúdo.
   */
  let semToque: Element[] = [];
  /**
   * Os elementos vigiados (abaixo) que estão agora na faixa do canto, para o teste rápido da rolagem: em
   * cada quadro, só as caixas deles (sem hit test), o bastante para o ícone afundar a tempo.
   */
  const noCanto = new Set<Element>();
  const cruza = (caixas: DOMRect[], x0: number, y0: number, x1: number, y1: number) =>
    caixas.some((q) => q.right > x0 && q.left < x1 && q.bottom > y0 && q.top < y1 && q.width >= 1);
  const cobreRapido = (x0: number, y0: number, x1: number, y1: number) => {
    const caixas: DOMRect[] = [];
    for (const el of noCanto) {
      const estilo = getComputedStyle(el);
      if (estilo.visibility !== "visible" || estilo.display === "none") continue;
      caixas.length = 0;
      caixasDe(el, caixas);
      if (cruza(caixas, x0, y0, x1, y1)) return true;
    }
    return false;
  };

  /** Pontos de a+1 a b-1, as duas pontas inclusive, a no máximo `passo` px um do outro. */
  const pontos = (a: number, b: number, passo: number) => {
    const n = Math.max(1, Math.ceil((b - a - 2) / passo));
    return Array.from({ length: n + 1 }, (_, i) => a + 1 + ((b - a - 2) * i) / n);
  };

  /**
   * O retângulo cobre algo do conteúdo? As caixas do que não recebe o mouse e uma grade de pontos sobre o
   * retângulo, bordas inclusive, de 6 em 6 px: em cada ponto, o elemento de cima e o caractere de texto,
   * se houver (cerca de 0,1 ms por ponto com a CPU 4x mais lenta; o ícone do celular dá uns 100 pontos).
   */
  const cobre = (x0: number, y0: number, x1: number, y1: number) => {
    const caixas: DOMRect[] = [];
    for (const el of semToque) {
      const estilo = getComputedStyle(el);
      if (estilo.pointerEvents === "none" && estilo.visibility === "visible") caixasDe(el, caixas);
    }
    if (cruza(caixas, x0, y0, x1, y1)) return true;
    const xs = pontos(Math.max(0, x0), Math.min(innerWidth, x1), 6);
    for (const y of pontos(Math.max(0, y0), Math.min(innerHeight, y1), 6)) for (const x of xs) if (conteudoEm(x, y)) return true;
    return false;
  };

  /** O retângulo do ícone em pé (offsetLeft/Top não levam o transform: é o lugar de repouso). */
  const repouso = () => {
    const x0 = botao.offsetLeft;
    const y0 = botao.offsetTop;
    return { x0, y0, x1: x0 + botao.offsetWidth, y1: y0 + botao.offsetHeight, h: botao.offsetHeight };
  };
  type Repouso = ReturnType<typeof repouso>;
  /** O retângulo que o ícone ocupa, inteiro ou espiando (com a folga em volta). */
  const caixaInteiro = (r: Repouso) => [r.x0 - FOLGA, r.y0 - FOLGA, r.x1 + FOLGA, r.y1 + FOLGA] as const;
  const caixaEspiando = (r: Repouso) => [r.x0 - FOLGA, r.y0 + r.h * AFUNDA - FOLGA, r.x1 + FOLGA, innerHeight] as const;

  /** Faz o teste com o ícone fora do hit test do navegador. */
  const semIcone = <T,>(f: () => T): T => {
    const antes = botao.style.pointerEvents;
    botao.style.pointerEvents = "none";
    try {
      return f();
    } finally {
      botao.style.pointerEvents = antes;
    }
  };

  // ----- o estado com a página parada -----

  /**
   * De 768px para cima: inteiro, sempre (mesmo por cima de uma lasca do conteúdo). No celular: o mais à
   * vista que não cubra nada (inteiro; senão espiando; senão escondido, e o caminho é o item do menu).
   */
  const escolher = (): Estado => {
    if (document.documentElement.classList.contains("mac-aberto")) return "inteiro";
    // Durante a chegada da página (a abertura), ele espera fora da tela: sobe quando ela pousa.
    if (document.documentElement.dataset.abertura) return "escondido";
    if (largo.matches) return "inteiro";
    const r = repouso();
    return semIcone(() => (!cobre(...caixaInteiro(r)) ? "inteiro" : !cobre(...caixaEspiando(r)) ? "espiando" : "escondido"));
  };

  /**
   * Animações do conteúdo ainda andando (um nome que sobe no rodapé, um cartão que assenta): só as que
   * acabam, na linha do tempo do documento (as que repetem para sempre e as presas à rolagem não contam).
   */
  const andando = () =>
    document.getAnimations().filter((a) => {
      if (a.playState !== "running" || a.timeline !== document.timeline) return false;
      const alvo = (a.effect as KeyframeEffect | null)?.target;
      if (alvo && botao.contains(alvo)) return false;
      return Number.isFinite(Number(a.effect?.getComputedTiming().endTime));
    });

  let conferir = 0;
  let rodada = 0;
  /**
   * Confere o lugar quando a página para (a rolagem, o tamanho, um clique que abre ou fecha algo). No
   * celular, afundar vale na hora e subir espera o conteúdo que ainda anda parar (até 1,5 s), para não
   * subir por cima de um texto que está chegando.
   */
  const conferirDepois = (espera = 160) => {
    clearTimeout(conferir);
    const vez = ++rodada;
    conferir = window.setTimeout(async () => {
      // No celular, enquanto a estante da home acende (as luzes, a onda e o brilho, `data-acendendo`), o hit test
      // do canto espera: ele pesava justo no clímax da chegada (D84).
      if (!largo.matches && document.querySelector("[data-acendendo]")) return conferirDepois(400);
      let e = escolher();
      if (!largo.matches && NIVEL[e] < NIVEL[atual()]) {
        const a = andando();
        if (a.length) {
          await Promise.race([Promise.allSettled(a.map((x) => x.finished)), new Promise((r) => setTimeout(r, 1500))]);
          if (vez !== rodada) return;
          e = escolher();
        }
      }
      aplicar(e);
    }, espera);
  };

  /**
   * Depois de algo que mexe no conteúdo, confere já e de novo um pouco depois: há chegadas feitas por
   * script (GSAP, que `getAnimations` não vê) e cartões que só entram depois do aviso de fim da abertura.
   */
  let serie: number[] = [];
  const conferirEmSerie = (espera = 60, revigiar = true) => {
    for (const t of serie) clearTimeout(t);
    conferirDepois(espera);
    if (revigiar) vigiarDepois();
    serie = [espera + 700, espera + 1600].map((t) => window.setTimeout(() => conferirDepois(0), t));
  };

  /**
   * No celular, o conteúdo que chega ou sai do canto sem rolagem (a chegada da página, feita com GSAP; um
   * cartão que pousa; a gaveta que abre): um IntersectionObserver com a raiz encolhida à faixa do canto
   * (da borda esquerda ao lado direito do ícone, do topo dele em pé até a borda de baixo da tela, e
   * `ANTECIPA` px além dela, para cima e para baixo) avisa quando um texto, controle ou imagem entra ou
   * sai dela. Se agora cobre, afunda já (no próximo quadro); subir, só com a página parada. Rolando, quem
   * cuida é a rolagem (abaixo), e aqui só se anota o que está no canto.
   */
  const ALVOS = `${CONTROLE}, ${IMAGEM}, p, h1, h2, h3, h4, h5, h6, li, dt, dd, th, td, pre, blockquote, figcaption`;
  const ANTECIPA = 240;
  let olhando = false;
  let rolandoAte = 0;
  const afundarSePreciso = (registros: IntersectionObserverEntry[]) => {
    for (const r of registros) {
      if (r.isIntersecting) noCanto.add(r.target);
      else noCanto.delete(r.target);
    }
    if (largo.matches || performance.now() < rolandoAte) return;
    conferirDepois(160);
    if (olhando) return;
    olhando = true;
    requestAnimationFrame(() => {
      olhando = false;
      const e = escolher();
      if (NIVEL[e] > NIVEL[atual()]) aplicar(e);
    });
  };
  let vigia: IntersectionObserver | undefined;
  const vigiar = () => {
    vigia?.disconnect();
    vigia = undefined;
    noCanto.clear();
    semToque = [];
    if (largo.matches) return;
    const r = repouso();
    const margem = `${ANTECIPA - Math.max(0, r.y0 - FOLGA)}px ${-Math.max(0, innerWidth - r.x1 - FOLGA)}px ${ANTECIPA}px 0px`;
    vigia = new IntersectionObserver(afundarSePreciso, { rootMargin: margem });
    for (const el of document.querySelectorAll(ALVOS)) {
      if (botao.contains(el) || el.closest(".mac, .mac-fora")) continue;
      vigia.observe(el);
      if (getComputedStyle(el).pointerEvents === "none") semToque.push(el);
    }
  };
  let vigiarLogo = 0;
  const vigiarDepois = () => {
    clearTimeout(vigiarLogo);
    vigiarLogo = window.setTimeout(vigiar, 200);
  };

  // ----- rolando -----

  /**
   * Para baixo, afunda 60% e fica espiando (o C2: "quando rolo ele vai para baixo e some um pouco"); para
   * cima, volta inteiro; parado, volta inteiro depois de `VOLTA` ms. No celular, para cima ele não sobe
   * (espera a página parar e confere) e, a cada quadro, se o conteúdo que passa embaixo encostar na parte
   * à vista (o teste rápido, pelas caixas do que está no canto, olhando uns 4 quadros adiante), afunda
   * mais um degrau, depressa (`.rolando`), para não cobrir nada nem durante a rolagem.
   */
  let ultimo = scrollY;
  let ultimoQuadro = scrollY;
  let agendado = false;
  let largarRolando = 0;
  addEventListener(
    "scroll",
    () => {
      rolandoAte = performance.now() + 200;
      conferirEmSerie(largo.matches ? VOLTA : 160, false);
      if (!largo.matches) {
        clearTimeout(largarRolando);
        botao.classList.add("rolando");
        largarRolando = window.setTimeout(() => botao.classList.remove("rolando"), 260);
      }
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        if (document.documentElement.classList.contains("mac-aberto") || document.documentElement.dataset.abertura) return;
        const y = scrollY;
        const passo = y - ultimoQuadro;
        ultimoQuadro = y;
        let estado = atual();
        if (Math.abs(y - ultimo) >= 8) {
          if (y > ultimo && y > 80 && estado === "inteiro") estado = "espiando";
          else if (y < ultimo && largo.matches) estado = "inteiro";
          ultimo = y;
        }
        if (!largo.matches && estado !== "escondido") {
          const abaixo = Math.min(ANTECIPA, Math.max(0, passo * 4));
          const acima = Math.min(ANTECIPA, Math.max(0, -passo * 4));
          const cobreAgora = (x0: number, y0: number, x1: number, y1: number) => cobreRapido(x0, y0 - acima, x1, y1 + abaixo);
          const r = repouso();
          if (estado === "inteiro" ? cobreAgora(...caixaInteiro(r)) : cobreAgora(...caixaEspiando(r)))
            estado = estado === "inteiro" && !cobreAgora(...caixaEspiando(r)) ? "espiando" : "escondido";
        }
        if (estado !== atual()) aplicar(estado);
      });
    },
    { passive: true },
  );
  addEventListener(
    "resize",
    () => {
      conferirDepois(200);
      vigiarDepois();
    },
    { passive: true },
  );
  // O conteúdo muda sem rolar (um filtro, a gaveta, um livro que abre, o modo dos cartões): confere de novo.
  addEventListener("click", () => conferirEmSerie(300), { capture: true, passive: true });
  addEventListener("keyup", () => conferirEmSerie(300), { capture: true, passive: true });
  // A abertura do site acabou, as fontes chegaram, a página carregou, o tema trocou, o computador fechou.
  for (const evento of ["cs:aberto", "cs:chegou", "cartoes:prontos", "tema:mudou", "preferencias:relidas", "load", "mac:saiu", "pageshow"])
    addEventListener(evento, () => conferirEmSerie());
  void document.fonts?.ready.then(() => conferirEmSerie());
  largo.addEventListener("change", () => conferirEmSerie(0));

  /**
   * O mouse que chega perto do ícone afundado (ou, no celular, fora da tela: encostar no canto de baixo, à
   * esquerda, como no Dock que se esconde) chama o ícone inteiro, e ele fica enquanto o mouse estiver por
   * perto (o hover sozinho piscaria: o ícone sobe e sai de baixo do mouse).
   */
  let chamado = false;
  const chamar = (sim: boolean) => {
    if (sim === chamado) return;
    chamado = sim;
    botao.classList.toggle("chamado", sim);
  };
  let ponto: { x: number; y: number } | null = null;
  let medindo = false;
  addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      ponto = { x: e.clientX, y: e.clientY };
      if (medindo) return;
      medindo = true;
      requestAnimationFrame(() => {
        medindo = false;
        if (!ponto) return;
        const r = repouso();
        if (!chamado) {
          const perto = atual() === "escondido" ? ponto.x <= r.x1 + 16 && ponto.y >= innerHeight - 24 : ponto.x <= r.x1 + 48 && ponto.y >= r.y0 - 48;
          if (atual() !== "inteiro" && perto) chamar(true);
        } else if (ponto.x > r.x1 + 96 || ponto.y < r.y0 - 96) chamar(false);
      });
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => chamar(false));

  aplicar(escolher());
  conferirEmSerie(900);
}
