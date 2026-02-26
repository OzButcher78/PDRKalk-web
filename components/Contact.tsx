'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';

export default function Contact() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({name: '', email: '', message: ''});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mailto fallback — wire to Resend/Formspree post-launch
    const subject = encodeURIComponent(`BSS PDR Kalk — Anfrage von ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${t('email')}?subject=${subject}&body=${body}`;
    setSubmitted(true);
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
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  };

  return (
    <section id="contact" style={{
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
            }}>
              {t('success')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fade-up">
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}
              className="contact-grid"
            >
              <div>
                <input
                  type="text"
                  required
                  placeholder={t('namePlaceholder')}
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--red)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder={t('emailPlaceholder')}
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--red)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <textarea
              required
              rows={5}
              placeholder={t('messagePlaceholder')}
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              style={{
                ...inputStyle,
                resize: 'vertical',
                marginBottom: '1rem',
                minHeight: '120px',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--red)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />

            <button
              type="submit"
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
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(232,0,29,0.25)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#c40019';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--red)';
                e.currentTarget.style.transform = 'translateY(0)';
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

      <style>{`
        @media (max-width: 520px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
