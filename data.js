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
