'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  const links = [
    {key: 'features' as const, href: '#features'},
    {key: 'pricing'  as const, href: '#pricing'},
    {key: 'contact'  as const, href: '#contact'},
  ];

  return (
    <footer style={{
      background: 'var(--ink)',
      borderTop: '1px solid rgba(232,0,29,0.2)',
      padding: '3rem 1.5rem',
    }}>
      <div
        className="footer-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        {/* Brand */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <Image
            src="/PDRKalk-logot2.png"
            alt="PDR Kalk Logo"
            width={148}
            height={40}
            style={{objectFit: 'contain'}}
          />
          <div style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.7rem',
            color: 'var(--steel)',
            letterSpacing: '0.06em',
          }}>
            {t('company')} — {t('tagline')}
          </div>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation" style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {links.map(({key, href}) => (
            <a
              key={key}
              href={href}
              className="footer-link"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--steel)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                padding: '0.25rem 0',
              }}
            >
              {nav(key)}
            </a>
          ))}
        </nav>

        {/* Copyright + international note */}
        <div className="footer-copyright" style={{textAlign: 'right'}}>
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
