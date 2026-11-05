import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { categories, money, products, type Category, type ColorOption, type Product, type SizeOption } from './catalog';
import './styles.css';

type IconName = 'arrow' | 'bag' | 'search' | 'menu' | 'close' | 'plus' | 'minus' | 'check' | 'spark' | 'shopify';
type CartLine = { productId: string; colorId: string; sizeId: string; quantity: number };
type CartItem = CartLine & { key: string; product: Product; color: ColorOption; size: SizeOption };
const iconPaths: Record<IconName, string> = {
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  bag: 'M5 8h14l1 13H4L5 8Zm4 0V6a3 3 0 1 1 6 0v2',
  search: 'M16.5 10.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-1.7 4.3L20 20',
  menu: 'M4 8h16M4 16h16',
  close: 'm6 6 12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'm5 12 4 4 10-10',
  spark: 'M12 2v20M2 12h20M5 5l14 14M19 5 5 19',
  shopify: 'M5 8h14l1 13H4L5 8Zm4 0V6a3 3 0 1 1 6 0v2m-1 4c-3-2-5 1-2 2s2 4-2 3',
};

function Icon({ name }: { name: IconName }) {
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={iconPaths[name]} /></svg>;
}

function mediaUrl(path: string) {
  return path.startsWith('data:') ? path : import.meta.env.BASE_URL + path;
}

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

function Stage({ product, color, size, hero = false }: { product: Product; color: ColorOption; size?: SizeOption; hero?: boolean }) {
  const maximum = Math.max(...product.sizes.map(option => option.height));
  const style = { '--tint': color.tint, '--scale': size ? size.height / maximum : 1 } as CSSProperties;
  return (
    <figure className={`stage ${hero ? 'stage-hero' : ''}`} style={style}>
      <div className="stage-inner" role="img" aria-label={`${product.name}, ${color.label}${size ? `, contoh tinggi ${size.height} cm` : ''}`}>
        <div className="stage-ring ring-a" /><div className="stage-ring ring-b" />
        <span className="stage-index">OBJEK / {product.number}</span>
        <span className="stage-spark"><Icon name="spark" /></span>
        <div className="stage-shadow" />
        <div className="stage-scale">
          {product.colors.map(option => <div className="stage-layer" key={option.id} data-active={option.id === color.id}>
            <ProductArt product={product} color={option} />
          </div>)}
        </div>
        {size && <span className="height-pill" key={size.id}>{size.height} <small>cm</small></span>}
        {hero && <span className="stage-tag"><span /> ROKET SUSUN</span>}
      </div>
      {!hero && <figcaption><span>VISUAL KONSEP</span><span>{color.label} · {size?.height} cm</span></figcaption>}
    </figure>
  );
}

function ProductCard({ product, onOpen, order }: { product: Product; onOpen: () => void; order: number }) {
  const color = product.colors[0];
  return (
    <article className="product-card" style={{ '--tint': color.tint, '--order': order } as CSSProperties}>
      <button className="card-button" onClick={onOpen} aria-haspopup="dialog" aria-label={`Lihat ${product.name}`}>
        <div className="card-art">
          <span className="card-index">{product.number} /</span>
          <span className="card-arrow"><Icon name="arrow" /></span>
          <div className="card-object"><ProductArt product={product} color={color} /></div>
        </div>
        <div className="card-info">
          <p className="eyebrow">{product.category}</p>
          <h3>{product.name}</h3>
          <div className="card-meta"><span className="card-swatches" aria-label={`${product.colors.length} pilihan warna`}>{product.colors.map(option => <i key={option.id} style={{ background: option.swatch }} />)}</span><span>Mulai {money.format(product.sizes[0].price)}</span></div>
        </div>
      </button>
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
        <p className="eyebrow">{product.category} / {product.number}</p>
        <h2 id="detail-title">{product.name}<em>.</em></h2>
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
              <input type="radio" name="size" checked={option.id === size.id} onChange={() => { setSize(option); setAdded(false); }} />
              <span className="size-face"><b>{option.height} cm</b><small>{option.label}</small></span>
            </label>)}
          </div>
        </fieldset>
        <div className="detail-purchase">
          <strong>{money.format(size.price)}</strong>
          <button className="button button-dark" onClick={() => setAdded(onAdd(color, size))}><Icon name={added ? 'check' : 'bag'} /> {added ? 'Ditambahkan' : 'Tambah ke keranjang'}</button>
        </div>
        {added && <button className="text-button" onClick={onCart}>Lihat keranjang <Icon name="arrow" /></button>}
        <p className="fine-print">{product.material}. Harga dan ukuran untuk demo.</p>
      </div>
    </div>
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

function App() {
  const [category, setCategory] = useState<Category | ''>('');
  const [query, setQuery] = useState('');
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
  const list = products.filter(product => (!category || product.category === category) &&
    `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID')));

  useEffect(() => { if (selected && !detailRef.current?.open) detailRef.current?.showModal(); }, [selected]);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* Cart remains usable during this visit. */ } }, [cart]);

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
    cartRef.current?.showModal();
  }

  return (
    <>
      <a className="skip-link" href="#main">Lewati ke konten</a>
      <div className="top-note"><Icon name="spark" /> Toko konsep untuk tangan kecil dan ide besar</div>
      <header className="site-header">
        <div className="wrap header-inner">
          <div className="header-actions">
            <button className="icon-button menu-toggle" onClick={() => menuRef.current?.showModal()} aria-label="Buka menu" aria-haspopup="dialog"><Icon name="menu" /></button>
            <button className="icon-button search-toggle" onClick={() => { catalogRef.current?.scrollIntoView(); searchRef.current?.focus({ preventScroll: true }); }} aria-label="Cari produk"><Icon name="search" /></button>
            <button className="cart-trigger" onClick={openCart} aria-label={`Keranjang, ${quantity} item`} aria-haspopup="dialog"><Icon name="bag" /><span>Keranjang</span><b>{quantity}</b></button>
          </div>
          <nav className="desktop-nav" aria-label="Navigasi utama"><a href="#koleksi">Koleksi</a><a href="#cara-kerja">Cara kerja</a></nav>
          <a className="wordmark" href="#main" aria-label="Paperplay, beranda"><span className="brand-mark"><Icon name="spark" /></span>paperplay<span>.</span></a>
        </div>
      </header>
      <main id="main">
        <section className="wrap hero" aria-labelledby="hero-title">
          <div className="hero-art"><Stage product={products[0]} color={products[0].colors[0]} hero /></div>
          <div className="hero-copy">
            <p className="eyebrow"><span className="dot" /> KOLEKSI 01 / RUANG MAIN</p>
            <h1 id="hero-title">Main kecil.<br /><em>Imajinasi luas.</em></h1>
            <p className="hero-description">Roket, pelangi, dan balok yang bisa jadi apa saja. Pilih bentuknya, coba warnanya, temukan cara mainmu.</p>
            <a className="button button-dark" href="#koleksi">Jelajahi koleksi <Icon name="arrow" /></a>
            <span className="hero-foot">EMPAT MODEL KONSEP <span>•</span> WARNA BISA DICOBA</span>
          </div>
        </section>
        <section className="wrap catalog" id="koleksi" ref={catalogRef} aria-labelledby="catalog-title">
          <div className="section-heading"><p className="section-note">Benda kecil yang bisa memulai cerita besar.</p><div><p className="eyebrow">01 / PILIH &amp; MAIN</p><h2 id="catalog-title">Rak permainan<em>.</em></h2></div></div>
          <div className="catalog-controls">
            <label className="search-field"><Icon name="search" /><input ref={searchRef} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari mainan…" aria-label="Cari mainan" /></label>
            <div className="filters" role="group" aria-label="Kategori">{(['', ...categories] as const).map(option => <button className="chip" key={option} aria-pressed={option === category} onClick={() => setCategory(option)}>{option || 'Semua'}</button>)}</div>
          </div>
          <p className="results" role="status">{list.length} produk</p>
          {list.length ? <div className="product-grid" key={category}>{list.map((product, index) => <ProductCard key={product.id} product={product} order={index} onOpen={() => setSelected(product)} />)}</div> :
            <div className="empty"><h3>Belum ada yang cocok.</h3><p>Coba kata lain atau lihat semua kategori.</p><button className="button button-dark" onClick={() => { setQuery(''); setCategory(''); searchRef.current?.focus(); }}>Lihat semua produk</button></div>}
        </section>
        <section className="wrap how" id="cara-kerja" aria-labelledby="how-title">
          <div><p className="eyebrow">02 / COBA SENDIRI</p><h2 id="how-title">Dari pilih<br />sampai main<em>.</em></h2></div>
          <ol><li><span>01</span><div><h3>Pilih bentuk.</h3><p>Cari mainan dari rak atau buka kategori yang kamu suka.</p></div></li><li><span>02</span><div><h3>Coba varian.</h3><p>Bandingkan warna dan lihat perubahan tinggi dalam satu pratinjau.</p></div></li><li><span>03</span><div><h3>Lihat pesanan.</h3><p>Tambah ke keranjang dan cek ringkasan di checkout demo.</p></div></li></ol>
        </section>
      </main>
      <footer className="site-footer"><div className="wrap footer-inner"><a href="#main">Kembali ke atas ↑</a><p>Prototipe toko · Harga dan ukuran contoh</p><a className="wordmark" href="#main">paperplay<span>.</span></a></div></footer>
      <p className="sr-only" role="status">{announcement}</p>

      <dialog ref={menuRef} className="dialog drawer menu-dialog" aria-labelledby="menu-title" onClick={closeBackdrop}>
        <header className="dialog-head"><h2 id="menu-title">Menu<em>.</em></h2><button className="icon-button" aria-label="Tutup menu" onClick={() => menuRef.current?.close()}><Icon name="close" /></button></header>
        <nav aria-label="Menu ponsel" className="menu-links"><a href="#koleksi" onClick={() => menuRef.current?.close()}>Koleksi <Icon name="arrow" /></a><a href="#cara-kerja" onClick={() => menuRef.current?.close()}>Cara kerja <Icon name="arrow" /></a><button onClick={openCart}>Keranjang <Icon name="bag" /></button></nav>
      </dialog>
      <dialog ref={detailRef} className="dialog detail-dialog" aria-labelledby="detail-title" onClick={closeBackdrop} onClose={() => setSelected(null)}>
        <button className="icon-button detail-close" aria-label="Tutup detail produk" onClick={() => detailRef.current?.close()}><Icon name="close" /></button>
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
        <header className="dialog-head"><div><p className="eyebrow">{quantity} ITEM</p><h2 id="cart-title">Keranjang<em>.</em></h2></div><button className="icon-button" aria-label="Tutup keranjang" onClick={() => cartRef.current?.close()}><Icon name="close" /></button></header>
        {items.length ? <>
          <ul className="cart-list">{items.map(item => <li key={item.key}>
            <div className="cart-thumbnail" style={{ '--tint': item.color.tint } as CSSProperties}><ProductArt product={item.product} color={item.color} /></div>
            <div><strong>{item.product.name}</strong><p>{item.color.label} · {item.size.height} cm</p><div className="stepper"><button className="icon-button" aria-label={`Kurangi ${item.product.name} ${item.color.label} ${item.size.height} cm`} onClick={() => {
              if (item.quantity === 1) cartRef.current?.querySelector<HTMLButtonElement>('.dialog-head button')?.focus();
              changeLine(item, -1);
            }}><Icon name="minus" /></button><span aria-label="Jumlah">{item.quantity}</span><button className="icon-button" aria-label={`Tambah ${item.product.name} ${item.color.label} ${item.size.height} cm`} onClick={() => changeLine(item, 1)} disabled={item.quantity >= 99}><Icon name="plus" /></button></div></div>
            <b>{money.format(item.size.price * item.quantity)}</b>
          </li>)}</ul>
          <div className="drawer-foot"><div className="subtotal"><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><button className="button button-shop" onClick={() => { setOrderComplete(false); checkoutRef.current?.showModal(); }}><Icon name="shopify" /> Demo checkout <Icon name="arrow" /></button></div>
        </> : <div className="empty cart-empty"><Icon name="bag" /><h3>Keranjang masih kosong.</h3><p>Pilih mainan dan varian dari rak.</p><a href="#koleksi" className="button button-dark" onClick={() => cartRef.current?.close()}>Kembali ke koleksi</a></div>}
      </dialog>
      <dialog ref={checkoutRef} className="dialog checkout-dialog" aria-labelledby="checkout-title" onClick={closeBackdrop}>
        <header className="dialog-head"><div><p className="eyebrow">SIMULASI</p><h2 id="checkout-title">Checkout demo<em>.</em></h2></div><button className="icon-button" aria-label="Tutup checkout" onClick={() => checkoutRef.current?.close()}><Icon name="close" /></button></header>
        <div className="checkout-body">
          {orderComplete ? <div className="empty" role="status"><Icon name="check" /><h3>Simulasi selesai.</h3><p>Tidak ada pembayaran yang diproses.</p><button className="button button-dark" onClick={() => { checkoutRef.current?.close(); cartRef.current?.close(); }}>Lanjut lihat koleksi</button></div> :
            <><p className="fine-print">Periksa ringkasan pesanan contoh. Pembayaran belum aktif.</p><ul className="checkout-list">{items.map(item => <li key={item.key}><span>{item.quantity} × {item.product.name}<small>{item.color.label} · {item.size.height} cm</small></span><strong>{money.format(item.quantity * item.size.price)}</strong></li>)}</ul><div className="subtotal"><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><button className="button button-shop" onClick={() => setOrderComplete(true)}><Icon name="shopify" /> Selesaikan simulasi <Icon name="arrow" /></button></>}
        </div>
      </dialog>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
