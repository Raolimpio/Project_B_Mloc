import { DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';

interface PhaseHeaderProps {
  phase: string;
  machines: string[];
  totalMachines: number;
}

export function PhaseHeader({ phase, machines, totalMachines }: PhaseHeaderProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="relative aspect-[3/1] w-full">
        <img
          src={DEFAULT_CATEGORY_IMAGE}
          alt={phase}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold text-white">{phase}</h1>
          <p className="mt-2 text-lg text-white/90">
            {totalMachines} {totalMachines === 1 ? 'máquina disponível' : 'máquinas disponíveis'}
          </p>
          <p className="mt-1 text-white/80">
            {machines.length} tipos de equipamentos
          </p>
        </div>
      </div>
    </div>
  );
}