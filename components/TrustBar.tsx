'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useCountUp, formatCount} from '@/hooks/useCountUp';
import {APP_LANGUAGE_COUNT} from '@/lib/site';
import {interpolate} from '@/lib/interpolate';

type Item = {value?: string; unit?: string; label: string; note?: string};
type Stat = {value: string; unit: string; period: string};

export default function TrustBar() {
  const t = useTranslations('trust');
  const locale = useLocale();
  // en / en-AU write 1.5; de, fr and it write 1,5.
  const decimal = locale.startsWith('en') ? '.' : ',';
  const items = t.raw('items') as Item[];
  const stats = t.raw('stats') as Stat[];
  const {ref, values} = useCountUp(stats.map(s => parseFloat(s.value)));

  return (
    <section
      id="trust"
      ref={ref as React.RefObject<HTMLElement>}
      className="section section--band theme-dark"
      style={{background: 'var(--ink-mid)'}}
      aria-labelledby="trust-title"
    >
      {/* Legacy anchor from the retired TimeSavings section. */}
      <span id="timesavings" aria-hidden />

      <div className="container">
        <h2 id="trust-title" className="sr-only">{t('title')}</h2>

        <ul className="trust-grid">
          {items.map((item, i) => (
            <li key={i} className="trust-item">
              {item.value && (
                <span className="trust-num">
                  {item.value}
                  {item.unit && <span className="trust-num__unit">{item.unit}</span>}
                </span>
              )}
              <span className="trust-label">{t(`items.${i}.label`, {languages: APP_LANGUAGE_COUNT})}</span>
              {item.note && <span className="trust-note">{interpolate(item.note)}</span>}
            </li>
          ))}
        </ul>

        <ul className="trust-stats">
          {stats.map((stat, i) => (
            <li key={i}>
              {/* The animated figure changes ~60x a second; expose the final one. */}
              <b aria-hidden>{formatCount(values[i] ?? 0, decimal)}</b>
              <span className="sr-only">{stat.value}</span>{' '}
              {stat.unit} {stat.period}
            </li>
          ))}
        </ul>

        <p className="micro" style={{textAlign: 'center', marginTop: '0.75rem', opacity: 0.6}}>
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}
