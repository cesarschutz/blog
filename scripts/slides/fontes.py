"""As fontes do site em TTF estático, para as apresentações (D74, skill `apresentacao`).

O site usa as fontes do @fontsource (WOFF2 variável), que o PowerPoint não usa. A apresentação precisa
delas em TTF estático, instaladas na máquina: Besley, Literata, IBM Plex Sans e JetBrains Mono (normal,
negrito e itálicos) e a Caveat das notas à caneta (normal e negrito). São gratuitas (licença OFL).

    python3 scripts/slides/fontes.py              confere o que está instalado
    python3 scripts/slides/fontes.py --instalar   baixa do Google Fonts (uns 2,7 MB) e instala na pasta
                                                  de fontes do usuário; só com o OK do Cesar (é download)
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

FAMILIAS = {  # nome no Google Fonts: (prefixo do arquivo, eixos pedidos)
    "Besley": ("Besley", "ital,wght@0,400;0,700;1,400;1,700"),
    "Literata": ("Literata", "ital,wght@0,400;0,700;1,400;1,700"),
    "IBM Plex Sans": ("IBMPlexSans", "ital,wght@0,400;0,700;1,400;1,700"),
    "JetBrains Mono": ("JetBrainsMono", "ital,wght@0,400;0,700;1,400;1,700"),
    "Caveat": ("Caveat", "wght@400;700"),
}
ESTILO = {("normal", "400"): "Regular", ("normal", "700"): "Bold", ("italic", "400"): "Italic",
          ("italic", "700"): "BoldItalic"}
DESTINO = Path.home() / ("Library/Fonts" if sys.platform == "darwin" else ".local/share/fonts")


def esperados():
    for fam, (pref, eixos) in FAMILIAS.items():
        estilos = ["Regular", "Bold"] + (["Italic", "BoldItalic"] if eixos.startswith("ital") else [])
        for e in estilos:
            yield f"{pref}-{e}.ttf"


def conferir():
    faltam = [n for n in esperados() if not (DESTINO / n).exists() and not (Path("/Library/Fonts") / n).exists()]
    if faltam:
        print("Faltam:", ", ".join(faltam))
        print("Para instalar (download do Google Fonts, com o OK do Cesar): python3 scripts/slides/fontes.py --instalar")
        return 1
    print(f"As fontes do site estão instaladas ({DESTINO}).")
    return 0


def instalar():
    familias = "&".join(f"family={fam.replace(' ', '+')}:{eixos}" for fam, (_, eixos) in FAMILIAS.items())
    # Sem o navegador, a API do Google Fonts responde com os endereços dos TTF estáticos.
    css = subprocess.run(["curl", "-s", "--max-time", "30", f"https://fonts.googleapis.com/css2?{familias}"],
                         capture_output=True, text=True, check=True).stdout
    blocos = re.findall(r"font-family: '([^']+)';\s*font-style: (\w+);\s*font-weight: (\d+);.*?src: url\(([^)]+)\)",
                        css, re.S)
    if not blocos:
        sys.exit("A API do Google Fonts não devolveu os TTF.")
    DESTINO.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for fam, estilo, peso, url in blocos:
            nome = f"{FAMILIAS[fam][0]}-{ESTILO[(estilo, peso)]}.ttf"
            subprocess.run(["curl", "-s", "--max-time", "60", "-o", f"{tmp}/{nome}", url], check=True)
            shutil.copy(f"{tmp}/{nome}", DESTINO / nome)
            print("instalada", nome)
    if shutil.which("fc-cache"):
        subprocess.run(["fc-cache", "-f"], capture_output=True)
    return conferir()


if __name__ == "__main__":
    sys.exit(instalar() if "--instalar" in sys.argv else conferir())
