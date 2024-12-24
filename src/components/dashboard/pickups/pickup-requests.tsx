import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { getQuotesByOwner, updateQuoteStatus } from '@/lib/quotes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Quote } from '@/types/quote';
import { MachineImageFallback } from '@/components/ui/machine-image-fallback';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { IMaquina } from '@/types/machine.types';
import { Card } from '@/components/ui/card';

interface PickupRequestsProps {
  userId: string;
}

interface QuoteWithMachine extends Quote {
  machine?: IMaquina;
}

type StatusFilter = 'all' | 'pending' | 'scheduled' | 'completed';

export function PickupRequests({ userId }: PickupRequestsProps) {
  const [requests, setRequests] = useState<QuoteWithMachine[]>([]);
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
      const filteredQuotes = quotesData.filter(quote => 
        ['return_requested', 'pickup_scheduled', 'return_in_transit', 'completed'].includes(quote.status)
      );

      // Carregar dados da máquina para cada solicitação
      const quotesWithMachines = await Promise.all(
        filteredQuotes.map(async (quote) => {
          try {
            const machineDoc = await getDoc(doc(db, 'machines', quote.machineId));
            if (machineDoc.exists()) {
              const machineData = machineDoc.data();
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
            return quote;
          } catch (error) {
            console.error('Error loading machine:', error);
            return quote;
          }
        })
      );

      setRequests(quotesWithMachines);
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
      await updateQuoteStatus(requestId, 'pickup_scheduled');
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
      await updateQuoteStatus(requestId, 'completed');
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
      case 'return_in_transit':
        return <MapPin className="h-4 w-4" />;
      case 'completed':
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
      case 'return_in_transit':
        return 'Em Trânsito';
      case 'completed':
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
      case 'return_in_transit':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
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
      return request.status === 'completed';
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
  const completedCount = requests.filter(r => r.status === 'completed').length;

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

      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-48 w-full sm:h-auto sm:w-48">
                {request.machine?.fotoPrincipal || request.machine?.fotos?.[0] ? (
                  <img
                    src={request.machine.fotoPrincipal || request.machine.fotos[0]}
                    alt={request.machineName}
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{request.requesterName}</h3>
                    <p className="text-sm text-gray-500">
                      {request.machineName}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {getStatusText(request.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data da Solicitação</p>
                    <p className="mt-1 text-sm">
                      {format(new Date(request.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Local</p>
                    <p className="mt-1 text-sm">{request.location}</p>
                  </div>
                </div>

                {request.returnNotes && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-medium text-gray-600">Observações</p>
                    <p className="mt-1 text-sm text-gray-600">{request.returnNotes}</p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {request.status === 'return_requested' && (
                    <Button
                      onClick={() => handleSchedulePickup(request.id)}
                      disabled={updatingRequest === request.id}
                      className="flex-1"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Agendar Coleta
                    </Button>
                  )}
                  {request.status === 'pickup_scheduled' && (
                    <Button
                      onClick={() => handleConfirmReturn(request.id)}
                      disabled={updatingRequest === request.id}
                      className="flex-1"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmar Devolução
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}