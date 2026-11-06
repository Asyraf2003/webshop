import type { Category, ColorOption, Product } from './catalog';

const finishes = {
  sage: { id: 'sage', label: 'Sage', labelEn: 'Sage', swatch: '#71836a', tint: '#e3e9db', dark: '#465c44', light: '#adbd9a' },
  clay: { id: 'clay', label: 'Terakota', labelEn: 'Terracotta', swatch: '#b96b51', tint: '#f1dfd5', dark: '#813c2e', light: '#e2a181' },
  blue: { id: 'blue', label: 'Biru Laut', labelEn: 'Ocean Blue', swatch: '#547f93', tint: '#deeaeb', dark: '#31536b', light: '#8bb5bf' },
  honey: { id: 'honey', label: 'Madu', labelEn: 'Honey', swatch: '#b58a42', tint: '#f4ead3', dark: '#805721', light: '#ecc380' },
  plum: { id: 'plum', label: 'Prem', labelEn: 'Plum', swatch: '#896c9b', tint: '#ede4ef', dark: '#5f426e', light: '#c5acd0' },
  blush: { id: 'blush', label: 'Merah Muda', labelEn: 'Blush', swatch: '#b47a81', tint: '#f2e4e3', dark: '#81565c', light: '#e3b4b1' },
} satisfies Record<string, ColorOption>;

const stories = {
  train: ['Rangkai perjalanan baru di rel khayalan dan singgah di setiap stasiun.', 'Make up a new route and stop at every imaginary station.'],
  car: ['Dorong mobil kecil ini menyusuri lintasan yang kamu buat sendiri.', 'Push this little car along a track of your own making.'],
  boat: ['Kapal kecil untuk pelayaran di lautan yang kamu gambar sendiri.', 'A little boat for voyages across oceans you draw yourself.'],
  plane: ['Pilih tujuan, atur landasan, lalu terbangkan pesawat di dunia khayalanmu.', 'Pick a destination, make a runway, and fly into an imagined world.'],
  tower: ['Tumpuk bentuk dari bawah dan cari susunan menara yang paling seimbang.', 'Stack shapes from the base and find the arrangement that balances best.'],
  puzzle: ['Cocokkan bentuknya, lalu pindahkan keping untuk menemukan susunan baru.', 'Match the shapes, then move the pieces to make a new arrangement.'],
  music: ['Ketuk bilah satu per satu dan susun irama kecilmu sendiri.', 'Tap each bar and make up a rhythm of your own.'],
  rabbit: ['Teman kecil untuk membuat cerita di kebun, rumah, atau hutan.', 'A little companion for stories in a garden, home, or forest.'],
  top: ['Putar dengan ujung jari dan perhatikan warna menyatu saat gasing bergerak.', 'Spin it with your fingertips and watch the colors blend in motion.'],
  blocks: ['Gabungkan balok menjadi bangunan kecil dan bongkar untuk mulai lagi.', 'Combine the blocks into small buildings, then take them apart and start again.'],
  duck: ['Ajak bebek kecil menjelajahi kolam dan jalan setapak khayalan.', 'Take a little duck along imaginary ponds and paths.'],
  robot: ['Buat misi baru untuk robot dan susun dunianya bersama balok lainnya.', 'Make up a mission for your robot and build its world with other blocks.'],
} as const;

export type ExtraToyArt = keyof typeof stories;
type ToyRow = readonly [id: string, name: string, category: Category, art: ExtraToyArt, finish: keyof typeof finishes, height: number, price: number, discount?: number];

const toyRows: readonly ToyRow[] = [
  ['kereta-rimba', 'Kereta Rimba', 'Imajinasi', 'train', 'sage', 11, 89000, 10],
  ['mobil-jelajah', 'Mobil Jelajah', 'Imajinasi', 'car', 'clay', 9, 65000],
  ['kapal-teluk', 'Kapal Teluk', 'Imajinasi', 'boat', 'blue', 12, 79000],
  ['menara-madu', 'Menara Madu', 'Susun', 'tower', 'honey', 19, 98000],
  ['puzzle-awan', 'Puzzle Awan', 'Kreasi', 'puzzle', 'blue', 17, 78000],
  ['bilah-irama', 'Bilah Irama', 'Kreasi', 'music', 'plum', 19, 119000, 15],
  ['kelinci-kebun', 'Kelinci Kebun', 'Imajinasi', 'rabbit', 'blush', 12, 57000],
  ['gasing-senja', 'Gasing Senja', 'Susun', 'top', 'clay', 8, 39000],
  ['balok-atelier', 'Balok Atelier', 'Kreasi', 'blocks', 'blue', 21, 129000],
  ['bebek-kolam', 'Bebek Kolam', 'Imajinasi', 'duck', 'honey', 10, 59000],
  ['pesawat-pagi', 'Pesawat Pagi', 'Imajinasi', 'plane', 'blue', 10, 84000],
  ['robot-mini', 'Robot Mini', 'Imajinasi', 'robot', 'plum', 17, 99000, 12],
  ['lokomotif-senja', 'Lokomotif Senja', 'Imajinasi', 'train', 'clay', 12, 93000],
  ['mobil-pesisir', 'Mobil Pesisir', 'Imajinasi', 'car', 'blue', 8, 63000],
  ['perahu-pasir', 'Perahu Pasir', 'Imajinasi', 'boat', 'honey', 11, 73000, 10],
  ['menara-hutan', 'Menara Hutan', 'Susun', 'tower', 'sage', 21, 109000],
  ['puzzle-taman', 'Puzzle Taman', 'Kreasi', 'puzzle', 'sage', 18, 84000],
  ['nada-pelangi', 'Nada Pelangi', 'Kreasi', 'music', 'blush', 20, 125000],
  ['kelinci-madu', 'Kelinci Madu', 'Imajinasi', 'rabbit', 'honey', 11, 55000],
  ['gasing-kecil', 'Gasing Kecil', 'Susun', 'top', 'plum', 7, 35000],
  ['balok-arsitek', 'Balok Arsitek', 'Kreasi', 'blocks', 'clay', 23, 139000, 12],
  ['bebek-hujan', 'Bebek Hujan', 'Imajinasi', 'duck', 'blue', 10, 61000],
  ['pesawat-kertas', 'Pesawat Senja', 'Imajinasi', 'plane', 'clay', 12, 92000],
  ['kereta-madu', 'Kereta Madu', 'Imajinasi', 'train', 'honey', 11, 87000],
  ['mobil-lumut', 'Mobil Lumut', 'Imajinasi', 'car', 'sage', 9, 68000],
  ['kapal-layar', 'Kapal Layar', 'Imajinasi', 'boat', 'plum', 13, 89000],
  ['menara-petal', 'Menara Petal', 'Susun', 'tower', 'blush', 18, 95000, 10],
  ['puzzle-geometri', 'Puzzle Geometri', 'Kreasi', 'puzzle', 'plum', 20, 89000],
  ['ketuk-rimba', 'Ketuk Rimba', 'Kreasi', 'music', 'sage', 20, 115000],
  ['balok-kota', 'Balok Kota', 'Susun', 'blocks', 'honey', 22, 134000],
];

type ExtraProduct = Omit<Product, 'art'> & { art: ExtraToyArt };

export const extraToys: ExtraProduct[] = toyRows.map(([id, name, category, art, finish, height, price, discount], index) => ({
  id, name, category, art, number: String(index + 5).padStart(2, '0'),
  description: stories[art][0], descriptionEn: stories[art][1],
  material: 'Kayu berlapis warna', materialEn: 'Painted wood',
  rating: { score: 4.5 + (index % 5) / 10, reviews: 7 + (index * 7) % 42 },
  sold: 16 + (index * 13) % 95,
  badge: index % 9 === 0 ? 'new' : undefined,
  promo: discount ? { discount, vouchers: 1 } : undefined,
  colors: [finishes[finish]],
  sizes: [{ id: 'standard', label: 'Standar', height, price, stock: 11 + (index * 5) % 27 }],
}));
