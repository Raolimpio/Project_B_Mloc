import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-full bg-gray-100',
      sizeClasses[size],
      className
    )}>
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '';
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <User className={cn(
            'text-gray-400',
            size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'
          )} />
        </div>
      )}
    </div>
  );
}