# Paperplay Webshop

Prototipe toko mainan statis dengan React, TypeScript, dan Vite. Beranda menampilkan pilihan promo, katalog, dan detail produk yang dapat dibagikan.

```sh
npm ci
npm run dev
npm run build -- --base=./
```

## Struktur

| Bagian | File | Isi |
| --- | --- | --- |
| Model dan aturan toko | `src/catalog.ts`, `src/shop.ts` | Produk, media, stok per varian, harga voucher, dan perhitungan keranjang |
| Adapter browser | `src/store-state.ts` | Keranjang lokal, daftar tersimpan, bahasa, dan tautan produk |
| Alur aplikasi | `src/main.tsx` | Navigasi, filter, pemilihan produk, dan alur checkout demo |
| Beranda dan navigasi | `src/home-stage.tsx`, `src/site-chrome.tsx`, `src/home.css` | Latar SVG halaman, hero promo, dan menu yang membuka dari tombol |
| View toko | `src/storefront.tsx`, `src/product-detail.tsx`, `src/cart-panel.tsx` | Katalog, media dan spesifikasi produk, keranjang, dan checkout |
| Komponen bersama | `src/commerce-ui.tsx`, `src/icons.tsx`, `src/product-art.tsx` | Harga, rating, kuantitas, panel dialog, ikon, dan gambar produk |
| Gerak dan bahasa | `src/motion.tsx`, `src/paperplay.css`, `src/locale.ts` | NumberFlow, WAAPI, gaya dasar, dan teks ID/EN |

GSAP mengatur reveal hero, perpindahan kartu, perpindahan gambar dari promo ke detail, dan panel keranjang. Gerakan mengikuti preferensi reduced motion. Harga, voucher, rating, stok, dan checkout memakai data demo.

## Referensi desain

- [Lusion](https://lusion.co/) untuk panel menu di bawah tombol dan latar visual yang berlanjut antarbagiannya. Paperplay memakai tiga bentuk SVG dari pengguna sebagai latar halaman.
- [Oryzo](https://oryzo.ai/) untuk penempatan satu produk sebagai pusat hero.
- [Duten](https://www.duten.com/en/) untuk respons ringan terhadap gerakan pointer.
- [Codrops Hover Motion & Transition Image Grid](https://tympanus.net/Development/IntroGridMotionTransition/) untuk kontinuitas visual dari foto promo ke detail.
