import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-2",
        className
      )}
    >
      <img 
        src="https://mariloc.com.br/storage/2024/07/Mariloc-Logo.png"
        alt="Mariloc - Locação de Máquinas para Construção" 
        className="h-24 w-auto object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://placehold.co/200x80/012458/white?text=MARILOC';
        }}
      />
    </Link>
  );
}