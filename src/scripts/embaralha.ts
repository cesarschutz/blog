/**
 * Linha 18 do redesenho (P6, do 10 Índice; F15-2: "só em detalhes e títulos pequenos"): a tira da ficha
 * ("Vol. 05 · ficha 2", ou "Coleção Java · ed. 7") embaralha ao entrar na tela, uma vez: por 0,4s as letras
 * e os números viram outros, e cada um assenta no lugar, da esquerda para a direita, como o carimbo de
 * catálogo sendo conferido. Só a chamada da tira (o `span` da esquerda, em mono), nunca texto grande.
 *
 * A tira é decorativa (`aria-hidden`): o leitor de tela não ouve a troca. Em mono, as letras têm a mesma
 * largura: nada na ficha se mexe. Os pontos, os espaços e o "·" ficam parados. A troca é a cada 45ms (não a
 * cada quadro), para ser um embaralhar legível, e não um chiado.
 *
 * Na chegada (a abertura ou a troca de página), as tiras à vista esperam a página pousar. As que estão
 * abaixo da dobra embaralham quando entram (junto com a entrada dos cards, revelar.ts). Cards e Lista
 * trocados, cards montados depois e páginas filtradas entram pelo MutationObserver. Com movimento
 * reduzido, nada embaralha.
 */
const SELETOR = "#conteudo .tira-ficha > span:first-child";
const DURACAO = 400;
const TROCA = 45;
const GLIFOS = "ABCDEFGHJKLMNPRSTUVXZabcdefhijkmnoprstuvxz0123456789";

const raiz = document.documentElement;
const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
const feitos = new WeakSet<Element>();

const sorteio = () => GLIFOS[Math.floor(Math.random() * GLIFOS.length)];

function embaralhar(el: HTMLElement) {
  const final = el.textContent ?? "";
  const n = final.length;
  if (!n) return;
  // A troca vai no próprio nó de texto (characterData): não acorda quem vigia o que entra no <main>.
  if (!(el.firstChild instanceof Text) || el.childNodes.length > 1) el.textContent = final;
  const no = el.firstChild as Text;
  // Quando cada letra assenta: depois de um quarto do tempo, da esquerda para a direita.
  const assenta = [...final].map((_, i) => DURACAO * (0.25 + (0.75 * (i + 1)) / n));
  const t0 = performance.now();
  let ultimo = -1;
  const quadro = () => {
    const t = performance.now() - t0;
    if (t >= DURACAO || reduzido.matches) {
      no.data = final;
      return;
    }
    const vez = Math.floor(t / TROCA);
    if (vez !== ultimo) {
      ultimo = vez;
      let s = "";
      for (let i = 0; i < n; i++) {
        const c = final[i];
        s += t >= assenta[i] || !/[A-Za-z0-9]/.test(c) ? c : sorteio();
      }
      no.data = s;
    }
    requestAnimationFrame(quadro);
  };
  requestAnimationFrame(quadro);
}

const olho = new IntersectionObserver(
  (vistas) => {
    // As que entram juntas (uma linha de cards) embaralham uma depois da outra, da esquerda para a direita,
    // no mesmo passo da entrada dos cards (60ms).
    const juntas = vistas
      .filter((v) => v.isIntersecting && v.intersectionRatio >= 0.6)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    juntas.forEach((v, i) => {
      olho.unobserve(v.target);
      setTimeout(() => embaralhar(v.target as HTMLElement), Math.min(i * 60, 240));
    });
  },
  { threshold: [0, 0.6, 1] },
);

function examinar() {
  for (const el of document.querySelectorAll<HTMLElement>(SELETOR)) {
    if (feitos.has(el) || el.getClientRects().length === 0) continue;
    feitos.add(el);
    olho.observe(el);
  }
}

let pedido = 0;
function examinarLogo() {
  if (pedido) return;
  pedido = requestAnimationFrame(() => {
    pedido = 0;
    examinar();
  });
}

let iniciado = false;
function iniciar() {
  if (iniciado) return;
  iniciado = true;
  examinar();
  new MutationObserver(examinarLogo).observe(raiz, { attributes: true, attributeFilter: ["data-post-view"] });
  addEventListener("cartoes:prontos", examinarLogo);
  const main = document.getElementById("conteudo");
  if (main) new MutationObserver((m) => m.some((x) => x.addedNodes.length) && examinarLogo()).observe(main, { childList: true, subtree: true });
}

if ("IntersectionObserver" in window && !reduzido.matches) {
  // A página pousa antes: a abertura (cs:aberto) ou a troca de página (cs:chegou).
  if (raiz.dataset.abertura) addEventListener("cs:aberto", iniciar, { once: true });
  else if (raiz.hasAttribute("data-vai-chegar") || raiz.hasAttribute("data-chegando")) addEventListener("cs:chegou", iniciar, { once: true });
  else iniciar();
  // Se ninguém avisar (a troca interrompida), começa assim mesmo.
  setTimeout(iniciar, 4000);
}

// Módulo (sem isto, o TypeScript trataria as variáveis daqui como globais).
export {};
