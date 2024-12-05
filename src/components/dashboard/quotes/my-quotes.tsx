import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, Package, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { getQuotesByRequester, updateQuoteStatus } from '@/lib/quotes';
import type { Quote } from '@/types/quote';

interface MyQuotesProps {
  userId: string;
}

type TabType = 'pending' | 'responded' | 'approved';

export function MyQuotes({ userId }: MyQuotesProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingQuote, setUpdatingQuote] = useState<string | null>(null);

  useEffect(() => {
    loadQuotes();
  }, [userId]);

  async function loadQuotes() {
    try {
      const quotesData = await getQuotesByRequester(userId);
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error loading quotes:', error);
      setError('Não foi possível carregar seus orçamentos');
    } finally {
      setLoading(false);
    }
  }

  const handleQuoteAction = async (quoteId: string, status: 'accepted' | 'rejected') => {
    try {
      setUpdatingQuote(quoteId);
      await updateQuoteStatus(quoteId, status);
      await loadQuotes(); // Recarrega os orçamentos para ter os dados mais atualizados
    } catch (error) {
      console.error('Error updating quote:', error);
      setError('Não foi possível atualizar o orçamento');
    } finally {
      setUpdatingQuote(null);
    }
  };

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
        <h3 className="mt-2 text-lg font-medium">Nenhum orçamento encontrado</h3>
        <p className="mt-1 text-gray-500">
          Você ainda não solicitou nenhum orçamento.
        </p>
      </div>
    );
  }

  // Filtragem dos orçamentos por status
  const pendingQuotes = quotes.filter(quote => quote.status === 'pending');
  const respondedQuotes = quotes.filter(quote => quote.status === 'quoted');
  const finishedQuotes = quotes.filter(quote => 
    ['accepted', 'rejected', 'in_preparation', 'in_transit', 'delivered'].includes(quote.status)
  );

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'quoted':
        return <MessageSquare className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'in_preparation':
        return <Package className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return 'Aguardando Resposta';
      case 'quoted':
        return 'Orçamento Recebido';
      case 'accepted':
        return 'Aprovado';
      case 'rejected':
        return 'Recusado';
      case 'in_preparation':
        return 'Em Preparação';
      case 'in_transit':
        return 'Em Rota de Entrega';
      case 'delivered':
        return 'Entregue';
      default:
        return 'Aguardando';
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_preparation':
        return 'bg-purple-100 text-purple-800';
      case 'in_transit':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderQuoteCard = (quote: Quote) => (
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
            <h3 className="font-medium">{quote.machineName}</h3>
            <p className="text-sm text-gray-500">
              Solicitado em {quote.createdAt.toLocaleDateString()}
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
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleQuoteAction(quote.id, 'rejected')}
              disabled={updatingQuote === quote.id}
            >
              Recusar
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleQuoteAction(quote.id, 'accepted')}
              disabled={updatingQuote === quote.id}
            >
              {updatingQuote === quote.id ? 'Processando...' : 'Aprovar'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeTab === 'pending' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('pending')}
          className="flex items-center gap-1"
        >
          <Clock className="h-4 w-4" />
          Solicitados ({pendingQuotes.length})
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'responded' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('responded')}
          className="flex items-center gap-1"
        >
          <MessageSquare className="h-4 w-4" />
          Em Aprovação ({respondedQuotes.length})
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'approved' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('approved')}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          Finalizados ({finishedQuotes.length})
        </Button>
      </div>

      <div className="space-y-4">
        {activeTab === 'pending' && pendingQuotes.map(renderQuoteCard)}
        {activeTab === 'responded' && respondedQuotes.map(renderQuoteCard)}
        {activeTab === 'approved' && finishedQuotes.map(renderQuoteCard)}
      </div>
    </div>
  );
}