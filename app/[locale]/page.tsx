import {getTranslations, setRequestLocale} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import Demo from '@/components/Demo';
import Workflow from '@/components/Workflow';
import WhatsNew from '@/components/WhatsNew';
import FeatureGroups from '@/components/FeatureGroups';
import Regions from '@/components/Regions';
import Integrations from '@/components/Integrations';
import Documents from '@/components/Documents';
import TeamBusiness from '@/components/TeamBusiness';
import Security from '@/components/Security';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Faq from '@/components/Faq';
import Download from '@/components/Download';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {FaqJsonLd} from '@/components/JsonLd';
import {faqItems, type FaqItem} from '@/lib/faq';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function Home({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const nav = await getTranslations({locale, namespace: 'nav'});
  const faq = await getTranslations({locale, namespace: 'faq'});
  const home = `/${locale}/`;

  return (
    <>
      <a href="#hero" className="skip-link">{nav('skipToContent')}</a>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Demo />
        <Workflow />
        <WhatsNew locale={locale} />
        <FeatureGroups locale={locale} />
        <Regions />
        <Integrations locale={locale} />
        <Documents />
        <TeamBusiness locale={locale} />
        <Security locale={locale} />
        <Testimonials />
        <Pricing home={home} />
        <Faq />
        <Download home={home} />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <FaqJsonLd items={faqItems(faq.raw('items') as FaqItem[])} />
    </>
  );
}
