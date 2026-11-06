import { useRef, type CSSProperties } from 'react';
import { CloseButton, Stepper, Subtotal, Surface, type Point } from './commerce-ui';
import { CartIcon, Icon } from './icons';
import { colorName, type Copy, type Locale } from './locale';
import { RollingNumber } from './motion';
import { ProductArt } from './product-art';
import { variantKey, type CartItem, type Variant } from './shop';

function VariantText({ item, locale }: { item: CartItem; locale: Locale }) {
  return <>{colorName(item.color, locale)} · <RollingNumber value={item.size.height} suffix=" cm" /></>;
}

export function CartPanel({ open, origin, copy, locale, items, quantity, subtotal, valid, onChange, onClose, onBrowse, onCheckout }: {
  open: boolean; origin?: Point; copy: Copy; locale: Locale; items: CartItem[]; quantity: number; subtotal: number; valid: boolean;
  onChange: (item: Variant, delta: number) => boolean; onClose: () => void; onBrowse: () => void; onCheckout: () => void;
}) {
  const body = useRef<HTMLDivElement>(null);
  function change(item: CartItem, delta: number) {
    if (item.quantity + delta <= 0) body.current?.closest('dialog')?.querySelector<HTMLButtonElement>('.surface-close')?.focus();
    onChange(item, delta);
  }

  return (
    <Surface open={open} kind="cart" titleId="cart-title" origin={origin} onClose={onClose}>
      <div className="cart-body" ref={body}>
        <header className="surface-head">
          <div><h2 id="cart-title">{copy.cart}</h2><span className="fine-print"><RollingNumber value={quantity} /> {copy.item}</span></div>
          <CloseButton label={copy.close + ' ' + copy.cart} onClose={onClose} />
        </header>
        {items.length ? <>
          <table className="cart-table" aria-label={copy.cart}>
            <thead><tr>{[copy.product, copy.variant, copy.unitPrice, copy.quantity, copy.total, copy.action].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
            <tbody>{items.map(item => {
              const label = item.product.name + ' ' + colorName(item.color, locale) + ' ' + item.size.height + ' cm';
              return (
                <tr key={variantKey(item)}>
                  <td className="cart-product"><div className="cart-product-info">
                    <div className="cart-thumbnail" style={{ '--tint': item.color.tint } as CSSProperties}><ProductArt product={item.product} color={item.color} /></div>
                    <span>{item.product.name}</span>
                  </div></td>
                  <td className="cart-variant"><VariantText item={item} locale={locale} />
                    {item.quantity > item.stock && <span className="stock-error">{copy.maxAvailable} <RollingNumber value={item.stock} /></span>}
                  </td>
                  <td className="cart-unit"><span className="cart-cell-label" aria-hidden="true">{copy.unitPrice}</span><RollingNumber value={item.unitPrice} currency /></td>
                  <td className="cart-quantity"><Stepper label={label} copy={copy} value={item.quantity} min={0} max={item.stock} onChange={delta => change(item, delta)} /></td>
                  <td className="cart-amount"><RollingNumber value={item.quantity * item.unitPrice} currency /></td>
                  <td className="cart-action"><button type="button" className="text-button" aria-label={copy.remove + ' ' + label}
                    onClick={() => change(item, -item.quantity)}>{copy.remove}</button></td>
                </tr>
              );
            })}</tbody>
          </table>
          <div className="cart-foot"><Subtotal value={subtotal} copy={copy} />
            <button type="button" className="button button-solid" disabled={!valid} onClick={onCheckout}>
              <Icon name="shopify" />{copy.checkout}<Icon name="arrow" />
            </button>
          </div>
        </> : <div className="empty cart-empty"><CartIcon /><p>{copy.emptyCart}</p>
          <a href="#koleksi" className="button button-outline" onClick={onBrowse}>{copy.backToCollection}</a>
        </div>}
      </div>
    </Surface>
  );
}
