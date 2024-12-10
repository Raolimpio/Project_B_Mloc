import { MachineCard } from './machine-card';
import { IMaquina } from '../../types/machine.types';

// Usando um tipo mais específico apenas com os campos necessários para o grid
type MachineGridItem = Pick<IMaquina, 'id' | 'nome' | 'descricaoBreve' | 'imagemProduto' | 'precoPromocional'>;

interface MachineGridProps {
  machines: MachineGridItem[];
  loading: boolean;
  onMachineClick: (machine: MachineGridItem) => void;
}

export function MachineGrid({ machines, loading, onMachineClick }: MachineGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando máquinas...</p>
        </div>
      </div>
    );
  }

  if (machines.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <p className="text-gray-600">Nenhuma máquina encontrada.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          onRentClick={onMachineClick}
        />
      ))}
    </div>
  );
}
