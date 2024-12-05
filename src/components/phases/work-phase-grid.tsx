import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WORK_PHASES } from '@/lib/constants';

export function WorkPhaseGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(WORK_PHASES).map(([phase, data]) => (
        <Link
          key={phase}
          to={`/phases/${phase.toLowerCase().replace(/\s+/g, '-')}`}
          className="block"
        >
          <Card hover className="h-full transition-colors hover:bg-primary-50">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">{phase}</h3>
              
              <div className="flex flex-wrap gap-2">
                {data.machines.slice(0, 3).map((machine) => (
                  <Badge key={machine} variant="secondary">
                    {machine}
                  </Badge>
                ))}
                {data.machines.length > 3 && (
                  <Badge variant="secondary">
                    +{data.machines.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}