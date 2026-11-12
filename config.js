// Configuración de la landing. Es PÚBLICA (cualquiera puede verla): aquí no va nada secreto.
// Todo lo que dejes vacío se oculta en la web. No pongas cifras, garantías u opiniones que no sean reales.
window.CASTELVAR = {
  // Dónde se envían las solicitudes (la app) y clave del formulario (app → Ajustes → Formulario web)
  apiUrl: "https://app.castelvar.workers.dev/api/leads",
  formKey: "d2a1e30fe733c50eb23db9cc",

  // Contacto (se muestra arriba, en el formulario y en el pie)
  phone: "", // "+34 600 000 000"
  whatsapp: "", // solo números con prefijo: "34600000000"
  email: "", // "info@castelvar.es"
  hours: "Lunes a viernes, 8:00–18:00",
  responseTime: "24–48 h laborables", // plazo de respuesta que os comprometéis a cumplir

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
