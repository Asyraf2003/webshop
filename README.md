# Paperplay Webshop

Toko konsep satu halaman dengan React, TypeScript, dan Vite. Alurnya mencakup katalog, kategori, pencarian, detail varian, keranjang lokal, dan checkout simulasi.

```sh
npm ci
npm run dev
npm run build -- --base=./
```

- `src/catalog.ts` berisi empat model contoh. Roket memakai tiga WebP transparan. Tiga model lain memakai ilustrasi konsep SVG.
- `src/main.tsx` memisahkan kartu katalog, pratinjau, dan detail produk. Keranjang mengelompokkan produk berdasarkan model, warna, dan ukuran.
- `src/styles.css` mengatur komposisi rata kanan, ukuran layar, dan transisi. Warna memakai crossfade. Ukuran memakai skala dari titik pijak tetap. Animasi mengikuti preferensi reduced motion.

Checkout adalah simulasi. Semua harga dan tinggi adalah contoh. Jika ukuran asli punya proporsi berbeda, gunakan aset tersendiri untuk varian tersebut.

## Referensi desain

| Area | Acuan | Adaptasi |
| --- | --- | --- |
| Alur toko | [Wuffy Play and Learn](https://wuffyplayandlearn.com/) | Koleksi, detail, dan keranjang dalam satu halaman |
| Kartu katalog | [UI.live](https://ui.live/) | Judul dan harga tetap terbaca saat kartu bergerak |
| Galeri varian | [Skiper UI — Apple Carousel](https://skiper-ui.com/v1/skiper77) | Perpindahan gambar dengan crossfade dan posisi tetap |
| Feedback pilihan | [Its Hover](https://www.itshover.com/) | Ikon centang ketika opsi dipilih atau produk ditambah |
| Motion | [Prompt Motion](https://prompt-motion.com/) | Gerakan pendek yang membedakan warna, ukuran, dan panel |

Implementasi dan ilustrasi SVG dibuat untuk proyek ini. Referensi dipakai sebagai acuan perilaku dan komposisi.
