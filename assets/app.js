(function () {
  "use strict";
  var cfg = window.CASTELVAR || {};
  var loadedAt = Date.now();
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  $("#year").textContent = String(new Date().getFullYear());

  // ---------- Contenido configurable (todo lo vacío se oculta) ----------
  var phone = (cfg.phone || "").trim();
  var tel = phone.replace(/[^\d+]/g, "");
  var wa = (cfg.whatsapp || "").replace(/\D/g, "");
  var waUrl = wa ? "https://wa.me/" + wa + "?text=" + encodeURIComponent("Hola, me interesa una carpa industrial. ¿Podéis darme información?") : "";
  var email = (cfg.email || "").trim();

  var top = [];
  if (phone) top.push('<a href="tel:' + tel + '">📞 ' + esc(phone) + "</a>");
  if (wa) top.push('<a href="' + waUrl + '" target="_blank" rel="noopener">💬 WhatsApp</a>');
  if (email) top.push('<a href="mailto:' + esc(email) + '">✉️ ' + esc(email) + "</a>");
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
    fp.textContent = "Llamar al " + phone;
    fp.hidden = false;
  }
  if (wa) {
    var wf = $("#wa-float");
    wf.href = waUrl;
    wf.hidden = false;
  }
  if (cfg.responseTime) {
    $("#response-time").textContent = "te respondemos en " + cfg.responseTime;
    $("#thanks-time").textContent = "en " + cfg.responseTime;
  }
  if (cfg.warranty) {
    var w = $("#hero-warranty");
    w.textContent = cfg.warranty;
    w.hidden = false;
  }
  var stats = Array.isArray(cfg.stats) ? cfg.stats.filter(function (s) { return s && s.value; }) : [];
  if (stats.length) {
    var html = stats
      .map(function (s) {
        return "<div><strong>" + esc(s.value) + "</strong><span>" + esc(s.label || "") + "</span></div>";
      })
      .join("");
    $("#hero-stats").innerHTML = html;
    $("#hero-stats").hidden = false;
    $("#stats").innerHTML = html;
    $("#cifras").hidden = false;
  }
  var projects = Array.isArray(cfg.projects) ? cfg.projects.filter(function (p) { return p && p.img; }) : [];
  if (projects.length) {
    $("#projects").innerHTML = projects
      .map(function (p) {
        return (
          '<figure class="project"><img loading="lazy" src="' + esc(p.img) + '" alt="' + esc(p.title || "Obra de Castelvar") + '" />' +
          "<div><strong>" + esc(p.title || "") + "</strong><span>" + esc([p.place, p.year].filter(Boolean).join(" · ")) + "</span></div></figure>"
        );
      })
      .join("");
    $("#referencias").hidden = false;
    var bg = $("#hero-bg");
    bg.style.backgroundImage = 'url("' + projects[0].img.replace(/"/g, "") + '")';
    bg.classList.add("has-photo");
  } else {
    document.querySelectorAll('[data-needs="projects"]').forEach(function (el) {
      el.hidden = true;
    });
  }
  var testimonials = Array.isArray(cfg.testimonials) ? cfg.testimonials.filter(function (t) { return t && t.text && t.name; }) : [];
  if (testimonials.length) {
    $("#testimonials").innerHTML = testimonials
      .map(function (t) {
        return (
          '<blockquote class="testimonial"><p>“' + esc(t.text) + "”</p><footer><strong>" + esc(t.name) + "</strong>" +
          esc([t.place, t.project].filter(Boolean).join(" · ")) + "</footer></blockquote>"
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
  if (cfg.hours) fc.push("<li>" + esc(cfg.hours) + "</li>");
  $("#footer-contact").innerHTML = fc.join("") || '<li><a href="#presupuesto">Formulario de presupuesto</a></li>';
  var co = cfg.company || {};
  $("#footer-company").innerHTML =
    [co.legalName, co.nif && "NIF " + co.nif, co.address]
      .filter(Boolean)
      .map(function (x) {
        return "<li>" + esc(x) + "</li>";
      })
      .join("") || "<li>Barcelona · Cataluña</li>";

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
  }
  form.addEventListener("click", function (e) {
    var t = e.target;
    if (t.matches("[data-next]")) {
      if (validate(current)) show(current + 1);
    } else if (t.matches("[data-prev]")) {
      show(current - 1);
    } else if (t.matches("[data-size]")) {
      var v = t.dataset.size.split("x");
      form.width.value = v[0] || "";
      form.length.value = v[1] || "";
    }
  });
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
        if (v && (isNaN(Number(v)) || Number(v) <= 0 || Number(v) > 500)) errors[k] = "Medida no válida";
      });
    }
    if (step === 3) {
      if (form.name.value.trim().length < 2) errors.name = "Indica tu nombre";
      if (!form.email.value.trim() && !form.phone.value.trim()) errors.phone = "Indica un teléfono o un email";
      if (form.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())) errors.email = "Email no válido";
      if (!form.consent.checked) errors.consent = "Debes aceptar la política de privacidad";
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
      return fail("El formulario aún no está configurado. Llámanos o escríbenos, por favor.");
    }
    var data = Object.fromEntries(new FormData(form).entries());
    var payload = Object.assign({}, data, utm, {
      key: cfg.formKey,
      consent: form.consent.checked ? "on" : "",
      t: loadedAt,
      page: location.href.split("#")[0].slice(0, 290),
    });
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
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
          bar.style.width = "100%";
          var direct = [];
          if (phone) direct.push('¿Urgente? <a href="tel:' + tel + '">' + esc(phone) + "</a>");
          if (wa) direct.push('<a href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a>');
          $("#thanks-direct").innerHTML = direct.join(" · ");
          var th = $("#thanks");
          th.hidden = false;
          th.focus();
          if (typeof window.gtag === "function") window.gtag("event", "generate_lead");
          return;
        }
        if (res && res.fields) {
          // Vuelve al paso donde está el error
          var stepOf = { width: 2, length: 2, city: 2, province: 2, timeframe: 2 };
          var k = Object.keys(res.fields)[0];
          if (stepOf[k]) show(stepOf[k]);
          showErrors(res.fields);
        }
        fail((res && res.error) || "No se ha podido enviar. Inténtalo de nuevo.");
      })
      .catch(function () {
        fail("No hay conexión. Revisa tu internet e inténtalo de nuevo.");
      })
      .finally(function () {
        btn.disabled = false;
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
