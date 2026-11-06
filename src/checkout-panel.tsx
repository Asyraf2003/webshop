import { useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import {
  deliveryOptions, deliveryRegions, emptyAddress, isAddressReady, orderTotals, paymentMethods,
  type DeliveryAddress, type DeliveryService, type PaymentMethod,
} from './checkout-model';
import { CloseButton, Surface } from './commerce-ui';
import { Icon } from './icons';
import { colorName, type Copy, type Locale } from './locale';
import { RollingNumber } from './motion';
import { ProductArt } from './product-art';
import { variantKey, type CartItem } from './shop';

type Receipt = {
  reference: string;
  city: string;
  service: DeliveryService;
  method: PaymentMethod;
  total: number;
};

const paymentIcons = { transfer: 'bank', wallet: 'wallet', cash: 'package' } as const;

function OrderSummary({ items, address, shipping, copy, locale }: {
  items: CartItem[]; address: DeliveryAddress; shipping?: number; copy: Copy; locale: Locale;
}) {
  const labels = copy.order;
  const totals = orderTotals(items, shipping ?? 0);

  return (
    <aside className="purchase-summary" aria-label={labels.summary}>
      <h3>{labels.summary}</h3>
      <ul className="purchase-items">{items.map(item => (
        <li key={variantKey(item)}>
          <span className="purchase-thumbnail" style={{ '--tint': item.color.tint } as CSSProperties}>
            <ProductArt product={item.product} color={item.color} />
            <span className="purchase-item-count"><RollingNumber value={item.quantity} /></span>
          </span>
          <span className="purchase-item-name">{item.product.name}<small>{colorName(item.color, locale)} · {item.size.height} cm</small></span>
          <strong><RollingNumber value={item.unitPrice * item.quantity} currency /></strong>
        </li>
      ))}</ul>
      {isAddressReady(address) && <p className="purchase-destination"><Icon name="package" />
        <span>{labels.deliveryTo} <strong>{address.city.trim()}, {address.postcode.trim()}</strong></span>
      </p>}
      <dl className="purchase-costs">
        <div><dt>{labels.merchandise}</dt><dd><RollingNumber value={totals.merchandise} currency /></dd></div>
        {totals.discount > 0 && <div className="purchase-savings">
          <dt><Icon name="ticket" />{labels.automaticPromo}</dt><dd>−<RollingNumber value={totals.discount} currency /></dd>
        </div>}
        <div><dt>{labels.shipping}</dt><dd>{shipping === undefined ? '—' : <RollingNumber value={totals.shipping} currency />}</dd></div>
        <div className="purchase-total"><dt>{copy.total}</dt><dd aria-live="polite"><RollingNumber value={totals.total} currency /></dd></div>
      </dl>
    </aside>
  );
}

export function CheckoutPanel({ open, copy, locale, items, valid, onClose, onComplete, onOrder }: {
  open: boolean; copy: Copy; locale: Locale; items: CartItem[]; valid: boolean;
  onClose: () => void; onComplete: () => void; onOrder: () => void;
}) {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(emptyAddress);
  const [service, setService] = useState<DeliveryService>();
  const [method, setMethod] = useState<PaymentMethod>();
  const [receipt, setReceipt] = useState<Receipt>();
  const [addressError, setAddressError] = useState(false);
  const completed = useRef(false);
  const title = useRef<HTMLHeadingElement>(null);
  const labels = copy.order;
  const steps = [labels.address, labels.shipping, labels.payment];
  const options = deliveryOptions(address.region);
  const shipping = options.find(option => option.service === service)?.fee;
  const totals = orderTotals(items, shipping ?? 0);
  const close = receipt ? onComplete : onClose;

  useLayoutEffect(() => {
    if (!open) return;
    title.current?.closest('dialog')?.scrollTo({ top: 0, behavior: 'instant' });
    title.current?.focus({ preventScroll: true });
  }, [open, step, receipt]);

  function update<Key extends keyof DeliveryAddress>(key: Key, value: DeliveryAddress[Key]) {
    setAddress(current => ({ ...current, [key]: value }));
    setAddressError(false);
    if (key === 'region' && value !== address.region) setService(undefined);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || completed.current) return;
    if (!isAddressReady(address)) {
      setStep(0);
      setAddressError(true);
      return;
    }
    if (step === 0 || (step === 1 && service && shipping !== undefined)) {
      setStep(current => current + 1);
      return;
    }
    if (step !== 2 || !service || shipping === undefined || !method) return;

    const reference = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(7, '0');
    completed.current = true;
    setReceipt({ reference: 'PP-' + reference, city: address.city.trim(), service, method, total: totals.total });
    setAddress(emptyAddress);
    onOrder();
  }

  return (
    <Surface open={open} kind="checkout" titleId="checkout-title" onClose={close}>
      <header className="surface-head purchase-head">
        <div><span className="purchase-brand">Paperplay</span><h2 id="checkout-title">{copy.checkout}</h2></div>
        <CloseButton label={copy.close + ' ' + copy.checkout} onClose={close} />
      </header>
      {receipt ? (
        <section className="purchase-receipt">
          <span className="purchase-receipt-mark"><Icon name="check" /></span>
          <h3 ref={title} tabIndex={-1}>{labels.completed}</h3>
          <p>{labels.paymentPending}</p>
          <dl className="purchase-costs">
            <div><dt>{labels.reference}</dt><dd><strong>{receipt.reference}</strong></dd></div>
            <div><dt>{labels.deliveryTo}</dt><dd>{receipt.city}</dd></div>
            <div><dt>{labels.shipping}</dt><dd>{labels.deliveries[receipt.service]}</dd></div>
            <div><dt>{labels.payment}</dt><dd>{labels.methods[receipt.method].name}</dd></div>
            <div className="purchase-total"><dt>{copy.total}</dt><dd><RollingNumber value={receipt.total} currency /></dd></div>
          </dl>
          <button type="button" className="button button-solid" onClick={onComplete}>{labels.keepShopping}<Icon name="arrow" /></button>
        </section>
      ) : (
        <div className="purchase-layout">
          <div className="purchase-flow">
            <ol className="purchase-progress" aria-label={copy.checkout}>
              {steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined} data-done={index < step}>
                <span className="purchase-step-number" aria-hidden="true">
                  {index < step ? <Icon name="check" /> : <RollingNumber value={index + 1} />}
                </span>{label}
              </li>)}
            </ol>
            <form onSubmit={submit}>
              <div className="purchase-stage" key={step}>
                <h3 ref={title} tabIndex={-1}>{step === 0 ? labels.address : step === 1 ? labels.chooseDelivery : labels.choosePayment}</h3>
                {step === 0 && <div className="purchase-address">
                  <label>{labels.recipient}
                    <input autoComplete="shipping name" value={address.recipient} required maxLength={100}
                      onChange={event => update('recipient', event.target.value)} />
                  </label>
                  <label>{labels.phone}
                    <input type="tel" autoComplete="shipping tel" value={address.phone} required maxLength={24}
                      onChange={event => update('phone', event.target.value)} />
                  </label>
                  <div className="purchase-street">
                    <label>{labels.street}
                      <textarea autoComplete="shipping street-address" value={address.street} required maxLength={300} rows={3}
                        aria-describedby="purchase-address-help" onChange={event => update('street', event.target.value)} />
                    </label>
                    <small id="purchase-address-help">{labels.addressHelp}</small>
                  </div>
                  <label>{labels.city}
                    <input autoComplete="shipping address-level2" value={address.city} required maxLength={100}
                      onChange={event => update('city', event.target.value)} />
                  </label>
                  <label>{labels.postcode}
                    <input inputMode="numeric" autoComplete="shipping postal-code" pattern="[0-9]{5}" value={address.postcode}
                      required maxLength={5} onChange={event => update('postcode', event.target.value)} />
                  </label>
                  <label className="purchase-street">{labels.region}
                    <select required value={address.region} onChange={event => update('region', event.target.value as DeliveryAddress['region'])}>
                      <option value="">{labels.chooseRegion}</option>
                      {deliveryRegions.map(region => <option key={region} value={region}>{labels.regions[region]}</option>)}
                    </select>
                  </label>
                  {addressError && <p className="purchase-error purchase-street" role="alert">{labels.addressError}</p>}
                </div>}
                {step === 1 && <fieldset className="purchase-options" aria-label={labels.chooseDelivery}>
                  {options.map(option => <label className="purchase-option" key={option.service}>
                    <input type="radio" name="delivery" value={option.service} checked={option.service === service} required
                      onChange={() => setService(option.service)} />
                    <span><strong>{labels.deliveries[option.service]}</strong>
                      <small>{option.from}–{option.to} {labels.days}</small>
                    </span>
                    <strong className="purchase-option-price"><RollingNumber value={option.fee} currency /></strong>
                  </label>)}
                </fieldset>}
                {step === 2 && <fieldset className="purchase-options" aria-label={labels.choosePayment}>
                  {paymentMethods.map(option => <label className="purchase-option" key={option}>
                    <input type="radio" name="payment" value={option} checked={option === method} required onChange={() => setMethod(option)} />
                    <span><strong>{labels.methods[option].name}</strong><small>{labels.methods[option].detail}</small></span>
                    <Icon name={paymentIcons[option]} />
                  </label>)}
                </fieldset>}
              </div>
              <div className="purchase-actions">
                <div className="purchase-mobile-total"><span>{copy.total}</span><strong><RollingNumber value={totals.total} currency /></strong></div>
                <button type="button" className="button button-outline purchase-back" onClick={() => {
                  if (step === 0) onClose();
                  else setStep(current => current - 1);
                }}><Icon name="arrow" />{step === 0 ? copy.cart : labels.back}</button>
                <button type="submit" className="button button-solid" disabled={!valid}>
                  {step === 2 ? labels.place : labels.next}<Icon name="arrow" />
                </button>
              </div>
            </form>
          </div>
          <OrderSummary items={items} address={address} shipping={shipping} copy={copy} locale={locale} />
        </div>
      )}
    </Surface>
  );
}
