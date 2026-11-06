import type { Category, ColorOption, Product } from './catalog';

export type Locale = 'id' | 'en';
export const readLocale = (value: unknown): Locale => value === 'en' ? 'en' : 'id';

const id = {
  home: 'Beranda', skip: 'Lewati ke konten', search: 'Cari mainan', menu: 'Menu', openMenu: 'Buka menu',
  close: 'Tutup', saved: 'Tersimpan', save: 'Simpan', unsave: 'Hapus dari tersimpan', cart: 'Keranjang',
  switchLanguage: 'Ganti ke English', collection: 'Koleksi mainan', gallery: 'Galeri Paperplay',
  all: 'Semua', products: 'produk', categories: 'Kategori', noResults: 'Belum ada mainan yang cocok.',
  noSaved: 'Belum ada mainan tersimpan.', showAll: 'Lihat semua mainan', viewProduct: 'Lihat produk',
  promotion: 'Promo Paperplay', demoPromo: 'PILIHAN PROMO', previous: 'Sebelumnya', next: 'Berikutnya',
  voucher: 'voucher dipakai', bestseller: 'Terlaris', new: 'Baru', reviews: 'ulasan', sold: 'terjual',
  starsOf: 'dari 5 bintang', color: 'Warna', size: 'Ukuran', quantity: 'Kuantitas', stock: 'Stok',
  outOfStock: 'Stok habis', stockLimit: 'Jumlah melebihi stok varian.', add: 'Masukkan keranjang',
  added: 'Ditambahkan', viewCart: 'Lihat keranjang', checkout: 'Checkout', media: 'Media produk',
  front: 'Tampak depan', closeUp: 'Detail bentuk', share: 'Bagikan', copied: 'Tautan disalin',
  shareLink: 'Tautan produk', specs: 'Spesifikasi', description: 'Deskripsi produk', material: 'Bahan',
  series: 'Kategori', height: 'Tinggi', concept: '',
  product: 'Produk', variant: 'Varian', unitPrice: 'Harga satuan', total: 'Total', remove: 'Hapus',
  action: 'Aksi', emptyCart: 'Keranjang masih kosong.', backToCollection: 'Kembali ke koleksi',
  subtotal: 'Subtotal', item: 'item', increase: 'Tambah', decrease: 'Kurangi', maxAvailable: 'Stok tersedia',
  checkoutNote: 'Ringkasan pesanan', simulate: 'Buat pesanan',
  complete: 'Pesanan disiapkan.', keepShopping: 'Lanjut lihat koleksi', back: 'Ke atas',
  footer: 'Mainan untuk tangan kecil dan imajinasi besar.',
  account: 'Akun', login: 'Login', pauseOffers: 'Jeda promo', playOffers: 'Putar promo',
  explore: 'Jelajahi', shopping: 'Belanja', footerHeadline: 'Main dimulai di sini.',
  order: {
    address: 'Alamat', shipping: 'Pengiriman', payment: 'Pembayaran', summary: 'Ringkasan pesanan',
    recipient: 'Nama penerima', phone: 'Nomor HP', street: 'Alamat lengkap', city: 'Kota atau kabupaten',
    region: 'Wilayah pengiriman', postcode: 'Kode pos', chooseRegion: 'Pilih wilayah',
    addressHelp: 'Tambahkan nama jalan, nomor rumah, dan patokan bila perlu.',
    addressError: 'Periksa nama, nomor HP, dan kode pos sebelum lanjut.',
    next: 'Lanjut', back: 'Kembali', place: 'Buat pesanan', merchandise: 'Harga produk',
    automaticPromo: 'Promo otomatis', days: 'hari kerja', deliveryTo: 'Kirim ke',
    completed: 'Pesanan disiapkan', reference: 'Nomor pesanan', paymentPending: 'Pembayaran belum diproses.',
    keepShopping: 'Kembali belanja', chooseDelivery: 'Pilih layanan pengiriman', choosePayment: 'Pilih metode pembayaran',
    regions: { metro: 'Jabodetabek', java: 'Pulau Jawa', outside: 'Luar Jawa' },
    deliveries: { economy: 'Hemat', regular: 'Reguler', express: 'Ekspres' },
    methods: {
      transfer: { name: 'Transfer bank', detail: 'Pilih pembayaran melalui bank.' },
      wallet: { name: 'Dompet digital', detail: 'Pilih pembayaran melalui dompet digital.' },
      cash: { name: 'Bayar di tempat', detail: 'Bayar saat barang diterima.' },
    },
  },
};
export type Copy = typeof id;

const en: Copy = {
  home: 'Home', skip: 'Skip to content', search: 'Search toys', menu: 'Menu', openMenu: 'Open menu',
  close: 'Close', saved: 'Saved', save: 'Save', unsave: 'Remove from saved', cart: 'Cart',
  switchLanguage: 'Switch to Indonesian', collection: 'Toy collection', gallery: 'Paperplay gallery',
  all: 'All', products: 'products', categories: 'Categories', noResults: 'No matching toys.',
  noSaved: 'No saved toys yet.', showAll: 'Show all toys', viewProduct: 'View product',
  promotion: 'Paperplay offers', demoPromo: 'FEATURED OFFER', previous: 'Previous', next: 'Next',
  voucher: 'voucher applied', bestseller: 'Bestseller', new: 'New', reviews: 'reviews', sold: 'sold',
  starsOf: 'out of 5 stars', color: 'Color', size: 'Size', quantity: 'Quantity', stock: 'Stock',
  outOfStock: 'Out of stock', stockLimit: 'Quantity exceeds available stock.', add: 'Add to cart',
  added: 'Added', viewCart: 'View cart', checkout: 'Checkout', media: 'Product media',
  front: 'Front view', closeUp: 'Shape close-up', share: 'Share', copied: 'Link copied',
  shareLink: 'Product link', specs: 'Specifications', description: 'Product description', material: 'Material',
  series: 'Category', height: 'Height', concept: '',
  product: 'Product', variant: 'Variant', unitPrice: 'Unit price', total: 'Total', remove: 'Remove',
  action: 'Action', emptyCart: 'Your cart is empty.', backToCollection: 'Back to collection',
  subtotal: 'Subtotal', item: 'items', increase: 'Increase', decrease: 'Decrease', maxAvailable: 'In stock',
  checkoutNote: 'Order summary', simulate: 'Place order',
  complete: 'Order prepared.', keepShopping: 'Keep shopping', back: 'Back to top',
  footer: 'Toys for small hands and big imaginations.',
  account: 'Account', login: 'Login', pauseOffers: 'Pause offers', playOffers: 'Play offers',
  explore: 'Explore', shopping: 'Shopping', footerHeadline: 'Play starts here.',
  order: {
    address: 'Address', shipping: 'Delivery', payment: 'Payment', summary: 'Order summary',
    recipient: 'Recipient name', phone: 'Phone number', street: 'Street address', city: 'City or district',
    region: 'Delivery region', postcode: 'Postal code', chooseRegion: 'Select a region',
    addressHelp: 'Include the street, house number, and a landmark if needed.',
    addressError: 'Check the name, phone number, and postal code before continuing.',
    next: 'Continue', back: 'Back', place: 'Place order', merchandise: 'Merchandise',
    automaticPromo: 'Automatic discount', days: 'business days', deliveryTo: 'Ship to',
    completed: 'Order prepared', reference: 'Order number', paymentPending: 'Payment has not been processed.',
    keepShopping: 'Back to shopping', chooseDelivery: 'Choose a delivery service', choosePayment: 'Choose a payment method',
    regions: { metro: 'Greater Jakarta', java: 'Java', outside: 'Outside Java' },
    deliveries: { economy: 'Economy', regular: 'Standard', express: 'Express' },
    methods: {
      transfer: { name: 'Bank transfer', detail: 'Choose payment through your bank.' },
      wallet: { name: 'Digital wallet', detail: 'Choose payment through a digital wallet.' },
      cash: { name: 'Cash on delivery', detail: 'Pay when the parcel arrives.' },
    },
  },
};

const englishCategories: Record<Category, string> = { Susun: 'Stack', Kreasi: 'Create', Imajinasi: 'Imagine' };
export const copyFor = (locale: Locale) => locale === 'en' ? en : id;
export const categoryName = (category: Category, locale: Locale) => locale === 'en' ? englishCategories[category] : category;
export const colorName = (color: ColorOption, locale: Locale) => locale === 'en' ? color.labelEn : color.label;
export const descriptionFor = (product: Product, locale: Locale) => locale === 'en' ? product.descriptionEn : product.description;
export const materialFor = (product: Product, locale: Locale) => locale === 'en' ? product.materialEn : product.material;
