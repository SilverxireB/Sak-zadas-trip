/* ============================================================
   GEZİ BİLGİLERİ — tüm rezervasyon bilgileri burada.
   Bir şey değişirse sadece bu dosyayı düzenlemeniz yeterli.
   ============================================================ */

const TRIP = {
  // Yola çıkış anı (geri sayım bunu hedefler)
  departureISO: "2026-07-26T05:30:00+03:00",
  dates: "26 – 28 Temmuz 2026",

  ferry: {
    company: "Feribotlines",
    route: "Çeşme → Sakız (Chios)",
    depart: "09:00",
    leaveHome: "05:30",
    leaveHomeLatest: "06:00",
    portArrive: "07:30",
    returnDepart: "18:00",
    returnPortArrive: "16:45",
    voucherUrl: "https://feribotlines.com/voucher/8d1c18bf-05c4-4a6d-9607-902612c0fe98",
    phone: "+90 850 885 0097",
    visa: "Kapı vizesi ONAYLANDI — FLVOA22408397"
  },

  car: {
    company: "Avance (DiscoverCars)",
    model: "Renault Clio vb. — otomatik, 5 kişilik",
    pickup: "26 Tem 09:30 · Neorion 3, Chios (liman yakını)",
    dropoff: "28 Tem · feribottan önce iade (hedef 16:30)",
    drivers: "Musa & Gizem teslim alacak",
    deposit: "868 € depozito — Gizem adına kredi kartı şart (üzerinde numarası yazılı fiziksel kart)",
    booking: "D014472400 · Onay: 4LD0E0",
    phone: "+30 227 102 1666"
  },

  stay: {
    name: "Chios Shallow Sea",
    area: "Karfas — Plaka, 10th street",
    checkin: "26 Tem 15:00 – 22:00 (karşılamaya gelecekler)",
    checkout: "28 Tem en geç 11:00",
    parking: "Ücretsiz otopark var",
    booking: "Booking no: 6771150101 · PIN: 3148",
    phone: "+30 227 103 0399",
    mapsUrl: "https://maps.google.com/?q=Chios+Shallow+Sea+Karfas"
  },

  kebab: {
    name: "Spor Kebapçısı — Manisa",
    note: "Dönüş yolunda akşam yemeği: Ali Koç'un da yediği meşhur Manisa kebabı 🍢",
    mapsUrl: "https://maps.google.com/?q=Spor+Kebap+Manisa"
  }
};

/* "Yanımda ne var?" için yerler — tip: beach | spot | food
   Koordinatlar mesafe sıralaması için; linkler isimle aranır. */
const PLACES = [
  { n: "Karfas Plajı",        t: "beach", la: 38.3195, lo: 26.1541, q: "Karfas Beach Chios",        d: "Evin önü · kum, sığ" },
  { n: "Megas Limnionas",     t: "beach", la: 38.3121, lo: 26.1553, q: "Megas Limnionas Beach",     d: "Kum, sığ, taverna" },
  { n: "Agia Fotini",         t: "beach", la: 38.3000, lo: 26.1425, q: "Agia Fotini Beach Chios",   d: "Beyaz çakıl, berrak" },
  { n: "Komi Plajı",          t: "beach", la: 38.2018, lo: 26.0462, q: "Komi Beach Chios",          d: "Uzun kumsal, çok sığ" },
  { n: "Mavra Volia",         t: "beach", la: 38.1798, lo: 26.0233, q: "Mavra Volia Beach",         d: "Siyah çakıl · ayakkabı!" },
  { n: "Vroulidia",           t: "beach", la: 38.1566, lo: 26.0050, q: "Vroulidia Beach Chios",     d: "Saklı koy, merdivenli" },
  { n: "Lithi Plajı",         t: "beach", la: 38.3414, lo: 25.9927, q: "Lithi Beach Chios",         d: "Kum + balık tavernası" },
  { n: "Elinda",              t: "beach", la: 38.3255, lo: 25.9910, q: "Elinda Beach Chios",        d: "Dalgasız, gün batımı" },
  { n: "Agia Dynami",         t: "beach", la: 38.2230, lo: 25.9390, q: "Agia Dynami Beach Chios",   d: "Turkuaz mini koy" },
  { n: "Chios Town",          t: "spot",  la: 38.3688, lo: 26.1358, q: "Chios Town",                d: "Kordon, çarşı, kale" },
  { n: "Pyrgi",               t: "spot",  la: 38.2273, lo: 25.9992, q: "Pyrgi Chios",               d: "Desenli evler" },
  { n: "Mesta",               t: "spot",  la: 38.2602, lo: 25.9221, q: "Mesta Chios",               d: "Labirent taş köy" },
  { n: "Olympi Mağarası",     t: "spot",  la: 38.2340, lo: 25.9490, q: "Olympi Cave Chios",         d: "Sarkıt-dikit, rehberli" },
  { n: "Sakız Müzesi",        t: "spot",  la: 38.2137, lo: 26.0180, q: "Chios Mastic Museum",       d: "Sakız ağaçlı bahçe" },
  { n: "Anavatos",            t: "spot",  la: 38.4021, lo: 26.0204, q: "Anavatos Chios",            d: "Hayalet köy" },
  { n: "Nea Moni",            t: "spot",  la: 38.3747, lo: 26.0558, q: "Nea Moni Chios",            d: "1000 yıllık manastır" },
  { n: "Daskalopetra",        t: "spot",  la: 38.4237, lo: 26.1361, q: "Daskalopetra Chios",        d: "Homeros'un Kayası" },
  { n: "Kambos",              t: "spot",  la: 38.3450, lo: 26.1330, q: "Kambos Chios",              d: "Narenciye köşkleri" },
  { n: "Vrontados değirmen",  t: "spot",  la: 38.4130, lo: 26.1372, q: "Windmills of Chios Vrontados", d: "Deniz kenarı fotoğraf" },
  { n: "Bachari",             t: "food",  la: 38.3095, lo: 26.1490, q: "Bachari Agia Ermioni Chios", d: "Deniz ürünleri ★4,6" },
  { n: "Hotzas",              t: "food",  la: 38.3660, lo: 26.1330, q: "Hotzas Tavern Chios",        d: "Adanın klasiği ★4,4" },
  { n: "The Pastards",        t: "food",  la: 38.3690, lo: 26.1370, q: "The Pastards Chios",         d: "Pizza & makarna ★4,6" },
  { n: "Kronos dondurma",     t: "food",  la: 38.3680, lo: 26.1350, q: "Kronos Ice Cream Chios",     d: "1930'dan beri 🍦" },
  { n: "Meltemaki",           t: "food",  la: 38.2585, lo: 26.1150, q: "Meltemaki Katarraktis Chios", d: "Masalar denizde" },
  { n: "Pizza Likos",         t: "food",  la: 38.2020, lo: 26.0455, q: "Pizza Likos Komi Chios",     d: "Pizza + pide ★4,0" },
  { n: "Kyra Despoina",       t: "food",  la: 38.3410, lo: 25.9930, q: "Kyra Despoina Lithi Chios",  d: "Taze balık ★4,2" },
  { n: "Mestousiko",          t: "food",  la: 38.2600, lo: 25.9225, q: "Mestousiko Mesta Chios",     d: "Izgara ★4,0" },
  { n: "To Asteri",           t: "food",  la: 38.3810, lo: 26.0250, q: "To Asteri Avgonima Chios",   d: "Manzaralı teras ★4,5" },
  { n: "Emporios limanı",     t: "food",  la: 38.1830, lo: 26.0290, q: "Emporios Chios",             d: "Koy tavernaları" }
];
