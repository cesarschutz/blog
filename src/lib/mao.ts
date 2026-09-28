/**
 * A letra dos títulos à mão (C05, D52): a Caveat 600 num subconjunto com só as letras de TITULOS_A_MAO
 * (src/data/mao.ts, gerado por scripts/caveat-titulos.mjs), com nome próprio de família para não se
 * misturar com a Caveat inteira das notas da caneta (D48), que continua só nos posts com nota. Declarada
 * em toda página de artigo (o post-it, as fichas do livro e a dos atalhos só existem lá) e pré-carregada
 * (~10 KB): a ficha do livro aparece em toda largura (o post-it na lateral, a ficha no fim do artigo), e,
 * sem o pré-carregamento, o título do post-it podia chegar na letra de reserva e trocar depois.
 */
import arquivo from "../assets/caveat-titulos.woff?url";

export { TITULOS_A_MAO, type TituloAMao } from "../data/mao";

export const arquivoDaMao = arquivo;

export const fonteDaMao = `@font-face{font-family:"Caveat Titulos";font-style:normal;font-weight:600;font-display:swap;src:url(${arquivo}) format("woff")}`;
