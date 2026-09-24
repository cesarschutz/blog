/**
 * Interações do artigo (briefing §5.3): barra de leitura, voltar ao topo, seção atual no sumário
 * lateral, notas laterais que abrem no lugar nas telas menores, visor de imagens e a apresentação
 * (setas, contador e tela cheia). Sem JS o artigo continua inteiro: as notas abrem por âncora, a
 * apresentação rola de lado e o PDF baixa.
 */
const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
const rolagem = (): ScrollBehavior => (reduzir.matches ? "auto" : "smooth");

// ---------- barra de leitura, voltar ao topo e seção atual ----------

const artigo = document.querySelector<HTMLElement>("[data-artigo]");
const barra = document.querySelector<HTMLElement>("[data-barra-leitura]");
const voltar = document.querySelector<HTMLButtonElement>("[data-voltar-topo]");
const secoes = [...document.querySelectorAll<HTMLAnchorElement>("[data-secao]")].flatMap((link) => {
  const titulo = document.getElementById(link.dataset.secao!);
  return titulo ? [{ link, titulo }] : [];
});

let agendado = false;
function aoRolar() {
  agendado = false;
  if (artigo && barra) {
    const caixa = artigo.getBoundingClientRect();
    const lido = Math.min(1, Math.max(0, -caixa.top / Math.max(caixa.height - innerHeight, 1)));
    barra.style.transform = `scaleX(${lido.toFixed(4)})`;
  }
  voltar?.classList.toggle("visivel", scrollY > innerHeight);
  let atual: HTMLAnchorElement | undefined;
  for (const { link, titulo } of secoes) if (titulo.getBoundingClientRect().top < 140) atual = link;
  for (const { link } of secoes) {
    if (link === atual) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
}
addEventListener(
  "scroll",
  () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(aoRolar);
  },
  { passive: true },
);
addEventListener("resize", aoRolar);
aoRolar();

if (voltar) {
  voltar.hidden = false;
  voltar.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: rolagem() });
    document.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
  });
}

// ---------- notas laterais ----------

const estreita = matchMedia("(max-width: 1179px)");
for (const chamada of document.querySelectorAll<HTMLAnchorElement>("[data-ref-nota]")) {
  const nota = document.getElementById(decodeURIComponent(chamada.hash.slice(1)));
  if (!nota) continue;
  chamada.setAttribute("aria-controls", nota.id);
  chamada.setAttribute("aria-expanded", "false");
  chamada.addEventListener("click", (e) => {
    e.preventDefault();
    // Na margem a nota já está à vista; nas telas menores, abre e fecha no lugar.
    if (!estreita.matches) return;
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

function criarVisor(): HTMLDialogElement {
  const dialogo = document.createElement("dialog");
  dialogo.className = "visor";
  dialogo.innerHTML = `<figure class="visor-quadro"><img alt=""></figure>
    <div class="visor-barra"><span class="posicao" aria-live="polite"></span>
    <button type="button" class="botao" data-visor="anterior">Anterior</button>
    <button type="button" class="botao" data-visor="proximo">Próximo</button>
    <button type="button" class="botao" data-visor="fechar">Fechar</button></div>`;
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
  visor!.querySelector(".posicao")!.textContent = galeria ? `${indice + 1} de ${imagens.length}` : "";
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
