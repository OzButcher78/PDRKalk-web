import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';
import {PAGES} from '@/data/pages';
import {ORDER_PATH, SITE_URL} from '@/lib/site';

export const dynamic = 'force-static';

/** hreflang cluster for a path that is the same in every locale. */
const cluster = (path: string) =>
  Object.fromEntries(routing.locales.map(l => [l, `${SITE_URL}/${l}${path}`]));

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap = routing.locales.map(locale => ({
    url: `${SITE_URL}/${locale}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: {languages: cluster('/')},
  }));

  const featurePages: MetadataRoute.Sitemap = routing.locales.flatMap(locale =>
    PAGES.map(page => ({
      url: `${SITE_URL}/${locale}/${page.slugs[locale] ?? page.slugs.de}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map(l => [l, `${SITE_URL}/${l}/${page.slugs[l] ?? page.slugs.de}/`]),
        ),
      },
    })),
  );

  const updates: MetadataRoute.Sitemap = routing.locales.map(locale => ({
    url: `${SITE_URL}/${locale}/updates/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
    alternates: {languages: cluster('/updates/')},
  }));

  const order: MetadataRoute.Sitemap = routing.locales.map(locale => ({
    url: `${SITE_URL}/${locale}/${ORDER_PATH}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.5,
    alternates: {languages: cluster(`/${ORDER_PATH}`)},
  }));

  const privacy: MetadataRoute.Sitemap = routing.locales.map(locale => ({
    url: `${SITE_URL}/${locale}/privacy/`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
    alternates: {languages: cluster('/privacy/')},
  }));

  // Standalone Australian landing page — not a routing locale, so it is added
  // explicitly and deliberately without hreflang links to the de/en/fr/it pages.
  const au: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/au/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/au/${ORDER_PATH}`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  return [...home, ...au, ...featurePages, ...updates, ...order, ...privacy];
}
