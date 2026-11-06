import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import NumberFlow, { usePrefersReducedMotion } from '@number-flow/react';
import { products, type ColorOption, type Product } from './catalog';
import { Icon } from './icons';

const digitTiming = { duration: 460, easing: 'cubic-bezier(.23, 1, .32, 1)' } as const;
const digitFade = { duration: 230, easing: 'ease-out' } as const;
const integerFormat = { maximumFractionDigits: 0 } as const;
const twoDigitFormat = { ...integerFormat, minimumIntegerDigits: 2 } as const;
const rupiahFormat = { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 } as const;

export function RollingNumber({ value, currency = false, pad = false, fraction = 0, suffix, locale = 'id-ID' }: {
  value: number;
  currency?: boolean;
  pad?: boolean;
  fraction?: number;
  suffix?: string;
  locale?: string;
}) {
  return (
    <NumberFlow
      className="flow-number"
      value={value}
      locales={currency ? "id-ID" : locale}
      format={currency ? rupiahFormat : pad ? twoDigitFormat : fraction ? { minimumFractionDigits: fraction, maximumFractionDigits: fraction } : integerFormat}
      suffix={suffix}
      transformTiming={digitTiming}
      spinTiming={digitTiming}
      opacityTiming={digitFade}
      respectMotionPreference
      isolate
    />
  );
}

const pressed = new WeakMap<Element, Animation>();

export function pressFeedback(event: MouseEvent<HTMLElement>) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !(event.target instanceof Element) ||
    event.target instanceof HTMLInputElement) return;
  const button = event.target.closest('button:not(:disabled), a[href], label[data-press]');
  if (!button || !event.currentTarget.contains(button)) return;
  const cart = button.querySelector('.icon-cart');
  const element = cart ?? button;
  if (typeof element.animate !== 'function') return;
  pressed.get(element)?.cancel();
  const frames = cart ? [
    { transform: 'none' },
    { transform: 'translateX(4px) rotate(-9deg)', offset: .35 },
    { transform: 'translateX(-1px) rotate(4deg)', offset: .69 },
    { transform: 'none' },
  ] : [
    { transform: 'none' },
    { transform: 'scale(.96)', offset: .25 },
    { transform: 'none' },
  ];
  pressed.set(element, element.animate(frames, {
    duration: cart ? 490 : 240, easing: 'cubic-bezier(.2,.7,.3,1)', composite: 'add',
  }));
}

const marks = [
  'M 128 192 C 92.654 192 64 220.654 64 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 256 128 C 256 198.692 198.692 256 128 256 L 128 192 C 163.346 192 192 163.346 192 128 Z M 128 64 C 92.654 64 64 92.654 64 128 L 0 128 C 0 57.308 57.308 0 128 0 Z M 256 0 C 256 70.692 198.692 128 128 128 L 128 64 C 163.346 64 192 35.346 192 0 Z',
  'M 128 128 C 198.692 128 256 185.308 256 256 L 192 256 C 192 220.654 163.346 192 128 192 C 92.654 192 64 220.654 64 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 256 0 C 256 70.692 198.692 128 128 128 C 57.308 128 0 70.692 0 0 L 64 0 C 64 35.346 92.654 64 128 64 C 163.346 64 192 35.346 192 0 Z',
  'M 128 128 C 198.692 128 256 185.308 256 256 L 200 256 C 200 216.235 167.765 184 128 184 C 88.236 184 56 216.235 56 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 256 0 C 256 70.692 198.692 128 128 128 C 57.308 128 0 70.692 0 0 Z',
] as const;

export function PaperMark({ variant = 0 }: { variant?: 0 | 1 | 2 }) {
  return <svg className="paper-mark" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d={marks[variant]} /></svg>;
}

export function useUprightOnChange(value: number) {
  const pivot = useRef<HTMLDivElement>(null);
  const previous = useRef(value);
  const running = useRef<Animation | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const direction = Math.sign(value - previous.current);
    previous.current = value;
    if (reducedMotion) {
      running.current?.cancel();
      return;
    }
    const element = pivot.current;
    if (!element || !direction || typeof element.animate !== 'function') return;

    const start = getComputedStyle(element).transform;
    running.current?.cancel();
    running.current = element.animate([
      { transform: start },
      { transform: `rotate(${direction * 5}deg)`, offset: .27 },
      { transform: `rotate(${direction * -1.3}deg)`, offset: .71 },
      { transform: 'none' },
    ], { duration: 470, easing: 'cubic-bezier(.23, .74, .23, 1)' });
  }, [value, reducedMotion]);

  useEffect(() => () => running.current?.cancel(), []);
  return pivot;
}

const editions = ['Studi bentuk', 'Studi warna', 'Studi susun'];
const rows = [0, 1, 2] as const;
type Tile = { kind: 'photo'; position?: string } |
  { kind: 'object'; product: number; color: number } |
  { kind: 'mark'; tone: string; variant: 0 | 1 | 2; index: number } |
  { kind: 'type'; tone: string; line: string; sub: string };
const tiles: Tile[] = [
  { kind: 'mark', tone: 'olive', variant: 0, index: 1 },
  { kind: 'type', tone: 'ink', line: 'BENTUK', sub: 'PAPERPLAY FIELD NOTES' },
  { kind: 'photo' },
  { kind: 'mark', tone: 'paper', variant: 1, index: 2 },
  { kind: 'object', product: 0, color: 2 },
  { kind: 'type', tone: 'paper', line: 'Susun.', sub: 'RUANG UNTUK BERMAIN' },
  { kind: 'object', product: 1, color: 0 },
  { kind: 'mark', tone: 'olive', variant: 2, index: 3 },
  { kind: 'object', product: 0, color: 1 },
  { kind: 'photo', position: '40% 72%' },
  { kind: 'object', product: 3, color: 0 },
  { kind: 'mark', tone: 'paper', variant: 0, index: 4 },
  { kind: 'type', tone: 'olive', line: 'KAYU', sub: 'WARNA · SKALA · BENTUK' },
  { kind: 'object', product: 2, color: 0 },
  { kind: 'mark', tone: 'ink', variant: 1, index: 5 },
];

function RollTile({ tile, image, renderArt }: {
  tile: Tile;
  image: string;
  renderArt: (product: Product, color: ColorOption) => ReactNode;
}) {
  if (tile.kind === 'photo') {
    return <div className="roll-tile roll-photo"><img src={image} width="1200" height="800" alt="" loading="lazy" decoding="async" style={{ objectPosition: tile.position }} /></div>;
  }
  if (tile.kind === 'object') {
    const product = products[tile.product];
    const color = product.colors[tile.color];
    return <div className="roll-tile roll-object" style={{ '--tile-tint': color.tint } as CSSProperties}><div>{renderArt(product, color)}</div><span>{color.label}</span></div>;
  }
  if (tile.kind === 'mark') {
    return <div className={`roll-tile roll-mark tone-${tile.tone}`}><PaperMark variant={tile.variant} /><span><RollingNumber value={tile.index} pad /></span></div>;
  }
  return <div className={`roll-tile roll-type tone-${tile.tone}`}><b>{tile.line}</b><span>{tile.sub}</span></div>;
}

export function RollWall({ image, renderArt, locale = 'id' }: { image: string; locale?: 'id' | 'en'; renderArt: (product: Product, color: ColorOption) => ReactNode }) {
  const [view, setView] = useState({ index: 0, revision: 0, direction: 1 });
  const english = locale === 'en';
  const caption = (english ? ['Shape study', 'Color study', 'Stack study'] : editions)[view.index];
  const track = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  function move(delta: number) {
    setView(previous => ({
      index: (previous.index + delta + editions.length) % editions.length,
      revision: previous.revision + 1,
      direction: delta || 1,
    }));
  }

  useLayoutEffect(() => {
    if (reducedMotion) {
      animations.current.forEach(animation => animation.cancel());
      return;
    }
    const elements = Array.from(track.current?.children ?? []);
    const prior = animations.current;
    animations.current = elements.flatMap((row, index) => {
      if (typeof row.animate !== 'function') return [];
      const offset = view.direction * (index % 2 ? -1 : 1);
      const rolling = prior[index]?.playState === 'running';
      const start = rolling ? getComputedStyle(row).transform : `translate3d(${offset * 11}%, ${(1 - index) * -12}%, 0) rotateX(${offset * 36}deg) rotateZ(${offset * 3}deg) scaleY(.83)`;
      prior[index]?.cancel();
      return [row.animate([
        { transform: start },
        { transform: `translate3d(${offset * -2.4}%, ${(1 - index) * 3}%, 0) rotateX(${offset * -6}deg) rotateZ(${offset * -.8}deg)`, offset: .68 },
        { transform: 'none' },
      ], { duration: 850, delay: index * 49, easing: 'cubic-bezier(.18, .66, .27, 1)', fill: 'backwards' })];
    });
  }, [view, reducedMotion]);

  useEffect(() => () => animations.current.forEach(animation => animation.cancel()), []);

  return (
    <section className="roll-wall" aria-label={english ? "Paperplay gallery" : "Galeri Paperplay"}>
      <div className="roll-header"><span><i /> STUDIO / PAPERPLAY</span><span>{english ? "SHAPE ARCHIVE" : "ARSIP BENTUK"}</span></div>
      <div className="roll-window" aria-hidden="true">
        <div className="roll-track" ref={track}>
          {rows.map(row => <div className="roll-row" key={row}>
            {Array.from({ length: 5 }, (_, column) => {
              const position = row * 5 + column;
              const index = (position + view.index * 4) % tiles.length;
              return <RollTile tile={tiles[index]} image={image} renderArt={renderArt} key={column} />;
            })}
          </div>)}
        </div>
      </div>
      <div className="roll-footer">
        <div className="roll-caption">
          <span className="roll-count"><RollingNumber value={view.index + 1} pad /> <span>/</span> <RollingNumber value={editions.length} pad /></span>
          <output>{caption}</output>
        </div>
        <div className="roll-buttons">
          <button type="button" className="icon-button roll-arrow prev" aria-label={english ? "Previous gallery" : "Galeri sebelumnya"} onClick={() => move(-1)}><Icon name="arrow" /></button>
          <button type="button" className="icon-button roll-replay" aria-label={english ? "Replay roll" : "Ulangi roll"} onClick={() => move(0)}><Icon name="replay" /></button>
          <button type="button" className="icon-button roll-arrow" aria-label={english ? "Next gallery" : "Galeri berikutnya"} onClick={() => move(1)}><Icon name="arrow" /></button>
        </div>
      </div>
    </section>
  );
}
