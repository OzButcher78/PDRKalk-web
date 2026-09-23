'use client';

import {useTranslations} from 'next-intl';
import {interpolate} from '@/lib/interpolate';

// Both tables are the owner's data and are rendered exactly as before — only
// their home changed (they now live inside the pricing section, behind a
// <details>). Do not "tidy" the rows or the markup.

type CompRow = {
  feature: string;
  pdrKalk: boolean;
  competitor: boolean;
  competitorNote: string;
  pdrKalkAsterisk?: boolean;
};

type CostTable = {
  title: string;
  headers: {feature: string; competitor: string; competitor2?: string; pdrKalk: string};
  rows: Array<{feature: string; competitor: string; competitor2?: string; pdrKalk: string}>;
  closing: string;
  note: string;
};

const TH_BASE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: '0.8rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--steel)',
};

export default function ComparisonTables({id = 'comparison', defaultOpen = false}: {id?: string; defaultOpen?: boolean} = {}) {
  const t = useTranslations('pricing');
  const comparison = t.raw('comparison') as {
    title: string;
    headers: {feature: string; pdrKalk: string; competitor: string};
    rows: CompRow[];
    footnote: string;
  };
  const costTable = t.raw('costTable') as CostTable;
  const hasCompetitor2 = Boolean(costTable.headers.competitor2);

  return (
    <details id={id} className="comparison-details" open={defaultOpen}>
      <summary className="comparison-summary">{t('comparisonToggle')}</summary>

      {/* ---- 5-year cost comparison ---- */}
      <div style={{marginBottom: '3rem'}}>
        <h3 className="t-h3" style={{fontSize: 'clamp(1.35rem, 3vw, 1.8rem)', textAlign: 'center', marginBottom: '1.25rem'}}>
          {interpolate(costTable.title)}
        </h3>

        {/* tabIndex makes the scroll container reachable — the tables hold no
            focusable content, so a keyboard user could never scroll them. */}
        <div
          tabIndex={0}
          role="region"
          aria-label={interpolate(costTable.title)}
          style={{overflowX: 'auto', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 2px 12px rgba(10,15,30,0.07)'}}
        >
          <table
            className="comparison-table"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: hasCompetitor2 ? '600px' : '480px',
              background: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <caption className="sr-only">{interpolate(costTable.title)}</caption>
            <thead>
              <tr style={{background: 'var(--ink)'}}>
                <th scope="col" style={{...TH_BASE, textAlign: 'left', borderBottom: '2px solid rgba(255,255,255,0.08)'}}>
                  {costTable.headers.feature}
                </th>
                <th scope="col" style={{...TH_BASE, textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.08)'}}>
                  {costTable.headers.competitor}
                </th>
                {hasCompetitor2 && (
                  <th scope="col" style={{...TH_BASE, textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.08)'}}>
                    {costTable.headers.competitor2}
                  </th>
                )}
                <th
                  scope="col"
                  style={{
                    ...TH_BASE,
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#4ade80',
                    borderBottom: '2px solid var(--green)',
                    borderLeft: '2px solid rgba(22,163,74,0.3)',
                    background: 'rgba(22,163,74,0.07)',
                  }}
                >
                  {costTable.headers.pdrKalk}
                </th>
              </tr>
            </thead>
            <tbody>
              {costTable.rows.map((row, i) => {
                const isEven = i % 2 === 0;
                const isCostRow = i >= 5;
                const isLastRow = i === costTable.rows.length - 1;
                return (
                  <tr key={i} style={{background: isEven ? '#fff' : '#f8fafc'}}>
                    <th scope="row" style={{
                      textAlign: 'left',
                      color: '#475569',
                      fontWeight: isLastRow ? 800 : 500,
                      borderBottom: '1px solid #e2e8f0',
                      borderTop: isLastRow ? '2px solid #cbd5e1' : undefined,
                    }}>
                      {interpolate(row.feature)}
                    </th>
                    <td style={{
                      textAlign: 'center',
                      color: isCostRow ? 'var(--red)' : '#64748b',
                      fontWeight: isLastRow ? 800 : isCostRow ? 600 : 400,
                      borderBottom: '1px solid #e2e8f0',
                      borderTop: isLastRow ? '2px solid #cbd5e1' : undefined,
                    }}>
                      {row.competitor}
                    </td>
                    {hasCompetitor2 && (
                      <td style={{
                        textAlign: 'center',
                        color: isCostRow ? 'var(--red)' : '#64748b',
                        fontWeight: isLastRow ? 800 : isCostRow ? 600 : 400,
                        borderBottom: '1px solid #e2e8f0',
                        borderTop: isLastRow ? '2px solid #cbd5e1' : undefined,
                      }}>
                        {row.competitor2}
                      </td>
                    )}
                    <td style={{
                      textAlign: 'center',
                      color: '#166534',
                      fontWeight: isLastRow ? 900 : 700,
                      fontSize: isLastRow ? '1.05em' : undefined,
                      borderBottom: '1px solid #bbf7d0',
                      borderLeft: '2px solid rgba(22,163,74,0.25)',
                      background: 'rgba(22,163,74,0.07)',
                      borderTop: isLastRow ? '2px solid #16a34a' : undefined,
                    }}>
                      {row.pdrKalk}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, color: '#475569', margin: '1.5rem 0 0.5rem'}}>
          {costTable.closing}
        </p>
        <p style={{textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', margin: '0.5rem 0 0'}}>
          {costTable.note}
        </p>
      </div>

      {/* ---- Feature comparison ---- */}
      <div>
        <h3 className="t-h3" style={{fontSize: 'clamp(1.35rem, 3vw, 1.8rem)', textAlign: 'center', marginBottom: '1.25rem'}}>
          {comparison.title}
        </h3>

        <div
          tabIndex={0}
          role="region"
          aria-label={comparison.title}
          style={{borderRadius: '10px', overflowX: 'auto', boxShadow: '0 2px 16px rgba(10,15,30,0.08)', border: '1px solid #e2e8f0', maxWidth: '100%'}}
        >
          <table
            className="comparison-table"
            style={{width: '100%', minWidth: '480px', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '0.92rem'}}
          >
            <caption className="sr-only">{comparison.title}</caption>
            <thead>
              <tr style={{background: 'var(--ink)'}}>
                <th scope="col" style={{...TH_BASE, textAlign: 'left'}}>{comparison.headers.feature}</th>
                <th
                  scope="col"
                  style={{
                    ...TH_BASE,
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#4ade80',
                    borderLeft: '2px solid rgba(22,163,74,0.3)',
                    background: 'rgba(22,163,74,0.07)',
                  }}
                >
                  {comparison.headers.pdrKalk}
                </th>
                <th scope="col" style={{...TH_BASE, textAlign: 'center'}}>{comparison.headers.competitor}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row, i) => (
                <tr key={i} style={{background: i % 2 === 0 ? '#fff' : '#f8fafc'}}>
                  <th scope="row" style={{textAlign: 'left', color: '#475569', fontWeight: 500, borderBottom: '1px solid #e2e8f0'}}>
                    {interpolate(row.feature)}
                  </th>
                  <td style={{
                    textAlign: 'center',
                    borderBottom: '1px solid #bbf7d0',
                    borderLeft: '2px solid rgba(22,163,74,0.25)',
                    background: 'rgba(22,163,74,0.05)',
                    color: '#166534',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}>
                    <span aria-hidden>✓</span>
                    <span className="sr-only">{comparison.headers.pdrKalk}</span>
                    {row.pdrKalkAsterisk && (
                      <sup style={{marginLeft: '0.15em', fontSize: '0.7em', color: 'var(--red)', fontWeight: 800}}>*</sup>
                    )}
                  </td>
                  <td style={{textAlign: 'center', borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.85rem'}}>
                    <span aria-hidden style={{color: 'var(--red)', fontWeight: 700, marginRight: '0.35rem'}}>✕</span>
                    {row.competitorNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {comparison.footnote && (
          <p style={{fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#64748b', marginTop: '1rem', marginBottom: 0, fontStyle: 'italic'}}>
            {comparison.footnote}
          </p>
        )}
      </div>
    </details>
  );
}
