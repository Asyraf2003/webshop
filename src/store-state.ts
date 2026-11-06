import { useEffect, useRef, useState } from 'react';
import { changeCart, productById, restoreCart, type Variant } from './shop';

export function useStored<T>(key: string, decode: (value: unknown) => T) {
  const [value, setValue] = useState(() => {
    try { return decode(JSON.parse(localStorage.getItem(key) ?? 'null')); }
    catch { return decode(null); }
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* The current session can still use its state. */ }
  }, [key, value]);

  return [value, setValue] as const;
}

export function useCart() {
  const [lines, setLines] = useStored('paperplay-webshop-cart-v1', restoreCart);
  const current = useRef(lines);
  function change(variant: Variant, delta: number) {
    const next = changeCart(current.current, variant, delta);
    if (!next) return false;
    current.current = next;
    setLines(next);
    return true;
  }
  return { lines, change };
}

export function readSaved(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && Boolean(productById(id))))];
}

export function linkedProduct() {
  return productById(new URL(window.location.href).searchParams.get('product'));
}

export function setLinkedProduct(id?: string) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set('product', id);
  else url.searchParams.delete('product');
  if (url.href !== window.location.href) window.history.replaceState(null, '', url);
}

export function productLink(id: string) {
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set('product', id);
  return url.href;
}

export async function shareProduct(title: string, url: string) {
  if (navigator.share) {
    try { await navigator.share({ title, url }); return 'shared'; }
    catch (error) { if (error instanceof DOMException && error.name === 'AbortError') return 'idle'; }
  }
  try { await navigator.clipboard.writeText(url); return 'copied'; }
  catch { return 'link'; }
}
