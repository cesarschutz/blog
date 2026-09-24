/** Utilitários mínimos de hast para os plugins do Markdown (sem dependências). */

/** @returns {any} */
export const el = (tagName, properties = {}, children = []) => ({ type: "element", tagName, properties, children });

export const texto = (value) => ({ type: "text", value });

/** Texto de um nó e dos filhos. */
export const textoDe = (no) => (no.type === "text" ? no.value : (no.children ?? []).map(textoDe).join(""));

/**
 * Percorre a árvore trocando nós: `trocar(no)` devolve `undefined` para manter o nó (e descer nele)
 * ou uma lista com o que entra no lugar (lista vazia remove).
 */
export function substituir(no, trocar) {
  if (!Array.isArray(no.children)) return;
  no.children = no.children.flatMap((filho) => {
    const novos = trocar(filho);
    if (novos) return novos;
    substituir(filho, trocar);
    return [filho];
  });
}
