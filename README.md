# Sakız Adası '26 🌊

İki ailenin 26–28 Temmuz 2026 Sakız Adası (Chios) gezisi için mobil öncelikli rehber sitesi.

## İçerik

- **Plan** — feribot / araç / konaklama künyesi + A/B seçenekli 3 günlük program ve günlük sürpriz kartları
- **Plajlar** — çocuk uygunluk puanlı plaj rehberi, harita bağlantılı
- **Keşif** — mastik köyleri, gezilecek yerler, lezzetler ve alışveriş
- **Çocuklar** — Sakız Bingo oyunu (telefonda kayıtlı kalır), mini Yunanca sözlük, araç oyunları
- **Cepte** — rezervasyon numaraları, telefonlar, pratik bilgiler, bavul listesi

Gizli sürpriz: üstteki sakız damlasına 5 kez dokunun. 🤫

## Özellikler

- **PWA / çevrimdışı**: Telefonda "Ana ekrana ekle" deyin — adada internet olmasa bile site açılır (uydu görselleri dahil önbelleğe alınır).
- **"Şu an neredeyiz?"**: Gezi günlerinde (26–28 Tem) Plan sekmesi saate bakıp aktif adımı turuncu vurgular, sıradakini gösterir.
- **Canlı hava durumu**: Sakız için 26–28 Temmuz tahmini (Open-Meteo, anahtarsız); son cevap önbellekte tutulur.
- **Dokunmatik ada haritası**: Keşif sekmesindeki haritada noktaya dokun, ilgili karta ışınlan.
- **Gerçek görüntüler**: Kart afişleri her lokasyonun gerçek uydu görüntüsü (`images/`, © Google).

## Bilgileri güncelleme

Tüm rezervasyon bilgileri **`data.js`** dosyasında. Saat/telefon/link değişirse sadece o dosyayı düzenleyin — siteye otomatik yansır.

## Deploy (Vercel)

Statik site — derleme gerekmez. Vercel'de repo'yu import etmek yeterli (Framework Preset: **Other**, build komutu yok, output: kök dizin).

## Yerelde çalıştırma

```bash
python3 -m http.server 8000
# http://localhost:8000
```
