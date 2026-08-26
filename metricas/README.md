# 📥 Carpeta de ingesta de métricas

Acá el equipo deja los **exports crudos de cada plataforma** para que Claude
los procese y actualice los reportes. Cada pilar tiene su subcarpeta y su
responsable:

| Carpeta | Pilar | Fuentes | Responsable |
|---------|-------|---------|-------------|
| `social-media/` | Social Media | LinkedIn Analytics | Persona de Social |
| `email-marketing/` | Email Marketing | Mailchimp, Apollo | Persona de Email/Webinars |
| `webinars/` | Webinars | Livestorm | Persona de Email/Webinars |

> Paid Media y Website **no usan esta carpeta**: Tomás sigue pasando esos
> archivos directamente por su conversación de Claude.

## Reglas generales

1. **Una carpeta por mes** dentro del pilar, con formato `AAAA-MM`
   (ej. `2026-08` para agosto 2026). El mes debe estar **completo**
   (del 1 al último día) antes de pedir el procesamiento.
2. **Archivos crudos, tal como los exporta la plataforma.** No editar,
   consolidar ni traducir nada — el tooling se encarga. Solo respetar la
   estructura/prefijos que indica el README de cada pilar.
3. **No tocar `_procesados/`.** Cuando Claude ingesta un mes, mueve la
   carpeta ahí como archivo histórico. Si hay que corregir algo de un mes ya
   procesado, avisarle a Claude en vez de editar a mano.
4. **Nunca inventar ni estimar datos.** Solo exports reales; si un mes no
   tiene datos, no se crea la carpeta (regla de honestidad del proyecto).

## Cómo subir los archivos

- **Opción A — GitHub web (recomendada):** entrar al repo
  `annapcu/marcomms-reports`, navegar a `metricas/<pilar>/`, y usar
  *Add file → Upload files* arrastrando la carpeta del mes. Confirmar el
  commit directo a `main` (son solo datos, no código).
- **Opción B — carpeta OneDrive/SharePoint:** dejar la carpeta del mes en la
  copia sincronizada del proyecto y avisarle a Tomás para que la suba.
- **Opción C — por conversación:** adjuntar los archivos en una sesión de
  Claude Code y pedirle que los aloje en la carpeta correspondiente.

## Cómo pedir el procesamiento

Abrir una sesión de Claude Code sobre este repo y decir, por ejemplo:

> «Procesá las métricas nuevas de Social Media»

Claude detecta las carpetas de mes que todavía no están en `_procesados/`,
corre el tooling del pilar, verifica el resultado, actualiza los reportes,
deploya y archiva la carpeta. Cada pedido en **su propia sesión** (no mezclar
pedidos de distintas personas en una misma conversación).
