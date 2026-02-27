'use client';

import {useTranslations} from 'next-intl';

const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#contact';


export default function Pricing() {
  const t = useTranslations('pricing');

  const lifetime = t.raw('lifetime') as {
    badge: string;
    badgeNote: string;
    price: string;
    priceSuffix: string;
    features: string[];
    note: string;
    cta: string;
  };

  const monthly = t.raw('monthly') as {
    badge: string;
    price: string;
    priceSuffix: string;
    features: string[];
    disclaimer: string;
  };

  const comparisonTable = t.raw('comparisonTable') as {
    title: string;
    headers: { feature: string; competitorA: string; competitorB: string; pdrKalk: string };
    rows: Array<{ feature: string; competitorA: string; competitorB: string; pdrKalk: string }>;
    closing: string;
    note: string;
  };

  return (
    <section id="pricing" className="section-pad" style={{
      background: 'var(--fog)',
      padding: '6rem 1.5rem',
      position: 'relative',
    }}>
      <div style={{maxWidth: '900px', margin: '0 auto'}}>

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

        {/* Two pricing cards */}
        <div
          className="pricing-cards"
          style={{display: 'grid', gap: '1.5rem', marginBottom: '3rem'}}
        >

          {/* ── Dauerlizenz card (dark) ── */}
          <div
            className="fade-up-1"
            style={{
              background: 'var(--ink)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(10,15,30,0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top accent bar */}
            <div style={{
              height: '4px',
              background: 'linear-gradient(90deg, var(--red), var(--blue))',
            }}/>

            <div style={{
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}>
              {/* Badge */}
              <div style={{marginBottom: '0.5rem', textAlign: 'center'}}>
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
                  textTransform: 'uppercase' as const,
                  color: '#ff4455',
                }}>
                  {lifetime.badge}
                </span>
              </div>
              <div style={{
                textAlign: 'center',
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.75rem',
                color: 'var(--steel)',
                letterSpacing: '0.06em',
                marginBottom: '1.5rem',
              }}>
                {lifetime.badgeNote}
              </div>

              {/* Price */}
              <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  color: '#ffffff',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  {lifetime.price}
                </div>
                <div style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.9rem',
                  color: 'var(--steel)',
                  marginTop: '0.35rem',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                }}>
                  {lifetime.priceSuffix}
                </div>
              </div>

              {/* Divider */}
              <div style={{
                height: '1px',
                background: 'rgba(255,255,255,0.07)',
                marginBottom: '1.5rem',
              }}/>

              {/* Features */}
              <ul style={{
                listStyle: 'none',
                margin: '0 0 2rem',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                flexGrow: 1,
              }}>
                {lifetime.features.map((feat, i) => (
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

              {/* CTA */}
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
                  textTransform: 'uppercase' as const,
                  color: '#fff',
                  background: 'var(--red)',
                  textDecoration: 'none',
                  padding: '1rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                  boxShadow: '0 4px 20px rgba(232,0,29,0.3)',
                }}
              >
                {lifetime.cta} →
              </a>

              {/* Note */}
              <p style={{
                textAlign: 'center',
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.82rem',
                color: '#64748b',
                fontStyle: 'italic',
                margin: '1rem 0 0',
              }}>
                {lifetime.note}
              </p>
            </div>
          </div>

          {/* ── Monatslizenz card (light) ── */}
          <div
            className="fade-up-2"
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(10,15,30,0.10)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top accent bar */}
            <div style={{
              height: '4px',
              background: 'var(--steel)',
            }}/>

            <div style={{
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}>
              {/* Badge */}
              <div style={{marginBottom: '1.5rem', textAlign: 'center'}}>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(148,163,184,0.12)',
                  border: '1px solid rgba(148,163,184,0.4)',
                  borderRadius: '3px',
                  padding: '0.3rem 0.9rem',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase' as const,
                  color: '#475569',
                }}>
                  {monthly.badge}
                </span>
              </div>

              {/* Price */}
              <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  color: 'var(--ink)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  {monthly.price}
                </div>
                <div style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.9rem',
                  color: '#64748b',
                  marginTop: '0.35rem',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                }}>
                  {monthly.priceSuffix}
                </div>
              </div>

              {/* Divider */}
              <div style={{
                height: '1px',
                background: '#e2e8f0',
                marginBottom: '1.5rem',
              }}/>

              {/* Features */}
              <ul style={{
                listStyle: 'none',
                margin: '0 0 2rem',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                flexGrow: 1,
              }}>
                {monthly.features.map((feat, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    fontFamily: 'Barlow, sans-serif',
                    fontSize: '0.88rem',
                    color: '#475569',
                    lineHeight: 1.4,
                  }}>
                    <span style={{
                      color: 'var(--steel)',
                      fontWeight: 700,
                      flexShrink: 0,
                      fontSize: '0.95rem',
                      marginTop: '0.05rem',
                    }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Ghost CTA */}
              <a
                href="#contact"
                className="btn-ghost-dark"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--ink)',
                  background: 'transparent',
                  textDecoration: 'none',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '2px solid #cbd5e1',
                  transition: 'border-color 0.2s, transform 0.15s',
                }}
              >
                {monthly.badge} →
              </a>

              {/* Disclaimer */}
              <p style={{
                textAlign: 'center',
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.78rem',
                color: '#94a3b8',
                fontStyle: 'italic',
                margin: '1rem 0 0',
              }}>
                {monthly.disclaimer}
              </p>
            </div>
          </div>

        </div>

        {/* 5-Year cost comparison table */}
        <div>
          <style>{`
            .comparison-table th,
            .comparison-table td { padding: 0.85rem 1rem; }
            @media (max-width: 768px) {
              .comparison-table th,
              .comparison-table td { padding: 0.6rem 0.5rem; font-size: 0.8rem; }
            }
          `}</style>

          <h3 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            color: 'var(--ink)',
            margin: '0 0 1.25rem',
            textAlign: 'center',
            letterSpacing: '-0.01em',
          }}>
            {comparisonTable.title}
          </h3>

          <div style={{
            overflowX: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(10,15,30,0.07)',
          }}>
            <table
              className="comparison-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '480px',
                background: '#fff',
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.9rem',
              }}
            >
              <thead>
                <tr style={{background: 'var(--ink)'}}>
                  <th style={{
                    textAlign: 'left',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: 'var(--steel)',
                    borderBottom: '2px solid rgba(255,255,255,0.08)',
                  }}>
                    {comparisonTable.headers.feature}
                  </th>
                  <th style={{
                    textAlign: 'center',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: 'var(--steel)',
                    borderBottom: '2px solid rgba(255,255,255,0.08)',
                  }}>
                    {comparisonTable.headers.competitorA}
                  </th>
                  <th style={{
                    textAlign: 'center',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: 'var(--steel)',
                    borderBottom: '2px solid rgba(255,255,255,0.08)',
                  }}>
                    {comparisonTable.headers.competitorB}
                  </th>
                  <th style={{
                    textAlign: 'center',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: 'var(--red)',
                    borderBottom: '2px solid var(--red)',
                    borderLeft: '2px solid rgba(232,0,29,0.2)',
                  }}>
                    {comparisonTable.headers.pdrKalk}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.rows.map((row, i) => {
                  const isEven = i % 2 === 0;
                  const isCostRow = i >= 5;
                  return (
                    <tr key={i} style={{background: isEven ? '#fff' : '#f8fafc'}}>
                      <td style={{
                        color: '#475569',
                        fontWeight: 500,
                        borderBottom: '1px solid #e2e8f0',
                      }}>
                        {row.feature}
                      </td>
                      <td style={{
                        textAlign: 'center',
                        color: isCostRow ? 'var(--red)' : '#64748b',
                        fontWeight: isCostRow ? 600 : 400,
                        borderBottom: '1px solid #e2e8f0',
                      }}>
                        {row.competitorA}
                      </td>
                      <td style={{
                        textAlign: 'center',
                        color: isCostRow ? 'var(--red)' : '#64748b',
                        fontWeight: isCostRow ? 600 : 400,
                        borderBottom: '1px solid #e2e8f0',
                      }}>
                        {row.competitorB}
                      </td>
                      <td style={{
                        textAlign: 'center',
                        color: 'var(--green)',
                        fontWeight: 700,
                        borderBottom: '1px solid #e2e8f0',
                        borderLeft: '2px solid rgba(232,0,29,0.15)',
                        background: 'rgba(232,0,29,0.03)',
                      }}>
                        {row.pdrKalk}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p style={{
            textAlign: 'center',
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#475569',
            margin: '1.5rem 0 0.5rem',
          }}>
            {comparisonTable.closing}
          </p>

          <p style={{
            textAlign: 'center',
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.78rem',
            color: '#94a3b8',
            fontStyle: 'italic',
            margin: '0.5rem 0 0',
          }}>
            {comparisonTable.note}
          </p>
        </div>

      </div>
    </section>
  );
}
