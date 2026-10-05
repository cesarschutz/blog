/**
 * Figura em passos (em prova, D67): o leitor monta a figura passo a passo (FiguraPassos.astro).
 *
 * A figura abre inteira, como uma figura parada. "Passo a passo" volta à base, e cada passo só soma: os
 * elementos com data-passo ≤ o passo da vez ficam à vista, e o resto espera. Ao avançar, o que entra
 * aparece em ordem (até três tempos, `etapa-1` a `etapa-3`), o selo do passo acende, um ponto percorre o
 * trajeto (`.trajeto`, um path com pathLength="1") uma vez e os passos anteriores esmaecem um pouco. No
 * último passo, ou em "Ver tudo", a figura volta inteira. Nada anda sozinho, nada repete, nada some (só ao
 * voltar um passo, o passo desfeito sai). Com movimento reduzido, as trocas são imediatas.
 */

const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
const reduzido = () => movimentoReduzido.matches;
/** Um tempo dentro do passo (etapa-2 entra um tempo depois da etapa-1), em ms. */
const TEMPO = 1000;

export function montarFigurasEmPassos() {
  for (const figura of document.querySelectorAll<HTMLElement>(".figura-passos:not([data-pronto])")) montar(figura);
}

function montar(figura: HTMLElement) {
  const total = Number(figura.dataset.total);
  const svg = figura.querySelector<SVGSVGElement>(".figura-palco > svg");
  const palco = figura.querySelector<HTMLElement>(".figura-palco");
  const barra = figura.querySelector<HTMLElement>(".passos-barra");
  const comecar = figura.querySelector<HTMLButtonElement>(".passos-comecar");
  const anterior = figura.querySelector<HTMLButtonElement>(".passos-anterior");
  const proximo = figura.querySelector<HTMLButtonElement>(".passos-proximo");
  const tudo = figura.querySelector<HTMLButtonElement>(".passos-tudo");
  const contador = figura.querySelector<HTMLElement>(".passos-contador");
  if (!svg || !palco || !barra || !comecar || !anterior || !proximo || !tudo || !contador || !total) return;

  const pecas = new Map<number, SVGElement[]>();
  for (const el of svg.querySelectorAll<SVGElement>("[data-passo]")) {
    const n = Number(el.dataset.passo);
    pecas.set(n, [...(pecas.get(n) ?? []), el]);
  }
  for (const el of svg.querySelectorAll("[data-passo]")) el.classList.add("visivel");

  // Cada item da lista vira um botão que leva àquele passo.
  const itens = [...figura.querySelectorAll<HTMLLIElement>(".passos-lista > li")];
  const textos = itens.map((li) => li.querySelector(".passos-texto")?.textContent?.trim() ?? "");
  itens.forEach((li, i) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "passos-botao";
    botao.append(...li.childNodes);
    li.append(botao);
    botao.addEventListener("click", () => ir(i + 1));
  });

  const numero = contador.querySelector("b");
  const falado = document.createElement("span");
  falado.className = "passos-falado";
  contador.append(falado);
  const rotuloProximo = proximo.querySelector("span");

  /** O tempo de um elemento dentro do passo: a `etapa-N` dele ou de um grupo acima (1 sem etapa). */
  const tempoDe = (el: Element) => {
    for (let a: Element | null = el; a && a !== svg; a = a.parentElement) {
      const m = a.getAttribute("class")?.match(/\betapa-(\d)\b/);
      if (m) return Number(m[1]);
    }
    return 1;
  };

  /** 0 = a figura inteira (o começo e o "Ver tudo"); de 1 a total = montando. */
  let atual = 0;
  const animacoes = new Set<Animation>();
  const imediatos = new Set<SVGElement>();

  function animar(el: SVGElement, quadros: Keyframe[], opcoes: KeyframeAnimationOptions) {
    const animacao = el.animate(quadros, opcoes);
    animacoes.add(animacao);
    animacao.addEventListener("finish", () => animacoes.delete(animacao), { once: true });
  }

  function pararAnimacoes() {
    for (const animacao of animacoes) animacao.cancel();
    animacoes.clear();
  }

  /** Confirma as trocas imediatas juntas, em vez de forçar layout para cada peça do SVG. */
  function assentar() {
    if (!imediatos.size) return;
    void svg!.getBoundingClientRect();
    for (const el of imediatos) el.style.transition = "";
    imediatos.clear();
  }

  function mostrar(n: number, visivel: boolean, devagar: boolean) {
    for (const el of pecas.get(n) ?? []) {
      if (el.classList.contains("visivel") === visivel) continue;
      if (devagar) {
        el.classList.add("visivel");
        continue;
      }
      el.style.transition = "none";
      el.classList.toggle("visivel", visivel);
      imediatos.add(el);
    }
  }

  function ir(alvo: number, { animar = true } = {}) {
    pararAnimacoes();
    alvo = Math.min(total, Math.max(1, alvo));
    const antes = atual;
    atual = alvo;
    const mexer = animar && !reduzido();
    // Ao entrar no passo a passo (vindo da figura inteira), tudo volta à base de uma vez, e o passo
    // escolhido entra.
    if (antes === 0 && mexer) {
      mostrar(alvo, false, false);
      assentar();
    }
    for (const n of pecas.keys()) mostrar(n, n <= alvo, mexer && n === alvo && (alvo > antes || antes === 0));
    assentar();

    // Os passos anteriores esmaecem (sem sumir), para o que entrou se destacar; no último, a figura fica
    // inteira, como a figura parada.
    for (const [n, els] of pecas) for (const el of els) el.classList.toggle("antes", n < alvo && alvo < total);
    if (mexer && (alvo > antes || antes === 0)) entrar(alvo);
    marcarEntrada(alvo, mexer && (alvo > antes || antes === 0));
    destacarSelo(alvo);
    marcarLista(alvo);

    if (numero) numero.textContent = String(alvo);
    falado.textContent = `: ${textos[alvo - 1] ?? ""}`;
    const focoAntes = document.activeElement;
    anterior!.disabled = alvo === 1;
    const noFim = alvo === total;
    if (rotuloProximo) rotuloProximo.textContent = noFim ? "Do início" : "Próximo";
    proximo!.classList.toggle("recomecar", noFim);
    figura.dataset.modo = "passos";
    figura.classList.toggle("no-fim", noFim);
    tudo!.hidden = noFim;
    // Uma tecla pode voltar ao primeiro passo, esconder "Ver tudo" ou esconder "Passo a passo" (a seta para a
    // direita nele começa os passos, D82): o foco precisa continuar útil.
    if ((focoAntes === anterior && anterior!.disabled) || (focoAntes === tudo && noFim) || focoAntes === comecar) proximo!.focus({ preventScroll: true });
    trazerParaAVista(alvo, mexer);
  }

  /** A figura inteira, parada: o começo, e o "Ver tudo". */
  function verTudo() {
    pararAnimacoes();
    atual = 0;
    rolagens.forEach((r) => clearTimeout(r));
    for (const n of pecas.keys()) mostrar(n, true, false);
    assentar();
    for (const els of pecas.values()) for (const el of els) el.classList.remove("antes");
    destacarSelo(0);
    marcarLista(0);
    marcarEntrada(0, false);
    figura.dataset.modo = "tudo";
    figura.classList.remove("no-fim");
  }

  /**
   * Quando o passo termina de entrar (em prova, D67): enquanto ele entra, a figura fica com
   * `data-entrando` e a duração na variável `--duracao-passo`; quando acaba, ganha `.passo-terminou` por
   * um instante. As ideias de aviso (`data-fim`, em figura-passos.css) se penduram nisso.
   */
  let fimDoPasso = 0;
  let limparFim = 0;
  function marcarEntrada(n: number, mexer: boolean) {
    clearTimeout(fimDoPasso);
    clearTimeout(limparFim);
    figura.classList.remove("passo-terminou");
    delete figura.dataset.entrando;
    if (!mexer) return;
    const ms = duracaoDoPasso(n);
    figura.style.setProperty("--duracao-passo", `${ms}ms`);
    void figura.offsetWidth; // recomeça as animações do CSS
    figura.dataset.entrando = "";
    fimDoPasso = window.setTimeout(() => {
      delete figura.dataset.entrando;
      figura.classList.add("passo-terminou");
      limparFim = window.setTimeout(() => figura.classList.remove("passo-terminou"), 1200);
    }, ms);
  }

  /** Quanto o passo leva para entrar: o último tempo dele, mais o aparecer (0,4 s) ou o ponto (1,15 s). */
  function duracaoDoPasso(n: number) {
    let ms = 400;
    for (const el of pecas.get(n) ?? []) {
      for (const f of [el, ...el.querySelectorAll("*")]) {
        ms = Math.max(ms, (tempoDe(f) - 1) * TEMPO + (f.classList.contains("trajeto") ? 1150 : 400));
      }
    }
    return ms;
  }

  const segmentos = [...figura.querySelectorAll<HTMLElement>(".passos-segmentos > span")];

  function marcarLista(alvo: number) {
    segmentos.forEach((s, i) => {
      s.classList.toggle("feito", alvo > 0 && i + 1 < alvo);
      s.classList.toggle("atual", i + 1 === alvo);
    });
    itens.forEach((li, i) => {
      const n = i + 1;
      li.classList.toggle("atual", n === alvo);
      li.classList.toggle("feito", alvo > 0 && n < alvo);
      li.classList.toggle("adiante", alvo > 0 && n > alvo);
      const botao = li.querySelector("button");
      if (n === alvo) botao?.setAttribute("aria-current", "step");
      else botao?.removeAttribute("aria-current");
    });
  }

  /**
   * O passo que entra. Um passo pode ter até três tempos (`etapa-1`, `etapa-2`, `etapa-3`, numa peça ou
   * num grupo dentro dele), quando uma coisa leva à outra (pede, responde, grava): cada tempo aparece um
   * segundo depois do anterior, e o ponto percorre o trajeto do seu tempo.
   */
  function entrar(n: number) {
    const els = pecas.get(n) ?? [];
    for (const el of els) {
      const atrasados = [el, ...el.querySelectorAll<SVGElement>("[class*='etapa-']")].filter((a) => tempoDe(a) > 1 && !a.classList.contains("trajeto"));
      for (const a of atrasados) {
        // Um grupo atrasado dentro de outro já entra com ele.
        if (a !== el && atrasados.some((b) => b !== a && b.contains(a))) continue;
        animar(a, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: (tempoDe(a) - 1) * TEMPO, easing: "ease-out", fill: "backwards" });
      }
    }
    const trajetos = els.flatMap((el) => (el.classList.contains("trajeto") ? [el] : [...el.querySelectorAll<SVGElement>(".trajeto")]));
    for (const t of trajetos) {
      animar(t,
        [
          { strokeDashoffset: 0, strokeOpacity: 0 },
          { strokeDashoffset: -0.06, strokeOpacity: 1, offset: 0.06 },
          { strokeDashoffset: -0.94, strokeOpacity: 1, offset: 0.92 },
          { strokeDashoffset: -1, strokeOpacity: 0 },
        ],
        { duration: 900, delay: 250 + (tempoDe(t) - 1) * TEMPO, easing: "cubic-bezier(.45,.05,.4,1)", fill: "none" },
      );
    }
  }

  function destacarSelo(n: number) {
    svg!.querySelectorAll(".selo-atual").forEach((s) => s.classList.remove("selo-atual"));
    for (const el of pecas.get(n) ?? []) {
      const selos = el.classList.contains("selo") ? [el] : [...el.querySelectorAll(".selo")];
      selos.forEach((s) => s.classList.add("selo-atual"));
    }
  }

  /**
   * No celular, a figura rola de lado, e o quadro vai até o que entrou. Quem manda é o texto do passo
   * (é ele que explica): o quadro centra o passo inteiro se ele couber; senão, só os textos dele; e, se nem
   * eles couberem, acompanha os textos tempo a tempo (o tempo 2 rola um segundo depois do 1). O que é mais
   * largo que o quadro (a faixa de desfecho) não conta, e o selo só conta se couber junto.
   */
  let rolagens: number[] = [];
  const FOLGA = 20;
  const cabeNoQuadro = () => palco!.clientWidth - 2 * FOLGA;

  function caixaDe(els: Element[]) {
    const caixas = els.map((el) => el.getBoundingClientRect()).filter((c) => c.width || c.height);
    if (!caixas.length) return null;
    const esquerda = Math.min(...caixas.map((c) => c.left));
    return { esquerda, largura: Math.max(...caixas.map((c) => c.right)) - esquerda };
  }
  const cabe = (els: Element[]) => {
    const caixa = caixaDe(els);
    return !!caixa && caixa.largura <= cabeNoQuadro();
  };

  function trazerParaAVista(n: number, mexer: boolean) {
    rolagens.forEach((r) => clearTimeout(r));
    rolagens = [];
    if (palco!.scrollWidth <= palco!.clientWidth + 2) return;
    const folhas = (pecas.get(n) ?? [])
      .flatMap((el) =>
        el.children.length ? [...el.querySelectorAll<SVGGraphicsElement>("path, rect, circle, ellipse, line, polyline, polygon, text")] : [el as SVGGraphicsElement],
      )
      .filter((el) => !el.matches(".trajeto") && el.getBoundingClientRect().width <= cabeNoQuadro());
    const conteudo = folhas.filter((el) => !el.matches(".selo, .selo-texto"));
    const textos = conteudo.filter((el) => el.tagName === "text");
    if (!conteudo.length) return;
    for (const grupo of [folhas, conteudo, textos]) if (grupo.length && cabe(grupo)) return rolarPara(grupo);
    const porTempo = new Map<number, Element[]>();
    for (const el of textos.length ? textos : conteudo) {
      const t = mexer ? tempoDe(el) : 1;
      porTempo.set(t, [...(porTempo.get(t) ?? []), el]);
    }
    for (const [t, els] of porTempo) {
      if (t === 1) rolarPara(els);
      else rolagens.push(window.setTimeout(() => rolarPara(els), (t - 1) * TEMPO));
    }
  }

  function rolarPara(els: Element[]) {
    const caixa = caixaDe(els);
    if (!caixa) return;
    const quadro = palco!.getBoundingClientRect();
    if (caixa.esquerda >= quadro.left + FOLGA && caixa.esquerda + caixa.largura <= quadro.right - FOLGA) return;
    const inicio = caixa.esquerda - quadro.left + palco!.scrollLeft;
    let alvo = caixa.largura <= cabeNoQuadro() ? inicio + caixa.largura / 2 - palco!.clientWidth / 2 : inicio - FOLGA;
    // Perto de uma ponta, encosta nela (não sobra um pedaço do ator da borda), se o passo continuar à vista.
    const maximo = palco!.scrollWidth - palco!.clientWidth;
    const fim = inicio + caixa.largura;
    if (alvo < 3 * FOLGA && fim <= palco!.clientWidth - FOLGA) alvo = 0;
    else if (alvo > maximo - 3 * FOLGA && inicio >= maximo + FOLGA) alvo = maximo;
    alvo = Math.min(maximo, Math.max(0, alvo));
    palco!.scrollTo({ left: alvo, behavior: reduzido() ? "auto" : "smooth" });
  }

  comecar.addEventListener("click", () => {
    ir(1);
    proximo.focus({ preventScroll: true });
  });
  anterior.addEventListener("click", () => ir(atual - 1));
  proximo.addEventListener("click", () => ir(atual === total ? 1 : atual + 1));
  tudo.addEventListener("click", () => {
    verTudo();
    comecar.focus({ preventScroll: true });
  });
  figura.addEventListener("keydown", (ev) => {
    if (!(ev.target instanceof HTMLElement) || !ev.target.closest(".passos-barra, .passos-lista")) return;
    if (ev.key === "ArrowRight") ir(atual + 1);
    else if (ev.key === "ArrowLeft" && atual > 1) ir(atual - 1);
    else return;
    ev.preventDefault();
  });

  movimentoReduzido.addEventListener("change", () => {
    if (!reduzido()) return;
    pararAnimacoes();
    rolagens.forEach((r) => clearTimeout(r));
    rolagens = [];
    marcarEntrada(0, false);
  });

  barra.hidden = false;
  figura.dataset.pronto = "";
  verTudo();
}
