import { Box, Users, TrendingUp, Truck, BarChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';

export function StatsOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMachines: 0,
    activeQuotes: 0,
    approvedQuotes: 0,
    pickupRequests: 0
  });

  useEffect(() => {
    async function loadStats() {
      if (!user?.uid) return;

      try {
        // Buscar total de máquinas
        const machinesRef = collection(db, 'machines');
        const machinesQuery = query(machinesRef, where('proprietarioId', '==', user.uid));
        const machinesSnapshot = await getDocs(machinesQuery);
        const totalMachines = machinesSnapshot.docs.length;

        // Buscar todos os orçamentos do proprietário
        const quotesRef = collection(db, 'quotes');
        const allQuotesQuery = query(quotesRef, where('ownerId', '==', user.uid));
        const allQuotesSnapshot = await getDocs(allQuotesQuery);
        
        // Filtrar por status
        const quotes = allQuotesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Orçamentos ativos (pendentes + em andamento)
        const activeQuotes = quotes.filter(quote => 
          ['pending', 'quoted', 'accepted', 'in_preparation', 'in_transit'].includes(quote.status)
        ).length;

        // Orçamentos aprovados (aceitos + em andamento)
        const approvedQuotes = quotes.filter(quote => 
          ['accepted', 'in_preparation', 'in_transit', 'delivered'].includes(quote.status)
        ).length;

        // Solicitações de coleta (retorno + coleta inicial)
        const pickupRequests = quotes.filter(quote =>
          ['pickup_requested', 'return_requested'].includes(quote.status)
        ).length;

        setStats({
          totalMachines,
          activeQuotes,
          approvedQuotes,
          pickupRequests
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    }

    loadStats();
  }, [user?.uid]);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Box className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total de Máquinas</p>
            <p className="text-2xl font-semibold">{stats.totalMachines}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Orçamentos Ativos</p>
            <p className="text-2xl font-semibold">{stats.activeQuotes}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-purple-100 p-3">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Orçamentos Aprovados</p>
            <p className="text-2xl font-semibold">{stats.approvedQuotes}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-orange-100 p-3">
            <Truck className="h-5 w-5 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Solicitações de Coleta</p>
            <p className="text-2xl font-semibold">{stats.pickupRequests}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-full bg-indigo-100 p-3">
            <BarChart className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Relatórios</p>
            <p className="text-2xl font-semibold">Ver Análises</p>
          </div>
        </div>
      </div>
    </div>
  );
}