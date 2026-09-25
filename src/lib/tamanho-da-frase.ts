/**
 * Corpo da letra do post-it pelo tamanho da frase, como quem escreve num papel pequeno (D33): assim o
 * papel fica quase quadrado com qualquer frase. Num módulo à parte porque o script do post-it também
 * usa, e ele não pode levar as frases junto.
 */
export function tamanhoDaFrase(texto: string): "curta" | "media" | "longa" | "muito-longa" {
  const n = texto.length;
  return n <= 90 ? "curta" : n <= 140 ? "media" : n <= 170 ? "longa" : "muito-longa";
}
