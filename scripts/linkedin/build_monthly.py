# Genera src/data/socialMonthly.js desde los exports mensuales de LinkedIn.
#
# Uso (desde la raíz del repo):
#   python3 scripts/linkedin/build_monthly.py m03="/ruta/marzo" m04="/ruta/abril" ...
#
# Cada ruta puede ser:
#   - carpeta de exports CRUDOS: subcarpeta por cuenta con content/followers/
#     visitors (.xls) + competitor (.xlsx), tal cual salen de LinkedIn.
#   - carpeta de archivos UNIFICADOS: un .xlsx consolidado por cuenta.
# El formato se detecta solo (si hay subcarpetas → crudo).
#
# Requiere: pip install openpyxl xlrd
import os, sys, json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_unified import extract as extract_unified_month
from extract_raw import resolve_folders, extract_account
from extract_competitors import from_unified as comp_unified, from_raw as comp_raw

ORDER = ['cul', 'cue', 'cup', 'cun', 'cuna', 'ps', 'pia', 'tlr', 'bel']

def is_raw(base):
    return any(os.path.isdir(os.path.join(base, d)) for d in os.listdir(base))

def extract_month(base):
    if is_raw(base):
        data = {}
        for acc, folder in resolve_folders(base).items():
            data[acc], (d0, d1, nd) = extract_account(folder)
            print(f"    {acc:5} {nd:2d} días {d0} → {d1}", file=sys.stderr)
        comp = comp_raw(base)
    else:
        data = extract_unified_month(base)
        comp = comp_unified(base)
    for acc in data:
        data[acc]['comp'] = comp.get(acc) or []
    return data

def esc(s):
    return str(s).replace('\\', '\\\\').replace("'", "\\'")

def post_js(p):
    return "      {t:'%s',imp:%d,er:%.2f,clk:%d,tp:'%s',url:'%s'}" % (
        esc(p['t']), p['imp'], p['er'], p['clk'], esc(p['tp']), esc(p['url']))

def comp_js(c):
    return "      {name:'%s',fol:%d,nfol:%d,eng:%d,posts:%d%s}" % (
        esc(c['name']), c['fol'], c['nfol'], c['eng'], c['posts'], ',own:true' if c.get('own') else '')

def month_js(m):
    posts = m['posts'][:5]
    pj = ',\n'.join(post_js(p) for p in posts)
    s = "{imp:%d,clk:%d,er:%.2f,vis:%d,fol:%d,posts:[\n%s%s]" % (
        m['imp'], m['clk'], m['er'], m['vis'], m['fol'], pj, ('\n    ' if posts else ''))
    if m.get('comp'):
        s += ",comp:[\n%s\n    ]" % ',\n'.join(comp_js(c) for c in m['comp'])
    return s + "}"

def main():
    args = dict(a.split('=', 1) for a in sys.argv[1:])
    if not args:
        print(__doc__ or 'Uso: build_monthly.py m03=/ruta ...'); sys.exit(1)
    months = sorted(args.items(), reverse=True)  # más reciente primero
    data = {}
    for mid, base in months:
        print(f"  {mid} ← {base}", file=sys.stderr)
        data[mid] = extract_month(base)
    L = []
    L.append("// ════════════════════════════════════════════════════════════════")
    L.append("//  DATOS MENSUALES 2026 — Social/LinkedIn (%s)." % ', '.join(m for m, _ in months))
    L.append("//  Generado con scripts/linkedin/build_monthly.py desde los exports de")
    L.append("//  LinkedIn (crudos o unificados). Se mergea sobre DB en socialSeed.js.")
    L.append("//  Métrica ER = (clics+reacciones+comentarios+compartidos)/impresiones,")
    L.append("//  ponderado por impresiones (mensual). Impresiones/clics = totales del mes;")
    L.append("//  vis = visitantes únicos; fol = seguidores nuevos.")
    L.append("//  comp = benchmark de competidores del mes (export COMPETITORS de LinkedIn).")
    L.append("// ════════════════════════════════════════════════════════════════")
    L.append("")
    L.append("export const SOCIAL_MONTHLY_2026 = {")
    for k in ORDER:
        L.append(f"  {k}: {{")
        for mid, _ in months:
            L.append(f"    {mid}: {month_js(data[mid][k])},")
        L.append("  },")
    L.append("};")
    out = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'socialMonthly.js')
    open(out, 'w').write('\n'.join(L) + '\n')
    print(f"→ escrito {os.path.normpath(out)}")

if __name__ == '__main__':
    main()
