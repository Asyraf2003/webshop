import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { products, type Category, type Product } from './catalog';
import { CartPanel } from './cart-panel';
import { CheckoutPanel } from './checkout-panel';
import type { Point } from './commerce-ui';
import { PageBackdrop, PromoHero } from './home-stage';
import { categoryName, copyFor, descriptionFor, readLocale } from './locale';
import { pressFeedback } from './motion';
import { ProductDetail } from './product-detail';
import { SavedPanel } from './saved-panel';
import { summarizeCart, type Variant } from './shop';
import { linkedProduct, readSaved, setLinkedProduct, useCart, useStored } from './store-state';
import { SiteFooter, SiteHeader } from './site-chrome';
import { Catalogue } from './storefront';
import './paperplay.css';
import './home.css';

type Panel = 'detail' | 'cart' | 'saved' | 'checkout' | null;
type Selection = { product: Product; visit: number; imageOrigin?: DOMRect; fromSaved?: boolean };

function scrollToCatalogue() {
  document.getElementById('koleksi')?.scrollIntoView({ block: 'start' });
}

function App() {
  const [locale, setLocale] = useStored('paperplay-webshop-locale-v2', readLocale);
  const [saved, setSaved] = useStored('paperplay-webshop-saved-v1', readSaved);
  const [category, setCategory] = useState<Category | ''>('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Selection | undefined>(() => {
    const product = linkedProduct();
    return product ? { product, visit: 0 } : undefined;
  });
  const [panel, setPanel] = useState<Panel>(selected ? 'detail' : null);
  const [origin, setOrigin] = useState<Point>();
  const [checkoutVisit, setCheckoutVisit] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const cart = useCart();
  const summary = summarizeCart(cart.lines);
  const copy = copyFor(locale);
  const savedProducts = products.filter(product => saved.includes(product.id));

  const term = query.trim().toLocaleLowerCase(locale);
  const matches = products.filter(product => (!category || product.category === category) &&
    [product.name, product.category, categoryName(product.category, locale), descriptionFor(product, locale)]
      .join(' ').toLocaleLowerCase(locale).includes(term));

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = 'Paperplay — ' + copy.collection;
  }, [locale, copy.collection]);
  useEffect(() => {
    function syncLink() {
      const product = linkedProduct();
      if (product) setSelected(previous => ({ product, visit: (previous?.visit ?? 0) + 1 }));
      setPanel(product ? 'detail' : null);
    }
    window.addEventListener('popstate', syncLink);
    return () => window.removeEventListener('popstate', syncLink);
  }, []);

  function resetCatalogue() {
    setCategory('');
    setQuery('');
  }

  function openSaved(point: Point) {
    setOrigin(point);
    setPanel('saved');
  }

  function openProduct(product: Product, imageOrigin?: DOMRect, fromSaved = false) {
    setSelected(previous => ({ product, imageOrigin, fromSaved, visit: (previous?.visit ?? 0) + 1 }));
    setLinkedProduct(product.id);
    setPanel('detail');
  }

  function closePanel() {
    if (panel === 'detail') setLinkedProduct();
    setPanel(panel === 'detail' && selected?.fromSaved ? 'saved' : null);
  }

  function openCart(point: Point) {
    setLinkedProduct();
    setOrigin(point);
    setPanel('cart');
  }

  function beginCheckout() {
    setCheckoutVisit(current => current + 1);
    setPanel('checkout');
  }

  function browseCategory(next: Category) {
    resetCatalogue();
    setCategory(next);
  }

  function addToCart(variant: Variant, count: number, checkout: boolean) {
    if (!cart.change(variant, count)) return false;
    setAnnouncement(copy.added + ' ' + count + ' ' + (selected?.product.name ?? ''));
    if (checkout) {
      setLinkedProduct();
      if (summary.items.some(item => item.quantity > item.stock)) setPanel('cart');
      else beginCheckout();
    }
    return true;
  }

  return (
    <div className="paperplay-app" onClickCapture={pressFeedback}>
      <PageBackdrop />
      <a className="skip-link" href="#main">{copy.skip}</a>
      <SiteHeader copy={copy} locale={locale} query={query} quantity={summary.quantity} searchRef={search}
        onQuery={value => { if (!query && value) scrollToCatalogue(); setQuery(value); }}
        onSearchFocus={() => { if (window.scrollY > (document.getElementById('koleksi')?.offsetTop ?? 0)) scrollToCatalogue(); }}
        onHome={resetCatalogue} onLanguage={() => setLocale(current => current === 'id' ? 'en' : 'id')}
        onSaved={openSaved} onCart={openCart} />
      <main id="main" tabIndex={-1}>
        <PromoHero copy={copy} onOpen={openProduct} suspended={panel !== null} />
        <Catalogue copy={copy} locale={locale} list={matches} category={category} saved={saved}
          onCategory={setCategory} onOpen={openProduct} onReset={resetCatalogue}
          onSave={product => setSaved(current => current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id])} />
      </main>
      <SiteFooter copy={copy} locale={locale} onHome={resetCatalogue} onCategory={browseCategory}
        onSaved={openSaved} onCart={openCart} />
      <span className="sr-only" role="status">{announcement}</span>
      <SavedPanel open={panel === 'saved'} origin={origin} copy={copy} locale={locale} items={savedProducts} onClose={closePanel}
        onOpen={(product, image) => openProduct(product, image, true)}
        onRemove={product => setSaved(current => current.filter(id => id !== product.id))} />
      {selected && <ProductDetail key={selected.visit} product={selected.product} imageOrigin={selected.imageOrigin}
        open={panel === 'detail'} copy={copy} locale={locale}
        cart={cart.lines} onClose={closePanel} onCart={openCart} onAdd={addToCart} />}
      <CartPanel open={panel === 'cart'} origin={origin} copy={copy} locale={locale} {...summary} onChange={cart.change}
        onClose={closePanel} onBrowse={() => { closePanel(); resetCatalogue(); }} onCheckout={beginCheckout} />
      {checkoutVisit > 0 && <CheckoutPanel key={checkoutVisit} open={panel === 'checkout'} copy={copy} locale={locale}
        items={summary.items} valid={summary.valid} onClose={() => setPanel('cart')} onComplete={closePanel} onOrder={cart.clear} />}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
