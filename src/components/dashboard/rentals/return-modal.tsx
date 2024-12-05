import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Quote } from '@/types/quote';

interface ReturnModalProps {
  rental: Quote;
  onClose: () => void;
  onSubmit: (returnType: 'store' | 'pickup', notes?: string) => void;
}

export function ReturnModal({ rental, onClose, onSubmit }: ReturnModalProps) {
  const [returnType, setReturnType] = useState<'store' | 'pickup'>('store');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(returnType, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Solicitar Devolução</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Como você deseja fazer a devolução?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="returnType"
                  value="store"
                  checked={returnType === 'store'}
                  onChange={(e) => setReturnType(e.target.value as 'store' | 'pickup')}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Devolver na loja</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="returnType"
                  value="pickup"
                  checked={returnType === 'pickup'}
                  onChange={(e) => setReturnType(e.target.value as 'store' | 'pickup')}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Solicitar retirada</span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-24 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Adicione informações relevantes para a devolução..."
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Confirmar Devolução
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}