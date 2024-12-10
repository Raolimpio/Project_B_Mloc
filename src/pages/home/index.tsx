import { Header } from '@/components/layout/header';
import { HomeFooter } from '@/components/layout/home-footer';
import { HeroSection } from '@/components/home/hero-section';
import { CategoryShowcase } from '@/components/home/category-showcase';

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoryShowcase />
      </main>
      <HomeFooter />
    </>
  );
}