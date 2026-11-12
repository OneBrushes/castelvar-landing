// Rellena los datos de la empresa en las páginas legales desde config.js
(function () {
  var cfg = window.CASTELVAR || {};
  var co = cfg.company || {};
  document.querySelectorAll("[data-co],[data-cfg]").forEach(function (el) {
    var v = el.dataset.co ? co[el.dataset.co] : cfg[el.dataset.cfg];
    if (v) {
      el.textContent = v;
      el.classList.remove("todo");
    }
  });
})();
