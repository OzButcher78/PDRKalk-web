'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '#';
const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#pricing';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="hero"
      style={{
        background: 'var(--ink)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
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

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        width: '100%',
      }}
        className="hero-grid"
      >
        {/* Left — Text */}
        <div>
          {/* Badge */}
          <div className="fade-up" style={{marginBottom: '1.5rem'}}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(232,0,29,0.12)',
              border: '1px solid rgba(232,0,29,0.35)',
              borderRadius: '3px',
              padding: '0.3rem 0.75rem',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#ff4455',
            }}>
              {/* Swiss cross mini */}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <rect x="4" y="0" width="2" height="10" rx="0.3"/>
                <rect x="0" y="4" width="10" height="2" rx="0.3"/>
              </svg>
              {t('badge')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up-1" style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 0.95,
            color: '#ffffff',
            margin: '0 0 0.5rem',
            letterSpacing: '-0.01em',
          }}>
            {t('title')}
          </h1>
          <h1 className="fade-up-2" style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 0.95,
            color: 'var(--red)',
            margin: '0 0 2rem',
            letterSpacing: '-0.01em',
          }}>
            {t('titleAccent')}
          </h1>

          {/* Subtitle */}
          <p className="fade-up-3" style={{
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
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
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(232,0,29,0.35)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--red-hover, #c40019)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(232,0,29,0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--red)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(232,0,29,0.35)';
              }}
            >
              {t('ctaPrimary')}
            </a>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'transparent',
                textDecoration: 'none',
                padding: '0.85rem 2rem',
                borderRadius: '5px',
                border: '2px solid rgba(255,255,255,0.2)',
                display: 'inline-block',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {t('ctaSecondary')} →
            </a>
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
          justifyContent: 'center',
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
              style={{width: '100%', height: 'auto', display: 'block'}}
              priority
            />
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

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-screenshot {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}
