export type ColorOption = {
  id: string;
  label: string;
  labelEn: string;
  swatch: string;
  tint: string;
  dark: string;
  light: string;
  image?: string;
  framing?: readonly [top: number, bottom: number];
};

export type SizeOption = { id: string; label: string; height: number; price: number; stock: number };
export type MediaAsset = {
  kind: 'image' | 'video';
  path: string;
  label: string;
  labelEn: string;
  poster?: string;
};
export type Category = 'Susun' | 'Kreasi' | 'Imajinasi';
export type Product = {
  id: string;
  number: string;
  name: string;
  category: Category;
  description: string;
  descriptionEn: string;
  material: string;
  materialEn: string;
  rating: { score: number; reviews: number };
  sold: number;
  badge?: 'bestseller' | 'new';
  promo?: { discount: number; vouchers: number };
  stock?: Readonly<Record<string, number>>;
  media?: readonly MediaAsset[];
  art: 'rocket' | 'rainbow' | 'city' | 'garden';
  colors: readonly [ColorOption, ...ColorOption[]];
  sizes: readonly [SizeOption, ...SizeOption[]];
};

const apricot = { id: 'apricot', label: 'Aprikot', labelEn: 'Apricot', swatch: '#b95d3e', tint: '#f2e0d2', dark: '#953b25', light: '#e89d68' };
const sage = { id: 'sage', label: 'Sage', labelEn: 'Sage', swatch: '#687a55', tint: '#e5eadd', dark: '#42553e', light: '#9aa882' };
const sky = { id: 'sky', label: 'Biru Langit', labelEn: 'Sky Blue', swatch: '#597b9a', tint: '#e2ebee', dark: '#355371', light: '#89a7bf' };
const honey = { id: 'honey', label: 'Madu', labelEn: 'Honey', swatch: '#ba862f', tint: '#f3e8cf', dark: '#996526', light: '#eac77c' };
const berry = { id: 'berry', label: 'Mulberi', labelEn: 'Mulberry', swatch: '#a2637e', tint: '#f0e0e7', dark: '#773e5b', light: '#ce9bb2' };

function sizes(base: number): Product['sizes'] {
  return [
    { id: 'small', label: 'Kecil', height: 12, stock: 26, price: base },
    { id: 'medium', label: 'Sedang', height: 18, stock: 20, price: base + 20000 },
    { id: 'large', label: 'Besar', height: 24, stock: 14, price: base + 40000 },
  ];
}

export const products: readonly [Product, ...Product[]] = [
  {
    id: 'roket-susun', number: '01', name: 'Roket Susun', category: 'Susun', art: 'rocket',
    description: 'Tumpuk cincin, pasang puncaknya, lalu tentukan sendiri roket ini akan mendarat di mana.',
    descriptionEn: 'Stack the rings, add the tip, and pick a landing site for your rocket.',
    material: 'Konsep kayu berlapis warna',
    materialEn: 'Painted wood concept',
    rating: { score: 4.9, reviews: 38 },
    sold: 124,
    badge: 'bestseller',
    promo: { discount: 20, vouchers: 1 },
    stock: { 'sky:large': 0 },
    media: [{ kind: 'image', path: 'editorial/rocket-studio.webp', label: 'Foto studio Aprikot', labelEn: 'Apricot studio photo' }],
    colors: [
      { ...apricot, image: 'products/stacking-rocket/apricot.webp', framing: [81 / 1254, 1172 / 1254] },
      { ...sage, image: 'products/stacking-rocket/sage.webp', framing: [101 / 1254, 1200 / 1254] },
      { ...sky, image: 'products/stacking-rocket/sky.webp', framing: [99 / 1254, 1177 / 1254] },
    ],
    sizes: sizes(89000),
  },
  {
    id: 'pelangi-lengkung', number: '02', name: 'Pelangi Lengkung', category: 'Kreasi', art: 'rainbow',
    description: 'Lengkung bertingkat yang bisa menjadi terowongan, jembatan, atau apa pun yang sedang dibangun hari ini.',
    descriptionEn: 'Layered arches become a tunnel, a bridge, or whatever is taking shape today.',
    material: 'Ilustrasi konsep kayu',
    materialEn: 'Illustrated wood concept',
    rating: { score: 4.8, reviews: 26 },
    sold: 76,
    promo: { discount: 15, vouchers: 1 },
    colors: [honey, berry, sage],
    sizes: sizes(79000),
  },
  {
    id: 'kota-kecil', number: '03', name: 'Kota Kecil', category: 'Imajinasi', art: 'city',
    description: 'Atap, menara, dan jalan pendek. Susun balok jadi kota yang berubah setiap kali dimainkan.',
    descriptionEn: 'Roofs, towers, and little streets. Build a town that changes with every play session.',
    material: 'Ilustrasi konsep balok',
    materialEn: 'Illustrated block concept',
    rating: { score: 4.9, reviews: 19 },
    sold: 52,
    badge: 'new',
    colors: [sky, apricot, honey],
    sizes: sizes(99000),
  },
  {
    id: 'kebun-susun', number: '04', name: 'Kebun Susun', category: 'Susun', art: 'garden',
    description: 'Tiga pohon kecil untuk disusun ulang, dipindah, dan ditanam di kebun khayalan.',
    descriptionEn: 'Three small trees to move, rearrange, and plant in an imaginary garden.',
    material: 'Ilustrasi konsep kayu',
    materialEn: 'Illustrated wood concept',
    rating: { score: 4.7, reviews: 14 },
    sold: 41,
    colors: [sage, berry, honey],
    sizes: sizes(69000),
  },
];

export const categories: readonly Category[] = ['Susun', 'Kreasi', 'Imajinasi'];
export const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
