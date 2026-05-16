'use client';

import {useTranslations} from 'next-intl';
import {useState, useRef} from 'react';
import ObfuscatedEmail from './ObfuscatedEmail';

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

type FormState = {
  firstName: string;
  lastName: string;
  company: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  state: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  company: '',
  street: '',
  postalCode: '',
  city: '',
  country: '',
  state: '',
  email: '',
  message: '',
};

export default function Contact() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError]   = useState(false);
  const [form, setForm]             = useState<FormState>(initialForm);
  const [errors, setErrors]         = useState<FormErrors>({});

  const refs = {
    firstName:  useRef<HTMLInputElement>(null),
    lastName:   useRef<HTMLInputElement>(null),
    company:    useRef<HTMLInputElement>(null),
    street:     useRef<HTMLInputElement>(null),
    postalCode: useRef<HTMLInputElement>(null),
    city:       useRef<HTMLInputElement>(null),
    country:    useRef<HTMLSelectElement>(null),
    state:      useRef<HTMLSelectElement>(null),
    email:      useRef<HTMLInputElement>(null),
  };

  const update = (field: keyof FormState, value: string) => {
    setForm(prev => {
      const next = {...prev, [field]: value};
      if (field === 'country' && value !== 'au') next.state = '';
      return next;
    });
    if (errors[field]) setErrors(prev => ({...prev, [field]: undefined}));
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.firstName.trim())  errs.firstName  = t('errorFirstNameRequired');
    if (!form.lastName.trim())   errs.lastName   = t('errorLastNameRequired');
    if (!form.company.trim())    errs.company    = t('errorCompanyRequired');
    if (!form.street.trim())     errs.street     = t('errorStreetRequired');
    if (!form.postalCode.trim()) errs.postalCode = t('errorPostalCodeRequired');
    if (!form.city.trim())       errs.city       = t('errorCityRequired');
    if (!form.country)           errs.country    = t('errorCountryRequired');
    if (form.country === 'au' && !form.state) errs.state = t('errorStateRequired');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = t('errorEmailInvalid');
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
      const payload = {
        _subject: `[Licence Enquiry] ${form.firstName} ${form.lastName} — ${form.company}`,
        firstName: form.firstName,
        lastName: form.lastName,
        company: form.company,
        street: form.street,
        postalCode: form.postalCode,
        city: form.city,
        country: form.country ? t(`country_${form.country}` as 'country_ch') : '',
        state: form.state,
        email: form.email,
        message: form.message,
      };

      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm(initialForm);
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
    borderRadius: '6px',
    padding: '0.85rem 1rem',
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.95rem',
    color: '#fff',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  };

  const errorStyle = {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.78rem',
    color: '#fc8181',
    marginTop: '0.3rem',
    display: 'block',
  };

  const fieldBorder = (field: keyof FormState) =>
    errors[field] ? 'rgba(252,129,129,0.6)' : 'rgba(255,255,255,0.1)';

  type RefField = keyof typeof refs;
  type InputRefField = Exclude<RefField, 'country' | 'state'>;
  const renderInput = (
    field: InputRefField,
    type: string = 'text',
    autoComplete?: string,
    inputMode?: 'text' | 'email' | 'tel' | 'url' | 'numeric',
  ) => (
    <div>
      <input
        type={type}
        name={field}
        ref={refs[field] as React.RefObject<HTMLInputElement>}
        aria-label={t(`${field}Label` as const)}
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
      {errors[field] && <span style={errorStyle}>{errors[field]}</span>}
    </div>
  );

  return (
    <section id="contact" className="section-pad" style={{
      background: 'var(--ink-mid)',
      padding: '6rem 1.5rem',
    }}>
      <div style={{maxWidth: '720px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#ffffff',
            margin: '0 0 0.75rem',
          }}>
            {t('title')}
          </h2>
          <div className="gradient-line" style={{width: '60px', margin: '0 auto 1rem'}}/>
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '1rem',
            color: '#8fa8c8',
            maxWidth: '520px',
            margin: '0 auto',
          }}>
            {t('subtitle')}
          </p>
        </div>

        {!submitted && (
          <div style={{
            background: 'rgba(37,99,235,0.08)',
            border: '1px solid rgba(37,99,235,0.3)',
            borderRadius: '10px',
            padding: '1.1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            gap: '0.85rem',
            alignItems: 'flex-start',
          }}>
            <div aria-hidden style={{
              width: '32px', height: '32px',
              flexShrink: 0,
              borderRadius: '50%',
              background: 'rgba(37,99,235,0.18)',
              color: '#60a5fa',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800,
              fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: '2px',
            }}>i</div>
            <div>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: '0.02em',
                color: '#ffffff',
                marginBottom: '0.3rem',
                textTransform: 'uppercase',
              }}>
                {t('platformNoticeTitle')}
              </div>
              <p style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.92rem',
                lineHeight: 1.55,
                color: '#cbd5e1',
                margin: 0,
              }}>
                {t('platformNoticeBody')}
              </p>
            </div>
          </div>
        )}

        {submitted ? (
          <div
            className="fade-up"
            aria-live="polite"
            role="status"
            style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              background: 'rgba(22,163,74,0.1)',
              border: '1px solid rgba(22,163,74,0.3)',
              borderRadius: '10px',
            }}
          >
            <div style={{fontSize: '2.5rem', marginBottom: '1rem', color: '#22c55e'}}>✓</div>
            <p style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#4ade80',
              letterSpacing: '0.04em',
              margin: 0,
            }}>
              {t('success')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fade-up" noValidate>
            {/* First / Last name */}
            <div className="contact-grid" style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}>
              {renderInput('firstName', 'text', 'given-name')}
              {renderInput('lastName',  'text', 'family-name')}
            </div>

            {/* Company */}
            <div style={{marginBottom: '1rem'}}>
              {renderInput('company', 'text', 'organization')}
            </div>

            {/* Street */}
            <div style={{marginBottom: '1rem'}}>
              {renderInput('street', 'text', 'street-address')}
            </div>

            {/* Postal code / City */}
            <div className="contact-grid" style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}>
              {renderInput('postalCode', 'text', 'postal-code')}
              {renderInput('city', 'text', 'address-level2')}
            </div>

            {/* Country */}
            <div style={{marginBottom: '1rem'}}>
              <select
                name="country"
                ref={refs.country}
                aria-label={t('countryLabel')}
                autoComplete="country"
                value={form.country}
                onChange={e => update('country', e.target.value)}
                className="contact-input"
                style={{
                  ...inputStyle,
                  borderColor: fieldBorder('country'),
                  appearance: 'none',
                  backgroundImage:
                    'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'><path fill=\'%2394a3b8\' d=\'M6 8L0 0h12z\'/></svg>")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                  color: form.country ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                }}
                onFocus={e => { if (!errors.country) e.target.style.borderColor = 'var(--red)'; }}
                onBlur={e => { if (!errors.country) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <option value="" disabled>{t('countryPlaceholder')}</option>
                {COUNTRY_CODES
                  .map(code => ({code, name: t(`country_${code}` as 'country_ch')}))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(({code, name}) => (
                    <option key={code} value={code} style={{color: '#000'}}>{name}</option>
                  ))}
              </select>
              {errors.country && <span style={errorStyle}>{errors.country}</span>}
            </div>

            {/* State (Australia only) */}
            {form.country === 'au' && (
              <div style={{marginBottom: '1rem'}}>
                <select
                  name="state"
                  ref={refs.state}
                  aria-label={t('stateLabel')}
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={e => update('state', e.target.value)}
                  className="contact-input"
                  style={{
                    ...inputStyle,
                    borderColor: fieldBorder('state'),
                    appearance: 'none',
                    backgroundImage:
                      'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'><path fill=\'%2394a3b8\' d=\'M6 8L0 0h12z\'/></svg>")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem',
                    color: form.state ? '#fff' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                  }}
                  onFocus={e => { if (!errors.state) e.target.style.borderColor = 'var(--red)'; }}
                  onBlur={e => { if (!errors.state) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <option value="" disabled>{t('statePlaceholder')}</option>
                  {AU_STATES.map(({code, name}) => (
                    <option key={code} value={code} style={{color: '#000'}}>{name} ({code})</option>
                  ))}
                </select>
                {errors.state && <span style={errorStyle}>{errors.state}</span>}
              </div>
            )}

            {/* Email */}
            <div style={{marginBottom: '1rem'}}>
              {renderInput('email', 'email', 'email', 'email')}
            </div>

            {/* Message (optional) */}
            <div style={{marginBottom: '1rem'}}>
              <textarea
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
                  minHeight: '100px',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--red)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {sendError && (
              <p style={{
                fontFamily: 'Barlow, sans-serif',
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
              className="btn-red"
              style={{
                width: '100%',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'var(--red)',
                border: 'none',
                borderRadius: '6px',
                padding: '1rem',
                cursor: submitting ? 'wait' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                transition: 'background 0.2s, transform 0.15s, opacity 0.2s',
                boxShadow: '0 4px 20px rgba(232,0,29,0.25)',
              }}
            >
              {submitting ? t('submitting') : `${t('submit')} →`}
            </button>
          </form>
        )}

        {/* Direct email */}
        <p style={{
          textAlign: 'center',
          fontFamily: 'Barlow, sans-serif',
          fontSize: '0.85rem',
          color: '#64748b',
          marginTop: '1.5rem',
        }}>
          <ObfuscatedEmail
            user={t('emailUser')}
            domain={t('emailDomain')}
            style={{color: 'var(--steel)', textDecoration: 'none'}}
          />
        </p>
      </div>
    </section>
  );
}
