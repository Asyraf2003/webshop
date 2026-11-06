import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { usePrefersReducedMotion } from '@number-flow/react';
import { gsap } from 'gsap';
import { categories, money, products, type Category, type Product } from './catalog';
import { centerOf, CloseButton, Price, Rating, Surface, type Point } from './commerce-ui';
import { CartIcon, Icon, mediaUrl } from './icons';
import { categoryName, type Copy, type Locale } from './locale';
import { PaperMark, RollingNumber, RollWall } from './motion';
import { ProductArt } from './product-art';
import { priceFor } from './shop';
import { productLink } from './store-state';

function Wordmark({ onClick }: { onClick?: () => void }) {
  return <a className="wordmark" href="#main" aria-label="Paperplay" onClick={onClick}><PaperMark /><span>paperplay<span>.</span></span></a>;
}

export function Header({ copy, locale, query, savedOnly, quantity, searchRef, onQuery, onSearchFocus, onHome, onLanguage, onSaved, onMenu, onCart }: {
  copy: Copy; locale: Locale; query: string; savedOnly: boolean; quantity: number;
  searchRef: RefObject<HTMLInputElement | null>;
  onQuery: (value: string) => void; onSearchFocus: () => void; onHome: () => void; onLanguage: () => void; onSaved: () => void;
  onMenu: () => void; onCart: (origin: Point) => void;
}) {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Wordmark onClick={onHome} />
        <label className="header-search"><Icon name="search" />
          <input ref={searchRef} type="search" aria-label={copy.search} placeholder={copy.search + '…'}
            value={query} onFocus={onSearchFocus} onChange={event => onQuery(event.target.value)} />
        </label>
        <div className="header-actions">
          <button type="button" className="plain-icon menu-trigger" aria-label={copy.openMenu} aria-haspopup="dialog" onClick={onMenu}><Icon name="menu" /></button>
          <button type="button" className="plain-icon language-trigger" aria-label={copy.switchLanguage} onClick={onLanguage}>
            <Icon name="language" /><span>{locale.toUpperCase()}</span>
          </button>
          <button type="button" className="plain-icon bookmark" aria-label={copy.saved} aria-pressed={savedOnly} onClick={onSaved}><Icon name="bookmark" /></button>
          <button type="button" className="plain-icon cart-trigger" aria-label={copy.cart + ', ' + quantity + ' ' + copy.item} aria-haspopup="dialog"
            onClick={event => onCart(centerOf(event.currentTarget))}>
            <CartIcon /><span className="cart-badge" aria-hidden="true"><RollingNumber value={quantity} /></span>
          </button>
        </div>
      </div>
    </header>
  );
}

function Curves() {
  return (
    <svg className="curves" viewBox="0 0 590 320" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <path d="M-35 315C117 278 65 107 222 75c116-23 147 68 224 21C512 56 524 4 617 2" />
      <path d="M-32 338C125 300 88 129 230 99c109-23 147 65 227 17C529 73 547 18 625 25" />
      <path d="M-28 361C140 314 105 149 240 124c106-20 146 59 226 11C538 92 559 44 637 50" />
      <path d="M-23 384C150 330 124 170 251 149c103-17 146 53 225 4C548 108 570 68 648 74" />
      <path d="M-19 407C166 345 146 192 262 173c99-15 142 49 226-3C563 124 588 90 659 98" />
      <path d="M-15 430C181 361 168 218 275 197c91-18 143 43 224-8C579 139 603 113 669 122" />
    </svg>
  );
}

export function StoreMenu({ copy, open, onClose, onBrowse, onSaved }: {
  copy: Copy; open: boolean; onClose: () => void; onBrowse: () => void; onSaved: () => void;
}) {
  const links = [{ id: 'main', label: copy.home }, { id: 'koleksi', label: copy.collection }, { id: 'galeri', label: copy.gallery }];
  function navigate() { onBrowse(); onClose(); }
  return (
    <Surface open={open} kind="menu" titleId="menu-title" onClose={onClose}>
      <Curves />
      <div className="menu-layout wrap">
        <header className="menu-head">
          <Wordmark onClick={navigate} />
          <h2 className="sr-only" id="menu-title">{copy.menu}</h2>
          <CloseButton label={copy.close + ' ' + copy.menu} onClose={onClose} />
        </header>
        <nav className="menu-links" aria-label={copy.menu}>
          {links.map((link, index) => (
            <a key={link.id} href={'#' + link.id} onClick={navigate}>
              <span className="menu-index"><RollingNumber value={index + 1} pad /></span>
              <span className="menu-mask"><span className="menu-label">{link.label}</span></span>
              <Icon name="diagonal" />
            </a>
          ))}
          <button type="button" onClick={onSaved}>
            <span className="menu-index"><RollingNumber value={links.length + 1} pad /></span>
            <span className="menu-mask"><span className="menu-label">{copy.saved}</span></span>
            <Icon name="bookmark" />
          </button>
        </nav>
        <span className="menu-foot">{copy.footer}</span>
      </div>
    </Surface>
  );
}

function ProductLink({ product, className, label, onOpen, children }: {
  product: Product; className: string; label?: string; onOpen: (product: Product) => void; children: ReactNode;
}) {
  return (
    <a href={productLink(product.id)} className={className} aria-label={label} aria-haspopup="dialog" onClick={event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      onOpen(product);
    }}>{children}</a>
  );
}

const promotions = products.filter(product => product.promo);

export function PromoCarousel({ copy, onOpen }: { copy: Copy; onOpen: (product: Product) => void }) {
  const [view, setView] = useState({ index: 0, direction: 1 });
  const section = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const product = promotions[view.index];
  const photo = product.media?.find(asset => asset.kind === 'image');
  const color = product.colors[0];

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const scope = gsap.context(() => {
      gsap.timeline()
        .fromTo('.promo-frame', { xPercent: view.direction * 6, rotateX: -14 * view.direction, rotateZ: 2 * view.direction, opacity: .25 },
          { xPercent: 0, rotateX: 0, rotateZ: 0, opacity: 1, duration: .67, ease: 'power3.out', clearProps: 'transform,opacity' })
        .from('.promo-name', { y: 9, opacity: 0, duration: .41, ease: 'power2.out', clearProps: 'transform,opacity' }, .08);
    }, section);
    return () => scope.revert();
  }, [view, reducedMotion]);

  function move(direction: number) {
    setView(current => ({ index: (current.index + direction + promotions.length) % promotions.length, direction }));
  }

  return (
    <section className="wrap promo" aria-label={copy.promotion} ref={section}>
      <div className="promo-layout" style={{ '--promo-tint': color.tint } as CSSProperties}>
        <Curves />
        <div className="promo-copy">
          <span className="promo-label"><Icon name="ticket" />{copy.demoPromo}</span>
          <h2 className="promo-name">{product.name}</h2>
          <Price product={product} size={product.sizes[0]} copy={copy} mode="hero" />
          <ProductLink className="promo-link" product={product} onOpen={onOpen}>{copy.viewProduct} <Icon name="diagonal" /></ProductLink>
        </div>
        <div className="promo-media" aria-hidden="true">
          <div className="promo-frame" key={product.id}>
            {photo ? <img src={mediaUrl(photo.path)} width="1200" height="800" alt="" decoding="async" /> :
              <div className="promo-art"><ProductArt product={product} color={color} /></div>}
          </div>
        </div>
        <div className="promo-pagination">
          <span role="status" className="promo-counter"><RollingNumber value={view.index + 1} pad /> <span>/</span> <RollingNumber value={promotions.length} pad /></span>
          <button type="button" className="plain-icon arrow-prev" aria-label={copy.previous + ' ' + copy.promotion} onClick={() => move(-1)}><Icon name="arrow" /></button>
          <button type="button" className="plain-icon" aria-label={copy.next + ' ' + copy.promotion} onClick={() => move(1)}><Icon name="arrow" /></button>
        </div>
      </div>
    </section>
  );
}

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

export function Catalogue({ copy, locale, list, category, saved, savedOnly, onCategory, onOpen, onSave, onReset }: {
  copy: Copy; locale: Locale; list: readonly Product[]; category: Category | ''; saved: string[]; savedOnly: boolean;
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
        <h1 id="catalog-title">{savedOnly ? copy.saved : copy.collection}</h1>
        <span className="product-count" role="status"><RollingNumber value={list.length} /> {copy.products}</span>
      </div>
      <CategoryTabs copy={copy} locale={locale} active={category} onChange={onCategory} />
      <div className="product-grid" ref={grid}>
        {list.map(product => <ProductCard product={product} copy={copy} locale={locale} key={product.id} saved={saved.includes(product.id)}
          onOpen={onOpen} onSave={() => onSave(product)} />)}
      </div>
      {!list.length && (
        <div className="empty"><p>{savedOnly && !saved.length ? copy.noSaved : copy.noResults}</p>
          <button type="button" className="button button-outline" onClick={onReset}>{copy.showAll}</button>
        </div>
      )}
    </section>
  );
}

export function Gallery({ copy, locale }: { copy: Copy; locale: Locale }) {
  return (
    <section className="wrap gallery-section" id="galeri" aria-labelledby="gallery-title">
      <h2 id="gallery-title">{copy.gallery}</h2>
      <RollWall image={mediaUrl('editorial/rocket-studio.webp')} locale={locale} renderArt={(product, color) => <ProductArt product={product} color={color} />} />
    </section>
  );
}

export function Footer({ copy, onHome }: { copy: Copy; onHome: () => void }) {
  return <footer className="site-footer"><div className="wrap footer-inner"><Wordmark onClick={onHome} /><p>{copy.footer}</p><a href="#main">{copy.back} ↑</a></div></footer>;
}
