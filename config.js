// Configuración de la landing. Es PÚBLICA (cualquiera puede verla): aquí no va nada secreto.
// Todo lo que dejes vacío se oculta en la web. No pongas cifras, garantías u opiniones que no sean reales.
window.CASTELVAR = {
  // Dónde se envían las solicitudes (la app) y clave del formulario (app → Ajustes → Formulario web)
  apiUrl: "https://app.castelvar.com/api/leads",
  formKey: "1dcfd98e93821d1dfda43814",

  // Contacto (se muestra arriba, en el formulario y en el pie)
  phone: "", // "+34 600 000 000"
  whatsapp: "", // solo números con prefijo: "34600000000"
  email: "", // "info@castelvar.es"
  // Los textos pueden ser una cadena (igual en todos los idiomas) o { es, ca, fr, en, de } (lo mismo en warranty,
  // stats, testimonials y projects). Si falta un idioma se usa el español.
  hours: {
    es: "Lunes a viernes, 8:00–18:00",
    ca: "De dilluns a divendres, 8:00–18:00",
    fr: "Du lundi au vendredi, 8h–18h",
    en: "Monday to Friday, 8:00–18:00",
    de: "Montag bis Freitag, 8:00–18:00 Uhr",
  },
  // plazo de respuesta que os comprometéis a cumplir
  responseTime: { es: "24–48 h laborables", ca: "24–48 h feineres", fr: "24 à 48 h ouvrées", en: "1–2 working days", de: "1–2 Werktagen" },

  // Datos legales (aviso legal, privacidad y pie). Obligatorios antes de hacer publicidad.
  company: {
    legalName: "", // "Castelvar Ingeniería SL"
    nif: "",
    address: "", // "C/ …, 08001 Barcelona"
    registry: "", // "Registro Mercantil de Barcelona, tomo …, folio …, hoja …"
  },

  // Pruebas de confianza: SOLO datos reales. Si una lista está vacía, su sección no aparece.
  warranty: "", // p. ej. "Hasta 10 años en la estructura"
  stats: [
    // { value: "+30", label: "carpas montadas" },
  ],
  testimonials: [
    // { text: "…", name: "Nombre Apellido", place: "Vic (Barcelona)", project: "Carpa 15×30 para paja" },
  ],
  // Fotos de obras propias (pon los ficheros en la carpeta img/). La primera también se usa en la portada.
  projects: [
    // { img: "img/obra-vic.jpg", title: "Almacén de paja 15×30", place: "Vic (Barcelona)", year: 2026 },
  ],
};
