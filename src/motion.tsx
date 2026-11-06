import { useEffect, useLayoutEffect, useRef, type MouseEvent } from 'react';
import NumberFlow, { usePrefersReducedMotion } from '@number-flow/react';

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
