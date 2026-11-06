# Paperplay Webshop

Toko konsep React, TypeScript, dan Vite dengan katalog, promo voucher demo, detail produk, dan keranjang lokal.

```sh
npm ci
npm run dev
npm run build -- --base=./
```

## Struktur

| Bagian | File | Isi |
| --- | --- | --- |
| Data dan aturan toko | `src/catalog.ts`, `src/shop.ts` | Produk, media, stok per varian, harga voucher, dan perhitungan keranjang |
| Adapter browser | `src/store-state.ts` | Keranjang, daftar tersimpan, bahasa, dan tautan produk |
| Antarmuka toko | `src/storefront.tsx`, `src/product-detail.tsx`, `src/cart-panel.tsx` | Header, menu, promo, katalog, detail, keranjang, dan checkout demo |
| Komponen bersama | `src/commerce-ui.tsx`, `src/icons.tsx`, `src/product-art.tsx` | Harga, rating, kuantitas, panel dialog, ikon keranjang, dan media |
| Gerak dan bahasa | `src/motion.tsx`, `src/paperplay.css`, `src/locale.ts` | NumberFlow, WAAPI, transisi, dan teks ID/EN |

GSAP mengatur roll promo, perpindahan kartu, menu layar penuh, dan lipatan panel keranjang. Gerakan mengikuti preferensi reduced motion. Keranjang, bookmark, dan pilihan bahasa disimpan di browser. Harga, voucher, rating, jumlah terjual, dan stok adalah data demo. Checkout adalah simulasi.

## Referensi desain

- Screenshot marketplace dari pengguna untuk hierarki harga, voucher, rating, spesifikasi, dan deskripsi.
- [Lusion](https://lusion.co/) untuk arah menu layar penuh, dengan transisi yang dibuat untuk Paperplay.
- [Skiper UI — Animated Number 37](https://skiper-ui.com/v1/skiper37) dan [NumberFlow](https://number-flow.barvian.me/) untuk digit harga, ukuran, dan jumlah.
- Screenshot roll dan tiga bentuk SVG dari pengguna untuk galeri yang kembali lurus setelah gerak selesai.
