import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Users, Package, ChevronRight, Home, UserCircle, Truck, BarChart } from 'lucide-react';
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
import { ReportsPanel } from './reports/reports-panel';
import { getMachinesByOwner } from '@/lib/machines';
import { getQuotesByOwner } from '@/lib/quotes';
import type { UserProfile } from '@/types/auth';
import type { Machine } from '@/types';
import type { Quote } from '@/types/quote';

interface OwnerDashboardProps {
  user: UserProfile;
}

type ActiveView = 'overview' | 'machines' | 'quotes' | 'approved' | 'pickups' | 'financial' | 'reports' | null;

export function OwnerDashboard({ user }: OwnerDashboardProps) {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('overview');

  useEffect(() => {
    async function loadData() {
      if (!user?.uid) return;

      try {
        const [machinesData, quotesData] = await Promise.all([
          getMachinesByOwner(user.uid),
          getQuotesByOwner(user.uid)
        ]);
        
        setMachines(machinesData);
        setQuotes(quotesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const stats = {
    totalMachines: machines.length,
    activeQuotes: quotes.filter(q => q.status === 'pending' || q.status === 'quoted').length,
    approvedQuotes: quotes.filter(q => q.status === 'accepted').length,
    pickupRequests: quotes.filter(q => 
      q.status === 'return_requested' && 
      q.returnType === 'pickup'
    ).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user.fullName}</h1>
          <p className="mt-1 text-gray-600">Gerencie suas máquinas e solicitações</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Painel Geral
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2"
          >
            <UserCircle className="h-4 w-4" />
            Editar Perfil
          </Button>
          <Button onClick={() => navigate('/machines/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Máquina
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div 
          className="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          onClick={() => setActiveView('machines')}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600">Total de Máquinas</p>
          <p className="mt-1 text-2xl font-semibold">{stats.totalMachines}</p>
        </div>

        <div 
          className="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          onClick={() => setActiveView('quotes')}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600">Orçamentos Ativos</p>
          <p className="mt-1 text-2xl font-semibold">{stats.activeQuotes}</p>
        </div>

        <div 
          className="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          onClick={() => setActiveView('approved')}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600">Orçamentos Aprovados</p>
          <p className="mt-1 text-2xl font-semibold">{stats.approvedQuotes}</p>
        </div>

        <div 
          className="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          onClick={() => setActiveView('pickups')}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-orange-100 p-3">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600">Solicitações de Coleta</p>
          <p className="mt-1 text-2xl font-semibold">{stats.pickupRequests}</p>
        </div>

        <div 
          className="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          onClick={() => setActiveView('reports')}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-indigo-100 p-3">
              <BarChart className="h-6 w-6 text-indigo-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600">Relatórios</p>
          <p className="mt-1 text-2xl font-semibold">Ver Análises</p>
        </div>
      </div>

      {activeView === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Receita Mensal</h2>
            <RevenueChart quotes={quotes} />
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <TopMachines machines={machines} quotes={quotes} />
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Atividade Recente</h2>
              <RecentActivity quotes={quotes} />
            </div>
          </div>
        </div>
      )}

      {activeView === 'machines' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Minhas Máquinas</h2>
          <MachineTable 
            machines={machines} 
            loading={loading}
          />
        </div>
      )}

      {activeView === 'quotes' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Orçamentos</h2>
          <OwnerQuotes userId={user.uid} />
        </div>
      )}

      {activeView === 'approved' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Orçamentos Aprovados</h2>
          <ApprovedQuotes userId={user.uid} />
        </div>
      )}

      {activeView === 'pickups' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Solicitações de Coleta</h2>
          <PickupRequests userId={user.uid} />
        </div>
      )}

      {activeView === 'financial' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <FinancialPanel quotes={quotes} />
        </div>
      )}

      {activeView === 'reports' && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <ReportsPanel quotes={quotes} />
        </div>
      )}
    </div>
  );
}