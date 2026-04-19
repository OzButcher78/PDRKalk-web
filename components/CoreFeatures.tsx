'use client';

import {useTranslations} from 'next-intl';

type FeatureCard = { heading: string; desc: string };

const featureIcons = [
  /* hail / lightning — calculation */
  <svg key="calc" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 4L7 14h5l-2 10 12-14h-6l3-6H14z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
  </svg>,
  /* doc — documents */
  <svg key="doc" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="6" y="3" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M10 9h8M10 13h8M10 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>,
  /* envelope — email */
  <svg key="email" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="3" y="6" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3 8l11 7 11-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* address book — customers */
  <svg key="contacts" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="5" y="3" width="18" height="22" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="14" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8.5 21c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>,
  /* bar chart — analytics */
  <svg key="analytics" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M4 24h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="6" y="14" width="3.5" height="8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <rect x="12.25" y="9" width="3.5" height="13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <rect x="18.5" y="5" width="3.5" height="17" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>,
  /* shield — offline / privacy */
  <svg key="offline" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 3L5 7v8c0 5.25 3.8 10.15 9 11.35C19.2 25.15 23 20.25 23 15V7L14 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M10 14l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
];

const featureAccents = [
  'var(--red)',
  'var(--blue)',
  'var(--orange)',
  'var(--green)',
  'var(--blue)',
  'var(--steel)',
];

export default function CoreFeatures() {
  const t = useTranslations('coreFeatures');
  const cards = t.raw('cards') as FeatureCard[];

  return (
    <section id="features" style={{
      background: '#ffffff',
      padding: '4rem 1.5rem',
    }}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
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
          <div className="gradient-line" style={{width: '60px', margin: '0 auto'}}/>
        </div>

        {/* 6-card grid */}
        <div className="features-grid" style={{display: 'grid', gap: '1.25rem'}}>
          {cards.map((card, i) => (
            <div
              key={i}
              className={`feature-card fade-up-${Math.min(i + 1, 6)}`}
              style={{
                background: 'linear-gradient(135deg, var(--red), var(--blue))',
                borderRadius: '9px',
                padding: '1px',
                cursor: 'default',
              }}
            >
              <div style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '1.75rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}>
                {/* Icon */}
                <div style={{color: featureAccents[i], marginBottom: '1rem'}}>
                  {featureIcons[i]}
                </div>

                {/* Heading */}
                <h3 style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '0.02em',
                  color: 'var(--ink)',
                  margin: '0 0 0.6rem',
                }}>
                  {card.heading}
                </h3>

                {/* Description — 1-2 sentences, no bullets */}
                <p style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.9rem',
                  color: '#64748b',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
