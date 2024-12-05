import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { createQuoteRequest } from '@/lib/quotes';
import type { Machine } from '@/types';

interface QuoteModalProps {
  machine: Machine;
  onClose: () => void;
  onSuccess: () => void;
}

export function QuoteModal({ machine, onClose, onSuccess }: QuoteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    additionalInfo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createQuoteRequest({
        machineId: machine.id,
        ownerId: machine.ownerId,
        ...formData
      });
      
      onSuccess();
    } catch (err) {
      setError('Erro ao enviar solicitação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
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

        <h2 className="mb-6 text-xl font-semibold">Solicitar Orçamento</h2>

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
            <label className="mb-1 block text-sm font-medium">Local de Uso</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Endereço onde o equipamento será utilizado"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descrição do Uso</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="h-24 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Descreva como pretende utilizar o equipamento"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Informações Adicionais</label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
              className="h-24 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Outras informações relevantes (opcional)"
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
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}