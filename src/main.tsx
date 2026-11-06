import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { categories, products, type Category, type ColorOption, type Product, type SizeOption } from './catalog';
import { Icon, mediaUrl } from './icons';
import { PaperMark, RollingNumber, RollWall, useUprightOnChange } from './motion';
import './styles.css';

type CartLine = { productId: string; colorId: string; sizeId: string; quantity: number };
type CartItem = CartLine & { key: string; product: Product; color: ColorOption; size: SizeOption };

function ProductArt({ product, color }: { product: Product; color: ColorOption }) {
  const gradient = useId();
  if (color.image) {
    const [top, bottom] = color.framing ?? [0, 1];
    const fit = .83 / (bottom - top);
    return <img className="toy-photo" src={mediaUrl(color.image)} width="768" height="768" alt="" decoding="async"
      style={{ top: `${(.91 - bottom * fit) * 100}%`, height: `${fit * 100}%` }} />;
  }

  const varnish = `url(#${gradient})`;
  return (
    <svg className="toy-drawing" viewBox="0 0 240 240" aria-hidden="true">
      <defs><linearGradient id={gradient} x1="0%" x2="95%" y1="0%" y2="100%"><stop stopColor={color.light} /><stop offset=".72" stopColor={color.swatch} /><stop offset="1" stopColor={color.dark} /></linearGradient></defs>
      {product.art === 'rainbow' && <>
        <path d="M29 193v-51a91 91 0 0 1 182 0v51h-26v-51a65 65 0 0 0-130 0v51Z" fill={varnish} />
        <path d="M58 193v-51a62 62 0 0 1 124 0v51h-23v-51a39 39 0 0 0-78 0v51Z" fill={color.light} stroke={color.dark} strokeOpacity=".22" />
        <path d="M84 193v-51a36 36 0 0 1 72 0v51h-21v-51a15 15 0 0 0-30 0v51Z" fill="#daba89" stroke={color.dark} strokeOpacity=".22" />
        <path d="M33 138a87 87 0 0 1 116-81M65 135a57 57 0 0 1 64-49" fill="none" stroke="#fff" strokeOpacity=".33" strokeWidth="2" />
      </>}
      {product.art === 'city' && <>
        <path d="m35 185 19-15 26 7v26H35Zm103-7 26-12 41 15v23h-67Z" fill="#c59868" />
        <path d="M42 121h56v76H42Z" fill={varnish} /><path d="m39 123 31-37 31 37Z" fill={color.dark} />
        <path d="M99 83h49v114H99Z" fill="#d9b486" /><path d="m97 84 27-42 26 42Z" fill={color.light} />
        <path d="M149 134h49v63h-49Z" fill={varnish} /><path d="m147 134 26-30 28 30Z" fill={color.dark} />
        <path d="M59 140h21v17H59Zm54-39h20v16h-20Zm0 29h20v16h-20Zm52 21h16v17h-16Z" fill="#f9e5bb" opacity=".82" />
        <path d="M61 197v-20a9 9 0 0 1 18 0v20m34 0v-24a10 10 0 0 1 20 0v24" fill={color.dark} opacity=".78" />
        <path d="M43 196h155" stroke="#563b2f" strokeOpacity=".35" strokeWidth="3" />
      </>}
      {product.art === 'garden' && <>
        <path d="M54 186v-38m67 44v-51m66 46v-40" stroke="#af805b" strokeWidth="14" strokeLinecap="round" />
        <path d="M21 155c7-33 16-50 33-76 18 26 29 43 35 76Z" fill={color.light} />
        <path d="M79 153c7-38 22-76 42-111 21 36 35 74 44 111Z" fill={varnish} />
        <path d="M157 156c4-29 15-55 30-79 16 24 27 50 32 79Z" fill={color.dark} />
        <ellipse cx="54" cy="189" rx="24" ry="10" fill="#d7ac7c" /><ellipse cx="121" cy="192" rx="29" ry="11" fill="#e2be8b" /><ellipse cx="187" cy="189" rx="23" ry="10" fill="#d7ac7c" />
        <path d="M121 68c-10 24-18 43-24 62" stroke="#fff" strokeOpacity=".29" strokeWidth="2" fill="none" />
      </>}
    </svg>
  );
}

const storageKey = 'paperplay-webshop-cart-v1';
function lineKey(line: CartLine) { return [line.productId, line.colorId, line.sizeId].join(':'); }
function resolveLine(line: CartLine): CartItem | undefined {
  const product = products.find(entry => entry.id === line.productId);
  const color = product?.colors.find(option => option.id === line.colorId);
  const size = product?.sizes.find(option => option.id === line.sizeId);
  if (product && color && size) return { ...line, product, color, size, key: lineKey(line) };
}
function loadCart(): CartLine[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter(line => line && typeof line === 'object' && Number.isSafeInteger(line.quantity) && line.quantity > 0 && resolveLine(line))
      .map(line => ({ productId: line.productId, colorId: line.colorId, sizeId: line.sizeId, quantity: Math.min(line.quantity, 99) }));
  } catch { return []; }
}
function closeBackdrop(event: MouseEvent<HTMLDialogElement>) {
  if (event.target !== event.currentTarget) return;
  const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
  if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) event.currentTarget.close();
}

function Stage({ product, color, size }: { product: Product; color: ColorOption; size: SizeOption }) {
  const largest = Math.max(...product.sizes.map(option => option.height));
  const pivot = useUprightOnChange(size.height);
  const style = { '--tint': color.tint, '--scale': size.height / largest } as CSSProperties;
  return (
    <figure className="stage" style={style}>
      <div className="stage-inner" role="img" aria-label={`${product.name}, ${color.label}, contoh tinggi ${size.height} cm`}>
        <div className="stage-rule" />
        <span className="stage-index"><RollingNumber value={Number(product.number)} pad /> / STUDI BENTUK</span>
        <div className="stage-shadow" />
        <div className="stage-pivot" ref={pivot}>
          <div className="stage-scale">
            {product.colors.map(option => <div className="stage-layer" key={option.id} data-active={option.id === color.id}>
              <ProductArt product={product} color={option} />
            </div>)}
          </div>
        </div>
        <span className="height-pill"><RollingNumber value={size.height} suffix=" cm" /></span>
      </div>
      <figcaption><span>VISUAL KONSEP</span><span>{color.label}</span></figcaption>
    </figure>
  );
}

function ProductCard({ product, saved, onOpen, onSave }: { product: Product; saved: boolean; onOpen: () => void; onSave: () => void }) {
  const color = product.colors[0];
  return (
    <article className="product-card" style={{ '--tint': color.tint } as CSSProperties}>
      <button type="button" className="card-button" onClick={onOpen} aria-haspopup="dialog" aria-label={`Lihat ${product.name}`}>
        <span className="card-art">
          <span className="card-index"><RollingNumber value={Number(product.number)} pad /> /</span>
          <span className="card-object"><ProductArt product={product} color={color} /></span>
        </span>
        <span className="card-info">
          <span className="card-label">{product.category} <span> / </span> <RollingNumber value={product.colors.length} suffix=" warna" /></span>
          <span className="card-name">{product.name}</span>
          <span className="card-price"><RollingNumber value={product.sizes[0].price} currency /><Icon name="diagonal" /></span>
        </span>
      </button>
      <button type="button" className="icon-button card-save" aria-label={`Simpan ${product.name}`} aria-pressed={saved} onClick={onSave}><Icon name="bookmark" /></button>
    </article>
  );
}

function ProductDetail({ product, onAdd, onCart }: { product: Product; onAdd: (color: ColorOption, size: SizeOption) => boolean; onCart: () => void }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const [added, setAdded] = useState(false);
  return (
    <div className="detail-layout">
      <Stage product={product} color={color} size={size} />
      <div className="detail-copy">
        <p className="eyebrow">{product.category} / <RollingNumber value={Number(product.number)} pad /></p>
        <h2 id="detail-title">{product.name}</h2>
        <p className="detail-description">{product.description}</p>
        <fieldset>
          <legend>Warna <span>{color.label}</span></legend>
          <div className="swatches">
            {product.colors.map(option => <label className="swatch" key={option.id}>
              <input type="radio" name="color" checked={option.id === color.id} onChange={() => { setColor(option); setAdded(false); }} />
              <span className="swatch-face" style={{ '--swatch': option.swatch } as CSSProperties}><Icon name="check" /></span>
              <span className="sr-only">{option.label}</span>
            </label>)}
          </div>
        </fieldset>
        <fieldset>
          <legend>Ukuran <span>{size.label}</span></legend>
          <div className="size-options">
            {product.sizes.map(option => <label className="size-option" key={option.id}>
              <input type="radio" name="size" aria-label={`${option.label}, ${option.height} cm`} checked={option.id === size.id} onChange={() => { setSize(option); setAdded(false); }} />
              <span className="size-face"><b><RollingNumber value={option.height} suffix=" cm" /></b><small>{option.label}</small></span>
            </label>)}
          </div>
        </fieldset>
        <div className="detail-purchase">
          <strong className="detail-price"><RollingNumber value={size.price} currency /></strong>
          <button type="button" className="button button-accent" onClick={() => setAdded(onAdd(color, size))}><Icon name={added ? 'check' : 'bag'} /> {added ? 'Ditambahkan' : 'Tambah ke keranjang'}</button>
        </div>
        {added && <button type="button" className="text-button" onClick={onCart}>Lihat keranjang <Icon name="arrow" /></button>}
        <p className="fine-print">{product.material}. Harga dan ukuran untuk demo.</p>
      </div>
    </div>
  );
}

const savedKey = 'paperplay-webshop-saved-v1';
function loadSaved(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(savedKey) ?? '[]');
    return Array.isArray(stored) ? stored.filter(id => products.some(product => product.id === id)) : [];
  } catch {
    return [];
  }
}

function Total({ value }: { value: number }) {
  return <div className="subtotal"><span>Subtotal</span><strong><RollingNumber value={value} currency /></strong></div>;
}

function App() {
  const [category, setCategory] = useState<Category | ''>('');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(loadSaved);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState(loadCart);
  const [announcement, setAnnouncement] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const detailRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const cartRef = useRef<HTMLDialogElement>(null);
  const checkoutRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const catalogRef = useRef<HTMLElement>(null);
  const items = cart.flatMap(line => { const item = resolveLine(line); return item ? [item] : []; });
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.quantity * item.size.price, 0);
  const normalizedQuery = query.trim().toLocaleLowerCase('id-ID');
  const list = products.filter(product => (!category || product.category === category) &&
    (!savedOnly || saved.includes(product.id)) &&
    `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase('id-ID').includes(normalizedQuery));

  useEffect(() => { if (selected && !detailRef.current?.open) detailRef.current?.showModal(); }, [selected]);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* Cart stays usable during this visit. */ } }, [cart]);
  useEffect(() => { try { localStorage.setItem(savedKey, JSON.stringify(saved)); } catch { /* Saved items stay usable during this visit. */ } }, [saved]);

  function changeLine(line: CartLine, delta: number) {
    const key = lineKey(line);
    setCart(previous => {
      const existing = previous.find(item => lineKey(item) === key);
      if (!existing) return delta > 0 ? [...previous, { ...line, quantity: delta }] : previous;
      const next = Math.max(0, Math.min(99, existing.quantity + delta));
      return next === 0 ? previous.filter(item => lineKey(item) !== key) :
        previous.map(item => lineKey(item) === key ? { ...item, quantity: next } : item);
    });
  }

  function openCart() {
    detailRef.current?.close();
    menuRef.current?.close();
    if (!cartRef.current?.open) cartRef.current?.showModal();
  }

  function showSaved() {
    setSavedOnly(current => !current);
    setCategory('');
    setQuery('');
    catalogRef.current?.scrollIntoView();
  }

  return (
    <>
      <a className="skip-link" href="#main">Lewati ke konten</a>
      <header className="site-header">
        <div className="wrap header-inner">
          <div className="header-actions">
            <button type="button" className="icon-button menu-toggle" onClick={() => menuRef.current?.showModal()} aria-label="Buka menu" aria-haspopup="dialog"><Icon name="menu" /></button>
            <button type="button" className="icon-button search-toggle" onClick={() => { catalogRef.current?.scrollIntoView(); searchRef.current?.focus({ preventScroll: true }); }} aria-label="Cari produk"><Icon name="search" /></button>
            <button type="button" className="icon-button saved-toggle" onClick={showSaved} aria-label="Tampilkan produk tersimpan" aria-pressed={savedOnly}><Icon name="wishlist" /></button>
            <button type="button" className="cart-trigger" onClick={openCart} aria-label={`Keranjang, ${quantity} item`} aria-haspopup="dialog">
              <span className="cart-motion" key={quantity} data-filled={quantity > 0}><Icon name="cart" /></span><span className="cart-caption">Keranjang</span><b aria-hidden="true"><RollingNumber value={quantity} /></b>
            </button>
          </div>
          <nav className="desktop-nav" aria-label="Navigasi utama"><a href="#koleksi">Koleksi</a><a href="#cara-kerja">Cara kerja</a></nav>
          <a className="wordmark" href="#main" aria-label="Paperplay, beranda"><span>paperplay<span>.</span></span><PaperMark /></a>
        </div>
      </header>
      <main id="main">
        <section className="wrap hero" aria-labelledby="hero-title">
          <RollWall image={mediaUrl('editorial/rocket-studio.webp')} renderArt={(product, color) => <ProductArt product={product} color={color} />} />
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> EDISI <RollingNumber value={1} pad /> <span className="hero-slash">/</span> MAINAN SUSUN</p>
            <h1 id="hero-title">Objek untuk<br /><em>bermain.</em></h1>
            <p className="hero-description">Roket yang bisa dibongkar, pelangi yang bisa jadi terowongan. Kayu, warna, dan bentuk untuk disusun sesukamu.</p>
            <a className="button button-accent" href="#koleksi">Lihat koleksi <Icon name="diagonal" /></a>
            <div className="hero-metrics"><span><RollingNumber value={products.length} pad /> objek</span><span><RollingNumber value={products[0].colors.length} pad /> warna per objek</span></div>
          </div>
        </section>
        <section className="wrap catalog" id="koleksi" ref={catalogRef} aria-labelledby="catalog-title">
          <div className="section-heading">
            <span className="section-note"><RollingNumber value={list.length} pad /> / <RollingNumber value={products.length} pad /> OBJEK</span>
            <div><p className="eyebrow">PAPERPLAY / KOLEKSI</p><h2 id="catalog-title">{savedOnly ? 'Tersimpan' : 'Rak permainan'}<em>.</em></h2></div>
          </div>
          <div className="catalog-controls">
            <div className="catalog-tools">
              <label className="search-field"><Icon name="search" /><input ref={searchRef} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari objek…" aria-label="Cari mainan" /></label>
              <div className="view-toggle" role="group" aria-label="Tampilan katalog">
                <button type="button" className="icon-button" aria-label="Tampilan grid" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><Icon name="grid" /></button>
                <button type="button" className="icon-button" aria-label="Tampilan daftar" aria-pressed={view === 'list'} onClick={() => setView('list')}><Icon name="list" /></button>
              </div>
            </div>
            <div className="filters" role="group" aria-label="Kategori">{(['', ...categories] as const).map(option => <button type="button" className="chip" key={option} aria-pressed={option === category} onClick={() => setCategory(option)}>{option || 'Semua'}</button>)}</div>
          </div>
          <p className="sr-only" role="status">{list.length} produk</p>
          {list.length ? <div className="product-grid" data-view={view}>{list.map(product =>
            <ProductCard key={product.id} product={product} saved={saved.includes(product.id)} onOpen={() => setSelected(product)} onSave={() => setSaved(current => current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id])} />
          )}</div> :
            <div className="empty"><h3>{savedOnly && !saved.length ? 'Belum ada objek tersimpan.' : 'Belum ada yang cocok.'}</h3><button type="button" className="button button-outline" onClick={() => { setQuery(''); setCategory(''); setSavedOnly(false); searchRef.current?.focus(); }}>Lihat semua objek</button></div>}
        </section>
        <section className="wrap how" id="cara-kerja" aria-labelledby="how-title">
          <div className="how-copy"><PaperMark variant={2} /><p className="eyebrow">PAPERPLAY / CARA KERJA</p><h2 id="how-title">Coba dulu<em>.</em></h2></div>
          <ol>{[
            ['Pilih objek', 'Buka detail dari katalog atau simpan untuk nanti.'],
            ['Coba varian', 'Lihat warna berganti dan objek kembali tegak setelah ukuran berubah.'],
            ['Lihat ringkasan', 'Jumlah dan subtotal ikut berubah saat kamu menyesuaikan keranjang.'],
          ].map(([title, body], index) => <li key={title}><span><RollingNumber value={index + 1} pad /></span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
        </section>
      </main>
      <footer className="site-footer"><div className="wrap footer-inner"><a href="#main">Ke atas ↑</a><p>Toko konsep · Harga dan ukuran contoh</p><a className="wordmark" href="#main"><span>paperplay<span>.</span></span><PaperMark /></a></div></footer>
      <p className="sr-only" role="status">{announcement}</p>

      <dialog ref={menuRef} className="dialog drawer menu-dialog" aria-labelledby="menu-title" onClick={closeBackdrop}>
        <header className="dialog-head"><h2 id="menu-title">Menu</h2><button type="button" className="icon-button" aria-label="Tutup menu" onClick={() => menuRef.current?.close()}><Icon name="close" /></button></header>
        <nav aria-label="Menu ponsel" className="menu-links"><a href="#koleksi" onClick={() => menuRef.current?.close()}>Koleksi <Icon name="arrow" /></a><a href="#cara-kerja" onClick={() => menuRef.current?.close()}>Cara kerja <Icon name="arrow" /></a><button type="button" onClick={openCart}>Keranjang <Icon name="cart" /></button></nav>
      </dialog>
      <dialog ref={detailRef} className="dialog detail-dialog" aria-labelledby="detail-title" onClick={closeBackdrop} onClose={() => setSelected(null)}>
        <button type="button" className="icon-button detail-close" aria-label="Tutup detail produk" onClick={() => detailRef.current?.close()}><Icon name="close" /></button>
        {selected && <ProductDetail key={selected.id} product={selected} onCart={openCart} onAdd={(color, size) => {
          const line = { productId: selected.id, colorId: color.id, sizeId: size.id, quantity: 1 };
          if (cart.some(item => lineKey(item) === lineKey(line) && item.quantity >= 99)) {
            setAnnouncement('Jumlah maksimal varian ini adalah 99.');
            return false;
          }
          changeLine(line, 1);
          setAnnouncement(`${selected.name}, ${color.label}, ${size.height} cm ditambahkan ke keranjang.`);
          return true;
        }} />}
      </dialog>
      <dialog ref={cartRef} className="dialog drawer cart-dialog" aria-labelledby="cart-title" onClick={closeBackdrop}>
        <div className="drawer-shell">
          <header className="dialog-head"><div><p className="eyebrow"><RollingNumber value={quantity} pad /> ITEM</p><h2 id="cart-title">Keranjang</h2></div><button type="button" className="icon-button" aria-label="Tutup keranjang" onClick={() => cartRef.current?.close()}><Icon name="close" /></button></header>
          {items.length ? <>
            <ul className="cart-list">{items.map(item => <li key={item.key}>
              <div className="cart-thumbnail" style={{ '--tint': item.color.tint } as CSSProperties}><ProductArt product={item.product} color={item.color} /></div>
              <div className="cart-line"><strong>{item.product.name}</strong><p>{item.color.label} · <RollingNumber value={item.size.height} suffix=" cm" /></p>
                <div className="stepper"><button type="button" className="icon-button" aria-label={`Kurangi ${item.product.name} ${item.color.label} ${item.size.height} cm`} onClick={() => {
                  if (item.quantity === 1) cartRef.current?.querySelector<HTMLButtonElement>('.dialog-head button')?.focus();
                  changeLine(item, -1);
                }}><Icon name="minus" /></button><span aria-label={`Jumlah ${item.quantity}`}><RollingNumber value={item.quantity} /></span><button type="button" className="icon-button" aria-label={`Tambah ${item.product.name} ${item.color.label} ${item.size.height} cm`} onClick={() => changeLine(item, 1)} disabled={item.quantity >= 99}><Icon name="plus" /></button></div>
              </div>
              <b className="cart-amount"><RollingNumber value={item.size.price * item.quantity} currency /></b>
            </li>)}</ul>
            <div className="drawer-foot"><Total value={subtotal} /><button type="button" className="button button-accent button-wide" onClick={() => { setOrderComplete(false); checkoutRef.current?.showModal(); }}><Icon name="shopify" /> Demo checkout <Icon name="arrow" /></button></div>
          </> : <div className="empty cart-empty"><Icon name="bag" /><h3>Keranjang masih kosong.</h3><a href="#koleksi" className="button button-outline" onClick={() => cartRef.current?.close()}>Kembali ke koleksi</a></div>}
        </div>
      </dialog>
      <dialog ref={checkoutRef} className="dialog checkout-dialog" aria-labelledby="checkout-title" onClick={closeBackdrop}>
        <header className="dialog-head"><div><p className="eyebrow"><span className="status-dot" /> SIMULASI</p><h2 id="checkout-title">Checkout demo</h2></div><button type="button" className="icon-button" aria-label="Tutup checkout" onClick={() => checkoutRef.current?.close()}><Icon name="close" /></button></header>
        <div className="checkout-body">
          {orderComplete ? <div className="empty" role="status"><Icon name="check" /><h3>Simulasi selesai.</h3><p>Tidak ada pembayaran yang diproses.</p><button type="button" className="button button-accent" onClick={() => { checkoutRef.current?.close(); cartRef.current?.close(); }}>Lanjut lihat koleksi</button></div> :
            <><div className="checkout-note"><Icon name="credit" /><p>Ringkasan pesanan contoh. Pembayaran belum aktif.</p></div>
              <ul className="checkout-list">{items.map(item => <li key={item.key}><span><RollingNumber value={item.quantity} /> × {item.product.name}<small>{item.color.label} · <RollingNumber value={item.size.height} suffix=" cm" /></small></span><strong><RollingNumber value={item.quantity * item.size.price} currency /></strong></li>)}</ul>
              <Total value={subtotal} /><button type="button" className="button button-accent button-wide" onClick={() => setOrderComplete(true)}>Selesaikan simulasi <Icon name="arrow" /></button></>}
        </div>
      </dialog>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
