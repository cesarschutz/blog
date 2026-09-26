---
title: Catálogo da caneta
---

Esta página só existe no `npm run dev` e mostra os 20 tipos da caneta do caderno (D48), com os
exemplos do catálogo `docs/prototipos/caneta-do-caderno.html`. Ela passa dos limites de um post
de propósito; o guia (quando usar cada tipo) é o `docs/marcacoes.md`.

## Em linha

1\. Marca-texto: um JWT assinado garante integridade e autenticidade, :marca[não sigilo: quem tem o token lê o payload].

2\. Sublinhado ondulado: o parâmetro `alg` é o :ondulado[único obrigatório] do header.

3\. Círculo: o ECDSA usa as curvas P-256, P-384 e :circulo[P-521].

5\. Sublinhado duplo: depois de verificar a assinatura, :duplo[confira as claims]: um token autêntico pode ter expirado.

6\. Caixa à mão: o parâmetro :caixa[`kid`] diz qual chave assinou o token.

7\. Nota na margem: vale para um parágrafo que já começa com texto na linha de cima, como este. O payload de um token assinado está apenas :nota[codificado]{texto="não é cifrado!"} em Base64URL, e qualquer pessoa com o token lê o conteúdo dele sem precisar de chave nenhuma.

8\. Riscado com correção: muita gente escreve que a maior curva do ECDSA é a :riscado[P-512]{correcao="P-521"}, um erro comum de memória que aparece até em documentação de biblioteca.

13\. Riscado simples: o valor :riscado[`none`] em `alg` nunca deve ser aceito.

14\. Seta ligando: :liga[só codificado, então legível] para qualquer pessoa que tenha o token em mãos.

17\. Sinal entre termos: o payload está **codificado** :sinal[≠] **criptografado**; a diferença é quem consegue ler.

## Na margem

:::colchete
4\. Colchete na margem. **O payload não é criptografado.** Ele só está codificado em Base64URL:
qualquer pessoa com o token lê o conteúdo.
:::

:::asterisco
9\. Asterisco na margem. Com HMAC, todo serviço que valida o token também poderia emitir tokens.
:::

:::exclamacao
15\. Exclamação na margem. Um validador que confia no `alg` do token aceita um token sem assinatura.
:::

:::pergunta{nota="e se o relógio do servidor atrasar?"}
16\. Interrogação com nota. As datas usam segundos desde 1970, com uma pequena tolerância de relógio.
:::

A tolerância existe justamente para isso: alguns minutos, no máximo.

20\. Comentário do autor, logo depois do parágrafo que ele comenta:

:::comentario
aqui entra uma frase escrita pelo Cesar
:::

## Listas

6\. Caixa à mão numa lista de definição:

:::caixas
- `alg`: o algoritmo da assinatura.
- `kid`: qual chave assinou.
- `typ`: o tipo do objeto.
:::

10\. Certo e errado:

:::certo-errado
- :certo Fixe no servidor a lista de algoritmos aceitos.
- :certo Valide `exp`, `iss` e `aud`.
- :errado Confiar no `alg` que vem no token.
:::

11\. Números circulados:

:::passos
1. Decodifique o header.
2. Verifique a assinatura.
3. Valide as claims.
:::

12\. Chave agrupando:

:::chave{nota="não confie cegamente"}
- `jku`: URL das chaves
- `jwk`: a chave embutida
- `x5u`: URL do certificado
:::

## Código

18\. Anotação no código:

```json title="payload" anotar="1789564500|15 min depois"
{
  "iat": 1789563600,
  "exp": 1789564500
}
```

19\. Linhas marcadas no código:

```sql linhas="2-3|o banco decide"
SELECT id FROM cobranca
 WHERE chave = :chave
   AND status = 'PROCESSANDO'
   FOR UPDATE;
```

Uma linha longa, com a nota embaixo dela (e, no celular, sempre embaixo):

```sql anotar="uq_cobranca_idempotency_key|o nome da restrição"
ERROR:  duplicate key value violates unique constraint "uq_cobranca_idempotency_key"
```
