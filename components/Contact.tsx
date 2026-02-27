'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';

type FormErrors = {name?: string; email?: string; message?: string};

export default function Contact() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({name: '', email: '', message: ''});
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Name benötigt (min. 2 Zeichen)';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Gültige E-Mail-Adresse benötigt';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      errs.message = 'Nachricht benötigt (min. 10 Zeichen)';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // TODO: wire to Resend / Formspree for actual delivery
    setSubmitted(true);
    setForm({name: '', email: '', message: ''});
    setErrors({});
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
    outline: 'none',        /* suppressed — .contact-input:focus-visible provides ring */
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

  return (
    <section id="contact" className="section-pad" style={{
      background: 'var(--ink-mid)',
      padding: '6rem 1.5rem',
    }}>
      <div style={{maxWidth: '640px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
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
          }}>
            {t('subtitle')}
          </p>
        </div>

        {submitted ? (
          <div
            className="fade-up"
            style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              background: 'rgba(22,163,74,0.1)',
              border: '1px solid rgba(22,163,74,0.3)',
              borderRadius: '10px',
            }}
          >
            <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>✓</div>
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
            {/* Name + Email row */}
            <div
              className="contact-grid"
              style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}
            >
              <div>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder={t('namePlaceholder')}
                  value={form.name}
                  onChange={e => {
                    setForm({...form, name: e.target.value});
                    if (errors.name) setErrors({...errors, name: undefined});
                  }}
                  className="contact-input"
                  style={{
                    ...inputStyle,
                    borderColor: errors.name ? 'rgba(252,129,129,0.6)' : 'rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => { if (!errors.name) e.target.style.borderColor = 'var(--red)'; }}
                  onBlur={e => { if (!errors.name) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                {errors.name && <span style={errorStyle}>{errors.name}</span>}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={t('emailPlaceholder')}
                  value={form.email}
                  onChange={e => {
                    setForm({...form, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: undefined});
                  }}
                  className="contact-input"
                  style={{
                    ...inputStyle,
                    borderColor: errors.email ? 'rgba(252,129,129,0.6)' : 'rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => { if (!errors.email) e.target.style.borderColor = 'var(--red)'; }}
                  onBlur={e => { if (!errors.email) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                {errors.email && <span style={errorStyle}>{errors.email}</span>}
              </div>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <textarea
                rows={5}
                name="message"
                autoComplete="off"
                placeholder={t('messagePlaceholder')}
                value={form.message}
                onChange={e => {
                  setForm({...form, message: e.target.value});
                  if (errors.message) setErrors({...errors, message: undefined});
                }}
                className="contact-input"
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '120px',
                  borderColor: errors.message ? 'rgba(252,129,129,0.6)' : 'rgba(255,255,255,0.1)',
                }}
                onFocus={e => { if (!errors.message) e.target.style.borderColor = 'var(--red)'; }}
                onBlur={e => { if (!errors.message) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
              {errors.message && <span style={errorStyle}>{errors.message}</span>}
            </div>

            <button
              type="submit"
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
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.15s',
                boxShadow: '0 4px 20px rgba(232,0,29,0.25)',
              }}
            >
              {t('submit')} →
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
          <a
            href={`mailto:${t('email')}`}
            style={{color: 'var(--steel)', textDecoration: 'none'}}
          >
            {t('email')}
          </a>
        </p>
      </div>
    </section>
  );
}
