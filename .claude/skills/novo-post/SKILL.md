---
name: novo-post
description: Fluxo completo de um post do blog, do zero ou a partir de um texto que o Cesar traz. Classificar, escrever ou melhorar, revisar contra fontes, desenhar ilustração e lousas, validar e mostrar. Use ao criar, reescrever, revisar ou migrar um artigo.
---

# Novo post

Completa até a Fase 4. Falta a parte de ilustração e lousas (Fase 5).

## Fluxo

Vale tanto para post do zero quanto para texto pronto que o Cesar traz. Antes de escrever, leia um
post existente em `src/content/posts/` (ou o modelo, quando existir). Isso carrega a regra
`.claude/rules/posts.md`, que só entra no contexto quando um arquivo do caminho é lido.

1. **Classificar.** Escolha uma categoria existente em `src/data/taxonomia.ts` ou uma série em
   `src/data/series.ts`.
   - Se nenhuma categoria servir de verdade, pode criar uma nova, dentro do escopo do blog
     (engenharia e arquitetura de software) e com cor distinta das demais. **Avise o Cesar.**
   - Tags: de 2 a 4, do vocabulário existente, sem repetir nome de categoria. Crie tag nova só se
     ela for servir a mais de um post.
2. **Escrever ou melhorar.** Cuide da estrutura, do tom profissional e direto em pt-BR e dos exemplos corretos.
3. **Revisar contra fontes.** Confira cada afirmação técnica numa fonte confiável (ver abaixo).
4. **Desenhar.** Faça a ilustração do post (skill `desenho`) e as lousas quando houver fluxo (skill `lousa`).
5. **Validar** (sempre com `fnm exec --using=24`).
   - `npm run check` com 0 erros.
   - `npm run build`.
   - `npm run contraste`, se o post criou categoria nova.
   - Post renderizado no navegador, nos temas claro e escuro e com 390px de largura.
6. **Mostrar ao Cesar.** Nunca commite nem publique sem pedido explícito dele.

## Checklist (briefing §8.2)

- [ ] De 1.500 a 2.500 palavras (8 a 12 min de leitura), com teto de ~3.000. Assunto maior vira
      série ou partes. Sem enchimento. Os posts antigos não precisam ser encurtados.
- [ ] Introdução com o problema concreto em 2 ou 3 frases, seguida de seções `##` claras.
- [ ] Nenhuma afirmação técnica sem fonte confiável conferida. Nada inventado: versões, números,
      benchmarks, citações e APIs só entram se verificados. Se não der para confirmar, diga isso no texto ou tire.
- [ ] Código que compila e faz sentido. Exemplo grande leva link para o código completo.
- [ ] Links conferidos: abrem e dizem o que o texto afirma.
- [ ] Pelo menos uma lousa quando houver fluxo, sequência, antes/depois ou linha do tempo.
- [ ] Avisos só quando ajudam. Diff quando for mostrar antes e depois.
- [ ] `## Fontes` como última seção.
- [ ] Frontmatter completo (abaixo) e `$` em texto escapado (`US\$ 10`).
- [ ] Ilustração aprovada no validador e conferida no render.

## Frontmatter

- `title`: "Assunto — complemento". O que vem depois de " — " vira subtítulo.
- `description`: até ~200 caracteres. Aceita `código` e **negrito**.
- `published` (data). `updated` é opcional e só entra em revisão relevante (aparece como "Atualizado em").
- `category` **ou** `series`, nunca os dois.
- `tags`: de 2 a 4.
- `draft`: `true` enquanto não for aprovado.

Modelo e schema: completar na Fase 2 (`src/content.config.ts`).

## Onde conferir fontes

Use documentação oficial, especificações, JEPs, RFCs, release notes e Javadoc. Blog de terceiro
serve só como apoio, nunca como única fonte. Abra cada link citado e confirme que ele diz o que o
texto afirma.

## Migração dos posts do blog atual (Fase 2)

- Mantenha slug, datas, categoria ou série, tags e o conteúdo **como estão** (D15). Citações e
  parágrafos "Cuidado:" não viram avisos.
- Nunca mude um título de seção migrado, nem quando o post virar MDX. As âncoras dependem deles (D7).
- Corrija só o que quebraria no pipeline novo, como o `$$` no `alt` das imagens do `aoputils`.
- Descrições com mais de 200 caracteres geram aviso, não erro, nos posts antigos.
- A base é o commit `0184562` do blog atual. Se ele receber posts durante o projeto, ressincronize
  antes da troca.

## Recursos de Markdown

Todos aparecem juntos em `src/amostra/recursos.md`, que o dev mostra em `/amostra/markdown/`.
Confira ali antes de usar um recurso pela primeira vez.

- **Código** (Expressive Code): `title="Arquivo.java"`, linhas marcadas `{3-5}`, diff com
  `ins={4-7}` e `del={1-3}` (o Copiar leva só a versão final), `showLineNumbers` e `collapse={1-10}`.
  O nome da linguagem aparece na barra; `text` e terminal (`bash`, `sh`) ficam sem.
- **Avisos**: citação que começa com o marcador, sozinho na primeira linha:

  ```md
  > [!DICA]
  > Uma UUID gerada pelo cliente serve bem como chave.
  ```

  Marcadores: `NOTA`, `DICA`, `IMPORTANTE`, `ATENCAO` (ou `ATENÇÃO`) e `CUIDADO`, ou `NOTE`, `TIP`,
  `IMPORTANT`, `WARNING` e `CAUTION`. Texto depois do marcador troca o rótulo
  (`> [!CUIDADO] Transação aberta`). Pode ter vários parágrafos. Citação sem marcador continua citação.
- **Notas laterais**: nota de rodapé comum (`texto[^chave]` e, no fim, `[^chave]: a nota`). Vira nota
  na margem em telas largas e abre no lugar nas menores. Só parágrafos: lista ou código na nota se perde.
- `<details>` com `<summary>`, tabelas (rolam de lado no celular) e KaTeX (`$…$` e `$$…$$`; `$` de
  texto escapado).
- **Imagens**: `alt` descritivo; abrem no visor ao clicar.
- **Sumário**: automático com 3 ou mais seções `##`.
- **Apresentação**: não se escreve no post. Com os slides em `public/posts/<slug>/deck/` e a entrada
  em `src/data/decks.json` (skill `apresentacao`), a seção entra sozinha antes de `## Fontes`.
