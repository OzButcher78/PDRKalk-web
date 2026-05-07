'use client';

import {useTranslations} from 'next-intl';

type CompRow = { feature: string; pdrKalk: boolean; competitor: boolean; competitorNote: string; pdrKalkAsterisk?: boolean };

export default function Comparison() {
  const t = useTranslations('comparison');
  const rows = t.raw('rows') as CompRow[];
  const footnote = t('footnote');

  return (
    <section id="comparison" style={{
      background: 'var(--fog)',
      padding: '4rem 1.5rem',
    }}>
      <div style={{maxWidth: '700px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--ink)',
            margin: '0 0 0.75rem',
            letterSpacing: '-0.01em',
          }}>
            {t('title')}
          </h2>
          <div className="gradient-line" style={{width: '60px', margin: '0 auto'}}/>
        </div>

        {/* Table */}
        <div style={{
          borderRadius: '10px',
          overflowX: 'auto',
          boxShadow: '0 2px 16px rgba(10,15,30,0.08)',
          border: '1px solid #e2e8f0',
          maxWidth: '100%',
        }}>
          <table style={{
            width: '100%',
            minWidth: '480px',
            borderCollapse: 'collapse',
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.92rem',
          }}>
            <thead>
              <tr style={{background: 'var(--ink)'}}>
                <th style={{
                  textAlign: 'left',
                  padding: '0.85rem 1rem',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--steel)',
                }}>
                  {t('headers.feature')}
                </th>
                <th style={{
                  textAlign: 'center',
                  padding: '0.85rem 1rem',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#4ade80',
                  borderLeft: '2px solid rgba(22,163,74,0.3)',
                  background: 'rgba(22,163,74,0.07)',
                }}>
                  {t('headers.pdrKalk')}
                </th>
                <th style={{
                  textAlign: 'center',
                  padding: '0.85rem 1rem',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--steel)',
                }}>
                  {t('headers.competitor')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{background: i % 2 === 0 ? '#fff' : '#f8fafc'}}>
                  <td style={{
                    padding: '0.85rem 1rem',
                    color: '#475569',
                    fontWeight: 500,
                    borderBottom: '1px solid #e2e8f0',
                  }}>
                    {row.feature}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid #bbf7d0',
                    borderLeft: '2px solid rgba(22,163,74,0.25)',
                    background: 'rgba(22,163,74,0.05)',
                    color: '#166534',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}>
                    ✓
                    {row.pdrKalkAsterisk && (
                      <sup style={{
                        marginLeft: '0.15em',
                        fontSize: '0.7em',
                        color: 'var(--red)',
                        fontWeight: 800,
                      }}>*</sup>
                    )}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                  }}>
                    <span style={{color: 'var(--red)', fontWeight: 700, marginRight: '0.35rem'}}>✕</span>
                    {row.competitorNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {footnote && (
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.82rem',
            color: '#64748b',
            marginTop: '1rem',
            marginBottom: 0,
            fontStyle: 'italic',
            textAlign: 'left',
          }}>
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
