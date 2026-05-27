import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import JsonLd from '@/components/JsonLd';

const SITE_URL = 'https://pdrkalk.ch';

const OG_LOCALE: Record<string, string> = {
  de: 'de_CH',
  en: 'en_US',
  fr: 'fr_FR',
  it: 'it_IT',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta'});

  const languages: Record<string, string> = {
    'x-default': `${SITE_URL}/de/`,
  };
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}/`;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    applicationName: 'PDR Kalk',
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        {url: '/favicon/favicon.ico', sizes: 'any'},
        {url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
        {url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
      ],
      apple: '/favicon/apple-touch-icon.png',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/`,
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: 'PDR Kalk',
      url: `${SITE_URL}/${locale}/`,
      locale: OG_LOCALE[locale] ?? 'de_CH',
      alternateLocale: routing.locales
        .filter(l => l !== locale)
        .map(l => OG_LOCALE[l] ?? l),
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [
        {
          url: '/screenshots/dashboard.jpg',
          width: 1200,
          height: 630,
          alt: 'PDR Kalk Dashboard',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ['/screenshots/dashboard.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = await getTranslations({locale, namespace: 'meta'});

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <JsonLd locale={locale} description={t('description')} />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}
