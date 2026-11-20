(function () {
  "use strict";
  var cfg = window.CASTELVAR || {};
  var loadedAt = Date.now();
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  $("#year").textContent = String(new Date().getFullYear());

  var i18n = window.I18N || {
    t: function (k) { return k; },
    pick: function (v) { return v || ""; },
    lang: function () { return "es"; },
    onChange: function () {},
  };
  var t = i18n.t;
  // Iconos de línea (los mismos que assets/icons/*.svg)
  var ICON = {
    tel: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 3.5h3l1.5 4-2 1.25a10.5 10.5 0 0 0 7.25 7.25L16.5 14l4 1.5v3a2 2 0 0 1-2 2C10.5 20.5 3.5 13.5 3.5 5.5a2 2 0 0 1 2-2z"/></svg>',
    msg: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.5c0 4.4-3.8 8-8.5 8a9 9 0 0 1-3.9-.9L3.5 20l1.3-3.8A7.6 7.6 0 0 1 3.5 11.5c0-4.4 3.8-8 8.5-8s8.5 3.6 8.5 8z"/></svg>',
    mail: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.25 8.5-6.25"/></svg>',
  };
  var pick = i18n.pick;

  // ---------- Contenido configurable (todo lo vacío se oculta) ----------
  var phone = (cfg.phone || "").trim();
  var tel = phone.replace(/[^\d+]/g, "");
  var wa = (cfg.whatsapp || "").replace(/\D/g, "");
  var waUrl = "";
  var email = (cfg.email || "").trim();
  var projects = Array.isArray(cfg.projects) ? cfg.projects.filter(function (p) { return p && p.img; }) : [];

  // Textos que dependen del idioma: se vuelven a pintar al cambiarlo en el pie.
  // Los textos de config.js pueden ser una cadena o { es, ca, fr, en }.
  function render() {
    waUrl = wa ? "https://wa.me/" + wa + "?text=" + encodeURIComponent(t("js.waMsg")) : "";
    var top = [];
    if (phone) top.push('<a href="tel:' + tel + '">' + ICON.tel + esc(phone) + "</a>");
    if (wa) top.push('<a href="' + waUrl + '" target="_blank" rel="noopener">' + ICON.msg + "WhatsApp</a>");
    if (email) top.push('<a href="mailto:' + esc(email) + '">' + ICON.mail + esc(email) + "</a>");
    if (top.length) {
      $("#topbar-links").innerHTML = top.join("");
      $("#topbar").hidden = false;
    }
    if (phone) {
      var hp = $("#header-phone");
      hp.href = "tel:" + tel;
      hp.textContent = phone;
      hp.hidden = false;
      var fp = $("#final-phone");
      fp.href = "tel:" + tel;
      fp.textContent = t("js.callTo") + " " + phone;
      fp.hidden = false;
    }
    if (wa) {
      var wf = $("#wa-float");
      wf.href = waUrl;
      wf.hidden = false;
    }
    var rt = pick(cfg.responseTime);
    if (rt) {
      $("#response-time").textContent = t("js.respond", { t: rt });
      $("#thanks-time").textContent = t("js.thanksTime", { t: rt });
    }
    var warranty = pick(cfg.warranty);
    var w = $("#hero-warranty");
    w.textContent = warranty;
    w.hidden = !warranty;

    var stats = Array.isArray(cfg.stats) ? cfg.stats.filter(function (s) { return s && s.value; }) : [];
    if (stats.length) {
      var html = stats
        .map(function (s) {
          return "<div><strong>" + esc(pick(s.value)) + "</strong><span>" + esc(pick(s.label)) + "</span></div>";
        })
        .join("");
      $("#hero-stats").innerHTML = html;
      $("#hero-stats").hidden = false;
      $("#stats").innerHTML = html;
      $("#cifras").hidden = false;
    }
    if (projects.length) {
      $("#projects").innerHTML = projects
        .map(function (p) {
          return (
            '<figure class="project"><img loading="lazy" src="' + esc(p.img) + '" alt="' + esc(pick(p.title) || t("js.projectAlt")) + '" />' +
            "<div><strong>" + esc(pick(p.title)) + "</strong><span>" + esc([pick(p.place), p.year].filter(Boolean).join(" · ")) + "</span></div></figure>"
          );
        })
        .join("");
      $("#referencias").hidden = false;
    }
    var testimonials = Array.isArray(cfg.testimonials) ? cfg.testimonials.filter(function (x) { return x && x.text && x.name; }) : [];
    if (testimonials.length) {
      $("#testimonials").innerHTML = testimonials
        .map(function (x) {
          return (
            '<blockquote class="testimonial"><p>“' + esc(pick(x.text)) + "”</p><footer><strong>" + esc(x.name) + "</strong>" +
            esc([pick(x.place), pick(x.project)].filter(Boolean).join(" · ")) + "</footer></blockquote>"
          );
        })
        .join("");
      $("#opiniones").hidden = false;
    }
    // Pie
    var fc = [];
    if (phone) fc.push('<li><a href="tel:' + tel + '">' + esc(phone) + "</a></li>");
    if (wa) fc.push('<li><a href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a></li>');
    if (email) fc.push('<li><a href="mailto:' + esc(email) + '">' + esc(email) + "</a></li>");
    var hours = pick(cfg.hours);
    if (hours) fc.push("<li>" + esc(hours) + "</li>");
    $("#footer-contact").innerHTML = fc.join("") || '<li><a href="#presupuesto">' + esc(t("js.footerForm")) + "</a></li>";
    var co = cfg.company || {};
    $("#footer-company").innerHTML =
      [co.legalName, co.nif && "NIF " + co.nif, co.address]
        .filter(Boolean)
        .map(function (x) {
          return "<li>" + esc(x) + "</li>";
        })
        .join("") || "<li>" + esc(t("js.region")) + "</li>";
  }
  render();
  i18n.onChange(function () {
    render();
    // Un error mostrado en el idioma anterior se quita (se vuelve a validar al continuar)
    if (status.className.indexOf("error") >= 0) clearErrors();
  });

  if (projects.length) {
    var bg = $("#hero-bg");
    bg.style.backgroundImage = 'url("' + projects[0].img.replace(/"/g, "") + '")';
    bg.classList.add("has-photo");
  } else {
    document.querySelectorAll('[data-needs="projects"]').forEach(function (el) {
      el.hidden = true;
    });
  }
  // ---------- Comparador antes / después ----------
  var compare = $("#compare");
  if (compare) {
    var range = compare.querySelector(".compare-range");
    range.addEventListener("input", function () {
      compare.style.setProperty("--pos", range.value + "%");
    });
  }
  // ---------- Barra fija inferior (móvil) ----------
  var mobileBar = $("#mobile-bar");
  if (phone) {
    $("#mb-call").href = "tel:" + tel;
    $("#mb-call").hidden = false;
  }
  if (wa) {
    $("#mb-wa").href = waUrl;
    $("#mb-wa").hidden = false;
  }
  mobileBar.hidden = false;
  // Solo se muestra cuando el formulario NO está a la vista (para no taparlo)
  var card = $("#presupuesto");
  var ticking = false;
  function updateBar() {
    ticking = false;
    var r = card.getBoundingClientRect();
    var visible = r.bottom > 80 && r.top < window.innerHeight - 80;
    mobileBar.classList.toggle("show", !visible);
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

  // ---------- Campañas (Google Ads, redes…) ----------
  var params = new URLSearchParams(location.search);
  var utm = {};
  ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) {
    var v = params.get(k) || store(k);
    if (v) {
      utm[k] = v.slice(0, 150);
      store(k, v);
    }
  });
  if (!utm.utm_source && (params.get("gclid") || store("gclid"))) {
    utm.utm_source = "google_ads";
    store("gclid", "1");
  }

  // ---------- Formulario por pasos ----------
  var form = $("#lead-form");
  var steps = Array.prototype.slice.call(form.querySelectorAll(".step"));
  var status = $(".form-status", form);
  var bar = $("#progress-bar");
  var current = 1;

  function show(n) {
    current = n;
    steps.forEach(function (s) {
      s.hidden = Number(s.dataset.step) !== n;
    });
    bar.style.width = Math.round((n / steps.length) * 100) + "%";
    status.textContent = "";
    status.className = "form-status";
    var first = $('[data-step="' + n + '"] input:not([type=radio]):not(.hp input), [data-step="' + n + '"] select', form);
    if (n > 1 && first && window.innerWidth > 640) first.focus({ preventScroll: true });
    // En el móvil, al cambiar de paso, el formulario vuelve a quedar arriba de la pantalla
    if (window.innerWidth <= 640) {
      var card = $("#presupuesto");
      if (card.getBoundingClientRect().top < 56) card.scrollIntoView({ behavior: "smooth", block: "start" });
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
  // Primera vez que se toca el formulario: lo cuenta la medición (assets/medir.js)
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
  // Los botones "Pedir presupuesto" de las tarjetas preseleccionan el uso
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
    var lang = i18n.lang();
    if (langNames[lang]) {
      payload.message = ("[Idioma de la web: " + langNames[lang] + "]\n" + (payload.message || "")).trim().slice(0, 3000);
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
          bar.style.width = "100%";
          var direct = [];
          if (phone) direct.push(esc(t("js.urgent")) + ' <a href="tel:' + tel + '">' + esc(phone) + "</a>");
          if (wa) direct.push('<a href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a>');
          $("#thanks-direct").innerHTML = direct.join(" · ");
          var th = $("#thanks");
          th.hidden = false;
          th.focus();
          // Solicitud enviada: la medición y los píxeles aceptados lo registran (assets/medir.js)
          document.dispatchEvent(new CustomEvent("castelvar:lead"));
          return;
        }
        if (res && res.fields) {
          // Vuelve al paso donde está el error
          var stepOf = { width: 2, length: 2, city: 2, province: 2, timeframe: 2 };
          var k = Object.keys(res.fields)[0];
          if (stepOf[k]) show(stepOf[k]);
          showErrors(localFields(res.fields));
          return;
        }
        // Los textos del servidor están en español: en otro idioma se muestra un aviso genérico
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
})();
