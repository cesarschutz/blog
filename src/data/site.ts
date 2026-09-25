/**
 * Recursos opcionais e desligados (briefing §5.3), como no blog atual: ficam prontos e só ligam
 * quando configurados aqui.
 * - Estatísticas com GoatCounter: o código do site (o "cesarschutz" de cesarschutz.goatcounter.com).
 * - Comentários com Giscus (Discussions do GitHub): habilitar Discussions no repositório, instalar o
 *   app Giscus e copiar os quatro valores que https://giscus.app mostra.
 */
export const ESTATISTICAS = {
  goatcounter: "",
};

export const COMENTARIOS = {
  repo: "",
  repoId: "",
  categoria: "",
  categoriaId: "",
};

export const COMENTARIOS_LIGADOS = Object.values(COMENTARIOS).every(Boolean);

/**
 * O autor (D33): nome e cargo, a foto do topo dos artigos e os perfis do cabeçalho e do rodapé, como
 * no blog atual. A foto é a do GitHub, baixada para o próprio site (public/autor.webp, 96 px, o triplo
 * do tamanho em que aparece): sem pedir nada a outro domínio a cada artigo (D33).
 */
export const AUTOR = {
  nome: "Cesar Schutz",
  cargo: "Arquiteto de soluções",
  foto: "/autor.webp",
  github: "https://github.com/cesarschutz",
  linkedin: "https://www.linkedin.com/in/cesar-schutz-10341a21/",
};

/** Frases do rodapé e da abertura, as mesmas do blog atual (D33). */
export const TEXTOS = {
  apresentacao:
    "Publico aqui o que ando estudando — lançamento do Java, código, arquitetura, IA, o que me despertar interesse. Quando o estudo rende algo que vale guardar, vira artigo.",
  rodape: "O que eu estudo virando artigo — arquitetura, código, Java, IA e o que mais aparecer.",
};
