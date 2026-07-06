/* =====================================================================
   Evalua RH — Landing · app.js
   Tema día/noche · animaciones al scroll · nav · año
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Año en el footer ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Sombra del nav al hacer scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Índice para animación escalonada ---------- */
  ["cards-3", "steps", "dims"].forEach(function (cls) {
    var grupos = document.getElementsByClassName(cls);
    for (var g = 0; g < grupos.length; g++) {
      var hijos = grupos[g].querySelectorAll(".reveal");
      for (var i = 0; i < hijos.length; i++) hijos[i].style.setProperty("--i", i);
    }
  });

  /* ---------- Reveal al hacer scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // Sin soporte: mostrar todo
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Contador animado de las métricas del panel ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var metricas = document.querySelectorAll(".mock-v");
  if (!reduce && "IntersectionObserver" in window && metricas.length) {
    var countObs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, destino = parseInt(el.textContent, 10);
        countObs.unobserve(el);
        if (isNaN(destino)) return;
        var dur = 950, t0 = 0;
        (function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(destino * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    metricas.forEach(function (m) { countObs.observe(m); });
  }

  /* ---------- Aviso amable si el link de Stripe aún es el de ejemplo ---------- */
  var compra = document.getElementById("btnCompra");
  if (compra && /TU_LINK_DE_PAGO/.test(compra.getAttribute("href") || "")) {
    compra.addEventListener("click", function (ev) {
      ev.preventDefault();
      console.warn("Configura tu Stripe Payment Link en el href de #btnCompra (index.html).");
    });
  }

  /* ---------- Lightbox: ver las capturas en grande al hacer click ---------- */
  var shots = document.querySelectorAll(".shot img");
  if (shots.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = '<button class="lightbox__close" aria-label="Cerrar">\u00d7</button><img alt="Captura ampliada">';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");
    var cerrar = function () { lb.classList.remove("open"); };
    shots.forEach(function (img) {
      img.addEventListener("click", function () { lbImg.src = img.src; lb.classList.add("open"); });
    });
    lb.addEventListener("click", cerrar);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });
  }
})();
