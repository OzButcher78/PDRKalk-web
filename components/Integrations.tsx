'use client';

import type {CSSProperties} from 'react';
import {useTranslations} from 'next-intl';
import SectionHead from './SectionHead';
import Badge from './Badge';
import type {BadgeKind} from './Badge';
import {groupIcons, ChevronRight} from '@/lib/icons';
import {pageHref} from '@/data/pages';

type FlowNode = {title: string; badge?: string; badgeLabel?: string};
type Tile = {key: string; title: string; desc: string; chips: string[]; badge?: string};
type Provider = {name: string; region: string; recommended?: boolean};

const TILE_ICON: Record<string, string> = {
  ai: 'bolt',
  accounting: 'wallet',
  einvoice: 'invoice',
  nas: 'devices',
};

type Props = {
  /** AI tile + privacy deep link — hidden on /au. */
  showAi?: boolean;
  /** "Import im Detail" link — hidden on /au, which has no subpages. */
  locale?: string;
};

export default function Integrations({showAi = true, locale}: Props = {}) {
  const t = useTranslations('integrations');
  const ai = useTranslations('optionalAi');
  const badges = useTranslations('badges');
  const flow = t.raw('flow') as {in: FlowNode[]; out: FlowNode[]};
  const tiles = (t.raw('tiles') as Tile[]).filter(tile => tile.key !== 'ai' || showAi);
  const providers = showAi && ai.has('providers') ? (ai.raw('providers') as Provider[]) : [];

  return (
    <section id="import" className="section theme-dark bg-grid" style={{background: 'var(--ink)'}} aria-labelledby="import-title">
      <div className="container">
        <SectionHead
          id="import-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
          center
        />

        <div className="int-flow">
          <div className="int-col">
            <p className="int-col__label" id="int-in">{t('inLabel')}</p>
            <ul aria-labelledby="int-in">
              {flow.in.map((node, i) => (
                <li key={i}>
                  {node.title}
                  {node.badge && node.badgeLabel && (
                    <Badge kind={node.badge as BadgeKind}>{node.badgeLabel}</Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="int-arrow" aria-hidden>{ChevronRight}</div>

          <div className="int-app" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <picture>
              <source type="image/webp" srcSet="/logo-320.webp" />
              <img src="/logo-320.png" alt={t('appLabel')} width={320} height={86} style={{width: '100%', maxWidth: '190px', height: 'auto', display: 'block'}} />
            </picture>
          </div>

          <div className="int-arrow" aria-hidden>{ChevronRight}</div>

          <div className="int-col">
            <p className="int-col__label" id="int-out">{t('outLabel')}</p>
            <ul aria-labelledby="int-out">
              {flow.out.map((node, i) => (
                <li key={i}>
                  {node.title}
                  {node.badge && node.badgeLabel && (
                    <Badge kind={node.badge as BadgeKind}>{node.badgeLabel}</Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="int-tiles">
          {tiles.map(tile => (
            <article
              key={tile.key}
              id={tile.key === 'ai' ? 'ai' : undefined}
              className="card-dark"
              style={{['--accent' as string]: tile.key === 'ai' ? 'var(--blue)' : 'var(--steel)'} as CSSProperties}
            >
              <div className="icon-tile-dark" aria-hidden>{groupIcons[TILE_ICON[tile.key] ?? 'package']}</div>
              <h3 className="t-h3" style={{marginTop: '0.9rem'}}>{tile.title}</h3>
              {tile.badge && (
                <div className="badge-row" style={{marginTop: '0.5rem'}}>
                  <Badge kind={tile.badge as BadgeKind}>
                    {tile.badge === 'ai' ? ai('badge') : badges(tile.badge as 'windows')}
                  </Badge>
                </div>
              )}
              <p className="small" style={{margin: '0.6rem 0 0', color: 'var(--text-dark-mute)'}}>{tile.desc}</p>

              {tile.key === 'ai' && providers.length > 0 ? (
                <>
                  <div className="int-chips">
                    {providers.map(p => (
                      <span key={p.name} className="int-chip" data-region={p.region}>
                        {p.name} · {p.region}
                        {p.recommended && (
                          <>
                            <span aria-hidden> ★</span>
                            <span className="sr-only"> ({ai('recommendedLabel')})</span>
                          </>
                        )}
                      </span>
                    ))}
                  </div>
                  <p className="micro" style={{margin: '0.7rem 0 0', color: 'var(--text-dark-mute)'}}>
                    ★ {ai('recommendedLabel')} · {ai('providersNote')}
                  </p>
                  {locale && (
                    <p style={{margin: '0.9rem 0 0'}}>
                      <a href={`/${locale}/privacy/#ai-privacy`} className="link-more">
                        {ai('learnMore')} <span aria-hidden>→</span>
                      </a>
                    </p>
                  )}
                </>
              ) : (
                tile.chips.length > 0 && (
                  <div className="int-chips">
                    {tile.chips.map(chip => <span key={chip} className="int-chip">{chip}</span>)}
                  </div>
                )
              )}
            </article>
          ))}
        </div>

        {locale && (
          <p style={{marginTop: '1.75rem'}}>
            <a href={pageHref('import', locale)} className="link-more">
              {t('detailLink')} <span aria-hidden>→</span>
            </a>
          </p>
        )}

        {t.has('trademarkNote') && (
          <p className="micro" style={{marginTop: '1.5rem', opacity: 0.6, maxWidth: '70ch'}}>
            {t('trademarkNote')}
          </p>
        )}
      </div>
    </section>
  );
}
