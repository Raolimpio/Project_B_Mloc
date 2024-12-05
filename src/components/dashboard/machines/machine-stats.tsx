import { Package, DollarSign, Clock } from 'lucide-react';

interface MachineStats {
  totalMachines: number;
  availableMachines: number;
  rentedMachines: number;
}

interface MachineStatsProps {
  stats: MachineStats;
}

export function MachineStats({ stats }: MachineStatsProps) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total de Máquinas</p>
            <p className="text-2xl font-semibold">{stats.totalMachines}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Disponíveis</p>
            <p className="text-2xl font-semibold">{stats.availableMachines}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-yellow-100 p-3">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Alugadas</p>
            <p className="text-2xl font-semibold">{stats.rentedMachines}</p>
          </div>
        </div>
      </div>
    </div>
  );
}