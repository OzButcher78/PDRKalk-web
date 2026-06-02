'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://web.pdrkalk.com';
const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#pricing';
const WINDOWS_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL ||
  'https://github.com/OzButcher78/pdrkalk/releases/download/v4.25.10/PDR-Kalk-Setup-4.25.10.exe';
const ANDROID_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL ||
  'https://github.com/OzButcher78/pdrkalk/releases/download/android-v4.25.8/pdrkalk-android-4.25.8.apk';
const YOUTUBE_VIDEO_ID = 'YnwMff4CjB4';

const REGION_FLAGS = ['ch', 'de', 'at'] as const;

const TRUST_ITEM_STYLE: React.CSSProperties = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontWeight: 700,
  fontSize: '0.82rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.85)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
};

const TRUST_DOT_STYLE: React.CSSProperties = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: 'var(--green)',
  flexShrink: 0,
};

export default function Hero() {
  const t = useTranslations('hero');
  const country = useTranslations('contact');
  const trustBar = t.raw('trustBar') as string[];

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
          {/* Headline — pain point focus */}
          <h1 className="fade-up-1" style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(1.9rem, 4vw, 3.4rem)',
            lineHeight: 1.05,
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

          {/* CTAs — two real buttons */}
          <div className="fade-up-4" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <a
              href="#download"
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
            <a
              href="#features"
              className="btn-ghost"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                padding: '0.85rem 2rem',
                borderRadius: '5px',
                border: '2px solid rgba(255,255,255,0.15)',
                display: 'inline-block',
                textDecoration: 'none',
                transition: 'border-color 0.2s, transform 0.15s, color 0.2s',
              }}
            >
              {t('ctaSecondary')}
            </a>
          </div>

          {/* Trust bar */}
          <div className="fade-up-5" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            marginTop: '2.5rem',
          }}>
            {trustBar.map((item, i) => (
              <span key={i} style={TRUST_ITEM_STYLE}>
                <span className="trust-dot" style={TRUST_DOT_STYLE}/>
                {item}
              </span>
            ))}

            <span className="regions-row" style={TRUST_ITEM_STYLE}>
              <span className="trust-dot" style={TRUST_DOT_STYLE}/>
              {t('regionsLabel')}
              <span style={{display: 'inline-flex', gap: '0.3rem', alignItems: 'center', flexShrink: 0}}>
                {REGION_FLAGS.map((code) => {
                  const label = country(`country_${code}` as 'country_ch' | 'country_de' | 'country_at');
                  return (
                    <Image
                      key={code}
                      src={`/${code}.jpg`}
                      alt={label}
                      title={label}
                      width={209}
                      height={125}
                      style={{
                        height: '14px',
                        width: 'auto',
                        borderRadius: '2px',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.18)',
                        display: 'inline-block',
                      }}
                    />
                  );
                })}
              </span>
              <span className="regions-more" style={{
                textTransform: 'none',
                letterSpacing: 0,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.55)',
                fontStyle: 'italic',
              }}>
                {t('regionsMore')}
              </span>
            </span>
          </div>
        </div>

        {/* Right — App screenshot */}
        <div className="fade-up-3 hero-screenshot" style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Glow behind screenshot */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}/>

          {/* YouTube product video */}
          <div style={{
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.08)',
            width: '100%',
            maxWidth: '580px',
            background: '#000',
            aspectRatio: '16 / 9',
          }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
              title={t('videoTitle')}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 0,
                display: 'block',
              }}
            />
          </div>

          {/* Price callout */}
          <div className="fade-up-4" style={{
            position: 'relative',
            marginTop: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 3.4vw, 2.7rem)',
              color: '#34d399',
              letterSpacing: '0.02em',
              textShadow: '0 0 10px rgba(52,211,153,0.55), 0 0 22px rgba(52,211,153,0.35)',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {t('priceCallout.amount')}
            </div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.1rem, 1.9vw, 1.45rem)',
              color: '#34d399',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textShadow: '0 0 8px rgba(52,211,153,0.45)',
              marginTop: '0.4rem',
              lineHeight: 1.05,
            }}>
              {t('priceCallout.suffix')}
            </div>
            <div style={{
              fontFamily: 'Barlow, sans-serif',
              fontWeight: 500,
              fontSize: '0.88rem',
              color: 'rgba(255,255,255,0.55)',
              marginTop: '1.1rem',
              letterSpacing: '0.02em',
              lineHeight: 1.4,
            }}>
              <div>{t('priceCallout.amountEur')}</div>
              <div>{t('priceCallout.vatNote')}</div>
            </div>
          </div>

          {/* Platform availability badges */}
          <div className="fade-up-4" style={{
            position: 'relative',
            marginTop: '1.75rem',
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            width: '100%',
            maxWidth: '580px',
          }}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
              <a
                href={WINDOWS_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                download
                aria-label={`${t('downloadTrial')}: Microsoft`}
                style={{display: 'block', lineHeight: 0}}
              >
                <Image
                  src="/a-microsoft.png"
                  alt="Get it on Microsoft"
                  width={1033}
                  height={334}
                  style={{height: '56px', width: 'auto', display: 'block'}}
                />
              </a>
              <a
                href={WINDOWS_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="hero-dl-link"
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  textDecorationColor: 'rgba(255,255,255,0.35)',
                }}
              >
                {t('downloadTrial')}: Microsoft
              </a>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
              <a
                href={ANDROID_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                download
                aria-label={`${t('downloadTrial')}: Android`}
                style={{display: 'block', lineHeight: 0}}
              >
                <Image
                  src="/android.png"
                  alt="Get it on Android"
                  width={475}
                  height={162}
                  style={{height: '56px', width: 'auto', display: 'block'}}
                />
              </a>
              <a
                href={ANDROID_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="hero-dl-link"
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  textDecorationColor: 'rgba(255,255,255,0.35)',
                }}
              >
                {t('downloadTrial')}: Android
              </a>
            </div>
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
