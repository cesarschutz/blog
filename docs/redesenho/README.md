# Redesenho (D55)

Exploração de um visual novo para o blog: 10 modelos, um bem diferente do outro, navegáveis e com o
conteúdo real, para o Cesar ver e escolher. Pedido e plano aprovados em 29/09/2026.

**Concluído em 02/10/2026 (D61):** a versão final da rodada 4 (`21-final`) virou o site e foi
publicada. A pasta `redesenho/` saiu do git e fica só nesta máquina, com os servidores no ar. O que
segue abaixo é a história das rodadas, para consulta.

- **Pasta:** `redesenho/`, fora do git e só nesta máquina: um projeto Astro próprio que lê os posts, os
  livros e as ilustrações de `src/` sem alterar nada lá.
- **Servidor:** <http://127.0.0.1:4400>, com um modelo por endereço (`/01-grade/`, `/02-noturno/`…).
  A raiz lista os modelos prontos.

Uma rodada nova de protótipos segue a skill `redesenho`; o modelo escolhido vira uma decisão nova, e só
então o site muda.

## Rodada 2 (desde 30/09/2026)

O Cesar olhou os 10 e escreveu o que gostou e o que não gostou de cada um, além do que ama no blog
atual (`rodada-2/retorno-cesar.md`, o texto dele sem edição). A ordem em que ele "moraria" é: 1)
atual, 2) 02 Noturno, 3) 01 Grade, 4) 09 Biblioteca.

A rodada 2 tem **5 protótipos novos (11 a 15), todos partindo do blog atual**, cada um numa cópia
isolada em `redesenho/novos/`, com a sua porta (4411 a 4415). Eles misturam o que ele pediu e trazem
o "extra do 06" (abrir um computador ou um terminal para ver os livros como arquivos). Os pedidos
numerados, os obrigatórios, o que ele não quer e o status estão em `rodada-2/controle.md`. O prompt
do 06 para o projeto dev-note dele fica em `docs/historico/prompt-06-terminal-dev-note.md`.

## Rodada 4: a versão final (01 e 02/10/2026, publicada na D61)

O Cesar disse o que quer de cada um dos 16 a 20 (`rodada-4/retorno-cesar.md`). Sai um protótipo final
(`redesenho/novos/21-final`, porta 4421) com a home do nome grande, os abajures em cima dos livros, o
claro do 20 e o escuro do 19. Onde ele gostou de duas formas para o mesmo lugar, ou quando houver uma
sugestão nossa, a melhor vai para o protótipo e as outras para amostras (`/amostras/` dentro dele). A
amostra principal são os livros parados na home. Pedidos numerados, fases e status: `rodada-4/controle.md`.
Depois de três listas de escolhas e ajustes (`retorno-cesar.md`, `-2` e `-3`), o Cesar mandou publicar
em 02/10/2026: a `21-final` foi levada para o `src/` do blog (D61), sem as amostras.

## Rodada 3 (01/10/2026, entregue)

| Linha | Endereço | A cara |
|---|---|---|
| 16 Parede | <http://127.0.0.1:4416/> | a parede do escritório: quadro com o nome, estante de tábua, cortiça com as fichas presas por alfinetes na cor do livro; o rodapé é a mesa |
| 17 Grade suave | <http://127.0.0.1:4417/> | a home do 14 sem prateleira nenhuma: cada livro sobre a própria sombra quente, a paleta de hoje, o traço de caneta nos títulos |
| 18 Estante moderna | <http://127.0.0.1:4418/> | a home do 14 numa prateleira flutuante escura, com luzes de quadro de latão que acendem uma a uma |
| 19 Biblioteca | <http://127.0.0.1:4419/> | o 09 com chave de ouro: estante de madeira, letreiro de latão, balcão de catálogo, gavetas por letra em Tags, a cordinha |
| 20 Noturno | <http://127.0.0.1:4420/> | a luz do 02 sobre o 14: palco com um ponto de luz por livro, a abertura do 02, a cartolina da cor do livro |
| base | <http://127.0.0.1:4430/> | a base comum das cinco (o 14 com tudo o que é obrigatório e o computador) |

Para subir uma linha: `fnm exec --using=24 npm run dev` de dentro de `redesenho/novos/<linha>/`. A
revisão final do diretor e o que foi corrigido depois dela estão em `rodada-3/revisao-final.md`.

O texto do Cesar está em `rodada-3/retorno-cesar.md` (salvo como ele escreveu, para a revisão final).
Ele pediu 5 protótipos em papelaria, livraria e biblioteca, parecidos com o blog atual, juntando o
que marcou como "tem que ter" nos 10 e nos 11 a 15, mais o computador como um MacBook com macOS
(Finder, Terminal, editor tipo VS Code e Pré-Visualização). Um deles tem a home de parede (estante,
quadro com o nome e cortiça com fichas presas por alfinetes); dois têm a home do 14, com estantes
diferentes.

- **Direção:** `rodada-3/direcao.md` (Fable): a base comum por áreas e as cinco linhas (16 Parede,
  17 Grade suave, 18 Estante moderna, 19 Biblioteca, 20 Noturno).
- **Pesquisas:** `rodada-3/luz-realista.md` (lâmpada, brilho e sombra) e `rodada-3/macos.md`.
- **Base comum:** `redesenho/novos/r3-base/` (porta 4430), cópia do 14, construída em paralelo por
  área. Depois, as cinco linhas saem dela (portas 4416 a 4420).
- **Controle, fases e como retomar:** `rodada-3/controle.md`.

## Rodada 1: os 10 modelos (30/09/2026)

**Os 10 modelos estão prontos** e conferidos, cada um no seu endereço (ver a tabela). A página
<http://127.0.0.1:4400/> lista todos. Para subir o servidor:
`fnm exec --using=24 npm --prefix redesenho run dev`.

O que o Cesar disse de cada modelo está na seção "Retorno do Cesar" da direção dele. As fontes do
Fontshare (`redesenho/src/fontes/**`) ficam fora do git, pela licença.

**Aprendizados** (valem para qualquer modelo novo ou ajuste):

- prefixar as classes do modelo, porque nomes como `.capa`, `.linha` e `.corpo` vazam para as ilhas;
- as ilhas devolvem `visibility: visible` por dentro: para esconder o pai, usar `clip-path` ou
  `display: none`;
- a `Capa` abaixo de 96px desenha mal: desenhar a 96px e reduzir com `scale`;
- não medir layout em script inline durante o carregamento;
- nunca rodar `npx` de pacote não instalado;
- o artigo `.mdx` com lousa fica perto de 200 ms num quadro de carregamento com a CPU 4× em todos os
  modelos (o 00-base, ~140 ms).

## O que fica em todo modelo (pedido do Cesar)

1. **Estrutura:** cada post fica dentro de um livro (categoria) ou de uma revista (série) e tem de 2 a
   4 tags.
2. **Página da tag:** mostra os livros que têm aquela tag e filtra a lista por livro.
3. **Três momentos com animação:**
   - a abertura da home;
   - a abertura das outras páginas;
   - a troca de página ao navegar dentro do site.

   As duas aberturas tocam só ao chegar de fora ou ao recarregar, e são diferentes entre si. Nenhuma
   das três precisa ser como a de hoje.
4. **Categorias:** os cards entram com uma animação própria e mostram os livros grandes. A página de
   cada livro também mostra o livro grande.
5. **Desenhos:** os desenhos dos livros (capa, lombada, livro 3D) e as ilustrações dos posts entram
   como estão, pelos componentes atuais. O Cesar vai redesenhá-los depois. Tudo em volta deles pode
   mudar.

Todo o resto pode mudar: layout, tipografia, cores, ícones, marca e animações. O Cesar pediu foco nos
detalhes (hover, foco, estados e microinterações). Os modelos devem ser elegantes, modernos e
atraentes, mas antes de tudo é um blog. Pode abusar do movimento, desde que o site não fique pesado.

## O que vale em todo modelo

- **Leitura:** o artigo é confortável de ler, com medida, corpo e contraste certos.
- **Temas:** claro e escuro, com a troca de tema animada (decisão do Cesar, 29/09/2026).
- **Larguras:** de 390px a 1440px, sem rolagem lateral.
- **Movimento reduzido** (`prefers-reduced-motion`): tudo aparece no estado final, sem prender a tela.
- **Performance:**
  - anima-se só `transform`, `opacity` e `clip-path` (quando o navegador compõe);
  - nada de refazer o layout a cada quadro;
  - a rolagem nunca é sequestrada;
  - GSAP e anime.js carregam sob demanda;
  - a conferência mede os quadros longos com a CPU 4× mais lenta.
- **Sem JS,** o conteúdo aparece. A abertura só esconde o que o script vai mostrar.
- **Cores e fontes:**
  - as cores vêm dos tokens do próprio modelo, para os dois temas, sem hex solto em componente;
  - as fontes são servidas pelo projeto (Fontsource, ou Fontshare baixado), nunca por CDN.
- **Não pode parecer feito por IA:**
  - nada de fonte genérica, gradiente decorativo, sombra genérica em tudo, rótulo em caixa alta ou
    emoji;
  - nada de "aparece subindo" em cada seção;
  - o movimento tem intenção, e cada modelo tem a sua assinatura.
- **Bibliotecas aprovadas** (29/09/2026, só em `redesenho/`):
  - GSAP, que já está no projeto;
  - fontes do Fontsource e do Fontshare;
  - anime.js v4, só no modelo Cinético.

  O código de cada pacote é lido antes de instalar. Qualquer outra biblioteca só entra depois de
  perguntar ao Cesar.

## Os modelos

A direção de cada um é escrita antes de construir, em `docs/redesenho/modelos/NN-nome.md`.

| # | Modelo | Ideia | Status | Endereço |
|---|---|---|---|---|
| 01 | Grade | suíço: branco, preto e um vermelho-sinal, grotesca grande, grade de filetes | pronto (30/09) | `/01-grade/` |
| 02 | Noturno | escuro, grão fino, a luz é o cursor; livros sob focos | pronto (30/09) | `/02-noturno/` |
| 03 | Planta | desenho técnico: prancha azul (no claro, papel vegetal), cotas e carimbo | pronto (30/09) | `/03-planta/` |
| 04 | Cinético | o do animejs.com: formas nas cores dos livros, mola, arrastar | pronto (30/09) | `/04-cinetico/` |
| 05 | Revista | editorial de luxo: serifa de display, ilustrações sangrando, virar a página | pronto (30/09) | `/05-revista/` |
| 06 | Terminal | editor de código elegante: mono, paleta de comandos, abas, barra de status | pronto (30/09) | `/06-terminal/` |
| 07 | Galeria | museu: obras emolduradas com etiqueta, sala que rola na horizontal | pronto (30/09) | `/07-galeria/` |
| 08 | Tipo Vivo | tipografia cinética: fontes variáveis que respondem ao mouse e à rolagem | pronto (30/09) | `/08-tipo-vivo/` |
| 09 | Biblioteca | sala em 3D (só CSS), madeira e luz; câmera que anda até as estantes | pronto (30/09) | `/09-biblioteca/` |
| 10 | Índice | minimalista: uma coluna de texto, a ilustração flutua junto ao cursor | pronto (30/09) | `/10-indice/` |

Status possíveis: a fazer, em construção, em conferência, pronto (URL enviada ao Cesar) e escolhido.
As observações do Cesar sobre cada modelo ficam na direção dele, na seção "Retorno do Cesar".

## Referências

Sites indicados pelo Cesar como fonte de ideias. Cada um foi aberto por um agente diferente; um site
que não abrir ou que apresentar bloqueio é descartado. O que se aproveita de cada um está em
`docs/redesenho/referencias.md`.

<https://kobra.systems/components/input-otp>, <https://ui.soralabs.studio/docs>,
<https://fontshare.com/>, <https://hugeicons.com/icons/all/animation>, <https://uiable.com/components>,
<https://microkit.co/>, <https://kinetics.colorion.co/>,
<https://www.skyscanner.design/latest/getting-started/about-backpack-pN209Wjo> e
<https://animejs.com/> ("sensacional", nas palavras do Cesar).

## Como é feito

O processo completo está na skill `redesenho`. Os agentes ficam em `.claude/agents/redesenho-*`.

1. **Pesquisa:** um agente `redesenho-pesquisador` (Sonnet 5.5, esforço médio) por site de referência.
2. **Base comum:** agente `redesenho-base` (Sonnet 5.5, esforço alto). Monta o projeto, os dados, os
   livros e as ilustrações prontos para usar, o filtro por livro e a conferência automática. A API da
   base está em `docs/redesenho/base.md`.
3. **Um modelo por vez** (pedido do Cesar):
   1. o orquestrador escreve a direção;
   2. o `redesenho-construtor` (Opus 5.5, esforço alto) constrói;
   3. o `redesenho-conferente` (Sonnet 5.5, esforço médio) confere;
   4. o orquestrador revisa as capturas e devolve os ajustes ao mesmo construtor;
   5. com o modelo pronto, a URL vai para o Cesar e o status muda nesta tabela.

## Rodar

Os comandos rodam da raiz do blog, com o Node 24. Os detalhes estão em `docs/redesenho/base.md`.
