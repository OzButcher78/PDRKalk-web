'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';

type FeatureGroup = { heading: string; items: string[] };

const groupIcons = [
  /* invoice */
  <svg key="invoice" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 7h8M8 11h6M8 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  /* camera */
  <svg key="camera" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 6l1-3h6l1 3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  /* backup / cloud-off */
  <svg key="backup" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 12v4M10 14l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* globe / cross-border */
  <svg key="globe" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 12h18M12 3c-3 2.5-4.5 5.5-4.5 9s1.5 6.5 4.5 9c3-2.5 4.5-5.5 4.5-9s-1.5-6.5-4.5-9z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  /* shield / compliance */
  <svg key="compliance" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10.5 4.5-1 8-5.5 8-10.5V6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
];

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
                    {groupIcons[i]}
                  </span>

                  {/* Title */}
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    textAlign: 'left',
                    flex: 1,
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
                    <ul style={{
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
