---
title: Amostra dos recursos de Markdown
---

Esta página só existe no `npm run dev` e junta, num texto só, tudo o que um post pode usar. Um
cliente pede uma cobrança, a rede falha no caminho de volta e ele tenta de novo. Se a API não souber
reconhecer que é o mesmo pedido, cobra duas vezes. Idempotência[^idem] é a propriedade que resolve
isso, e aqui ela vem de três peças: uma chave enviada pelo cliente, uma restrição única no banco e a
resposta guardada[^resposta].

> [!NOTA]
> Os exemplos usam PostgreSQL 17, mas a ideia vale para qualquer banco com restrição única.

## Avisos

> [!DICA]
> Uma UUID gerada pelo cliente serve bem como chave: é única o bastante e não carrega significado.

> [!IMPORTANTE]
> A chave precisa ser a mesma em todas as tentativas do mesmo pedido.
>
> Gerar uma chave nova a cada tentativa desfaz a proteção.

> [!WARNING]
> Um lock na aplicação não resolve quando a API roda em mais de uma instância. Quem precisa garantir
> a unicidade é o banco.

> [!CUIDADO] Transação aberta durante a chamada externa
> Com a inserção e a chamada ao adquirente na mesma transação, a segunda tentativa não é recusada na
> hora: o PostgreSQL a faz esperar até a primeira terminar.

> Citação comum continua citação: discreta, sem ícone e sem cor.

## Código

O bloco com diff mostra o antes e o depois. O Copiar leva só a versão final.

```java title="CobrancaService.java" del={1-3} ins={4-7}
if (repositorio.existe(chave)) {
    return repositorio.buscarResposta(chave);
}
try {
    repositorio.inserir(chave, Estado.EM_ANDAMENTO);
} catch (DuplicateKeyException e) {
    return repositorio.buscarResposta(chave); // não cobra de novo
}
Resposta resposta = adquirente.cobrar(pedido);
repositorio.concluir(chave, resposta);
return resposta;
```

```sql title="idempotencia.sql" showLineNumbers {2}
CREATE TABLE idempotencia (
    chave      text PRIMARY KEY,
    estado     text NOT NULL,
    resposta   jsonb,
    criado_em  timestamptz NOT NULL DEFAULT now()
);
```

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/pagamentos
```

```bash
curl -X POST http://localhost:8080/cobrancas -H "Idempotency-Key: abc-123"
```

```text
HTTP/1.1 201 Created
```

## Tabela, fórmula e detalhes

| Tentativa | Chave     | Resultado                        |
| --------- | --------- | -------------------------------- |
| 1         | `abc-123` | cobra e guarda a resposta        |
| 2         | `abc-123` | devolve a resposta guardada, sem cobrar de novo |

Com $n$ tentativas e probabilidade $p$ de a resposta se perder, a chance de pelo menos um reenvio é

$$
1 - (1 - p)^n
$$

<details>
<summary>Por que não usar um lock distribuído?</summary>

Porque o lock expira. Se a cobrança demorar mais que o prazo do lock, a segunda tentativa entra.

</details>

## Imagem

![Fluxo da cobrança com chave de idempotência](/posts/cobranca-duplicada-no-retry/idempotencia-solucao.svg)

## Fontes

- Stripe, [Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- PostgreSQL 17, [INSERT](https://www.postgresql.org/docs/17/sql-insert.html)

[^idem]: Uma operação é idempotente quando repeti-la produz o mesmo efeito que fazê-la uma vez.

[^resposta]: A resposta guardada é o que permite devolver o mesmo resultado na segunda tentativa,
    sem cobrar de novo.
