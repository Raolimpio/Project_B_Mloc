import { Header } from '@/components/layout/header';
import { HomeFooter } from '@/components/layout/home-footer';
import { HeroSection } from '@/components/home/hero-section';

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
      </main>
      <HomeFooter />
    </>
  );
}