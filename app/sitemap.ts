import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';

export const dynamic = 'force-static';

const SITE_URL = 'https://pdrkalk.ch';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homeLanguages = Object.fromEntries(
    routing.locales.map(l => [l, `${SITE_URL}/${l}/`]),
  );
  const privacyLanguages = Object.fromEntries(
    routing.locales.map(l => [l, `${SITE_URL}/${l}/privacy/`]),
  );

  const home: MetadataRoute.Sitemap = routing.locales.map(locale => ({
    url: `${SITE_URL}/${locale}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: {languages: homeLanguages},
  }));

  const privacy: MetadataRoute.Sitemap = routing.locales.map(locale => ({
    url: `${SITE_URL}/${locale}/privacy/`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
    alternates: {languages: privacyLanguages},
  }));

  return [...home, ...privacy];
}
