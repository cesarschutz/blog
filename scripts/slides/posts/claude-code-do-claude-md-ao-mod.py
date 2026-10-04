"""A apresentação da parte 1 do post dos mods (D74): "Mods do Claude Code — o que são e as peças que vieram
antes (parte 1 de 2)". A primeira versão, feita para o post único e aprovada pelo Cesar em 02/10/2026, foi
dividida com o post: o cockpit, o marketplace, os testes e os limites estão na parte 2
(`claude-code-csr-cockpit.py`).

    node scripts/slides/capturar.mjs claude-code-do-claude-md-ao-mod
    python3 scripts/slides/posts/claude-code-do-claude-md-ao-mod.py
    python3 scripts/slides/conferir.py claude-code-do-claude-md-ao-mod
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from estilo import *  # noqa: E402,F403

deck = Deck("claude-code-do-claude-md-ao-mod", "Mods do Claude Code: o que são e as peças que vieram antes (parte 1 de 2)")
img = deck.imagem
LIVRO = deck.livro["cor"]
T = dict(f=TEXTO, s=16, c=INK)
K, S_, P_, I_ = COD_CHAVE, COD_TEXTO, COD_PONTO, COD_NOME

# 1 ---------------------------------------------------------------- capa
s = deck.capa("Mods do Claude Code", "O que são e as peças que vieram antes · parte 1 de 2",
              "A capa da parte 1: uma escada de folhas, do CLAUDE.md ao hook, à skill e ao plugin, com texto e "
              "scripts por fora, que chega à janela do Claude Code, onde o mod roda por dentro e desenha um painel.")
deck.notas(s, "Em 01/10/2026, o Claude Code ganhou os mods: plugins com código que roda dentro do programa, reage ao "
              "que acontece na sessão, guarda estado e desenha na interface. Esta parte explica o que é um mod e "
              "como o Claude Code chegou até ele, peça por peça, com a data de cada uma. Não pressupõe conhecer "
              "skill, agente, hook, plugin nem marketplace. A parte 2 mostra um mod pronto, o csr-cockpit.")

# 2 ---------------------------------------------------------------- o que é um mod, em uma frase
s = deck.slide("Abertura")
deck.cabeca(s, "O que é um mod", "Código que roda dentro do Claude Code")
d = escrever(s, ML + 0.4, 2.15, LARG - 0.8,
             ["Um **mod** é um plugin do Claude Code com código que roda dentro do programa: reage aos eventos da "
              "sessão, guarda estado, registra comandos e {dz:desenha na interface}."],
             dict(f=TEXTO, s=21, c=INK), pitch=30, marcas={"dz": "duplo"})
moldura(s, ML + 0.1, 1.85, LARG - 0.2, d.altura + 0.6)
cw3 = (LARG - 2 * 0.3) / 3
for i, (valor, rotulo) in enumerate((("01/10/2026", "o anúncio dos mods, que chegam ligados por padrão"),
                                     ("2.1.287", "a versão do Claude Code em que os mods ficaram oficiais"),
                                     ("19 meses", "desde o lançamento do Claude Code, em 24/02/2025"))):
    numero_grande(s, ML + i * (cw3 + 0.3), d.fim + 0.95, cw3, valor, rotulo, cor=LIVRO if i < 2 else INK)
nota(s, ML + 0.1, 6.05, LARG, "até ali, tudo entregava texto ou ferramentas ao modelo, ou rodava um script por fora",
     tam=19)
deck.notas(s, "Um mod é um plugin com código que roda dentro do Claude Code: reage aos eventos da sessão, guarda "
              "estado, registra comandos e desenha na interface. O anúncio veio com a versão 2.1.287, em 01/10/2026, "
              "pouco mais de 19 meses depois do lançamento do Claude Code. Até ali, tudo o que se instalava "
              "entregava texto ou ferramentas ao modelo, ou rodava um script por fora.")

# 3 ---------------------------------------------------------------- modelo e programa
s = deck.slide("Abertura")
deck.cabeca(s, "A linha do tempo", "{gr:Um painel só pode vir do programa.}", marcas={"gr": "grifo"})
fw = (LARG - 0.35) / 2
for i, (esq, dir_, cor, frase, apoio) in enumerate((
        ("o modelo", "a IA, o Claude", AZUL, "Lê texto e responde.",
         "Ele pede as ferramentas, mas quem as executa é o programa."),
        ("o Claude Code", "o programa no terminal", PETROLEO, "Manda, executa e desenha.",
         "Manda o texto ao modelo, executa as ferramentas que ele pede (ler um arquivo, rodar um comando) e "
         "desenha a tela."))):
    fx = ML + i * (fw + 0.35)
    ty = ficha(s, fx, 1.95, fw, 2.5, esq, dir_, cor)
    d = escrever(s, fx + 0.3, ty + 0.28, fw - 0.6, [frase], dict(f=TITULO, s=23, c=INK, b=True), pitch=28, folga=0.99)
    escrever(s, fx + 0.3, d.fim + 0.16, fw - 0.6, [apoio], dict(f=TEXTO, s=15, c=INK2), pitch=21)
d = escrever(s, ML + 0.4, 5.1, LARG - 0.8,
             ["**Contexto** é tudo o que o modelo tem na frente para responder: as instruções, a conversa, os "
              "arquivos lidos. Ele tem tamanho máximo e é medido em **tokens**, os pedaços de palavra em que o "
              "modelo conta o texto e pelos quais se cobra."], dict(f=TEXTO, s=17, c=INK), pitch=25)
moldura(s, ML + 0.1, 4.8, LARG - 0.2, d.altura + 0.58)
deck.notas(s, "Uma distinção ajuda o resto da apresentação. O modelo é a IA, o Claude: lê texto e responde. O Claude "
              "Code é o programa que se abre no terminal: manda o texto ao modelo, executa as ferramentas que ele "
              "pede, como ler um arquivo ou rodar um comando, e desenha a tela. Por isso um painel só pode vir do "
              "programa. Contexto é tudo o que o modelo tem na frente para responder; é medido em tokens, e é por "
              "eles que se cobra.")

# 4 ---------------------------------------------------------------- a escada
s = deck.slide("As peças")
deck.cabeca(s, "A linha do tempo", "Do lançamento ao mod:  {m19:19 meses}", marcas={"m19": "circulo"})
escrever(s, ML, 1.55, LARG, ["Em cada degrau, a mesma pergunta: essa peça consegue pôr algo novo na interface?"],
         dict(f=TEXTO, s=16, c=INK2, i=True), pitch=21)
passo = escada(s, [("CLAUDE.md e MCP", "24/02/2025", "lançamento"), ("Comandos próprios", "05/03/2025", "0.2.31"),
                   ("Hooks", "30/06/2025", "1.0.38"), ("Subagentes", "24/07/2025", "1.0.60"),
                   ("Linha de status", "07/08/2025", "1.0.71"), ("Estilos de saída", "14/08/2025", "1.0.81"),
                   ("Plugins e marketplaces", "09/10/2025", "2.0.12"), ("Skills", "16/10/2025", "2.0.20"),
                   ("Temas próprios", "22/04/2026", "2.1.118"), ("Mods", "01/10/2026", "2.1.287")],
               ML, 6.82, LARG, 0.425)
nota(s, ML + 6.95 * passo, 1.98, 2.3, "a primeira peça que desenha um painel", tam=19)
seta(s, curva((ML + 6.95 * passo + 2.1, 2.36), (ML + 9 * passo - 0.15, 2.55), (ML + 9 * passo + 0.02, 2.95)))
deck.notas(s, "O Claude Code foi lançado em 24/02/2025, como prévia de pesquisa, e os mods chegaram em 01/10/2026: "
              "pouco mais de 19 meses. Cada degrau é uma peça, com a data de publicação da versão no npm e a versão "
              "em que ela entrou, conforme o changelog. O CLAUDE.md e o MCP não têm linha no changelog, porque já "
              "estavam na documentação do lançamento. Em cada degrau vale a mesma pergunta: essa peça consegue pôr "
              "algo novo na interface? Até o mod, a resposta é não.")

# 5 ---------------------------------------------------------------- o que cada peça alcança
s = deck.slide("As peças")
deck.cabeca(s, "Cada peça e o que ela não alcança", "O que cada peça alcança")
ty = ficha(s, ML, 1.72, LARG, 2.12, "texto para o modelo", "5 peças", AZUL)
cw = (LARG - 0.5 - 4 * 0.3) / 5
for i, (nome, txt) in enumerate((
        ("CLAUDE.md", "As instruções permanentes, entregues ao modelo em toda sessão."),
        ("Comando", "Um prompt salvo, chamado por `/nome`. Poupa a digitação, e só."),
        ("Subagente", "Um ajudante com contexto só dele. O que volta é texto."),
        ("Estilo de saída", "O papel, o tom e o formato das respostas."),
        ("Skill", "Instruções que o modelo carrega quando o pedido combina."))):
    cx = ML + 0.25 + i * (cw + 0.3)
    escrever(s, cx, ty + 0.2, cw, [nome], dict(f=UI, s=14, c=INK, b=True), pitch=17)
    escrever(s, cx, ty + 0.52, cw, [txt], dict(f=TEXTO, s=12.5, c=INK2), pitch=16.5)
bw = (LARG - 3 * 0.28) / 4
grupos = [("ferramentas", "MCP", AMBAR, [("MCP", "Liga o modelo a sistemas de fora: um banco de dados, um navegador. "
                                                "A interface continua a mesma.")]),
          ("script de fora", "2 peças", VERDE,
           [("Hook", "Um comando do sistema que roda sozinho num evento da sessão."),
            ("Linha de status", "Uma linha no rodapé, sem clique, escrita por um script.")]),
          ("embalagem e cores", "2 peças", ROXO,
           [("Plugin", "A pasta que se instala de uma vez. Empacota o que já existia."),
            ("Tema", "As cores da interface.")])]
for i, (esq, dir_, cor, itens) in enumerate(grupos):
    bx = ML + i * (bw + 0.28)
    ty = ficha(s, bx, 4.1, bw, 2.95, esq, dir_, cor)
    yy = ty + 0.2
    for nome, txt in itens:
        escrever(s, bx + 0.22, yy, bw - 0.44, [nome], dict(f=UI, s=14, c=INK, b=True), pitch=17)
        d = escrever(s, bx + 0.22, yy + 0.3, bw - 0.44, [txt], dict(f=TEXTO, s=12.5, c=INK2), pitch=16.5)
        yy = d.fim + 0.2
bx = ML + 3 * (bw + 0.28)
retangulo(s, bx, 4.1, bw, 2.95, raio=0.07, fundo=None, linha=INK3, lw=1.25, tracejado="dash", nome="A ficha que falta")
escrever(s, bx + 0.17, 4.22, bw - 0.34, ["por dentro"], dict(f=MONO, s=10, c=INK2), pitch=13)
nota(s, bx + 0.25, 5.05, bw - 0.5, "faltava a peça que roda por dentro", tam=24, alinhar="c", pitch=25)
deck.notas(s, "O CLAUDE.md, o comando, o subagente, o estilo de saída e a skill entregam texto ao modelo, e a tela "
              "fica igual. O MCP dá ferramentas a ele: um banco de dados, um navegador. O hook roda um comando do "
              "sistema num evento da sessão, e a linha de status imprime uma linha no rodapé; os dois rodam do lado "
              "de fora. O plugin é a embalagem que junta as peças, e o tema troca as cores da interface. A quarta "
              "ficha está vazia de propósito.")

# 6 ---------------------------------------------------------------- o colchete (escuro)
s = deck.slide("As peças", escuro=True)
dt = deck.cabeca(s, "Cada peça e o que ela não alcança", "Nenhuma dessas peças põe um painel na interface.",
                 escuro=True, tam=34, y=1.3)
d = escrever(s, ML + 0.55, dt.fim + 0.5, LARG - 0.8,
             ["O `CLAUDE.md`, o comando, o subagente, o estilo e a skill são texto para o modelo.",
              "O MCP dá ferramentas a ele.",
              "O hook e a linha de status rodam um script do lado de fora.",
              "O plugin embala, e o tema troca cores."],
             dict(f=TEXTO, s=20, c=E_INK2, codigo=dict(c=E_INK)), pitch=29, depois=10)
colchete(s, ML + 0.25, d.y - 0.05, d.fim + 0.08, cor=E_CANETA, lw=1.8)
escrever(s, ML, d.fim + 0.75, LARG, ["Faltava a peça que roda por dentro."], dict(f=TITULO, s=30, c=E_INK, b=True),
         pitch=36)
deck.notas(s, "Nenhuma dessas peças põe um painel na interface. Quase todas entregam texto ou ferramentas ao modelo, "
              "ou rodam um script por fora. O hook é o que mais se aproxima, porque vê os eventos passarem, mas roda "
              "como um processo à parte e não desenha nada. A linha de status é a peça que mais se parece com um "
              "painel, mas é uma linha só, sem clique. Faltava a peça que roda por dentro.")

# 7 ---------------------------------------------------------------- o que é um mod
s = deck.slide("O mod")
deck.cabeca(s, "O que é um mod", "O mod é um plugin com uma diferença")
d = escrever(s, ML, 1.9, 4.95,
             ["Num plugin comum, o `hooks/hooks.json` lista os hooks: que comando do sistema rodar em cada evento. "
              "No mod, o mesmo arquivo {am:aponta um módulo}, um arquivo de código.",
              "O módulo exporta `register(on)`. Cada `on(...)` liga uma função a um evento: uma chamada de "
              "ferramenta, o início de um turno, um pedaço da interface sendo desenhado.",
              "A função recebe `$`, a API dos mods; `e`, o evento; e `next`, que passa o evento adiante, como num "
              "{mw:middleware}."], dict(f=TEXTO, s=14.5, c=INK, codigo=dict(c=INK)), pitch=20.5, depois=10,
             marcas={"am": "duplo", "mw": "ondulado"})
mw = d.marcas["mw"][-1]
txt_mw = "quem não chama next responde no lugar"
w_mw = larg(txt_mw, MAO, 18, True)
if mw["x1"] + 0.55 + w_mw < ML + 5.0:
    nota(s, mw["x1"] + 0.5, mw["base"] - 0.24, w_mw + 0.1, txt_mw, tam=18)
    seta(s, curva((mw["x1"] + 0.44, mw["base"] - 0.08), (mw["x1"] + 0.28, mw["base"] - 0.1),
                  (mw["x1"] + 0.1, mw["base"] - 0.06)))
else:
    nota(s, ML + 0.42, d.fim + 0.14, w_mw + 0.1, txt_mw, tam=18)
    seta(s, curva((ML + 0.36, d.fim + 0.3), (ML + 0.12, d.fim + 0.22), (mw["x0"] + 0.15, mw["base"] + 0.13)))
cx, cw_ = ML + 5.4, W - MR - (ML + 5.4)
c1 = codigo(s, cx, 1.85, cw_, "plugins/csr-cockpit/hooks/hooks.json",
            [[("{ ", P_), ('"modules"', K), (": [", P_), ('"./register.tsx"', S_), ("] }", P_)]], tam=12, pitch=18)
x_reg = c1["texto_x"] + larg('{ "modules": [', MONO, 12)
x_reg1 = x_reg + larg('"./register.tsx"', MONO, 12)
x_fim = c1["texto_x"] + larg('{ "modules": ["./register.tsx"] }', MONO, 12)
base_reg = c1["topo"] + c1["pin"] - 0.205 * 12 / 72
sublinhado(s, x_reg + 0.02, x_reg1 - 0.02, base_reg + 0.06)
nota(s, x_fim + 0.62, c1["topo"] - 0.03, 2.2, "o código do mod", tam=19)
seta(s, curva((x_fim + 0.56, c1["topo"] + 0.15), (x_fim + 0.2, base_reg + 0.14), (x_reg1 - 0.06, base_reg + 0.1)))
TSX = [[("export", K), (" ", I_), ("const", K), (" register", I_), (": ", P_), ("Register", COD_TIPO), (" = ", P_),
        ("on", I_), (" => {", P_)],
       [("  on", I_), ("(", P_), ("'agent.spawn'", S_), (", ", P_), ("async", K), (" (", P_), ("$, e, next", I_),
        (") => {", P_)],
       [("    ", I_), ("const", K), (" iniciado ", I_), ("= ", P_), ("await", K), (" next", I_), ("(e)", P_)],
       [("    // guarda o agente e o pedido dele no estado da sessão", COD_COMENTARIO, "i")],
       [("    ", I_), ("return", K), (" iniciado", I_)],
       [("  })", P_)],
       [("}", P_)]]
TAM_TSX = 11.5
c2 = codigo(s, cx, c1["y"] + c1["h"] + 0.3, cw_, "plugins/csr-cockpit/hooks/register.tsx", TSX, tam=TAM_TSX,
            pitch=18, destaque=2)
l3 = c2["topo"] + 2 * c2["pin"]
fim3 = c2["texto_x"] + larg("    const iniciado = await next(e)", MONO, TAM_TSX)
txt3, livre3 = "o evento segue adiante como chegou", W - MR - 0.12 - (fim3 + 0.5)
tam3 = 18
while larg(txt3, MAO, tam3, True) > livre3 and tam3 > 15:
    tam3 -= 0.5
if larg(txt3, MAO, tam3, True) > livre3:
    txt3 = "segue adiante como chegou"
nota(s, fim3 + 0.5, l3 + (c2["pin"] - tam3 * 1.05 / 72) / 2 - 0.02, livre3 + 0.1, txt3, tam=tam3)
seta(s, curva((fim3 + 0.45, l3 + c2["pin"] / 2), (fim3 + 0.3, l3 + c2["pin"] / 2 + 0.03), (fim3 + 0.1, l3 + c2["pin"] / 2)),
     ponta=0.07)
escrever(s, cx, c2["y"] + c2["h"] + 0.18, cw_,
         ["Um hook do csr-cockpit, o mod da parte 2: quando o Claude Code cria um subagente (`agent.spawn`), ele "
          "deixa o evento seguir e anota o agente e o pedido."], dict(f=UI, s=11.5, c=INK2, codigo=dict(c=INK)),
         pitch=15, nome="Legenda")
deck.notas(s, "O mod é um plugin com uma diferença. Num plugin comum, o hooks.json lista os hooks: que comando do "
              "sistema rodar em cada evento. No mod, o mesmo arquivo aponta um módulo, um arquivo de código. Esse "
              "módulo exporta uma função register(on), e cada on liga uma função a um evento do Claude Code. A "
              "função recebe a API dos mods, o evento e o next, que passa o evento adiante, como num middleware; "
              "quem não chama o next responde no lugar do programa. O exemplo é um hook do csr-cockpit: quando o "
              "Claude Code cria um subagente, ele deixa o evento seguir e anota o agente e o pedido.")

# 8 ---------------------------------------------------------------- por dentro e por fora
s = deck.slide("O mod")
deck.cabeca(s, "O que é um mod", "Por dentro e por fora")
pic, iw, ih = imagem(s, img("figura-1.png"), 0, 1.85, h=4.65, raio_px=20,
                     alt="Figura: do lado de fora do Claude Code, o CLAUDE.md, a pasta do plugin (com SKILL.md, "
                         "critico.md e professor.md, o MCP, o register.tsx e o hook); dentro dele, o contexto do "
                         "modelo, a tela e o mod, que recebe os eventos, guarda estado e desenha o painel e a faixa. "
                         "Cada cor é um papel: texto para o modelo (azul), ferramentas do MCP (âmbar), o script do "
                         "hook (verde), a pasta do plugin (roxo) e o mod, por dentro (petróleo).")
pic.left = Inches(W - MR - iw)
lx, lw_ = ML, W - MR - iw - ML - 0.4
escrever(s, lx, 1.88, lw_, ["Com isso, um mod:"], dict(f=UI, s=13.5, c=INK2, b=True), pitch=17)
y = 2.3
for i, txt in enumerate(("roda dentro do Claude Code, no processo dele, e não como um script à parte;",
                         "guarda estado (lembra o que viu) entre um evento e outro, pelo tempo da sessão;",
                         "registra um comando `/nome` que executa código na hora, sem passar pelo modelo;",
                         "desenha: um painel ao lado da conversa e uma faixa acima do prompt.")):
    escrever(s, lx, y - 0.06, 0.3, [str(i + 1)], dict(f=MAO, s=22, c=CANETA, b=True), pitch=22)
    d = escrever(s, lx + 0.34, y, lw_ - 0.34, [txt], dict(f=TEXTO, s=14.5, c=INK, codigo=dict(c=INK)), pitch=20)
    y = d.fim + 0.17
escrever(s, lx, y + 0.22, lw_,
         ["Das peças da tabela, é {mk:a primeira que roda ali dentro e a primeira que desenha um painel}."],
         dict(f=TEXTO, s=16, c=INK), pitch=23, marcas={"mk": "marca"})
deck.notas(s, "A ideia é a do hook de antes, reagir a um evento, só que agora é código rodando dentro do Claude Code, "
              "que pode observar o evento, reescrevê-lo ou responder no lugar do programa. Na figura, do lado de "
              "fora ficam o texto que vai para o contexto do modelo, as ferramentas do MCP e o script do hook, quase "
              "tudo dentro da pasta do plugin. Do lado de dentro, só o mod: recebe os eventos, guarda estado e "
              "desenha o painel e a faixa.")

# 9 ---------------------------------------------------------------- onde roda e o cuidado
s = deck.slide("O mod")
deck.cabeca(s, "O que é um mod", "Onde ele roda, e o cuidado antes de instalar")
fw2 = (LARG - 0.35) / 2
ty = ficha(s, ML, 1.85, fw2, 2.85, "onde roda", "terminal e desktop", PETROLEO)
escrever(s, ML + 0.3, ty + 0.25, fw2 - 0.6,
         ["Os mods funcionam no terminal e na aba Code do aplicativo de desktop.",
          "O aplicativo traz a própria cópia do Claude Code, que pode estar numa versão anterior: `claude --version` "
          "mostra a versão do terminal, não a do aplicativo."],
         dict(f=TEXTO, s=14.5, c=INK, codigo=dict(c=INK)), pitch=20.5, depois=8)
fx2 = ML + fw2 + 0.35
ty = ficha(s, fx2, 1.85, fw2, 2.85, "desde quando", "vale em out/2026", LIVRO)
escrever(s, fx2 + 0.3, ty + 0.25, fw2 - 0.6,
         ["Em setembro de 2026, um acesso antecipado, só para quem ligava uma variável de ambiente.",
          "A partir da 2.1.287, oficiais e ligados por padrão."],
         dict(f=TEXTO, s=14.5, c=INK), pitch=20.5, depois=8)
aviso(s, ML, 5.05, LARG, "Atenção",
      "Um mod é código que roda com as suas permissões, sem isolamento: pode ler e gravar arquivos, iniciar "
      "processos e usar a rede. Instale só mods de autores em quem você confia e, antes, leia o código ou rode "
      "`claude plugin validate <pasta>`, que lista os eventos que ele escuta e as chamadas que faz, sem executar "
      "nada.", h=1.3, tam=14)
deck.notas(s, "Os mods passaram por um acesso antecipado em setembro de 2026, só para quem ligava uma variável de "
              "ambiente, e são oficiais a partir da 2.1.287, ligados por padrão. Funcionam no terminal e na aba Code "
              "do aplicativo de desktop, que traz a própria cópia do Claude Code; o claude --version mostra a versão "
              "do terminal, não a do aplicativo. E o cuidado: um mod roda com as suas permissões, sem isolamento. "
              "Antes de instalar, vale ler o código ou rodar claude plugin validate, que lista o que ele escuta e o "
              "que ele chama, sem executar nada.")

# 10 --------------------------------------------------------------- as confusões
s = deck.slide("As confusões")
deck.cabeca(s, "Skill, agente ou plugin", "As confusões mais comuns")
CONF = [("skill · agente · plugin", "Não são alternativas.",
         "A skill é uma instrução. O agente executa uma tarefa numa conversa à parte. O plugin é a pasta que "
         "entrega os dois.", {}),
        ("mod", "Mod é plugin, não skill.",
         "A skill é um texto que o modelo lê. O mod é código que {ex:o Claude Code executa}. Os dois chegam dentro "
         "de um plugin.", {"ex": "ondulado"}),
        ("build", "O mod não tem build.",
         "Nada de `npm install` nem de empacotador: o Claude Code lê o código direto da pasta.", {}),
        ("instalação", "Não se instala uma skill solta de dentro de um plugin.",
         "A unidade de instalação é o plugin, e tudo o que está na pasta dele vem junto.", {}),
        ("marketplace", "Marketplace não é uma loja.",
         "É o catálogo de onde os plugins se instalam: um repositório git com um arquivo que lista os itens. "
         "{gr:Um repositório público no GitHub basta.}", {"gr": "grifo"})]
fw5, gap = (LARG - 2 * 0.25) / 3, 0.25
for i, (esq, frase, txt, mk) in enumerate(CONF):
    linha = i // 3
    n_linha = 3 if linha == 0 else 2
    x0 = ML if linha == 0 else ML + (fw5 + gap) / 2
    fx = x0 + (i % 3) * (fw5 + gap)
    fy = 1.8 + linha * 2.65
    ty = ficha(s, fx, fy, fw5, 2.45, esq, f"{i + 1}/5", LIVRO, tam=9.5)
    d = escrever(s, fx + 0.22, ty + 0.17, fw5 - 0.44, [frase], dict(f=UI, s=14.5, c=INK, b=True), pitch=18)
    escrever(s, fx + 0.22, d.fim + 0.12, fw5 - 0.44, [txt], dict(f=TEXTO, s=13, c=INK2, codigo=dict(c=INK)),
             pitch=17.5, marcas=mk)
deck.notas(s, "Os nomes se parecem, e é fácil tomar uma peça pela outra. Skill, agente e plugin não são "
              "alternativas: a skill é uma instrução, o agente executa uma tarefa numa conversa à parte, e o plugin "
              "é a pasta que entrega os dois. Mod é plugin, não skill. O mod não tem build: o Claude Code lê o código "
              "direto da pasta. A unidade de instalação é o plugin. E marketplace não é uma loja: é um repositório "
              "git com um catálogo; um repositório público no GitHub basta.")

# 11 --------------------------------------------------------------- fecho
deck.fecho("Na parte 2, um mod pronto",
           "A parte 2 pega um mod pronto, o csr-cockpit, e mostra o painel ao lado da conversa, a instalação a "
           "partir de um marketplace, os comandos, os testes e os limites. Para ir além do básico, a página Extend "
           "Claude Code compara as peças, e a Anthropic publica mods de exemplo.",
           recomendacao="A **parte 2** mostra um mod pronto, o csr-cockpit. Para ir além do básico: a página "
                        "**Extend Claude Code** e os **mods de exemplo** da Anthropic.",
           enderecos=["blog.cesarschutz.com.br/posts/claude-code-csr-cockpit",
                      "code.claude.com/docs/en/features-overview",
                      "github.com/anthropics/claude-code-playground › claude-code/mods"],
           fontes=["Anthropic: Claude 3.7 Sonnet and Claude Code (o lançamento, 24/02/2025)",
                   "Claude: Claude Code mods (01/10/2026), os plugins (09/10/2025) e as Agent Skills (16/10/2025)",
                   "Claude Code: o changelog, o CHANGELOG.md no GitHub e as versões no npm",
                   "Documentação: memória, MCP, hooks, subagentes, estilos, skills, plugins e mods",
                   "Cesar Schutz: o claude-code-kit"])

deck.salvar()
