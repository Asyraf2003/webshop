export type ColorOption = {
  id: string;
  label: string;
  swatch: string;
  background: string;
  image: string;
  framing: readonly [top: number, bottom: number];
};

export type SizeOption = {
  id: string;
  label: string;
  height: number;
};

export type Product = {
  id: string;
  name: string;
  number: string;
  category: string;
  description: string;
  colors: readonly [ColorOption, ...ColorOption[]];
  sizes: readonly [SizeOption, ...SizeOption[]];
};

export const stackingRocket: Product = {
  id: 'stacking-rocket',
  name: 'Roket Susun',
  number: '01',
  category: 'Mainan susun',
  description: 'Tumpuk bentuk-bentuk kayu jadi roket kecil. Pilih palet dan tinggi yang ingin kamu lihat.',
  colors: [
    { id: 'apricot', label: 'Aprikot', swatch: '#bd643f', background: '#f4e4d4', image: 'products/stacking-rocket/apricot.webp', framing: [81 / 1254, 1172 / 1254] },
    { id: 'sage', label: 'Sage', swatch: '#687a55', background: '#e6ebdc', image: 'products/stacking-rocket/sage.webp', framing: [101 / 1254, 1200 / 1254] },
    { id: 'sky', label: 'Biru Langit', swatch: '#6586a1', background: '#e2ebef', image: 'products/stacking-rocket/sky.webp', framing: [99 / 1254, 1177 / 1254] },
  ],
  sizes: [
    { id: 'small', label: 'Kecil', height: 12 },
    { id: 'medium', label: 'Sedang', height: 18 },
    { id: 'large', label: 'Besar', height: 24 },
  ],
};
