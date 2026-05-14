import {setRequestLocale} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TimeSavings from '@/components/TimeSavings';
import ProblemSolution from '@/components/ProblemSolution';
import CoreFeatures from '@/components/CoreFeatures';
import Screenshots from '@/components/Screenshots';
import SecondaryFeatures from '@/components/SecondaryFeatures';
import Comparison from '@/components/Comparison';
import Pricing from '@/components/Pricing';
import Testimonial from '@/components/Testimonial';
import FinalCTA from '@/components/FinalCTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function Home({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <a
        href="#hero"
        className="skip-link"
      >
        Skip to content
      </a>
      <main>
        <Navbar />
        <Hero />
        <TimeSavings />
        <ProblemSolution />
        <CoreFeatures />
        <Screenshots />
        <SecondaryFeatures />
        <Comparison />
        <Pricing />
        <Testimonial />
        <FinalCTA />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
