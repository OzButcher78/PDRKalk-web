import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Screenshots from '@/components/Screenshots';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Screenshots />
      <HowItWorks />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
