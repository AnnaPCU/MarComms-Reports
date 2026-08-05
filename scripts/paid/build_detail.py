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

ACC = {'CU España': 'es', 'CU Portugal': 'pt', 'CU Canada': 'cuc', 'PS Argentina': 'psar'}

def num(v):
    s = str(v).strip().replace('%', '')
    if not s or s in ('--', '—') or s.startswith('<') or s.startswith('>'):
        return None
    s = s.replace('.', '').replace(',', '.') if (',' in s) else s
    try:
        return float(s)
    except ValueError:
        return None

def acc_and_camp(camp_full):
    for pref, a in ACC.items():
        if camp_full.startswith(pref):
            short = re.sub(r'^' + re.escape(pref) + r'\s*-?\s*', '', camp_full)
            short = re.sub(r'\s*-\s*S(EARCH|earch)$', '', short).strip()
            FIX = {'Plasticos': 'Plásticos', 'Bioenergia': 'Bioenergía',
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
    for a in ['pt', 'es', 'cuc', 'psar']:
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
    out = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'paidDetail.js')
    open(out, 'w').write('\n'.join(L) + '\n')
    print(f'→ escrito {os.path.normpath(out)}', file=sys.stderr)

if __name__ == '__main__':
    main()
