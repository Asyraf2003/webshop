import { useId, type CSSProperties } from 'react';
import type { ExtraToyArt } from './extra-catalog';
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
      <ToySilhouette kind={product.art} color={color} varnish={varnish} />
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

type Paint = 'body' | 'light' | 'edge' | 'wood' | 'cream';
type Shape = readonly [path: string, paint: Paint];

const silhouettes: Record<ExtraToyArt, readonly Shape[]> = {
  train: [
    ['M38 143h161v24H38z', 'wood'], ['M48 136v-38h57v38Zm61 0V78h52v58Z', 'body'],
    ['M110 77h55v12h-55zM60 92V66h22v26z', 'edge'], ['M124 98h23v25h-23z', 'cream'],
    ['M72 174a15 15 0 1 0 0 .1Zm55 0a15 15 0 1 0 0 .1Zm51 0a15 15 0 1 0 0 .1Z', 'edge'],
    ['M167 141h19l19 16h-38z', 'light'],
  ],
  car: [
    ['M35 145q5-18 29-24l24-34h69l27 36 21 10v29H35z', 'body'],
    ['m81 120 19-22h49l18 22Z', 'cream'], ['M121 96h6v26h-6z', 'edge'],
    ['M87 163a18 18 0 1 0 0 .1Zm102 0a18 18 0 1 0 0 .1Z', 'edge'],
    ['M79 164a9 9 0 1 0 0 .1Zm102 0a9 9 0 1 0 0 .1Z', 'wood'],
  ],
  boat: [
    ['M36 155h170l-30 34H66Z', 'body'], ['M117 47h8v107h-8z', 'edge'],
    ['M111 59v83H57Z', 'light'], ['M131 71v71h53Z', 'cream'], ['M58 165h126v5H58z', 'wood'],
  ],
  plane: [
    ['M28 146q0-19 21-21l45-4 30-61h18l-9 60 50 2 12-19h13l-4 33q-2 19-30 19H43q-15 0-15-9Z', 'body'],
    ['M73 125q11-16 28-16h19l-8 16Z', 'cream'], ['m107 145 42 25h-18l-46-25Z', 'light'],
    ['M61 155h11v17H61zM169 155h9v17h-9z', 'edge'],
  ],
  tower: [
    ['M58 175q0-10 13-10h97q13 0 13 10v14H58z', 'wood'],
    ['M70 143h100v22H70z', 'edge'], ['M79 116h82v26H79z', 'body'],
    ['M91 89h58v27H91z', 'light'], ['m99 89 21-46 21 46Z', 'body'],
  ],
  puzzle: [
    ['M48 71h144q10 0 10 10v88q0 10-10 10H48q-10 0-10-10V81q0-10 10-10Z', 'wood'],
    ['M89 124a18 18 0 1 0 0 .1Z', 'body'], ['M103 103h36v42h-36Z', 'edge'],
    ['m169 101 21 44h-42Z', 'light'], ['M52 162h135v3H52z', 'cream'],
  ],
  music: [
    ['m53 103 124-29 12 77-124 30Z', 'wood'],
    ['m61 98 17-4 14 70-17 4Z', 'edge'], ['m83 93 17-4 13 67-17 4Z', 'body'],
    ['m105 88 17-4 11 61-17 4Z', 'light'], ['m127 83 17-4 10 55-17 4Z', 'body'],
    ['m149 78 17-4 9 49-17 4Z', 'edge'], ['M41 177l91-112 6 5-91 112Z', 'cream'],
  ],
  rabbit: [
    ['M85 83q-13-49 2-52 18-3 23 44Zm40-8q2-47 19-45 14 2 5 50Z', 'light'],
    ['M82 95q0-24 38-24 34 0 38 24 6 20-10 36 24 14 24 37 0 20-52 20-53 0-53-21 0-23 23-37-16-13-8-35Z', 'body'],
    ['M143 158a22 18 0 1 0 0 .1Z', 'cream'],
    ['M106 103a4 4 0 1 0 0 .1Zm36 0a4 4 0 1 0 0 .1Z', 'edge'],
  ],
  top: [
    ['M114 51h12v43h-12Z', 'edge'], ['M60 122q0-31 60-31 60 0 60 31-10 31-60 61-50-30-60-61Z', 'body'],
    ['M65 134q56 22 110 0l-9 15q-45 19-92 0Z', 'light'], ['m114 180 6 11 6-11Z', 'edge'],
  ],
  blocks: [
    ['M41 144h50v37H41z', 'edge'], ['M92 114h53v67H92z', 'body'], ['M146 137h53v44h-53z', 'light'],
    ['m91 114 28-41 27 41Z', 'light'], ['m145 137 27-36 28 36Z', 'body'],
    ['M109 141h17v40h-17zM159 150h16v14h-16z', 'cream'],
  ],
  duck: [
    ['M49 147q0-25 36-25 7-4 11-22 4-23 31-23 26 0 31 23l32 6-18 16-18-4q-5 15 14 23 20 12 20 24 0 20-67 20-72 0-72-38Z', 'body'],
    ['m158 102 33 4-17 17-20-5Z', 'wood'], ['M133 100a4 4 0 1 0 0 .1Z', 'edge'],
    ['M80 153q28-23 56 0-8 18-30 18-17 0-26-18Z', 'light'],
  ],
  robot: [
    ['M76 68h87v56H76Z', 'body'], ['M88 129h64v50H88Z', 'edge'],
    ['M64 134h18v35H64zM158 134h18v35h-18zM91 178h23v12H91zM127 178h23v12h-23z', 'wood'],
    ['M95 86h16v16H95zM127 86h16v16h-16zM108 145h24v13h-24z', 'cream'],
    ['M116 53h8v16h-8zM111 48h18v9h-18Z', 'light'],
  ],
};

function ToySilhouette({ kind, color, varnish }: { kind: string; color: ColorOption; varnish: string }) {
  const shapes = silhouettes[kind as ExtraToyArt];
  if (!shapes) return null;
  const fills: Record<Paint, string> = {
    body: varnish, light: color.light, edge: color.dark, wood: '#d0a273', cream: '#f4e4c5',
  };
  return (
    <>
      <ellipse cx="121" cy="190" rx="85" ry="10" fill="#414235" opacity=".13" />
      {shapes.map(([path, paint], index) => <path d={path} fill={fills[paint]} key={index} />)}
    </>
  );
}
