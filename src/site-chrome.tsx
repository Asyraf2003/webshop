import { useEffect, useRef, useState, type RefObject } from 'react';
import { categories, type Category } from './catalog';
import { centerOf, type Point } from './commerce-ui';
import { CartIcon, Icon, LanguageFlag } from './icons';
import { categoryName, type Copy, type Locale } from './locale';
import { PaperMark, RollingNumber } from './motion';

function Wordmark({ onClick }: { onClick: () => void }) {
  return <a className="wordmark" href="#main" aria-label="Paperplay" onClick={onClick}><PaperMark /><span>paperplay<span>.</span></span></a>;
}

function Account({ copy }: { copy: Copy }) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !anchor.current?.contains(event.target)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <div ref={anchor} className="account-anchor" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button type="button" ref={trigger} className="plain-icon header-control account-trigger" aria-expanded={open}
        aria-controls="account-popover" aria-label={copy.account} onClick={() => setOpen(current => !current)}>
        <Icon name="account" />
      </button>
      <div id="account-popover" className="account-popover" data-open={open} aria-hidden={!open}>
        <span>{copy.login}</span>
      </div>
    </div>
  );
}

export function SiteHeader({ copy, locale, query, quantity, searchRef, onQuery, onSearchFocus, onHome, onLanguage, onSaved, onCart }: {
  copy: Copy; locale: Locale; query: string; quantity: number;
  searchRef: RefObject<HTMLInputElement | null>;
  onQuery: (value: string) => void; onSearchFocus: () => void; onHome: () => void; onLanguage: () => void;
  onSaved: (origin: Point) => void; onCart: (origin: Point) => void;
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
          <button type="button" className="plain-icon header-control" aria-label={copy.switchLanguage}
            title={copy.switchLanguage} onClick={onLanguage}>
            <LanguageFlag locale={locale} />
          </button>
          <button type="button" className="plain-icon header-control bookmark" aria-label={copy.saved} aria-haspopup="dialog"
            onClick={event => onSaved(centerOf(event.currentTarget))}><Icon name="bookmark" /></button>
          <button type="button" className="plain-icon header-control cart-trigger" aria-label={copy.cart + ', ' + quantity + ' ' + copy.item} aria-haspopup="dialog"
            onClick={event => onCart(centerOf(event.currentTarget))}>
            <CartIcon /><span className="cart-badge" aria-hidden="true"><RollingNumber value={quantity} /></span>
          </button>
          <Account copy={copy} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ copy, locale = 'en', onHome, onCategory, onSaved, onCart }: {
  copy: Copy; locale?: Locale; onHome: () => void;
  onCategory?: (category: Category) => void; onSaved?: (origin: Point) => void; onCart?: (origin: Point) => void;
}) {
  return (
    <footer className="site-footer">
      <div className="footer-print" aria-hidden="true"><PaperMark variant={1} /></div>
      <div className="wrap">
        <div className="footer-inner">
          <div className="footer-brand">
            <Wordmark onClick={onHome} />
            <h2>{copy.footerHeadline}</h2>
            <p>{copy.footer}</p>
          </div>
          <nav className="footer-nav" aria-label={copy.explore}>
            <h3>{copy.explore}</h3>
            <a href="#koleksi" onClick={onHome}>{copy.collection}</a>
            {categories.map(category => <a href="#koleksi" key={category} onClick={() => onCategory?.(category)}>{categoryName(category, locale)}</a>)}
          </nav>
          <nav className="footer-nav" aria-label={copy.shopping}>
            <h3>{copy.shopping}</h3>
            <a href="#promo">{copy.promotion}</a>
            {onSaved && <button type="button" aria-haspopup="dialog" onClick={event => onSaved(centerOf(event.currentTarget))}>{copy.saved}</button>}
            {onCart && <button type="button" onClick={event => onCart(centerOf(event.currentTarget))}>{copy.cart}</button>}
          </nav>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Paperplay</span>
          <a href="#main">{copy.back}<Icon name="arrow" /></a>
        </div>
      </div>
    </footer>
  );
}
