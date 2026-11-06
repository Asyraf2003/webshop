import type { Category, ColorOption, Product } from './catalog';

export type Locale = 'id' | 'en';
export const readLocale = (value: unknown): Locale => value === 'en' ? 'en' : 'id';

const id = {
  home: 'Beranda', skip: 'Lewati ke konten', search: 'Cari mainan', menu: 'Menu', openMenu: 'Buka menu',
  close: 'Tutup', saved: 'Tersimpan', save: 'Simpan', unsave: 'Hapus dari tersimpan', cart: 'Keranjang',
  switchLanguage: 'Ganti ke English', collection: 'Koleksi mainan', gallery: 'Galeri Paperplay',
  all: 'Semua', products: 'produk', categories: 'Kategori', noResults: 'Belum ada mainan yang cocok.',
  noSaved: 'Belum ada mainan tersimpan.', showAll: 'Lihat semua mainan', viewProduct: 'Lihat produk',
  promotion: 'Promo Paperplay', demoPromo: 'PROMO DEMO', previous: 'Sebelumnya', next: 'Berikutnya',
  voucher: 'voucher dipakai', bestseller: 'Terlaris', new: 'Baru', reviews: 'ulasan', sold: 'terjual',
  starsOf: 'dari 5 bintang', color: 'Warna', size: 'Ukuran', quantity: 'Kuantitas', stock: 'Stok',
  outOfStock: 'Stok habis', stockLimit: 'Jumlah melebihi stok varian.', add: 'Masukkan keranjang',
  added: 'Ditambahkan', viewCart: 'Lihat keranjang', checkout: 'Checkout demo', media: 'Media produk',
  front: 'Tampak depan', closeUp: 'Detail bentuk', share: 'Bagikan', copied: 'Tautan disalin',
  shareLink: 'Tautan produk', specs: 'Spesifikasi', description: 'Deskripsi produk', material: 'Bahan',
  series: 'Kategori', height: 'Tinggi', concept: 'Data, harga, dan stok untuk demo.',
  product: 'Produk', variant: 'Varian', unitPrice: 'Harga satuan', total: 'Total', remove: 'Hapus',
  action: 'Aksi', emptyCart: 'Keranjang masih kosong.', backToCollection: 'Kembali ke koleksi',
  subtotal: 'Subtotal', item: 'item', increase: 'Tambah', decrease: 'Kurangi', maxAvailable: 'Stok tersedia',
  checkoutNote: 'Ringkasan pesanan demo. Pembayaran belum aktif.', simulate: 'Selesaikan simulasi',
  complete: 'Simulasi selesai.', keepShopping: 'Lanjut lihat koleksi', back: 'Ke atas',
  footer: 'Paperplay · Toko konsep mainan',
};
export type Copy = typeof id;

const en: Copy = {
  home: 'Home', skip: 'Skip to content', search: 'Search toys', menu: 'Menu', openMenu: 'Open menu',
  close: 'Close', saved: 'Saved', save: 'Save', unsave: 'Remove from saved', cart: 'Cart',
  switchLanguage: 'Switch to Indonesian', collection: 'Toy collection', gallery: 'Paperplay gallery',
  all: 'All', products: 'products', categories: 'Categories', noResults: 'No matching toys.',
  noSaved: 'No saved toys yet.', showAll: 'Show all toys', viewProduct: 'View product',
  promotion: 'Paperplay offers', demoPromo: 'DEMO OFFER', previous: 'Previous', next: 'Next',
  voucher: 'voucher applied', bestseller: 'Bestseller', new: 'New', reviews: 'reviews', sold: 'sold',
  starsOf: 'out of 5 stars', color: 'Color', size: 'Size', quantity: 'Quantity', stock: 'Stock',
  outOfStock: 'Out of stock', stockLimit: 'Quantity exceeds available stock.', add: 'Add to cart',
  added: 'Added', viewCart: 'View cart', checkout: 'Demo checkout', media: 'Product media',
  front: 'Front view', closeUp: 'Shape close-up', share: 'Share', copied: 'Link copied',
  shareLink: 'Product link', specs: 'Specifications', description: 'Product description', material: 'Material',
  series: 'Category', height: 'Height', concept: 'Demo data, prices, and stock.',
  product: 'Product', variant: 'Variant', unitPrice: 'Unit price', total: 'Total', remove: 'Remove',
  action: 'Action', emptyCart: 'Your cart is empty.', backToCollection: 'Back to collection',
  subtotal: 'Subtotal', item: 'items', increase: 'Increase', decrease: 'Decrease', maxAvailable: 'In stock',
  checkoutNote: 'Sample order summary. Payments are inactive.', simulate: 'Finish simulation',
  complete: 'Simulation complete.', keepShopping: 'Keep shopping', back: 'Back to top',
  footer: 'Paperplay · Toy store concept',
};

const englishCategories: Record<Category, string> = { Susun: 'Stack', Kreasi: 'Create', Imajinasi: 'Imagine' };
export const copyFor = (locale: Locale) => locale === 'en' ? en : id;
export const categoryName = (category: Category, locale: Locale) => locale === 'en' ? englishCategories[category] : category;
export const colorName = (color: ColorOption, locale: Locale) => locale === 'en' ? color.labelEn : color.label;
export const descriptionFor = (product: Product, locale: Locale) => locale === 'en' ? product.descriptionEn : product.description;
export const materialFor = (product: Product, locale: Locale) => locale === 'en' ? product.materialEn : product.material;
