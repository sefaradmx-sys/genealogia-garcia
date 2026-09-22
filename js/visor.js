(function () {
  var RAW = "https://raw.githubusercontent.com/sefaradmx-sys/genealogia-garcia/main/";
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  function rawUrl(rel) {
    var path = (rel || "").replace(/^\.\.\//, "").split("?")[0];
    return RAW + path.split("/").map(function (p) {
      try { p = decodeURIComponent(p); } catch (e) {}
      return encodeURIComponent(p);
    }).join("/");
  }
  function lockEvents(root) {
    root.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    root.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }
  function wrapImage(img) {
    if (img.closest(".lector")) return;
    var box = document.createElement("div");
    box.className = "lector";
    img.parentNode.insertBefore(box, img);
    box.appendChild(img);
    var velo = document.createElement("div");
    velo.className = "velo";
    box.appendChild(velo);
    lockEvents(box);
  }
  document.querySelectorAll("img.acta, .hero img, img.boda").forEach(wrapImage);
  function renderPdf(host, rel) {
    if (!window.pdfjsLib) {
      host.textContent = "El visor no cargó.";
      return;
    }
    host.classList.add("lector");
    host.innerHTML = "<p class=\"kicker\">Consultando documento…</p>";
    lockEvents(host);
    pdfjsLib.getDocument({ url: rawUrl(rel) }).promise.then(function (pdf) {
      host.innerHTML = "";
      var velo = document.createElement("div");
      velo.className = "velo";
      var chain = Promise.resolve();
      for (var n = 1; n <= pdf.numPages; n++) {
        chain = chain.then((function (num) {
          return function () {
            return pdf.getPage(num).then(function (page) {
              var vp = page.getViewport({ scale: 1.25 });
              var canvas = document.createElement("canvas");
              canvas.width = vp.width;
              canvas.height = vp.height;
              host.appendChild(canvas);
              return page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
            });
          };
        })(n));
      }
      return chain.then(function () { host.appendChild(velo); });
    }).catch(function () {
      host.textContent = "No se pudo pintar el documento.";
    });
  }
  document.querySelectorAll("[data-file]").forEach(function (el) {
    var rel = el.getAttribute("data-file");
    if (!rel) return;
    if (el.tagName === "IFRAME") {
      var host = document.createElement("div");
      host.className = "visor lector";
      el.parentNode.replaceChild(host, el);
      renderPdf(host, rel);
    } else {
      renderPdf(el, rel);
    }
  });
})();
