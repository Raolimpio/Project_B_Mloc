import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Truck, Package, MapPin, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { getQuotesByOwner, updateQuoteStatus } from '@/lib/quotes';
import type { Quote } from '@/types/quote';

interface ApprovedQuotesProps {
  userId: string;
}

type StatusFilter = 'all' | 'accepted' | 'in_preparation' | 'in_transit' | 'delivered';

export function ApprovedQuotes({ userId }: ApprovedQuotesProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingQuote, setUpdatingQuote] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    loadQuotes();
  }, [userId]);

  async function loadQuotes() {
    try {
      const quotesData = await getQuotesByOwner(userId);
      setQuotes(quotesData.filter(quote => 
        quote.status === 'accepted' || 
        quote.status === 'in_preparation' || 
        quote.status === 'in_transit' || 
        quote.status === 'delivered'
      ));
    } catch (error) {
      console.error('Error loading quotes:', error);
      setError('Não foi possível carregar os orçamentos');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (quoteId: string, newStatus: Quote['status']) => {
    try {
      setUpdatingQuote(quoteId);
      await updateQuoteStatus(quoteId, newStatus);
      await loadQuotes(); // Reload quotes to get updated data
    } catch (error) {
      console.error('Error updating quote status:', error);
      setError('Não foi possível atualizar o status');
    } finally {
      setUpdatingQuote(null);
    }
  };

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_preparation':
        return <Package className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <MapPin className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: Quote['status']) => {
    switch (status) {
      case 'accepted':
        return 'Aprovado';
      case 'in_preparation':
        return 'Em Preparação';
      case 'in_transit':
        return 'Em Rota de Entrega';
      case 'delivered':
        return 'Entregue';
      default:
        return 'Aprovado';
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'in_preparation':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getPreviousStatus = (currentStatus: Quote['status']): Quote['status'] | null => {
    switch (currentStatus) {
      case 'in_preparation':
        return 'accepted';
      case 'in_transit':
        return 'in_preparation';
      case 'delivered':
        return 'in_transit';
      default:
        return null;
    }
  };

  const getNextStatus = (currentStatus: Quote['status']): Quote['status'] | null => {
    switch (currentStatus) {
      case 'accepted':
        return 'in_preparation';
      case 'in_preparation':
        return 'in_transit';
      case 'in_transit':
        return 'delivered';
      default:
        return null;
    }
  };

  // Calculate counts for each status
  const statusCounts = {
    all: quotes.length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    in_preparation: quotes.filter(q => q.status === 'in_preparation').length,
    in_transit: quotes.filter(q => q.status === 'in_transit').length,
    delivered: quotes.filter(q => q.status === 'delivered').length,
  };

  const filteredQuotes = quotes.filter(quote => 
    statusFilter === 'all' || quote.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando orçamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Feedback type="error" message={error} className="my-4" />;
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">Nenhum orçamento aprovado</h3>
        <p className="mt-1 text-gray-500">
          Os orçamentos aprovados aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {filteredQuotes.length} de {quotes.length} orçamentos
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          Todos ({statusCounts.all})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'accepted' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('accepted')}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          Aprovados ({statusCounts.accepted})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'in_preparation' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('in_preparation')}
          className="flex items-center gap-1"
        >
          <Package className="h-4 w-4" />
          Em Preparação ({statusCounts.in_preparation})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'in_transit' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('in_transit')}
          className="flex items-center gap-1"
        >
          <Truck className="h-4 w-4" />
          Em Rota ({statusCounts.in_transit})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'delivered' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('delivered')}
          className="flex items-center gap-1"
        >
          <MapPin className="h-4 w-4" />
          Entregues ({statusCounts.delivered})
        </Button>
      </div>

      <div className="space-y-4">
        {filteredQuotes.map((quote) => (
          <div key={quote.id} className="flex overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="relative h-auto w-48">
              <img
                src={quote.machinePhoto}
                alt={quote.machineName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800';
                }}
              />
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{quote.requesterName}</h3>
                  <p className="text-sm text-gray-500">
                    {quote.machineName}
                  </p>
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(quote.status)}`}>
                  {getStatusIcon(quote.status)}
                  {getStatusText(quote.status)}
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

              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-600">Valor do Orçamento</p>
                <p className="mt-1 text-lg font-semibold">
                  R$ {quote.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                {quote.message && (
                  <p className="mt-2 text-sm text-gray-600">{quote.message}</p>
                )}
              </div>

              {quote.status !== 'delivered' && (
                <div className="mt-4 flex gap-2">
                  {getPreviousStatus(quote.status) && (
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateStatus(quote.id, getPreviousStatus(quote.status)!)}
                      disabled={updatingQuote === quote.id}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar para {getStatusText(getPreviousStatus(quote.status)!)}
                    </Button>
                  )}
                  {getNextStatus(quote.status) && (
                    <Button
                      onClick={() => handleUpdateStatus(quote.id, getNextStatus(quote.status)!)}
                      disabled={updatingQuote === quote.id}
                      className="flex-1"
                    >
                      Avançar para {getStatusText(getNextStatus(quote.status)!)}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}