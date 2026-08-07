# ════════════════════════════════════════════════════════════════
# Genera src/data/socialLatam.js — segmentación POR PAÍS de la cuenta
# LinkedIn de CU Latinoamérica (ar, br, cl, pe, mx, ec).
#
# Metodología (regla de honestidad — solo datos reales del export):
#  · Publicaciones: cada post se atribuye a un país por su hashtag
#    (#ControlUnionArgentina, #ControlUnionMéxico, …) o por el país
#    nombrado en la primera línea del post. Posts sin marcador de país
#    (p. ej. #ControlUnion regional) quedan SIN atribuir — no se inventa.
#    imp/clk/np del país = suma de sus posts; ER = (clics+reacciones+
#    comentarios+compartidos) / impresiones de esos posts.
#  · Visualizaciones de página: hoja "visitors - Ubicación" agregada por
#    país (son visualizaciones del período, no visitantes únicos).
#  · Seguidores por país: hoja "followers - Ubicación" agregada por país.
#    Es una FOTO acumulada al momento del export (no una serie mensual).
#
# Uso (cada arg es mes=ruta; la ruta puede ser la carpeta RAW del mes o
# el .xlsx unificado de CU Latinoamérica):
#   python3 scripts/linkedin/build_latam.py \
#     m01="<scratch>/enero/Metricas mensuales LKD Enero" \
#     m04="<scratch>/abril/.../Control_Union_Latinoamerica_unified.xlsx" ...
# ════════════════════════════════════════════════════════════════
import os, sys, re, json, unicodedata
import xlrd, openpyxl

sys.path.insert(0, os.path.dirname(__file__))
from extract_unified import find_header, col, clean_title  # noqa: E402

COUNTRIES = {
    'ar': ('Argentina', ['argentina']),
    'br': ('Brasil', ['brasil', 'brazil']),
    'cl': ('Chile', ['chile']),
    'pe': ('Perú', ['peru']),
    'mx': ('México', ['mexico']),
    'ec': ('Ecuador', ['ecuador']),
}

def norm(s):
    return unicodedata.normalize('NFKD', str(s or '')).encode('ascii', 'ignore').decode().lower()

def country_of_post(title):
    """País del post: hashtag (#...pais) en todo el texto o país en la 1ra línea.
    Si matchean varios, gana el que aparece primero en el texto."""
    whole = norm(title)
    first = norm(str(title).split('\n')[0])
    best = None
    for cid, (_, pats) in COUNTRIES.items():
        for p in pats:
            m = re.search(r'#\w*' + p, whole)
            pos = m.start() if m else (first.find(p) if p in first else -1)
            if pos >= 0 and (best is None or pos < best[1]):
                best = (cid, pos)
    return best[0] if best else None

def country_of_location(loc):
    tail = norm(loc).split(',')[-1].strip()
    for cid, (_, pats) in COUNTRIES.items():
        if any(p == tail or tail.endswith(p) for p in pats):
            return cid
    return None

def col_any(hdr, names):
    for n in names:
        c = col(hdr, n)
        if c is not None:
            return c
    return None

def numv(v):
    return v if isinstance(v, (int, float)) else 0

# ── Lectura de hojas: RAW (.xls por archivo) o UNIFICADO (.xlsx con Índice) ──
def latam_raw_folder(base):
    for root, dirs, _files in os.walk(base):
        for d in dirs:
            if 'latinoam' in norm(d):
                return os.path.join(root, d)
    raise SystemExit(f'No encontré carpeta CU Latinoamérica bajo {base}')

def xls_sheet(path, sub):
    wb = xlrd.open_workbook(path)
    for name in wb.sheet_names():
        if sub in norm(name):
            sh = wb.sheet_by_name(name)
            return [tuple(sh.cell_value(i, j) if sh.cell_value(i, j) != '' else None
                          for j in range(sh.ncols)) for i in range(sh.nrows)]
    return []

def one_file(folder, kind):
    hits = [f for f in os.listdir(folder) if f'_{kind}_' in f and f.endswith('.xls')]
    if len(hits) != 1:
        raise SystemExit(f'Se esperaba 1 archivo *_{kind}_*.xls en {folder}, hay {len(hits)}')
    return os.path.join(folder, hits[0])

def uni_sheet(wb, *subs):
    """Hoja del consolidado cuyo nombre contiene TODOS los substrings (fuzzy:
    los nombres se truncan distinto según el mes)."""
    for s in wb.sheetnames:
        n = norm(s)
        if all(sub in n for sub in subs):
            return list(wb[s].iter_rows(values_only=True))
    return []

def load_month(path):
    """Devuelve (posts_rows, fol_loc_rows, vis_loc_rows) del mes."""
    if os.path.isfile(path):
        wb = openpyxl.load_workbook(path, data_only=True)
        return (uni_sheet(wb, 'todas'),
                uni_sheet(wb, 'follower', 'ubicac'),
                uni_sheet(wb, 'visitor', 'ubicac'))
    folder = latam_raw_folder(path)
    return (xls_sheet(one_file(folder, 'content'), 'todas'),
            xls_sheet(one_file(folder, 'followers'), 'ubicac'),
            xls_sheet(one_file(folder, 'visitors'), 'ubicac'))

def loc_totals(rows, value_names):
    hi, hdr = find_header(rows, ['Ubicación'])
    if hi is None:
        return {}
    ci_l = col(hdr, 'Ubicación'); ci_v = col_any(hdr, value_names)
    out = {}
    for r in rows[hi + 1:]:
        if not r or ci_l >= len(r) or not r[ci_l]:
            continue
        cid = country_of_location(r[ci_l])
        if cid:
            out[cid] = out.get(cid, 0) + int(numv(r[ci_v] if ci_v is not None and ci_v < len(r) else 0))
    return out

def parse_posts(rows):
    hi, hdr = find_header(rows, ['Título de la publicación', 'Impresiones', 'Clics'])
    if hi is None:
        return []
    ci = {k: col_any(hdr, names) for k, names in {
        't': ['Título de la publicación'], 'u': ['Enlace de la publicación'],
        'imp': ['Impresiones'], 'clk': ['Clics'], 'er': ['Tasa de interacción'],
        'reac': ['Recomendaciones', 'Reacciones'], 'com': ['Comentarios'],
        'shr': ['Veces compartido'], 'tp': ['Tipo de contenido'], 'pub': ['Tipo de publicación'],
    }.items()}
    def get(r, k):
        c = ci[k]
        return r[c] if c is not None and c < len(r) else None
    posts = []
    for r in rows[hi + 1:]:
        if not r or not get(r, 't'):
            continue
        er_p = get(r, 'er')
        tp = str(get(r, 'tp') or '').strip()
        pub = str(get(r, 'pub') or '').strip()
        posts.append(dict(
            raw=str(get(r, 't')),
            t=clean_title(get(r, 't')),
            url=str(get(r, 'u') or ''),
            imp=int(numv(get(r, 'imp'))), clk=int(numv(get(r, 'clk'))),
            reac=int(numv(get(r, 'reac'))), com=int(numv(get(r, 'com'))), shr=int(numv(get(r, 'shr'))),
            er=round(er_p * 100, 2) if isinstance(er_p, (int, float)) else 0,
            tp=tp or ('Orgánico' if pub.lower().startswith('org') else (pub or 'Orgánico')),
        ))
    return posts

def build_month(path):
    posts_rows, fol_rows, vis_rows = load_month(path)
    posts = parse_posts(posts_rows)
    fol = loc_totals(fol_rows, ['Total de seguidores'])
    vis = loc_totals(vis_rows, ['Visualizaciones totales', 'Total de visualizaciones'])
    out = {}
    unassigned = 0
    by_c = {cid: [] for cid in COUNTRIES}
    for p in posts:
        cid = country_of_post(p['raw'])
        if cid:
            by_c[cid].append(p)
        else:
            unassigned += 1
    for cid in COUNTRIES:
        ps = by_c[cid]
        imp = sum(p['imp'] for p in ps); clk = sum(p['clk'] for p in ps)
        eng = sum(p['clk'] + p['reac'] + p['com'] + p['shr'] for p in ps)
        top = sorted(ps, key=lambda p: p['imp'], reverse=True)[:5]
        out[cid] = dict(
            np=len(ps), imp=imp, clk=clk,
            er=round(eng / imp * 100, 2) if imp else 0,
            vis=vis.get(cid, 0), folBase=fol.get(cid, 0),
            posts=[{k: p[k] for k in ('t', 'url', 'imp', 'clk', 'er', 'tp')} for p in top],
        )
    # Base de cálculo del mes: TODAS las publicaciones (con y sin país).
    # Las métricas por post son acumuladas al momento del export, por eso
    # esta base puede diferir de los totales mensuales de la cuenta.
    out['_tot'] = dict(np=len(posts),
                       imp=sum(p['imp'] for p in posts),
                       clk=sum(p['clk'] for p in posts),
                       un=unassigned)
    return out, len(posts), unassigned

def js(v, ind=0):
    sp = ' ' * ind
    if isinstance(v, dict):
        inner = ','.join(f'{k}:{js(x)}' for k, x in v.items())
        return '{' + inner + '}'
    if isinstance(v, list):
        return '[\n' + ',\n'.join(sp + '  ' + js(x) for x in v) + f'\n{sp}]'
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    return json.dumps(v)

def main():
    months = {}
    for arg in sys.argv[1:]:
        m, path = arg.split('=', 1)
        months[m] = path
    db = {}
    for m in sorted(months):
        db[m], total, un = build_month(months[m])
        tag = ' '.join(f"{cid}:{db[m][cid]['np']}" for cid in COUNTRIES)
        print(f'  {m}: {total} posts → {tag} | sin país: {un}', file=sys.stderr)

    out = ['// ════════════════════════════════════════════════════════════════',
           '//  GENERADO por scripts/linkedin/build_latam.py — NO editar a mano.',
           '//  Segmentación por país de CU Latinoamérica (LinkedIn):',
           '//  posts atribuidos por hashtag/mención de país; visualizaciones y',
           '//  seguidores agregados desde las hojas de Ubicación del export.',
           '//  folBase es una foto acumulada al momento del export (no serie).',
           '// ════════════════════════════════════════════════════════════════',
           '',
           'export const LATAM_COUNTRIES = [']
    for cid, (name, _) in COUNTRIES.items():
        out.append(f"  {{id:'{cid}', name:'{name}'}},")
    out.append('];')
    out.append('')
    out.append('export const LATAM_DB = {')
    for m in sorted(db):
        out.append(f'  {m}: {{')
        for cid in COUNTRIES:
            d = db[m][cid]
            posts = ',\n'.join('      ' + js(p) for p in d['posts'])
            head = f"    {cid}: {{np:{d['np']}, imp:{d['imp']}, clk:{d['clk']}, er:{d['er']}, vis:{d['vis']}, folBase:{d['folBase']}, posts:["
            out.append(head + ('\n' + posts + '\n    ]},' if d['posts'] else ']},'))
        t = db[m]['_tot']
        out.append(f"    _tot: {{np:{t['np']}, imp:{t['imp']}, clk:{t['clk']}, un:{t['un']}}},")
        out.append('  },')
    out.append('};')
    dest = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'socialLatam.js')
    with open(dest, 'w') as f:
        f.write('\n'.join(out) + '\n')
    print('wrote', os.path.normpath(dest))

if __name__ == '__main__':
    main()
