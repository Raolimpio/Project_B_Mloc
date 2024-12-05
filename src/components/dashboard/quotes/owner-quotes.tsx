import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { getQuotesByOwner, updateQuoteStatus } from '@/lib/quotes';
import { QuoteResponseModal } from './quote-response-modal';
import type { Quote } from '@/types/quote';

interface OwnerQuotesProps {
  userId: string;
}

type TabType = 'pending' | 'quoted';
type StatusFilter = Quote['status'] | 'all';

export function OwnerQuotes({ userId }: OwnerQuotesProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    loadQuotes();
  }, [userId]);

  async function loadQuotes() {
    try {
      const quotesData = await getQuotesByOwner(userId);
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error loading quotes:', error);
      setError('Não foi possível carregar os orçamentos');
    } finally {
      setLoading(false);
    }
  }

  const handleQuoteResponse = async (quoteId: string, status: 'quoted' | 'rejected') => {
    try {
      await updateQuoteStatus(quoteId, status);
      await loadQuotes();
      setSelectedQuote(null);
    } catch (error) {
      console.error('Error updating quote:', error);
      setError('Não foi possível atualizar o orçamento');
    }
  };

  const handleQuoteSuccess = () => {
    if (selectedQuote) {
      loadQuotes();
      setSelectedQuote(null);
    }
  };

  // Calculate counts for each status
  const statusCounts = {
    pending: quotes.filter(q => q.status === 'pending').length,
    quoted: quotes.filter(q => q.status === 'quoted').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
    in_preparation: quotes.filter(q => q.status === 'in_preparation').length,
    in_transit: quotes.filter(q => q.status === 'in_transit').length,
    delivered: quotes.filter(q => q.status === 'delivered').length,
  };

  const filteredQuotes = quotes.filter(quote => {
    if (statusFilter !== 'all' && quote.status !== statusFilter) {
      return false;
    }
    
    if (activeTab === 'pending') {
      return quote.status === 'pending';
    }
    return quote.status === 'quoted';
  });

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
            <h3 className="font-medium">{quote.requesterName}</h3>
            <p className="text-sm text-gray-500">
              {quote.machineName}
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
                Orçamento Enviado
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

        {quote.status === 'pending' && (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleQuoteResponse(quote.id, 'rejected')}
            >
              Recusar
            </Button>
            <Button
              className="flex-1"
              onClick={() => setSelectedQuote(quote)}
            >
              Responder
            </Button>
          </div>
        )}
      </div>
    </div>
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
        <h3 className="mt-2 text-lg font-medium">Nenhum orçamento encontrado</h3>
        <p className="mt-1 text-gray-500">
          Os orçamentos recebidos aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeTab === 'pending' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('pending')}
            className="flex items-center gap-1"
          >
            <Clock className="h-4 w-4" />
            Recebidos ({statusCounts.pending})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'quoted' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('quoted')}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            Em Aprovação ({statusCounts.quoted})
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {showFilters && (
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-3 font-medium">Filtrar por Status</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              Todos ({quotes.length})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'pending' ? 'primary' : 'outline'}
              onClick={() => setStatusFilter('pending')}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              Pendentes ({statusCounts.pending})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'quoted' ? 'primary' : 'outline'}
              onClick={() => setStatusFilter('quoted')}
              className="flex items-center gap-1"
            >
              <MessageSquare className="h-4 w-4" />
              Em Aprovação ({statusCounts.quoted})
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
              variant={statusFilter === 'rejected' ? 'primary' : 'outline'}
              onClick={() => setStatusFilter('rejected')}
              className="flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" />
              Recusados ({statusCounts.rejected})
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredQuotes.map(renderQuoteCard)}
      </div>

      {selectedQuote && (
        <QuoteResponseModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onSuccess={handleQuoteSuccess}
        />
      )}
    </div>
  );
}