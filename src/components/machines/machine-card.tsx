import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { IMaquina } from '@/types/machine.types';
import { Link } from 'react-router-dom';

interface MachineCardProps {
  machine: IMaquina;
  onRentClick: (machine: IMaquina) => void;
}

export function MachineCard({ machine, onRentClick }: MachineCardProps) {
  // Tentar todas as possíveis fontes de imagem
  const imageUrl = machine.fotos?.[0] || 
                  machine.fotoPrincipal || 
                  (machine as any).imagemProduto || 
                  '/placeholder-image.jpg';

  console.log('Dados da máquina no card:', {
    id: machine.id,
    nome: machine.nome,
    fotos: machine.fotos,
    fotoPrincipal: machine.fotoPrincipal,
    imagemProduto: (machine as any).imagemProduto,
    imagemFinal: imageUrl
  });

  return (
    <Link to={`/machines/${machine.id}`}>
      <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="group relative w-full overflow-hidden rounded-t-lg">
          <div className="aspect-[4/3] sm:aspect-video">
            <img
              src={imageUrl}
              alt={machine.nome}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
                console.error('Erro ao carregar imagem:', {
                  url: imageUrl,
                  machine: machine.id
                });
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-1">{machine.nome}</h3>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-white/80 line-clamp-2">{machine.descricaoBreve}</p>
          </div>
        </div>
        
        <CardContent className="p-3 sm:p-4">
          <p className="text-sm text-gray-600 line-clamp-3">{machine.descricao}</p>
        </CardContent>

        <CardFooter className="border-t p-3 sm:p-4">
          <Button 
            onClick={(e) => {
              e.preventDefault(); // Impede a navegação do Link
              onRentClick(machine);
            }}
            className="w-full text-sm sm:text-base py-2 sm:py-2.5"
            variant="primary"
          >
            Solicitar Orçamento
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
