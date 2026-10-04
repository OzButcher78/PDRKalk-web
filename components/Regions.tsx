'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import SectionHead from './SectionHead';
import Badge from './Badge';

type RegionItem = {code: string; name: string; facts: string[]; note?: string};

export default function Regions() {
  const t = useTranslations('regions');
  const country = useTranslations('contact');
  const items = t.raw('items') as RegionItem[];
  const single = items.length === 1;

  return (
    <section
      id="regions"
      className="section section--band theme-dark bg-hail"
      style={{background: 'var(--ink-mid)'}}
      aria-labelledby="regions-title"
    >
      <div className="container">
        <SectionHead
          id="regions-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
          center
        />

        <ul className="rg-grid" style={single ? {gridTemplateColumns: 'minmax(0, 1fr)'} : undefined}>
          {items.map(item => (
            <li key={item.code}>
              <div className="rg-tile">
                <Image
                  src={`/${item.code}.jpg`}
                  alt=""
                  title={country(`country_${item.code}` as 'country_ch')}
                  width={209}
                  height={125}
                  style={{height: '24px', width: 'auto'}}
                />
                <span className="rg-name">{item.name}</span>
                <ul className="rg-facts">
                  {item.facts.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                {item.note && (
                  <span className="badge-row"><Badge kind="soon">{item.note}</Badge></span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="rg-foot">
          <span>{t('reverseCharge')}</span>
          <span style={{fontStyle: 'italic', opacity: 0.75}}>{t('more')}</span>
        </p>
      </div>
    </section>
  );
}
