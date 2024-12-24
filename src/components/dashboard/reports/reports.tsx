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
      console.log('Carregando orçamentos para:', userId);
      setLoading(true);
      const quotesData = await getQuotesByOwner(userId);
      console.log('Orçamentos carregados:', quotesData);
      
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

      console.log('Orçamentos com máquinas:', quotesWithMachines);
      setQuotes(quotesWithMachines);
    } catch (error) {
      console.error('Error loading quotes:', error);
      setError('Não foi possível carregar os orçamentos');
    } finally {
      setLoading(false);
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    if (!quote.createdAt) return false;
    
    const quoteDate = quote.createdAt instanceof Date 
      ? quote.createdAt 
      : new Date(quote.createdAt);
      
    if (isNaN(quoteDate.getTime())) return false;
    
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

  // Apenas orçamentos finalizados (aceitos e entregues)
  const completedQuotes = filteredQuotes.filter(q => 
    ['delivered', 'return_requested', 'pickup_scheduled', 'return_in_transit', 'completed'].includes(q.status)
  );

  const totalValue = completedQuotes.reduce((sum, quote) => {
    const value = typeof quote.value === 'number' ? quote.value : 0;
    return sum + value;
  }, 0);
  
  const totalQuotes = completedQuotes.length;
  const activeQuotes = filteredQuotes.filter(q => 
    ['accepted', 'in_preparation', 'in_transit'].includes(q.status)
  ).length;
  const pendingQuotes = filteredQuotes.filter(q => 
    ['pending', 'quoted'].includes(q.status)
  ).length;

  // Agrupar por máquina
  const machineStats = filteredQuotes.reduce((acc, quote) => {
    if (!quote.machineId) return acc;
    
    if (!acc[quote.machineId]) {
      acc[quote.machineId] = {
        id: quote.machineId,
        name: quote.machineName,
        photo: quote.machine?.fotoPrincipal,
        totalRentals: 0,
        totalValue: 0,
        lastRental: null as Date | null
      };
    }

    const stats = acc[quote.machineId];
    
    if (['delivered', 'completed'].includes(quote.status)) {
      stats.totalRentals++;
      stats.totalValue += quote.value || 0;
    }

    const quoteDate = quote.createdAt instanceof Date 
      ? quote.createdAt 
      : new Date(quote.createdAt);

    if (!stats.lastRental || quoteDate > stats.lastRental) {
      stats.lastRental = quoteDate;
    }

    return acc;
  }, {} as Record<string, {
    id: string;
    name: string;
    photo?: string;
    totalRentals: number;
    totalValue: number;
    lastRental: Date | null;
  }>);

  const topMachines = Object.values(machineStats)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

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
    return (
      <Feedback
        type="error"
        title="Erro ao carregar relatórios"
        message={error}
        className="mx-auto max-w-2xl"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Relatórios e Análises</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant={dateFilter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setDateFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant={dateFilter === 'last7days' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setDateFilter('last7days')}
          >
            7 dias
          </Button>
          <Button 
            variant={dateFilter === 'last30days' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setDateFilter('last30days')}
          >
            30 dias
          </Button>
          <Button 
            variant={dateFilter === 'last90days' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setDateFilter('last90days')}
          >
            90 dias
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Visão Geral</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Aluguéis</span>
              <span className="font-medium">{totalQuotes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Aluguéis Ativos</span>
              <span className="font-medium">{activeQuotes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Orçamentos Pendentes</span>
              <span className="font-medium">{pendingQuotes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Receita Total</span>
              <span className="font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalValue)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="col-span-2 p-6">
          <h3 className="mb-4 text-lg font-semibold">Máquinas Mais Alugadas</h3>
          {topMachines.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum aluguel registrado neste período
            </p>
          ) : (
            <div className="space-y-4">
              {topMachines.map(machine => (
                <div key={machine.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                    {machine.photo ? (
                      <img
                        src={machine.photo}
                        alt={machine.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <MachineImageFallback className="h-full w-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{machine.name}</p>
                    <p className="text-sm text-gray-500">
                      {machine.totalRentals} {machine.totalRentals === 1 ? 'aluguel' : 'aluguéis'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(machine.totalValue)}
                    </p>
                    {machine.lastRental && (
                      <p className="text-sm text-gray-500">
                        Último: {format(machine.lastRental, "dd/MM/yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Exportar Relatório</h3>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </Card>
    </div>
  );
}
