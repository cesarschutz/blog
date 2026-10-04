"""A apresentação do post "Registros de DNS — A, AAAA, CNAME, MX, TXT e o domínio no GitHub Pages" (D74).
O post é detalhado: 20 slides, na ordem dele, com a capa, a árvore de nomes, a consulta em passos, o GitHub
Pages e o TTL em passos (o quadro final de cada figura em passos) e a caneta do post nos mesmos trechos.

    node scripts/slides/capturar.mjs dns-tipos-de-registro
    python3 scripts/slides/posts/dns-tipos-de-registro.py
    python3 scripts/slides/conferir.py dns-tipos-de-registro
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from estilo import *  # noqa: E402,F403

SLUG = "dns-tipos-de-registro"
deck = Deck(SLUG, "Registros de DNS: A, AAAA, CNAME, MX, TXT e o domínio no GitHub Pages")
img = deck.imagem
LIVRO = deck.livro["cor"]
T = dict(f=TEXTO, s=16, c=INK, codigo=dict(c=INK))
C_COM, C_NUM = INK3, COD_NUMERO


# ---------------------------------------------------------------- as marcas do post que o estilo não traz
def riscado(s, seg, cor=CANETA, lw=1.5):
    """O riscado simples: um traço à mão no meio do trecho."""
    y = seg["base"] - 0.3 * seg["tam"] / 72
    return livre(s, tremido([(seg["x0"] - 0.03, y + 0.01), (seg["x1"] + 0.03, y - 0.012)], 13, 0.003, 0.12),
                 linha=cor, lw=lw, nome="Riscado à caneta")


def explica(s, seg, texto, cor=CANETA, tam=17, r=0.06):
    """A chave por baixo do trecho, com a ponta para baixo e a nota embaixo dela."""
    x0, x1, y = seg["x0"], seg["x1"], seg["base"] + 0.07
    xm = (x0 + x1) / 2

    def arco(cx, cy, a0, a1, n=7):
        return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
                 cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]
    pts = arco(x0 + r, y, 180, 90) + [(xm - r, y + r)] + arco(xm - r, y + 2 * r, 270, 360) + \
        arco(xm + r, y + 2 * r, 180, 270) + [(x1 - r, y + r)] + arco(x1 - r, y, 90, 0)
    livre(s, pts, linha=cor, lw=1.4, nome="Chave por baixo")
    w = larg(texto, MAO, tam, True) + 0.1
    return nota(s, xm - w / 2, y + 2 * r + 0.02, w, texto, tam=tam, cor=cor, alinhar="c")


def ressalva(s, seg, cor=CANETA, tam=20):
    """O asterisco depois do trecho; a nota vai ao pé do parágrafo."""
    return escrever(s, seg["x1"] + 0.06, seg["base"] - 0.15, 0.2, ["*"], dict(f=MAO, s=tam, c=cor, b=True),
                    pitch=tam, nome="Asterisco à caneta")


def barra(s, x, y0, y1, cor=CANETA, lw=1.8):
    """As linhas marcadas no código: um traço à mão no respiro da esquerda."""
    return livre(s, tremido([(x, y0), (x + 0.004, y1)], 17, 0.003, 0.05), linha=cor, lw=lw, nome="Linhas marcadas")


def legenda(s, x, y, w, texto):
    return escrever(s, x, y, w, [texto], dict(f=UI, s=11.5, c=INK2, codigo=dict(c=INK)), pitch=15, nome="Legenda")


def bolinhas(s, x, y, w, itens, tam=14, pitch=19.5, gap=0.18):
    """Os passos numerados, cada número na cor do papel da figura."""
    for n, (cor, txt) in enumerate(itens, 1):
        elipse(s, x + 0.165, y + 0.15, 0.165, fundo=cor)
        escrever(s, x, y + 0.035, 0.33, [str(n)], dict(f=UI, s=12.5, c=BRANCO, b=True), pitch=15, alinhar="c")
        d = escrever(s, x + 0.5, y, w - 0.5, [txt], dict(f=TEXTO, s=tam, c=INK, codigo=dict(c=INK)), pitch=pitch)
        y = d.fim + gap
    return y


_escrever = escrever


def escrever(*args, **kw):  # noqa: F811
    d = _escrever(*args, **kw)
    for mid, tipo in (kw.get("marcas") or {}).items():
        if tipo in ("ondulado", "duplo", "circulo", "caixa") and len(d.marcas.get(mid, [])) > 1:
            print(f"AVISO: a marca {tipo} quebrou a linha: {mid} em {str(args[4])[:60]}")
    return d


_cabeca = deck.cabeca


def cabeca_uma_linha(s, secao, titulo, **kw):
    d = _cabeca(s, secao, titulo, **kw)
    if len(d.pars[0]["linhas"]) > 1:
        print(f"AVISO: o título quebrou em duas linhas: {titulo}")
    return d


deck.cabeca = cabeca_uma_linha


def linha_cod(txt, cor=INK, est=None):
    return [(txt, cor, est)] if est else [(txt, cor)]


# 1 ---------------------------------------------------------------- capa
s = deck.capa("Registros de DNS", "A, AAAA, CNAME, MX, TXT e o domínio no GitHub Pages",
              "Um móbile de plaquinhas penduradas por fios: no alto, a raiz com o ponto; dela pendem com, br e org; "
              "do com, example; e do example, www, como o nome www.example.com. lido de baixo para cima.")
deck.notas(s, "O DNS é o sistema que traduz um nome como www.example.com no endereço IP de que o navegador precisa. "
              "Toda configuração de domínio é feita nele, na forma de registros: o site, o e-mail, a prova de que o "
              "domínio é seu e quem pode emitir certificado para ele. A apresentação segue o post: como os nomes se "
              "organizam, como uma consulta chega à resposta, para que serve cada tipo de registro e, na prática, o "
              "GitHub Pages, o e-mail e o dig.")

# 2 ---------------------------------------------------------------- o que o DNS resolve
s = deck.slide("O que o DNS resolve")
deck.cabeca(s, "O que o DNS resolve", "O DNS traduz um nome no endereço IP")
lw2 = 5.75
d = escrever(s, ML, 1.9, lw2,
             ["O DNS (~Domain Name System~) traduz um nome como `www.example.com` no endereço IP de que o navegador "
              "precisa para abrir a conexão.",
              "Toda configuração de domínio é feita nele, na forma de **registros**: o site, o e-mail, a prova de que o "
              "domínio é seu e quem pode emitir certificado para ele.",
              "Quando um site novo não abre ou o e-mail do domínio cai no spam, a causa costuma estar num desses "
              "registros."], T, pitch=22.5, depois=12)
numero_grande(s, ML, d.fim + 0.4, lw2, "porta 53",
              "as consultas usam UDP e TCP; o suporte aos dois é obrigatório em toda implementação de uso geral",
              cor=LIVRO, tam=34)
fx, fw = ML + lw2 + 0.5, LARG - lw2 - 0.5
ty = ficha(s, fx, 1.9, fw, 2.05, "antes do DNS", "um arquivo só", INK3)
escrever(s, fx + 0.28, ty + 0.2, fw - 0.56,
         ["O `HOSTS.TXT`, mantido por uma central e copiado por FTP por todas as máquinas da rede. A cada máquina "
          "nova, o arquivo crescia, e todo mundo precisava baixar de novo."],
         dict(f=TEXTO, s=14.5, c=INK2, codigo=dict(c=INK)), pitch=20.5)
ty = ficha(s, fx, 4.2, fw, 2.5, "o DNS", "base de dados distribuída", LIVRO)
escrever(s, fx + 0.28, ty + 0.2, fw - 0.56,
         ["Nenhum servidor conhece todos os nomes. Cada {gr:parte da base é mantida por quem é dono dela}, e um "
          "servidor sabe apontar para o servidor que conhece a parte seguinte."],
         dict(f=TEXTO, s=16, c=INK), pitch=23, marcas={"gr": "grifo"})
deck.notas(s, "Os computadores se encontram pelo endereço IP; os nomes existem para as pessoas. Antes do DNS, a "
              "tradução ficava num arquivo só, o HOSTS.TXT, mantido por uma central e copiado por FTP por todas as "
              "máquinas. O DNS trocou o arquivo único por uma base de dados distribuída: nenhum servidor conhece todos "
              "os nomes, cada parte da base é mantida por quem é dono dela. As consultas usam a porta 53, por UDP e "
              "por TCP, e o suporte aos dois é obrigatório.")

# 3 ---------------------------------------------------------------- a árvore
s = deck.slide("O espaço de nomes")
deck.cabeca(s, "O espaço de nomes", "O nome é um caminho até a raiz da árvore")
fh = 4.55
pic, iw, ih = imagem(s, img("figura-1.png"), 0, 1.78, h=fh, raio_px=20,
                     alt="A árvore de nomes do DNS em quatro níveis: a raiz, na zona da IANA; os TLDs com, org e br, "
                         "cada um uma zona; o domínio registrado example, a zona do dono; e os subdomínios www e "
                         "blog, na mesma zona. Setas marcadas NS ligam cada zona à de baixo, e os números 1 a 4 leem "
                         "www.example.com. de baixo para cima; o ponto final é a raiz.")
pic.left = Inches(W - MR - iw)
legenda(s, W - MR - iw, 1.78 + ih + 0.1, iw,
        "Cada contorno é uma zona: em roxo, a raiz e os TLDs, que só delegam; em verde, o domínio registrado. "
        "As setas são as delegações por NS.")
lw3 = W - MR - iw - ML - 0.45
d = escrever(s, ML, 1.85, lw3,
             ["Cada nó tem um rótulo de até 63 bytes, e o nome completo tem até 255. A raiz tem o rótulo vazio: por "
              "isso um nome escrito por inteiro {nt:termina em ponto}."],
             dict(f=TEXTO, s=15, c=INK), pitch=21.5)
nt = d.marcas["nt"][-1]
ny = d.fim + 0.12
nota(s, nt["x0"] + 0.55, ny, 2.6, "o ponto é a raiz", tam=19)
seta(s, curva((nt["x0"] + 0.5, ny + 0.17), (nt["x0"] + 0.2, ny + 0.14), (nt["x0"] + 0.15, nt["base"] + 0.07)),
     ponta=0.07)
escrever(s, ML, ny + 0.43, lw3, ["`www.example.com.`: do nó `www` até a raiz, lido da direita para a esquerda."],
         dict(f=TEXTO, s=15, c=INK2, codigo=dict(c=INK)), pitch=21.5)
y = ny + 1.25
for termo, txt in (("A raiz", "(`.`): a zona dela lista os domínios de primeiro nível."),
                   ("Os TLDs", "`com`, `org`, `br`, `io`: 1.437 na lista da IANA em 04/10/2026."),
                   ("O domínio registrado", "`example.com`, `exemplo.com.br`."),
                   ("Os subdomínios", "`www`, `blog`: criados pelo dono do domínio, sem pedir nada a ninguém.")):
    d = escrever(s, ML, y, lw3, [f"**{termo}** {txt}"], dict(f=TEXTO, s=13.5, c=INK, codigo=dict(c=INK)), pitch=19)
    y = d.fim + 0.13
deck.notas(s, "Os nomes do DNS formam uma árvore, o espaço de nomes. Cada nó tem um rótulo de até 63 bytes, e o nome "
              "completo tem até 255. A raiz tem o rótulo vazio, por isso um nome escrito por inteiro termina em "
              "ponto: www.example.com. é o caminho do nó www até a raiz, lido da direita para a esquerda. Embaixo da "
              "raiz ficam os TLDs (1.437 na lista da IANA em 04/10/2026), depois o domínio registrado e os "
              "subdomínios, que o dono cria sem pedir nada a ninguém.")

# 4 ---------------------------------------------------------------- domínio e zona (escuro)
s = deck.slide("O espaço de nomes", escuro=True)
dt = deck.cabeca(s, "O espaço de nomes", "Domínio e zona são coisas diferentes.", escuro=True, tam=38, y=1.25)
d = escrever(s, ML + 0.55, dt.fim + 0.5, LARG - 0.8,
             ["Um **domínio** é um galho da árvore, com tudo o que está embaixo dele.",
              "Uma **zona** é o pedaço da árvore que um mesmo conjunto de servidores responde, com autoridade.",
              "A zona `com` não guarda os endereços de `example.com`: guarda só um recado, quem responde por ele. "
              "Esse recado é a **delegação**, feita com registros `NS`."],
             dict(f=TEXTO, s=20, c=E_INK2, codigo=dict(c=E_INK)), pitch=29, depois=10)
colchete(s, ML + 0.25, d.y - 0.05, d.fim + 0.08, cor=E_CANETA, lw=1.8)
d2 = escrever(s, ML, d.fim + 0.7, LARG,
              ["Ao comprar um domínio, o registro do TLD grava na zona dele os `NS` que você indicou."],
              dict(f=TITULO, s=26, c=E_INK, b=True, codigo=dict(c=E_INK, b=False)), pitch=32)
escrever(s, ML, d2.fim + 0.2, LARG,
         ["No `.br`, é o Registro.br; a IANA delega o `.br` ao Comitê Gestor da Internet no Brasil."],
         dict(f=UI, s=14, c=E_INK2, codigo=dict(c=E_INK)), pitch=18)
deck.notas(s, "Domínio e zona são coisas diferentes. Um domínio é um galho da árvore, com tudo o que está embaixo "
              "dele; uma zona é o pedaço que um mesmo conjunto de servidores responde, com autoridade. A zona com não "
              "guarda os endereços de example.com, só o recado de quem responde por ele: a delegação, feita com "
              "registros NS. É isso que acontece ao comprar um domínio: o registro do TLD, o Registro.br no .br, grava "
              "na zona dele os NS do provedor de DNS escolhido, e cada registro novo é criado nesse provedor.")

# 5 ---------------------------------------------------------------- a raiz
s = deck.slide("A consulta")
deck.cabeca(s, "Como uma consulta chega à resposta", "O resolvedor sempre começa pela raiz")
d = escrever(s, ML, 1.9, LARG - 1.2,
             ["Ao abrir `www.example.com`, o sistema operacional não sai perguntando para a árvore. Ele pergunta a um "
              "**resolvedor recursivo**: o do provedor de internet, o da empresa ou um público, como o do Google ou "
              "o da Cloudflare.",
              "O resolvedor faz o trabalho de descer a árvore, guarda o que aprendeu e sempre sabe por onde começar: "
              "os servidores raiz."], dict(f=TEXTO, s=17, c=INK, codigo=dict(c=INK)), pitch=25, depois=12)
cw5 = (LARG - 2 * 0.4) / 3
yn = d.fim + 1.3
NUM5 = (("13 identidades", "de `a.root-servers.net` a `m.root-servers.net`"),
        ("12 organizações", "independentes operam os servidores raiz"),
        ("mais de 2.000", "instâncias, no root-servers.org em 04/10/2026: cada identidade é servida por muitas "
                          "máquinas"))
tam5 = 40
while max(larg(v, TITULO, tam5, True) for v, _ in NUM5) > cw5 * 0.92:
    tam5 -= 1
for i, (valor, rotulo) in enumerate(NUM5):
    escrever(s, ML + i * (cw5 + 0.4), yn, cw5, [valor], dict(f=TITULO, s=tam5, c=LIVRO if i == 0 else INK, b=True),
             pitch=tam5 * 1.15)
    escrever(s, ML + i * (cw5 + 0.4), yn + tam5 * 1.15 / 72 + 0.1, cw5 - 0.2, [rotulo],
             dict(f=UI, s=13.5, c=INK2, codigo=dict(s=12, c=INK)), pitch=18)
w13 = larg("13 identidades", TITULO, tam5, True)
nota(s, ML + w13 * 0.5, yn - 0.62, 2.6, "não 13 máquinas", tam=21)
seta(s, curva((ML + w13 * 0.5 - 0.06, yn - 0.44), (ML + w13 * 0.32, yn - 0.34), (ML + w13 * 0.24, yn - 0.02)),
     ponta=0.07)
deck.notas(s, "O sistema operacional pergunta a um resolvedor recursivo: o do provedor de internet, o da empresa ou "
              "um público, como o do Google ou o da Cloudflare. O resolvedor desce a árvore e guarda o que aprendeu. "
              "Ele sempre começa pelos servidores raiz: são 13 identidades, de a a m.root-servers.net, operadas por "
              "12 organizações independentes. Cada identidade é um endereço servido por muitas máquinas: o "
              "root-servers.org contava mais de 2.000 instâncias em 04/10/2026.")

# 6 ---------------------------------------------------------------- a consulta em passos
s = deck.slide("A consulta")
deck.cabeca(s, "Como uma consulta chega à resposta", "Da raiz ao autoritativo, em cinco passos")
pic, iw, ih = imagem(s, img("passos-1.png"), ML, 1.75, h=5.1, raio_px=20,
                     alt="A consulta em passos, no quadro final: o navegador pergunta ao resolvedor o endereço de "
                         "www.example.com; a raiz devolve os NS do com; o TLD, os NS de example.com; o autoritativo "
                         "devolve o endereço com TTL de 300 s; e o resolvedor entrega 172.66.147.243 ao navegador, "
                         "guardando no cache por 300 s.")
px = ML + iw + 0.45
y = bolinhas(s, px, 1.85, W - MR - px,
             [(AZUL, "O navegador pergunta ao resolvedor o endereço de `www.example.com`."),
              (ROXO, "A raiz não sabe o endereço, mas indica os servidores do `com`."),
              (ROXO, "O servidor do `com` indica os servidores de `example.com`."),
              (VERDE, "O servidor autoritativo de `example.com` responde com o endereço."),
              (PETROLEO, "O resolvedor guarda a resposta pelo TTL e entrega ao navegador.")], tam=14.5, pitch=20)
legenda(s, px + 0.5, y + 0.15, W - MR - px - 0.5,
        "Azul é o navegador, petróleo o resolvedor, roxo os servidores que só indicam o caminho e verde o "
        "autoritativo, que tem a resposta.")
deck.notas(s, "A consulta passa por cinco passos. O navegador pergunta ao resolvedor; a raiz não sabe o endereço, mas "
              "indica os servidores do com; o servidor do com indica os de example.com; o autoritativo de example.com "
              "responde com o endereço; e o resolvedor guarda a resposta pelo TTL e entrega ao navegador. Na figura, "
              "roxo são os servidores que só indicam o caminho, e verde o autoritativo, que tem a resposta.")

# 7 ---------------------------------------------------------------- dig +trace
s = deck.slide("A consulta")
deck.cabeca(s, "Como uma consulta chega à resposta", "O `dig +trace` mostra cada degrau")
lw7 = 4.55
d = escrever(s, ML, 1.9, lw7,
             ["Cada servidor {dp:responde só o que sabe}. A raiz e o servidor do `com` não têm o endereço e respondem "
              "com uma **indicação** (~referral~): os `NS` do nível de baixo.",
              "Só o **autoritativo** de `example.com` tem a resposta final, com o **TTL**, em segundos: o tempo que o "
              "resolvedor guarda a resposta.",
              "A próxima pergunta, de qualquer pessoa que use o mesmo resolvedor, sai do cache sem passar pela árvore."],
             dict(f=TEXTO, s=15, c=INK, codigo=dict(c=INK)), pitch=21.5, depois=11, marcas={"dp": "duplo"})
TRACE = [".                 600     IN  NS  a.root-servers.net.",
         ".                 600     IN  NS  m.root-servers.net.",
         ";; Received 811 bytes from fe80::1%14#53(fe80::1%14)",
         "",
         "com.              172800  IN  NS  a.gtld-servers.net.",
         "com.              172800  IN  NS  m.gtld-servers.net.",
         ";; Received 840 bytes from 192.112.36.4#53(g.root-servers.net)",
         "",
         "example.com.      172800  IN  NS  hera.ns.cloudflare.com.",
         "example.com.      172800  IN  NS  elliott.ns.cloudflare.com.",
         ";; Received 363 bytes from 192.12.94.30#53(e.gtld-servers.net)",
         "",
         "www.example.com.  300     IN  A   172.66.147.243",
         "www.example.com.  300     IN  A   104.20.23.154",
         ";; Received 76 bytes from 162.159.44.228#53(elliott.ns.cloudflare.com)"]
TAM7 = 10
cx7 = ML + lw7 + 0.4
c7 = codigo(s, cx7, 1.85, W - MR - cx7, "dig +trace www.example.com",
            [linha_cod(t, C_COM, "i") if t.startswith(";;") else linha_cod(t) for t in TRACE], tam=TAM7, pitch=14.5)
# a anotação do código: o 300 da primeira resposta circulado e a nota ao lado
l300 = 12
x300 = c7["texto_x"] + larg("www.example.com.  ", MONO, TAM7)
w300 = larg("300", MONO, TAM7)
cy300 = c7["topo"] + l300 * c7["pin"] + c7["pin"] / 2 + 0.01
circulo(s, cx=x300 + w300 / 2, cy=cy300, rx=w300 / 2 + 0.08, ry=0.12, seed=7)
fim300 = c7["texto_x"] + larg("www.example.com.  300     IN  A   172.66.147.243", MONO, TAM7)
nota(s, fim300 + 0.4, c7["topo"] + l300 * c7["pin"] - 0.07, 1.9, "5 min em cache", tam=18)
seta(s, curva((fim300 + 0.36, cy300 - 0.02), (fim300 - 0.4, cy300 - 0.32), (x300 + w300 + 0.12, cy300 - 0.08)),
     ponta=0.07)
legenda(s, cx7, c7["y"] + c7["h"] + 0.12, W - MR - cx7,
        "A saída real de 04/10/2026, resumida: o resolvedor local deu a lista da raiz, a raiz indicou o `com`, o "
        "`com` indicou a Cloudflare, e a Cloudflare deu o endereço.")
deck.notas(s, "Cada servidor do caminho responde só o que sabe. A raiz e o servidor do com não têm o endereço e "
              "respondem com uma indicação, os NS do nível de baixo; só o autoritativo da zona example.com tem a "
              "resposta final. O dig +trace faz esse caminho a partir da raiz. Na saída real de 04/10/2026, cada bloco "
              "é um degrau, e o servidor da Cloudflare deu o endereço com TTL de 300 segundos: cinco minutos em cache.")

# 8 ---------------------------------------------------------------- a zona
s = deck.slide("Os tipos de registro")
deck.cabeca(s, "Os tipos de registro e para que serve cada um", "Uma zona lista os registros do domínio")
ZONA = [("$ORIGIN example.com.", INK), ("$TTL 3600", INK), ("", INK),
        ("; a zona: quem responde por ela e os tempos", C_COM, "i"),
        ("@        IN  SOA   ns1.example.net. hostmaster.example.com. (", INK),
        ("                   2026100401 ; serial", INK), ("                   7200       ; refresh", INK),
        ("                   900        ; retry", INK), ("                   1209600    ; expire", INK),
        ("                   300 )      ; minimum (cache negativo)", INK),
        ("@        IN  NS    ns1.example.net.", INK), ("@        IN  NS    ns2.example.net.", INK), ("", INK),
        ("; o site no GitHub Pages: o domínio principal e o www", C_COM, "i"),
        ("@        IN  A     185.199.108.153", INK), ("@        IN  A     185.199.109.153", INK),
        ("@        IN  A     185.199.110.153", INK), ("@        IN  A     185.199.111.153", INK),
        ("@        IN  AAAA  2606:50c0:8000::153", INK), ("@        IN  AAAA  2606:50c0:8001::153", INK),
        ("@        IN  AAAA  2606:50c0:8002::153", INK), ("@        IN  AAAA  2606:50c0:8003::153", INK),
        ("www      IN  CNAME usuario.github.io.", INK),
        ('_github-pages-challenge-usuario IN TXT "a1b2c3d4e5f6"', INK)]
TAM8 = 10
cw8 = 6.55
c8 = codigo(s, ML, 1.72, cw8, "example.com.zone", [[z] for z in ZONA], tam=TAM8, pitch=13.4)
l23 = 22
yb0 = c8["topo"] + l23 * c8["pin"]
barra(s, ML + 0.17, yb0 + 0.03, yb0 + c8["pin"] - 0.03)
fim23 = c8["texto_x"] + larg("www      IN  CNAME usuario.github.io.", MONO, TAM8)
nota(s, fim23 + 0.42, yb0 - 0.04, 2.6, "com ponto: nome absoluto", tam=17)
seta(s, curva((fim23 + 0.37, yb0 + 0.11), (fim23 + 0.22, yb0 + 0.06), (fim23 + 0.08, yb0 + 0.1)), ponta=0.06)
rx8 = ML + cw8 + 0.45
rw8 = W - MR - rx8
escrever(s, rx8, 1.78, rw8, ["Cada registro tem cinco partes:"], dict(f=UI, s=13.5, c=INK2, b=True), pitch=17)
y = 2.18
for termo, txt in (("nome", "`www`, ou `@` para o próprio domínio"), ("TTL", "em segundos; sem ele, o `$TTL`"),
                   ("classe", "na prática, sempre `IN`, de internet"), ("tipo", "`A`, `CNAME`, `MX`, `TXT`…"),
                   ("dado", "o endereço, o nome ou o texto")):
    escrever(s, rx8, y, 1.0, [termo], dict(f=MONO, s=12, c=LIVRO, b=True), pitch=19)
    d = escrever(s, rx8 + 0.95, y, rw8 - 0.95, [txt], dict(f=TEXTO, s=14, c=INK, codigo=dict(c=INK)), pitch=19)
    y = d.fim + 0.08
d = escrever(s, rx8, y + 0.25, rw8,
             ["O `@` é o próprio domínio (o ~apex~), e um nome sem ponto final, como `www`, ganha o domínio no fim: "
              "vira `www.example.com.`",
              "Em 04/10/2026, essa zona foi carregada no Unbound 1.24.2, e cada registro do post foi consultado com "
              "`dig`."], dict(f=TEXTO, s=14, c=INK2, codigo=dict(c=INK)), pitch=19.5, depois=9)
carimbo(s, rx8 + 0.6, d.fim + 0.3, 3.6, "zona testada no Unbound 1.24.2")
deck.notas(s, "Cada registro tem cinco partes: o nome, o TTL, a classe (na prática, sempre IN), o tipo e o dado. A zona "
              "de um domínio é a lista dos registros dele, e o painel do provedor de DNS mostra os mesmos campos numa "
              "tabela. Esta é a zona de example.com configurada para o GitHub Pages; as linhas do e-mail aparecem mais "
              "adiante. O @ é o próprio domínio, e um nome sem ponto final ganha o domínio no fim. A zona foi testada "
              "no Unbound 1.24.2 em 04/10/2026.")

# 9 ---------------------------------------------------------------- a tabela dos tipos
s = deck.slide("Os tipos de registro")
deck.cabeca(s, "Os tipos de registro e para que serve cada um", "Dez tipos, e cada um guarda uma coisa")
TIPOS = [("A", "um endereço IPv4", "o site, a API"), ("AAAA", "um endereço IPv6", "o mesmo, em IPv6"),
         ("CNAME", "outro nome, do qual este é apelido", "`www` apontando para um serviço de hospedagem"),
         ("MX", "o servidor que recebe e-mail, com prioridade", "o e-mail do domínio"),
         ("TXT", "texto livre", "SPF, DKIM, DMARC, verificação de domínio"),
         ("NS", "os servidores que respondem pela zona", "a delegação"),
         ("SOA", "os dados da zona: dono, serial e tempos", "um por zona, no apex"),
         ("CAA", "quem pode emitir certificado", "proteger o HTTPS"),
         ("SRV", "servidor e porta de um serviço", "protocolos como SIP e IMAP"),
         ("PTR", "o nome de um endereço", "DNS reverso")]
tabela(s, ML, 1.8, LARG,
       [("Tipo", 1.55, dict(f=MONO, s=13.5, c=ACENTO, b=True)), ("O que guarda", 5.0, dict(f=TEXTO, s=14.5, c=INK)),
        ("Uso típico", LARG - 0.25 - 1.55 - 5.0, dict(f=UI, s=13, c=INK2, codigo=dict(c=INK)))],
       TIPOS, altura_linha=0.45)
deck.notas(s, "A tabela resume os tipos. A e AAAA guardam endereços, IPv4 e IPv6. CNAME aponta um nome para outro. MX "
              "diz quem recebe o e-mail, e TXT guarda texto livre: SPF, DKIM, DMARC e as verificações de domínio. NS e "
              "SOA são da própria zona: a delegação e os dados dela. CAA diz quem pode emitir certificado, SRV anuncia "
              "servidor e porta de um serviço, e PTR é o DNS reverso.")

# 10 --------------------------------------------------------------- A, AAAA e CNAME
s = deck.slide("Os tipos de registro")
deck.cabeca(s, "A e AAAA, CNAME", "A e AAAA dão o endereço; CNAME, o apelido", tam=32)
fw10 = (LARG - 0.35) / 2
for i, (esq, dir_, cor, txt) in enumerate((
        ("A e AAAA", "o endereço", AZUL,
         "O `A` guarda um endereço IPv4, de 32 bits, e o `AAAA`, um IPv6, de 128 bits. Um nome pode ter vários de "
         "cada: o cliente recebe todos e escolhe um, o que já reparte a carga e dá alternativa se um endereço falhar."),
        ("CNAME", "um nome que aponta para outro", PETROLEO,
         "Ao perguntar por `www.example.com`, o resolvedor recebe “`www.example.com` é `usuario.github.io`” e repete "
         "a pergunta para o nome novo. Quem cuida do nome canônico troca os endereços sem você mexer na sua zona."))):
    fx = ML + i * (fw10 + 0.35)
    ty = ficha(s, fx, 1.8, fw10, 2.45, esq, dir_, cor)
    escrever(s, fx + 0.28, ty + 0.22, fw10 - 0.56, [txt], dict(f=TEXTO, s=14.5, c=INK, codigo=dict(c=INK)), pitch=20.5)
d = escrever(s, ML + 0.3, 4.65, LARG - 0.6,
             ["A regra que mais pega, da RFC 1034 e da RFC 2181: **um nome com `CNAME` não pode ter nenhum outro registro**.",
              "Como o apex sempre tem `SOA` e `NS`, {mk:o domínio principal não pode ser um `CNAME`}. Por isso, no "
              "GitHub Pages, o `www` usa `CNAME`, e o `example.com` usa `A` e `AAAA`."],
             dict(f=TEXTO, s=18, c=INK, codigo=dict(c=INK)), pitch=26, depois=12, marcas={"mk": "marca"})
deck.notas(s, "O A guarda um endereço IPv4 e o AAAA, um IPv6; um nome pode ter vários de cada, e o cliente escolhe um. "
              "O CNAME diz que um nome é apelido de outro: o resolvedor repete a pergunta para o nome canônico, e quem "
              "cuida dele pode trocar os endereços sem mexer na sua zona. A regra que mais pega: um nome com CNAME não "
              "pode ter nenhum outro registro. Como o apex sempre tem SOA e NS, o domínio principal não pode ser um "
              "CNAME; por isso, no GitHub Pages, o www usa CNAME e o example.com usa A e AAAA.")

# 11 --------------------------------------------------------------- MX, TXT, NS e SOA
s = deck.slide("Os tipos de registro")
deck.cabeca(s, "MX, TXT, NS e SOA", "MX e TXT servem a outros; NS e SOA, à zona", tam=32)
fw11, fh11 = (LARG - 0.35) / 2, 2.42
F11 = [("MX", "quem recebe o e-mail", AZUL,
        "Cada servidor tem uma preferência: **o menor número é tentado primeiro**. Com `10 mx1` e `20 mx2`, o `mx2` "
        "só entra se o `mx1` não responder. O alvo precisa ter endereço próprio, {on:nunca um `CNAME`}.",
        {"on": "ondulado"}),
       ("TXT", "texto que outros sistemas leem", AMBAR,
        "Guarda o SPF, o DKIM, o DMARC e as **verificações de domínio**: o GitHub, o Google e os serviços de e-mail "
        "pedem um código num nome combinado, para provar que o domínio é seu. {dp:Só o dono da zona} consegue "
        "criar o registro.", {"dp": "duplo"}),
       ("NS", "a delegação", ROXO,
        "Lista os servidores que respondem por uma zona. Aparece na zona de cima (o `com` dizendo quem responde por "
        "`example.com`) e na própria zona, que repete a lista.", {}),
       ("SOA", "start of authority", VERDE,
        "Abre a zona, e há um só: o servidor principal, o e-mail do responsável, o serial e quatro tempos. O "
        "`minimum` é o TTL do **cache negativo**: `nao-existe.example.com` voltou com {ex:TTL de 300}.", {})]
for i, (esq, dir_, cor, txt, mk) in enumerate(F11):
    fx, fy = ML + (i % 2) * (fw11 + 0.35), 1.72 + (i // 2) * (fh11 + 0.25)
    ty = ficha(s, fx, fy, fw11, fh11, esq, dir_, cor)
    d = escrever(s, fx + 0.28, ty + 0.18, fw11 - 0.56, [txt], dict(f=TEXTO, s=14, c=INK, codigo=dict(c=INK)),
                 pitch=19.5, marcas=mk)
    if "ex" in d.marcas:
        explica(s, d.marcas["ex"][-1], "o menor entre 300 e 3600", tam=17)
deck.notas(s, "O MX diz quais servidores recebem o e-mail do domínio, e o menor número é tentado primeiro; o alvo "
              "precisa ser um nome com endereço próprio, nunca um CNAME. O TXT guarda texto livre e virou o lugar das "
              "regras do e-mail e das verificações de domínio: só o dono da zona consegue criar o registro. O NS lista "
              "os servidores da zona, na zona de cima e na própria. O SOA abre a zona, e o minimum dele é o TTL do "
              "cache negativo: a consulta por um nome que não existe voltou com TTL de 300, o menor entre o minimum e "
              "o TTL do próprio SOA.")

# 12 --------------------------------------------------------------- os menos comuns
s = deck.slide("Os tipos de registro")
deck.cabeca(s, "Os menos comuns", "Os menos comuns, e dois fora do padrão")
MENOS = [("CAA", "quem emite certificado",
          "Com `0 issue \"letsencrypt.org\"`, só a Let's Encrypt pode; `issuewild` vale para certificados curinga. "
          "Sem `CAA`, {on:qualquer uma pode}.", {"on": "ondulado"}),
         ("SRV", "servidor e porta",
          "Num nome `_servico._protocolo.dominio`, com prioridade e peso. É como clientes de SIP, XMPP e e-mail "
          "descobrem onde se conectar.", {}),
         ("PTR", "do endereço para o nome",
          "`192.0.2.10` vira `10.2.0.192.in-addr.arpa`, com os números invertidos. Quem cria é o dono do bloco de "
          "IPs (o provedor), não o dono do domínio.", {}),
         ("HTTPS e SVCB", "a conexão na consulta",
          "Entregam ao navegador, na mesma consulta, os parâmetros da conexão, como o suporte a HTTP/3, e aceitam "
          "apelido no apex, o que o `CNAME` não faz.", {}),
         ("ALIAS e ANAME", "recurso do provedor",
          "Os dois {on:não são tipos do padrão}: o rascunho do ANAME expirou em 2021. O provedor resolve o destino "
          "e publica os endereços no apex; o nome e o comportamento mudam de um para outro.", {"on": "ondulado"})]
fw12, gap12, fh12 = (LARG - 2 * 0.25) / 3, 0.25, 2.45
for i, (esq, dir_, txt, mk) in enumerate(MENOS):
    linha = i // 3
    x0 = ML if linha == 0 else ML + (fw12 + gap12) / 2
    fx, fy = x0 + (i % 3) * (fw12 + gap12), 1.75 + linha * (fh12 + 0.22)
    ty = ficha(s, fx, fy, fw12, fh12, esq, dir_, LIVRO)
    escrever(s, fx + 0.22, ty + 0.17, fw12 - 0.44, [txt], dict(f=TEXTO, s=13.5, c=INK, codigo=dict(c=INK)),
             pitch=18.5, marcas=mk)
deck.notas(s, "O CAA diz quais autoridades certificadoras podem emitir certificado para o domínio; sem ele, qualquer "
              "uma pode. O SRV anuncia servidor e porta de um serviço, e o PTR faz o caminho inverso, do endereço para "
              "o nome, criado pelo dono do bloco de IPs. O HTTPS, e o irmão SVCB, entrega os parâmetros da conexão e "
              "aceita apelido no apex. ALIAS e ANAME não são tipos do padrão: são recursos de cada provedor, como o "
              "CNAME flattening da Cloudflare.")

# 13 --------------------------------------------------------------- GitHub Pages
s = deck.slide("GitHub Pages")
deck.cabeca(s, "Domínio próprio no GitHub Pages", "O apex usa A e AAAA; o www, um CNAME")
pic, iw, ih = imagem(s, img("figura-2.png"), ML, 1.75, w=6.6, raio_px=20,
                     alt="Dois caminhos para os mesmos servidores do GitHub Pages. Na sua zona, example.com com quatro "
                         "A e quatro AAAA, de 185.199.108.153 a 111.153 e de 2606:50c0:8000::153 a 8003::153, aponta "
                         "direto para os servidores do site; www.example.com, com CNAME usuario.github.io., passa por "
                         "usuario.github.io; embaixo, o TXT de verificação, sem seta.")
legenda(s, ML, 1.75 + ih + 0.1, iw,
        "Verde é a sua zona e âmbar o GitHub; o TXT de verificação fica embaixo, sem seta, e não leva tráfego a "
        "lugar nenhum.")
rx = ML + iw + 0.45
rw = W - MR - rx
d = escrever(s, rx, 1.8, rw,
             ["**O domínio principal:** quatro `A` e quatro `AAAA`, com os endereços do GitHub Pages. Com `ALIAS` ou "
              "`ANAME` no provedor, ele pode apontar para `usuario.github.io`.",
              "**Um subdomínio:** um `CNAME` para `usuario.github.io`, {on:sem o nome do repositório}, mesmo num "
              "repositório de projeto.",
              "Com os dois configurados, o GitHub redireciona um para o outro. O endereço vai em **Settings → Pages → "
              "Custom domain**.",
              "Por branch, o domínio vai num arquivo `CNAME` na raiz dela; por GitHub Actions, {rs:um que exista é "
              "ignorado}."],
             dict(f=TEXTO, s=14, c=INK, codigo=dict(c=INK)), pitch=19.5, depois=10, marcas={"on": "ondulado"})
ressalva(s, d.marcas["rs"][-1], tam=20)
nota(s, rx, d.fim + 0.08, rw, "* o caso deste blog (Actions)", tam=18)
deck.notas(s, "O GitHub Pages separa dois casos. O domínio principal recebe quatro A e quatro AAAA, com os endereços "
              "do GitHub. Um subdomínio recebe um CNAME para usuario.github.io, sem o nome do repositório. O GitHub "
              "recomenda configurar o domínio principal e o www juntos: ele redireciona sozinho o que não foi "
              "configurado para o que foi. Quem publica por um workflow do GitHub Actions não precisa do arquivo "
              "CNAME, e um que exista é ignorado: é o caso deste blog.")

# 14 --------------------------------------------------------------- verificar e HTTPS
s = deck.slide("GitHub Pages")
deck.cabeca(s, "Domínio próprio no GitHub Pages", "Verifique o domínio e ligue o HTTPS")
fw14, fh14 = (LARG - 0.35) / 2, 3.05
ty = ficha(s, ML, 1.8, fw14, fh14, "verificar o domínio", "um TXT", VERDE)
escrever(s, ML + 0.28, ty + 0.2, fw14 - 0.56,
         ["Em **Settings → Pages** da conta (não do repositório), o GitHub dá um código para publicar num `TXT` em "
          "`_github-pages-challenge-usuario.example.com`.",
          "{mk:Com o domínio verificado, outra conta não consegue publicar um site nele.}"],
         dict(f=TEXTO, s=15, c=INK, codigo=dict(s=12.5, c=INK)), pitch=21, depois=10, marcas={"mk": "marca"})
fx = ML + fw14 + 0.35
ty = ficha(s, fx, 1.8, fw14, fh14, "ligar o HTTPS", "Let's Encrypt", AMBAR)
escrever(s, fx + 0.28, ty + 0.2, fw14 - 0.56,
         ["O GitHub pede o certificado à Let's Encrypt sozinho, e o **Enforce HTTPS** faz todo acesso por HTTP ir "
          "para o HTTPS.",
          "`A` ou `AAAA` a mais no apex, apontando para outro lugar, atrapalham a emissão, e um `CAA` precisa incluir "
          "\u2009{cx:`letsencrypt.org`}."],
         dict(f=TEXTO, s=15, c=INK, codigo=dict(c=INK)), pitch=21, depois=10, marcas={"cx": "caixa"})
aviso(s, ML, 5.2, LARG, "Cuidado",
      "Não use um registro curinga (`*.example.com`) apontando para o GitHub Pages. A documentação avisa que ele abre "
      "espaço para alguém tomar subdomínios seus, mesmo com o domínio verificado.", cor=CUIDADO, h=1.35, tam=15)
deck.notas(s, "Depois vêm dois cuidados. Verificar o domínio: nas configurações de Pages da conta, o GitHub dá um código "
              "para publicar num TXT; com o domínio verificado, outra conta não consegue publicar um site nele. Sem a "
              "verificação, um site desativado com o domínio ainda apontando para o GitHub pode ser tomado. E ligar o "
              "HTTPS: o GitHub pede o certificado à Let's Encrypt, e um CAA precisa incluir letsencrypt.org. Nunca um "
              "registro curinga apontando para o GitHub Pages.")

# 15 --------------------------------------------------------------- e-mail
s = deck.slide("E-mail do domínio")
deck.cabeca(s, "E-mail do domínio: MX, SPF, DKIM e DMARC", "Receber pede o MX; enviar bem, três TXT")
EMAIL = [("; o e-mail", C_COM, "i"), ("@        IN  MX    10 mx1.example.net.", INK),
         ("@        IN  MX    20 mx2.example.net.", INK),
         ('@        IN  TXT   "v=spf1 include:_spf.example.net -all"', INK),
         ('s1._domainkey IN TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkqh...IDAQAB"', INK),
         ('_dmarc   IN  TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"', INK)]
cw15 = 7.35
c15 = codigo(s, ML, 1.72, cw15, "example.com.zone", [[z] for z in EMAIL], tam=11.5, pitch=16)
fy15 = c15["y"] + c15["h"] + 0.28
nx15 = ML + cw15 + 0.45
nw15 = W - MR - nx15
escrever(s, nx15, 1.8, nw15, ["10 consultas"], dict(f=TITULO, s=34, c=LIVRO, b=True), pitch=40)
dn = escrever(s, nx15, 2.47, nw15, ["ao DNS, no máximo, na avaliação do SPF, e {nt:cada `include` conta}"],
              dict(f=UI, s=14, c=INK2, codigo=dict(c=INK)), pitch=19)
sg = dn.marcas["nt"][-1]
ny15 = dn.fim + 0.2
nota(s, sg["x0"] + 0.45, ny15, 2.4, "fácil de estourar", tam=21)
seta(s, curva((sg["x0"] + 0.4, ny15 + 0.2), (sg["x0"] + 0.16, ny15 + 0.16), (sg["x0"] + 0.12, sg["base"] + 0.08)),
     ponta=0.07)
fw15, fh15 = (LARG - 2 * 0.28) / 3, 6.95 - fy15
F15 = [("SPF", "quem pode enviar", AZUL,
        "Um `TXT` no apex, começando por `v=spf1`: o `include` aceita os servidores do provedor, e o `-all` diz que o "
        "resto falha (o `~all` só marca como suspeito)."),
       ("DKIM", "a chave pública", PETROLEO,
        "Confere a assinatura das mensagens, num `TXT` em {cx:`seletor._domainkey.example.com`}. O seletor (`s1`) "
        "permite uma chave por serviço que envia."),
       ("DMARC", "o que fazer na falha", ROXO,
        "`p=none`, `p=quarantine` ou `p=reject`, e os relatórios em `rua`, num `TXT` em `_dmarc.example.com`. Padrão "
        "da IETF desde maio de 2026: a RFC 9989, que substituiu a {rc:RFC 7489}.")]
for i, (esq, dir_, cor, txt) in enumerate(F15):
    fx = ML + i * (fw15 + 0.28)
    ty = ficha(s, fx, fy15, fw15, fh15, esq, dir_, cor)
    d = escrever(s, fx + 0.22, ty + 0.17, fw15 - 0.44, [txt],
                 dict(f=TEXTO, s=14, c=INK, codigo=dict(s=12, c=INK)), pitch=19.5, marcas={"cx": "caixa"})
    for seg in d.marcas.get("rc", []):
        riscado(s, seg)
deck.notas(s, "Receber e-mail pede só o MX. Enviar e-mail que chegue na caixa de entrada pede mais três registros TXT. "
              "O SPF lista quem pode enviar em nome do domínio, e a avaliação para depois de 10 consultas ao DNS: cada "
              "include conta. O DKIM publica a chave pública que confere a assinatura, num nome com o seletor. O DMARC "
              "diz o que fazer com a mensagem que falha e para onde mandar os relatórios; virou padrão da IETF em maio "
              "de 2026, com a RFC 9989, que substituiu a RFC 7489.")

# 16 --------------------------------------------------------------- DMARC aos poucos
s = deck.slide("E-mail do domínio")
deck.cabeca(s, "E-mail do domínio: o DMARC", "O DMARC observa antes de recusar")
d = escrever(s, ML + 0.55, 1.95, LARG - 1.5,
             ["O caminho comum é começar o DMARC com `p=none`, ler os relatórios por algumas semanas para descobrir "
              "quem mais envia em nome do domínio (o sistema de cobrança, a ferramenta de newsletter) e só então subir "
              "para `quarantine` e `reject`."], dict(f=TEXTO, s=19, c=INK, codigo=dict(c=INK)), pitch=27)
visto(s, ML, 2.0)
escada(s, [("p=none", "só observar", "algumas semanas"), ("p=quarantine", "mandar para o spam", ""),
           ("p=reject", "recusar", "")], ML + 0.5, 6.6, LARG - 1.0, 0.75, resposta=None)
deck.notas(s, "O caminho comum é começar o DMARC com p=none, só observando, e ler os relatórios por algumas semanas. "
              "Eles mostram quem mais envia em nome do domínio, como o sistema de cobrança ou a ferramenta de "
              "newsletter. Só então a política sobe para quarantine, que manda para o spam, e para reject, que recusa.")

# 17 --------------------------------------------------------------- TTL
s = deck.slide("TTL e a propagação")
deck.cabeca(s, "TTL e a tal propagação", "A propagação é o cache expirando")
pic, iw, ih = imagem(s, img("passos-2.png"), ML, 1.75, h=5.05, raio_px=20,
                     alt="O TTL em passos, no quadro final: o resolvedor busca 192.0.2.10 com TTL 3600 e guarda por 1 "
                         "hora; o dono troca o A para 198.51.100.20; o navegador pergunta e recebe 192.0.2.10, do "
                         "cache; 1 hora depois, TTL 0 e cache vazio, o navegador pergunta de novo; e o resolvedor busca "
                         "198.51.100.20 e entrega. Embaixo: da troca ao fim do TTL, o resolvedor entrega o IP antigo.")
rx = ML + iw + 0.45
rw = W - MR - rx
d = escrever(s, rx, 1.78, rw,
             ["A documentação do GitHub fala em até 24 horas. Mas nada é empurrado para os servidores do mundo: o "
              "autoritativo responde o valor novo na hora, e {mk:cada resolvedor continua entregando o valor antigo, "
              "do cache, até o TTL dele acabar}."], dict(f=TEXTO, s=14.5, c=INK), pitch=20.5, marcas={"mk": "marca"})
HAB = [("Baixe o TTL antes da troca.", "Um dia antes, para 300 segundos: os caches seguram o valor antigo por no "
                                       "máximo cinco minutos."),
       ("Limpe o cache de um resolvedor público.", "O Google Public DNS tem uma página para limpar o cache de um "
                                                   "nome."),
       ("Lembre do cache negativo.", "Consultar um nome antes de criá-lo guarda o “não existe” pelo `minimum` do `SOA`.")]
fy = d.fim + 0.25
topo = fy + 0.62
blocos, yy = [], topo
for a, b in HAB:
    da = diagramar(rx + 0.26, yy + 0.12, rw - 0.45, [a], dict(f=UI, s=12.5, c=INK, b=True), pitch=15.5)
    db = diagramar(rx + 0.26, da.fim + 0.03, rw - 0.45, [b], dict(f=TEXTO, s=12.5, c=INK2, codigo=dict(c=INK)),
                   pitch=16.5)
    blocos.append((da, db))
    yy = db.fim + 0.12
ficha_pautada(s, rx, fy, rw, yy - fy + 0.02, "Três hábitos", [db.fim + 0.1 for _, db in blocos[:-1]], tam_titulo=23)
if yy > 7.0:
    print(f"AVISO: a ficha dos hábitos passa do pé ({yy:.2f})")
for da, db in blocos:
    colocar(s, da)
    colocar(s, db)
deck.notas(s, "Depois de trocar um registro, é comum ouvir que é preciso esperar a propagação, e a documentação do "
              "GitHub fala em até 24 horas. Mas o autoritativo responde o valor novo na hora; cada resolvedor continua "
              "entregando o valor antigo, do cache, até o TTL acabar. Daí saem três hábitos: baixar o TTL para 300 "
              "segundos um dia antes da troca e voltar ao valor de antes depois dela; limpar o cache de um resolvedor "
              "público, lembrando que o Google Public DNS costuma limitar o cache a seis horas; e lembrar do cache "
              "negativo.")

# 18 --------------------------------------------------------------- dig
s = deck.slide("Conferir com dig")
deck.cabeca(s, "Conferir os registros com dig", "O `dig` com `+short` mostra só a resposta")
CMDS = ["dig example.com A +short", "dig www.example.com CNAME +short", "dig example.com MX +short",
        "dig _dmarc.example.com TXT +short", "dig @8.8.8.8 example.com A +short"]
lw18 = 5.3
c18 = codigo(s, ML, 1.75, lw18, "Terminal", [[("dig", COD_CHAVE), (t[3:], INK)] for t in CMDS], tam=12, pitch=19)
SAIDA = [("$ dig example.com MX +short", INK2), ("10 mx1.example.net.", INK), ("20 mx2.example.net.", INK), ("", INK),
         ("$ dig www.example.com CNAME +short", INK2), ("usuario.github.io.", INK), ("", INK),
         ("$ dig _dmarc.example.com TXT +short", INK2),
         ('"v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"', COD_TEXTO)]
cx18 = ML + lw18 + 0.35
c18b = codigo(s, cx18, 1.75, W - MR - cx18, "Terminal: as respostas, na zona de exemplo", [[z] for z in SAIDA],
              tam=11, pitch=16)
d = escrever(s, ML, max(c18["y"] + c18["h"], c18b["y"] + c18b["h"]) + 0.4, LARG - 1.0,
             ["A última pergunta direto ao resolvedor do Google, sem passar pelo da sua rede.",
              "Comparar a resposta do autoritativo (`dig @ns1.example.net …`) com a de um resolvedor mostra se a "
              "diferença é {dp:cache ou erro na zona}."],
             dict(f=TEXTO, s=16, c=INK, codigo=dict(c=INK)), pitch=23, depois=8, marcas={"dp": "duplo"})
escrever(s, ML, d.fim + 0.3, LARG,
         ["Quando o site não abre, `dig +trace` mostra em que degrau a resposta muda: se a delegação do TLD aponta para "
          "os servidores certos, e se o autoritativo responde o que você espera."],
         dict(f=TEXTO, s=15, c=INK2, codigo=dict(c=INK)), pitch=21)
deck.notas(s, "O dig vem no macOS e na maioria das distribuições Linux; no Windows, o nslookup faz o básico. Com +short, "
              "ele mostra só a resposta. A última linha pergunta direto ao resolvedor do Google, sem passar pelo da "
              "sua rede. Comparar a resposta do autoritativo com a de um resolvedor mostra se a diferença é cache ou "
              "erro na zona. Quando o site não abre, o dig +trace mostra em que degrau a resposta muda.")

# 19 --------------------------------------------------------------- erros comuns
s = deck.slide("Erros comuns")
deck.cabeca(s, "Erros comuns na configuração de DNS", "Cinco erros que derrubam o site ou o e-mail")
ERROS = [("o ponto final", "Esquecer o ponto final.",
          "Na zona, `www IN CNAME usuario.github.io`, sem o ponto, vira `usuario.github.io.example.com.`, que não "
          "existe. Confira a resposta com `dig`.", {}),
         ("CNAME e outro registro", "`CNAME` junto de outro registro.",
          "O servidor {on:nem sempre recusa}: o Unbound 1.24.2 carregou, sem aviso, `CNAME` e `TXT` no mesmo nome.",
          {"on": "ondulado"}),
         ("dois SPF", "Dois registros SPF.",
          "Dois `TXT` com `v=spf1` no mesmo nome dão erro permanente, e {gr:a verificação falha para todo e-mail}.",
          {"gr": "grifo"}),
         ("MX para CNAME", "`MX` apontando para `CNAME`.",
          "O padrão proíbe, e alguns servidores de e-mail recusam a entrega.", {}),
         ("esquecidos", "Registros esquecidos.",
          "Um `A` antigo no apex, ao lado dos quatro do GitHub, desvia visitas e trava o certificado. Um subdomínio "
          "apontando para um serviço desligado pode ser tomado.", {})]
fw19, gap19, fh19 = (LARG - 2 * 0.25) / 3, 0.25, 2.45
for i, (esq, frase, txt, mk) in enumerate(ERROS):
    linha = i // 3
    x0 = ML if linha == 0 else ML + (fw19 + gap19) / 2
    fx, fy = x0 + (i % 3) * (fw19 + gap19), 1.75 + linha * (fh19 + 0.22)
    ty = ficha(s, fx, fy, fw19, fh19, esq, f"{i + 1}/5", CUIDADO, tam=9.5)
    d = escrever(s, fx + 0.22, ty + 0.17, fw19 - 0.44, [frase], dict(f=UI, s=14.5, c=INK, b=True, codigo=dict(c=INK)),
                 pitch=18)
    escrever(s, fx + 0.22, d.fim + 0.12, fw19 - 0.44, [txt], dict(f=TEXTO, s=13, c=INK2, codigo=dict(s=11, c=INK)),
             pitch=17.5, marcas=mk)
deck.notas(s, "Os erros mais comuns: esquecer o ponto final num arquivo de zona, que faz o nome ganhar o domínio no fim; "
              "pôr CNAME junto de outro registro, que o servidor nem sempre recusa; ter dois registros SPF, que dão "
              "erro permanente e fazem a verificação falhar para todo e-mail; apontar o MX para um CNAME; e esquecer "
              "registros antigos, como um A no apex ao lado dos quatro do GitHub, que desvia visitas e trava o "
              "certificado.")

# 20 --------------------------------------------------------------- fecho
deck.fecho("Para ir além",
           "Quando um domínio não abre, o dig +trace é o primeiro comando: mostra a consulta inteira, da raiz até a "
           "resposta. O manual do dig está na documentação do BIND 9. As fontes completas, com os links, estão no fim "
           "do post.",
           recomendacao="Quando um domínio não abre, **`dig +trace`** é o primeiro comando: mostra a consulta "
                        "inteira, da raiz até a resposta.",
           enderecos=["bind9.readthedocs.io › manpages › dig",
                      "docs.github.com › Pages › managing a custom domain"],
           fontes=["RFC 1034 e RFC 1035: o espaço de nomes, as zonas e os registros",
                   "RFC 2181 e RFC 2308: o TTL, o CNAME exclusivo e o cache negativo",
                   "RFC 7208, RFC 6376 e RFC 9989: SPF, DKIM e DMARC",
                   "IANA, root-servers.org e Google Public DNS",
                   "GitHub Docs: domínio personalizado, verificação e HTTPS"])

deck.salvar()
