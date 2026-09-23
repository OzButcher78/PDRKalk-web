import {getTranslations} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Shot from '@/components/Shot';
import Badge from '@/components/Badge';
import MediaBlock from '@/components/MediaBlock';
import Faq from '@/components/Faq';
import {faqItems, type FaqItem} from '@/lib/faq';
import ComparisonTables from '@/components/ComparisonTables';
import ScreenshotStrip from '@/components/ScreenshotStrip';
import {BreadcrumbJsonLd, FaqJsonLd} from '@/components/JsonLd';
import {interpolate} from '@/lib/interpolate';
import {TRIAL_DAYS} from '@/lib/site';
import {PAGES, pageHref, type PageDef} from '@/data/pages';
import type {Group} from '@/components/FeatureGroups';

type Benefit = {t: string; d: string};
type Step = {t: string; d: string; file: string};

export default async function FeaturePage({page, locale}: {page: PageDef; locale: string}) {
  const t = await getTranslations({locale, namespace: `pages.${page.key}`});
  const labels = await getTranslations({locale, namespace: 'pages.labels'});
  const nav = await getTranslations({locale, namespace: 'nav'});
  const badges = await getTranslations({locale, namespace: 'badges'});
  const features = await getTranslations({locale, namespace: 'features'});
  const faq = await getTranslations({locale, namespace: 'faq'});

  const benefits = t.raw('benefits') as Benefit[];
  const steps = t.raw('steps') as Step[];
  const group = (features.raw('groups') as Group[]).find(g => g.key === page.group);
  const faqSubset = faqItems(faq.raw('items') as FaqItem[], page.faq);

  const home = `/${locale}/`;
  const url = pageHref(page.key, locale);
  const related = PAGES.filter(p => page.related.includes(p.key));

  return (
    <>
      <a href="#page-hero" className="skip-link">{nav('skipToContent')}</a>
      <Navbar />

      <main>
        <section id="page-hero" tabIndex={-1} className="section theme-dark bg-grid" style={{background: 'var(--ink)'}} aria-labelledby="page-title">
          <div className="container">
            <nav aria-label="Breadcrumb">
              <ol className="crumbs">
                <li><a href={home}>{labels('home')}</a> <span aria-hidden>›</span></li>
                <li aria-current="page">{t('eyebrow')}</li>
              </ol>
            </nav>

            <div className="hero-grid">
              <div>
                <span className="eyebrow">{t('eyebrow')}</span>
                {page.badge && (
                  <div className="badge-row" style={{marginBottom: '0.9rem'}}>
                    <Badge kind="new">{badges('new')}</Badge>
                    <Badge kind="region">{badges('region')}</Badge>
                  </div>
                )}
                <h1 id="page-title" className="t-h1" style={{fontSize: 'clamp(2rem, 4.2vw, 3.4rem)'}}>
                  {interpolate(t('title'))}
                </h1>
                <p className="lead" style={{marginTop: '1.25rem'}}>{interpolate(t('lead'))}</p>

                <div className="hero-ctas">
                  <a href={`${home}#download`} className="btn btn-red btn--lg">
                    {labels('ctaTitle', {days: TRIAL_DAYS})}
                  </a>
                  <a href={page.key === 'hail' ? `${home}#features` : `${home}#contact`} className="btn btn-ghost btn--lg">
                    {t('ctaSecondary')}
                  </a>
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-glow" aria-hidden />
                <div className="shot-frame">
                  <Shot
                    file={page.shots[0]}
                    alt={t('heroAlt')}
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    ratio="16 / 10"
                    objectPosition="top center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section theme-light" style={{background: '#fff'}} aria-labelledby="benefits-title">
          <div className="container">
            <h2 id="benefits-title" className="t-h2" style={{marginBottom: '2rem'}}>{labels('benefits')}</h2>
            <div className="fg-grid">
              {benefits.map((b, i) => (
                <article key={i} className="feature-card-mesh fg-card" style={{['--accent' as string]: 'var(--red)'}}>
                  <h3 className="t-h3">{interpolate(b.t)}</h3>
                  <p className="fg-summary" style={{marginTop: '0.6rem'}}>{interpolate(b.d)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section theme-light" style={{background: 'var(--fog)'}} aria-labelledby="steps-title">
          <div className="container">
            <h2 id="steps-title" className="t-h2" style={{marginBottom: '2.5rem'}}>{labels('howItWorks')}</h2>
            {steps.map((step, i) => (
              <MediaBlock
                key={i}
                eyebrow={labels('step', {n: i + 1})}
                title={interpolate(step.t)}
                desc={interpolate(step.d)}
                file={step.file}
                alt={`${t('eyebrow')} — ${interpolate(step.t)}`}
                flip={i % 2 === 1}
              />
            ))}
          </div>
        </section>

        {group && (
          <section className="section theme-light" style={{background: '#fff'}} aria-labelledby="group-title">
            <div className="container--narrow">
              <h2 id="group-title" className="t-h2" style={{marginBottom: '1.75rem'}}>{labels('allFeatures')}</h2>
              <ul className="fg-items" style={{gap: '0.9rem'}}>
                {group.items.map((item, i) => (
                  <li key={i} style={{fontSize: '0.95rem'}}>
                    <strong>{interpolate(item.t)}</strong> — {interpolate(item.d)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <ScreenshotStrip files={page.shots} title={t('screenshotsTitle')} />

        {page.showPricingTables && (
          <section className="section theme-light" style={{background: '#fff'}} aria-labelledby="tables-title">
            <div className="container">
              <h2 id="tables-title" className="sr-only">{labels('comparison')}</h2>
              <ComparisonTables id="comparison-page" defaultOpen />
            </div>
          </section>
        )}

        <Faq filter={page.faq} id="page-faq" />

        <section className="section theme-dark bg-glow-red" style={{background: 'var(--ink)'}} aria-labelledby="page-cta-title">
          <div className="container--text" style={{textAlign: 'center'}}>
            <h2 id="page-cta-title" className="t-h2">{labels('ctaTitle', {days: TRIAL_DAYS})}</h2>
            <p className="lead" style={{margin: '1rem auto 1.75rem'}}>{labels('ctaLead')}</p>
            <div className="hero-ctas" style={{justifyContent: 'center', marginTop: 0}}>
              <a href={`${home}#download`} className="btn btn-red btn--lg">{labels('ctaTrial')}</a>
              <a href={`${home}#contact`} className="btn btn-ghost btn--lg">{labels('ctaBuy')}</a>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="section section--band theme-light" style={{background: 'var(--fog)'}} aria-labelledby="related-title">
            <div className="container">
              <h2 id="related-title" className="t-h3" style={{marginBottom: '1.25rem'}}>{labels('related')}</h2>
              <ul style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem', listStyle: 'none', margin: 0, padding: 0}}>
                {related.map(p => (
                  <li key={p.key}>
                    <a href={pageHref(p.key, locale)} className="btn btn-ghost-dark btn--sm">
                      <RelatedLabel locale={locale} pageKey={p.key} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <BackToTop />

      <BreadcrumbJsonLd
        items={[
          {name: labels('home'), url: home},
          {name: t('eyebrow'), url},
        ]}
      />
      <FaqJsonLd items={faqSubset} />
    </>
  );
}

async function RelatedLabel({locale, pageKey}: {locale: string; pageKey: string}) {
  const t = await getTranslations({locale, namespace: 'pages'});
  return <>{t(`${pageKey}.eyebrow` as 'hail.eyebrow')}</>;
}
