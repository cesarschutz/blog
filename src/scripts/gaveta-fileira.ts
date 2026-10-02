/**
 * A gaveta da fileira de livros 3D da home (rodada 3, área 10, P7: as animações do blog de hoje de mover
 * o livro, "seria legal principalmente na home"). Colecao.astro (a fileira) e Gaveta.astro (a gaveta e os
 * sumários, em <template>) dão a marcação; aqui fica o movimento, com GSAP sob demanda.
 *
 * Tirar (clique, toque ou Enter no livro da fileira):
 * 1. o livro sai da fileira para a frente (rodada 4, direção §2): desce um nada e cresce até 1,1, passando por
 *    cima da frente do chão (0,26s);
 * 2. o livro 3D da gaveta toma o lugar dele, na mesma pose (o giro da fileira e, se o mouse estava em
 *    cima, o giro do hover, que volta ao repouso no caminho), e desce até a gaveta, abaixo da fileira (0,9s,
 *    power3.inOut), girando até os 38° e crescendo até a capa ter 180px; o lugar na fileira fica vazio, com
 *    o contorno tracejado e o abajur e a luz embaixo dele acesos (Colecao.astro, `.retirado`, P18-3);
 * 3. a gaveta abre enquanto isso (0,8s): o tampo se descobre de cima para baixo (clip-path) e o que vem
 *    depois na página desce junto (transform), sem pulo. Nada de animar altura;
 * 4. no pouso, o sumário aparece (0,35s) e a contagem roda para cima (T3, contador.ts).
 *
 * Guardar ("Fechar livro", Esc, o lugar vazio ou o mesmo livro): o livro volta ao lugar dele (0,6s),
 * pousa e assenta; a gaveta fecha (0,5s) e o que vem depois sobe. Clicar em outro livro guarda o primeiro
 * e tira o segundo, com a gaveta aberta (só o que muda de altura desliza). Um pedido feito durante um
 * movimento espera ele acabar (vale o último).
 *
 * O hover do livro 3D é do construtor A (livro-vivo.css e .ts): durante o voo, o livro da fileira e o da
 * gaveta levam `data-livro-parado`, e ele não se mexe. O `.livro-3d` é o giro (aqui, o GSAP); o
 * `.livro-vivo`, por cima dele, é do hover.
 *
 * O teclado: Enter abre e leva o foco ao nome do livro na gaveta; Esc guarda e devolve o foco ao livro da
 * fileira. Com movimento reduzido, o livro aparece na gaveta e o lugar fica vazio, sem animação. Sem o
 * GSAP (a rede falhou), o livro é o que ele é sem JS: o link para a página dele.
 */
import { GIRO, medidasDoLivro3D } from "../lib/livro-3d";
import { criarContador, mudarContador } from "./contador";
import { carregarGsap, movimentoReduzido, type GSAP } from "./gsap";

/** A altura do livro na gaveta: a capa fica com 180px de largura (480/720 de 270). */
const ALTURA = 270;
/** O livro sai da fileira para a frente: o tempo, o quanto cresce e o quanto desce (em alturas do livro). */
const PUXA = 0.26;
const PUXA_CRESCE = 1.1;
const PUXA_DESCE = 0.06;
/** E desce para a gaveta. */
const VOO = 0.9;
/** A gaveta abre (começa logo depois do clique). */
const ABRE = 0.8;
const ABRE_EM = 0.06;
/** O livro volta ao lugar. */
const VOLTA = 0.6;
/** A gaveta fecha. */
const FECHA = 0.5;
const CURVA = "power3.inOut";

type Aberto = { id: string; lugar: HTMLElement; link: HTMLAnchorElement; no: HTMLElement };
type Pedido = { id?: string; foco: boolean };

/**
 * O que vem depois de `el` na página, no fluxo (os irmãos dele e os dos ancestrais, até o <body>): desce e
 * sobe junto com a gaveta. Ficam de fora o que é fixo ou absoluto e o que não aparece.
 */
export function depoisDe(el: HTMLElement): HTMLElement[] {
  const lista: HTMLElement[] = [];
  for (let at: HTMLElement | null = el; at && at !== document.body; at = at.parentElement) {
    for (let s = at.nextElementSibling as HTMLElement | null; s; s = s.nextElementSibling as HTMLElement | null) {
      if (/^(SCRIPT|STYLE|TEMPLATE|DIALOG|LINK|META)$/.test(s.tagName) || s.hidden) continue;
      const cs = getComputedStyle(s);
      if (cs.display === "none" || cs.position === "fixed" || cs.position === "absolute") continue;
      lista.push(s);
    }
  }
  return lista;
}

/**
 * Muda a altura de `el` (a gaveta abre, troca de livro ou fecha) e devolve o quanto o que vem depois andou
 * e quem dele fica à vista: essas peças voltam ao lugar antigo por transform e deslizam até o novo (nada
 * de animar altura, que refaria o layout da página a cada quadro).
 */
export function semPulo(el: HTMLElement, mudar: () => void) {
  const depois = depoisDe(el);
  const ref = depois[0];
  const antes = ref ? ref.getBoundingClientRect().top : 0;
  mudar();
  const delta = ref ? ref.getBoundingClientRect().top - antes : 0;
  const pecas = depois.filter((p) => p.getBoundingClientRect().top - Math.max(0, delta) < innerHeight);
  return { pecas, delta };
}

export function gavetaDaFileira() {
  const gaveta = document.querySelector<HTMLElement>("[data-gaveta='fileira']");
  const colecao = document.querySelector<HTMLElement>("[data-colecao='home']");
  if (!gaveta || !colecao) return;
  const tampo = gaveta.querySelector<HTMLElement>(".gaveta-tampo");
  const raiz = document.documentElement;
  const lugares = new Map<string, { lugar: HTMLElement; link: HTMLAnchorElement }>();
  for (const lugar of colecao.querySelectorAll<HTMLElement>("[data-livro-colecao]")) {
    const link = lugar.querySelector<HTMLAnchorElement>("a[data-tirar]");
    if (link) lugares.set(lugar.dataset.livroColecao!, { lugar, link });
  }
  if (!lugares.size) return;

  // ---------- montar ----------

  // O desenho da capa (ou o emblema da revista) só vem quando o livro abre (D30, D32).
  const desenhos = new Map<string, Promise<string>>();
  function trazerDesenho(no: HTMLElement) {
    for (const alvo of no.querySelectorAll<HTMLElement>("[data-desenho]")) {
      const endereco = alvo.dataset.desenho!;
      if (!desenhos.has(endereco)) {
        desenhos.set(endereco, fetch(endereco).then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status))))));
      }
      desenhos
        .get(endereco)!
        .then((svg) => (alvo.innerHTML = svg))
        .catch(() => desenhos.delete(endereco));
    }
  }

  /** O livro e o sumário do molde, no tamanho da gaveta, no lugar do que estava nela (menos `manter`). */
  function montar(id: string, manter?: HTMLElement) {
    const modelo = document.querySelector<HTMLTemplateElement>(`template[data-modelo="${id}"]`)!;
    const no = modelo.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const m = medidasDoLivro3D(Number(no.dataset.largura), ALTURA);
    for (const [k, v] of Object.entries(m)) no.style.setProperty(`--${k}`, `${v}px`);
    for (const velho of gaveta!.querySelectorAll(".livro-aberto")) if (velho !== manter) velho.remove();
    gaveta!.append(no);
    gaveta!.hidden = false;
    trazerDesenho(no);
    return no;
  }

  const partes = (no: HTMLElement) => ({
    voo: no.querySelector<HTMLElement>(".livro-na-gaveta")!,
    livro: no.querySelector<HTMLElement>(".livro-3d")!,
    vivo: no.querySelector<HTMLElement>(".livro-vivo"),
    sumario: no.querySelector<HTMLElement>(".sumario-livro")!,
    lupa: no.querySelector<HTMLElement>(".lupa")!,
    titulo: no.querySelector<HTMLElement>("[data-titulo-sumario]"),
  });

  /**
   * A gaveta à vista: rola até ela, se ela ficar para baixo da tela. Cabendo na tela, ela inteira; senão
   * (no celular, com o sumário embaixo do livro), até o pé do livro, para a fileira não sumir por cima.
   */
  function rolarAte(direto: boolean, no: HTMLElement) {
    const r = gaveta!.getBoundingClientRect();
    const cabecalho = document.querySelector(".topo-fixo")?.getBoundingClientRect().bottom ?? 0;
    const cabe = r.height + 40 <= innerHeight - cabecalho;
    const livro = no.querySelector<HTMLElement>(".livro-na-gaveta");
    const pe = cabe || !livro ? r.bottom : r.top + no.offsetTop + livro.offsetTop + livro.offsetHeight + 28;
    const alvo = Math.min(pe + 24, r.top - 16 + (innerHeight - cabecalho));
    const falta = alvo - innerHeight;
    if (falta > 0) scrollBy({ top: falta, behavior: direto || movimentoReduzido.matches ? "auto" : "smooth" });
  }

  // ---------- o livro sobre o livro ----------

  /** O giro (rotateY) do `.livro-3d`, lido da matriz. */
  const anguloY = (el: HTMLElement) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return (Math.atan2(-m.m13, m.m11) * 180) / Math.PI;
  };

  /**
   * Onde pôr o livro da gaveta para ele cobrir o da fileira: o deslocamento entre os centros e a escala
   * que iguala as alturas, com o livro da gaveta no mesmo giro (medido na tela: a vista de um pouco acima
   * e a perspectiva de cada caixa são proporcionais ao livro, e os dois ficam com a mesma cara).
   */
  function sobreOLivro(gsap: GSAP, voo: HTMLElement, livro: HTMLElement, alvo: HTMLElement) {
    const a = alvo.getBoundingClientRect();
    const giro = anguloY(alvo);
    const antes = { x: gsap.getProperty(voo, "x"), y: gsap.getProperty(voo, "y"), scale: gsap.getProperty(voo, "scaleX") };
    const giroAntes = gsap.getProperty(livro, "rotationY");
    gsap.set(voo, { x: 0, y: 0, scale: 1 });
    gsap.set(livro, { rotationY: giro });
    const f = livro.getBoundingClientRect();
    const c = voo.getBoundingClientRect();
    gsap.set(voo, antes);
    gsap.set(livro, { rotationY: giroAntes });
    const scale = a.height / f.height;
    const cx = c.left + c.width / 2;
    const cy = c.top + c.height / 2;
    return {
      x: a.left + a.width / 2 - cx - scale * (f.left + f.width / 2 - cx),
      y: a.top + a.height / 2 - cy - scale * (f.top + f.height / 2 - cy),
      scale,
      giro,
    };
  }

  /**
   * O hover do livro da fileira (o `.livro-vivo`, do construtor A) passa para o livro da gaveta, que
   * volta dele ao repouso no caminho (Web Animations, sem preencher: no fim vale o CSS, que é o repouso).
   */
  function herdarPose(de: HTMLElement | null, para: HTMLElement | null) {
    if (!de || !para) return;
    const cs = getComputedStyle(de);
    const rotate = cs.rotate && cs.rotate !== "none" ? cs.rotate : "0deg";
    if (cs.transform === "none" && rotate === "0deg") return;
    para.animate(
      [
        { transform: cs.transform, rotate },
        { transform: "none", rotate: "0deg" },
      ],
      { duration: 450, easing: "cubic-bezier(0.5, 1, 0.89, 1)" },
    );
  }

  // O livro da fileira, fora dela, não leva o nome de transição para a página do livro (D29).
  const guardarVt = (lugar: HTMLElement) => {
    const el = lugar.querySelector<HTMLElement>("[data-vt]");
    if (!el) return;
    el.dataset.vtGuardado = el.dataset.vt;
    delete el.dataset.vt;
  };
  const devolverVt = (lugar: HTMLElement) => {
    const el = lugar.querySelector<HTMLElement>("[data-vt-guardado]");
    if (!el) return;
    el.dataset.vt = el.dataset.vtGuardado;
    delete el.dataset.vtGuardado;
  };

  // ---------- a contagem que roda ----------

  let contaAnterior = 0;
  function rodarConta(no: HTMLElement) {
    const el = no.querySelector<HTMLElement>("[data-conta-sumario]");
    if (!el) return;
    const n = Number(el.dataset.contaSumario);
    if (!movimentoReduzido.matches) {
      criarContador(el, contaAnterior, Math.max(String(n).length, String(contaAnterior).length));
      requestAnimationFrame(() => requestAnimationFrame(() => mudarContador(el, n)));
    }
    contaAnterior = n;
  }

  // ---------- tirar e guardar ----------

  let aberto: Aberto | null = null;
  const fim = (tl: gsap.core.Timeline) => tl.then(() => undefined);

  /**
   * O livro aberto volta ao lugar dele na fileira: o sumário some, o livro voa de volta (0,6s), chega um
   * nada acima do lugar e assenta. Devolve a linha do tempo (sem a gaveta, que é de quem chamou).
   */
  function voltar(gsap: GSAP, a: Aberto, foco: boolean, trocando: boolean) {
    const { lugar, link, no } = a;
    const p = partes(no);
    const focoDentro = gaveta!.contains(document.activeElement);
    const daFileira = lugar.querySelector<HTMLElement>(".livro-3d")!;
    const devolver = () => {
      lugar.classList.remove("retirado");
      link.setAttribute("aria-expanded", "false");
      devolverVt(lugar);
      // O livro da fileira volta a responder ao mouse um instante depois de assentar.
      setTimeout(() => delete lugar.dataset.livroParado, 180);
      if (foco || (focoDentro && !trocando)) link.focus({ preventScroll: !foco });
    };
    const tl = gsap.timeline();
    if (movimentoReduzido.matches) return tl.add(devolver);
    p.voo.dataset.livroParado = "";
    const destino = sobreOLivro(gsap, p.voo, p.livro, daFileira);
    const pouso = Math.max(3, link.offsetHeight * 0.03);
    return tl
      .to([p.sumario, p.lupa], { autoAlpha: 0, duration: 0.18, ease: "power1.in" }, 0)
      .set(p.voo, { zIndex: 6 }, 0)
      .to(p.voo, { x: destino.x, y: destino.y - pouso, scale: destino.scale, duration: VOLTA, ease: CURVA }, 0)
      .to(p.livro, { rotationY: destino.giro, duration: VOLTA, ease: CURVA }, 0)
      .add(() => {
        gsap.set(p.voo, { autoAlpha: 0 });
        devolver();
        gsap.fromTo(link, { y: -pouso }, { y: 0, duration: 0.16, ease: "power2.in", clearProps: "transform" });
      }, VOLTA);
  }

  /**
   * Tira o livro `id` da fileira e o leva para a gaveta. Com `saindo` (trocar de livro), o que estava
   * aberto volta ao lugar ao mesmo tempo: ele sai do fluxo da gaveta (fica onde estava, por cima) e o
   * novo começa a vir para a frente quando o outro já está no caminho de volta.
   */
  async function abrir(gsap: GSAP, id: string, foco: boolean, saindo?: Aberto) {
    const { lugar, link } = lugares.get(id)!;
    const trocando = !gaveta!.hidden;
    const H1 = trocando ? gaveta!.offsetHeight : 0;
    colecao!.dataset.gaveta = "movendo";
    lugar.dataset.livroParado = "";
    link.setAttribute("aria-expanded", "true");
    link.classList.remove("cochila");
    const daFileira = lugar.querySelector<HTMLElement>(".livro-3d")!;
    const vivoDaFileira = lugar.querySelector<HTMLElement>(".livro-vivo");
    // A volta do outro é medida antes de o novo entrar na gaveta (o lugar dele ainda é o de agora).
    const volta = saindo ? voltar(gsap, saindo, false, true) : null;
    let no!: HTMLElement;
    const { pecas, delta } = semPulo(gaveta!, () => {
      if (saindo) {
        // O que sai fica onde está, por cima, fora do fluxo; o novo toma o lugar dele na gaveta.
        const velho = saindo.no;
        Object.assign(velho.style, { position: "absolute", top: `${velho.offsetTop}px`, left: `${velho.offsetLeft}px`, width: `${velho.offsetWidth}px`, zIndex: "2" });
        volta!.add(() => velho.remove());
      }
      no = montar(id, saindo?.no);
    });
    const H = gaveta!.offsetHeight;
    const p = partes(no);
    aberto = { id, lugar, link, no };
    guardarVt(lugar);

    const pronto = () => {
      colecao!.dataset.gaveta = "aberta";
      if (foco) p.titulo?.focus({ preventScroll: true });
    };

    if (movimentoReduzido.matches) {
      lugar.classList.add("retirado");
      rodarConta(no);
      rolarAte(true, no);
      return pronto();
    }

    // No mesmo quadro em que a gaveta cresce: o livro e o sumário escondidos, o que vem depois no lugar
    // antigo e o tampo coberto (ou na altura do livro anterior).
    p.voo.dataset.livroParado = "";
    gsap.set(p.voo, { autoAlpha: 0 });
    gsap.set([p.sumario, p.lupa], { autoAlpha: 0 });
    if (pecas.length && delta) gsap.set(pecas, { y: -delta });
    const tl = gsap.timeline();
    // Trocando, o novo vem para a frente quando o outro já fez metade do caminho de volta.
    const t0 = volta ? VOLTA * 0.5 : 0;
    if (volta) tl.add(volta, 0);
    if (tampo && !trocando) {
      gsap.set(tampo, { clipPath: "inset(0% 0% 100% 0%)" });
      tl.to(tampo, { clipPath: "inset(0% 0% 0% 0%)", duration: ABRE, ease: CURVA, clearProps: "clipPath" }, ABRE_EM);
    } else if (tampo && H !== H1) {
      const M = Math.max(H, H1);
      gsap.set(tampo, { height: M, bottom: "auto", clipPath: `inset(0px 0px ${M - H1}px 0px)` });
      tl.to(tampo, { clipPath: `inset(0px 0px ${M - H}px 0px)`, duration: ABRE * 0.8, ease: CURVA, clearProps: "height,bottom,clipPath" }, t0);
    }
    if (pecas.length && delta) tl.to(pecas, { y: 0, duration: trocando ? ABRE * 0.8 : ABRE, ease: CURVA, clearProps: "transform" }, trocando ? t0 : ABRE_EM);

    // 1. o livro sai da fileira para a frente: desce um nada (vindo para quem olha, de um pouco acima) e cresce
    //    até 1,1, com o pé passando por cima da frente do chão
    tl.to(link, { y: link.offsetHeight * PUXA_DESCE, scale: PUXA_CRESCE, duration: PUXA, ease: "power2.out", transformOrigin: "50% 100%" }, t0);
    // 2. o da gaveta toma o lugar dele, na mesma pose, e o lugar fica vazio
    tl.add(() => {
      herdarPose(vivoDaFileira, p.vivo);
      // Só a posição e a escala vão para o voo; o giro é do `.livro-3d`, logo abaixo (passar o objeto
      // inteiro dava "Invalid property giro" no console, revisão final da rodada 3).
      const pose = sobreOLivro(gsap, p.voo, p.livro, daFileira);
      gsap.set(p.voo, { x: pose.x, y: pose.y, scale: pose.scale, autoAlpha: 1, zIndex: 6, transformOrigin: "50% 50%" });
      gsap.set(p.livro, { rotationY: anguloY(daFileira) });
      lugar.classList.add("retirado");
      gsap.set(link, { clearProps: "transform" });
      rolarAte(false, no);
    }, t0 + PUXA);
    // 3. e desce até a gaveta, girando até os 38° e crescendo
    const t1 = t0 + PUXA;
    tl.to(p.voo, { x: 0, y: 0, scale: 1, duration: VOO, ease: CURVA }, t1)
      .to(p.livro, { rotationY: GIRO, duration: VOO, ease: CURVA }, t1)
      .set(p.voo, { zIndex: "auto" }, t1 + VOO)
      // 4. no pouso, o sumário e a contagem
      .fromTo(p.sumario, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, t1 + VOO - 0.25)
      .to(p.lupa, { autoAlpha: 1, duration: 0.25, ease: "none" }, "<")
      .add(() => rodarConta(no), t1 + VOO - 0.2);
    await fim(tl);
    gsap.set([p.voo, p.livro, p.sumario, p.lupa], { clearProps: "transform,zIndex,opacity,visibility" });
    delete p.voo.dataset.livroParado;
    pronto();
  }

  /** Guarda o livro aberto e fecha a gaveta: o que vem depois sobe junto com o tampo. */
  async function guardar(gsap: GSAP, foco: boolean) {
    if (!aberto) return;
    const a = aberto;
    aberto = null;
    colecao!.dataset.gaveta = "movendo";
    const esvaziar = () => {
      gaveta!.hidden = true;
      a.no.remove();
      delete colecao!.dataset.gaveta;
    };
    const tl = voltar(gsap, a, foco, false);
    if (movimentoReduzido.matches) {
      // Direto: o livro volta ao lugar (a linha do tempo só chama `devolver`) e a gaveta some.
      semPulo(gaveta!, esvaziar);
      return;
    }
    // Quanto o que vem depois sobe: a altura da gaveta com a margem de cima (sem esconder para medir, o
    // que refazia o layout da página duas vezes no clique).
    const delta = -(gaveta!.offsetHeight + (parseFloat(getComputedStyle(gaveta!).marginTop) || 0));
    const pecas = depoisDe(gaveta!).filter((p) => p.getBoundingClientRect().top + delta < innerHeight);
    const em = VOLTA - 0.3;
    if (tampo) tl.to(tampo, { clipPath: "inset(0% 0% 100% 0%)", duration: FECHA, ease: CURVA }, em);
    if (pecas.length && delta) tl.to(pecas, { y: delta, duration: FECHA, ease: CURVA }, em);
    await fim(tl);
    esvaziar();
    gsap.set([...pecas, ...(tampo ? [tampo] : [])], { clearProps: "transform,clipPath" });
  }

  // ---------- os pedidos ----------

  let ocupado = false;
  let pendente: Pedido | null = null;

  async function pedir(p: Pedido) {
    if (ocupado) return void (pendente = p);
    if (!p.id && !aberto) return;
    ocupado = true;
    try {
      const gsap = await carregarGsap().catch(() => null);
      if (!gsap) {
        // Sem o GSAP, o livro leva à página dele (D54).
        if (p.id) location.assign(lugares.get(p.id)!.link.href);
        return;
      }
      if (!p.id || p.id === aberto?.id) await guardar(gsap, p.foco);
      else {
        const saindo = aberto ?? undefined;
        aberto = null;
        await abrir(gsap, p.id, p.foco, saindo);
      }
    } finally {
      ocupado = false;
      const proximo = pendente;
      pendente = null;
      if (proximo) pedir(proximo);
    }
  }

  const clique = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  for (const [id, { link }] of lugares) {
    link.setAttribute("aria-controls", "gaveta");
    link.setAttribute("aria-expanded", "false");
    link.addEventListener("click", (e) => {
      if (!clique(e) || raiz.dataset.abertura) return;
      e.preventDefault();
      pedir({ id, foco: e.detail === 0 });
    });
  }
  gaveta.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("[data-fechar-livro]")) pedir({ foco: e.detail === 0 });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || (!aberto && !ocupado) || document.querySelector("dialog[open]")) return;
    pedir({ foco: true });
  });
  // O GSAP chega antes do primeiro clique: no mouse sobre a coleção, no toque ou no foco.
  for (const evento of ["pointerenter", "touchstart", "focusin"]) {
    colecao.addEventListener(evento, () => void carregarGsap().catch(() => {}), { once: true, passive: true });
  }
}
