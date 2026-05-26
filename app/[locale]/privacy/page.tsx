import type {Metadata} from 'next';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {routing} from '@/i18n/routing';

const SITE_URL = 'https://pdrkalk.ch';

type Props = {
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'privacy'});

  const languages: Record<string, string> = {
    'x-default': `${SITE_URL}/de/privacy/`,
  };
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}/privacy/`;
  }

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy/`,
      languages,
    },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/${locale}/privacy/`,
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
    robots: {index: true, follow: true},
  };
}

export default async function PrivacyPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main
        style={{
          background: 'var(--ink)',
          color: 'rgba(255,255,255,0.92)',
          minHeight: '100vh',
          padding: '4rem 1.5rem 6rem',
        }}
      >
        <PrivacyContent />
      </main>
      <Footer />
    </>
  );
}

function PrivacyContent() {
  const t = useTranslations('privacy');
  const dataCollected = t.raw('dataCollectedItems') as string[];
  const dataNotCollected = t.raw('dataNotCollectedItems') as string[];

  return (
    <article
      style={{
        maxWidth: '760px',
        margin: '0 auto',
        fontFamily: 'Barlow, sans-serif',
        lineHeight: 1.7,
      }}
    >
      <h1
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '2.4rem',
          fontWeight: 800,
          letterSpacing: '0.02em',
          marginBottom: '0.5rem',
          color: '#fff',
        }}
      >
        {t('title')}
      </h1>
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--steel)',
          letterSpacing: '0.04em',
          marginTop: 0,
          marginBottom: '2rem',
        }}
      >
        {t('lastUpdated')}
      </p>

      <p style={{marginBottom: '2rem'}}>{t('intro')}</p>

      <Section title={t('dataCollectedTitle')}>
        <p>{t('dataCollectedIntro')}</p>
        <ul style={{paddingLeft: '1.25rem'}}>
          {dataCollected.map((item, i) => (
            <li key={i} style={{marginBottom: '0.4rem'}}>{item}</li>
          ))}
        </ul>
        <p style={{marginTop: '1.5rem', fontWeight: 600, color: '#fff'}}>
          {t('dataNotCollectedTitle')}
        </p>
        <ul style={{paddingLeft: '1.25rem'}}>
          {dataNotCollected.map((item, i) => (
            <li key={i} style={{marginBottom: '0.4rem'}}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={t('purposeTitle')}>
        <p>{t('purposeBody')}</p>
      </Section>

      <Section title={t('retentionTitle')}>
        <p>{t('retentionBody')}</p>
      </Section>

      <Section title={t('processorTitle')}>
        <p>{t('processorBody')}</p>
      </Section>

      <Section title={t('rightsTitle')}>
        <p>{t('rightsBody')}</p>
        <p style={{margin: '0.75rem 0'}}>
          <a
            href={`mailto:${t('rightsContact')}`}
            style={{
              color: 'var(--red)',
              fontWeight: 700,
              fontSize: '1.05rem',
              textDecoration: 'none',
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: '0.04em',
            }}
          >
            {t('rightsContact')}
          </a>
        </p>
        <p style={{fontSize: '0.9rem', color: 'var(--steel)'}}>{t('rightsContactNote')}</p>
      </Section>

      <Section title={t('fingerprintTitle')}>
        <p>{t('fingerprintBody')}</p>
      </Section>

      <Section title={t('appHelpTitle')}>
        <p>{t('appHelpBody')}</p>
      </Section>
    </article>
  );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section style={{marginBottom: '2.5rem'}}>
      <h2
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '1.5rem',
          fontWeight: 700,
          letterSpacing: '0.03em',
          marginBottom: '0.75rem',
          color: '#fff',
          borderLeft: '3px solid var(--red)',
          paddingLeft: '0.75rem',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
