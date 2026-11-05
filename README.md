# Paperplay Webshop

Prototipe detail produk React dan TypeScript untuk menguji pemilihan varian sebelum katalog diperluas.

```sh
npm ci
npm run dev
npm run build
```

- `src/catalog.ts` menyimpan model, warna, dan contoh tinggi. Tiap warna memakai satu WebP transparan. Saat ukuran berubah, semua warna mengikuti skala yang sama dari data ukuran.
- `src/main.tsx` memisahkan pratinjau dan kontrol varian. Warna berganti dengan crossfade, ukuran berubah dari titik pijak tetap, dan angka tinggi masuk dari samping.
- Pilihan menggunakan radio HTML. Coba Tab dan tombol panah, lalu coba lagi dengan preferensi reduced motion. Panel foto memiliki ruang tetap sehingga perubahan ukuran tidak menggeser kontrol.

Roket dan dimensinya adalah konsep. Jika varian ukuran produk nyata memiliki bentuk berbeda, gunakan gambar terpisah untuk varian tersebut.

## Referensi desain

- [Skiper UI — Apple Carousel](https://skiper-ui.com/v1/skiper77) menjadi acuan perpindahan gambar yang halus saat memilih warna. Implementasi proyek ini memakai CSS dan React.
- [Its Hover](https://www.itshover.com/) menjadi acuan feedback ikon centang pada pilihan aktif. Ikon di proyek ini digambar dengan SVG sederhana.
