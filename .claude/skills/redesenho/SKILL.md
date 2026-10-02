---
name: redesenho
description: Processo dos modelos de visual novo do blog (D55). Cobre a direção de cada modelo, a construção por agente Opus, a conferência por agente Sonnet, a revisão das capturas, a entrega da URL ao Cesar e o registro. Use ao criar, continuar, ajustar ou conferir um modelo do redesenho, ou quando o Cesar comentar um modelo.
---

# Redesenho: um modelo por vez

> **D61 (02/10/2026):** a versão final da rodada 4 (`redesenho/novos/21-final`) virou o site. Mudança
> no visual publicado é feita no blog, pelas regras de sempre; esta skill vale para uma rodada nova de
> protótipos. A pasta `redesenho/` fica fora do git (`.gitignore`), só nesta máquina.

A fonte de tudo é `docs/redesenho/README.md`: o pedido, o que fica em todo modelo, as regras, a
tabela de status e as URLs. Leia antes. A base comum, com a API e os comandos, está em
`docs/redesenho/base.md`, e as ideias das referências, em `docs/redesenho/referencias.md`.

## Papéis

| Tarefa | Quem | Modelo e esforço |
|---|---|---|
| Direção do modelo, revisão das capturas, entrega | orquestrador (a sessão principal) | o da sessão |
| Pesquisa de um site de referência | `redesenho-pesquisador` | Sonnet 5.5, médio |
| Base comum (`redesenho/src/comum`, conferência) | `redesenho-base` | Sonnet 5.5, alto |
| Construir e ajustar um modelo | `redesenho-construtor` | Opus 5.5, alto |
| Conferir um modelo | `redesenho-conferente` | Sonnet 5.5, médio |

Os ajustes voltam para o **mesmo** construtor (SendMessage), que já tem o contexto do modelo. Se o
tipo de agente não estiver disponível na sessão, use `general-purpose` com o `model` certo e cole o
arquivo do agente no começo do prompt.

## Passo a passo de cada modelo

1. **Direção** (`docs/redesenho/modelos/NN-nome.md`, escrita pelo orquestrador antes de construir):
   - **Ideia** em uma frase, e por que serve a este blog.
   - **Cara:**
     - os tokens de cor, claro e escuro;
     - as fontes (família, fonte de origem, pesos, eixos) e a escala;
     - a forma, a textura e os ícones (estilo e como animam);
     - a marca "cs" neste modelo.
   - **Páginas:** home, artigo, Categorias, livro, Tags e tag. O que tem em cada uma e como se
     arruma em 390, 768 e 1440px.
   - **Os três momentos:** a abertura da home, a abertura das outras páginas e a troca de página, com
     a ordem, as durações, as curvas, como ficam no celular e com movimento reduzido.
   - **Categorias:** a animação dos cards, os livros grandes e a página do livro.
   - **Filtro da tag:** como se mostra e como anima.
   - **Troca de tema:** como anima.
   - **Catálogo de detalhes:** no mínimo 20 itens. Cada um com lugar, gatilho, efeito, duração e
     curva. Hover, foco pelo teclado, estados ativo e vazio, cursor, seleção de texto, links do
     texto, código (copiar), sumário, progresso, anterior e próximo, voltar ao topo, rodapé.
   - **Técnica:** a ferramenta de cada animação, o que carrega sob demanda e os riscos de peso.
   - **Referências usadas** e o que **não** fazer, para não virar outro modelo.
   - **Retorno do Cesar:** vazio até ele comentar.
2. **Construção:** `redesenho-construtor` com a direção. Mude o status para "em construção".
3. **Conferência:** `redesenho-conferente` com a lista de detalhes que o construtor devolveu. Mude o
   status para "em conferência".
4. **Revisão do orquestrador:** olhe as capturas principais (home, Categorias, livro, tag e artigo,
   em 1440 e 390, nos dois temas) e os filmes das aberturas. Confira:
   - a leitura do artigo;
   - se o modelo está diferente dos anteriores;
   - se algo parece genérico ou feito por IA;
   - a direção cumprida;
   - os achados do conferente.

   Mande os ajustes ao construtor, numa lista só, e repita a conferência no que mudou.
5. **Entrega:** status "pronto", URL na tabela do README, o modelo na lista da página inicial do
   servidor (`redesenho/src/comum/modelos.ts`) e uma mensagem ao Cesar com:
   - a URL;
   - o que experimentar (os melhores detalhes e como dispará-los);
   - como rever as aberturas (recarregar a página, ou abrir num endereço direto).
6. **Retorno do Cesar:** o que ele disser vai na hora para a seção "Retorno do Cesar" da direção e,
   se valer para os próximos, para as regras do README.

## Pronto quer dizer

- As seis páginas funcionam com os dados reais, nos dois temas, de 390 a 1440px, sem rolagem lateral
  e sem erro no console.
- As três animações de chegada estão lá, e as aberturas só tocam ao chegar de fora ou recarregar,
  podem ser puladas e ficam em até ~2,5 s.
- Categorias tem animação nos cards e os livros grandes, também na página do livro.
- A tag mostra os livros e filtra por eles.
- Os livros e as ilustrações estão idênticos aos do blog.
- O catálogo de detalhes funciona item por item, com o teclado fazendo o mesmo que o mouse.
- Com movimento reduzido, tudo aparece no estado final; sem JS, o conteúdo aparece.
- Com a CPU 4× mais lenta, não há quadro acima de ~50 ms repetido nas animações nem salto de layout.
- O artigo é confortável de ler.

## Rodadas 2 e 3: cópias do blog, base comum e linhas

A partir da rodada 2, os protótipos são cópias inteiras do blog atual em `redesenho/novos/<nome>/`, cada
uma com a sua porta (receita em `docs/redesenho/base.md`). A rodada 3 (a final) seguiu este caminho, que
vale repetir:

1. **Salvar o texto do Cesar como ele escreveu** (`docs/redesenho/rodada-N/retorno-cesar.md`) e numerar
   os pedidos num `controle.md` (o que tem que ter, o que pode ter, o retorno por protótipo).
2. **Direção com o Fable** (`redesenho-diretor`): objetivo e restrições, não passo a passo; cada decisão
   com evidência vista (capturas). Pesquisas de apoio com o Sonnet (`redesenho-pesquisador`).
3. **Base comum numa cópia** (`r3-base`), construída em paralelo por vários `redesenho-construtor-max`
   (Opus xhigh), um por área, cada um dono dos próprios arquivos; os combinados entre áreas (eventos,
   atributos, classes) vão no prompt e depois num arquivo de ganchos (`ganchos-da-base.md`). Depois, uma
   conferência de integração do orquestrador (o que uma área depende da outra).
4. **As linhas saem da base por cópia** (rsync sem `node_modules` e `.astro`, porta trocada no
   `package.json` e no `astro.config.mjs`), um construtor por linha, em paralelo, sem conflito de arquivo.
5. **Revisão final com o Fable, de contexto novo**, contra o texto do Cesar; as correções comuns são
   feitas uma vez na base pelos donos das áreas e levadas às linhas: cópia do arquivo onde a linha não
   mexeu, `patch` gerado contra uma linha que ainda tinha o arquivo antigo onde mexeu, e o construtor da
   linha junta à mão o que não aplicar.

Aprendizados:

- **Segundo Cérebro:** na conversa do redesenho, o Cesar proibiu gravar no cofre, e três agentes gravaram
  assim mesmo (o hook de parada e a instrução global pedem o registro). Subagente nunca grava no cofre: o
  registro, quando houver, é da sessão principal. A proibição tem de estar no arquivo do agente **e** no
  prompt, inclusive para os ajudantes que um construtor criar; o orquestrador confere o
  cofre (`find -newermt`) ao fim de cada fase e desfaz o que aparecer (Lixeira e `cerebro.py reindex`).
- O tema da cópia só vira escuro no Playwright com `cs-theme` **e** `cs-prefs-quando` no `localStorage`.
- Com vários agentes na mesma cópia, o Vite recarrega a página no meio das medições: bloquear o HMR na
  aba de teste ou repetir a captura.
- Não fazer `cd` para dentro de uma cópia no Bash da sessão principal: a pasta de trabalho muda e os
  hooks (o Impeccable, por exemplo) deixam de ver as exclusões da raiz.

## Servidor

Veja os comandos em `docs/redesenho/base.md`. A porta 4400 é dos protótipos; o dev do blog (4321 ou
4322) não se toca.

## Navegador

A conferência automática usa o Playwright headless (`redesenho/scripts/conferir.mjs`). Para olhar ao
vivo, o MCP `chrome-devtools`. Se ele não abrir porque outro processo prendeu o perfil do Chrome, siga
pelo Playwright.
