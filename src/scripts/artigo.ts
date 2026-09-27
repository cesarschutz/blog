/**
 * Interações do artigo (briefing §5.3): barra de leitura (no topo e embaixo do sumário), o sumário
 * que acompanha a leitura (C2, D49: o fio escrito por seção, a seção atual sublinhada à caneta (B05,
 * D52), os vistos e, sem a lateral, a seção no cabeçalho com a folha do sumário), notas laterais que abrem no
 * lugar nas telas menores, visor de imagens e a apresentação (setas, contador e tela cheia). Sem JS o artigo continua inteiro: as
 * notas abrem por âncora, a apresentação rola de lado e o PDF baixa. O Copiar do código faz o gesto de
 * copiar do site (E3, D49).
 */
import { ICONES } from "../lib/icones";
import { tracoDeCaneta } from "../lib/traco";
import { criarContador, mudarContador } from "./contador";
import { mostrarCopiado } from "./copiado";

const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
const rolagem = (): ScrollBehavior => (reduzir.matches ? "auto" : "smooth");

// ---------- barra de leitura e o sumário que acompanha (C2, D49) ----------

const raiz = document.documentElement;
const artigo = document.querySelector<HTMLElement>("[data-artigo]");
const barra = document.querySelector<HTMLElement>("[data-barra-leitura]");
const progresso = document.querySelector<HTMLElement>("[data-progresso-sumario]");
const progressoTexto = progresso?.querySelector<HTMLElement>(".lido");
const progressoFalta = progresso?.querySelector<HTMLElement>("[data-falta]");
const minutosFalta = progresso?.querySelector<HTMLElement>("[data-minutos-falta]");
const minutosDoArtigo = Number(progresso?.dataset.minutos ?? 0);
// Os minutos que faltam rodam como contador quando mudam (E4, D49; contador.ts).
if (minutosFalta && minutosDoArtigo) criarContador(minutosFalta, minutosDoArtigo);
let minutosNaTela = minutosDoArtigo;
if (progresso) progresso.hidden = false;
const secoes = [...document.querySelectorAll<HTMLAnchorElement>("[data-secao]")].flatMap((link) => {
  const titulo = document.getElementById(link.dataset.secao!);
  const naFolha = document.querySelector<HTMLAnchorElement>(`[data-secao-folha="${CSS.escape(link.dataset.secao!)}"]`);
  const nome = link.querySelector(".rotulo")?.textContent?.trim() ?? link.textContent!.trim();
  return titulo ? [{ link, titulo, naFolha, nome }] : [];
});
// Subseções (h3) do sumário lateral, cada uma com o link da seção dela (D33).
const subsecoes = [...document.querySelectorAll<HTMLAnchorElement>("[data-subsecao]")].flatMap((link) => {
  const titulo = document.getElementById(link.dataset.subsecao!);
  const daSecao = link.closest(".secao")?.querySelector<HTMLAnchorElement>(":scope > a");
  return titulo && daSecao ? [{ link, titulo, daSecao }] : [];
});
const trilho = document.querySelector<HTMLElement>("[data-trilho]");
/** A linha em que uma seção vira a atual: o título dela passou de 140px do alto da janela. */
const LINHA = 140;
let atual = -2; // -2: ainda não marcado; -1: antes da primeira seção
// As seções lidas nesta visita (B04, D52): só as que foram a atual por um tempo de leitura e ficaram
// para trás. Quem chega (pelo link, pela troca de página, recarregando, pelo histórico ou por um
// #título) começa sem nenhum visto, e quem pula (o sumário, o fim da página, a rolagem rápida) não ganha
// visto nas seções por onde só passou: pular para o meio do texto não é ter lido o começo.
const lidas = new Set<number>();
/** Quanto tempo uma seção precisa ter sido a atual para, ao ficar para trás, ganhar o visto. */
const TEMPO_DE_LEITURA = 600;
let atualDesde = 0;

/**
 * Onde o elemento está, sem as transformações: a soma dos offsetTop até `ate` (ou até o documento).
 * A troca de página (D51) e a abertura trazem as folhas de longe, em perspectiva e tortas; medido pelo
 * getBoundingClientRect nesse meio-tempo, todo título do artigo parecia já ter passado da linha, e o
 * sumário chegava com a última seção como a atual, todas as outras lidas e o fio encolhido (B04, D52).
 */
function topoSemTransformar(el: HTMLElement, ate: HTMLElement | null = null) {
  let y = 0;
  for (let e: HTMLElement | null = el; e && e !== ate; e = e.offsetParent as HTMLElement | null) y += e.offsetTop + (e === el ? 0 : e.clientTop);
  return y;
}

/** O topo do elemento na janela, como estaria sem nenhuma animação. */
const topoNaJanela = (el: HTMLElement) => topoSemTransformar(el) - scrollY;

// O fio do trilho, escrito à caneta (só na lateral): um traço quase reto que passa pelos pontos, com o
// tremor pequeno de uma linha feita à mão (semente fixa: sempre o mesmo desenho).
const listaTrilho = document.querySelector<HTMLElement>("[data-lista-trilho]");
const fioBase = listaTrilho?.querySelector<SVGPathElement>(".fio-base");
const fioTinta = listaTrilho?.querySelector<SVGPathElement>(".fio-tinta");
let pontosY: number[] = [];
let tabelaDoFio: [number, number][] = [];
let comprimentoDoFio = 0;

// O meio de cada ponto na lista, pela posição dele no layout (sem a transformação da folha que chega).
function meioDoMarco(link: HTMLAnchorElement) {
  const marco = link.querySelector<SVGSVGElement>(".marco")!;
  const estilo = getComputedStyle(marco);
  const secao = link.parentElement!;
  return {
    x: secao.offsetLeft + parseFloat(estilo.left) + parseFloat(estilo.width) / 2,
    y: topoSemTransformar(secao, listaTrilho!) + parseFloat(estilo.top) + parseFloat(estilo.height) / 2,
  };
}

function desenharFio() {
  if (!listaTrilho || !fioBase || !fioTinta || !listaTrilho.offsetParent || !secoes.length) return;
  const marcos = secoes.map(({ link }) => meioDoMarco(link));
  pontosY = marcos.map((m) => m.y);
  const x = marcos[0].x;
  let semente = 7;
  const acaso = () => (semente = (semente * 16807) % 2147483647) / 2147483647 - 0.5;
  const [y0, y1] = [pontosY[0], pontosY.at(-1)!];
  let d = `M${x} ${y0.toFixed(1)}`;
  for (let y = y0 + 22; y < y1; y += 22) d += ` L${(x + acaso() * 1.3).toFixed(2)} ${y.toFixed(1)}`;
  d += ` L${x} ${y1.toFixed(1)}`;
  fioBase.setAttribute("d", d);
  fioTinta.setAttribute("d", d);
  comprimentoDoFio = fioTinta.getTotalLength();
  tabelaDoFio = [];
  for (let l = 0; l <= comprimentoDoFio; l += 2) tabelaDoFio.push([fioTinta.getPointAtLength(l).y, l]);
  // Com o desenho novo, a tinta vai direto ao lugar (sem escorrer do começo do fio).
  fioTinta.style.transition = "none";
  fioTinta.style.strokeDasharray = `${comprimentoDoFio}`;
  moverTinta();
  void fioTinta.getBoundingClientRect();
  fioTinta.style.transition = "";
}

let ultimaLeitura = { i: -1, f: 0 };

// A tinta do fio anda até onde a leitura chegou dentro da seção (a transição do CSS a faz seguir).
function moverTinta() {
  if (!fioTinta || !pontosY.length) return;
  const { i, f } = ultimaLeitura;
  let y = pontosY[0];
  if (i >= 0) y = i + 1 < pontosY.length ? pontosY[i] + f * (pontosY[i + 1] - pontosY[i]) : pontosY[i];
  fioTinta.style.strokeDashoffset = `${comprimentoDoFio - comprimentoAte(y)}`;
}

function comprimentoAte(y: number) {
  let r = 0;
  for (const [py, l] of tabelaDoFio) {
    if (py <= y) r = l;
    else break;
  }
  return r;
}

/** A seção atual e quanto dela já foi lido (de 0 a 1): do título dela passar da linha ao do próximo passar. */
function leitura() {
  const topos = secoes.map(({ titulo }) => topoNaJanela(titulo));
  let i = -1;
  topos.forEach((t, k) => {
    if (t < LINHA) i = k;
  });
  let f = 0;
  if (i >= 0 && artigo) {
    const inicio = topos[i] - LINHA;
    const fim = i + 1 < topos.length ? topos[i + 1] - LINHA : topoNaJanela(artigo) + artigo.offsetHeight - innerHeight;
    f = Math.min(1, Math.max(0, -inicio / Math.max(fim - inicio, 1)));
  }
  return { i, f };
}

let agendado = false;
function aoRolar() {
  agendado = false;
  if (artigo && barra) {
    const lido = Math.min(1, Math.max(0, -topoNaJanela(artigo) / Math.max(artigo.offsetHeight - innerHeight, 1)));
    barra.style.setProperty("--lido", lido.toFixed(4));
    barra.classList.toggle("escrevendo", lido > 0.002);
    if (progressoTexto) progressoTexto.textContent = `${Math.round(lido * 100)}% lido`;
    if (progressoFalta && minutosFalta && minutosDoArtigo) {
      const resto = Math.max(1, Math.ceil(minutosDoArtigo * (1 - lido)));
      if (resto !== minutosNaTela) mudarContador(minutosFalta, (minutosNaTela = resto));
      progressoFalta.classList.toggle("no-fim", lido > 0.995);
    }
  }
  if (!secoes.length) return;
  ultimaLeitura = leitura();
  if (ultimaLeitura.i !== atual) marcarSumario(atual, ultimaLeitura.i);
  moverTinta();
}

// A seção atual (aria-current, sublinhada à caneta), as que ficaram para trás (com o visto, que fica
// mesmo voltando a rolagem), a subseção atual dentro dela e, se a lista rola, a atual sempre à vista.
// O visto é de quem leu: a seção em que o leitor ficou ganha o dela quando a leitura segue adiante.
function marcarSumario(de: number, para: number) {
  atual = para;
  const agora = performance.now();
  if (de >= 0 && para > de && agora - atualDesde >= TEMPO_DE_LEITURA) lidas.add(de);
  atualDesde = agora;
  // Na primeira marcação (ao chegar, ou voltando pelo histórico), o traço já vem pronto e as
  // subseções da atual já vêm abertas.
  const escrever = de !== -2;
  if (!escrever) trilho?.classList.add("de-uma-vez");
  secoes.forEach(({ link, naFolha }, k) => {
    for (const a of [link, naFolha]) {
      if (!a) continue;
      const era = a.hasAttribute("aria-current");
      if (k === para) {
        a.setAttribute("aria-current", "true");
        if (!era) {
          apagarSublinhado(a, "leve", false);
          sublinhar(a, "atual", escrever, 90);
        }
      } else {
        a.removeAttribute("aria-current");
        if (era) apagarSublinhado(a, "atual", escrever);
      }
      a.parentElement?.classList.toggle("lida", lidas.has(k));
    }
  });
  // As subseções da atual se desdobram (CSS): o fio passa pelos pontos nos lugares novos, quadro a
  // quadro enquanto elas abrem e fecham (revisão 4, D52).
  desenharFio();
  if (!escrever && trilho) {
    void trilho.offsetHeight;
    trilho.classList.remove("de-uma-vez");
  } else acompanharSubsecoes();
  const link = secoes[para]?.link;
  if (trilho && link && trilho.scrollHeight > trilho.clientHeight) {
    const caixa = trilho.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.top < caixa.top + 32 || item.bottom > caixa.bottom - 32) {
      trilho.scrollTo({ top: trilho.scrollTop + item.top - caixa.top - caixa.height / 3, behavior: rolagem() });
    }
  }
  trocarCabecalho(de, para);
}

/** Redesenha o fio a cada quadro enquanto as subseções abrem e fecham (0,34s no CSS). */
let acompanharAte = 0;
function acompanharSubsecoes() {
  if (!subsecoes.length || reduzir.matches || !listaTrilho?.offsetParent) return;
  const jaAcompanha = performance.now() < acompanharAte;
  acompanharAte = performance.now() + 400;
  if (jaAcompanha) return;
  const passo = () => {
    desenharFio();
    if (performance.now() < acompanharAte) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

// ---------- a seção atual sublinhada à caneta (B05, D52) ----------

const SVG_NS = "http://www.w3.org/2000/svg";
/** A curva da escrita do menu (traco.css): sai rápido e assenta. */
const ESCREVE = "cubic-bezier(0.2, 0.75, 0.2, 1)";
type Sublinhado = "atual" | "leve";

/**
 * O sublinhado de uma seção do sumário (lateral ou folha): o traço do menu do cabeçalho, um por linha
 * do nome (as linhas saem da tela, getClientRects, porque o nome quebra onde a largura manda). Cada
 * linha tem o tremor dela, sempre o mesmo. Escrito, a caneta passa linha a linha, na velocidade de
 * quem sublinha (uns 0,15s mais 1ms por pixel, até 0,42s cada, com 40ms para levantar a caneta).
 */
function sublinhar(link: HTMLAnchorElement, tipo: Sublinhado, escrever: boolean, atraso = 0) {
  const secao = link.parentElement as HTMLElement | null;
  const rotulo = link.querySelector<HTMLElement>(".rotulo");
  if (!secao || !rotulo) return;
  apagarSublinhado(link, tipo, false);
  const caixa = secao.getBoundingClientRect();
  // A folha que chega pode estar em escala: as medidas voltam ao tamanho do layout.
  const escala = secao.offsetWidth ? caixa.width / secao.offsetWidth : 0;
  const linhas = [...rotulo.getClientRects()].filter((r) => r.width > 2);
  if (!escala || !linhas.length) return;
  const nome = rotulo.textContent?.trim() ?? "";
  const grupo = document.createElement("span");
  grupo.className = `sublinhado ${tipo}`;
  grupo.setAttribute("aria-hidden", "true");
  const animar = escrever && !reduzir.matches;
  let t = atraso;
  linhas.forEach((r, i) => {
    const largura = r.width / escala;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 100 8");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("focusable", "false");
    // O traço passa logo abaixo das letras, no vão entre as linhas (o meio da caixa de 8px fica no fim
    // da linha): encosta nas pernas do "g" e do "p", como um sublinhado à mão.
    svg.style.left = `${((r.left - caixa.left) / escala - 1).toFixed(1)}px`;
    svg.style.top = `${((r.bottom - caixa.top) / escala - 3.5).toFixed(1)}px`;
    svg.style.width = `${(largura + 2).toFixed(1)}px`;
    const caminho = document.createElementNS(SVG_NS, "path");
    caminho.setAttribute("d", tracoDeCaneta(`${nome}#${i}`, tipo === "leve" ? 101 : 0, 0.9, Math.round(largura / 16)));
    svg.append(caminho);
    grupo.append(svg);
    if (!animar) return;
    const duracao = Math.min(420, 150 + largura);
    svg.animate([{ clipPath: "inset(-4px 100% -4px 0)" }, { clipPath: "inset(-4px 0 -4px 0)" }], {
      duration: tipo === "leve" ? Math.min(320, duracao) : duracao,
      delay: t,
      easing: ESCREVE,
      fill: "backwards",
    });
    t += duracao + 40;
  });
  secao.append(grupo);
}

/** O traço sai como o do menu: termina de passar e some pela direita (0,22s). */
function apagarSublinhado(link: HTMLAnchorElement, tipo: Sublinhado, animar: boolean) {
  const secao = link.parentElement;
  if (!secao) return;
  for (const grupo of secao.querySelectorAll<HTMLElement>(`:scope > .sublinhado.${tipo}:not(.saindo)`)) {
    if (!animar || reduzir.matches) {
      grupo.remove();
      continue;
    }
    grupo.classList.add("saindo");
    const saidas = [...grupo.children].map((svg) => {
      // De onde o traço estiver (inteiro, pela metade ou ainda por escrever).
      const agora = getComputedStyle(svg).clipPath;
      for (const a of svg.getAnimations()) a.cancel();
      const de = agora && agora !== "none" ? agora : "inset(-4px 0 -4px 0)";
      return svg.animate([{ clipPath: de }, { clipPath: "inset(-4px 0 -4px 100%)" }], {
        duration: 220,
        easing: "cubic-bezier(0.55, 0, 1, 0.45)",
        fill: "forwards",
      }).finished;
    });
    Promise.all(saidas)
      .catch(() => {})
      .then(() => grupo.remove());
  }
}

/** Refaz o sublinhado da seção atual, já pronto (a largura mudou, a fonte chegou, a folha pousou). */
function refazerSublinhados() {
  for (const { link, naFolha } of secoes)
    for (const a of [link, naFolha]) if (a?.hasAttribute("aria-current")) sublinhar(a, "atual", false);
}

// Com o mouse ou o foco do teclado numa seção, a caneta passa um traço leve (como no menu).
for (const { link } of secoes) {
  const passar = () => !link.hasAttribute("aria-current") && sublinhar(link, "leve", true);
  const tirar = () => apagarSublinhado(link, "leve", true);
  link.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && passar());
  link.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && tirar());
  link.addEventListener("focus", () => link.matches(":focus-visible") && passar());
  link.addEventListener("blur", tirar);
}

function marcarSubsecao() {
  const daAtual = secoes[atual]?.link;
  let subAtual: HTMLAnchorElement | undefined;
  for (const { link, titulo, daSecao } of subsecoes) {
    if (daSecao === daAtual && topoNaJanela(titulo) < LINHA) subAtual = link;
  }
  for (const { link } of subsecoes) {
    if (link === subAtual) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
}

// ---------- a seção atual no cabeçalho, sem a lateral (C2, D49) ----------

const marcaDoTopo = document.querySelector<HTMLElement>("[data-lugar-marca] > .marca");
const botaoSecao = document.querySelector<HTMLButtonElement>("[data-abrir-sumario]");
const vagas = [...document.querySelectorAll<HTMLElement>("[data-vaga]")];
let vagaAtiva = 0;
if (botaoSecao && marcaDoTopo && secoes.length) {
  botaoSecao.hidden = false;
  marcaDoTopo.dataset.pos = "meio";
}

/** Põe o elemento numa posição: "meio" (à vista), "cima" ou "baixo" (fora); de uma vez ou deslizando. */
function posicionar(el: HTMLElement, pos: "meio" | "cima" | "baixo", deUmaVez: boolean) {
  if (!deUmaVez) {
    el.dataset.pos = pos;
    return;
  }
  el.style.transition = "none";
  el.dataset.pos = pos;
  void el.offsetWidth;
  el.style.transition = "";
}

// A seção nova entra por baixo ao descer e por cima ao subir; a marca volta antes da primeira seção.
function trocarCabecalho(de: number, para: number) {
  if (!botaoSecao || !marcaDoTopo) return;
  const deUmaVez = de === -2 || reduzir.matches;
  const desce = para > de;
  const sai = de >= 0 ? vagas[vagaAtiva] : marcaDoTopo;
  let entra: HTMLElement = marcaDoTopo;
  if (para >= 0) {
    if (de >= 0) vagaAtiva = 1 - vagaAtiva;
    entra = vagas[vagaAtiva];
    entra.querySelector(".num")!.textContent = `${para + 1} de ${secoes.length}`;
    entra.querySelector(".nome")!.textContent = secoes[para].nome;
  }
  botaoSecao.tabIndex = para >= 0 ? 0 : -1;
  botaoSecao.setAttribute("aria-label", para >= 0 ? `Seção ${para + 1} de ${secoes.length}: ${secoes[para].nome}. Abrir o sumário` : "Abrir o sumário");
  if (sai === entra) return;
  posicionar(entra, desce ? "baixo" : "cima", true);
  posicionar(sai, desce ? "cima" : "baixo", deUmaVez);
  posicionar(entra, "meio", deUmaVez);
}

// ---------- a folha do sumário (C2, D49) ----------

const folha = document.querySelector<HTMLElement>("[data-folha-sumario]");
const veuDaFolha = document.querySelector<HTMLElement>("[data-veu-sumario]");
const lateralVisivel = matchMedia("(min-width: 1300px)");
const folhaAberta = () => botaoSecao?.getAttribute("aria-expanded") === "true";

function abrirFolha(pelaTecla: boolean) {
  if (!botaoSecao || !folha) return;
  // O menu do celular e a folha não ficam abertos juntos.
  if (raiz.hasAttribute("data-menu-aberto")) document.querySelector<HTMLButtonElement>("[data-botao-menu]")?.click();
  botaoSecao.setAttribute("aria-expanded", "true");
  raiz.dataset.sumarioAberto = "";
  // A caneta sublinha a seção atual quando a folha termina de descer (como o traço do menu, D49).
  const daVez = folha.querySelector<HTMLAnchorElement>('[aria-current="true"]');
  if (daVez) sublinhar(daVez, "atual", true, 380);
  const alvo = daVez ?? folha.querySelector<HTMLAnchorElement>("a");
  if (pelaTecla) alvo?.focus({ preventScroll: true });
}

function fecharFolha(devolverFoco: boolean) {
  if (!botaoSecao || !folhaAberta()) return;
  botaoSecao.setAttribute("aria-expanded", "false");
  delete raiz.dataset.sumarioAberto;
  if (devolverFoco) botaoSecao.focus({ preventScroll: true });
}

if (botaoSecao && folha) {
  botaoSecao.addEventListener("click", (e) => (folhaAberta() ? fecharFolha(false) : abrirFolha(e.detail === 0)));
  veuDaFolha?.addEventListener("click", () => fecharFolha(false));
  folha.addEventListener("click", (e) => (e.target as HTMLElement).closest("a") && fecharFolha(false));
  folha.addEventListener("focusout", (e) => {
    const para = e.relatedTarget as Node | null;
    if (folhaAberta() && para && !folha.contains(para) && para !== botaoSecao) fecharFolha(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && folhaAberta()) fecharFolha(true);
  });
  lateralVisivel.addEventListener("change", () => fecharFolha(false));
  addEventListener("pageshow", () => fecharFolha(false));
}

addEventListener(
  "scroll",
  () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => {
      aoRolar();
      marcarSubsecao();
    });
  },
  { passive: true },
);
let larguraAntes = innerWidth;
addEventListener("resize", () => {
  if (innerWidth !== larguraAntes) {
    desenharFio();
    refazerSublinhados();
  }
  larguraAntes = innerWidth;
  aoRolar();
});
lateralVisivel.addEventListener("change", () => {
  desenharFio();
  refazerSublinhados();
  aoRolar();
});
if (listaTrilho) new ResizeObserver(() => desenharFio()).observe(listaTrilho);
document.fonts?.ready.then(() => {
  desenharFio();
  refazerSublinhados();
  aoRolar();
});
// Entrando por um #título com a troca de página (D51), o sublinhado foi medido na folha que chegava.
addEventListener("cs:chegou", refazerSublinhados);
// Voltando pela memória do navegador (bfcache), a página volta como estava: o sumário recomeça zerado,
// só com a seção onde o leitor está (B04, D52).
addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  lidas.clear();
  atual = -2;
  aoRolar();
  marcarSubsecao();
});
desenharFio();
aoRolar();
marcarSubsecao();

// ---------- notas laterais ----------

for (const chamada of document.querySelectorAll<HTMLAnchorElement>("[data-ref-nota]")) {
  const nota = document.getElementById(decodeURIComponent(chamada.hash.slice(1)));
  if (!nota) continue;
  chamada.setAttribute("aria-controls", nota.id);
  chamada.setAttribute("aria-expanded", "false");
  chamada.addEventListener("click", (e) => {
    e.preventDefault();
    // Na margem (o CSS a põe em float) a nota já está à vista; fora dela, abre e fecha no lugar.
    // A margem depende da largura da tela e de o sumário estar ao lado (artigo.css).
    if (getComputedStyle(nota).float === "right") return;
    chamada.setAttribute("aria-expanded", String(nota.classList.toggle("aberta")));
  });
}

// ---------- visor de imagens (lightbox) ----------

interface Imagem {
  src: string;
  alt: string;
}

let visor: HTMLDialogElement | undefined;
let imagens: Imagem[] = [];
let indice = 0;
let aoFechar: ((indice: number) => void) | undefined;

// O visor (visor.css, D33): a página escurece, a imagem fica no meio, o botão de fechar no alto à
// direita, as setas nas laterais (na galeria) e o contador embaixo.
function criarVisor(): HTMLDialogElement {
  const dialogo = document.createElement("dialog");
  dialogo.className = "visor";
  const svg = (icone: string) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icone}</svg>`;
  dialogo.innerHTML = `<figure class="visor-quadro"><img alt=""></figure>
    <p class="visor-posicao" aria-live="polite"></p>
    <button type="button" class="visor-botao visor-seta anterior" data-visor="anterior" aria-label="Anterior">${svg(ICONES.seta)}</button>
    <button type="button" class="visor-botao visor-seta proximo" data-visor="proximo" aria-label="Próximo">${svg(ICONES.seta)}</button>
    <button type="button" class="visor-botao visor-fechar" data-visor="fechar" aria-label="Fechar">${svg(ICONES.fechar)}</button>`;
  dialogo.addEventListener("click", (e) => {
    const alvo = e.target as HTMLElement;
    const acao = alvo.closest<HTMLElement>("[data-visor]")?.dataset.visor;
    if (acao === "anterior") mostrar(indice - 1);
    else if (acao === "proximo") mostrar(indice + 1);
    else if (acao === "fechar" || alvo === dialogo || alvo.classList.contains("visor-quadro")) dialogo.close();
  });
  dialogo.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") mostrar(indice + 1);
    else if (e.key === "ArrowLeft") mostrar(indice - 1);
  });
  dialogo.addEventListener("close", () => {
    aoFechar?.(indice);
    aoFechar = undefined;
  });
  document.body.append(dialogo);
  return dialogo;
}

function mostrar(novo: number) {
  indice = Math.max(0, Math.min(imagens.length - 1, novo));
  const img = visor!.querySelector("img")!;
  img.src = imagens[indice].src;
  img.alt = imagens[indice].alt;
  const galeria = imagens.length > 1;
  visor!.querySelector(".visor-posicao")!.textContent = galeria ? `${indice + 1} de ${imagens.length}` : "";
  const [anterior, proximo] = visor!.querySelectorAll<HTMLButtonElement>('[data-visor="anterior"], [data-visor="proximo"]');
  anterior.hidden = proximo.hidden = !galeria;
  anterior.disabled = indice === 0;
  proximo.disabled = indice === imagens.length - 1;
}

function abrirVisor(lista: Imagem[], inicio = 0, depois?: (indice: number) => void) {
  visor ??= criarVisor();
  visor.setAttribute("aria-label", lista.length > 1 ? "Apresentação em tela cheia" : "Imagem ampliada");
  imagens = lista;
  aoFechar = depois;
  mostrar(inicio);
  visor.showModal();
}

// ---------- apresentação ----------

const apresentacoes = new Map<Element, (i: number) => void>();

for (const secao of document.querySelectorAll<HTMLElement>("[data-apresentacao]")) {
  const faixa = secao.querySelector<HTMLElement>(".slides")!;
  const slides = [...faixa.querySelectorAll<HTMLImageElement>("img")];
  const posicao = secao.querySelector<HTMLElement>("[data-posicao]")!;
  const anterior = secao.querySelector<HTMLButtonElement>("[data-anterior]")!;
  const proximo = secao.querySelector<HTMLButtonElement>("[data-proximo]")!;
  const telaCheia = secao.querySelector<HTMLButtonElement>("[data-tela-cheia]")!;
  let atual = 0;

  const marcar = (i: number) => {
    atual = i;
    posicao.textContent = `${i + 1} de ${slides.length}`;
    anterior.disabled = i === 0;
    proximo.disabled = i === slides.length - 1;
  };
  const ir = (i: number, comportamento: ScrollBehavior = rolagem()) => {
    const alvo = Math.max(0, Math.min(slides.length - 1, i));
    faixa.scrollTo({ left: slides[alvo].parentElement!.offsetLeft, behavior: comportamento });
    marcar(alvo);
  };
  const ampliar = (i: number) =>
    abrirVisor(
      slides.map((s) => ({ src: s.currentSrc || s.src, alt: s.alt })),
      i,
      (ultimo) => ir(ultimo, "auto"),
    );

  for (const parte of [posicao, anterior, proximo, telaCheia]) parte.hidden = false;
  marcar(0);
  anterior.addEventListener("click", () => ir(atual - 1));
  proximo.addEventListener("click", () => ir(atual + 1));
  telaCheia.addEventListener("click", () => ampliar(atual));
  faixa.addEventListener(
    "scroll",
    () => {
      const i = Math.round(faixa.scrollLeft / Math.max(faixa.clientWidth, 1));
      if (i !== atual) marcar(Math.min(i, slides.length - 1));
    },
    { passive: true },
  );
  apresentacoes.set(faixa, ampliar);
}

// Imagens do corpo abrem no visor; um slide abre a apresentação em tela cheia, a partir dele.
document.querySelector("[data-corpo]")?.addEventListener("click", (e) => {
  const img = (e.target as HTMLElement).closest<HTMLImageElement>("img");
  if (!img || img.closest("a")) return;
  const faixa = img.closest(".slides");
  const ampliar = faixa && apresentacoes.get(faixa);
  if (ampliar) ampliar([...faixa.querySelectorAll("img")].indexOf(img));
  else abrirVisor([{ src: img.currentSrc || img.src, alt: img.alt }]);
});

// ---------- o Copiar do código (E3, D49) ----------

// Quem copia é o Expressive Code, que avisa numa região viva (escondida da tela, pluginCopiar em
// src/lib/codigo.ts); quando o aviso chega, o botão faz o gesto de copiar do site (copiado.ts).
const corpoDoArtigo = document.querySelector("[data-corpo]");
if (corpoDoArtigo?.querySelector(".expressive-code .copy")) {
  new MutationObserver((mudancas) => {
    for (const mudanca of mudancas)
      for (const no of mudanca.addedNodes) {
        if (!(no instanceof HTMLElement) || !no.classList.contains("feedback")) continue;
        const botao = no.closest(".copy")?.querySelector<HTMLElement>("button.gesto-copiar");
        if (botao) mostrarCopiado(botao, "Copiado", "");
      }
  }).observe(corpoDoArtigo, { childList: true, subtree: true });
}
