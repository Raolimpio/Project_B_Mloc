import { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';

interface ProductLayoutProps {
  children: ReactNode;
}

export function ProductLayout({ children }: ProductLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  );
}
