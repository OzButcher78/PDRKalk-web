'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import SectionHead from './SectionHead';
import {
  ANDROID_DOWNLOAD_URL,
  APP_VERSION,
  BUY_URL,
  TRIAL_DAYS,
  WINDOWS_DOWNLOAD_URL,
  resolveCta,
} from '@/lib/site';

type Platform = {key: 'windows' | 'android'; href: string; badge: string; w: number; h: number};

const PLATFORMS: Platform[] = [
  {key: 'windows', href: WINDOWS_DOWNLOAD_URL, badge: '/a-microsoft-352.png', w: 352, h: 114},
  {key: 'android', href: ANDROID_DOWNLOAD_URL, badge: '/android-352.png', w: 352, h: 120},
];

export default function Download({home = '/'}: {home?: string} = {}) {
  const t = useTranslations('download');
  const chips = t.raw('chips') as string[];

  return (
    <section
      id="download"
      className="section theme-dark bg-glow-blue"
      style={{background: 'var(--ink)'}}
      aria-labelledby="download-title"
    >
      <div className="container--narrow">
        <SectionHead
          id="download-title"
          eyebrow={t('eyebrow')}
          title={t('title', {days: TRIAL_DAYS})}
          lead={t('subtitle', {days: TRIAL_DAYS})}
          center
        />

        <div className="dl-cards">
          {PLATFORMS.map(({key, href, badge, w, h}) => (
            <div key={key} className="dl-card">
              <span className="eyebrow">{t(`${key}.eyebrow`)}</span>
              <h3 className="t-h3" style={{fontSize: 'clamp(1.4rem, 3vw, 1.85rem)'}}>{t(`${key}.name`)}</h3>
              <p className="small" style={{margin: 0, color: 'var(--text-dark-mute)'}}>{t(`${key}.system`)}</p>
              <p className="micro" style={{margin: 0, color: 'var(--text-light-mute)', fontVariantNumeric: 'tabular-nums'}}>
                {t(`${key}.version`, {version: APP_VERSION})}
              </p>

              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                download
                aria-label={t(`${key}.button`)}
                style={{display: 'block', lineHeight: 0}}
              >
                <Image src={badge} alt="" width={w} height={h} className="dl-badge" aria-hidden />
              </a>

              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="btn btn-red download-btn"
              >
                {t(`${key}.button`)} <span aria-hidden>↓</span>
              </a>
            </div>
          ))}
        </div>

        <ul className="dl-chips">
          {chips.map(chip => <li key={chip}>{chip}</li>)}
        </ul>

        <p className="micro" style={{textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-light-mute)', fontStyle: 'italic'}}>
          {t('footnote')}
        </p>

        <p style={{textAlign: 'center', marginTop: '1.25rem'}}>
          <a href={resolveCta(BUY_URL, home)} className="link-more">
            {t('buyHint')} <span aria-hidden>→</span>
          </a>
        </p>
      </div>
    </section>
  );
}
