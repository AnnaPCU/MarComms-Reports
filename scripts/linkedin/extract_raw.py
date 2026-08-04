# Extractor para exports CRUDOS de LinkedIn (sin unificar).
# Estructura esperada: <base>/<carpeta por cuenta>/{*_content_*.xls, *_followers_*.xls, *_visitors_*.xls}
# Reusa los helpers de mc_extract.py; el .xls viejo se lee con xlrd.
import os, sys, glob, json
import xlrd
from extract_unified import find_header, col, ssum, clean_title

FOLDER_MATCHERS = {
    'cul': lambda n: 'latinoam' in n,
    'cue': lambda n: 'espa' in n,
    'cup': lambda n: 'portugal' in n,
    'cun': lambda n: 'norte' in n,
    'cuna': lambda n: 'north' in n,
    'ps':  lambda n: 'peterson' in n and 'iberia' not in n and 'america' not in n,
    'pia': lambda n: 'peterson' in n and 'iberia' in n,
    'tlr': lambda n: 'tlr' in n or 'laborator' in n,
    'bel': lambda n: 'biomass' in n,
}

def resolve_folders(base):
    dirs = [d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d))]
    out = {}
    for acc, pred in FOLDER_MATCHERS.items():
        hits = [d for d in dirs if pred(d.lower())]
        if len(hits) != 1:
            raise SystemExit(f"Resolución ambigua para {acc}: {hits} en {base}")
        out[acc] = os.path.join(base, hits[0])
    return out

def xls_rows(path, sheet_sub):
    wb = xlrd.open_workbook(path)
    for name in wb.sheet_names():
        if sheet_sub in name.lower():
            sh = wb.sheet_by_name(name)
            return [tuple(sh.cell_value(i, j) if sh.cell_value(i, j) != '' else None
                          for j in range(sh.ncols)) for i in range(sh.nrows)]
    return []

def one_file(folder, kind):
    hits = glob.glob(os.path.join(folder, f"*_{kind}_*.xls"))
    if len(hits) != 1:
        raise SystemExit(f"Se esperaba 1 archivo *_{kind}_*.xls en {folder}, hay {len(hits)}")
    return hits[0]

def num(v):
    return v if isinstance(v, (int, float)) else 0

def extract_account(folder):
    ind = xls_rows(one_file(folder, 'content'), 'indicador')
    hi, hdr = find_header(ind, ['Fecha', 'Impresiones (totales)', 'Clics (totales)'])
    imp = ssum(ind, hi, col(hdr, 'Impresiones (totales)'))
    clk = ssum(ind, hi, col(hdr, 'Clics (totales)'))
    rea = ssum(ind, hi, col(hdr, 'Reacciones (total)'))
    com = ssum(ind, hi, col(hdr, 'Comentarios (totales)'))
    shr = ssum(ind, hi, col(hdr, 'Veces compartido (total)'))
    eng = clk + rea + com + shr
    er = round(eng / imp * 100, 2) if imp else 0
    dates = [r[col(hdr, 'Fecha')] for r in ind[hi + 1:] if r[col(hdr, 'Fecha')]]

    fr = xls_rows(one_file(folder, 'followers'), 'nuevos')
    fhi, fhdr = find_header(fr, ['Fecha', 'Total de seguidores'])
    fol = ssum(fr, fhi, col(fhdr, 'Total de seguidores'))

    vr = xls_rows(one_file(folder, 'visitors'), 'datos de vi')
    vhi, vhdr = find_header(vr, ['Fecha', 'Visitantes únicos en total (total)'])
    vis = ssum(vr, vhi, col(vhdr, 'Visitantes únicos en total (total)'))

    pr = xls_rows(one_file(folder, 'content'), 'todas')
    posts = []
    if pr:
        phi, phdr = find_header(pr, ['Título de la publicación', 'Impresiones', 'Clics'])
        if phi is not None:
            ci_t = col(phdr, 'Título de la publicación'); ci_u = col(phdr, 'Enlace de la publicación')
            ci_imp = col(phdr, 'Impresiones'); ci_clk = col(phdr, 'Clics'); ci_er = col(phdr, 'Tasa de interacción')
            ci_tp = col(phdr, 'Tipo de contenido'); ci_pub = col(phdr, 'Tipo de publicación')
            for r in pr[phi + 1:]:
                if not r or ci_t >= len(r) or not r[ci_t]:
                    continue
                er_p = r[ci_er] if ci_er is not None and ci_er < len(r) else 0
                er_p = round(er_p * 100, 2) if isinstance(er_p, (int, float)) else 0
                tp = (r[ci_tp] if ci_tp is not None and ci_tp < len(r) else None) or ''
                pub = (r[ci_pub] if ci_pub is not None and ci_pub < len(r) else None) or ''
                tp = str(tp).strip() or ('Orgánico' if str(pub).strip().lower().startswith('org') else (str(pub) or 'Orgánico'))
                posts.append(dict(
                    t=clean_title(r[ci_t]),
                    url=str(r[ci_u] or '') if ci_u is not None and ci_u < len(r) else '',
                    imp=int(num(r[ci_imp] if ci_imp < len(r) else 0)),
                    clk=int(num(r[ci_clk] if ci_clk < len(r) else 0)),
                    er=er_p, tp=tp))
    posts.sort(key=lambda p: p['imp'], reverse=True)
    return dict(imp=int(imp), clk=int(clk), er=er, vis=int(vis), fol=int(fol), posts=posts[:6]), (dates[0] if dates else '?', dates[-1] if dates else '?', len(dates))

if __name__ == '__main__':
    base, out = sys.argv[1], sys.argv[2]
    res = {}
    for acc, folder in resolve_folders(base).items():
        res[acc], (d0, d1, nd) = extract_account(folder)
        print(f"  {acc:5} {os.path.basename(folder)[:38]:40} {nd:2d} días {d0} → {d1}", file=sys.stderr)
    json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1)
    print("wrote", out)
