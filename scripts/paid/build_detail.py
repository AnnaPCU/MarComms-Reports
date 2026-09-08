# Genera src/data/paidDetail.js desde los 2 informes mensuales de Google Ads:
#   1) "Semanal por grupo de anuncios"  (Campaña/Grupo/Semana + métricas + cuotas)
#   2) "Términos de búsqueda + Palabras Clave" (Campaña/Grupo/Keyword/Término)
#
# Uso (desde la raíz del repo):
#   python3 scripts/paid/build_detail.py m07 semanal.csv terminos.csv
#
# El detalle alimenta las secciones "Consumo del presupuesto" (interno) y
# "Detalle por grupo de anuncio" del pilar Paid. Los totales del semanal se
# validan contra sí mismos; el coste de términos NO suma el 100% del mes
# (Google oculta búsquedas de bajo volumen) y así se informa en la UI.
import csv, io, sys, os, re

ACC = {'CU España': 'es', 'CU Portugal': 'pt', 'CU Canada': 'cuc', 'PS Argentina': 'psar',
       'CU United States': 'cuus'}

def num(v):
    # Formato español de Google Ads: '.' siempre es separador de miles
    # ('5.561') y ',' el decimal ('103366,25'). Limpiar solo cuando hay coma
    # rompía los enteros de 4 cifras para arriba (5.561 -> 5,561 -> 5).
    s = str(v).strip().replace('%', '')
    if not s or s in ('--', '—') or s.startswith('<') or s.startswith('>'):
        return None
    s = s.replace('.', '').replace(',', '.')
    try:
        return float(s)
    except ValueError:
        return None

def acc_and_camp(camp_full):
    for pref, a in ACC.items():
        if camp_full.startswith(pref):
            short = re.sub(r'^' + re.escape(pref) + r'\s*-?\s*', '', camp_full)
            short = re.sub(r'\s*-\s*S(EARCH|earch)$', '', short).strip()
            # 'Car' se renombró a 'CAEs' en agosto 2026: si se reprocesa un mes
            # viejo, el nombre tiene que quedar unificado igual.
            FIX = {'Car': 'CAEs',
                   'Plasticos': 'Plásticos', 'Bioenergia': 'Bioenergía',
                   'Preparacion para certificaciones': 'Preparación para certificaciones',
                   'Bioenergia / Biocombustibles': 'Bioenergía / Biocombustibles'}
            return a, FIX.get(short, short)
    raise SystemExit(f'Campaña sin cuenta reconocida: {camp_full}')

def read_rows(path):
    raw = open(path, encoding='utf-8-sig').read()
    return list(csv.DictReader(io.StringIO('\n'.join(raw.splitlines()[2:]))))

def esc(s):
    return str(s).replace('\\', '\\\\').replace("'", "\\'")

def jsnum(v, nd=2):
    if v is None:
        return 'null'
    r = round(v, nd)
    return str(int(r)) if r == int(r) else str(r)

def main():
    mid, weekly_csv, terms_csv = sys.argv[1], sys.argv[2], sys.argv[3]

    # ── semanal por grupo ──
    detail = {}  # acc -> camp -> group -> {'weeks': {wk: agg}, 'kws': {...}, 'terms': [...]}
    for r in read_rows(weekly_csv):
        a, camp = acc_and_camp(r['Campaña'])
        g = detail.setdefault(a, {}).setdefault(camp, {}).setdefault(r['Grupo de anuncios'].strip(), {'weeks': {}, 'kws': {}, 'terms': []})
        wk = r['Semana']
        w = g['weeks'].setdefault(wk, dict(imp=0, clk=0, cost=0.0, conv=0, is_=None, lr=None))
        w['imp'] += int(num(r['Impr.']) or 0)
        w['clk'] += int(num(r['Clics']) or 0)
        w['cost'] += num(r['Coste']) or 0
        w['conv'] += int(num(r['Conversiones']) or 0)
        w['is_'] = num(r.get('Cuota de impr. de búsqueda'))
        w['lr'] = num(r.get('Cuota impr. perd. de búsq. (ranking)'))

    # ── términos + keywords ──
    for r in read_rows(terms_csv):
        a, camp = acc_and_camp(r['Campaña'])
        g = detail.setdefault(a, {}).setdefault(camp, {}).setdefault(r['Grupo de anuncios'].strip(), {'weeks': {}, 'kws': {}, 'terms': []})
        imp = int(num(r['Impr.']) or 0); clk = int(num(r['Clics']) or 0)
        cost = num(r['Coste']) or 0; conv = int(num(r['Conversiones']) or 0)
        kw = r['Palabra clave de búsqueda'].strip()
        k = g['kws'].setdefault(kw, dict(imp=0, clk=0, cost=0.0, conv=0))
        k['imp'] += imp; k['clk'] += clk; k['cost'] += cost; k['conv'] += conv
        g['terms'].append(dict(t=r['Término de búsqueda'].strip(), kw=kw,
                               match=r['Tipo de concordancia con los términos de búsqueda'].strip(),
                               imp=imp, clk=clk, cost=cost, conv=conv))

    TOP_TERMS, TOP_KWS = 8, 8
    L = []
    L.append('// ════════════════════════════════════════════════════════════════')
    L.append('//  DETALLE PAID — grupos de anuncios: consumo semanal + términos de')
    L.append('//  búsqueda y palabras clave. Generado con scripts/paid/build_detail.py')
    L.append('//  desde los informes "Semanal por grupo" y "Términos + Palabras clave".')
    L.append('//  · weeks: métricas por semana (lunes de inicio); is/lr = cuota de')
    L.append('//    impresiones de búsqueda y perdida por ranking (null si Google no')
    L.append('//    da el valor exacto, ej. "< 10%").')
    L.append('//  · kws/terms: top por clics; Google oculta términos de bajo volumen,')
    L.append('//    por eso el coste de términos no suma el 100% del mes.')
    L.append('// ════════════════════════════════════════════════════════════════')
    L.append('')
    L.append('export const PAID_DETAIL = {')
    # Orden fijo conocido primero; cualquier cuenta nueva del export va después.
    known = ['pt', 'es', 'cuc', 'psar', 'cuus']
    for a in known + [x for x in detail if x not in known]:
        if a not in detail:
            continue
        L.append(f'  {a}: {{')
        L.append(f'    {mid}: {{')
        L.append('      groups: [')
        for camp, groups in detail[a].items():
            for gname, g in groups.items():
                weeks = sorted(g['weeks'].items())
                wk_js = ', '.join(
                    "{w:'%s',imp:%d,clk:%d,cost:%s,conv:%d,is:%s,lr:%s}" % (
                        wk, w['imp'], w['clk'], jsnum(w['cost']), w['conv'], jsnum(w['is_']), jsnum(w['lr']))
                    for wk, w in weeks)
                kws = sorted(g['kws'].items(), key=lambda kv: (-kv[1]['clk'], -kv[1]['imp']))
                nkw = len(kws); kws = kws[:TOP_KWS]
                kw_js = ', '.join(
                    "{k:'%s',imp:%d,clk:%d,cost:%s,conv:%d}" % (
                        esc(k), v['imp'], v['clk'], jsnum(v['cost']), v['conv'])
                    for k, v in kws)
                terms = sorted(g['terms'], key=lambda t: (-t['clk'], -t['imp']))
                nterm = len(terms); terms = terms[:TOP_TERMS]
                t_js = ', '.join(
                    "{t:'%s',match:'%s',imp:%d,clk:%d,cost:%s,conv:%d}" % (
                        esc(t['t']), esc(t['match']), t['imp'], t['clk'], jsnum(t['cost']), t['conv'])
                    for t in terms)
                L.append(f"        {{ camp: '{esc(camp)}', name: '{esc(gname)}',")
                L.append(f'          weeks: [{wk_js}],')
                L.append(f'          kws: [{kw_js}], nKws: {nkw},')
                L.append(f'          terms: [{t_js}], nTerms: {nterm} }},')
        L.append('      ],')
        L.append('    },')
        L.append('  },')
    L.append('};')
    out = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'paidDetail.js'))
    text = merge_month('\n'.join(L) + '\n', out, mid)
    open(out, 'w').write(text)
    print(f'→ escrito {out}', file=sys.stderr)


# ── merge: conservar los meses ya cargados ──
# El script genera el archivo completo para el mes que se le pasa. Si ya hay
# un paidDetail.js con otros meses, se fusiona en vez de pisarlo (antes se
# perdía el detalle de los meses anteriores en cada corrida).
def _block_end(text, start):
    # Devuelve el índice del carácter siguiente al bloque `{...}` que abre en
    # `start` (donde `text[start]` es la llave de apertura).
    depth, i, n = 0, start, len(text)
    while i < n:
        ch = text[i]
        if ch == "'":                       # saltear strings (pueden traer llaves)
            i += 1
            while i < n and text[i] != "'":
                i += 2 if text[i] == '\\' else 1
        elif ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    raise SystemExit('paidDetail.js: no se pudo cerrar el bloque en %d' % start)


def _months(text, acc):
    # {mid: (inicio, fin)} de los meses de una cuenta dentro del archivo.
    a = text.find('\n  %s: {' % acc)
    if a < 0:
        return None, {}
    open_brace = text.index('{', a)
    acc_end = _block_end(text, open_brace)
    body = text[open_brace:acc_end]
    out = {}
    for m in re.finditer(r'\n    (m\d\d): \{', body):
        s0 = m.start() + 1
        e0 = _block_end(body, open_brace + m.end() - 1 - open_brace + (open_brace - open_brace)) if False else None
        # índice absoluto de la llave que abre el mes
        brace = open_brace + m.end() - 1
        e = _block_end(text, brace)
        # incluir la coma final del bloque si está
        if text[e:e + 1] == ',':
            e += 1
        out[m.group(1)] = (open_brace + s0 - 0, e)
    return (a, open_brace, acc_end), out


def merge_month(generated, path, mid):
    if not os.path.exists(path):
        return generated
    prev = open(path, encoding='utf-8').read()
    if 'export const PAID_DETAIL' not in prev:
        return generated
    # Bloques del mes recién generado, por cuenta.
    accounts = re.findall(r'\n  (\w+): \{', generated)
    for acc in accounts:
        loc_gen, months_gen = _months(generated, acc)
        gs, ge = months_gen[mid]
        block = generated[gs:ge]
        loc_prev, months_prev = _months(prev, acc)
        if loc_prev is None:
            # cuenta nueva: agregarla completa antes del cierre del objeto
            a, _, ae = loc_gen
            if generated[ae:ae + 1] == ',':
                ae += 1
            whole = generated[a:ae]
            cut = prev.rindex('};')
            prev = prev[:cut] + whole.strip('\n') + '\n' + prev[cut:]
            continue
        if mid in months_prev:               # ya existía: reemplazar
            ps, pe = months_prev[mid]
            prev = prev[:ps] + block + prev[pe:]
        else:                                # mes nuevo: insertar al final de la cuenta
            _, _, acc_end = loc_prev
            ins = prev.rindex('\n    },', 0, acc_end) + len('\n    },')
            prev = prev[:ins] + '\n' + block.rstrip() + prev[ins:]
    return prev

if __name__ == '__main__':
    main()
