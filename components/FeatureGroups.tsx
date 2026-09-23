'use client';

import type {CSSProperties} from 'react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import SectionHead from './SectionHead';
import Badge from './Badge';
import type {BadgeKind} from './Badge';
import {groupIcons} from '@/lib/icons';
import {interpolate} from '@/lib/interpolate';
import {pageHref, type PageKey} from '@/data/pages';

type Item = {t: string; d: string; status?: string};
export type Group = {
  key: string;
  icon: string;
  heading: string;
  summary: string;
  highlights: Item[];
  items: Item[];
  badges?: string[];
  page?: string;
};

const ACCENTS: Record<string, string> = {
  capture: 'var(--red)',
  documents: 'var(--red)',
  invoicing: 'var(--green)',
  insurance: 'var(--red)',
  team: 'var(--blue)',
  analytics: 'var(--blue)',
  workspace: 'var(--blue)',
  data: 'var(--blue)',
};

export default function FeatureGroups({locale}: {locale?: string} = {}) {
  const t = useTranslations('features');
  const badges = useTranslations('badges');
  const groups = t.raw('groups') as Group[];
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const allOpen = groups.every(g => open[g.key]);

  const toggleAll = () => {
    setOpen(allOpen ? {} : Object.fromEntries(groups.map(g => [g.key, true])));
  };

  return (
    <section id="features" className="section theme-light" style={{background: '#fff'}} aria-labelledby="features-title">
      <div className="container">
        <SectionHead
          id="features-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
          center
        />

        <div id="more">
          <div className="fg-expand-all">
            <button type="button" className="btn btn-ghost-dark btn--sm" onClick={toggleAll}>
              {allOpen ? t('collapseAll') : t('expandAll')}
            </button>
          </div>

          <div className="fg-grid">
            {groups.map(group => {
              const isOpen = Boolean(open[group.key]);
              return (
                <article
                  key={group.key}
                  id={`g-${group.key}`}
                  className="feature-card-mesh fg-card"
                  style={{['--accent' as string]: ACCENTS[group.key] ?? 'var(--red)'} as CSSProperties}
                >
                  <div className="feature-icon-tile" aria-hidden>{groupIcons[group.icon]}</div>

                  <h3 className="t-h3">{group.heading}</h3>
                  <p className="fg-summary">{group.summary}</p>

                  <ul className="ul-check ul-check--tick">
                    {group.highlights.map((h, i) => (
                      <li key={i}><strong style={{color: 'var(--ink)', fontWeight: 600}}>{interpolate(h.t)}</strong> — {interpolate(h.d)}</li>
                    ))}
                  </ul>

                  {group.badges && group.badges.length > 0 && (
                    <div className="badge-row" style={{marginTop: '1rem'}}>
                      {group.badges.map((b, i) => (
                        <Badge key={i} kind="new" className="theme-light">{interpolate(b)}</Badge>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="fg-toggle"
                    aria-expanded={isOpen}
                    aria-controls={`fg-body-${group.key}`}
                    onClick={() => setOpen(prev => ({...prev, [group.key]: !prev[group.key]}))}
                  >
                    {t('allLabel', {n: group.items.length})}
                    <svg
                      width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"
                      className={`accordion-chevron${isOpen ? ' open' : ''}`}
                    >
                      <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div id={`fg-body-${group.key}`} className={`accordion-body${isOpen ? ' open' : ''}`}>
                    <div>
                      <ul className="fg-items">
                        {group.items.map((item, i) => (
                          <li key={i}>
                            <strong>{interpolate(item.t)}</strong> — {interpolate(item.d)}
                            {item.status && badges.has(item.status) && (
                              <>
                                {' '}
                                <Badge kind={item.status as BadgeKind} className="theme-light">
                                  {badges(item.status as 'new')}
                                </Badge>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {group.page && locale && (
                    <p style={{margin: '1.1rem 0 0'}}>
                      <a href={pageHref(group.page as PageKey, locale)} className="link-more">
                        {t('moreLabel', {title: group.heading})} <span aria-hidden>→</span>
                      </a>
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {t.has('disclaimer') && (
          <p className="micro" style={{textAlign: 'center', maxWidth: '680px', margin: '2.5rem auto 0', color: '#94a3b8'}}>
            {t('disclaimer')}
          </p>
        )}
      </div>
    </section>
  );
}
