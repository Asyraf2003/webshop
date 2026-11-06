import { useRef, type CSSProperties } from 'react';
import type { Product } from './catalog';
import { CloseButton, Price, ProductLink, Surface, type OpenProduct, type Point } from './commerce-ui';
import { Icon } from './icons';
import { categoryName, type Copy, type Locale } from './locale';
import { RollingNumber } from './motion';
import { ProductArt } from './product-art';

function SavedRow({ product, copy, locale, onOpen, onRemove }: {
  product: Product; copy: Copy; locale: Locale; onOpen: OpenProduct; onRemove: () => void;
}) {
  const image = useRef<HTMLSpanElement>(null);
  const color = product.colors[0];

  return (
    <li className="saved-row">
      <ProductLink className="saved-link" product={product} image={image} onOpen={onOpen} label={copy.viewProduct + ' ' + product.name}>
        <span className="saved-art" ref={image} style={{ '--tint': color.tint } as CSSProperties}>
          <ProductArt product={product} color={color} />
        </span>
        <span className="saved-info">
          <strong>{product.name}</strong>
          <small>{categoryName(product.category, locale)}</small>
        </span>
        <Price product={product} size={product.sizes[0]} copy={copy} mode="card" />
      </ProductLink>
      <button type="button" className="plain-icon bookmark" aria-pressed="true"
        aria-label={copy.unsave + ' ' + product.name} onClick={onRemove}><Icon name="bookmark" /></button>
    </li>
  );
}

export function SavedPanel({ open, origin, copy, locale, items, onClose, onOpen, onRemove }: {
  open: boolean; origin?: Point; copy: Copy; locale: Locale; items: Product[];
  onClose: () => void; onOpen: OpenProduct; onRemove: (product: Product) => void;
}) {
  const body = useRef<HTMLDivElement>(null);

  return (
    <Surface open={open} kind="saved" titleId="saved-title" origin={origin} onClose={onClose}>
      <div className="saved-body" ref={body}>
        <header className="surface-head">
          <div><h2 id="saved-title">{copy.saved}</h2><span className="fine-print"><RollingNumber value={items.length} /> {copy.products}</span></div>
          <CloseButton label={copy.close + ' ' + copy.saved} onClose={onClose} />
        </header>
        {items.length ? (
          <ul className="saved-list">
            {items.map(product => (
              <SavedRow key={product.id} product={product} copy={copy} locale={locale} onOpen={onOpen} onRemove={() => {
                body.current?.querySelector<HTMLButtonElement>('.surface-close')?.focus({ preventScroll: true });
                onRemove(product);
              }} />
            ))}
          </ul>
        ) : (
          <div className="empty saved-empty">
            <Icon name="bookmark" /><p>{copy.noSaved}</p>
            <a href="#koleksi" className="button button-outline" onClick={onClose}>{copy.backToCollection}</a>
          </div>
        )}
      </div>
    </Surface>
  );
}
