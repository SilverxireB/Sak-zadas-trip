# Sakız Adası '26 🌊

İki ailenin 26–28 Temmuz 2026 Sakız Adası (Chios) gezisi için mobil öncelikli rehber sitesi.

## İçerik

- **Plan** — feribot / araç / konaklama künyesi + A/B seçenekli 3 günlük program ve günlük sürpriz kartları
- **Plajlar** — çocuk uygunluk puanlı plaj rehberi, harita bağlantılı
- **Keşif** — mastik köyleri, gezilecek yerler, lezzetler ve alışveriş
- **Çocuklar** — Sakız Bingo oyunu (telefonda kayıtlı kalır), mini Yunanca sözlük, araç oyunları
- **Cepte** — rezervasyon numaraları, telefonlar, pratik bilgiler, bavul listesi

Gizli sürpriz: üstteki sakız damlasına 5 kez dokunun. 🤫

## Bilgileri güncelleme

Tüm rezervasyon bilgileri **`data.js`** dosyasında. Saat/telefon/link değişirse sadece o dosyayı düzenleyin — siteye otomatik yansır.

## Deploy (Vercel)

Statik site — derleme gerekmez. Vercel'de repo'yu import etmek yeterli (Framework Preset: **Other**, build komutu yok, output: kök dizin).

## Yerelde çalıştırma

```bash
python3 -m http.server 8000
# http://localhost:8000
```
