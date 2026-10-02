/** Os controles em prova nos posts (D65): o número da opção do protótipo para cada nome de controles. */
export const OPCAO_DOS_CONTROLES = { "marca-texto": 2, caderno: 3, "post-it": 4 } as const;
export type Controles = keyof typeof OPCAO_DOS_CONTROLES;
