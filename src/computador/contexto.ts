/**
 * O que os apps enxergam do sistema (sistema.ts): os tipos de app, de menu e de janela. Só tipos, para os
 * apps importarem sem puxar o sistema junto.
 */
import type { DadosM } from "./dados";
import type { AppId } from "./icones";

export type { AppId };

export type ItemDeMenu =
  | {
      rotulo: string;
      /** O atalho escrito à direita (só o texto; quem trata a tecla é o app ou o sistema). */
      atalho?: string;
      acao?: () => void;
      desativado?: boolean;
      /** O ✓ à esquerda (item que liga e desliga, ou a janela da frente na lista do menu Janela). */
      marcado?: boolean;
    }
  | { separador: true };

export interface Menu {
  titulo: string;
  itens: ItemDeMenu[];
}

export interface OpcoesDeJanela {
  app: AppId;
  titulo: string;
  /** Classe a mais na janela (o app estiliza o próprio conteúdo por ela). */
  classe?: string;
  largura: number;
  altura: number;
  minLargura?: number;
  minAltura?: number;
  /** O conteúdo do app, que o sistema põe dentro da moldura. As áreas com [data-arrastar] movem a janela. */
  conteudo: HTMLElement;
  /** Onde ficam os semáforos, a partir do canto de cima, à esquerda (padrão: 13 × 13, a barra de título). */
  semaforos?: { x: number; y: number };
  /** Sem redimensionar (a janela do Sobre). */
  fixa?: boolean;
  /** Para onde vai o foco quando a janela abre ou volta à frente. */
  focar?: () => void;
  aoFechar?: () => void;
  aoAtivar?: (ativa: boolean) => void;
  /** Chamado no fim de um redimensionamento (e ao ampliar), para o app se ajustar ao tamanho novo. */
  aoMudarTamanho?: () => void;
}

export interface Janela {
  readonly id: number;
  readonly app: AppId;
  readonly el: HTMLElement;
  readonly corpo: HTMLElement;
  titulo: string;
  minimizada: boolean;
  ampliada: boolean;
  definirTitulo(titulo: string): void;
  fechar(): Promise<void>;
  minimizar(): Promise<void>;
  restaurar(): Promise<void>;
  ampliar(): void;
  ativar(): void;
}

export interface App {
  id: AppId;
  nome: string;
  /** Abre o app: uma janela nova, ou o documento pedido (cada app sabe o que o pedido traz). */
  abrir(pedido?: unknown): Promise<void> | void;
  /** Os menus da barra quando o app está na frente (depois do menu com o nome do app). */
  menus(): Menu[];
  /** Os itens do menu com o nome do app (Sobre, Ocultar, Encerrar…), antes do Encerrar. */
  menuDoApp?(): ItemDeMenu[];
  /** Teclas do app quando uma janela dele está na frente (devolve true se usou a tecla). */
  tecla?(e: KeyboardEvent): boolean;
}

export interface Sistema {
  readonly raiz: HTMLDialogElement;
  readonly tela: HTMLElement;
  readonly reduzido: MediaQueryList;
  /** Tela pequena (celular): janelas em tela cheia, sem arrastar nem redimensionar. */
  readonly estreito: MediaQueryList;
  dados(): Promise<DadosM>;
  abrirApp(id: AppId, pedido?: unknown): Promise<void>;
  janelasDo(app: AppId): Janela[];
  criarJanela(opcoes: OpcoesDeJanela): Janela;
  /** O app pede para os menus da barra serem refeitos (um item marcado mudou, a janela mudou de título). */
  atualizarMenus(): void;
  /** O ícone do app no Dock pula (o app está abrindo algo). */
  pular(app: AppId): void;
  /** O app ficou aberto sem janela (o Terminal suspenso) ou fechou de vez: o ponto do Dock acompanha. */
  marcarAberto(app: AppId, aberto: boolean): void;
  /** Carrega o CSS de um app (só na primeira vez). */
  estilo(id: string, css: string): void;
  sair(): void;
}
