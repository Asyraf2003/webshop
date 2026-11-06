import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { products, type Category, type Product } from './catalog';
import { CartPanel, CheckoutPanel } from './cart-panel';
import type { Point } from './commerce-ui';
import { categoryName, copyFor, descriptionFor, readLocale } from './locale';
import { pressFeedback } from './motion';
import { ProductDetail } from './product-detail';
import { summarizeCart, type Variant } from './shop';
import { linkedProduct, readSaved, setLinkedProduct, useCart, useStored } from './store-state';
import { Catalogue, Footer, Gallery, Header, PromoCarousel, StoreMenu } from './storefront';
import './paperplay.css';

type Panel = 'menu' | 'detail' | 'cart' | 'checkout' | null;

function scrollToCatalogue() {
  document.getElementById('koleksi')?.scrollIntoView({ block: 'start' });
}

function App() {
  const [locale, setLocale] = useStored('paperplay-webshop-locale-v1', readLocale);
  const [saved, setSaved] = useStored('paperplay-webshop-saved-v1', readSaved);
  const [savedOnly, setSavedOnly] = useState(false);
  const [category, setCategory] = useState<Category | ''>('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(linkedProduct);
  const [panel, setPanel] = useState<Panel>(selected ? 'detail' : null);
  const [origin, setOrigin] = useState<Point>();
  const [announcement, setAnnouncement] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const cart = useCart();
  const summary = summarizeCart(cart.lines);
  const copy = copyFor(locale);

  const term = query.trim().toLocaleLowerCase(locale);
  const matches = products.filter(product => (!category || product.category === category) &&
    (!savedOnly || saved.includes(product.id)) &&
    [product.name, product.category, categoryName(product.category, locale), descriptionFor(product, locale)]
      .join(' ').toLocaleLowerCase(locale).includes(term));

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => {
    function syncLink() {
      const product = linkedProduct();
      if (product) setSelected(product);
      setPanel(product ? 'detail' : null);
    }
    window.addEventListener('popstate', syncLink);
    return () => window.removeEventListener('popstate', syncLink);
  }, []);

  function resetCatalogue() {
    setCategory('');
    setQuery('');
    setSavedOnly(false);
  }

  function toggleSaved(show: boolean) {
    setCategory('');
    setQuery('');
    setSavedOnly(show);
    setPanel(null);
    requestAnimationFrame(scrollToCatalogue);
  }

  function openProduct(product: Product) {
    setSelected(product);
    setLinkedProduct(product.id);
    setPanel('detail');
  }

  function closePanel() {
    if (panel === 'detail') setLinkedProduct();
    setPanel(null);
  }

  function openCart(point: Point) {
    setLinkedProduct();
    setOrigin(point);
    setPanel('cart');
  }

  function addToCart(variant: Variant, count: number, checkout: boolean) {
    if (!cart.change(variant, count)) return false;
    setAnnouncement(copy.added + ' ' + count + ' ' + (selected?.name ?? ''));
    if (checkout) {
      setLinkedProduct();
      setPanel(summary.items.some(item => item.quantity > item.stock) ? 'cart' : 'checkout');
    }
    return true;
  }

  return (
    <div className="paperplay-app" onClickCapture={pressFeedback}>
      <a className="skip-link" href="#main">{copy.skip}</a>
      <Header copy={copy} locale={locale} query={query} savedOnly={savedOnly} quantity={summary.quantity} searchRef={search}
        onQuery={value => { if (!query && value) scrollToCatalogue(); setQuery(value); }}
        onSearchFocus={() => { if (window.scrollY > (document.getElementById('koleksi')?.offsetTop ?? 0)) scrollToCatalogue(); }}
        onHome={resetCatalogue} onLanguage={() => setLocale(current => current === 'id' ? 'en' : 'id')}
        onSaved={() => toggleSaved(!savedOnly)} onMenu={() => setPanel('menu')} onCart={openCart} />
      <main id="main" tabIndex={-1}>
        <PromoCarousel copy={copy} onOpen={openProduct} />
        <Catalogue copy={copy} locale={locale} list={matches} category={category} saved={saved} savedOnly={savedOnly}
          onCategory={setCategory} onOpen={openProduct} onReset={resetCatalogue}
          onSave={product => setSaved(current => current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id])} />
        <Gallery copy={copy} locale={locale} />
      </main>
      <Footer copy={copy} onHome={resetCatalogue} />
      <span className="sr-only" role="status">{announcement}</span>
      <StoreMenu copy={copy} open={panel === 'menu'} onClose={closePanel} onBrowse={resetCatalogue} onSaved={() => toggleSaved(true)} />
      {selected && <ProductDetail key={selected.id} product={selected} open={panel === 'detail'} copy={copy} locale={locale}
        cart={cart.lines} onClose={closePanel} onCart={openCart} onAdd={addToCart} />}
      <CartPanel open={panel === 'cart'} origin={origin} copy={copy} locale={locale} {...summary} onChange={cart.change}
        onClose={closePanel} onBrowse={() => { closePanel(); resetCatalogue(); }} onCheckout={() => setPanel('checkout')} />
      <CheckoutPanel open={panel === 'checkout'} copy={copy} locale={locale} {...summary}
        onClose={() => setPanel('cart')} onComplete={closePanel} />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
