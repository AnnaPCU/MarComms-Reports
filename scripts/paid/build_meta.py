# Genera el seed de UNA campaña de Meta Ads (campaña corta, de una o pocas
# semanas) desde los exports de Meta Ads Manager que el equipo deja en
# metricas/paid-media/meta-ads/AAAA-MM-<campaña>/.
#
# Uso (desde la raíz del repo):
#   python3 -B scripts/paid/build_meta.py "metricas/paid-media/meta-ads/2026-10-smeta" [--dry-run]
#
# Escribe src/data/paidMeta/<id>.js y lo registra en src/data/paidMetaGeo.js
# (import + lista). Si la campaña ya estaba cargada, la reemplaza.
#
# Qué exports lee (CSV o XLSX, como los baja Meta; el nombre del archivo no
# importa: el tipo se reconoce por las columnas):
#   · diario      — desglose «Por tiempo → Día»          (obligatorio)
#   · total       — sin desglose (alcance único del período, resultados)
#   · plataforma  — desglose «Entrega → Plataforma»
#   · edad        — desglose «Entrega → Edad»
#   · sexo        — desglose «Entrega → Sexo»
#   · hora        — desglose «Por tiempo → Hora del día»
#   · anuncios    — nivel anuncio, sin desglose
# Más un campaña.json opcional (ver metricas/paid-media/README.md).
#
# Regla de honestidad: el alcance y los clics únicos NO se suman entre filas
# (una persona puede estar en varias). Si el export viene por conjunto de
# anuncios con más de uno por campaña, el alcance queda vacío («—») en vez
# de inventarlo. Si el diario no cuadra con el total, el script corta.
import csv, io, json, os, re, sys, unicodedata
from collections import OrderedDict, defaultdict

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT_DIR = os.path.join(ROOT, 'src', 'data', 'paidMeta')
INDEX = os.path.join(ROOT, 'src', 'data', 'paidMetaGeo.js')

# Prefijo del nombre de la campaña en Meta → cuenta del pilar Paid.
# Peterson: hoy la única cuenta PS de Paid es PS Argentina.
ACC_PREFIX = [
    ('CU ARG', 'cuar'), ('CU Argentina', 'cuar'),
    ('PS ARG', 'psar'), ('PS Argentina', 'psar'), ('Peterson', 'psar'),
    ('CU España', 'es'), ('CU Espana', 'es'), ('CU Portugal', 'pt'),
    ('CU Canada', 'cuc'), ('CU Canadá', 'cuc'),
    ('CU United States', 'cuus'), ('CU USA', 'cuus'), ('CU Estados Unidos', 'cuus'),
]
KINDS = {'typeform', 'whatsapp', 'hsform', 'traffic', 'leads', 'awareness', 'engagement'}


def norm(s):
    s = unicodedata.normalize('NFKD', str(s or '')).encode('ascii', 'ignore').decode()
    return re.sub(r'\s+', ' ', s).strip().lower()


# Alias de columnas (export en español o en inglés), ya normalizados.
COLS = {
    'campaign': ['nombre de la campana', 'campaign name'],
    'adset': ['nombre del conjunto de anuncios', 'ad set name'],
    'ad': ['nombre del anuncio', 'ad name'],
    'day': ['dia', 'day'],
    'start': ['inicio del informe', 'reporting starts'],
    'end': ['fin del informe', 'reporting ends'],
    'imp': ['impresiones', 'impressions'],
    'reach': ['alcance', 'reach'],
    'freq': ['frecuencia', 'frequency'],
    'lc': ['clics en el enlace', 'link clicks'],
    'ulc': ['clics unicos en el enlace', 'unique link clicks'],
    'out': ['clics salientes', 'outbound clicks'],
    'results': ['resultados', 'results'],
    'resind': ['indicador de resultado', 'result indicator', 'tipo de resultado', 'result type'],
    'msgs': ['conversaciones con mensajes iniciadas', 'messaging conversations started'],
    'leads': ['clientes potenciales', 'leads'],
    'platform': ['plataforma', 'platform'],
    'age': ['edad', 'age'],
    'gender': ['sexo', 'gender'],
    'budget': ['presupuesto de la campana', 'campaign budget', 'presupuesto del conjunto de anuncios', 'ad set budget'],
    'attribution': ['configuracion de atribucion', 'attribution setting'],
    'objective': ['objetivo', 'objective'],
    'lpv': ['visitas a la pagina de destino', 'landing page views'],
    'dest': ['destino'],
}
# Destino final de un anuncio (destinos-anuncios.csv, §21 de DECISIONES):
# se normaliza a typeform | web | hsform | phone | whatsapp.
DESTS = {'typeform': 'typeform', 'web': 'web', 'landing': 'web', 'sitio': 'web', 'hubspot': 'hsform',
         'hsform': 'hsform', 'telefono': 'phone', 'phone': 'phone', 'llamada': 'phone', 'whatsapp': 'whatsapp'}
PREFIX_COLS = {
    'spend': ['importe gastado', 'amount spent'],
    'hour': ['hora del dia', 'time of day'],
}


def find_cols(header):
    h = [norm(x) for x in header]
    out = {}
    for key, names in COLS.items():
        for i, x in enumerate(h):
            if x in names:
                out[key] = header[i]
                break
    for key, prefs in PREFIX_COLS.items():
        for i, x in enumerate(h):
            if any(x.startswith(p) for p in prefs):
                out[key] = header[i]
                break
    return out


def num(v):
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().replace('%', '').replace(' ', '').replace(' ', '')
    if not s or s in ('-', '--', '—'):
        return None
    if ',' in s and '.' in s:          # el último separador es el decimal
        if s.rfind(',') > s.rfind('.'):
            s = s.replace('.', '').replace(',', '.')
        else:
            s = s.replace(',', '')
    elif ',' in s:
        s = s.replace(',', '.') if re.search(r',\d{1,2}$', s) else s.replace(',', '')
    try:
        return float(s)
    except ValueError:
        return None


def iso_day(v):
    if hasattr(v, 'strftime'):
        return v.strftime('%Y-%m-%d')
    s = str(v or '').strip()
    m = re.match(r'^(\d{4})-(\d{2})-(\d{2})', s)
    if m:
        return '-'.join(m.groups())
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', s)   # dd/mm/aaaa (export en español)
    if m:
        return f'{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}'
    raise SystemExit(f'Fecha que no se entiende: {s!r}')


def read_table(path):
    if path.lower().endswith(('.xlsx', '.xlsm')):
        import openpyxl
        ws = openpyxl.load_workbook(path, read_only=True, data_only=True).worksheets[0]
        rows = [list(r) for r in ws.iter_rows(values_only=True)]
    else:
        raw = open(path, encoding='utf-8-sig').read()
        sample = raw[:4000]
        delim = ';' if sample.count(';') > sample.count(',') else ','
        rows = list(csv.reader(io.StringIO(raw), delimiter=delim))
    # El encabezado es la primera fila que trae el nombre de la campaña.
    for i, r in enumerate(rows):
        if 'campaign' in find_cols([str(x or '') for x in r]):
            header = [str(x or '').strip() for x in r]
            body = [dict(zip(header, x)) for x in rows[i + 1:] if any(str(c or '').strip() for c in x)]
            return header, body
    # Sin nombre de campaña (ej. un export de anuncios o de conjuntos bajado
    # sin esa columna) no se puede atribuir: se ignora y se avisa.
    return None, None


def classify(cols, rows=()):
    if 'dest' in cols:
        return 'destinations'
    if 'ad' in cols:
        return 'ads'
    if 'day' in cols:
        return 'daily'
    if 'hour' in cols:
        return 'hourly'
    if 'platform' in cols:
        return 'platforms'
    if 'age' in cols and 'gender' in cols:
        return 'agegender'
    if 'age' in cols:
        return 'age'
    if 'gender' in cols:
        return 'gender'
    # Desglose «Por tiempo → Día» exportado en inglés: Meta no agrega una
    # columna «Day»; repite la fecha en «Reporting starts» y «Reporting ends».
    if 'start' in cols and 'end' in cols and rows:
        same = all(str(r.get(cols['start'])) == str(r.get(cols['end'])) for r in rows)
        if same and len({str(r.get(cols['start'])) for r in rows}) > 1:
            cols['day'] = cols['start']
            return 'daily'
    return 'totals'


def account_of(name, cfg):
    if cfg.get('cuenta'):
        return cfg['cuenta']
    for pref, acc in ACC_PREFIX:
        if name.startswith(pref):
            return acc
    raise SystemExit(f'Campaña sin cuenta reconocida: «{name}». Agregá "cuenta" en campaña.json '
                     f'o el prefijo al mapa ACC_PREFIX de build_meta.py.')


def kind_of(name, rows, cols, cfg_c):
    if cfg_c.get('tipo'):
        if cfg_c['tipo'] not in KINDS:
            raise SystemExit(f'Tipo desconocido «{cfg_c["tipo"]}» (válidos: {", ".join(sorted(KINDS))}).')
        return cfg_c['tipo']
    n = norm(name)
    if 'whatsapp' in n:
        return 'whatsapp'
    if 'typeform' in n:
        return 'typeform'
    if 'hubspot' in n:
        return 'hsform'
    ind = ' '.join(norm(r.get(cols.get('resind'), '')) + ' ' + norm(r.get(cols.get('objective'), '')) for r in rows)
    if 'messaging' in ind or 'mensaje' in ind:
        return 'whatsapp'
    if 'lead' in ind or 'cliente potencial' in ind or 'clientes potenciales' in ind:
        return 'leads'
    if 'reach' in ind or 'alcance' in ind or 'awareness' in ind or 'reconocimiento' in ind:
        return 'awareness'
    if 'engagement' in ind or 'interaccion' in ind:
        return 'engagement'
    return 'traffic'


GENDER = {'male': 'male', 'hombre': 'male', 'hombres': 'male', 'female': 'female', 'mujer': 'female',
          'mujeres': 'female', 'unknown': 'unknown', 'desconocido': 'unknown', 'sin especificar': 'unknown'}
PLATFORM = {'facebook': 'Facebook', 'instagram': 'Instagram', 'audience_network': 'Audience Network',
            'audience network': 'Audience Network', 'messenger': 'Messenger', 'threads': 'Threads',
            'whatsapp': 'WhatsApp'}


def result_of(r, cols, kind):
    # Resultado propio de Meta: conversaciones (WhatsApp) o leads del
    # formulario instantáneo. En tráfico/alcance el «resultado» de Meta son
    # los mismos clics o el alcance: no se duplica.
    if kind == 'whatsapp':
        v = num(r.get(cols['msgs'])) if 'msgs' in cols else None
        if v is None and 'results' in cols:
            v = num(r.get(cols['results']))
        return v
    if kind == 'leads':
        v = num(r.get(cols['leads'])) if 'leads' in cols else None
        if v is None and 'results' in cols:
            v = num(r.get(cols['results']))
        return v
    return None


def r2(v):
    return None if v is None else round(v + 0.0, 2)


def read_cfg(folder):
    for name in ('campaña.json', 'campana.json', 'config.json'):
        p = os.path.join(folder, name)
        if os.path.exists(p):
            return json.load(open(p, encoding='utf-8'))
    return {}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    dry = '--dry-run' in sys.argv
    if len(args) != 1:
        raise SystemExit('Uso: python3 -B scripts/paid/build_meta.py <carpeta de la campaña> [--dry-run]')
    folder = args[0].rstrip('/')
    period, acc_out, info = build(folder, read_cfg(folder))
    write(folder, period, acc_out, info, dry)


def build(folder, cfg):
    # Calcula período y datos por cuenta desde los exports de una carpeta.
    # Lo usa también build_parallel.py (campañas en paralelo Google + Meta).
    cfg_camps = cfg.get('campañas') or cfg.get('campanas') or {}

    tables = defaultdict(list)   # tipo → [(archivo, cols, rows)]
    currencies = defaultdict(set)
    for f in sorted(os.listdir(folder)):
        if not f.lower().endswith(('.csv', '.xlsx', '.xlsm')):
            continue
        header, rows = read_table(os.path.join(folder, f))
        if header is None:
            print(f'  ⚠ {f}: sin columna de nombre de campaña: se ignora (no se puede atribuir).', file=sys.stderr)
            continue
        cols = find_cols(header)
        if 'spend' in cols:
            m = re.search(r'\(([A-Z]{3})\)', cols['spend'])
            if m:
                for r in rows:
                    currencies[str(r.get(cols['campaign'], '')).strip()].add(m.group(1))
        kind = classify(cols, rows)
        tables[kind].append((f, cols, rows))
        print(f'  {f}: {kind} ({len(rows)} filas)', file=sys.stderr)
    if not tables['daily']:
        raise SystemExit('Falta el export diario (desglose «Por tiempo → Día»): es el que arma el reporte.')

    # ── Campañas: del diario ──
    camps = OrderedDict()
    for f, cols, rows in tables['daily']:
        by = defaultdict(lambda: defaultdict(list))
        for r in rows:
            name = str(r.get(cols['campaign'], '')).strip()
            if not name:
                continue
            by[name][iso_day(r.get(cols['day']))].append(r)
        for name, days in by.items():
            c = camps.setdefault(name, {'name': name, 'rows': [], 'cols': cols, 'days': {}})
            for d, rs in days.items():
                c['rows'].extend(rs)
                single = len(rs) == 1
                c['days'][d] = {
                    'd': d,
                    'spend': sum(num(r.get(cols['spend'])) or 0 for r in rs),
                    'imp': int(sum(num(r.get(cols['imp'])) or 0 for r in rs)),
                    'reach': int(num(rs[0].get(cols['reach'])) or 0) if single and 'reach' in cols else None,
                    'freq': num(rs[0].get(cols['freq'])) if single and 'freq' in cols else None,
                    'lc': int(sum(num(r.get(cols['lc'])) or 0 for r in rs)) if 'lc' in cols else 0,
                    'ulc': int(num(rs[0].get(cols['ulc'])) or 0) if single and 'ulc' in cols else None,
                    'out': int(sum(num(r.get(cols['out'])) or 0 for r in rs)) if 'out' in cols else None,
                }

    # Cuenta, tipo y moneda por campaña.
    accounts = OrderedDict()
    for name, c in camps.items():
        cc = cfg_camps.get(name, {})
        c['acc'] = account_of(name, cfg)
        c['kind'] = kind_of(name, c['rows'], c['cols'], cc)
        cur = currencies.get(name, set())
        if len(cur) > 1:
            raise SystemExit(f'«{name}» viene en más de una moneda ({", ".join(cur)}): no se suman importes de monedas distintas.')
        c['currency'] = (cur.pop() if cur else cfg.get('moneda'))
        if not c['currency']:
            raise SystemExit(f'No encuentro la moneda de «{name}» (columna «Importe gastado (XXX)»). Agregá "moneda" en campaña.json.')
        accounts.setdefault(c['acc'], []).append(name)
    for acc, names in accounts.items():
        curs = {camps[n]['currency'] for n in names}
        if len(curs) > 1:
            raise SystemExit(f'La cuenta {acc} mezcla monedas ({", ".join(curs)}).')

    def rows_for(kind, name):
        out = []
        for f, cols, rows in tables[kind]:
            for r in rows:
                if str(r.get(cols['campaign'], '')).strip() == name:
                    out.append((cols, r))
        return out

    problems, warnings = [], []
    for name, c in camps.items():
        k = c['kind']
        tot_d = {
            'imp': sum(x['imp'] for x in c['days'].values()),
            'spend': sum(x['spend'] for x in c['days'].values()),
            'lc': sum(x['lc'] for x in c['days'].values()),
        }
        # ── total del período ──
        tr = rows_for('totals', name)
        c['periodReach'] = None
        c['results'] = None
        if tr:
            cols = tr[0][0]
            t_imp = sum(num(r.get(cols['imp'])) or 0 for _, r in tr)
            t_sp = sum(num(r.get(cols['spend'])) or 0 for _, r in tr)
            t_lc = sum(num(r.get(cols['lc'])) or 0 for _, r in tr) if 'lc' in cols else None
            if int(t_imp) != tot_d['imp']:
                problems.append(f'«{name}»: impresiones del diario {tot_d["imp"]} ≠ total {int(t_imp)}')
            if abs(t_sp - tot_d['spend']) > 0.01 * max(1, len(c['days'])):
                problems.append(f'«{name}»: importe del diario {tot_d["spend"]:.2f} ≠ total {t_sp:.2f}')
            if t_lc is not None and int(t_lc) != tot_d['lc']:
                problems.append(f'«{name}»: clics en el enlace del diario {tot_d["lc"]} ≠ total {int(t_lc)}')
            if len(tr) == 1 and 'reach' in cols:
                reach = num(tr[0][1].get(cols['reach']))
                freq = num(tr[0][1].get(cols['freq'])) if 'freq' in cols else None
                if reach:
                    c['periodReach'] = {'reach': int(reach), 'freq': r2(freq if freq else t_imp / reach)}
            elif len(tr) > 1:
                warnings.append(f'«{name}»: el total viene en {len(tr)} filas (conjuntos de anuncios): el alcance único no se suma, queda sin dato.')
            res = [result_of(r, cols, k) for cols, r in tr]
            if any(v is not None for v in res):
                c['results'] = int(sum(v or 0 for v in res))
            if 'budget' in cols and len(tr) == 1:
                c['budget'] = num(tr[0][1].get(cols['budget']))
            if 'attribution' in cols:
                c['attribution'] = str(tr[0][1].get(cols['attribution']) or '').strip() or None
            if 'start' in cols:
                c['start'] = iso_day(tr[0][1].get(cols['start']))
                c['end'] = iso_day(tr[0][1].get(cols['end']))
        else:
            warnings.append(f'«{name}»: sin export total (sin desglose): no hay alcance único del período.')
            res = [result_of(r, c['cols'], k) for r in c['rows']]
            if any(v is not None for v in res):
                c['results'] = int(sum(v or 0 for v in res))

        # ── desgloses ──
        def breakdown(kind, key_col, keyfn, label):
            rs = rows_for(kind, name)
            if not rs:
                return None
            agg = OrderedDict()
            for cols, r in rs:
                key = keyfn(r.get(cols[key_col]))
                if key is None:
                    continue
                e = agg.setdefault(key, {'n': 0, 'reach': 0, 'imp': 0, 'spend': 0.0, 'lc': 0, 'results': None})
                e['n'] += 1
                e['reach'] += int(num(r.get(cols['reach'])) or 0) if 'reach' in cols else 0
                e['imp'] += int(num(r.get(cols['imp'])) or 0)
                e['spend'] += num(r.get(cols['spend'])) or 0
                e['lc'] += int(num(r.get(cols['lc'])) or 0) if 'lc' in cols else 0
                v = result_of(r, cols, k)
                if v is not None:
                    e['results'] = (e['results'] or 0) + int(v)
            s_imp = sum(e['imp'] for e in agg.values())
            if s_imp != tot_d['imp']:
                warnings.append(f'«{name}» · {label}: suma {s_imp} impresiones vs {tot_d["imp"]} del diario (Meta puede dejar filas afuera).')
            return agg

        plat = breakdown('platforms', 'platform', lambda v: PLATFORM.get(norm(v), str(v or '').strip() or None), 'plataforma')
        if plat:
            c['platforms'] = [dict(p=kk, reach=(e['reach'] if e['n'] == 1 else None), imp=e['imp'], spend=r2(e['spend']), lc=e['lc'],
                                   **({'results': e['results']} if e['results'] is not None else {})) for kk, e in plat.items()]
        gen = breakdown('gender', 'gender', lambda v: GENDER.get(norm(v), norm(v) or None), 'sexo')
        age = breakdown('age', 'age', lambda v: str(v or '').strip() or None, 'edad')
        if not gen or not age:
            # Export combinado edad × sexo: se agrega por cada eje, sin alcance.
            rs = rows_for('agegender', name)
            if rs:
                warnings.append(f'«{name}»: edad y sexo vinieron en un mismo export: el alcance por edad/sexo no se puede sumar, queda sin dato.')
                if not gen:
                    tables_bak = tables['gender']; tables['gender'] = tables['agegender']
                    gen = breakdown('gender', 'gender', lambda v: GENDER.get(norm(v), norm(v) or None), 'sexo')
                    tables['gender'] = tables_bak
                    for e in gen.values():
                        e['n'] = 2
                if not age:
                    tables_bak = tables['age']; tables['age'] = tables['agegender']
                    age = breakdown('age', 'age', lambda v: str(v or '').strip() or None, 'edad')
                    tables['age'] = tables_bak
                    for e in age.values():
                        e['n'] = 2
        if gen:
            order = ['male', 'female', 'unknown']
            c['gender'] = [dict(g=kk, reach=(e['reach'] if e['n'] == 1 else None), imp=e['imp'], spend=r2(e['spend']), lc=e['lc'],
                                **({'results': e['results']} if e['results'] is not None else {}))
                           for kk, e in sorted(gen.items(), key=lambda kv: order.index(kv[0]) if kv[0] in order else 9)]
        if age:
            c['age'] = [dict(a=kk, reach=(e['reach'] if e['n'] == 1 else None), imp=e['imp'], spend=r2(e['spend']), lc=e['lc'],
                             **({'results': e['results']} if e['results'] is not None else {}))
                        for kk, e in sorted(age.items())]
        hr = breakdown('hourly', 'hour', lambda v: int(re.match(r'\s*(\d{1,2})', str(v)).group(1)) if v is not None and re.match(r'\s*\d', str(v)) else None, 'hora')
        if hr:
            c['hourly'] = [dict(h=kk, spend=r2(e['spend']), imp=e['imp'], lc=e['lc'], **({'r': e['results']} if e['results'] else {}))
                           for kk, e in sorted(hr.items())]
        ads = rows_for('ads', name)
        if ads:
            dmap = {}
            for cols, r in rows_for('destinations', name):
                dv = DESTS.get(norm(r.get(cols['dest'])))
                if dv is None:
                    problems.append(f'«{name}» · {r.get(cols["ad"])}: destino desconocido «{r.get(cols["dest"])}».')
                dmap[str(r.get(cols['ad'], '')).strip()] = dv
            by = OrderedDict()
            for cols, r in ads:
                an = str(r.get(cols['ad'], '')).strip()
                e = by.setdefault(an, {'n': 0, 'reach': 0, 'imp': 0, 'spend': 0.0, 'lc': 0, 'out': None, 'lpv': None})
                e['n'] += 1
                e['reach'] += int(num(r.get(cols['reach'])) or 0) if 'reach' in cols else 0
                e['imp'] += int(num(r.get(cols['imp'])) or 0)
                e['spend'] += num(r.get(cols['spend'])) or 0
                e['lc'] += int(num(r.get(cols['lc'])) or 0) if 'lc' in cols else 0
                # Clics salientes y visitas a la página: si Meta deja la celda
                # vacía, queda sin dato (no es cero).
                for k in ('out', 'lpv'):
                    v = num(r.get(cols[k])) if k in cols else None
                    if v is not None:
                        e[k] = int((e[k] or 0) + v)
            if dmap:
                missing = [an for an in by if an not in dmap]
                if missing:
                    problems.append(f'«{name}»: {len(missing)} anuncio(s) sin destino en destinos-anuncios.csv ({", ".join(missing[:3])}…).')
            c['ads'] = [dict(name=an, spend=r2(e['spend']), imp=e['imp'], lc=e['lc'],
                             **({'out': e['out']} if e['out'] is not None else {}),
                             **({'lpv': e['lpv']} if e['lpv'] is not None else {}),
                             **({'dest': dmap[an]} if dmap.get(an) else {}),
                             **({'reach': e['reach']} if e['n'] == 1 and e['reach'] else {})) for an, e in by.items()]
            s_imp = sum(e['imp'] for e in by.values())
            if s_imp != tot_d['imp']:
                warnings.append(f'«{name}» · anuncios: suma {s_imp} impresiones vs {tot_d["imp"]} del diario.')

    for w in warnings:
        print('  ⚠ ' + w, file=sys.stderr)
    if problems:
        for p in problems:
            print('  ✗ ' + p, file=sys.stderr)
        raise SystemExit('Los exports no cuadran entre sí: no se generó nada.')

    # ── Período ──
    all_days = sorted(d for c in camps.values() for d in c['days'])
    start = cfg.get('inicio') or min([c.get('start') for c in camps.values() if c.get('start')] or [all_days[0]])
    end = cfg.get('fin') or max([c.get('end') for c in camps.values() if c.get('end')] or [all_days[-1]])
    slug = re.sub(r'[^a-z0-9]+', '-', norm(os.path.basename(folder))).strip('-')
    slug = re.sub(r'^\d{4}-\d{2}-', '', slug) or slug
    pid = cfg.get('id') or f'meta-{slug}-{start[:7].replace("-", "")}'
    if not re.match(r'^(geo|meta)-[a-z0-9-]+$', pid):
        raise SystemExit(f'id inválido «{pid}»: tiene que empezar con meta- o geo- (minúsculas, números y guiones).')
    MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    mi, yy = int(start[5:7]) - 1, start[:4]
    base = cfg.get('nombre') or os.path.basename(folder)
    base = re.sub(r'^\d{4}-\d{2}-?', '', base).replace('-', ' ').strip() or base
    label = cfg.get('label') or f'Meta · {base} · {MES[mi]} {yy}'
    label_en = cfg.get('labelEn') or f'Meta · {base} · {MON[mi]} {yy}'

    # ── Seed ──
    period = OrderedDict(id=pid, label=label, labelEn=label_en, start=start, end=end)
    acc_out = OrderedDict()
    for acc, names in accounts.items():
        data = OrderedDict(currency=camps[names[0]]['currency'])
        if cfg.get('evento'):
            data['event'] = cfg['evento']
        if cfg.get('objetivo'):
            data['objective'] = cfg['objetivo']
        # Formularios fuera de Meta (Typeform, HubSpot): contexto aparte, con
        # su rango tal cual vino; no se suman al embudo de Meta (§21).
        if cfg.get('formularios'):
            data['forms'] = [OrderedDict((k, v) for k, v in f.items() if k != 'source') for f in cfg['formularios']]
        if cfg.get('segmentacion') or cfg.get('segmentación'):
            seg = cfg.get('segmentacion') or cfg.get('segmentación')
            data['targeting'] = OrderedDict(es=seg.get('es'), en=seg.get('en'))
        cl = []
        used = set()
        for name in names:
            c = camps[name]
            cc = cfg_camps.get(name, {})
            cid = re.sub(r'[^a-z0-9]+', '-', norm(cc.get('id') or c['kind'])).strip('-')
            while cid in used:
                cid += '-2'
            used.add(cid)
            o = OrderedDict(id=cid, kind=c['kind'], name=name)
            if cc.get('etiqueta'):
                o['label'] = cc['etiqueta']
            budget = cc.get('presupuesto', c.get('budget'))
            o['budget'] = budget if budget else None
            if c.get('attribution'):
                o['attribution'] = c['attribution']
            if c['results'] is not None and c['kind'] in ('whatsapp', 'leads'):
                o['results'] = OrderedDict(value=c['results'])
                if cc.get('nota'):
                    o['results']['note'] = cc['nota']
            o['days'] = [OrderedDict((k, r2(v) if k in ('spend', 'freq') else v) for k, v in x.items() if v is not None or k in ('reach', 'freq'))
                         for _, x in sorted(c['days'].items())]
            if c['periodReach']:
                o['periodReach'] = c['periodReach']
            for k in ('platforms', 'gender', 'age', 'hourly', 'ads'):
                if c.get(k):
                    o[k] = c[k]
            cl.append(o)
        data['campaigns'] = cl
        acc_out[acc] = data

    info = dict(label=label, start=start, end=end, pid=pid, accounts=accounts, camps=camps)
    return period, acc_out, info


def write(folder, period, acc_out, info, dry):
    label, start, end, pid, accounts, camps = (info[k] for k in ('label', 'start', 'end', 'pid', 'accounts', 'camps'))
    js = []
    js.append('// ════════════════════════════════════════════════════════════════')
    js.append(f'//  SEED — Paid Media · Meta Ads · {label}')
    js.append('//  GENERADO con scripts/paid/build_meta.py desde los exports de Meta Ads')
    js.append(f'//  Manager de metricas/paid-media/meta-ads/{os.path.basename(folder)}/.')
    js.append('//  No editar a mano: corregir el export (o campaña.json) y volver a correr.')
    js.append('// ════════════════════════════════════════════════════════════════')
    js.append('')
    js.append('export default ' + to_js(OrderedDict(period=period, accounts=acc_out)) + ';')
    text = '\n'.join(js) + '\n'

    print(f'\n  Período: {pid} · {label} · {start} → {end}', file=sys.stderr)
    check_fx(pid, end)
    for acc, names in accounts.items():
        for n in names:
            c = camps[n]
            print(f'  {acc} · {c["kind"]:10} · {n}: {sum(x["imp"] for x in c["days"].values())} impr., '
                  f'{sum(x["spend"] for x in c["days"].values()):.2f} {c["currency"]}, '
                  f'{sum(x["lc"] for x in c["days"].values())} clics'
                  + (f', {c["results"]} resultados' if c['results'] is not None and c['kind'] in ('whatsapp', 'leads') else ''),
                  file=sys.stderr)
    if dry:
        print(text)
        return
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f'{pid}.js')
    open(out, 'w', encoding='utf-8').write(text)
    register(pid)
    print(f'  → escrito {os.path.relpath(out, ROOT)} y registrado en src/data/paidMetaGeo.js', file=sys.stderr)


def check_fx(pid, end):
    """Avisa si falta el tipo de cambio de la campaña en src/data/fxRates.js.

    Toda campaña (de Meta o en paralelo) se descarga en ARS / USD / EUR con el
    tipo de cambio del CIERRE DE LA CAMPAÑA (dólar BNA vendedor y euro/dólar
    oficial del BCE del último día hábil del vuelo, 2+ fuentes). Se carga a
    mano con la clave del período; fxService.test.js falla si falta.
    """
    fx_path = os.path.join(ROOT, 'src', 'data', 'fxRates.js')
    fx_txt = open(fx_path, encoding='utf-8').read() if os.path.exists(fx_path) else ''
    blk = re.search(r"\n  '" + re.escape(pid) + r"': \{([^\n]*)\}", fx_txt)
    if not blk or 'USD:' not in blk.group(1) or 'usdPerEur:' not in blk.group(1):
        print(f"  ⚠ Falta el tipo de cambio de la campaña en src/data/fxRates.js: '{pid}' con el dólar BNA "
              f'vendedor y el euro/dólar oficial del BCE al cierre de la campaña ({end}, último día hábil), '
              f'2+ fuentes. Sin él, la descarga en otra moneda queda deshabilitada.', file=sys.stderr)
    else:
        print(f"  ✓ tipo de cambio de '{pid}' cargado en src/data/fxRates.js", file=sys.stderr)


def to_js(v, ind=0):
    pad = '  ' * ind
    if isinstance(v, dict):
        if not v:
            return '{}'
        flat = all(not isinstance(x, (dict, list)) for x in v.values())
        items = [f'{k if re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", k) else json.dumps(k, ensure_ascii=False)}: {to_js(x, ind + 1)}' for k, x in v.items()]
        if flat and len(', '.join(items)) < 110:
            return '{ ' + ', '.join(items) + ' }'
        return '{\n' + ''.join(f'{pad}  {it},\n' for it in items) + pad + '}'
    if isinstance(v, list):
        if not v:
            return '[]'
        return '[\n' + ''.join(f'{pad}  {to_js(x, ind + 1)},\n' for x in v) + pad + ']'
    if v is None:
        return 'null'
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, float):
        return str(int(v)) if v == int(v) else repr(round(v, 2))
    if isinstance(v, int):
        return str(v)
    return "'" + str(v).replace('\\', '\\\\').replace("'", "\\'") + "'"


def register(pid):
    var = re.sub(r'-([a-z0-9])', lambda m: m.group(1).upper(), pid)
    var = re.sub(r'[^A-Za-z0-9]', '', var)
    s = open(INDEX, encoding='utf-8').read()
    imp = f"import {var} from './paidMeta/{pid}.js';"
    if imp in s:
        return
    a = s.index('// META:IMPORTS')
    a = s.index('\n', a) + 1
    s = s[:a] + imp + '\n' + s[a:]
    b = s.index('// META:LIST')
    b = s.index('\n', b) + 1
    s = s[:b] + f'  {var},\n' + s[b:]
    open(INDEX, 'w', encoding='utf-8').write(s)


if __name__ == '__main__':
    main()
