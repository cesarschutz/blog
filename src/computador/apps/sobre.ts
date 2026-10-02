/**
 * "Sobre este computador" e "Atalhos do computador" (o menu "cs" e o menu Ajuda): duas janelinhas fixas,
 * sem redimensionar, como a do Sobre do Mac. A do Sobre mostra o computador desenhado (a tela com o papel
 * de parede) e os números do blog; a dos Atalhos, as teclas que valem aqui dentro.
 */
import cssDoSobre from "../estilos/sobre.css?inline";
import type { App, Janela, Sistema } from "../contexto";

export function criar(s: Sistema): App {
  s.estilo("sobre", cssDoSobre);
  let sobre: Janela | undefined;
  let atalhos: Janela | undefined;

  async function abrirSobre() {
    if (sobre && !sobre.minimizada) return sobre.ativar();
    if (sobre?.minimizada) return sobre.restaurar();
    const el = document.createElement("div");
    el.className = "mac-sobre";
    el.innerHTML = `
      <div class="mac-sobre-topo" data-arrastar></div>
      <div class="mac-sobre-maquina" aria-hidden="true"><span class="mac-sobre-tampa"><span class="mac-sobre-visor"></span></span><span class="mac-sobre-base"></span></div>
      <h2 class="mac-sobre-nome">Computador do Cesar</h2>
      <p class="mac-sobre-modelo">MacBook Pro de mentira, 2026</p>
      <dl class="mac-sobre-dados" data-dados><div><dt>Sistema</dt><dd>Golden Gate 27, de mentira</dd></div></dl>
      <p class="mac-sobre-rodape">Desenhado para o blog: nada aqui é da Apple.</p>`;
    sobre = s.criarJanela({ app: "sobre", titulo: "Sobre este computador", classe: "mac-janela--fixa", largura: 300, altura: 404, fixa: true, conteudo: el, aoFechar: () => (sobre = undefined) });
    try {
      const d = await s.dados();
      const livros = d.livros.filter((l) => !l.serie).length;
      const series = d.livros.length - livros;
      el.querySelector("[data-dados]")!.innerHTML =
        `<div><dt>Artigos</dt><dd>${d.posts.length}</dd></div>` +
        `<div><dt>Livros</dt><dd>${livros} livros e ${series} ${series === 1 ? "série" : "séries"}</dd></div>` +
        `<div><dt>Tags</dt><dd>${d.tags.length}</dd></div>` +
        `<div><dt>Sistema</dt><dd>Golden Gate 27, de mentira</dd></div>`;
    } catch {}
  }

  function abrirAtalhos() {
    if (atalhos && !atalhos.minimizada) return atalhos.ativar();
    if (atalhos?.minimizada) return void atalhos.restaurar();
    const el = document.createElement("div");
    el.className = "mac-sobre mac-atalhos";
    const linha = (teclas: string, o: string) => `<div><dt>${teclas}</dt><dd>${o}</dd></div>`;
    el.innerHTML = `
      <div class="mac-sobre-topo" data-arrastar></div>
      <h2 class="mac-sobre-nome">Atalhos do computador</h2>
      <dl class="mac-sobre-dados mac-atalhos-lista">
        ${linha("<kbd>⌃</kbd><kbd>⌥</kbd><kbd>Q</kbd>", "Sair do computador")}
        ${linha("<kbd>esc</kbd>", "Fecha o menu ou a janela da frente")}
        ${linha("<kbd>⌃</kbd><kbd>`</kbd>", "Terminal suspenso (desce do alto)")}
        ${linha("<kbd>`</kbd>", "No blog, fora daqui: o Terminal desce sobre a página")}
        ${linha("<kbd>Tab</kbd>", "Barra de menus, área de trabalho, janelas e Dock")}
        ${linha("<kbd>←</kbd><kbd>→</kbd>", "Andar nos menus e no Dock")}
        ${linha("<kbd>↵</kbd>", "Abrir o que está escolhido")}
      </dl>
      <p class="mac-sobre-rodape">No Windows e no Linux, <kbd>Ctrl</kbd> no lugar de <kbd>⌃</kbd> e <kbd>Alt</kbd> no de <kbd>⌥</kbd>.</p>`;
    atalhos = s.criarJanela({ app: "sobre", titulo: "Atalhos do computador", classe: "mac-janela--fixa", largura: 390, altura: 344, fixa: true, conteudo: el, aoFechar: () => (atalhos = undefined) });
  }

  return {
    id: "sobre",
    nome: "Finder",
    abrir(pedido) {
      if ((pedido as { aba?: string } | undefined)?.aba === "atalhos") return abrirAtalhos();
      return abrirSobre();
    },
    menus: () => [],
  };
}
