'use client';

import {useTranslations} from 'next-intl';

const WINDOWS_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL ||
  'https://github.com/OzButcher78/pdrkalk/releases/download/v4.26.4/PDR-Kalk-Setup-4.26.4.exe';
const ANDROID_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL ||
  'https://github.com/OzButcher78/pdrkalk/releases/download/android-v4.26.4/pdrkalk-android-4.26.4.apk';

type Platform = {
  key: 'windows' | 'android';
  href: string;
};

const PLATFORMS: Platform[] = [
  {key: 'windows', href: WINDOWS_DOWNLOAD_URL},
  {key: 'android', href: ANDROID_DOWNLOAD_URL},
];

export default function Download() {
  const t = useTranslations('download');

  return (
    <section
      id="download"
      className="section-pad download-section"
      style={{
        background: 'var(--ink)',
        padding: '6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(37,99,235,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h2 className="fade-up" style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#ffffff',
            margin: '0 0 0.75rem',
            letterSpacing: '-0.01em',
          }}>
            {t('title')}
          </h2>
          <div className="gradient-line" style={{width: '60px', margin: '0 auto 1rem'}}/>
          <p className="fade-up-1" style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '1.05rem',
            color: '#8fa8c8',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {t('subtitle')}
          </p>
        </div>

        <div
          className="download-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {PLATFORMS.map(({key, href}, idx) => (
            <div
              key={key}
              className={`fade-up-${idx + 2}`}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: 'clamp(1.5rem, 4vw, 2.25rem)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--red)',
                marginBottom: '0.6rem',
              }}>
                {t(`${key}.eyebrow`)}
              </div>
              <h3 style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(1.5rem, 3vw, 1.9rem)',
                color: '#ffffff',
                margin: '0 0 0.5rem',
                letterSpacing: '-0.01em',
              }}>
                {t(`${key}.name`)}
              </h3>
              <p style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.92rem',
                color: '#8fa8c8',
                margin: '0 0 0.4rem',
                lineHeight: 1.5,
              }}>
                {t(`${key}.system`)}
              </p>
              <p style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.8rem',
                color: '#64748b',
                margin: '0 0 1.75rem',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {t(`${key}.version`)}
              </p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="btn-red download-btn"
                style={{
                  display: 'inline-block',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 800,
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: 'var(--red)',
                  textDecoration: 'none',
                  padding: '0.95rem 1.75rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                  boxShadow: '0 4px 20px rgba(232,0,29,0.35)',
                }}
              >
                {t(`${key}.button`)} ↓
              </a>
            </div>
          ))}
        </div>

        <p style={{
          textAlign: 'center',
          fontFamily: 'Barlow, sans-serif',
          fontSize: '0.85rem',
          color: '#64748b',
          fontStyle: 'italic',
          margin: '1rem 0 0',
        }}>
          {t('footnote')}
        </p>
      </div>
    </section>
  );
}
