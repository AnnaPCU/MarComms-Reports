# Tooling — HubSpot → seed del CRM

Genera `src/data/crmSeed.js`: deals originados por MarComms (generados, MQL y
WON) por origen, entidad de PCU y mes. Criterios en `docs/DECISIONES.md` §14.

## De dónde salen los datos

Consultas de **solo lectura** a HubSpot (portal 47081900) por el conector de
HubSpot de Claude. No se crea ninguna vista ni se modifica nada en HubSpot.

Propiedades del deal que se usan:

| Propiedad | Para qué |
|-----------|----------|
| `contact_origin_real` («Deal Source») | Origen: los 5 pilares + otros orígenes MarComms |
| `pcu_office` («PCU Entity») | País + unidad de negocio |
| `createdate` | Mes de los deals generados |
| `dealstage` + `hs_v2_date_entered_<stage>` | MQL (primer ingreso a Qualified, Proposal o WON) |
| `closedate` | Mes de los WON |
| `amount` + `deal_currency_code` | Importes, por moneda, sin convertir |

Valores internos que no coinciden con la etiqueta: «InPerson Event» = `Event`,
«Sales Approach» = `Outreach`. «BDR MarComms» = `BDR MarComms`.

## Pasos

1. **Generados**: una consulta agregada por origen,
   `SELECT DATE_TRUNC(createdate,'MONTH'), pcu_office, COUNT(*) … GROUP BY …`
   filtrando las entidades leídas. Los conteos se transcriben en `G` del
   script; `CHECK` tiene el total de cada origen y el script falla si no
   cuadra.
2. **MQL / WON**: consultas de filas de los deals cuyo stage actual es
   Qualified, Proposal Sent o WON (pipelines Certifications y Peterson
   Solutions), creados desde el 1/1/2025. Como superan el tamaño de respuesta,
   el conector las guarda en archivo: copiarlas a una carpeta de trabajo como
   `q_cu_a.txt`, `q_mix_b.txt`, `q_other.txt` y `q_event.txt`. **No se
   commitean** (traen nombres de empresas); el seed solo guarda agregados.
3. Correr:

   ```bash
   python3 scripts/crm/build_crm_seed.py <carpeta_con_exports> src/data/crmSeed.js
   ```

4. Verificar: `npx vitest run` (los totales por origen están en
   `crmService.test.js`), `npm run build`, y la vista por cliente en ES y EN.
5. Antes de correrlo, actualizar la fecha `asOf` dentro del script (la escribe en `CRM_META`) y la fecha en los docs.

## Entidades

Las 14 entidades de Certifications y Peterson de los países con cliente, más
Control Union Estados Unidos (Inspections), Control Union Canadá
(Solutions) y Peterson Solutions México. El mapeo a clientes y cuentas está
en `src/constants/clients.js` (`crmEntities`) y `src/constants/crm.js`.
