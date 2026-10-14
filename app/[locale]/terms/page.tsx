import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Terms from '@/components/Terms';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {BreadcrumbJsonLd} from '@/components/JsonLd';
import {routing} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {TERMS_PATH, TERMS_PDF} from '@/lib/site';

type Props = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'terms'});

  return pageMetadata({
    locale,
    path: `/${TERMS_PATH}`,
    title: t('metaTitle'),
    description: t('metaDescription'),
    type: 'article',
  });
}

export default async function TermsPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'terms'});
  const home = `/${locale}/`;

  return (
    <>
      <a href="#terms-title" className="skip-link">{(await getTranslations({locale, namespace: 'nav'}))('skipToContent')}</a>
      <Navbar />
      <main>
        <Terms home={home} pdfHref={TERMS_PDF[locale]} privacyHref={`${home}privacy/`} />
      </main>
      <Footer />
      <BackToTop />
      <BreadcrumbJsonLd
        items={[
          {name: t('crumbHome'), url: home},
          {name: t('title'), url: `${home}${TERMS_PATH}`},
        ]}
      />
    </>
  );
}
