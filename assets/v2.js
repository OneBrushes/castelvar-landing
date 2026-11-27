// Home de Castelvar (antes /prueba-v2). El formulario funciona igual que en la home (copiado de assets/app.js):
// mismos campos, misma validación, mismo envío a la app y mismas campañas (utm / gclid).
// Cambia solo la presentación: transición entre pasos, barra móvil y aparición de 3 bloques al hacer scroll.
(function () {
  "use strict";
  var cfg = window.CASTELVAR || {};
  var loadedAt = Date.now();
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("#year").textContent = String(new Date().getFullYear());

  // Textos: los da assets/i18n.js (español, catalán, francés e inglés; idioma del móvil o el elegido en el selector).
  // Esto es solo el respaldo en español por si i18n.js no llegara a cargar.
  var ES = {
    "js.waMsg": "Hola, me interesa una carpa industrial. ¿Podéis darme información?",
    "js.respond": "te respondemos en {t}",
    "js.thanksTime": "en {t}",
    "js.footerForm": "Formulario de presupuesto",
    "js.region": "Barcelona · Cataluña",
    "js.badSize": "Medida no válida",
    "js.needName": "Indica tu nombre",
    "js.needContact": "Indica un teléfono o un email",
    "js.badEmail": "Email no válido",
    "js.needConsent": "Debes aceptar la política de privacidad",
    "js.notConfigured": "El formulario aún no está configurado. Llámanos o escríbenos, por favor.",
    "js.sending": "Enviando…",
    "js.sendFail": "No se ha podido enviar. Inténtalo de nuevo.",
    "js.offline": "No hay conexión. Revisa tu internet e inténtalo de nuevo.",
    "js.urgent": "¿Urgente?",
  };
  // Aviso de cookies (lo pinta assets/medir.js con window.I18N)
  Object.assign(ES, {
    "ck.title": "Cookies",
    "ck.text": "Usamos cookies necesarias y, si nos dejas, otras de analítica y de publicidad para medir nuestras campañas. Puedes aceptarlas, rechazarlas o elegir.",
    "ck.accept": "Aceptar todas",
    "ck.reject": "Rechazar",
    "ck.config": "Configurar",
    "ck.save": "Guardar selección",
    "ck.necessary": "Necesarias",
    "ck.necessaryDesc": "Recuerdan tu elección sobre las cookies.",
    "ck.always": "Siempre activas",
    "ck.analytics": "Analítica",
    "ck.analyticsDesc": "Nos ayudan a entender cómo se usa la web ({list}).",
    "ck.ads": "Publicidad",
    "ck.adsDesc": "Miden nuestras campañas y permiten mostrarte anuncios relevantes ({list}).",
    "ck.more": "Más información",
  });
  if (!window.I18N) {
    window.I18N = {
      t: function (k, vars) {
        var s = ES[k] || k;
        if (vars) s = s.replace(/\{(\w+)\}/g, function (_, v) { return vars[v] == null ? "" : vars[v]; });
        return s;
      },
      pick: function (v) { return !v ? "" : typeof v === "string" ? v : v.es || ""; },
      lang: function () { return "es"; },
      onChange: function () {},
    };
  }
  var i18n = window.I18N;
  var t = i18n.t;
  var pick = i18n.pick;

  // ---------- Contacto: teléfono y WhatsApp ----------
  // Se cambian en la app (Web → Ajustes → Contacto de la web) y llegan por /api/web/config.
  // Mientras responde la app (o si falla) se usan los de config.js. Lo vacío no se muestra.
  var phone = "";
  var tel = "";
  var wa = "";
  var waUrl = "";
  var email = (cfg.email || "").trim();
  var wf = $("#wa-float");
  var waButtonOn;

  function applyContact(newPhone, newWa, waButton) {
    waButtonOn = waButton;
    phone = (newPhone || "").trim();
    tel = phone.replace(/[^\d+]/g, "");
    wa = (newWa || "").replace(/\D/g, "");
    waUrl = wa ? "https://wa.me/" + wa + "?text=" + encodeURIComponent(t("js.waMsg")) : "";
    var hp = $("#header-phone");
    hp.hidden = !phone;
    if (phone) {
      hp.href = "tel:" + tel;
      hp.textContent = phone;
    }
    // WhatsApp: botón flotante abajo a la derecha, solo si hay número y no está desactivado desde la app
    wf.hidden = !waUrl || waButton === false;
    if (waUrl) wf.href = waUrl;
    renderFooterContact();
  }
  function renderFooterContact() {
    var fc = [];
    if (phone) fc.push('<li><a href="tel:' + tel + '">' + esc(phone) + "</a></li>");
    if (wa) fc.push('<li><a href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a></li>');
    if (email) fc.push('<li><a href="mailto:' + esc(email) + '">' + esc(email) + "</a></li>");
    var hours = pick(cfg.hours);
    if (hours) fc.push("<li>" + esc(hours) + "</li>");
    $("#footer-contact").innerHTML = fc.join("") || '<li><a href="#presupuesto">' + esc(t("js.footerForm")) + "</a></li>";
  }
  applyContact(cfg.phone, cfg.whatsapp);
  try {
    if (cfg.apiUrl && /^[a-f0-9]{12,64}$/i.test(cfg.formKey || "")) {
      fetch(new URL(cfg.apiUrl).origin + "/api/web/config?k=" + encodeURIComponent(cfg.formKey), { credentials: "omit" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (res) {
          var c = res && res.contact;
          if (c) applyContact(c.phone || cfg.phone, c.whatsapp || cfg.whatsapp, c.whatsappButton);
        })
        .catch(function () {});
    }
  } catch (e) {}
  // Lo que se pinta desde aquí se vuelve a pintar al cambiar de idioma
  function renderTexts() {
    var rt = pick(cfg.responseTime);
    if (rt) {
      $("#response-time").textContent = t("js.respond", { t: rt });
      $("#thanks-time").textContent = t("js.thanksTime", { t: rt });
    }
    var co = cfg.company || {};
    $("#footer-company").innerHTML =
      [co.legalName, co.nif && "NIF " + co.nif, co.address]
        .filter(Boolean)
        .map(function (x) { return "<li>" + esc(x) + "</li>"; })
        .join("") || "<li>" + esc(t("js.region")) + "</li>";
  }
  renderTexts();
  i18n.onChange(function () {
    renderTexts();
    applyContact(phone, wa, waButtonOn); // el mensaje de WhatsApp va en el idioma de la web
    // un error mostrado en el idioma anterior se quita (se vuelve a validar al continuar)
    if (status.className.indexOf("error") >= 0) clearErrors();
  });

  // ---------- Aparición al hacer scroll: foto de ganadería, «Quiénes somos» y los pasos ----------
  var revealEls = document.querySelectorAll(".reveal, .reveal-group");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ---------- Barra superior flotante y barra fija (móvil): aparece al bajar de la primera pantalla, sin tapar el formulario ----------
  var mobileBar = $("#mobile-bar");
  var card = $("#presupuesto");
  var ticking = false;
  var header = $("#cabecera");
  function updateBar() {
    ticking = false;
    // la barra superior se despega y flota en cuanto se baja un poco
    // con margen (entra a 24 px, sale a 8 px) para que no parpadee al rozar el límite
    var y = window.scrollY;
    if (y > 24) header.classList.add("is-floating");
    else if (y < 8) header.classList.remove("is-floating");
    var r = card.getBoundingClientRect();
    var formInView = r.bottom > 80 && r.top < window.innerHeight - 80;
    var pastFirstScreen = window.scrollY > window.innerHeight * 0.9;
    mobileBar.classList.toggle("show", pastFirstScreen && !formInView);
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateBar);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateBar();

  // ---------- Preguntas frecuentes: se despliegan y se pliegan con una animación corta ----------
  document.querySelectorAll(".faq details").forEach(function (d) {
    var sum = d.querySelector("summary");
    var a = d.querySelector(".faq-a");
    if (!a.animate) return;
    sum.addEventListener("click", function (e) {
      if (reduced) return;
      e.preventDefault();
      if (d.dataset.anim) return;
      d.dataset.anim = "1";
      var anim;
      if (!d.open) {
        d.open = true;
        var h = a.scrollHeight;
        anim = a.animate(
          [{ height: "0px", opacity: 0, transform: "translateY(-6px)" }, { height: h + "px", opacity: 1, transform: "none" }],
          { duration: 320, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
        );
        anim.onfinish = function () { delete d.dataset.anim; };
      } else {
        d.classList.add("closing");
        anim = a.animate(
          [{ height: a.scrollHeight + "px", opacity: 1 }, { height: "0px", opacity: 0 }],
          { duration: 240, easing: "ease-in" }
        );
        anim.onfinish = function () {
          d.open = false;
          d.classList.remove("closing");
          delete d.dataset.anim;
        };
      }
    });
  });

  // ---------- De dónde viene la visita (se guarda con la solicitud) ----------
  // Prioridad: utm del enlace > identificador de clic del anuncio > web de procedencia.
  // Se apunta la primera vez de la visita (sessionStorage) para no perderlo al navegar por la página.
  var params = new URLSearchParams(location.search);
  var utm = {};
  ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) {
    var v = params.get(k) || store(k);
    if (v) {
      utm[k] = v.slice(0, 150);
      store(k, v);
    }
  });
  if (!utm.utm_source) {
    var CLICK_IDS = [
      ["gclid", "google_ads"], // Google Ads
      ["gbraid", "google_ads"],
      ["wbraid", "google_ads"],
      ["fbclid", "meta"], // Facebook e Instagram (anuncios y enlaces compartidos)
      ["ttclid", "tiktok"],
      ["msclkid", "bing"],
      ["li_fat_id", "linkedin"],
    ];
    for (var i = 0; i < CLICK_IDS.length; i++) {
      if (params.get(CLICK_IDS[i][0])) {
        store("utm_source", CLICK_IDS[i][1]);
        store("utm_medium", "cpc");
        break;
      }
    }
    if (!store("utm_source")) {
      var ref = "";
      try {
        ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
      } catch (e) {}
      if (ref && ref !== location.hostname.replace(/^www\./, "")) {
        var REFS = [
          [/(^|\.)(facebook\.com|fb\.com|fb\.me|instagram\.com|messenger\.com)$/, "meta", "social"],
          [/(^|\.)tiktok\.com$/, "tiktok", "social"],
          [/(^|\.)(linkedin\.com|lnkd\.in)$/, "linkedin", "social"],
          [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube", "social"],
          [/(^|\.)(t\.co|twitter\.com|x\.com)$/, "x", "social"],
          [/(^|\.)google\./, "google", "organico"],
          [/(^|\.)bing\.com$/, "bing", "organico"],
        ];
        var found = null;
        for (var j = 0; j < REFS.length; j++) if (REFS[j][0].test(ref)) found = REFS[j];
        store("utm_source", found ? found[1] : ref.slice(0, 100));
        store("utm_medium", found ? found[2] : "referido");
      }
    }
    if (store("utm_source")) {
      utm.utm_source = store("utm_source");
      if (store("utm_medium")) utm.utm_medium = store("utm_medium");
    }
  }

  // ---------- Formulario por pasos (igual que la home) ----------
  var form = $("#lead-form");
  var steps = Array.prototype.slice.call(form.querySelectorAll(".step"));
  var status = $(".form-status", form);
  var bar = $("#progress-bar");
  var current = 1;

  function show(n) {
    var dir = n > current ? "in-next" : "in-prev";
    current = n;
    steps.forEach(function (s) {
      var on = Number(s.dataset.step) === n;
      s.hidden = !on;
      s.classList.remove("in-next", "in-prev");
      if (on && !reduced) {
        void s.offsetWidth; // reinicia la animación
        s.classList.add(dir);
      }
    });
    // paso 1 vacío, paso 2 a la mitad, último paso lleno
    bar.style.transform = "scaleX(" + (n - 1) / (steps.length - 1) + ")";
    status.textContent = "";
    status.className = "form-status";
    var first = $('[data-step="' + n + '"] input:not([type=radio]):not(.hp input), [data-step="' + n + '"] select', form);
    if (n > 1 && first && window.innerWidth > 640) first.focus({ preventScroll: true });
    // En el móvil, al cambiar de paso, el formulario vuelve a quedar arriba de la pantalla
    if (window.innerWidth <= 640) {
      if (card.getBoundingClientRect().top < 56) card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  }
  form.addEventListener("click", function (e) {
    var el = e.target;
    if (el.matches("[data-next]")) {
      if (validate(current)) show(current + 1);
    } else if (el.matches("[data-prev]")) {
      show(current - 1);
    } else if (el.matches("[data-size]")) {
      var v = el.dataset.size.split("x");
      form.width.value = v[0] || "";
      form.length.value = v[1] || "";
    }
  });
  var started = false;
  function formStarted() {
    if (started) return;
    started = true;
    document.dispatchEvent(new CustomEvent("castelvar:form-start"));
  }
  form.addEventListener("input", formStarted);
  form.addEventListener("change", formStarted);
  // Elegir el uso pasa directamente al paso 2
  form.addEventListener("change", function (e) {
    if (e.target.name === "use_case" && current === 1) setTimeout(function () { show(2); }, 180);
  });
  // Los botones «Presupuesto para…» preseleccionan el uso
  document.querySelectorAll("[data-usecase]").forEach(function (a) {
    a.addEventListener("click", function () {
      var r = form.querySelector('input[name=use_case][value="' + a.dataset.usecase + '"]');
      if (r) {
        r.checked = true;
        if (current === 1) show(2);
      }
    });
  });

  function validate(step) {
    clearErrors();
    var errors = {};
    if (step === 2) {
      ["width", "length"].forEach(function (k) {
        var v = form[k].value.trim().replace(",", ".");
        if (v && (isNaN(Number(v)) || Number(v) <= 0 || Number(v) > 500)) errors[k] = t("js.badSize");
      });
    }
    if (step === 3) {
      if (form.name.value.trim().length < 2) errors.name = t("js.needName");
      if (!form.email.value.trim() && !form.phone.value.trim()) errors.phone = t("js.needContact");
      if (form.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())) errors.email = t("js.badEmail");
      if (!form.consent.checked) errors.consent = t("js.needConsent");
    }
    if (Object.keys(errors).length) {
      showErrors(errors);
      return false;
    }
    return true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (current !== 3) return validate(current) && show(current + 1);
    if (!validate(3)) return;
    if (!cfg.apiUrl || !cfg.formKey || cfg.formKey.indexOf("PEGAR") === 0) {
      return fail(t("js.notConfigured"));
    }
    var data = Object.fromEntries(new FormData(form).entries());
    var payload = Object.assign({}, data, utm, {
      key: cfg.formKey,
      consent: form.consent.checked ? "on" : "",
      t: loadedAt,
      page: location.href.split("#")[0].slice(0, 290),
    });
    // Si la web se ha visto en otro idioma, se avisa en el mensaje para contestar en ese idioma
    var langNames = { ca: "Català", fr: "Français", en: "English" };
    if (langNames[i18n.lang()]) {
      payload.message = ("[Idioma de la web: " + langNames[i18n.lang()] + "]\n" + (payload.message || "")).trim().slice(0, 3000);
    }
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    status.className = "form-status";
    status.textContent = t("js.sending");
    fetch(cfg.apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) {
        return r.json().catch(function () {
          return { ok: r.ok };
        });
      })
      .then(function (res) {
        if (res && res.ok) {
          form.hidden = true;
          bar.style.transform = "scaleX(1)";
          var direct = [];
          if (phone) direct.push(esc(t("js.urgent")) + ' <a href="tel:' + tel + '">' + esc(phone) + "</a>");
          if (wa) direct.push('<a href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a>');
          $("#thanks-direct").innerHTML = direct.join(" · ");
          var th = $("#thanks");
          th.hidden = false;
          th.focus();
          document.dispatchEvent(new CustomEvent("castelvar:lead"));
          return;
        }
        if (res && res.fields) {
          var stepOf = { width: 2, length: 2, city: 2, province: 2, timeframe: 2 };
          var k = Object.keys(res.fields)[0];
          if (stepOf[k]) show(stepOf[k]);
          showErrors(localFields(res.fields));
          return;
        }
        fail((i18n.lang() === "es" && res && res.error) || t("js.sendFail"));
      })
      .catch(function () {
        fail(t("js.offline"));
      })
      .finally(function () {
        btn.disabled = false;
      });
  });

  // Errores por campo que devuelve el servidor (en español) → idioma de la web
  function localFields(fields) {
    if (i18n.lang() === "es") return fields;
    var msg = { name: "js.needName", email: "js.badEmail", phone: "js.badPhone", consent: "js.needConsent", width: "js.badSize", length: "js.badSize" };
    var out = {};
    Object.keys(fields).forEach(function (k) {
      out[k] = msg[k] ? t(msg[k]) : t("js.sendFail");
    });
    return out;
  }
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
    status.textContent = "";
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function store(k, v) {
    try {
      if (v === undefined) return sessionStorage.getItem(k);
      sessionStorage.setItem(k, v);
    } catch (e) {
      return null;
    }
  }
  // ---------- Antes / después ----------
  var compare = document.getElementById("compare");
  if (compare) {
    var range = compare.querySelector(".compare-range");
    range.addEventListener("input", function () {
      compare.style.setProperty("--pos", range.value + "%");
    });
  }
})();
