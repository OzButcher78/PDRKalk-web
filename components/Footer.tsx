'use client';

import {useTranslations, useLocale} from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import ObfuscatedEmail from './ObfuscatedEmail';
import {
  ANDROID_DOWNLOAD_URL,
  APP_VERSION,
  ORDER_PATH,
  WINDOWS_DOWNLOAD_URL,
} from '@/lib/site';
import {PAGES, pageHref, type PageKey} from '@/data/pages';

type RegionCode = 'ch' | 'de' | 'at' | 'au' | 'be' | 'nl';
const REGION_FLAGS: readonly RegionCode[] = ['ch', 'de', 'at', 'au', 'be', 'nl'];

type Props = {
  regions?: readonly RegionCode[];
  /** Page root for anchor links — `/au/` on the Australian landing page. */
  basePath?: string;
  showPrivacy?: boolean;
};

const LINK_STYLE = {display: 'inline-block', padding: '0.15rem 0'} as const;

export default function Footer({regions = REGION_FLAGS, basePath, showPrivacy = true}: Props = {}) {
  const t = useTranslations('footer');
  const contact = useTranslations('contact');
  const locale = useLocale();

  const home = basePath ?? `/${locale}/`;
  // /au has no feature pages (only /au/order/), so the feature column is only
  // rendered for the routing locales (where `basePath` is not overridden).
  const showPages = !basePath;

  const productLinks: Array<{key: string; href: string}> = [
    {key: 'features', href: `${home}#features`},
    {key: 'workflow', href: `${home}#workflow`},
    {key: 'pricing', href: `${home}#pricing`},
    {key: 'faq', href: `${home}#faq`},
    {key: 'download', href: `${home}#download`},
  ];

  return (
    <footer className="theme-dark" style={{background: 'var(--ink)', borderTop: '1px solid rgba(232,0,29,0.2)', padding: '3.5rem 1.5rem 2.5rem'}}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand footer-col">
            <picture>
              <source type="image/webp" srcSet="/logo-320.webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-320.png" alt="PDR Kalk" width={320} height={86} style={{height: '42px', width: 'auto', display: 'block'}} />
            </picture>
            <p className="micro" style={{margin: '0.9rem 0 0', color: 'var(--steel)'}}>
              {t('company')} — {t('tagline')}
            </p>
            <p className="micro" style={{margin: '0.5rem 0 0', color: 'var(--steel)', fontStyle: 'italic'}}>
              {t('techNote')}
            </p>
            {/* A <div> has the generic role and cannot carry a name. */}
            <ul className="footer-flags" aria-label={t('regions')} style={{marginTop: '1rem'}}>
              {regions.map(code => (
                <li key={code} style={{display: 'flex'}}>
                  <Image
                    src={`/${code}.jpg`}
                    alt={contact(`country_${code}` as 'country_ch')}
                    title={contact(`country_${code}` as 'country_ch')}
                    width={209}
                    height={125}
                  />
                </li>
              ))}
            </ul>
            <p className="micro" style={{margin: '0.6rem 0 0', color: '#475569', fontStyle: 'italic'}}>{t('intl')}</p>
          </div>

          <nav className="footer-col" aria-labelledby="footer-product">
            <h2 className="footer-col-title" id="footer-product">{t('cols.product')}</h2>
            <ul>
              {productLinks.map(({key, href}) => (
                <li key={key}>
                  <a href={href} className="footer-link" style={LINK_STYLE}>
                    {t(`links.${key}` as 'links.features')}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {showPages && <FeaturePagesColumn locale={locale} title={t('cols.features')} />}

          <nav className="footer-col" aria-labelledby="footer-legal">
            <h2 className="footer-col-title" id="footer-legal">{t('cols.legal')}</h2>
            <ul>
              {showPrivacy && (
                <li>
                  <Link href={`/${locale}/privacy/`} className="footer-link" style={LINK_STYLE}>
                    {t('links.privacy')}
                  </Link>
                </li>
              )}
              {showPages && (
                <li>
                  <Link href={`/${locale}/updates/`} className="footer-link" style={LINK_STYLE}>
                    {t('links.updates')}
                  </Link>
                </li>
              )}
              <li>
                <a href={WINDOWS_DOWNLOAD_URL} className="footer-link" style={LINK_STYLE} target="_blank" rel="noopener noreferrer" download>
                  {t('links.windowsInstaller')}
                </a>
              </li>
              <li>
                <a href={ANDROID_DOWNLOAD_URL} className="footer-link" style={LINK_STYLE} target="_blank" rel="noopener noreferrer" download>
                  {t('links.androidApk')}
                </a>
              </li>
              <li>
                <a href={`${home}${ORDER_PATH}`} className="footer-link" style={LINK_STYLE}>{t('links.order')}</a>
              </li>
              <li>
                <a href={`${home}#contact`} className="footer-link" style={LINK_STYLE}>{t('links.contact')}</a>
              </li>
              <li>
                <ObfuscatedEmail
                  user={contact('emailUser')}
                  domain={contact('emailDomain')}
                  className="footer-link"
                  style={LINK_STYLE}
                />
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="micro" style={{margin: 0, color: '#475569'}}>{t('copyright')}</p>
          <p className="micro" style={{margin: 0, color: '#475569', fontVariantNumeric: 'tabular-nums'}}>
            {t('versionLabel', {version: APP_VERSION})}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Only rendered for the routing locales — /au ships no `pages` namespace. */
function FeaturePagesColumn({locale, title}: {locale: string; title: string}) {
  const p = useTranslations('pages');
  return (
    <nav className="footer-col" aria-labelledby="footer-features">
      <h2 className="footer-col-title" id="footer-features">{title}</h2>
      <ul>
        {PAGES.map(page => (
          <li key={page.key}>
            <Link href={pageHref(page.key as PageKey, locale)} className="footer-link" style={LINK_STYLE}>
              {p(`${page.key}.eyebrow` as 'hail.eyebrow')}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
