# Auditoria da clareza das peças animadas (02/10/2026)

Revisão às cegas das 10 peças animadas (7 lousas e 3 animações com play), lidas como um leitor de primeira
viagem que só leu o parágrafo antes de cada peça. Nada foi editado no repositório.

**Como foi feito**

- `scripts/desenho/revisar.mjs` em cada post (dev em 4330). O script não acusou nenhum problema automático
  (colisão, corte, texto menor que 10 px). Os problemas abaixo são de leitura, não de bug.
- Fotos extras das três animações em 8 a 13 instantes, pelo `relogio.ir(t)` do cartão.
- Contagem nos SVGs e nos `.ts`: textos, palavras, cores, partes por passo, pico de partes desenhadas ao
  mesmo tempo e o que some, apaga ou muda de lugar (scripts de uma vez, que não ficaram no projeto).
- Fotos: `.astro/revisar/<slug>/` e `.astro/revisar/extra/` (`jk-anim-*`, `cb-anim-*`, `bl-anim-*`,
  `cc-*`).
- **Erro do dev:** `/posts/claude-code-do-claude-md-ao-mod/` responde 404 no dev da 4330. Provavelmente o
  armazenamento de conteúdo não releu o post novo. Não consertei. A lousa 10 foi vista pela folha
  `/amostra/lousas/?lousa=claude-code-do-claude-md-ao-mod/instalacao` (os quadros-chave, parados) e pelo
  SVG. Por isso, os controles dela não foram vistos dentro do post.

---

## Tabela

| # | Peça | Tipo | Veredito | Problemas principais |
|---|---|---|---|---|
| 1 | criptografia · `envelope` | Lousa de passos | **ruim** | Abre no quadro final, que sobrepõe o fluxo normal ao cenário "chave desativada" ("permissão ok" riscado, X na seta, chave mestra riscada). Os dados já aparecem ilegíveis desde o passo 1, então o "ilegíveis" do fim não tem contraste. Algumas setas contradizem o texto, e os selos andam em zigue-zague. |
| 2 | criptografia · `tls` | Lousa de comparação | **média** | Os símbolos estão trocados: ✓ quer dizer "aceitou (ruim)" e o X verde quer dizer "recusou (bom)". Duas canetas desenham ao mesmo tempo duas linhas iguais na primeira metade. São 1,75 s por estado. |
| 3 | jackson · `dois-caminhos` | Animação com play | **média** | O ator é um cartãozinho de 68 px que anda e some, e o CVV cai e some. Todo o andaime aparece desde o início. O risco no log lê como "apagado". O `toString()` da legenda não aparece no desenho. No celular, o log fica fora da tela. |
| 4 | jackson · `passos` | Lousa de passos | **média** (perto de clara) | A ordem vai da direita para a esquerda (cvv = 2, numero = 3, titular = 4). Os textos dos passos citam métodos que não estão no desenho (`serializeAsOmittedProperty`, `g.writeStringProperty`). São 7 a 9 partes em 1,75 s por passo. |
| 5 | cronjob · `deploy-no-meio-do-lote` | Lousa de comparação | **clara** (com ressalvas) | Duas canetas em linhas diferentes ao mesmo tempo. O jargão ("visibility timeout de 2 h") vem antes da hora. No fim, cinco rótulos se juntam entre 05:00 e 05:40. O estado 2 tem três fatos. |
| 6 | cobrança · `resposta-perdida` | Animação com play | **média** (perto de clara) | O relógio gira 5,6 s em paralelo com os envelopes, em outro canto. Oito objetos aparecem, andam e somem. Os rótulos de eventos futuros ("resposta 201", "capturada") já estão lá desde o início. A 2ª cobrança reaproveita as setas da 1ª. |
| 7 | cobrança · `passos` | Lousa de passos | **ruim** | Duas tentativas sobrepostas nas mesmas três caixas: 32 textos, 6 cores, 3 chaves, 2 INSERT, 2 "201". Os selos andam em zigue-zague (1 e 2 à esquerda, 3 na ponta direita, 4 de volta à esquerda). O quadro final sozinho não se lê. |
| 8 | cobrança · `tempo` | Lousa de comparação | **média** | As duas linhas são idênticas até o timeout e são desenhadas juntas. As setas diagonais soltas não ligam as raias de ponta a ponta. "R$ 250" aparece 7 vezes, com dois sentidos. O UNIQUE fica na raia do serviço, porque não há raia do banco. |
| 9 | bloqueio · `detectar-ou-evitar` | Animação com play | **ruim** | Duas histórias (otimista e pessimista) e 6 colunas: 33 textos, 5 cores, 40 partes animadas e 7 riscos. Cinco viagens de envelope que somem. O jargão (`version`, `UPDATE 0`, `FOR UPDATE`) só é explicado nas seções 2 e 3. Faltam no desenho as gravações que produzem o 90 e o 80 do pessimista. No celular, a coluna B fica fora da tela. |
| 10 | claude-code · `instalacao` | Lousa de passos | **ruim** | Três histórias (instalar, atualizar, sessão aberta). Os passos têm de 10 a 19 partes, e os textos trazem comandos inteiros. "0.5.0" aparece 4 vezes no quadro final, e "0.6.0", 3. Um evento que não acontece é desenhado (tracejado + X). A `skills/explicar-erro` não volta à história. |

### Os números

As figuras paradas do mesmo post estão no fim, para comparar. "Some" conta os objetos que aparecem, andam
e desaparecem (opacidade a 0). Nas lousas, nada some durante o play, mas o quadro inteiro é apagado a cada
volta (padrão P1).

| Peça | Textos | Palavras | Cores | Partes por passo (pico ao mesmo tempo) | Some / apaga / anda | Duração (s por passo) |
|---|---|---|---|---|---|---|
| 1 envelope | 24 | 43 | 3 | 12 · 10 · 9 · 8 (1) | 4 riscos | 10 s (2,5) |
| 2 tls | 25 | 51 | 3 | 6 · 16 · 6 · 10 (**2**) | 2 esmaecem | 7 s (**1,75**) |
| 3 dois-caminhos | 13 | 25 | 3 | (contínua) | **3 somem**, 2 andam, 2 riscos | 11,1 s |
| 4 jackson passos | 21 | 27 | 3 | 9 · 8 · 7 · 7 (1) | 2 esmaecem | 7 s (**1,75**) |
| 5 deploy | 26 | 63 | 4 | 4 · 7 · 1 · 6 · 2 (**2**) | 0 | 12 s (0,7 a 3,5) |
| 6 resposta-perdida | 23 | 51 | 4 | (contínua) | **8 somem**, 8 andam, o ponteiro gira | 11,6 s |
| 7 cobrança passos | **32** | 50 | **6** | 7 · 9 · 13 · 13 · 12 (1) | 1 risco | 15 s (2,3 a 4) |
| 8 cobrança tempo | 27 | 47 | **6** | 3 · 4 · 17 · 14 · 7 · 17 (**2**) | 0 | 12 s (**1,2** a 2,9) |
| 9 detectar-ou-evitar | **33** | 60 | 5 | (contínua) | **5 viagens somem**, 3 cartões deslizam, 7 riscos | 12 s |
| 10 instalacao | **33** | 52 | 4 | **19** · 10 · 13 · 16 · 17 (1) | 2 riscos | 16 s (3,2) |
| *figura camadas* | 20 | 48 | 4 | — | — | parada |
| *figura dois-mappers* | 28 | 46 | 6 | — | — | parada |
| *figura abordagem-b* | **40** | **93** | 5 | — | — | parada |
| *figura destino-fora-do-ar* | 24 | **100** | 3 | — | — | parada |
| *figura por-dentro-e-por-fora* | 28 | 59 | 5 | — | — | parada |

**Leitura dos números:** a quantidade sozinha não explica o "muita coisa". As figuras paradas, que o Cesar
acha claras, têm tanto texto quanto as peças animadas, ou mais (até 40 textos e 100 palavras). O que muda é
a quantidade somada a quatro coisas: o que **muda de estado no mesmo lugar**, o que **acontece em dois
lugares ao mesmo tempo**, o que **some** e a **velocidade** (de 7 a 19 partes novas em 1,75 a 3 s).

---

## Peça por peça

### 1. Envelope (criptografia) · ruim

**A ideia central:** os dados são cifrados por uma chave que só abre com a permissão do KMS; se a chave
mestra for desativada, nada mais abre, nem os backups.

O que atrapalha:
- **O quadro final é a primeira coisa que o leitor vê** (a lousa abre completa). Ele junta o fluxo que
  funciona (passos 1 a 3) e o cenário de falha (passo 4): "permissão ok" riscado, "recusa o pedido", X no
  começo da seta "aberta na memória do banco", chave mestra riscada e "ilegíveis". Sem o play, o leitor não
  sabe o que vale.
- **Falta contraste no ponto principal.** Os dados viram lixo (`9fQk2xPzA…`) no passo 1 e continuam iguais
  até o fim. O passo 4 diz "ilegíveis", mas o desenho nunca mostrou o banco lendo "Maria Souza" em claro.
- **As setas contradizem o texto.** O passo 2 diz que a chave mestra "nunca sai do KMS", mas a seta azul
  sai do KMS e vai até o envelope. O passo 3 diz que "o banco pede ao KMS", mas a seta "pede para abrir"
  sai do envelope, e não do banco.
- **Os selos andam em zigue-zague:** 1 embaixo, no meio; 2 no centro; 3 embaixo, à direita; 4 no alto, à
  direita. "cifra" aparece duas vezes, em âmbar e em azul, sem legenda.
- O passo 4 desenha em três cantos: o KMS, a seta do topo e o rodapé do banco.

**Cortar:** o cenário "chave desativada" de dentro da mesma lousa. Ele vira um segundo quadro ou uma figura
parada "e se a chave for desativada?". Também saem duas das três linhas de dados (uma basta) e o "permissão
ok" riscado.
**Mudar:** mostrar o banco lendo o dado em claro no passo 3 (na memória) e não lendo no 4. As setas passam a
seguir o texto: o pedido sai do banco, e o envelope entra no KMS e volta aberto, sem a chave mestra sair. Os
selos ficam em ordem de leitura.

### 2. TLS (criptografia) · média

**A ideia central:** com `require`, qualquer certificado serve e o intermediário lê tudo; com
`verify-full`, o cliente confere quem é e a conexão nem abre.

O que atrapalha:
- **Os símbolos estão invertidos.** No alto, um ✓ preto sobre o certificado vermelho quer dizer "aceitou",
  que é o caso ruim. Embaixo, um X **verde** quer dizer "recusou", que é o caso bom. O leitor aprende o
  contrário do que espera.
- **Há duas canetas ao mesmo tempo nas duas linhas, e até o estado 3 as linhas são idênticas.** Metade da
  peça mostra a mesma coisa duas vezes, em dois lugares.
- **A peça é rápida:** 7 s (o padrão) para 4 estados, 1,75 s por estado, e no estado 2 são 16 partes.
- "não confere quem é / aceita" fica solto embaixo do cliente, longe do certificado de que fala. O
  Intermediário de baixo **esmaece** (até 35%): parece que sumiu, quando a ideia é "ficou de fora".
- O quadro final sozinho funciona bem, porque o resultado está escrito em cada linha.

**Cortar:** a animação da parte comum. Cliente, intermediário, "pede TLS" e certificado já vêm desenhados
("montado antes da aula"), e o play anima só a diferença (aceita ou recusa, e o resultado). O esmaecer
também sai.
**Mudar:** o dicionário de símbolos (✓ verde = deu certo, X vermelho = deu errado). "aceita" e "recusa" vão
para junto do certificado. Cada estado ganha pelo menos 3 s.

### 3. Dois caminhos (jackson) · média

**A ideia central:** só o que passa pelo mapper de log é mascarado; o `toString()` leva o número inteiro ao
log.

O que atrapalha:
- **O ator é minúsculo e some.** É um cartãozinho de 68 × 44 numa peça de 1200 de largura, em que o CVV é
  um retângulo de 22 px. O cartão aparece, anda, some na chegada, e o CVV cai e some. No quadro final não
  sobra nada do trajeto: o leitor que piscou perdeu a ideia.
- **O andaime fica à mostra desde o início:** as duas setas, o filtro, "não passa pelo filtro", "remove o
  cvv, mascara o número" e as duas linhas de código. O leitor lê o resumo antes de o movimento contar a
  história.
- **O risco é ambíguo.** As duas linhas vermelhas do log são riscadas para dizer "isso não pode ir para o
  log", mas risco lê como "foi apagado". Na lousa do envelope, risco quer dizer "deixou de valer".
- A legenda e o parágrafo falam de `toString()`, mas o desenho mostra `log.info("{}", pedido)`. As linhas
  de código ficam longe das setas a que pertencem (`logJson.toJson` embaixo do filtro).
- A fita verde no número, dentro de um filtro verde, quase não se vê.
- **No celular, o log fica fora da tela** (a peça rola de lado). O leitor vê o cartão sair e não vê
  chegar.
- Depende de ter lido as seções 3 a 5 (mapper de log, mixin, filtro). Como a peça está na seção 7, tudo
  bem.

**Cortar:** os cartões que andam e somem, o CVV que cai e as linhas decorativas do log.
**Mudar:** fazer o próprio texto andar (`5502091234567890` percorre a seta vermelha e é escrito no log; pela
verde, entra inteiro no filtro e sai `550209******7890`). Ou só acender a seta e escrever a linha no log,
sem objeto viajando. Trocar o risco por um selo "não pode" ou por um cadeado aberto vermelho, como na figura
das camadas. Escrever `toString()` na seta vermelha.

### 4. Passos do filtro (jackson) · média (perto de clara)

**A ideia central:** o filtro olha um campo por vez e decide: omite o cvv, mascara o número e deixa o resto
passar.

O que atrapalha:
- **A ordem vai da direita para a esquerda.** Os passos seguem o código (remover, mascarar, fluxo normal),
  mas as colunas seguem o record (titular, numero, cvv). O 2 está na ponta direita, o 3 no meio e o 4 à
  esquerda.
- **O texto do passo não é o desenho.** Os passos citam `serializeAsOmittedProperty`,
  `g.writeStringProperty(...)` e `writer.serializeAsProperty(...)`, que não aparecem na lousa. Cada um tem
  de 10 a 28 palavras, e os dois primeiros ocupam duas linhas no caderno.
- **A peça é rápida:** 7 s para 4 passos, com 7 a 9 partes em 1,75 s.
- O JSON do log é escrito de baixo para cima (numero no passo 3, titular no 4).
- O quadro final sozinho se lê bem: é a melhor das lousas de passos.

**Cortar:** os nomes de método nos passos. Eles já estão no código acima.
**Mudar:** pôr as colunas na ordem dos passos (cvv, numero, titular) ou numerar na ordem de leitura. Passos
curtos ("cvv: omitido", "numero: mascarado", "titular: segue igual"). Duração de 12 s.

### 5. Deploy no meio do lote (cronjob) · clara (com ressalvas)

**A ideia central:** na A, o deploy não toca no job; na B, ele cancela o lote, e a mensagem fica 1h30
invisível na fila.

O que funciona: o tempo da peça é o tempo do eixo (03:00 → 06:00). A caneta revela da esquerda para a
direita, como o relógio. O quadro final é um gráfico de Gantt que se lê sozinho. É o melhor uso de
animação entre as 10: o assunto *é* o tempo.

O que atrapalha:
- **Há duas canetas em duas linhas ao mesmo tempo** (A e B crescem juntas de 0,29 a 0,45). O olho escolhe
  uma e perde a outra.
- **O jargão vem antes da hora:** a chave "visibility timeout de 2 h" é a primeira coisa desenhada (t =
  0,004), antes de qualquer evento. Ela começa às 03:00, mas a caixa "mensagem invisível na fila" só começa
  às 03:30, e o leitor atento estranha.
- No fim, cinco rótulos se juntam entre 05:00 e 05:40 ("reaparece", "1h30 parado", "de onde a v1 parou",
  "termina na v2, às 05:40", "parte em cada versão").
- O texto do estado 2 tem três fatos (deploy, A segue, B cancela e não apaga). O estado 5 dura 0,7 s.

**Cortar:** "de onde a v1 parou" e "parte em cada versão" viram uma frase-resumo escrita no desenho.
**Mudar:** uma linha vertical "agora" que anda e leva as duas canetas juntas, para o olho ter um lugar só.
Ou desenhar a A inteira primeiro (ela é curta) e depois a B. A chave do visibility timeout aparece quando a
mensagem reaparece.

### 6. A resposta perdida (cobrança) · média (perto de clara)

**A ideia central:** o app não sabe se cobrou, envia de novo, e o cliente paga duas vezes.

O que funciona: o quadro final conta a história (fatura com duas linhas e o carimbo "cobrado duas vezes"),
e o parágrafo antes da peça prepara bem.

O que atrapalha:
- **Duas coisas em dois lugares ao mesmo tempo.** O ponteiro do relógio gira 5,6 s no canto de baixo,
  enquanto os envelopes vão e voltam no alto. Depois, a moeda cai na fatura enquanto a confirmação volta.
- **Oito objetos aparecem, andam e somem:** pedido, captura, confirmação, moeda, resposta, pedido 2,
  captura 2 e moeda 2. Os envelopes têm 36 × 22 numa peça de 1200 de largura.
- **Os rótulos do futuro estão lá desde o início:** "resposta 201", "capturada", "lança na fatura" e
  "capturar R$ 250". O leitor lê "resposta 201" antes de existir resposta.
- **A 2ª cobrança reaproveita as setas da 1ª.** No quadro final, nada mostra que houve duas idas ao
  adquirente, só a segunda linha da fatura.
- O reenvio sai do relógio, e não da caixa do App (o relógio parece mandar o pedido).
- São 11,6 s, a peça começa sozinha ao entrar na tela e recomeça em loop. No celular, a fatura fica fora da
  tela.

**Cortar:** a moeda que cai, o pulso do relógio e os rótulos de eventos ainda não acontecidos (cada um é
escrito quando o evento acontece).
**Mudar:** o relógio só anda quando nada mais anda (o pedido sai, para, e o relógio corre até o timeout). O
reenvio sai do App. A segunda ida ganha uma seta própria ("de novo"), para o quadro final mostrar as duas.
Quem viaja deixa rastro: a seta acende e fica.

### 7. Os cinco passos da chave (cobrança) · ruim

**A ideia central:** o serviço grava a chave antes de cobrar; na repetição, o banco recusa a chave, e o
serviço devolve a resposta guardada sem cobrar de novo.

O que atrapalha:
- **Duas tentativas sobrepostas nas mesmas três caixas.** As setas da primeira e da segunda se
  intercalam na mesma faixa (pedido 1, resposta perdida, pedido 2, resposta guardada). No quadro final há 3
  chaves, 2 INSERT, 2 "201", 32 textos e 6 cores (azul, verde, âmbar, roxo, petróleo e vermelho), sem
  legenda.
- **Os selos andam em zigue-zague:** 1 e 2 à esquerda; 3 na ponta direita (adquirente); 4 de volta à
  esquerda; 5 no meio. O passo 5 desenha em três lugares: o INSERT embaixo, a seta "resposta guardada" no
  alto à direita e "não é chamado de novo" sob o adquirente.
- **Há muito por passo:** 12 a 13 partes nos passos 3, 4 e 5. O passo 4 junta duas ideias (a resposta se
  perde e o app tenta de novo).
- O texto curto do post-it ajuda ("Cobra e guarda a resposta"), mas o desenho não acompanha a mesma
  economia.
- **No celular, o adquirente e a coluna status ficam fora da tela.** O passo 3 inteiro acontece onde o
  leitor não vê.

**Cortar:** dividir em duas peças, "a primeira tentativa" (passos 1 a 3) e "a repetição" (passos 4 e 5).
Ou, numa só, duas colunas, sem as tentativas dividindo as caixas. Saem as repetições da chave e do 201.
"não é chamado de novo" vira um X na seta do adquirente.
**Mudar:** selos em ordem de leitura e uma legenda das cores no desenho. "PROCESSANDO → CAPTURADA" escrito
uma vez, como troca de etiqueta.

### 8. A mesma falha, com e sem a chave (cobrança) · média

**A ideia central:** a mesma falha de rede: sem a chave, duas cobranças; com a chave, uma.

O que atrapalha:
- **As duas linhas são iguais até o timeout e são desenhadas juntas** (duas canetas). A diferença real
  (a chave gravada, o UNIQUE e a resposta guardada) é só um terço da peça.
- **As setas não ligam as raias de ponta a ponta.** São traços diagonais curtos e soltos, e quem não
  conhece diagrama de sequência não sabe de onde saem nem aonde chegam. A volta do adquirente não existe.
- **"R$ 250" aparece 7 vezes, com dois sentidos** (o pedido e o recibo da cobrança).
- **O UNIQUE fica na raia do serviço**, porque não há raia do banco.
- O resultado tem cores diferentes: "duas cobranças" em vermelho, "uma cobrança" em preto (não em verde).
- Os estados 1 e 2 duram 1,2 s cada. As raias têm rótulos pequenos, em itálico.

**Cortar:** a animação do trecho comum. Até o timeout, tudo já vem desenhado, e o play anima só a
repetição.
**Mudar:** setas que saem de uma raia e chegam na outra, com o rótulo. Uma raia "banco" para o UNIQUE.
"uma cobrança" em verde, com ✓.

### 9. Detectar ou evitar (bloqueio) · ruim

**A ideia central:** no otimista, B descobre o conflito ao gravar e refaz; no pessimista, B espera a trava
e nunca erra.

O que atrapalha:
- **Duas histórias, seis colunas e uma peça só.** São 33 textos, 5 cores, 40 partes animadas e 7 riscos.
  A legenda de texto pede para decorar 5 cores antes de assistir ("A em azul, B em âmbar… vermelho é
  conflito ou espera, verde é o que deu certo").
- **Muita coisa anda e some:** 5 viagens de envelope que somem (uma bate, gira e cai), 3 cartões "version"
  que deslizam até o lugar, o X que cresce do nada, o relógio que cresce e gira 720°, e cadeados de 28 px
  que aparecem e abrem.
- **O jargão vem antes da hora.** A peça está na seção 1, mas usa `version`, `UPDATE 1`, `UPDATE 0`, `FOR
  UPDATE` e `COMMIT`, que o post só explica nas seções 2 e 3. "UPDATE 0" (zero linhas afetadas) é a chave da
  metade de cima, e quem não sabe SQL não entende.
- **Faltam passos no desenho.** No pessimista, A faz `FOR UPDATE` e `COMMIT`, mas ninguém escreve o
  UPDATE que gera o 90; B "lê saldo 90" e o 80 aparece na conta sem B gravar. A trava de B fica fechada no
  fim, e o relógio fica parado no quadro final sem explicação.
- **No celular, a coluna da Transação B fica fora da tela.** O conflito e a espera, que são a história,
  acontecem onde o leitor não vê.
- 12 s, começa sozinha e em loop.

**Cortar:** dividir em duas peças, uma por bloqueio, cada uma na sua seção, depois do SQL que ela usa.
Saem os envelopes voando, os cartões que deslizam e o relógio girando.
**Mudar:** contar como linha do tempo vertical (A à esquerda, B à direita, a linha da conta no meio, o
tempo descendo, um evento por linha, nada se move). Escrever as gravações que faltam. Explicar "UPDATE 0"
no próprio desenho ("0 linhas: a versão mudou"). Pôr a legenda das cores dentro do desenho.

### 10. Instalação e atualização (claude-code) · ruim

**A ideia central:** instalar copia a pasta na versão do `plugin.json`; commits novos só chegam quando o
`version` sobe e você roda o update.

O que atrapalha:
- **Três histórias numa peça:** instalar (1 a 3), "commit não chega" (4) e atualizar com a sessão aberta
  (5). O passo 5 junta duas ideias (o update e a sessão que segue na versão antiga).
- **Há muito por passo:** 19 partes no passo 1, 16 no 4 e 17 no 5. "0.5.0" aparece 4 vezes e "0.6.0" 3
  vezes no quadro final, entre riscos e reescritas.
- **Um evento que não acontece é desenhado:** tracejado vermelho com X e "o número não subiu". Desenhar o
  que não acontece é o mais difícil de ler.
- **A linha de commits fica fora das caixas**, atravessando a máquina do leitor, embora seja a história do
  repositório. A seta do update sobe da linha do tempo direto para a máquina, pulando o catálogo clonado.
- **O texto do passo é longo e é comando:** de 19 a 30 palavras, com `claude plugin marketplace add
  cesarschutz/claude-code-kit` inteiro, que já está na tabela de comandos do post.
- A `skills/explicar-erro` é desenhada no passo 1 e não volta mais (ruído). O mesmo vale para "name:
  cesarschutz".
- 16 s, em loop.

**Cortar:** a skill avulsa, o tracejado com X, a "sessão aberta" (vira uma frase no texto ou uma segunda
peça) e os comandos inteiros nos passos.
**Mudar:** duas peças, "instalar" e "atualizar", com no máximo 4 partes por passo. Cada pasta com uma
etiqueta de versão só, que troca ("0.5.0 → 0.6.0" escrito uma vez). A linha de commits dentro da caixa do
repositório.

---

## Os padrões que se repetem

**P1. A peça abre no fim, apaga tudo e recomeça em loop (no componente, não no desenho).**
A lousa abre completa (`t = 1`), e esse quadro final é a primeira impressão. O play **apaga o quadro
inteiro** e redesenha do zero. No fim, espera 5 s e **apaga de novo** (`PAUSA_NO_FIM`, em `Lousa.astro` e em
`relogio.ts`), em loop até a pausa. As animações começam sozinhas ao entrar na tela e também repetem. É
provável que boa parte do "coisa sumindo" do Cesar venha daqui, e não de cada desenho: quem está lendo a
lista ou o post-it vê o quadro sumir sozinho a cada 12 a 21 s.

**P2. O quadro final guarda a história em vez do resultado.**
Riscado mais o valor novo, sucesso mais falha, primeira e segunda tentativa, tudo no mesmo lugar (1, 7, 9 e
10). Como esse é o quadro de abertura (P1), o leitor começa pela versão mais confusa.

**P3. Duas histórias numa peça só.**
Fluxo normal e "e se a chave cair" (1), otimista e pessimista (9), primeira tentativa e repetição nas
mesmas caixas (7), instalar, atualizar e sessão aberta (10).

**P4. Duas coisas ao mesmo tempo em lugares diferentes.**
- Comparações com duas canetas juntas (2, 5 e 8), inclusive quando as linhas são iguais (2 e 8).
- O relógio que gira em paralelo com a ação (6 e 9).
- Passos que desenham em três cantos (1 no passo 4, 7 no passo 5, 10 no passo 5).

**P5. O ator é minúsculo, anda e some.**
Envelopes e cartões de 36 a 68 unidades numa peça de 1100 a 1200 de largura (3% a 6%). Nas três animações,
3, 8 e 5 objetos aparecem, viajam e desaparecem. O quadro final não guarda o trajeto.

**P6. O mesmo símbolo com sentidos diferentes.**
- Risco: "substituído" (7, 9, 10), "deixou de valer" (1) e "proibido" (3).
- X: "deu errado" (6, 9), "deu certo, foi recusado" (o X verde em 2), "desejado, omitido" (4) e "não
  aconteceu" (10).
- ✓: "aceitou, o que é ruim" (2) e "deu certo" (9).
- Vermelho: erro (6, 7) e o resultado desejado (o cvv omitido em 4).

**P7. O andaime aparece antes da história.**
Nas animações, todos os rótulos estão na tela desde `t = 0`, inclusive os dos eventos que ainda vão
acontecer ("resposta 201", "capturada", "não passa pelo filtro"). O leitor lê o fim antes do começo e não
sabe para onde olhar.

**P8. A ordem de leitura está quebrada.**
Selos em zigue-zague (1, 7, 10) ou da direita para a esquerda (4).

**P9. O texto do passo não é o desenho.**
- Textos longos, com métodos e comandos que não aparecem na lousa (4, 10).
- Setas que contradizem o texto (1).
- Legenda que cita o que o desenho não mostra (`toString()`, em 3).

**P10. A peça é rápida demais.**
1,75 s por passo com 7 a 16 partes (2, 4), estados de 1,2 s (8) e 0,7 s (5). A duração padrão de 7 s é
curta para qualquer lousa de 4 passos.

**P11. Não há legenda de cor no desenho.**
Nenhuma lousa tem legenda, e as peças usam de 3 a 6 tons. Na 9, a legenda das cores está no texto embaixo,
para ser decorada antes.

**P12. No celular, a ação acontece fora da tela.**
Até 700 px a peça rola de lado, como as figuras. Na figura parada, o leitor arrasta quando quer. Na peça
animada, a caneta ou o envelope agem na parte escondida: a coluna B (9), o log (3), o adquirente e o status
(7), a fatura (6).

**P13. O jargão chega na hora errada.**
"visibility timeout" desenhado antes de qualquer evento (5); `version`, `UPDATE 0` e `FOR UPDATE` antes da
seção que os explica (9); `writer.getName()` (4).

---

## O que as figuras paradas fazem de certo

Comparei com `camadas`, `dois-mappers`, `abordagem-a`, `abordagem-b`, `destino-fora-do-ar`,
`gatilho-dispara-duas-vezes`, `sem-resposta-para-perder` e `por-dentro-e-por-fora`.

1. **Mostram um estado só.** Nada está riscado por cima de outra coisa. Quando precisam de tempo, viram
   espaço: `destino-fora-do-ar` mostra três cenários numa linha do tempo, um embaixo do outro, sem mudar
   nada.
2. **Têm a legenda das cores dentro do desenho, e o mouse acende uma cor por vez.** O leitor escolhe o que
   olhar, em vez de ser levado.
3. **Os números estão na ordem de leitura**, cada um colado a um rótulo curto na seta (`dois-mappers`: 1 →
   4 de cima para baixo; `abordagem-b`: 1 → 6 seguindo o fluxo).
4. **O rótulo fica dentro da caixa:** um título e uma linha de subtítulo, de 2 a 4 palavras. O texto longo
   fica numa frase-resumo escrita no próprio desenho ("Nos três casos o estado fica no banco… o que muda é
   quem retoma, e quando.").
5. **Um símbolo tem um sentido só.** Na figura das camadas, o cadeado aberto vermelho é "em texto claro" e
   o fechado colorido é "protegido", em toda a grade. O vermelho fica reservado para o problema (o contorno
   vermelho em "o servidor fica aberto").
6. **O movimento não muda o conteúdo.** Os pontos que correm pelas setas, na ordem dos números, mostram o
   fluxo sem que nada apareça, suma ou troque de lugar.
7. **O leitor lê no ritmo dele.** Nada some, nada recomeça. No celular, "Arraste para o lado para ver a
   figura inteira" funciona porque o desenho espera.
8. **Explicam sozinhas.** O desenho parado *é* o quadro final, sem depender do play nem da lista.

## O que isso sugere para o formato novo

Para virar regra (proposta, para o Cesar decidir):

- **Antes de animar, perguntar se uma figura parada com números resolve.** Animar só onde o tempo é o
  assunto (espera, corrida, timeout, deploy no meio). Das 10, a 5 e a 6 são esses casos.
- **Uma ideia por peça**, escrita numa frase dentro do desenho, como nas figuras. Duas histórias viram duas
  peças.
- **O quadro final é uma figura:** explica sozinho e mostra o resultado, sem sucesso e falha sobrepostos.
- **Abrir no quadro final, tocar uma vez e parar.** Sem loop e sem apagar o quadro sem o leitor pedir.
- **Um lugar muda por vez.** Na comparação, o que é igual nas duas linhas já vem desenhado, e só a
  diferença anima.
- **Nada some.** Quem viaja deixa rastro (a seta acende e fica). Ator nenhum termina em opacidade 0.
- **Por passo:** no máximo 3 ou 4 partes novas, pelo menos 3 s, e um texto de até 12 palavras que diga só
  o que se vê.
- **Selos na ordem de leitura** (esquerda → direita, cima → baixo).
- **Um dicionário fixo de símbolos e cores:** ✓ verde = deu certo; X vermelho = falhou ou foi recusado;
  risco = valor substituído (só isso); cinza tracejado = não aconteceu. A legenda das cores fica dentro do
  desenho.
- **No celular,** abaixo de 700 px, a peça empilha na vertical, ou a vista acompanha a caneta.
- **Um formato candidato já existe no dev:** a folha `/amostra/lousas/` mostra os quadros-chave lado a
  lado, parados. Uma **tirinha** (2 a 4 quadros pequenos, cada um com uma frase) dá a ordem dos passos sem
  nada sumir e se lê no ritmo do leitor, como as figuras.
