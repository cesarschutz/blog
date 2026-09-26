# Marcações: o caderno marcado

Guia editorial das marcações à caneta dos artigos (D41). Vale em todas as sessões: todo post novo ou
revisado propõe as marcações no plano (skill `post`, passo 2), seguindo este guia, e o Cesar aprova
junto com o resto. O visual está no `DESIGN.md` (seção Movimento, "Caderno marcado"); o código, em
`src/plugins/marcacoes.mjs` (Markdown) e `src/scripts/caderno.ts` (movimento).

A ideia é a de um caderno de estudo: quem já leu o assunto passou a caneta **só** onde vale a pena
voltar. A marcação acontece quando o trecho entra na tela e se desfaz se a pessoa rolar de volta para
cima dele. Se tudo está marcado, nada está.

## Os cinco tipos

| Tipo | Escrita | Papel | Use em |
|---|---|---|---|
| Marca-texto | `:marca[trecho]` | a ideia principal de uma seção | uma frase curta (ou parte dela) que resume o que a seção ensina |
| Sublinhado | `:sublinhado[palavra]` | a palavra exata que muda o sentido | "não", "basta", "antes", "a partir de", um quantificador |
| Só o termo | `:::termos` em volta de uma lista | os campos de uma lista de definição, um por vez | listas em que cada item começa com um `código` (claims, parâmetros, flags) |
| Círculo | `:circulo[P-521]` | o número ou nome que costuma ser confundido | valores que o leitor erraria de memória (P-521, não P-512) |
| Colchete na margem | `:::colchete` em volta de um parágrafo | o parágrafo que resume uma seção | o parágrafo que a pessoa copiaria para uma anotação |

```markdown
A defesa é :marca[configurar no validador a lista de algoritmos aceitos] e rejeitar qualquer outro.

**Assinatura válida :sublinhado[não basta]: valide as claims.**

:::termos
- **`iss`** (*Issuer*): quem emitiu o token.
- **`sub`** (*Subject*): de quem o token fala.
:::

ECDSA com as curvas P-256, P-384 e :circulo[P-521] (não P-512)

:::colchete
**O payload não é criptografado.** Ele só está codificado em Base64URL…
:::
```

No `:::termos`, o termo marcado é o **primeiro `código`** de cada item (dentro de negrito também
vale). No `:::colchete`, o contêiner envolve um parágrafo inteiro (o colchete ocupa a altura dele).

## O que marcar

- A frase que **responde à pergunta do título** da seção.
- A palavra que **inverte** a leitura rápida ("não basta", "a partir desse instante", "antes de").
- O nome ou número que **costuma sair errado** (curva P-521, porta, código de status).
- Numa lista de campos, **os campos** (e não as descrições).
- O parágrafo que **resume a seção**, quando ele existe e é curto.

## O que nunca marcar

- **Títulos**, legendas, tabelas de referência inteiras e **código** (bloco ou em linha sozinho). O
  build recusa marcação dentro de título.
- Frases de efeito, opinião, transições ("Vamos ver…") e o que já está em negrito só por ênfase.
- A mesma ideia duas vezes (no texto e no resumo do fim), nem a introdução inteira.
- Aviso (`> [!NOTA]`), nota lateral, frase em destaque ou lousa: eles já chamam atenção.
- Trecho longo: marca-texto passa de uma linha e meia só em caso raro; colchete, um parágrafo só.

## Limites

- **No máximo umas 8 marcações por artigo** (o build recusa mais de 8; `:::termos` e `:::colchete`
  contam uma cada). Post curto: 3 a 5.
- **Nunca duas no mesmo parágrafo** (o build recusa).
- No máximo **um colchete** e **um `:::termos`** por seção.
- Nada em títulos nem em código.
- Marcações longe umas das outras: se duas aparecem na mesma tela, provavelmente uma sobra.

## Exemplos

**Aplicado: Jackson (`jackson-filtros-mascarando-cartao`), o piloto (25/09/2026)**, 7 marcações:

- `:marca[a mesma classe pode ser serializada com filtros diferentes, dependendo do mapper]`: a ideia
  da seção 1, que o resto do post usa.
- `:sublinhado[**todo**]` em "todo mapper que serializar essa classe precisa conhecer o filtro": o
  efeito colateral que quebra a API.
- `:marca[toda classe ganha o `@JsonFilter`, mas só dentro deste mapper]`: por que o mixin em
  `Object` resolve.
- `:sublinhado[só]` em "o Spring Boot só cria o mapper padrão dele quando…": a palavra que explica
  por que o `@Primary` não pode faltar.
- `:marca[a regra é logar sempre via `logJson.toJson(...)`]`: a regra prática dos cuidados.
- `:sublinhado[se remove]` em "CVV não se mascara, se remove": remover, e não mascarar.
- `:::colchete` no Resumo.

**Só como exemplo (os outros posts recebem marcações quando forem revisados):**

**JWT (`jwt-estrutura-e-campos`)**

- `:marca[três partes separadas por ponto]`: a ideia que o resto do post detalha.
- `:::termos` nas claims registradas (`iss`, `sub`, `aud`, `exp`…): o leitor volta ao post para achar
  um campo.
- `:sublinhado[único]` em "É o único **obrigatório**" do `alg`: a palavra que responde "o que é
  obrigatório?".
- `:circulo[P-521]` na tabela de algoritmos: todo mundo escreve P-512.
- `:::colchete` em "O payload não é criptografado…": o parágrafo que resume o maior mal-entendido.
- `:sublinhado[não basta]` em "Assinatura válida não basta".

**Chave de idempotência (`cobranca-duplicada-no-retry`)**

- `:marca[Um timeout não diz se a operação aconteceu]`: a premissa do post.
- `:sublinhado[onde]` em "O problema é **onde** a verificação acontece".
- `:marca[verificar e gravar passam a ser a mesma operação]`: por que a solução funciona.
- `:circulo[422 Unprocessable Content]`: o código de status que se confunde com 409.
- `:::colchete` no parágrafo do "pelo menos uma vez" com consumidor idempotente.

## Como propor (skill `post`)

No plano, uma tabela com **trecho**, **tipo** e **motivo** (uma linha cada), seguindo este guia. O
Cesar aprova junto com o resto do plano; só então as diretivas entram no Markdown. Na revisão em lote,
a coluna "Marcações" do `.claude/revisao-posts.md` registra quantas entraram.
