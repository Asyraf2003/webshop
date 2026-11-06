import { useId, type CSSProperties } from 'react';
import { type ColorOption, type Product, type SizeOption } from './catalog';
import { mediaUrl } from './icons';
import { colorName, type Locale } from './locale';
import { useUprightOnChange } from './motion';

export function ProductArt({ product, color }: { product: Product; color: ColorOption }) {
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

export function ProductStage({ product, color, size, detail, locale }: {
  product: Product; color: ColorOption; size: SizeOption; detail: boolean; locale: Locale;
}) {
  const largest = Math.max(...product.sizes.map(option => option.height));
  const pivot = useUprightOnChange(size.height);
  const style = { '--tint': color.tint, '--scale': .36 + .64 * size.height / largest } as CSSProperties;
  return (
    <figure className="stage" style={style} data-detail={detail}>
      <div className="stage-inner" role="img" aria-label={`${product.name}, ${colorName(color, locale)}, ${size.height} cm`}>
        <div className="stage-shadow" />
        <div className="stage-pivot" ref={pivot}>
          <div className="stage-scale">
            {product.colors.map(option => <div className="stage-layer" key={option.id} data-active={option.id === color.id}>
              <ProductArt product={product} color={option} />
            </div>)}
          </div>
        </div>
      </div>
    </figure>
  );
}
