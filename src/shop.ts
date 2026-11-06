import { products, type ColorOption, type Product, type SizeOption } from './catalog';

export type Variant = { productId: string; colorId: string; sizeId: string };
export type CartLine = Variant & { quantity: number };
export type CartItem = CartLine & {
  product: Product;
  color: ColorOption;
  size: SizeOption;
  stock: number;
  unitPrice: number;
};

export function priceFor(product: Product, size: SizeOption) {
  const discount = product.promo?.discount ?? 0;
  return {
    original: size.price,
    price: Math.round(size.price * (100 - discount) / 100),
    discount,
    vouchers: product.promo?.vouchers ?? 0,
  };
}

export function stockFor(product: Product, color: ColorOption, size: SizeOption) {
  return product.stock?.[color.id + ':' + size.id] ?? Math.max(0, size.stock - product.colors.indexOf(color) * 3);
}

export function variantFor(product: Product, color: ColorOption, size: SizeOption): Variant {
  return { productId: product.id, colorId: color.id, sizeId: size.id };
}

export function variantKey(variant: Variant) {
  return variant.productId + ':' + variant.colorId + ':' + variant.sizeId;
}

export function productById(id: string | null) {
  return products.find(product => product.id === id);
}

export function resolveLine(line: CartLine): CartItem | undefined {
  const product = productById(line.productId);
  const color = product?.colors.find(option => option.id === line.colorId);
  const size = product?.sizes.find(option => option.id === line.sizeId);
  if (!product || !color || !size) return;
  return { ...line, product, color, size, stock: stockFor(product, color, size), unitPrice: priceFor(product, size).price };
}

export function restoreCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const lines = new Map<string, CartLine>();
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue;
    const { productId, colorId, sizeId, quantity } = entry;
    if (typeof productId !== 'string' || typeof colorId !== 'string' || typeof sizeId !== 'string' ||
      !Number.isSafeInteger(quantity) || quantity < 1) continue;
    const line: CartLine = { productId, colorId, sizeId, quantity };
    if (!resolveLine(line)) continue;
    const key = variantKey(line);
    lines.set(key, { ...line, quantity: Math.min(99, quantity + (lines.get(key)?.quantity ?? 0)) });
  }
  return [...lines.values()];
}

export function changeCart(lines: CartLine[], variant: Variant, delta: number): CartLine[] | undefined {
  if (!Number.isSafeInteger(delta) || !delta) return lines;
  const key = variantKey(variant);
  const existing = lines.find(line => variantKey(line) === key);
  const quantity = Math.max(0, (existing?.quantity ?? 0) + delta);
  const next = { ...variant, quantity };
  const item = resolveLine(next);
  if (!item || (delta > 0 && quantity > item.stock)) return;
  if (!quantity) return lines.filter(line => variantKey(line) !== key);
  return existing ? lines.map(line => variantKey(line) === key ? next : line) : [...lines, next];
}

export function summarizeCart(lines: CartLine[]) {
  const items = lines.flatMap(line => resolveLine(line) ?? []);
  return {
    items,
    quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    valid: items.length > 0 && items.every(item => item.quantity <= item.stock),
  };
}
