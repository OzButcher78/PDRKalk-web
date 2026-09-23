'use client';

import {useTranslations} from 'next-intl';
import SectionHead from './SectionHead';
import Badge from './Badge';
import type {BadgeKind} from './Badge';
import {APP_VERSION} from '@/lib/site';
import {interpolate} from '@/lib/interpolate';
import {pageHref} from '@/data/pages';

type Item = {title: string; desc: string; status?: string; version?: string};
type Featured = {
  badges: string[];
  title: string;
  desc: string;
  facts: string[];
  flow: string[];
  cta: string;
};
type Also = {title: string; items: Array<{title: string; desc: string}>};

const Chevron = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * `locale` is passed explicitly rather than read from useLocale() because on
 * /au the provider locale is `en-AU`, which is not a routing locale.
 */
export default function WhatsNew({locale}: {locale?: string} = {}) {
  const t = useTranslations('whatsNew');
  const items = t.raw('items') as Item[];
  const also = t.raw('also') as Also;
  const featured = t.has('featured') ? (t.raw('featured') as Featured) : null;

  return (
    <section
      id="whats-new"
      className="section theme-dark bg-hail"
      style={{background: 'var(--ink-mid)'}}
      aria-labelledby="whats-new-title"
    >
      <div className="container">
        <SectionHead
          id="whats-new-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
        >
          <p style={{margin: '1.25rem 0 0'}}>
            <span className="wn-version">{t('versionChip', {version: APP_VERSION})}</span>
          </p>
        </SectionHead>

        <div className="wn-grid">
          {featured && (
            <article className="card-dark wn-featured" style={{['--accent' as string]: 'var(--red)'}}>
              <span className="card-dark__bar" aria-hidden />
              <div className="badge-row" style={{marginBottom: '0.9rem'}}>
                {featured.badges.map((b, i) => (
                  <Badge key={i} kind={i === 0 ? 'new' : 'region'}>
                    {interpolate(b)}
                  </Badge>
                ))}
              </div>
              <h3 className="t-h3" style={{fontSize: 'clamp(1.25rem, 2vw, 1.6rem)'}}>{featured.title}</h3>
              <p className="small" style={{margin: '0.75rem 0 0', color: 'var(--text-dark-mute)'}}>{featured.desc}</p>

              <ul className="ul-check ul-check--tick" style={{marginTop: '1.1rem'}}>
                {featured.facts.map((f, i) => <li key={i}>{f}</li>)}
              </ul>

              {/* A flat list: `display: contents` on an <li> drops it from the
                  accessibility tree, so the <ol> would report no items. */}
              <ol className="wn-flow">
                {featured.flow.map((node, i) => (
                  <li key={i} className="wn-flow__node">
                    {node}
                    {i < featured.flow.length - 1 && (
                      <span className="wn-flow__arrow" aria-hidden>{Chevron}</span>
                    )}
                  </li>
                ))}
              </ol>

              {locale && (
                <p style={{margin: '1.25rem 0 0'}}>
                  <a href={pageHref('import', locale)} className="link-more">
                    {featured.cta} <span aria-hidden>→</span>
                  </a>
                </p>
              )}
            </article>
          )}

          {items.map((item, i) => {
            const kind: BadgeKind = (item.status as BadgeKind) ?? 'new';
            return (
              <article key={i} className="card-dark" style={{['--accent' as string]: 'var(--blue)'}}>
                <span className="card-dark__bar" aria-hidden />
                {item.version && (
                  <div className="badge-row" style={{marginBottom: '0.8rem'}}>
                    <Badge kind={kind}>v{item.version}</Badge>
                  </div>
                )}
                <h3 className="t-h3">{item.title}</h3>
                <p className="small" style={{margin: '0.6rem 0 0', color: 'var(--text-dark-mute)'}}>{item.desc}</p>
              </article>
            );
          })}
        </div>

        <div className="wn-also">
          <h3 className="t-h3">{also.title}</h3>
          <ul>
            {also.items.map((item, i) => (
              <li key={i}><strong>{item.title}</strong> — {item.desc}</li>
            ))}
          </ul>
        </div>

        {locale && (
          <p style={{marginTop: '1.5rem'}}>
            <a href={`/${locale}/updates/`} className="link-more">
              {t('allLink')} <span aria-hidden>→</span>
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
