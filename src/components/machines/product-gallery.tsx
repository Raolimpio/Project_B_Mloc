import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OptimizedImage } from '../ui/optimized-image';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ProductGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ProductGallery({ images, title, className }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Imagem principal */}
      <div className="relative">
        <OptimizedImage
          src={images[currentIndex]}
          alt={`${title} - Imagem ${currentIndex + 1}`}
          aspectRatio="4:3"
          priority={currentIndex === 0}
          className="rounded-lg shadow-lg"
        />

        {/* Botões de navegação */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative flex-none transition-opacity',
                currentIndex === index ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              )}
            >
              <OptimizedImage
                src={image}
                alt={`${title} - Miniatura ${index + 1}`}
                className="h-16 w-16 rounded-md"
                aspectRatio="square"
              />
              {currentIndex === index && (
                <div className="absolute inset-0 rounded-md ring-2 ring-primary ring-offset-2" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
