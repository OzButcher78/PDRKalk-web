'use client';

import type {CSSProperties} from 'react';
import {useTranslations} from 'next-intl';
import Shot from './Shot';
import SectionHead from './SectionHead';
import Badge from './Badge';
import {groupIcons} from '@/lib/icons';

type Item = {icon: string; title: string; desc: string; file?: string; alt?: string};

export default function Security({showPrivacy = true, locale}: {showPrivacy?: boolean; locale?: string} = {}) {
  const t = useTranslations('security');
  const items = t.raw('items') as Item[];

  return (
    <section
      id="data"
      className="section theme-dark bg-glow-blue"
      style={{background: 'var(--ink)'}}
      aria-labelledby="data-title"
    >
      <div className="container">
        <SectionHead
          id="data-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
          center
        />

        <div className="sec-grid">
          {items.map((item, i) => (
            <article key={i} className="card-dark" style={{['--accent' as string]: 'var(--blue)'} as CSSProperties}>
              <div className="icon-tile-dark" aria-hidden>{groupIcons[item.icon] ?? groupIcons.shield}</div>
              <h3 className="t-h3" style={{marginTop: '0.9rem'}}>{item.title}</h3>
              <p className="small" style={{margin: '0.6rem 0 0', color: 'var(--text-dark-mute)'}}>{item.desc}</p>

              {item.file && item.alt && (
                <div className="shot-frame" style={{marginTop: '1.1rem'}}>
                  <Shot
                    file={item.file}
                    alt={item.alt}
                    sizes="(min-width: 1024px) 22vw, calc(100vw - 3rem)"
                    ratio="4 / 3"
                    objectPosition="top center"
                  />
                </div>
              )}
            </article>
          ))}
        </div>

        <p style={{marginTop: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center'}}>
          <Badge kind="ai">{t('aiNote')}</Badge>
          {showPrivacy && locale && (
            <a href={`/${locale}/privacy/`} className="link-more">
              {t('privacyLink')} <span aria-hidden>→</span>
            </a>
          )}
        </p>
      </div>
    </section>
  );
}
