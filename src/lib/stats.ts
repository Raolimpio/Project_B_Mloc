import type { Machine } from '@/types';
import type { Quote } from '@/types/quote';

export interface MachineStats {
  id: string;
  name: string;
  totalRentals: number;
  revenue: number;
  imageUrl?: string;
}

export function calculateMachineStats(machines: Machine[], quotes: Quote[]): MachineStats[] {
  const machineStats = machines.map(machine => {
    // Filtrar orçamentos finalizados desta máquina
    const machineQuotes = quotes.filter(
      quote => 
        quote.machineId === machine.id && 
        ['delivered', 'completed', 'returned'].includes(quote.status)
    );

    return {
      id: machine.id,
      name: machine.name,
      totalRentals: machineQuotes.length,
      revenue: machineQuotes.reduce((sum, quote) => sum + (quote.value || 0), 0),
      imageUrl: machine.fotoPrincipal || machine.imagemProduto || machine.imageUrl,
    };
  });

  // Ordenar primeiro por receita e depois por número de aluguéis em caso de empate
  return machineStats.sort((a, b) => {
    if (b.revenue !== a.revenue) {
      return b.revenue - a.revenue;
    }
    return b.totalRentals - a.totalRentals;
  });
}

export function calculateTotalRevenue(quotes: Quote[]): number {
  return quotes
    .filter(quote => 
      ['delivered', 'completed', 'returned'].includes(quote.status)
    )
    .reduce((sum, quote) => sum + (quote.value || 0), 0);
}