import type {Metadata} from 'next';
import {getFormatter, getTranslations, setRequestLocale} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Badge from '@/components/Badge';
import {BreadcrumbJsonLd} from '@/components/JsonLd';
import {routing} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {APP_VERSION} from '@/lib/site';
import {releases, type Release} from '@/data/releases';

type Props = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'updates'});

  return pageMetadata({
    locale,
    path: '/updates/',
    title: t('metaTitle'),
    description: t('metaDescription'),
    type: 'article',
  });
}

/** German is canonical; a localized array that drifted in length is ignored. */
function itemsFor(release: Release, locale: string): string[] {
  const localized =
    locale === 'en' ? release.itemsEn :
    locale === 'fr' ? release.itemsFr :
    locale === 'it' ? release.itemsIt :
    undefined;
  if (!localized || localized.length !== release.items.length) return release.items;
  return localized;
}

// The word only — French writes "Nouveau : …" with a space before the colon,
// so the separator is matched separately.
const KIND_WORDS: Record<'new' | 'improved' | 'fix', string[]> = {
  new:      ['Neu', 'New', 'Nouveau', 'Novità', 'Nuovo'],
  improved: ['Verbessert', 'Improved', 'Amélioré', 'Migliorato'],
  fix:      ['Fix', 'Correctif', 'Correzione'],
};

function kindOf(line: string): {kind: 'new' | 'improved' | 'fix'; text: string} {
  for (const kind of ['new', 'improved', 'fix'] as const) {
    for (const word of KIND_WORDS[kind]) {
      if (!line.startsWith(word)) continue;
      const rest = line.slice(word.length).trimStart();
      if (!rest.startsWith(':')) continue;
      return {kind, text: rest.slice(1).trim()};
    }
  }
  return {kind: 'improved', text: line};
}

export default async function UpdatesPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'updates'});
  const nav = await getTranslations({locale, namespace: 'nav'});
  const labels = await getTranslations({locale, namespace: 'pages.labels'});
  const format = await getFormatter({locale});
  const home = `/${locale}/`;

  return (
    <>
      <a href="#updates-title" className="skip-link">{nav('skipToContent')}</a>
      <Navbar />

      <main>
        <section className="section theme-dark bg-grid" style={{background: 'var(--ink)'}} aria-labelledby="updates-title">
          <div className="container--text">
            <nav aria-label="Breadcrumb">
              <ol className="crumbs">
                <li><a href={home}>{labels('home')}</a> <span aria-hidden>›</span></li>
                <li aria-current="page">{t('title')}</li>
              </ol>
            </nav>

            <h1 id="updates-title" tabIndex={-1} className="t-h1" style={{fontSize: 'clamp(2rem, 4.2vw, 3.2rem)'}}>{t('title')}</h1>
            <p className="lead" style={{marginTop: '1rem'}}>{t('intro', {version: APP_VERSION})}</p>

            <p style={{margin: '1.5rem 0 3rem'}}>
              <a href={`${home}#download`} className="btn btn-red">{t('downloadLink')}</a>
            </p>

            {releases.map(release => {
              const items = itemsFor(release, locale).map(kindOf);
              const grouped = {
                new: items.filter(i => i.kind === 'new'),
                improved: items.filter(i => i.kind === 'improved'),
                fix: items.filter(i => i.kind === 'fix'),
              };
              return (
                <article key={release.id} className="rel-item">
                  <div className="rel-head">
                    <h2 className="rel-version">{release.version}</h2>
                    <time className="rel-date" dateTime={release.date}>
                      {format.dateTime(new Date(release.date), {year: 'numeric', month: 'long', day: 'numeric'})}
                    </time>
                    <Badge kind={release.status === 'public' ? 'released' : 'testing'}>
                      {release.status === 'public' ? t('publicBadge') : t('testingBadge')}
                    </Badge>
                  </div>

                  {release.status === 'testing' && (
                    <p className="micro" style={{color: 'var(--orange)', margin: '0 0 0.75rem'}}>{t('testingNote')}</p>
                  )}

                  {(['new', 'improved', 'fix'] as const).map(kind => (
                    grouped[kind].length > 0 && (
                      <div key={kind}>
                        <h3 className="rel-kind">{t(`kinds.${kind}` as 'kinds.new')}</h3>
                        <ul className="rel-list">
                          {grouped[kind].map((item, i) => <li key={i}>{item.text}</li>)}
                        </ul>
                      </div>
                    )
                  ))}
                </article>
              );
            })}

            <p style={{marginTop: '2rem'}}>
              <a href={home} className="link-more">{t('backHome')} <span aria-hidden>→</span></a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />

      <BreadcrumbJsonLd
        items={[
          {name: labels('home'), url: home},
          {name: t('title'), url: `${home}updates/`},
        ]}
      />
    </>
  );
}
