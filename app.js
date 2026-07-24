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

  /* ---------- geri sayım ---------- */
  var target = new Date(TRIP.departureISO).getTime();
  var tripEnd = target + 3 * 24 * 60 * 60 * 1000;
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function renderCountdown() {
    var box = $("#countdown");
    var now = Date.now();
    if (now >= tripEnd) {
      box.className = "countdown msg";
      box.innerHTML = "<div class='cell'><span class='num'>Hatıralar hâlâ taze 💙</span></div>";
      return;
    }
    if (now >= target) {
      box.className = "countdown msg";
      box.innerHTML = "<div class='cell'><span class='num'>🎉 Macera başladı — iyi eğlenceler!</span></div>";
      return;
    }
    var d = target - now;
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
  renderCountdown();
  setInterval(renderCountdown, 1000);

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
