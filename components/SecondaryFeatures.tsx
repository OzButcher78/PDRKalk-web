'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';

type FeatureGroup = { icon: string; heading: string; items: string[] };

// Keyed by the `icon` field on each group in messages/*.json — /au ships a
// different set of groups than the other locales, so a positional array would
// hand the wrong icon to half the accordion.
const groupIcons: Record<string, React.ReactElement> = {
  /* wrench — hail editor parts & assignments */
  hailparts: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15.5 3.5a5 5 0 00-6 6.5L4 15.5a2.1 2.1 0 003 3l5.5-5.5a5 5 0 006.5-6l-3 3-2.5-2.5 3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
  /* invoice */
  invoice: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 7h8M8 11h6M8 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  /* bar chart — analytics */
  analytics: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="5" y="12" width="3" height="7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="10.5" y="8" width="3" height="11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="16" y="4" width="3" height="15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
  /* package / ZIP bundle */
  package: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
  /* users — subcontractor */
  users: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="17" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M15 20c0-2 1.5-3.5 4-3.5s3 1.5 3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  /* camera */
  camera: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 6l1-3h6l1 3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  /* devices — multi-device sync */
  devices: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 17h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="17" y="9" width="5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  /* backup / cloud-off */
  backup: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 12v4M10 14l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* globe / cross-border */
  globe: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 12h18M12 3c-3 2.5-4.5 5.5-4.5 9s1.5 6.5 4.5 9c3-2.5 4.5-5.5 4.5-9s-1.5-6.5-4.5-9z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  /* clock — timeline */
  timeline: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7v5l3.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* book — help / manual */
  help: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M20 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
};

export default function SecondaryFeatures() {
  const t = useTranslations('secondaryFeatures');
  const groups = t.raw('groups') as FeatureGroup[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(prev => prev === i ? null : i);
  };

  return (
    <section id="more" style={{
      background: 'var(--ink-mid)',
      padding: '4rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }}/>

      <div style={{maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#ffffff',
            margin: '0 0 0.75rem',
          }}>
            {t('title')}
          </h2>
          <div className="gradient-line" style={{width: '60px', margin: '0 auto'}}/>
        </div>

        {/* Accordion */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          {groups.map((group, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s',
                  borderColor: isOpen ? 'rgba(232,0,29,0.3)' : 'rgba(255,255,255,0.07)',
                }}
              >
                {/* Header button */}
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="sf-toggle-button"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1.1rem 1.25rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff',
                    minHeight: '48px',
                  }}
                >
                  {/* Icon */}
                  <span style={{color: 'var(--steel)', flexShrink: 0}}>
                    {groupIcons[group.icon]}
                  </span>

                  {/* Title */}
                  <span className="sf-toggle-title" style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    textAlign: 'left',
                    flex: 1,
                    minWidth: 0,
                  }}>
                    {group.heading}
                  </span>

                  {/* Chevron */}
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    aria-hidden="true"
                    className={`accordion-chevron${isOpen ? ' open' : ''}`}
                    style={{flexShrink: 0}}
                  >
                    <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Body */}
                <div className={`accordion-body${isOpen ? ' open' : ''}`}>
                  <div>
                    <ul className="sf-toggle-body" style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: '0 1.25rem 1.25rem 3.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                    }}>
                      {group.items.map((item, j) => (
                        <li key={j} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          fontFamily: 'Barlow, sans-serif',
                          fontSize: '0.88rem',
                          color: '#8fa8c8',
                          lineHeight: 1.5,
                        }}>
                          <span style={{
                            color: 'var(--green)',
                            fontWeight: 700,
                            flexShrink: 0,
                            fontSize: '0.9rem',
                            marginTop: '0.05rem',
                          }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
