import { useState, useMemo } from 'react';
import { Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Quote } from '@/types/quote';

interface FinancialPanelProps {
  quotes: Quote[];
}

type Period = 'day' | 'month' | 'year';
type ChartData = { name: string; value: number }[];

export function FinancialPanel({ quotes }: FinancialPanelProps) {
  const [period, setPeriod] = useState<Period>('month');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const completedQuotes = useMemo(() => 
    quotes.filter(q => 
      ['accepted', 'in_preparation', 'in_transit', 'delivered', 'return_requested', 'pickup_scheduled', 'returned']
      .includes(q.status)
    ),
    [quotes]
  );

  const chartData = useMemo(() => {
    if (period === 'day') {
      // Dados diários do mês selecionado
      const targetMonth = new Date(year, month);
      const daysInMonth = endOfMonth(targetMonth).getDate();
      const data: ChartData = Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        value: 0
      }));

      completedQuotes.forEach(quote => {
        const quoteDate = quote.createdAt;
        if (quoteDate.getFullYear() === year && quoteDate.getMonth() === month) {
          const day = quoteDate.getDate() - 1;
          data[day].value += quote.value || 0;
        }
      });

      return data;
    }

    if (period === 'month') {
      // Dados mensais do ano selecionado
      const months = Array.from({ length: 12 }, (_, i) => ({
        name: format(new Date(year, i), 'MMM', { locale: ptBR }),
        value: 0
      }));

      completedQuotes.forEach(quote => {
        const quoteDate = quote.createdAt;
        if (quoteDate.getFullYear() === year) {
          const month = quoteDate.getMonth();
          months[month].value += quote.value || 0;
        }
      });

      return months;
    }

    // Dados anuais dos últimos 5 anos
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => ({
      name: `${currentYear - 4 + i}`,
      value: 0
    }));

    completedQuotes.forEach(quote => {
      const quoteYear = quote.createdAt.getFullYear();
      const yearIndex = years.findIndex(y => y.name === quoteYear.toString());
      if (yearIndex !== -1) {
        years[yearIndex].value += quote.value || 0;
      }
    });

    return years;
  }, [completedQuotes, period, year, month]);

  const totalRevenue = useMemo(() => {
    if (period === 'day') {
      const targetMonth = new Date(year, month);
      const interval = {
        start: startOfMonth(targetMonth),
        end: endOfMonth(targetMonth)
      };

      return completedQuotes
        .filter(quote => isWithinInterval(quote.createdAt, interval))
        .reduce((sum, quote) => sum + (quote.value || 0), 0);
    }

    if (period === 'month') {
      return completedQuotes
        .filter(quote => quote.createdAt.getFullYear() === year)
        .reduce((sum, quote) => sum + (quote.value || 0), 0);
    }

    return completedQuotes.reduce((sum, quote) => sum + (quote.value || 0), 0);
  }, [completedQuotes, period, year, month]);

  const handleExport = () => {
    // Implementar exportação para CSV/Excel
    console.log('Exportar dados');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Painel Financeiro</h2>
          <p className="text-sm text-gray-600">
            Receita total: R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={period === 'day' ? 'primary' : 'outline'}
            onClick={() => setPeriod('day')}
          >
            Diário
          </Button>
          <Button
            size="sm"
            variant={period === 'month' ? 'primary' : 'outline'}
            onClick={() => setPeriod('month')}
          >
            Mensal
          </Button>
          <Button
            size="sm"
            variant={period === 'year' ? 'primary' : 'outline'}
            onClick={() => setPeriod('year')}
          >
            Anual
          </Button>
        </div>

        {period !== 'year' && (
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-lg border px-3 py-1 text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        )}

        {period === 'day' && (
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-lg border px-3 py-1 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(new Date(0, i), 'MMMM', { locale: ptBR })}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => 
                `R$ ${value.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                })}`
              }
            />
            <Tooltip 
              formatter={(value: number) => 
                `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              }
            />
            <Legend />
            <Bar 
              name="Receita" 
              dataKey="value" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}