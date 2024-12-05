import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { MachineForm } from '@/components/machines/machine-form';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Feedback } from '@/components/ui/feedback';
import { getMachine } from '@/lib/machines';
import { useAuth } from '@/contexts/auth-context';
import type { Machine } from '@/types';

export default function EditMachinePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMachine() {
      if (!id || !userProfile) return;

      try {
        const machineData = await getMachine(id);
        
        if (machineData.ownerId !== userProfile.uid) {
          setError('Você não tem permissão para editar esta máquina');
          return;
        }
        
        setMachine(machineData as Machine);
      } catch (error) {
        console.error('Erro ao carregar máquina:', error);
        setError('Erro ao carregar dados da máquina');
      } finally {
        setLoading(false);
      }
    }

    loadMachine();
  }, [id, userProfile]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Máquinas', href: '/dashboard?view=machines' },
    { label: machine?.name || 'Editar Máquina' }
  ];

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Carregando...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <Feedback type="error" message={error} />
            <Button
              onClick={() => navigate('/dashboard')}
              className="mt-4"
            >
              Voltar para Dashboard
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                Editar {machine?.name || 'Máquina'}
              </h1>
            </div>
          </div>

          {machine && <MachineForm machine={machine} />}
        </div>
      </main>
    </>
  );
}