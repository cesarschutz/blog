/**
 * Interações do artigo (briefing §5.3): barra de leitura (no topo e embaixo do sumário), o sumário
 * que acompanha a leitura (C2, D49: o fio escrito por seção, a seção atual com o marca-texto, os
 * vistos e, sem a lateral, a seção no cabeçalho com a folha do sumário), notas laterais que abrem no
 * lugar nas telas menores, visor de imagens e a apresentação (setas, contador e tela cheia). Sem JS o artigo continua inteiro: as
 * notas abrem por âncora, a apresentação rola de lado e o PDF baixa. O Copiar do código faz o gesto de
 * copiar do site (E3, D49).
 */
import { ICONES } from "../lib/icones";
import { mostrarCopiado } from "./copiado";

const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
const rolagem = (): ScrollBehavior => (reduzir.matches ? "auto" : "smooth");

// ---------- barra de leitura e o sumário que acompanha (C2, D49) ----------

const raiz = document.documentElement;
const artigo = document.querySelector<HTMLElement>("[data-artigo]");
const barra = document.querySelector<HTMLElement>("[data-barra-leitura]");
const progresso = document.querySelector<HTMLElement>("[data-progresso-sumario]");
const progressoFeito = progresso?.querySelector<HTMLElement>(".feito");
const progressoTexto = progresso?.querySelector<HTMLElement>(".lido");
const progressoFalta = progresso?.querySelector<HTMLElement>(".falta");
const minutosDoArtigo = Number(progresso?.dataset.minutos ?? 0);
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
const lidas = new Set<number>();

// O fio do trilho, escrito à caneta (só na lateral): um traço quase reto que passa pelos pontos, com o
// tremor pequeno de uma linha feita à mão (semente fixa: sempre o mesmo desenho).
const listaTrilho = document.querySelector<HTMLElement>("[data-lista-trilho]");
const fioBase = listaTrilho?.querySelector<SVGPathElement>(".fio-base");
const fioTinta = listaTrilho?.querySelector<SVGPathElement>(".fio-tinta");
let pontosY: number[] = [];
let tabelaDoFio: [number, number][] = [];
let comprimentoDoFio = 0;

function desenharFio() {
  if (!listaTrilho || !fioBase || !fioTinta || !listaTrilho.offsetParent || !secoes.length) return;
  const caixa = listaTrilho.getBoundingClientRect();
  const marcos = secoes.map(({ link }) => link.querySelector(".marco")!.getBoundingClientRect());
  pontosY = marcos.map((m) => m.top - caixa.top + m.height / 2);
  const x = marcos[0].left - caixa.left + marcos[0].width / 2;
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
  const topos = secoes.map(({ titulo }) => titulo.getBoundingClientRect().top);
  let i = -1;
  topos.forEach((t, k) => {
    if (t < LINHA) i = k;
  });
  let f = 0;
  if (i >= 0 && artigo) {
    const inicio = topos[i] - LINHA;
    const fim = i + 1 < topos.length ? topos[i + 1] - LINHA : artigo.getBoundingClientRect().bottom - innerHeight;
    f = Math.min(1, Math.max(0, -inicio / Math.max(fim - inicio, 1)));
  }
  return { i, f };
}

let agendado = false;
function aoRolar() {
  agendado = false;
  if (artigo && barra) {
    const caixa = artigo.getBoundingClientRect();
    const lido = Math.min(1, Math.max(0, -caixa.top / Math.max(caixa.height - innerHeight, 1)));
    barra.style.setProperty("--lido", lido.toFixed(4));
    barra.classList.toggle("escrevendo", lido > 0.002);
    if (progressoFeito && progressoTexto) {
      progressoFeito.style.transform = `scaleX(${lido.toFixed(4)})`;
      progressoTexto.textContent = `${Math.round(lido * 100)}% lido`;
    }
    if (progressoFalta && minutosDoArtigo) {
      const resto = Math.max(1, Math.ceil(minutosDoArtigo * (1 - lido)));
      progressoFalta.textContent = lido > 0.995 ? "chegou ao fim" : `faltam ${resto} min`;
    }
  }
  if (!secoes.length) return;
  ultimaLeitura = leitura();
  if (ultimaLeitura.i !== atual) marcarSumario(atual, ultimaLeitura.i);
  moverTinta();
}

// A seção atual (aria-current, com o marca-texto), as que ficaram para trás (com o visto, que fica
// mesmo voltando a rolagem), a subseção atual dentro dela e, se a lista rola, a atual sempre à vista.
function marcarSumario(de: number, para: number) {
  atual = para;
  for (let k = 0; k < para; k++) lidas.add(k);
  secoes.forEach(({ link, naFolha }, k) => {
    for (const a of [link, naFolha]) {
      if (!a) continue;
      if (k === para) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
      a.parentElement?.classList.toggle("lida", lidas.has(k));
    }
  });
  // As subseções da atual abrem (CSS): o fio precisa passar pelos pontos nos lugares novos.
  desenharFio();
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

function marcarSubsecao() {
  const daAtual = secoes[atual]?.link;
  let subAtual: HTMLAnchorElement | undefined;
  for (const { link, titulo, daSecao } of subsecoes) {
    if (daSecao === daAtual && titulo.getBoundingClientRect().top < LINHA) subAtual = link;
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
  const alvo = folha.querySelector<HTMLAnchorElement>('[aria-current="true"]') ?? folha.querySelector<HTMLAnchorElement>("a");
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
  if (innerWidth !== larguraAntes) desenharFio();
  larguraAntes = innerWidth;
  aoRolar();
});
lateralVisivel.addEventListener("change", () => {
  desenharFio();
  aoRolar();
});
if (listaTrilho) new ResizeObserver(() => desenharFio()).observe(listaTrilho);
document.fonts?.ready.then(() => {
  desenharFio();
  aoRolar();
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
