import {
  ANDROID_DOWNLOAD_URL,
  APP_LANGUAGES,
  APP_VERSION,
  SITE_URL,
  WINDOWS_DOWNLOAD_URL,
} from '@/lib/site';

const ORG_ID = `${SITE_URL}/#organization`;
const SOFTWARE_ID = `${SITE_URL}/#software`;
const WEBSITE_ID = `${SITE_URL}/#website`;

type ReviewItem = {
  quote: string;
  name: string;
  company?: string;
  location?: string;
};

type Props = {
  locale: string;
  description: string;
  reviews?: ReviewItem[];
  areaServed?: string[];
  currency?: string;
  price?: string;
  homePath?: string;
  reviewLanguage?: string;
  /** Group headings, rendered as the SoftwareApplication featureList. */
  featureList?: string[];
};

function Script({data}: {data: unknown}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}

export default function JsonLd({
  locale,
  description,
  reviews = [],
  areaServed = ['CH', 'DE', 'AT', 'AU', 'BE', 'NL'],
  currency = 'CHF',
  price = '550',
  homePath,
  reviewLanguage = 'de',
  featureList,
}: Props) {
  const home = homePath ?? `/${locale}/`;
  const isAu = home === '/au/';

  const graph = [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Balmer Storm Solutions',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon/android-chrome-192x192.png`,
      email: 'info@pdrkalk.ch',
      founder: {
        '@type': 'Person',
        name: 'Dieter Balmer',
      },
      foundingLocation: {
        '@type': 'Country',
        name: 'Switzerland',
      },
      areaServed,
      slogan: 'Made in Switzerland.',
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: `${SITE_URL}${home}`,
      name: 'PDR Kalk',
      inLanguage: locale,
      publisher: {'@id': ORG_ID},
    },
    {
      '@type': 'SoftwareApplication',
      '@id': SOFTWARE_ID,
      name: 'PDR Kalk',
      url: SITE_URL,
      description,
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Estimation and Invoicing Software',
      operatingSystem: 'Windows 10, Windows 11, Android 10+',
      softwareVersion: APP_VERSION,
      downloadUrl: [WINDOWS_DOWNLOAD_URL, ANDROID_DOWNLOAD_URL],
      ...(isAu ? {} : {releaseNotes: `${SITE_URL}/${locale}/updates/`}),
      inLanguage: [...APP_LANGUAGES],
      ...(featureList && featureList.length > 0 && {featureList}),
      author: {'@id': ORG_ID},
      publisher: {'@id': ORG_ID},
      offers: [
        {
          '@type': 'Offer',
          name: 'Perpetual licence (one-time payment)',
          price,
          priceCurrency: currency,
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}${home}#pricing`,
        },
        {
          '@type': 'Offer',
          name: '30-day free trial',
          price: '0',
          priceCurrency: currency,
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}${home}#download`,
        },
      ],
      // Customer reviews — kept in sync with messages `testimonials.items`.
      ...(reviews.length > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          reviewCount: String(reviews.length),
          bestRating: '5',
        },
        review: reviews.map(r => ({
          '@type': 'Review',
          author: {'@type': 'Person', name: r.name},
          reviewBody: r.quote,
          inLanguage: reviewLanguage,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
          },
        })),
      }),
    },
  ];

  return <Script data={{'@context': 'https://schema.org', '@graph': graph}} />;
}

/** Rendered by every page that shows an FAQ accordion. */
export function FaqJsonLd({items}: {items: Array<{q: string; a: string}>}) {
  if (items.length === 0) return null;
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {'@type': 'Answer', text: item.a},
        })),
      }}
    />
  );
}

/** Rendered by the feature pages and the updates page. */
export function BreadcrumbJsonLd({items}: {items: Array<{name: string; url: string}>}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${SITE_URL}${item.url}`,
        })),
      }}
    />
  );
}
