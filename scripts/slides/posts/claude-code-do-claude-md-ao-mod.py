"""A apresentação do post dos mods (D74): "Quanto custou cada agente? Do CLAUDE.md ao mod no Claude Code".

É a primeira feita no estilo do blog, aprovada pelo Cesar em 02/10/2026, e serve de modelo para as
próximas: 19 slides na ordem do post, com a capa colada com fita, a escada da linha do tempo, as fichas, o
bloco de código, a lousa, a figura, os prints do cockpit com a caneta por cima, os números grandes, os
dois slides escuros, as marcações do próprio post e as notas do apresentador em todos.

    node scripts/slides/capturar.mjs claude-code-do-claude-md-ao-mod
    python3 scripts/slides/posts/claude-code-do-claude-md-ao-mod.py
    python3 scripts/slides/conferir.py claude-code-do-claude-md-ao-mod
"""
import json
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from estilo import *  # noqa: E402,F403

SLUG = "claude-code-do-claude-md-ao-mod"
post = ler_post(SLUG)
LIVRO = livro(post["category"])["cor"]
dados_ = SAIDA / SLUG / "dados.json"
TIRA = json.loads(dados_.read_text()).get("tira") if dados_.exists() else None
EVID = f"src/evidencias/{SLUG}"

deck = Deck(SLUG, "Quanto custou cada agente? Do CLAUDE.md ao mod no Claude Code")
img = deck.imagem
T = dict(f=TEXTO, s=16, c=INK)

# 1 ---------------------------------------------------------------- capa
s = deck.slide("Abertura")
d = diagramar(ML, 1.55, LARG, ["Quanto custou cada agente?"], dict(f=TITULO, s=46, c=INK, b=True), pitch=54)
colocar(s, d, shape=s.shapes.title, nome="Título")
escrever(s, ML, 2.38, LARG, ["Do CLAUDE.md ao mod no Claude Code"], dict(f=TEXTO, s=22, c=INK2, i=True), pitch=28,
         nome="Subtítulo")
tira = f"{TIRA['chamada']} · {TIRA['tombo']}" if TIRA else f"Vol. {livro(post['category'])['volume']:02d}"
escrever(s, ML, 1.22, 6, [tira], dict(f=MONO, s=10.5, c=INK2), pitch=13, nome="Tira da ficha")
data = "/".join(reversed(post["published"].split("-")))
escrever(s, W - MR - 4, 1.22, 4, [f"{data} · {post['category']}"], dict(f=MONO, s=10.5, c=INK2), pitch=13, alinhar="r")
imagem(s, img("marca.png"), ML, 0.5, w=2.3, alt="Cesar Schutz, blog")
th = 0.3
x_tag = W - MR
for n, nome in reversed(list(enumerate(post["tags"], 1))):
    pw, ph = Image.open(img(f"tag-{n}.png")).size
    x_tag -= th * pw / ph
    imagem(s, img(f"tag-{n}.png"), x_tag, 0.5, h=th, raio_px=31, alt=f"Tag {nome}")
    x_tag -= 0.12
iw = 10.9
pic, iw, ih = imagem(s, img("capa.png"), (W - iw) / 2, 3.08, w=iw, raio_px=22, recorte=(16, 16, 16, 16), rot=-0.6,
                     sombra=SOMBRA_FOTO,
                     alt="A capa do post: o Claude Code desenhado como um terminal com o painel aberto ao lado da "
                         "conversa, e duas etiquetas de preço, US$ 0,04 e US$ 0,02, presas ao painel; o CLAUDE.md "
                         "fica de fora, como texto para o modelo, e o mod desenha por dentro.")
fita(s, (W - iw) / 2 + 1.25, 3.1, rot=-6)
fita(s, (W + iw) / 2 - 1.25, 3.04, rot=5)
deck.notas(s, "Esta apresentação acompanha o post do blog. A pergunta do título é concreta: quanto custou cada agente "
              "que o Claude Code rodou no meu último pedido, e cada turno da conversa? Vou contar como o Claude Code "
              "chegou até o mod, peça por peça, e mostrar o csr-cockpit, o painel que faz essa conta. Não é um "
              "tutorial de código: explico o básico de cada peça e aponto a documentação oficial.")

# 2 ---------------------------------------------------------------- a pergunta
s = deck.slide("Abertura")
deck.cabeca(s, "A pergunta", "A conta que a ferramenta não mostrava")
y = 1.9
for termo, defin in (("Agente", "O subagente: o ajudante que o Claude Code chama para cuidar de uma parte da tarefa."),
                     ("Turno", "Cada pedido seu, com tudo o que ele desencadeia.")):
    escrever(s, ML, y, 4.5, [termo], dict(f=UI, s=12.5, c=LIVRO, b=True), pitch=15)
    d = escrever(s, ML, y + 0.26, 4.45, [defin], T, pitch=22)
    y = d.fim + 0.3
escrever(s, ML, y + 0.08, 4.45,
         ["O `/usage` mostra quanto a sessão inteira custou e, nos planos pagos, que fatia do uso foi para "
          "subagentes, em percentual.",
          "Quanto custou cada agente, ou cada turno, {nd:ele não diz}."], T, pitch=22, depois=9,
         marcas={"nd": "ondulado"})
pic, iw, ih = imagem(s, img(f"{EVID}/cockpit.png"), 5.55, 1.9, w=LARG - (5.55 - ML), raio_px=31,
                     alt="A tela do Claude Code com o painel do csr-cockpit aberto ao lado da conversa. A aba Agentes "
                         "mostra dois subagentes rodando, cada um com o modelo, o tempo, o tamanho do contexto e o "
                         "custo atribuído até ali, de 2 e de 1 centavo de dólar. Acima do prompt, a linha de resumo "
                         "mostra o contexto usado e o custo da sessão.")
escrever(s, 5.55, 1.9 + ih + 0.14, LARG - (5.55 - ML),
         ["O csr-cockpit ao lado da conversa: um desenho com os textos e os números de uma sessão real "
          "(Claude Code 2.1.287, modelo Haiku 4.5)."], dict(f=UI, s=11.5, c=INK2), pitch=15, nome="Legenda")
deck.notas(s, "Agente, aqui, é o subagente: o ajudante que o Claude Code chama para cuidar de uma parte da tarefa. "
              "Turno é cada pedido, com tudo o que ele desencadeia. Até os mods virarem oficiais, em 01/10/2026, a "
              "ferramenta não mostrava essa conta: o /usage mostra o custo da sessão inteira e, nos planos pagos, a "
              "fatia dos subagentes em percentual. A imagem é o csr-cockpit, o mod que publiquei no mesmo dia, no "
              "repositório claude-code-kit. Um aviso desde já: o número de cada agente é uma conta do painel, não "
              "do Claude Code.")

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
deck.notas(s, "Uma distinção que ajuda o resto da apresentação. O modelo é a IA, o Claude: lê texto e responde. O "
              "Claude Code é o programa que se abre no terminal: manda o texto ao modelo, executa as ferramentas que "
              "ele pede, como ler um arquivo ou rodar um comando, e desenha a tela. Por isso um painel só pode vir do "
              "programa. Contexto é tudo o que o modelo tem na frente para responder; é medido em tokens, e é por "
              "eles que se cobra. O termo volta até o fim.")

# 4 ---------------------------------------------------------------- a escada
s = deck.slide("As peças")
deck.cabeca(s, "A linha do tempo", "Do lançamento ao mod:  {m19:19 meses}", marcas={"m19": "circulo"})
escrever(s, ML, 1.55, LARG, ["Em cada degrau, uma peça nova e a mesma pergunta: com isso eu conseguiria aquele painel?"],
         dict(f=TEXTO, s=16, c=INK2, i=True), pitch=21)
passo = escada(s, [("CLAUDE.md e MCP", "24/02/2025", "lançamento"), ("Comandos próprios", "05/03/2025", "0.2.31"),
                   ("Hooks", "30/06/2025", "1.0.38"), ("Subagentes", "24/07/2025", "1.0.60"),
                   ("Linha de status", "07/08/2025", "1.0.71"), ("Estilos de saída", "14/08/2025", "1.0.81"),
                   ("Plugins e marketplaces", "09/10/2025", "2.0.12"), ("Skills", "16/10/2025", "2.0.20"),
                   ("Temas próprios", "22/04/2026", "2.1.118"), ("Mods", "01/10/2026", "2.1.287")],
               ML, 6.82, LARG, 0.425)
nota(s, ML + 6.95 * passo, 1.98, 2.3, "a primeira peça que desenha a tela", tam=19)
seta(s, curva((ML + 6.95 * passo + 2.1, 2.36), (ML + 9 * passo - 0.15, 2.55), (ML + 9 * passo + 0.02, 2.95)))
deck.notas(s, "O Claude Code foi lançado em 24/02/2025, como prévia de pesquisa, e o mod chegou em 01/10/2026: pouco "
              "mais de 19 meses. Cada degrau é uma peça, com a data de publicação da versão no npm e a versão em que "
              "ela entrou, conforme o changelog. O CLAUDE.md e o MCP não têm linha de estreia, porque já estavam na "
              "documentação do lançamento. Em cada degrau eu faço a mesma pergunta: com isso eu conseguiria aquele "
              "painel? Até o mod, a resposta é não.")

# 5 ---------------------------------------------------------------- o que cada peça alcança
s = deck.slide("As peças")
deck.cabeca(s, "Cada peça e o que ela não alcança", "O que cada peça alcança")
ty = ficha(s, ML, 1.72, LARG, 2.12, "texto para o modelo", "5 peças", AZUL)
cw = (LARG - 0.5 - 4 * 0.3) / 5
for i, (nome, txt) in enumerate((
        ("CLAUDE.md", "As instruções permanentes, entregues ao modelo em toda sessão."),
        ("Comando", "Um prompt salvo, chamado por `/nome`. Poupa a digitação, e só."),
        ("Subagente", "Um ajudante com papel e contexto só dele, que devolve um resumo."),
        ("Estilo de saída", "O papel, o tom e o formato das respostas."),
        ("Skill", "Instruções que o modelo carrega quando o pedido combina."))):
    cx = ML + 0.25 + i * (cw + 0.3)
    escrever(s, cx, ty + 0.2, cw, [nome], dict(f=UI, s=14, c=INK, b=True), pitch=17)
    escrever(s, cx, ty + 0.52, cw, [txt], dict(f=TEXTO, s=12.5, c=INK2), pitch=16.5)
bw = (LARG - 3 * 0.28) / 4
grupos = [("ferramentas", "MCP", AMBAR, [("MCP", "Liga o modelo a sistemas de fora: um banco de dados, um navegador. "
                                                "A tela segue a mesma.")]),
          ("script de fora", "2 peças", VERDE,
           [("Hook", "Um comando do sistema que roda sozinho num evento da sessão."),
            ("Linha de status", "Uma linha no rodapé, sem clique, com o custo da sessão inteira.")]),
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
deck.notas(s, "O CLAUDE.md, o comando, o subagente, o estilo de saída e a skill entregam texto ao modelo. O MCP dá "
              "ferramentas a ele: um banco de dados, um navegador. O hook roda um comando do sistema num evento da "
              "sessão, e a linha de status imprime uma linha no rodapé; os dois rodam do lado de fora. O plugin é a "
              "embalagem que junta as peças, e o tema troca as cores da interface. A quarta ficha está vazia de "
              "propósito.")

# 6 ---------------------------------------------------------------- o colchete (escuro)
s = deck.slide("As peças", escuro=True)
dt = deck.cabeca(s, "Cada peça e o que ela não alcança", "Nenhuma dessas peças chega ao painel.", escuro=True,
                 tam=36, y=1.3)
d = escrever(s, ML + 0.55, dt.fim + 0.5, LARG - 0.8,
             ["O `CLAUDE.md`, o comando, o subagente, o estilo e a skill são texto para o modelo.",
              "O MCP dá ferramentas a ele.",
              "O hook e a linha de status rodam um script do lado de fora.",
              "O plugin embala, e o tema troca cores."],
             dict(f=TEXTO, s=20, c=E_INK2, codigo=dict(c=E_INK)), pitch=29, depois=10)
colchete(s, ML + 0.25, d.y - 0.05, d.fim + 0.08, cor=E_CANETA, lw=1.8)
escrever(s, ML, d.fim + 0.75, LARG, ["Faltava a peça que roda por dentro."], dict(f=TITULO, s=30, c=E_INK, b=True),
         pitch=36)
deck.notas(s, "Nenhuma dessas peças chega ao painel. Quase todas entregam texto ou ferramentas ao modelo, ou rodam um "
              "script por fora. O hook é o que mais se aproxima, porque vê os eventos passarem, mas roda como um "
              "processo à parte e não desenha nada. A linha de status é a peça que mais se parece com o painel, mas é "
              "uma linha só, sem clique, e o custo que chega a ela é o da sessão inteira. Antes de chegar à peça que "
              "faltava, três partes sobre como as peças se instalam, porque foi ali que eu mais me perdi.")

# 7 ---------------------------------------------------------------- oito fichas
s = deck.slide("Instalar")
deck.cabeca(s, "Skill, agente ou plugin", "O que eu demorei a entender")
FICHAS = [("skill · agente · plugin", "Não são alternativas.",
           "A skill é uma instrução. O agente executa uma tarefa numa conversa à parte. O plugin é a pasta que "
           "entrega os dois.", {}),
          ("mod", "Mod é plugin, não skill.",
           "A skill é um texto que o modelo lê. O mod é código que {ex:o Claude Code executa}. Os dois se "
           "instalam do mesmo jeito.", {"ex": "ondulado"}),
          ("build", "Não há build.",
           "Nada de `npm install` nem de empacotador: o Claude Code lê o código direto da pasta.", {}),
          ("instalação", "Instala-se a pasta inteira.",
           "Cada item do catálogo aponta para uma pasta, e tudo o que está nela vem junto.", {}),
          ("manifesto", "Peça avulsa dispensa o `plugin.json`.",
           "Para instalar uma skill sozinha, basta a entrada dela no catálogo, que faz o papel de manifesto.", {}),
          ("nomes", "Repositório não é marketplace.",
           "O repositório é o `claude-code-kit`; o marketplace, {cx:`cesarschutz`}. Um aparece ao cadastrar; o "
           "outro, ao instalar.", {"cx": "caixa"}),
          ("conta", "Não precisa de conta empresarial.",
           "Um marketplace é um repositório git. {gr:Um repositório público no GitHub basta.}", {"gr": "grifo"}),
          ("versão", "A sessão aberta fica na versão antiga.",
           "Depois de atualizar, ela segue com a versão que carregou, até um `/reload-plugins` ou até ser "
           "reaberta.", {})]
fw, fh, gap = (LARG - 3 * 0.25) / 4, 2.5, 0.25
for i, (esq, frase, txt, mk) in enumerate(FICHAS):
    fx = ML + (i % 4) * (fw + gap)
    fy = 1.78 + (i // 4) * (fh + 0.2)
    ty = ficha(s, fx, fy, fw, fh, esq, f"{i + 1}/8", LIVRO, tam=9.5)
    d = escrever(s, fx + 0.2, ty + 0.17, fw - 0.4, [frase], dict(f=UI, s=14.5, c=INK, b=True), pitch=18)
    escrever(s, fx + 0.2, d.fim + 0.12, fw - 0.4, [txt], dict(f=TEXTO, s=12.5, c=INK2, codigo=dict(c=INK)),
             pitch=16.5, marcas=mk)
deck.notas(s, "Esta é a lista do que me confundiu. Skill, agente e plugin não são alternativas: a skill é uma "
              "instrução, o agente executa uma tarefa numa conversa à parte, e o plugin é a pasta que entrega os "
              "dois. Mod é plugin, não skill. Não há build: o Claude Code lê o código direto da pasta. O que se "
              "instala é a pasta inteira. Uma peça avulsa não precisa de plugin.json. O nome do repositório e o do "
              "marketplace são coisas diferentes. Não precisa de conta empresarial. E a sessão aberta continua na "
              "versão antiga até um /reload-plugins.")

# 8 ---------------------------------------------------------------- marketplace
s = deck.slide("Instalar")
deck.cabeca(s, "Marketplace: o catálogo num repositório", "Um repositório com um `marketplace.json`")
d = escrever(s, ML, 1.9, 4.75,
             ["O arquivo fica na pasta `.claude-plugin/` e tem três campos obrigatórios: `name`, `owner` e `plugins`.",
              "Cada entrada de `plugins` é um item instalável, com um `name` e um {src:`source`}: a pasta dele dentro "
              "do repositório."], dict(f=TEXTO, s=15.5, c=INK), pitch=22, depois=10, marcas={"src": "caixa"})
y = d.fim + 0.35
for esq, dir_, cor, txt, mk in (
        ("plugin completo", "csr-cockpit", PETROLEO,
         "A pasta `plugins/csr-cockpit` tem o seu próprio `.claude-plugin/plugin.json`.", {}),
        ("peça avulsa", "explicar-erro", AZUL,
         "Não há `plugin.json`: {pe:a própria entrada diz} o que a pasta traz, no campo `skills`.", {"pe": "duplo"})):
    ty = ficha(s, ML, y, 4.75, 1.32, esq, dir_, cor)
    escrever(s, ML + 0.22, ty + 0.17, 4.3, [txt], dict(f=TEXTO, s=13.5, c=INK2, codigo=dict(c=INK)), pitch=19,
             marcas=mk)
    y += 1.32 + 0.22
K, S_, P_, I_ = COD_CHAVE, COD_TEXTO, COD_PONTO, COD_NOME
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
deck.notas(s, "Um marketplace é um repositório com um arquivo .claude-plugin/marketplace.json, de três campos "
              "obrigatórios: name, owner e plugins. Cada entrada de plugins é um item instalável, com um name e um "
              "source, que é a pasta dele no repositório. Este é um pedaço do meu, com as descrições encurtadas. A "
              "primeira entrada é um plugin completo; a segunda é uma peça avulsa, e é o campo skills que dispensa o "
              "plugin.json.")

# 9 ---------------------------------------------------------------- a lousa
s = deck.slide("Instalar")
deck.cabeca(s, "Marketplace: o catálogo num repositório", "Instalar e atualizar, em cinco passos")
pic, iw, ih = imagem(s, img("lousa-1.png"), ML, 1.85, w=7.0, raio_px=20,
                     alt="Lousa: o repositório claude-code-kit, no GitHub, com o marketplace.json e uma pasta por "
                         "item; o marketplace add clona o catálogo para a sua máquina; o install copia a pasta inteira "
                         "do csr-cockpit, na versão 0.5.0; commits novos não chegam a quem instalou enquanto o version "
                         "não sobe; quando ele sobe, o update traz a pasta nova, e a sessão que já estava aberta segue "
                         "na versão antiga até o /reload-plugins.")
PASSOS = [(ROXO, "No GitHub, o `claude-code-kit` guarda o catálogo e uma pasta por item."),
          (ROXO, "`marketplace add` clona o repositório. Dali em diante o catálogo se chama `cesarschutz`."),
          (PETROLEO, "`install` copia a pasta inteira do item, na versão do `plugin.json`: 0.5.0."),
          (VERMELHO, "Commits novos não chegam a quem instalou enquanto o `version` não sobe."),
          (PETROLEO, "Com o `version` em 0.6.0, o `update` traz a pasta nova. A sessão aberta segue na 0.5.0 até o "
                     "`/reload-plugins`.")]
px = ML + iw + 0.42
y = 1.9
for i, (cor, txt) in enumerate(PASSOS):
    elipse(s, px + 0.17, y + 0.15, 0.165, fundo=cor)
    escrever(s, px, y + 0.035, 0.34, [str(i + 1)], dict(f=UI, s=12.5, c=BRANCO, b=True), pitch=15, alinhar="c")
    d = escrever(s, px + 0.5, y, W - MR - px - 0.5, [txt], dict(f=TEXTO, s=14, c=INK, codigo=dict(c=INK)), pitch=19.5)
    y = d.fim + 0.25
fy_ = 1.85 + ih + 0.22
escrever(s, ML + 0.42, fy_, iw - 0.42,
         ["O Claude Code só vê atualização quando a versão muda. Com o campo `version` no `plugin.json`, vale esse "
          "número; sem ele, que é o caso das peças avulsas, a versão é o commit."],
         dict(f=UI, s=12, c=INK2, codigo=dict(c=INK)), pitch=16)
escrever(s, ML + 0.05, fy_ - 0.1, 0.3, ["!"], dict(f=MAO, s=32, c=CANETA, b=True), pitch=32, alinhar="c")
deck.notas(s, "Instalar e atualizar seguem estes cinco passos, do repositório no GitHub à sessão aberta na sua "
              "máquina. O marketplace add clona o catálogo, que passa a ser conhecido pelo name dele, cesarschutz. O "
              "install copia a pasta inteira do item, na versão do plugin.json. Commits novos não chegam a quem "
              "instalou enquanto o version não sobe; quando sobe, o update traz a pasta nova, e a sessão que já "
              "estava aberta segue na versão antiga até o /reload-plugins. Sem o campo version, que é o caso das "
              "peças avulsas, a versão é o commit.")

# 10 --------------------------------------------------------------- os comandos
s = deck.slide("Instalar")
deck.cabeca(s, "Os comandos", "Os comandos que eu usei")
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
SESS = [("/plugin", "abre a tela de plugins e marketplaces"), ("/reload-plugins", "aplica o que mudou nos plugins"),
        ("/theme e /output-style", "escolhem o tema e o estilo de saída"),
        ("/cockpit", "abre e fecha o painel do csr-cockpit")]
lh2 = 0.6
topo2 = fy + 0.62 + 0.04
ficha_pautada(s, fx2, fy, fw2, 0.66 + len(SESS) * lh2 + 0.08, "Dentro da sessão",
              [topo2 + (k + 1) * lh2 for k in range(len(SESS) - 1)])
for k, (cmd, txt) in enumerate(SESS):
    ry = topo2 + k * lh2
    linha_cmd = " e ".join(f"`{p}`" for p in cmd.split(" e "))
    escrever(s, fx2 + 0.26, ry + 0.08, fw2 - 0.4, [linha_cmd], dict(f=UI, s=11.5, c=INK2, codigo=dict(s=11.5, c=INK)),
             pitch=14)
    escrever(s, fx2 + 0.26, ry + 0.32, fw2 - 0.4, [txt], dict(f=UI, s=11.5, c=INK2), pitch=14)
postit(s, fx2 + 0.12, 5.3, fw2 - 0.25, 1.42,
       "Num marketplace de terceiros, a atualização automática vem desligada: o update fica por sua conta.",
       rot=1.6, tam=19.5)
deck.notas(s, "Estes são os comandos que eu usei; o resto está na referência dos comandos de plugin. No terminal, o "
              "ciclo é cadastrar o marketplace, instalar, listar, atualizar e remover. O validate confere o "
              "manifesto e as peças, e com --strict os avisos viram erro. O test roda os testes de um mod. E o "
              "--plugin-dir abre uma sessão com o plugin de uma pasta local, sem instalar: a cópia local ganha da "
              "instalada. Dentro da sessão, o /plugin abre a tela de plugins, o /reload-plugins aplica o que mudou e "
              "o /cockpit abre e fecha o painel. Num marketplace de terceiros, como o meu, a atualização automática "
              "vem desligada (vale em out/2026): quem instalou roda o claude plugin update quando quiser a versão "
              "nova.")

# 11 --------------------------------------------------------------- o que é um mod
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
txt_mw = "sem chamar o next, o hook responde"
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
aviso(s, ML, 6.12, LARG, "Atenção",
      "Um mod é código que roda com as suas permissões, sem isolamento: pode ler e gravar arquivos, iniciar "
      "processos e usar a rede. Instale só mods de autores em quem você confia, e leia o código antes.")
deck.notas(s, "O mod é um plugin com uma diferença. Num plugin comum, o hooks.json lista os hooks: que comando do "
              "sistema rodar em cada evento. No mod, o mesmo arquivo aponta um módulo, um arquivo de código. Esse "
              "módulo exporta uma função register(on), e cada on liga uma função a um evento do Claude Code. A função "
              "recebe a API dos mods, o evento e o next, que passa o evento adiante, como num middleware; sem chamar "
              "o next, o hook responde no lugar do programa. Este é o hook do cockpit que registra um subagente novo, "
              "com o miolo resumido num comentário. Atenção: um mod roda com as suas permissões, sem isolamento. "
              "Instale só mods de autores em quem você confia, e leia o código antes.")

# 12 --------------------------------------------------------------- por dentro e por fora
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
escrever(s, lx, y + 0.22, lw_, ["Das peças da tabela, é {mk:a primeira que roda ali dentro e a primeira que desenha}."],
         dict(f=TEXTO, s=16, c=INK), pitch=23, marcas={"mk": "marca"})
deck.notas(s, "A documentação também chama de hook cada uma dessas funções. A ideia é a do hook de antes, reagir a um "
              "evento, só que agora é código rodando dentro do Claude Code, que pode observar o evento, reescrevê-lo "
              "ou responder no lugar do programa. Na figura, do lado de fora ficam o texto que vai para o contexto do "
              "modelo, as ferramentas do MCP e o script do hook, quase tudo dentro da pasta do plugin. Do lado de "
              "dentro, só o mod. Os mods passaram por um acesso antecipado em setembro de 2026 e são oficiais a "
              "partir da 2.1.287, ligados por padrão.")

# 13 --------------------------------------------------------------- o cockpit: cinco abas
s = deck.slide("O cockpit")
deck.cabeca(s, "O cockpit", "Cinco abas, cinco perguntas")
escrever(s, ML, 1.5, LARG, ["Um painel ao lado da conversa, aberto e fechado com `/cockpit`."],
         dict(f=TEXTO, s=16, c=INK2, i=True, codigo=dict(c=INK, i=False)), pitch=21)
ABAS = [("Agentes", "Quem está trabalhando agora, e em quê?",
         "cada subagente com o modelo, o tempo, o contexto dele, o custo atribuído, as chamadas e a tarefa"),
        ("Diffs", "O que mudou neste turno?", "cada edição, com as linhas que saíram e as que entraram"),
        ("Contexto", "Quanto do contexto sobra, e quanto já custou?",
         "o percentual usado, o custo da sessão e do último turno e o limite de uso do plano"),
        ("Arquivos", "O que foi lido e rodado, e por quem?",
         "os arquivos lidos e os comandos Bash, com quem leu ou rodou, o status e a duração"),
        ("Turnos", "O que aconteceu, na ordem?", "um registro por pedido, com a duração, o custo, as ferramentas e as falhas")]
fim_tab = tabela(s, ML, 2.02, LARG,
                 [("Aba", 1.75, dict(f=MONO, s=12.5, c=ACENTO)), ("A pergunta", 4.55, dict(f=TEXTO, s=14.5, c=INK, i=True)),
                  ("O que mostra", LARG - 0.25 - 1.75 - 4.55, dict(f=UI, s=11.5, c=INK2))],
                 [([(f"{k + 1}: ", {}), (aba, dict(c=INK, b=True))], perg, mostra) for k, (aba, perg, mostra) in enumerate(ABAS)])
pic, iw, ih = imagem(s, img(f"{EVID}/linha-de-resumo.png"), ML, fim_tab + 0.3, w=LARG, recorte=(0, 262, 0, 26),
                     raio_px=22,
                     alt="A linha de resumo do csr-cockpit acima do prompt: contexto em 22%, 44,8 mil tokens com mais "
                         "1,1 mil do último turno, custo de 15 centavos de dólar com mais 2 centavos do último turno, "
                         "limite de uso de 5 horas em 17% e de 7 dias em 64%, e 2 agentes concluídos.")
escrever(s, ML, fim_tab + 0.3 + ih + 0.1, LARG,
         ["A linha de resumo, acima do prompt, com o painel aberto ou fechado: entre parênteses, o que o último turno "
          "somou."], dict(f=UI, s=11.5, c=INK2), pitch=15, nome="Legenda")
deck.notas(s, "O csr-cockpit é um painel ao lado da conversa, aberto e fechado com /cockpit, com cinco abas, e cada "
              "uma responde a uma pergunta. Clicar no nome de um agente, de um comando Bash ou de um turno abre o "
              "detalhe: o pedido, as chamadas e a resposta. E acima do prompt fica uma linha de resumo, com o painel "
              "aberto ou fechado: entre parênteses, o que o último turno somou.")

# 14 --------------------------------------------------------------- quanto custou
s = deck.slide("O cockpit")
deck.cabeca(s, "O cockpit", "Quanto custou cada agente, e cada turno")
wa = 6.2
pa, wa, ha = imagem(s, img(f"{EVID}/aba-agentes.png"), ML, 1.82, w=wa, raio_px=31,
                    alt="A aba Agentes do csr-cockpit com dois subagentes concluídos. O primeiro levou 28 segundos, "
                        "ficou com 16,4 mil tokens de contexto, teve custo atribuído de 4 centavos de dólar e fez 9 "
                        "chamadas. O segundo levou 7,5 segundos, ficou com 13,3 mil tokens, teve custo atribuído de 2 "
                        "centavos e fez 1 chamada.")
wt = LARG - wa - 0.3
bx_ = ML + wa + 0.3
pt_, wt, ht = imagem(s, img(f"{EVID}/aba-turnos.png"), bx_, 1.82, w=wt, raio_px=31,
                     alt="A aba Turnos do csr-cockpit com três turnos de uma sessão que custou 15 centavos de dólar. O "
                         "turno 3 levou 7,5 segundos e custou 2 centavos. O turno 2 levou 9,3 segundos e custou 2 "
                         "centavos. O turno 1, que rodou dois agentes em segundo plano, levou 27 segundos, teve 2 "
                         "falhas, custou 11 centavos e usou 13 ferramentas.")
# A caneta sobre os prints escuros usa a cor da caneta do tema escuro; as posições são pixels de cada print.
ka = wa / 2280
for (x0, x1, y0_, y1_), sd in (((1172, 1358, 543, 581), 21), ((1195, 1382, 732, 771), 22)):
    circulo(s, cx=ML + (x0 + x1) / 2 * ka, cy=1.82 + (y0_ + y1_) / 2 * ka, rx=(x1 - x0) / 2 * ka + 0.09,
            ry=(y1_ - y0_) / 2 * ka + 0.07, cor=E_CANETA, lw=1.7, seed=sd)
kt = wt / 2280
circulo(s, cx=bx_ + (376 + 796) / 2 * kt, cy=1.82 + (291 + 331) / 2 * kt, rx=(796 - 376) / 2 * kt + 0.1,
        ry=(331 - 291) / 2 * kt + 0.07, cor=E_CANETA, lw=1.7, seed=23)
c11 = (bx_ + (120 + 306) / 2 * kt, 1.82 + (1046 + 1085) / 2 * kt)
circulo(s, cx=c11[0], cy=c11[1], rx=(306 - 120) / 2 * kt + 0.09, ry=(1085 - 1046) / 2 * kt + 0.07, cor=E_CANETA,
        lw=1.7, seed=24)
nota(s, bx_ + 0.62, 1.82 + ht + 0.1, wt - 0.6, "o custo do turno: o fim menos o começo", tam=18)
seta(s, curva((bx_ + 0.56, 1.82 + ht + 0.26), (c11[0] - 0.05, 1.82 + ht + 0.28), (c11[0], 1.82 + ht + 0.04)), ponta=0.07)
sy = 1.82 + max(ha, ht) + 0.62
cw3 = (LARG - 2 * 0.3) / 3
for i, (valor, rotulo) in enumerate((("US$ 0,04", "o primeiro agente: 28 s, 9 chamadas, 16,4 mil tokens de contexto"),
                                     ("US$ 0,02", "o segundo agente: 7,5 s, 1 chamada, 13,3 mil tokens de contexto"),
                                     ("US$ 0,15", "a sessão inteira; US$ 0,09 ficaram com a conversa principal"))):
    numero_grande(s, ML + i * (cw3 + 0.3), sy, cw3, valor, rotulo, cor=LIVRO if i < 2 else INK)
deck.notas(s, "A aba Agentes responde à primeira pergunta do post. O custo de cada agente é a parte do custo da sessão "
              "que o cockpit atribuiu a ele: na sessão das imagens, US$ 0,04 para um agente e US$ 0,02 para o outro. "
              "A aba Turnos responde à segunda: cada pedido é um turno, e o custo do turno também é conta do cockpit, "
              "o quanto o custo da sessão subiu do começo ao fim do pedido. A sessão inteira custou US$ 0,15; o que "
              "não foi para agente nenhum é o gasto da conversa principal.")

# 15 --------------------------------------------------------------- só observar (escuro)
s = deck.slide("O cockpit", escuro=True)
deck.cabeca(s, "O cockpit", "A regra do cockpit é só observar.", escuro=True, tam=38, y=1.22, w=LARG - 0.6)
s.shapes.title.left = Inches(ML + 0.3)
d = escrever(s, ML + 0.3, 2.02, LARG - 0.9,
             ["Nenhum hook dele bloqueia ou altera uma chamada de ferramenta ou uma resposta do modelo: o evento passa "
              "adiante como chegou, e o resultado volta como veio."], dict(f=TEXTO, s=19, c=E_INK2), pitch=27)
moldura(s, ML + 0.02, 0.98, LARG - 0.04, d.fim - 0.98 + 0.32, cor=E_CANETA, lw=1.6)
ZEROS = [("chamadas de rede", "Do disco, só lê o conteúdo antigo de um arquivo antes de uma escrita, para o diff.", {}),
         ("arquivos gravados", "O que ele registra fica no estado da sessão e some com ela.", {}),
         ("tokens gastos", "O mod não chama o modelo. Só o botão “{ce:Contagem exata}” dispara requisições, e quem as faz "
                           "é o Claude Code.", {"ce": "circulo"})]
zy = d.fim + 0.85
zw = (LARG - 2 * 0.45) / 3
for i, (rot_, txt, mk) in enumerate(ZEROS):
    zx = ML + 0.3 + i * (zw + 0.45)
    escrever(s, zx, zy, 1.0, ["0"], dict(f=TITULO, s=64, c=E_INK, b=True), pitch=70)
    escrever(s, zx + 0.72, zy + 0.38, zw - 0.75, [rot_], dict(f=UI, s=16, c=E_INK, b=True), pitch=19)
    escrever(s, zx, zy + 1.18, zw - 0.25, [txt], dict(f=TEXTO, s=14, c=E_INK2), pitch=20, marcas=mk, caneta=E_CANETA)
deck.notas(s, "A regra do cockpit é só observar. Nenhum hook dele bloqueia ou altera uma chamada de ferramenta ou uma "
              "resposta do modelo. Ele não faz chamada de rede e não grava arquivo. Do disco, lê uma coisa só: o "
              "conteúdo antigo de um arquivo antes de uma escrita, para o diff mostrar o que mudou de verdade. Nada "
              "nele gasta token, porque o mod não chama o modelo. A única coisa que dispara requisições a mais é o "
              "botão Contagem exata, da aba Contexto, que troca a estimativa local pela contagem de verdade; quem faz "
              "as requisições é o Claude Code, e só quando eu aperto o botão.")

# 16 --------------------------------------------------------------- como se testa
s = deck.slide("Limites e repositório")
deck.cabeca(s, "Como se testa um mod", "Três camadas, da mais barata à mais cara")
CAMADAS = [("camada 1", "sem executar nada", "claude plugin validate",
            ["Confere o manifesto e lista os eventos que o mod escuta e as chamadas que faz à API.",
             "{au:Serve para auditar o mod de outra pessoa antes de instalar.}",
             "No cockpit, a lista não tem rede, gravação de arquivo nem processo."], {"au": "grifo"}),
           ("camada 2", "sem login e sem rede", "claude plugin test",
            ["Roda os testes contra um Claude Code de mentira: dispara os eventos, monta o painel, aperta os botões e "
             "confere o que foi desenhado.",
             "O cockpit tem 15 testes; um deles confere a regra de só observar."], {}),
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
carimbo(s, ML + (kw + 0.32) + 0.25, 1.9 + KH - 0.95, kw - 0.5, "rodado em 02/10/2026: 15 de 15")
deck.notas(s, "Testei o cockpit em três camadas, da mais barata para a mais cara. O validate, num mod, lista os "
              "eventos que ele escuta e as chamadas que faz à API, sem executar nada; serve também para auditar o mod "
              "de outra pessoa antes de instalar. O test roda os testes contra um Claude Code de mentira, sem login e "
              "sem rede: o cockpit tem 15 testes, e os 15 passaram em 02/10/2026. E a sessão de verdade, com o mod "
              "carregado por --plugin-dir: a pasta fica vigiada, e o mod recarrega a cada arquivo salvo.")

# 17 --------------------------------------------------------------- o que ainda não dá
s = deck.slide("Limites e repositório")
deck.cabeca(s, "O que ainda não dá", "Os limites da versão 0.5.0")
lw17 = 6.35
d = escrever(s, ML, 1.95, lw17, ["{mk:O custo por agente não é um número oficial.}"],
             dict(f=TITULO, s=25, c=INK, b=True), pitch=31, marcas={"mk": "marca"})
escrever(s, ML, d.fim + 0.3, lw17,
         ["O Claude Code informa o custo da sessão inteira. O cockpit reparte: ao fim de cada resposta do modelo, o "
          "que o custo da sessão subiu vai para quem deu a resposta. Nada é contado duas vezes, e o que não vai para "
          "agente nenhum é a conversa principal.",
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
           ("No aplicativo de desktop, não conferi.", "Ele traz a própria cópia do Claude Code.")]
lh3 = 0.84
topo3 = 1.85 + 0.62 + 0.05
ficha_pautada(s, fx, 1.85, fw17, 0.67 + len(LIMITES) * lh3 + 0.06, "Os outros limites",
              [topo3 + (k + 1) * lh3 for k in range(len(LIMITES) - 1)])
for k, (a, b) in enumerate(LIMITES):
    ry = topo3 + k * lh3
    escrever(s, fx + 0.26, ry + 0.14, fw17 - 0.45, [a], dict(f=UI, s=13, c=INK, b=True), pitch=16)
    escrever(s, fx + 0.26, ry + 0.44, fw17 - 0.45, [b], dict(f=TEXTO, s=12.5, c=INK2), pitch=16)
deck.notas(s, "São os limites da versão 0.5.0, em 02/10/2026. O mais importante: o custo por agente não é um número "
              "oficial. O Claude Code informa o custo da sessão inteira, e o cockpit reparte: ao fim de cada resposta "
              "do modelo, o que o custo da sessão subiu vai para quem deu a resposta. Nada é contado duas vezes, e o "
              "resto é o gasto da conversa principal: na sessão das imagens, os dois agentes ficaram com US$ 0,06 dos "
              "US$ 0,15. Se duas respostas terminam no mesmo instante, uma fração pode cair no agente vizinho. E o "
              "valor em dólar é uma estimativa a preço de tabela: para quem paga assinatura, não é cobrança, e serve "
              "para comparar um agente com outro.")

# 18 --------------------------------------------------------------- o repositório
s = deck.slide("Limites e repositório")
deck.cabeca(s, "O repositório", "O `claude-code-kit`: público, com licença MIT")
escrever(s, ML, 1.47, LARG, ["github.com/cesarschutz/claude-code-kit"], dict(f=MONO, s=13, c=ACENTO), pitch=17,
         nome="Endereço do repositório")
escrever(s, ML, 2.05, 6.5, ["Em 02/10/2026, ele tem:"], dict(f=TEXTO, s=16, c=INK2), pitch=21)
y0_ = 2.5
d = escrever(s, ML + 0.3, y0_, 6.2,
             ["o `csr-cockpit`, na versão 0.5.0;",
              "o `exemplos`, um plugin com uma skill, um agente, um hook e um estilo de saída;",
              "sete peças avulsas: duas skills, dois agentes, um estilo de saída, um tema e um hook."],
             dict(f=TEXTO, s=17, c=INK, codigo=dict(c=INK)), pitch=23, depois=8)
yy = y0_
for par in d.pars:
    escrever(s, ML + 0.02, yy, 0.25, ["–"], dict(f=TEXTO, s=17, c=INK3), pitch=23)
    yy += len(par["linhas"]) * par["pitch"] / 72 + par["depois"] / 72
chave(s, ML + 0.3 + 6.25, y0_ + 0.02, d.fim + 0.02)
nota(s, ML + 0.3 + 6.25 + 0.26, (y0_ + d.fim) / 2 - 0.2, 2.2, "cada linha instala sozinha", tam=20)
dr = escrever(s, ML, d.fim + 0.28, LARG,
              ["O `README.md` explica o catálogo, e o `CONTRIBUTING.md`, como acrescentar um item."],
              dict(f=TEXTO, s=14, c=INK2, codigo=dict(c=INK)), pitch=19)
postit(s, W - MR - 3.05, 2.05, 2.95, 1.75,
       "Se o `/cockpit` não aparecer depois de instalar, confira a versão com\n`claude --version`.", rot=2.2, tam=20)
fita(s, W - MR - 3.05 + 1.47, 2.06, w=0.95, h=0.27, rot=-3)
dl = escrever(s, ML, dr.fim + 0.36, LARG, ["Para instalar o cockpit são dois comandos, e ele pede o Claude Code 2.1.287 "
                                           "ou mais novo:"], dict(f=TEXTO, s=15, c=INK), pitch=20)
codigo(s, ML, dl.fim + 0.16, LARG, "Terminal",
       [[("claude plugin marketplace add ", I_), ("cesarschutz/claude-code-kit", S_)],
        [("claude plugin install ", I_), ("csr-cockpit@cesarschutz", S_)]], tam=14, pitch=22)
deck.notas(s, "O claude-code-kit é público, com licença MIT. Tem o csr-cockpit, na versão 0.5.0, o plugin exemplos, "
              "com uma skill, um agente, um hook e um estilo de saída, e sete peças avulsas; cada uma se instala "
              "sozinha. Para instalar o cockpit são dois comandos, e ele pede o Claude Code 2.1.287 ou mais novo. Se "
              "o /cockpit não aparecer, confira a versão com claude --version. O README explica o catálogo, e o "
              "CONTRIBUTING, como acrescentar um item.")

# 19 --------------------------------------------------------------- para ir além
s = deck.slide("Limites e repositório")
deck.cabeca(s, "Fontes", "Para ir além do básico")
d = escrever(s, ML + 0.55, 1.95, 7.3,
             ["Eu começaria pela página **Extend Claude Code**, que compara as peças e diz quando usar cada uma, e "
              "pelos **mods de exemplo** da Anthropic."], dict(f=TEXTO, s=19, c=INK), pitch=27)
visto(s, ML, 2.0, s=1.0)
d = escrever(s, ML + 0.55, d.fim + 0.25, 7.3,
             ["code.claude.com/docs/en/features-overview",
              "github.com/anthropics/claude-code-playground › claude-code/mods"],
             dict(f=MONO, s=12, c=ACENTO), pitch=18, depois=4)
escrever(s, ML, d.fim + 0.55, 7.8, ["As fontes do post"], dict(f=UI, s=13, c=INK, b=True), pitch=16)
escrever(s, ML, d.fim + 0.9, 7.8,
         ["Anthropic: Claude 3.7 Sonnet and Claude Code (o lançamento, 24/02/2025)",
          "Claude: Claude Code mods (01/10/2026), os plugins (09/10/2025) e as Agent Skills (16/10/2025)",
          "Claude Code: o changelog, o CHANGELOG.md no GitHub e as versões no npm",
          "Documentação: plugins, marketplaces, mods (overview, create, test) e custos",
          "Cesar Schutz: o claude-code-kit e o README do csr-cockpit"],
         dict(f=UI, s=12, c=INK2), pitch=15.5, depois=5)
imagem(s, img("do-livro.png"), W - MR - 2.75, 1.7, w=2.75,
       alt="A ficha Do livro: o livro IA, Volume 04, com 1 artigo, e o link Ver o livro.")
escrever(s, W - MR - 3.6, 6.12, 3.6, [SITE], dict(f=MONO, s=12, c=INK2), pitch=15, alinhar="r")
imagem(s, img("marca.png"), W - MR - 2.3, 6.5, w=2.3, alt="Cesar Schutz, blog")
deck.notas(s, "Para ir além do básico, eu começaria pela página Extend Claude Code, que compara as peças e diz quando "
              "usar cada uma, e pelos mods de exemplo da Anthropic. As fontes completas, com os links, estão no fim "
              "do post, no blog.")

deck.salvar()
