import { useState } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateQuoteStatus } from '@/lib/quotes';
import type { Quote } from '@/types/quote';

interface QuoteDetailsProps {
  quote: Quote;
  onUpdate?: () => void;
}

export function QuoteDetails({ quote, onUpdate }: QuoteDetailsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status: Quote['status']) => {
    setLoading(true);
    try {
      await updateQuoteStatus(quote.id, status);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{quote.machineName}</h3>
          <p className="text-sm text-gray-500">
            Solicitado em {quote.createdAt.toLocaleDateString()}
          </p>
        </div>
        <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
          quote.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : quote.status === 'quoted'
            ? 'bg-blue-100 text-blue-800'
            : quote.status === 'accepted'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {quote.status === 'pending' ? (
            <>
              <Clock className="h-4 w-4" />
              Aguardando Resposta
            </>
          ) : quote.status === 'quoted' ? (
            <>
              <MessageSquare className="h-4 w-4" />
              Orçamento Recebido
            </>
          ) : quote.status === 'accepted' ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Aprovado
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              Recusado
            </>
          )}
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-gray-600">Período</p>
          <p className="mt-1 text-sm">
            {new Date(quote.startDate).toLocaleDateString()} até{' '}
            {new Date(quote.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Local</p>
          <p className="mt-1 text-sm">{quote.location}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">Finalidade</p>
        <p className="mt-1 text-sm">{quote.purpose}</p>
      </div>

      {quote.value && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-600">Valor do Orçamento</p>
          <p className="mt-1 text-lg font-semibold">
            R$ {quote.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          {quote.message && (
            <p className="mt-2 text-sm text-gray-600">{quote.message}</p>
          )}
        </div>
      )}

      {quote.status === 'quoted' && (
        <div className="mt-6 flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleStatusUpdate('rejected')}
            disabled={loading}
          >
            Recusar
          </Button>
          <Button
            className="flex-1"
            onClick={() => handleStatusUpdate('accepted')}
            disabled={loading}
          >
            Aprovar Orçamento
          </Button>
        </div>
      )}
    </div>
  );
}