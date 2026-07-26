/* Sakız Adası '26 — uygulama mantığı */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- yardımcılar ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function telHref(num) { return "tel:" + num.replace(/[^+\d]/g, ""); }

  var toastTimer;
  function toast(msg, ms) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, ms || 2600);
  }

  function confetti(n) {
    if (reduceMotion) return;
    var colors = ["#e79a2e", "#567f5b", "#16688a", "#c9302c", "#f6f3ea"];
    for (var i = 0; i < (n || 60); i++) {
      var c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 2.2 + Math.random() * 2 + "s";
      c.style.animationDelay = Math.random() * 0.6 + "s";
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.appendChild(c);
      c.addEventListener("animationend", function () { this.remove(); });
    }
  }

  /* ---------- TRIP verisini bas ---------- */
  $("#ferryDepart").textContent = TRIP.ferry.depart;
  $("#ferryMeta").textContent = TRIP.ferry.company + " · " + TRIP.ferry.route + " · yaklaşık yarım saat sürüyor";
  $("#leaveHome").textContent = TRIP.ferry.leaveHome;
  $("#leaveHomeLatest").textContent = TRIP.ferry.leaveHomeLatest;
  $("#portArrive").textContent = TRIP.ferry.portArrive;
  $("#returnDepart").textContent = TRIP.ferry.returnDepart;
  $("#returnPortArrive").textContent = TRIP.ferry.returnPortArrive;
  $("#visaLine").textContent = "🟢 " + TRIP.ferry.visa;
  $("#voucherBtn").href = TRIP.ferry.voucherUrl;

  $("#carModel").textContent = TRIP.car.company + " · " + TRIP.car.model;
  $("#carList").innerHTML =
    "<li>Teslim alma: <strong>" + TRIP.car.pickup + "</strong> — " + TRIP.car.drivers + "</li>" +
    "<li>İade: <strong>" + TRIP.car.dropoff + "</strong></li>" +
    "<li>⚠️ " + TRIP.car.deposit + "</li>" +
    "<li class=\"meta\">" + TRIP.car.booking + "</li>";
  $("#carPhone").href = telHref(TRIP.car.phone);

  $("#stayName").textContent = TRIP.stay.name;
  $("#stayArea").textContent = TRIP.stay.area + " — plaja yürüme mesafesi";
  $("#stayList").innerHTML =
    "<li>Giriş: <strong>" + TRIP.stay.checkin + "</strong></li>" +
    "<li>Çıkış: <strong>" + TRIP.stay.checkout + "</strong></li>" +
    "<li>" + TRIP.stay.parking + " · Wifi ücretsiz · Çamaşır makinesi var</li>" +
    "<li class=\"meta\">" + TRIP.stay.booking + "</li>";
  $("#stayMaps").href = TRIP.stay.mapsUrl;
  $("#stayPhone").href = telHref(TRIP.stay.phone);

  $("#pkVisa").textContent = TRIP.ferry.visa;
  $("#pkStay").textContent = TRIP.stay.name + " · " + TRIP.stay.booking;
  $("#pkCar").textContent = TRIP.car.company + " · " + TRIP.car.booking;
  $("#pkVoucher").href = TRIP.ferry.voucherUrl;
  $("#pkStayPhone").href = telHref(TRIP.stay.phone);
  $("#pkCarPhone").href = telHref(TRIP.car.phone);
  $("#pkFerryPhone").href = telHref(TRIP.ferry.phone);

  /* ---------- hero: geri sayım / canlı yolculuk paneli ---------- */
  var target = new Date(TRIP.departureISO).getTime();
  var tripEnd = target + 3 * 24 * 60 * 60 * 1000;
  var TRIP_DAYS = ["2026-07-26", "2026-07-27", "2026-07-28"];
  var DAY_TITLES = ["Merhaba Sakız!", "Mastik Diyarı", "Veda Turu"];
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function localDateStr(dt) {
    return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
  }
  function greeting(h) {
    if (h >= 5 && h < 11) return "☀️ Günaydın!";
    if (h >= 11 && h < 17) return "🏖️ İyi günler!";
    if (h >= 17 && h < 22) return "🌇 İyi akşamlar!";
    return "🌙 İyi geceler!";
  }

  var wxNow = null, wxSunset = null;
  var liveBuilt = false;
  function renderHero() {
    var box = $("#countdown");
    var now = new Date();
    var t = now.getTime();

    if (t >= tripEnd) {
      box.className = "countdown msg";
      box.innerHTML = "<div class='cell'><span class='num'>Hatıralar hâlâ taze 💙</span></div>";
      return;
    }

    if (t >= target) {
      // GEZİ MODU — canlı panel
      var dayIdx = TRIP_DAYS.indexOf(localDateStr(now));
      if (dayIdx === -1) dayIdx = Math.min(2, Math.max(0, Math.floor((t - target) / 86400000)));
      if (!liveBuilt) {
        box.className = "countdown live-wrap";
        box.innerHTML =
          "<div class='live'>" +
          "<div class='live-head' id='liveHead'></div>" +
          "<div class='live-clock' id='liveClock'></div>" +
          "<button type='button' class='live-now' id='heroNow' hidden></button>" +
          "<div class='trip-track'><span class='tt-stop' style='left:0'>26</span><span class='tt-stop' style='left:50%'>27</span><span class='tt-stop' style='left:100%'>28</span><span class='tt-ferry' id='ttFerry'>⛴️</span></div>" +
          "<div class='return-bar' id='returnBar' hidden></div>" +
          "<div class='live-wx' id='heroWx' hidden></div>" +
          "<div class='live-chips'>" +
          "<button type='button' data-go='panel-beach' data-scroll='nearCard'>📍 Yakınım</button>" +
          "<button type='button' data-go='panel-plan' data-scroll='ideaCard'>🤔 Ne yapsak?</button>" +
          "<button type='button' data-go='panel-kids'>🎯 Bingo</button>" +
          "<button type='button' data-go='panel-explore'>🗺️ Harita</button>" +
          "<a href='" + TRIP.ferry.voucherUrl + "' target='_blank' rel='noopener'>🎫 Voucher</a>" +
          "<a href='" + telHref(TRIP.stay.phone) + "'>📞 Ev sahibi</a>" +
          "</div></div>";
        liveBuilt = true;
        var h2 = $(".hero h2");
        if (h2) h2.innerHTML = "Sakız'da<span class='thin'>yız!</span>";
        var sub = $(".hero .sub");
        if (sub) sub.textContent = "Plan cebinizde, deniz önünüzde — panel sizi takip ediyor.";
        $all(".live-chips [data-go]").forEach(function (b) {
          b.addEventListener("click", function () {
            showPanel(b.dataset.go);
            var t = b.dataset.scroll && $("#" + b.dataset.scroll);
            if (t) setTimeout(function () {
              t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
              t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash");
            }, 80);
          });
        });
        $("#heroNow").addEventListener("click", function () {
          showPanel("panel-plan");
          var li = $(".tl li.now");
          if (li) setTimeout(function () { li.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); }, 80);
        });
      }
      $("#liveHead").innerHTML = greeting(now.getHours()) + " <b>" + (dayIdx + 1) + ". gün — " + DAY_TITLES[dayIdx] + "</b>";
      $("#liveClock").innerHTML = pad(now.getHours()) + ":" + pad(now.getMinutes()) + "<span>:" + pad(now.getSeconds()) + "</span>";
      var pct = Math.max(0, Math.min(100, (t - target) / (tripEnd - target) * 100));
      $("#ttFerry").style.left = pct + "%";

      // 3. gün: araç iadesi + feribot geri sayımı
      var rb = $("#returnBar");
      if (dayIdx === 2) {
        rb.innerHTML = ["🚗 Araç iadesine:16:30", "⛴️ Feribota:18:00"].map(function (spec) {
          var parts = spec.split(":");
          var label = parts[0];
          var due = new Date(now.getTime());
          due.setHours(parseInt(parts[1], 10), parseInt(parts[2], 10), 0, 0);
          var diff = due.getTime() - t;
          if (diff <= 0) return "<div class='done'><span class='rb-l'>" + label + "</span><span class='rb-v'>geçti ✓</span></div>";
          var mins = Math.floor(diff / 60000);
          var val = mins >= 60 ? Math.floor(mins / 60) + "s " + pad(mins % 60) + "dk" : mins + " dk";
          return "<div" + (mins <= 60 ? " class='urgent'" : "") + "><span class='rb-l'>" + label +
            "</span><span class='rb-v'>" + val + "</span></div>";
        }).join("");
        rb.hidden = false;
      } else {
        rb.hidden = true;
      }
      return;
    }

    // GEZİ ÖNCESİ — geri sayım
    box.className = "countdown";
    var d = target - t;
    var days = Math.floor(d / 86400000);
    var hrs = Math.floor((d % 86400000) / 3600000);
    var min = Math.floor((d % 3600000) / 60000);
    var sec = Math.floor((d % 60000) / 1000);
    box.innerHTML =
      "<div class='cell'><span class='num'>" + days + "</span><span class='lbl'>gün</span></div>" +
      "<div class='cell'><span class='num'>" + pad(hrs) + "</span><span class='lbl'>saat</span></div>" +
      "<div class='cell'><span class='num'>" + pad(min) + "</span><span class='lbl'>dakika</span></div>" +
      "<div class='cell'><span class='num'>" + pad(sec) + "</span><span class='lbl'>saniye</span></div>";
  }
  renderHero();
  setInterval(renderHero, 1000);

  /* ---------- sekmeler ---------- */
  function showPanel(id) {
    $all(".panel").forEach(function (p) { p.classList.toggle("active", p.id === id); });
    $all(".tabbar button").forEach(function (b) { b.classList.toggle("active", b.dataset.panel === id); });
    var hero = $("#hero");
    if (window.scrollY > hero.offsetHeight) window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    if (history.replaceState) history.replaceState(null, "", "#" + id.replace("panel-", ""));
  }
  $all(".tabbar button").forEach(function (b) {
    b.addEventListener("click", function () { showPanel(b.dataset.panel); });
  });
  var hash = location.hash.replace("#", "");
  if (hash && $("#panel-" + hash)) showPanel("panel-" + hash);
  window.addEventListener("hashchange", function () {
    var h = location.hash.replace("#", "");
    if (h && $("#panel-" + h)) showPanel("panel-" + h);
  });

  /* ---------- gün planı A/B ---------- */
  $all(".seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      var day = b.dataset.day, plan = b.dataset.plan;
      $all(".seg button[data-day='" + day + "']").forEach(function (x) { x.classList.toggle("active", x === b); });
      ["a", "b"].forEach(function (p) {
        var el = $("#plan-" + day + p);
        if (el) el.classList.toggle("active", p === plan);
      });
    });
  });

  /* ---------- sürpriz kartları ---------- */
  $all("[data-flip]").forEach(function (f) {
    f.addEventListener("click", function () {
      var wasOpen = f.classList.contains("open");
      f.classList.toggle("open");
      if (!wasOpen) confetti(24);
    });
  });

  /* ---------- Sakız Bingo ---------- */
  var BINGO = [
    { emo: "🖤", txt: "En yuvarlak siyah çakılı bul" },
    { emo: "🏠", txt: "En desenli evi fotoğrafla" },
    { emo: "🍦", txt: "Sakızlı dondurma tat" },
    { emo: "🕊️", txt: "Feribotta 10 martı say" },
    { emo: "🐈", txt: "Bir kediyle tanış, isim tak" },
    { emo: "👋", txt: "Birine 'Yasu!' de" },
    { emo: "🐟", txt: "Denizde balık gör" },
    { emo: "🏰", txt: "Kumdan kale yap" },
    { emo: "🌀", txt: "Labirent sokakta yolu sen bul" },
    { emo: "🍊", txt: "Portakal ya da limon ağacı bul" },
    { emo: "🌅", txt: "Gün batımını sonuna kadar izle" },
    { emo: "🍽️", txt: "Hiç bilmediğin bir yemeği dene" }
  ];
  var BKEY = "sakiz26-bingo";
  var bingoState;
  try { bingoState = JSON.parse(localStorage.getItem(BKEY) || "[]"); } catch (e) { bingoState = []; }

  var grid = $("#bingoGrid");
  BINGO.forEach(function (item, i) {
    var cell = document.createElement("button");
    cell.type = "button";
    cell.className = "bingo-cell" + (bingoState.indexOf(i) > -1 ? " done" : "");
    cell.innerHTML = "<span class='emo'>" + item.emo + "</span>" + item.txt;
    cell.addEventListener("click", function () {
      var idx = bingoState.indexOf(i);
      if (idx > -1) { bingoState.splice(idx, 1); cell.classList.remove("done"); }
      else {
        bingoState.push(i);
        cell.classList.add("done");
        confetti(18);
        if (bingoState.length === BINGO.length) {
          confetti(120);
          toast("🏆 BİNGO! Şampiyon belli oldu — madalya töreni feribotta!", 4200);
        } else {
          toast("Damga alındı! " + bingoState.length + "/" + BINGO.length + " ✔");
        }
      }
      localStorage.setItem(BKEY, JSON.stringify(bingoState));
      renderBingoStatus();
    });
    grid.appendChild(cell);
  });
  function renderBingoStatus() {
    $("#bingoStatus").textContent =
      bingoState.length === BINGO.length
        ? "🏆 HEPSİ TAMAM — ŞAMPİYON!"
        : bingoState.length + " / " + BINGO.length + " görev tamamlandı";
  }
  renderBingoStatus();
  $("#bingoReset").addEventListener("click", function () {
    bingoState = [];
    localStorage.setItem(BKEY, "[]");
    $all(".bingo-cell").forEach(function (c) { c.classList.remove("done"); });
    renderBingoStatus();
    toast("Bingo sıfırlandı — yeni tur başlasın!");
  });

  /* ---------- bavul listesi ---------- */
  var CHECKS = [
    "Pasaportlar (4 büyük + 3 çocuk) — geçerlilik tarihlerine bakıldı",
    "Kapı vizesi evrak çıktıları + feribot voucher çıktısı",
    "Gizem'in kredi kartı (araç depozitosu: 868 € limit)",
    "Ehliyetler (Musa & Gizem)",
    "Euro nakit (köy tavernaları için)",
    "Güneş kremi (50+ çocuklar için) + güneş sonrası jel",
    "Şapkalar — herkese",
    "Deniz ayakkabıları (siyah çakıl plajı!)",
    "Kolluk / deniz simidi",
    "Puset + bebek taşıyıcı (2 yaş)",
    "Bez, mama, tanıdık atıştırmalıklar (2 yaş stoğu)",
    "Ateş düşürücü + termometre + ilk yardım mini seti",
    "Şarj aletleri + powerbank",
    "Islak mendil ordusu",
    "Plaj havluları + yedek mayo",
    "Hazine avı sürprizleri (2. gün için — çocuklar görmesin 🤫)"
  ];
  var CKEY = "sakiz26-check";
  var checkState;
  try { checkState = JSON.parse(localStorage.getItem(CKEY) || "[]"); } catch (e) { checkState = []; }

  var list = $("#checklist");
  CHECKS.forEach(function (txt, i) {
    var label = document.createElement("label");
    label.className = "check" + (checkState.indexOf(i) > -1 ? " done" : "");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = checkState.indexOf(i) > -1;
    var span = document.createElement("span");
    span.textContent = txt;
    label.appendChild(box);
    label.appendChild(span);
    box.addEventListener("change", function () {
      var idx = checkState.indexOf(i);
      if (box.checked && idx === -1) checkState.push(i);
      if (!box.checked && idx > -1) checkState.splice(idx, 1);
      label.classList.toggle("done", box.checked);
      localStorage.setItem(CKEY, JSON.stringify(checkState));
      if (checkState.length === CHECKS.length) {
        confetti(80);
        toast("🧳 Bavullar tamam — Sakız sizi bekliyor!");
      }
    });
    list.appendChild(label);
  });
  $("#checkReset").addEventListener("click", function () {
    checkState = [];
    localStorage.setItem(CKEY, "[]");
    $all("#checklist input").forEach(function (b) { b.checked = false; });
    $all("#checklist .check").forEach(function (c) { c.classList.remove("done"); });
    toast("Liste sıfırlandı.");
  });

  /* ---------- ada haritası navigasyonu ---------- */
  $all(".map-dot").forEach(function (dot) {
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("role", "button");
    function go() {
      var target = dot.dataset.target, panel = dot.dataset.panel;
      showPanel(panel);
      var card = $("#" + target);
      if (!card) return;
      setTimeout(function () {
        card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        card.classList.remove("flash");
        void card.offsetWidth;
        card.classList.add("flash");
      }, 60);
    }
    dot.addEventListener("click", go);
    dot.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  /* ---------- hava durumu (Open-Meteo, anahtarsız) ---------- */
  (function weather() {
    var WKEY = "sakiz26-wx";
    var DAY_NAMES = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    var ICONS = [
      [0, "☀️"], [1, "🌤️"], [2, "⛅"], [3, "☁️"], [45, "🌫️"], [48, "🌫️"],
      [51, "🌦️"], [61, "🌧️"], [80, "🌧️"], [95, "⛈️"]
    ];
    function icon(code) {
      var best = "☀️";
      ICONS.forEach(function (p) { if (code >= p[0]) best = p[1]; });
      return best;
    }
    function render(data) {
      var d = data.daily;
      if (!d || !d.time) return;
      var html = "";
      for (var i = 0; i < Math.min(3, d.time.length); i++) {
        var date = new Date(d.time[i] + "T12:00:00");
        var label = date.getDate() + " Tem · " + DAY_NAMES[date.getDay()];
        html += "<div class='wx-day'><div class='d'>" + label + "</div>" +
          "<div class='i'>" + icon(d.weather_code[i]) + "</div>" +
          "<div class='tt'>" + Math.round(d.temperature_2m_max[i]) + "°</div>" +
          "<div class='tn'>gece " + Math.round(d.temperature_2m_min[i]) + "°</div>" +
          "<div class='w'>💨 " + Math.round(d.wind_speed_10m_max[i]) + " km/s</div></div>";
      }
      $("#wxStrip").innerHTML = html;
      $("#wxNote").textContent = "Deniz zaten harika olacak — rüzgâr 20 km/s üstüyse feribotta üst güverte serin olur.";
      $("#weatherCard").hidden = false;

      // hero canlı paneline anlık hava + gün batımı
      var todayIdx = Math.max(0, d.time.indexOf(localDateStr(new Date())));
      wxSunset = d.sunset && d.sunset[todayIdx] ? d.sunset[todayIdx].slice(11, 16) : null;
      if (data.current) wxNow = data.current;
      var hw = $("#heroWx");
      if (hw && wxNow) {
        hw.innerHTML = "Şu an <b>" + Math.round(wxNow.temperature_2m) + "°</b> " +
          icon(wxNow.weather_code) +
          " · 💨 " + Math.round(wxNow.wind_speed_10m) + " km/s" +
          (wxSunset ? " · 🌇 gün batımı <b>" + wxSunset + "</b>" : "");
        hw.hidden = false;
      }
    }
    try {
      var cached = JSON.parse(localStorage.getItem(WKEY) || "null");
      if (cached && Date.now() - cached.at < 3 * 3600 * 1000) render(cached.data);
    } catch (e) {}
    var url = "https://api.open-meteo.com/v1/forecast?latitude=38.37&longitude=26.14" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,sunset" +
      "&current=temperature_2m,weather_code,wind_speed_10m" +
      "&timezone=Europe%2FAthens&start_date=2026-07-26&end_date=2026-07-28";
    if (Date.now() > new Date("2026-07-13").getTime() && Date.now() < tripEnd) {
      fetch(url).then(function (r) { return r.json(); }).then(function (data) {
        render(data);
        localStorage.setItem(WKEY, JSON.stringify({ at: Date.now(), data: data }));
      }).catch(function () {});
    }
  })();

  /* ---------- "şu an neredeyiz?" modu ---------- */
  (function nowMode() {
    var DAYS = ["2026-07-26", "2026-07-27", "2026-07-28"];
    function localDate() {
      var n = new Date();
      return n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate());
    }
    function setHeroNow(html) {
      var hn = $("#heroNow");
      if (!hn) return;
      hn.innerHTML = html;
      hn.hidden = false;
    }
    function update() {
      var today = localDate();
      var dayIdx = DAYS.indexOf(today);
      var banner = $("#nowBanner");
      $all(".tl li.now").forEach(function (li) { li.classList.remove("now"); });
      if (dayIdx === -1) { banner.hidden = true; return; }
      var dayCards = $all(".day-card");
      var card = dayCards[dayIdx];
      if (!card) { banner.hidden = true; return; }
      var plan = card.querySelector(".plan.active");
      if (!plan) { banner.hidden = true; return; }
      var items = $all(".tl > li", plan);
      var now = new Date();
      var mins = now.getHours() * 60 + now.getMinutes();
      var active = -1;
      items.forEach(function (li, i) {
        var t = li.querySelector(".t").textContent.trim().split(":");
        var m = parseInt(t[0], 10) * 60 + parseInt(t[1], 10);
        if (mins >= m) active = i;
      });
      if (active === -1) {
        banner.hidden = false;
        banner.innerHTML = "🌙 Bugün " + (dayIdx + 1) + ". gün! İlk adım: <strong>" +
          items[0].querySelector(".what").textContent + "</strong> (" + items[0].querySelector(".t").textContent + ")";
        setHeroNow("İlk adım · <b>" + items[0].querySelector(".t").textContent + " " +
          items[0].querySelector(".what").textContent + "</b>");
        return;
      }
      items[active].classList.add("now");
      var cur = items[active].querySelector(".what").textContent;
      var nextEl = items[active + 1];
      banner.hidden = false;
      banner.innerHTML = "📍 Şu an: <strong>" + cur + "</strong>" +
        (nextEl ? "<span class='nb-next'>Sırada (" + nextEl.querySelector(".t").textContent + "): " +
          nextEl.querySelector(".what").textContent + "</span>" : "");
      setHeroNow("📍 <b>" + cur + "</b>" +
        (nextEl ? "<span class='ln-next'>Sırada · " + nextEl.querySelector(".t").textContent + " " +
          nextEl.querySelector(".what").textContent + " ›</span>" : ""));
    }
    update();
    setInterval(update, 60 * 1000);
    $all(".seg button").forEach(function (b) { b.addEventListener("click", function () { setTimeout(update, 50); }); });
  })();

  /* ---------- PWA: çevrimdışı destek ---------- */
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }

  /* ---------- konum yardımcıları ---------- */
  var lastPos = null;
  try { lastPos = JSON.parse(sessionStorage.getItem("sakiz26-pos") || "null"); } catch (e) {}

  function haversine(a1, o1, a2, o2) {
    var R = 6371, rad = Math.PI / 180;
    var dLa = (a2 - a1) * rad, dLo = (o2 - o1) * rad;
    var x = Math.sin(dLa / 2) * Math.sin(dLa / 2) +
      Math.cos(a1 * rad) * Math.cos(a2 * rad) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
  }
  function fmtDist(km) {
    if (km < 0.06) return "buradasın";
    return km < 1 ? Math.round(km * 1000) + " m" : km.toFixed(1).replace(".", ",") + " km";
  }
  function fmtTravel(km) {
    if (km < 0.06) return "🎯";
    if (km < 0.9) return "yürüme";
    return "~" + Math.max(2, Math.round(km / 38 * 60)) + " dk";
  }
  function mapsUrl(q) { return "https://maps.google.com/?q=" + encodeURIComponent(q); }
  function nearestOf(type, skip) {
    if (!lastPos) return null;
    var list = PLACES.filter(function (p) { return !type || p.t === type; })
      .map(function (p) { return { p: p, km: haversine(lastPos.la, lastPos.lo, p.la, p.lo) }; })
      .sort(function (a, b) { return a.km - b.km; });
    return list[(skip || 0) % Math.max(1, list.length)] || null;
  }
  function askPos(onOk, onFail) {
    if (!navigator.geolocation) { onFail("Bu tarayıcı konum paylaşmıyor."); return; }
    navigator.geolocation.getCurrentPosition(function (p) {
      lastPos = { la: p.coords.latitude, lo: p.coords.longitude };
      try { sessionStorage.setItem("sakiz26-pos", JSON.stringify(lastPos)); } catch (e) {}
      onOk(lastPos);
    }, function () {
      onFail("Konum alınamadı — tarayıcıya konum izni vermeniz gerekiyor.");
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 120000 });
  }

  /* ---------- "Yanımda ne var?" ---------- */
  var nearFilter = "all";
  var ICO = { beach: "🏖️", spot: "🏘️", food: "🍽️" };
  function renderNear() {
    if (!lastPos) return;
    var rows = PLACES
      .map(function (p) { return { p: p, km: haversine(lastPos.la, lastPos.lo, p.la, p.lo) }; })
      .filter(function (x) { return nearFilter === "all" || x.p.t === nearFilter; })
      .sort(function (a, b) { return a.km - b.km; })
      .slice(0, 8);
    $("#nearList").innerHTML = rows.map(function (x, i) {
      return "<a class='near-row" + (i === 0 ? " closest" : "") + "' href='" + mapsUrl(x.p.q) +
        "' target='_blank' rel='noopener'><span class='nr-ico'>" + ICO[x.p.t] + "</span>" +
        "<span class='nr-main'><span class='nr-name'>" + x.p.n + "</span>" +
        "<span class='nr-desc'>" + x.p.d + "</span></span>" +
        "<span class='nr-dist'>" + fmtDist(x.km) + "<small>" + fmtTravel(x.km) + "</small></span></a>";
    }).join("");
    $("#nearFilters").hidden = false;
    $("#nearBtn").textContent = "🔄 Konumu yenile";
  }
  $("#nearBtn").addEventListener("click", function () {
    var b = $("#nearBtn"), old = b.textContent;
    b.textContent = "Konum alınıyor…";
    askPos(function () { b.textContent = old; renderNear(); },
      function (msg) { b.textContent = old; toast(msg, 4000); });
  });
  $all("#nearFilters button").forEach(function (b) {
    b.addEventListener("click", function () {
      nearFilter = b.dataset.f;
      $all("#nearFilters button").forEach(function (x) { x.classList.toggle("active", x === b); });
      renderNear();
    });
  });
  if (lastPos) renderNear();

  /* ---------- "Şimdi ne yapsak?" ---------- */
  var ideaTurn = 0;
  function buildIdea() {
    var now = new Date();
    var h = now.getHours() + now.getMinutes() / 60;
    var temp = wxNow ? Math.round(wxNow.temperature_2m) : null;
    var wind = wxNow ? Math.round(wxNow.wind_speed_10m) : null;
    var isDay3 = localDateStr(now) === TRIP_DAYS[2];
    var want = "beach", head, why;

    if (isDay3 && h >= 14) {
      want = "spot";
      head = "Toparlanma vakti";
      why = "Araç iadesi 16:30, feribot 18:00. Uzağa gitmeyin — Chios Town çevresinde kalın, hediyelikleri şimdi alın.";
      return { head: head, why: why, place: { n: "Chios Town — Aplotaria Çarşısı", q: "Aplotaria Street Chios" }, km: null };
    }
    if (h < 8) { want = "beach"; head = "Erken deniz"; why = "8'den önce plajlar tenha, güneş yumuşak — kahvaltıyı sonraya bırakın."; }
    else if (h < 11) { want = "spot"; head = "Köy vakti"; why = "Sabah serinliğinde taş sokaklar en keyifli; 11'den sonra ısınıyor."; }
    else if (h < 13) { want = "beach"; head = "Deniz zamanı"; why = "Öğleden önceki son rahat saat — 13:00'ten sonra gölgeye kaçmak lazım."; }
    else if (h < 15.5) { want = "food"; head = "Gölgede uzun öğle"; why = (temp ? "Günün en sıcak saati (" + temp + "°). " : "") + "Tavernada uzun bir öğle + 2 yaşa şekerleme molası."; }
    else if (h < 17.5) { want = "beach"; head = "İkindi denizi"; why = "Güneş eğildi, su hâlâ sıcak — kumdan kale için en iyi saat."; }
    else if (h < 20) { want = "beach"; head = "Altın saat"; why = "Gün batımına doğru fotoğraflar bambaşka oluyor" + (wxSunset ? " — bugün batış " + wxSunset + "." : "."); }
    else if (h < 22.5) { want = "food"; head = "Akşam yemeği"; why = "Tavernalar şimdi doluyor; 20:30'u geçirmeden masaya oturun."; }
    else { want = "food"; head = "Son bir dondurma"; why = "Çocuklar yorgunsa kordonda kısa bir tur + dondurma, sonra yatış."; }

    if (wind && wind >= 28 && want === "beach") {
      why = "💨 Rüzgâr " + wind + " km/s — korunaklı koy seçin, açık plajlarda şemsiye uçar. " + why;
    }
    if (temp && temp >= 34 && h >= 11 && h < 17.5) {
      why = "🌡️ " + temp + "° — gölgesi olan yeri tercih edin, şapka şart. " + why;
    }

    var hit = nearestOf(want, ideaTurn);
    if (hit) return { head: head, why: why, place: hit.p, km: hit.km };
    var fallback = { beach: { n: "Karfas Plajı", q: "Karfas Beach Chios" }, spot: { n: "Pyrgi", q: "Pyrgi Chios" }, food: { n: "Karatzas", q: "Karatzas Karfas Chios" } };
    return { head: head, why: why, place: fallback[want], km: null };
  }
  function showIdea() {
    var i = buildIdea();
    var out = $("#ideaOut");
    out.innerHTML = "<b>" + i.head + " → " + i.place.n + "</b>" +
      (i.km !== null ? " <span class='rate'>" + fmtDist(i.km) + " · " + fmtTravel(i.km) + "</span>" : "") +
      "<span class='io-why'>" + i.why + "</span>" +
      "<a href='" + mapsUrl(i.place.q) + "' target='_blank' rel='noopener'>📍 Yol tarifi</a>";
    out.hidden = false;
    $("#ideaBtn").textContent = "🔄 Başka bir şey öner";
  }
  $("#ideaBtn").addEventListener("click", function () {
    if ($("#ideaOut").hidden && !lastPos) {
      var b = $("#ideaBtn"), old = b.textContent;
      b.textContent = "Konum alınıyor…";
      askPos(function () { b.textContent = old; showIdea(); },
        function () { b.textContent = old; showIdea(); });
      return;
    }
    ideaTurn++;
    showIdea();
  });

  /* ---------- gizli sürpriz: damlaya 5 kez dokun ---------- */
  var taps = 0, tapTimer;
  $("#logoDrop").addEventListener("click", function () {
    taps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(function () { taps = 0; }, 1600);
    if (taps >= 5) {
      taps = 0;
      confetti(120);
      toast("🤫 Gizli damlayı buldunuz! Ödül: dönüşte kebaplar bunu bulandan 😄", 4200);
    }
  });
})();
