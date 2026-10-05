/**
 * O computador (rodada 3 do redesenho, C1 a C10): um macOS 27 "Golden Gate" de mentira, que abre em tela
 * cheia dentro do blog. Carregado sob demanda pelo ícone (icone.ts): nada daqui vai nas páginas.
 *
 * - `preparar()`: o CSS (as cores de cores.ts e os estilos), os dados (/mac/dados.json), o papel de parede
 *   e a área de trabalho montada, escondida (no primeiro hover, foco ou toque do ícone).
 * - `entrar(botao)`: a câmera vai até a tela do ícone (a do protótipo 12, C2): View Transition do
 *   documento, tipo "mac-entra"; a tela pequena e o computador dividem o nome "mac-tela" só durante a
 *   troca. A página fica parada e escondida embaixo (o <dialog> modal prende o foco).
 * - Sair (C9): o menu "cs" da barra ("Sair do computador"), o atalho ⌃⌥Q (Control + Option + Q; no
 *   Windows e no Linux, Ctrl + Alt + Q) e o Voltar do navegador. A câmera volta (tipo "mac-sai"). Fechar o
 *   último app não tira do computador.
 * - Esc fecha o menu aberto; senão, o Terminal suspenso; senão, a janela da frente.
 * - ⌃` (Control + crase) desce o Terminal suspenso, de cima (C5).
 * - Sem View Transitions, a tela cresce do retângulo do ícone (clip-path). Com movimento reduzido, sem
 *   câmera nem gênio: aparece e some num esmaecer curto.
 *
 * Os apps (apps/*.ts) carregam na primeira vez que abrem, cada um com o seu CSS.
 */
import cssDoSistema from "./estilos/sistema.css?inline";
import type { App, AppId, ItemDeMenu, Janela, Menu, OpcoesDeJanela, Sistema } from "./contexto";
import { cssDasCores } from "./cores";
import { carregarDados, url } from "./dados";
import { Dock } from "./dock";
import { iconeDoApp, pasta } from "./icones";
import { Janelas } from "./janelas";
import { BarraDeMenus } from "./menus";

const raizDoc = document.documentElement;
const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
const estreito = matchMedia("(max-width: 699px), (max-height: 459px)");
const CURVA = "cubic-bezier(0.65, 0, 0.25, 1)";
const TEMPO = 1050;

const NOMES: Record<AppId, string> = {
  finder: "Finder",
  previa: "Pré-Visualização",
  terminal: "Terminal",
  editor: "Código",
  sobre: "Finder",
};

/** Os apps fixos no Dock, na ordem (a direção de arte: os quatro apps, o separador e a Lixeira). */
const FIXOS: AppId[] = ["finder", "editor", "terminal", "previa"];

const CARREGAR: Record<AppId, () => Promise<{ criar(s: Sistema): App }>> = {
  finder: () => import("./apps/finder"),
  previa: () => import("./apps/previa"),
  terminal: () => import("./apps/terminal"),
  editor: () => import("./apps/editor"),
  sobre: () => import("./apps/sobre"),
};

// ---------- o estado ----------

let pronto: Promise<void> | undefined;
let raiz: HTMLDialogElement;
let tela: HTMLElement;
let mesa: HTMLElement;
let barra: BarraDeMenus;
let dock: Dock;
let janelas: Janelas;
let botaoDeOrigem: HTMLElement | undefined;
let aberto = false;
let ocupado = false;
let rolagem = 0;
let marcaDoHistorico = "";
const apps = new Map<AppId, Promise<App>>();
const prontos = new Map<AppId, App>();
const rodando = new Set<AppId>(["finder"]);
const estilos = new Set<string>();

function estilo(id: string, css: string) {
  if (estilos.has(id)) return;
  estilos.add(id);
  const el = document.createElement("style");
  el.dataset.mac = id;
  el.textContent = css;
  document.head.append(el);
}

/** Busca e monta tudo uma vez, escondido. Roda no primeiro hover, foco ou toque do ícone. */
export function preparar(): Promise<void> {
  pronto ??= (async () => {
    estilo("cores", cssDasCores());
    estilo("sistema", cssDoSistema);
    void carregarDados().catch(() => {});
    // Os dois papéis de parede já decodificados: o do tema de agora (a câmera espera por ele) e o outro
    // (a troca de tema lá dentro não pisca).
    const temaAgora = raizDoc.dataset.theme === "dark" ? "escuro" : "claro";
    const paredes = (["claro", "escuro"] as const).map((t) => {
      const img = new Image();
      img.src = url(`/mac/parede-${t}.svg`);
      return { t, pronta: img.decode().catch(() => {}) };
    });
    await Promise.race([paredes.find((p) => p.t === temaAgora)!.pronta, new Promise((r) => setTimeout(r, 600))]);
    montar();
    // Os apps mais usados já vêm, quando a página está ociosa.
    ocioso(() => void carregarApp("finder").catch(() => {}));
  })();
  pronto.catch(() => (pronto = undefined));
  return pronto;
}

const ocioso = (fazer: () => void) => ("requestIdleCallback" in window ? requestIdleCallback(() => fazer(), { timeout: 2000 }) : setTimeout(fazer, 300));

// ---------- a montagem ----------

function montar() {
  raiz = document.createElement("dialog");
  raiz.className = "mac";
  raiz.setAttribute("aria-label", "Computador");
  raiz.style.setProperty("--mac-parede-claro", `url("${url("/mac/parede-claro.svg")}")`);
  raiz.style.setProperty("--mac-parede-escuro", `url("${url("/mac/parede-escuro.svg")}")`);
  tela = document.createElement("div");
  tela.className = "mac-tela";
  raiz.append(tela);

  barra = new BarraDeMenus({
    menus: () => {
      const app = appDaFrente();
      const a = prontos.get(app === "sobre" ? "finder" : app);
      return { nomeDoApp: NOMES[app], doApp: menuDoApp(app, a), resto: a ? [...a.menus(), menuJanela(), menuAjuda()] : [menuJanela(), menuAjuda()] };
    },
    menuDoSistema,
    alternarTema: (origem) => void alternarTema(origem),
    temaEscuro: () => raizDoc.dataset.theme === "dark",
  });

  mesa = document.createElement("div");
  mesa.className = "mac-mesa";
  mesa.setAttribute("role", "group");
  mesa.setAttribute("aria-label", "Área de trabalho");
  mesa.innerHTML =
    `<button type="button" class="mac-mesa-icone" data-abre="finder" aria-label="Blog, pasta" tabindex="0"><span class="mac-mesa-figura">${pasta("mac-pasta mac-pasta--mesa")}</span><span class="mac-mesa-nome">Blog</span></button>` +
    `<button type="button" class="mac-mesa-icone" data-abre="editor" aria-label="Código, aplicativo" tabindex="-1"><span class="mac-mesa-figura">${iconeDoApp("editor")}</span><span class="mac-mesa-nome">Código</span></button>` +
    `<button type="button" class="mac-mesa-icone" data-abre="terminal" aria-label="Terminal, aplicativo" tabindex="-1"><span class="mac-mesa-figura">${iconeDoApp("terminal")}</span><span class="mac-mesa-nome">Terminal</span></button>`;

  dock = new Dock({
    tela,
    reduzido,
    aoEscolher: (tipo, chave) => void escolherNoDock(tipo, chave),
    aoMover: () => janelas?.acompanharMiniaturas(),
  });
  dock.fixar(FIXOS.map((id) => ({ id, nome: NOMES[id] })));
  // O Finder está sempre aberto no Mac: o ponto dele fica aceso desde o começo.
  dock.marcarAberto("finder", NOMES.finder, true);

  // A ordem do Tab: a barra de menus, a área de trabalho, as janelas (entram antes do Dock) e o Dock.
  tela.append(barra.el, barra.camada, mesa, dock.el);
  document.body.append(raiz);

  janelas = new Janelas({
    tela,
    dock,
    reduzido,
    estreito,
    barra: () => barra.el.offsetHeight,
    aoMudarFrente: () => barra.refazer(),
    aoFecharUltima: (app) => marcarAberto(app, false),
    nomeDoApp: (app) => NOMES[app],
    focarMesa: () => mesa.querySelector<HTMLButtonElement>('.mac-mesa-icone[tabindex="0"]')?.focus({ preventScroll: true }),
  });

  ligar();
}

// ---------- o sistema que os apps enxergam ----------

const sistema: Sistema = {
  get raiz() {
    return raiz;
  },
  get tela() {
    return tela;
  },
  reduzido,
  estreito,
  dados: carregarDados,
  abrirApp,
  janelasDo: (app) => janelas.doApp(app),
  criarJanela(op: OpcoesDeJanela): Janela {
    const j = janelas.criar(op);
    marcarAberto(op.app, true);
    return j;
  },
  atualizarMenus: () => barra.refazer(),
  pular: (app) => dock.pular(app),
  marcarAberto,
  estilo,
  sair: () => void sair(),
};

function carregarApp(id: AppId): Promise<App> {
  let p = apps.get(id);
  if (!p) {
    p = CARREGAR[id]().then((m) => {
      const app = m.criar(sistema);
      prontos.set(id, app);
      // O app da frente chegou depois da barra (o Finder, adiantado no ocioso): os menus dele entram agora.
      if (barra && appDaFrente() === (id === "sobre" ? "finder" : id)) barra.refazer();
      return app;
    });
    p.catch(() => apps.delete(id));
    apps.set(id, p);
  }
  return p;
}

async function abrirApp(id: AppId, pedido?: unknown) {
  const abrindo = !rodando.has(id) && id !== "sobre";
  if (abrindo) dock.pular(id);
  const app = await carregarApp(id);
  await app.abrir(pedido);
  if (abrindo) barra.refazer();
}

function marcarAberto(app: AppId, abertoAgora: boolean) {
  if (app === "sobre") return;
  if (app === "finder") abertoAgora = true;
  const ja = rodando.has(app);
  if (abertoAgora) rodando.add(app);
  else rodando.delete(app);
  if (ja !== abertoAgora || app === "finder") dock.marcarAberto(app, NOMES[app], abertoAgora);
}

function appDaFrente(): AppId {
  // Com o foco no Terminal suspenso, a barra de menus é a do Terminal (ele não é uma janela).
  if (raiz?.querySelector(".mac-suspenso")?.contains(document.activeElement)) return "terminal";
  return janelas?.daFrente?.app ?? "finder";
}

/** O clique num ícone do Dock: traz o app para a frente, restaura a minimizada ou abre o app. */
async function escolherNoDock(tipo: string, chave: string) {
  if (tipo === "lixeira") return abrirApp("finder", { lugar: "lixeira" });
  if (tipo === "janela") {
    const j = janelas.todas.find((o) => String(o.id) === chave);
    if (j) await j.restaurar();
    return;
  }
  const app = chave as AppId;
  const doApp = janelas.doApp(app);
  const visiveis = doApp.filter((j) => !j.minimizada);
  if (visiveis.length) {
    for (const j of visiveis) j.ativar();
    janelas.focar(visiveis[visiveis.length - 1]);
    return;
  }
  const minimizada = doApp.at(-1);
  if (minimizada) return minimizada.restaurar();
  await abrirApp(app);
}

// ---------- os menus ----------

function menuDoSistema(): ItemDeMenu[] {
  const escuro = raizDoc.dataset.theme === "dark";
  const temJanelas = (janelas?.todas.length ?? 0) > 0;
  return [
    { rotulo: "Sobre este computador", acao: () => void abrirApp("sobre") },
    { separador: true },
    { rotulo: "Aparência escura", marcado: escuro, acao: () => void alternarTema(barra.el.querySelector("[data-tema]") ?? barra.el) },
    { separador: true },
    { rotulo: "Fechar todas as janelas", desativado: !temJanelas, acao: () => janelas.todas.slice().forEach((j) => void j.fechar()) },
    { separador: true },
    { rotulo: "Sair do computador", atalho: "⌃⌥Q", acao: () => void sair() },
  ];
}

function menuDoApp(app: AppId, a: App | undefined): ItemDeMenu[] {
  const nome = NOMES[app];
  const proprios = a?.menuDoApp?.() ?? [];
  return [
    { rotulo: `Sobre o ${nome === "Pré-Visualização" ? "app Pré-Visualização" : nome}`, acao: () => void abrirApp("sobre") },
    { separador: true },
    ...proprios,
    ...(proprios.length ? [{ separador: true } as const] : []),
    {
      rotulo: `Encerrar o ${nome}`,
      desativado: app === "finder" || app === "sobre",
      acao: () => janelas.doApp(app).forEach((j) => void j.fechar()),
    },
  ];
}

function menuJanela(): Menu {
  const frente = janelas?.daFrente;
  const lista = janelas?.todas ?? [];
  return {
    titulo: "Janela",
    itens: [
      { rotulo: "Minimizar", desativado: !frente, acao: () => void frente?.minimizar() },
      { rotulo: "Zoom", desativado: !frente || estreito.matches, acao: () => frente?.ampliar() },
      { rotulo: "Fechar janela", atalho: "esc", desativado: !frente, acao: () => void frente?.fechar() },
      { separador: true },
      { rotulo: "Trazer tudo para a frente", desativado: !lista.length, acao: () => lista.filter((j) => !j.minimizada).forEach((j) => j.ativar()) },
      ...(lista.length ? [{ separador: true } as const] : []),
      ...lista.map((j) => ({
        rotulo: `${j.titulo}${j.minimizada ? " (no Dock)" : ""}`,
        marcado: j === frente,
        acao: () => {
          if (j.minimizada) void j.restaurar();
          else {
            j.ativar();
            janelas.focar(j);
          }
        },
      })),
    ],
  };
}

function menuAjuda(): Menu {
  return {
    titulo: "Ajuda",
    itens: [
      { rotulo: "Atalhos do computador", acao: () => void abrirApp("sobre", { aba: "atalhos" }) },
      { rotulo: "Ir para o blog", acao: () => void sair() },
    ],
  };
}

// ---------- a aparência (o tema do blog) ----------

async function alternarTema(origem: Element) {
  const valor = raizDoc.dataset.theme === "dark" ? "light" : "dark";
  try {
    const { trocarTema } = await import("../scripts/tema");
    await trocarTema(valor, origem);
  } catch {
    raizDoc.dataset.theme = valor;
  }
  barra.atualizarTema();
}

// ---------- os eventos ----------

function ligar() {
  // Nenhuma tecla daqui chega aos atalhos do site (a busca, os do artigo), nem o mouse à luz da página.
  raiz.addEventListener("keydown", teclas);
  for (const tipo of ["pointermove", "pointerover", "pointerout", "wheel"]) raiz.addEventListener(tipo, (e) => e.stopPropagation(), { passive: true });

  // O Esc pelo sistema (o voltar do Android, a tecla quando o keydown não vem): nunca fecha o computador.
  raiz.addEventListener("cancel", (e) => {
    e.preventDefault();
    tratarEsc();
  });
  raiz.addEventListener("close", () => {
    if (aberto) sairDeVez(false);
  });

  // A área de trabalho: o clique seleciona, o duplo clique (ou Enter, ou o toque) abre.
  mesa.addEventListener("click", (e) => {
    const icone = (e.target as Element).closest<HTMLButtonElement>(".mac-mesa-icone");
    if (!icone) return;
    selecionarNaMesa(icone);
    if (e.detail === 0 || ultimoPonteiro === "touch") abrirDaMesa(icone);
  });
  mesa.addEventListener("dblclick", (e) => {
    const icone = (e.target as Element).closest<HTMLButtonElement>(".mac-mesa-icone");
    if (icone) abrirDaMesa(icone);
  });
  mesa.addEventListener("keydown", (e) => {
    const icones = [...mesa.querySelectorAll<HTMLButtonElement>(".mac-mesa-icone")];
    const i = icones.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const j = e.key === "ArrowDown" ? Math.min(icones.length - 1, i + 1) : e.key === "ArrowUp" ? Math.max(0, i - 1) : -1;
    if (j < 0) return;
    e.preventDefault();
    icones.forEach((b, n) => (b.tabIndex = n === j ? 0 : -1));
    selecionarNaMesa(icones[j]);
    icones[j].focus();
  });

  // Clique no fundo da tela: nenhuma janela na frente (o Finder assume a barra) e nada selecionado.
  tela.addEventListener("pointerdown", (e) => {
    ultimoPonteiro = e.pointerType;
    const alvo = e.target as Element;
    if (alvo === tela || alvo === mesa) {
      janelas.desativar();
      selecionarNaMesa(null);
    }
  });

  // O foco entrou no Terminal suspenso ou saiu dele: a barra de menus troca de app.
  let appDaBarra: AppId = "finder";
  raiz.addEventListener("focusin", () => {
    const agora = appDaFrente();
    if (agora !== appDaBarra) {
      appDaBarra = agora;
      barra.refazer();
    }
  });

  addEventListener("popstate", () => {
    if (aberto && history.state?.mac !== marcaDoHistorico) void sairDeFato();
  });
  addEventListener("tema:mudou", () => barra?.atualizarTema());
  addEventListener("pageshow", (e) => {
    if (e.persisted && aberto) barra.ligarRelogio(true);
  });
}

let ultimoPonteiro = "mouse";

function selecionarNaMesa(icone: HTMLButtonElement | null) {
  for (const b of mesa.querySelectorAll<HTMLButtonElement>(".mac-mesa-icone")) {
    b.classList.toggle("escolhido", b === icone);
    if (icone) b.tabIndex = b === icone ? 0 : -1;
  }
}

function abrirDaMesa(icone: HTMLButtonElement) {
  const app = icone.dataset.abre as AppId;
  void abrirApp(app, app === "finder" ? { lugar: "blog" } : undefined);
}

function teclas(e: KeyboardEvent) {
  e.stopPropagation();
  // ⌃⌥Q: sair do computador (pelo código da tecla: no Windows, Ctrl + Alt é o AltGr, que muda o caractere).
  if (e.ctrlKey && e.altKey && e.code === "KeyQ") {
    e.preventDefault();
    void sair();
    return;
  }
  // ⌃`: o Terminal suspenso (a crase pode ser tecla morta, como no ABNT2).
  if (e.ctrlKey && !e.altKey && !e.metaKey && (e.code === "Backquote" || e.key === "`" || (e.key === "Dead" && e.code === "BracketLeft" && e.shiftKey))) {
    e.preventDefault();
    void carregarApp("terminal").then((a) => a.abrir({ suspenso: "alternar" }));
    return;
  }
  if (e.key === "Escape") {
    e.preventDefault();
    tratarEsc(e);
    return;
  }
  const frente = janelas.daFrente;
  if (frente && frente.el.contains(e.target as Node)) prontos.get(frente.app)?.tecla?.(e);
}

function tratarEsc(e?: KeyboardEvent) {
  if (barra.estaAberto) return barra.fechar();
  const frente = janelas.daFrente;
  // O Terminal suspenso com o foco vem antes do app da janela da frente: o Esc dele recolhia antes um cartão do
  // Código escondido atrás do Terminal (D82).
  const terminal = prontos.get("terminal") as (App & { suspensoAberto?(): boolean; recolher?(): void }) | undefined;
  const noSuspenso = !!raiz.querySelector(".mac-suspenso")?.contains(document.activeElement);
  if (terminal?.suspensoAberto?.() && noSuspenso) return terminal.recolher?.();
  const app = frente ? prontos.get(frente.app) : undefined;
  if (e && app?.tecla?.(e)) return;
  if (terminal?.suspensoAberto?.() && !frente) return terminal.recolher?.();
  if (frente) void frente.fechar();
}

// ---------- o Terminal suspenso por cima do blog (fora do computador) ----------

interface Suspenso {
  alternar(): void;
  aberto(): boolean;
  recolher(): void;
}

let suspensoFora: Suspenso | undefined;

/**
 * A tecla ` numa página do blog desce o Terminal suspenso por cima dela, sem entrar no computador (como no
 * protótipo 15; a direção de arte pediu). Lá fora, `open <post>` abre o post no blog, e o Finder, o Código e
 * a Pré-Visualização entram no computador antes de abrir.
 */
export async function terminalNoBlog(botao: HTMLElement) {
  await preparar();
  if (!suspensoFora) {
    const host = document.createElement("div");
    host.className = "mac-fora";
    document.body.append(host);
    const m = (await import("./apps/terminal")) as { suspensoNoBlog?: (host: HTMLElement, s: Sistema) => Suspenso };
    if (!m.suspensoNoBlog) return;
    const fora: Sistema = {
      ...sistema,
      get raiz() {
        return raiz;
      },
      tela: host,
      async abrirApp(id, pedido) {
        const slug = (pedido as { slug?: string } | undefined)?.slug;
        if (id === "previa" && slug) {
          const d = await carregarDados();
          const post = d.posts.find((p) => p.slug === slug);
          if (post) location.href = post.url;
          return;
        }
        suspensoFora?.recolher();
        await entrar(botao);
        await abrirApp(id, pedido);
      },
      janelasDo: () => [],
      criarJanela: () => {
        throw new Error("Fora do computador não há janelas.");
      },
      atualizarMenus: () => {},
      pular: () => {},
      marcarAberto: () => {},
    };
    suspensoFora = m.suspensoNoBlog(host, fora);
  }
  suspensoFora.alternar();
}

// ---------- entrar e sair (a câmera) ----------

const podeTipos = () => "startViewTransition" in document && typeof ViewTransition !== "undefined" && "types" in ViewTransition.prototype;

function nomear(el: HTMLElement) {
  el.style.viewTransitionName = "mac-tela";
  el.dataset.macVt = "";
}

function desnomear(el: HTMLElement) {
  el.style.removeProperty("view-transition-name");
  delete el.dataset.macVt;
}

/**
 * A câmera, como um carrinho de filmagem que se aproxima da tela (a do protótipo 12): a imagem da página
 * cresce em volta de um ponto fixo F (escolhido para o centro da tela pequena terminar no centro da janela,
 * quando a tela cobre a janela inteira), com o zoom exponencial (a mesma sensação de velocidade do começo
 * ao fim). A tela (o grupo "mac-tela") anda nos mesmos quadros. Na volta, os mesmos quadros ao contrário.
 */
function camera(r: DOMRect, ida: boolean) {
  const W = innerWidth;
  const H = innerHeight;
  const c = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  const S = Math.max(W / r.width, H / r.height);
  const F = { x: (S * c.x - W / 2) / (S - 1), y: (S * c.y - H / 2) / (S - 1) };
  raizDoc.style.setProperty("--mac-fx", `${F.x}px`);
  raizDoc.style.setProperty("--mac-fy", `${F.y}px`);
  const pagina: Keyframe[] = [];
  const quadro: Keyframe[] = [];
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const s = Math.pow(S, u);
    const w = r.width * Math.pow(W / r.width, u);
    const h = r.height * Math.pow(H / r.height, u);
    const x = F.x + s * (c.x - F.x);
    const y = F.y + s * (c.y - F.y);
    pagina.push({ transform: `scale(${s.toFixed(4)})` });
    quadro.push({ transform: `translate(${(x - w / 2).toFixed(2)}px, ${(y - h / 2).toFixed(2)}px)`, width: `${w.toFixed(2)}px`, height: `${h.toFixed(2)}px` });
  }
  if (!ida) {
    pagina.reverse();
    quadro.reverse();
  }
  const comum: KeyframeAnimationOptions = { duration: TEMPO, easing: CURVA, fill: "both" };
  animacoesDaCamera = [
    raizDoc.animate(pagina, { ...comum, pseudoElement: ida ? "::view-transition-old(root)" : "::view-transition-new(root)" }),
    raizDoc.animate(quadro, { ...comum, pseudoElement: "::view-transition-group(mac-tela)" }),
  ];
}

/**
 * As animações da câmera ficam presas aos pseudoelementos da raiz (com `fill`): se não forem canceladas no
 * fim, a próxima View Transition do documento (a troca de tema lá dentro, por exemplo) herdaria o zoom.
 */
let animacoesDaCamera: Animation[] = [];

function soltarCamera() {
  for (const a of animacoesDaCamera) a.cancel();
  animacoesDaCamera = [];
}

const recorte = (r: DOMRect) => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 3px)`;

export async function entrar(botao: HTMLElement) {
  if (aberto || ocupado) return;
  ocupado = true;
  try {
    await preparar();
    const telinha = botao.querySelector<HTMLElement>("[data-cp-tela]");
    botaoDeOrigem = botao;
    // O ícone em pé e parado (pode estar espiando ou fora da tela) para a câmera achar a tela dele.
    botao.style.transition = "none";
    botao.classList.remove("espiando", "escondido");
    void botao.offsetWidth;
    botao.classList.add("aceso");
    raizDoc.classList.add("mac-camera");
    if (telinha && podeTipos() && !reduzido.matches) {
      const r = telinha.getBoundingClientRect();
      nomear(telinha);
      const troca = document.startViewTransition({
        update: () => {
          desnomear(telinha);
          nomear(raiz);
          abrirDialogo();
        },
        types: ["mac-entra"],
      });
      void troca.ready.then(() => camera(r, true)).catch(() => {});
      await troca.finished.catch(() => {});
      soltarCamera();
      desnomear(raiz);
    } else if (telinha && !reduzido.matches) {
      const r = telinha.getBoundingClientRect();
      abrirDialogo();
      await raiz.animate([{ clipPath: recorte(r) }, { clipPath: "inset(0px 0px 0px 0px round 0px)" }], { duration: 700, easing: CURVA }).finished;
    } else {
      abrirDialogo();
      await raiz.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "ease-out" }).finished;
    }
    // O Voltar do navegador também sai (no celular, o gesto de voltar).
    marcaDoHistorico = String(Date.now());
    try {
      history.pushState({ ...(history.state ?? {}), mac: marcaDoHistorico }, "");
    } catch {}
    focarAoEntrar();
    ocioso(() => ["previa", "terminal", "editor"].forEach((a) => void carregarApp(a as AppId).catch(() => {})));
  } catch {
    if (!aberto) raizDoc.classList.remove("mac-camera");
  } finally {
    botao.classList.remove("aceso");
    botao.style.removeProperty("transition");
    raizDoc.classList.remove("mac-camera");
    ocupado = false;
  }
}

/** Mostra o computador e trava a página embaixo (a rolagem volta ao mesmo lugar ao sair). */
function abrirDialogo() {
  rolagem = scrollY;
  raizDoc.classList.add("mac-aberto");
  raiz.showModal();
  aberto = true;
  barra.ligarRelogio(true);
  barra.atualizarTema();
  dock.medir();
}

function focarAoEntrar() {
  const frente = janelas.daFrente;
  if (frente) janelas.focar(frente);
  else mesa.querySelector<HTMLButtonElement>('.mac-mesa-icone[tabindex="0"]')?.focus({ preventScroll: true });
}

/** Esconde o computador e devolve a página como estava. */
function sairDeVez(focar = true) {
  aberto = false;
  barra.fechar(false);
  barra.ligarRelogio(false);
  if (raiz.open) raiz.close();
  raizDoc.classList.remove("mac-aberto");
  if (Math.abs(scrollY - rolagem) > 1) scrollTo({ top: rolagem, behavior: "instant" });
  if (focar) botaoDeOrigem?.focus({ preventScroll: true });
}

/** Sair pelo menu ou pelo atalho: volta a entrada do histórico (o popstate chama `sairDeFato`). */
export async function sair() {
  if (!aberto || ocupado) return;
  if (history.state?.mac === marcaDoHistorico && marcaDoHistorico) {
    history.back();
    return;
  }
  await sairDeFato();
}

async function sairDeFato() {
  if (!aberto || ocupado) return;
  ocupado = true;
  marcaDoHistorico = "";
  try {
    const botao = botaoDeOrigem;
    const telinha = botao?.querySelector<HTMLElement>("[data-cp-tela]");
    botao?.classList.add("aceso");
    raizDoc.classList.add("mac-camera");
    if (telinha && podeTipos() && !reduzido.matches && botao?.isConnected) {
      // A tela pequena tem de estar à vista e no lugar para a câmera voltar a ela: o ícone volta em pé,
      // sem a transição (depois, icone.ts confere de novo o lugar dele, no evento "mac:saiu").
      botao.style.transition = "none";
      botao.classList.remove("espiando", "escondido");
      void botao.offsetWidth;
      const r = telinha.getBoundingClientRect();
      nomear(raiz);
      const troca = document.startViewTransition({
        update: () => {
          desnomear(raiz);
          sairDeVez(false);
          nomear(telinha);
        },
        types: ["mac-sai"],
      });
      void troca.ready.then(() => camera(r, false)).catch(() => {});
      await troca.finished.catch(() => {});
      soltarCamera();
      desnomear(telinha);
      botao.style.removeProperty("transition");
      botao.focus({ preventScroll: true });
    } else if (telinha && !reduzido.matches) {
      const r = telinha.getBoundingClientRect();
      await raiz.animate([{ clipPath: "inset(0px 0px 0px 0px round 0px)" }, { clipPath: recorte(r) }], { duration: 560, easing: CURVA }).finished;
      sairDeVez();
    } else {
      await raiz.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: "ease-in" }).finished;
      sairDeVez();
    }
    botao?.classList.remove("aceso");
  } finally {
    raizDoc.classList.remove("mac-camera");
    ocupado = false;
    dispatchEvent(new CustomEvent("mac:saiu"));
  }
}
