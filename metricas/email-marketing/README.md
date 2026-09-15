# Email Marketing — drops de Mailchimp

Carpeta de ingesta para los exports de **Mailchimp** (y Apollo cuando haya).
El tooling que los procesa es `scripts/mailchimp-to-seed.mjs` (y, para la
campaña de un webinar, también `scripts/webinars/build_event.py`).

## Qué exportar (formato real, validado con las campañas EUDR y Plastic Packaging)

Por **cada envío** de la campaña, el export de **destinatarios** de Mailchimp
(*Campaign report → Export → members*): un CSV con una fila por destinatario y
las columnas `email, first_name, last_name, opens, clicks, …, company, country`.
Mailchimp lo nombra `members_<nombre de la campaña>_sent_<fecha>.csv`: **no
renombrarlo**. Las filas del CSV son los enviados; `opens`/`clicks` son por
destinatario (el tooling calcula aperturas y clics únicos y las tasas).

Un reenvío (Mailchimp los llama *copy*) es un envío más: subirlo también.

## Estructura esperada

```
email-marketing/
└── 2026-09/                                   ← una carpeta por mes (AAAA-MM)
    ├── members_<campaña>_EMAIL_1_..._sent_....csv
    ├── members_<campaña>_EMAIL_2_..._sent_....csv
    └── …
```

Si los archivos se suben sueltos (sin carpeta de mes), Claude los procesa igual
y los archiva en `_procesados/AAAA-MM/`.

## Qué hace Claude al procesar

1. Arma un `config.json` con la cuenta, el mes y el orden/nombre de los envíos.
2. `node scripts/mailchimp-to-seed.mjs config.json --no-all-leads` → snippet
   para `src/data/emailSeed.js` (métricas por envío, totales, comparativa y hot
   leads = contactos con clic).
3. Verifica en el navegador, deploya y archiva la carpeta.

Pedido típico: **«Procesá las métricas nuevas de Email Marketing»**.
