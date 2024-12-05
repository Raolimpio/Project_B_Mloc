import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WORK_PHASES, MACHINE_SUBCATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MostRentedMachines } from './most-rented-machines';

type ViewMode = 'phases' | 'popular' | 'type';

export function CategoryGrid() {
  const [viewMode, setViewMode] = useState<ViewMode>('phases');

  const renderCard = (
    key: string,
    title: string, 
    items: string[], 
    href: string
  ) => (
    <Link
      key={key}
      to={href}
      className="block"
    >
      <Card hover className="group h-full transition-colors hover:bg-primary-50">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex flex-wrap justify-center gap-1">
              {items.slice(0, 3).map((item) => (
                <Badge
                  key={`${key}-${item}`}
                  variant="secondary"
                >
                  {item}
                </Badge>
              ))}
              {items.length > 3 && (
                <Badge variant="secondary">
                  +{items.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Equipamentos para locação</h2>
        <div className="flex gap-4">
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
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(WORK_PHASES).map(([phase, data]) => (
            renderCard(
              `phase-${phase}`,
              phase,
              data.machines,
              `/phases/${phase.toLowerCase().replace(/\s+/g, '-')}`
            )
          ))}
        </div>
      )}

      {viewMode === 'type' && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(MACHINE_SUBCATEGORIES).map(([category, machines]) => (
            renderCard(
              `type-${category}`,
              category,
              machines,
              `/categories/construction?type=${category}`
            )
          ))}
        </div>
      )}

      {viewMode === 'popular' && (
        <MostRentedMachines />
      )}
    </div>
  );
}