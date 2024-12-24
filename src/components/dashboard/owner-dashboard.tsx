import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Users, Package, ChevronRight, Home, UserCircle, Truck, BarChart, Settings, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MachineTable } from './machines/machine-table';
import { OwnerQuotes } from './quotes/owner-quotes';
import { ApprovedQuotes } from './quotes/approved-quotes';
import { PickupRequests } from './pickups/pickup-requests';
import { StatsOverview } from './stats/stats-overview';
import { RevenueChart } from './stats/revenue-chart';
import { TopMachines } from './stats/top-machines';
import { RecentActivity } from './stats/recent-activity';
import { FinancialPanel } from './stats/financial-panel';
import { Reports } from './reports/reports'; // Alterado de ReportsPanel para Reports
import { CategoryManager } from './categories/category-manager';
import { SiteSettingsManager } from './site-settings/site-settings-manager';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types/auth';
import type { IMaquina } from '@/types/machine.types';
import type { Quote } from '@/types/quote';

interface OwnerDashboardProps {
  user: UserProfile;
}

type ActiveView = 'overview' | 'machines' | 'quotes' | 'approved' | 'pickups' | 'financial' | 'reports' | 'categories' | 'site-settings' | null;

export function OwnerDashboard({ user }: OwnerDashboardProps) {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<IMaquina[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [stats, setStats] = useState({
    totalMachines: 0,
    activeQuotes: 0,
    approvedQuotes: 0,
    pickupRequests: 0
  });

  useEffect(() => {
    async function loadData() {
      if (!user?.uid) return;

      try {
        setLoading(true);
        // Carregar máquinas do proprietário
        const machinesRef = collection(db, 'machines');
        const machinesQuery = query(machinesRef, where('proprietarioId', '==', user.uid));
        const machinesSnapshot = await getDocs(machinesQuery);
        const machinesData = machinesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as IMaquina[];
        setMachines(machinesData);

        // Carregar orçamentos
        const quotesRef = collection(db, 'quotes');
        const quotesQuery = query(quotesRef, where('ownerId', '==', user.uid));
        const quotesSnapshot = await getDocs(quotesQuery);
        const quotesData = quotesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          };
        }) as Quote[];

        console.log('Orçamentos carregados:', quotesData);
        setQuotes(quotesData);

        // Atualizar estatísticas
        setStats({
          totalMachines: machinesData.length,
          activeQuotes: quotesData.filter(q => ['pending', 'quoted'].includes(q.status)).length,
          approvedQuotes: quotesData.filter(q => ['accepted', 'in_preparation', 'in_transit'].includes(q.status)).length,
          pickupRequests: quotesData.filter(q => ['pickup_requested', 'return_requested'].includes(q.status)).length
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.uid]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Olá, {user.fullName}</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">Gerencie suas máquinas e solicitações</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Button 
            variant="outline"
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-2 text-sm"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Painel Geral</span>
            <span className="sm:hidden">Painel</span>
          </Button>

          <Button 
            variant="outline"
            onClick={() => setActiveView('categories')}
            className="flex items-center gap-2 text-sm"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Gerenciar Categorias</span>
            <span className="sm:hidden">Categorias</span>
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

          <Button 
            onClick={() => navigate('/machines/new')}
            className="flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Máquina</span>
            <span className="sm:hidden">Novo</span>
          </Button>

          <Button 
            variant="outline"
            onClick={() => setActiveView('site-settings')}
            className="flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Personalização</span>
            <span className="sm:hidden">Tema</span>
          </Button>
        </div>
      </div>

      {activeView !== 'categories' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div 
            className="cursor-pointer rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => setActiveView('machines')}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-blue-100 p-2 sm:p-3">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-gray-600">Total de Máquinas</p>
            <p className="mt-1 text-lg sm:text-2xl font-semibold">{stats.totalMachines}</p>
          </div>

          <div 
            className="cursor-pointer rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => setActiveView('quotes')}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-green-100 p-2 sm:p-3">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-gray-600">Orçamentos Ativos</p>
            <p className="mt-1 text-lg sm:text-2xl font-semibold">{stats.activeQuotes}</p>
          </div>

          <div 
            className="cursor-pointer rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => setActiveView('approved')}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-purple-100 p-2 sm:p-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-gray-600">Orçamentos Aprovados</p>
            <p className="mt-1 text-lg sm:text-2xl font-semibold">{stats.approvedQuotes}</p>
          </div>

          <div 
            className="cursor-pointer rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => setActiveView('pickups')}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-orange-100 p-2 sm:p-3">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-gray-600">Solicitações de Coleta</p>
            <p className="mt-1 text-lg sm:text-2xl font-semibold">{stats.pickupRequests}</p>
          </div>

          <div 
            className="cursor-pointer rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md col-span-2 sm:col-span-1"
            onClick={() => setActiveView('reports')}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-indigo-100 p-2 sm:p-3">
                <BarChart className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-gray-600">Relatórios</p>
            <p className="mt-1 text-lg sm:text-2xl font-semibold">Ver Análises</p>
          </div>
        </div>
      )}

      {activeView === 'overview' && (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
            <h2 className="mb-4 text-base sm:text-lg font-semibold">Receita Mensal</h2>
            <RevenueChart quotes={quotes} />
          </div>

          <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
            <TopMachines machines={machines} quotes={quotes} />
          </div>

          <div className="sm:col-span-2">
            <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
              <h2 className="mb-4 text-base sm:text-lg font-semibold">Atividade Recente</h2>
              <RecentActivity quotes={quotes} />
            </div>
          </div>
        </div>
      )}

      {activeView === 'machines' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <h2 className="mb-4 text-base sm:text-lg font-semibold">Minhas Máquinas</h2>
          <div className="overflow-x-auto">
            <MachineTable 
              machines={machines} 
              loading={loading}
            />
          </div>
        </div>
      )}

      {activeView === 'quotes' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <h2 className="mb-4 text-base sm:text-lg font-semibold">Orçamentos</h2>
          <OwnerQuotes userId={user.uid} />
        </div>
      )}

      {activeView === 'approved' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <h2 className="mb-4 text-base sm:text-lg font-semibold">Orçamentos Aprovados</h2>
          <ApprovedQuotes userId={user.uid} />
        </div>
      )}

      {activeView === 'pickups' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <h2 className="mb-4 text-base sm:text-lg font-semibold">Solicitações de Coleta</h2>
          <PickupRequests userId={user.uid} />
        </div>
      )}

      {activeView === 'financial' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <FinancialPanel quotes={quotes} />
        </div>
      )}

      {activeView === 'reports' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <Reports userId={user.uid} />
        </div>
      )}

      {activeView === 'categories' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <CategoryManager />
        </div>
      )}

      {activeView === 'site-settings' && (
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <SiteSettingsManager />
        </div>
      )}
    </div>
  );
}
