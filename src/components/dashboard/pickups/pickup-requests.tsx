import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { getQuotesByOwner, updateQuoteStatus } from '@/lib/quotes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Quote } from '@/types/quote';

interface PickupRequestsProps {
  userId: string;
}

type StatusFilter = 'all' | 'pending' | 'scheduled' | 'completed';

export function PickupRequests({ userId }: PickupRequestsProps) {
  const [requests, setRequests] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [updatingRequest, setUpdatingRequest] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [userId]);

  async function loadRequests() {
    try {
      const quotesData = await getQuotesByOwner(userId);
      setRequests(quotesData.filter(quote => 
        quote.returnType === 'pickup' && 
        ['return_requested', 'pickup_scheduled', 'returned'].includes(quote.status)
      ));
    } catch (error) {
      console.error('Error loading pickup requests:', error);
      setError('Não foi possível carregar as solicitações de coleta');
    } finally {
      setLoading(false);
    }
  }

  const handleSchedulePickup = async (requestId: string) => {
    try {
      setUpdatingRequest(requestId);
      const request = requests.find(r => r.id === requestId);
      await updateQuoteStatus(requestId, 'pickup_scheduled', {
        value: request?.value,
      });
      await loadRequests();
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      setError('Não foi possível agendar a coleta');
    } finally {
      setUpdatingRequest(null);
    }
  };

  const handleConfirmReturn = async (requestId: string) => {
    try {
      setUpdatingRequest(requestId);
      const request = requests.find(r => r.id === requestId);
      await updateQuoteStatus(requestId, 'returned', {
        value: request?.value,
      });
      await loadRequests();
    } catch (error) {
      console.error('Error confirming return:', error);
      setError('Não foi possível confirmar a devolução');
    } finally {
      setUpdatingRequest(null);
    }
  };

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'return_requested':
        return <Clock className="h-4 w-4" />;
      case 'pickup_scheduled':
        return <Truck className="h-4 w-4" />;
      case 'returned':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: Quote['status']) => {
    switch (status) {
      case 'return_requested':
        return 'Coleta Solicitada';
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
      case 'return_requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'pickup_scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (statusFilter === 'pending') {
      return request.status === 'return_requested';
    }
    if (statusFilter === 'scheduled') {
      return request.status === 'pickup_scheduled';
    }
    if (statusFilter === 'completed') {
      return request.status === 'returned';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando solicitações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Feedback type="error" message={error} className="my-4" />;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">Nenhuma solicitação de coleta</h3>
        <p className="mt-1 text-gray-500">
          As solicitações de coleta aparecerão aqui.
        </p>
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'return_requested').length;
  const scheduledCount = requests.filter(r => r.status === 'pickup_scheduled').length;
  const completedCount = requests.filter(r => r.status === 'returned').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {filteredRequests.length} de {requests.length} solicitações
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          Todas ({requests.length})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'pending' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('pending')}
          className="flex items-center gap-1"
        >
          <Clock className="h-4 w-4" />
          Pendentes ({pendingCount})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'scheduled' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('scheduled')}
          className="flex items-center gap-1"
        >
          <Truck className="h-4 w-4" />
          Agendadas ({scheduledCount})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === 'completed' ? 'primary' : 'outline'}
          onClick={() => setStatusFilter('completed')}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          Concluídas ({completedCount})
        </Button>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="flex overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="relative h-auto w-48">
              <img
                src={request.machinePhoto}
                alt={request.machineName}
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
                  <h3 className="font-medium">{request.machineName}</h3>
                  <p className="text-sm text-gray-500">
                    Cliente: {request.requesterName}
                  </p>
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  {getStatusText(request.status)}
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Período do Aluguel</p>
                  <p className="mt-1 text-sm">
                    {format(new Date(request.startDate), "dd/MM/yyyy")} até{' '}
                    {format(new Date(request.endDate), "dd/MM/yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Local</p>
                  <p className="mt-1 text-sm">{request.location}</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-600">Valor do Aluguel</p>
                <p className="mt-1 text-lg font-semibold">
                  R$ {request.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                {request.returnNotes && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600">Observações</p>
                    <p className="text-sm text-gray-600">{request.returnNotes}</p>
                  </div>
                )}
              </div>

              {request.status === 'return_requested' && (
                <div className="mt-4">
                  <Button
                    onClick={() => handleSchedulePickup(request.id)}
                    disabled={updatingRequest === request.id}
                    className="w-full"
                  >
                    Agendar Coleta
                  </Button>
                </div>
              )}

              {request.status === 'pickup_scheduled' && (
                <div className="mt-4">
                  <Button
                    onClick={() => handleConfirmReturn(request.id)}
                    disabled={updatingRequest === request.id}
                    className="w-full"
                  >
                    Confirmar Devolução
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}