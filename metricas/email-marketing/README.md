# Email Marketing — drops de Mailchimp y Apollo

Carpeta de ingesta para los exports de **Mailchimp** y **Apollo**.

> ⚠️ Este pilar todavía no tiene pipeline: se construye con el **primer drop
> real**. Cuando subas los primeros archivos, Claude arma el parser y la vista
> a partir de lo que las plataformas realmente exportan — por eso es clave
> subir los archivos **crudos, sin editar**.

## Estructura esperada

```
email-marketing/
└── 2026-08/                        ← una carpeta por mes (AAAA-MM)
    ├── mailchimp_<lo-que-sea>.csv  ← prefijo "mailchimp_"
    ├── mailchimp_<otra-cosa>.csv
    └── apollo_<lo-que-sea>.csv     ← prefijo "apollo_"
```

- **Prefijo obligatorio** según la fuente: `mailchimp_` o `apollo_`.
  El resto del nombre es libre (dejar el nombre original del export está bien:
  `mailchimp_Reporte de campaña Agosto.csv`).
- Formato preferido: **CSV**; si la plataforma solo da Excel, subir el `.xlsx`.
- Qué exportar (sugerido): de Mailchimp, el reporte de campañas del mes
  (aperturas, clics, envíos, bajas); de Apollo, el reporte de secuencias/
  emails del mes. Si no estás segura de qué export sirve, subí lo que la
  plataforma ofrezca y Claude te dice si falta algo.

Pedido típico: **«Procesá las métricas nuevas de Email Marketing»**.
