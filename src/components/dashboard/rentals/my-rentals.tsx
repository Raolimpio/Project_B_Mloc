import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, Truck, Package, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { ReturnModal } from './return-modal';
import { getQuotesByRequester, updateQuoteStatus } from '@/lib/quotes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Quote } from '@/types/quote';

interface MyRentalsProps {
  userId: string;
}

type StatusFilter = 'all' | 'active' | 'returned';

export function MyRentals({ userId }: MyRentalsProps) {
  const [rentals, setRentals] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [selectedRental, setSelectedRental] = useState<Quote | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    loadRentals();
  }, [userId]);

  async function loadRentals() {
    try {
      const quotesData = await getQuotesByRequester(userId);
      setRentals(quotesData.filter(quote => 
        ['accepted', 'in_preparation', 'in_transit', 'delivered', 'return_requested', 'pickup_scheduled', 'returned'].includes(quote.status)
      ));
    } catch (error) {
      console.error('Error loading rentals:', error);
      setError('Não foi possível carregar seus aluguéis');
    } finally {
      setLoading(false);
    }
  }

  const handleReturn = (rental: Quote) => {
    setSelectedRental(rental);
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async (returnType: 'store' | 'pickup', notes?: string) => {
    if (!selectedRental) return;

    try {
      await updateQuoteStatus(selectedRental.id, 'return_requested', {
        returnType,
        returnNotes: notes,
        value: selectedRental.value,
      });
      await loadRentals();
      setShowReturnModal(false);
      setSelectedRental(null);
    } catch (error) {
      console.error('Error processing return:', error);
      setError('Não foi possível processar a devolução');
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
      case 'return_requested':
        return <Clock className="h-4 w-4" />;
      case 'returned':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
      case 'return_requested':
        return 'Devolução Solicitada';
      case 'pickup_scheduled':
        return 'Coleta Agendada';
      case 'returned':
        return 'Devolvido';
      default:
        return 'Status Desconhecido';
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
      case 'return_requested':
        return 'bg-orange-100 text-orange-800';
      case 'pickup_scheduled':
        return 'bg-indigo-100 text-indigo-800';
      case 'returned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRentals = rentals.filter(rental => {
    if (statusFilter === 'active') {
      return ['accepted', 'in_preparation', 'in_transit', 'delivered'].includes(rental.status);
    }
    if (statusFilter === 'returned') {
      return rental.status === 'returned';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando locações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Feedback type="error" message={error} className="my-4" />;
  }

  if (rentals.length === 0) {
    return (
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">Nenhuma locação encontrada</h3>
        <p className="mt-1 text-gray-500">
          Suas locações aparecerão aqui.
        </p>
      </div>
    );
  }

  const activeCount = rentals.filter(r => 
    ['accepted', 'in_preparation', 'in_transit', 'delivered'].includes(r.status)
  ).length;

  const returnedCount = rentals.filter(r => r.status === 'returned').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {filteredRentals.length} de {rentals.length} locações
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          Todas ({rentals.length})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'active' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('active')}
          className="flex items-center gap-1"
        >
          <Package className="h-4 w-4" />
          Ativas ({activeCount})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'returned' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('returned')}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          Devolvidas ({returnedCount})
        </Button>
      </div>

      <div className="space-y-4">
        {filteredRentals.map((rental) => (
          <div key={rental.id} className="flex overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="relative h-auto w-48">
              <img
                src={rental.machinePhoto}
                alt={rental.machineName}
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
                  <h3 className="font-medium">{rental.machineName}</h3>
                  <p className="text-sm text-gray-500">
                    Alugado em {format(rental.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(rental.status)}`}>
                  {getStatusIcon(rental.status)}
                  {getStatusText(rental.status)}
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Período</p>
                  <p className="mt-1 text-sm">
                    {format(new Date(rental.startDate), "dd/MM/yyyy")} até{' '}
                    {format(new Date(rental.endDate), "dd/MM/yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Local</p>
                  <p className="mt-1 text-sm">{rental.location}</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-600">Valor do Aluguel</p>
                <p className="mt-1 text-lg font-semibold">
                  R$ {rental.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                {rental.message && (
                  <p className="mt-2 text-sm text-gray-600">{rental.message}</p>
                )}
              </div>

              {rental.status === 'delivered' && (
                <div className="mt-4">
                  <Button
                    onClick={() => handleReturn(rental)}
                    className="w-full"
                  >
                    Solicitar Devolução
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showReturnModal && selectedRental && (
        <ReturnModal
          rental={selectedRental}
          onClose={() => setShowReturnModal(false)}
          onSubmit={handleReturnSubmit}
        />
      )}
    </div>
  );
}