import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Package, MessageSquare, Clock, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MachineList } from './machines/machine-list';
import { MyQuotes } from './quotes/my-quotes';
import { MyRentals } from './rentals/my-rentals';
import { getQuotesByRequester } from '@/lib/quotes';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types/auth';
import type { Machine } from '@/types';
import type { Quote } from '@/types/quote';

interface RenterDashboardProps {
  user: UserProfile;
}

type ActiveView = 'overview' | 'machines' | 'quotes' | 'rentals' | 'profile';

export function RenterDashboard({ user }: RenterDashboardProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [machines, setMachines] = useState<Machine[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load all machines without any filter
        const machinesRef = collection(db, 'machines');
        const machinesSnapshot = await getDocs(machinesRef);
        const machinesData = machinesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Machine[];
        setMachines(machinesData);

        // Load quotes with proper date conversion
        const quotesRef = collection(db, 'quotes');
        const quotesQuery = query(
          quotesRef,
          where('requesterId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const quotesSnapshot = await getDocs(quotesQuery);
        const quotesData = quotesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          };
        }) as Quote[];
        setQuotes(quotesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user.uid]);

  const stats = {
    totalRequests: quotes.length,
    pendingQuotes: quotes.filter(q => q.status === 'pending' || q.status === 'quoted').length,
    activeRentals: quotes.filter(q => 
      ['accepted', 'in_preparation', 'in_transit', 'delivered', 'return_requested', 'return_in_transit']
      .includes(q.status)
    ).length
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Olá, {user.fullName}</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">Gerencie seus aluguéis e orçamentos</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Button 
            variant="outline"
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-2 text-sm"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Painel Inicial</span>
            <span className="sm:hidden">Painel</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-sm"
          >
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Editar Perfil</span>
            <span className="sm:hidden">Perfil</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={() => setActiveView('machines')}
          className={`rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md ${
            activeView === 'machines' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-2 sm:p-3">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-4 text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Máquinas Disponíveis</p>
              <p className="text-lg sm:text-2xl font-semibold">{machines.length}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveView('quotes')}
          className={`rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md ${
            activeView === 'quotes' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-2 sm:p-3">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-4 text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Orçamentos</p>
              <p className="text-lg sm:text-2xl font-semibold">{stats.pendingQuotes}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveView('rentals')}
          className={`rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md ${
            activeView === 'rentals' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-2 sm:p-3">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="ml-4 text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Minhas Locações</p>
              <p className="text-lg sm:text-2xl font-semibold">{stats.activeRentals}</p>
            </div>
          </div>
        </button>
      </div>

      {activeView === 'overview' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <h2 className="mb-4 text-base sm:text-lg font-semibold">Bem-vindo ao seu Painel</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Aqui você pode gerenciar seus aluguéis, ver orçamentos e encontrar novas máquinas.
          </p>
        </div>
      )}

      {activeView === 'machines' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <h2 className="mb-4 text-base sm:text-lg font-semibold">Máquinas Disponíveis</h2>
          <div className="overflow-x-auto">
            <MachineList 
              machines={machines} 
              loading={loading}
              onMachineClick={(machine) => navigate(`/machines/${machine.id}`)}
              showActions={false}
            />
          </div>
        </div>
      )}

      {activeView === 'quotes' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <h2 className="mb-4 text-base sm:text-lg font-semibold">Orçamentos</h2>
          <MyQuotes userId={user.uid} />
        </div>
      )}

      {activeView === 'rentals' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <h2 className="mb-4 text-base sm:text-lg font-semibold">Minhas Locações</h2>
          <MyRentals userId={user.uid} />
        </div>
      )}
    </div>
  );
}