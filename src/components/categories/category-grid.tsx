import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WORK_PHASES, MACHINE_SUBCATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MostRentedMachines } from './most-rented-machines';

type ViewMode = 'phases' | 'popular' | 'type';

export function CategoryGrid() {
  const [viewMode, setViewMode] = useState<ViewMode>('phases');

  const renderCard = (
    key: string,
    title: string, 
    description: string,
    imageUrl: string,
    href: string
  ) => (
    <Link
      key={key}
      to={href}
      className="block"
    >
      <Card className="group h-full overflow-hidden">
        <div className="relative aspect-video w-full">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-white/80">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={viewMode === 'popular' ? 'primary' : 'outline'}
            onClick={() => setViewMode('popular')}
          >
            Mais alugados
          </Button>
          <Button
            variant={viewMode === 'phases' ? 'primary' : 'outline'}
            onClick={() => setViewMode('phases')}
          >
            Fases da obra
          </Button>
          <Button
            variant={viewMode === 'type' ? 'primary' : 'outline'}
            onClick={() => setViewMode('type')}
          >
            Tipo de trabalho
          </Button>
        </div>
      </div>

      {viewMode === 'phases' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(WORK_PHASES).map(([phase, data]) => (
            renderCard(
              `phase-${phase}`,
              phase,
              'Máquinas para a fase de ' + phase.toLowerCase(),
              data.bannerUrl || '/images/phases/' + phase.toLowerCase().replace(/\s+/g, '-') + '.jpg',
              `/phases/${phase.toLowerCase().replace(/\s+/g, '-')}`
            )
          ))}
        </div>
      )}

      {viewMode === 'type' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(MACHINE_SUBCATEGORIES).map(([category, data]) => (
            renderCard(
              `type-${category}`,
              category,
              'Máquinas para trabalhos de ' + category.toLowerCase(),
              '/images/categories/' + category.toLowerCase().replace(/\s+/g, '-') + '.jpg',
              `/categories/cat-${category.toLowerCase().replace(/\s+/g, '-')}`
            )
          ))}
        </div>
      )}

      {viewMode === 'popular' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MostRentedMachines />
        </div>
      )}
    </div>
  );
}