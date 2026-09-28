# Revisão das animações: o sumário e a abertura (problemas 4, 12 e 14)

Agente Acabamento do sumário e da abertura, 27/09/2026. Antes e depois gravados quadro a quadro num
Chrome headless próprio (`playwright-core`, screencast do CDP e uma sonda por quadro), contra o dev,
com o HMR do Vite desligado na página gravada (outros agentes editavam ao mesmo tempo, e cada edição
recarregava a página no meio da gravação). Conferência final no MCP `chrome-devtools`, em aba própria.
`npm run check` e `npm run contraste` sem erros antes de cada commit; com movimento reduzido, não há
abertura e as subseções abrem sem transição.

## 4. Sumário: a seção atual mudava a largura do nome (commit 49616bb)

**Causa:** `.secao > a[aria-current] { font-weight: 600 }` no `Sumario.astro`. No negrito, o nome fica
mais largo e quebra noutra linha, e a lista inteira desce. No `/posts/jackson-filtros-mascarando-cartao/`,
a 1440, "Variação: marcar os campos com uma anotação própria" passava de 2 para 3 linhas, e tudo embaixo
descia 19 a 20px. O sublinhado que sai é medido nas linhas de antes e fica preso ao item, então, quando
o nome voltava a ter menos linhas, o traço da última linha ficava sobre a seção seguinte. Na folha do
celular (390), foram 13 quadros de risco sobre a seção nova, na troca 3 → 4. E sobrava outro salto, de
47px, nas seções com subseções: elas surgiam de uma vez (`display: none` → `block`). **Mudança:** a
seção atual fica no peso 400: tinta cheia (`--ink`), com um contorno fino da própria cor
(`-webkit-text-stroke: 0.35px currentColor`), que encorpa a letra sem mexer na métrica (comparei 400,
0,35px, 0,5px e `text-shadow` em 2x, nos dois temas; o de 0,35px lê como um "médio", e quem marca é o
sublinhado azul). A cor muda em 0,2s. As subseções se desdobram e se dobram (grade `0fr` → `1fr`,
0,34s na curva da escrita, texto esmaecendo junto; fechadas, ficam `visibility: hidden`, fora do
teclado). O fio acompanha os pontos quadro a quadro durante o desdobrar (`acompanharSubsecoes` no
`artigo.ts`), e na primeira marcação (ao chegar, ou voltando pelo histórico) a lista já vem aberta,
sem transição. O lugar da barra de rolagem do sumário fica reservado (`scrollbar-gutter: stable`, fina),
para que ela não surja no meio da leitura e faça os nomes quebrarem de novo onde ocupa espaço. **Antes
e depois**, rolando o artigo inteiro: a 1440, de 1 mudança de linhas e saltos de 19px e 47px para 0
mudanças, com as subseções deslizando no máximo ~8px por quadro. Na folha do celular, de 2 mudanças de
linhas e 13 quadros de risco para 0 e 0. Conferi no MCP a 1440, claro e escuro, e na folha a 390,
escuro.

## 12. Abertura da home: o fio da caneta quase não aparecia no escuro (commit 4545e75)

**Causa:** na estante, o fio nascia na cor da borda da tábua (`--tabua-borda`). No escuro, dá 1,39:1
sobre o papel (no claro, 2,31:1). Nos primeiros ~0,9s, só a caneta andava numa tela vazia. **Mudança:**
o fio é escrito em `--ink-2` enquanto é risco de caneta. Quando a caneta levanta, ele passa em 0,18s
para a cor da tábua, enquanto a tábua cresce no lugar dele e ele esmaece. O `stroke` é um `color-mix`
de tokens, e o GSAP só leva `--vira` de 0 a 1. A cor final é `--tabua`, e não `--tabua-borda`: o fio
fica no meio da tábua, na altura do corpo dela, que é o que se vê quando ela ainda está achatada. No
escuro, a borda é mais escura que o corpo, e passar por ela faria o fio sumir e voltar. **Antes e
depois:** o contraste do fio, medido por quadro, foi de 1,39:1 para 8,24:1 no escuro e de 2,31:1 para
5,68:1 no claro. A passagem para a tábua é contínua nos dois temas, sem sumir nem piscar. Conferi a 1440
(claro e escuro) e a 390 (escuro) no headless, e o escuro a 1440 no MCP (trace com screenshots).

## 14. Abertura das outras telas: o caderno cruzava o nome no voo (commit da revisão 14, o deste relatório)

**Causa:** em `caderno()`, o `x`, o `y` e a escala andavam juntos, com o mesmo `power2.inOut`, em linha
reta do meio da tela até a marca. Perto do fim, o caderno passava por cima de "Cesar Schutz": 5 quadros
a 1440 (até 356px² de sobreposição) e 3 a 390. **Mudança:** o voo é um arco (`voarAteAMarca`). É uma
curva de Bézier com o ponto de controle embaixo da marca. O caderno sai de lado, pouco acima do meio da
tela, faz a curva e sobe por baixo da marca: só chega à altura do cabeçalho quando já está sob ela,
pequeno. O giro acompanha o arco. Ele inclina para o lado do voo, conforme a velocidade de lado (até 9°
a 1440, ~7° a 390), e se endireita ao subir, como um objeto posto no lugar. Pousa reto, na mesma caixa
da marca. Mas subir por baixo da marca passa pelo título da página, que fica logo embaixo dela e começa
na mesma coluna. Por isso, o papel agora só sai quando o caderno já passou: 0,42s depois do começo do
voo, em 0,35s, e não mais 0,1s depois. As folhas começam a chegar 0,3s depois do começo do voo, ainda
embaixo do papel. A marca de verdade toma o lugar do caderno quando o papel acaba de sair, então não há
salto na troca. O voo é sobre a folha limpa, e a página aparece em volta do caderno quando ele pousa.
**Antes e depois**, a 1440 e a 390, nos dois temas: de 5 e 3 quadros sobre o nome para 0. Sobre o
título, 0 quadros com ele visível: a sonda multiplica a sobreposição pelo quanto o título aparece, com o
papel por cima e a opacidade da chegada. No artigo a 390, o título grande fica embaixo do caderno durante
o voo todo, mas sempre coberto pelo papel. O pouso continua exato (a caixa do caderno no último quadro
é a da marca, com meio pixel de diferença, como antes). O custo é que a página aparece ~0,25s mais tarde
e a abertura termina ~0,22s depois. Conferi `/tags/` e um artigo, a 1440 e a 390, claro e escuro, no
headless, e `/tags/` escuro a 1440 no MCP (trace com screenshots).

## O que não deu, ou ficou de fora

- No 14, o arco "por cima do nome" não cabe. Acima de "Cesar Schutz", há 12px até a borda da tela, e o
  caderno já tem 27px de altura quando chega. Ele teria de sair da tela. Por isso, o voo passa por
  baixo, e o tempo do papel cobre o título.
- No 14, a página aparece ~0,25s mais tarde que antes. Se o Cesar achar lento, dá para ganhar ~0,06s
  começando o papel em `t3 + 0.36`, com margem menor sobre títulos altos.
- No 4, o traço que sai continua medido pela posição de antes, mas agora o layout não muda na troca, e
  ele fica sempre embaixo do próprio nome. Não precisei apagá-lo mais depressa (0,22s, o do menu).

## Para registrar

- **decisoes.md (D52, revisão):** (4) a seção atual do sumário não muda de peso: tinta cheia com
  contorno fino da própria cor (0,35px) e o sublinhado azul; as subseções da atual se desdobram (0,34s)
  e o fio acompanha; a barra do sumário tem o lugar reservado. (12) o fio da abertura da home é escrito
  em `--ink-2` e passa para `--tabua` quando vira a tábua. (14) o caderno da abertura voa em arco,
  subindo por baixo da marca, inclinando para o lado do voo; o papel só sai quando ele passou pelo
  título, e a marca de verdade entra quando o papel acaba de sair.
- **DESIGN.md:** no sumário, "a seção atual em `--ink`, com contorno fino da própria cor, sem mudar o
  peso; as subseções se desdobram"; em Movimento, na abertura, o fio em `--ink-2` que passa à cor da
  tábua e o voo em arco do caderno, com o papel saindo depois.
