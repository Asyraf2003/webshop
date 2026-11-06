import { useLayoutEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@number-flow/react';
import { gsap } from 'gsap';
import type { Product, SizeOption } from './catalog';
import { Icon } from './icons';
import type { Copy, Locale } from './locale';
import { RollingNumber } from './motion';
import { priceFor } from './shop';

export type Point = { x: number; y: number };
export function centerOf(element: Element): Point {
  const box = element.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

export function Price({ product, size, copy, mode }: { product: Product; size: SizeOption; copy: Copy; mode: 'card' | 'hero' | 'detail' }) {
  const price = priceFor(product, size);
  return (
    <div className="price-block" data-promoted={price.discount > 0} data-mode={mode}>
      {price.discount > 0 && <del className="price-before"><RollingNumber value={price.original} currency /></del>}
      <div className="price-main">
        <strong className="price-now"><RollingNumber value={price.price} currency /></strong>
        {price.discount > 0 && (mode === 'detail' ? (
          <span className="discount">−<RollingNumber value={price.discount} suffix="%" /></span>
        ) : (
          <span className="voucher-mark" role="img" aria-label={price.vouchers + ' ' + copy.voucher} title={price.vouchers + ' ' + copy.voucher}>
            <Icon name="ticket" /><span aria-hidden="true"><RollingNumber value={price.vouchers} /></span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Rating({ product, copy, locale, detailed = false }: { product: Product; copy: Copy; locale: Locale; detailed?: boolean }) {
  const numeralLocale = locale === 'en' ? 'en-US' : 'id-ID';
  const ratingLabel = new Intl.NumberFormat(numeralLocale, { minimumFractionDigits: 1 }).format(product.rating.score) + ' ' + copy.starsOf;
  return (
    <div className="rating-line" data-detailed={detailed}>
      <span className="rating-score" role="img" aria-label={ratingLabel}>
        <span aria-hidden="true"><RollingNumber value={product.rating.score} fraction={1} locale={numeralLocale} /></span>
        <span className="rating-stars" aria-hidden="true">
          {Array.from({ length: detailed ? 5 : 1 }, (_, index) => <Icon name="star" key={index} />)}
        </span>
      </span>
      {detailed && <span className="rating-reviews"><RollingNumber value={product.rating.reviews} locale={numeralLocale} /> {copy.reviews}</span>}
      <span><RollingNumber value={product.sold} locale={numeralLocale} /> {copy.sold}</span>
    </div>
  );
}

export function Stepper({ value, min = 1, max, label, copy, onChange }: {
  value: number; min?: number; max: number; label: string; copy: Copy; onChange: (delta: number) => void;
}) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="plain-icon" aria-label={copy.decrease + ' ' + label} disabled={value <= min} onClick={() => onChange(-1)}><Icon name="minus" /></button>
      <span className="stepper-value"><RollingNumber value={value} /></span>
      <button type="button" className="plain-icon" aria-label={copy.increase + ' ' + label} disabled={value >= max} onClick={() => onChange(1)}><Icon name="plus" /></button>
    </div>
  );
}

export function Subtotal({ value, copy }: { value: number; copy: Copy }) {
  return <div className="subtotal"><span>{copy.subtotal}</span><strong><RollingNumber value={value} currency /></strong></div>;
}

type SurfaceKind = 'menu' | 'cart' | 'detail' | 'checkout';

export function Surface({ open, kind, titleId, origin, onClose, children }: {
  open: boolean; kind: SurfaceKind; titleId: string; origin?: Point; onClose: () => void; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    if (reducedMotion) return;

    const motion = gsap.context(() => {
      if (kind === 'menu') {
        gsap.timeline()
          .fromTo(dialog, { clipPath: 'inset(0% 0% 100% 0%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', duration: .57, ease: 'power4.inOut', clearProps: 'clipPath',
          })
          .from('.menu-label', { yPercent: 104, duration: .55, stagger: .074, ease: 'power4.out', clearProps: 'transform' }, .22);
      } else if (kind === 'cart' && matchMedia('(min-width: 741px)').matches) {
        const bounds = dialog.getBoundingClientRect();
        const x = Math.min(98, Math.max(2, ((origin?.x ?? bounds.right - 24) - bounds.left) / bounds.width * 100));
        const edge = Math.min(100, x + 3);
        gsap.timeline()
          .fromTo(dialog, { clipPath: 'polygon(' + x + '% 0%, ' + edge + '% 0%, ' + edge + '% 8%, ' + (x - 2) + '% 2%)' }, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: .6, ease: 'power3.inOut', clearProps: 'clipPath',
          }, .055)
          .from('.cart-body', { y: -12, opacity: .15, duration: .45, ease: 'power3.out', clearProps: 'transform,opacity' }, .23);
      } else {
        const distance = kind === 'cart' ? Math.min(230, dialog.clientHeight * .6) : 15;
        gsap.from(dialog, { y: distance, duration: kind === 'cart' ? .56 : .38, ease: 'power4.out', clearProps: 'transform' });
      }
    }, dialog);

    return () => motion.revert();
  }, [open, kind, origin, reducedMotion]);

  function backdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
  }

  return (
    <dialog ref={ref} className={'surface surface-' + kind} aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }} onClick={backdrop}>
      {children}
    </dialog>
  );
}

export function CloseButton({ label, onClose }: { label: string; onClose: () => void }) {
  return <button type="button" className="plain-icon surface-close" aria-label={label} onClick={onClose}><Icon name="close" /></button>;
}
