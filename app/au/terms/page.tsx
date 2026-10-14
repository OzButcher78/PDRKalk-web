import type {Metadata} from 'next';
import AuNavbar from '@/components/AuNavbar';
import Terms from '@/components/Terms';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {BreadcrumbJsonLd} from '@/components/JsonLd';
import {SITE_URL, TERMS_PATH, TERMS_PDF} from '@/lib/site';
import auMessages from '@/messages/au.json';

const HOME = '/au/';
const TERMS_URL = `${SITE_URL}${HOME}${TERMS_PATH}`;
const title = auMessages.terms.metaTitle;
const description = auMessages.terms.metaDescription;

// Like /au/order/: read au.json directly, self-referential canonical only, no
// hreflang (a regional page with its own clause set, not a translation of
// /de/terms/). openGraph/twitter are replaced as a whole, so spelled out in full.
export const metadata: Metadata = {
  title,
  description,
  alternates: {canonical: TERMS_URL},
  openGraph: {
    type: 'article',
    siteName: 'PDR Kalk',
    url: TERMS_URL,
    locale: 'en_AU',
    title,
    description,
    images: [{url: '/og/au.jpg', width: 1200, height: 630, alt: 'PDR Kalk'}],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og/au.jpg'],
  },
};

export default function AuTermsPage() {
  return (
    <>
      <a href="#terms-title" className="skip-link">{auMessages.nav.skipToContent}</a>
      <AuNavbar home={HOME} />
      <main>
        <Terms home={HOME} pdfHref={TERMS_PDF.au} />
      </main>
      <Footer regions={['au']} basePath={HOME} showPrivacy={false} />
      <BackToTop />
      <BreadcrumbJsonLd
        items={[
          {name: auMessages.terms.crumbHome, url: HOME},
          {name: auMessages.terms.title, url: `${HOME}${TERMS_PATH}`},
        ]}
      />
    </>
  );
}
