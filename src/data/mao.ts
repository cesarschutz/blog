/**
 * Os títulos curtos escritos à mão (C05, D52): a papelaria de estudo — o post-it do "Neste artigo", a
 * ficha do livro do artigo e a ficha dos atalhos. Fora das notas da caneta (D48), é a única letra de mão
 * do blog, e só nestes títulos: itens, datas e texto seguem em IBM Plex Sans e Literata.
 *
 * A letra é a Caveat 600 das notas, num subconjunto só com as letras destes títulos
 * (src/assets/caveat-titulos.woff, ~11 KB, contra 51 KB da Caveat inteira), gerado por
 * `node scripts/caveat-titulos.mjs`. Título novo aqui = rodar o script de novo (o tipo `TituloAMao`
 * faz o `astro check` recusar um título que não esteja na lista).
 *
 * Sem imports: o script lê este arquivo direto com o Node 24.
 */
export const TITULOS_A_MAO = ["Neste artigo", "Do livro", "Da série", "Atalhos do teclado"] as const;

export type TituloAMao = (typeof TITULOS_A_MAO)[number];
