import { useNavigate } from 'react-router-dom';
import { MachineCard } from './machine-card';
import { useAuth } from '@/contexts/auth-context';
import type { Machine } from '@/types';

interface MachineGridProps {
  machines: Machine[];
  loading: boolean;
  onMachineClick?: (machine: Machine) => void;
}

export function MachineGrid({ machines, loading, onMachineClick }: MachineGridProps) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

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

  const handleMachineClick = (machine: Machine) => {
    const isOwner = userProfile?.uid === machine.ownerId;
    
    if (isOwner) {
      navigate(`/machines/edit/${machine.id}`);
    } else if (onMachineClick) {
      onMachineClick(machine);
    } else {
      navigate(`/machines/${machine.id}`);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          onRentClick={handleMachineClick}
        />
      ))}
    </div>
  );
}