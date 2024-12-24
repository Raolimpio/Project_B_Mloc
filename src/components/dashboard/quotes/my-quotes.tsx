import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, Package, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { Card } from '@/components/ui/card';
import { subscribeToQuotes, updateQuoteStatus } from '@/lib/quotes';
import type { Quote } from '@/types/quote';
import { MachineImageFallback } from "@/components/ui/machine-image-fallback";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { IMaquina } from '@/types/machine.types';

interface MyQuotesProps {
  userId: string;
}

interface QuoteWithMachine extends Quote {
  machine?: IMaquina;
}

type TabType = 'pending' | 'responded' | 'approved';

const formatAddress = (location: any): string => {
  if (typeof location === 'string') return location;
  
  if (typeof location === 'object' && location !== null) {
    const address = location;
    return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''}, ${address.neighborhood}, ${address.city} - ${address.state}, CEP: ${address.zipCode}`;
  }
  
  return 'Endereço não disponível';
};

export function MyQuotes({ userId }: MyQuotesProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [quotes, setQuotes] = useState<QuoteWithMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingQuote, setUpdatingQuote] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToQuotes(userId, 'requester', async (quotesData) => {
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

  const handleQuoteAction = async (quoteId: string, status: 'accepted' | 'rejected') => {
    try {
      setUpdatingQuote(quoteId);
      await updateQuoteStatus(quoteId, status);
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
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Carregando orçamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Feedback type="error" message={error} className="my-4" />;
  }

  if (quotes.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Nenhum orçamento encontrado</h3>
        <p className="mt-2 text-center text-muted-foreground">
          Você ainda não solicitou nenhum orçamento.
        </p>
      </Card>
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
              <h3 className="text-lg font-semibold">{quote.machineName}</h3>
              <p className="text-sm text-muted-foreground">
                Solicitado em {quote.createdAt.toLocaleDateString()}
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

          {quote.status === 'quoted' && (
            <div className="mt-4 flex gap-2 border-t pt-4">
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
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
            className="flex items-center gap-1"
          >
            <Clock className="h-4 w-4" />
            Solicitados ({pendingQuotes.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'responded' ? 'default' : 'outline'}
            onClick={() => setActiveTab('responded')}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            Em Aprovação ({respondedQuotes.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'approved' ? 'default' : 'outline'}
            onClick={() => setActiveTab('approved')}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Finalizados ({finishedQuotes.length})
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {activeTab === 'pending' && pendingQuotes.map(renderQuoteCard)}
        {activeTab === 'responded' && respondedQuotes.map(renderQuoteCard)}
        {activeTab === 'approved' && finishedQuotes.map(renderQuoteCard)}
      </div>
    </div>
  );
}