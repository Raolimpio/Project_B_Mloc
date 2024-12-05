import { Header } from '@/components/layout/header';
import { DiagnosticResults } from '@/components/ui/diagnostic-results';

export default function DiagnosticsPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <DiagnosticResults />
        </div>
      </main>
    </>
  );
}