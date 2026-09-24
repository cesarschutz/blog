declare namespace App {
  interface Locals {
    /**
     * Posto só pelo RSS (src/pages/rss.xml.ts), que renderiza os posts .mdx pela Container API:
     * leitor de feed não roda script nem CSS, então as lousas viram texto e link para o post.
     */
    rss?: { endereco: string };
  }
}
