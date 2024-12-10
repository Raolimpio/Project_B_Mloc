import { Header } from '@/components/layout/header';
import { HomeFooter } from '@/components/layout/home-footer';
import { HeroSection } from '@/components/home/hero-section';
import { HowItWorks } from '@/components/home/how-it-works';
import { CallToAction } from '@/components/home/call-to-action';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section com fundo personalizado */}
        <div className="relative bg-gradient-to-br from-primary-700 to-primary-800">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />
          <HeroSection />
        </div>

        {/* How It Works com visual mais clean */}
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0),#e6edf4)]" />
          <HowItWorks />
        </div>

        {/* Call to Action com espaçamento melhorado */}
        <div className="relative py-16 bg-gray-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0),#ccdbe9)]" />
          <CallToAction />
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}