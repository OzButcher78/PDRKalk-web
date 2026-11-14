import type {Metadata} from 'next';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import LegalDoc, {type LegalSection} from '@/components/LegalDoc';
import {routing} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';

type Props = {
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'imprint'});

  return pageMetadata({
    locale,
    path: '/imprint/',
    title: t('metaTitle'),
    description: t('metaDescription'),
    type: 'article',
  });
}

export default async function ImprintPage({params}: Props) {
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
        <ImprintContent />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

/** Provider identification (Swiss UWG art. 3 para. 1 lit. s) plus the usual notices. */
function ImprintContent() {
  const t = useTranslations('imprint');

  return (
    <LegalDoc
      title={t('title')}
      lastUpdated={t('lastUpdated')}
      sections={t.raw('sections') as LegalSection[]}
    />
  );
}
