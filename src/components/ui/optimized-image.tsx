import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: 'square' | '16:9' | '4:3' | 'auto';
  objectFit?: 'contain' | 'cover';
  priority?: boolean;
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder.jpg',
  aspectRatio = 'auto',
  objectFit = 'cover',
  priority = false,
  quality = 75,
  className,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src);
      setError(false);
      setIsLoading(!priority);
    }
  }, [src, imgSrc, priority]);

  // Função para gerar URL otimizada
  const getOptimizedUrl = (url: string): string => {
    if (url.includes('unsplash.com')) {
      // Otimização para Unsplash
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format&q=${quality}&w=800`;
    }
    if (url.includes('firebasestorage.googleapis.com')) {
      // Mantém a URL do Firebase como está, já que não suporta parâmetros de transformação
      return url;
    }
    // Adicione mais casos para outros provedores de imagem conforme necessário
    return url;
  };

  const aspectRatioClass = {
    'square': 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-4/3',
    'auto': 'aspect-auto'
  }[aspectRatio];

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setImgSrc(fallbackSrc);
  };

  return (
    <div className={cn(
      'relative overflow-hidden bg-gray-100',
      aspectRatioClass,
      className
    )}>
      {/* Skeleton loader */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      {/* Imagem real */}
      <img
        src={getOptimizedUrl(imgSrc)}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'h-full w-full transition-opacity duration-300',
          objectFit === 'contain' ? 'object-contain' : 'object-cover',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        {...props}
      />
    </div>
  );
}
