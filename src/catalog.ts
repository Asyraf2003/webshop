export type ColorOption = {
  id: string;
  label: string;
  swatch: string;
  tint: string;
  dark: string;
  light: string;
  image?: string;
  framing?: readonly [top: number, bottom: number];
};

export type SizeOption = { id: string; label: string; height: number; price: number };
export type Category = 'Susun' | 'Kreasi' | 'Imajinasi';
export type Product = {
  id: string;
  number: string;
  name: string;
  category: Category;
  description: string;
  material: string;
  art: 'rocket' | 'rainbow' | 'city' | 'garden';
  colors: readonly [ColorOption, ...ColorOption[]];
  sizes: readonly [SizeOption, ...SizeOption[]];
};

const apricot = { id: 'apricot', label: 'Aprikot', swatch: '#b95d3e', tint: '#f2e0d2', dark: '#953b25', light: '#e89d68' };
const sage = { id: 'sage', label: 'Sage', swatch: '#687a55', tint: '#e5eadd', dark: '#42553e', light: '#9aa882' };
const sky = { id: 'sky', label: 'Biru Langit', swatch: '#597b9a', tint: '#e2ebee', dark: '#355371', light: '#89a7bf' };
const honey = { id: 'honey', label: 'Madu', swatch: '#ba862f', tint: '#f3e8cf', dark: '#996526', light: '#eac77c' };
const berry = { id: 'berry', label: 'Mulberi', swatch: '#a2637e', tint: '#f0e0e7', dark: '#773e5b', light: '#ce9bb2' };

function sizes(base: number): Product['sizes'] {
  return [
    { id: 'small', label: 'Kecil', height: 12, price: base },
    { id: 'medium', label: 'Sedang', height: 18, price: base + 20000 },
    { id: 'large', label: 'Besar', height: 24, price: base + 40000 },
  ];
}

export const products: readonly [Product, ...Product[]] = [
  {
    id: 'roket-susun', number: '01', name: 'Roket Susun', category: 'Susun', art: 'rocket',
    description: 'Tumpuk cincin, pasang puncaknya, lalu tentukan sendiri roket ini akan mendarat di mana.',
    material: 'Konsep kayu berlapis warna',
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
    material: 'Ilustrasi konsep kayu',
    colors: [honey, berry, sage],
    sizes: sizes(79000),
  },
  {
    id: 'kota-kecil', number: '03', name: 'Kota Kecil', category: 'Imajinasi', art: 'city',
    description: 'Atap, menara, dan jalan pendek. Susun balok jadi kota yang berubah setiap kali dimainkan.',
    material: 'Ilustrasi konsep balok',
    colors: [sky, apricot, honey],
    sizes: sizes(99000),
  },
  {
    id: 'kebun-susun', number: '04', name: 'Kebun Susun', category: 'Susun', art: 'garden',
    description: 'Tiga pohon kecil untuk disusun ulang, dipindah, dan ditanam di kebun khayalan.',
    material: 'Ilustrasi konsep kayu',
    colors: [sage, berry, honey],
    sizes: sizes(69000),
  },
];

export const categories: readonly Category[] = ['Susun', 'Kreasi', 'Imajinasi'];
export const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
