import { useState, type CSSProperties } from 'react';
import type { ColorOption, MediaAsset, Product, SizeOption } from './catalog';
import { centerOf, CloseButton, Price, Rating, Stepper, Surface, type Point } from './commerce-ui';
import { CartIcon, Icon, mediaUrl } from './icons';
import { categoryName, colorName, descriptionFor, materialFor, type Copy, type Locale } from './locale';
import { RollingNumber } from './motion';
import { ProductArt, ProductStage } from './product-art';
import { stockFor, variantFor, variantKey, type CartLine, type Variant } from './shop';
import { productLink, shareProduct } from './store-state';

function MediaThumbnail({ product, color, asset, crop }: {
  product: Product; color: ColorOption; asset?: MediaAsset; crop: boolean;
}) {
  if (!asset) return <span className="thumbnail-art" data-crop={crop}><ProductArt product={product} color={color} /></span>;
  if (asset.kind === 'image') return <img src={mediaUrl(asset.path)} alt="" decoding="async" />;
  return <>{asset.poster && <img src={mediaUrl(asset.poster)} alt="" decoding="async" />}<Icon name="play" /></>;
}

function ProductMedia({ product, color, size, active, onMedia, copy, locale }: {
  product: Product; color: ColorOption; size: SizeOption; active: number; onMedia: (index: number) => void; copy: Copy; locale: Locale;
}) {
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared' | 'link'>('idle');
  const url = productLink(product.id);
  const assets = product.media ?? [];
  const selected = assets[active - 2];
  const labels = [copy.front, copy.closeUp, ...assets.map(asset => locale === 'en' ? asset.labelEn : asset.label)];

  return (
    <div className="product-media">
      <div className="detail-preview" key={active}>
        {selected ? (selected.kind === 'video' ? (
          <video controls playsInline preload="metadata" src={mediaUrl(selected.path)}
            poster={selected.poster ? mediaUrl(selected.poster) : undefined} aria-label={labels[active]} />
        ) : (
          <img className="media-photo" src={mediaUrl(selected.path)} alt={labels[active]} decoding="async" />
        )) : <ProductStage product={product} color={color} size={size} locale={locale} detail={active === 1} />}
      </div>
      <div className="media-thumbs" role="group" aria-label={copy.media}>
        {labels.map((label, index) => (
          <button key={index} type="button" className="media-thumb" aria-label={label} aria-pressed={index === active}
            style={{ '--tint': color.tint } as CSSProperties} onClick={() => onMedia(index)}>
            <MediaThumbnail product={product} color={color} asset={assets[index - 2]} crop={index === 1} />
          </button>
        ))}
      </div>
      <div className="share-row">
        <button type="button" className="text-button" onClick={async () => setShareState(await shareProduct(product.name, url))}>
          <Icon name={shareState === 'copied' ? 'check' : 'share'} />{shareState === 'copied' ? copy.copied : copy.share}
        </button>
        {shareState === 'copied' && <span className="sr-only" role="status">{copy.copied}</span>}
        {shareState === 'link' && <input type="url" className="share-link" aria-label={copy.shareLink} readOnly value={url} onFocus={event => event.currentTarget.select()} />}
      </div>
    </div>
  );
}

export function ProductDetail({ product, open, copy, locale, cart, onClose, onCart, onAdd }: {
  product: Product; open: boolean; copy: Copy; locale: Locale; cart: CartLine[];
  onClose: () => void; onCart: (origin: Point) => void; onAdd: (variant: Variant, count: number, checkout: boolean) => boolean;
}) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [count, setCount] = useState(1);
  const [media, setMedia] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'added' | 'limit'>('idle');
  const stock = stockFor(product, color, size);
  const variant = variantFor(product, color, size);
  const existing = cart.find(line => variantKey(line) === variantKey(variant))?.quantity ?? 0;
  const available = Math.max(0, stock - existing);
  const quantity = Math.max(1, Math.min(count, available));

  function chooseVariant(nextColor: ColorOption, nextSize: SizeOption) {
    setColor(nextColor);
    setSize(nextSize);
    setMedia(0);
    setFeedback('idle');
  }

  function add(checkout: boolean) {
    setFeedback(onAdd(variant, quantity, checkout) ? 'added' : 'limit');
  }

  return (
    <Surface open={open} kind="detail" titleId="detail-title" onClose={onClose}>
      <CloseButton label={copy.close + ' ' + copy.product} onClose={onClose} />
      <div className="detail-layout">
        <ProductMedia product={product} color={color} size={size} active={media} onMedia={setMedia} copy={copy} locale={locale} />
        <div className="detail-buy">
          <div className="detail-title">
            {product.badge && <span className="product-badge" data-badge={product.badge}>{copy[product.badge]}</span>}
            <h2 id="detail-title">{product.name}</h2>
          </div>
          <Rating product={product} copy={copy} locale={locale} detailed />
          <Price product={product} size={size} copy={copy} mode="detail" />
          <div className="detail-options">
            <fieldset className="option-row">
              <legend className="sr-only">{copy.color}</legend>
              <span className="option-label" aria-hidden="true">{copy.color}</span>
              <div className="variant-options">
                {product.colors.map(option => (
                  <label className="variant-option color-option" data-press key={option.id} title={colorName(option, locale)}>
                    <input type="radio" name="detail-color" aria-label={colorName(option, locale)} checked={option.id === color.id}
                      onChange={() => chooseVariant(option, size)} />
                    <span className="color-dot" style={{ '--swatch': option.swatch } as CSSProperties} />
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="option-row">
              <legend className="sr-only">{copy.size}</legend>
              <span className="option-label" aria-hidden="true">{copy.size}</span>
              <div className="variant-options">
                {product.sizes.map(option => (
                  <label className="variant-option size-option" data-press key={option.id}>
                    <input type="radio" name="detail-size" aria-label={option.height + ' cm'} checked={option.id === size.id}
                      onChange={() => chooseVariant(color, option)} />
                    <span className="size-chip"><RollingNumber value={option.height} suffix=" cm" /></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="option-row">
              <span className="option-label" aria-hidden="true">{copy.quantity}</span>
              <div className="quantity-row">
                <Stepper label={copy.quantity} copy={copy} value={quantity} max={available}
                  onChange={delta => { setCount(quantity + delta); setFeedback('idle'); }} />
                <span className="stock-label" data-empty={!stock} role="status">
                  {stock ? <>{copy.stock} <RollingNumber value={stock} /></> : copy.outOfStock}
                </span>
              </div>
            </div>
          </div>
          <div className="detail-purchase">
            <button type="button" className="button button-outline" disabled={!available} onClick={() => add(false)}>
              {feedback === 'added' ? <Icon name="check" /> : <CartIcon />}{feedback === 'added' ? copy.added : copy.add}
            </button>
            <button type="button" className="button button-solid" disabled={!available} onClick={() => add(true)}>
              <Icon name="shopify" />{copy.checkout}
            </button>
          </div>
          {feedback === 'added' && <button type="button" className="text-button view-cart" onClick={event => onCart(centerOf(event.currentTarget))}>
            {copy.viewCart}<Icon name="arrow" />
          </button>}
          {(feedback === 'limit' || (!available && stock > 0)) && <p className="stock-error" role="status">{copy.stockLimit}</p>}
        </div>
      </div>
      <section className="product-section" aria-labelledby="specs-title">
        <h3 id="specs-title">{copy.specs}</h3>
        <dl className="spec-list">
          <div><dt>{copy.series}</dt><dd>{categoryName(product.category, locale)}</dd></div>
          <div><dt>{copy.material}</dt><dd>{materialFor(product, locale)}</dd></div>
          <div><dt>{copy.height}</dt><dd><RollingNumber value={size.height} suffix=" cm" /></dd></div>
          <div><dt>{copy.color}</dt><dd>{colorName(color, locale)}</dd></div>
        </dl>
      </section>
      <section className="product-section" aria-labelledby="description-title">
        <h3 id="description-title">{copy.description}</h3>
        <p>{descriptionFor(product, locale)}</p><p className="fine-print">{copy.concept}</p>
      </section>
    </Surface>
  );
}
