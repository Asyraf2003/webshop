# Paperplay Webshop

Toko konsep satu halaman dengan React, TypeScript, dan Vite. Cari mainan, lihat harga dan varian, simpan favorit, dan coba checkout simulasi. Galeri roll ada di bawah katalog.

```sh
npm ci
npm run dev
npm run build -- --base=./
```

## Komponen

- `src/motion.tsx` berisi `RollWall`, `RollingNumber`, `PaperMark`, dan gerakan ukuran produk. Setiap animasi roll berakhir dengan transform kosong. Opsi reduced motion dihormati.
- `src/icons.tsx` menggabungkan ikon antarmuka animatif dan aset e-commerce dari Figma. Aset Figma disimpan sebagai file SVG asli di `public/figma`.
- `src/catalog.ts` berisi empat model contoh. Roket memakai satu WebP transparan per warna. Model lain memakai ilustrasi SVG konsep.
- `src/main.tsx` berisi alur katalog, filter, detail, daftar tersimpan, keranjang dan checkout. Keranjang dan favorit disimpan di browser.
- `src/styles.css` mengatur katalog terang, galeri gelap, dan tata letak belanja untuk desktop dan mobile.

Harga dan tinggi adalah contoh. Checkout adalah simulasi tanpa pembayaran.

## Referensi desain

| Bagian | Acuan | Adaptasi |
| --- | --- | --- |
| Galeri | Screenshot roll dan tiga SVG yang dikirim pengguna | Panel editorial bergeser dan miring, lalu kembali rata setelah setiap aksi |
| Angka | [Skiper UI — Animated Number 37](https://skiper-ui.com/v1/skiper37) · [NumberFlow](https://number-flow.barvian.me/) | Digit bergerak saat harga, jumlah, ukuran, dan subtotal berubah |
| Katalog, detail, dan keranjang | Screenshot marketplace dari pengguna | Foto dan harga dominan, judul reguler, deskripsi hanya di detail, dan kolom keranjang sejajar |
| Ikon | [Its Hover](https://www.itshover.com/icons) · [Figma E-commerce Icon Set](https://www.figma.com/design/4J1nBYWsXrIVOk2bEmbkYR/Untitled?node-id=1001-13) | Roda keranjang, garis daftar, dan bookmark punya umpan balik. Bag, Wishlist, dan Credit Card memakai SVG dari Figma |
| Checkout | Referensi visual pembelian Premium dari pengguna | Ringkasan mengutamakan subtotal, detail varian, dan aksi berikutnya |

Foto studio roket adalah visual konsep yang dibuat dari referensi aset roket Paperplay.
