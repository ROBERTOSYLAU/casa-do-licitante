import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import AdditionalServices from './AdditionalServices';
import Pricing from './Pricing';
import CTA from './CTA';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 text-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <AdditionalServices />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
