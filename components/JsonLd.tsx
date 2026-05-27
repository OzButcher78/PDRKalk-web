const SITE_URL = 'https://pdrkalk.ch';
const ORG_ID = `${SITE_URL}/#organization`;
const SOFTWARE_ID = `${SITE_URL}/#software`;
const WEBSITE_ID = `${SITE_URL}/#website`;

type Props = {
  locale: string;
  description: string;
};

export default function JsonLd({locale, description}: Props) {
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
      areaServed: ['CH', 'DE', 'AT'],
      slogan: 'Made in Switzerland.',
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: `${SITE_URL}/${locale}/`,
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
      operatingSystem: 'Windows, Android',
      softwareVersion: '4.25.0',
      inLanguage: ['de', 'en', 'fr', 'it'],
      author: {'@id': ORG_ID},
      publisher: {'@id': ORG_ID},
      offers: [
        {
          '@type': 'Offer',
          name: '5-year licence',
          price: '550',
          priceCurrency: 'CHF',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/${locale}/#pricing`,
        },
        {
          '@type': 'Offer',
          name: '30-day free trial',
          price: '0',
          priceCurrency: 'CHF',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/${locale}/#pricing`,
        },
      ],
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
    />
  );
}
