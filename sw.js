/* Sakız '26 — çevrimdışı destek.
   Uygulama kabuğu kurulumda önbelleğe alınır; diğer her şey
   "önce önbellek, yoksa ağ, inince kaydet" mantığıyla çalışır.
   Adada internet olmasa bile site açılır. */

var CACHE = "sakiz26-v12";
var SHELL = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);

  // Sayfanın kendisi (HTML): HER ZAMAN önce ağ — güncel sürüm anında gelir;
  // internet yoksa önbellekteki son kopyaya düşer.
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put("index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("index.html").then(function (hit) {
          return hit || caches.match("./");
        });
      })
    );
    return;
  }

  // CSS/JS de önce ağ (küçük dosyalar, güncellik önemli)
  if (url.origin === location.origin && /\.(css|js)$|data\.js/.test(url.pathname)) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () { return caches.match(e.request); })
    );
    return;
  }

  // Hava durumu: önce ağ, düşerse önbellekteki son cevap
  if (url.hostname.indexOf("open-meteo.com") > -1) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () { return caches.match(e.request); })
    );
    return;
  }

  // Geri kalan her şey: önce önbellek, yoksa ağdan al ve kaydet
  e.respondWith(
    caches.match(e.request, { ignoreSearch: url.origin === location.origin }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        if (res.ok && (url.origin === location.origin || url.hostname.indexOf("gstatic") > -1 || url.hostname.indexOf("googleapis") > -1)) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () {
        if (e.request.mode === "navigate") return caches.match("index.html");
      });
    })
  );
});
