/** Contrato comum dos motores de busca comparados na D2. */

export interface ResultadoBusca {
  url: string;
  titulo: string;
  /** Categoria ou série. */
  rotulo: string;
  /** Data curta ("10 set 2026"). */
  data: string;
  /** Trecho em HTML, com o termo em <mark>. */
  trecho: string;
  /** Sem o termo exato, só uma palavra parecida ("kafkaxyz" → Kafka). */
  aproximado?: boolean;
}

export interface MotorDeBusca {
  /** Baixa o que for preciso para buscar. Roda quando a busca abre, nunca antes. */
  preparar(): Promise<void>;
  buscar(consulta: string): Promise<ResultadoBusca[]>;
}

/** Minúsculas e sem acento, mantendo o comprimento do texto em português (NFD sem as marcas). */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/** Separa "#Kubernetes cronjob" em tag e texto. Tag com espaço vale com hífen: #banco-de-dados. */
export function separarTag(consulta: string): { tag?: string; texto: string } {
  const achado = consulta.trim().match(/^#(\S+)\s*(.*)$/);
  if (!achado) return { texto: consulta.trim() };
  return { tag: achado[1].replace(/-/g, " "), texto: achado[2].trim() };
}

/**
 * Palavra que marca a tag no texto indexado ("Banco de Dados" → "tagbancodedados"). Busca só por
 * tag procura essa palavra: o filtro do Pagefind sem termo baixaria o índice inteiro.
 */
export const palavraDaTag = (tag: string) => `tag${normalizar(tag).replace(/[^a-z0-9]/g, "")}`;

export const escaparHtml = (texto: string) =>
  texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
