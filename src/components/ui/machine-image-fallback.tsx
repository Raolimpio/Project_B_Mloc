import { Package } from 'lucide-react';

interface MachineImageFallbackProps {
  className?: string;
}

export function MachineImageFallback({ className = "w-full h-full" }: MachineImageFallbackProps) {
  return (
    <div className={`flex flex-col items-center justify-center bg-muted ${className}`}>
      <Package className="h-12 w-12 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">Imagem não disponível</p>
    </div>
  );
}
