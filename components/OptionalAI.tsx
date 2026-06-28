'use client';

import type {CSSProperties} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';
import OptionalAiBadge from './OptionalAiBadge';

type Provider = {name: string; region: string; recommended?: boolean};
type Pillar = {heading: string; desc: string};

/* Region tag colours — CH green, EU blue, USA/US amber */
const REGION_COLORS: Record<string, {bg: string; border: string; color: string}> = {
  CH: {bg: 'rgba(22,163,74,0.16)', border: 'rgba(22,163,74,0.5)', color: '#4ade80'},
  EU: {bg: 'rgba(37,99,235,0.16)', border: 'rgba(37,99,235,0.5)', color: '#93c5fd'},
  USA: {bg: 'rgba(234,88,12,0.16)', border: 'rgba(234,88,12,0.5)', color: '#fb923c'},
  US: {bg: 'rgba(234,88,12,0.16)', border: 'rgba(234,88,12,0.5)', color: '#fb923c'},
};
const REGION_FALLBACK = {bg: 'rgba(148,163,184,0.16)', border: 'rgba(148,163,184,0.5)', color: '#cbd5e1'};

const pillarIcons = [
  /* redaction — document with a blacked-out personal-data line */
  <svg key="redact" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="6" y="3" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="9" y="8.5" width="10" height="3.6" rx="0.6" fill="currentColor" />
    <path d="M10 16h8M10 19.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>,
  /* key — bring-your-own-key, direct to provider */
  <svg key="key" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12.6 12.6L23 23M19.5 19.5l2.2-2.2M21.7 21.7L24 19.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  /* shield-check — compliance (matches CoreFeatures) */
  <svg key="shield" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 3L5 7v8c0 5.25 3.8 10.15 9 11.35C19.2 25.15 23 20.25 23 15V7L14 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 14l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

const PILLAR_ICON_TILE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '52px',
  height: '52px',
  borderRadius: '13px',
  color: '#93c5fd',
  background: 'rgba(37,99,235,0.12)',
  border: '1px solid rgba(37,99,235,0.28)',
  marginBottom: '1.25rem',
  flexShrink: 0,
};

export default function OptionalAI() {
  const t = useTranslations('optionalAi');
  const locale = useLocale();
  const providers = t.raw('providers') as Provider[];
  const pillars = t.raw('pillars') as Pillar[];

  return (
    <section
      id="ai"
      className="section-pad"
      style={{
        background: 'var(--ink)',
        padding: '6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blue glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(37,99,235,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Faint grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <div className="fade-up-1" style={{marginBottom: '1.25rem'}}>
            <OptionalAiBadge />
          </div>
          <h2 className="fade-up-2" style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#ffffff',
            margin: '0 0 1rem',
            letterSpacing: '-0.01em',
          }}>
            {t('title')}
          </h2>
          <p className="fade-up-3" style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            lineHeight: 1.65,
            color: '#8fa8c8',
            maxWidth: '760px',
            margin: '0 auto',
          }}>
            {t('subtitle')}
          </p>
          <p className="fade-up-3" style={{
            display: 'inline-block',
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: '#bcd0ea',
            background: 'rgba(37,99,235,0.08)',
            border: '1px solid rgba(37,99,235,0.22)',
            borderRadius: '10px',
            padding: '0.7rem 1.1rem',
            margin: '1.5rem auto 0',
            maxWidth: '720px',
          }}>
            {t('vinNote')}
          </p>
        </div>

        {/* Provider strip */}
        <div className="fade-up-2" style={{textAlign: 'center', marginBottom: '3.5rem'}}>
          <h3 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--steel)',
            margin: '0 0 1.25rem',
          }}>
            {t('providersLabel')}
          </h3>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}>
            {providers.map((p) => {
              const rc = REGION_COLORS[p.region] ?? REGION_FALLBACK;
              return (
                <div key={p.name} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '9px',
                  padding: '0.55rem 0.85rem',
                }}>
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#ffffff',
                    letterSpacing: '0.01em',
                  }}>
                    {p.name}
                  </span>
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '3px',
                    background: rc.bg,
                    border: `1px solid ${rc.border}`,
                    color: rc.color,
                  }}>
                    {p.region}
                  </span>
                  {p.recommended && (
                    <span style={{
                      fontFamily: 'Barlow, sans-serif',
                      fontSize: '0.72rem',
                      fontStyle: 'italic',
                      color: '#4ade80',
                    }}>
                      {t('recommendedLabel')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            color: '#64748b',
            maxWidth: '640px',
            margin: '0 auto',
          }}>
            {t('providersNote')}
          </p>
        </div>

        {/* Three value pillars */}
        <div className="ai-grid" style={{display: 'grid', gap: '1.25rem'}}>
          {pillars.map((pillar, i) => (
            <div
              key={pillar.heading}
              className={`fade-up-${Math.min(i + 2, 6)}`}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={PILLAR_ICON_TILE}>{pillarIcons[i]}</span>
              <h3 style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.2rem, 1.6vw, 1.4rem)',
                letterSpacing: '-0.015em',
                lineHeight: 1.15,
                color: '#ffffff',
                margin: 0,
              }}>
                {pillar.heading}
              </h3>
              <p style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.95rem',
                color: '#8fa8c8',
                lineHeight: 1.7,
                margin: '0.75rem 0 0',
              }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Honest framing line */}
        <p style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: '0.85rem',
          lineHeight: 1.7,
          color: '#64748b',
          textAlign: 'center',
          maxWidth: '760px',
          margin: '2.5rem auto 0',
        }}>
          {t('framing')}
        </p>

        {/* Learn-more link */}
        <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
          <Link
            href={`/${locale}/privacy/#ai-privacy`}
            className="ai-learn-more"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.04em',
              color: 'var(--red)',
              textDecoration: 'none',
            }}
          >
            {t('learnMore')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
