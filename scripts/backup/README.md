# Backup de reportes — `backups/`

La carpeta `backups/` (raíz del proyecto) guarda TODOS los reportes
descargables de la web en HTML, listos para abrir o reenviar sin entrar
al sitio. Como el proyecto vive en OneDrive, el backup queda sincronizado
automáticamente.

## Estructura

```
backups/
  Social Media/<Cuenta>/<reporte>__interno.html · __externo.html
  Social Media/<Cuenta>/<País>/...   ← cuentas segmentadas (Latam, North America)
  Paid Media/<Cuenta>/...
  Website/<Cuenta>/...
```

- Cada período con datos genera **dos archivos**: uso interno (completo)
  y uso externo (sin "Próximos Pasos" ni secciones internas).
- Los HTML son autónomos e interactivos offline (campañas del GEO,
  toggles ES/EN). En Social cada archivo queda FIJO en su selección:
  la cuenta completa por un lado y cada país como reporte propio.
- Solo se exportan períodos **con datos** (regla de honestidad); la
  comparativa multi-cuenta de Social se guarda una sola vez.
- Email y Webinars se suman solos cuando tengan datos (el script recorre
  lo que la web ofrezca).

## Cómo regenerarlo (después de cargar un mes nuevo)

```bash
npm run build
npm run preview -- --port 4300 &
node scripts/backup/export_all.mjs http://localhost:4300 backups
```

El script pisa los archivos existentes con la versión actual. Commitear
y pushear `backups/` para que quede respaldado también en GitHub.
