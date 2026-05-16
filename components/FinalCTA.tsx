'use client';

import {useTranslations} from 'next-intl';

export default function FinalCTA() {
  const t = useTranslations('finalCta');

  return (
    <section style={{
      background: 'var(--ink)',
      padding: '4rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Red accent glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 40% 50% at 50% 60%, rgba(232,0,29,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Headline */}
        <h2 className="fade-up" style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#ffffff',
          margin: '0 0 1rem',
          letterSpacing: '-0.01em',
        }}>
          {t('title')}
        </h2>

        {/* Subtitle */}
        <p className="fade-up-1" style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: '1.05rem',
          color: '#8fa8c8',
          lineHeight: 1.6,
          margin: '0 0 2.5rem',
        }}>
          {t('subtitle')}
        </p>

        {/* Big CTA */}
        <a
          href="#download"
          className="btn-red fade-up-2 finalcta-btn"
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 800,
            fontSize: '1.15rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'var(--red)',
            textDecoration: 'none',
            padding: '1rem 3rem',
            borderRadius: '6px',
            display: 'inline-block',
            transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
            boxShadow: '0 4px 24px rgba(232,0,29,0.35)',
          }}
        >
          {t('cta')} →
        </a>
      </div>
    </section>
  );
}
