(function () {
  "use strict";
  var cfg = window.CASTELVAR || {};
  var loadedAt = Date.now();
  document.getElementById("year").textContent = String(new Date().getFullYear());

  // Contacto directo (solo si está configurado)
  var direct = document.getElementById("contact-direct");
  var items = [];
  if (cfg.phone) items.push('<li><a href="tel:' + cfg.phone.replace(/\s/g, "") + '">📞 ' + esc(cfg.phone) + "</a></li>");
  if (cfg.whatsapp) items.push('<li><a href="https://wa.me/' + cfg.whatsapp.replace(/\D/g, "") + '" target="_blank" rel="noopener">💬 WhatsApp</a></li>');
  if (cfg.email) items.push('<li><a href="mailto:' + cfg.email + '">✉️ ' + esc(cfg.email) + "</a></li>");
  if (items.length) {
    direct.innerHTML = items.join("");
    direct.hidden = false;
  }

  // Parámetros de campaña (Google Ads, redes…) para saber de dónde llegan los clientes
  var params = new URLSearchParams(location.search);
  var utm = {};
  ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) {
    var v = params.get(k) || sessionStorageGet(k);
    if (v) {
      utm[k] = v.slice(0, 150);
      sessionStorageSet(k, v);
    }
  });
  if (!utm.utm_source && params.get("gclid")) utm.utm_source = "google_ads";

  var form = document.getElementById("lead-form");
  var status = form.querySelector(".form-status");
  var button = form.querySelector("button[type=submit]");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    var data = Object.fromEntries(new FormData(form).entries());
    // Validación rápida en el navegador (el servidor vuelve a validar)
    var errors = {};
    if (!data.name || data.name.trim().length < 2) errors.name = "Indica tu nombre";
    if (!data.email && !data.phone) errors.email = "Indica un email o un teléfono";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Email no válido";
    if (!form.consent.checked) errors.consent = "Debes aceptar la política de privacidad";
    if (Object.keys(errors).length) return showErrors(errors);

    if (!cfg.apiUrl || !cfg.formKey || cfg.formKey.indexOf("PEGAR") === 0) {
      return fail("El formulario aún no está configurado. Escríbenos o llámanos, por favor.");
    }
    var payload = Object.assign({}, data, utm, {
      key: cfg.formKey,
      consent: form.consent.checked ? "on" : "",
      t: loadedAt,
      page: location.href.split("#")[0].slice(0, 290),
    });

    button.disabled = true;
    status.className = "form-status";
    status.textContent = "Enviando…";
    fetch(cfg.apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) {
        return r.json().catch(function () {
          return { ok: r.ok };
        });
      })
      .then(function (res) {
        if (res && res.ok) {
          form.hidden = true;
          var thanks = document.getElementById("thanks");
          thanks.hidden = false;
          thanks.focus();
          if (typeof window.gtag === "function") window.gtag("event", "generate_lead");
          return;
        }
        if (res && res.fields) showErrors(res.fields);
        fail((res && res.error) || "No se ha podido enviar. Inténtalo de nuevo.");
      })
      .catch(function () {
        fail("No hay conexión. Revisa tu internet e inténtalo de nuevo.");
      })
      .finally(function () {
        button.disabled = false;
      });
  });

  function fail(msg) {
    status.className = "form-status error";
    status.textContent = msg;
  }
  function showErrors(errors) {
    var first = null;
    Object.keys(errors).forEach(function (k) {
      var el = form.elements[k];
      if (el && el.classList) {
        el.classList.add("invalid");
        el.setAttribute("aria-invalid", "true");
        first = first || el;
      }
    });
    fail(errors[Object.keys(errors)[0]]);
    if (first) first.focus();
  }
  function clearErrors() {
    form.querySelectorAll(".invalid").forEach(function (el) {
      el.classList.remove("invalid");
      el.removeAttribute("aria-invalid");
    });
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function sessionStorageGet(k) {
    try {
      return sessionStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }
  function sessionStorageSet(k, v) {
    try {
      sessionStorage.setItem(k, v);
    } catch (e) {
      /* sin almacenamiento: no pasa nada */
    }
  }
})();
