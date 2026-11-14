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
  const t = await getTranslations({locale, namespace: 'privacy'});

  return pageMetadata({
    locale,
    path: '/privacy/',
    title: t('metaTitle'),
    description: t('metaDescription'),
    type: 'article',
  });
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
      <BackToTop />
    </>
  );
}

/**
 * The notice covers the website, the contact and order forms and the app
 * (trial activation, update check, optional AI scanner). The section with the
 * id `ai-privacy` is linked from the Integrations block — keep that id.
 */
function PrivacyContent() {
  const t = useTranslations('privacy');

  return (
    <LegalDoc
      title={t('title')}
      lastUpdated={t('lastUpdated')}
      intro={t('intro')}
      sections={t.raw('sections') as LegalSection[]}
    />
  );
}
