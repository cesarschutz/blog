# Crítica da coleção de 13: direção de arte e textos

Olhar de fora sobre `direcao-de-arte.md`, `paleta.png` e `textos.md`, lidos contra o `controle.md` (D78),
o `contexto.md`, a `pesquisa-cores-e-desenhos.md`, a `critica.md` da rodada anterior, o `DESIGN.md`,
`src/styles/tokens.ts` e `src/livros/cores.js` (como a cor do livro é usada fora da capa), as fotos
de `.render/colecoes/` e `.render/livros/`, e os posts citados. As cores passaram por
`scripts/livros/conferir-cores.mjs` e por uma conta própria das misturas do tema escuro (as mesmas de
`tokens.ts`: 42% de branco no quadradinho, na barra e na caneta; 50% no nome do chip; 20% da cor no
painel; 10% no painel dos desenhos). As frases foram medidas com `scripts/livros/titulo-da-capa.mjs`.
As histórias dos objetos que proponho foram conferidas na busca na web (fontes no fim).

## Resumo: o que trocar, em ordem de importância

1. **Testes e Frontend não funcionam como cor de categoria no tema escuro.** Com 42% de branco, o
   negro-de-fumo e o cinza-chumbo viram o cinza da interface (ΔE 0,03–0,04 do `ink-3`), e o painel
   tingido some (ΔE 0,00–0,03 da folha). Frontend → `#433123` (o mesmo negro-de-fumo, quente, como é
   a tinta de imprensa em verniz de linhaça); Testes → `#244a45` (ardósia de toque, a pedra em que se
   faz o teste), ou `#39404d` se a marca ficar verde. As duas passam na ferramenta.
2. **A marca acompanha a Arquitetura (azul), mas como "o livro da casa", não como "a capa do Volume
   01"**: com volumes em ordem alfabética (D78), o Volume 01 muda no dia em que entrar um livro de A a
   Ar. E a direção errou ao dizer que nenhuma cor chega perto do verde da marca: o cinza-chumbo do
   Testes está a 0,036 dele. Só com a marca azul o lugar bom do Testes fica livre.
3. **IA: o fonógrafo é fraco** (lê "música"; a ligação só existe no texto da ficha; e reproduz, não
   gera). Troca: **o Turco de Kempelen (1770)**, o autômato enxadrista; a história e as fontes estão no
   item 07. Reserva: o autômato escritor de hoje, redesenhado no mundo novo (Jaquet-Droz, 1774, cabe no
   princípio).
4. **Dados e SRE não são cores novas**: `#624a72` está a ΔE 0,027 da ameixa de hoje e `#b59353` a
   0,045 do ocre (abaixo de 0,05, onde duas cores se confundem). Dizer isso ao Cesar. Se ele quiser
   Dados novo de verdade, `#5b457f` (o roxo de anilina do mimeógrafo, mais azul e mais vivo) passa na
   ferramenta; o SRE fica, pelo lugar claro e quente que a estante precisa, e isso tem de ser dito.
5. **Frase do Frontend**: "Do servidor até a tela do usuário." é um segundo "de X até Y" encostado no
   "O caminho do commit até a produção." do DevOps (04 e 05 são vizinhos). Troca: **"O que o navegador
   mostra e quanto demora."** (41 caracteres, uma linha).
6. **As seis frases mantidas**: 01, 04, 10 e 12 são claramente as melhores (dizer ao Cesar que ficam
   por isso); 02 e 07 ficam por falta de melhor (as minhas tentativas, medidas, perdem para elas).
7. **Ícones**: a chave ao lado da fechadura repete a tag Idempotência (tirar do ícone); a grade 3×4 de
   mostradores do tabulador contraria a própria regra "nada de grade densa" (2×3 e o cartão com três
   furos); 07, 08 e 09 são três móveis seguidos; **11 e 12 são vizinhos** (a direção os trata como não
   vizinhos) e os dois têm coisas redondas penduradas: foto lado a lado antes de fechar.
8. **Textos**: "padrões de arquitetura corporativa (Fowler)" confunde com Arq. Corporativa; HTTP/3 e
   QUIC são protocolo (Fundamentos), não CDN; service mesh é coisa que se instala (DevOps); p99 se mede
   em produção (SRE); "cooperativas de crédito" e "BaaS" não são assunto de blog técnico; a direção põe o
   autoscaling no SRE (as esferas) e os textos põem o HPA no DevOps.
9. **Tag Pagamentos → Cobrança**, como o editor recomenda, com `/tags/Pagamentos/` → `/tags/Cobrança/`
   (três dos quatro posts continuam lá).
10. **DevOps (tubo pneumático) fica, com condições**: a cápsula grande no balcão e a fantasma dentro do
    tubo, à vista; a frase não cita o objeto (a direção pede isso; a frase é do livro, não do desenho).
    **Azuis**: três azuis e um petróleo, nunca vizinhos, é aceitável; não mexer no marinho, porque
    toda saída com história colide com outra cor (verde-mar × Testes 0,039; púrpura × Dados; mogno × IA).

## 1. O conjunto de desenhos

**O princípio está certo e atende o pedido.** "O mesmo problema, um século antes" dá treze objetos de
um mundo só (a sala de trabalho, 1657–1890), com uma data e um motivo cada, e o motivo é o problema do
livro, não uma metáfora. Isso é melhor do que a coleção de hoje, que mistura mundos (arco, farol,
guindaste, carta lacrada). A gramática comum (3/4 pela frente-direita, luz do alto à esquerda, hachura
nas faces da direita, um fantasma que é a máquina trabalhando) é o que faz o conjunto "combinar" sem
desenhar coisas parecidas. Dois pontos do conjunto, antes dos livros:

- **Quatro móveis**: tabulador (02), fonógrafo (07), mesa telefônica (08) e registradora (09) são "uma
  caixa com coisas em cima", e 07, 08 e 09 ficam seguidos na estante. A diferença está no detalhe
  (cone, cordões, cúpula), que a 30px é o que some. O Turco que proponho para 07 também é um móvel:
  o custo está dito lá. As fotos dos ícones 07–08–09 lado a lado decidem.
- **Os quatro livros vazios (05, 06, 07 e 13) são os quatro desenhos mais difíceis** (prensa,
  telégrafo, fonógrafo, prumo). Neles a capa é tudo o que o leitor vê ("Este livro ainda não tem
  artigos"): não há post para explicar o objeto. É onde o desenho mais precisa ligar ao assunto sozinho.

### Nota por livro (olhar de um desenvolvedor diante da capa)

| Vol. | Livro | Objeto | Nota | Por quê |
|---|---|---|---|---|
| 01 | Arquitetura de Software | prancheta, planta e régua-tê | forte | "planta" (blueprint) é a metáfora que todo dev já usa; a parede fantasma é a melhor ideia de fantasma do conjunto |
| 02 | Dados | tabulador de Hollerith | serve | a história é forte (IBM nasce daí) e o cartão perfurado é o que o dev reconhece; a 30px a máquina é "gabinete com pontinhos" |
| 03 | Desenvolvimento de Software | tear de Jacquard | forte | a história mais conhecida entre devs (Jacquard → Babbage → Lovelace); "o programa separado da máquina" |
| 04 | DevOps | estação de tubo pneumático | serve, com condições | o brasileiro conhece o malote pneumático de banco e supermercado; o que liga ao livro é a cápsula (contêiner) dentro do tubo (pipeline) |
| 05 | Frontend | prensa Albion | serve | a ligação que o dev tem é o vocabulário: font, leading, kerning, em, caixa alta e baixa vêm da prensa; "a página" é a página |
| 06 | Fundamentos | telégrafo de Morse | forte | o código Morse é o "bit" que todo dev conhece; a chave com o botão redondo é reconhecível |
| 07 | IA | fonógrafo | fraco | lê "música" ou "gramofone"; a ligação ("a voz emprestada") só existe no texto da ficha; reproduz, não gera |
| 08 | Integração e Eventos | mesa telefônica | forte | "ligar quem chama a quem atende" é a imagem que o dev tem de broker e roteamento; a lâmpada acesa é o evento |
| 09 | Pagamentos | caixa registradora | forte | sem reparo: registro, custódia, fechamento do dia |
| 10 | Segurança | fechadura detectora de Chubb | forte | o mecanismo aberto é o que tira o cadeado; "provar que alguém tentou" é a frase da capa em ferro |
| 11 | Sistemas Distribuídos | relógios de Huygens | forte para quem é da área; serve para os outros | sincronia de relógios é o problema fundador (Lamport); a frase (timeout × tempo) completa |
| 12 | SRE | regulador de Watt | serve | silhueta única (Y com duas bolas); quem é de infra conhece "governor", feedback e a raiz de Kubernetes; "manter a rotação" casa com a frase |
| 13 | Testes | fio de prumo | serve | o dev lê "pedreiro"; a ligação vem do fantasma (a vertical verdadeira ao lado da parede torta = esperado × obtido), que é a melhor ideia conceitual do conjunto |

### Os que a direção mandou olhar com cuidado, e o que fazer

**04 DevOps, o tubo pneumático: fica.** O que salva o objeto não é o terminal (um cilindro com um
cano: cano, periscópio, chaminé) e sim a cápsula: é o objeto que o leitor viu no supermercado, e é o
contêiner. Condições: a cápsula do balcão com pelo menos 20% da largura da área, com os dois anéis de
feltro em w1; **a cápsula fantasma dentro do tubo, acima do cotovelo, dentro da área da capa** (não
cortada pela borda: é ela que diz "a caminho"); a portinhola aberta. A direção diz que "a frase da
capa deve dizer tubo pneumático": não. A frase é do livro; o desenho se explica ou não. A alternativa
que a direção deixa (a máquina a vapor com o volante) lê "motor", não "entrega": pior. Não achei, dentro
do princípio, objeto que leia DevOps melhor do que um tubo com uma cápsula a caminho.

**05 Frontend, a prensa: fica, com o tipo à vista.** A ligação que um dev tem com a prensa é mais forte
do que a direção diz: o vocabulário do CSS é o do tipógrafo (font, leading, kerning, em, uppercase e
lowercase são as duas caixas de tipos). Por isso a forma de tipos no leito e a folha impressa (o
fantasma, com as três linhas) precisam de corpo, não de serem detalhe. Os riscos ficam: o bastidor em
arco é o ícone antigo da Arquitetura, e a 30px "arco com braço" pode ler guilhotina; a alavanca e o
leito saindo para a frente são obrigatórios no ícone, como a direção pede. **Se a foto da lombada
falhar**, a alternativa dentro do princípio, e melhor do que a máquina a vapor, é a **lanterna mágica**:
Huygens desenhou a primeira em 1659 (dez esboços de um esqueleto que tira o próprio crânio, "para
representações por meio de lentes convexas com a lâmpada"), e o diagrama da carta a Pierre Petit de
1664 já tem a lâmpada, a lente, a imagem transparente e a parede; Walgensten deu o nome *laterna
magica* na década de 1660 (fontes no fim). É a máquina que põe a imagem na parede, a "tela" da frase;
o fantasma é a imagem projetada; e o negro-de-fumo continua valendo (é a fuligem de lamparina, e a
lanterna é uma lâmpada). Mesmo inventor do livro 11, cinco anos antes: a coleção começa duas vezes
em Huygens.

**06 Fundamentos, o telégrafo: fica.** A chave de Morse sozinha vira grampeador, como a pesquisa
avisou, mas a direção já resolveu: botão redondo grande, vão sob a alavanca, os dois tambores do
registrador. Ponto a mais: a fita de papel com pontos e traços ecoa o rolo de papel da tag Logs; a
direção já a deixa só no trecho curto do ícone. Está certo. Nota: na frase e no texto, o relato de
Vail sobre a caixa de tipos fica como relato (a direção pede; o editor não o usou: ok).

**07 IA, o fonógrafo: troca.** Um desenvolvedor olha um gramofone e lê música; depois de ler "Software
feito com IA e software que usa IA", continua lendo música. A ligação ("fala com uma voz que não é a
dela") é bonita no texto e não está no desenho. A direção é honesta: "reproduz, não gera".

Proposta: **o Turco, o autômato enxadrista de Wolfgang von Kempelen (1770)**. Fatos conferidos: Kempelen
o construiu para impressionar Maria Teresa, depois de ver um ilusionista na corte, e o apresentou em
Viena em 1770; um gabinete com um tabuleiro em cima e uma figura vestida à turca que movia as peças;
antes de cada partida Kempelen abria as portas da frente para mostrar as engrenagens; venceu Napoleão
e Franklin; depois da morte de Kempelen (1804), Maelzel o levou pela Europa e pelos EUA; Edgar Allan
Poe escreveu "Maelzel's Chess Player" (1836) argumentando que uma máquina jogaria sem errar e que
havia um homem dentro (havia: um enxadrista escondido no gabinete); a máquina queimou num incêndio na
Filadélfia em 1854; o encontro com o Turco em 1819 levou Babbage a pensar nos limites de uma máquina
que pensa; e a Amazon chamou o seu serviço de "Mechanical Turk" (2005), "inteligência artificial
artificial", por causa dele. É o objeto com o nome que todo dev conhece, numa sala, com data,
inventor e motivo. E é a ligação mais honesta que existe entre 1770 e um modelo de linguagem: a
máquina que parecia pensar tinha gente dentro; toda IA tem (nos dados, nos rótulos, no prompt, em
quem a usa para fazer software). Para um blog feito com o Claude Code e transparente sobre isso, a
capa diz a verdade sem cinismo. Se o Cesar não quiser a ironia na capa, o texto da ficha "Do livro" pode
contá-la ou não; o desenho funciona nos dois casos (um autômato que joga xadrez é IA para qualquer
leitor desde o Deep Blue).

Composição, dentro das regras do mundo: 3/4 pela frente-direita; o gabinete (uma cômoda baixa e
larga, caixa de 1,0 × 0,8 da área) com **as três portas da frente abertas** e, dentro, as engrenagens
e os eixos à vista (w2, como no cartão de Kempelen); em cima, o tabuleiro com umas seis peças (as
casas escuras em hachura w3: é a única textura quadriculada da estante, e é o que lê a 30px);
**fantasma: o braço do autômato, só o braço e a mão, tracejado, movendo uma peça** (a máquina no
instante do trabalho; sem a figura inteira, que o conjunto não tem). Ícone: o gabinete com as portas,
o tabuleiro em 4 × 4 e o braço; silhueta: um bloco baixo e largo com um quadriculado em cima. Custos:
três móveis seguidos em 07, 08 e 09 (o quadriculado e as portas abertas, vazadas, separam o Turco da
mesa telefônica e da registradora, que são cheias); e a cera-marrom perde a história. Para a cor,
duas saídas honestas: manter `#5d4128` como associação declarada (a madeira escura do gabinete; não
achei fato sobre a cor do Turco) ou o marroquim da pesquisa (o couro vermelho-escuro das encadernações,
fato de material, sem ligação com o assunto). Recomendo a primeira, com a palavra "associação" na
ficha.

Reservas, se o Turco não agradar: (a) **o autômato escritor de hoje, redesenhado** no ponto de vista
do conjunto, com a pilha de cames (o programa) à vista e o fantasma no came seguinte: Jaquet-Droz
(1774) cabe no princípio por inteiro, e é a única exceção ao "troca tudo" que vale a pena pedir ao
Cesar, porque é o desenho de hoje com a ligação mais clara; (b) a **máquina de falar do mesmo
Kempelen** (1791, foles e um tubo de couro que pronunciava palavras: a máquina que fala de verdade, sem
truque), honesta mas irreconhecível (lê acordeão).

**10 Segurança, a fechadura: fica, e não lê cadeado.** A caixa retangular de porta, com o ferrolho
saindo e o mecanismo exposto, é fechadura; o cadeado é uma alça sobre um corpo, e não há alça. Um
problema que a direção não viu: **a chave grande deitada ao lado é o ícone da tag Idempotência**
("chave antiga com etiqueta", `CAPAS.md`), e o manual proíbe repetir objeto de tag no desenho de livro.
Na capa ela pode ficar (é a credencial da história, e a etiqueta é o que faz a tag); no ícone da
lombada, `icone: false` na chave: a caixa com três alavancas e o ferrolho basta como silhueta
("retângulo com um dente").

**11 Sistemas Distribuídos e 12 SRE são vizinhos.** A direção lista "11 pórtico × 12 Y" entre os
vizinhos e depois põe "11 × 12" entre "os pares não vizinhos que pedem foto". São vizinhos (volumes
11 e 12, lado a lado na estante), e são os dois únicos objetos com coisas redondas penduradas em
hastes. A direção já tem a resposta (caixas dos relógios com 30% da área, esferas do regulador com
12% e o V aberto); é só tratar o par como o mais arriscado da estante e fotografar primeiro. Para
o 12, uma condição a mais: o fantasma (as esferas na posição alta) não deve virar um segundo par de
bolas na capa; tracejado fraco e as esferas fantasmas menores que as reais.

**13 Testes, o prumo: fica, com a parede visivelmente torta.** O objeto é o mais fraco do conjunto
para um dev (lê obra), e a ligação está toda no fantasma: a vertical verdadeira ao lado da parede que
saiu do prumo é "esperado × obtido", a imagem de todo teste. Isso só funciona se a inclinação se vir
numa capa de 150px: 3° não aparece; uns 6° a 7° (e a aresta de cima da parede fugindo do prumo pelo
mesmo ângulo). O ícone de hoje (`.render/colecoes/estante-s5.webp`) é o mais fraco da estante, um cone
numa linha; o peso com 22% da área e as duas arestas da parede, como a direção pede, são obrigatórios.
Sobre a exceção de época: aceitável como está dita. Se incomodar o Cesar, o **arquipêndulo** (o nível
em A com o prumo pendurado no vértice, usado na Europa até meados do século XIX, fato que a própria
direção traz) data o objeto sem trocá-lo: a silhueta vira um A com um fio, que também lê melhor a
30px do que um cone solto. A alternativa com data e história que tentei e descarto: a máquina de
ensaio de Kirkaldy (Southwark, 1866, o primeiro laboratório independente de ensaio de materiais, com
"FACTS NOT OPINIONS" gravado sobre a porta): a divisa é a do blog, mas a máquina tem 14 metros e
funciona na horizontal; a 30px é uma barra. Fica como história para a ficha, se o Cesar gostar, não
como desenho.

### Miúdos dos ícones

- **02 Dados**: "grade de 3 × 4 mostradores grandes" no ícone contraria a regra do próprio conjunto
  ("nada de grade densa"); a 30px, doze círculos são pontilhado. Ícone com 2 × 3 mostradores, a prensa
  levantada e **o cartão com três furos à vista** (o cartão perfurado é o que um dev reconhece; os
  mostradores, não).
- **01 Arquitetura**: a parede fantasma precisa dos 70px e dos 20px de distância que a direção pede; a
  20px de comprimento ela some, e sem ela a capa é "uma mesa de desenho". E a régua-tê com a cabeça
  saindo pela esquerda é o que impede o notebook: `icone: true` nela.
- **05 Frontend** é o único de 3/4 pela frente-esquerda. Na estante, com os ícones girados, não
  incomoda; na grade de capas, o olho nota a fuga invertida entre 04 e 06. É uma escolha (a alavanca
  à direita), não um erro; só registrar.
- **08 Integração**: a lâmpada acesa, "a única luz da coleção", é um bom detalhe de capa e deve levar
  `icone: false` (a 30px é um ponto a mais na grade).

## 2. As cores

### Como a cor do livro é usada fora da capa (de `tokens.ts` e do `DESIGN.md`)

No claro: capa e lombada na cor crua; chip da categoria com o quadradinho na cor crua e o nome com
34% de tinta; painel dos desenhos = folha + 11% da cor. No escuro: quadradinho, barra de leitura e
caneta da leitura = cor + 42% de branco; nome do chip = cor + 50% de branco; painel = folha escura
(`#1A2124`) + 20% da cor; painel dos desenhos (D60) = `#232B2E` + 10% da cor. Os livros em si não
mudam com o tema (D39).

### O que os números mostram no tema escuro

Com as contas de `tokens.ts` (cor + 42% de branco; ΔE em OKLab contra o cinza da interface `ink-3`
`#7F8884`; painel = folha escura + 20% da cor, ΔE contra a folha):

| Livro | Cor | +42% branco | Croma | ΔE vs `ink-3` | Painel | ΔE painel vs folha |
|---|---|---|---|---|---|---|
| Frontend (direção) | `#2a2621` | `#7C7975` | 0,007 | **0,04** | `#1D2223` | **0,01** |
| Testes (direção) | `#3e4349` | `#898D91` | 0,008 | **0,03** | `#21282B` | 0,03 |
| Sistemas Distribuídos | `#202c4d` | `#757E95` | 0,037 | 0,05 | `#1B232C` | 0,02 |
| IA | `#5d4128` | `#9E8C7D` | 0,031 | 0,05 | `#272826` | 0,04 |
| Arquitetura | `#2d4f77` | `#8196AF` | 0,044 | 0,07 | `#1E2A34` | 0,04 |
| Segurança | `#7c322b` | `#B6857F` | 0,061 | 0,08 | `#2E2626` | 0,04 |
| (hoje) Arquitetura pátina | `#2d4b46` | `#80928F` | 0,021 | 0,03 | `#1E292B` | 0,03 |

Leitura:

1. **Frontend e Testes somem no escuro.** Com croma de 0,01, a barra de leitura, a caneta e o
   quadradinho do chip ficam a ΔE 0,03–0,04 do `ink-3`, que é o cinza do texto secundário: num post
   de Frontend, a barra do topo e o sumário parecem desabilitados, e o chip "Frontend" com o nome em
   `#8D8A87` parece um botão inativo (a linha "Chips no tema escuro" da `paleta.png` já mostra isso: os
   dois únicos chips apagados são Frontend e Testes). O painel tingido (D26) e o painel dos desenhos
   (D60) não têm tinta nenhuma (ΔE 0,00–0,01). Não é só estética: o site usa a cor do livro como
   sinal de "em que livro você está" (D58), e esses dois livros perdem o sinal num dos temas.
2. **O problema já existe hoje em menor grau**: o verde-pátina da Arquitetura (croma 0,037) também
   fica a 0,03 do `ink-3`. O piso prático é croma ≥ 0,035 na cor crua (o que a coleção de hoje tem),
   e a identidade só fica clara de 0,045 para cima. Os puros neutros (0,01) são o extremo.
3. **Distinguir-se do fundo escuro não é problema** (a ferramenta confere o nome do chip e o `ink-2`
   sobre o painel: todos passam de 4,5:1). O problema é identidade, não contraste.
4. **O escuro comprime as distâncias em uns 40%**: o piso de 0,069 entre as cores cruas vira 0,04 nas
   misturas. É igual hoje (0,064 → 0,037) e não há o que fazer sem mudar o `BRANCO_NO_ESCURO`, que é
   decisão da D22, fora desta rodada. Só não descer de 0,069.
5. **A marca.** A direção diz que "nenhuma das 13 cores colide com o verde da marca: o par mais próximo
   é o verde-cédula, ΔE 0,077". Está errado: o cinza-chumbo do Testes está a **0,036** de `#2D4B46`
   (um cinza escuro e um verde-cinza escuro da mesma luminosidade). O verde-cédula está a 0,13. Com a
   marca verde no cabeçalho de toda página e o chip de Testes na lista, os dois se confundem. A seção 6
   fecha isso.
6. **Azuis demais?** Não. Na ordem da estante são três azuis (01 cianotipia L 42, 04 pneumático L 72,
   11 marinho L 30) e um petróleo (06 vitríolo, h 207, que não lê azul ao lado deles), nunca
   vizinhos, em luminosidades bem separadas. O único lugar em que a família importa é o par
   Arquitetura × Sistemas Distribuídos, os dois livros que o leitor mais confunde: ΔE 0,123 cru e 0,073
   no escuro, distintos, mas os dois chips são "azul". Tentei tirar o marinho: verde-mar (`#1a4038`, a
   mesma história do mar) colide com o Testes novo (0,039); púrpura colide com Dados e não tem
   história; mogno colide com IA. Fica o marinho. Se o Cesar quiser menos frio, a troca de menor
   perda é a que a direção já oferece (vitríolo → cinza-pedra), mas ela faz quatro livros claros na
   estante e não resolve o par 01 × 11.
7. **Duas cores não são novas.** Dados `#624a72` está a ΔE 0,027 da ameixa de hoje e SRE `#b59353` a
   0,045 do ocre: abaixo de 0,05, são a mesma cor na estante. O Cesar pediu cores novas para os 13. O
   SRE fica onde está por uma razão de conjunto (o único lugar claro e quente, a cada quatro livros) e
   com motivo honesto (o latão do regulador): dizer isso a ele com todas as letras, porque o SRE vai
   ser o livro que menos muda (nome por decisão dele, cor e frase mantidas; só o desenho troca). Para
   Dados não há razão de conjunto: se o pedido vale, o roxo de mimeógrafo de verdade é mais azul e
   mais vivo que a ameixa (a anilina roxa das cópias): **`#5b457f`** (L 44, C 0,095, h 300) passa na
   ferramenta (par mais próximo 0,073, com a Arquitetura), fica a 0,050 da ameixa (no limite do
   "novo") e ganha identidade no escuro (croma 0,054 na mistura, contra 0,041).
8. Miúdo: o *petit bleu* de Paris é de 1897–1902, fora da janela de 1657–1890 que a própria direção
   fixou. A história é boa; é só não dizer que a cor é "da era". E o garança do Desenvolvimento está a
   0,067 do tijolo de hoje: é nova por pouco, de matiz diferente (rosa, não barro); vale.

### Os dois pacotes, conferidos

**Pacote A (recomendado): a marca acompanha a Arquitetura.** Frontend `#433123` (OKLCh 33, 0,035, 60:
o mesmo negro-de-fumo, quente como é a tinta de imprensa, que é fuligem em verniz de linhaça) e Testes
`#244a45` (38, 0,044, 185: "ardósia de toque"; a pedra de toque, a primeira cor da pesquisa para
Testes, é uma ardósia negra, e a ardósia à luz é esse verde-cinza; o prumo e a pedra são dois
instrumentos de conferir, como a fechadura e o lacre são dois materiais da mesma prova). Saída da
ferramenta (exit 0):

```
#433123  Frontend   10.11:1  13.7/5.3    33 0.035   59   ✓
#244a45  Testes      8.04:1  11.9/5.9    38 0.044  185   ✓
Pares mais parecidos: 0.069 Arquitetura × Fundamentos; 0.070 IA × Segurança; 0.071 DevOps × Integração;
0.073 Fundamentos × Pagamentos; 0.073 Frontend × IA
```

No escuro, Frontend vira `#8D8178` (croma 0,020, um cinza quente) e Testes `#7B928E` (0,027): ainda
discretos, mas com temperatura, e os painéis ganham tinta (0,02 e 0,03). O que precisa ser dito ao
Cesar: `#244a45` é, na prática, o verde-pátina de hoje (ΔE 0,011), que fica vago quando a Arquitetura vai
para o azul; é cor nova para Testes e tem motivo próprio, mas é um reaproveitamento, e ele pode não
querer. Nesse caso, Testes vai para `#39404d` (37, 0,025, 265, um cinza-chumbo azulado), que passa na
ferramenta e mantém a história do chumbo, com identidade mais fraca no escuro.

**Pacote B: a marca fica verde.** Frontend `#433123` e Testes `#5b5352` (L 45, C 0,011: um cinza-chumbo
médio, a única saída que passa a 0,068 de tudo, inclusive da marca). Exit 0, mas o Testes volta a ser
um neutro: no escuro vira `#9C9796` (croma 0,006), o cinza da interface outra vez. É o preço de manter
a marca verde, e é por isso que recomendo o pacote A. Busquei a grade inteira de OKLCh (L 30–50,
C 0,010–0,045) contra as doze cores e a marca verde: fora desse cinza médio, o que sobra ou é da família
da marca (verdes-escuros a 0,07 dela, mas do mesmo matiz) ou é roxo sem história (`#473952`).

Os três alertas de "quadradinho claro" (DevOps, Integração, SRE) são os do tipo que o ocre de hoje já
tem; aceitáveis.

## 3. As frases

Todas as medidas com `titulo-da-capa.mjs` (Newsreader itálico 24/31px em 404px): uma linha, salvo
onde dito.

| Vol. | Livro | Proposta do editor | Alternativa dele | A minha | Recomendação |
|---|---|---|---|---|---|
| 01 | Arquitetura de Software | As decisões caras de desfazer. (hoje) | Escolher sabendo o que cada escolha custa. | — | **manter**: é a melhor frase da estante e o livro agora é só isso; dizer ao Cesar que fica por ser a melhor |
| 02 | Dados | Onde o dado mora e por onde ele anda. (hoje) | Guardar, achar e mover o dado. | O dado guardado e o dado em movimento. (38, uma linha; perde) | **manter**, por falta de melhor: diz o banco e o pipeline, e casa com o cartão e a prensa do tabulador |
| 03 | Desenvolvimento de Software | Entre o seu código e a máquina. | Entre o seu código e a JVM. | — | **a proposta**: a alternativa fecha a porta para Kotlin e Go, que o "abrange" prevê; e o tear embaixo é exatamente "entre o programa e a máquina" |
| 04 | DevOps | O caminho do commit até a produção. (hoje) | Onde o serviço roda e como chega lá. | — | **manter**: o tubo é o caminho; a alternativa perde o CI/CD |
| 05 | Frontend | Do servidor até a tela do usuário. | O que o usuário vê e com que rapidez. | **O que o navegador mostra e quanto demora.** (41) | **a minha**: a proposta é um segundo "de X até Y" vizinho do DevOps; a alternativa é desajeitada ("com que rapidez"); a minha diz o navegador (a palavra que separa o livro do backend), a renderização e os Web Vitals. Reserva: "A parte que roda no navegador." (30) |
| 06 | Fundamentos | O que fica quando a ferramenta muda. | O que todo framework esconde. | — | **a proposta**: as duas são boas; a alternativa é mais curta e faz par com o telégrafo (que não esconde nada), mas "esconde" dá um tom de denúncia que o blog não tem; a proposta é o que o dev sente |
| 07 | IA | Software feito com IA e software que usa IA. (hoje) | Usar o modelo e construir com ele. | Programar com o modelo e pôr o modelo no sistema. (49, **duas linhas**); O modelo na ferramenta e o modelo no sistema. (45, **duas linhas**) | **manter**: é a mais precisa e as minhas não cabem; com o Turco embaixo, "software que usa IA" é o autômato |
| 08 | Integração e Eventos | Como um sistema fala com o outro. | O contrato entre quem envia e quem recebe. | — | **a proposta**: "fala" com uma mesa telefônica embaixo é o par mais feliz da estante |
| 09 | Pagamentos | Dinheiro não pode sumir nem duplicar. | Cada centavo com origem e destino. | — | **a proposta**: é a frase que um dev de pagamentos reconhece, e a registradora "contra o desvio" a completa |
| 10 | Segurança | Quem pode o quê e como provar. (hoje) | Proteger o dado e provar quem é quem. | — | **manter**: a fechadura detectora é "como provar" em ferro; dizer ao Cesar que fica por ser a melhor |
| 11 | Sistemas Distribuídos | Quando o timeout não diz o que aconteceu. | Correto mesmo quando a rede falha. | — | **a proposta**: vem do post (conferido: é a primeira marcação de Chave de idempotência), e "timeout" sobre dois relógios é tempo sobre tempo |
| 12 | SRE | O que mantém a produção de pé. (hoje) | Descobrir o que aconteceu em produção. | Produção de pé, e o que fazer quando cai. (41) | **manter**, e dizer: o SRE é o livro que menos muda; se o Cesar quiser que a frase mude também, a minha cobre SLOs e incidentes, mas é menos limpa que a de hoje |
| 13 | Testes | Antes que a produção descubra. | A prova de que o código faz o que deve. | — | **a proposta**: é como o Cesar fala; a alternativa é genérica e repete o "provar" da Segurança |

Nenhuma das treze tem cara de máquina nem "não X, mas Y". As três com "produção" (04, 12, 13) são uma
sequência, como o editor diz; com a minha do Frontend, não há mais dois "de X até Y" encostados.

## 4. Os textos do que cada livro abrange

As oito regras de encaixe são boas e resolvem os sete posts de fronteira do jeito certo (conferi os
posts citados: a chave de idempotência e o efeito externo dizem que a técnica vale para webhooks e
filas; o ledger só existe por causa do dinheiro). O que ainda confunde quem vai escrever um post:

- **Arquitetura × Arq. Corporativa.** "Clean, Hexagonal e os padrões de arquitetura corporativa
  (Fowler)" lê como se fosse a Arq. Corporativa do site de notícias (times, governança), que é outra
  coisa. O livro do Fowler é *Patterns of Enterprise Application Architecture*: "Clean, Hexagonal e os
  padrões de Fowler (PoEAA)". E "o papel do arquiteto" como item solto é o pedaço de Carreira que
  sobrou: ok, mas é o único item da lista que não é assunto técnico; vale uma linha dizendo que o
  texto sobre estudo e caderno não tem livro (já está no fim do documento; trazer para a ficha).
- **Fundamentos × DevOps.** DevOps lista "CDN, edge e proxies (HTTP/3, QUIC, Cloudflare)" e Fundamentos
  lista "redes (TCP e os estados da conexão, DNS, HTTP)". Um post explicando o QUIC é protocolo:
  Fundamentos. Troca: DevOps "CDN, edge e proxies (Cloudflare, Nginx, Envoy)"; Fundamentos "redes
  (TCP e os estados da conexão, DNS, HTTP, HTTP/3 e QUIC)".
- **Sistemas Distribuídos × DevOps.** "service mesh" está em Sistemas Distribuídos; é coisa que se
  instala no cluster. A regra que falta: *a ferramenta que se instala é DevOps; o comportamento entre
  serviços é Sistemas Distribuídos* (o Istio é de lá; o retry e o circuit breaker que ele faz são
  daqui). Mover "service mesh (Istio, Linkerd)" para DevOps.
- **Desenvolvimento × SRE.** "performance do serviço (profiling, p99)": o p99 se mede em produção, é
  um SLI (SRE). Desenvolvimento fica com "profiling (JFR, async-profiler)"; o p99 vai para "SLOs, SLIs
  e error budgets" em SRE. A fronteira já dita (JFR aqui, profiling contínuo lá) fica consistente.
- **Direção × textos no SRE.** A ficha do regulador diz que "o alerta e o autoscaling são as esferas"
  e "o autoscaler que oscila"; os textos põem o HPA em DevOps. Não é erro, mas a ficha "Do livro" do SRE
  não pode prometer autoscaling. Na ficha: "o SLO é a rotação de regime; o alerta é a esfera que sobe".
- **Pagamentos: itens que ninguém entende como post.** "cooperativas de crédito (Unicred, Sicoob,
  Sicredi)" e "BaaS e embedded finance" são segmentos de mercado, não assuntos de um post técnico; vieram
  do site de notícias, que acompanha o mercado. Tirar os dois, ou fundir em "o sistema financeiro
  brasileiro (bancos, cooperativas, Pix, Open Finance, Drex)". "trilhos de pagamento (payment rails)"
  fica. O resto (ledger, conciliação, adquirência com autorização/captura/estorno/chargeback, fraude,
  regras das bandeiras e do Banco Central) está certo e no vocabulário dos posts.
- **IA.** "Bedrock e fine-tuning" junta uma plataforma com uma técnica: "modelos sob medida
  (fine-tuning, Bedrock)". O MCP só em IA está certo (a crítica anterior pediu).
- **Testes × SRE.** O chaos engineering em Testes é defensável e está dito; só registrar que é uma
  escolha contra a prática (quem faz é SRE em produção), para o post não ir para o lugar errado.
- **Segurança × Pagamentos.** PCI DSS só em Segurança, "fraude e risco" em Pagamentos: certo. A
  fronteira do Jackson (a ferramenta em Desenvolvimento; o que mascarar, em Segurança) é fina, mas está
  escrita.
- **Distribuição.** 21 posts: Desenvolvimento 6, SRE 3, cinco livros com 2, dois com 1, quatro com 0.
  Quatro livros vazios em treze é 31% da estante sem número, decisão do Cesar (D78); o que vale dizer
  a ele é que os quatro vazios são os quatro desenhos mais difíceis (seção 1) e que o Desenvolvimento,
  com 29% dos posts, é o próximo a pedir divisão (JVM e concorrência × Spring), o que a regra dos
  posts já cobre.
- **A tag Pagamentos → Cobrança**: concordo com a recomendação do editor e com os motivos. Duas notas:
  o ledger não leva a tag nova (menciona "cobrança" uma vez; conferido), então a tag reúne três posts
  e o livro tem um; e `/tags/Pagamentos/` deve redirecionar para `/tags/Cobrança/`, não para o livro:
  o endereço indexado prometia quatro posts, e a tag preserva três; o livro, um.

## 5. Desenho e frase juntos

A frase fica logo acima do desenho, na cor do livro. Onde se ajudam, onde brigam:

- **Ajudam-se** (a frase explica o objeto, ou o objeto ilustra a frase): 01 "As decisões caras de
  desfazer." sobre a parede movida na planta; 03 "Entre o seu código e a máquina." sobre a cabeça do
  tear lendo os cartões; 04 "O caminho do commit até a produção." sobre o tubo com a cápsula a caminho;
  08 "Como um sistema fala com o outro." sobre a mesa telefônica (o melhor par); 09 "Dinheiro não pode
  sumir nem duplicar." sobre a registradora; 10 "Quem pode o quê e como provar." sobre a alavanca
  detectora levantada; 11 "Quando o timeout não diz o que aconteceu." sobre dois relógios; 12 "O que
  mantém a produção de pé." sobre o regulador mantendo a rotação.
- **Neutras** (nem ajudam nem atrapalham): 02 "Onde o dado mora e por onde ele anda." sobre o
  tabulador (ajuda só para quem sabe o que é a prensa de cartões); 06 "O que fica quando a ferramenta
  muda." sobre o telégrafo (o telégrafo é a ferramenta que mudou; o bit ficou: funciona, mas o leitor
  precisa fazer a conta).
- **Precisam uma da outra**: 05 a prensa só vira Frontend com "navegador" ou "tela" na frase: é um
  argumento a mais pela frase nova ("O que o navegador mostra" sobre a folha impressa saindo); 07 o
  fonógrafo briga com "Software feito com IA" (música sob uma frase de software); com o Turco, "software
  que usa IA" é o que está na capa; 13 "Antes que a produção descubra." sobre o prumo diante da parede
  torta funciona só se a parede estiver torta o bastante para o leitor ver que algo "descobriu" o
  desvio.

## 6. A marca do site

Recomendação: **a marca acompanha a Arquitetura e vai para o azul-de-cianotipia `#2d4f77`, mas a regra
muda de "a marca é a capa do Volume 01" para "a marca é o livro da casa, na cor da Arquitetura por
escolha".** Três motivos: (1) com volumes em ordem alfabética (D78), "Volume 01" é instável: o
primeiro livro de A a Ar que entrar (Algoritmos, APIs) toma o número e a regra obrigaria a marca a
mudar de novo; (2) o azul de planta é a cor de identidade certa para o blog de um arquiteto de
soluções, e o verde-pátina perde o motivo (a história era a do arco, que sai); (3) é o que libera o
lugar certo para o Testes (seção 2): com a marca verde, o Testes ou volta a ser cinza de interface ou
cai na família da marca. Os dois riscos que a direção aponta estão medidos e são aceitáveis: a marca
fica a ΔE 0,11 do azul-tinta dos links (`#2549B8`) e a 0,10 da caneta (`#1F4FB5`): um azul de planta
acinzentado ao lado de dois azuis vivos, famílias diferentes; e a fita laranja da série sobre o azul
é o par clássico do blueprint. O custo é o que a direção lista (token `marca`, `scripts/marca.mjs`,
favicons, `scripts/livros/fotos.mjs`, as imagens OG): todo ele é script, e cabe na etapa 6.

## Fontes conferidas nesta crítica (além das da direção e da pesquisa)

- O Turco (Kempelen, 1770; Maria Teresa; as portas abertas antes da partida; Napoleão e Franklin;
  Maelzel; o incêndio de 1854; Babbage em 1819): Wikipedia, "The Turk",
  <https://en.wikipedia.org/wiki/The_Turk>; Linda Hall Library, "Wolfgang von Kempelen",
  <https://www.lindahall.org/about/news/scientist-of-the-day/wolfgang-von-kempelen/>; Wikipedia,
  "Wolfgang von Kempelen", <https://en.wikipedia.org/wiki/Wolfgang_von_Kempelen> (também a máquina de
  falar). Poe, "Maelzel's Chess Player" (*Southern Literary Messenger*, abril de 1836; o argumento de
  que uma máquina não erraria; Schlumberger): Wikipedia,
  <https://en.wikipedia.org/wiki/Maelzel%27s_Chess_Player>; Smithsonian Magazine,
  <https://www.smithsonianmag.com/smart-news/debunking-mechanical-turk-helped-set-edgar-allan-poe-path-mystery-writing-180964059/>.
  Amazon Mechanical Turk (2005, "artificial artificial intelligence", o nome): Wikipedia,
  <https://en.wikipedia.org/wiki/Amazon_Mechanical_Turk>.
- Lanterna mágica (os dez esboços de Huygens de 1659; a carta a Petit de 1664 com lâmpada, lente,
  imagem e parede; Walgensten e o nome; Kircher só em 1671): Wikipedia, "Magic lantern",
  <https://en.wikipedia.org/wiki/Magic_lantern>; Luikerwaal, "Christiaan Huygens, the true inventor of
  the magic lantern", <https://www.luikerwaal.com/huygens_uk.htm>; The Magic Lantern Society, "A history
  of the Magic Lantern", <https://www.magiclantern.org.uk/history/>.
- Kirkaldy (Southwark, 1866; a máquina de 47 pés encomendada em 1865; "FACTS NOT OPINIONS" sobre a
  porta; o primeiro laboratório independente de ensaio de materiais, Grade II*): Wikipedia, "David
  Kirkaldy", <https://en.wikipedia.org/wiki/David_Kirkaldy>, e "Kirkaldy Testing Museum",
  <https://en.wikipedia.org/wiki/Kirkaldy_Testing_Museum>; Kirkaldy's Testing Works,
  <https://www.testingworks.org.uk/>.
- Pedra de toque como ardósia negra: Britannica e Wikipedia, já na `pesquisa-cores-e-desenhos.md`.
- As contas de cor: `scripts/livros/conferir-cores.mjs` (saídas coladas acima) e um script próprio
  com as misturas de `src/styles/tokens.ts`, no scratchpad desta sessão (não fica no projeto).
