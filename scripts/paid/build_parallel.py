# Procesa UNA campaña hecha en paralelo en Google Ads y Meta Ads (mismo
# nombre de campaña/evento en el mismo drop, ver docs/DECISIONES.md §22)
# desde metricas/paid-media/<CAMPAÑA>-AAAA-MM/, con dos subcarpetas:
#   Google Ads/  — los 3 informes de Google (campañas, semanal por grupo,
#                  términos + palabras clave) con el rango del vuelo
#   Meta Ads/    — los exports de Meta (como en build_meta.py) y, si hay,
#                  destinos-anuncios.csv (destino final de cada anuncio, §21)
# más un campaña.json opcional en la raíz (label, evento, etiquetas de las
# campañas de Meta, formularios fuera de Meta).
#
# Uso (desde la raíz del repo):
#   python3 -B scripts/paid/build_parallel.py "metricas/paid-media/IFPA-2026-10" [--dry-run]
#
# Escribe src/data/paidParallel/<id>.js y lo registra en
# src/data/paidParallel.js. Las dos plataformas quedan separadas: nunca se
# suman entre sí (miden cosas distintas y pueden venir en monedas distintas).
# Validaciones que cortan: Google semanal = informe de campañas (exacto) y
# Meta diario = total (las de build_meta.py).
import os, re, sys
from collections import OrderedDict, defaultdict

sys.path.insert(0, os.path.dirname(__file__))
from build_detail import acc_and_camp, num, collect, TOP_KWS, TOP_TERMS  # noqa: E402
from build_month import read_csv, classify, is_total, col  # noqa: E402
import build_meta  # noqa: E402

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT_DIR = os.path.join(ROOT, 'src', 'data', 'paidParallel')
INDEX = os.path.join(ROOT, 'src', 'data', 'paidParallel.js')


def r2(v):
    return None if v is None else round(v + 0.0, 2)


def derived(c):
    imp, clk, cost, conv = c['impressions'], c['clicks'], c['cost'], c['conversions']
    return OrderedDict(
        impressions=imp, clicks=clk, ctr=r2(clk / imp * 100 if imp else 0), cpc=r2(cost / clk if clk else 0),
        cost=r2(cost), conversions=r2(conv), convRate=r2(conv / clk * 100 if clk else 0),
        costPerConv=r2(cost / conv if conv else 0))


def google(folder):
    files = {}
    for f in sorted(os.listdir(folder)):
        if not f.lower().endswith('.csv'):
            continue
        header, rows, pre = read_csv(os.path.join(folder, f))
        files[classify(header)] = (f, rows, pre)
        print(f'  Google · {f}: {classify(header)} ({len(rows)} filas)', file=sys.stderr)
    missing = [k for k in ('campaigns', 'weekly', 'terms') if k not in files]
    if missing:
        raise SystemExit(f'Google Ads: faltan informes: {", ".join(missing)}.')

    camps = defaultdict(OrderedDict)
    currency = defaultdict(set)
    for r in files['campaigns'][1]:
        name = str(r.get('Campaña') or '').strip()
        if not name or is_total(r):
            continue
        acc, short = acc_and_camp(name)
        c = camps[acc].setdefault(short, dict(impressions=0, clicks=0, cost=0.0, conversions=0.0))
        c['impressions'] += int(num(col(r, 'Impr.', 'Impresiones')) or 0)
        c['clicks'] += int(num(col(r, 'Clics')) or 0)
        c['cost'] += num(col(r, 'Coste', 'Costo')) or 0
        c['conversions'] += num(col(r, 'Conversiones')) or 0
        cur = col(r, 'Código de moneda', 'Moneda')
        if cur:
            currency[acc].add(cur.strip())

    wk = defaultdict(lambda: defaultdict(lambda: dict(impressions=0, clicks=0, cost=0.0, conversions=0.0)))
    weeks = set()
    for r in files['weekly'][1]:
        name = str(r.get('Campaña') or '').strip()
        if not name or is_total(r):
            continue
        acc, short = acc_and_camp(name)
        w = wk[acc][short]
        w['impressions'] += int(num(r.get('Impr.')) or 0)
        w['clicks'] += int(num(r.get('Clics')) or 0)
        w['cost'] += num(r.get('Coste')) or 0
        w['conversions'] += num(r.get('Conversiones')) or 0
        if int(num(r.get('Impr.')) or 0) > 0:
            weeks.add(r['Semana'])
    problems = []
    for acc in set(camps) | set(wk):
        for short in set(camps.get(acc, {})) | set(wk.get(acc, {})):
            a, b = camps.get(acc, {}).get(short), wk.get(acc, {}).get(short)
            if a is None or b is None:
                problems.append(f'{acc} · {short}: está en un informe y no en el otro')
                continue
            for k in ('impressions', 'clicks'):
                if a[k] != b[k]:
                    problems.append(f'{acc} · {short}: {k} campañas {a[k]} ≠ semanal {b[k]}')
            if abs(a['cost'] - b['cost']) > 0.02 or abs(a['conversions'] - b['conversions']) > 0.01:
                problems.append(f'{acc} · {short}: coste/conversiones no cuadran entre campañas y semanal')
    if problems:
        for p in problems:
            print('  ✗ ' + p, file=sys.stderr)
        raise SystemExit('Google Ads: el semanal no cuadra con el informe de campañas: no se generó nada.')
    print('  ✓ Google · semanal = informe de campañas', file=sys.stderr)

    detail = collect(os.path.join(folder, files['weekly'][0]), os.path.join(folder, files['terms'][0]))
    out = OrderedDict()
    for acc, cs in camps.items():
        if len(currency[acc]) != 1:
            raise SystemExit(f'Google Ads · {acc}: moneda ausente o más de una ({currency[acc]}).')
        T = dict(impressions=sum(c['impressions'] for c in cs.values()), clicks=sum(c['clicks'] for c in cs.values()),
                 cost=sum(c['cost'] for c in cs.values()), conversions=sum(c['conversions'] for c in cs.values()))
        totals = derived(T)
        totals['currency'] = next(iter(currency[acc]))
        groups = []
        for camp, gs in detail.get(acc, {}).items():
            for gname, g in gs.items():
                kws = sorted(g['kws'].items(), key=lambda kv: (-kv[1]['clk'], -kv[1]['imp']))
                terms = sorted(g['terms'], key=lambda t: (-t['clk'], -t['imp']))
                groups.append(OrderedDict(
                    camp=camp, name=gname,
                    weeks=[OrderedDict(w=w, imp=x['imp'], clk=x['clk'], cost=r2(x['cost']), conv=x['conv'], **{'is': r2(x['is_'])}, lr=r2(x['lr']))
                           for w, x in sorted(g['weeks'].items())],
                    kws=[OrderedDict(k=k, imp=v['imp'], clk=v['clk'], cost=r2(v['cost']), conv=v['conv']) for k, v in kws[:TOP_KWS]],
                    nKws=len(kws),
                    terms=[OrderedDict(t=t['t'], match=t['match'], imp=t['imp'], clk=t['clk'], cost=r2(t['cost']), conv=t['conv'])
                           for t in terms[:TOP_TERMS]],
                    nTerms=len(terms)))
        out[acc] = OrderedDict(
            mo=OrderedDict(channel='Google Ads Search', objetivo='Generación de leads', totals=totals,
                           campaigns=[OrderedDict(name=k, **derived(v)) for k, v in
                                      sorted(cs.items(), key=lambda kv: (-kv[1]['cost'], -kv[1]['impressions']))]),
            detail=OrderedDict(groups=groups),
            weeks=sorted(weeks))
        print(f'  Google · {acc}: {T["impressions"]} impr., {T["clicks"]} clics, {T["cost"]:.2f} {totals["currency"]}, '
              f'{r2(T["conversions"])} conv.', file=sys.stderr)
    rng = ' '.join(p.strip().strip('"') for p in files['campaigns'][2][1:2])
    return out, rng


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    dry = '--dry-run' in sys.argv
    if len(args) != 1:
        raise SystemExit('Uso: python3 -B scripts/paid/build_parallel.py <carpeta CAMPAÑA-AAAA-MM> [--dry-run]')
    folder = args[0].rstrip('/')
    sub = {n.lower(): n for n in os.listdir(folder)}
    if 'google ads' not in sub or 'meta ads' not in sub:
        raise SystemExit('La carpeta tiene que traer las subcarpetas «Google Ads» y «Meta Ads».')
    cfg = build_meta.read_cfg(folder)
    g, g_range = google(os.path.join(folder, sub['google ads']))
    m_cfg = dict(cfg, id='meta-tmp')
    m_period, m_acc, _ = build_meta.build(os.path.join(folder, sub['meta ads']), m_cfg)

    base = re.sub(r'-?\d{4}-\d{2}$', '', os.path.basename(folder)).strip('-') or os.path.basename(folder)
    ym = re.search(r'(\d{4})-(\d{2})$', os.path.basename(folder))
    pid = cfg.get('id') or f'par-{build_meta.norm(base).replace(" ", "-")}-{ym.group(1)}{ym.group(2)}'
    if not re.match(r'^par-[a-z0-9-]+$', pid):
        raise SystemExit(f'id inválido «{pid}»: tiene que empezar con par- (minúsculas, números y guiones).')
    MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    mi = int(ym.group(2)) - 1 if ym else int(m_period['start'][5:7]) - 1
    yy = ym.group(1) if ym else m_period['start'][:4]
    period = OrderedDict(
        id=pid,
        label=cfg.get('label') or f'{base} · {MES[mi]} {yy}',
        labelEn=cfg.get('labelEn') or f'{base} · {MON[mi]} {yy}',
        start=m_period['start'], end=m_period['end'],
        platforms=['google', 'meta'])

    accounts = OrderedDict()
    for acc in list(g) + [a for a in m_acc if a not in g]:
        if acc not in g or acc not in m_acc:
            raise SystemExit(f'La cuenta {acc} está solo en {"Google" if acc in g else "Meta"}: '
                             f'una campaña en paralelo tiene que estar en las dos plataformas.')
        gg = dict(g[acc])
        gg['range'] = g_range
        accounts[acc] = OrderedDict(google=gg, meta=m_acc[acc])

    js = ['// ════════════════════════════════════════════════════════════════',
          f'//  SEED — Paid Media · campaña en paralelo (Google Ads + Meta Ads) · {period["label"]}',
          '//  GENERADO con scripts/paid/build_parallel.py desde',
          f'//  metricas/paid-media/{os.path.basename(folder)}/. No editar a mano: corregir',
          '//  el export (o campaña.json) y volver a correr.',
          '//  Las plataformas no se suman entre sí (docs/DECISIONES.md §22).',
          '// ════════════════════════════════════════════════════════════════',
          '',
          'export default ' + build_meta.to_js(OrderedDict(period=period, accounts=accounts)) + ';']
    text = '\n'.join(js) + '\n'
    print(f'\n  Período: {pid} · {period["label"]} · cuentas: {", ".join(accounts)}', file=sys.stderr)
    if dry:
        print(text)
        return
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f'{pid}.js')
    open(out, 'w', encoding='utf-8').write(text)
    register(pid)
    print(f'  → escrito {os.path.relpath(out, ROOT)} y registrado en src/data/paidParallel.js', file=sys.stderr)


def register(pid):
    var = re.sub(r'-([a-z0-9])', lambda m: m.group(1).upper(), pid)
    var = re.sub(r'[^A-Za-z0-9]', '', var)
    s = open(INDEX, encoding='utf-8').read()
    imp = f"import {var} from './paidParallel/{pid}.js';"
    if imp in s:
        return
    a = s.index('// PARALLEL:IMPORTS')
    a = s.index('\n', a) + 1
    s = s[:a] + imp + '\n' + s[a:]
    b = s.index('// PARALLEL:LIST')
    b = s.index('\n', b) + 1
    s = s[:b] + f'  {var},\n' + s[b:]
    open(INDEX, 'w', encoding='utf-8').write(s)


if __name__ == '__main__':
    main()
