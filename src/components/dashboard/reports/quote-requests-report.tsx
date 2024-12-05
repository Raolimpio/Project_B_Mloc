import { useState, useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PeriodSelector } from './period-selector';
import { isDateInPeriod } from '@/lib/date-utils';
import type { PeriodType } from './period-selector';
import type { Quote } from '@/types/quote';

interface QuoteRequestsReportProps {
  quotes: Quote[];
}

export function QuoteRequestsReport({ quotes }: QuoteRequestsReportProps) {
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const reportData = useMemo(() => {
    const filteredQuotes = quotes.filter(quote => 
      isDateInPeriod(quote.createdAt, selectedDate, periodType)
    );

    const stats = {
      total: filteredQuotes.length,
      pending: filteredQuotes.filter(q => q.status === 'pending').length,
      quoted: filteredQuotes.filter(q => q.status === 'quoted').length,
      accepted: filteredQuotes.filter(q => 
        ['accepted', 'in_preparation', 'in_transit', 'delivered'].includes(q.status)
      ).length,
      rejected: filteredQuotes.filter(q => q.status === 'rejected').length,
      conversionRate: 0,
    };

    stats.conversionRate = stats.total > 0 
      ? (stats.accepted / stats.total) * 100 
      : 0;

    const customerRequests = filteredQuotes.reduce((acc, quote) => {
      const key = quote.requesterId;
      if (!acc[key]) {
        acc[key] = {
          name: quote.requesterName,
          totalRequests: 0,
          accepted: 0,
          rejected: 0,
          pending: 0,
          machines: new Set(),
        };
      }
      acc[key].totalRequests++;
      acc[key].machines.add(quote.machineName);
      
      if (['accepted', 'in_preparation', 'in_transit', 'delivered'].includes(quote.status)) {
        acc[key].accepted++;
      } else if (quote.status === 'rejected') {
        acc[key].rejected++;
      } else {
        acc[key].pending++;
      }
      
      return acc;
    }, {} as Record<string, {
      name: string;
      totalRequests: number;
      accepted: number;
      rejected: number;
      pending: number;
      machines: Set<string>;
    }>);

    return {
      stats,
      customerRequests: Object.values(customerRequests)
        .sort((a, b) => b.totalRequests - a.totalRequests),
    };
  }, [quotes, selectedDate, periodType]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Solicitações de Orçamento</h3>
        <PeriodSelector
          periodType={periodType}
          setPeriodType={setPeriodType}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-600">Total de Solicitações</p>
          <p className="mt-1 text-2xl font-semibold">{reportData.stats.total}</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4">
          <p className="text-sm text-yellow-600">Aguardando Resposta</p>
          <p className="mt-1 text-2xl font-semibold">{reportData.stats.pending}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-green-600">Aprovados</p>
          <p className="mt-1 text-2xl font-semibold">{reportData.stats.accepted}</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-sm text-purple-600">Taxa de Conversão</p>
          <p className="mt-1 text-2xl font-semibold">
            {reportData.stats.conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b px-6 py-4">
          <h4 className="font-medium">Solicitações por Cliente</h4>
        </div>
        <div className="divide-y">
          {reportData.customerRequests.map((customer) => (
            <div key={customer.name} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">{customer.name}</h5>
                  <p className="text-sm text-gray-500">
                    {customer.machines.size} {customer.machines.size === 1 ? 'máquina' : 'máquinas'} diferentes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{customer.totalRequests} solicitações</p>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="text-green-600">{customer.accepted} aprovados</span>
                    <span className="text-red-600">{customer.rejected} recusados</span>
                    {customer.pending > 0 && (
                      <span className="text-yellow-600">{customer.pending} pendentes</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {reportData.customerRequests.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhuma solicitação registrada neste período
            </div>
          )}
        </div>
      </div>

      <Button variant="outline" className="w-full">
        <ArrowDown className="mr-2 h-4 w-4" />
        Exportar Relatório
      </Button>
    </div>
  );
}