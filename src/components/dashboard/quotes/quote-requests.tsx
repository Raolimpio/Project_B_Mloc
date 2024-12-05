import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface QuoteRequest {
  id: string;
  machineId: string;
  requesterId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  requesterName: string;
  machineName: string;
  message: string;
}

interface QuoteRequestsProps {
  userId: string;
}

export function QuoteRequests({ userId }: QuoteRequestsProps) {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      try {
        const requestsRef = collection(db, 'quotes');
        const q = query(
          requestsRef,
          where('ownerId', '==', userId),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const quotesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as QuoteRequest[];

        setRequests(quotesData);
      } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [userId]);

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

  if (requests.length === 0) {
    return (
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">Nenhuma solicitação pendente</h3>
        <p className="mt-1 text-gray-500">
          Quando você receber novas solicitações de orçamento, elas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{request.requesterName}</h3>
              <p className="text-sm text-gray-500">{request.machineName}</p>
            </div>
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
              Pendente
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{request.message}</p>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="flex-1">
              Recusar
            </Button>
            <Button className="flex-1">
              Enviar Orçamento
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}