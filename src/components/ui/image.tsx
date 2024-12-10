import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export function Image({
  src,
  alt = '',
  className,
  fallbackClassName,
  ...props
}: ImageProps) {
  return (
    <div className={cn('relative overflow-hidden bg-gray-100', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '';
          }}
          {...props}
        />
      ) : (
        <div className={cn(
          'flex h-full w-full items-center justify-center bg-gray-100',
          fallbackClassName
        )}>
          <ImageIcon className="h-12 w-12 text-gray-400" />
        </div>
      )}
    </div>
  );
}
