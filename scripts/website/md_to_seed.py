#!/usr/bin/env python3
"""Convierte los reportes trimestrales de Website (GA4 + Search Console) en el
bloque del seed `src/data/websiteSeed.js`.

Uso:
    python3 scripts/website/md_to_seed.py q3-2026 metricas/website/_procesados/2026-Q3/*.md

Entrada: los .md «datos del reporte trimestral» (uno por marca), con una
sección «## <Cuenta>» por cuenta/región y, adentro, la tabla de SEO, las top
keywords, la tabla de Website, el desglose de conversiones y las top páginas.
Valida que el CTR y los % del embudo que trae el archivo coincidan con los
números (si no, corta). Imprime el bloque JS por stdout.
"""
import re, sys, json

# Nombre de la sección en el reporte → id de cuenta en el seed.
ACCOUNT_IDS = {
    'Control Union Argentina': 'cua', 'Control Union Brasil': 'cubr', 'Control Union Chile': 'cucl',
    'Control Union España': 'cues', 'Control Union México': 'cumx', 'Control Union North America': 'cunam',
    'Control Union Perú': 'cupe', 'Control Union Portugal': 'cupt',
    # northamerica.controlunion.com separado por país (reporte «…_northamerica_por_pais.md»).
    'Control Union North America — Estados Unidos': 'cuus', 'Control Union North America — Canadá': 'cuca',
    # El sitio americas.peterson-solutions.com es la cuenta «Peterson Solutions Americas».
    'Peterson Solutions South America': 'psam', 'Peterson Solutions Iberia': 'psib',
}

num = lambda s: float(s.replace('.', '').replace(',', '.').replace('%', '').strip())

def parse(text):
    out = {}
    for sec in re.split(r'^## ', text, flags=re.M)[1:]:
        name, body = sec.split('\n', 1)
        name = name.strip()
        acc = ACCOUNT_IDS[name]
        rows = re.findall(r'^\|\s*([\d.,]+)\s*\|\s*([\d.,]+)\s*\|\s*([\d.,]+)\s*\|\s*([\d.,%\s]+)\|', body, re.M)
        assert len(rows) == 2, (name, rows)
        (pos, imp, clk, ctr), (single, total, views, conv) = rows
        seo = {'averagePosition': num(pos), 'impressions': int(num(imp)), 'totalClicks': int(num(clk))}
        site = {'singleTraffic': int(num(single)), 'totalTraffic': int(num(total)), 'impressions': int(num(views)), 'conversions': int(num(conv))}
        # Validaciones contra lo que trae el archivo.
        assert round(seo['totalClicks'] / seo['impressions'] * 100, 2) == num(ctr), (name, 'CTR')
        # Conversiones (desde el 9/10/2026) = formularios por página de gracias +
        # emails (click_email filtrado). Formato anterior: click_email + form_submit.
        m = re.search(r'Conversions = formularios por página de gracias \((\d+)\) \+ emails \((\d+)\)', body)
        if m:
            forms, emails = int(m[1]), int(m[2])
        else:
            m = re.search(r'Conversions = click_email \((\d+)\) \+ form_submit \((\d+)\)', body)
            assert m, (name, 'no encuentro el desglose de conversiones')
            emails, forms = int(m[1]), int(m[2])
        assert forms + emails == site['conversions'], (name, 'conversiones')
        site['conversionsBreakdown'] = {'forms': forms, 'emails': emails}
        e = re.search(r'sesiones [\d.]+ \(([\d,]+) %\) → conversiones \d+ \(([\d,]+) %', body)
        assert round(site['totalTraffic'] / site['impressions'] * 100, 2) == num(e[1]), (name, 'embudo vista→sesión')
        assert round(site['conversions'] / site['totalTraffic'] * 100, 2) == num(e[2]), (name, 'embudo sesión→conversión')
        kws, pages = body.split('### Website')[0], body.split('### Website')[1]
        # Keywords sin clics no van al top (no aportan y suelen ser ruido, ej. un teléfono).
        seo['topKeywords'] = [(q.strip(), int(num(c))) for q, c in re.findall(r'^\d+\. (.+?) — ([\d.]+)$', kws, re.M) if int(num(c)) > 0]
        site['topLandingPages'] = [(u.strip(), int(num(v))) for u, v in re.findall(r'^\d+\. (https?://\S+) — ([\d.]+)$', pages, re.M)]
        assert seo['topKeywords'] and site['topLandingPages'], name
        out[acc] = {'site': site, 'seo': seo, 'source': name}
    return out

def js(data):
    lines = []
    for acc, d in data.items():
        s, o = d['site'], d['seo']
        lines.append(f"  // {d['source']}")
        lines.append(f"  {acc}: {{")
        lines.append("    site: {")
        lines.append(f"      singleTraffic: {s['singleTraffic']}, totalTraffic: {s['totalTraffic']}, impressions: {s['impressions']}, conversions: {s['conversions']},")
        b = s['conversionsBreakdown']
        lines.append(f"      conversionsBreakdown: {{ forms: {b['forms']}, emails: {b['emails']} }},")
        lines.append("      topLandingPages: [")
        lines += [f"        lp({json.dumps(u)}, {v})," for u, v in s['topLandingPages']]
        lines.append("      ],")
        lines.append("    },")
        lines.append("    seo: {")
        lines.append(f"      averagePosition: {o['averagePosition']}, impressions: {o['impressions']}, totalClicks: {o['totalClicks']},")
        lines.append("      topKeywords: [" + ", ".join(f"kw({json.dumps(q, ensure_ascii=False)}, {c})" for q, c in o['topKeywords']) + "],")
        lines.append("    },")
        lines.append("  },")
    return "\n".join(lines)

if __name__ == '__main__':
    data = {}
    for f in sys.argv[2:]:
        data.update(parse(open(f, encoding='utf-8').read()))
    print(js(data))
    print(f"// {len(data)} cuentas", file=sys.stderr)
