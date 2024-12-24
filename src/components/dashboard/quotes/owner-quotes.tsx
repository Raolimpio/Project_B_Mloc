import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, Filter, Package, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { Card } from '@/components/ui/card';
import { subscribeToQuotes, updateQuoteStatus } from '@/lib/quotes';
import { QuoteResponseModal } from './quote-response-modal';
import type { Quote } from '@/types/quote';
import { MachineImageFallback } from '@/components/ui/machine-image-fallback';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { IMaquina } from '@/types/machine.types';

interface OwnerQuotesProps {
  userId: string;
}

interface QuoteWithMachine extends Quote {
  machine?: IMaquina;
}

type TabType = 'pending' | 'quoted';
type StatusFilter = Quote['status'] | 'all';

const formatAddress = (location: any): string => {
  if (typeof location === 'string') return location;
  
  if (typeof location === 'object' && location !== null) {
    const address = location;
    return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''}, ${address.neighborhood}, ${address.city} - ${address.state}, CEP: ${address.zipCode}`;
  }
  
  return 'Endereço não disponível';
};

export function OwnerQuotes({ userId }: OwnerQuotesProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [quotes, setQuotes] = useState<QuoteWithMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteWithMachine | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToQuotes(userId, 'owner', async (quotesData) => {
      console.log('Carregando dados das máquinas para os orçamentos:', quotesData);
      
      // Carregar dados da máquina para cada orçamento
      const quotesWithMachines = await Promise.all(
        quotesData.map(async (quote) => {
          try {
            console.log('Carregando dados da máquina:', quote.machineId);
            const machineDoc = await getDoc(doc(db, 'machines', quote.machineId));
            
            if (machineDoc.exists()) {
              const machineData = machineDoc.data();
              console.log('Dados da máquina carregados:', {
                id: machineDoc.id,
                fotoPrincipal: machineData.fotoPrincipal,
                imagemProduto: machineData.imagemProduto,
                fotos: machineData.fotos
              });
              
              return {
                ...quote,
                machine: { 
                  id: machineDoc.id,
                  ...machineData,
                  // Map old image fields to new format
                  fotos: machineData.fotos || [],
                  fotoPrincipal: machineData.fotoPrincipal || machineData.imagemProduto || null
                } as IMaquina
              };
            }
            console.warn('Máquina não encontrada:', quote.machineId);
            return quote;
          } catch (error) {
            console.error('Erro ao carregar máquina:', quote.machineId, error);
            return quote;
          }
        })
      );
      
      console.log('Orçamentos com dados das máquinas:', quotesWithMachines);
      setQuotes(quotesWithMachines);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleQuoteResponse = async (quote: QuoteWithMachine) => {
    setSelectedQuote(quote);
  };

  const handleModalClose = () => {
    setSelectedQuote(null);
  };

  const handleModalSuccess = () => {
    setSelectedQuote(null);
  };

  const statusCounts = {
    pending: quotes.filter(q => q.status === 'pending').length,
    quoted: quotes.filter(q => q.status === 'quoted').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
    in_preparation: quotes.filter(q => q.status === 'in_preparation').length,
    in_transit: quotes.filter(q => q.status === 'in_transit').length,
    delivered: quotes.filter(q => q.status === 'delivered').length,
  };

  const filteredQuotes = quotes.filter((quote) => {
    if (statusFilter === 'all') return true;
    return quote.status === statusFilter;
  });

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
        return 'Orçamento Enviado';
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

  const renderQuoteCard = (quote: QuoteWithMachine) => (
    <Card key={quote.id} className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 w-full sm:h-auto sm:w-48">
          {quote.machine?.fotoPrincipal || quote.machine?.fotos?.[0] ? (
            <img
              src={quote.machine.fotoPrincipal || quote.machine.fotos[0]}
              alt={quote.machineName}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
            />
          ) : (
            <MachineImageFallback />
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">{quote.requesterName}</h3>
              <p className="text-sm text-muted-foreground">
                {quote.machineName}
              </p>
            </div>
            <span className={`inline-flex items-center gap-1 self-start rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(quote.status)}`}>
              {getStatusIcon(quote.status)}
              {getStatusText(quote.status)}
            </span>
          </div>

          <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Período do Aluguel</p>
              <p className="mt-1">
                {new Date(quote.startDate).toLocaleDateString()} até{' '}
                {new Date(quote.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Local de Entrega</p>
              <p className="mt-1">{formatAddress(quote.location)}</p>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground">Finalidade</p>
            <p className="mt-1">{quote.purpose}</p>
          </div>

          {quote.value && (
            <div className="mt-4 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Valor do Orçamento</p>
                <p className="text-lg font-semibold text-primary">
                  R$ {quote.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              {quote.message && (
                <p className="mt-2 text-sm text-muted-foreground">{quote.message}</p>
              )}
            </div>
          )}

          {quote.status === 'pending' && (
            <div className="mt-4 flex gap-2 border-t pt-4">
              <Button
                size="sm"
                onClick={() => setSelectedQuote(quote)}
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                Responder Orçamento
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuoteStatus(quote.id, 'rejected')}
                className="flex items-center gap-1"
              >
                <XCircle className="h-4 w-4" />
                Recusar
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Feedback 
        type="error" 
        message={error}
        className="mx-auto mt-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'pending' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pending')}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              Pendentes ({statusCounts.pending})
            </Button>
            <Button
              variant={activeTab === 'quoted' ? 'default' : 'outline'}
              onClick={() => setActiveTab('quoted')}
              className="flex items-center gap-1"
            >
              <MessageSquare className="h-4 w-4" />
              Respondidos ({statusCounts.quoted})
            </Button>
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
            <Button
              size="sm"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              Todos
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'accepted' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('accepted')}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Aprovados ({statusCounts.accepted})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'rejected' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('rejected')}
              className="flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" />
              Recusados ({statusCounts.rejected})
            </Button>
          </div>
        )}
      </Card>

      <div className="space-y-4">
        {filteredQuotes.map(quote => renderQuoteCard(quote))}
      </div>

      {selectedQuote && (
        <QuoteResponseModal
          quote={selectedQuote}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}