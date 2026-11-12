// Configuración de la landing. Es pública (cualquiera puede verla): aquí no va nada secreto.
// La clave del formulario solo identifica a la empresa; se cambia en la app: Ajustes → Formulario web.
window.CASTELVAR = {
  // Dirección de la app que recibe las solicitudes
  apiUrl: "https://app.castelvar.workers.dev/api/leads",
  // Ajustes → Formulario web → "Clave del formulario"
  formKey: "PEGAR_AQUI_LA_CLAVE",
  // Datos de contacto que se muestran en la web (déjalos vacíos para ocultarlos)
  email: "",
  phone: "", // p. ej. "+34 600 000 000"
  whatsapp: "", // solo números con prefijo, p. ej. "34600000000"
};
