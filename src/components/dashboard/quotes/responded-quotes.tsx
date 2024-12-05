import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface RespondedQuote {
  id: string;
  machineId: string;
  requesterId: string;
  status: 'approved' | 'rejected';
  createdAt: Date;
  respondedAt: Date;
  requesterName: string;
  machineName: string;
  message: string;
  response: {
    value: number;
    conditions: string;
    notes?: string;
  };
}

interface RespondedQuotesProps {
  userId: string;
}

export function RespondedQuotes({ userId }: RespondedQuotesProps) {
  const [quotes, setQuotes] = useState<RespondedQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuotes() {
      try {
        const quotesRef = collection(db, 'quotes');
        const q = query(
          quotesRef,
          where('ownerId', '==', userId),
          where('status', 'in', ['approved', 'rejected']),
          orderBy('respondedAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const quotesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          respondedAt: doc.data().respondedAt?.toDate(),
        })) as RespondedQuote[];

        setQuotes(quotesData);
      } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
      } finally {
        setLoading(false);
      }
    }

    loadQuotes();
  }, [userId]);

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

  if (quotes.length === 0) {
    return (
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">Nenhum orçamento respondido</h3>
        <p className="mt-1 text-gray-500">
          Os orçamentos que você responder aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div key={quote.id} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{quote.requesterName}</h3>
              <p className="text-sm text-gray-500">{quote.machineName}</p>
            </div>
            <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              quote.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {quote.status === 'approved' ? (
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

          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-600">Valor do Orçamento</p>
              <p className="text-lg font-semibold">
                R$ {quote.response.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Condições</p>
              <p className="text-sm text-gray-700">{quote.response.conditions}</p>
            </div>
            {quote.response.notes && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-600">Observações</p>
                <p className="text-sm text-gray-700">{quote.response.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-3 text-right text-sm text-gray-500">
            Respondido em {quote.respondedAt.toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}