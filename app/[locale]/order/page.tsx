import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Order from '@/components/Order';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {BreadcrumbJsonLd} from '@/components/JsonLd';
import {routing} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {interpolate} from '@/lib/interpolate';
import {ORDER_PATH} from '@/lib/site';

type Props = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'order'});

  return pageMetadata({
    locale,
    path: `/${ORDER_PATH}`,
    title: t('metaTitle'),
    description: interpolate(t.raw('metaDescription') as string),
  });
}

export default async function OrderPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'order'});
  const nav = await getTranslations({locale, namespace: 'nav'});
  const home = `/${locale}/`;

  return (
    <>
      <a href="#order-title" className="skip-link">{nav('skipToContent')}</a>
      <Navbar />

      <main>
        <Order home={home} />
      </main>

      <Footer />
      <BackToTop />

      <BreadcrumbJsonLd
        items={[
          {name: t('crumbHome'), url: home},
          {name: t('title'), url: `${home}${ORDER_PATH}`},
        ]}
      />
    </>
  );
}
