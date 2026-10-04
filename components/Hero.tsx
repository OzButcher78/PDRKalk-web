'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import Shot from './Shot';
import {groupIcons} from '@/lib/icons';
import {PRICE_CHF, PRICE_EUR, TRIAL_DAYS, TRIAL_URL} from '@/lib/site';

type RegionCode = 'ch' | 'de' | 'at' | 'au' | 'be' | 'nl';
const REGION_FLAGS: readonly RegionCode[] = ['ch', 'de', 'at', 'au', 'be', 'nl'];

type Chip = {icon: string; label: string};
type Stack = {base: string; card: string; doc: string; labels: string[]};

type Props = {
  regions?: readonly RegionCode[];
  /** Anchor for the secondary CTA — /au has no demo section. */
  demoHref?: string;
};

export default function Hero({regions = REGION_FLAGS, demoHref = '#demo'}: Props = {}) {
  const t = useTranslations('hero');
  const country = useTranslations('contact');
  const chips = t.raw('trustChips') as Chip[];
  const stack = t.raw('stack') as Stack;
  const isAu = regions.length === 1 && regions[0] === 'au';

  const files = isAu
    ? {base: 'au/dashboard.jpg', card: 'au/hail-editor-triage.jpg', doc: 'au/print-preview-copy-invoice.jpg'}
    : {base: 'dashboard.jpg', card: 'hagel-auftrag.jpg', doc: 'pdf-rechnung.jpg'};

  return (
    <section id="hero" tabIndex={-1} className="section hero-section theme-dark bg-grid" aria-labelledby="hero-title">
      <div className="hero-stripe" aria-hidden />

      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow fade-up">{t('eyebrow')}</span>

          <h1 id="hero-title" className="t-h1 fade-up-1">
            {t('title')}
            <span className="hero-accent fade-up-2">{t('titleAccent')}</span>
          </h1>

          <p className="lead fade-up-3" style={{marginTop: '1.25rem'}}>{t('subtitle')}</p>

          <div className="hero-ctas fade-up-4">
            <a href={TRIAL_URL} className="btn btn-red btn--lg">
              {t('ctaPrimary', {days: TRIAL_DAYS})}
            </a>
            <a href={demoHref} className="btn btn-ghost btn--lg">
              {t('ctaSecondary')}
            </a>
          </div>

          <p className="hero-try micro fade-up-4">{t('tryNote')}</p>

          <div className="fade-up-5">
            <p className="hero-price">
              <span className="hero-price__dot trust-dot" aria-hidden />
              {t('priceChip', {price: PRICE_CHF})}
            </p>
            <p className="hero-price__sub micro">{t('priceChipSub', {priceEur: PRICE_EUR})}</p>
          </div>

          <ul className="hero-chips fade-up-5">
            {chips.map((chip, i) => (
              <li key={i}>
                <span aria-hidden style={{display: 'inline-flex', width: 15, height: 15}}>
                  {groupIcons[chip.icon] ?? groupIcons.bolt}
                </span>
                {chip.label}
                {chip.icon === 'globe' && regions.length > 1 && (
                  <span className="hero-chip-flags" aria-hidden>
                    {regions.map(code => (
                      <Image
                        key={code}
                        src={`/${code}.jpg`}
                        alt=""
                        title={country(`country_${code}` as 'country_ch')}
                        width={209}
                        height={125}
                      />
                    ))}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual fade-up-3">
          <div className="hero-glow" aria-hidden />
          <figure className="hero-stack" style={{margin: 0}}>
            <div className="hero-stack__base">
              <div className="shot-frame" style={{height: '100%'}}>
                <Shot
                  file={files.base}
                  alt={stack.base}
                  priority
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  ratio="4 / 3"
                  objectPosition="top center"
                />
              </div>
            </div>

            <div className="hero-stack__card">
              <div className="shot-frame">
                <Shot
                  file={files.card}
                  alt={stack.card}
                  sizes="(min-width: 1024px) 26vw, 55vw"
                  ratio="16 / 11"
                  objectPosition={isAu ? '70% 25%' : '62% 28%'}
                />
              </div>
            </div>

            <div className="hero-stack__doc">
              <div className="shot-frame">
                <Shot
                  file={files.doc}
                  alt={stack.doc}
                  sizes="12vw"
                  ratio="210 / 297"
                  objectPosition="top center"
                />
              </div>
            </div>

            <ol className="hero-stack__labels">
              {stack.labels.map((label, i) => (
                <li key={i} className="hero-label">
                  <span className="hero-label__n" aria-hidden>{i + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
          </figure>
        </div>
      </div>
    </section>
  );
}
