import type {Metadata} from 'next';
import {hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {fontClass} from '@/app/fonts';
import IntlProvider from '@/components/IntlProvider';
import JsonLd from '@/components/JsonLd';

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta'});

  return pageMetadata({
    locale,
    path: '/',
    title: t('title'),
    description: t('description'),
    ogTitle: t('ogTitle'),
    ogDescription: t('ogDescription'),
  });
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = await getTranslations({locale, namespace: 'meta'});
  const reviews = messages.testimonials?.items ?? [];
  const featureList = (messages.features?.groups ?? []).map((g: {heading: string}) => g.heading);

  return (
    <html lang={locale} className={fontClass} suppressHydrationWarning>
      <body>
        <IntlProvider locale={locale} messages={messages}>
          {children}
        </IntlProvider>
        <JsonLd locale={locale} description={t('description')} reviews={reviews} featureList={featureList} />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}
