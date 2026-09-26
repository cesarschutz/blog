# Marcações: a caneta do caderno

Guia editorial das marcações à caneta dos artigos (D48, que substitui o caderno marcado da D41). É
**vivo**: a skill `caneta` lê este guia inteiro antes de marcar qualquer post, e todo ajuste que o
Cesar pedir entra na seção "Ajustes do Cesar", no fim, com a data. O visual está no `DESIGN.md`
("Caneta do caderno"); o código, em `src/plugins/marcacoes.mjs` (Markdown), `src/lib/codigo.ts`
(blocos de código), `src/styles/caneta.css` e `src/scripts/caneta.ts`. O catálogo de referência é
`docs/prototipos/caneta-do-caderno.html`; no dev, `/amostra/caneta/` mostra os 20 tipos no blog.

## A ideia

As marcações são **estáticas**: já vêm feitas, como se o texto tivesse sido riscado à caneta antes de
publicar. Nada se desenha ao rolar. A caneta é **azul, igual em todos os livros**, e **nunca pinta o
texto** (os links também são azuis): o texto marcado fica na cor normal; só os riscos, círculos,
caixas, setas e notas à mão ficam azuis. As notas à mão não têm sublinhado nem cara de link.

Marque como **um arquiteto experiente** marcaria lendo o texto: o que muda uma decisão, o erro que
custa caro, a distinção que confunde, o valor que precisa ser lembrado. Nada de marcar por marcar,
nem frase solta sem importância. A caneta é a **última etapa** do post: entra depois que texto,
desenhos e animações estão prontos e aprovados (skill `caneta`).

## Os 20 tipos

Cada tipo tem um papel. Escolha o tipo **pelo papel dele no texto**, nunca por rodízio: posts
diferentes pedem marcas diferentes, e a variedade vem do conteúdo.

| # | Tipo | Papel | Escrita |
|---|---|---|---|
| 1 | Marca-texto amarelo | o essencial do post; **raro** | `:marca[trecho]` |
| 2 | Sublinhado ondulado | a palavra exata que muda o sentido | `:ondulado[não basta]` |
| 3 | Círculo | o número ou nome que costuma ser confundido | `:circulo[P-521]` |
| 4 | Colchete na margem | o parágrafo que resume uma seção | `:::colchete` em volta do parágrafo |
| 5 | Sublinhado duplo | a ideia mais importante de uma seção | `:duplo[confira as claims]` |
| 6 | Caixa à mão | nomes de campos, parâmetros e comandos | `:caixa[`kid`]`; numa lista de definição, `:::caixas` |
| 7 | Nota na margem | um comentário curto com seta: o que um arquiteto diria em voz alta ao ler | `:nota[palavra]{texto="não é cifrado!"}` |
| 8 | Riscado com correção | o erro comum riscado e o certo escrito por cima | `:riscado[P-512]{correcao="P-521"}` |
| 9 | Asterisco na margem | um ponto que vale reler | `:::asterisco` em volta do parágrafo |
| 10 | Certo e errado | listas de práticas: o que fazer e o que evitar | `:::certo-errado`, itens com `:certo` e `:errado` |
| 11 | Números circulados | passos em ordem, quando a ordem importa | `:::passos` em volta de uma lista numerada |
| 12 | Chave agrupando | itens de lista agrupados com um comentário ao lado | `:::chave{nota="…"}` em volta da lista |
| 13 | Riscado simples | algo que não vale mais | `:riscado[trecho]` |
| 14 | Seta ligando | causa e consequência dentro da mesma frase | `:liga[timeout, então reenvio]` |
| 15 | Exclamação na margem | a armadilha, o erro que derruba produção | `:::exclamacao` em volta do parágrafo |
| 16 | Interrogação com nota | a pergunta que o leitor faria, respondida logo depois | `:::pergunta{nota="…"}` em volta do parágrafo |
| 17 | Sinal entre termos | dois conceitos que parecem iguais e não são | `**codificado** :sinal[≠] **criptografado**` |
| 18 | Anotação no código | um valor dentro de um bloco de código, explicado ao lado | na cerca: `anotar="1789564500\|15 min depois"` |
| 19 | Linhas marcadas no código | o trecho do código que importa, com o motivo | na cerca: `linhas="2-3\|o banco decide"` |
| 20 | Comentário do autor | opinião em primeira pessoa | `:::comentario` em volta da frase |

~~~markdown
O parâmetro `alg` é o :ondulado[único obrigatório] do header.

O payload está apenas :nota[codificado]{texto="não é cifrado!"} em Base64URL.

:::exclamacao
Um validador que confia no `alg` do token aceita um token sem assinatura.
:::

:::certo-errado
- :certo Fixe no servidor a lista de algoritmos aceitos.
- :errado Confiar no `alg` que vem no token.
:::

:::chave{nota="não confie cegamente"}
- `jku`: URL das chaves
- `jwk`: a chave embutida
:::

```json title="payload" anotar="1789564500|15 min depois"
{ "exp": 1789564500 }
```
~~~

Detalhes de cada tipo:

- **Marca-texto** (1): amarelo clássico, chama muita atenção. **No máximo uma ou duas vezes por
  post**, só no que for realmente essencial (a premissa, a regra que resume o post). O trecho pode
  quebrar linha, mas fique em uma linha e meia.
- **Ondulado, duplo, círculo, caixa, riscado, seta ligando e a palavra da nota** não quebram linha:
  o trecho tem **até 32 caracteres** (o build recusa mais), para caber numa linha de 320px.
- **Caixa** (6): em `:::caixas`, a caixa vai no **primeiro `código`** de cada item. É o que substitui
  a pintura dos termos da D41.
- **Nota na margem** (7) e **riscado com correção** (8): a nota tem até 40 caracteres, em letra
  minúscula de quem anota ("não é cifrado!", "15 min depois"), sem ponto final.
- **Certo e errado** (10): cada item começa com `:certo` ou `:errado`; o texto do item continua
  dizendo o que fazer ou evitar (quem ouve o leitor de tela escuta "Certo:" e "Errado:").
- **Números circulados** (11): só quando a **ordem importa** (fazer o 2 antes do 1 dá errado).
- **Chave** (12): nota curta (até 40 caracteres) que vale para todos os itens juntos.
- **Seta ligando** (14): o trecho vai da causa à consequência, curto ("timeout, então reenvio").
- **Interrogação** (16): a nota é a pergunta que o leitor faria; o parágrafo seguinte a responde.
- **Sinal** (17): só `≠`, entre os dois termos (de preferência em negrito).
- **Código** (18, 19): o valor de `anotar` precisa aparecer inteiro numa cor só do código (um número,
  uma string); se o build reclamar, circule um trecho menor. A nota fica ao lado da linha quando
  cabe e embaixo dela quando a linha é longa; no celular, sempre embaixo.
- **Comentário do autor** (20): **só com uma frase escrita ou aprovada pelo Cesar**, nunca inventada.
  Na proposta, deixe o lugar e o assunto; a frase vem dele.

## O que nunca marcar

- **Títulos** (o build recusa), legendas e tabelas de referência inteiras.
- Aviso (`> [!NOTA]`), nota lateral, frase em destaque ou lousa: eles já chamam atenção.
- Frases de efeito, transições ("Vamos ver…") e o que já está em negrito só por ênfase.
- A mesma ideia duas vezes (no texto e no resumo do fim).
- Trecho longo: a caneta marca **o pedaço**, nunca o parágrafo inteiro (fora o colchete e as marcas
  de margem, que são do parágrafo).

## Limites

- **De 6 a 12 marcações por post** (o build recusa mais de 12). Cada contêiner (`:::colchete`,
  `:::caixas`, `:::chave`…) e cada `anotar` ou `linhas` conta como uma.
- **Marca-texto: no máximo 2** por post (o build recusa o terceiro).
- **O mesmo tipo no máximo 3 vezes** por post, fora os de lista (`:::caixas`, `:::certo-errado`,
  `:::passos`, `:::chave`); o build recusa a quarta.
- **Nunca duas marcações no mesmo parágrafo** (o build recusa). Exceções: as de lista (cada item é um
  parágrafo) e as de código. Marca de margem já é a marcação do parágrafo: nada em linha dentro dela.
- Nada em títulos; nada dentro de outra marcação.

## Tela e acessibilidade

- **Marcas de margem** (colchete, asterisco, exclamação, interrogação) ficam no respiro da folha
  quando ele tem ao menos 30px (tela ≥ 940px); abaixo disso, o parágrafo recua e a marca fica no
  recuo. **Certo e errado** e **números** ficam no recuo da própria lista. Nunca cortam nem criam
  rolagem lateral.
- **Notas acima da palavra** (nota na margem, riscado com correção) abrem espaço na própria linha,
  sem cobrir a de cima. Quando não cabem (celular, ≤ 640px, ou a nota passaria da margem direita),
  vão logo depois da palavra, na mesma letra.
- **Notas no código** não são cortadas pela rolagem do bloco: embaixo da linha, ficam paradas na
  esquerda do bloco.
- Os traços (SVG) são decorativos (`aria-hidden`); as notas escritas são texto de verdade, lido pelo
  leitor de tela entre parênteses ("(nota: …)"). O sinal ≠ é lido "diferente de"; o riscado, como
  texto riscado (`<s>`). Na impressão, tudo aparece; em alto contraste, os traços seguem a cor do texto.
- **Teste de todo post marcado** pelo `chrome-devtools`, em **320, 390, 768, 1280 e 1600px**, nos dois
  temas, antes de mostrar ao Cesar (passo 5 da skill `caneta`).

## Como propor

Na proposta, uma tabela com **trecho**, **tipo** e **motivo** (uma linha por marcação), mais a
contagem por tipo. O motivo diz o que a marca ensina ("a premissa do post", "todo mundo escreve
P-512"). Só depois do OK do Cesar as marcações entram no Markdown. Na revisão em lote, a coluna
"Caneta" do `.claude/revisao-posts.md` registra quantas entraram e quando.

## Exemplos

Os pilotos da D48 são o JWT (`jwt-estrutura-e-campos`) e a chave de idempotência
(`cobranca-duplicada-no-retry`); as marcações aprovadas deles ficam como referência aqui depois do
OK do Cesar.

## Ajustes do Cesar

Toda vez que o Cesar pedir um ajuste nas marcações, em qualquer sessão, a regra entra aqui com a data,
para os próximos posts já saírem certos. Regra que muda o visual vai também para o `DESIGN.md`.

- **26/09/2026 (D48):** marcações estáticas, sem animação; caneta azul fixa (#1F4FB5 no claro,
  #8FA8FF no escuro) que nunca pinta o texto; marca-texto amarelo, no máximo uma ou duas vezes por
  post; a pintura dos termos das listas sai (no lugar, a caixa à mão); de 6 a 12 marcações por post;
  comentário do autor só com frase dele.
