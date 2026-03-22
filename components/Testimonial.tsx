'use client';

import {useTranslations} from 'next-intl';

export default function Testimonial() {
  const t = useTranslations('testimonial');

  return (
    <section style={{
      background: 'var(--ink)',
      padding: '4rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(232,0,29,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2}}>
        {/* Quote icon */}
        <div style={{
          fontSize: '3rem',
          color: 'var(--red)',
          lineHeight: 1,
          marginBottom: '1.5rem',
          fontFamily: 'Georgia, serif',
        }}>
          &ldquo;
        </div>

        {/* Quote / credibility statement */}
        <p style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
          color: '#ffffff',
          lineHeight: 1.5,
          margin: '0 0 1.5rem',
          fontStyle: 'italic',
        }}>
          {t('quote')}
        </p>

        <div className="gradient-line" style={{width: '40px', margin: '0 auto 1.5rem'}}/>

        {/* Placeholder notice */}
        <p style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: '0.85rem',
          color: 'var(--steel)',
        }}>
          {t('placeholder')}
        </p>
      </div>
    </section>
  );
}
