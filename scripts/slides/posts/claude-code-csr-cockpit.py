"""A apresentação da parte 2 do post dos mods (D74): "Um mod do Claude Code na prática — instalação, testes e
limites (parte 2 de 2)". Os slides do cockpit, do marketplace, dos comandos, dos testes e dos limites vieram
da primeira versão, aprovada pelo Cesar em 02/10/2026, com o texto da parte 2.

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
pic, iw, ih = imagem(s, img(f"{EVID}/cockpit.png"), 5.55, 1.9, w=LARG - (5.55 - ML), raio_px=31,
                     alt="A tela do Claude Code com o painel do csr-cockpit aberto ao lado da conversa. A aba Agentes "
                         "mostra dois subagentes rodando, cada um com o modelo, o tempo, o tamanho do contexto e o "
                         "custo atribuído até ali, de 2 e de 1 centavo de dólar. Acima do prompt, a linha de resumo "
                         "mostra o contexto usado e o custo da sessão.")
escrever(s, 5.55, 1.9 + ih + 0.14, LARG - (5.55 - ML),
         ["O csr-cockpit ao lado da conversa: um desenho com os textos e os números de uma sessão real "
          "(Claude Code 2.1.287, modelo Haiku 4.5)."], dict(f=UI, s=11.5, c=INK2), pitch=15, nome="Legenda")
deck.notas(s, "Agente, aqui, é o subagente: o ajudante que o Claude Code chama para cuidar de uma parte da tarefa. "
              "Turno é cada pedido feito na sessão, com tudo o que ele desencadeia. Sem um mod, o /usage mostra o "
              "custo da sessão inteira e, nos planos pagos, a fatia dos subagentes em percentual; quanto custou cada "
              "agente, ou cada turno, ele não diz. O cockpit faz essa conta, e ela é uma estimativa dele.")

# 3 ---------------------------------------------------------------- cinco abas
s = deck.slide("O cockpit")
deck.cabeca(s, "O que o cockpit mostra", "Cinco abas, cinco perguntas")
escrever(s, ML, 1.5, LARG, ["O painel abre e fecha com `/cockpit`."],
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
         ["A linha de resumo, uma faixa acima do prompt, com o painel aberto ou fechado: entre parênteses, o que o "
          "último turno somou. Não é a linha de status do rodapé."], dict(f=UI, s=11.5, c=INK2), pitch=15, nome="Legenda")
deck.notas(s, "O painel abre e fecha com /cockpit e tem cinco abas, e cada uma responde a uma pergunta. Clicar no nome "
              "de um agente, de um comando Bash ou de um turno abre o detalhe: o pedido, as chamadas e a resposta. E "
              "acima do prompt, a caixa onde se digita o pedido, o cockpit desenha uma faixa, a linha de resumo, que "
              "fica ali com o painel aberto ou fechado. Ela não é a linha de status do rodapé, que é outra peça do "
              "Claude Code.")

# 4 ---------------------------------------------------------------- quanto custou
s = deck.slide("O cockpit")
deck.cabeca(s, "O que o cockpit mostra", "Quanto custou cada agente, e cada turno")
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
deck.notas(s, "Na aba Agentes, cada agente aparece com o custo atribuído a ele: na sessão das imagens, US$ 0,04 para "
              "um agente e US$ 0,02 para o outro. Na aba Turnos, cada pedido aparece com o que custou e o que "
              "desencadeou. O custo do turno também é conta do cockpit: quanto o custo da sessão subiu do começo ao "
              "fim do pedido. A sessão inteira custou US$ 0,15; o que não foi para agente nenhum é o gasto da "
              "conversa principal.")

# 5 ---------------------------------------------------------------- só observar (escuro)
s = deck.slide("O cockpit", escuro=True)
deck.cabeca(s, "O que o cockpit mostra", "A regra do cockpit é só observar.", escuro=True, tam=38, y=1.22,
            w=LARG - 0.6)
s.shapes.title.left = Inches(ML + 0.3)
d = escrever(s, ML + 0.3, 2.02, LARG - 0.9,
             ["Nenhum hook do cockpit bloqueia ou altera uma chamada de ferramenta ou uma resposta do modelo: o evento "
              "passa adiante como chegou, e o resultado volta como veio."], dict(f=TEXTO, s=19, c=E_INK2), pitch=27)
moldura(s, ML + 0.02, 0.98, LARG - 0.04, d.fim - 0.98 + 0.32, cor=E_CANETA, lw=1.6)
ZEROS = [("chamadas de rede", "Do disco, só lê o conteúdo antigo de um arquivo antes de uma escrita, para o diff.", {}),
         ("arquivos gravados", "O que ele registra fica no estado da sessão e some com ela.", {}),
         ("tokens gastos", "O mod não chama o modelo. A exceção é o botão\n“{ce:Contagem exata}”: apertado, o Claude "
                           "Code faz requisições a mais.", {"ce": "circulo"})]
zy = d.fim + 0.85
zw = (LARG - 2 * 0.45) / 3
for i, (rot_, txt, mk) in enumerate(ZEROS):
    zx = ML + 0.3 + i * (zw + 0.45)
    escrever(s, zx, zy, 1.0, ["0"], dict(f=TITULO, s=64, c=E_INK, b=True), pitch=70)
    escrever(s, zx + 0.72, zy + 0.38, zw - 0.75, [rot_], dict(f=UI, s=16, c=E_INK, b=True), pitch=19)
    escrever(s, zx, zy + 1.18, zw - 0.25, [txt], dict(f=TEXTO, s=14, c=E_INK2), pitch=20, marcas=mk, caneta=E_CANETA)
deck.notas(s, "A regra do cockpit é só observar. Um mod liga funções aos eventos do Claude Code, e a documentação "
              "chama cada uma de hook; nenhum hook do cockpit bloqueia ou altera uma chamada de ferramenta ou uma "
              "resposta do modelo. Ele não faz chamada de rede e não grava arquivo. Do disco, lê só o conteúdo antigo "
              "de um arquivo antes de uma escrita, para o diff. O mod não chama o modelo, então não gasta token por "
              "conta própria; a exceção é o botão Contagem exata, da aba Contexto.")

# 6 ---------------------------------------------------------------- marketplace
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

# 7 ---------------------------------------------------------------- dois nomes, dois comandos
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

# 8 ---------------------------------------------------------------- a lousa
s = deck.slide("Instalar")
deck.cabeca(s, "Como instalar: o marketplace", "Instalar e atualizar, em cinco passos")
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
deck.notas(s, "Instalar e atualizar seguem estes cinco passos, do repositório no GitHub à sessão aberta na máquina. O "
              "marketplace add clona o catálogo, que passa a ser conhecido pelo name dele, cesarschutz. O install "
              "copia a pasta inteira do item, na versão do plugin.json. Commits novos não chegam a quem instalou "
              "enquanto o version não sobe; quando sobe, o update traz a pasta nova, e a sessão que já estava aberta "
              "segue na versão antiga até o /reload-plugins. Sem o campo version, a versão é o commit.")

# 9 ---------------------------------------------------------------- os comandos
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

# 10 --------------------------------------------------------------- como se testa
s = deck.slide("Testes e limites")
deck.cabeca(s, "Como se testa um mod", "Três camadas, da mais barata à mais cara")
CAMADAS = [("camada 1", "sem executar nada", "claude plugin validate",
            ["Confere o manifesto e lista os eventos que o mod escuta e as chamadas que faz à API dos mods.",
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
deck.notas(s, "Um mod se testa em três camadas, da mais barata para a mais cara. O validate lista os eventos que o mod "
              "escuta e as chamadas que ele faz, sem executar nada, e serve para auditar o mod de outra pessoa antes "
              "de instalar. O test roda os testes contra um Claude Code de mentira, sem login e sem rede: o cockpit "
              "tem 15 testes, e os 15 passaram em 02/10/2026. A sessão de verdade, com o --plugin-dir, é a única que "
              "mostra o painel desenhado no terminal.")

# 11 --------------------------------------------------------------- os limites
s = deck.slide("Testes e limites")
deck.cabeca(s, "Os limites do csr-cockpit", "Os limites da versão 0.5.0")
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
           ("No desktop, depende da versão.", "Em 02/10/2026, o app trazia o Claude Code 2.1.284, anterior aos mods.")]
lh3 = 0.84
topo3 = 1.85 + 0.62 + 0.05
ficha_pautada(s, fx, 1.85, fw17, 0.67 + len(LIMITES) * lh3 + 0.06, "Os outros limites",
              [topo3 + (k + 1) * lh3 for k in range(len(LIMITES) - 1)])
for k, (a, b) in enumerate(LIMITES):
    ry = topo3 + k * lh3
    escrever(s, fx + 0.26, ry + 0.14, fw17 - 0.45, [a], dict(f=UI, s=13, c=INK, b=True), pitch=16)
    escrever(s, fx + 0.26, ry + 0.44, fw17 - 0.45, [b], dict(f=TEXTO, s=12.5, c=INK2), pitch=16)
deck.notas(s, "Os limites são da versão 0.5.0, em 02/10/2026. O mais importante: o custo por agente não é um número "
              "oficial. O Claude Code informa o custo da sessão inteira, e o cockpit reparte: na sessão das imagens, "
              "os dois agentes ficaram com US$ 0,06 dos US$ 0,15. O valor em dólar é uma estimativa a preço de "
              "tabela, que não é cobrança para quem paga assinatura. No aplicativo de desktop, depende da versão "
              "que ele traz: em 02/10/2026, a do macOS trazia o Claude Code 2.1.284, anterior aos mods oficiais.")

# 12 --------------------------------------------------------------- o repositório
s = deck.slide("O repositório")
deck.cabeca(s, "O repositório claude-code-kit", "O `claude-code-kit`: público, com licença MIT")
escrever(s, ML, 1.47, LARG, ["github.com/cesarschutz/claude-code-kit"], dict(f=MONO, s=13, c=ACENTO), pitch=17,
         nome="Endereço do repositório")
escrever(s, ML, 2.15, 6.5, ["Em 02/10/2026, ele tem:"], dict(f=TEXTO, s=17, c=INK2), pitch=22)
y0_ = 2.7
d = escrever(s, ML + 0.3, y0_, 6.6,
             ["o `csr-cockpit`, na versão 0.5.0;",
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
deck.notas(s, "O claude-code-kit é público, com licença MIT. Em 02/10/2026, tem o csr-cockpit, na versão 0.5.0, o "
              "plugin exemplos, com uma skill, um agente, um hook e um estilo de saída, e sete peças avulsas; cada "
              "uma se instala sozinha. O README explica o catálogo, e o CONTRIBUTING, como acrescentar um item.")

# 13 --------------------------------------------------------------- fecho
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
