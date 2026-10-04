import type {Metadata} from 'next';
import {routing} from '@/i18n/routing';
import {SITE_URL} from './site';

const OG_LOCALE: Record<string, string> = {
  de: 'de_CH',
  en: 'en_US',
  fr: 'fr_FR',
  it: 'it_IT',
};

type PageMetaArgs = {
  locale: string;
  /** Path after the locale segment, with leading and trailing slash ('/' for home). */
  path: string;
  title: string;
  description: string;
  /** Per-locale paths for the hreflang cluster; defaults to the same `path`. */
  localePaths?: Record<string, string>;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  type?: 'website' | 'article';
};

/**
 * One metadata shape for every locale page: canonical, hreflang cluster
 * (4 locales + x-default → German), Open Graph, Twitter and robots.
 * /au builds its metadata separately — it is deliberately not in this cluster.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  localePaths,
  ogImage = '/og/home.jpg',
  ogTitle,
  ogDescription,
  type = 'website',
}: PageMetaArgs): Metadata {
  const pathFor = (l: string) => localePaths?.[l] ?? path;
  const url = `${SITE_URL}/${locale}${pathFor(locale)}`;

  const languages: Record<string, string> = {
    'x-default': `${SITE_URL}/de${pathFor('de')}`,
  };
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${pathFor(l)}`;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
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
    alternates: {canonical: url, languages},
    openGraph: {
      type,
      siteName: 'PDR Kalk',
      url,
      locale: OG_LOCALE[locale] ?? 'de_CH',
      alternateLocale: routing.locales
        .filter(l => l !== locale)
        .map(l => OG_LOCALE[l] ?? l),
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [{url: ogImage, width: 1200, height: 630, alt: 'PDR Kalk'}],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [ogImage],
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
    formatDetection: {telephone: false},
  };
}
