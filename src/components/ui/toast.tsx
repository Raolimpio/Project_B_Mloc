import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  onClose: (id: string) => void;
}

const variants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
};

const icons = {
  default: Info,
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
};

export function Toast({ id, title, description, variant = 'default', onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = icons[variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 200);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={id}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            'pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5',
            {
              'bg-green-50': variant === 'success',
              'bg-red-50': variant === 'error',
              'bg-yellow-50': variant === 'warning',
            }
          )}
        >
          <div className="w-0 flex-1 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon
                  className={cn('h-6 w-6', {
                    'text-green-400': variant === 'success',
                    'text-red-400': variant === 'error',
                    'text-yellow-400': variant === 'warning',
                    'text-blue-400': variant === 'default',
                  })}
                />
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                {description && (
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 200);
              }}
              className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ToastContainer({ toasts }: { toasts: any[] }) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
