import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { SiteContent } from '@/lib/content';

interface PhaseCardProps {
  phase: SiteContent;
  onEdit: () => void;
  onDelete: () => void;
}

export function PhaseCard({ phase, onEdit, onDelete }: PhaseCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-2xl">
            {phase.icon}
          </div>
          <div>
            <h3 className="font-medium">{phase.title}</h3>
            {phase.description && (
              <p className="text-sm text-gray-500">{phase.description}</p>
            )}
          </div>
        </div>

        {phase.machines && phase.machines.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-600">Máquinas Relacionadas:</p>
            <div className="flex flex-wrap gap-2">
              {phase.machines.map((machine, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                >
                  {machine}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${phase.active ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-600">
              {phase.active ? 'Ativa' : 'Inativa'}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}