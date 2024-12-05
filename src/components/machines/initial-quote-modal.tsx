import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import type { Machine } from '@/types';
import type { UserProfile } from '@/types/auth';

interface InitialQuoteModalProps {
  machine: Machine;
  userProfile?: UserProfile | null;
  onClose: () => void;
  onNext: (quoteData: InitialQuoteData) => void;
}

export interface InitialQuoteData {
  startDate: string;
  endDate: string;
  purpose: string;
  location: string;
}

export function InitialQuoteModal({ machine, userProfile, onClose, onNext }: InitialQuoteModalProps) {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<InitialQuoteData>({
    startDate: '',
    endDate: '',
    purpose: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('A data final deve ser posterior à data inicial');
      return;
    }

    onNext(formData);
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

        <h2 className="mb-6 text-xl font-semibold">Detalhes do Aluguel</h2>

        {error && (
          <Feedback
            type="error"
            message={error}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Data Inicial</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Data Final</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
                  min={formData.startDate}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Finalidade do Uso</label>
            <select
              required
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecione a finalidade</option>
              <option value="construcao">Construção</option>
              <option value="reforma">Reforma</option>
              <option value="evento">Evento</option>
              <option value="jardinagem">Jardinagem</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Local de Entrega</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Endereço completo para entrega"
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
              {userProfile ? 'Enviar Solicitação' : 'Continuar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}