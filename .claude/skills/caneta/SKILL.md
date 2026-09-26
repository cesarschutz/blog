---
name: caneta
description: A passada de caneta num post (D48): marca o texto à caneta azul, estática, com os 20 tipos do guia docs/marcacoes.md, depois de propor a lista (trecho, tipo e motivo) e ter o OK do Cesar. É a última etapa da skill post, depois que texto, desenhos e animações estão prontos e aprovados. Use também quando o Cesar pedir sozinho para marcar ou remarcar um post ("passa a caneta no post X", "refaz as marcações do X").
---

# Caneta

A passada de caneta é a **última etapa** de um post: entra depois que o texto, os desenhos e as
animações estão prontos e aprovados (skill `post`, passo 9). O Cesar também pode chamá-la sozinha
para marcar ou remarcar qualquer post. As marcações são estáticas, na caneta azul, e seguem o guia
`docs/marcacoes.md`, que é **vivo**: ele muda com os ajustes do Cesar.

## Passos (sempre, nesta ordem)

### 1. Ler o guia inteiro

Leia `docs/marcacoes.md` do começo ao fim, **inclusive a seção "Ajustes do Cesar"**: cada ajuste ali
vale para este post. Se o guia e esta skill divergirem, vale o guia (e corrija a skill).

### 2. Ler o post inteiro

Leia o arquivo do post em `src/content/posts/` do começo ao fim, com os blocos de código, as listas,
os avisos e as lousas. Tire as marcações que já existirem só depois do OK (passo 4); na proposta,
diga o que sai.

### 3. Propor a lista e esperar o OK

Marque como um **arquiteto experiente** marcaria lendo: o que muda uma decisão, o erro que custa
caro, a distinção que confunde, o valor que precisa ser lembrado. Escolha o tipo **pelo papel dele**,
não por rodízio. Apresente ao Cesar:

- uma tabela com **#**, **seção**, **trecho** (as palavras exatas do post), **tipo** e **motivo**
  (uma linha cada; o motivo diz o que a marca ensina);
- a **contagem** por tipo e o total, conferidos contra os limites: de 6 a 12 no total, marca-texto
  no máximo 2, o mesmo tipo no máximo 3 (fora os de lista), nunca duas no mesmo parágrafo, nada em
  títulos, trecho sem quebra até 32 caracteres, notas até 40;
- as notas escritas à mão (nota na margem, correção, pergunta, chave, código) com o texto exato;
- o **comentário do autor** só como lugar e assunto: a frase vem do Cesar (nunca invente);
- o que não foi marcado de propósito, quando for óbvio que alguém esperaria uma marca ali.

**Não aplique nada antes do OK.** Ajuste pedido na proposta que vale para os próximos posts vai para
"Ajustes do Cesar" no guia na mesma hora, com a data.

### 4. Aplicar

Escreva as diretivas no Markdown (a tabela de escrita está no guia). Não mude nenhuma palavra do
texto: confira que o texto visível ficou idêntico (compare o texto do Markdown antes e depois, sem as
diretivas). O build recusa o que passar dos limites; se recusar, volte à proposta com o Cesar em vez
de "dar um jeito".

### 5. Testar nos tamanhos de tela

Com o dev no ar, pelo MCP `chrome-devtools` (nunca o `claude-in-chrome`), na página do post:

- larguras **320, 390, 768, 1280 e 1600px**, nos temas **claro e escuro** (emule o esquema de cor);
- em cada combinação: **sem rolagem lateral** (`scrollWidth` igual à largura da janela), nenhuma
  marca de margem cortada, nenhuma nota cobrindo a linha de cima, nota que não cabe indo para depois
  da palavra, nota do código visível sem rolar o bloco (no celular, embaixo da linha);
- console sem erros;
- `npm run check` (0 erros) e `npm run contraste` (0 falhas).

Um script de conferência que mede tudo isso nas 10 combinações vale mais que olhar uma a uma; olhe as
capturas das marcas de perto, pelo menos em 390 e 1280px, nos dois temas.

### 6. Entregar o relatório

Curto: quantas marcações entraram, por tipo; o que ficou fora da proposta aprovada (e por quê); as
larguras e temas testados, com o resultado; as capturas (antes e depois, quando for remarcação) numa
pasta fora do git (`.impeccable/review/caneta/`). Atualize a coluna "Caneta" do
`.claude/revisao-posts.md` (quantas e a data) e, se foi um ajuste do Cesar, o guia.

Nunca commite nem publique sem pedido explícito do Cesar. Push na `main` publica o site.
