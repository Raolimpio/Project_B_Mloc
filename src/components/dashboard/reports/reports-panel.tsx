import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MonthlyRentals } from './monthly-rentals';
import { QuoteRequestsReport } from './quote-requests-report';
import type { Quote } from '@/types/quote';

interface ReportsPanelProps {
  quotes: Quote[];
}

export function ReportsPanel({ quotes }: ReportsPanelProps) {
  const [activeReport, setActiveReport] = useState<'rentals' | 'quotes'>('rentals');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Relatórios e Análises</h2>
        <div className="flex gap-2">
          <Button
            variant={activeReport === 'rentals' ? 'primary' : 'outline'}
            onClick={() => setActiveReport('rentals')}
          >
            Aluguéis
          </Button>
          <Button
            variant={activeReport === 'quotes' ? 'primary' : 'outline'}
            onClick={() => setActiveReport('quotes')}
          >
            Orçamentos
          </Button>
        </div>
      </div>

      {activeReport === 'rentals' ? (
        <MonthlyRentals quotes={quotes} />
      ) : (
        <QuoteRequestsReport quotes={quotes} />
      )}
    </div>
  );
}