import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { updateQuoteStatus } from '@/lib/quotes';
import type { Quote } from '@/types/quote';

interface QuoteResponseModalProps {
  quote: Quote;
  onClose: () => void;
  onSuccess: () => void;
}

export function QuoteResponseModal({ quote, onClose, onSuccess }: QuoteResponseModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    value: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.value || !formData.message) {
        throw new Error('Por favor, preencha todos os campos');
      }

      await updateQuoteStatus(quote.id, 'quoted', {
        value: parseFloat(formData.value),
        message: formData.message,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar resposta');
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

        <h2 className="mb-6 text-xl font-semibold">Responder Orçamento</h2>

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="mb-4">
            <h3 className="font-medium">{quote.machineName}</h3>
            <p className="text-sm text-gray-600">Solicitado por {quote.requesterName}</p>
          </div>
          
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-gray-600">Período</p>
              <p>{new Date(quote.startDate).toLocaleDateString()} até {new Date(quote.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Local</p>
              <p>{quote.location}</p>
            </div>
          </div>
        </div>

        {error && (
          <Feedback
            type="error"
            message={error}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Valor do Orçamento (R$)</label>
            <input
              type="number"
              required
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              placeholder="0,00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Observações</label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="h-32 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Detalhes do orçamento, condições, prazo de validade, etc."
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
              {loading ? 'Enviando...' : 'Enviar Orçamento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}