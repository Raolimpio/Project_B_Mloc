import { useState } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}

interface Toast extends ToastOptions {
  id: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      ...options,
      duration: options.duration || 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration);
  };

  return { toast, toasts };
}
