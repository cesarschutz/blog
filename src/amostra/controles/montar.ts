/**
 * Os controles em prova nos posts (D65): monta cada cartão `.cartao-proto` da página com o relógio comum
 * (relogio.ts) e a opção dele (`data-opcao`: 2 marca-texto, 3 caderno, 4 post-it). Usado pela Lousa e pela
 * Animacao quando recebem `controles=`.
 */
import { criarRelogio, type Relogio } from "./relogio";

type MontarOpcao = (relogio: Relogio, controles: HTMLElement, figura: HTMLElement) => void;
const opcoes = import.meta.glob<{ default: MontarOpcao }>("./opcao-*.ts");

export function montarCartoes(raiz: ParentNode = document) {
  for (const figura of raiz.querySelectorAll<HTMLElement>(".cartao-proto:not([data-montado])")) {
    figura.dataset.montado = "";
    const carregar = opcoes[`./opcao-${figura.dataset.opcao}.ts`];
    const controles = figura.querySelector<HTMLElement>(".proto-controles");
    const svg = figura.querySelector<SVGSVGElement>(".proto-palco svg");
    if (!carregar || !controles || !svg) continue;
    const relogio = criarRelogio(figura, svg);
    // Para as ferramentas de revisão e de fotos (scripts/desenho/revisar.mjs): o relógio fica no cartão.
    (figura as HTMLElement & { relogio?: Relogio }).relogio = relogio;
    void carregar().then((m) => {
      figura.querySelector(".proto-sem-js")?.remove();
      m.default(relogio, controles, figura);
    });
  }
}
