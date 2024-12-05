import { DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import type { MACHINE_CATEGORIES } from '@/lib/constants';

interface CategoryHeaderProps {
  category: typeof MACHINE_CATEGORIES[0];
  totalMachines: number;
}

export function CategoryHeader({ category, totalMachines }: CategoryHeaderProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="relative aspect-[3/1] w-full">
          <img
            src={category.image || DEFAULT_CATEGORY_IMAGE}
            alt={category.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_CATEGORY_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-bold text-white">{category.name}</h1>
            <p className="mt-2 text-lg text-white/90">
              {totalMachines} {totalMachines === 1 ? 'máquina disponível' : 'máquinas disponíveis'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}