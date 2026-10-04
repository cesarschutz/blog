"""A apresentação do post "Parquet e snapshots — o arquivo não garante a fotografia" (D74). O post é um
resumo com um infográfico de quatro quadros; cada quadro, recortado da figura, abre o slide da sua seção.

    node scripts/slides/capturar.mjs parquet-snapshot-banco-de-dados
    python3 scripts/slides/posts/parquet-snapshot-banco-de-dados.py
    python3 scripts/slides/conferir.py parquet-snapshot-banco-de-dados
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from estilo import *  # noqa: E402,F403

deck = Deck("parquet-snapshot-banco-de-dados", "Parquet e snapshots: o arquivo não garante a fotografia")
img = deck.imagem
LIVRO = deck.livro["cor"]
FIG = img("figura-1.png")  # 1896 × 1898: os quatro quadros e a frase embaixo
QUADROS = {1: (95, 85, 991, 1098), 2: (960, 85, 76, 1098), 3: (95, 895, 991, 298), 4: (960, 895, 76, 298)}
ALT = {1: "Quadro 1, Dados por coluna: uma tabela com as colunas id, data e valor, cada uma num bloco; a coluna "
          "valor está destacada. Para somar, leia a coluna valor; o leitor usa os blocos necessários.",
       2: "Quadro 2, Um estado comum: um relógio que alimenta as leituras de pedidos e de itens. As duas leituras "
          "compartilham a visão; o formato não oferece essa garantia.",
       3: "Quadro 3, Saída em arquivos: pedidos.parquet e itens.parquet. Valide os tipos e os valores exportados; "
          "arquivo legível não prova consistência.",
       4: "Quadro 4, Recuperar o banco: uma pasta com escopo conferido e restauração testada. Quais dados e objetos "
          "o backup inclui? Uma exportação pode não conter tudo."}


def quadro(s, n, x, y, w):
    return imagem(s, FIG, x, y, w=w, recorte=QUADROS[n], raio_px=18, alt=ALT[n])


# 1 ---------------------------------------------------------------- capa
s = deck.capa("Parquet e snapshots", "O arquivo não garante a fotografia",
              "A capa do post: uma câmera ao lado de um arquivo .parquet com três colunas e um relógio; o arquivo "
              "guarda colunas, e a leitura define o instante.")
deck.notas(s, "Uma pasta com arquivos .parquet chega com a promessa de ser um snapshot do banco. Antes de usar os "
              "dados num relatório ou de planejar uma restauração, duas perguntas precisam de resposta: como os "
              "arquivos foram gravados e qual estado do banco eles representam.")

# 2 ---------------------------------------------------------------- as duas perguntas
s = deck.slide("Abertura")
deck.cabeca(s, "Parquet e snapshots", "Duas perguntas, duas respostas")
lw_ = 6.0
for i, (esq, dir_, cor, pergunta, resposta) in enumerate((
        ("pergunta 1", "o formato", AZUL, "Como os arquivos foram gravados?", "**Parquet** responde: o formato do arquivo."),
        ("pergunta 2", "o estado", AMBAR, "Qual estado do banco eles representam?",
         "**Snapshot** responde: o instante da leitura."))):
    fy = 1.85 + i * 2.25
    ty = ficha(s, ML, fy, lw_, 2.05, esq, dir_, cor)
    d = escrever(s, ML + 0.3, ty + 0.25, lw_ - 0.6, [pergunta], dict(f=TITULO, s=21, c=INK, b=True), pitch=26)
    escrever(s, ML + 0.3, d.fim + 0.15, lw_ - 0.6, [resposta], dict(f=TEXTO, s=15.5, c=INK2), pitch=21)
escrever(s, ML, 6.42, lw_,
         ["Nas cores do infográfico: azul é o dado na origem; verde, o material exportado; âmbar, os cuidados com "
          "consistência e recuperação."], dict(f=UI, s=12, c=INK2), pitch=16)
pic, fw, fh = imagem(s, FIG, 0, 1.75, h=5.25, raio_px=20,
                     alt="O infográfico do post em quatro quadros: dados por coluna, um estado comum, saída em "
                         "arquivos e recuperar o banco; embaixo, a frase: Parquet define o formato, a extração "
                         "define a fotografia.")
pic.left = Inches(W - MR - fw)
deck.notas(s, "Parquet responde à primeira pergunta; snapshot, à segunda. O infográfico separa essas "
              "responsabilidades em quatro quadros: a organização por colunas, o instante da leitura, os arquivos "
              "exportados e a recuperação do banco. Azul identifica o dado na origem; verde, o material exportado; "
              "âmbar, os cuidados com consistência e recuperação. A frase do pé resume: Parquet define o formato, a "
              "extração define a fotografia.")

# 3 ---------------------------------------------------------------- quadro 1: Parquet
s = deck.slide("Parquet")
deck.cabeca(s, "Parquet: o formato do arquivo", "Um formato aberto, organizado por colunas")
_, qw, qh = quadro(s, 1, ML, 1.85, 5.2)
tx = ML + 5.2 + 0.45
tw = W - MR - tx
d = escrever(s, tx, 1.9, tw,
             ["Os valores de cada coluna ficam agrupados: identificadores juntos, datas juntas, valores juntos. A "
              "tabela que o usuário consulta não muda.",
              "Para somar os valores dos pedidos, não é preciso carregar os nomes dos clientes: o leitor acessa só "
              "as colunas relevantes (o ~projection pushdown~ do DuckDB).",
              "Por dentro, o arquivo tem {gl:grupos de linhas} (~row groups~), divididos em blocos por coluna "
              "(~column chunks~), e metadados que dizem onde encontrá-los.",
              "A compressão pode ser escolhida por coluna (Snappy, Zstandard), mas não existe taxa de economia "
              "garantida."],
             dict(f=TEXTO, s=14.5, c=INK), pitch=20.5, depois=11, marcas={"gl": "caixa"})
deck.notas(s, "O Apache Parquet é um formato aberto e colunar. No quadro 1, os valores de cada coluna aparecem "
              "agrupados; é uma representação simplificada da organização física, não uma mudança na tabela. Isso "
              "ajuda quando a análise usa poucas colunas: o DuckDB documenta essa otimização como projection "
              "pushdown. Por dentro, o arquivo tem grupos de linhas, divididos em blocos por coluna, e metadados que "
              "indicam onde encontrá-los. A compressão pode ser escolhida por coluna, mas tamanho e desempenho "
              "dependem dos dados, da configuração e do leitor.")

# 4 ---------------------------------------------------------------- quadro 2: snapshot
s = deck.slide("Snapshot")
deck.cabeca(s, "Snapshot: o estado capturado", "Uma visão dos dados num momento")
quadro(s, 2, ML, 1.85, 5.2)
d = escrever(s, tx, 1.9, tw,
             ["Um snapshot é uma visão dos dados em determinado momento. A extração pode levar minutos.",
              "Para representar uma fotografia consistente, as leituras precisam compartilhar {me:o mesmo estado de "
              "referência}.",
              "O problema está na leitura da origem. Gravar os resultados em Parquet {nc:não corrige} essa diferença."],
             dict(f=TEXTO, s=16, c=INK), pitch=23, depois=13, marcas={"me": "duplo", "nc": "ondulado"})
deck.notas(s, "No quadro 2, o relógio representa o ponto de referência da leitura. Um snapshot é uma visão dos dados "
              "em determinado momento. A extração pode levar minutos; para representar uma fotografia consistente, "
              "as leituras precisam compartilhar o mesmo estado de referência. O problema está na leitura da origem, "
              "e gravar os resultados em Parquet não corrige essa diferença.")

# 5 ---------------------------------------------------------------- o pedido 42
s = deck.slide("Snapshot")
deck.cabeca(s, "Snapshot: o estado capturado", "Cada leitura válida, juntas inconsistentes")
nota(s, ML, 1.5, 4, "um exemplo hipotético", tam=19)
PASSOS = [("leitura 1", "antes do commit", AZUL, "O exportador lê `pedidos`."),
          ("transação", "o commit", INK2, "Grava o pedido 42 e os itens dele, juntos."),
          ("leitura 2", "depois do commit", AZUL, "O exportador lê `itens_pedido`.")]
pw_, gap = (LARG - 2 * 0.6) / 3, 0.6
for i, (esq, dir_, cor, txt) in enumerate(PASSOS):
    px = ML + i * (pw_ + gap)
    ty = ficha(s, px, 2.1, pw_, 1.75, esq, dir_, cor)
    escrever(s, px + 0.25, ty + 0.3, pw_ - 0.5, [txt], dict(f=TEXTO, s=17, c=INK, codigo=dict(c=INK)), pitch=23)
    if i < 2:
        x0 = px + pw_ + 0.08
        seta(s, curva((x0, 2.95), (x0 + gap / 2 - 0.08, 2.85), (x0 + gap - 0.16, 2.95)), lw=1.6, ponta=0.08)
folha(s, ML, 4.35, LARG, 1.35, cor=misturar(FOLHA, AMBAR, 7), borda=AMBAR, nome="O resultado")
escrever(s, ML + 0.35, 4.55, LARG - 0.7,
         ["Os arquivos podem conter os **itens do pedido 42**, mas não o pedido.",
          "Cada leitura foi válida isoladamente; juntas, elas não representam um único estado do banco."],
         dict(f=TEXTO, s=17, c=INK), pitch=23, depois=6)
escrever(s, ML, 6.15, LARG,
         ["Dar a dois arquivos o mesmo horário no nome não faz as leituras compartilharem um snapshot. Com conexões "
          "paralelas, confirme como a ferramenta coordena a visão entre elas."],
         dict(f=UI, s=13, c=INK2), pitch=17)
escrever(s, ML - 0.42, 6.05, 0.3, ["!"], dict(f=MAO, s=32, c=CANETA, b=True), pitch=32, alinhar="c")
deck.notas(s, "Um exemplo hipotético: uma transação grava o pedido 42 e seus itens juntos. O exportador lê a tabela de "
              "pedidos antes desse commit e a de itens depois. Os arquivos resultantes podem conter os itens do "
              "pedido 42, mas não o pedido. Cada leitura foi válida isoladamente; juntas, não representam um único "
              "estado do banco. E dar a dois arquivos o mesmo horário no nome não faz as leituras compartilharem um "
              "snapshot: com conexões paralelas, é preciso confirmar como a ferramenta coordena a visão entre elas.")

# 6 ---------------------------------------------------------------- a garantia vem do banco
s = deck.slide("Snapshot")
deck.cabeca(s, "Snapshot: o estado capturado", "A garantia vem do banco e da extração")
escrever(s, ML, 1.55, LARG, ["No PostgreSQL, por exemplo, os níveis de isolamento usam referências diferentes:"],
         dict(f=TEXTO, s=16, c=INK2, i=True), pitch=21)
fim = tabela(s, ML, 2.05, LARG,
             [("Nível de isolamento", 3.2, dict(f=UI, s=15, c=INK, b=True)),
              ("O que cada consulta enxerga", LARG - 0.25 - 3.2, dict(f=TEXTO, s=15.5, c=INK))],
             [("Read Committed", "cada comando pode enxergar um snapshot novo"),
              ("Repeatable Read", "as consultas da mesma transação usam uma visão estável, estabelecida pelo primeiro "
                                  "comando que não seja de controle da transação")], altura_linha=0.95)
d = escrever(s, ML, fim + 0.45, LARG - 0.3,
             ["Essa garantia precisa vir do banco e do mecanismo de extração.",
              "Ela também não significa que todos os bancos, réplicas ou serviços de uma empresa estejam sincronizados "
              "naquele instante."], dict(f=TEXTO, s=17, c=INK), pitch=24, depois=8)
deck.notas(s, "No PostgreSQL, por exemplo, Read Committed e Repeatable Read usam referências diferentes: no primeiro, "
              "cada comando pode enxergar um snapshot novo; no segundo, as consultas da mesma transação usam uma "
              "visão estável, estabelecida pelo primeiro comando que não seja de controle da transação. A garantia "
              "precisa vir do banco e do mecanismo de extração, e ela não significa que todos os bancos, réplicas ou "
              "serviços de uma empresa estejam sincronizados naquele instante.")

# 7 ---------------------------------------------------------------- quadro 3: os arquivos
s = deck.slide("Os arquivos")
deck.cabeca(s, "Onde os arquivos entram", "O formato representa; a leitura captura")
quadro(s, 3, ML, 1.85, 5.2)
d = escrever(s, tx, 1.9, tw,
             ["Uma exportação consistente de pedidos e itens pode ser gravada em Parquet para análise. O estado vem da "
              "leitura; o formato define a representação no destino.",
              "Confira os tipos: a precisão monetária, os nulos e a semântica dos horários. Um arquivo que abre sem "
              "erro ainda pode ter uma conversão inadequada para o negócio.",
              "Num lakehouse, o snapshot do Apache Iceberg é a versão de uma tabela. {ct:Essa camada pertence à "
              "tabela}, não ao formato Parquet sozinho."],
             dict(f=TEXTO, s=14.5, c=INK), pitch=20.5, depois=11, marcas={"ct": "grifo"})
deck.notas(s, "O quadro 3 mostra a saída: arquivos separados por tabela, da mesma extração. O estado capturado vem do "
              "processo de leitura; o formato define a representação no destino. Além dos valores, é preciso "
              "conferir os tipos, como decimais, datas e timestamps. E há outro uso de snapshot: a versão de uma "
              "tabela num lakehouse, como no Apache Iceberg; essa camada pertence à tabela, não ao Parquet sozinho. "
              "Uma pasta de arquivos Parquet não ganha transações nem histórico consultável por conta própria.")

# 8 ---------------------------------------------------------------- quadro 4: backup
s = deck.slide("Backup")
deck.cabeca(s, "Exportação e backup", "Analisar os dados não é recuperar o banco")
quadro(s, 4, ML, 1.85, 4.3)
bx = ML + 4.3 + 0.4
bw_ = W - MR - bx
fim = tabela(s, bx, 1.85, bw_,
             [("Conceito", 1.35, dict(f=UI, s=13, c=INK, b=True)), ("O que define", 2.55, dict(f=TEXTO, s=13, c=INK)),
              ("O que conferir", bw_ - 0.25 - 1.35 - 2.55, dict(f=TEXTO, s=13, c=INK2))],
             [("Parquet", "Representação colunar dos dados", "Tipos, compressão e compatibilidade"),
              ("Snapshot", "Estado de referência da captura", "Consistência e escopo da leitura"),
              ("Backup", "Material destinado à recuperação", "Objetos incluídos e restauração testada")],
             altura_linha=0.72)
escrever(s, bx, fim + 0.3, bw_,
         ["O `pg_dump` produz uma exportação consistente de um banco; roles e tablespaces pedem o `pg_dumpall`. Uma "
          "exportação em Parquet não deve ser presumida como cópia de índices, constraints, procedures ou "
          "permissões."], dict(f=TEXTO, s=13.5, c=INK2, codigo=dict(c=INK)), pitch=19)
escrever(s, ML, 6.3, LARG, ["A pergunta prática: {cr:consigo restaurar o que preciso com esse material?}"],
         dict(f=TITULO, s=19, c=INK, b=True), pitch=24, marcas={"cr": "marca"})
deck.notas(s, "O quadro 4 separa duas finalidades: analisar os dados e recuperar o banco. Exportar tabelas para "
              "Parquet pode atender à primeira; para a segunda, é preciso um mecanismo que preserve o necessário à "
              "restauração. A documentação do PostgreSQL ilustra: o pg_dump produz uma exportação internamente "
              "consistente de um banco, e objetos globais pedem o pg_dumpall. A pergunta prática é se dá para "
              "restaurar o que se precisa com aquele material, e a resposta vem de um teste de recuperação, não da "
              "extensão dos arquivos.")

# 9 ---------------------------------------------------------------- na prática
s = deck.slide("Backup")
deck.cabeca(s, "Exportação e backup", "Na prática")
postit(s, ML + 0.4, 2.0, 6.0, 2.6,
       "Para análise, confira formato e consistência.\nPara recuperação, confira o escopo do backup e teste a "
       "restauração.", rot=-1.5, tam=27)
fita(s, ML + 3.4, 2.02, w=1.1, rot=-3)
d = escrever(s, ML + 7.1, 2.2, LARG - 7.1,
             ["Uma pasta de arquivos Parquet não ganha transações nem histórico consultável sozinha.",
              "E um snapshot de uma tabela Iceberg não prova, por si só, que duas tabelas foram extraídas do banco no "
              "mesmo instante."], dict(f=TEXTO, s=16, c=INK), pitch=23, depois=12)
deck.notas(s, "A regra prática do post: para análise, conferir formato e consistência; para recuperação, conferir o "
              "escopo do backup e testar a restauração. Uma pasta de arquivos Parquet não ganha transações e "
              "histórico consultável automaticamente, e um snapshot de uma tabela Iceberg não prova, por si só, que "
              "duas tabelas foram extraídas do banco de origem no mesmo instante.")

# 10 --------------------------------------------------------------- fecho
deck.fecho("Para ir além", "O contexto arquitetural está no post sobre data lake, data warehouse e lakehouse. As "
           "fontes completas, com os links, estão no fim do post.",
           recomendacao="O contexto arquitetural está no post sobre **data lake, data warehouse e lakehouse**.",
           enderecos=["blog.cesarschutz.com.br/posts/data-lake-vs-data-warehouse"],
           fontes=["Apache Parquet: visão geral, motivação e estrutura do arquivo",
                   "Apache Parquet: compressão e tipos lógicos",
                   "DuckDB: leitura parcial de Parquet",
                   "PostgreSQL: isolamento de transações e backup lógico",
                   "Apache Iceberg: especificação dos snapshots"])

deck.salvar()
