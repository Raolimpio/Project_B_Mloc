import { useMemo } from 'react';
import { Package, Award } from 'lucide-react';
import { calculateMachineStats } from '@/lib/stats';
import { DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import type { Machine } from '@/types';
import type { Quote } from '@/types/quote';

interface TopMachinesProps {
  machines: Machine[];
  quotes: Quote[];
}

export function TopMachines({ machines, quotes }: TopMachinesProps) {
  const topMachines = useMemo(() => {
    const stats = calculateMachineStats(machines, quotes);
    return stats.slice(0, 4); // Get top 4 machines
  }, [machines, quotes]);

  if (topMachines.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg bg-gray-50">
        <div className="text-center">
          <Package className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-gray-500">Nenhum aluguel registrado ainda</p>
        </div>
      </div>
    );
  }

  const totalRentals = topMachines.reduce((sum, machine) => sum + machine.totalRentals, 0);

  return (
    <div className="flex h-72 flex-col">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Máquinas Mais Alugadas</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total de Aluguéis</p>
          <p className="font-semibold text-blue-600">{totalRentals}</p>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {topMachines.map((machine, index) => (
          <div
            key={machine.id}
            className="relative overflow-hidden rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="absolute -left-2 top-0 h-full w-1 bg-gradient-to-b from-blue-600 to-blue-400" />
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={machine.imageUrl || DEFAULT_CATEGORY_IMAGE}
                  alt={machine.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== DEFAULT_CATEGORY_IMAGE) {
                      target.src = DEFAULT_CATEGORY_IMAGE;
                    }
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-lg font-bold text-white">#{index + 1}</span>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h4 className="font-medium">{machine.name}</h4>
                  <div className="mt-1 flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Aluguéis</p>
                      <p className="text-sm font-medium">{machine.totalRentals}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Receita</p>
                      <p className="text-sm font-medium text-green-600">
                        R$ {machine.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-xs font-medium text-gray-900">
                    {((machine.totalRentals / totalRentals) * 100).toFixed(1)}%
                  </div>
                  <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                      style={{ width: `${(machine.totalRentals / topMachines[0].totalRentals) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}