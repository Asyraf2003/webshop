import { useRef, useState, type CSSProperties } from 'react';
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

export function CheckoutPanel({ open, copy, locale, items, subtotal, valid, onClose, onComplete }: {
  open: boolean; copy: Copy; locale: Locale; items: CartItem[]; subtotal: number; valid: boolean; onClose: () => void; onComplete: () => void;
}) {
  const [complete, setComplete] = useState(false);
  function close() { setComplete(false); onClose(); }
  function finish() { setComplete(false); onComplete(); }

  return (
    <Surface open={open} kind="checkout" titleId="checkout-title" onClose={close}>
      <header className="surface-head"><h2 id="checkout-title">{copy.checkout}</h2>
        <CloseButton label={copy.close + ' ' + copy.checkout} onClose={close} />
      </header>
      <div className="checkout-body">
        {complete ? <div className="empty" role="status"><Icon name="check" /><p>{copy.complete}</p>
          <button type="button" className="button button-solid" onClick={finish}>{copy.keepShopping}</button>
        </div> : <>
          <p className="checkout-note">{copy.checkoutNote}</p>
          <ul className="checkout-list">{items.map(item => (
            <li key={variantKey(item)}>
              <div><RollingNumber value={item.quantity} /> × {item.product.name}<small><VariantText item={item} locale={locale} /></small></div>
              <strong><RollingNumber value={item.quantity * item.unitPrice} currency /></strong>
            </li>
          ))}</ul>
          <Subtotal value={subtotal} copy={copy} />
          <button type="button" className="button button-solid checkout-confirm" disabled={!valid} onClick={() => setComplete(true)}>{copy.simulate}<Icon name="arrow" /></button>
        </>}
      </div>
    </Surface>
  );
}
