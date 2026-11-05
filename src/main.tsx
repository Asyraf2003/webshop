import { useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { stackingRocket, type ColorOption, type Product, type SizeOption } from './catalog';
import './styles.css';

type PreviewProps = {
  product: Product;
  color: ColorOption;
  size: SizeOption;
};

function ProductPreview({ product, color, size }: PreviewProps) {
  const floor = .91;
  const maximumHeight = Math.max(...product.sizes.map(option => option.height));
  const stageStyle = {
    '--stage-tint': color.background,
    '--product-scale': size.height / maximumHeight,
    '--image-floor': `${floor * 100}%`,
  } as CSSProperties;

  return (
    <figure className="product-preview" style={stageStyle}>
      <div className="preview-stage">
        <p className="stage-index">OBJEK / {product.number}</p>
        <span className="stage-mark" aria-hidden="true">✳</span>
        <div className="product-shadow" aria-hidden="true" />
        <div className="image-scale">
          {product.colors.map((option, index) => {
            // Keep the visible object on the same floor even if the cutouts have different padding.
            const [top, bottom] = option.framing;
            const fit = .83 / (bottom - top);
            return (
              <img
                key={option.id}
                className="product-image"
                src={import.meta.env.BASE_URL + option.image}
                width="768"
                height="768"
                alt={option.id === color.id ? `${product.name} warna ${option.label}` : ''}
                aria-hidden={option.id !== color.id}
                data-visible={option.id === color.id}
                fetchPriority={index === 0 ? 'high' : 'low'}
                decoding="async"
                style={{ top: `${(floor - bottom * fit) * 100}%`, height: `${fit * 100}%` }}
              />
            );
          })}
        </div>
        <div className="height-guide" aria-hidden="true">
          <span className="height-ticks" />
          <span className="height-value" key={size.id}>{size.height} <small>cm</small></span>
        </div>
      </div>
      <figcaption>
        <span><span className="caption-dot" /> VISUAL KONSEP</span>
        <span>{color.label} · {size.height} cm</span>
      </figcaption>
    </figure>
  );
}

function ProductDetail({ product }: { product: Product }) {
  const [color, setColor] = useState<ColorOption>(product.colors[0]);
  const [size, setSize] = useState<SizeOption>(product.sizes[1] ?? product.sizes[0]);

  return (
    <section className="product-layout" aria-labelledby="product-title">
      <div className="product-intro">
        <p className="eyebrow"><span className="caption-dot" /> {product.category.toUpperCase()}</p>
        <h1 id="product-title">{product.name}<span>.</span></h1>
        <p className="description">{product.description}</p>
      </div>
      <ProductPreview product={product} color={color} size={size} />
      <div className="variant-panel">
        <fieldset className="variant-group">
          <legend><span>01</span> Warna <strong>{color.label}</strong></legend>
          <div className="swatches">
            {product.colors.map(option => (
              <label className="swatch" key={option.id}>
                <input type="radio" name="color" value={option.id} checked={color.id === option.id} onChange={() => setColor(option)} />
                <span className="swatch-face" style={{ '--swatch': option.swatch } as CSSProperties} aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-8" /></svg>
                </span>
                <span className="sr-only">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="variant-group">
          <legend><span>02</span> Ukuran <strong>{size.label}</strong></legend>
          <div className="sizes">
            {product.sizes.map(option => (
              <label className="size-option" key={option.id}>
                <input type="radio" name="size" value={option.id} checked={size.id === option.id} onChange={() => setSize(option)} />
                <span className="size-face"><b>{option.height} cm</b><small>{option.label}</small></span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="preview-note">Tinggi dan visual di sini masih contoh untuk menguji pilihan varian.</p>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <span className="wordmark"><span className="brand-mark" aria-hidden="true">✳</span>paperplay<span className="brand-period">.</span></span>
          <span className="header-label">STUDIO VARIAN <span>01</span></span>
        </div>
      </header>
      <main className="container">
        <ProductDetail product={stackingRocket} />
      </main>
      <footer className="container footer"><span>PAPERPLAY STUDIO</span><span>Koleksi konsep · 01</span></footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
