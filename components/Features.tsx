'use client';

import {useTranslations} from 'next-intl';

const icons = [
  /* hail */
  <svg key="hail" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 4L7 14h5l-2 10 12-14h-6l3-6H14z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
  </svg>,
  /* parking */
  <svg key="park" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="4" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M10 20V9h5a4 4 0 010 8h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>,
  /* doc */
  <svg key="doc" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="6" y="3" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M10 9h8M10 13h8M10 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>,
  /* status/workflow */
  <svg key="status" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="7" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M12 9h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="7" cy="16" r="2.5" fill="currentColor"/>
    <path d="M12 16h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="7" cy="23" r="2.5" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 1.5"/>
    <path d="M12 23h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>,
  /* photo */
  <svg key="photo" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="7" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="14" cy="15" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M10 7l2-3h4l2 3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>,
  /* browser */
  <svg key="browser" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="5" width="22" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3 11h22" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="7" cy="8" r="1.2" fill="currentColor"/>
    <circle cx="11" cy="8" r="1.2" fill="currentColor"/>
    <circle cx="15" cy="8" r="1.2" fill="currentColor"/>
  </svg>,
  /* clock */
  <svg key="clock" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M14 9v5.5l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* shield */
  <svg key="shield" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 3L5 7v8c0 5.25 3.8 10.15 9 11.35C19.2 25.15 23 20.25 23 15V7L14 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M10 14l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
];

const accentColors = ['var(--red)', 'var(--orange)', 'var(--blue)', 'var(--green)', 'var(--blue)', 'var(--steel)', 'var(--green)', 'var(--blue)'];

export default function Features() {
  const t = useTranslations('features');
  const items = t.raw('items') as Array<{title: string; desc: string}>;

  return (
    <section id="features" className="section-pad" style={{
      background: 'var(--fog)',
      padding: '6rem 1.5rem',
    }}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '3.5rem'}}>
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--ink)',
            margin: '0 0 0.75rem',
            letterSpacing: '-0.01em',
          }}>
            {t('title')}
          </h2>
          <div className="gradient-line" style={{width: '60px', margin: '0 auto 1rem'}}/>
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '1.05rem',
            color: '#475569',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Cards grid — breakpoints handled in globals.css */}
        <div
          className="features-grid"
          style={{
            display: 'grid',
            gap: '1.25rem',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className={`feature-card fade-up-${Math.min(i + 1, 6)}`}
              style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '1.75rem',
                border: '1px solid #e2e8f0',
                borderLeft: `3px solid ${accentColors[i]}`,
                cursor: 'default',
              }}
            >
              <div style={{
                color: accentColors[i],
                marginBottom: '1rem',
              }}>
                {icons[i]}
              </div>
              <h3 style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '0.02em',
                color: 'var(--ink)',
                margin: '0 0 0.5rem',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.92rem',
                color: '#64748b',
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: 'pre-line',
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
