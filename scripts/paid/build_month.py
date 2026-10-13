# Procesa un mes completo de Google Ads (todas las campañas, todas las
# cuentas) desde la carpeta metricas/paid-media/google-ads/AAAA-MM/.
#
# Uso (desde la raíz del repo):
#   python3 -B scripts/paid/build_month.py "metricas/paid-media/google-ads/2026-09" [moneda=ARS] [--dry-run]
#
# Lee los 3 informes de Google Ads (CSV, como los exporta el Editor de
# informes; el nombre del archivo no importa, el tipo se reconoce por las
# columnas):
#   1) Rendimiento de campañas  (Campaña + métricas del mes)
#   2) Semanal por grupo        (Campaña / Grupo de anuncios / Semana)
#   3) Términos + palabras clave (Campaña / Grupo / Palabra clave / Término)
#
# Hace tres cosas:
#   · Valida que el semanal cuadre EXACTO con el informe de campañas, por
#     cuenta y por campaña (impresiones, clics, coste, conversiones). Si no
#     cuadra, corta sin escribir nada.
#   · Imprime, por cuenta, el bloque del mes para src/data/paidSeed.js
#     (totales + campañas). El texto `analysis` lo redacta Claude con esos
#     números; las campañas que arrancaron a mitad de mes se avisan para
#     sumarles `startedOn`.
#   · Corre build_detail.py con los informes 2 y 3 (src/data/paidDetail.js).
import csv, io, os, re, subprocess, sys
from datetime import date
from collections import OrderedDict, defaultdict

sys.path.insert(0, os.path.dirname(__file__))
from build_detail import ACC, acc_and_camp, num  # noqa: E402  (mismo mapa de cuentas y parser)

HERE = os.path.dirname(os.path.abspath(__file__))


def read_csv(path):
    raw = open(path, encoding='utf-8-sig').read()
    lines = raw.splitlines()
    # Google antepone el título del informe y el rango de fechas: el
    # encabezado es la primera línea que trae la columna «Campaña».
    for i, l in enumerate(lines):
        cells = next(csv.reader([l]))
        if 'Campaña' in [c.strip() for c in cells]:
            rows = list(csv.DictReader(io.StringIO('\n'.join(lines[i:]))))
            return [c.strip() for c in cells], rows, lines[:i]
    raise SystemExit(f'{os.path.basename(path)}: no encuentro la columna «Campaña».')


def classify(header):
    if 'Término de búsqueda' in header:
        return 'terms'
    if 'Semana' in header:
        return 'weekly'
    return 'campaigns'


def is_total(row):
    return any(str(v or '').strip().lower().startswith('total') for v in row.values())


def col(row, *names):
    for n in names:
        if n in row:
            return row[n]
    return None


def r2(v):
    return round(v + 0.0, 2)


def jsnum(v):
    v = r2(v)
    return str(int(v)) if v == int(v) else str(v)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--') and '=' not in a]
    opts = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
    dry = '--dry-run' in sys.argv
    if len(args) != 1:
        raise SystemExit('Uso: python3 -B scripts/paid/build_month.py <carpeta AAAA-MM> [moneda=ARS] [mes=m09] [--dry-run]')
    folder = args[0].rstrip('/')
    m = re.search(r'(\d{4})-(\d{2})', os.path.basename(folder))
    mid = opts.get('mes') or (f'm{m.group(2)}' if m else None)
    if not mid:
        raise SystemExit('No deduzco el mes del nombre de la carpeta (AAAA-MM): pasá mes=mXX.')

    files = {}
    for f in sorted(os.listdir(folder)):
        if not f.lower().endswith('.csv'):
            continue
        header, rows, pre = read_csv(os.path.join(folder, f))
        kind = classify(header)
        if kind in files:
            raise SystemExit(f'Hay dos informes de tipo «{kind}»: {files[kind][0]} y {f}.')
        files[kind] = (f, header, rows, pre)
        print(f'  {f}: {kind} ({len(rows)} filas) {" · ".join(p.strip() for p in pre if p.strip())}', file=sys.stderr)
    missing = [k for k in ('campaigns', 'weekly', 'terms') if k not in files]
    if missing:
        raise SystemExit(f'Faltan informes: {", ".join(missing)} (ver metricas/paid-media/README.md).')

    # ── 1) Campañas ──
    f, header, rows, _ = files['campaigns']
    camps = defaultdict(OrderedDict)   # acc → camp → métricas
    currency = defaultdict(set)
    for r in rows:
        name = str(r.get('Campaña') or '').strip()
        if not name or is_total(r):
            continue
        acc, short = acc_and_camp(name)
        c = camps[acc].setdefault(short, dict(impressions=0, clicks=0, cost=0.0, conversions=0.0))
        c['impressions'] += int(num(col(r, 'Impr.', 'Impresiones')) or 0)
        c['clicks'] += int(num(col(r, 'Clics', 'Interacciones')) or 0)
        c['cost'] += num(col(r, 'Coste', 'Costo')) or 0
        c['conversions'] += num(col(r, 'Conversiones')) or 0
        cur = col(r, 'Código de moneda', 'Moneda')
        if cur:
            currency[acc].add(cur.strip())
    for acc in camps:
        cur = currency.get(acc) or ({opts['moneda']} if 'moneda' in opts else set())
        if len(cur) != 1:
            raise SystemExit(f'{acc}: no encuentro la moneda (columna «Código de moneda») o viene más de una ({cur}). '
                             f'Pasá moneda=XXX.')
        currency[acc] = cur.pop()

    # ── 2) Semanal: validación cruzada + inicio a mitad de mes ──
    f, header, rows, _ = files['weekly']
    wk = defaultdict(lambda: defaultdict(lambda: dict(impressions=0, clicks=0, cost=0.0, conversions=0.0, weeks=set())))
    all_weeks = set()
    for r in rows:
        name = str(r.get('Campaña') or '').strip()
        if not name or is_total(r):
            continue
        acc, short = acc_and_camp(name)
        w = wk[acc][short]
        imp = int(num(col(r, 'Impr.', 'Impresiones')) or 0)
        w['impressions'] += imp
        w['clicks'] += int(num(col(r, 'Clics')) or 0)
        w['cost'] += num(col(r, 'Coste', 'Costo')) or 0
        w['conversions'] += num(col(r, 'Conversiones')) or 0
        all_weeks.add(r['Semana'])
        if imp > 0:
            w['weeks'].add(r['Semana'])

    problems, notes = [], []
    for acc in sorted(set(camps) | set(wk)):
        for short in sorted(set(camps.get(acc, {})) | set(wk.get(acc, {}))):
            a = camps.get(acc, {}).get(short)
            b = wk.get(acc, {}).get(short)
            if a is None:
                problems.append(f'{acc} · {short}: está en el semanal pero no en el informe de campañas')
                continue
            if b is None:
                if a['impressions']:
                    problems.append(f'{acc} · {short}: tiene impresiones pero no aparece en el semanal')
                continue
            for k in ('impressions', 'clicks'):
                if a[k] != b[k]:
                    problems.append(f'{acc} · {short}: {k} campañas {a[k]} ≠ semanal {b[k]}')
            if abs(a['cost'] - b['cost']) > 0.02:
                problems.append(f'{acc} · {short}: coste campañas {a["cost"]:.2f} ≠ semanal {b["cost"]:.2f}')
            if abs(a['conversions'] - b['conversions']) > 0.01:
                problems.append(f'{acc} · {short}: conversiones campañas {a["conversions"]} ≠ semanal {b["conversions"]}')
            # Primera semana con impresiones ≥ 21 días después de la primera
            # semana del informe (la del día 1 puede arrancar el mes anterior).
            if b['weeks'] and all_weeks and (date.fromisoformat(min(b['weeks'])) - date.fromisoformat(min(all_weeks))).days >= 21:
                notes.append(f'{acc} · {short}: la primera semana con impresiones es {min(b["weeks"])} → '
                             f'¿arrancó a mitad de mes? Si es así, sumar startedOn (historial de cambios de Google Ads).')
    if problems:
        for p in problems:
            print('  ✗ ' + p, file=sys.stderr)
        raise SystemExit('El semanal no cuadra con el informe de campañas: no se generó nada.')
    print('  ✓ semanal = informe de campañas (por cuenta y por campaña)', file=sys.stderr)
    for n in notes:
        print('  ⚠ ' + n, file=sys.stderr)

    # ── Bloque para paidSeed.js ──
    out = []
    for acc in [a for a in ACC.values() if a in camps] + [a for a in camps if a not in ACC.values()]:
        cs = camps[acc]
        T = dict(impressions=sum(c['impressions'] for c in cs.values()), clicks=sum(c['clicks'] for c in cs.values()),
                 cost=sum(c['cost'] for c in cs.values()), conversions=sum(c['conversions'] for c in cs.values()))

        def derived(c):
            imp, clk, cost, conv = c['impressions'], c['clicks'], c['cost'], c['conversions']
            return (f"impressions: {imp}, clicks: {clk}, ctr: {jsnum(clk / imp * 100 if imp else 0)}, "
                    f"cpc: {jsnum(cost / clk if clk else 0)}, cost: {jsnum(cost)}, ")\
                , (f"conversions: {jsnum(conv)}, convRate: {jsnum(conv / clk * 100 if clk else 0)}, "
                   f"costPerConv: {jsnum(cost / conv if conv else 0)}")
        a, b = derived(T)
        out.append(f'  // {acc} · {mid}')
        out.append(f'      {mid}: {{')
        out.append("        channel: 'Google Ads Search',")
        out.append("        objetivo: 'Generación de leads',")
        out.append(f"        totals: {{ {a}currency: '{currency[acc]}', {b} }},")
        out.append('        campaigns: [')
        for short, c in sorted(cs.items(), key=lambda kv: (-kv[1]['cost'], -kv[1]['impressions'])):
            a, b = derived(c)
            out.append(f"          {{ name: '{short}', {a}{b} }},")
        out.append('        ],')
        out.append("        analysis: '', // ← redactar con estos números (como los meses anteriores)")
        out.append('      },')
        print(f'  {acc}: {T["impressions"]} impr., {T["clicks"]} clics, {T["cost"]:.2f} {currency[acc]}, '
              f'{r2(T["conversions"])} conv. · {len(cs)} campañas', file=sys.stderr)
    print('\n'.join(out))

    # ── 3) Detalle por grupo (informes 2 y 3) ──
    if dry:
        print('  (dry-run: no se corrió build_detail.py)', file=sys.stderr)
        return
    subprocess.run([sys.executable, '-B', os.path.join(HERE, 'build_detail.py'), mid,
                    os.path.join(folder, files['weekly'][0]), os.path.join(folder, files['terms'][0])], check=True)


if __name__ == '__main__':
    main()
