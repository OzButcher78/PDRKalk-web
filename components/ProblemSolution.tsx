'use client';

import {useTranslations} from 'next-intl';

type Column = { heading: string; desc: string };

const icons = [
  /* spreadsheet / X */
  <svg key="excel" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="5" y="5" width="26" height="26" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M5 14h26M14 14v17M22 14v17" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
    <path d="M12 20l12 8M24 20l-12 8" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>,
  /* flow / connected nodes */
  <svg key="flow" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="2" y="7" width="11" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="23" y="7" width="11" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="12.5" y="20" width="11" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M13 11.5h10M18 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  /* clock with savings */
  <svg key="clock" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="13" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 10v8.5l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="18" r="2.5" fill="var(--green)"/>
  </svg>,
  /* shield / audit trail */
  <svg key="shield" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M18 3L5 9v9c0 8.5 5.5 14.5 13 17 7.5-2.5 13-8.5 13-17V9L18 3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M13 18l3.5 3.5L23 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* document export / accounting */
  <svg key="export" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="7" y="4" width="16" height="22" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 11h8M11 15h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
    <circle cx="26" cy="25" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M26 21.5v7M23 25.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* local backup / save */
  <svg key="backup" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="6" y="18" width="24" height="13" rx="3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="26" cy="24.5" r="1.5" fill="currentColor"/>
    <path d="M18 4v14M13 13l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
];

const accentColors = ['var(--red)', 'var(--blue)', 'var(--green)', 'var(--blue)', 'var(--green)', 'var(--red)'];

export default function ProblemSolution() {
  const t = useTranslations('problemSolution');
  const columns = t.raw('columns') as Column[];

  return (
    <section style={{
      background: 'var(--fog)',
      padding: '4rem 1.5rem',
    }}>
      <div style={{maxWidth: '1000px', margin: '0 auto'}}>
        {/* 3-column grid */}
        <div className="problem-grid" style={{display: 'grid', gap: '1.5rem'}}>
          {columns.map((col, i) => (
            <div
              key={i}
              className={`feature-card fade-up-${i + 1}`}
              style={{
                background: 'linear-gradient(135deg, var(--red), var(--blue))',
                borderRadius: '12px',
                padding: '1.5px',
                cursor: 'default',
              }}
            >
              <div style={{
                background: '#fff',
                borderRadius: '11px',
                padding: '2rem 1.5rem 1.75rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.75rem',
              }}>
                {/* Icon circle */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accentColors[i]}11, ${accentColors[i]}22)`,
                  border: `1.5px solid ${accentColors[i]}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: accentColors[i],
                  marginBottom: '0.25rem',
                }}>
                  {icons[i]}
                </div>

                {/* Heading */}
                <h3 style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '0.02em',
                  color: 'var(--ink)',
                  margin: 0,
                }}>
                  {col.heading}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.9rem',
                  color: '#64748b',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {col.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
