/**
 * Tema (D24): claro, escuro ou sistema, guardado em `localStorage["cs-theme"]` (a mesma chave do
 * blog atual). Usado pelo botão do cabeçalho (alterna claro e escuro) e pelo seletor do rodapé
 * (claro, escuro, sistema), que ficam em sincronia pelo evento "tema:mudou". O script anti-piscada
 * do <head> (Base.astro) aplica a escolha antes da primeira pintura.
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
function pintarBarra(valor: Escolha) {
  const fundo = getComputedStyle(raiz).getPropertyValue("--paper").trim();
  metas.forEach((meta, i) => (meta.content = valor ? fundo : originais[i]));
}

export function aplicarTema(valor: Escolha) {
  if (valor) raiz.dataset.theme = valor;
  else delete raiz.dataset.theme;
  try {
    if (valor) localStorage.setItem(CHAVE, valor);
    else localStorage.removeItem(CHAVE);
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
