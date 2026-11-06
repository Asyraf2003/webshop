# Paperplay Webshop

Toko mainan statis dengan React, TypeScript, dan Vite. Katalog berisi 34 produk, dengan 30 produk tambahan yang masing-masing punya satu varian. Bahasa Indonesia dan Inggris tersedia di header.

```sh
npm ci
npm run dev
npm run build -- --base=./
```

## Struktur

| Bagian | File | Isi |
| --- | --- | --- |
| Model katalog | `src/catalog.ts`, `src/extra-catalog.ts`, `src/shop.ts` | Produk, media, stok varian, harga voucher, dan perhitungan keranjang |
| Model checkout | `src/checkout-model.ts` | Validasi alamat, tarif dan estimasi per wilayah, metode pembayaran, serta total pesanan |
| Adapter browser | `src/store-state.ts` | Keranjang lokal, daftar tersimpan, bahasa, dan tautan produk |
| Alur aplikasi | `src/main.tsx` | Navigasi, filter, pemilihan produk, dan perpindahan panel |
| Beranda dan navigasi | `src/home-stage.tsx`, `src/site-chrome.tsx`, `src/home.css` | Latar kertas, hero promo, header, dan footer |
| View toko | `src/storefront.tsx`, `src/product-detail.tsx`, `src/cart-panel.tsx`, `src/checkout-panel.tsx` | Katalog, spesifikasi produk, keranjang, dan checkout |
| Komponen bersama | `src/commerce-ui.tsx`, `src/icons.tsx`, `src/product-art.tsx` | Harga, rating, kuantitas, dialog, ikon, dan gambar produk |
| Gerak dan bahasa | `src/motion.tsx`, `src/paperplay.css`, `src/locale.ts` | NumberFlow, WAAPI, gaya dasar, dan teks ID/EN |

Hero berpindah tiap tiga detik. Rotasi berhenti saat dijeda, mendapat fokus keyboard, pointer mouse berada di area promo, atau preferensi reduced motion aktif. GSAP mengatur reveal, perpindahan gambar ke detail, dan panel keranjang.

Checkout menghitung promo produk otomatis, menampilkan ongkir dan estimasi, lalu membuat ringkasan lokal. Data katalog, stok, ulasan, ongkir, dan metode pembayaran untuk simulasi. Alamat disimpan di state saat checkout. Browser hanya menyimpan keranjang, favorit, dan bahasa. Pembayaran dan pengiriman belum terhubung ke layanan eksternal.

## Referensi desain

- [Codrops Paper, Curated](https://tympanus.net/codrops/2026/10/28/paper-design-tutorials-tips-tools/) menginspirasi tekstur kertas dan grain. Latar Paperplay dibuat dengan CSS dan SVG.
- [Playdate](https://play.date/) menginspirasi penempatan satu produk sebagai fokus hero.
- [Codrops Hover Motion & Transition Image Grid](https://tympanus.net/Development/IntroGridMotionTransition/) menginspirasi transisi gambar dari promo ke detail.
- [W3C Carousels Tutorial](https://www.w3.org/WAI/tutorials/carousels/) menjadi acuan kontrol rotasi promo.
- [Baymard](https://baymard.com/research-articles/checkout-usability-apply-buttons) menjadi acuan promo otomatis dengan nominal potongan di ringkasan.
- [Stripe](https://stripe.com/resources/more/checkout-ui-strategies-for-faster-and-more-intuitive-transactions) menjadi acuan tahapan checkout dan ringkasan biaya.
