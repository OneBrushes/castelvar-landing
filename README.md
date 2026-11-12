# Landing de Castelvar

Web pública (HTML estático) para captar clientes. Se publica en GitHub Pages desde un repositorio **público** que
solo contiene esta carpeta (aquí no hay nada secreto).

- `config.js`: dirección de la app y **clave del formulario** (app → Ajustes → Formulario web), teléfono, email y WhatsApp.
- `privacidad.html` y `aviso-legal.html`: rellenar los datos marcados en naranja (razón social, NIF, dirección…).
- El formulario envía a `POST /api/leads` de la app. Cada solicitud aparece en **Ventas → Solicitudes web**.
- La app solo acepta envíos desde las webs de `LEADS_ALLOWED_ORIGINS` (`wrangler.jsonc`). Si cambias de dominio, añádelo ahí.
- Campañas: los enlaces con `?utm_source=…&utm_medium=…&utm_campaign=…` (o `gclid` de Google Ads) quedan guardados en cada solicitud.

Publicar cambios: `npm run landing:publish` (desde la raíz del proyecto).
