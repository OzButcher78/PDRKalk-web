// Registry of the dedicated feature pages. Adding a page = one entry here plus
// one `pages.<key>` block per message file. Slugs are per locale so each market
// gets a keyword URL; the locale switcher maps a slug to its sibling (see
// Navbar.switchToLocale) and the sitemap/hreflang alternates read the same map.

export type PageKey = 'hail' | 'import' | 'subcontractors' | 'noSubscription';

export type PageDef = {
  key: PageKey;
  slugs: Record<string, string>;
  /** features.groups[] key whose full item list is rendered on the page. */
  group: string;
  /** faq.items[] ids rendered on the page (order preserved). */
  faq: string[];
  related: PageKey[];
  badge?: 'new';
  /** /ohne-abo/ re-renders both pricing tables. */
  showPricingTables?: boolean;
  /** screenshots.images[] file names shown in the strip. */
  shots: string[];
};

export const PAGES: PageDef[] = [
  {
    key: 'hail',
    slugs: {de: 'hagelkalkulation', en: 'hail-estimating', fr: 'calcul-grele', it: 'calcolo-grandine'},
    group: 'capture',
    faq: ['countries', 'invoices', 'import', 'trial', 'licence'],
    related: ['import', 'subcontractors'],
    shots: ['hagel-auftrag.jpg', 'hagel-auftrag-aw.jpg', 'dokument-import.jpg', 'pdf-hagel.jpg', 'pdf-hagel-teile.jpg', 'pdf-photos.jpg'],
  },
  {
    key: 'import',
    slugs: {de: 'import', en: 'import', fr: 'import', it: 'import'},
    group: 'capture',
    faq: ['import', 'ai', 'data', 'countries', 'trial'],
    related: ['hail'],
    badge: 'new',
    shots: ['dokument-import.jpg', 'hagel-auftrag.jpg', 'einstellungen.jpg', 'pdf-hagel.jpg'],
  },
  {
    key: 'subcontractors',
    slugs: {de: 'subunternehmer', en: 'subcontractors', fr: 'sous-traitants', it: 'subappaltatori'},
    group: 'team',
    faq: ['users', 'multiDevice', 'audit', 'licence', 'trial'],
    related: ['hail', 'noSubscription'],
    shots: ['Subzuweisen.jpg', 'sub-ohne-rapport.jpg', 'sub-verwalten.jpg', 'sub-abrechnung.jpg', 'analysen1.jpg', 'adresse-buch.jpg'],
  },
  {
    key: 'noSubscription',
    slugs: {de: 'ohne-abo', en: 'no-subscription', fr: 'sans-abonnement', it: 'senza-abbonamento'},
    group: 'data',
    faq: ['licence', 'price', 'updates', 'buy', 'trial', 'users'],
    related: ['subcontractors'],
    showPricingTables: true,
    shots: ['dashboard.jpg', 'einstellungen.jpg', 'backup.jpg', 'wiederherstellen.jpg'],
  },
];

export const pageByKey = (key: PageKey): PageDef =>
  PAGES.find(p => p.key === key)!;

export const pageHref = (key: PageKey, locale: string): string =>
  `/${locale}/${pageByKey(key).slugs[locale] ?? pageByKey(key).slugs.de}/`;

export const pageBySlug = (locale: string, slug: string): PageDef | undefined =>
  PAGES.find(p => p.slugs[locale] === slug);
