import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WorkPhaseGrid } from '@/components/phases/work-phase-grid';

export default function WorkPhasesPage() {
  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-2xl font-bold">Fases da Obra</h1>
          <WorkPhaseGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}