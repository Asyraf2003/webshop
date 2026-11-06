import { useEffect, useRef, useState, type RefObject } from 'react';
import { centerOf, type Point } from './commerce-ui';
import { CartIcon, Icon } from './icons';
import type { Copy, Locale } from './locale';
import { PaperMark, RollingNumber } from './motion';

function Wordmark({ onClick }: { onClick: () => void }) {
  return <a className="wordmark" href="#main" aria-label="Paperplay" onClick={onClick}><PaperMark /><span>paperplay<span>.</span></span></a>;
}

function Menu({ copy, onBrowse, onSaved }: { copy: Copy; onBrowse: () => void; onSaved: () => void }) {
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

  function browse() { setOpen(false); onBrowse(); }
  function saved() { setOpen(false); trigger.current?.focus(); onSaved(); }

  return (
    <div ref={anchor} className="menu-anchor" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button type="button" ref={trigger} className="menu-pill" aria-expanded={open} aria-controls="site-menu"
        aria-label={open ? copy.close + ' ' + copy.menu : copy.openMenu} onClick={() => setOpen(current => !current)}>
        <span>{open ? copy.close : copy.menu}</span><Icon name={open ? 'close' : 'menu'} />
      </button>
      <nav id="site-menu" className="menu-popover" data-open={open} aria-label={copy.menu} inert={!open}>
        <a href="#main" onClick={browse}><span>{copy.home}</span><Icon name="arrow" /></a>
        <a href="#koleksi" onClick={browse}><span>{copy.collection}</span><Icon name="arrow" /></a>
        <button type="button" onClick={saved}><span>{copy.saved}</span><Icon name="arrow" /></button>
      </nav>
    </div>
  );
}

export function SiteHeader({ copy, locale, query, savedOnly, quantity, searchRef, onQuery, onSearchFocus, onHome, onLanguage, onSaved, onCart }: {
  copy: Copy; locale: Locale; query: string; savedOnly: boolean; quantity: number;
  searchRef: RefObject<HTMLInputElement | null>;
  onQuery: (value: string) => void; onSearchFocus: () => void; onHome: () => void; onLanguage: () => void;
  onSaved: (show: boolean) => void; onCart: (origin: Point) => void;
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
          <button type="button" className="plain-icon language-trigger" aria-label={copy.switchLanguage} onClick={onLanguage}>
            <Icon name="language" /><span>{locale.toUpperCase()}</span>
          </button>
          <button type="button" className="plain-icon bookmark" aria-label={copy.saved} aria-pressed={savedOnly} onClick={() => onSaved(!savedOnly)}><Icon name="bookmark" /></button>
          <button type="button" className="plain-icon cart-trigger" aria-label={copy.cart + ', ' + quantity + ' ' + copy.item} aria-haspopup="dialog"
            onClick={event => onCart(centerOf(event.currentTarget))}>
            <CartIcon /><span className="cart-badge" aria-hidden="true"><RollingNumber value={quantity} /></span>
          </button>
          <Menu copy={copy} onBrowse={onHome} onSaved={() => onSaved(true)} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ copy, onHome }: { copy: Copy; onHome: () => void }) {
  return <footer className="site-footer"><div className="wrap footer-inner"><Wordmark onClick={onHome} /><p>{copy.footer}</p><a href="#main">{copy.back} ↑</a></div></footer>;
}
