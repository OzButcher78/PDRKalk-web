'use client';

import {useTranslations} from 'next-intl';

const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#contact';

export default function Pricing() {
  const t = useTranslations('pricing');
  const features = t.raw('features') as string[];
  const comparison = t.raw('comparison') as {
    title: string;
    competitorLabel: string;
    competitorItems: string[];
    ourLabel: string;
    ourItems: string[];
    conclusion: string;
  };

  return (
    <section id="pricing" className="section-pad" style={{
      background: 'var(--fog)',
      padding: '6rem 1.5rem',
      position: 'relative',
    }}>
      <div style={{maxWidth: '680px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--ink)',
            margin: '0 0 0.75rem',
          }}>
            {t('title')}
          </h2>
          <div className="gradient-line" style={{width: '60px', margin: '0 auto'}}/>
        </div>

        {/* Pricing card */}
        <div
          className="fade-up"
          style={{
            background: 'var(--ink)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(10,15,30,0.25)',
            position: 'relative',
          }}
        >
          {/* Top accent bar */}
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, var(--red), var(--blue))',
          }}/>

          {/* Card content */}
          <div style={{padding: 'clamp(1.5rem, 4vw, 2.5rem)'}}>
            {/* Badge */}
            <div style={{marginBottom: '2rem', textAlign: 'center'}}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(232,0,29,0.12)',
                border: '1px solid rgba(232,0,29,0.3)',
                borderRadius: '3px',
                padding: '0.3rem 0.9rem',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ff4455',
              }}>
                {t('badge')}
              </span>
            </div>

            {/* Price */}
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                {t('price')}
              </div>
              <div style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.9rem',
                color: 'var(--steel)',
                marginTop: '0.35rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {t('priceSuffix')}
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'rgba(255,255,255,0.07)',
              marginBottom: '2rem',
            }}/>

            {/* Features list — breakpoints in globals.css */}
            <ul
              className="pricing-features"
              style={{
                listStyle: 'none',
                margin: '0 0 2rem',
                padding: 0,
                display: 'grid',
                gap: '0.65rem',
              }}
            >
              {features.map((feat, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.88rem',
                  color: '#94a3b8',
                  lineHeight: 1.4,
                }}>
                  <span style={{
                    color: 'var(--green)',
                    fontWeight: 700,
                    flexShrink: 0,
                    fontSize: '0.95rem',
                    marginTop: '0.05rem',
                  }}>✓</span>
                  {feat}
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <a
              href={BUY_URL}
              className="btn-red"
              style={{
                display: 'block',
                textAlign: 'center',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'var(--red)',
                textDecoration: 'none',
                padding: '1rem',
                borderRadius: '6px',
                transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                boxShadow: '0 4px 20px rgba(232,0,29,0.3)',
              }}
            >
              {t('cta')} →
            </a>

            {/* Note */}
            <p style={{
              textAlign: 'center',
              fontFamily: 'Barlow, sans-serif',
              fontSize: '0.8rem',
              color: '#64748b',
              margin: '1rem 0 0',
            }}>
              {t('note')}
            </p>
          </div>
        </div>

        {/* Cost comparison */}
        <div style={{marginTop: '3rem'}}>
          <h3 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            color: 'var(--ink)',
            margin: '0 0 1.25rem',
            textAlign: 'center',
            letterSpacing: '-0.01em',
          }}>
            {comparison.title}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1rem',
          }}>
            {/* Competitor column */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderLeft: '3px solid #94a3b8',
              borderRadius: '8px',
              padding: '1.25rem',
            }}>
              <p style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#475569',
                margin: '0 0 0.75rem',
              }}>
                {comparison.competitorLabel}
              </p>
              <ul style={{listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {comparison.competitorItems.map((item, i) => (
                  <li key={i} style={{
                    fontFamily: 'Barlow, sans-serif',
                    fontSize: '0.85rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    lineHeight: 1.4,
                  }}>
                    <span style={{color: '#94a3b8', flexShrink: 0}}>✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* PDR Kalk column */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderLeft: '3px solid var(--green)',
              borderRadius: '8px',
              padding: '1.25rem',
            }}>
              <p style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
                margin: '0 0 0.75rem',
              }}>
                {comparison.ourLabel}
              </p>
              <ul style={{listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {comparison.ourItems.map((item, i) => (
                  <li key={i} style={{
                    fontFamily: 'Barlow, sans-serif',
                    fontSize: '0.85rem',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    lineHeight: 1.4,
                  }}>
                    <span style={{color: 'var(--green)', flexShrink: 0, fontWeight: 700}}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p style={{
            textAlign: 'center',
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#475569',
            margin: '1.25rem 0 0',
            fontStyle: 'italic',
          }}>
            {comparison.conclusion}
          </p>
        </div>
      </div>
    </section>
  );
}
