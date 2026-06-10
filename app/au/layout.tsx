import type {Metadata} from 'next';
import JsonLd from '@/components/JsonLd';
import AuIntlProvider from '@/components/AuIntlProvider';
import auMessages from '@/messages/au.json';

const SITE_URL = 'https://pdrkalk.ch';
const AU_URL = `${SITE_URL}/au/`;

// AU is a standalone, single-locale landing page — it is NOT one of the
// next-intl routing locales (de/en/fr/it). Metadata and JSON-LD therefore read
// the message file directly (using `getTranslations` here would fall back to the
// default locale, since 'au'/'en-AU' isn't a configured request locale).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: auMessages.meta.title,
  description: auMessages.meta.description,
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
  // Self-referential canonical only. The de/en/fr/it pages are translations of
  // the Swiss/EU site; this en-AU page is a distinct regional page, so it is
  // deliberately NOT cross-linked via hreflang.
  alternates: {
    canonical: AU_URL,
  },
  openGraph: {
    type: 'website',
    siteName: 'PDR Kalk',
    url: AU_URL,
    locale: 'en_AU',
    title: auMessages.meta.ogTitle,
    description: auMessages.meta.ogDescription,
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
    title: auMessages.meta.ogTitle,
    description: auMessages.meta.ogDescription,
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

export default function AuLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* AuIntlProvider is a Client Component so /au stays fully static —
            the server variant of NextIntlClientProvider reads request headers
            and would break `output: 'export'`. */}
        <AuIntlProvider>{children}</AuIntlProvider>
        <JsonLd
          locale="en-AU"
          description={auMessages.meta.description}
          reviews={auMessages.testimonials.items}
          areaServed={['AU']}
          currency="AUD"
          price="590"
          homePath="/au/"
          reviewLanguage="en"
        />
      </body>
    </html>
  );
}
