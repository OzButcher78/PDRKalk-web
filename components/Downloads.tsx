'use client';

import {useTranslations} from 'next-intl';

export default function Downloads() {
  const t = useTranslations('downloads');

  return (
    <section style={{
      background: 'var(--fog)',
      padding: '3.5rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          color: 'var(--ink)',
          margin: '0 0 0.5rem',
        }}>
          {t('title')}
        </h2>

        <p style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: '0.92rem',
          color: '#64748b',
          lineHeight: 1.6,
          margin: '0 0 1.5rem',
        }}>
          {t('subtitle')}
        </p>

        <a
          href={t('file')}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: '#fff',
            background: 'var(--ink)',
            textDecoration: 'none',
            padding: '0.85rem 2rem',
            borderRadius: '6px',
            transition: 'background 0.2s, transform 0.15s',
          }}
        >
          {/* PDF icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M12 18v-6M9 15l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('cta')}
        </a>

        <div style={{
          marginTop: '0.75rem',
          fontFamily: 'Barlow, sans-serif',
          fontSize: '0.78rem',
          color: '#94a3b8',
        }}>
          {t('version')} &middot; {t('pages')} &middot; PDF
        </div>
      </div>
    </section>
  );
}
