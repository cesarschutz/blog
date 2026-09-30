/**
 * A caneta do caderno (D48, D56; antes, o caderno marcado da D41): as marcações à caneta dos artigos,
 * escritas no Markdown com diretivas (remark-directive). Todas estáticas: já vêm feitas, como se o
 * texto tivesse sido riscado antes de publicar. O guia editorial (os 34 tipos, quando usar cada um,
 * os limites e as regras de tela) está em docs/marcacoes.md; o visual, no DESIGN.md e em caneta.css.
 *
 * Em linha:
 *   :marca[o essencial do post]                 marca-texto amarelo (no máximo 2 por post)
 *   :ondulado[não basta]                        sublinhado ondulado
 *   :duplo[confira as claims]                   sublinhado duplo
 *   :circulo[P-521]                             círculo
 *   :caixa[`alg`]                               caixa à mão
 *   :nota[codificado]{texto="não é cifrado!"}   nota na margem, com seta, acima da palavra
 *   :riscado[P-512]{correcao="P-521"}           riscado com correção (sem `correcao`: riscado simples)
 *   :liga[timeout, então reenvio]               seta ligando causa e consequência
 *   :grifo[trecho]                              marca-texto baixo (a metade de baixo da linha)
 *   :aspas[exactly-once]                        aspas à mão
 *   :aparte[trecho]                             parênteses à mão (pode quebrar linha)
 *   :explica[3 × 3 × 3]{nota="um 3 por camada"} chave por baixo, com a nota embaixo dela
 *   :sobe[latência]  :desce[carga]              seta de tendência depois da palavra
 *   :ressalva[trecho]{texto="…"}                asterisco depois do trecho e a nota no pé do parágrafo
 * Em volta de um parágrafo:
 *   :::colchete  :::asterisco  :::exclamacao  :::pergunta{nota="…"}  :::comentario
 *   :::moldura  :::visto  :::validade{data="…"}  :::novo{data="…"}  :::postit  :::carimbo{texto="…"}
 * Em volta de uma lista:
 *   :::caixas (o primeiro `código` de cada item)   :::certo-errado (itens com :certo e :errado)
 *   :::passos (lista numerada)                      :::chave{nota="…"}
 *   :::escolha{nota="…"} (o item escolhido começa com :esta)
 * No bloco de código (atributos da cerca, lidos pelo plugin do Expressive Code em src/lib/codigo.ts):
 *   anotar="1789564500|15 min depois"   linhas="2-3|o banco decide"   numeros="5,6,7"   riscar="3|nota"
 *
 * O build cobra os limites do guia (D56): sem teto de total, no máximo 3 marca-textos e 5 do mesmo
 * tipo (fora os de lista), nunca duas no mesmo parágrafo, nada em títulos, e trechos curtos nos
 * traços que não quebram linha. Diretiva de texto com outro nome volta a ser texto (um "a:b" no meio
 * da frase não some); os nomes antigos da D41 (`:sublinhado`, `:::termos`) dão erro.
 */

const MAXIMO_MARCA = 3;
const MAXIMO_TIPO = 5;
/** Traços que não quebram linha: até aqui cabe numa linha de 320px. */
const MAXIMO_TRECHO = 32;
const MAXIMO_NOTA = 40;
/** Até aqui, o círculo à mão (que se cruza à esquerda); acima, o círculo que se cruza no alto. */
const CIRCULO_CURTO = 12;

const EM_LINHA = new Set(["marca", "ondulado", "duplo", "circulo", "caixa", "nota", "riscado", "liga", "grifo", "aspas", "aparte", "explica", "sobe", "desce", "ressalva"]);
const PARAGRAFO = new Set(["colchete", "asterisco", "exclamacao", "pergunta", "comentario", "moldura", "visto", "validade", "novo", "postit", "carimbo"]);
const LISTA = new Set(["caixas", "certo-errado", "passos", "chave", "escolha"]);
const SEM_QUEBRA = new Set(["ondulado", "duplo", "circulo", "caixa", "nota", "riscado", "liga", "aspas", "explica", "sobe", "desce", "ressalva"]);
const ANTIGOS = { sublinhado: "`:ondulado` ou `:duplo`", termos: "`:::caixas`" };

// ---------- os traços à mão (caminhos levemente irregulares, do catálogo docs/prototipos/caneta-do-caderno.html) ----------

const TRACOS = {
  ondulado: ["0 0 100 10", ["M1 6.5 C 18 3.5, 36 8, 55 5.5 S 86 4, 99 6"]],
  duplo: ["0 0 100 12", ["M1 3.5 C 30 2.5, 65 4.5, 99 3", "M4 9 C 35 8, 62 10, 97 8.5"]],
  circulo: ["0 0 100 44", ["M10 25 C 5 10, 38 3, 68 5 C 94 7, 99 27, 80 35 C 55 43, 12 40, 6 26 C 4 17, 16 9, 30 7"]],
  // Para trecho longo: começa e termina no alto (a volta que se cruza fica acima das letras, não em cima delas).
  circuloLongo: ["0 0 100 44", ["M58 3.5 C 82 3.5, 98.5 10, 98 22 C 97.5 34, 77 41.5, 50 41 C 23 40.5, 1.5 34, 2 21.5 C 2.5 10, 24 3, 47 3.2 C 57 3.3, 66 4.5, 73 7"]],
  caixa: ["0 0 100 40", ["M3 5 C 30 3, 70 4, 97 4.5 C 98.5 15, 98 28, 97 37 C 70 38.5, 30 38, 3.5 37 C 2 27, 2.5 14, 4 3"]],
  riscado: ["0 0 100 8", ["M1 5.5 C 30 3.5, 70 4.5, 99 2.5"]],
  liga: ["0 0 100 14", ["M2 13 C 10 2, 85 1, 97 11", "M92 8.5 L 97.5 11.5 L 95 6"]],
  seta: ["0 0 20 20", ["M17 2 C 9 3, 4 8, 3 16", "M1 12 L 3 16.5 L 7 14"]],
  colchete: ["0 0 12 100", ["M10 2 C 4 2, 3 5, 3.5 12 L 4 88 C 4 95, 5 98, 10 98"]],
  asterisco: ["0 0 16 16", ["M8 1.5 L 8 14.5", "M2.3 4.8 L 13.7 11.2", "M13.7 4.8 L 2.3 11.2"]],
  exclamacao: ["0 0 12 24", ["M6.5 2 C 6 8, 5.8 12, 5.5 16", "M5.4 21.2 L 5.6 21.6"]],
  pergunta: ["0 0 14 24", ["M2.5 7 C 2.5 2.5, 11.5 1.5, 11.5 7 C 11.5 10.5, 7 11, 6.8 15.5", "M6.6 21 L 6.8 21.4"]],
  certo: ["0 0 16 16", ["M2 8.5 L 6 12.5 L 14 3"]],
  errado: ["0 0 16 16", ["M3 3 L 13 13", "M13 3 L 3 13"]],
  roda: ["0 0 22 22", ["M11 2 C 5 2, 2 6, 2.5 11.5 C 3 17, 7 20, 12 19.5 C 17 19, 20 15, 19.5 10 C 19 5, 15 2.5, 9.5 3"]],
  chave: ["0 0 12 100", ["M2 2 C 7 2, 7 6, 7 14 L 7 42 C 7 47, 8 49, 11 50 C 8 51, 7 53, 7 58 L 7 86 C 7 94, 7 98, 2 98"]],
  comentario: ["0 0 18 18", ["M2 3 C 3 10, 7 13, 15 13", "M11 9.5 L 15.5 13 L 11 16"]],
  // D56: os tipos novos.
  aspasAbre: ["0 0 16 14", ["M6.5 1.5 C 4 3.5, 2.8 6.5, 3.4 10.5", "M13.5 1.5 C 11 3.5, 9.8 6.5, 10.4 10.5"]],
  aspasFecha: ["0 0 16 14", ["M2.6 1.5 C 5.2 3.5, 6.2 6.5, 5.6 10.5", "M9.6 1.5 C 12.2 3.5, 13.2 6.5, 12.6 10.5"]],
  parenteseAbre: ["0 0 10 40", ["M8 1.5 C 2.5 8, 1.2 17, 1.8 24 C 2.4 31, 4.6 35.5, 8.4 38.5"]],
  parenteseFecha: ["0 0 10 40", ["M2 1.5 C 7.5 8, 8.8 17, 8.2 24 C 7.6 31, 5.4 35.5, 1.6 38.5"]],
  chaveBaixo: ["0 0 100 12", ["M1.5 1.5 C 2 6, 5 6.2, 20 6.2 C 40 6.2, 47 6, 50 10.5 C 53 6, 60 6.2, 80 6.2 C 95 6.2, 98 6, 98.5 1.5"]],
  sobe: ["0 0 10 20", ["M5.2 18.8 C 5.5 13, 4.8 7.5, 5 1.8", "M1.6 5.6 L 5 1.4 L 8.5 5.3"]],
  desce: ["0 0 10 20", ["M5 1.2 C 4.7 7, 5.3 12.8, 5 18.2", "M1.5 14.4 L 5 18.8 L 8.4 14.7"]],
  // Perto das bordas: o desenho estica com o parágrafo, e 2% de 1.100px já encostariam no texto.
  moldura: ["0 0 100 100", ["M0.6 2.5 C 30 1.6, 70 2.2, 99.4 1.8 C 99.7 30, 99.2 70, 99.5 97.6 C 70 98.4, 30 98, 0.5 98.2 C 0.2 70, 0.7 30, 0.4 1.2"]],
  visto: ["0 0 20 20", ["M2 11.5 C 3.8 13.3, 5.6 15.8, 7 18.5 C 9.6 11.5, 13.6 5.8, 19 1.6"]],
  barraDupla: ["0 0 12 100", ["M3.5 2 C 4 30, 3 70, 3.6 98", "M8.5 2.5 C 9 30, 8.2 70, 8.8 97.5"]],
  setaEsquerda: ["0 0 20 12", ["M19 6.5 C 13 5.5, 8 6.5, 2 6", "M6 2 L 1.5 6 L 6 10"]],
};

/**
 * Um nó mdast que vira o hast dado: o mdast-util-to-hast aplica hName, hProperties e hChildren. Com
 * filhos mdast (o trecho marcado), eles viram hast normalmente.
 */
const m = (no) => (no.type === "text" ? no : { type: "caneta", data: { hName: no.tagName, hProperties: no.properties, hChildren: no.children } });
const envolver = (hName, hProperties, children) => ({ type: "caneta", children, data: { hName, hProperties } });
const h = (tagName, properties = {}, children = []) => ({ type: "element", tagName, properties, children });
const t = (value) => ({ type: "text", value });

function traco(nome, classe = "caneta-traco") {
  const [viewBox, caminhos] = TRACOS[nome];
  return h(
    "svg",
    { className: ["caneta-svg", classe], viewBox, preserveAspectRatio: "none", ariaHidden: "true", focusable: "false" },
    caminhos.map((d) => h("path", { d })),
  );
}

/** Texto só para leitor de tela (o traço é decorativo; o sentido dele vira palavra). */
const lido = (texto) => h("span", { className: ["caneta-sr"] }, [t(texto)]);

/** Nota escrita à mão: texto de verdade, entre parênteses para quem ouve. */
const escrita = (classe, texto, rotulo = "nota") =>
  h("span", { className: ["caneta-escrita", classe] }, [lido(` (${rotulo}: `), t(texto), lido(")")]);

// ---------- validação ----------

function erro(arquivo, no, mensagem) {
  const onde = no?.position ? `:${no.position.start.line}` : "";
  throw new Error(`Caneta (docs/marcacoes.md), ${arquivo.path ?? "post"}${onde}: ${mensagem}`);
}

const textoDe = (no) => (no.type === "text" || no.type === "inlineCode" ? no.value : (no.children ?? []).map(textoDe).join(""));

/** Um nó de texto de volta, para diretivas de texto que não são marcações ("às 03:00"). */
function comoTexto(no) {
  const nome = { type: "text", value: `:${no.name}` };
  if (!no.children?.length) return [nome];
  return [nome, { type: "text", value: "[" }, ...no.children, { type: "text", value: "]" }];
}

/** Atributos das cercas de código que a caneta usa (o Expressive Code lê os mesmos, codigo.ts). */
function canetaNoCodigo(meta) {
  const achados = [];
  for (const [, nome, valor] of String(meta ?? "").matchAll(/\b(anotar|linhas|numeros|riscar)="([^"]*)"/g)) achados.push({ nome, valor });
  return achados;
}

// ---------- o plugin ----------

export function remarkMarcacoes() {
  return (arvore, arquivo) => {
    // O catálogo do dev (/amostra/caneta/) mostra todos os tipos juntos: sem os limites de um post.
    const catalogo = /[\\/]src[\\/]amostra[\\/]caneta\.md$/.test(String(arquivo.path ?? ""));
    const contagem = new Map();
    const contar = (tipo, no) => {
      contagem.set(tipo, (contagem.get(tipo) ?? 0) + 1);
      contagem.set("total", (contagem.get("total") ?? 0) + 1);
      if (catalogo) return;
      if (tipo === "marca" && contagem.get(tipo) > MAXIMO_MARCA) erro(arquivo, no, `mais de ${MAXIMO_MARCA} marca-textos`);
      if (tipo !== "marca" && !LISTA.has(tipo) && contagem.get(tipo) > MAXIMO_TIPO)
        erro(arquivo, no, `mais de ${MAXIMO_TIPO} marcações do tipo "${tipo}"`);
    };

    const visitar = (no, dentroDeTitulo, paragrafo) => {
      if (!Array.isArray(no.children)) return;
      no.children = no.children.flatMap((filho) => {
        if (filho.type === "textDirective") return emLinha(filho, dentroDeTitulo, paragrafo);
        if (filho.type === "containerDirective" || filho.type === "leafDirective") return bloco(filho);
        if (filho.type === "code") {
          for (const { nome, valor } of canetaNoCodigo(filho.meta)) {
            if (nome === "numeros") {
              if (!/^\d+(\s*,\s*\d+)*$/.test(valor.trim())) erro(arquivo, filho, `numeros="${valor}": use "5,6,7"`);
              contar(nome, filho);
              continue;
            }
            if (nome === "riscar" && !/^\d+\|./.test(valor.trim())) erro(arquivo, filho, `riscar="${valor}": use "3|nota"`);
            const [alvo, nota] = valor.split("|");
            if (!alvo || !nota?.trim()) erro(arquivo, filho, `${nome}="…" precisa de "${nome === "anotar" ? "valor" : "3-4"}|nota"`);
            if (nome === "linhas" && !/^\d+(-\d+)?$/.test(alvo.trim())) erro(arquivo, filho, `linhas="${valor}": use "3-4|nota"`);
            if (nota.trim().length > MAXIMO_NOTA) erro(arquivo, filho, `nota com mais de ${MAXIMO_NOTA} caracteres: "${nota}"`);
            contar(nome, filho);
          }
          return [filho];
        }
        // O texto alternativo da imagem é calculado antes deste plugin: um "às 03:00" nele virava
        // diretiva e perdia o ":00". Ele volta a ser o texto do Markdown original.
        if (filho.type === "image" && filho.position && String(filho.alt ?? "") !== "") {
          const fonte = String(arquivo.value).slice(filho.position.start.offset, filho.position.end.offset);
          const rotulo = fonte.match(/^!\[([\s\S]*?)\]\(/)?.[1];
          if (rotulo?.includes(":")) filho.alt = rotulo.replace(/\\([\\`*_{}\[\]()#+\-.!:|])/g, "$1");
        }
        visitar(filho, dentroDeTitulo || filho.type === "heading", filho.type === "paragraph" ? {} : paragrafo);
        return [filho];
      });
      // A nota da ressalva vai para o pé do parágrafo em que ela está.
      if (no.type === "paragraph" && paragrafo?.pes?.length) no.children.push(...paragrafo.pes.splice(0));
    };

    function emLinha(no, dentroDeTitulo, paragrafo) {
      if (ANTIGOS[no.name]) erro(arquivo, no, `:${no.name} saiu na D48; use ${ANTIGOS[no.name]}`);
      if (no.name === "sinal") erro(arquivo, no, ":sinal saiu na D56 (abria um vão entre as palavras): deixe os dois termos em negrito");
      if (no.name === "certo" || no.name === "errado") erro(arquivo, no, `:${no.name} só no começo de um item de :::certo-errado`);
      if (no.name === "esta") erro(arquivo, no, ":esta só no começo de um item de :::escolha");
      if (!EM_LINHA.has(no.name)) {
        const trocados = comoTexto(no);
        const pai = { children: trocados };
        visitar(pai, dentroDeTitulo, paragrafo);
        return pai.children;
      }
      const tipo = no.name === "riscado" && no.attributes?.correcao ? "riscado-correcao" : no.name;
      if (dentroDeTitulo) erro(arquivo, no, `:${no.name} dentro de um título`);
      if (paragrafo) {
        paragrafo.marcas = (paragrafo.marcas ?? 0) + 1;
        if (paragrafo.marcas > 1) erro(arquivo, no, "duas marcações no mesmo parágrafo");
      }
      contar(tipo, no);
      const trecho = textoDe(no);
      if (SEM_QUEBRA.has(no.name) && trecho.length > MAXIMO_TRECHO)
        erro(arquivo, no, `:${no.name}[${trecho}] tem mais de ${MAXIMO_TRECHO} caracteres (não quebra linha; no celular sairia da tela)`);
      const nota = no.attributes?.texto ?? no.attributes?.correcao;
      if (nota && nota.length > MAXIMO_NOTA) erro(arquivo, no, `nota com mais de ${MAXIMO_NOTA} caracteres: "${nota}"`);
      // Nada de marcação dentro de marcação (conta como a segunda do parágrafo).
      const interno = { children: no.children };
      visitar(interno, dentroDeTitulo, { marcas: 1 });
      const filhos = interno.children;
      const classe = (nome) => ({ className: ["caneta", `caneta-${nome}`] });

      switch (no.name) {
        case "marca":
          return [envolver("mark", { className: ["caneta-marca"] }, filhos)];
        case "circulo": {
          const longo = trecho.length > CIRCULO_CURTO;
          const props = classe("circulo");
          if (longo) props.className.push("longo");
          return [envolver("span", props, [...filhos, m(traco(longo ? "circuloLongo" : "circulo"))])];
        }
        case "ondulado":
        case "duplo":
        case "caixa":
        case "liga":
          return [envolver("span", classe(no.name), [...filhos, m(traco(no.name))])];
        case "nota": {
          if (!no.attributes?.texto) erro(arquivo, no, ':nota[palavra]{texto="a nota"}: falta o texto');
          const escrito = h("span", { className: ["caneta-escrita", "caneta-nota-texto"] }, [
            traco("seta", "caneta-seta"),
            lido(" (nota: "),
            t(no.attributes.texto),
            lido(")"),
          ]);
          return [envolver("span", classe("nota"), [envolver("span", { className: ["caneta-alvo"] }, filhos), m(escrito)])];
        }
        case "riscado": {
          const riscado = envolver("s", {}, [...filhos, m(traco("riscado"))]);
          const correcao = no.attributes?.correcao;
          const props = classe("riscado");
          if (!correcao) return [envolver("span", props, [riscado])];
          props.className.push("com-correcao");
          return [envolver("span", props, [riscado, m(escrita("caneta-correcao", correcao, "correção"))])];
        }

        // ---------- tipos da D56 ----------
        case "grifo":
          return [envolver("mark", { className: ["caneta-grifo"] }, filhos)];
        case "aspas":
          return [envolver("span", classe("aspas"), [m(traco("aspasAbre", "caneta-aspas-abre")), ...filhos, m(traco("aspasFecha", "caneta-aspas-fecha")), m(lido(" (entre aspas)"))])];
        case "aparte":
          return [envolver("span", { className: ["caneta-aparte"] }, [m(traco("parenteseAbre", "caneta-parentese")), ...filhos, m(traco("parenteseFecha", "caneta-parentese"))])];
        case "explica": {
          const texto = no.attributes?.nota;
          if (!texto) erro(arquivo, no, ':explica[trecho]{nota="o que ele quer dizer"}: falta a nota');
          if (trecho.length > 24 || texto.length > 24) erro(arquivo, no, `:explica[${trecho}]: trecho e nota de até 24 caracteres`);
          const alvo = envolver("span", { className: ["caneta-explica-alvo"] }, [...filhos, m(traco("chaveBaixo"))]);
          const escrito = h("span", { className: ["caneta-escrita", "caneta-explica-nota"] }, [lido(" (quer dizer: "), t(texto), lido(")")]);
          return [envolver("span", classe("explica"), [alvo, m(escrito)])];
        }
        case "sobe":
        case "desce": {
          const seta = h("span", { className: ["caneta-tendencia-seta"] }, [traco(no.name), lido(no.name === "sobe" ? " (aumenta)" : " (diminui)")]);
          return [envolver("span", classe("tendencia"), [...filhos, m(seta)])];
        }
        case "ressalva": {
          if (!paragrafo) erro(arquivo, no, ":ressalva vai no texto de um parágrafo");
          if (!no.attributes?.texto) erro(arquivo, no, ':ressalva[trecho]{texto="a exceção"}: falta o texto');
          const pe = h("span", { className: ["caneta-escrita", "caneta-ressalva-pe"] }, [traco("asterisco", "caneta-ressalva-sinal"), lido(" (ressalva: "), t(no.attributes.texto), lido(")")]);
          (paragrafo.pes ??= []).push(m(pe));
          const marca = h("span", { className: ["caneta-ressalva-marca"] }, [traco("asterisco", "caneta-ressalva-sinal")]);
          return [envolver("span", classe("ressalva"), [...filhos, m(marca)])];
        }
      }
    }

    function bloco(no) {
      if (ANTIGOS[no.name]) erro(arquivo, no, `:::${no.name} saiu na D48; use ${ANTIGOS[no.name]}`);
      if (no.type === "leafDirective" || !(PARAGRAFO.has(no.name) || LISTA.has(no.name))) erro(arquivo, no, `diretiva desconhecida "${no.name}"`);
      contar(no.name === "caixas" ? "caixas" : no.name, no);

      if (PARAGRAFO.has(no.name)) {
        const paragrafos = no.children.filter((c) => c.type === "paragraph");
        if (paragrafos.length !== 1 || no.children.length !== 1) erro(arquivo, no, `:::${no.name} vai em volta de um parágrafo só`);
        // O parágrafo já tem a sua marcação: nada em linha dentro dele.
        visitar(paragrafos[0], false, { marcas: 1 });
        const props = { className: ["caneta-margem", `caneta-${no.name}`] };
        const novo = paragrafoNovo(no, paragrafos[0], props);
        if (novo) return novo;
        if (no.name === "comentario") {
          const p = paragrafos[0];
          p.data = { hName: "p", hProperties: { className: ["caneta-escrita"] } };
          p.children = [m(lido("Comentário do autor: ")), ...p.children];
          return [envolver("div", { className: ["caneta-comentario"] }, [m(traco("comentario")), p])];
        }
        const extra = [];
        if (no.name === "pergunta") {
          if (!no.attributes?.nota) erro(arquivo, no, ':::pergunta{nota="a pergunta do leitor"}: falta a nota');
          if (no.attributes.nota.length > MAXIMO_NOTA * 2) erro(arquivo, no, "a pergunta passa de 80 caracteres");
          extra.push(m(h("p", { className: ["caneta-escrita", "caneta-pergunta-nota"] }, [lido("Pergunta do leitor: "), t(no.attributes.nota)])));
        }
        return [envolver("div", props, [m(traco(no.name, "caneta-sinal-margem")), ...no.children, ...extra])];
      }

      const lista = no.children.find((c) => c.type === "list");
      if (!lista || no.children.length !== 1) erro(arquivo, no, `:::${no.name} vai em volta de uma lista só`);
      const itens = lista.children;
      const marcarLista = (classe) => (lista.data = { ...lista.data, hProperties: { ...(lista.data?.hProperties ?? {}), className: ["caneta-lista", classe] } });

      if (no.name === "caixas") {
        marcarLista("caneta-caixas");
        for (const item of itens) {
          const codigo = achar(item, "inlineCode");
          if (!codigo) erro(arquivo, item, ":::caixas: item sem `código` para a caixa");
          codigo.data = { hChildren: [t(codigo.value), traco("caixa")], hProperties: { className: ["caneta", "caneta-caixa", "caneta-caixa-codigo"] } };
        }
        visitar(lista, false, null);
        return [lista];
      }
      if (no.name === "certo-errado") {
        if (lista.ordered) erro(arquivo, no, ":::certo-errado vai numa lista com marcadores (-)");
        marcarLista("caneta-certo-errado");
        for (const item of itens) {
          const p = item.children[0];
          const primeiro = p?.type === "paragraph" ? p.children[0] : undefined;
          if (primeiro?.type !== "textDirective" || !["certo", "errado"].includes(primeiro.name))
            erro(arquivo, item, ":::certo-errado: cada item começa com :certo ou :errado");
          const certo = primeiro.name === "certo";
          p.children.splice(0, 1, m(traco(certo ? "certo" : "errado", "caneta-sinal-item")), m(lido(certo ? "Certo: " : "Errado: ")));
          // O espaço depois de ":certo " fica no texto seguinte; sem ele, o item começa colado.
          if (p.children[2]?.type === "text") p.children[2].value = p.children[2].value.replace(/^\s+/, "");
        }
        visitar(lista, false, null);
        return [lista];
      }
      if (no.name === "escolha") {
        // A volta à mão em torno do item escolhido e a nota ao lado dele.
        const nota = no.attributes?.nota ?? "a recomendada";
        if (nota.length > 24) erro(arquivo, no, `:::escolha: nota="${nota}" passa de 24 caracteres`);
        const comeca = (item) => {
          const p = item.children[0];
          const primeiro = p?.type === "paragraph" ? p.children[0] : undefined;
          return primeiro?.type === "textDirective" && primeiro.name === "esta";
        };
        const escolhidos = itens.filter(comeca);
        if (escolhidos.length !== 1) erro(arquivo, no, ":::escolha: marque um item só, começando por :esta");
        const p = escolhidos[0].children[0];
        p.children.splice(0, 1);
        if (p.children[0]?.type === "text") p.children[0].value = p.children[0].value.replace(/^\s+/, "");
        const escrito = h("span", { className: ["caneta-escrita", "caneta-escolha-nota"] }, [traco("setaEsquerda", "caneta-escolha-seta"), lido(" (nota: "), t(nota), lido(")")]);
        p.children = [envolver("span", { className: ["caneta-escolhida"] }, [...p.children, m(traco("circuloLongo"))]), m(escrito)];
        marcarLista("caneta-escolha");
        visitar(lista, false, null);
        return [lista];
      }
      if (no.name === "passos") {
        if (!lista.ordered) erro(arquivo, no, ":::passos vai numa lista numerada (1.)");
        marcarLista("caneta-passos");
        itens.forEach((item, i) => {
          const p = item.children[0];
          const numero = m(h("span", { className: ["caneta-numero"], ariaHidden: "true" }, [traco("roda"), h("span", {}, [t(String((lista.start ?? 1) + i))])]));
          if (p?.type === "paragraph") p.children.unshift(numero);
          else item.children.unshift(numero);
        });
        visitar(lista, false, null);
        return [lista];
      }
      // chave
      if (!no.attributes?.nota) erro(arquivo, no, ':::chave{nota="o comentário"}: falta a nota');
      if (no.attributes.nota.length > MAXIMO_NOTA) erro(arquivo, no, `nota com mais de ${MAXIMO_NOTA} caracteres`);
      marcarLista("caneta-chave-lista");
      visitar(lista, false, null);
      const lado = h("div", { className: ["caneta-chave-lado"] }, [traco("chave"), escrita("caneta-chave-texto", no.attributes.nota)]);
      return [envolver("div", { className: ["caneta-chave"] }, [lista, m(lado)])];
    }

    /** Os tipos da D56 em volta de um parágrafo; o visto segue o caminho das marcas de margem. */
    function paragrafoNovo(no, p, props) {
      const atributo = (nome, maximo) => {
        const valor = no.attributes?.[nome];
        if (!valor) erro(arquivo, no, `:::${no.name}{${nome}="…"}: falta o ${nome}`);
        if (valor.length > maximo) erro(arquivo, no, `:::${no.name}: ${nome} passa de ${maximo} caracteres`);
        return valor;
      };
      switch (no.name) {
        case "moldura":
          return [envolver("div", { className: ["caneta-moldura"] }, [m(traco("moldura", "caneta-moldura-traco")), p])];
        case "validade": {
          const data = atributo("data", 20);
          const onda = h("span", { className: ["caneta-sinal-margem", "caneta-validade-onda"], ariaHidden: "true" });
          return [envolver("div", props, [m(onda), p]), m(h("p", { className: ["caneta-escrita", "caneta-validade-nota"] }, [t(`conferido em ${data}`)]))];
        }
        case "novo": {
          const data = atributo("data", 20);
          return [m(h("p", { className: ["caneta-escrita", "caneta-novo-rotulo"] }, [t(`novo em ${data}`)])), envolver("div", props, [m(traco("barraDupla", "caneta-sinal-margem")), p])];
        }
        case "postit":
          if (textoDe(p).length > 140) erro(arquivo, no, ":::postit: o lembrete passa de 140 caracteres");
          p.data = { hName: "p", hProperties: { className: ["caneta-escrita"] } };
          p.children = [m(lido("Lembrete: ")), ...p.children];
          return [envolver("div", { className: ["caneta-postit"], role: "note" }, [p])];
        case "carimbo": {
          const texto = atributo("texto", 40);
          const selo = h("span", { className: ["caneta-carimbo-selo"] }, [traco("visto"), lido("Carimbo: "), t(texto)]);
          return [envolver("div", { className: ["caneta-carimbado"] }, [p, m(h("p", { className: ["caneta-carimbo"] }, [selo]))])];
        }
      }
    }

    visitar(arvore, false, null);
    const total = contagem.get("total") ?? 0;
    // A letra à mão (Caveat) só baixa nos posts que têm nota escrita (D48).
    const escritas = ["nota", "riscado-correcao", "pergunta", "comentario", "chave", "passos", "anotar", "linhas", "explica", "ressalva", "validade", "novo", "postit", "escolha", "numeros", "riscar"];
    const astro = (arquivo.data.astro ??= {});
    (astro.frontmatter ??= {}).caneta = { total, escrita: escritas.some((e) => contagem.has(e)) };
  };
}

function achar(no, tipo) {
  if (no.type === tipo) return no;
  for (const filho of no.children ?? []) {
    const achado = achar(filho, tipo);
    if (achado) return achado;
  }
}
