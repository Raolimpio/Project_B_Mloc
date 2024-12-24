import { useState, useEffect } from 'react';
import { MessageSquare, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { Card } from '@/components/ui/card';
import { getQuotesByOwner } from '@/lib/quotes';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Quote } from '@/types/quote';
import type { IMaquina } from '@/types/machine.types';
import { MachineImageFallback } from '@/components/ui/machine-image-fallback';

interface ReportsProps {
  userId: string;
}

interface QuoteWithMachine extends Quote {
  machine?: IMaquina;
}

type DateFilter = 'all' | 'last7days' | 'last30days' | 'last90days';

export function Reports({ userId }: ReportsProps) {
  const [quotes, setQuotes] = useState<QuoteWithMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  useEffect(() => {
    loadQuotes();
  }, [userId]);

  async function loadQuotes() {
    try {
      const quotesData = await getQuotesByOwner(userId);
      
      // Carregar dados da máquina para cada orçamento
      const quotesWithMachines = await Promise.all(
        quotesData.map(async (quote) => {
          try {
            const machineDoc = await getDoc(doc(db, 'machines', quote.machineId));
            if (machineDoc.exists()) {
              const machineData = machineDoc.data();
              return {
                ...quote,
                machine: { 
                  id: machineDoc.id,
                  ...machineData,
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

      setQuotes(quotesWithMachines);
    } catch (error) {
      console.error('Error loading quotes:', error);
      setError('Não foi possível carregar os orçamentos');
    } finally {
      setLoading(false);
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const quoteDate = new Date(quote.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - quoteDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (dateFilter) {
      case 'last7days':
        return daysDiff <= 7;
      case 'last30days':
        return daysDiff <= 30;
      case 'last90days':
        return daysDiff <= 90;
      default:
        return true;
    }
  });

  const totalValue = filteredQuotes.reduce((sum, quote) => sum + (quote.value || 0), 0);
  const totalQuotes = filteredQuotes.length;
  const approvedQuotes = filteredQuotes.filter(q => q.status === 'approved').length;
  const pendingQuotes = filteredQuotes.filter(q => q.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando relatórios...</p>
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
          Os orçamentos aparecerão aqui quando você começar a criar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Relatório de Orçamentos</h2>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total de Orçamentos</p>
          <p className="mt-1 text-2xl font-semibold">{totalQuotes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Orçamentos Aprovados</p>
          <p className="mt-1 text-2xl font-semibold">{approvedQuotes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Orçamentos Pendentes</p>
          <p className="mt-1 text-2xl font-semibold">{pendingQuotes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Valor Total</p>
          <p className="mt-1 text-2xl font-semibold">
            R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={dateFilter === 'all' ? 'primary' : 'outline'}
          onClick={() => setDateFilter('all')}
        >
          Todos os períodos
        </Button>
        <Button
          size="sm"
          variant={dateFilter === 'last7days' ? 'primary' : 'outline'}
          onClick={() => setDateFilter('last7days')}
        >
          Últimos 7 dias
        </Button>
        <Button
          size="sm"
          variant={dateFilter === 'last30days' ? 'primary' : 'outline'}
          onClick={() => setDateFilter('last30days')}
        >
          Últimos 30 dias
        </Button>
        <Button
          size="sm"
          variant={dateFilter === 'last90days' ? 'primary' : 'outline'}
          onClick={() => setDateFilter('last90days')}
        >
          Últimos 90 dias
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredQuotes.map((quote) => (
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{quote.requesterName}</h3>
                    <p className="text-sm text-gray-500">{quote.machineName}</p>
                  </div>
                  <span className="text-lg font-semibold">
                    R$ {quote.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data do Orçamento</p>
                    <p className="mt-1 text-sm">
                      {format(new Date(quote.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="mt-1 text-sm capitalize">{quote.status}</p>
                  </div>
                </div>

                {quote.notes && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-medium text-gray-600">Observações</p>
                    <p className="mt-1 text-sm text-gray-600">{quote.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
