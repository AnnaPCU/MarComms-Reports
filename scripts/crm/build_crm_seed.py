#!/usr/bin/env python3
"""Genera src/data/crmSeed.js con los deals de MarComms en HubSpot.

Uso:
    python3 scripts/crm/build_crm_seed.py <carpeta_con_exports> src/data/crmSeed.js

Entradas (ver scripts/crm/README.md):
  · Deals generados: conteos agregados (mes × entidad) por origen, transcriptos
    abajo en G y validados contra el total de cada origen (CHECK).
  · MQL / WON: tres exports de filas (q_cu_a.txt, q_mix_b.txt, q_other.txt) de
    los deals cuyo stage actual es Qualified, Proposal Sent o WON. No se
    commitean (traen nombres de empresas); el seed solo guarda agregados.
"""
import json,collections,datetime,sys
S=sys.argv[1]; OUT=sys.argv[2]
CODE={'CU Cert. Spain':'518','CU Cert. Portugal':'522','CU Cert. Argentina':'538','CU Cert. Brazil':'584','CU Cert. Chile':'848','CU Cert. Mexico':'598','CU Cert. Peru':'536','CU Cert. United States':'537','CU Cert. Canada':'583','PS Spain':'765','PS Argentina':'592','PS Brazil':'442','PS United States':'767','849':'849',
      '537 - Control Union (United States) Inc. (Inspections)':'537i','583 - Control Union Canada Inc (Solutions)':'583s','PS Mexico':'880'}
N={'Spain':'518','Portugal':'522','Argentina':'538','Brazil':'584','Chile':'848','Mexico':'598','Peru':'536','US':'537','Canada':'583','PS Spain':'765','PS Argentina':'592','PS Brazil':'442','PS US':'767','PS Chile':'849','US Insp':'537i','Canada Sol':'583s','PS Mexico':'880'}
SRC={'Social Media':'social','Paid Media':'paid','Website':'website','Email Marketing':'email','Webinar':'webinars','STEAL':'steal','Database':'database','Commercial Tool':'ctool','Event':'inperson','BDR MarComms':'bdr'}
# Deals generados 2026 (createdate) por mes → entidad. Transcripto de las consultas agregadas a HubSpot.
G={
'website':{1:{'Peru':4,'US':19},2:{'Portugal':1,'Canada':1},3:{'Spain':2,'Portugal':1,'Peru':4,'Canada':35},
 4:{'Spain':7,'Portugal':2,'Peru':3,'US':3,'Canada':24,'PS Spain':1},
 5:{'PS Brazil':1,'Spain':7,'Portugal':3,'Peru':8,'US':4,'Argentina':1,'Canada':15,'Mexico':34},
 6:{'PS Brazil':1,'Spain':12,'Portugal':1,'Peru':12,'US':6,'Argentina':3,'Canada':8,'Brazil':9,'PS Argentina':2,'Mexico':16,'PS Spain':1,'Chile':4},
 7:{'Spain':10,'Portugal':3,'Peru':10,'US':11,'Argentina':5,'Canada':5,'Brazil':18,'PS Argentina':1,'Mexico':17,'PS Spain':2,'Chile':9},
 8:{'PS Brazil':1,'Spain':11,'Portugal':2,'Peru':13,'US':13,'Argentina':5,'Canada':2,'Brazil':18,'Mexico':14,'Chile':1},
 9:{'PS Brazil':2,'Spain':11,'Portugal':7,'Peru':10,'US':10,'Argentina':12,'Canada':1,'Brazil':14,'PS Argentina':1,'Mexico':25,'PS Spain':2,'Chile':7},
 10:{'PS Brazil':1,'Spain':2,'Peru':2,'US':1,'Argentina':1,'Canada':1,'Brazil':1,'Mexico':3},
 'extra':{6:{'PS Mexico':1},8:{'Canada Sol':1},9:{'PS Mexico':1}}},
'webinars':{1:{'US':1,'Canada':1},3:{'US':1,'PS Spain':1,'PS US':1},4:{'Spain':298,'Canada':3,'PS Argentina':91,'PS Spain':14},
 5:{'Spain':16,'Argentina':112,'Canada':1,'PS Argentina':2,'PS Spain':227},6:{'Peru':1,'Canada':2,'PS Argentina':1,'Mexico':31,'PS Spain':84},
 7:{'Spain':34,'Argentina':77,'Canada':33,'PS Argentina':3,'Mexico':40,'PS Spain':144},8:{'Argentina':43,'Canada':1,'PS Chile':1},
 9:{'Argentina':180,'PS Argentina':69,'Mexico':3,'PS Spain':183},10:{'PS Spain':98}},
'email':{1:{'Portugal':1},2:{'Canada':1},3:{'Spain':14,'Peru':18,'Canada':13,'Mexico':1},5:{'US':5},6:{'Peru':1,'US':1,'Mexico':1},
 7:{'Peru':1,'Mexico':1},8:{'Canada':172,'PS Argentina':24},9:{'Mexico':1,'PS Spain':1},
 'extra':{9:{'US Insp':2}}},
'paid':{3:{'Spain':2},5:{'Spain':3,'Portugal':1},6:{'Spain':1,'PS Argentina':1},7:{'Portugal':1,'Canada':2},
 8:{'Spain':2,'Portugal':1,'Argentina':2,'Canada':1,'PS Argentina':1},9:{'Spain':8,'Portugal':1,'US':1,'PS Argentina':1}},
'social':{2:{'Peru':1},4:{'PS Argentina':2},5:{'PS Argentina':1},6:{'Peru':7},7:{'Mexico':1},9:{'Mexico':2,'Chile':1},
 'extra':{8:{'Canada Sol':1}}},
'steal':{9:{'US':441}},
'database':{1:{'Peru':4},2:{'Peru':2,'Canada':1},3:{'Peru':3},4:{'Spain':1107,'PS Spain':43},5:{'PS Argentina':1,'Mexico':18,'Chile':1},
 6:{'Peru':25,'Mexico':6},7:{'Spain':633,'Peru':5,'Argentina':1,'Mexico':491,'Chile':109},8:{'Peru':393,'Argentina':1,'Mexico':4},
 9:{'Spain':144,'Peru':4,'US':43,'Argentina':134,'Canada':3,'Mexico':4},10:{'Mexico':701}},
'ctool':{6:{'Spain':268},7:{'US':24},8:{'Spain':265}},
'inperson':{1:{'Peru':1,'Mexico':4},2:{'Canada':4,'PS Argentina':1,'Mexico':2},
 3:{'PS Brazil':1,'Argentina':1,'Canada':1,'PS Argentina':1,'Mexico':7,'PS Spain':6,'PS US':5},4:{'Canada':3,'Mexico':28,'PS Spain':2},
 5:{'Portugal':1,'US':12,'Canada':6,'Mexico':17,'PS Spain':5,'PS US':2},6:{'Peru':6,'US':1,'Canada':5,'PS Argentina':6,'Mexico':28,'PS Spain':6},
 7:{'Peru':15,'US':1,'PS Argentina':3,'Mexico':3,'PS Spain':2},8:{'Peru':6},9:{'PS Brazil':1,'Peru':3,'US Insp':2,'Mexico':1,'PS Spain':10},10:{'Peru':106}},
'bdr':{},
}
# Las entidades extra (Inspections de EE. UU., Solutions de Canadá, PS México) se
# consultaron aparte; sus conteos van en la clave 'extra' de cada origen.
for src in G:
    ex=G[src].pop('extra',None)
    if ex:
        for m,ents in ex.items():
            for e,n in ents.items(): G[src].setdefault(m,{})[e]=G[src].get(m,{}).get(e,0)+n

# Totales 2026 de HubSpot por origen para las entidades leídas (14 + las 3 extra).
CHECK={'website':543,'webinars':1797,'email':258,'paid':29,'social':16,'steal':441,'database':3881,'ctool':557,'inperson':315,'bdr':0}
gen={}
for src,months in G.items():
    tot=sum(n for m in months.values() for n in m.values())
    assert tot==CHECK[src],(src,tot)
    d={}
    for m,ents in months.items():
        for e,n in ents.items():
            d.setdefault(N[e],{})[f'm{m:02d}']=n
    gen[src]=d
rows=[]
for f in ['q_cu_a.txt','q_mix_b.txt','q_other.txt','q_event.txt']:
    d=json.load(open(f'{S}/{f}')); rows+=[json.loads(r['content'])['properties'] for r in d['results']]
assert len(rows)==696 and len({r['hs_object_id'] for r in rows})==696, len(rows)
# Entidades extra: deals en Qualified o más (pipeline de Inspections incluido),
# transcriptos de la consulta de filas (8 deals de MarComms desde 2025, 4 calificados).
I_PROP='1257105558'
rows+=[
  {'hs_object_id':'64538115394','pcu_office':'537 - Control Union (United States) Inc. (Inspections)','contact_origin_real':'Event','dealstage':I_PROP,'deal_currency_code':'EUR','hs_v2_date_entered_'+I_PROP:'1788299410007'},
  {'hs_object_id':'64550035342','pcu_office':'537 - Control Union (United States) Inc. (Inspections)','contact_origin_real':'Event','dealstage':I_PROP,'deal_currency_code':'EUR','hs_v2_date_entered_'+I_PROP:'1788299410288'},
  {'hs_object_id':'64534367233','pcu_office':'537 - Control Union (United States) Inc. (Inspections)','contact_origin_real':'Email Marketing','dealstage':I_PROP,'deal_currency_code':'EUR','hs_v2_date_entered_'+I_PROP:'1788299410121'},
  {'hs_object_id':'65428764853','pcu_office':'PS Mexico','contact_origin_real':'Website','dealstage':'1020243614','deal_currency_code':'USD','amount':'1000','hs_v2_date_entered_1003049530':'1790796268362','hs_v2_date_entered_1020243614':'1790796310511'},
]
ST=['1155730725','1155658300','1155730729','1003049530','1020243614','1003049534','1257105555','1257105558','1257105559']
WON={'1155730729','1003049534','1257105559'}
def mon(ms):
    dt=datetime.datetime.fromtimestamp(int(ms)/1000,datetime.timezone.utc)
    return dt.year,dt.month
mql=collections.defaultdict(lambda:[0,0.0,0]); won=collections.defaultdict(lambda:[0,0.0,0]); undated=collections.defaultdict(lambda:[0,0.0,0])
def add(b,k,r):
    b[k][0]+=1
    if r.get('amount'): b[k][1]+=float(r['amount'])
    else: b[k][2]+=1
for r in rows:
    src=SRC[r['contact_origin_real']]; ent=CODE[r['pcu_office']]; cur=r.get('deal_currency_code') or '?'
    first=min(int(r['hs_v2_date_entered_'+s]) for s in ST if r.get('hs_v2_date_entered_'+s))
    y,m=mon(first)
    if y==2026: add(mql,(src,ent,f'm{m:02d}',cur),r)
    if r['dealstage'] in WON:
        if r.get('closedate'):
            y,m=mon(r['closedate'])
            if y==2026: add(won,(src,ent,f'm{m:02d}',cur),r)
        else: add(undated,(src,ent,cur),r)
def fmtrows(b):
    out=[]
    for k in sorted(b):
        c,a,na=b[k]; a=round(a,2); a=int(a) if a==int(a) else a
        out.append('  '+json.dumps(list(k)+[c,a,na],ensure_ascii=False)+',')
    return '\n'.join(out)
def fmtgen():
    lines=[]
    for src in ['social','paid','website','email','webinars','steal','database','ctool','inperson','bdr']:
        ents=gen[src]
        inner=', '.join(f"'{e}': {{ "+', '.join(f'{m}: {n}' for m,n in sorted(v.items()))+' }' for e,v in sorted(ents.items()))
        lines.append(f'  {src}: {{ {inner} }},' if inner else f'  {src}: {{}},')
    return '\n'.join(lines)
print('mql deals',sum(v[0] for v in mql.values()),'won',sum(v[0] for v in won.values()),'undated',dict(undated))
open(OUT,'w').write(f'''// ════════════════════════════════════════════════════════════════
//  SEED — CRM (HubSpot). Deals originados por MarComms, por entidad de PCU
//  (país + unidad de negocio), origen y mes. GENERADO por
//  scripts/crm/build_crm_seed.py a partir de consultas de solo lectura a
//  HubSpot (portal 47081900) — no editar a mano.
//
//  Criterios (docs/DECISIONES.md §14):
//   · Origen = propiedad «Deal Source» (contact_origin_real). Los 5 pilares
//     son el número principal; STEAL, Database, Commercial Tool, InPerson
//     Event y BDR MarComms son «otros orígenes MarComms» y van aparte.
//   · Deals generados: todos los stages, por fecha de creación.
//   · MQL: deal cuyo stage actual es Qualified o uno más avanzado que no sea
//     LOST (Proposal Sent, WON), contado en el mes en que llegó por primera
//     vez a ese nivel. Solo deals creados desde el 1/1/2025.
//   · WON: por fecha de cierre.
//   · Importes en la moneda del deal, tal cual HubSpot: nunca se convierten
//     ni se suman monedas distintas. `sinImporte` = deals sin monto cargado.
// ════════════════════════════════════════════════════════════════

export const CRM_META = {{ asOf: '2026-10-06', year: 2026, createdSince: '2025-01-01' }};

// Entidades de HubSpot («PCU Entity») que se leen. Código → nombre visible.
export const CRM_ENTITIES = {{
  518: {{ name: 'Control Union España', nameEn: 'Control Union Spain', unit: 'cu' }},
  522: {{ name: 'Control Union Portugal', nameEn: 'Control Union Portugal', unit: 'cu' }},
  538: {{ name: 'Control Union Argentina', nameEn: 'Control Union Argentina', unit: 'cu' }},
  584: {{ name: 'Control Union Brasil', nameEn: 'Control Union Brazil', unit: 'cu' }},
  848: {{ name: 'Control Union Chile', nameEn: 'Control Union Chile', unit: 'cu' }},
  598: {{ name: 'Control Union México', nameEn: 'Control Union Mexico', unit: 'cu' }},
  536: {{ name: 'Control Union Perú', nameEn: 'Control Union Peru', unit: 'cu' }},
  537: {{ name: 'Control Union Estados Unidos', nameEn: 'Control Union United States', unit: 'cu' }},
  583: {{ name: 'Control Union Canadá', nameEn: 'Control Union Canada', unit: 'cu' }},
  765: {{ name: 'Peterson Solutions Iberoamérica (España)', nameEn: 'Peterson Solutions Ibero America (Spain)', unit: 'ps' }},
  592: {{ name: 'Peterson Solutions Argentina', nameEn: 'Peterson Solutions Argentina', unit: 'ps' }},
  442: {{ name: 'Peterson Solutions Brasil', nameEn: 'Peterson Solutions Brazil', unit: 'ps' }},
  767: {{ name: 'Peterson Solutions Estados Unidos', nameEn: 'Peterson Solutions United States', unit: 'ps' }},
  849: {{ name: 'Peterson Solutions Chile', nameEn: 'Peterson Solutions Chile', unit: 'ps' }},
  880: {{ name: 'Peterson Solutions México', nameEn: 'Peterson Solutions Mexico', unit: 'ps' }},
  '537i': {{ name: 'Control Union Estados Unidos (Inspections)', nameEn: 'Control Union United States (Inspections)', unit: 'cu' }},
  '583s': {{ name: 'Control Union Canadá (Solutions)', nameEn: 'Control Union Canada (Solutions)', unit: 'cu' }},
}};

// Orígenes («Deal Source» en HubSpot). `main` = uno de los 5 pilares.
export const CRM_SOURCES = [
  {{ id: 'social', hs: 'Social Media', main: true }},
  {{ id: 'paid', hs: 'Paid Media', main: true }},
  {{ id: 'website', hs: 'Website', main: true }},
  {{ id: 'email', hs: 'Email Marketing', main: true }},
  {{ id: 'webinars', hs: 'Webinar', main: true }},
  {{ id: 'steal', hs: 'STEAL', main: false }},
  {{ id: 'database', hs: 'Database', main: false }},
  {{ id: 'ctool', hs: 'Commercial Tool', main: false }},
  {{ id: 'inperson', hs: 'InPerson Event', main: false }},
  {{ id: 'bdr', hs: 'BDR MarComms', main: false }},
];

// Deals generados 2026 — origen → entidad → mes de creación → cantidad.
export const CRM_GENERATED = {{
{fmtgen()}
}};

// MQLs — [origen, entidad, mes en que llegó a Qualified o más, moneda, deals, importe, sinImporte]
export const CRM_MQL = [
{fmtrows(mql)}
];

// WON — [origen, entidad, mes de cierre, moneda, deals, importe, sinImporte]
export const CRM_WON = [
{fmtrows(won)}
];

// WON sin fecha de cierre en HubSpot: no se pueden ubicar en un mes y no se
// cuentan; se avisan en la vista. [origen, entidad, moneda, deals, importe, sinImporte]
export const CRM_WON_UNDATED = [
{fmtrows(undated)}
];
''')
