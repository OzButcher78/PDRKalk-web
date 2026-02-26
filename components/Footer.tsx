'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer style={{
      background: 'var(--ink)',
      borderTop: '1px solid rgba(232,0,29,0.2)',
      padding: '3rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem',
      }}>
        {/* Brand */}
        <div style={{display: 'flex', alignItems: 'center', gap: '0.85rem'}}>
          <Image
            src="/logo.png"
            alt="PDR Kalk Logo"
            width={72}
            height={48}
            style={{objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))'}}
          />
          <div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#fff',
              letterSpacing: '0.04em',
              lineHeight: 1.2,
            }}>
              PDR Kalk
            </div>
            <div style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '0.72rem',
              color: 'var(--steel)',
              letterSpacing: '0.06em',
              lineHeight: 1.2,
            }}>
              {t('company')}
            </div>
            <div style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '0.68rem',
              color: '#475569',
              letterSpacing: '0.04em',
            }}>
              {t('tagline')}
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}>
          {(['features', 'pricing', 'contact'] as const).map(key => (
            <a
              key={key}
              href={`#${key === 'features' ? 'features' : key === 'pricing' ? 'pricing' : 'contact'}`}
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--steel)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--steel)')}
            >
              {nav(key)}
            </a>
          ))}
        </nav>

        {/* Copyright + international note */}
        <div style={{textAlign: 'right'}}>
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.78rem',
            color: '#475569',
            margin: '0 0 0.25rem',
          }}>
            {t('copyright')}
          </p>
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.72rem',
            color: '#374151',
            margin: 0,
            fontStyle: 'italic',
          }}>
            🌍 {t('intl')}
          </p>
        </div>
      </div>
    </footer>
  );
}
