# Pesquisa: como explicar passo a passo (lousas, comparações, animações com play), 02/10/2026

Tudo abaixo foi aberto de fato, salvo onde marcado "(não conferido)". Os estudos são, em geral, testes curtos de laboratório com estudantes; o leitor do blog é desenvolvedor, o que importa na hora de aplicar.

## Princípios

1. **Quadros estáticos em sequência por padrão; animação só quando o movimento em si é o conteúdo.** Três meta-análises dão efeito pequeno da animação sobre o estático (d=0,37; g=0,226; g=0,23). Ploetzner et al. mostram que ela só vence quando é preciso aprender os detalhes da mudança (g=0,647 nas complexas; 0,043 quando irrelevantes), enquanto o estático vence em arranjo espacial. https://d-nb.info/1244480126/34 e Tversky et al. (2002): https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf
2. **Nada importante some antes de ser processado.** Informação transitória força o leitor a segurar na memória de trabalho o que já saiu da tela, e isso reduz o aprendizado. Tversky: animações são fugazes e difíceis de reinspecionar. Zongker e Salesin: a figura que desliza para fora fica mais "visível" na mente do que a que some de repente. https://leadinglearner.me/wp-content/uploads/2019/02/sweller2019_article_cognitivearchitectureandinstru.pdf e https://grail.cs.washington.edu/wp-content/uploads/2015/08/zongker-2003-oca.pdf
3. **Acumule em vez de substituir: o passo novo entra e os anteriores ficam, esmaecidos.** Duarte recomenda revelar diagramas complexos peça a peça, a partir da base. Heer e Robertson: a animação é efêmera e dificulta comparar itens em mudança. https://www.duarte.com/blog/qa-how-to-influence-through-visual-storytelling-2/ e https://idl.cs.washington.edu/files/2007-AnimatedTransitions-InfoVis.pdf
4. **Segmente e deixe o leitor avançar (botão Continuar).** Mayer e Chandler dividiram uma animação em 16 segmentos com Continuar e a transferência melhorou (d=1,36, um estudo). Até o controle mínimo ajuda; o controle total (voltar, arrastar) ajuda mais os avançados, porque novatos monitoram mal. https://www.uky.edu/~gmswan3/544/9_ways_to_reduce_CL.pdf e https://tecfa.unige.ch/perso/mireille/papers/Betrancourt05.pdf
5. **Se o ritmo for automático, ponha pausas e marcas de fronteira.** Spanjers et al. (N=161): pausas de 2 s melhoraram o pós-teste; escurecer a tela na fronteira reduziu o esforço. O ganho é de novatos, não de experts (reversão de expertise). https://cris.maastrichtuniversity.nl/ws/files/72615120/spanjers_2012_explaining_the_segmentations_effect.pdf
6. **Pré-treino: mostre quem é quem (serviços, tabelas, cores) antes de movimentar.** Mediana d=1,00 em 3 estudos (freio, bomba). Mesma fonte do item 4 (Mayer e Moreno, 2003).
7. **Contiguidade: legenda junto do elemento e na hora da mudança.** Espacial d=0,48 (1 estudo); temporal d=1,30 (8 estudos, com narração falada), que some quando a apresentação já vem em pedaços curtos. Mesma fonte. Inferência minha: a lista de passos embaixo da lousa separa texto e desenho.
8. **Sinalize sem depender de movimento.** Cor, aro ou seta junto do foco; sinalização d=0,74 (1 estudo). Novatos olham o que é saliente, não o que é relevante (Lowe, citado por Betrancourt). Zongker: o destaque não pode ser confundível com a ação em si. Mesmas fontes dos itens 2 e 4.
9. **Coerência e esquematização: corte enfeite e realismo.** Coerência d=0,90 (5 estudos). Tversky recomenda inclinar-se ao esquemático e anotar com setas; Betrancourt manda banir o cosmético. Mesmas fontes.
10. **Uma coisa por vez, devagar, com pausas.** Zongker: mudar muito de uma vez dá impressão geral, mas impede concentrar-se; narrar um ponto e animar outro faz nenhum dos dois pegar. Heer e Robertson: transições simples; separar em estágios ajudou pouco e o excesso de estágios aumentou o erro.
11. **Mudança sem aviso passa despercebida, e mudanças simultâneas competem.** NN/g (change blindness): destaque o novo, ponha perto do foco, use animação curta para explicar a mudança. https://www.nngroup.com/articles/change-blindness/ e https://www.nngroup.com/articles/animation-purpose-ux/
12. **Compare lado a lado, no mesmo eixo.** Tufte (small multiples): a comparação tem de caber no alcance do olhar (citação via relatório da NASA). Robertson et al. (18 participantes): animação foi a mais rápida para apresentar, mas deu muitos erros; para análise, os estáticos foram mais rápidos e os small multiples mais precisos. https://www.nas.nasa.gov/assets/nas/pdf/techreports/1994/nas-94-002.pdf e https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tvcg2008-trendvis.pdf
13. **Troca de estado não é movimento: use crossfade, não animação "de verdade".** Zongker: espectadores tomaram a transição animada entre dois estados estáticos como saída da simulação; um crossfade simples resolveu. Também: evite cortes secos.
14. **O estático completo fica sempre à mão; a animação só reforça.** Bostock mostra três representações do mesmo algoritmo; o ritmo do leitor vale mais que o do autor. https://bost.ocks.org/mike/algorithms/ Ciechanowski põe play/pause em cada figura e um botão para pausar tudo. https://ciechanow.ski/gears/

## O que evitar

- **Elementos que somem ou trocam de lugar:** itens 2, 3 e 13. Em termos de memória de trabalho, é o pior caso.
- **Muito por passo:** itens 10 e 11; Mayer e Moreno chamam de sobrecarga quando o essencial já excede a capacidade.
- **Ritmo automático sem controle:** NN/g viu um painel que trocava a cada 5 s e deixava a oferta visível só 20% do tempo; a recomendação é só trocar quando o usuário pedir. https://www.nngroup.com/articles/auto-forwarding/
- **Movimento decorativo:** Reynolds diz que o cérebro nota movimento acima de tudo e manda usá-lo com cautela (https://www.garrreynolds.com/design-tips). Höffler e Leutner: decorativa d=-0,05 (não conferido: só resumo de busca).
- **Ilusão de entendimento:** a animação poupa a simulação mental e induz processamento raso (Betrancourt, 2005).
- **Animação como substituto de rótulo claro** (NN/g, animation-purpose-ux).

## Números concretos

- Segmentos de Mayer e Chandler: 1 a 2 frases de narração e cerca de 8 a 10 s de animação cada (Mayer e Moreno, 2003).
- Pausa entre segmentos: 2 s (Spanjers et al., 2012).
- Transição de dados: cerca de 1 s por estágio; a versão de meio segundo foi preterida (Heer e Robertson, 2007).
- Microanimação de interface (NN/g): 100 ms de feedback; 200 a 300 ms em mudança grande de tela; total de 100 a 400 ms, sendo 400 ms "muito lenta". https://www.nngroup.com/articles/animation-duration/
- Leitura: 3 palavras por segundo como referência de NN/g para conteúdo que avança sozinho (https://www.nngroup.com/articles/designing-effective-carousels/); adultos leem 238 wpm em não ficção (~4 palavras/s) (Brysbaert, 2019: https://gwern.net/doc/psychology/linguistics/2019-brysbaert.pdf). Uma legenda de 20 palavras pede cerca de 7 s.
- Legenda de vídeo: até 42 caracteres por linha, 2 linhas, 20 caracteres/s (Netflix: https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-Timed-Text-Style-Guide).
- Capacidade de foco: cerca de 4 itens (Cowan, 2001; não conferido, só resumo de busca).
- Observado no Raft (abaixo): 8 a 18 palavras por legenda, um elemento novo por cena.
- ByteByteGo (HTTPS): 1 diagrama, 4 passos, 1 a 3 frases cada.
- Estáticas anotadas igualaram ou superaram animações narradas em 8 de 8 comparações, vantagem média de 27% (resumo de terceiros: https://www.worklearning.com/2006/05/31/research_brief_/).
- Resultado contrário: na meta-análise de Berney e Bétrancourt, animação em ritmo do sistema teve g=0,309 (https://archive-ouverte.unige.ch/unige:92234). Controle do leitor não é panaceia; o seguro é o segmento pré-definido com Continuar.

## Exemplos excelentes

1. **The Secret Lives of Data, Raft** (https://thesecretlivesofdata.com/raft/; conferido no navegador): uma legenda curta sob o desenho, um elemento por cena, Continuar e Repetir, o que já entrou permanece. O próprio site do Raft o chama de mais guiado e menos interativo que o RaftScope.
2. **Mike Bostock, Visualizing Algorithms**: animado, estático denso e estático esparso lado a lado. Em suas palavras, "The eye scans faster than the hand."
3. **Bartosz Ciechanowski, Gears**: elementos introduzidos um a um, cor com função fixa (amarelo move, verde é movido), sliders, play/pause em toda figura.
4. **ByteByteGo, How does HTTPS work** (https://bytebytego.com/guides/how-does-https-work/): um diagrama, passos numerados, texto mínimo. É o formato estático em passos.
5. **The Illustrated TLS 1.3** (https://tls13.xargs.org/): seções recolhíveis; passar o mouse liga o byte à explicação; ordem igual à do protocolo.
6. **Josh Comeau, guia de Flexbox** (https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/): muda uma variável por vez, conceito novo só depois do pré-requisito. A tabela de estados da Stripe (https://docs.stripe.com/payments/paymentintents/lifecycle) mostra o mesmo cuidado em formato estático.

Duarte (livro Slide:ology) e Reynolds (livros): só abri os blogs e o site; o conteúdo dos livros fica (não conferido).

## Recomendação

**Um formato só, com regras fixas: "sequência acumulativa controlada pelo leitor".** A evidência converge: segmentar, deixar o anterior visível, legenda contígua e ritmo do leitor. A animação com play (GSAP) vira exceção, só para quando o movimento ou a temporização fina for o assunto (item 1). As figuras paradas, que o autor acha claras, já cumprem 2, 3, 7 e 9.

Regras propostas (inferência minha a partir dos itens acima):
1. Estado inicial: o diagrama inteiro, legendado, com tudo no lugar (pré-treino).
2. Cada passo muda uma coisa só (um elemento, uma seta ou um valor) e traz uma legenda de até 20 palavras junto dele.
3. Avanço só por clique ou tecla, com Voltar e "Ver tudo" (os experts não precisam de segmento).
4. Nada some: o que já foi explicado esmaece, tracejado ou cinza.
5. O novo entra por fade ou traço de 200 a 300 ms, com destaque de cor; `prefers-reduced-motion` mostra o estado final.

Por tipo de conteúdo:
- **Fluxo de requisição entre serviços:** quadros acumulativos no mesmo diagrama, setas numeradas à la ByteByteGo, avanço à la Raft. É sequência discreta de eventos, que o estático já explica (Tversky).
- **Comparação A contra B no tempo:** small multiples. Duas linhas no mesmo eixo, colunas t1, t2, t3, com a diferença destacada, tudo visível de uma vez (Tufte, Robertson). Uma varredura animada de cursor de tempo é opcional, nunca a única via.
- **Mudança de estado (duas transações, mesma linha):** a linha do banco fica fixa no centro e mostra seu valor a cada evento (valor antes e depois, acumulado como histórico). Os eventos entram um a um, por Continuar; a troca de valor usa crossfade e marca "estado", não movimento (item 13). A temporização fina entre T1 e T2 se vê melhor numa linha do tempo estática com os eventos em ordem.
