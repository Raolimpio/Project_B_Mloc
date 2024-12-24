import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackProps {
  type: 'success' | 'error';
  message: string;
  className?: string;
}

export function Feedback({ type, message, className }: FeedbackProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4 rounded-md text-sm',
        type === 'success' && 'bg-green-50 text-green-700',
        type === 'error' && 'bg-red-50 text-red-700',
        className
      )}
    >
      {type === 'success' ? (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
      )}
      <p>{message}</p>
    </div>
  );
}