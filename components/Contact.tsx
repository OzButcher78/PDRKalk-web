'use client';

import {useTranslations} from 'next-intl';
import {useState, useRef} from 'react';
import ObfuscatedEmail from './ObfuscatedEmail';
import SectionHead from './SectionHead';
import {groupIcons} from '@/lib/icons';
import {interpolate} from '@/lib/interpolate';
import {BUY_URL, TRIAL_DAYS, resolveCta} from '@/lib/site';

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'mlgwvvbo';

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

// EU member states (all COUNTRY_CODES except ch, au, gb). Orders from these
// require a VAT ID so we can invoice under reverse charge — no Swiss MwSt.
const EU_COUNTRY_CODES = new Set<string>([
  'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr',
  'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk',
  'si', 'es', 'se',
]);
const isEuCountry = (code: string) => EU_COUNTRY_CODES.has(code);

type Intent = '' | 'buy' | 'inquiry';

type FormState = {
  intent: Intent;
  firstName: string;
  lastName: string;
  company: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  state: string;
  vatId: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  intent: '',
  firstName: '',
  lastName: '',
  company: '',
  street: '',
  postalCode: '',
  city: '',
  country: '',
  state: '',
  vatId: '',
  email: '',
  message: '',
};

export default function Contact({lockedCountry}: {lockedCountry?: string} = {}) {
  const t = useTranslations('contact');
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError]   = useState(false);
  const [form, setForm]             = useState<FormState>(
    lockedCountry ? {...initialForm, country: lockedCountry} : initialForm,
  );
  const [errors, setErrors]         = useState<FormErrors>({});

  const refs = {
    intent:     useRef<HTMLInputElement>(null),
    firstName:  useRef<HTMLInputElement>(null),
    lastName:   useRef<HTMLInputElement>(null),
    company:    useRef<HTMLInputElement>(null),
    street:     useRef<HTMLInputElement>(null),
    postalCode: useRef<HTMLInputElement>(null),
    city:       useRef<HTMLInputElement>(null),
    country:    useRef<HTMLSelectElement>(null),
    state:      useRef<HTMLSelectElement>(null),
    vatId:      useRef<HTMLInputElement>(null),
    email:      useRef<HTMLInputElement>(null),
  };

  const update = (field: keyof FormState, value: string) => {
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

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.intent)            errs.intent     = t('errorIntentRequired');
    if (!form.firstName.trim())  errs.firstName  = t('errorFirstNameRequired');
    if (!form.lastName.trim())   errs.lastName   = t('errorLastNameRequired');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = t('errorEmailInvalid');
    }
    // Billing details are only needed when ordering a licence; an inquiry just
    // needs a name and an email so we can reply.
    if (form.intent === 'buy') {
      if (!form.company.trim())    errs.company    = t('errorCompanyRequired');
      if (!form.street.trim())     errs.street     = t('errorStreetRequired');
      if (!form.postalCode.trim()) errs.postalCode = t('errorPostalCodeRequired');
      if (!form.city.trim())       errs.city       = t('errorCityRequired');
      if (!form.country)           errs.country    = t('errorCountryRequired');
      if (form.country === 'au' && !form.state) errs.state = t('errorStateRequired');
      if (isEuCountry(form.country) && !form.vatId.trim()) errs.vatId = t('errorVatIdRequired');
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrField = (Object.keys(errs) as Array<keyof FormState>).find(k => errs[k]);
      if (firstErrField && firstErrField in refs) {
        refs[firstErrField as keyof typeof refs]?.current?.focus();
      }
      return;
    }

    setSubmitting(true);
    setSendError(false);

    try {
      const intentLabel = form.intent ? t(`intent_${form.intent}` as 'intent_buy') : '';
      const isOrder = form.intent === 'buy';
      const payload: Record<string, string> = {
        _subject: isOrder
          ? `[Licence Order] ${form.firstName} ${form.lastName} — ${form.company}`
          : `[Inquiry] ${form.firstName} ${form.lastName}`,
        intent: intentLabel,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        message: form.message,
      };
      if (isOrder) {
        payload.company = form.company;
        payload.street = form.street;
        payload.postalCode = form.postalCode;
        payload.city = form.city;
        payload.country = form.country ? t(`country_${form.country}` as 'country_ch') : '';
        payload.state = form.state;
        payload.vatId = form.vatId;
      }

      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm(lockedCountry ? {...initialForm, country: lockedCountry} : initialForm);
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

  const inputStyle = {
    display: 'block',
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: '#fff',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  };

  const errorStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.78rem',
    color: '#fc8181',
    marginTop: '0.3rem',
    display: 'block',
  };

  const fieldBorder = (field: keyof FormState) =>
    errors[field] ? 'rgba(252,129,129,0.6)' : 'rgba(255,255,255,0.1)';

  type RefField = keyof typeof refs;
  type InputRefField = Exclude<RefField, 'country' | 'state' | 'intent'>;
  const renderInput = (
    field: InputRefField,
    type: string = 'text',
    autoComplete?: string,
    inputMode?: 'text' | 'email' | 'tel' | 'url' | 'numeric',
  ) => (
    <div>
      <label className="c-label" htmlFor={field}>{t(`${field}Label` as const)}</label>
      <input
        id={field}
        type={type}
        name={field}
        ref={refs[field] as React.RefObject<HTMLInputElement>}
        aria-label={t(`${field}Label` as const)}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={errors[field] ? `${field}-error` : undefined}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={t(`${field}Placeholder` as const)}
        value={form[field]}
        onChange={e => update(field, e.target.value)}
        className="contact-input"
        style={{...inputStyle, borderColor: fieldBorder(field)}}
        onFocus={e => { if (!errors[field]) e.target.style.borderColor = 'var(--red)'; }}
        onBlur={e => { if (!errors[field]) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
      />
      {errors[field] && <span id={`${field}-error`} style={errorStyle}>{errors[field]}</span>}
    </div>
  );

  return (
    <section
      id="contact"
      className="section theme-dark"
      style={{background: 'var(--ink-mid)'}}
      aria-labelledby="contact-title"
    >
      <div className="container--narrow">
        <SectionHead id="contact-title" title={t('title')} lead={t('subtitle')} center />

        <div className="contact-layout">
          <div>
            {submitted ? (
              <div
                className="fade-up"
                aria-live="polite"
                role="status"
                tabIndex={-1}
                autoFocus
                style={{
                  textAlign: 'center',
                  padding: '3rem 2rem',
                  background: 'rgba(22,163,74,0.1)',
                  border: '1px solid rgba(22,163,74,0.3)',
                  borderRadius: '14px',
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.25rem',
                }}
              >
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                  <circle cx="28" cy="28" r="26" stroke="#22c55e" strokeWidth="2.5" />
                  <path d="M17 29l8 8 15-16" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: '#4ade80',
                  letterSpacing: '0.03em',
                  margin: 0,
                }}>
                  {t('success')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="fade-up" noValidate>
                {/* Step 1 — Intent */}
                <fieldset className="c-step">
                  <legend className="c-legend">1 · {t('stepIntent')}</legend>
                  <div className="contact-grid" style={{display: 'grid', gap: '0.75rem'}}>
                    {(['buy', 'inquiry'] as const).map((value, idx) => {
                      const selected = form.intent === value;
                      return (
                        <label
                          key={value}
                          className={`intent-card intent-card--${value}`}
                          style={{
                            background: selected ? 'rgba(232,0,29,0.08)' : 'rgba(255,255,255,0.05)',
                            borderColor: selected
                              ? 'var(--red)'
                              : errors.intent
                              ? 'rgba(252,129,129,0.6)'
                              : 'rgba(255,255,255,0.1)',
                          }}
                        >
                          <input
                            type="radio"
                            name="intent"
                            value={value}
                            ref={idx === 0 ? refs.intent : undefined}
                            checked={selected}
                            onChange={() => {
                              setForm(prev => ({...prev, intent: value}));
                              // Required fields differ per intent — drop any stale errors.
                              setErrors({});
                            }}
                            style={{
                              position: 'absolute',
                              width: 1,
                              height: 1,
                              padding: 0,
                              margin: -1,
                              overflow: 'hidden',
                              clip: 'rect(0,0,0,0)',
                              border: 0,
                            }}
                          />
                          <span
                            aria-hidden
                            style={{
                              width: '18px',
                              height: '18px',
                              flexShrink: 0,
                              borderRadius: '50%',
                              border: `2px solid ${selected ? 'var(--red)' : 'rgba(255,255,255,0.4)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'border-color 0.15s',
                            }}
                          >
                            {selected && (
                              <span style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)'}} />
                            )}
                          </span>
                          <span aria-hidden style={{color: selected ? 'var(--red)' : 'var(--steel)', display: 'inline-flex'}}>
                            {value === 'buy' ? groupIcons.wallet : groupIcons.mail}
                          </span>
                          <span style={{fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#fff', lineHeight: 1.3}}>
                            {t(`intent_${value}` as 'intent_buy')}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.intent && <span id="intent-error" style={errorStyle}>{errors.intent}</span>}
                </fieldset>

                {/* Orders go through the order page (terms, price, payment
                    term); this form only handles enquiries from here on. The
                    buy branch in validate()/handleSubmit is frozen and now
                    unreachable from the UI. */}
                {form.intent === 'buy' ? (
                  <ContactOrderForward />
                ) : (
                <>
                {/* Step 2 — Contact details */}
                <fieldset className="c-step">
                  <legend className="c-legend">2 · {t('stepContact')}</legend>

                  <div className="contact-grid" style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}>
                    {renderInput('firstName', 'text', 'given-name')}
                    {renderInput('lastName',  'text', 'family-name')}
                  </div>
                </fieldset>

                {/* Email */}
                <div style={{marginBottom: '1rem'}}>
                  {renderInput('email', 'email', 'email', 'email')}
                </div>

                {/* Message (optional) */}
                <div style={{marginBottom: '1.25rem'}}>
                  <label className="c-label" htmlFor="message">{t('messageLabel')}</label>
                  <textarea
                    id="message"
                    rows={4}
                    name="message"
                    aria-label={t('messageLabel')}
                    autoComplete="off"
                    placeholder={t('messagePlaceholder')}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    className="contact-input"
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '110px',
                      borderColor: 'rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--red)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                {sendError && (
                  <p role="alert" style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: '#fc8181',
                    textAlign: 'center',
                    marginBottom: '0.75rem',
                  }}>
                    {t('sendError')}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-red btn--lg"
                  style={{
                    width: '100%',
                    cursor: submitting ? 'wait' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? t('submitting') : `${t('submit')} →`}
                </button>
                </>
                )}
              </form>
            )}
          </div>

          <aside className="contact-aside">
            <ContactJourney />

            {!submitted && (
              <div className="platform-notice" style={{
                marginTop: '1.5rem',
                background: 'rgba(37,99,235,0.08)',
                border: '1px solid rgba(37,99,235,0.3)',
                borderRadius: '10px',
                padding: '1rem',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  letterSpacing: '0.06em',
                  color: '#ffffff',
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase',
                }}>
                  {t('platformNoticeTitle')}
                </div>
                <p className="micro" style={{color: '#cbd5e1', margin: 0}}>
                  {t('platformNoticeBody')}
                </p>
              </div>
            )}

            <p className="micro" style={{marginTop: '1.5rem', color: '#64748b'}}>
              <ObfuscatedEmail
                user={t('emailUser')}
                domain={t('emailDomain')}
                className="tap-link"
                style={{color: 'var(--steel)', textDecoration: 'none'}}
              />
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/**
 * The "how you get your licence" mini-steps in the aside. Kept as its own
 * component so Contact's frozen logic block does not need a second
 * useTranslations() call.
 */
function ContactJourney() {
  const p = useTranslations('pricing');
  const journey = p.raw('journey') as {title: string; steps: Array<{t: string; d: string}>};
  return (
    <>
      <h3 className="t-h3" style={{fontSize: '1.05rem', marginBottom: '1rem'}}>{journey.title}</h3>
      <ol className="journey">
        {journey.steps.map((step, i) => (
          <li key={i} data-n={i + 1}>
            <p className="journey-t">{p(`journey.steps.${i}.t`, {days: TRIAL_DAYS})}</p>
            <p className="journey-d">{interpolate(step.d)}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

/**
 * Replaces the enquiry fields once the "order" card is picked. The link is
 * relative on purpose: Contact only renders on a home page (/de/, /au/), and
 * its frozen signature cannot take a `home` prop, so the browser resolves
 * `order/` against the current home — /de/order/, /au/order/.
 */
function ContactOrderForward() {
  const o = useTranslations('order');
  return (
    <div className="order-forward fade-up">
      <p>{o('forward.text')}</p>
      <a href={resolveCta(BUY_URL, '')} className="btn btn-red btn--lg" style={{width: '100%'}}>
        {o('forward.cta')} <span aria-hidden>→</span>
      </a>
    </div>
  );
}
