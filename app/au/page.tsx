import AuNavbar from '@/components/AuNavbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
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
import auMessages from '@/messages/au.json';

// Standalone Australian landing page. Reuses the shared section components —
// all copy comes from messages/au.json via the provider in app/au/layout.tsx —
// with AU-specific props wherever a component would otherwise render Swiss/EU
// content or link into a locale segment that does not exist here.
export default function AuHome() {
  return (
    <>
      <a href="#hero" className="skip-link">{auMessages.nav.skipToContent}</a>
      <AuNavbar />
      <main>
        <Hero regions={['au']} demoHref="#workflow" />
        <TrustBar />
        <Workflow />
        <WhatsNew />
        <FeatureGroups />
        <Regions />
        <Integrations showAi={false} />
        <Documents />
        <TeamBusiness />
        <Security showPrivacy={false} />
        <Testimonials />
        <Pricing home="/au/" />
        <Faq />
        <Download home="/au/" />
        <Contact lockedCountry="au" />
      </main>
      <Footer regions={['au']} basePath="/au/" showPrivacy={false} />
      <BackToTop />
      <FaqJsonLd items={faqItems(auMessages.faq.items as FaqItem[])} />
    </>
  );
}
