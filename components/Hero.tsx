'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://web.pdrkalk.com';
const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#pricing';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="hero"
      className="section-pad hero-section"
      style={{
        background: 'var(--ink)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '3rem',
        paddingBottom: '5rem',
      }}
    >
      {/* Background geometric detail */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(37,99,235,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* Grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }}/>

      {/* Red vertical accent stripe */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '-10%',
        width: '2px',
        height: '130%',
        background: 'linear-gradient(180deg, transparent, rgba(232,0,29,0.5), transparent)',
        transform: 'rotate(8deg) translateX(-50%)',
        pointerEvents: 'none',
      }}/>

      <div
        className="hero-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2.5rem',
          display: 'grid',
          gap: '3rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          width: '100%',
        }}
      >
        {/* Left — Text */}
        <div>
          {/* Headline */}
          <h1 className="fade-up-1" style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(1.9rem, 4vw, 3.4rem)',
            lineHeight: 0.95,
            color: '#ffffff',
            margin: '0 0 2rem',
            letterSpacing: '-0.01em',
            textWrap: 'balance',
          }}>
            {t('title')}
            <span className="fade-up-2" style={{
              display: 'block',
              color: 'var(--red)',
              marginTop: '0.5rem',
            }}>
              {t('titleAccent')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="fade-up-3" style={{
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
            lineHeight: 1.65,
            color: '#8fa8c8',
            maxWidth: '500px',
            marginBottom: '2.5rem',
          }}>
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="fade-up-4" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <a
              href={BUY_URL}
              className="btn-red"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'var(--red)',
                textDecoration: 'none',
                padding: '0.85rem 2rem',
                borderRadius: '5px',
                display: 'inline-block',
                transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                boxShadow: '0 4px 20px rgba(232,0,29,0.35)',
              }}
            >
              {t('ctaPrimary')}
            </a>
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(148,163,184,0.5)',
              padding: '0.85rem 2rem',
              borderRadius: '5px',
              border: '2px solid rgba(255,255,255,0.08)',
              display: 'inline-block',
              cursor: 'default',
            }}>
              {t('demoComingSoon')}
            </span>
          </div>

          {/* Trust indicators */}
          <div className="fade-up-5" style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '2.5rem',
            flexWrap: 'wrap',
          }}>
            {[t('trust1'), t('trust2'), t('trust3')].map(item => (
              <span key={item} style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.8rem',
                color: 'rgba(148,163,184,0.8)',
                letterSpacing: '0.03em',
              }}>
                {item}
              </span>
            ))}
          </div>

        </div>

        {/* Right — App screenshot */}
        <div className="fade-up-3 hero-screenshot" style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}>
          {/* Glow behind screenshot */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}/>

          {/* Browser chrome mockup */}
          <div style={{
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.08)',
            width: '100%',
            maxWidth: '580px',
            background: '#1e2d42',
          }}>
            {/* Browser bar */}
            <div style={{
              height: '36px',
              background: '#121929',
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
              gap: '0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{width: '10px', height: '10px', borderRadius: '50%', background: 'var(--red)', opacity: 0.8}}/>
              <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: 0.8}}/>
              <div style={{width: '10px', height: '10px', borderRadius: '50%', background: 'var(--green)', opacity: 0.8}}/>
              <div style={{
                flex: 1,
                height: '20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '3px',
                marginLeft: '0.5rem',
              }}/>
            </div>

            {/* Screenshot */}
            <Image
              src="/screenshots/dashboard.jpg"
              alt={t('screenshotAlt')}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{width: '100%', height: 'auto', display: 'block'}}
              priority
            />
          </div>

          {/* App language availability — below screenshot */}
          <div className="fade-up-6 lang-pill" style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '6px',
            padding: '0.55rem 1.5rem',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            justifyContent: 'center',
            maxWidth: '100%',
          }}>
            <span className="lang-label" style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              color: 'rgba(148,163,184,0.6)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginRight: '0.15rem',
            }}>
              {t('languageLabel')}
            </span>

            {/* DE flag */}
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.35rem'}}>
              <svg width="18" height="13" viewBox="0 0 18 13" aria-hidden="true" style={{flexShrink: 0, borderRadius: '2px', overflow: 'hidden'}}>
                <rect y="0" width="18" height="4.33" fill="#000"/>
                <rect y="4.33" width="18" height="4.34" fill="#DD0000"/>
                <rect y="8.67" width="18" height="4.33" fill="#FFCC00"/>
              </svg>
              <span className="lang-name" style={{fontFamily: 'Barlow, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)'}}>{t('languageDe')}</span>
            </span>

            <span className="lang-sep" style={{color: 'rgba(148,163,184,0.2)', fontSize: '0.9rem', fontWeight: 300}}>|</span>

            {/* FR flag */}
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.35rem'}}>
              <svg width="18" height="13" viewBox="0 0 18 13" aria-hidden="true" style={{flexShrink: 0, borderRadius: '2px', overflow: 'hidden'}}>
                <rect x="0" width="6" height="13" fill="#002395"/>
                <rect x="6" width="6" height="13" fill="#FFFFFF"/>
                <rect x="12" width="6" height="13" fill="#ED2939"/>
              </svg>
              <span className="lang-name" style={{fontFamily: 'Barlow, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)'}}>{t('languageFr')}</span>
            </span>

            <span className="lang-sep" style={{color: 'rgba(148,163,184,0.2)', fontSize: '0.9rem', fontWeight: 300}}>|</span>

            {/* IT flag */}
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.35rem'}}>
              <svg width="18" height="13" viewBox="0 0 18 13" aria-hidden="true" style={{flexShrink: 0, borderRadius: '2px', overflow: 'hidden'}}>
                <rect x="0" width="6" height="13" fill="#009246"/>
                <rect x="6" width="6" height="13" fill="#FFFFFF"/>
                <rect x="12" width="6" height="13" fill="#CE2B37"/>
              </svg>
              <span className="lang-name" style={{fontFamily: 'Barlow, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)'}}>{t('languageIt')}</span>
            </span>

            <span className="lang-sep" style={{color: 'rgba(148,163,184,0.2)', fontSize: '0.9rem', fontWeight: 300}}>|</span>

            {/* EN flag */}
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.35rem'}}>
              <svg width="18" height="13" viewBox="0 0 18 13" aria-hidden="true" style={{flexShrink: 0, borderRadius: '2px', overflow: 'hidden'}}>
                <rect width="18" height="13" fill="#012169"/>
                <path d="M0,0 L18,13 M18,0 L0,13" stroke="#FFFFFF" strokeWidth="2.2"/>
                <path d="M0,0 L18,13 M18,0 L0,13" stroke="#C8102E" strokeWidth="1.2"/>
                <path d="M9,0 V13 M0,6.5 H18" stroke="#FFFFFF" strokeWidth="3.6"/>
                <path d="M9,0 V13 M0,6.5 H18" stroke="#C8102E" strokeWidth="2.2"/>
              </svg>
              <span className="lang-name" style={{fontFamily: 'Barlow, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)'}}>{t('languageEn')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(transparent, rgba(10,15,30,0.3))',
        pointerEvents: 'none',
      }}/>
    </section>
  );
}
