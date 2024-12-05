import { useState, useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PeriodSelector } from './period-selector';
import { isDateInPeriod } from '@/lib/date-utils';
import type { PeriodType } from './period-selector';
import type { Quote } from '@/types/quote';

interface MonthlyRentalsProps {
  quotes: Quote[];
}

export function MonthlyRentals({ quotes }: MonthlyRentalsProps) {
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthlyData = useMemo(() => {
    const filteredQuotes = quotes.filter(quote => {
      return (
        isDateInPeriod(quote.createdAt, selectedDate, periodType) &&
        ['accepted', 'in_preparation', 'in_transit', 'delivered', 'return_requested', 'pickup_scheduled', 'returned']
        .includes(quote.status)
      );
    });

    const machineGroups = filteredQuotes.reduce((acc, quote) => {
      const key = quote.machineId;
      if (!acc[key]) {
        acc[key] = {
          machineId: quote.machineId,
          machineName: quote.machineName,
          totalRentals: 0,
          revenue: 0,
          renters: new Set(),
        };
      }
      acc[key].totalRentals++;
      acc[key].revenue += quote.value || 0;
      acc[key].renters.add(quote.requesterName);
      return acc;
    }, {} as Record<string, {
      machineId: string;
      machineName: string;
      totalRentals: number;
      revenue: number;
      renters: Set<string>;
    }>);

    return Object.values(machineGroups).sort((a, b) => b.totalRentals - a.totalRentals);
  }, [quotes, selectedDate, periodType]);

  const totalRentals = monthlyData.reduce((sum, item) => sum + item.totalRentals, 0);
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Aluguéis por Período</h3>
        <PeriodSelector
          periodType={periodType}
          setPeriodType={setPeriodType}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-600">Total de Aluguéis</p>
          <p className="mt-1 text-2xl font-semibold">{totalRentals}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-green-600">Receita Total</p>
          <p className="mt-1 text-2xl font-semibold">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b px-6 py-4">
          <h4 className="font-medium">Detalhamento por Máquina</h4>
        </div>
        <div className="divide-y">
          {monthlyData.map((item) => (
            <div key={item.machineId} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">{item.machineName}</h5>
                  <p className="text-sm text-gray-500">
                    {item.totalRentals} {item.totalRentals === 1 ? 'aluguel' : 'aluguéis'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    R$ {item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.renters.size} {item.renters.size === 1 ? 'cliente' : 'clientes'}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${(item.totalRentals / monthlyData[0].totalRentals) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {monthlyData.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum aluguel registrado neste período
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