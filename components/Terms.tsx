'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {interpolate} from '@/lib/interpolate';
import {TERMS_VERSION} from '@/lib/site';

type Clause = string | {text: string; bullets: string[]};
type Section = {id: string; title: string; items: Clause[]};

type Props = {
  /** Page home — `/de/` or `/au/`; prefixes the breadcrumb link. */
  home: string;
  /** Root-relative path of the PDF copy of these terms (lib/site.ts TERMS_PDF). */
  pdfHref: string;
  /** Privacy page, when the variant has one (/au has none). */
  privacyHref?: string;
};

const clauseText = (c: Clause) => (typeof c === 'string' ? c : c.text);
const clauseBullets = (c: Clause) => (typeof c === 'string' ? [] : c.bullets);

/**
 * The full terms, numbered N.m from the `terms.sections` array. Shared by the
 * four routing locales and the /au variant — all copy comes from the provider
 * above, so the component never reads the locale itself.
 */
export default function Terms({home, pdfHref, privacyHref}: Props) {
  const t = useTranslations('terms');
  const sections = t.raw('sections') as Section[];
  const sellerLines = t.raw('sellerLines') as string[];

  return (
    <section className="section theme-dark bg-grid order-page" style={{background: 'var(--ink)'}} aria-labelledby="terms-title">
      <div className="container--text">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li><a href={home}>{t('crumbHome')}</a> <span aria-hidden>›</span></li>
            <li aria-current="page">{t('title')}</li>
          </ol>
        </nav>

        <h1 id="terms-title" tabIndex={-1} className="t-h1" style={{fontSize: 'clamp(2rem, 4.2vw, 3.2rem)'}}>{t('title')}</h1>
        <p className="micro" style={{margin: '0.6rem 0 0', letterSpacing: '0.04em'}}>
          {t('lastUpdated')} · {t('versionLabel')} {TERMS_VERSION}
        </p>
        <p className="lead" style={{marginTop: '1rem'}}>{t('intro')}</p>

        <div className="order-terms" style={{marginTop: '1.5rem'}}>
          <p style={{margin: 0}}>
            <strong>{t('sellerTitle')}</strong>
            {sellerLines.map(line => (
              <span key={line}><br />{line}</span>
            ))}
          </p>
          <p style={{margin: '1.1rem 0 0'}}>
            <a href={pdfHref} className="btn btn-red" download>{t('pdfLabel')}</a>
          </p>
          <p className="micro order-terms__meta">{t('pdfNote')}</p>
        </div>

        {sections.map((section, i) => (
          <section key={section.id} id={section.id} style={{marginTop: '2.5rem'}} aria-labelledby={`terms-${section.id}`}>
            <h2 id={`terms-${section.id}`} className="order-kicker">{i + 1}. {section.title}</h2>
            <ol style={{listStyle: 'none', padding: 0, margin: '0.8rem 0 0'}}>
              {section.items.map((clause, j) => (
                <li key={j} style={{display: 'grid', gridTemplateColumns: '3rem 1fr', gap: '0.5rem', marginTop: j === 0 ? 0 : '0.7rem'}}>
                  <span style={{color: 'var(--steel)', fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{i + 1}.{j + 1}</span>
                  <div>
                    <p style={{margin: 0}}>{interpolate(clauseText(clause))}</p>
                    {clauseBullets(clause).length > 0 && (
                      <ul style={{paddingLeft: '1.2rem', margin: '0.45rem 0 0'}}>
                        {clauseBullets(clause).map((bullet, k) => (
                          <li key={k} style={{marginTop: k === 0 ? 0 : '0.25rem'}}>{interpolate(bullet)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {privacyHref && (
          <p className="micro" style={{marginTop: '2.5rem'}}>
            <Link href={privacyHref} className="tap-link" style={{color: 'var(--steel)'}}>{t('privacyLink')}</Link>
          </p>
        )}
      </div>
    </section>
  );
}
