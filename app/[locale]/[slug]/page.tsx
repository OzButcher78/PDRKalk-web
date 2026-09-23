import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {interpolate} from '@/lib/interpolate';
import {PAGES, pageBySlug} from '@/data/pages';
import FeaturePage from '@/components/FeaturePage';

type Props = {params: Promise<{locale: string; slug: string}>};

// Only the registry slugs exist; anything else 404s at build time rather than
// being generated on demand (there is no server).
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    PAGES.map(page => ({locale, slug: page.slugs[locale] ?? page.slugs.de})),
  );
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const page = pageBySlug(locale, slug);
  if (!page) return {};

  const t = await getTranslations({locale, namespace: `pages.${page.key}`});
  const localePaths = Object.fromEntries(
    routing.locales.map(l => [l, `/${page.slugs[l] ?? page.slugs.de}/`]),
  );

  return pageMetadata({
    locale,
    path: `/${slug}/`,
    localePaths,
    title: interpolate(t('metaTitle')),
    description: interpolate(t('metaDescription')),
    ogTitle: interpolate(t('title')),
    ogDescription: interpolate(t('lead')),
    type: 'article',
  });
}

export default async function SlugPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const page = pageBySlug(locale, slug);
  if (!page) notFound();

  return <FeaturePage page={page} locale={locale} />;
}
