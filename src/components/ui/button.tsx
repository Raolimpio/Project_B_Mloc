import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild, ...props }, ref) => {
    // Remove asChild do spread para não passar para o elemento button
    const { asChild: _, ...restProps } = props;
    
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary': variant === 'primary',
            'bg-primary-50 text-primary hover:bg-primary-100': variant === 'secondary',
            'border border-primary-200 bg-transparent text-primary hover:bg-primary-50 hover:border-primary-300': variant === 'outline',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...restProps}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };