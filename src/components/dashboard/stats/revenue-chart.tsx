import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Quote } from '@/types/quote';

interface RevenueChartProps {
  quotes: Quote[];
}

export function RevenueChart({ quotes }: RevenueChartProps) {
  const monthlyData = useMemo(() => {
    console.log('Processando dados do gráfico:', quotes);

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, 'MMM', { locale: ptBR }),
        timestamp: date.getTime(),
        year: date.getFullYear(),
        monthNumber: date.getMonth(),
        startDate: startOfMonth(date),
        endDate: endOfMonth(date)
      };
    }).reverse();

    const data = last6Months.map(({ month, year, startDate, endDate }) => {
      const monthQuotes = quotes.filter(quote => {
        if (!quote.createdAt) return false;
        
        const quoteDate = quote.createdAt instanceof Date 
          ? quote.createdAt 
          : new Date(quote.createdAt);
        
        if (isNaN(quoteDate.getTime())) return false;
        
        return (
          ['delivered', 'completed', 'returned'].includes(quote.status) &&
          quoteDate >= startDate &&
          quoteDate <= endDate
        );
      });

      const revenue = monthQuotes.reduce((sum, quote) => {
        const value = typeof quote.value === 'number' ? quote.value : 0;
        return sum + value;
      }, 0);

      return {
        name: `${month}/${year}`,
        revenue,
      };
    });

    console.log('Dados do gráfico processados:', data);
    return data;
  }, [quotes]);

  if (!quotes.length) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-gray-500">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
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
          <Bar 
            name="Receita" 
            dataKey="revenue" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}