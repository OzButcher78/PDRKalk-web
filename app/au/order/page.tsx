import type {Metadata} from 'next';
import AuNavbar from '@/components/AuNavbar';
import Order from '@/components/Order';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {BreadcrumbJsonLd} from '@/components/JsonLd';
import {interpolate} from '@/lib/interpolate';
import {ORDER_PATH, SITE_URL} from '@/lib/site';
import auMessages from '@/messages/au.json';

const HOME = '/au/';
const ORDER_URL = `${SITE_URL}${HOME}${ORDER_PATH}`;
const title = auMessages.order.metaTitle;
const description = interpolate(auMessages.order.metaDescription);

// Like the AU layout: read au.json directly, self-referential canonical only,
// no hreflang (this is a regional page, not a translation of /de/order/).
// openGraph/twitter are replaced as a whole, so they are spelled out in full.
export const metadata: Metadata = {
  title,
  description,
  alternates: {canonical: ORDER_URL},
  openGraph: {
    type: 'website',
    siteName: 'PDR Kalk',
    url: ORDER_URL,
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

export default function AuOrderPage() {
  return (
    <>
      <a href="#order-title" className="skip-link">{auMessages.nav.skipToContent}</a>
      <AuNavbar home={HOME} />
      <main>
        <Order home={HOME} lockedCountry="au" />
      </main>
      <Footer regions={['au']} basePath={HOME} showPrivacy={false} />
      <BackToTop />
      <BreadcrumbJsonLd
        items={[
          {name: auMessages.order.crumbHome, url: HOME},
          {name: auMessages.order.title, url: `${HOME}${ORDER_PATH}`},
        ]}
      />
    </>
  );
}
