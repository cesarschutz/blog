/**
 * Tema (D24, D33, D39, D52 C01): claro ou escuro, pelo botão do cabeçalho. O padrão é sempre claro,
 * sem seguir o sistema: a escolha fica em `localStorage["cs-theme"]`, com a data da última troca
 * em `localStorage["cs-prefs-quando"]` (compartilhada com o modo Lista/Cards, SeletorModo.astro) —
 * passados 3 dias dessa data, o script anti-piscada do <head> (Base.astro) ignora a escolha e volta
 * ao padrão. O evento "tema:mudou" mantém os controles em sincronia.
 */
export type Escolha = "light" | "dark" | "";

const CHAVE = "cs-theme";
const QUANDO = "cs-prefs-quando";
const raiz = document.documentElement;
const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
const originais = metas.map((meta) => meta.content);

/**
 * A escolha em vigor nesta página. Vem do `data-theme` (o script do <head> o põe a partir do
 * armazenamento), e não do armazenamento, que pode estar bloqueado.
 */
function lerEscolha(): Escolha {
  const valor = raiz.dataset.theme;
  return valor === "light" || valor === "dark" ? valor : "";
}

/** O tema que está na tela: a escolha ou, sem escolha, claro (D52, C01: não segue mais o sistema). */
export function temaNaTela(): "light" | "dark" {
  return lerEscolha() || "light";
}

// A barra do navegador acompanha a escolha; em "sistema", volta às cores por media query.
// Só lê o estilo com uma escolha feita: ao abrir no tema do sistema (o normal, D33), a leitura
// forçava um recálculo de estilo da página inteira (53 ms com CPU 4× no java-25, D37).
function pintarBarra(valor: Escolha) {
  const fundo = valor ? getComputedStyle(raiz).getPropertyValue("--paper").trim() : "";
  metas.forEach((meta, i) => (meta.content = valor ? fundo : originais[i]));
}

function aplicarTema(valor: Escolha) {
  // C01 (D52): sem escolha (ou vencida), o padrão é sempre claro, nunca o do sistema.
  raiz.dataset.theme = valor || "light";
  try {
    if (valor) {
      localStorage.setItem(CHAVE, valor);
      localStorage.setItem(QUANDO, String(Date.now()));
    } else {
      localStorage.removeItem(CHAVE);
    }
  } catch {
    // Navegação privada ou armazenamento bloqueado: a escolha vale só nesta página.
  }
  pintarBarra(valor || "light");
  dispatchEvent(new CustomEvent("tema:mudou"));
}

/** Chama `ao` agora e sempre que o tema mudar (pelo botão do cabeçalho). */
export function aoMudarTema(ao: () => void) {
  addEventListener("tema:mudou", ao);
  ao();
}

pintarBarra(lerEscolha());

/** Desfaz o que a troca em andamento pôs na página (a classe, o color-scheme e as cores do botão). */
let desfazer: (() => void) | null = null;

/**
 * Troca o tema pelo botão (D42, D44): indo para o escuro, o escuro se espalha em círculo a partir do
 * botão; voltando ao claro, o escuro se fecha de fora para dentro até sumir no botão. É a View
 * Transition do próprio documento (`startViewTransition`, tipos "tema" e "tema-fecha"; o círculo é
 * o `clip-path` da imagem escura, em base.css). Durante a troca, os outros nomes de transição (os
 * livros) saem, para a página inteira virar junto. Sem View Transitions com tipos, ou com movimento
 * reduzido, a troca é direta.
 */
export function trocarTema(valor: Escolha, origem: Element) {
  const podeTipos = "startViewTransition" in document && typeof ViewTransition !== "undefined" && "types" in ViewTransition.prototype;
  if (!podeTipos || matchMedia("(prefers-reduced-motion: reduce)").matches) return aplicarTema(valor);
  // Clique no meio de uma troca: a anterior é desfeita antes (o navegador a pula).
  desfazer?.();
  const r = origem.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  raiz.style.setProperty("--tema-x", `${x}px`);
  raiz.style.setProperty("--tema-y", `${y}px`);
  // O círculo nasce do tamanho do botão (e, voltando ao claro, morre nele).
  raiz.style.setProperty("--tema-r0", `${r.width / 2}px`);
  raiz.style.setProperty("--tema-raio", `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
  raiz.classList.add("trocando-tema");
  const tipo = valor === "dark" ? "tema" : "tema-fecha";
  // O botão fica por cima da troca (base.css, `botao-tema`). Voltando ao claro, o escuro só sai de
  // cima dele no fim: até lá, ele guarda as cores do escuro (senão ficava branco sobre o escuro).
  const cores = valor === "dark" ? null : congelarCores(origem);
  // A barra de rolagem da página fica fora da troca e seguiria o tema na hora: vira no fim, com o círculo.
  raiz.style.colorScheme = getComputedStyle(raiz).colorScheme;
  const esta = () => {
    raiz.classList.remove("trocando-tema");
    raiz.style.removeProperty("color-scheme");
    cores?.();
    desfazer = null;
  };
  desfazer = esta;
  const transicao = document.startViewTransition({ update: () => aplicarTema(valor), types: [tipo] });
  transicao.finished.finally(() => {
    if (desfazer === esta) esta();
  });
}

/** Põe no elemento, em linha, as cores que ele tem agora; devolve quem as tira. */
function congelarCores(el: Element) {
  if (!(el instanceof HTMLElement)) return () => {};
  const estilo = getComputedStyle(el);
  const props = ["color", "background-color", "border-color"] as const;
  const valores = props.map((p) => estilo.getPropertyValue(p));
  props.forEach((p, i) => el.style.setProperty(p, valores[i]));
  return () => props.forEach((p) => el.style.removeProperty(p));
}
