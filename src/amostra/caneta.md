---
title: Catálogo da caneta
---

Esta página só existe no `npm run dev` e mostra os 34 tipos da caneta do caderno (D48, D56), com a
numeração do guia `docs/marcacoes.md`. Ela junta todos os tipos de propósito; o guia diz quando usar
cada um.

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

20\. Marca-texto baixo: o jitter só :grifo[espalha as tentativas no tempo], e é esse espaço que deixa o serviço se recuperar.

21\. Aspas à mão: nenhuma política de retry entrega :aspas[exactly-once] sozinha.

22\. Parênteses à mão: o `Retry-After` traz um número de segundos :aparte[ou uma data, no formato de data do HTTP], e o cliente entende as duas formas.

23\. Chave por baixo: com três camadas que tentam três vezes cada, a conta é :explica[3 × 3 × 3]{nota="um 3 por camada"}, ou 27 chamadas.

24\. Seta de tendência: sem jitter, a :sobe[latência] dispara justo no pico.

24\. Seta de tendência, para baixo: com o limite de retries, a :desce[carga extra] fica pequena.

25\. Ressalva com asterisco: o `Retry-After` costuma vir com o :ressalva[429 e o 503]{texto="também vale nos redirecionamentos 3xx"}, e quem escolhe o número é o servidor.

## Na margem e em volta do parágrafo

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

19\. Comentário do autor, logo depois do parágrafo que ele comenta:

:::comentario
aqui entra uma frase escrita pelo Cesar
:::

:::moldura
26\. Moldura. Repetir só é seguro quando a operação é idempotente ou chega com uma chave de idempotência.
:::

:::visto
27\. Visto na margem. Na dúvida, comece com três tentativas, backoff exponencial com teto e jitter completo.
:::

:::validade{data="set/2026"}
28\. Validade. Neste exemplo, o provedor aceita 100 requisições por minuto por chave.
:::

:::novo{data="29/09/2026"}
29\. Novo na atualização. A política passou a respeitar o `Retry-After` antes do backoff.
:::

:::postit
30\. Post-it: o erro passa sozinho? A operação aguenta repetir? Ainda há prazo?
:::

:::carimbo{texto="conferido na RFC 9110"}
31\. Carimbo. O `Retry-After` aceita um número de segundos ou uma data no formato de data do HTTP.
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

32\. Opção escolhida:

:::escolha{nota="a recomendada"}
- espera fixa;
- backoff exponencial sem jitter;
- :esta backoff exponencial com jitter completo.
:::

## Código

17\. Anotação no código:

```json title="payload" anotar="1789564500|15 min depois"
{
  "iat": 1789563600,
  "exp": 1789564500
}
```

18\. Linhas marcadas no código:

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

33\. Números no código:

```java title="Chamada.java" numeros="4,5,6"
for (int feitas = 1; ; feitas++) {
    Resposta r = cliente.enviar(pedido);
    if (r.sucesso()) return r;
    if (!r.transitorio()) return r;
    if (!Politica.podeRepetir(feitas)) return r;
    Thread.sleep(r.retryAfter().orElse(Politica.espera(feitas)));
}
```

34\. Linha riscada no código:

```java title="O que não fazer" riscar="3|espera fixa: todos voltam juntos"
Resposta r = cliente.enviar(pedido);
for (int feitas = 1; !r.sucesso() && feitas < 4; feitas++) {
    Thread.sleep(1000);
    r = cliente.enviar(pedido);
}
```
