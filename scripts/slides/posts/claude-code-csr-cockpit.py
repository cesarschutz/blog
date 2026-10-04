"""A apresentação da parte 2 do post dos mods (D74): "Um mod do Claude Code na prática — instalação, testes e
limites (parte 2 de 2)". Os slides do marketplace, dos comandos e dos testes vieram da primeira versão, aprovada
pelo Cesar em 02/10/2026; os do cockpit foram refeitos em 04/10/2026 (D79), com as telas do cockpit e um
slide por aba, como no post.

    node scripts/slides/capturar.mjs claude-code-csr-cockpit
    python3 scripts/slides/posts/claude-code-csr-cockpit.py
    python3 scripts/slides/conferir.py claude-code-csr-cockpit
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from estilo import *  # noqa: E402,F403

SLUG = "claude-code-csr-cockpit"
deck = Deck(SLUG, "Um mod do Claude Code na prática: instalação, testes e limites (parte 2 de 2)")
img = deck.imagem
EVID = f"src/evidencias/{SLUG}"
LIVRO = deck.livro["cor"]
T = dict(f=TEXTO, s=16, c=INK)
K, S_, P_, I_ = COD_CHAVE, COD_TEXTO, COD_PONTO, COD_NOME

# 1 ---------------------------------------------------------------- capa
s = deck.capa("Um mod do Claude Code na prática", "Instalação, testes e limites · parte 2 de 2",
              "A capa da parte 2: o Claude Code desenhado como um terminal com o painel aberto ao lado da conversa, "
              "e duas etiquetas de preço, US$ 0,04 e US$ 0,02, presas ao painel; o CLAUDE.md fica de fora, como "
              "texto para o modelo, e o mod desenha por dentro.")
deck.notas(s, "Um mod do Claude Code é um plugin com código que roda dentro do programa. Na prática, ele se instala a "
              "partir de um marketplace, não se atualiza sozinho, pode ser testado sem abrir uma sessão e tem limites "
              "que só aparecem no uso. O exemplo é o csr-cockpit, um painel ao lado da conversa que mostra o que a "
              "sessão está fazendo. O que é um mod e as peças que vieram antes estão na parte 1.")

# 2 ---------------------------------------------------------------- o cockpit
s = deck.slide("O cockpit")
deck.cabeca(s, "O csr-cockpit", "Um painel ao lado da conversa")
y = 1.9
for termo, defin in (("Agente", "O subagente: o ajudante que o Claude Code chama para cuidar de uma parte da tarefa."),
                     ("Turno", "Cada pedido feito na sessão, com tudo o que ele desencadeia.")):
    escrever(s, ML, y, 4.5, [termo], dict(f=UI, s=12.5, c=LIVRO, b=True), pitch=15)
    d = escrever(s, ML, y + 0.26, 4.45, [defin], T, pitch=22)
    y = d.fim + 0.3
escrever(s, ML, y + 0.08, 4.45,
         ["Sem um mod, o `/usage` mostra quanto a sessão inteira custou e, nos planos pagos, que fatia do uso foi "
          "para subagentes, em percentual.",
          "Quanto custou cada agente, ou cada turno, {nd:ele não diz}."], T, pitch=22, depois=9,
         marcas={"nd": "ondulado"})
# A aba Agentes, do alto até a legenda do grafo (os cartões ficam para o slide 4).
pic, iw, ih = imagem(s, img(f"{EVID}/aba-agentes.png"), 5.55, 1.9, w=LARG - (5.55 - ML), raio_px=24,
                     recorte=(0, 0, 0, 2224 - 990),
                     alt="O painel do csr-cockpit na aba Agentes, com uma sessão de exemplo: no alto, 2 agentes "
                         "rodando e 2 concluídos; embaixo, o grafo de quem chamou quem, com a conversa principal no "
                         "centro, um Explore e um Plan criados por ela, e um revisor e outro Explore criados pelo "
                         "Plan, com duas mensagens do Plan para o revisor e uma de volta.")
escrever(s, 5.55, 1.9 + ih + 0.14, LARG - (5.55 - ML),
         ["A aba Agentes: (1) as contagens e (2) o grafo de quem chamou quem. A tela sai do próprio mod, numa sessão "
          "de exemplo; as bolinhas numeradas apontam o que os próximos slides explicam."],
         dict(f=UI, s=11.5, c=INK2), pitch=15, nome="Legenda")
deck.notas(s, "Agente, aqui, é o subagente: o ajudante que o Claude Code chama para cuidar de uma parte da tarefa. "
              "Turno é cada pedido feito na sessão, com tudo o que ele desencadeia. Sem um mod, o /usage mostra o "
              "custo da sessão inteira e, nos planos pagos, a fatia dos subagentes em percentual; quanto custou cada "
              "agente, ou cada turno, ele não diz. O cockpit faz essa conta, e ela é uma estimativa dele. As telas "
              "saem do próprio mod, rodando uma sessão de exemplo numa loja online.")

# 3 ---------------------------------------------------------------- seis abas
s = deck.slide("O cockpit")
deck.cabeca(s, "O que o cockpit mostra", "Seis abas, seis perguntas")
escrever(s, ML, 1.5, LARG, ["O painel abre e fecha com `/cockpit`."],
         dict(f=TEXTO, s=16, c=INK2, i=True, codigo=dict(c=INK, i=False)), pitch=21)
ABAS = [("Agentes", "Quem está trabalhando agora, e quem chamou quem?",
         "os subagentes com o custo atribuído, o grafo de quem criou quem e a linha do tempo"),
        ("Diffs", "O que mudou, arquivo por arquivo?", "os arquivos alterados e o diff de cada um: da sessão, de um turno ou do git"),
        ("Contexto", "Quanto do contexto sobra, e quanto já custou?",
         "o percentual usado, o custo, o limite de uso e o contexto por categoria"),
        ("Turnos", "O que aconteceu, na ordem?", "um registro por pedido, com a duração, o custo e os comandos Bash"),
        ("Árvore", "Onde o Claude está mexendo agora?", "os arquivos lidos e editados, acesos enquanto a ferramenta roda"),
        ("Inventário", "O que está instalado, e o que está ligado?", "plugins, skills, comandos, agentes, hooks e MCP")]
fim_tab = tabela(s, ML, 2.02, LARG,
                 [("Aba", 1.95, dict(f=MONO, s=12.5, c=ACENTO)), ("A pergunta", 4.75, dict(f=TEXTO, s=14.5, c=INK, i=True)),
                  ("O que mostra", LARG - 0.25 - 1.95 - 4.75, dict(f=UI, s=11.5, c=INK2))],
                 [([(f"{k + 1}: ", {}), (aba, dict(c=INK, b=True))], perg, mostra) for k, (aba, perg, mostra) in enumerate(ABAS)])
escrever(s, ML, fim_tab + 0.22, LARG,
         ["Clicar no nome de um agente, de um comando Bash ou de um turno abre o detalhe: o pedido, as chamadas e a "
          "resposta."], dict(f=TEXTO, s=14.5, c=INK2), pitch=20)
deck.notas(s, "O painel abre e fecha com /cockpit e tem seis abas, e cada uma responde a uma pergunta: Agentes, Diffs, "
              "Contexto, Turnos, Árvore e Inventário. Clicar no nome de um agente, de um comando Bash ou de um turno "
              "abre o detalhe: o pedido, as chamadas e a resposta. Os próximos slides passam por cada aba.")


def lista(s, x, y, w, itens, pitch=19.5, tam=14):
    """Os números das bolinhas da tela e o que cada um aponta."""
    for n, txt in itens:
        elipse(s, x + 0.16, y + 0.15, 0.16, fundo=LIVRO)
        escrever(s, x, y + 0.035, 0.32, [str(n)], dict(f=UI, s=12, c=BRANCO, b=True), pitch=15, alinhar="c")
        d = escrever(s, x + 0.46, y, w - 0.46, [txt], dict(f=TEXTO, s=tam, c=INK, codigo=dict(c=INK)), pitch=pitch)
        y = d.fim + 0.2
    return y


def legenda(s, x, y, w, texto):
    escrever(s, x, y, w, [texto], dict(f=UI, s=11.5, c=INK2), pitch=15, nome="Legenda")


# 4 ---------------------------------------------------------------- agentes
s = deck.slide("As abas")
deck.cabeca(s, "Agentes", "Quem chamou quem, e quem está rodando")
pa, wa, ha = imagem(s, img(f"{EVID}/aba-agentes.png"), ML, 1.82, h=4.75, raio_px=24, recorte=(0, 990, 0, 0),
                    alt="A parte de baixo da aba Agentes: a linha do tempo dos quatro agentes, uma barra por agente na "
                        "mesma régua, e os cartões dos dois que estão rodando e dos dois concluídos, cada um com o "
                        "modelo, o contexto, o custo atribuído e as chamadas, e o link Ver detalhes.")
legenda(s, ML, 1.82 + ha + 0.1, wa, "A linha do tempo e os cartões da aba Agentes (tela do README do csr-cockpit).")
lx = ML + wa + 0.42
lw = W - MR - lx
d = escrever(s, lx, 1.86, lw,
             ["No grafo do slide anterior, a cor é o estado do agente, e a borda diz de onde vem a definição dele: "
              "tracejada para os globais, de `~/.claude/agents`. As mensagens do SendMessage aparecem com a contagem."],
             dict(f=TEXTO, s=14, c=INK2, codigo=dict(c=INK)), pitch=19.5)
lista(s, lx, d.fim + 0.3, lw,
      [(3, "**A linha do tempo:** uma barra por agente, na mesma régua; mostra quem rodou em paralelo e quem demorou."),
       (4, "**Os cartões:** a tarefa, o modelo, o contexto do agente, o custo atribuído e a ferramenta de agora."),
       (5, "**Ver detalhes** abre o detalhe. Clicar no agente do grafo ou no nome na linha do tempo faz o mesmo.")])
deck.notas(s, "Na aba Agentes, o grafo mostra quem chamou quem: a conversa principal no centro e os agentes em volta; "
              "quando um agente cria outro, o novo fica num anel de fora, e quando dois conversam pelo SendMessage, a "
              "mensagem aparece com a contagem. A linha do tempo mostra quem rodou em paralelo. Os cartões trazem o "
              "custo atribuído a cada agente, e Ver detalhes abre o detalhe dele.")

# 5 ---------------------------------------------------------------- quanto custou
s = deck.slide("As abas")
deck.cabeca(s, "Agentes e Turnos", "Quanto custou cada agente, e cada turno")
wa = 5.6
pa, wa, ha = imagem(s, img(f"{EVID}/detalhe-do-agente.png"), ML, 1.82, w=wa, raio_px=24,
                    alt="O detalhe do agente Plan no csr-cockpit: concluído em 41 segundos, com 3 chamadas, contexto de "
                        "25 mil tokens e custo atribuído de 18 centavos de dólar; embaixo, o pedido, as chamadas e a "
                        "resposta final.")
bx_ = ML + wa + 0.3
wt = W - MR - bx_
CT = 900  # o recorte da aba Turnos: do "Do mais recente" ao turno 3
pt_, wt, ht = imagem(s, img(f"{EVID}/aba-turnos.png"), bx_, 1.82, w=wt, raio_px=24, recorte=(0, CT, 0, 1954 - 1520),
                     alt="A lista da aba Turnos: o turno 5 em andamento, com o comando npm test rodando, e o turno 4, "
                         "que levou 52 segundos, custou 1 dólar e 23 centavos, usou 14 ferramentas e rodou 4 comandos "
                         "Bash, um deles com falha.")
# A caneta sobre as telas escuras usa a cor da caneta do tema escuro; as posições são pixels de cada tela.
ka = wa / 1736
circulo(s, cx=ML + (391 + 574) / 2 * ka, cy=1.82 + (520 + 552) / 2 * ka, rx=(574 - 391) / 2 * ka + 0.09,
        ry=(552 - 520) / 2 * ka + 0.07, cor=E_CANETA, lw=1.7, seed=21)
kt = wt / 1736
c11 = (bx_ + (369 + 478) / 2 * kt, 1.82 + ((1244 + 1276) / 2 - CT) * kt)
circulo(s, cx=c11[0], cy=c11[1], rx=(478 - 369) / 2 * kt + 0.09, ry=(1276 - 1244) / 2 * kt + 0.07, cor=E_CANETA,
        lw=1.7, seed=24)
# A nota embaixo da tela, à direita do círculo, e a seta subindo até ele.
ry11 = (1276 - 1244) / 2 * kt + 0.07
ny = 1.82 + ht + 0.2
nota(s, c11[0] + 0.3, ny, W - MR - c11[0] - 0.3, "o custo do turno: o fim menos o começo", tam=18)
seta(s, curva((c11[0] + 0.24, ny + 0.16), (c11[0] + 0.02, ny + 0.1), (c11[0], c11[1] + ry11 + 0.04)), ponta=0.07)
sy = 1.82 + max(ha, ht + 0.7) + 0.4
cw3 = (LARG - 2 * 0.3) / 3
for i, (valor, rotulo) in enumerate((("US$ 0,18", "o Plan: 41 s, 3 chamadas, 25 mil tokens de contexto"),
                                     ("US$ 0,37", "os quatro agentes juntos"),
                                     ("US$ 2,21", "a sessão inteira; US$ 1,84 ficaram com a conversa principal"))):
    numero_grande(s, ML + i * (cw3 + 0.3), sy, cw3, valor, rotulo, cor=LIVRO if i < 2 else INK)
deck.notas(s, "Cada agente aparece com o custo atribuído a ele, e o detalhe mostra o pedido, as chamadas e a resposta: "
              "na sessão das imagens, o agente Plan ficou com US$ 0,18, e os quatro agentes, com US$ 0,37. Na aba "
              "Turnos, cada pedido aparece com o que custou e o que desencadeou. O custo do turno também é conta do "
              "cockpit: quanto o custo da sessão subiu do começo ao fim do pedido. A sessão inteira custou US$ 2,21; "
              "o que não foi para agente nenhum é o gasto da conversa principal.")

# 6 ---------------------------------------------------------------- diffs
s = deck.slide("As abas")
deck.cabeca(s, "Diffs", "O que mudou, arquivo por arquivo")
pa, wa, ha = imagem(s, img(f"{EVID}/aba-diffs.png"), ML, 1.82, w=6.9, raio_px=24,
                    alt="A aba Diffs do csr-cockpit: as fontes Sessão, Turno e Git; à esquerda, os arquivos alterados "
                        "numa árvore, o carrinho.ts selecionado; à direita, o diff dele, com os números de linha, a "
                        "linha que saiu em vermelho, as que entraram em verde e a palavra que mudou em destaque.")
legenda(s, ML, 1.82 + ha + 0.1, wa, "A aba Diffs, como a visão de alterações do VS Code (tela do README do csr-cockpit).")
lx = ML + wa + 0.42
lista(s, lx, 1.9, W - MR - lx,
      [(1, "**A fonte:** as edições do Claude na sessão, as de um turno ou a árvore de trabalho contra o último commit."),
       (2, "**Os arquivos** numa árvore, com a letra do status do git e as linhas somadas."),
       (3, "**O diff**, desenhado como o do próprio Claude Code: números de linha, verde e vermelho e a palavra que "
           "mudou em destaque.")])
deck.notas(s, "A aba Diffs mostra o que mudou, arquivo por arquivo, como a visão de alterações do VS Code. A fonte é uma "
              "de cada vez: as edições do Claude na sessão, as de um turno só ou a árvore de trabalho contra o último "
              "commit, que inclui o que os comandos e a própria pessoa mudaram. À esquerda, os arquivos; à direita, o "
              "diff do escolhido.")

# 7 ---------------------------------------------------------------- contexto
s = deck.slide("As abas")
deck.cabeca(s, "Contexto", "Quanto do contexto sobra, e quanto custou")
pa, wa, ha = imagem(s, img(f"{EVID}/aba-contexto.png"), ML, 1.82, h=4.75, raio_px=24,
                    alt="A aba Contexto do csr-cockpit: um anel com 71% do contexto usado e mais 8,3 mil tokens no "
                        "último turno; o custo da sessão, de 2 dólares e 21 centavos; os limites de uso de 5 horas e de "
                        "7 dias; o contexto repartido por categoria; e o botão Contagem exata.")
kc = wa / 1736
circulo(s, cx=ML + (96 + 280) / 2 * kc, cy=1.82 + (1344 + 1374) / 2 * kc, rx=(280 - 96) / 2 * kc + 0.1,
        ry=(1374 - 1344) / 2 * kc + 0.07, cor=E_CANETA, lw=1.7, seed=31)
legenda(s, ML, 1.82 + ha + 0.1, wa, "A aba Contexto (tela do README do csr-cockpit).")
lx = ML + wa + 0.42
lista(s, lx, 1.9, W - MR - lx,
      [(1, "**O uso do contexto:** o percentual, os tokens e quanto o último turno somou."),
       (2, "**O custo** da sessão e do último turno."),
       (3, "**O limite de uso** do plano, cada janela com o percentual e quando renova."),
       (4, "**O contexto por categoria:** uma estimativa local, atualizada a cada turno."),
       (5, "**Contagem exata** troca a estimativa pela contagem de verdade, com requisições a mais.")])
deck.notas(s, "A aba Contexto responde quanto do contexto sobra e quanto a sessão já custou: o percentual, os tokens, o "
              "custo da sessão e do último turno, o limite de uso do plano e o contexto repartido por categoria, uma "
              "estimativa local. O botão Contagem exata troca a estimativa pela contagem de verdade; apertado, o "
              "Claude Code faz requisições a mais.")

# 8 ---------------------------------------------------------------- turnos
s = deck.slide("As abas")
deck.cabeca(s, "Turnos", "O que aconteceu, na ordem")
pa, wa, ha = imagem(s, img(f"{EVID}/aba-turnos.png"), ML, 1.82, h=4.75, raio_px=24, recorte=(0, 0, 0, 1954 - 1440),
                    alt="A aba Turnos do csr-cockpit: um gráfico com a duração de cada turno, o quarto em vermelho por "
                        "ter tido uma falha; as ferramentas mais chamadas; o turno 5 em andamento, num cartão, com o "
                        "comando npm test rodando; e o turno 4, com os comandos Bash dele.")
legenda(s, ML, 1.82 + ha + 0.1, wa, "A aba Turnos (tela do README do csr-cockpit).")
lx = ML + wa + 0.42
lista(s, lx, 1.9, W - MR - lx,
      [(1, "**A duração de cada turno:** roxo concluído, vermelho com falha, azul em andamento."),
       (2, "**As ferramentas** mais chamadas na sessão."),
       (3, "**O turno em andamento**, num cartão, com o que ele já usou."),
       (4, "**Os comandos Bash** ficam no turno em que rodaram, com o estado e o exit code."),
       (5, "**Ver todos** abre o detalhe do turno: as ferramentas, os comandos, o pedido e a resposta.")])
deck.notas(s, "Na aba Turnos, cada pedido aparece com a duração, o contexto somado, o custo e o que desencadeou. No alto, "
              "a duração de cada turno numa barra e as ferramentas mais chamadas. Os comandos Bash ficam no turno em "
              "que rodaram, com o estado e o exit code, e o detalhe do turno lista todos, com o pedido e a resposta.")

# 9 ---------------------------------------------------------------- árvore
s = deck.slide("As abas")
deck.cabeca(s, "Árvore", "Onde o Claude está mexendo agora")
pa, wa, ha = imagem(s, img(f"{EVID}/aba-arvore.png"), ML, 1.82, w=6.9, raio_px=24,
                    alt="A aba Árvore do csr-cockpit: a linha que explica a aba e o ramo main; os botões Atualizar, "
                        "Projeto inteiro, Expandir tudo e Recolher tudo; o arquivo frete.test.ts sendo editado agora; "
                        "e a árvore de pastas, com ele aceso com o selo editando e a letra do git de cada arquivo.")
legenda(s, ML, 1.82 + ha + 0.1, wa, "A aba Árvore, com o arquivo que está sendo escrito aceso (tela do README do csr-cockpit).")
lx = ML + wa + 0.42
lista(s, lx, 1.9, W - MR - lx,
      [(1, "**O que a aba mostra:** os arquivos lidos ou editados na sessão e os que o git vê alterados."),
       (2, "**Os botões:** ler o git de novo, ver o projeto inteiro, expandir e recolher."),
       (3, "**Agora mesmo:** o arquivo que uma ferramenta está lendo ou escrevendo, e quem."),
       (4, "**Na árvore**, o mesmo arquivo acende com o selo `editando…` e fica destacado por 8 segundos.")])
deck.notas(s, "A aba Árvore mostra onde o Claude está mexendo agora: os arquivos que a sessão leu ou editou, do loop "
              "principal e dos subagentes, e os que o git vê alterados. Enquanto uma leitura ou uma escrita roda, o "
              "arquivo aparece no alto e acende na árvore; uma escrita esperando permissão fica acesa até a resposta.")

# 10 --------------------------------------------------------------- inventário
s = deck.slide("As abas")
deck.cabeca(s, "Inventário", "O que está instalado, e o que está ligado")
pa, wa, ha = imagem(s, img(f"{EVID}/aba-inventario.png"), ML, 1.82, w=6.9, raio_px=24,
                    alt="A aba Inventário do csr-cockpit: as seções com as contagens, o filtro e dois plugins, o "
                        "csr-cockpit, ativo, e o warp, inativo, cada um com a descrição e o que traz.")
legenda(s, ML, 1.82 + ha + 0.1, wa, "A aba Inventário (tela do README do csr-cockpit).")
lx = ML + wa + 0.42
lista(s, lx, 1.9, W - MR - lx,
      [(1, "**As seções:** plugins, skills, comandos, agentes, hooks, MCP, outros e o que há para instalar."),
       (2, "**O filtro**, por nome, origem ou descrição."),
       (3, "**Ativo** ou (4) **inativo:** cada peça com a origem, a descrição e o que ela traz.")])
deck.notas(s, "A aba Inventário lista o que está instalado e o que está ligado nesta sessão, sem gastar tokens: plugins, "
              "skills, comandos, agentes, hooks e servidores MCP, cada um ativo ou inativo, com a origem e a descrição. "
              "Ativo quer dizer, por exemplo, plugin habilitado ou servidor MCP conectado.")

# 11 --------------------------------------------------------------- a linha de resumo
s = deck.slide("As abas")
deck.cabeca(s, "A linha de resumo", "Uma faixa acima do prompt")
pic, iw, ih = imagem(s, img(f"{EVID}/linha-de-resumo.png"), ML, 2.05, w=9.2, raio_px=18,
                     alt="A linha de resumo do csr-cockpit no aplicativo de desktop, em duas fileiras de pílulas: a "
                         "marca CSR, a conversa principal trabalhando, 2 agentes em paralelo, o repositório proj no ramo "
                         "main, o contexto em 71%, o custo de 2 dólares e 21 centavos, os limites de 5 horas e de 7 "
                         "dias, o modelo Opus 5.5 e o cache em 99%.")
legenda(s, ML, 2.05 + ih + 0.1, 9.2, "A linha de resumo no aplicativo de desktop (tela do README do csr-cockpit).")
escrever(s, ML, 2.05 + ih + 0.75, 8.6,
         ["Fica ali com o painel aberto ou fechado. Não é a linha de status do rodapé, que é outra peça do Claude Code.",
          "O que está vivo vem primeiro: a conversa principal trabalhando e os agentes em paralelo. Depois, o "
          "repositório e as medidas.",
          "No aplicativo de desktop, clicar no repositório ou no contexto abre a aba que fala dele."],
         dict(f=TEXTO, s=16, c=INK), pitch=22, depois=10)
deck.notas(s, "Acima do prompt, a caixa onde se digita o pedido, o cockpit desenha uma faixa, a linha de resumo, que "
              "fica ali com o painel aberto ou fechado. Ela não é a linha de status do rodapé. No aplicativo de "
              "desktop, ela é uma fileira de pílulas, e clicar no repositório ou no contexto abre a aba que fala dele.")

# 12 --------------------------------------------------------------- só observar (escuro)
s = deck.slide("O cockpit", escuro=True)
deck.cabeca(s, "Só observa", "A regra do cockpit é só observar.", escuro=True, tam=38, y=1.22,
            w=LARG - 0.6)
s.shapes.title.left = Inches(ML + 0.3)
d = escrever(s, ML + 0.3, 2.02, LARG - 0.9,
             ["Nenhum hook do cockpit bloqueia ou altera uma chamada de ferramenta ou uma resposta do modelo: o evento "
              "passa adiante como chegou, e o resultado volta como veio."], dict(f=TEXTO, s=19, c=E_INK2), pitch=27)
moldura(s, ML + 0.02, 0.98, LARG - 0.04, d.fim - 0.98 + 0.32, cor=E_CANETA, lw=1.6)
ZEROS = [("0", "chamadas de rede", "Na máquina, só comandos de leitura do git e o arquivo antigo antes de uma escrita.", {}),
         ("2", "arquivos gravados", "Um registro de erros e o diagnóstico de cliques, quando ligado; o resto some com a sessão.", {}),
         ("0", "tokens gastos", "O mod não chama o modelo. A exceção é o botão\n“{ce:Contagem exata}”: apertado, o Claude "
                                "Code faz requisições a mais.", {"ce": "circulo"})]
zy = d.fim + 0.85
zw = (LARG - 2 * 0.45) / 3
for i, (num_, rot_, txt, mk) in enumerate(ZEROS):
    zx = ML + 0.3 + i * (zw + 0.45)
    escrever(s, zx, zy, 1.0, [num_], dict(f=TITULO, s=64, c=E_INK, b=True), pitch=70)
    escrever(s, zx + 0.72, zy + 0.38, zw - 0.75, [rot_], dict(f=UI, s=16, c=E_INK, b=True), pitch=19)
    escrever(s, zx, zy + 1.18, zw - 0.25, [txt], dict(f=TEXTO, s=14, c=E_INK2), pitch=20, marcas=mk, caneta=E_CANETA)
deck.notas(s, "A regra do cockpit é só observar. Um mod liga funções aos eventos do Claude Code, e a documentação "
              "chama cada uma de hook; nenhum hook do cockpit bloqueia ou altera uma chamada de ferramenta ou uma "
              "resposta do modelo. Ele não faz chamada de rede: na máquina, roda só comandos de leitura do git e lê o "
              "conteúdo antigo de um arquivo antes de uma escrita. Grava dois arquivos, só ali: um registro de erros e "
              "o diagnóstico de cliques. O mod não chama o modelo; a exceção é o botão Contagem exata.")

# 13 --------------------------------------------------------------- marketplace
s = deck.slide("Instalar")
deck.cabeca(s, "Como instalar: o marketplace", "Um repositório com um `marketplace.json`")
d = escrever(s, ML, 1.9, 4.75,
             ["O arquivo fica na pasta `.claude-plugin/` e tem três campos obrigatórios: `name`, `owner` e `plugins`.",
              "Cada entrada de `plugins` é um item instalável, com um `name` e um {src:`source`}: a pasta dele dentro "
              "do repositório."], dict(f=TEXTO, s=15.5, c=INK), pitch=22, depois=10, marcas={"src": "caixa"})
y = d.fim + 0.35
for esq, dir_, cor, txt in (
        ("plugin completo", "csr-cockpit", PETROLEO,
         "A pasta `plugins/csr-cockpit` tem o seu `.claude-plugin/plugin.json`, o manifesto que descreve o plugin."),
        ("peça avulsa", "explicar-erro", AZUL,
         "Não há `plugin.json`: a própria entrada faz o papel de manifesto e diz o que a pasta traz, no campo "
         "`skills`.")):
    ty = ficha(s, ML, y, 4.75, 1.4, esq, dir_, cor)
    escrever(s, ML + 0.22, ty + 0.17, 4.3, [txt], dict(f=TEXTO, s=13.5, c=INK2, codigo=dict(c=INK)), pitch=19)
    y += 1.4 + 0.2
JSON = [[("{", P_)],
        [("  ", I_), ('"name"', K), (": ", P_), ('"cesarschutz"', S_), (",", P_)],
        [("  ", I_), ('"owner"', K), (": { ", P_), ('"name"', K), (": ", P_), ('"Cesar Schutz"', S_), (" },", P_)],
        [("  ", I_), ('"plugins"', K), (": [", P_)],
        [("    {", P_)],
        [("      ", I_), ('"name"', K), (": ", P_), ('"csr-cockpit"', S_), (",", P_)],
        [("      ", I_), ('"source"', K), (": ", P_), ('"./plugins/csr-cockpit"', S_), (",", P_)],
        [("      ", I_), ('"description"', K), (": ", P_), ('"Mod: painel ao lado da conversa..."', S_)],
        [("    },", P_)],
        [("    {", P_)],
        [("      ", I_), ('"name"', K), (": ", P_), ('"explicar-erro"', S_), (",", P_)],
        [("      ", I_), ('"source"', K), (": ", P_), ('"./skills/explicar-erro"', S_), (",", P_)],
        [("      ", I_), ('"description"', K), (": ", P_), ('"Exemplo de skill: explica um erro..."', S_), (",", P_)],
        [("      ", I_), ('"skills"', K), (": [", P_), ('"./"', S_), ("]", P_)],
        [("    }", P_)],
        [("  ]", P_)],
        [("}", P_)]]
cx = ML + 5.15
c = codigo(s, cx, 1.85, W - MR - cx, ".claude-plugin/marketplace.json", JSON, tam=12, pitch=17.5, destaque=13)
ly = c["topo"] + 13 * c["pin"]
fim14 = c["texto_x"] + larg('      "skills": ["./"]', MONO, 12)
nx = fim14 + 0.95
nota(s, nx, ly + c["pin"] + 0.12, W - MR - nx - 0.15, "é este campo que dispensa o plugin.json", tam=20, pitch=21)
seta(s, curva((nx - 0.08, ly + c["pin"] + 0.3), (fim14 + 0.3, ly + c["pin"] + 0.3), (fim14 + 0.12, ly + c["pin"] * 0.62)))
deck.notas(s, "Um mod se instala como qualquer plugin, a partir de um marketplace: um repositório com um arquivo "
              ".claude-plugin/marketplace.json, de três campos obrigatórios, name, owner e plugins. Cada entrada de "
              "plugins é um item instalável, com um name e um source, a pasta dele no repositório. Este é um pedaço "
              "do catálogo do claude-code-kit, com as descrições encurtadas. A primeira entrada é um plugin completo; "
              "a segunda é uma peça avulsa, e é o campo skills que dispensa o plugin.json.")

# 14 --------------------------------------------------------------- dois nomes, dois comandos
s = deck.slide("Instalar")
deck.cabeca(s, "Como instalar: o marketplace", "Dois nomes, dois comandos")
d = escrever(s, ML, 1.95, LARG,
             ["O nome do repositório e o nome do marketplace são coisas diferentes. O repositório se chama "
              "`claude-code-kit`, e o marketplace, {cx:`cesarschutz`}.",
              "O primeiro aparece na hora de cadastrar; o segundo, na hora de instalar:"],
             dict(f=TEXTO, s=19, c=INK, codigo=dict(c=INK)), pitch=27, depois=8, marcas={"cx": "caixa"})
c = codigo(s, ML, d.fim + 0.35, LARG, "Terminal",
           [[("claude plugin marketplace add ", I_), ("cesarschutz/claude-code-kit", S_)],
            [("claude plugin install ", I_), ("csr-cockpit@cesarschutz", S_)]], tam=17, pitch=27)
base1 = c["topo"] + c["pin"] - 0.205 * 17 / 72
base2 = base1 + c["pin"]
x1a = c["texto_x"] + larg("claude plugin marketplace add ", MONO, 17)
x1b = x1a + larg("cesarschutz/claude-code-kit", MONO, 17)
x2a = c["texto_x"] + larg("claude plugin install csr-cockpit@", MONO, 17)
x2b = x2a + larg("cesarschutz", MONO, 17)
sublinhado(s, x1a + 0.02, x1a + larg("cesarschutz/", MONO, 17) + larg("claude-code-kit", MONO, 17) - 0.02, base1 + 0.07)
caixa(s, x=x2a - 0.01, y=base2 - 0.21, w=x2b - x2a + 0.06, h=0.29)
nota(s, x1b + 0.4, base1 - 0.25, 3.0, "o repositório", tam=20)
nota(s, x2b + 0.4, base2 - 0.25, 3.0, "o marketplace", tam=20)
postit(s, W - MR - 3.3, c["y"] + c["h"] + 0.35, 3.2, 1.3,
       "Se o `/cockpit` não aparecer depois de instalar, confira a versão: o mod pede o Claude Code 2.1.287 ou mais novo.",
       rot=1.8, tam=18.5)
deck.notas(s, "O nome do repositório e o nome do marketplace são coisas diferentes. O repositório se chama "
              "claude-code-kit, e o marketplace, cesarschutz. O primeiro aparece na hora de cadastrar, no marketplace "
              "add; o segundo, na hora de instalar, depois da arroba. Se o /cockpit não aparecer depois de instalar, "
              "vale conferir a versão: o mod pede o Claude Code 2.1.287 ou mais novo.")

# 15 --------------------------------------------------------------- a figura em passos
s = deck.slide("Instalar")
deck.cabeca(s, "Como instalar: o marketplace", "Instalar e atualizar, em seis passos")
pic, iw, ih = imagem(s, img("passos-1.png"), ML, 1.82, h=4.95, raio_px=20,
                     alt="A figura em passos da instalação, no quadro final: o repositório no GitHub com o catálogo e a "
                         "pasta do plugin, o catálogo clonado na máquina com o nome cesarschutz, o plugin instalado e "
                         "a sessão aberta, e o caminho de cada versão, da 1.0.0 à 1.1.0.")
PASSOS = [(ROXO, "O repositório no GitHub guarda o catálogo e a pasta do plugin, na `version` 1.0.0."),
          (AZUL, "O `marketplace add` clona o catálogo para a sua máquina, com o nome `cesarschutz`."),
          (PETROLEO, "O `install` copia a pasta do plugin na versão do catálogo: 1.0.0."),
          (ROXO, "Commits novos chegam ao repositório, mas o `version` não sobe: na máquina, nada muda."),
          (PETROLEO, "O `version` sobe para 1.1.0, e o `update` renova o catálogo e copia a pasta nova."),
          (AMBAR, "A sessão aberta segue na 1.0.0 até o `/reload-plugins` carregar a 1.1.0.")]
px = ML + iw + 0.45
y = 1.86
for i, (cor, txt) in enumerate(PASSOS):
    elipse(s, px + 0.17, y + 0.15, 0.165, fundo=cor)
    escrever(s, px, y + 0.035, 0.34, [str(i + 1)], dict(f=UI, s=12.5, c=BRANCO, b=True), pitch=15, alinhar="c")
    d = escrever(s, px + 0.5, y, W - MR - px - 0.5, [txt], dict(f=TEXTO, s=14, c=INK, codigo=dict(c=INK)), pitch=19.5)
    y = d.fim + 0.2
d = escrever(s, px + 0.5, y + 0.15, W - MR - px - 0.5,
             ["O Claude Code só vê atualização quando a versão muda. Com o campo `version` no `plugin.json`, vale esse "
              "número; sem ele, que é o caso das peças avulsas, a versão é o commit."],
             dict(f=UI, s=12, c=INK2, codigo=dict(c=INK)), pitch=16)
escrever(s, px + 0.05, y + 0.05, 0.3, ["!"], dict(f=MAO, s=32, c=CANETA, b=True), pitch=32, alinhar="c")
deck.notas(s, "A instalação e a atualização seguem seis passos, do repositório no GitHub à sessão aberta na máquina. O "
              "marketplace add clona o catálogo, com o nome cesarschutz. O install copia a pasta do plugin na versão "
              "do catálogo. Commits novos não chegam a quem instalou enquanto o version não sobe; quando sobe, o "
              "update traz a pasta nova, e a sessão aberta segue na versão antiga até o /reload-plugins. Sem o campo "
              "version, a versão é o commit.")

# 16 --------------------------------------------------------------- os comandos
s = deck.slide("Instalar")
deck.cabeca(s, "Os comandos de plugin", "Instalar, conferir, atualizar e testar")
CMDS = [("claude plugin ", "marketplace add <dono>/<repo>", "cadastra um marketplace de um repositório do GitHub"),
        ("claude plugin ", "install <item>@<marketplace>", "instala um item do catálogo"),
        ("claude plugin ", "list", "lista o que está instalado, com a versão e o estado"),
        ("claude plugin ", "details <item>", "mostra as peças e o custo delas em tokens"),
        ("claude plugin ", "marketplace update <marketplace>", "renova o catálogo, sem mexer no que está instalado"),
        ("claude plugin ", "update <item>@<marketplace>", "atualiza para a versão mais nova do catálogo"),
        ("claude plugin ", "uninstall <item>@<marketplace>", "remove o plugin"),
        ("claude plugin ", "validate <pasta>", "confere o manifesto e as peças; com `--strict`, aviso vira erro"),
        ("claude plugin ", "test <pasta>", "roda os testes de um mod"),
        ("claude ", "--plugin-dir <pasta>", "abre uma sessão com o plugin de uma pasta local, sem instalar")]
fx, fy, fw_ = ML, 1.8, 7.85
lh = 0.445
topo = fy + 0.62 + 0.06
ficha_pautada(s, fx, fy, fw_, 0.68 + len(CMDS) * lh + 0.1, "No terminal",
              [topo + (k + 1) * lh for k in range(len(CMDS) - 1)])
for k, (prefixo, cmd, txt) in enumerate(CMDS):
    ry = topo + k * lh
    d = diagramar(fx + 0.26, ry + 0.13, 4.4, [prefixo + cmd], dict(f=MONO, s=11, c=INK), pitch=14)
    d.pars[0]["linhas"] = [[dict(f=MONO, s=11, c=INK3, t=prefixo), dict(f=MONO, s=11, c=INK, t=cmd)]]
    colocar(s, d)
    dd = diagramar(fx + 4.62, 0, fw_ - 4.62 - 0.22, [txt], dict(f=UI, s=11.5, c=INK2, codigo=dict(c=INK)), pitch=14)
    dd.y = ry + (lh - dd.altura) / 2 + 0.005
    colocar(s, dd)
fx2, fw2 = ML + fw_ + 0.3, LARG - fw_ - 0.3
SESS = [("/plugin", "abre a tela de plugins e marketplaces"), ("/reload-plugins", "aplica na sessão aberta o que mudou"),
        ("/cockpit", "abre e fecha o painel do csr-cockpit")]
lh2 = 0.6
topo2 = fy + 0.62 + 0.04
ficha_pautada(s, fx2, fy, fw2, 0.66 + len(SESS) * lh2 + 0.08, "Dentro da sessão",
              [topo2 + (k + 1) * lh2 for k in range(len(SESS) - 1)])
for k, (cmd, txt) in enumerate(SESS):
    ry = topo2 + k * lh2
    escrever(s, fx2 + 0.26, ry + 0.08, fw2 - 0.4, [f"`{cmd}`"], dict(f=UI, s=11.5, c=INK2, codigo=dict(s=11.5, c=INK)),
             pitch=14)
    escrever(s, fx2 + 0.26, ry + 0.32, fw2 - 0.4, [txt], dict(f=UI, s=11.5, c=INK2), pitch=14)
postit(s, fx2 + 0.12, 4.7, fw2 - 0.25, 1.5,
       "Num marketplace de terceiros, a atualização automática vem desligada: o `update` fica por conta de quem "
       "instalou.", rot=1.6, tam=19.5)
deck.notas(s, "Estes são os comandos para instalar, conferir, atualizar e testar um plugin; o resto está na "
              "referência dos comandos de plugin. O validate confere o manifesto e as peças, e com --strict os avisos "
              "viram erro. O test roda os testes de um mod. E o --plugin-dir abre uma sessão com o plugin de uma "
              "pasta local, sem instalar: a cópia local ganha da instalada. Num marketplace de terceiros, a "
              "atualização automática vem desligada (vale em out/2026).")

# 17 --------------------------------------------------------------- como se testa
s = deck.slide("Testes e limites")
deck.cabeca(s, "Como se testa um mod", "Três camadas, da mais barata à mais cara")
CAMADAS = [("camada 1", "sem executar nada", "claude plugin validate",
            ["Confere o manifesto e lista os eventos que o mod escuta e as chamadas que faz à API dos mods.",
             "{au:Serve para auditar o mod de outra pessoa antes de instalar.}",
             "No cockpit, a lista não tem rede; os processos são só o git, de leitura, e as gravações, só os dois "
             "registros."], {"au": "grifo"}),
           ("camada 2", "sem login e sem rede", "claude plugin test",
            ["Roda os testes contra um Claude Code de mentira: dispara os eventos, monta o painel, aperta os botões e "
             "confere o que foi desenhado.",
             "O cockpit tem 35 testes; um deles confere a regra de só observar."], {}),
           ("camada 3", "a mais cara", "uma sessão de verdade",
            ["O Claude Code num projeto de exemplo, com o mod carregado por `claude --plugin-dir`.",
             "A pasta fica vigiada: o mod recarrega a cada arquivo salvo.",
             "É a única camada que mostra o painel desenhado no terminal."], {})]
kw = (LARG - 2 * 0.32) / 3
KH = 4.55
for i, (esq, dir_, cmd, pars, mk) in enumerate(CAMADAS):
    kx = ML + i * (kw + 0.32)
    ty = ficha(s, kx, 1.9, kw, KH, esq, dir_, LIVRO)
    est_cmd = dict(f=MONO, s=13.5, c=ACENTO, b=True) if i < 2 else dict(f=UI, s=15, c=INK, b=True)
    d = escrever(s, kx + 0.25, ty + 0.25, kw - 0.5, [cmd], est_cmd, pitch=18)
    escrever(s, kx + 0.25, d.fim + 0.22, kw - 0.5, pars, dict(f=TEXTO, s=14, c=INK2, codigo=dict(c=INK)), pitch=19.5,
             depois=9, marcas=mk)
carimbo(s, ML + (kw + 0.32) + 0.25, 1.9 + KH - 0.95, kw - 0.5, "rodado em 04/10/2026: 35 de 35")
deck.notas(s, "Um mod se testa em três camadas, da mais barata para a mais cara. O validate lista os eventos que o mod "
              "escuta e as chamadas que ele faz, sem executar nada, e serve para auditar o mod de outra pessoa antes "
              "de instalar. O test roda os testes contra um Claude Code de mentira, sem login e sem rede: o cockpit "
              "tem 35 testes, e os 35 passaram em 04/10/2026. A sessão de verdade, com o --plugin-dir, é a única que "
              "mostra o painel desenhado no terminal.")

# 18 --------------------------------------------------------------- os limites
s = deck.slide("Testes e limites")
deck.cabeca(s, "Os limites do csr-cockpit", "Os limites da versão 1.0.0")
lw17 = 6.35
d = escrever(s, ML, 1.95, lw17, ["{mk:O custo por agente não é um número oficial.}"],
             dict(f=TITULO, s=25, c=INK, b=True), pitch=31, marcas={"mk": "marca"})
escrever(s, ML, d.fim + 0.3, lw17,
         ["O Claude Code informa o custo da sessão inteira. Ao fim de cada resposta do modelo, o cockpit vê quanto ele "
          "subiu e põe a diferença na conta de quem respondeu, um agente ou a conversa principal. Nada é contado "
          "duas vezes.",
          "Se duas respostas terminam no mesmo instante, uma fração pode cair no agente vizinho.",
          "O valor em dólar é uma estimativa a preço de tabela. Para quem paga assinatura, {nc:ele não é cobrança}: "
          "serve para comparar um agente com outro."], dict(f=TEXTO, s=14.5, c=INK), pitch=21, depois=10,
         marcas={"nc": "duplo"})
fx = ML + lw17 + 0.45
fw17 = W - MR - fx
LIMITES = [("Não há custo por comando Bash.", "O Bash aparece com o status e a duração."),
           ("O raciocínio interno não aparece.", "O detalhe mostra só o texto que o agente escreveu."),
           ("O código de saída do Bash não é um campo.", "Na falha, o cockpit o tira do texto de erro."),
           ("A API de mods ainda pode mudar.", "De uma versão para outra."),
           ("No desktop, depende da versão.", "Em 04/10/2026, a versão 2.19675.0 do app já roda o cockpit.")]
lh3 = 0.84
topo3 = 1.85 + 0.62 + 0.05
ficha_pautada(s, fx, 1.85, fw17, 0.67 + len(LIMITES) * lh3 + 0.06, "Os outros limites",
              [topo3 + (k + 1) * lh3 for k in range(len(LIMITES) - 1)])
for k, (a, b) in enumerate(LIMITES):
    ry = topo3 + k * lh3
    escrever(s, fx + 0.26, ry + 0.14, fw17 - 0.45, [a], dict(f=UI, s=13, c=INK, b=True), pitch=16)
    escrever(s, fx + 0.26, ry + 0.44, fw17 - 0.45, [b], dict(f=TEXTO, s=12.5, c=INK2), pitch=16)
deck.notas(s, "Os limites são da versão 1.0.0, em 04/10/2026. O mais importante: o custo por agente não é um número "
              "oficial. O Claude Code informa o custo da sessão inteira, e o cockpit reparte: na sessão das imagens, "
              "os quatro agentes ficaram com US$ 0,37 dos US$ 2,21. O valor em dólar é uma estimativa a preço de "
              "tabela, que não é cobrança para quem paga assinatura. No aplicativo de desktop, depende da versão "
              "que ele traz: em 02/10/2026 ele ainda não rodava mods; em 04/10/2026, a versão 2.19675.0 já roda o "
              "cockpit.")

# 19 --------------------------------------------------------------- o repositório
s = deck.slide("O repositório")
deck.cabeca(s, "O repositório claude-code-kit", "O `claude-code-kit`: público, com licença MIT")
escrever(s, ML, 1.47, LARG, ["github.com/cesarschutz/claude-code-kit"], dict(f=MONO, s=13, c=ACENTO), pitch=17,
         nome="Endereço do repositório")
escrever(s, ML, 2.15, 6.5, ["Em 04/10/2026, ele tem:"], dict(f=TEXTO, s=17, c=INK2), pitch=22)
y0_ = 2.7
d = escrever(s, ML + 0.3, y0_, 6.6,
             ["o `csr-cockpit`, na versão 1.0.0;",
              "o `exemplos`, um plugin com uma skill, um agente, um hook e um estilo de saída;",
              "sete peças avulsas: duas skills, dois agentes, um estilo de saída, um tema e um hook."],
             dict(f=TEXTO, s=19, c=INK, codigo=dict(c=INK)), pitch=26, depois=10)
yy = y0_
for par in d.pars:
    escrever(s, ML + 0.02, yy, 0.25, ["–"], dict(f=TEXTO, s=19, c=INK3), pitch=26)
    yy += len(par["linhas"]) * par["pitch"] / 72 + par["depois"] / 72
chave(s, ML + 0.3 + 6.65, y0_ + 0.02, d.fim + 0.02)
nota(s, ML + 0.3 + 6.65 + 0.26, (y0_ + d.fim) / 2 - 0.2, 2.6, "cada linha instala sozinha", tam=21)
escrever(s, ML, d.fim + 0.5, LARG,
         ["O `README.md` explica o catálogo, e o `CONTRIBUTING.md`, como acrescentar um item. O repositório vai "
          "continuar recebendo peças."], dict(f=TEXTO, s=15, c=INK2, codigo=dict(c=INK)), pitch=21)
deck.notas(s, "O claude-code-kit é público, com licença MIT. Em 04/10/2026, tem o csr-cockpit, na versão 1.0.0, o "
              "plugin exemplos, com uma skill, um agente, um hook e um estilo de saída, e sete peças avulsas; cada "
              "uma se instala sozinha. O README explica o catálogo, e o CONTRIBUTING, como acrescentar um item.")

# 20 --------------------------------------------------------------- fecho
deck.fecho("A parte 1 e as fontes",
           "O que é um mod e as peças do Claude Code que vieram antes dele estão na parte 1. As fontes completas, "
           "com os links, estão no fim do post.",
           recomendacao="A **parte 1** explica o que é um mod e as peças que vieram antes dele: `CLAUDE.md`, hooks, "
                        "skills e plugins.",
           enderecos=["blog.cesarschutz.com.br/posts/claude-code-do-claude-md-ao-mod",
                      "github.com/cesarschutz/claude-code-kit"],
           fontes=["Claude: Claude Code mods (o anúncio, 01/10/2026)",
                   "Claude Code: Mods overview, Create a mod e Test a mod",
                   "Claude Code: Create a marketplace e Marketplace reference",
                   "Claude Code: Install and manage plugins, Plugin loading reference e Plugin commands reference",
                   "Claude Code: Manage costs effectively",
                   "Cesar Schutz: o claude-code-kit e o README do csr-cockpit"])

deck.salvar()
