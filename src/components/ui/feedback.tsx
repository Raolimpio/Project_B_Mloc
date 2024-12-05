import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  className?: string;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

const styles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

export function Feedback({ type, message, className }: FeedbackProps) {
  const Icon = icons[type];
  
  return (
    <div className={cn(
      'flex items-center gap-3 rounded-lg border p-4',
      styles[type],
      className
    )}>
      <Icon className="h-5 w-5" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
    </div>
  );
}

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-gray-200', className)} />
  );
}