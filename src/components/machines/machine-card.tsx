import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';

interface Maquina {
  id: string;
  nome: string;
  descricaoBreve: string;
  imagemProduto: string;
  precoPromocional?: number; // Agora opcional
}

interface MachineCardProps {
  machine: Maquina;
  onRentClick: (machine: Maquina) => void;
}

export function MachineCard({ machine, onRentClick }: MachineCardProps) {
  return (
    <Card>
      <div className="group relative aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={machine.imagemProduto || '/placeholder-image.jpg'}
          alt={machine.nome}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-semibold text-white">{machine.nome}</h3>
          <p className="mt-1 text-sm text-white/80">{machine.descricaoBreve}</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        {machine.precoPromocional && (
          <p className="mt-2 text-lg font-semibold text-green-600">
            R$ {machine.precoPromocional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            <span className="text-sm text-gray-500">/dia</span>
          </p>
        )}
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button 
          onClick={() => onRentClick(machine)}
          className="w-full"
          variant="primary"
        >
          Solicitar Orçamento
        </Button>
      </CardFooter>
    </Card>
  );
}
