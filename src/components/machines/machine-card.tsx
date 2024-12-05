import { Machine } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Edit } from 'lucide-react';
import { DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import { useAuth } from '@/contexts/auth-context';

interface MachineCardProps {
  machine: Machine;
  onRentClick: (machine: Machine) => void;
  buttonText?: string;
}

export function MachineCard({ machine, onRentClick }: MachineCardProps) {
  const { userProfile } = useAuth();
  const isOwner = userProfile?.uid === machine.ownerId;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== DEFAULT_CATEGORY_IMAGE) {
      target.src = DEFAULT_CATEGORY_IMAGE;
    }
  };

  return (
    <Card hover>
      <div className="group relative aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={machine.imageUrl || machine.photoUrl || DEFAULT_CATEGORY_IMAGE}
          alt={machine.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-semibold text-white">{machine.name}</h3>
          <p className="mt-1 text-sm text-white/80">{machine.shortDescription}</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">{machine.category}</Badge>
          <Badge>{machine.subcategory}</Badge>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button 
          onClick={() => onRentClick(machine)}
          className="w-full"
          variant={isOwner ? 'outline' : 'primary'}
        >
          {isOwner ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Editar Máquina
            </>
          ) : (
            'Solicitar Orçamento'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}