import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Package, MessageSquare, Clock, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MachineList } from './machines/machine-list';
import { MyQuotes } from './quotes/my-quotes';
import { MyRentals } from './rentals/my-rentals';
import { getQuotesByRequester } from '@/lib/quotes';
import { collection, getDocs } from 'firebase/firestore';
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
        // Load available machines
        const machinesRef = collection(db, 'machines');
        const machinesSnapshot = await getDocs(machinesRef);
        const machinesData = machinesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Machine[];
        setMachines(machinesData);

        // Load quotes
        const quotesData = await getQuotesByRequester(user.uid);
        setQuotes(quotesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user.uid]);

  // Calculate stats
  const activeQuotes = quotes.filter(q => q.status === 'pending' || q.status === 'quoted').length;
  const activeRentals = quotes.filter(q => 
    ['accepted', 'in_preparation', 'in_transit', 'delivered'].includes(q.status)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user.fullName}</h1>
          <p className="mt-1 text-gray-600">Gerencie seus aluguéis e orçamentos</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Painel Inicial
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2"
          >
            <UserCircle className="h-4 w-4" />
            Editar Perfil
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <button
          onClick={() => setActiveView('machines')}
          className={`rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md ${
            activeView === 'machines' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 text-left">
              <p className="text-sm font-medium text-gray-600">Máquinas Disponíveis</p>
              <p className="text-2xl font-semibold">{machines.length}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveView('quotes')}
          className={`rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md ${
            activeView === 'quotes' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4 text-left">
              <p className="text-sm font-medium text-gray-600">Orçamentos</p>
              <p className="text-2xl font-semibold">{activeQuotes}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveView('rentals')}
          className={`rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md ${
            activeView === 'rentals' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4 text-left">
              <p className="text-sm font-medium text-gray-600">Minhas Locações</p>
              <p className="text-2xl font-semibold">{activeRentals}</p>
            </div>
          </div>
        </button>
      </div>

      {activeView === 'overview' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Bem-vindo ao seu Painel</h2>
          <p className="text-gray-600">
            Aqui você pode gerenciar seus aluguéis, ver orçamentos e encontrar novas máquinas.
          </p>
        </div>
      )}

      {activeView === 'machines' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Máquinas Disponíveis</h2>
          <MachineList 
            machines={machines} 
            loading={loading}
            onMachineClick={(machine) => navigate(`/machines/${machine.id}`)}
            showActions={false}
          />
        </div>
      )}

      {activeView === 'quotes' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Orçamentos</h2>
          <MyQuotes userId={user.uid} />
        </div>
      )}

      {activeView === 'rentals' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Minhas Locações</h2>
          <MyRentals userId={user.uid} />
        </div>
      )}
    </div>
  );
}