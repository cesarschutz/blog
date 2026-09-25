/**
 * Tema (D24, D33): claro, escuro ou sistema, escolhido no menu de aparência do cabeçalho. O site
 * sempre abre no tema do sistema (pedido do Cesar): a escolha fica em `sessionStorage["cs-theme"]`,
 * vale enquanto a aba está aberta (de página em página) e some ao fechar. O evento "tema:mudou"
 * mantém os controles em sincronia; o script anti-piscada do <head> (Base.astro) aplica a escolha
 * antes da primeira pintura.
 */
export type Escolha = "light" | "dark" | "";

const CHAVE = "cs-theme";
const raiz = document.documentElement;
const sistemaEscuro = matchMedia("(prefers-color-scheme: dark)");
const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
const originais = metas.map((meta) => meta.content);

/**
 * A escolha em vigor nesta página. Vem do `data-theme` (o script do <head> o põe a partir do
 * armazenamento), e não do armazenamento, que pode estar bloqueado.
 */
export function lerEscolha(): Escolha {
  const valor = raiz.dataset.theme;
  return valor === "light" || valor === "dark" ? valor : "";
}

/** O tema que está na tela: a escolha ou, sem escolha, o do sistema. */
export function temaNaTela(): "light" | "dark" {
  return lerEscolha() || (sistemaEscuro.matches ? "dark" : "light");
}

// A barra do navegador acompanha a escolha; em "sistema", volta às cores por media query.
// Só lê o estilo com uma escolha feita: ao abrir no tema do sistema (o normal, D33), a leitura
// forçava um recálculo de estilo da página inteira (53 ms com CPU 4× no java-25, D37).
function pintarBarra(valor: Escolha) {
  const fundo = valor ? getComputedStyle(raiz).getPropertyValue("--paper").trim() : "";
  metas.forEach((meta, i) => (meta.content = valor ? fundo : originais[i]));
}

export function aplicarTema(valor: Escolha) {
  if (valor) raiz.dataset.theme = valor;
  else delete raiz.dataset.theme;
  try {
    if (valor) sessionStorage.setItem(CHAVE, valor);
    else sessionStorage.removeItem(CHAVE);
  } catch {
    // Navegação privada ou armazenamento bloqueado: a escolha vale só nesta página.
  }
  pintarBarra(valor);
  dispatchEvent(new CustomEvent("tema:mudou"));
}

/** Chama `ao` agora e sempre que o tema mudar (por um dos controles ou pelo sistema). */
export function aoMudarTema(ao: () => void) {
  addEventListener("tema:mudou", ao);
  sistemaEscuro.addEventListener("change", ao);
  ao();
}

pintarBarra(lerEscolha());
