import type { CartItem } from './shop';

export const deliveryRegions = ['metro', 'java', 'outside'] as const;
export const deliveryServices = ['economy', 'regular', 'express'] as const;
export const paymentMethods = ['transfer', 'wallet', 'cash'] as const;

export type DeliveryRegion = typeof deliveryRegions[number];
export type DeliveryService = typeof deliveryServices[number];
export type PaymentMethod = typeof paymentMethods[number];

export type DeliveryAddress = {
  recipient: string;
  phone: string;
  street: string;
  city: string;
  region: DeliveryRegion | '';
  postcode: string;
};

export const emptyAddress: DeliveryAddress = {
  recipient: '', phone: '', street: '', city: '', region: '', postcode: '',
};

export function isAddressReady(address: DeliveryAddress) {
  const phone = address.phone.replace(/\D/g, '');
  return Boolean(address.recipient.trim() && address.street.trim() && address.city.trim() &&
    deliveryRegions.some(region => region === address.region) &&
    phone.length >= 8 && phone.length <= 15 && /^\d{5}$/.test(address.postcode.trim()));
}

const rates: Record<DeliveryRegion, Record<DeliveryService, readonly [fee: number, from: number, to: number]>> = {
  metro: { economy: [9000, 3, 5], regular: [14000, 2, 3], express: [26000, 1, 2] },
  java: { economy: [14500, 4, 6], regular: [18500, 2, 4], express: [32000, 1, 2] },
  outside: { economy: [24000, 5, 8], regular: [32000, 3, 6], express: [56000, 2, 3] },
};

export function deliveryOptions(region: DeliveryAddress['region']) {
  if (!region) return [];
  return deliveryServices.map(service => {
    const [fee, from, to] = rates[region][service];
    return { service, fee, from, to };
  });
}

export type OrderTotals = { merchandise: number; discount: number; shipping: number; total: number };

export function orderTotals(items: CartItem[], shipping: number): OrderTotals {
  const merchandise = items.reduce((sum, item) => sum + item.size.price * item.quantity, 0);
  const products = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return { merchandise, discount: Math.max(0, merchandise - products), shipping, total: products + shipping };
}
