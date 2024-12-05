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
    const machineQuotes = quotes.filter(
      quote => 
        quote.machineId === machine.id && 
        ['accepted', 'in_preparation', 'in_transit', 'delivered', 'return_requested', 'pickup_scheduled', 'returned']
        .includes(quote.status)
    );

    return {
      id: machine.id,
      name: machine.name,
      totalRentals: machineQuotes.length,
      revenue: machineQuotes.reduce((sum, quote) => sum + (quote.value || 0), 0),
      imageUrl: machine.imageUrl || machine.photoUrl,
    };
  });

  // Ordenar primeiro por número de aluguéis e depois por receita em caso de empate
  return machineStats.sort((a, b) => {
    if (b.totalRentals !== a.totalRentals) {
      return b.totalRentals - a.totalRentals;
    }
    return b.revenue - a.revenue;
  });
}

export function calculateTotalRevenue(quotes: Quote[]): number {
  return quotes
    .filter(quote => 
      ['accepted', 'in_preparation', 'in_transit', 'delivered', 'return_requested', 'pickup_scheduled', 'returned']
      .includes(quote.status)
    )
    .reduce((sum, quote) => sum + (quote.value || 0), 0);
}