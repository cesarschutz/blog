/**
 * PDF mínimo com uma imagem JPEG por página, para o "Baixar PDF" da apresentação (D9). O JPEG entra
 * como está (filtro DCTDecode); cada página tem o tamanho da imagem a 96 dpi e um conteúdo que só
 * desenha a imagem na página toda. Sem biblioteca: é o pedaço do formato que precisamos.
 */
export interface PaginaJpeg {
  jpeg: Uint8Array;
  largura: number;
  altura: number;
}

/** Texto do PDF em UTF-16BE com BOM, em hexadecimal: aceita acentos no título. */
const textoPdf = (s: string) =>
  `<FEFF${Array.from({ length: s.length }, (_, i) => s.charCodeAt(i).toString(16).padStart(4, "0")).join("")}>`;

export function pdfDeImagens(paginas: PaginaJpeg[], titulo: string): Uint8Array<ArrayBuffer> {
  const codificar = new TextEncoder();
  const partes: Uint8Array[] = [];
  const posicoes: number[] = [];
  let tamanho = 0;
  const escrever = (...dados: (string | Uint8Array)[]) => {
    for (const dado of dados) {
      const bytes = typeof dado === "string" ? codificar.encode(dado) : dado;
      partes.push(bytes);
      tamanho += bytes.length;
    }
  };
  const objeto = (numero: number, ...corpo: (string | Uint8Array)[]) => {
    posicoes[numero] = tamanho;
    escrever(`${numero} 0 obj\n`, ...corpo, "\nendobj\n");
  };

  // Objetos: 1 catálogo, 2 páginas, 3 informações; depois, por página, a página, a imagem e o desenho.
  const pagina = (i: number) => 4 + 3 * i;
  escrever("%PDF-1.4\n%âãÏÓ\n");
  objeto(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objeto(2, `<< /Type /Pages /Count ${paginas.length} /Kids [${paginas.map((_, i) => `${pagina(i)} 0 R`).join(" ")}] >>`);
  objeto(3, `<< /Title ${textoPdf(titulo)} /Author ${textoPdf("Cesar Schutz")} >>`);
  paginas.forEach((p, i) => {
    const [w, h] = [p.largura * 0.75, p.altura * 0.75].map((v) => Number(v.toFixed(2)));
    const desenho = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`;
    objeto(
      pagina(i),
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 ${pagina(i) + 1} 0 R >> >> /Contents ${pagina(i) + 2} 0 R >>`,
    );
    objeto(
      pagina(i) + 1,
      `<< /Type /XObject /Subtype /Image /Width ${p.largura} /Height ${p.altura} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`,
      p.jpeg,
      "\nendstream",
    );
    objeto(pagina(i) + 2, `<< /Length ${desenho.length} >>\nstream\n${desenho}\nendstream`);
  });

  const total = pagina(paginas.length);
  const inicioDaTabela = tamanho;
  escrever(
    `xref\n0 ${total}\n0000000000 65535 f \n`,
    ...posicoes.slice(1).map((p) => `${String(p).padStart(10, "0")} 00000 n \n`),
    `trailer\n<< /Size ${total} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${inicioDaTabela}\n%%EOF\n`,
  );

  const pdf = new Uint8Array(tamanho);
  let deslocamento = 0;
  for (const parte of partes) {
    pdf.set(parte, deslocamento);
    deslocamento += parte.length;
  }
  return pdf;
}
