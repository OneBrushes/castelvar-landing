// Medición propia, aviso de cookies y píxeles de la landing. Sin dependencias.
//
// 1) Medición propia (pantalla «Web» de la app): anónima y SIN cookies. Manda a la app la página, de dónde
//    viene la visita, el tipo de dispositivo, hasta dónde se baja y dónde se hace clic. La app solo guarda
//    contadores por día. No se mide si el navegador pide no ser rastreado (Do Not Track / GPC).
// 2) Píxeles (Meta, Google, TikTok…): se configuran en la app (Web → Píxeles) y SOLO se cargan si el
//    visitante acepta las cookies de su tipo. Si no hay ninguno activo, no se muestra ningún aviso.
// 3) Mapa de calor: con ?mapa=1 la web no mide nada; la app (dentro de un iframe) le pasa los clics y aquí se pintan.
(function () {
  "use strict";
  var cfg = window.CASTELVAR || {};
  var i18n = window.I18N || { t: function (k) { return k; }, onChange: function () {} };
  var t = i18n.t;
  var params = new URLSearchParams(location.search);
  var base = "";
  try {
    base = new URL(cfg.apiUrl).origin;
  } catch (e) {
    base = "";
  }
  var key = cfg.formKey || "";

  if (params.get("mapa") === "1") return heatmapMode();

  // =====================================================================
  // 1) Medición propia
  // =====================================================================
  var dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
  var measure = !!(base && /^[a-f0-9]{12,64}$/i.test(key) && !dnt);
  var device = window.innerWidth < 768 ? "m" : "d";
  var utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "gclid", "fbclid", "ttclid", "msclkid", "li_fat_id"].forEach(function (k) {
    var v = params.get(k);
    if (v) utm[k] = v.slice(0, 150);
  });
  var pending = { s: [], c: [], t: [], f: 0 };
  var reached = {};

  function send(extra, leaving) {
    if (!measure) return;
    var body = JSON.stringify(Object.assign({ k: key, p: location.pathname, r: document.referrer, u: utm, d: device }, extra));
    // Al salir de la página, sendBeacon es lo único que el navegador garantiza que llega
    if (leaving && navigator.sendBeacon) {
      try {
        if (navigator.sendBeacon(base + "/api/web/hit", new Blob([body], { type: "text/plain" }))) return;
      } catch (e) {
        /* sigue con fetch */
      }
    }
    try {
      fetch(base + "/api/web/hit", { method: "POST", body: body, keepalive: true, credentials: "omit", headers: { "Content-Type": "text/plain" } }).catch(function () {});
    } catch (e) {
      /* sin conexión: se pierde esta medición, no pasa nada */
    }
  }
  function flush(leaving) {
    if (!pending.s.length && !pending.c.length && !pending.t.length && !pending.f) return;
    send({ s: pending.s, c: pending.c, t: pending.t, f: pending.f }, leaving === true);
    pending = { s: [], c: [], t: [], f: 0 };
  }
  var leave = function () {
    flush(true);
  };

  if (measure) {
    send({ v: 1 });

    // Hasta dónde baja (25 / 50 / 75 / 100 %)
    var ticking = false;
    var checkScroll = function () {
      ticking = false;
      var h = document.documentElement.scrollHeight;
      if (!h) return;
      var pct = ((window.scrollY + window.innerHeight) / h) * 100;
      [25, 50, 75, 100].forEach(function (p) {
        if (!reached[p] && pct >= (p === 100 ? 98 : p)) {
          reached[p] = true;
          pending.s.push(p);
        }
      });
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(checkScroll);
        }
      },
      { passive: true },
    );
    window.addEventListener("load", checkScroll);

    // Clics: zona de la página + posición (respecto al centro y a lo alto de la zona) + qué se ha pulsado
    document.addEventListener(
      "click",
      function (e) {
        var target = e.target instanceof Element ? e.target : null;
        if (!target) return;
        var zone = target.closest("[data-zone], section[id], header[id], footer[id], #topbar");
        if (zone && pending.c.length < 40) {
          var id = zone.getAttribute("data-zone") || zone.id;
          var fixed = getComputedStyle(zone).position === "fixed";
          if (!fixed && /^[a-z0-9-]{1,40}$/.test(id)) {
            var r = zone.getBoundingClientRect();
            pending.c.push([id, Math.round((e.clientX - (r.left + r.width / 2)) / 10), Math.max(0, Math.round((e.clientY - r.top) / 10))]);
          }
        }
        var el = target.closest("a, button, label, summary, [data-track]");
        if (el && pending.t.length < 20) {
          var text = el.getAttribute("data-track") || el.getAttribute("aria-label") || el.textContent || "";
          text = text.replace(/\s+/g, " ").trim().slice(0, 60);
          if (text) pending.t.push(text);
        }
        if (pending.c.length >= 30) flush();
      },
      true,
    );
    document.addEventListener("castelvar:form-start", function () {
      pending.f = 1;
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") leave();
    });
    window.addEventListener("pagehide", leave);
    // Por si la pestaña se queda abierta mucho rato: lo pendiente se manda cada 15 s
    setInterval(flush, 15000);
  }

  // =====================================================================
  // 2) Aviso de cookies y píxeles
  // =====================================================================
  var CONSENT_KEY = "castelvar-consent";
  var NAMES = {
    ga4: "Google Analytics",
    clarity: "Microsoft Clarity",
    hotjar: "Hotjar",
    meta: "Meta",
    gads: "Google Ads",
    gtm: "Google Tag Manager",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    bing: "Microsoft Ads",
    pinterest: "Pinterest",
    x: "X",
  };
  var ANALYTICS = ["ga4", "clarity", "hotjar"];
  var pixels = {};
  var loaded = {};
  var consent = readConsent();
  var settingsBtn = document.getElementById("cookie-settings");

  function readConsent() {
    try {
      var c = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
      return c && c.v === 1 ? c : null;
    } catch (e) {
      return null;
    }
  }
  function saveConsent(a, m) {
    var before = consent;
    consent = { v: 1, a: !!a, m: !!m, at: new Date().toISOString() };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch (e) {
      /* sin almacenamiento: se vuelve a preguntar en la próxima visita */
    }
    closeBanner();
    // Lo que ya se ha cargado no se puede descargar: si se retira un permiso, se recarga la página
    if (before && ((before.a && !consent.a) || (before.m && !consent.m))) return location.reload();
    applyConsent();
  }

  if (base && key) {
    fetch(base + "/api/web/config?k=" + encodeURIComponent(key), { credentials: "omit" })
      .then(function (r) {
        return r.ok ? r.json() : { pixels: {} };
      })
      .then(function (res) {
        pixels = (res && res.pixels) || {};
        if (!Object.keys(pixels).length) return;
        if (settingsBtn) {
          settingsBtn.hidden = false;
          settingsBtn.addEventListener("click", function () {
            openBanner(true);
          });
        }
        if (consent) applyConsent();
        else openBanner(false);
      })
      .catch(function () {});
  }

  function kinds(cat) {
    return Object.keys(pixels).filter(function (k) {
      return cat === "a" ? ANALYTICS.indexOf(k) >= 0 : ANALYTICS.indexOf(k) < 0;
    });
  }

  var banner = null;
  function openBanner(detailed) {
    closeBanner();
    var a = kinds("a");
    var m = kinds("m");
    var list = function (ks) {
      return ks.map(function (k) { return NAMES[k]; }).join(", ");
    };
    banner = document.createElement("div");
    banner.className = "ck";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "ck-title");
    banner.innerHTML =
      '<div class="wrap ck-inner">' +
      '<div class="ck-copy"><p class="ck-title" id="ck-title"></p><p class="ck-text"><span></span> <a href="cookies.html"></a></p></div>' +
      '<div class="ck-options"' + (detailed ? "" : " hidden") + ">" +
      '<label class="ck-opt"><input type="checkbox" checked disabled /><span><strong data-k="ck.necessary"></strong><small data-k="ck.necessaryDesc"></small></span><em data-k="ck.always"></em></label>' +
      (a.length ? '<label class="ck-opt"><input type="checkbox" name="a" /><span><strong data-k="ck.analytics"></strong><small data-list="a"></small></span></label>' : "") +
      (m.length ? '<label class="ck-opt"><input type="checkbox" name="m" /><span><strong data-k="ck.ads"></strong><small data-list="m"></small></span></label>' : "") +
      "</div>" +
      '<div class="ck-actions">' +
      '<button type="button" class="btn ck-btn" data-act="reject"></button>' +
      '<button type="button" class="btn ck-btn" data-act="accept"></button>' +
      '<button type="button" class="ck-link" data-act="config"></button>' +
      "</div></div>";
    var paint = function () {
      if (!banner) return;
      banner.querySelector(".ck-title").textContent = t("ck.title");
      banner.querySelector(".ck-text span").textContent = t("ck.text");
      banner.querySelector(".ck-text a").textContent = t("ck.more");
      banner.querySelectorAll("[data-k]").forEach(function (el) {
        el.textContent = t(el.getAttribute("data-k"));
      });
      var la = banner.querySelector('[data-list="a"]');
      if (la) la.textContent = t("ck.analyticsDesc", { list: list(a) });
      var lm = banner.querySelector('[data-list="m"]');
      if (lm) lm.textContent = t("ck.adsDesc", { list: list(m) });
      banner.querySelector('[data-act="reject"]').textContent = t("ck.reject");
      var open = !banner.querySelector(".ck-options").hidden;
      banner.querySelector('[data-act="accept"]').textContent = open ? t("ck.save") : t("ck.accept");
      banner.querySelector('[data-act="config"]').textContent = t("ck.config");
      banner.querySelector('[data-act="config"]').hidden = open;
    };
    var ia = banner.querySelector('input[name="a"]');
    var im = banner.querySelector('input[name="m"]');
    if (ia) ia.checked = !!(consent && consent.a);
    if (im) im.checked = !!(consent && consent.m);
    banner.addEventListener("click", function (e) {
      var act = e.target instanceof Element && e.target.getAttribute("data-act");
      if (!act) return;
      var opts = banner.querySelector(".ck-options");
      if (act === "reject") saveConsent(false, false);
      else if (act === "config") {
        opts.hidden = false;
        paint();
      } else if (act === "accept") {
        if (opts.hidden) saveConsent(true, true);
        else saveConsent(ia ? ia.checked : false, im ? im.checked : false);
      }
    });
    paint();
    banner.__paint = paint;
    document.body.appendChild(banner);
    document.body.classList.add("has-ck");
  }
  function closeBanner() {
    if (banner) banner.remove();
    banner = null;
    document.body.classList.remove("has-ck");
  }
  i18n.onChange(function () {
    if (banner && banner.__paint) banner.__paint();
  });

  function applyConsent() {
    if (!consent) return;
    Object.keys(pixels).forEach(function (k) {
      var allowed = ANALYTICS.indexOf(k) >= 0 ? consent.a : consent.m;
      if (allowed && !loaded[k] && LOADERS[k]) {
        loaded[k] = true;
        try {
          LOADERS[k](pixels[k]);
        } catch (e) {
          /* un píxel que falla no rompe la web */
        }
      }
    });
  }

  function script(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
    return s;
  }
  // Google (Analytics 4 y Ads comparten gtag, con el modo de consentimiento v2)
  function gtagBase(firstId) {
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
      window.gtag("js", new Date());
      script("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(firstId));
    }
    window.gtag("consent", "update", {
      analytics_storage: consent.a ? "granted" : "denied",
      ad_storage: consent.m ? "granted" : "denied",
      ad_user_data: consent.m ? "granted" : "denied",
      ad_personalization: consent.m ? "granted" : "denied",
    });
  }
  var LOADERS = {
    ga4: function (p) {
      gtagBase(p.id);
      window.gtag("config", p.id);
    },
    gads: function (p) {
      gtagBase(p.id);
      window.gtag("config", p.id);
    },
    gtm: function (p) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      script("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(p.id));
    },
    meta: function (p) {
      if (window.fbq) return;
      var n = (window.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      script("https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", p.id);
      window.fbq("track", "PageView");
    },
    tiktok: function (p) {
      var w = window;
      w.TiktokAnalyticsObject = "ttq";
      var ttq = (w.ttq = w.ttq || []);
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
      ttq.setAndDefer = function (o, m) {
        o[m] = function () {
          o.push([m].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (id) {
        var e = ttq._i[id] || [];
        for (var n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function (id, opts) {
        var u = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {};
        ttq._i[id] = [];
        ttq._i[id]._u = u;
        ttq._t = ttq._t || {};
        ttq._t[id] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[id] = opts || {};
        script(u + "?sdkid=" + encodeURIComponent(id) + "&lib=ttq");
      };
      ttq.load(p.id);
      ttq.page();
    },
    linkedin: function (p) {
      window._linkedin_partner_id = p.id;
      window._linkedin_data_partner_ids = (window._linkedin_data_partner_ids || []).concat([p.id]);
      if (!window.lintrk) {
        window.lintrk = function (a, b) {
          window.lintrk.q.push([a, b]);
        };
        window.lintrk.q = [];
      }
      script("https://snap.licdn.com/li.lms-analytics/insight.min.js");
    },
    bing: function (p) {
      window.uetq = window.uetq || [];
      var s = script("https://bat.bing.com/bat.js");
      s.onload = function () {
        if (typeof window.UET !== "function") return;
        var q = window.uetq;
        window.uetq = new window.UET({ ti: p.id, q: q });
        window.uetq.push("pageLoad");
      };
    },
    pinterest: function (p) {
      if (!window.pintrk) {
        window.pintrk = function () {
          window.pintrk.queue.push(Array.prototype.slice.call(arguments));
        };
        window.pintrk.queue = [];
        window.pintrk.version = "3.0";
        script("https://s.pinimg.com/ct/core.js");
      }
      window.pintrk("load", p.id);
      window.pintrk("page");
    },
    x: function (p) {
      if (!window.twq) {
        var s = (window.twq = function () {
          s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
        });
        s.version = "1.1";
        s.queue = [];
        script("https://static.ads-twitter.com/uwt.js");
      }
      window.twq("config", p.id);
    },
    clarity: function (p) {
      window.clarity =
        window.clarity ||
        function () {
          (window.clarity.q = window.clarity.q || []).push(arguments);
        };
      script("https://www.clarity.ms/tag/" + encodeURIComponent(p.id));
    },
    hotjar: function (p) {
      window.hj =
        window.hj ||
        function () {
          (window.hj.q = window.hj.q || []).push(arguments);
        };
      window._hjSettings = { hjid: Number(p.id), hjsv: 6 };
      script("https://static.hotjar.com/c/hotjar-" + encodeURIComponent(p.id) + ".js?sv=6");
    },
  };

  // Solicitud enviada: se avisa a los píxeles cargados
  document.addEventListener("castelvar:lead", function () {
    try {
      if (loaded.meta && window.fbq) window.fbq("track", "Lead");
      if ((loaded.ga4 || loaded.gads) && window.gtag) {
        window.gtag("event", "generate_lead");
        if (loaded.gads && pixels.gads && pixels.gads.label) window.gtag("event", "conversion", { send_to: pixels.gads.id + "/" + pixels.gads.label });
      }
      if (loaded.gtm && window.dataLayer) window.dataLayer.push({ event: "generate_lead" });
      if (loaded.tiktok && window.ttq) window.ttq.track("SubmitForm");
      if (loaded.linkedin && window.lintrk && pixels.linkedin.conversion) window.lintrk("track", { conversion_id: Number(pixels.linkedin.conversion) });
      if (loaded.bing && window.uetq) window.uetq.push("event", "submit_lead_form", {});
      if (loaded.pinterest && window.pintrk) window.pintrk("track", "lead");
      if (loaded.x && window.twq && pixels.x.event) window.twq("event", pixels.x.event, {});
    } catch (e) {
      /* los píxeles no deben romper el formulario */
    }
  });

  // =====================================================================
  // 3) Mapa de calor (la web dentro de la app)
  // =====================================================================
  function heatmapMode() {
    document.documentElement.classList.add("mapa");
    var allowed = [base, "http://localhost:4100", "http://localhost:3000"];
    var data = null;
    window.addEventListener("message", function (e) {
      if (allowed.indexOf(e.origin) < 0 || !e.data || e.data.type !== "castelvar-mapa") return;
      data = e.data;
      draw();
    });
    var ready = function () {
      if (window.parent !== window) window.parent.postMessage({ type: "castelvar-mapa-listo" }, "*");
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready);
    var timer = null;
    window.addEventListener("resize", function () {
      clearTimeout(timer);
      timer = setTimeout(draw, 200);
    });

    function zoneTop(zone) {
      // La cabecera es fija arriba: se pinta en su sitio de partida
      if (zone.id === "cabecera") {
        var top = document.getElementById("topbar");
        return top && !top.hidden ? top.offsetHeight : 0;
      }
      return zone.getBoundingClientRect().top + window.scrollY;
    }

    function draw() {
      if (!data) return;
      var old = document.getElementById("mapa-capa");
      if (old) old.remove();
      var W = document.documentElement.scrollWidth;
      var H = Math.min(document.documentElement.scrollHeight, 16000);
      var layer = document.createElement("div");
      layer.id = "mapa-capa";
      layer.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;pointer-events:none;z-index:9999";
      var canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
      layer.appendChild(canvas);
      var ctx = canvas.getContext("2d");
      var cells = data.clicks || [];
      var max = cells.reduce(function (m, c) { return Math.max(m, c.n); }, 1);
      var R = W < 768 ? 22 : 28;
      cells.forEach(function (c) {
        var zone = document.getElementById(c.s) || document.querySelector('[data-zone="' + c.s + '"]');
        if (!zone || getComputedStyle(zone).position === "fixed") return;
        var r = zone.getBoundingClientRect();
        var x = r.left + window.scrollX + r.width / 2 + c.x * 10;
        var y = zoneTop(zone) + c.y * 10;
        var a = 0.12 + 0.88 * (Math.log(1 + c.n) / Math.log(1 + max));
        var g = ctx.createRadialGradient(x, y, 0, x, y, R);
        g.addColorStop(0, "rgba(0,0,0," + a + ")");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - R, y - R, R * 2, R * 2);
      });
      // Color: de azul (pocos) a rojo (muchos)
      var pal = document.createElement("canvas").getContext("2d");
      pal.canvas.width = 256;
      pal.canvas.height = 1;
      var lg = pal.createLinearGradient(0, 0, 256, 0);
      lg.addColorStop(0, "#2b6cb0");
      lg.addColorStop(0.35, "#38a169");
      lg.addColorStop(0.6, "#ecc94b");
      lg.addColorStop(0.85, "#dd6b20");
      lg.addColorStop(1, "#c53030");
      pal.fillStyle = lg;
      pal.fillRect(0, 0, 256, 1);
      var colors = pal.getImageData(0, 0, 256, 1).data;
      if (cells.length) {
        var img = ctx.getImageData(0, 0, W, H);
        var px = img.data;
        for (var i = 3; i < px.length; i += 4) {
          var alpha = px[i];
          if (!alpha) continue;
          var o = alpha * 4;
          px[i - 3] = colors[o];
          px[i - 2] = colors[o + 1];
          px[i - 1] = colors[o + 2];
          px[i] = Math.min(220, alpha + 40);
        }
        ctx.putImageData(img, 0, 0);
      }
      // Líneas de scroll: qué parte de las visitas llega hasta ahí
      var sc = data.scroll || {};
      [
        [25, sc.s25],
        [50, sc.s50],
        [75, sc.s75],
        [100, sc.s100],
      ].forEach(function (row) {
        if (row[1] === null || row[1] === undefined) return;
        var y = Math.min(H - 2, (row[0] / 100) * H);
        var line = document.createElement("div");
        line.style.cssText = "position:absolute;left:0;right:0;top:" + y + "px;border-top:2px dashed rgba(18,36,59,.75)";
        var tag = document.createElement("span");
        tag.textContent = Math.round(row[1] * 100) + " % llega aquí";
        tag.style.cssText = "position:absolute;right:12px;top:" + (row[0] === 100 ? -30 : 4) + "px;background:#12243b;color:#fff;font:600 12px/1 Inter,system-ui,sans-serif;padding:6px 8px;border-radius:4px";
        line.appendChild(tag);
        layer.appendChild(line);
      });
      document.body.appendChild(layer);
    }
    // Las fotos y las fuentes cambian la altura al cargar: se vuelve a pintar
    window.addEventListener("load", function () {
      setTimeout(draw, 300);
    });
  }
})();
