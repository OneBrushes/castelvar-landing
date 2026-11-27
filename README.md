# Landing de Castelvar

Web pública (HTML estático) para captar clientes. Se publica en GitHub Pages desde un repositorio **público** que
solo contiene esta carpeta (aquí no hay nada secreto).

- **Home**: `index.html` con `assets/v2.css` y `assets/v2.js` (español, catalán, francés e inglés con `assets/i18n.js`; fuentes en `assets/fonts/`). La anterior está guardada en
  `home-anterior.html` (con `styles.css`, `app.js` e `i18n.js`, no se indexa). `/prueba-v2/` redirige a la portada.
- **Teléfono y WhatsApp**: se cambian en la app → Web → Ajustes → Contacto de la web (la web los lee al cargar; tarda hasta 1 minuto). Ahí también se activa o desactiva el botón flotante de WhatsApp.
- `config.js`: dirección de la app y **clave del formulario** (app → Ajustes → Formulario web); teléfono, email y WhatsApp de respaldo.
- `privacidad.html` y `aviso-legal.html`: rellenar los datos marcados en naranja (razón social, NIF, dirección…).
- El formulario envía a `POST /api/leads` de la app. Cada solicitud aparece en **Ventas → Solicitudes web**.
- La app solo acepta envíos desde las webs de `LEADS_ALLOWED_ORIGINS` (`wrangler.jsonc`). Si cambias de dominio, añádelo ahí.
- Campañas: los enlaces con `?utm_source=…&utm_medium=…&utm_campaign=…` (o `gclid` de Google Ads) quedan guardados en cada solicitud.

- **Idiomas** (español, catalán, francés, inglés): `assets/i18n.js`. Se elige solo según el idioma del dispositivo y se
  puede cambiar en el pie (se recuerda en el navegador). Enlaces directos: `?lang=ca`, `?lang=fr`, `?lang=en` (útil en
  campañas). El español está en `index.html`; si cambias o añades un texto, márcalo con `data-i18n="clave"` y añade la
  clave en las otras tres lenguas de `i18n.js` (si falta, se muestra en español). Los valores que llegan a la app (uso,
  plazo, provincia) siguen en español; si el visitante usa otro idioma, el mensaje de la solicitud empieza por
  `[Idioma de la web: …]`. Las páginas legales están solo en español.

- **Visitas y mapa de calor**: `assets/medir.js` mide de forma anónima y sin cookies (se ve en la app → Web). Las zonas del mapa
  son los `id` de las secciones (y `data-zone`): si cambias un id, los clics anteriores de esa zona dejan de pintarse.
- **Píxeles** (Meta, Google, TikTok…): se activan en la app → Web → Píxeles, no aquí. Con alguno activo aparece el aviso de cookies
  y solo se cargan si el visitante los acepta. Política en `cookies.html`.
- **Iconos**: SVG de línea en `assets/icons/` (trazo 1,5, color heredado). En el HTML van en línea con la clase `i`.

Publicar cambios: `npm run landing:publish` (desde la raíz del proyecto).
