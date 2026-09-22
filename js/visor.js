(function () {
  var RAW = "https://raw.githubusercontent.com/sefaradmx-sys/genealogia-garcia/main/";
  var VIEW = "https://mozilla.github.io/pdf.js/web/viewer.html?file=";
  function rawUrl(rel) {
    var path = (rel || "").replace(/^\.\.\//, "").split("?")[0];
    var parts = path.split("/").map(function (p) {
      try { p = decodeURIComponent(p); } catch (e) {}
      return encodeURIComponent(p);
    });
    return RAW + parts.join("/");
  }
  function mount(ifr) {
    var rel = ifr.getAttribute("data-file") || ifr.getAttribute("src") || "";
    var raw = rawUrl(rel);
    var bar = document.createElement("p");
    bar.className = "pie";
    bar.innerHTML = '<a class="abrir-pdf" href="' + raw + '" target="_blank" rel="noopener">Abrir PDF</a> · <a href="index.html">Documentos</a>';
    ifr.parentNode.insertBefore(bar, ifr);
    ifr.src = VIEW + encodeURIComponent(raw);
    ifr.setAttribute("title", "Visor PDF");
  }
  document.querySelectorAll("iframe.visor").forEach(mount);
})();
