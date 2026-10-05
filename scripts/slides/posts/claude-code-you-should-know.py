"""A apresentação do post "You should know do Claude Code — como funciona, como ligar e limites" (D74).
O post é detalhado: 20 slides, na ordem dele, com a capa, as duas figuras (a checagem em três raias e a nota na
tela, em três quadros) e a caneta do post nos mesmos trechos e tipos (as 19 marcações dele).

    node scripts/slides/capturar.mjs claude-code-you-should-know --base http://127.0.0.1:<porta do dev>
    python3 scripts/slides/posts/claude-code-you-should-know.py
    python3 scripts/slides/conferir.py claude-code-you-should-know
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from estilo import *  # noqa: E402,F403

SLUG = "claude-code-you-should-know"
deck = Deck(SLUG, "You should know do Claude Code: como funciona, como ligar e limites")
img = deck.imagem
LIVRO = deck.livro["cor"]
T = dict(f=TEXTO, s=16, c=INK, codigo=dict(c=INK))
K, S_, P_, I_ = COD_CHAVE, COD_TEXTO, COD_PONTO, COD_NOME
ID = "cc-plugin-you-should-know@builtin"

# A segunda figura do post (figura-2.png, 1896 × 2750 px): os três quadros, recortados no que é de cada um.
# Do x 100 ao 1544 (antes das setas que ligam os quadros, à direita).
REC_EXPLICACAO = (100, 985, 1896 - 1544, 2750 - 1885)
REC_DISMISS = (100, 1935, 1896 - 1544, 2750 - 2700)


# ---------------------------------------------------------------- avisos de diagramação
_escrever = escrever


def escrever(*args, **kw):  # noqa: F811
    d = _escrever(*args, **kw)
    for mid, tipo in (kw.get("marcas") or {}).items():
        if tipo in ("ondulado", "duplo", "circulo", "caixa") and len(d.marcas.get(mid, [])) > 1:
            print(f"AVISO: a marca {tipo} quebrou a linha: {mid} em {str(args[4])[:60]}")
    for par in d.pars:
        for a, b in zip(par["linhas"], par["linhas"][1:]):
            if a and b and a[-1]["f"] == MONO and b[0]["f"] == MONO:
                print(f"AVISO: um código quebrou a linha: {a[-1]['t']!r} | {b[0]['t']!r}")
    return d


_cabeca = deck.cabeca


def cabeca_uma_linha(s, secao, titulo, **kw):
    d = _cabeca(s, secao, titulo, **kw)
    if len(d.pars[0]["linhas"]) > 1:
        print(f"AVISO: o título quebrou em duas linhas: {titulo}")
    return d


deck.cabeca = cabeca_uma_linha


def um_trecho(d, mid):
    segs = d.marcas.get(mid, [])
    if len(segs) != 1:
        print(f"AVISO: o trecho {mid} ficou em {len(segs)} linhas")
    return segs[-1]


# ---------------------------------------------------------------- as marcas do post que o estilo não traz
def anota(s, seg, texto, tam=18, dx=0.25, dy=0.08, cor=CANETA, xmin=ML, xmax=W - MR):
    """A nota na margem (7): a nota à mão logo abaixo do trecho (que fica na última linha do parágrafo), à
    direita do meio dele quando cabe, e a seta da ponta esquerda da nota até o trecho."""
    xm = (seg["x0"] + seg["x1"]) / 2
    w = larg(texto, MAO, tam, True) + 0.15
    ny = seg["base"] + dy + 0.07
    hy = ny + tam * 1.05 / 72 * 0.55
    nx = max(xmin, min(xm + dx, xmax - w))
    tx = min(max(nx - 0.22, seg["x0"] + 0.12), seg["x1"] - 0.12)
    seta(s, curva((nx - 0.05, hy), (tx + 0.02, hy + 0.01), (tx, seg["base"] + 0.08)), cor=cor, ponta=0.065)
    return nota(s, nx, ny, w, texto, tam=tam, cor=cor)


def sobe(s, seg, cor=CANETA, lw=1.6):
    """A seta de tendência (24): a setinha à mão logo depois do trecho, subindo."""
    em = seg["tam"] / 72
    x, w, h = seg["x1"] + 0.14 * em, 0.5 * em, 0.92 * em
    y0 = seg["base"] + 0.04 * em - h

    def p(px, py):
        return (x + px / 10 * w, y0 + py / 20 * h)
    livre(s, [p(5.2, 18.8), p(5.3, 13), p(4.9, 7.5), p(5, 1.8)], linha=cor, lw=lw, nome="Seta de tendência")
    livre(s, [p(1.6, 5.6), p(5, 1.4), p(8.5, 5.3)], linha=cor, lw=lw, nome="Seta de tendência")


def liga(s, seg, cor=CANETA, lw=1.5):
    """A seta ligando (14): o arco à mão por cima do trecho, da causa à consequência."""
    em = seg["tam"] / 72
    x0, x1 = seg["x0"], seg["x1"]
    pe, topo = seg["base"] - 0.86 * em, seg["base"] - 1.42 * em

    def p(px, py):
        return (x0 + px / 100 * (x1 - x0), topo + py / 14 * (pe - topo))
    pts = [p(2, 13)]
    for i in range(1, 25):
        t = i / 24
        a, b, c, d = (2, 13), (10, 2), (85, 1), (97, 11)
        px = (1 - t) ** 3 * a[0] + 3 * (1 - t) ** 2 * t * b[0] + 3 * (1 - t) * t * t * c[0] + t ** 3 * d[0]
        py = (1 - t) ** 3 * a[1] + 3 * (1 - t) ** 2 * t * b[1] + 3 * (1 - t) * t * t * c[1] + t ** 3 * d[1]
        pts.append(p(px, py))
    livre(s, pts, linha=cor, lw=lw, nome="Seta ligando")
    ponta = 0.075
    ang = math.atan2(pts[-1][1] - pts[-3][1], pts[-1][0] - pts[-3][0])
    xb, yb = pts[-1]
    livre(s, [(xb - ponta * math.cos(ang - 0.5), yb - ponta * math.sin(ang - 0.5)), (xb, yb),
              (xb - ponta * math.cos(ang + 0.5), yb - ponta * math.sin(ang + 0.5))], linha=cor, lw=lw, nome="Seta ligando")


def asterisco(s, x, y, lado=0.22, cor=CANETA, lw=1.6):
    """O asterisco na margem (9): um ponto que vale reler."""
    k = lado / 16
    for a, b, c, d in ((8, 1.5, 8, 14.5), (2.3, 4.8, 13.7, 11.2), (13.7, 4.8, 2.3, 11.2)):
        livre(s, [(x + a * k, y + b * k), (x + c * k, y + d * k)], linha=cor, lw=lw, nome="Asterisco na margem")


def exclamacao(s, x, y, alto=0.5, cor=CANETA, lw=2.1):
    """A exclamação na margem (15): a armadilha."""
    k = alto / 24
    livre(s, [(x + 6.5 * k, y + 2 * k), (x + 6.15 * k, y + 7 * k), (x + 5.85 * k, y + 12 * k), (x + 5.5 * k, y + 16 * k)],
          linha=cor, lw=lw, nome="Exclamação na margem")
    elipse(s, x + 5.5 * k, y + 21.4 * k, 0.022, fundo=cor)


def onda(s, x, y0, y1, cor=CANETA, lw=1.5, amp=0.035, periodo=0.24):
    """A onda da validade (28), na margem, ao longo do parágrafo."""
    n = max(12, int((y1 - y0) / 0.02))
    pts = [(x + amp * math.sin(2 * math.pi * ((y1 - y0) * i / n) / periodo), y0 + (y1 - y0) * i / n) for i in range(n + 1)]
    livre(s, pts, linha=cor, lw=lw, nome="Validade na margem")


def aviso_(s, x, y, w, h, rotulo, pars, cor=NOTA, tipo="nota", tam=14, pitch=None, depois=6):
    """O aviso do site com o ícone do tipo (o círculo com o i da Nota ou o triângulo da Atenção)."""
    retangulo(s, x, y, w, h, raio=0.07, fundo=misturar(FOLHA, cor, 7), linha=cor, lw=0.75, alpha_linha=0.45,
              sombra=SOMBRA, nome=f"Aviso: {rotulo}")
    if tipo == "nota":
        cx, cy = x + 0.36, y + 0.385
        elipse(s, cx, cy, 0.15, fundo=None, linha=cor, lw=1.5)
        livre(s, [(cx, cy - 0.005), (cx, cy + 0.085)], linha=cor, lw=1.5, nome="Ícone do aviso")
        elipse(s, cx, cy - 0.068, 0.014, fundo=cor)
    else:
        tri = [(x + 0.36, y + 0.24), (x + 0.53, y + 0.53), (x + 0.19, y + 0.53)]
        livre(s, tri + [tri[0]], linha=cor, lw=1.5, nome="Ícone do aviso")
        escrever(s, x + 0.3, y + 0.3, 0.12, ["!"], dict(f=UI, s=11, c=cor, b=True), pitch=13, alinhar="c")
    escrever(s, x + 0.72, y + 0.17, 2.5, [rotulo], dict(f=UI, s=13.5, c=cor, b=True), pitch=17)
    d = escrever(s, x + 0.72, y + 0.46, w - 1.0, pars, dict(f=TEXTO, s=tam, c=INK, codigo=dict(c=INK)),
                 pitch=pitch or round(tam * 1.32, 1), depois=depois)
    if d.fim > y + h - 0.12:
        print(f"AVISO: o texto do aviso {rotulo} passa do pé ({d.fim:.2f} > {y + h - 0.12:.2f})")
    return d


def legenda(s, x, y, w, texto):
    return escrever(s, x, y, w, [texto], dict(f=UI, s=11.5, c=INK2, codigo=dict(c=INK)), pitch=15, nome="Legenda")


def bolinhas(s, x, y, w, itens, tam=14.5, pitch=20, gap=0.2, cor_num=None):
    """Os passos numerados, cada número na cor do papel da figura. Cada item: (cor, texto, marcas, folga)."""
    ds = []
    for n, (cor, txt, mk, folga, *wi) in enumerate(itens, 1):
        elipse(s, x + 0.165, y + 0.15, 0.165, fundo=cor_num or cor)
        escrever(s, x, y + 0.035, 0.33, [str(n)], dict(f=UI, s=12.5, c=BRANCO, b=True), pitch=15, alinhar="c")
        d = escrever(s, x + 0.5, y, (wi[0] if wi else w) - 0.5, [txt], dict(f=TEXTO, s=tam, c=INK, codigo=dict(c=INK)),
                     pitch=pitch, marcas=mk)
        ds.append(d)
        y = d.fim + gap + folga
    return y, ds


def pe(y, limite=7.0, onde=""):
    if y > limite:
        print(f"AVISO: {onde} passa do pé ({y:.2f})")


# 1 ---------------------------------------------------------------- capa
s = deck.capa("You should know do Claude Code", "Como funciona, como ligar e limites",
              "Janela de terminal com uma nota colada acima da linha do prompt, com uma estrela e o texto You should "
              "know, e, à parte, um papel com uma lupa, ligado à janela por um fio, observando a conversa.")
deck.notas(s, "O You should know é um mod que vem dentro do Claude Code desde a versão 2.1.287, de 01/10/2026. Ele roda "
              "um agente lateral: enquanto o Claude trabalha numa tarefa longa, ele lê a conversa e, quando acha algo "
              "que você ou o Claude poderiam deixar passar, mostra uma nota acima do prompt. A apresentação segue o "
              "post: o que o mod é, como ligar e desligar, o que acontece a cada checagem, o que aparece na tela, o "
              "que ele consome e os limites.")

# 2 ---------------------------------------------------------------- o que é, em uma frase
s = deck.slide("Abertura")
deck.cabeca(s, "O You should know", "O mod avisa o que passaria despercebido")
lw2 = 6.55
escrever(s, ML, 1.9, lw2,
         ["O **You should know** é um mod que vem dentro do Claude Code desde a versão 2.1.287, de 01/10/2026.",
          "Mod é um plugin com código que roda dentro do programa e pode mudar o que ele faz e o que ele mostra na "
          "tela.",
          "Enquanto o Claude trabalha numa tarefa longa, um agente lateral lê a conversa e, quando acha "
          "{mk:algo que você ou o Claude poderiam deixar passar}, mostra uma nota acima do prompt.",
          "Importa porque, numa tarefa longa, o Claude toma decisões e deixa de explicar coisas que você só veria no "
          "fim."], dict(f=TEXTO, s=17, c=INK), pitch=24.5, depois=11, marcas={"mk": "marca"})
fx2 = ML + lw2 + 0.5
fw2 = W - MR - fx2
ty = ficha(s, fx2, 1.9, fw2, 1.38, "para quem", "", LIVRO)
escrever(s, fx2 + 0.28, ty + 0.2, fw2 - 0.56, ["Quem já usa o Claude Code e quer decidir se liga o mod."],
         dict(f=TEXTO, s=16, c=INK), pitch=22)
ty = ficha(s, fx2, 3.48, fw2, 3.47, "o que ele não é", "", INK3)
d = escrever(s, fx2 + 0.28, ty + 0.2, fw2 - 0.56,
             ["{gr:Ele não é um revisor de código nem um guarda de segurança}, e não é o subagente que o Claude cria "
              "para uma tarefa."], dict(f=TEXTO, s=16, c=INK), pitch=22.5, marcas={"gr": "grifo"})
escrever(s, fx2 + 0.28, d.fim + 0.2, fw2 - 0.56,
         ["A apresentação não traz o print de uma nota real: o mod não foi ligado numa sessão de teste, e os exemplos "
          "de nota são ilustrativos."], dict(f=TEXTO, s=14, c=INK2), pitch=19.5)
deck.notas(s, "O You should know é um mod embutido no Claude Code desde a 2.1.287, de 01/10/2026; mod é um plugin com "
              "código que roda dentro do programa e pode mudar o que ele faz e o que ele mostra na tela. Enquanto o "
              "Claude trabalha numa tarefa longa, um agente lateral lê a conversa e, quando acha algo que você ou o "
              "Claude poderiam deixar passar, mostra uma nota acima do prompt. Importa porque, numa tarefa longa, o "
              "Claude toma decisões e deixa de explicar coisas que você só veria no fim. O mod não é um revisor de "
              "código nem um guarda de segurança, e os exemplos de nota da apresentação são ilustrativos.")

# 3 ---------------------------------------------------------------- embutido, com um agente lateral
s = deck.slide("O que é")
deck.cabeca(s, "O que é o You should know", "Um mod embutido, com um agente lateral")
lw3 = 6.6
escrever(s, ML, 1.9, lw3,
         ["A documentação lista o You should know na tabela dos mods embutidos, com o nome "
          "`cc-plugin-you-should-know`.",
          "Embutido quer dizer que ele vem com o programa: {gr:não se instala, não se atualiza e não se desinstala à "
          "parte}."], dict(f=TEXTO, s=17, c=INK, codigo=dict(s=15, c=INK)), pitch=24.5, depois=11,
         marcas={"gr": "grifo"})
fx3 = ML + lw3 + 0.5
fw3 = W - MR - fx3
ty = ficha(s, fx3, 1.9, fw3, 2.32, "o id completo", "", LIVRO)
escrever(s, fx3 + 0.28, ty + 0.24, fw3 - 0.5, [f"`{ID}`"], dict(f=TEXTO, s=15, c=INK, codigo=dict(s=13.5, c=INK)),
         pitch=19)
escrever(s, fx3 + 0.28, ty + 0.66, fw3 - 0.56,
         ["O identificador diz “plugin” porque mod é um plugin com código; `builtin` fica no lugar do marketplace, o "
          "catálogo de onde vêm os plugins instalados."], dict(f=TEXTO, s=13.5, c=INK2, codigo=dict(c=INK)), pitch=18.5)
fw3b = (LARG - 0.35) / 2
for i, (esq, dir_, cor, txt, mk) in enumerate((
        ("subagente", "o ajudante do Claude", AZUL,
         "Recebe um pedido, trabalha numa conversa à parte, com as ferramentas dele, e devolve um resumo ao Claude.",
         {}),
        ("agente lateral", "o do You should know", PETROLEO,
         "Uma pergunta extra feita sobre a mesma conversa, {on:só para avisar você}. Não executa nada e não devolve "
         "nada ao Claude.", {"on": "ondulado"}))):
    fx = ML + i * (fw3b + 0.35)
    ty = ficha(s, fx, 4.55, fw3b, 2.05, esq, dir_, cor)
    escrever(s, fx + 0.28, ty + 0.25, fw3b - 0.56, [txt], dict(f=TEXTO, s=17, c=INK), pitch=24, marcas=mk)
deck.notas(s, "Algumas funções do próprio Claude Code são mods, e a documentação as lista na tabela dos mods embutidos; "
              "o You should know está lá como cc-plugin-you-should-know. Embutido quer dizer que ele vem com o "
              "programa: não se instala, não se atualiza e não se desinstala à parte. O id completo é "
              "cc-plugin-you-should-know@builtin, com builtin no lugar do marketplace. E dois termos parecidos: o "
              "subagente é o ajudante que o Claude cria para uma tarefa e que devolve um resumo a ele; o agente lateral "
              "é uma pergunta extra sobre a mesma conversa, só para avisar você.")

# 4 ---------------------------------------------------------------- a linha do tempo
s = deck.slide("O que é")
deck.cabeca(s, "O que é o You should know", "Entrou na 2.1.287, junto com os mods")
lw4 = 7.1
escrever(s, ML, 1.9, lw4,
         ["Na 2.1.288, as notas passaram a dizer “we”, “the main agent” ou “you”, conforme quem tomou a decisão.",
          "A 2.1.289, a mais nova em 04/10/2026, não traz nenhuma linha sobre ele no changelog; pelo código, a única "
          "mudança em relação à 2.1.288 foi um `0: Dismiss` a mais na pergunta de retorno."],
         dict(f=TEXTO, s=15.5, c=INK, codigo=dict(c=INK)), pitch=22, depois=10)
escada(s, [("Entrou com os mods", "01/10/2026", "2.1.287"), ("As notas dizem quem decidiu", "02/10/2026", "2.1.288"),
           ("Sem linha no changelog", "03/10/2026", "2.1.289")], ML + 0.1, 6.75, lw4 - 0.2, 0.72, destaque=LIVRO,
       resposta=None)
fx4 = ML + lw4 + 0.5
fw4 = W - MR - fx4
ty = ficha(s, fx4, 1.9, fw4, 4.85, "o código", "não é público", INK3)
escrever(s, fx4 + 0.28, ty + 0.22, fw4 - 0.56,
         ["A documentação diz que o código de alguns embutidos está na pasta `mods` do repositório do Claude Code.",
          "Em 04/10/2026, lá há quatro: `agents-md`, `diff`, `sec-default` e `telemetry`.",
          "O funcionamento interno descrito aqui vem da documentação da API de mods e do código do programa "
          "instalado."], dict(f=TEXTO, s=14.5, c=INK, codigo=dict(c=INK)), pitch=20.5, depois=10)
deck.notas(s, "A linha do tempo é curta. O mod entrou na 2.1.287, de 01/10/2026, a mesma versão que lançou os mods. Na "
              "2.1.288, de 02/10/2026, as notas passaram a dizer we, the main agent ou you, conforme quem tomou a "
              "decisão. A 2.1.289, de 03/10/2026 e a mais nova em 04/10/2026, não traz nenhuma linha sobre ele no "
              "changelog; pelo código, mudou só um 0: Dismiss a mais na pergunta de retorno. O código dele não é "
              "público: a pasta mods do repositório tem quatro embutidos, e o You should know não está entre eles.")

# 5 ---------------------------------------------------------------- vem desligado
s = deck.slide("Como ligar e desligar")
deck.cabeca(s, "Como ligar e desligar", "Vem desligado, e nem toda conta o vê")
lw5 = 6.3
escrever(s, ML, 2.0, lw5,
         ["Os mods em geral vêm ligados por padrão e pedem o Claude Code 2.1.287 ou mais novo.",
          "O You should know é {on:a exceção}: **vem desligado**.",
          "E nem toda conta o vê. Nenhuma das duas fontes ao lado lista o critério completo."],
         dict(f=TEXTO, s=20, c=INK), pitch=28.5, depois=16, marcas={"on": "ondulado"})
fx5 = ML + lw5 + 0.5
fw5 = W - MR - fx5
ty = ficha(s, fx5, 1.95, fw5, 1.95, "a documentação", "Mods overview", LIVRO)
escrever(s, fx5 + 0.28, ty + 0.25, fw5 - 0.56, ["Diz que ele aparece “if available for your org”."],
         dict(f=TEXTO, s=17, c=INK), pitch=24)
ty = ficha(s, fx5, 4.15, fw5, 2.35, "o changelog", "2.1.287", LIVRO)
escrever(s, fx5 + 0.28, ty + 0.25, fw5 - 0.56,
         ["Diz que ele vale para sessões first-party (ou seja, direto na Anthropic) com a telemetria ligada."],
         dict(f=TEXTO, s=17, c=INK), pitch=24)
deck.notas(s, "Os mods em geral vêm ligados por padrão e pedem o Claude Code 2.1.287 ou mais novo. O You should know é a "
              "exceção: vem desligado. E nem toda conta o vê: a documentação diz que ele aparece if available for your "
              "org, e o changelog da 2.1.287 diz que ele vale para sessões first-party, direto na Anthropic, com a "
              "telemetria ligada. Nenhuma das duas fontes lista o critério completo.")

# 6 ---------------------------------------------------------------- ligar e desligar
s = deck.slide("Como ligar e desligar")
deck.cabeca(s, "Como ligar e desligar", "O `/plugin enable` liga, e o `/plugin` desliga")
TAM6 = 16
c6 = codigo(s, ML, 1.78, LARG, "no prompt do Claude Code",
            [[("/plugin enable ", K), (ID, I_)], [("/plugin disable ", K), (ID, I_)]], tam=TAM6, pitch=27)
for k, (cmd, txt) in enumerate((("/plugin enable ", "liga"), ("/plugin disable ", "desliga"))):
    fim = c6["texto_x"] + larg(cmd + ID, MONO, TAM6)
    ly = c6["topo"] + k * c6["pin"]
    nota(s, fim + 0.55, ly - 0.02, 1.4, txt, tam=21)
    seta(s, curva((fim + 0.5, ly + c6["pin"] / 2), (fim + 0.32, ly + c6["pin"] / 2 + 0.02), (fim + 0.12, ly + c6["pin"] / 2)),
         ponta=0.065)
y6 = c6["y"] + c6["h"] + 0.35
lw6 = 6.45
escrever(s, ML, y6, lw6,
         ["O `/plugin enable` abre a aba **Installed** já no plugin e o liga. O outro caminho é à mão: `/plugin`, aba "
          "**Installed**, **Show disabled**, e ligar o You should know na lista.",
          "Pelo código da 2.1.289, o `/plugin disable` é o comando que o próprio mod escreve no seu prompt quando "
          "você pede para desligar pela nota."], dict(f=TEXTO, s=15.5, c=INK, codigo=dict(c=INK)), pitch=22,
         depois=10)
fx6 = ML + lw6 + 0.45
fw6 = W - MR - fx6
ty = ficha(s, fx6, y6, fw6, 7.0 - y6 - 0.2, "settings.json", "enabledPlugins", LIVRO)
escrever(s, fx6 + 0.28, ty + 0.22, fw6 - 0.56,
         ["O ligado e o desligado ficam gravados na chave `enabledPlugins`, que o Claude Code escreve sozinho quando "
          "você usa o `/plugin`.",
          "{gr:Sem entrada ali, vale o padrão do plugin}, que neste caso é desligado."],
         dict(f=TEXTO, s=15.5, c=INK, codigo=dict(c=INK)), pitch=22, depois=10, marcas={"gr": "grifo"})
deck.notas(s, "Se o mod estiver disponível, há dois caminhos para ligar dentro de uma sessão: o /plugin enable com o id "
              "completo, que abre a aba Installed já no plugin e o liga, ou à mão, pelo /plugin, aba Installed, Show "
              "disabled. Para desligar, o mesmo /plugin ou o /plugin disable, que é o comando que o próprio mod escreve "
              "no prompt quando você pede para desligar pela nota. O ligado e o desligado ficam na chave enabledPlugins "
              "do settings.json; sem entrada ali, vale o padrão do plugin, que neste caso é desligado.")

# 7 ---------------------------------------------------------------- duas armadilhas
s = deck.slide("Como ligar e desligar")
deck.cabeca(s, "Como ligar e desligar", "Duas armadilhas: as flags e o comando da dica", tam=32)
lx7, lw7 = ML + 0.5, 5.0
d = escrever(s, lx7, 1.95, lw7,
             ["`disableAllHooks`, `--bare` e `--safe-mode` param os mods instalados, mas **não param os embutidos**, "
              "diz a documentação."], dict(f=TEXTO, s=19, c=INK, codigo=dict(s=16, c=INK)), pitch=27)
exclamacao(s, ML + 0.08, 1.98, alto=0.52)
numero_grande(s, ML, d.fim + 0.85, lw7 + 0.5, "3 vezes",
              "no máximo, na vida, aparece a dica do início da sessão que oferece ligar o mod, com o comando pronto, "
              "e com pelo menos dez sessões entre uma e outra (pelo código da 2.1.289)", cor=LIVRO, tam=38)
ax7 = ML + lw7 + 0.95
aviso_(s, ax7, 1.9, W - MR - ax7, 4.85, "Atenção",
       ["A issue #99071, aberta na 2.1.287, relata que o comando da dica falhou com “Plugin is not installed in this "
        "project”.",
        "Nos comentários, uma pessoa achou o mod em `/plugin` → **Installed** → **Show disabled**, e outra viu que ele "
        "não carregava com `ANTHROPIC_BASE_URL` apontando para um proxy local junto com "
        "`_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL=1`.",
        "Em 04/10/2026, a issue segue aberta, sem causa confirmada pela Anthropic.",
        "**Se o comando falhar, procure o mod em Show disabled antes de concluir que ele não está disponível para a "
        "sua conta.**"], cor=ATENCAO, tipo="atencao", tam=14.5, depois=8)
deck.notas(s, "Uma armadilha: disableAllHooks, --bare e --safe-mode param os mods instalados, mas não param os "
              "embutidos, diz a documentação. Há também uma dica no início da sessão que oferece ligar o mod, com o "
              "comando pronto; pelo código da 2.1.289, ela aparece no máximo três vezes na vida, com pelo menos dez "
              "sessões entre uma e outra. A issue #99071 relata que o comando da dica falhou com Plugin is not "
              "installed in this project, e em 04/10/2026 ela segue aberta. Se o comando falhar, procure o mod em Show "
              "disabled antes de concluir que ele não está disponível para a sua conta.")

# 8 ---------------------------------------------------------------- a checagem em cinco passos
s = deck.slide("Durante a sessão")
deck.cabeca(s, "O que acontece durante a sessão", "Uma checagem em cinco passos")
pic, iw, ih = imagem(s, img("figura-1.png"), ML, 1.72, h=5.2, raio_px=20,
                     alt="Diagrama de sequência em três raias, com o tempo descendo: você (verde), o agente principal, o "
                         "Claude que trabalha no seu pedido (azul), e o agente lateral do mod You should know "
                         "(petróleo); a nota é âmbar. Na ordem dos números: 1, você envia o pedido, e o agente "
                         "principal começa o turno e faz várias requisições ao modelo. 2, a cada seis requisições do "
                         "mesmo turno, o mod faz uma pergunta sobre a conversa, em segundo plano e sem ferramentas, e o "
                         "agente principal não para. 3, quase sempre a resposta é nada a dizer, e nada aparece na tela. "
                         "4, se algo passa da barra, o mod põe uma nota acima do seu prompt, com a etiqueta You should "
                         "know ou Heads up. 5, você escolhe uma opção, 1: Learn more, 2: Knew this already ou 0: "
                         "Dismiss, e o agente principal segue o trabalho. Embaixo, o desfecho: o padrão é não dizer "
                         "nada.")
px8 = ML + iw + 0.5
pw8 = W - MR - px8
y8, ds8 = bolinhas(s, px8, 1.8, pw8,
                   [(VERDE, "Você envia o pedido, e o agente principal começa o turno, que numa tarefa longa passa por "
                            "{nt:várias requisições ao modelo}.", {}, 0.38, 5.35),
                    (PETROLEO, "A cada seis requisições do mesmo turno, o mod faz uma pergunta sobre a conversa, em "
                               "segundo plano.", {}, 0),
                    (PETROLEO, "O caso comum: a resposta é “nada a dizer”, e nada aparece.", {}, 0),
                    (PETROLEO, "Algo passou da barra: o mod põe a nota acima do seu prompt.", {}, 0),
                    (VERDE, "Você escolhe uma opção da nota, e o agente principal segue o trabalho, sem ter sido "
                            "interrompido.", {}, 0)], tam=14.5, pitch=20, gap=0.17)
anota(s, um_trecho(ds8[0], "nt"), "a conta de seis é por requisição", tam=18)
legenda(s, px8 + 0.5, y8 + 0.05, pw8 - 0.5,
        "Cada cor é um papel: você (verde), o agente principal (azul), o agente lateral do mod (petróleo) e a nota "
        "(âmbar). O seis é o número do código da 2.1.289.")
deck.notas(s, "A figura mostra uma checagem do começo ao fim, em três raias, com o tempo descendo: você, o agente "
              "principal, que é o Claude trabalhando no seu pedido, e o agente lateral do mod. No 1, você envia o "
              "pedido e começa o turno, que numa tarefa longa passa por várias requisições ao modelo; cada uma dispara "
              "o evento turn.step. No 2, a cada seis requisições, o mod faz a pergunta dele. No 3, o caso comum, nada "
              "aparece; no 4, a nota aparece acima do prompt; e no 5, você escolhe uma opção, e o agente principal "
              "segue o trabalho.")

# 9 ---------------------------------------------------------------- a pergunta
s = deck.slide("Durante a sessão")
deck.cabeca(s, "O que acontece durante a sessão", "A pergunta vem a cada seis requisições")
lx9, lw9 = ML + 0.45, 5.75
d = escrever(s, lx9, 1.9, lw9,
             ["No **2**, a cada seis requisições do mesmo turno, o mod faz a pergunta dele. A pergunta corre em segundo "
              "plano, e o agente principal não para."], dict(f=TEXTO, s=17, c=INK), pitch=24)
asterisco(s, ML + 0.05, 1.98, lado=0.24)
REGRAS = ["Vale só para o agente principal: os subagentes são ignorados.",
          "Um turno curto nunca chega à checagem.",
          "Sai no máximo uma oferta por turno.",
          "Nada acontece se já há uma nota na tela ou uma pergunta em curso.",
          "Se três ou mais ofertas seguidas somem sem resposta, ele pula as checagens seguintes, cada vez mais, até "
          "dezesseis."]
fy9 = d.fim + 0.35
fw9 = lw9 + 0.45
blocos, yy = [], fy9 + 0.62 + 0.04
for r in REGRAS:
    dd = diagramar(ML + 0.26, yy + 0.1, fw9 - 0.45, [r], dict(f=TEXTO, s=13.5, c=INK), pitch=18.5)
    blocos.append(dd)
    yy = dd.fim + 0.1
ficha_pautada(s, ML, fy9, fw9, yy - fy9 + 0.02, "A conta, pelo código da 2.1.289", [dd.fim + 0.06 for dd in blocos[:-1]],
              tam_titulo=22)
for dd in blocos:
    colocar(s, dd)
pe(yy, onde="a ficha das regras")
fx9 = ML + fw9 + 0.45
fw9b = W - MR - fx9
pf9 = (fx9, 1.9, fw9b)
ty = 1.9 + 0.418
d = diagramar(fx9 + 0.28, ty + 0.22, 4.45,
              ["Pela documentação da API de mods, uma pergunta sobre a conversa atual, com o mesmo modelo e o mesmo "
               "prompt de sistema da sessão; por isso a API serve a maior parte dela pelo cache de prompt.",
               "Pelo código, o fork não tem ferramentas (não lê arquivo, não roda comando, não busca na web), não grava "
               "nada na conversa e faz {nt:no máximo duas idas ao modelo}."],
              dict(f=TEXTO, s=14.5, c=INK, codigo=dict(c=INK)), pitch=20.5, depois=10)
ficha(s, fx9, 1.9, fw9b, d.fim + 0.75 - 1.9, "model.fork", "a pergunta", PETROLEO)
colocar(s, d)
anota(s, um_trecho(d, "nt"), "limita as idas, não o preço", tam=18, xmin=fx9 + 0.28, xmax=W - MR - 0.15)
deck.notas(s, "No 2, a cada seis requisições do mesmo turno, o mod faz a pergunta dele, em segundo plano, e o agente "
              "principal não para. Pelo código da 2.1.289, a conta vale só para o agente principal, um turno curto "
              "nunca chega à checagem e sai no máximo uma oferta por turno; se três ou mais ofertas seguidas somem sem "
              "resposta, ele pula as checagens seguintes, até dezesseis. A pergunta é um model.fork: uma pergunta sobre "
              "a conversa atual, com o mesmo modelo e o mesmo prompt de sistema, e a maior parte vem do cache de "
              "prompt. Pelo código, o fork não tem ferramentas, faz no máximo duas idas ao modelo e não grava nada na "
              "conversa.")

# 10 --------------------------------------------------------------- o padrão é não dizer nada (escuro)
s = deck.slide("Durante a sessão", escuro=True)
dt = deck.cabeca(s, "O que acontece durante a sessão", "O caso comum é não aparecer nada.", escuro=True, tam=38,
                 y=1.25)
d = escrever(s, ML, dt.fim + 0.5, LARG - 0.9,
             ["No **3**, a resposta é “nada a dizer”, e nada aparece. O pedido que o mod faz ao modelo diz que "
              "{dp:o padrão é não sugerir nada} e que a barra para mostrar uma nota é muito alta.",
              "O mesmo pedido manda não repetir o que já foi oferecido, não voltar a um tema que você marcou como "
              "conhecido e nunca reproduzir segredos, credenciais, tokens ou dados pessoais da conversa."],
             dict(f=TEXTO, s=20, c=E_INK2), pitch=29, depois=14, marcas={"dp": "duplo"}, caneta=E_CANETA)
escrever(s, ML, d.fim + 0.75, LARG, ["Interessante não é o mesmo que importante."],
         dict(f=TITULO, s=30, c=E_INK, b=True), pitch=36)
deck.notas(s, "No 3, o caso comum: a resposta é nada a dizer, e nada aparece. O pedido que o mod faz ao modelo diz que "
              "o padrão é não sugerir nada, que a barra para mostrar uma nota é muito alta e que interessante não é o "
              "mesmo que importante. O mesmo pedido manda não repetir o que já foi oferecido, não voltar a um tema que "
              "você marcou como conhecido e nunca reproduzir segredos, credenciais, tokens ou dados pessoais da "
              "conversa.")

# 11 --------------------------------------------------------------- as duas etiquetas
s = deck.slide("Durante a sessão")
deck.cabeca(s, "O que acontece durante a sessão", "A nota vem com uma de duas etiquetas")
d = escrever(s, ML, 1.62, LARG,
             ["No **4**, algo passou da barra, e o mod põe a nota acima do seu prompt. No **5**, você escolhe uma opção, "
              "e o agente principal segue o trabalho."], dict(f=TEXTO, s=15.5, c=INK2), pitch=21)
fw11 = (LARG - 0.3) / 2
fy11 = d.fim + 0.3
fh11 = 2.6
for i, (rot_, frase, apoio, mk) in enumerate((
        ("You should know", "Algo que você deveria entender.", "", {}),
        ("Heads up", "Sobre o trabalho desta sessão.",
         "Uma decisão que o Claude tomou, algo que ele não destacou ou um resultado que pode estar errado, quando "
         "deixar passar {nt:tem um custo imediato}.", {}))):
    fx = ML + i * (fw11 + 0.3)
    ty = ficha(s, fx, fy11, fw11, fh11, rot_, "etiqueta", AMBAR)
    da = escrever(s, fx + 0.24, ty + 0.25, fw11 - 0.48, [frase], dict(f=TITULO, s=22, c=INK, b=True), pitch=27)
    if apoio:
        db = escrever(s, fx + 0.24, da.fim + 0.15, fw11 - 0.48, [apoio], dict(f=TEXTO, s=15, c=INK2), pitch=21)
        anota(s, um_trecho(db, "nt"), "esta pede atenção na hora", tam=18, xmax=fx + fw11 - 0.15)
aviso_(s, ML, fy11 + fh11 + 0.25, LARG, 7.0 - (fy11 + fh11 + 0.25), "Nota",
       ["A conta de seis, o fork sem ferramentas, o texto do pedido e tudo o que a nota mostra e faz são detalhes de "
        "implementação, lidos no código da 2.1.289. A documentação não os promete, e eles podem mudar em qualquer "
        "versão."], cor=NOTA, tam=14)
deck.notas(s, "No 4, algo passou da barra, e o mod põe a nota acima do seu prompt, com uma de duas etiquetas, pelo "
              "código da 2.1.289: You should know, algo que você deveria entender, ou Heads up, sobre o trabalho desta "
              "sessão, como uma decisão que o Claude tomou ou um resultado que pode estar errado, quando deixar passar "
              "tem um custo imediato. No 5, você escolhe uma opção da nota, e o agente principal segue, sem ter sido "
              "interrompido. Tudo isso é detalhe de implementação: a documentação não promete, e pode mudar em "
              "qualquer versão.")

# 12 --------------------------------------------------------------- a oferta
s = deck.slide("A nota na tela")
deck.cabeca(s, "A nota na tela e as respostas", "A oferta: uma frase curta e três opções")
pic, iw, ih = imagem(s, img("figura-2.png"), ML, 1.7, h=5.3, raio_px=20,
                     alt="Três quadros da nota do You should know no terminal, acima da caixa do prompt. A oferta: a "
                         "faixa do mod com a estrela, a etiqueta You should know, uma frase de exemplo inventada em "
                         "inglês e as opções 1: Learn more, 2: Knew this already e 0: Dismiss, com quatro chamadas "
                         "numeradas (a faixa, a etiqueta, a frase de até 240 caracteres e as opções). A explicação, "
                         "depois da tecla 1: a mesma nota, um título em negrito, um texto curto e as opções 1: "
                         "Understood, 2: Chat in main session, que põe a nota no seu prompt sem enviar, e 0: Dismiss. "
                         "Depois do 0: Dismiss na oferta: Dismissed. e, por 20 segundos, 1: That was helpful, 2: Not "
                         "relevant, 3: Couldn’t understand, 4: Turn off suggestions, só no terminal, e 0: Dismiss.")
px12 = ML + iw + 0.55
pw12 = W - MR - px12
y12, _ = bolinhas(s, px12, 1.8, pw12,
                  [(INK, "A nota fica numa faixa logo acima da caixa do prompt, o lugar que a referência dos mods chama "
                         "de `AbovePrompt`.", {}, 0),
                   (INK, "Ela abre com a etiqueta: `You should know` ou `Heads up`.", {}, 0),
                   (INK, "Depois, uma frase curta, de até 240 caracteres.", {}, 0),
                   (INK, "Embaixo, as opções, cada uma com a sua tecla:\n`1: Learn more`, `2: Knew this already` e "
                         "`0: Dismiss`.", {}, 0)], tam=15, pitch=21, gap=0.2)
d = escrever(s, px12 + 0.5, y12 + 0.05, pw12 - 0.5, ["Se você enviar dois pedidos sem responder, a oferta some."],
             dict(f=TEXTO, s=15, c=INK), pitch=21)
legenda(s, px12 + 0.5, d.fim + 0.4, pw12 - 0.5,
        "A nota (âmbar), o que é do mod (petróleo) e o que é seu (verde), em três momentos: a oferta, a explicação e a "
        "pergunta depois do Dismiss. As frases da nota são exemplos inventados.")
deck.notas(s, "A segunda figura mostra a nota em três quadros, num terminal desenhado no papel, e as frases da nota são "
              "exemplos inventados, não uma nota real. Na oferta, a nota fica numa faixa logo acima da caixa do prompt, "
              "o lugar que a referência dos mods chama de AbovePrompt; ela abre com a etiqueta e uma frase curta, de "
              "até 240 caracteres, e embaixo vêm as opções 1: Learn more, 2: Knew this already e 0: Dismiss. Se você "
              "enviar dois pedidos sem responder, a oferta some. A documentação diz só que a nota aparece acima do "
              "prompt; o resto vem do código da 2.1.289 e pode mudar.")

# 13 --------------------------------------------------------------- a explicação
s = deck.slide("A nota na tela")
deck.cabeca(s, "A nota na tela e as respostas", "O `Chat in main session` não envia nada")
pic, iw, ih = imagem(s, img("figura-2.png"), ML, 1.8, w=6.0, raio_px=20, recorte=REC_EXPLICACAO,
                     alt="O quadro da explicação, na segunda figura: a mesma nota, com a etiqueta You should know e a "
                         "frase inventada, um título em negrito e um texto curto, também inventados, e as opções 1: "
                         "Understood, 2: Chat in main session e 0: Dismiss; embaixo, 1: Understood marca o tema como "
                         "conhecido, e 2: Chat in main session põe a nota no seu prompt e não envia.")
rx13 = ML + iw + 0.5
rw13 = W - MR - rx13 - 0.2
d = escrever(s, rx13, 1.85, rw13,
             ["O `Learn more` abre o texto completo: um título em negrito e uma explicação curta.",
              "Se a checagem não trouxe a explicação, o mod pede uma ao modelo nessa hora (aparece “One moment…”): "
              "{sb:mais uma chamada}\u2003na sua conta.",
              "As opções mudam para `1: Understood`, que marca o tema como conhecido, `2: Chat in main session` e "
              "`0: Dismiss`.",
              "No terminal, o `Chat in main session` **não envia nada**: ele preenche o seu prompt com um rascunho que "
              "começa por “Here is a note offered by a side agent:”, seguido da nota citada, e você decide se envia."],
             dict(f=TEXTO, s=14.5, c=INK, codigo=dict(s=12.5, c=INK)), pitch=20.5, depois=10)
sobe(s, um_trecho(d, "sb"))
pe(d.fim, onde="o texto da explicação")
deck.notas(s, "O Learn more abre o texto completo: um título em negrito e uma explicação curta. Se a checagem não trouxe "
              "a explicação, o mod pede uma ao modelo nessa hora, e aparece One moment: é mais uma chamada na sua "
              "conta. As opções mudam para 1: Understood, que marca o tema como conhecido, 2: Chat in main session e 0: "
              "Dismiss. No terminal, o Chat in main session não envia nada: preenche o seu prompt com um rascunho, "
              "seguido da nota citada, e você decide se envia. Se o prompt já tiver texto, o mod pede que você envie "
              "ou limpe antes.")

# 14 --------------------------------------------------------------- depois do Dismiss
s = deck.slide("A nota na tela")
deck.cabeca(s, "A nota na tela e as respostas", "Depois do `Dismiss`, uma pergunta de retorno")
pic, iw, ih = imagem(s, img("figura-2.png"), ML, 1.8, w=5.7, raio_px=20, recorte=REC_DISMISS,
                     alt="O quadro depois do 0: Dismiss na oferta: Dismissed. e as opções 1: That was helpful, 2: Not "
                         "relevant, 3: Couldn’t understand, 4: Turn off suggestions e 0: Dismiss; embaixo, a pergunta "
                         "fica 20 segundos na tela e some, e a 4 só aparece no terminal e escreve no seu prompt o "
                         "comando que desliga o mod.")
d = escrever(s, ML, 1.8 + ih + 0.2, iw - 0.3,
             ["Fechada na tela da explicação, a pergunta é mais curta: `1: That was helpful`, `2: Didn’t understand` e "
              "`0: Dismiss`.",
              {"t": "O `4: Turn off suggestions` escreve no prompt\n`/plugin disable cc-plugin-you-should-know@builtin`,\ne "
                    "você confirma com Enter.", "estilo": dict(codigo=dict(s=11.5, c=INK))}],
             dict(f=TEXTO, s=14.5, c=INK, codigo=dict(s=12.5, c=INK)), pitch=20, depois=8)
pe(d.fim, onde="o texto do Dismiss")
fx14 = ML + iw + 0.45
fw14 = W - MR - fx14
escrever(s, fx14, 1.82, fw14, ["Dois relatos abertos no repositório oficial"], dict(f=UI, s=13.5, c=INK2, b=True),
         pitch=17)
ty = ficha(s, fx14, 2.25, fw14, 2.0, "issue #99232", "o idioma", LIVRO)
escrever(s, fx14 + 0.26, ty + 0.2, fw14 - 0.52,
         ["Registra que {on:as notas vêm sempre em inglês}, mesmo com a configuração `language`; o pedido ao modelo, "
          "no código, diz para explicar em inglês simples."],
         dict(f=TEXTO, s=14.5, c=INK, codigo=dict(c=INK)), pitch=20.5, marcas={"on": "ondulado"})
ty = ficha(s, fx14, 4.45, fw14, 2.5, "issue #99421", "o obrigado", LIVRO)
escrever(s, fx14 + 0.26, ty + 0.2, fw14 - 0.62,
         ["Pede um botão simples de “obrigado” na própria oferta: hoje, ali só há o `Dismiss`, que leva à pergunta de "
          "retorno. Pelo código da 2.1.289, o outro caminho é abrir o `Learn more` e fechar com `1: Understood`, sem "
          "pergunta."],
         dict(f=TEXTO, s=14.5, c=INK, codigo=dict(c=INK)), pitch=20.5)
deck.notas(s, "Quando você fecha a oferta com 0: Dismiss, aparece Dismissed. e, por 20 segundos, uma pergunta de "
              "retorno; a 4: Turn off suggestions só aparece no terminal e escreve no prompt o comando que desliga o "
              "mod, e você confirma com Enter. Fechada na tela da explicação, a pergunta é mais curta. Dois relatos "
              "abertos completam o quadro: a issue #99232 registra que as notas vêm sempre em inglês, mesmo com a "
              "configuração language, e a issue #99421 pede um botão de obrigado na própria oferta. Pelo código, o "
              "outro caminho é abrir o Learn more e fechar com 1: Understood, sem pergunta.")

# 15 --------------------------------------------------------------- o que consome
s = deck.slide("O que consome e o que vê")
deck.cabeca(s, "O que o mod consome e o que ele vê", "Cada checagem gasta da sua conta")
lw15 = 6.8
escrever(s, ML, 1.95, lw15,
         ["As chamadas de modelo dos mods usam o plano ou a chave de API do usuário.",
          "Ou seja: o You should know gasta da sua conta a cada checagem, {mk:inclusive quando a resposta é “nada a "
          "dizer”}."], dict(f=TEXTO, s=20, c=INK), pitch=29, depois=16, marcas={"mk": "marca"})
fx15 = ML + lw15 + 0.5
fw15 = W - MR - fx15
ty = ficha(s, fx15, 1.95, fw15, 2.55, "as chamadas", "na sua conta", LIVRO)
y15 = ty + 0.22
for txt in ("**A checagem:** uma pergunta sobre a conversa, com no máximo duas idas ao modelo.",
            "**A explicação do `Learn more`**, quando a checagem não a trouxe."):
    d = escrever(s, fx15 + 0.28, y15, fw15 - 0.56, [txt], dict(f=TEXTO, s=15, c=INK, codigo=dict(c=INK)), pitch=21)
    y15 = d.fim + 0.2
aviso_(s, ML, 5.3, LARG, 1.15, "Nota",
       ["Em 04/10/2026, a Anthropic não publicou quanto o You should know custa, nem em tokens nem em dinheiro, e "
        "nenhuma medição foi feita para o post."], cor=NOTA, tam=15)
deck.notas(s, "Cada checagem é uma chamada extra ao modelo, e as chamadas de modelo dos mods usam o plano ou a chave de "
              "API do usuário. Ou seja: o You should know gasta da sua conta a cada checagem, inclusive quando a "
              "resposta é nada a dizer. A explicação do Learn more, quando a checagem não a trouxe, é mais uma "
              "chamada. Em 04/10/2026, a Anthropic não publicou quanto ele custa, nem em tokens nem em dinheiro, e "
              "nenhuma medição foi feita para o post.")

# 16 --------------------------------------------------------------- o que vê
s = deck.slide("O que consome e o que vê")
deck.cabeca(s, "O que o mod consome e o que ele vê", "O mod só vê o que passou pela conversa")
lw16 = 6.3
escrever(s, ML, 1.95, lw16,
         ["O que vai ao modelo é a conversa principal mais o pedido do mod. Como o fork não tem ferramentas, "
          "{mk:ele só enxerga o que já passou pela conversa}.",
          "As chamadas que o mod declara, pelo código da 2.1.289, não incluem acesso a arquivos, à rede nem a "
          "processos."], dict(f=TEXTO, s=17.5, c=INK), pitch=25, depois=14, marcas={"mk": "marca"})
fx16 = ML + lw16 + 0.5
fw16 = W - MR - fx16
ty = ficha(s, fx16, 1.95, fw16, 3.45, "o que sai dele", "por conta própria", LIVRO)
y16 = ty + 0.22
for n, txt in enumerate(("As chamadas ao modelo: a checagem e, às vezes, a explicação do `Learn more`.",
                         "Os registros de telemetria, que o mod grava pela API de telemetria e outro embutido, o "
                         "`cc-plugin-telemetry`, envia."), 1):
    escrever(s, fx16 + 0.25, y16 - 0.07, 0.3, [str(n)], dict(f=MAO, s=23, c=CANETA, b=True), pitch=23)
    d = escrever(s, fx16 + 0.6, y16, fw16 - 0.85, [txt], dict(f=TEXTO, s=14.5, c=INK, codigo=dict(c=INK)), pitch=20.5)
    y16 = d.fim + 0.2
escrever(s, fx16 + 0.6, y16 + 0.05, fw16 - 0.85,
         ["A nota só chega à conversa principal pelo `Chat in main session`, quando você escolhe essa opção."],
         dict(f=TEXTO, s=13.5, c=INK2, codigo=dict(c=INK)), pitch=19)
escrever(s, ML, 5.75, LARG - 0.5,
         ["O anúncio dos mods lembra que eles rodam com o mesmo acesso à máquina que o próprio Claude Code, sem "
          "sandbox. Num embutido isso pesa menos, porque o código é da Anthropic."],
         dict(f=TEXTO, s=15.5, c=INK2), pitch=22)
deck.notas(s, "O que vai ao modelo é a conversa principal mais o pedido do mod. Como o fork não tem ferramentas, ele só "
              "enxerga o que já passou pela conversa, e as chamadas que o mod declara não incluem acesso a arquivos, à "
              "rede nem a processos. Por conta própria, só duas coisas saem dele: as chamadas ao modelo e os registros "
              "de telemetria, que outro embutido, o cc-plugin-telemetry, envia. A nota só chega à conversa principal "
              "pelo Chat in main session. Os mods rodam sem sandbox; num embutido isso pesa menos, porque o código é da "
              "Anthropic.")

# 17 --------------------------------------------------------------- onde desenha
s = deck.slide("Onde desenha e os limites")
deck.cabeca(s, "Onde o mod desenha e quais são os limites", "A checagem só roda onde a faixa aparece")
d = escrever(s, ML, 1.68, LARG,
             ["Pelo código da 2.1.289, o You should know só faz a checagem onde há uma tela que desenha a faixa:",
              "{lg:sem faixa, sem chamada} ao modelo."], dict(f=TEXTO, s=17, c=INK), pitch=24, depois=13)
liga(s, um_trecho(d, "lg"))
ONDE = [("`claude` no terminal, inclusive o terminal integrado do editor e o plugin da JetBrains", "sim"),
        ("Aba Code do aplicativo de desktop, fora de sessão WSL",
         "sim, menos os elementos só de terminal, e só se a cópia do Claude Code que vem no aplicativo for 2.1.287 ou "
         "mais nova"),
        ("Sessão WSL no aplicativo de desktop", "não, porque plugins não existem nela"),
        ("Painel de chat da extensão do VS Code", "não: os hooks rodam, mas nada aparece"),
        ("`claude -p` e Agent SDK", "não: os hooks rodam, mas nada aparece"),
        ("Remote Control, pelo claude.ai ou pelo app do celular", "no terminal da sua máquina"),
        ("Sessão na nuvem", "não: nada aparece")]
fim17 = tabela(s, ML, d.fim + 0.3, LARG,
               [("Onde o Claude Code roda", 5.6, dict(f=TEXTO, s=13, c=INK, codigo=dict(s=12, c=INK))),
                ("O que um mod desenha aparece", LARG - 5.6 - 0.25, dict(f=UI, s=12.5, c=INK2))],
               ONDE, altura_linha=0.5)
pe(fim17, onde="a tabela")
deck.notas(s, "Os hooks de um mod rodam em qualquer sessão que carregue o plugin, mas desenhar é mais restrito, e a "
              "tabela resume, pela documentação, onde o que um mod desenha aparece. Pelo código da 2.1.289, o You "
              "should know só faz a checagem onde há uma tela que desenha a faixa: sem faixa, sem chamada ao modelo. "
              "O aplicativo de desktop traz uma cópia própria do Claude Code, que pode estar atrás da do terminal; "
              "nele, o You should know não foi conferido.")

# 18 --------------------------------------------------------------- os limites
s = deck.slide("Onde desenha e os limites")
deck.cabeca(s, "Onde o mod desenha e quais são os limites", "Cinco limites, na versão 2.1.289")
d = escrever(s, ML + 0.45, 1.75, 8, ["Os limites, em 04/10/2026, na versão 2.1.289:"], dict(f=TEXTO, s=17, c=INK),
             pitch=24)
dv = nota(s, ML + 0.45, d.fim + 0.02, 4, "conferido em out/2026", tam=19)
onda(s, ML + 0.14, d.y + 0.06, dv.fim - 0.04, amp=0.04, periodo=0.2)
LIMITES = [("tarefas longas", "Só em tarefas longas.",
            "Um turno curto, de poucas requisições ao modelo, nunca chega à checagem."),
           ("a barra", "Quase nunca fala.", "A barra é alta de propósito."),
           ("a conversa", "Só lê a conversa.",
            "O que não passou por ela (um arquivo que o Claude não abriu, um teste que não rodou) ele não vê."),
           ("o papel", "Não é revisor de código nem guarda de segurança.",
            "Ele aponta o que leu na conversa; não confere o código nem bloqueia nada."),
           ("a conta", "Depende da conta.",
            "Ele só aparece se estiver disponível para a sua organização, em sessão first-party com a telemetria "
            "ligada.")]
fw18, gap18, fh18 = (LARG - 2 * 0.25) / 3, 0.25, 2.1
for i, (esq, frase, txt) in enumerate(LIMITES):
    linha = i // 3
    x0 = ML if linha == 0 else ML + (fw18 + gap18) / 2
    fx, fy = x0 + (i % 3) * (fw18 + gap18), 2.65 + linha * (fh18 + 0.2)
    ty = ficha(s, fx, fy, fw18, fh18, esq, f"{i + 1}/5", LIVRO, tam=9.5)
    da = escrever(s, fx + 0.22, ty + 0.17, fw18 - 0.44, [frase], dict(f=UI, s=14.5, c=INK, b=True), pitch=18)
    db = escrever(s, fx + 0.22, da.fim + 0.1, fw18 - 0.44, [txt], dict(f=TEXTO, s=13, c=INK2), pitch=17.5)
    pe(db.fim, fy + fh18 - 0.08, f"a ficha {esq}")
deck.notas(s, "Os limites valem em 04/10/2026, na versão 2.1.289. Só em tarefas longas: um turno curto nunca chega à "
              "checagem. Quase nunca fala, porque a barra é alta de propósito. Só lê a conversa: o que não passou por "
              "ela, como um arquivo que o Claude não abriu ou um teste que não rodou, ele não vê. Não é revisor de "
              "código nem guarda de segurança. E depende da conta: só aparece se estiver disponível para a sua "
              "organização, em sessão first-party com a telemetria ligada.")

# 19 --------------------------------------------------------------- o que foi conferido
s = deck.slide("O que foi conferido")
deck.cabeca(s, "O que foi conferido", "O mod não foi ligado numa sessão de teste")
lw19 = 6.7
d = escrever(s, ML, 1.95, lw19,
             ["Em 04/10/2026, foram lidos a documentação oficial, o changelog do site, o anúncio dos mods, as três "
              "issues citadas e o código instalado das versões 2.1.287, 2.1.288 e 2.1.289.",
              "O que vem do código está marcado como “pelo código da 2.1.289” e é detalhe de implementação, que pode "
              "mudar."], dict(f=TEXTO, s=18, c=INK), pitch=26, depois=14)
carimbo(s, W - MR - 4.7, 2.15, 4.6, "conferido na doc e no código da 2.1.289", h=0.72, tam=12.5)
fx19 = ML + lw19 + 0.5
fw19 = W - MR - fx19
ty = ficha(s, fx19, 3.55, fw19, 2.6, "as datas", "changelog do site", INK3)
escrever(s, fx19 + 0.28, ty + 0.22, fw19 - 0.56,
         ["As datas vêm do changelog do site, que traz o mesmo texto da release v2.1.287 no GitHub.",
          "O changelog que vem dentro do binário 2.1.287 vai só até a 2.1.286."],
         dict(f=TEXTO, s=14.5, c=INK), pitch=20.5, depois=10)
deck.notas(s, "Em 04/10/2026, foram lidos a documentação oficial, o changelog do site, o anúncio dos mods, as três "
              "issues citadas e o código instalado das versões 2.1.287, 2.1.288 e 2.1.289. O que vem do código está "
              "marcado como pelo código da 2.1.289 e é detalhe de implementação. O mod não foi ligado numa sessão de "
              "teste. As datas vêm do changelog do site, o mesmo texto da release v2.1.287 no GitHub; o changelog que "
              "vem dentro do binário 2.1.287 vai só até a 2.1.286.")

# 20 --------------------------------------------------------------- fecho
deck.fecho("Para ir além",
           "Para ligar, o comando é /plugin enable cc-plugin-you-should-know@builtin; se ele falhar, procure o mod em "
           "Show disabled antes de concluir que ele não está disponível para a sua conta. O que é um mod e as peças "
           "que vieram antes estão no post sobre os mods. As fontes completas, com os links, estão no fim do post.",
           recomendacao="Para ligar:\n`/plugin enable cc-plugin-you-should-know@builtin`\nSe o comando falhar, procure o "
                        "mod em **Show disabled** antes de concluir que ele não está disponível para a sua conta.",
           enderecos=["code.claude.com › docs › plugins › mods › overview"],
           fontes=["Claude Code: Mods overview, Mods reference e Use the mods API",
                   "Claude Code: o changelog (2.1.287 e 2.1.288), os comandos de plugin e o enabledPlugins",
                   "Claude: o anúncio dos mods (01/10/2026)",
                   "GitHub: a release v2.1.287, a pasta mods e as issues #99071, #99232 e #99421",
                   "Leitura do binário 2.1.289 (e do 2.1.287 e do 2.1.288), em 04/10/2026"])

deck.salvar()
