import { DollarSign, Users, Package } from 'lucide-react';

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total de Máquinas</p>
            <p className="text-2xl font-semibold">12</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Faturamento Mensal</p>
            <p className="text-2xl font-semibold">R$ 5.240</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-purple-100 p-3">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
            <p className="text-2xl font-semibold">8</p>
          </div>
        </div>
      </div>
    </div>
  );
}