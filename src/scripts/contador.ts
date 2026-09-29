/**
 * O contador que rola (D49, protótipos E2 e E4): cada algarismo é uma fita de 0 a 9 numa janela da
 * altura da linha, e mudar o número leva cada fita até o algarismo novo, as dezenas um nada depois das
 * unidades; quando o número perde um algarismo (27 → 6), a coluna que sobra fecha a largura junto.
 * Quem anima é a transição de CSS (contador.css, com a duração em `--rola`); aqui, só a montagem e os
 * valores. As fitas ficam escondidas do leitor de tela, com o número em texto ao lado. Com movimento
 * reduzido, troca seco.
 */
import "../styles/contador.css";

// O vazio vem antes do 0: a coluna que some desce até ele (22 → 2 passa por 12), e a que volta sobe dele. Com
// o vazio depois do 9, ela passava por todos os números maiores (22 → 2 mostrava 32, 42… 92, D54).
const ALGARISMOS = [" ", ..."0123456789"];

/** Troca o número escrito em `el` pelas fitas, com `colunas` algarismos no máximo. */
export function criarContador(el: HTMLElement, valor: number, colunas = String(valor).length) {
  const texto = document.createElement("span");
  texto.className = "sr";
  const fitas = document.createElement("span");
  fitas.className = "fitas";
  fitas.setAttribute("aria-hidden", "true");
  for (let i = 0; i < colunas; i++) {
    const coluna = document.createElement("span");
    coluna.className = "coluna";
    const fita = document.createElement("span");
    fita.className = "fita";
    for (const a of ALGARISMOS) {
      const casa = document.createElement("span");
      casa.textContent = a;
      fita.append(casa);
    }
    coluna.append(fita);
    fitas.append(coluna);
  }
  el.classList.add("contador");
  el.replaceChildren(texto, fitas);
  mudarContador(el, valor);
}

/** Leva as fitas ao número novo. */
export function mudarContador(el: HTMLElement, valor: number) {
  const colunas = [...el.querySelectorAll<HTMLElement>(".coluna")];
  const escrito = String(Math.max(0, Math.round(valor)));
  el.querySelector(".sr")!.textContent = escrito;
  const algarismos = escrito.padStart(colunas.length, " ").slice(-colunas.length);
  colunas.forEach((coluna, i) => {
    const vazia = algarismos[i] === " ";
    coluna.classList.toggle("vazia", vazia);
    coluna.style.setProperty("--d", vazia ? "0" : String(Number(algarismos[i]) + 1));
  });
}
