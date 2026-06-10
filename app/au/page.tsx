import AuNavbar from '@/components/AuNavbar';
import Hero from '@/components/Hero';
import TimeSavings from '@/components/TimeSavings';
import ProblemSolution from '@/components/ProblemSolution';
import CoreFeatures from '@/components/CoreFeatures';
import Screenshots from '@/components/Screenshots';
import SecondaryFeatures from '@/components/SecondaryFeatures';
import Comparison from '@/components/Comparison';
import Pricing from '@/components/Pricing';
import Download from '@/components/Download';
import Testimonials from '@/components/Testimonials';
import FinalCTA from '@/components/FinalCTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

// Standalone Australian landing page. Reuses the shared section components — all
// copy comes from messages/au.json via the provider in app/au/layout.tsx — with
// AU-specific props where a component would otherwise render Swiss/EU content
// (Hero/Footer flags, Footer links, Contact country).
export default function AuHome() {
  return (
    <>
      <a
        href="#hero"
        className="skip-link"
      >
        Skip to content
      </a>
      <main>
        <AuNavbar />
        <Hero regions={['au']} />
        <TimeSavings />
        <ProblemSolution />
        <CoreFeatures />
        <Screenshots />
        <SecondaryFeatures />
        <Comparison />
        <Pricing />
        <Download />
        <Testimonials />
        <FinalCTA />
        <Contact lockedCountry="au" />
        <Footer regions={['au']} basePath="/au/" showPrivacy={false} />
        <BackToTop />
      </main>
    </>
  );
}
