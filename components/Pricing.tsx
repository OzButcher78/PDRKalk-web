'use client';

import {useTranslations} from 'next-intl';
import SectionHead from './SectionHead';
import ComparisonTables from './ComparisonTables';
import {BUY_URL, PRICE_CHF, TRIAL_DAYS, TRIAL_URL, resolveCta} from '@/lib/site';
import {interpolate} from '@/lib/interpolate';

type Licence = {
  badge: string;
  badgeNote: string;
  price: string;
  priceSuffix: string;
  priceEur: string;
  vatNote: string;
  illustration: string;
  featuresTitle: string;
  features: string[];
  notesTitle: string;
  notes: string[];
  cta: string;
  ctaTrial: string;
  note: string;
};
type Journey = {title: string; steps: Array<{t: string; d: string}>};

export default function Pricing({home = '/'}: {home?: string} = {}) {
  const t = useTranslations('pricing');
  const licence = t.raw('licence') as Licence;
  const journey = t.raw('journey') as Journey;

  return (
    <section id="pricing" className="section theme-light" style={{background: '#fff'}} aria-labelledby="pricing-title">
      <div className="container">
        <SectionHead
          id="pricing-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
          center
        />

        <div className="price-layout">
          <div className="price-card">
            <div className="price-card__bar" aria-hidden />
            <div className="price-card__body">
              <div className="ruler" style={{color: '#fff', marginBottom: '1.5rem'}} aria-hidden />

              <div style={{textAlign: 'center'}}>
                <span className="badge badge--new">{licence.badge}</span>
                <p className="micro" style={{margin: '0.6rem 0 1.4rem', color: 'var(--steel)'}}>{licence.badgeNote}</p>

                <p className="price-amount" style={{margin: 0}}>
                  {t('licence.price', {price: PRICE_CHF})}
                </p>
                <p className="price-suffix" style={{margin: '0.4rem 0 0'}}>{licence.priceSuffix}</p>
                <p className="micro" style={{margin: '1rem 0 0', color: 'var(--steel)'}}>
                  {interpolate(licence.priceEur)}
                  {licence.vatNote && <><br />{licence.vatNote}</>}
                </p>
                <p className="micro" style={{margin: '0.6rem 0 0', color: 'var(--green-glow)'}}>{interpolate(licence.illustration)}</p>
              </div>

              <div className="price-lists">
                <div>
                  <p className="price-list-title">{licence.featuresTitle}</p>
                  <ul className="ul-check ul-check--tick" style={{color: 'var(--text-dark-mute)'}}>
                    {licence.features.map((f, i) => <li key={i}>{interpolate(f)}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="price-list-title">{licence.notesTitle}</p>
                  <ul className="ul-check" style={{color: 'var(--text-dark-mute)'}}>
                    {licence.notes.map((n, i) => <li key={i}>{interpolate(n)}</li>)}
                  </ul>
                </div>
              </div>

              <div className="price-ctas">
                <a href={resolveCta(BUY_URL, home)} className="btn btn-red btn--lg">{licence.cta}</a>
                <a href={resolveCta(TRIAL_URL, home)} className="btn btn-ghost">
                  {t('licence.ctaTrial', {days: TRIAL_DAYS})}
                </a>
              </div>

              <p className="micro" style={{margin: '1rem 0 0', color: 'var(--steel)', fontStyle: 'italic'}}>{licence.note}</p>
            </div>
          </div>

          <div>
            <h3 className="t-h3" style={{marginBottom: '1.25rem'}}>{journey.title}</h3>
            <ol className="journey">
              {journey.steps.map((step, i) => (
                <li key={i} data-n={i + 1}>
                  <p className="journey-t">{t(`journey.steps.${i}.t`, {days: TRIAL_DAYS})}</p>
                  <p className="journey-d">{interpolate(step.d)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <ComparisonTables />
      </div>
    </section>
  );
}
