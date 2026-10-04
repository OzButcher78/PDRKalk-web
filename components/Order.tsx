'use client';

import {useTranslations} from 'next-intl';
import {useEffect, useRef, useState} from 'react';
import ObfuscatedEmail from './ObfuscatedEmail';
import {interpolate} from '@/lib/interpolate';
import {
  ORDER_PATH,
  PAYMENT_TERM_DAYS,
  PRICE_AUD,
  PRICE_CHF,
  PRICE_EUR,
  TERMS_VERSION,
  VAT_RATE_CH,
} from '@/lib/site';

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'mlgwvvbo';

// Copies of the lists in Contact.tsx — those sit in its frozen block and
// cannot be exported from there.
const COUNTRY_CODES = [
  'ch', 'at', 'au', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee',
  'fi', 'fr', 'de', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'lu',
  'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se', 'gb',
] as const;

const AU_STATES: ReadonlyArray<{code: string; name: string}> = [
  {code: 'NSW', name: 'New South Wales'},
  {code: 'VIC', name: 'Victoria'},
  {code: 'QLD', name: 'Queensland'},
  {code: 'WA',  name: 'Western Australia'},
  {code: 'SA',  name: 'South Australia'},
  {code: 'TAS', name: 'Tasmania'},
  {code: 'ACT', name: 'Australian Capital Territory'},
  {code: 'NT',  name: 'Northern Territory'},
];

// EU member states: invoiced in EUR under reverse charge, so a VAT ID is required.
const EU_COUNTRY_CODES = new Set<string>([
  'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr',
  'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk',
  'si', 'es', 'se',
]);
const isEuCountry = (code: string) => EU_COUNTRY_CODES.has(code);

/** Which price applies — it follows the billing country. */
type Region = 'none' | 'ch' | 'eu' | 'gb' | 'au';
const regionOf = (country: string): Region =>
  country === 'ch' ? 'ch'
  : country === 'au' ? 'au'
  : country === 'gb' ? 'gb'   // assumption pending confirmation: EUR price, no Swiss VAT
  : isEuCountry(country) ? 'eu'
  : 'none';

const cents = (n: number) => Math.round(n * 100) / 100;
const money = (n: number) => n.toFixed(2);
const VAT_CH = cents(PRICE_CHF * VAT_RATE_CH);
const TOTAL_CH = cents(PRICE_CHF + VAT_CH);
const VAT_PERCENT = `${(VAT_RATE_CH * 100).toFixed(1)}%`;

/** Locale-independent price line for the order email. */
const PAYLOAD_PRICE: Record<Exclude<Region, 'none'>, string> = {
  ch: `CHF ${money(PRICE_CHF)} + ${VAT_PERCENT} VAT (CHF ${money(VAT_CH)}) = CHF ${money(TOTAL_CH)}`,
  eu: `EUR ${money(PRICE_EUR)}, no VAT (reverse charge)`,
  gb: `EUR ${money(PRICE_EUR)}, no Swiss VAT`,
  au: `AUD ${money(PRICE_AUD)}, GST applies`,
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  state: string;
  vatId: string;
  message: string;
  consent: boolean;
};
type TextField = Exclude<keyof FormState, 'consent'>;
type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  street: '',
  postalCode: '',
  city: '',
  country: '',
  state: '',
  vatId: '',
  message: '',
  consent: false,
};

type Step = {t: string; d: string};

/** Pairs the consent sentence with the terms block below it. */
const TERMS_MARK = <span className="order-mark" aria-hidden="true">*</span>;

/**
 * The binding licence order, top to bottom: order summary, billing form, terms.
 * Contact.tsx keeps handling enquiries — its logic is frozen, so the order
 * lives here.
 */
export default function Order({home, lockedCountry}: {home: string; lockedCountry?: string}) {
  const t = useTranslations('order');
  const c = useTranslations('contact');

  const [form, setForm]             = useState<FormState>(() =>
    lockedCountry ? {...initialForm, country: lockedCountry} : initialForm,
  );
  const [errors, setErrors]         = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError]   = useState(false);
  const [sentTo, setSentTo]         = useState('');

  const refs = {
    firstName:  useRef<HTMLInputElement>(null),
    lastName:   useRef<HTMLInputElement>(null),
    email:      useRef<HTMLInputElement>(null),
    company:    useRef<HTMLInputElement>(null),
    street:     useRef<HTMLInputElement>(null),
    postalCode: useRef<HTMLInputElement>(null),
    city:       useRef<HTMLInputElement>(null),
    country:    useRef<HTMLSelectElement>(null),
    state:      useRef<HTMLSelectElement>(null),
    vatId:      useRef<HTMLInputElement>(null),
    consent:    useRef<HTMLInputElement>(null),
  };
  const statusRef = useRef<HTMLDivElement>(null);

  // Move focus to the confirmation so it is both seen and announced.
  useEffect(() => {
    if (sentTo) statusRef.current?.focus();
  }, [sentTo]);

  const region = regionOf(form.country);
  const vatRequired = isEuCountry(form.country);
  // AU businesses may add an ABN; au.json labels the vatId field accordingly.
  const showVatId = vatRequired || lockedCountry === 'au';

  const update = (field: TextField, value: string) => {
    setForm(prev => {
      const next = {...prev, [field]: value};
      if (field === 'country') {
        if (value !== 'au') next.state = '';
        if (!isEuCountry(value)) next.vatId = '';
      }
      return next;
    });
    if (errors[field]) setErrors(prev => ({...prev, [field]: undefined}));
  };

  // Field order = screen order, so the first error is also the first field.
  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.firstName.trim())  errs.firstName  = c('errorFirstNameRequired');
    if (!form.lastName.trim())   errs.lastName   = c('errorLastNameRequired');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = c('errorEmailInvalid');
    if (!form.company.trim())    errs.company    = c('errorCompanyRequired');
    if (!form.street.trim())     errs.street     = c('errorStreetRequired');
    if (!form.postalCode.trim()) errs.postalCode = c('errorPostalCodeRequired');
    if (!form.city.trim())       errs.city       = c('errorCityRequired');
    if (!form.country)           errs.country    = c('errorCountryRequired');
    if (form.country === 'au' && !form.state) errs.state = c('errorStateRequired');
    if (vatRequired && !form.vatId.trim()) errs.vatId = c('errorVatIdRequired');
    if (!form.consent)           errs.consent    = t('form.errorConsentRequired');
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    const firstErr = (Object.keys(errs) as Array<keyof typeof refs>).find(k => errs[k]);
    if (firstErr) {
      setErrors(errs);
      refs[firstErr].current?.focus();
      return;
    }
    if (region === 'none') return; // unreachable: country is validated above

    setSubmitting(true);
    setSendError(false);

    const v = (field: TextField) => form[field].trim();
    // Same keys and subject as the old buy payload, so inbox filters keep working.
    const payload: Record<string, string> = {
      _subject: `[Licence Order] ${v('firstName')} ${v('lastName')} — ${v('company')}`,
      intent: c('intent_buy'),
      firstName: v('firstName'),
      lastName: v('lastName'),
      email: v('email'),
      message: v('message'),
      company: v('company'),
      street: v('street'),
      postalCode: v('postalCode'),
      city: v('city'),
      country: c(`country_${form.country}` as 'country_ch'),
      state: form.state,
      vatId: v('vatId'),
      price: PAYLOAD_PRICE[region],
      paymentTerm: `${PAYMENT_TERM_DAYS} days from invoice date, bank transfer`,
      termsAccepted: `yes — terms ${TERMS_VERSION}`,
      page: `${home}${ORDER_PATH}`,
    };

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        // The form is not shown again, so its values stay: the summary keeps
        // showing the price of the order that was just placed.
        setSentTo(payload.email);
        setErrors({});
      } else {
        setSendError(true);
      }
    } catch {
      setSendError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const errorText = (field: keyof FormState) =>
    errors[field] && <span id={`${field}-error`} className="order-error">{errors[field]}</span>;

  const fieldProps = (field: keyof FormState) => ({
    id: field,
    name: field,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  const renderInput = (
    field: Exclude<TextField, 'country' | 'state' | 'message'>,
    type: string = 'text',
    autoComplete?: string,
    inputMode?: 'text' | 'email',
  ) => (
    <div>
      <label className="c-label" htmlFor={field}>{c(`${field}Label` as const)}</label>
      <input
        {...fieldProps(field)}
        ref={refs[field]}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={c(`${field}Placeholder` as const)}
        value={form[field]}
        onChange={e => update(field, e.target.value)}
        className="contact-input order-input"
      />
      {errorText(field)}
    </div>
  );

  const terms = t.raw('terms.items') as Step[];
  const next = t.raw('next.steps') as Step[];

  const priceLine =
    region === 'ch' ? t('price.lineCh', {amount: money(TOTAL_CH)})
    : region === 'eu' ? t('price.lineEu', {amount: money(PRICE_EUR)})
    : region === 'gb' ? t('price.lineGb', {amount: money(PRICE_EUR)})
    : region === 'au' ? t('price.lineAu', {amount: money(PRICE_AUD)})
    : t('price.lineNone', {price: PRICE_CHF, priceEur: PRICE_EUR});

  return (
    <section className="section theme-dark bg-grid order-page" style={{background: 'var(--ink)'}} aria-labelledby="order-title">
      <div className="container--text">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li><a href={home}>{t('crumbHome')}</a> <span aria-hidden>›</span></li>
            <li aria-current="page">{t('title')}</li>
          </ol>
        </nav>

        <h1 id="order-title" tabIndex={-1} className="t-h1" style={{fontSize: 'clamp(2rem, 4.2vw, 3.2rem)'}}>{t('title')}</h1>
        <p className="lead" style={{marginTop: '1rem'}}>{t('lead')}</p>

        {/* 1 — what is being ordered, at what price, and what happens next */}
        <section className="order-summary" aria-labelledby="summary-title">
          <div>
            <h2 id="summary-title" className="order-kicker">{t('summary.title')}</h2>
            <p className="order-product">{t('summary.product')}</p>

            {region === 'none' ? (
              <div className="order-prices">
                <p className="micro" style={{margin: '0 0 0.4rem'}}>{t('price.pick')}</p>
                <ul>
                  <li>{t('price.ch', {price: PRICE_CHF})}</li>
                  <li>{t('price.eu', {priceEur: PRICE_EUR})}</li>
                </ul>
              </div>
            ) : (
              <>
                <dl className="order-rows">
                  {region === 'ch' ? (
                    <>
                      <div><dt>{t('price.licence')}</dt><dd>CHF {money(PRICE_CHF)}</dd></div>
                      <div><dt>{t('price.vatCh')}</dt><dd>CHF {money(VAT_CH)}</dd></div>
                      <div className="order-rows__total"><dt>{t('price.total')}</dt><dd>CHF {money(TOTAL_CH)}</dd></div>
                    </>
                  ) : region === 'au' ? (
                    <div className="order-rows__total"><dt>{t('price.licence')}</dt><dd>AUD {money(PRICE_AUD)}</dd></div>
                  ) : (
                    <>
                      <div><dt>{t('price.licence')}</dt><dd>EUR {money(PRICE_EUR)}</dd></div>
                      <div className="order-rows__total"><dt>{t('price.total')}</dt><dd>EUR {money(PRICE_EUR)}</dd></div>
                    </>
                  )}
                </dl>
                {region !== 'ch' && (
                  <p className="order-rows__note">
                    {region === 'eu' ? t('price.noteEu') : region === 'gb' ? t('price.noteGb') : t('price.noteAu')}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="order-summary__next">
            <h3 className="order-kicker">{t('next.title')}</h3>
            <ol className="order-steps">
              {next.map((step, i) => (
                <li key={i}>
                  <p className="order-steps__t">{interpolate(step.t)}</p>
                  <p className="order-steps__d">{interpolate(step.d)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 2 — the form, or the confirmation once it has been sent */}
        {sentTo ? (
          <div ref={statusRef} className="order-success fade-up" role="status" aria-live="polite" tabIndex={-1}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
              <circle cx="28" cy="28" r="26" stroke="#22c55e" strokeWidth="2.5" />
              <path d="M17 29l8 8 15-16" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="order-success__title">{t('success.title')}</p>
            <p>{t('success.invoice', {email: sentTo})}</p>
            <p>{t('success.term', {paymentDays: PAYMENT_TERM_DAYS})}</p>
            <p>{t('success.licence')}</p>
            <p style={{marginTop: '0.5rem'}}>
              <a href={home} className="link-more">{t('success.backHome')} <span aria-hidden>→</span></a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="order-form" noValidate>
            <fieldset className="c-step">
              <legend className="c-legend">1 · {c('stepContact')}</legend>
              <div className="order-pair">
                {renderInput('firstName', 'text', 'given-name')}
                {renderInput('lastName', 'text', 'family-name')}
              </div>
              {renderInput('email', 'email', 'email', 'email')}
            </fieldset>

            <fieldset className="c-step">
              <legend className="c-legend">2 · {c('stepBilling')}</legend>
              <p className="order-hint">{t('form.billingHint')}</p>

              <div style={{marginBottom: '1rem'}}>{renderInput('company', 'text', 'organization')}</div>
              <div style={{marginBottom: '1rem'}}>{renderInput('street', 'text', 'street-address')}</div>
              <div className="order-pair order-pair--plz">
                {renderInput('postalCode', 'text', 'postal-code')}
                {renderInput('city', 'text', 'address-level2')}
              </div>

              {!lockedCountry && (
                <div style={{marginBottom: '1rem'}}>
                  <label className="c-label" htmlFor="country">{c('countryLabel')}</label>
                  <select
                    {...fieldProps('country')}
                    ref={refs.country}
                    autoComplete="country"
                    value={form.country}
                    onChange={e => update('country', e.target.value)}
                    className="contact-input order-input order-select"
                    data-empty={form.country ? undefined : 'true'}
                  >
                    <option value="" disabled>{c('countryPlaceholder')}</option>
                    {COUNTRY_CODES
                      .map(code => ({code, name: c(`country_${code}` as 'country_ch')}))
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(({code, name}) => <option key={code} value={code}>{name}</option>)}
                  </select>
                  {errorText('country')}
                </div>
              )}

              {form.country === 'au' && (
                <div style={{marginBottom: '1rem'}}>
                  <label className="c-label" htmlFor="state">{c('stateLabel')}</label>
                  <select
                    {...fieldProps('state')}
                    ref={refs.state}
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={e => update('state', e.target.value)}
                    className="contact-input order-input order-select"
                    data-empty={form.state ? undefined : 'true'}
                  >
                    <option value="" disabled>{c('statePlaceholder')}</option>
                    {AU_STATES.map(({code, name}) => <option key={code} value={code}>{name} ({code})</option>)}
                  </select>
                  {errorText('state')}
                </div>
              )}

              {showVatId && (
                <div style={{marginBottom: '1rem'}}>
                  {renderInput('vatId', 'text')}
                  <p className="micro" style={{color: '#8fa8c8', margin: '0.4rem 0 0'}}>{c('vatIdNote')}</p>
                </div>
              )}
            </fieldset>

            <fieldset className="c-step">
              <legend className="c-legend">3 · {t('form.stepNotes')}</legend>
              <label className="sr-only" htmlFor="message">{c('messageLabel')}</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                autoComplete="off"
                placeholder={c('messagePlaceholder')}
                value={form.message}
                onChange={e => update('message', e.target.value)}
                className="contact-input order-input"
                style={{resize: 'vertical', minHeight: '90px'}}
              />
            </fieldset>

            <fieldset className="c-step" style={{marginBottom: 0}}>
              <legend className="c-legend">4 · {t('form.stepConfirm')}</legend>

              <label className="order-check" data-invalid={errors.consent ? 'true' : undefined}>
                <input
                  {...fieldProps('consent')}
                  ref={refs.consent}
                  type="checkbox"
                  checked={form.consent}
                  onChange={e => {
                    const checked = e.target.checked;
                    setForm(prev => ({...prev, consent: checked}));
                    if (errors.consent) setErrors(prev => ({...prev, consent: undefined}));
                  }}
                />
                <span>
                  {t.rich('form.consent', {
                    terms: chunks => <><a href="#terms">{chunks}</a>{TERMS_MARK}</>,
                  })}
                </span>
              </label>
              {errorText('consent')}

              <p className="order-line">
                <strong>{t('summary.productShort')}</strong> · {priceLine} · {t('summary.lineTerm', {paymentDays: PAYMENT_TERM_DAYS})}
              </p>

              {sendError && <p role="alert" className="order-send-error">{c('sendError')}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-red btn--lg"
                style={{width: '100%', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1}}
              >
                {submitting ? c('submitting') : t('form.submit')}
              </button>
            </fieldset>
          </form>
        )}

        {/* 3 — the terms, linked from the consent checkbox */}
        <section id="terms" className="order-terms" aria-labelledby="terms-title">
          <h2 id="terms-title" className="order-kicker">{t('terms.title')}{TERMS_MARK}</h2>
          <ol>
            {terms.map((item, i) => (
              <li key={i}>
                <strong>{item.t}.</strong> {interpolate(item.d)}
              </li>
            ))}
          </ol>
          <p className="micro order-terms__meta">
            {t('terms.versionLabel')} {TERMS_VERSION} · {t('terms.seller')} ·{' '}
            <ObfuscatedEmail user={c('emailUser')} domain={c('emailDomain')} className="tap-link" style={{color: 'var(--steel)'}} />
          </p>
        </section>
      </div>
    </section>
  );
}
