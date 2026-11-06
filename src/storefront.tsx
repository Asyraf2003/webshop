import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@number-flow/react';
import { gsap } from 'gsap';
import { categories, money, type Category, type Product } from './catalog';
import { Price, ProductLink, Rating, type Point } from './commerce-ui';
import { Icon } from './icons';
import { categoryName, type Copy, type Locale } from './locale';
import { RollingNumber } from './motion';
import { ProductArt } from './product-art';
import { priceFor } from './shop';

function CategoryTabs({ copy, locale, active, onChange }: {
  copy: Copy; locale: Locale; active: Category | ''; onChange: (category: Category | '') => void;
}) {
  const row = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = row.current;
    const highlight = indicator.current;
    if (!container || !highlight) return;
    const selected = container.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!selected) return;
    function place() {
      if (!selected || !highlight) return;
      highlight.style.width = selected.offsetWidth + 'px';
      highlight.style.transform = 'translateX(' + selected.offsetLeft + 'px)';
    }
    place();
    const observer = new ResizeObserver(place);
    observer.observe(container);
    observer.observe(selected);
    return () => observer.disconnect();
  }, [active, locale]);

  return (
    <div className="category-tabs" ref={row} role="group" aria-label={copy.categories}>
      <span ref={indicator} className="category-indicator" aria-hidden="true" />
      {(['', ...categories] as const).map(category => (
        <button type="button" className="category-tab" aria-pressed={category === active} onClick={() => onChange(category)} key={category}>
          {category ? categoryName(category, locale) : copy.all}
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product, copy, locale, saved, onOpen, onSave }: {
  product: Product; copy: Copy; locale: Locale; saved: boolean; onOpen: (product: Product) => void; onSave: () => void;
}) {
  const color = product.colors[0];
  const size = product.sizes[0];
  return (
    <article className="product-card" data-product={product.id} style={{ '--tint': color.tint } as CSSProperties}>
      <ProductLink className="card-link" product={product} label={copy.viewProduct + ' ' + product.name + ', ' + money.format(priceFor(product, size).price)} onOpen={onOpen}>
        <div className="card-art">
          <div className="card-object"><ProductArt product={product} color={color} /></div>
          {product.badge && <span className="product-badge" data-badge={product.badge}>{copy[product.badge]}</span>}
        </div>
        <div className="card-info">
          <h3>{product.name}</h3>
          <Price product={product} size={size} copy={copy} mode="card" />
          <Rating product={product} copy={copy} locale={locale} />
        </div>
      </ProductLink>
      <button type="button" className="plain-icon bookmark card-save" aria-label={(saved ? copy.unsave : copy.save) + ' ' + product.name}
        aria-pressed={saved} onClick={onSave}><Icon name="bookmark" /></button>
    </article>
  );
}

export function Catalogue({ copy, locale, list, category, saved, onCategory, onOpen, onSave, onReset }: {
  copy: Copy; locale: Locale; list: readonly Product[]; category: Category | ''; saved: string[];
  onCategory: (category: Category | '') => void; onOpen: (product: Product) => void; onSave: (product: Product) => void; onReset: () => void;
}) {
  const grid = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, Point>());
  const reducedMotion = usePrefersReducedMotion();
  const items = list.map(product => product.id).join(',');

  useLayoutEffect(() => {
    if (!grid.current) return;
    const cards = [...grid.current.querySelectorAll<HTMLElement>('[data-product]')];
    const previous = positions.current;
    positions.current = new Map(cards.map(card => {
      const box = card.getBoundingClientRect();
      return [card.dataset.product ?? '', { x: box.left + window.scrollX, y: box.top + window.scrollY }];
    }));
    if (reducedMotion) return;
    const motion = gsap.context(() => {
      for (const [index, card] of cards.entries()) {
        const key = card.dataset.product ?? '';
        const start = previous.get(key);
        const end = positions.current.get(key);
        if (!start || !end) {
          gsap.from(card, { y: 12, opacity: 0, duration: .36, delay: Math.min(index * .035, .12), ease: 'power2.out', clearProps: 'transform,opacity' });
        } else if (start.x !== end.x || start.y !== end.y) {
          gsap.fromTo(card, { x: start.x - end.x, y: start.y - end.y }, { x: 0, y: 0, duration: .42, ease: 'power3.out', clearProps: 'transform' });
        }
      }
    }, grid);
    return () => motion.revert();
  }, [items, reducedMotion]);

  return (
    <section className="wrap catalog" id="koleksi" aria-labelledby="catalog-title">
      <div className="catalog-head">
        <h1 id="catalog-title">{copy.collection}</h1>
        <span className="product-count" role="status"><RollingNumber value={list.length} /> {copy.products}</span>
      </div>
      <CategoryTabs copy={copy} locale={locale} active={category} onChange={onCategory} />
      <div className="product-grid" ref={grid}>
        {list.map(product => <ProductCard product={product} copy={copy} locale={locale} key={product.id} saved={saved.includes(product.id)}
          onOpen={onOpen} onSave={() => onSave(product)} />)}
      </div>
      {!list.length && (
        <div className="empty"><p>{copy.noResults}</p>
          <button type="button" className="button button-outline" onClick={onReset}>{copy.showAll}</button>
        </div>
      )}
    </section>
  );
}
