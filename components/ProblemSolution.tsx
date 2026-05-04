'use client';

import type {CSSProperties} from 'react';
import {useTranslations} from 'next-intl';

type Column = { heading: string; desc: string };

const icons = [
  /* spreadsheet / X */
  <svg key="excel" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="5" y="5" width="26" height="26" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M5 14h26M14 14v17M22 14v17" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
    <path d="M12 20l12 8M24 20l-12 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
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
    <circle cx="18" cy="18" r="2.5" fill="currentColor"/>
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

const accentColors = [
  'var(--red)',   /* Schluss mit Excel-Tabellen */
  'var(--red)',   /* Vom Rapport bis zur Rechnung */
  'var(--red)',   /* 30–60 Min. gespart */
  'var(--blue)',  /* Manipulationssicherer Audit-Trail */
  'var(--blue)',  /* DATEV & Buchhaltungsexport */
  'var(--blue)',  /* Lokale Datensicherung */
];

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
              className={`feature-card feature-card-mesh fade-up-${i + 1}`}
              style={{
                ['--accent' as string]: accentColors[i],
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'default',
              } as CSSProperties}
            >
              <div className="feature-icon-tile feature-icon-tile-lg" style={{marginBottom: '1.25rem'}}>
                {icons[i]}
              </div>

              <h3 style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.2rem, 1.6vw, 1.4rem)',
                letterSpacing: '-0.015em',
                lineHeight: 1.15,
                color: 'var(--ink)',
                margin: 0,
              }}>
                {col.heading}
              </h3>

              <p style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.95rem',
                color: '#475569',
                lineHeight: 1.7,
                margin: '0.75rem 0 0',
              }}>
                {col.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
