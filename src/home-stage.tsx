import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@number-flow/react';
import { gsap } from 'gsap';
import { products } from './catalog';
import { Price, ProductLink, type OpenProduct } from './commerce-ui';
import { Icon } from './icons';
import type { Copy } from './locale';
import { RollingNumber } from './motion';
import { ProductArt } from './product-art';

export function PageBackdrop() {
  return (
    <div className="page-backdrop" aria-hidden="true">
      <svg className="paper-orbits" viewBox="0 0 840 640" fill="none" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="521" cy="302" rx="281" ry="179" transform="rotate(-26 521 302)" />
        <ellipse cx="521" cy="302" rx="301" ry="198" transform="rotate(-26 521 302)" />
        <ellipse cx="521" cy="302" rx="321" ry="217" transform="rotate(-26 521 302)" />
        <ellipse cx="521" cy="302" rx="341" ry="236" transform="rotate(-26 521 302)" />
        <path d="M171 102h24m-12-12v24m543 351h24m-12-12v24M387 495h16m-8-8v16" />
      </svg>
      <div className="paper-rules" />
    </div>
  );
}

const offers = products.filter(product => product.promo).slice(0, 3);
const offerInterval = 3000;

export function PromoHero({ copy, onOpen, suspended = false }: { copy: Copy; onOpen: OpenProduct; suspended?: boolean }) {
  const [view, setView] = useState({ index: 0, previous: -1, direction: 0 });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(() => !document.hidden);
  const root = useRef<HTMLElement>(null);
  const visual = useRef<HTMLElement>(null);
  const drift = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const offer = offers[view.index];
  const outgoing = offers[view.previous];

  useEffect(() => {
    function visibility() { setVisible(!document.hidden); }
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);

  useEffect(() => {
    if (offers.length < 2 || reducedMotion || paused || hovered || !visible || suspended) return;
    const timer = window.setTimeout(() => {
      setView(current => ({ index: (current.index + 1) % offers.length, previous: current.index, direction: 1 }));
    }, offerInterval);
    return () => window.clearTimeout(timer);
  }, [view.index, reducedMotion, paused, hovered, visible, suspended]);

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const opening = view.direction === 0;
    const mask = opening ? 'inset(0% 0% 64% 0%)'
      : view.direction > 0 ? 'inset(0% 0% 0% 55%)' : 'inset(0% 55% 0% 0%)';

    const context = gsap.context(() => {
      const timeline = gsap.timeline();
      if (view.previous >= 0) {
        timeline.fromTo('.hero-art-outgoing', { opacity: 1 }, {
          x: -view.direction * 32, opacity: 0, filter: 'blur(8px)', duration: .37,
          ease: 'power2.in', clearProps: 'transform,opacity,filter',
        });
      }
      timeline
        .fromTo('.hero-art-incoming', { clipPath: mask }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: .62, ease: 'power3.out', clearProps: 'clipPath',
        }, opening ? 0 : .09)
        .fromTo(image.current, { x: view.direction * 28, y: opening ? 25 : 5, filter: 'blur(10px)', opacity: .25 }, {
          x: 0, y: 0, filter: 'blur(0px)', opacity: 1, duration: .68, ease: 'power3.out',
          clearProps: 'transform,filter,opacity',
        }, opening ? .03 : .1)
        .from('.hero-reveal', {
          y: 9, opacity: .58, stagger: .045, duration: .42, ease: 'power3.out', clearProps: 'transform,opacity',
        }, .14);
    }, root);
    return () => context.revert();
  }, [view, reducedMotion]);

  useLayoutEffect(() => {
    const stage = visual.current;
    const subject = drift.current;
    if (!stage || !subject || reducedMotion) return;
    const moveX = gsap.quickTo(subject, 'x', { duration: .52, ease: 'power3.out' });
    const moveY = gsap.quickTo(subject, 'y', { duration: .52, ease: 'power3.out' });
    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !stage) return;
      const box = stage.getBoundingClientRect();
      moveX(((event.clientX - box.left) / box.width - .5) * 22);
      moveY(((event.clientY - box.top) / box.height - .5) * 16);
    }
    function settle() { moveX(0); moveY(0); }
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', settle);
    return () => {
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', settle);
      moveX.tween.kill();
      moveY.tween.kill();
      gsap.set(subject, { clearProps: 'transform' });
    };
  }, [reducedMotion]);

  function select(index: number) {
    setView(current => current.index === index ? current : {
      index, previous: current.index, direction: index > current.index ? 1 : -1,
    });
  }

  if (!offer) return null;
  const color = offer.colors[0];
  return (
    <section id="promo" className="hero-stage wrap" ref={root} aria-label={copy.promotion}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={event => {
        if (event.target.matches(':focus-visible')) setPaused(true);
      }}
      style={{ '--hero-tone': color.dark } as CSSProperties}>
      {offers.length > 1 && !reducedMotion && <button type="button" className="plain-icon hero-rotation"
        aria-label={paused ? copy.playOffers : copy.pauseOffers} title={paused ? copy.playOffers : copy.pauseOffers}
        onClick={() => setPaused(current => !current)}><Icon name={paused ? 'play' : 'pause'} /></button>}
      <div className="hero-copy">
        <p className="hero-tag hero-reveal"><Icon name="ticket" />{copy.demoPromo}</p>
        <div className="hero-title-frame"><h2 className="hero-title hero-reveal">{offer.name}</h2></div>
        <div className="hero-reveal hero-offer"><Price product={offer} size={offer.sizes[0]} copy={copy} mode="hero" /></div>
        <div className="hero-reveal hero-actions">
          <ProductLink className="button hero-cta" product={offer} image={image} label={copy.viewProduct + ' ' + offer.name} onOpen={onOpen}>
            {copy.viewProduct}<Icon name="diagonal" />
          </ProductLink>
        </div>
      </div>
      <figure className="hero-visual" ref={visual} aria-hidden="true">
        <span className="hero-shadow" />
        <div className="hero-drift" ref={drift}>
          {outgoing && <div className="hero-art-mask hero-art-outgoing">
            <div className="hero-product"><ProductArt product={outgoing} color={outgoing.colors[0]} /></div>
          </div>}
          <div className="hero-art-mask hero-art-incoming">
            <div className="hero-product" ref={image}><ProductArt product={offer} color={color} /></div>
          </div>
        </div>
        <span className="hero-counter"><RollingNumber value={view.index + 1} pad /> / <RollingNumber value={offers.length} pad /></span>
      </figure>
      {offers.length > 1 && (
        <div className="hero-selector" role="group" aria-label={copy.promotion}>
          {offers.map((product, index) => (
            <button key={product.id} type="button" aria-pressed={index === view.index} onClick={() => select(index)}>
              <span className="hero-choice-index" aria-hidden="true"><RollingNumber value={index + 1} pad /></span>
              <span>{product.name}</span><Icon name="arrow" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
