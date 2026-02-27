'use client';

import {useTranslations} from 'next-intl';

// 6 icons reused from original — mapped to outcome card order:
// hail, parking, clock, shield, doc, browser
const outcomeIcons = [
  /* hail */
  <svg key="hail" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 4L7 14h5l-2 10 12-14h-6l3-6H14z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
  </svg>,
  /* parking */
  <svg key="park" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="4" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M10 20V9h5a4 4 0 010 8h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>,
  /* clock */
  <svg key="clock" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M14 9v5.5l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* shield */
  <svg key="shield" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 3L5 7v8c0 5.25 3.8 10.15 9 11.35C19.2 25.15 23 20.25 23 15V7L14 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M10 14l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* doc */
  <svg key="doc" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="6" y="3" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M10 9h8M10 13h8M10 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>,
  /* browser / settings */
  <svg key="browser" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="5" width="22" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3 11h22" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="7" cy="8" r="1.2" fill="currentColor"/>
    <circle cx="11" cy="8" r="1.2" fill="currentColor"/>
    <circle cx="15" cy="8" r="1.2" fill="currentColor"/>
  </svg>,
];

const outcomeAccents = [
  'var(--red)',
  'var(--orange)',
  'var(--green)',
  'var(--blue)',
  'var(--blue)',
  'var(--steel)',
];

type IntroCard = { heading: string; desc: string; support: string };
type OutcomeCard = { heading: string; bullets: string[]; tagline: string };

export default function Features() {
  const t = useTranslations('features');

  const intro   = t.raw('intro')   as { title: string; cards: IntroCard[] };
  const divider = t.raw('divider') as { statement: string };
  const outcomes = t.raw('outcomes') as { title: string; cards: OutcomeCard[] };

  return (
    <>
      {/* ══ SUBSECTION A: Trust line + 3 Intro Blocks ══ */}
      <section id="features" style={{
        background: 'var(--fog)',
        padding: '6rem 1.5rem 5rem',
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>

          {/* Trust line */}
          <p className="fade-up" style={{
            textAlign: 'center',
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.9rem',
            color: 'var(--steel)',
            maxWidth: '640px',
            margin: '0 auto 3rem',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            {t('trustLine')}
          </p>

          {/* Section title */}
          <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
            <h2 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              color: 'var(--ink)',
              margin: '0 0 0.75rem',
              letterSpacing: '-0.01em',
            }}>
              {intro.title}
            </h2>
            <div className="gradient-line" style={{width: '60px', margin: '0 auto'}}/>
          </div>

          {/* 3 intro cards */}
          <div className="features-grid" style={{display: 'grid', gap: '1.25rem'}}>
            {intro.cards.map((card, i) => (
              <div
                key={i}
                className={`feature-card fade-up-${i + 1}`}
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '1.75rem',
                  border: '1px solid #e2e8f0',
                  borderLeft: '3px solid var(--red)',
                  cursor: 'default',
                }}
              >
                <h3 style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '0.02em',
                  color: 'var(--ink)',
                  margin: '0 0 0.75rem',
                }}>
                  {card.heading}
                </h3>
                <p style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.92rem',
                  color: '#64748b',
                  lineHeight: 1.65,
                  margin: card.support ? '0 0 0.75rem' : '0',
                  whiteSpace: 'pre-line',
                }}>
                  {card.desc}
                </p>
                {card.support && (
                  <p style={{
                    fontFamily: 'Barlow, sans-serif',
                    fontSize: '0.82rem',
                    color: 'var(--steel)',
                    fontStyle: 'italic',
                    margin: 0,
                  }}>
                    {card.support}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SUBSECTION B: Dark Bold Divider ══ */}
      <div style={{
        background: 'var(--ink)',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle red glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(232,0,29,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <p className="fade-up" style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
          color: '#ffffff',
          maxWidth: '720px',
          margin: '0 auto',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          position: 'relative',
          zIndex: 1,
        }}>
          {divider.statement}
        </p>
      </div>

      {/* ══ SUBSECTION C: 6 Outcome Cards ══ */}
      <section style={{
        background: 'var(--fog)',
        padding: '6rem 1.5rem',
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>

          {/* Section header */}
          <div style={{textAlign: 'center', marginBottom: '3rem'}}>
            <h2 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--ink)',
              margin: '0 0 0.75rem',
              letterSpacing: '-0.01em',
            }}>
              {outcomes.title}
            </h2>
            <div className="gradient-line" style={{width: '60px', margin: '0 auto'}}/>
          </div>

          {/* 6-card grid */}
          <div className="features-grid" style={{display: 'grid', gap: '1.25rem'}}>
            {outcomes.cards.map((card, i) => (
              <div
                key={i}
                className={`feature-card fade-up-${Math.min(i + 1, 6)}`}
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '1.75rem',
                  border: '1px solid #e2e8f0',
                  borderLeft: `3px solid ${outcomeAccents[i]}`,
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Icon */}
                <div style={{color: outcomeAccents[i], marginBottom: '1rem'}}>
                  {outcomeIcons[i]}
                </div>

                {/* Heading */}
                <h3 style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '0.02em',
                  color: 'var(--ink)',
                  margin: '0 0 0.75rem',
                }}>
                  {card.heading}
                </h3>

                {/* Bullet list */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  flexGrow: 1,
                }}>
                  {card.bullets.map((bullet, j) => (
                    <li key={j} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.45rem',
                      fontFamily: 'Barlow, sans-serif',
                      fontSize: '0.88rem',
                      color: '#64748b',
                      lineHeight: 1.5,
                    }}>
                      <span style={{
                        color: outcomeAccents[i],
                        fontWeight: 700,
                        flexShrink: 0,
                        fontSize: '0.9rem',
                        marginTop: '0.05rem',
                      }}>—</span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Tagline */}
                {card.tagline && (
                  <p style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: outcomeAccents[i],
                    margin: '1rem 0 0',
                  }}>
                    {card.tagline}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
